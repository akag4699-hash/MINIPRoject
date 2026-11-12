// ==============================================================================
// Criminal Network Interactive Graph Controller (vis-network.js)
// ==============================================================================

const NetworkModule = {
  network: null,
  allNodes: [],
  allEdges: [],
  nodesDataSet: null,
  edgesDataSet: null,
  selectedEntity: null,
  physicsEnabled: true,

  init() {
    this.setupControls();
  },

  async load() {
    console.log('[NETWORK] Initializing Vis-Network graph...');
    await this.fetchNetworkData();
  },

  async fetchNetworkData(caseId = '', entityType = 'all', search = '') {
    try {
      const res = await API.getNetwork({ case_id: caseId, entity_type: entityType, search });
      if (!res.success) return;

      this.allNodes = res.data.nodes;
      this.allEdges = res.data.edges;

      this.renderGraph();
      this.populateCaseFilter();

      // Update counters
      const counterEl = document.getElementById('networkStatsSummary');
      if (counterEl) {
        counterEl.textContent = `${this.allNodes.length} Entities & ${this.allEdges.length} Verified/Inferred Links`;
      }
    } catch (e) {
      console.error('[NETWORK] Load error:', e);
    }
  },

  renderGraph() {
    const container = document.getElementById('visNetworkContainer');
    if (!container || !window.vis) return;

    this.nodesDataSet = new vis.DataSet(this.allNodes);
    this.edgesDataSet = new vis.DataSet(this.allEdges);

    const data = {
      nodes: this.nodesDataSet,
      edges: this.edgesDataSet
    };

    const options = {
      nodes: {
        shape: 'box',
        margin: 10,
        font: {
          color: '#ffffff',
          size: 12,
          face: 'Inter, sans-serif'
        },
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.6)',
          size: 8,
          x: 2,
          y: 2
        }
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 0.8 }
        },
        font: {
          color: '#94a3b8',
          size: 10,
          face: 'Inter, sans-serif',
          background: '#071536'
        },
        smooth: {
          type: 'cubicBezier',
          forceDirection: 'none',
          roundness: 0.2
        }
      },
      physics: {
        enabled: this.physicsEnabled,
        barnesHut: {
          gravitationalConstant: -3500,
          centralGravity: 0.3,
          springLength: 120,
          springConstant: 0.04,
          damping: 0.09
        },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 150,
        selectable: true,
        multiselect: false,
        navigationButtons: false,
        keyboard: true
      }
    };

    if (this.network) this.network.destroy();
    this.network = new vis.Network(container, data, options);

    // Event listeners on graph
    this.network.on('click', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        this.openEntityInspector(nodeId);
      } else {
        this.closeEntityInspector();
      }
    });

    this.network.on('doubleClick', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        this.network.focus(params.nodes[0], { scale: 1.4, animation: true });
      }
    });
  },

  setupControls() {
    // Zoom In
    document.getElementById('netZoomInBtn')?.addEventListener('click', () => {
      if (!this.network) return;
      const scale = this.network.getScale();
      this.network.moveTo({ scale: scale * 1.25, animation: true });
    });

    // Zoom Out
    document.getElementById('netZoomOutBtn')?.addEventListener('click', () => {
      if (!this.network) return;
      const scale = this.network.getScale();
      this.network.moveTo({ scale: scale * 0.8, animation: true });
    });

    // Fit
    document.getElementById('netFitBtn')?.addEventListener('click', () => {
      this.network?.fit({ animation: true });
    });

    // Toggle Physics
    const physicsBtn = document.getElementById('netPhysicsBtn');
    physicsBtn?.addEventListener('click', () => {
      this.physicsEnabled = !this.physicsEnabled;
      this.network?.setOptions({ physics: { enabled: this.physicsEnabled } });
      physicsBtn.classList.toggle('active', this.physicsEnabled);
      App.showToast(`Physics force simulation ${this.physicsEnabled ? 'enabled' : 'stabilized/frozen'}`);
    });

    // Filter by Entity Type
    document.getElementById('netEntityTypeFilter')?.addEventListener('change', (e) => {
      const type = e.target.value;
      const caseId = document.getElementById('netCaseFilter')?.value || '';
      const search = document.getElementById('netSearchInput')?.value || '';
      this.fetchNetworkData(caseId, type, search);
    });

    // Filter by Case
    document.getElementById('netCaseFilter')?.addEventListener('change', (e) => {
      const caseId = e.target.value;
      const type = document.getElementById('netEntityTypeFilter')?.value || 'all';
      const search = document.getElementById('netSearchInput')?.value || '';
      this.fetchNetworkData(caseId, type, search);
    });

    // Search input
    document.getElementById('netSearchInput')?.addEventListener('input', (e) => {
      const val = e.target.value.trim().toLowerCase();
      if (!val) {
        this.nodesDataSet?.update(this.allNodes);
        return;
      }
      const matched = this.allNodes.filter(n => (n.label || '').toLowerCase().includes(val));
      if (matched.length > 0) {
        this.network?.focus(matched[0].id, { scale: 1.3, animation: true });
      }
    });

    // Inspector Close
    document.getElementById('inspectorCloseBtn')?.addEventListener('click', () => {
      this.closeEntityInspector();
    });

    // Verify Action button inside inspector
    document.getElementById('btnVerifyEntityInInspector')?.addEventListener('click', async () => {
      if (!this.selectedEntity) return;
      try {
        const res = await API.verifyItem('entity', this.selectedEntity.id);
        if (res.success) {
          App.showToast(`Entity '${this.selectedEntity.label}' marked as VERIFIED by Officer`, 'success');
          this.openEntityInspector(this.selectedEntity.id);
          this.fetchNetworkData();
        }
      } catch (err) {
        App.showToast('Verification failed: ' + err.message, 'error');
      }
    });
  },

  async openEntityInspector(nodeId) {
    const nodeObj = this.allNodes.find(n => n.id === nodeId);
    if (!nodeObj) return;

    this.selectedEntity = nodeObj.data;
    const panel = document.getElementById('entityInspectorPanel');
    if (!panel) return;

    panel.classList.add('open');

    // Fill details
    const e = this.selectedEntity;
    const typeBadge = document.getElementById('inspEntityType');
    if (typeBadge) {
      typeBadge.textContent = e.entity_type;
      typeBadge.className = `inspector-entity-type type-badge-${e.entity_type}`;
    }

    document.getElementById('inspEntityName').textContent = e.label || e.entity_value;
    document.getElementById('inspConfidenceNum').textContent = `${e.confidence || 85}%`;
    const confFill = document.getElementById('inspConfidenceFill');
    if (confFill) confFill.style.width = `${e.confidence || 85}%`;

    // Verification banner
    const verifBanner = document.getElementById('inspVerificationBanner');
    const verifBtn = document.getElementById('btnVerifyEntityInInspector');
    if (verifBanner) {
      if (e.is_verified) {
        verifBanner.className = 'verification-status-banner status-verified';
        verifBanner.innerHTML = `<span><i class="fa-solid fa-badge-check"></i> CONFIRMED BY OFFICER</span>`;
        if (verifBtn) verifBtn.classList.add('d-none');
      } else {
        verifBanner.className = 'verification-status-banner status-unverified';
        verifBanner.innerHTML = `<span><i class="fa-solid fa-triangle-exclamation"></i> AI INFERRED (UNVERIFIED)</span>`;
        if (verifBtn) verifBtn.classList.remove('d-none');
      }
    }

    // Metadata
    const metaGrid = document.getElementById('inspMetadataGrid');
    if (metaGrid) {
      const meta = e.metadata || {};
      metaGrid.innerHTML = `
        <div class="meta-row"><span class="meta-key">Risk Rating:</span><span class="meta-val" style="color: ${e.risk_level === 'critical' ? '#f87171' : '#38bdf8'}">${(e.risk_level || 'medium').toUpperCase()}</span></div>
        <div class="meta-row"><span class="meta-key">Raw Identifier:</span><span class="meta-val">${e.entity_value}</span></div>
        ${meta.alias ? `<div class="meta-row"><span class="meta-key">Alias / Handle:</span><span class="meta-val">${meta.alias}</span></div>` : ''}
        ${meta.role ? `<div class="meta-row"><span class="meta-key">Syndicate Role:</span><span class="meta-val">${meta.role}</span></div>` : ''}
        ${meta.status ? `<div class="meta-row"><span class="meta-key">Police Status:</span><span class="meta-val">${meta.status}</span></div>` : ''}
        ${meta.tower ? `<div class="meta-row"><span class="meta-key">Cell Tower Log:</span><span class="meta-val">${meta.tower}</span></div>` : ''}
      `;
    }

    // Connected edges / relationships
    const connList = document.getElementById('inspConnectionsList');
    if (connList) {
      const connectedEdges = this.allEdges.filter(edge => edge.from === nodeId || edge.to === nodeId);
      connList.innerHTML = connectedEdges.map(edge => {
        const isFrom = edge.from === nodeId;
        const otherId = isFrom ? edge.to : edge.from;
        const otherNode = this.allNodes.find(n => n.id === otherId);
        const r = edge.data || {};

        return `
          <div class="connection-item">
            <div class="connection-top">
              <span class="connection-type-badge">${edge.label}</span>
              <span style="font-size: 0.68rem; color: #94a3b8;">${r.confidence || 80}% conf</span>
            </div>
            <div class="connection-target">
              <i class="fa-solid fa-arrow-turn-down-right" style="font-size: 0.7rem; color: #38bdf8;"></i>
              ${otherNode ? otherNode.label : otherId}
            </div>
            ${r.source_text ? `<div class="connection-evidence">"${r.source_text}"</div>` : ''}
          </div>
        `;
      }).join('');
    }
  },

  closeEntityInspector() {
    document.getElementById('entityInspectorPanel')?.classList.remove('open');
    this.selectedEntity = null;
  },

  async populateCaseFilter() {
    try {
      const res = await API.getCases();
      const select = document.getElementById('netCaseFilter');
      if (!select || select.children.length > 1) return;

      if (res.success && res.data) {
        res.data.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = `${c.case_id}: ${c.case_title.substring(0, 32)}...`;
          select.appendChild(opt);
        });
      }
    } catch (e) {
      //
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  NetworkModule.init();
});
window.NetworkModule = NetworkModule;
