// ==============================================================================
// Centralized API Service for AI-Powered Criminal Network Analysis System
// ==============================================================================

const API = {
  getToken() {
    return localStorage.getItem('cna_token') || '';
  },

  getOfficer() {
    try {
      return JSON.parse(localStorage.getItem('cna_officer')) || {
        name: "Inspector Rajesh Sharma",
        officer_id: "IND-POL-8842",
        designation: "Lead Investigating Officer",
        department: "Special Crime Investigation Branch"
      };
    } catch (e) {
      return { name: "Inspector Rajesh Sharma", officer_id: "IND-POL-8842" };
    }
  },

  async request(endpoint, options = {}) {
    const headers = options.headers || {};
    const token = this.getToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers
      });

      if (response.status === 401) {
        console.warn('[API] Session token expired or unauthorized. Clearing session.');
        // Don't auto-redirect abruptly if in demo mode, but notify
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[API ERROR] ${endpoint}:`, error);
      throw error;
    }
  },

  // Auth
  login(officerId, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ officerId, password })
    });
  },
  logout() {
    const off = this.getOfficer();
    return this.request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ officerId: off.officer_id, officerName: off.name })
    });
  },

  // Dashboard
  getDashboardStats() {
    return this.request('/api/dashboard/stats');
  },
  getRecentCases() {
    return this.request('/api/dashboard/recent-cases');
  },
  getAlerts() {
    return this.request('/api/dashboard/alerts');
  },

  // FIRs
  getFIRs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/firs?${query}`);
  },
  getFIR(id) {
    return this.request(`/api/firs/${id}`);
  },
  createFIR(firData) {
    return this.request('/api/firs', {
      method: 'POST',
      body: JSON.stringify(firData)
    });
  },
  updateFIR(id, updates) {
    return this.request(`/api/firs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },
  deleteFIR(id) {
    return this.request(`/api/firs/${id}`, {
      method: 'DELETE'
    });
  },

  // Cases
  getCases(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/cases?${query}`);
  },
  getCase(id) {
    return this.request(`/api/cases/${id}`);
  },
  createCase(caseData) {
    return this.request('/api/cases', {
      method: 'POST',
      body: JSON.stringify(caseData)
    });
  },
  updateCase(id, updates) {
    return this.request(`/api/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },
  deleteCase(id) {
    return this.request(`/api/cases/${id}`, {
      method: 'DELETE'
    });
  },

  // AI Analysis
  uploadAndAnalyze(formData) {
    return this.request('/api/analysis/upload', {
      method: 'POST',
      body: formData
    });
  },
  loadSampleAnalysis(sampleType) {
    return this.request('/api/analysis/sample', {
      method: 'POST',
      body: JSON.stringify({ sampleType })
    });
  },
  getAnalysis(id) {
    return this.request(`/api/analysis/${id}`);
  },

  // Criminal Network
  getNetwork(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/network?${query}`);
  },
  getEntityDetails(entityId) {
    return this.request(`/api/network/${entityId}`);
  },
  verifyItem(type, id) {
    return this.request(`/api/network/verify/${type}/${id}`, {
      method: 'POST'
    });
  },

  // Evidence
  getEvidence(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/evidence?${query}`);
  },
  uploadEvidence(formData) {
    return this.request('/api/evidence/upload', {
      method: 'POST',
      body: formData
    });
  },

  // Reports
  getReports() {
    return this.request('/api/reports');
  },
  generateReport(reportData) {
    return this.request('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify(reportData)
    });
  },

  // System & Audit
  getAuditLogs(limit = 50) {
    return this.request(`/api/audit-logs?limit=${limit}`);
  },
  getSystemStatus() {
    return this.request('/api/system/status');
  }
};
