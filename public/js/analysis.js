// ==============================================================================
// AI Upload & Analysis Controller (Text Extraction, Gemini NLP & Priority Scoring)
// ==============================================================================

const AnalysisModule = {
  selectedFile: null,
  currentAnalysis: null,

  init() {
    this.setupDropzone();
    this.setupSampleButtons();
    this.setupActions();
  },

  setupDropzone() {
    const dropzone = document.getElementById('aiUploadDropzone');
    const fileInput = document.getElementById('aiFileInput');
    const browseBtn = document.getElementById('browseFilesBtn');

    if (!dropzone || !fileInput) return;

    browseBtn?.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('click', (e) => {
      if (e.target !== browseBtn) fileInput.click();
    });

    // Drag and Drop
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleFileSelected(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        this.handleFileSelected(e.target.files[0]);
      }
    });

    // Remove file button
    document.getElementById('removeSelectedFileBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.clearSelectedFile();
    });

    // Analyze button
    document.getElementById('startAnalysisBtn')?.addEventListener('click', () => {
      this.executeUploadAndAnalyze();
    });
  },

  setupSampleButtons() {
    document.querySelectorAll('.btn-load-sample').forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleType = btn.getAttribute('data-sample');
        this.executeSampleAnalysis(sampleType);
      });
    });
  },

  setupActions() {
    // View in network button
    document.getElementById('btnViewAnalysisNetwork')?.addEventListener('click', () => {
      App.switchTab('network');
      App.showToast('Opened criminal network. Extracted entities mapped into graph.', 'success');
    });

    // Download analysis report
    document.getElementById('btnDownloadAnalysisReport')?.addEventListener('click', () => {
      if (!this.currentAnalysis) return;
      window.print();
    });
  },

  handleFileSelected(file) {
    const allowed = ['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowed.includes(ext)) {
      App.showToast(`Unsupported file type (${ext}). Please upload PDF, DOCX, TXT, JPG, or PNG.`, 'error');
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      App.showToast('File size exceeds 30MB limit. Please select a smaller document.', 'error');
      return;
    }

    this.selectedFile = file;

    // Update UI
    const dropzone = document.getElementById('aiUploadDropzone');
    const selectedFileCard = document.getElementById('selectedFileCard');
    const fileNameEl = document.getElementById('selectedFileName');
    const fileSizeEl = document.getElementById('selectedFileSize');

    if (dropzone) dropzone.classList.add('d-none');
    if (selectedFileCard) selectedFileCard.classList.remove('d-none');
    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for AI extraction`;
  },

  clearSelectedFile() {
    this.selectedFile = null;
    const fileInput = document.getElementById('aiFileInput');
    if (fileInput) fileInput.value = '';

    document.getElementById('aiUploadDropzone')?.classList.remove('d-none');
    document.getElementById('selectedFileCard')?.classList.add('d-none');
  },

  async executeUploadAndAnalyze() {
    if (!this.selectedFile) {
      App.showToast('Please select an investigation document to upload.', 'error');
      return;
    }

    this.setLoadingState(true, 'Extracting text and running Gemini NLP...');

    const formData = new FormData();
    formData.append('document', this.selectedFile);

    try {
      const res = await API.uploadAndAnalyze(formData);
      if (res.success) {
        this.currentAnalysis = res.data;
        this.renderAnalysisResults(res.data);
        App.showToast('Document analyzed successfully! Entities and relationships mapped.', 'success');
      } else {
        throw new Error(res.message || 'AI document analysis failed');
      }
    } catch (err) {
      App.showToast(err.message, 'error');
      console.error(err);
    } finally {
      this.setLoadingState(false);
    }
  },

  async executeSampleAnalysis(sampleType) {
    this.setLoadingState(true, `Loading sample test case (${sampleType.toUpperCase()}) & executing AI pipeline...`);

    try {
      const res = await API.loadSampleAnalysis(sampleType);
      if (res.success) {
        this.currentAnalysis = res.data;
        this.renderAnalysisResults(res.data);
        App.showToast(`Sample test case loaded & analyzed! ${res.data.entities.length} entities identified.`, 'success');
      } else {
        throw new Error(res.message || 'Failed to process sample');
      }
    } catch (err) {
      App.showToast(err.message, 'error');
      console.error(err);
    } finally {
      this.setLoadingState(false);
    }
  },

  setLoadingState(isLoading, message = 'Processing...') {
    const loadingCard = document.getElementById('aiLoadingCard');
    const loadingText = document.getElementById('aiLoadingText');
    const startBtn = document.getElementById('startAnalysisBtn');

    if (isLoading) {
      if (loadingCard) loadingCard.classList.remove('d-none');
      if (loadingText) loadingText.textContent = message;
      if (startBtn) startBtn.disabled = true;
      document.getElementById('aiResultsContainer')?.classList.add('d-none');
    } else {
      if (loadingCard) loadingCard.classList.add('d-none');
      if (startBtn) startBtn.disabled = false;
    }
  },

  renderAnalysisResults(data) {
    const container = document.getElementById('aiResultsContainer');
    if (!container) return;
    container.classList.remove('d-none');

    // Header info
    document.getElementById('analysisDocName').textContent = data.document_name || 'Investigation Document';
    const engineBadge = document.getElementById('analysisEngineBadge');
    if (engineBadge) {
      engineBadge.innerHTML = data.is_simulation 
        ? `<span class="priority-pill pill-medium"><i class="fa-solid fa-microchip"></i> ${data.ai_engine}</span>` 
        : `<span class="priority-pill pill-low"><i class="fa-solid fa-brain"></i> ${data.ai_engine}</span>`;
    }

    // A. Case Summary
    document.getElementById('analysisSummaryText').textContent = data.summary;
    document.getElementById('analysisCategoryPill').textContent = data.crime_category;
    
    const obsList = document.getElementById('analysisKeyObservationsList');
    if (obsList && data.key_observations) {
      obsList.innerHTML = data.key_observations.map(obs => `<li>${obs}</li>`).join('');
    }

    // D. Investigation Priority Score
    const scoreCircle = document.getElementById('analysisScoreCircle');
    const scoreNum = document.getElementById('analysisScoreNum');
    const priorityLevel = document.getElementById('analysisPriorityLevel');
    const scoreExplanation = document.getElementById('analysisScoreExplanation');

    if (scoreNum) scoreNum.textContent = data.priority_score;
    if (priorityLevel) priorityLevel.textContent = `${data.priority_level} Priority`;
    if (scoreExplanation) scoreExplanation.textContent = data.score_explanation;

    if (scoreCircle) {
      scoreCircle.className = `score-circle score-${(data.priority_level || 'high').toLowerCase()}`;
    }

    // Contributing Factors
    const factorsList = document.getElementById('analysisRiskFactorsList');
    if (factorsList && data.risk_factors) {
      factorsList.innerHTML = data.risk_factors.map(f => `
        <div class="factor-item">
          <span class="factor-name">${f.factor}</span>
          <span class="factor-weight">${f.weight}</span>
        </div>
      `).join('');
    }

    // Suggested Actions
    const actionsList = document.getElementById('analysisSuggestedActionsList');
    if (actionsList && data.suggested_actions) {
      actionsList.innerHTML = data.suggested_actions.map(act => `
        <li style="margin-bottom: 6px; font-size: 0.78rem;">${act}</li>
      `).join('');
    }

    // B. Entities Cloud & Table
    const entitiesCloud = document.getElementById('analysisEntitiesCloud');
    const entitiesTbody = document.getElementById('analysisEntitiesTbody');

    if (entitiesCloud && data.entities) {
      entitiesCloud.innerHTML = data.entities.map(e => `
        <span class="entity-chip chip-${e.entity_type}">
          <i class="fa-solid ${this.getEntityIcon(e.entity_type)}"></i>
          <strong>${e.label || e.entity_value}</strong>
          <small>(${e.confidence}%)</small>
        </span>
      `).join('');
    }

    if (entitiesTbody && data.entities) {
      entitiesTbody.innerHTML = data.entities.map(e => `
        <tr>
          <td><span class="entity-chip chip-${e.entity_type}"><i class="fa-solid ${this.getEntityIcon(e.entity_type)}"></i> ${e.entity_type.toUpperCase()}</span></td>
          <td><strong>${e.entity_value}</strong></td>
          <td>${e.label || '-'}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.75rem; font-weight: 700;">${e.confidence}%</span>
              <div class="progress-bar-container" style="width: 60px;">
                <div class="progress-bar-fill" style="width: ${e.confidence}%"></div>
              </div>
            </div>
          </td>
          <td>
            <span class="priority-pill pill-${(e.risk_level || 'medium').toLowerCase()}">${(e.risk_level || 'medium').toUpperCase()}</span>
          </td>
        </tr>
      `).join('');
    }

    // C. Relationships Table
    const relsTbody = document.getElementById('analysisRelationshipsTbody');
    if (relsTbody) {
      if (data.relationships && data.relationships.length > 0) {
        relsTbody.innerHTML = data.relationships.map(r => `
          <tr>
            <td><strong style="color: #38bdf8;">${r.source_name || '-'}</strong></td>
            <td><span class="format-tag"><i class="fa-solid fa-arrow-right"></i> ${(r.relationship_type || 'communicated_with').replace(/_/g, ' ')}</span></td>
            <td><strong style="color: #ffffff;">${r.target_name || '-'}</strong></td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 0.75rem; font-weight: 700;">${r.confidence || 85}%</span>
                <div class="progress-bar-container" style="width: 60px;">
                  <div class="progress-bar-fill" style="width: ${r.confidence || 85}%"></div>
                </div>
              </div>
            </td>
            <td style="font-size: 0.72rem; color: #94a3b8; font-style: italic; max-width: 250px;">"${r.source_text || 'Documentary relationship extracted from case record'}"</td>
          </tr>
        `).join('');
      } else {
        relsTbody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align: center; color: #94a3b8; padding: 20px;">
              <i class="fa-solid fa-circle-nodes" style="color: #38bdf8; font-size: 1.2rem; margin-right: 6px;"></i>
              No inter-entity relationships were detected in this document. Upload a document containing multiple entities or test with sample documents.
            </td>
          </tr>
        `;
      }
    }

    // E. Recommendations
    const recsList = document.getElementById('analysisRecommendationsList');
    if (recsList && data.recommendations) {
      recsList.innerHTML = data.recommendations.map(rec => `
        <li style="margin-bottom: 8px; font-size: 0.8rem; color: #f8fafc;">
          <i class="fa-solid fa-shield-check" style="color: #38bdf8; margin-right: 6px;"></i> ${rec}
        </li>
      `).join('');
    }

    // Scroll to results
    container.scrollIntoView({ behavior: 'smooth' });
  },

  getEntityIcon(type) {
    const map = {
      suspect: 'fa-user-secret',
      organization: 'fa-building',
      phone: 'fa-phone-volume',
      bank_account: 'fa-credit-card',
      vehicle: 'fa-car-side',
      location: 'fa-location-dot'
    };
    return map[type] || 'fa-circle';
  }
};

window.addEventListener('DOMContentLoaded', () => {
  AnalysisModule.init();
});
window.AnalysisModule = AnalysisModule;
