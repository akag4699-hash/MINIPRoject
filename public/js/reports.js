// ==============================================================================
// AI Reports Generator & Archive Controller
// ==============================================================================

const ReportsModule = {
  reports: [],

  init() {
    this.setupListeners();
  },

  async load() {
    console.log('[REPORTS] Loading reports catalog...');
    await this.fetchReports();
  },

  async fetchReports() {
    try {
      const res = await API.getReports();
      if (!res.success) return;

      this.reports = res.data;
      this.renderReportsList();
    } catch (e) {
      console.error('[REPORTS] Error:', e);
    }
  },

  renderReportsList() {
    const container = document.getElementById('reportsListContainer');
    if (!container) return;

    if (this.reports.length === 0) {
      container.innerHTML = `<p class="text-muted" style="text-align: center; padding: 20px;">No generated intelligence reports on record.</p>`;
      return;
    }

    container.innerHTML = this.reports.map(r => `
      <div class="chart-card" style="margin-bottom: 12px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #38bdf8; font-weight: 700;">${r.report_number}</span>
              <span class="format-tag">${r.report_type}</span>
            </div>
            <h4 style="font-size: 0.95rem; color: #ffffff;">${r.report_title}</h4>
            <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 4px;">
              Prepared by: <strong>${r.generated_by}</strong> &bull; Date: ${new Date(r.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-secondary" onclick="ReportsModule.viewReport('${r.id}')" style="padding: 6px 12px; font-size: 0.75rem;">
              <i class="fa-solid fa-file-lines"></i> View Dossier
            </button>
            <button class="btn-primary" onclick="ReportsModule.printReport('${r.id}')" style="padding: 6px 12px; font-size: 0.75rem;">
              <i class="fa-solid fa-file-pdf"></i> Export PDF
            </button>
          </div>
        </div>
      </div>
    `).join('');
  },

  setupListeners() {
    // Generate Report Modal
    document.getElementById('btnOpenGenerateReportModal')?.addEventListener('click', async () => {
      document.getElementById('generateReportForm')?.reset();

      // Populate case select
      const caseSelect = document.getElementById('reportTargetCase');
      if (caseSelect) {
        caseSelect.innerHTML = `<option value="">-- All Active Operations / Cross-Agency Briefing --</option>`;
        try {
          const res = await API.getCases();
          if (res.success) {
            res.data.forEach(c => {
              const opt = document.createElement('option');
              opt.value = c.id;
              opt.textContent = `${c.case_id}: ${c.case_title}`;
              caseSelect.appendChild(opt);
            });
          }
        } catch (e) {}
      }

      App.openModal('generateReportModal');
    });

    // Submit Generate Report
    document.getElementById('generateReportForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        report_title: document.getElementById('reportTitleInput').value.trim(),
        report_type: document.getElementById('reportTypeSelect').value,
        case_id: document.getElementById('reportTargetCase').value || null,
        additional_notes: document.getElementById('reportNotesInput').value.trim()
      };

      try {
        const res = await API.generateReport(payload);
        if (res.success) {
          App.showToast(`Report ${res.data.report_number} generated!`, 'success');
          App.closeModal('generateReportModal');
          this.fetchReports();
          this.viewReport(res.data.id);
        }
      } catch (err) {
        App.showToast('Failed to generate report: ' + err.message, 'error');
      }
    });
  },

  viewReport(id) {
    const report = this.reports.find(r => r.id === id);
    if (!report) return;

    document.getElementById('viewReportTitle').textContent = report.report_title;
    document.getElementById('viewReportNumber').textContent = report.report_number;
    document.getElementById('viewReportType').textContent = report.report_type;
    document.getElementById('viewReportAuthor').textContent = report.generated_by;
    document.getElementById('viewReportDate').textContent = new Date(report.created_at).toLocaleDateString('en-IN');
    document.getElementById('viewReportContent').textContent = report.summary_content;

    App.openModal('viewReportModal');
  },

  printReport(id) {
    this.viewReport(id);
    setTimeout(() => window.print(), 300);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  ReportsModule.init();
});
window.ReportsModule = ReportsModule;
