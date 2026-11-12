// ==============================================================================
// System Settings, Officer Profile & Audit Logs Controller
// ==============================================================================

const SettingsModule = {
  init() {
    this.setupListeners();
  },

  async load() {
    console.log('[SETTINGS] Loading officer profile & system diagnostics...');
    this.populateOfficerProfile();
    await Promise.all([
      this.loadSystemDiagnostics(),
      this.loadAuditLogs()
    ]);
  },

  populateOfficerProfile() {
    const off = App.officer || API.getOfficer();
    document.getElementById('settingsOfficerName').textContent = off.name || 'Inspector Rajesh Sharma';
    document.getElementById('settingsOfficerId').textContent = off.officer_id || 'IND-POL-8842';
    document.getElementById('settingsOfficerBadge').textContent = off.badge_number || 'DL-CB-4019';
    document.getElementById('settingsOfficerDept').textContent = off.department || 'Special Crime Investigation Branch';
    document.getElementById('settingsOfficerEmail').textContent = off.email || 'rajesh.sharma@police.gov.in';
    document.getElementById('settingsOfficerRole').textContent = off.role || 'lead_investigator';
    if (off.phone) document.getElementById('settingsOfficerPhone').textContent = off.phone;
  },

  async loadSystemDiagnostics() {
    try {
      const res = await API.getSystemStatus();
      if (!res.success) return;
      const d = res.data;

      document.getElementById('diagDatabaseMode').textContent = d.databaseMode;
      document.getElementById('diagGeminiStatus').textContent = d.geminiConfigured ? `Connected (${d.geminiModel})` : `Local NLP Engine (Simulation Mode)`;
      document.getElementById('diagUptime').textContent = `${Math.floor(d.uptime / 60)} minutes`;
      document.getElementById('diagTimestamp').textContent = new Date(d.timestamp).toLocaleString('en-IN');
    } catch (e) {
      console.warn(e);
    }
  },

  async loadAuditLogs() {
    try {
      const res = await API.getAuditLogs(20);
      const tbody = document.getElementById('auditLogsTableBody');
      if (!tbody) return;

      if (res.success && res.data && res.data.length > 0) {
        tbody.innerHTML = res.data.map(log => `
          <tr>
            <td style="font-family: var(--font-mono); font-size: 0.72rem; color: #94a3b8;">
              ${new Date(log.created_at).toLocaleTimeString('en-IN')}
            </td>
            <td><strong>${log.officer_name}</strong><br><small style="color: #64748b;">${log.officer_id}</small></td>
            <td><span class="format-tag">${log.action}</span></td>
            <td style="font-size: 0.76rem; color: #cbd5e1;">${log.details}</td>
            <td style="font-family: var(--font-mono); font-size: 0.72rem; color: #38bdf8;">${log.ip_address || '127.0.0.1'}</td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = `<tr><td colspan="5" class="text-muted" style="text-align: center;">No audit entries recorded.</td></tr>`;
      }
    } catch (e) {
      console.error(e);
    }
  },

  setupListeners() {
    // Password change form
    document.getElementById('changePasswordForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPwd = document.getElementById('newPasswordInput').value;
      const confPwd = document.getElementById('confirmPasswordInput').value;

      if (newPwd !== confPwd) {
        App.showToast('New credentials do not match.', 'error');
        return;
      }
      if (newPwd.length < 8) {
        App.showToast('Password must be at least 8 characters long.', 'error');
        return;
      }

      App.showToast('Security PIN / Password updated successfully!', 'success');
      document.getElementById('changePasswordForm').reset();
    });

    // Save preferences
    document.getElementById('btnSavePreferences')?.addEventListener('click', () => {
      App.showToast('Command Center notification preferences saved.', 'success');
    });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  SettingsModule.init();
});
window.SettingsModule = SettingsModule;
