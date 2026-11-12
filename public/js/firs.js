// ==============================================================================
// FIR Management Module Controller
// ==============================================================================

const FIRsModule = {
  firs: [],

  init() {
    this.setupListeners();
  },

  async load() {
    console.log('[FIRS] Loading FIR records...');
    await this.fetchFIRs();
  },

  async fetchFIRs() {
    const search = document.getElementById('firSearchInput')?.value || '';
    const category = document.getElementById('firCategoryFilter')?.value || 'All';
    const status = document.getElementById('firStatusFilter')?.value || 'All';

    try {
      const res = await API.getFIRs({ search, category, status });
      if (!res.success) return;

      this.firs = res.data;
      this.renderTable();
      this.updateCounters();
    } catch (err) {
      console.error('[FIRS] Load error:', err);
    }
  },

  renderTable() {
    const tbody = document.getElementById('firsTableBody');
    if (!tbody) return;

    if (this.firs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #94a3b8; padding: 30px;">No FIR records match the search filter.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.firs.map(fir => `
      <tr>
        <td><strong style="color: #38bdf8; font-family: var(--font-mono);">${fir.fir_number}</strong></td>
        <td><strong>${fir.complainant_name}</strong></td>
        <td><span class="format-tag">${fir.crime_category}</span></td>
        <td><i class="fa-solid fa-location-dot" style="color: #ef4444; margin-right: 4px;"></i> ${fir.incident_location}</td>
        <td>${fir.incident_date}</td>
        <td>${fir.investigating_officer}</td>
        <td>
          <span class="priority-pill ${this.getStatusPillClass(fir.status)}">${fir.status}</span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action" onclick="FIRsModule.viewDetails('${fir.id}')" title="View Details">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-icon-action" onclick="FIRsModule.openEditModal('${fir.id}')" title="Edit Status">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-icon-action btn-icon-delete" onclick="FIRsModule.deleteFIR('${fir.id}')" title="Delete FIR">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  getStatusPillClass(status) {
    if (status === 'Closed' || status === 'Solved') return 'pill-low';
    if (status === 'Chargesheet Filed') return 'pill-medium';
    if (status === 'Under Investigation') return 'pill-high';
    return 'pill-critical';
  },

  updateCounters() {
    const totalEl = document.getElementById('firsCountBadge');
    if (totalEl) totalEl.textContent = `${this.firs.length} Records Registered`;
  },

  setupListeners() {
    // Search & Filter
    document.getElementById('firSearchInput')?.addEventListener('input', () => this.fetchFIRs());
    document.getElementById('firCategoryFilter')?.addEventListener('change', () => this.fetchFIRs());
    document.getElementById('firStatusFilter')?.addEventListener('change', () => this.fetchFIRs());

    // Register FIR Modal
    document.getElementById('btnOpenRegisterFIRModal')?.addEventListener('click', () => {
      document.getElementById('registerFIRForm')?.reset();
      // Auto-generate FIR number
      const numInput = document.getElementById('formFirNumber');
      if (numInput) numInput.value = `FIR-2026-IND-${Math.floor(1000 + Math.random() * 9000)}`;
      document.getElementById('formIncidentDate').value = new Date().toISOString().split('T')[0];
      App.openModal('registerFIRModal');
    });

    // Submit Register FIR Form
    document.getElementById('registerFIRForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        fir_number: document.getElementById('formFirNumber').value.trim(),
        complainant_name: document.getElementById('formComplainantName').value.trim(),
        crime_category: document.getElementById('formCrimeCategory').value,
        incident_location: document.getElementById('formIncidentLocation').value.trim(),
        incident_date: document.getElementById('formIncidentDate').value,
        description: document.getElementById('formFirDescription').value.trim(),
        investigating_officer: document.getElementById('formInvestigatingOfficer').value.trim() || App.officer?.name || "Inspector Rajesh Sharma",
        status: document.getElementById('formFirStatus').value,
        priority: document.getElementById('formFirPriority').value
      };

      try {
        const res = await API.createFIR(payload);
        if (res.success) {
          App.showToast(`FIR ${res.data.fir_number} registered successfully!`, 'success');
          App.closeModal('registerFIRModal');
          this.fetchFIRs();
        }
      } catch (err) {
        App.showToast('Failed to create FIR: ' + err.message, 'error');
      }
    });

    // Submit Edit FIR Form
    document.getElementById('editFIRForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editFirId').value;
      const payload = {
        status: document.getElementById('editFirStatus').value,
        priority: document.getElementById('editFirPriority').value,
        investigating_officer: document.getElementById('editFirOfficer').value
      };

      try {
        const res = await API.updateFIR(id, payload);
        if (res.success) {
          App.showToast('FIR record updated successfully!', 'success');
          App.closeModal('editFIRModal');
          this.fetchFIRs();
        }
      } catch (err) {
        App.showToast('Failed to update FIR: ' + err.message, 'error');
      }
    });
  },

  viewDetails(id) {
    const fir = this.firs.find(f => f.id === id);
    if (!fir) return;

    document.getElementById('viewFirNumber').textContent = fir.fir_number;
    document.getElementById('viewFirCategory').textContent = fir.crime_category;
    document.getElementById('viewFirComplainant').textContent = fir.complainant_name;
    document.getElementById('viewFirLocation').textContent = fir.incident_location;
    document.getElementById('viewFirDate').textContent = fir.incident_date;
    document.getElementById('viewFirOfficer').textContent = fir.investigating_officer;
    document.getElementById('viewFirStatus').textContent = fir.status;
    document.getElementById('viewFirDescription').textContent = fir.description;

    App.openModal('viewFIRModal');
  },

  openEditModal(id) {
    const fir = this.firs.find(f => f.id === id);
    if (!fir) return;

    document.getElementById('editFirId').value = fir.id;
    document.getElementById('editFirNumberDisplay').textContent = fir.fir_number;
    document.getElementById('editFirStatus').value = fir.status;
    document.getElementById('editFirPriority').value = fir.priority || 'High';
    document.getElementById('editFirOfficer').value = fir.investigating_officer;

    App.openModal('editFIRModal');
  },

  async deleteFIR(id) {
    const fir = this.firs.find(f => f.id === id);
    if (!confirm(`Are you sure you want to permanently delete record ${fir ? fir.fir_number : ''}? This action is irreversible.`)) {
      return;
    }

    try {
      const res = await API.deleteFIR(id);
      if (res.success) {
        App.showToast('FIR deleted successfully', 'info');
        this.fetchFIRs();
      }
    } catch (err) {
      App.showToast('Failed to delete FIR: ' + err.message, 'error');
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  FIRsModule.init();
});
window.FIRsModule = FIRsModule;
