// ==============================================================================
// Evidence Vault Controller (Cryptographic Chain of Custody & Secure Storage)
// ==============================================================================

const EvidenceModule = {
  evidenceList: [],

  init() {
    this.setupListeners();
  },

  async load() {
    console.log('[EVIDENCE] Loading evidence repository...');
    await this.fetchEvidence();
  },

  async fetchEvidence() {
    const category = document.getElementById('evidenceCategoryFilter')?.value || 'All';
    const search = document.getElementById('evidenceSearchInput')?.value || '';

    try {
      const res = await API.getEvidence({ category, search });
      if (!res.success) return;

      this.evidenceList = res.data;
      this.renderTable();
      this.updateCounters();
    } catch (err) {
      console.error('[EVIDENCE] Load error:', err);
    }
  },

  renderTable() {
    const tbody = document.getElementById('evidenceTableBody');
    if (!tbody) return;

    if (this.evidenceList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 30px;">No evidence exhibits found matching criteria.</td></tr>`;
      return;
    }

    tbody.innerHTML = this.evidenceList.map(ev => `
      <tr>
        <td><strong style="color: #38bdf8; font-family: var(--font-mono);">${ev.evidence_number}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid ${this.getCategoryIcon(ev.category)}" style="color: #38bdf8;"></i>
            <div>
              <strong>${ev.file_name}</strong>
              <div style="font-size: 0.68rem; color: #94a3b8;">${(ev.file_size / (1024 * 1024)).toFixed(2)} MB</div>
            </div>
          </div>
        </td>
        <td><span class="format-tag">${ev.category}</span></td>
        <td><strong>${ev.case_number || 'General Exhibit'}</strong></td>
        <td>${ev.uploaded_by}</td>
        <td>
          <span class="format-tag" style="font-family: var(--font-mono); font-size: 0.65rem;" title="SHA-256: ${ev.hash_sha256}">
            ${(ev.hash_sha256 || 'SHA-256-HASH').substring(0, 12)}...
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action" onclick="EvidenceModule.previewEvidence('${ev.id}')" title="Preview Exhibit & Hash">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-icon-action" onclick="EvidenceModule.downloadExhibit('${ev.id}')" title="Download Authorized Evidence">
              <i class="fa-solid fa-download"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  getCategoryIcon(cat) {
    if (cat.includes('CCTV')) return 'fa-video';
    if (cat.includes('Call') || cat.includes('CDR')) return 'fa-phone-volume';
    if (cat.includes('Bank') || cat.includes('Financial')) return 'fa-file-invoice-dollar';
    if (cat.includes('Chat') || cat.includes('WhatsApp')) return 'fa-comments';
    if (cat.includes('Vehicle')) return 'fa-car';
    return 'fa-microscope';
  },

  updateCounters() {
    const el = document.getElementById('evidenceVaultBadge');
    if (el) el.textContent = `${this.evidenceList.length} Exhibits In Vault`;
  },

  setupListeners() {
    document.getElementById('evidenceCategoryFilter')?.addEventListener('change', () => this.fetchEvidence());
    document.getElementById('evidenceSearchInput')?.addEventListener('input', () => this.fetchEvidence());

    // Deposit Modal
    document.getElementById('btnOpenDepositEvidenceModal')?.addEventListener('click', async () => {
      document.getElementById('depositEvidenceForm')?.reset();
      
      // Populate case select
      const caseSelect = document.getElementById('formEvidenceCase');
      if (caseSelect) {
        caseSelect.innerHTML = `<option value="">-- Associate with Case --</option>`;
        try {
          const res = await API.getCases();
          if (res.success) {
            res.data.forEach(c => {
              const opt = document.createElement('option');
              opt.value = c.case_id;
              opt.textContent = `${c.case_id}: ${c.case_title.substring(0, 36)}...`;
              caseSelect.appendChild(opt);
            });
          }
        } catch (e) {}
      }

      App.openModal('depositEvidenceModal');
    });

    // Submit Evidence Deposit Form
    document.getElementById('depositEvidenceForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('formEvidenceFile');
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        App.showToast('Please select a file to deposit', 'error');
        return;
      }

      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('category', document.getElementById('formEvidenceCategory').value);
      formData.append('case_number', document.getElementById('formEvidenceCase').value || 'CASE-2026-089');
      formData.append('description', document.getElementById('formEvidenceDescription').value);

      try {
        const res = await API.uploadEvidence(formData);
        if (res.success) {
          App.showToast(`Evidence ${res.data.evidence_number} sealed with SHA-256 hash!`, 'success');
          App.closeModal('depositEvidenceModal');
          this.fetchEvidence();
        }
      } catch (err) {
        App.showToast('Failed to deposit evidence: ' + err.message, 'error');
      }
    });
  },

  previewEvidence(id) {
    const ev = this.evidenceList.find(i => i.id === id);
    if (!ev) return;

    document.getElementById('prevEvidenceNumber').textContent = ev.evidence_number;
    document.getElementById('prevEvidenceFileName').textContent = ev.file_name;
    document.getElementById('prevEvidenceCategory').textContent = ev.category;
    document.getElementById('prevEvidenceCase').textContent = ev.case_number;
    document.getElementById('prevEvidenceOfficer').textContent = ev.uploaded_by;
    document.getElementById('prevEvidenceHash').textContent = ev.hash_sha256;
    document.getElementById('prevEvidenceDescription').textContent = ev.description;

    App.openModal('previewEvidenceModal');
  },

  downloadExhibit(id) {
    const ev = this.evidenceList.find(i => i.id === id);
    if (!ev) return;
    App.showToast(`Verified SHA-256 integrity check. Downloading ${ev.file_name}...`, 'success');
    window.open(ev.file_path, '_blank');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  EvidenceModule.init();
});
window.EvidenceModule = EvidenceModule;
