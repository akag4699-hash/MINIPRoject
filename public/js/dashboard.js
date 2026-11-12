// ==============================================================================
// Dashboard Controller (Dynamic KPIs, Chart.js, Mini-Graph & Alerts Feed)
// ==============================================================================

const DashboardModule = {
  charts: {},
  miniNetwork: null,

  async load() {
    console.log('[DASHBOARD] Loading metrics and analytics...');
    await Promise.all([
      this.loadKPIs(),
      this.loadRecentCases(),
      this.loadAlerts(),
      this.renderMiniNetwork()
    ]);
  },

  async loadKPIs() {
    try {
      const res = await API.getDashboardStats();
      if (!res.success) return;

      const { kpis, categoryDistribution, statusDistribution } = res.data;

      // Update KPI cards
      this.animateCounter('kpiActiveCases', kpis.totalActiveCases || 0);
      this.animateCounter('kpiTotalFIRs', kpis.totalFIRs || 0);
      this.animateCounter('kpiHighPriority', kpis.highPriorityCases || 0);
      this.animateCounter('kpiSuspects', kpis.totalSuspectsIdentified || 0);
      this.animateCounter('kpiNetworkConnections', kpis.criminalNetworkConnections || 0);
      this.animateCounter('kpiAIAnalyzed', kpis.casesAnalyzedByAI || 0);

      // Render Charts
      this.renderMonthlyTrendsChart();
      this.renderCategoryDoughnut(categoryDistribution);
      this.renderStatusChart(statusDistribution);

    } catch (err) {
      console.error('[DASHBOARD] KPI load error:', err);
    }
  },

  animateCounter(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let start = 0;
    const duration = 800;
    const stepTime = Math.abs(Math.floor(duration / (targetValue || 1)));

    const timer = setInterval(() => {
      start += 1;
      el.textContent = start;
      if (start >= targetValue) {
        el.textContent = targetValue;
        clearInterval(timer);
      }
    }, Math.max(stepTime, 20));
  },

  renderMonthlyTrendsChart() {
    const canvas = document.getElementById('monthlyTrendsChart');
    if (!canvas) return;

    if (this.charts.trends) this.charts.trends.destroy();

    const ctx = canvas.getContext('2d');
    this.charts.trends = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'],
        datasets: [
          {
            label: 'Extortion & Threat FIRs',
            data: [12, 19, 14, 25, 32, 28],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderWidth: 2,
            tension: 0.35,
            fill: true
          },
          {
            label: 'Cyber Financial Fraud',
            data: [24, 30, 28, 45, 52, 64],
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            borderWidth: 2,
            tension: 0.35,
            fill: true
          },
          {
            label: 'Organized Syndicate Cases',
            data: [8, 12, 11, 16, 22, 29],
            borderColor: '#f59e0b',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#94a3b8', font: { size: 11, family: 'Inter' } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(30, 58, 117, 0.3)' },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(30, 58, 117, 0.3)' },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          }
        }
      }
    });
  },

  renderCategoryDoughnut(categoryMap = {}) {
    const canvas = document.getElementById('categoryDoughnutChart');
    if (!canvas) return;

    if (this.charts.category) this.charts.category.destroy();

    const labels = Object.keys(categoryMap).length ? Object.keys(categoryMap) : [
      'Extortion & Threats', 'Cyber Financial Fraud', 'Darknet Narcotics', 'Corporate Espionage', 'Hawala Syndicate'
    ];
    const data = Object.keys(categoryMap).length ? Object.values(categoryMap) : [4, 6, 3, 2, 5];

    const ctx = canvas.getContext('2d');
    this.charts.category = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            '#ef4444', '#0284c7', '#8b5cf6', '#10b981', '#f59e0b', '#06b6d4', '#e11d48'
          ],
          borderColor: '#071536',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: { color: '#94a3b8', font: { size: 10 } }
          }
        },
        cutout: '65%'
      }
    });
  },

  renderStatusChart(statusMap = {}) {
    const canvas = document.getElementById('caseStatusChart');
    if (!canvas) return;

    if (this.charts.status) this.charts.status.destroy();

    const labels = Object.keys(statusMap).length ? Object.keys(statusMap) : ['Under Investigation', 'Active', 'Court Hearing', 'Solved'];
    const data = Object.keys(statusMap).length ? Object.values(statusMap) : [5, 4, 2, 3];

    const ctx = canvas.getContext('2d');
    this.charts.status = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Cases',
          data: data,
          backgroundColor: ['#f59e0b', '#0284c7', '#8b5cf6', '#10b981'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 10 } }
          },
          y: {
            grid: { color: 'rgba(30, 58, 117, 0.3)' },
            ticks: { color: '#94a3b8', stepSize: 1, font: { size: 10 } }
          }
        }
      }
    });
  },

  async loadRecentCases() {
    try {
      const res = await API.getRecentCases();
      const container = document.getElementById('dashboardRecentCasesTbody');
      if (!container) return;

      if (res.success && res.data && res.data.length > 0) {
        container.innerHTML = res.data.map(c => `
          <tr>
            <td><strong style="color: #38bdf8">${c.case_id}</strong></td>
            <td><strong>${c.case_title}</strong></td>
            <td><span class="format-tag">${c.crime_type}</span></td>
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
              <button class="btn-icon-action" onclick="App.switchTab('network')" title="View in Network Graph">
                <i class="fa-solid fa-diagram-project"></i>
              </button>
            </td>
          </tr>
        `).join('');
      } else {
        container.innerHTML = `<tr><td colspan="7" class="text-muted" style="text-align: center;">No cases recorded.</td></tr>`;
      }
    } catch (err) {
      console.error(err);
    }
  },

  async loadAlerts() {
    try {
      const res = await API.getAlerts();
      const container = document.getElementById('dashboardAlertsList');
      if (!container) return;

      if (res.success && res.data && res.data.length > 0) {
        container.innerHTML = res.data.slice(0, 4).map(alert => `
          <div class="alert-item priority-${(alert.priority || 'high').toLowerCase()}">
            <div class="alert-top">
              <span class="alert-title">${alert.title}</span>
              <span class="priority-pill pill-${(alert.priority || 'high').toLowerCase()}">${alert.priority}</span>
            </div>
            <p class="alert-desc">${alert.message}</p>
            <div class="alert-meta">Case: ${alert.case_number || 'Inter-Agency Alert'} &bull; ${new Date(alert.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        `).join('');
      }
    } catch (err) {
      console.error(err);
    }
  },

  async renderMiniNetwork() {
    const container = document.getElementById('dashboardMiniNetwork');
    if (!container || !window.vis) return;

    try {
      const res = await API.getNetwork();
      if (!res.success) return;

      const nodes = new vis.DataSet(res.data.nodes.slice(0, 10));
      const edges = new vis.DataSet(res.data.edges.slice(0, 12));

      const data = { nodes, edges };
      const options = {
        nodes: { shape: 'dot', size: 16, font: { color: '#ffffff', size: 10 } },
        edges: { width: 1.5, smooth: { type: 'continuous' } },
        physics: { stabilization: true, barnesHut: { gravitationalConstant: -1800, springLength: 80 } },
        interaction: { zoomView: false, dragView: true }
      };

      if (this.miniNetwork) this.miniNetwork.destroy();
      this.miniNetwork = new vis.Network(container, data, options);
    } catch (e) {
      console.warn('[DASHBOARD] Mini-network graph render:', e);
    }
  }
};

window.DashboardModule = DashboardModule;
