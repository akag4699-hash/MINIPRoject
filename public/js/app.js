// ==============================================================================
// Main Application Controller (SPA Router, State, Modals & Toast Manager)
// ==============================================================================

const App = {
  currentTab: 'dashboard',
  officer: null,

  init() {
    this.officer = API.getOfficer();
    this.updateOfficerUI();
    this.setupNavigation();
    this.setupGlobalEvents();
    this.checkSystemStatus();

    // Route based on URL hash
    const initialHash = window.location.hash.replace('#', '') || 'dashboard';
    this.switchTab(initialHash);

    console.log('[APP] AI Command Center Initialized. Active Officer:', this.officer.name);
  },

  updateOfficerUI() {
    const nameEl = document.getElementById('headerOfficerName');
    const roleEl = document.getElementById('headerOfficerRole');
    const avatarEl = document.getElementById('headerOfficerAvatar');

    if (nameEl) nameEl.textContent = this.officer.name || 'Inspector Rajesh Sharma';
    if (roleEl) roleEl.textContent = this.officer.designation || 'Lead Investigating Officer';
    if (avatarEl && this.officer.avatar_url) avatarEl.src = this.officer.avatar_url;
  },

  setupNavigation() {
    // Sidebar nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
          // On mobile, close sidebar after clicking
          if (window.innerWidth <= 768) {
            document.querySelector('.command-sidebar')?.classList.remove('open');
          }
        }
      });
    });

    // Hash change listener
    window.addEventListener('hashchange', () => {
      const tab = window.location.hash.replace('#', '');
      if (tab) this.switchTab(tab);
    });

    // Mobile sidebar toggle
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebar = document.querySelector('.command-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }
  },

  switchTab(tabName) {
    const validTabs = ['dashboard', 'analysis', 'network', 'firs', 'cases', 'evidence', 'heatmap', 'performance', 'reports', 'settings'];
    if (!validTabs.includes(tabName)) tabName = 'dashboard';

    this.currentTab = tabName;
    window.location.hash = tabName;

    // Update active nav-link
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('data-tab') === tabName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update active tab-pane
    document.querySelectorAll('.tab-pane').forEach(pane => {
      if (pane.id === `tab-${tabName}`) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Trigger module-specific initializations
    if (tabName === 'dashboard' && window.DashboardModule) DashboardModule.load();
    if (tabName === 'firs' && window.FIRsModule) FIRsModule.load();
    if (tabName === 'cases' && window.CasesModule) CasesModule.load();
    if (tabName === 'network' && window.NetworkModule) NetworkModule.load();
    if (tabName === 'evidence' && window.EvidenceModule) EvidenceModule.load();
    if (tabName === 'heatmap' && window.HeatmapModule) HeatmapModule.load();
    if (tabName === 'performance' && window.PerformanceModule) PerformanceModule.load();
    if (tabName === 'reports' && window.ReportsModule) ReportsModule.load();
    if (tabName === 'settings' && window.SettingsModule) SettingsModule.load();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  async checkSystemStatus() {
    try {
      const res = await API.getSystemStatus();
      if (res && res.success) {
        const data = res.data;
        const aiBadge = document.getElementById('systemAiStatus');
        const dbBadge = document.getElementById('systemDbStatus');
        
        if (aiBadge) {
          aiBadge.innerHTML = data.geminiConfigured 
            ? `<span class="status-dot pulse-green"></span> Gemini 1.5 Pro` 
            : `<span class="status-dot pulse-cyan"></span> AI Engine (NLP)`;
        }
        if (dbBadge) {
          dbBadge.innerHTML = data.databaseMode.includes('Supabase')
            ? `<span class="status-dot pulse-green"></span> Supabase Connected`
            : `<span class="status-dot pulse-cyan"></span> SIH Demo Mode`;
        }
      }
    } catch (e) {
      console.warn('[APP] Could not fetch system status:', e);
    }
  },

  setupGlobalEvents() {
    // Logout buttons
    document.querySelectorAll('.btn-logout').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('Confirm session sign-out from National Intelligence Command Center?')) {
          await API.logout();
          localStorage.removeItem('cna_token');
          window.location.href = '/login.html';
        }
      });
    });

    // Notifications toggle
    const notifBtn = document.getElementById('notificationsToggleBtn');
    const notifModal = document.getElementById('notificationsModal');
    if (notifBtn && notifModal) {
      notifBtn.addEventListener('click', () => {
        this.openModal('notificationsModal');
        this.loadNotificationsList();
      });
    }

    // Close modals on clicking overlay backdrop
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Close modals on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
          this.closeModal(modal.id);
        });
      }
    });
  },

  async loadNotificationsList() {
    try {
      const res = await API.getAlerts();
      const listContainer = document.getElementById('notificationsModalList');
      if (!listContainer) return;

      if (res.success && res.data && res.data.length > 0) {
        listContainer.innerHTML = res.data.map(alert => `
          <div class="alert-item priority-${(alert.priority || 'high').toLowerCase()}">
            <div class="alert-top">
              <span class="alert-title">${alert.title}</span>
              <span class="priority-pill pill-${(alert.priority || 'high').toLowerCase()}">${alert.priority}</span>
            </div>
            <p class="alert-desc">${alert.message}</p>
            <div class="alert-meta">Case: ${alert.case_number || 'General'} &bull; ${new Date(alert.created_at).toLocaleTimeString('en-IN')}</div>
          </div>
        `).join('');
      } else {
        listContainer.innerHTML = `<p class="text-muted">No new alerts at this time.</p>`;
      }
    } catch (e) {
      console.error(e);
    }
  },

  // Modal Manager
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('d-none');
      modal.style.display = 'flex';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('d-none');
      modal.style.display = 'none';
    }
  },

  // Toast Manager
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-triangle';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideToast 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  App.init();
});
