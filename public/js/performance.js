// ==============================================================================
// Officer Performance & Workload Analytics Controller
// Transparent and Measurable Law Enforcement Metrics
// ==============================================================================

const PerformanceModule = {
  charts: {},

  async load() {
    console.log('[PERFORMANCE] Rendering officer workload metrics...');
    this.renderPerformanceCharts();
  },

  renderPerformanceCharts() {
    this.renderWorkloadChart();
    this.renderClosureRateChart();
    this.renderMonthlyClearanceChart();
  },

  renderWorkloadChart() {
    const canvas = document.getElementById('officerWorkloadChart');
    if (!canvas) return;
    if (this.charts.workload) this.charts.workload.destroy();

    const ctx = canvas.getContext('2d');
    this.charts.workload = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Insp. R. Sharma', 'ACP S. Verma', 'DSP A. Deshmukh', 'Insp. V. Kulkarni', 'SI N. Rawat'],
        datasets: [
          {
            label: 'Active Cases',
            data: [6, 5, 4, 3, 4],
            backgroundColor: '#0284c7'
          },
          {
            label: 'Completed / Chargesheeted',
            data: [14, 18, 12, 9, 8],
            backgroundColor: '#10b981'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: '#94a3b8' } },
          y: { stacked: true, grid: { color: 'rgba(30,58,117,0.3)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  },

  renderClosureRateChart() {
    const canvas = document.getElementById('officerClosureRateChart');
    if (!canvas) return;
    if (this.charts.closure) this.charts.closure.destroy();

    const ctx = canvas.getContext('2d');
    this.charts.closure = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Cyber Forensics', 'Interstate Extortion', 'Financial Hawala', 'Narcotics Interception', 'Arms Seizure', 'CCTNS Compliance'],
        datasets: [{
          label: 'Department Clearance Index (%)',
          data: [92, 85, 88, 79, 94, 98],
          backgroundColor: 'rgba(56, 189, 248, 0.2)',
          borderColor: '#38bdf8',
          borderWidth: 2,
          pointBackgroundColor: '#0284c7'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(30, 58, 117, 0.5)' },
            grid: { color: 'rgba(30, 58, 117, 0.5)' },
            pointLabels: { color: '#94a3b8', font: { size: 10 } },
            ticks: { display: false }
          }
        },
        plugins: {
          legend: { labels: { color: '#ffffff' } }
        }
      }
    });
  },

  renderMonthlyClearanceChart() {
    const canvas = document.getElementById('monthlyClearanceChart');
    if (!canvas) return;
    if (this.charts.clearance) this.charts.clearance.destroy();

    const ctx = canvas.getContext('2d');
    this.charts.clearance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026'],
        datasets: [{
          label: 'Average Investigation Progress %',
          data: [58, 64, 69, 74, 82, 88],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          x: { grid: { color: 'rgba(30,58,117,0.3)' }, ticks: { color: '#94a3b8' } },
          y: { min: 40, max: 100, grid: { color: 'rgba(30,58,117,0.3)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }
};

window.PerformanceModule = PerformanceModule;
