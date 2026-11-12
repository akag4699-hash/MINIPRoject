// ==============================================================================
// Case Management Module Controller
// ==============================================================================

const CasesModule = {
  cases: [],

  init() {
    this.setupListeners();
  },

  async load() {
    console.log('[CASES] Loading investigation cases...');
    await this.fetchCases();
  },

  async fetchCases() {
    const search = document.getElementById('caseSearchInput')?.value || '';
    const priority = document.getElementById('casePriorityFilter')?.value || 'All';
    const status = document.getElementById('caseStatusFilter')?.value || 'All';

    try {
      const res = await API.getCases({ search, priority, status });
      if (!res.success) return;

      this.cases = res.data;
      this.renderTable();
      this.updateCounters();
    } catch (err) {
      console.error('[CASES] Load error:', err);
    }
  },

  renderTable() {
    const tbody = document.getElementById('casesTableBody');
    if (!tbody) return;

    if (this.cases.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #94a3b8; padding: 30px;">No investigation cases match criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.cases.map(c => `
      <tr>
        <td><strong style="color: #38bdf8; font-family: var(--font-mono);">${c.case_id}</strong></td>
        <td>
          <strong>${c.case_title}</strong>
          ${c.fir_number ? `<br><small style="color: #94a3b8">Linked: ${c.fir_number}</small>` : ''}
        </td>
        <td><span class="format-tag">${c.crime_type}</span></td>
        <td><span class="entity-chip chip-suspect" style="padding: 2px 8px;"><i class="fa-solid fa-users"></i> ${c.suspects_count || 0}</span></td>
        <td>${c.assigned_officer}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 0.75rem; font-weight: 700;">${c.investigation_progress}%</span>
            <div class="progress-bar-container" style="width: 70px;">
              <div class="progress-bar-fill" style="width: ${c.investigation_progress}%"></div>
            </div>
          </div>
        </td>
        <td>
          <span class="priority-pill pill-${(c.priority || 'high').toLowerCase()}">${c.priority}</span>
        </td>
        <td>
          <span class="priority-pill ${this.getStatusClass(c.status)}">${c.status}</span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action" onclick="CasesModule.viewDetails('${c.id}')" title="Inspect Case">
              <i class="fa-solid fa-folder-open"></i>
            </button>
            <button class="btn-icon-action" onclick="CasesModule.openEditModal('${c.id}')" title="Update Progress">
              <i class="fa-solid fa-sliders"></i>
            </button>
            <button class="btn-icon-action" onclick="App.switchTab('network')" title="View Case Topology">
              <i class="fa-solid fa-diagram-project"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  getStatusClass(status) {
    if (status === 'Solved') return 'pill-low';
    if (status === 'Court Hearing') return 'pill-medium';
    if (status === 'Active') return 'pill-high';
    return 'pill-critical';
  },

  updateCounters() {
    const countEl = document.getElementById('casesCountBadge');
    if (countEl) countEl.textContent = `${this.cases.length} Active Dossiers`;
  },

  setupListeners() {
    // Search & Filters
    document.getElementById('caseSearchInput')?.addEventListener('input', () => this.fetchCases());
    document.getElementById('casePriorityFilter')?.addEventListener('change', () => this.fetchCases());
    document.getElementById('caseStatusFilter')?.addEventListener('change', () => this.fetchCases());

    // Create Case Modal
    document.getElementById('btnOpenCreateCaseModal')?.addEventListener('click', async () => {
      document.getElementById('createCaseForm')?.reset();
      const caseIdInput = document.getElementById('formCaseId');
      if (caseIdInput) caseIdInput.value = `CASE-2026-${Math.floor(100 + Math.random() * 900)}`;

      // Populate FIR dropdown
      const firSelect = document.getElementById('formCaseFirNumber');
      if (firSelect) {
        firSelect.innerHTML = `<option value="">-- Connect with Existing FIR (Optional) --</option>`;
        try {
          const res = await API.getFIRs();
          if (res.success) {
            res.data.forEach(f => {
              const opt = document.createElement('option');
              opt.value = f.fir_number;
              opt.textContent = `${f.fir_number} - ${f.crime_category} (${f.complainant_name})`;
              firSelect.appendChild(opt);
            });
          }
        } catch (e) {}
      }

      App.openModal('createCaseModal');
    });

    // Submit Create Case Form
    document.getElementById('createCaseForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        case_id: document.getElementById('formCaseId').value.trim(),
        case_title: document.getElementById('formCaseTitle').value.trim(),
        crime_type: document.getElementById('formCaseCrimeType').value,
        location: document.getElementById('formCaseLocation').value.trim(),
        assigned_officer: document.getElementById('formCaseOfficer').value.trim() || App.officer?.name || "Inspector Rajesh Sharma",
        priority: document.getElementById('formCasePriority').value,
        status: document.getElementById('formCaseStatus').value,
        investigation_progress: parseInt(document.getElementById('formCaseProgress').value) || 20,
        fir_number: document.getElementById('formCaseFirNumber').value,
        description: document.getElementById('formCaseDescription').value.trim()
      };

      try {
        const res = await API.createCase(payload);
        if (res.success) {
          App.showToast(`Case ${res.data.case_id} established successfully!`, 'success');
          App.closeModal('createCaseModal');
          this.fetchCases();
        }
      } catch (err) {
        App.showToast('Failed to create case: ' + err.message, 'error');
      }
    });

    // Submit Edit Progress Form
    document.getElementById('editCaseForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editCaseId').value;
      const payload = {
        investigation_progress: parseInt(document.getElementById('editCaseProgress').value) || 0,
        status: document.getElementById('editCaseStatus').value,
        priority: document.getElementById('editCasePriority').value
      };

      try {
        const res = await API.updateCase(id, payload);
        if (res.success) {
          App.showToast('Case investigation status updated!', 'success');
          App.closeModal('editCaseModal');
          this.fetchCases();
        }
      } catch (err) {
        App.showToast('Failed to update case: ' + err.message, 'error');
      }
    });
  },

  async viewDetails(id) {
    try {
      const res = await API.getCase(id);
      if (!res.success) return;
      const c = res.data;

      document.getElementById('viewCaseIdDisplay').textContent = c.case_id;
      document.getElementById('viewCaseTitle').textContent = c.case_title;
      document.getElementById('viewCaseCrimeType').textContent = c.crime_type;
      document.getElementById('viewCaseLocation').textContent = c.location;
      document.getElementById('viewCaseOfficer').textContent = c.assigned_officer;
      document.getElementById('viewCaseStatus').textContent = c.status;
      document.getElementById('viewCaseProgress').textContent = `${c.investigation_progress}%`;
      document.getElementById('viewCaseDescription').textContent = c.description || 'No narrative provided.';

      // Connected entities
      const entList = document.getElementById('viewCaseEntitiesList');
      if (entList) {
        if (c.entities && c.entities.length > 0) {
          entList.innerHTML = c.entities.map(e => `
            <span class="entity-chip chip-${e.entity_type}">
              <strong>${e.label || e.entity_value}</strong>
              <small>(${e.confidence}%)</small>
            </span>
          `).join('');
        } else {
          entList.innerHTML = `<span class="text-muted" style="font-size: 0.75rem;">No entities directly indexed. Run AI analysis to extract entities.</span>`;
        }
      }

      App.openModal('viewCaseModal');
    } catch (e) {
      App.showToast('Failed to load case details', 'error');
    }
  },

  openEditModal(id) {
    const c = this.cases.find(item => item.id === id);
    if (!c) return;

    document.getElementById('editCaseId').value = c.id;
    document.getElementById('editCaseTitleDisplay').textContent = `${c.case_id} - ${c.case_title}`;
    document.getElementById('editCaseProgress').value = c.investigation_progress;
    document.getElementById('editCaseStatus').value = c.status;
    document.getElementById('editCasePriority').value = c.priority;

    App.openModal('editCaseModal');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  CasesModule.init();
});
window.CasesModule = CasesModule;
