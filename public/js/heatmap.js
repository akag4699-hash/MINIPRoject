// ==============================================================================
// Crime Geographical Heat Map & Cluster Analysis (Leaflet.js + leaflet-heat)
// ==============================================================================

const HeatmapModule = {
  map: null,
  darkLayer: null,
  osmLayer: null,
  heatLayer: null,
  markersLayer: null,
  showHeatmap: true,
  cases: [],
  firs: [],

  init() {
    this.setupListeners();
  },

  async load() {
    console.log('[HEATMAP] Loading Crime Heat Map & Incident Coordinates...');
    if (!this.map) {
      this.initMap();
    }

    // Leaflet requires invalidateSize when switching from hidden tab
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 100);
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 350);

    await this.fetchDataAndRender();
  },

  initMap() {
    const container = document.getElementById('leafletCrimeMap');
    if (!container || !window.L) return;

    // Center on India
    this.map = L.map('leafletCrimeMap', {
      zoomControl: true,
      attributionControl: true
    }).setView([22.5937, 78.9629], 5);

    // 1. ESRI World Dark Gray Canvas (Completely free, high-res, zero watermarks, no API key required)
    this.darkLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri, HERE, Garmin, USGS',
      maxZoom: 16
    });

    // 2. OpenStreetMap Standard (Completely free, no API key required)
    this.osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    });

    // Add Dark layer by default
    this.darkLayer.addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
  },

  async fetchDataAndRender() {
    try {
      const [casesRes, firsRes] = await Promise.all([
        API.getCases(),
        API.getFIRs()
      ]);

      if (casesRes.success) this.cases = casesRes.data;
      if (firsRes.success) this.firs = firsRes.data;

      this.renderHeatmapAndMarkers();
      this.populateHighPriorityLocationsList();
    } catch (e) {
      console.error('[HEATMAP] Data fetch error:', e);
    }
  },

  renderHeatmapAndMarkers() {
    if (!this.map) return;

    // Clear existing layers
    if (this.markersLayer) this.markersLayer.clearLayers();
    if (this.heatLayer) {
      this.map.removeLayer(this.heatLayer);
      this.heatLayer = null;
    }

    const categoryFilter = document.getElementById('mapCategoryFilter')?.value || 'All';
    const priorityFilter = document.getElementById('mapPriorityFilter')?.value || 'All';

    // Filter Cases
    let filteredCases = this.cases;
    if (categoryFilter !== 'All') {
      filteredCases = filteredCases.filter(c => (c.crime_type || '').includes(categoryFilter));
    }
    if (priorityFilter !== 'All') {
      filteredCases = filteredCases.filter(c => c.priority === priorityFilter);
    }

    // 1. Construct Density Heatmap Data Points
    const heatPoints = [];

    // Combine cases and FIRs to build realistic geographical crime density
    filteredCases.forEach(c => {
      const lat = parseFloat(c.lat) || 28.6139;
      const lng = parseFloat(c.lng) || 77.2090;

      let intensity = 0.6;
      if (c.priority === 'Critical') intensity = 1.0;
      else if (c.priority === 'High') intensity = 0.8;
      else if (c.priority === 'Medium') intensity = 0.5;

      // Primary point
      heatPoints.push([lat, lng, intensity]);

      // Add realistic surrounding density gradient for high-priority clusters
      if (c.priority === 'Critical') {
        heatPoints.push([lat + 0.04, lng + 0.03, 0.7]);
        heatPoints.push([lat - 0.03, lng - 0.04, 0.7]);
        heatPoints.push([lat + 0.02, lng - 0.02, 0.8]);
        heatPoints.push([lat - 0.04, lng + 0.02, 0.6]);
      } else if (c.priority === 'High') {
        heatPoints.push([lat + 0.02, lng + 0.02, 0.5]);
        heatPoints.push([lat - 0.02, lng - 0.02, 0.5]);
      }
    });

    // Also include FIR locations in heat points
    this.firs.forEach(f => {
      if (f.lat && f.lng) {
        const lat = parseFloat(f.lat);
        const lng = parseFloat(f.lng);
        const intensity = f.priority === 'Critical' ? 0.9 : 0.6;
        heatPoints.push([lat, lng, intensity]);
      }
    });

    // Render smooth Gaussian density Heat Layer if enabled
    if (this.showHeatmap && window.L && L.heatLayer && heatPoints.length > 0) {
      this.heatLayer = L.heatLayer(heatPoints, {
        radius: 38,
        blur: 24,
        maxZoom: 16,
        max: 1.0,
        minOpacity: 0.25,
        gradient: {
          0.2: '#0284c7', // Cyan-Blue
          0.4: '#06b6d4', // Bright Cyan
          0.6: '#10b981', // Emerald Green
          0.75: '#f59e0b', // Amber
          0.9: '#ef4444', // Red
          1.0: '#dc2626'  // Deep Alert Crimson
        }
      }).addTo(this.map);
    }

    // 2. Render Incident Markers with Radar Ping Halos
    filteredCases.forEach(c => {
      const lat = parseFloat(c.lat) || 28.6139;
      const lng = parseFloat(c.lng) || 77.2090;
      const markerColor = this.getCategoryColor(c.crime_type);
      const isCritical = c.priority === 'Critical';

      // Custom high-tech radar pulsing marker
      const markerHtml = `
        <div class="radar-marker-pin">
          <div class="radar-marker-pulse" style="background: ${markerColor};"></div>
          <div class="radar-marker-core" style="background: ${markerColor};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-radar-marker',
        html: markerHtml,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="min-width: 230px; font-family: 'Inter', sans-serif;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <strong style="color: #38bdf8; font-family: var(--font-mono); font-size: 0.85rem;">${c.case_id}</strong>
            <span class="priority-pill pill-${(c.priority || 'high').toLowerCase()}">${c.priority}</span>
          </div>
          <h4 style="font-size: 0.88rem; color: #ffffff; margin: 4px 0 6px 0; font-weight: 700; line-height: 1.3;">
            ${c.case_title}
          </h4>
          <div style="display: flex; flex-direction: column; gap: 3px; font-size: 0.74rem; color: #94a3b8; margin-bottom: 8px;">
            <div><i class="fa-solid fa-location-dot" style="color: #ef4444; width: 14px;"></i> <strong>Jurisdiction:</strong> ${c.location}</div>
            <div><i class="fa-solid fa-tag" style="color: #38bdf8; width: 14px;"></i> <strong>Crime Type:</strong> ${c.crime_type}</div>
            <div><i class="fa-solid fa-user-shield" style="color: #10b981; width: 14px;"></i> <strong>Lead Officer:</strong> ${c.assigned_officer}</div>
            <div><i class="fa-solid fa-list-check" style="color: #f59e0b; width: 14px;"></i> <strong>Investigation Progress:</strong> ${c.investigation_progress}%</div>
          </div>
          <button type="button" class="btn-primary" onclick="CasesModule.viewDetails('${c.id}')" style="width: 100%; justify-content: center; padding: 6px; font-size: 0.74rem;">
            <i class="fa-solid fa-folder-open"></i> Inspect Full Dossier
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(this.markersLayer);
    });
  },

  getCategoryColor(crimeType = '') {
    if (crimeType.includes('Extortion')) return '#ef4444';
    if (crimeType.includes('Cyber') || crimeType.includes('Fraud')) return '#38bdf8';
    if (crimeType.includes('Narcotics')) return '#8b5cf6';
    if (crimeType.includes('Arms')) return '#dc2626';
    if (crimeType.includes('Robbery')) return '#ea580c';
    return '#10b981';
  },

  populateHighPriorityLocationsList() {
    const listEl = document.getElementById('mapHighPriorityList');
    if (!listEl) return;

    const criticalCases = this.cases.filter(c => c.priority === 'Critical' || c.priority === 'High');
    listEl.innerHTML = criticalCases.map(c => `
      <div class="factor-item" style="cursor: pointer; padding: 10px 12px; margin-bottom: 6px;" onclick="HeatmapModule.panToCase('${c.id}')">
        <div>
          <div style="font-size: 0.84rem; font-weight: 700; color: #ffffff;">
            <i class="fa-solid fa-crosshairs" style="color: #38bdf8; margin-right: 6px;"></i> ${c.location}
          </div>
          <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">
            ${c.case_id} &bull; ${c.crime_type}
          </div>
        </div>
        <span class="priority-pill pill-${(c.priority || 'high').toLowerCase()}">${c.priority}</span>
      </div>
    `).join('');
  },

  panToCase(id) {
    const c = this.cases.find(item => item.id === id);
    if (!c || !this.map) return;
    const lat = parseFloat(c.lat) || 28.6139;
    const lng = parseFloat(c.lng) || 77.2090;

    this.map.flyTo([lat, lng], 13, {
      animate: true,
      duration: 1.4
    });
  },

  setupListeners() {
    // Category & Priority Filters
    document.getElementById('mapCategoryFilter')?.addEventListener('change', () => this.renderHeatmapAndMarkers());
    document.getElementById('mapPriorityFilter')?.addEventListener('change', () => this.renderHeatmapAndMarkers());

    // Tile Layer Selector (Dark GIS vs OpenStreetMap)
    document.getElementById('mapTileLayerSelect')?.addEventListener('change', (e) => {
      const mode = e.target.value;
      if (!this.map) return;

      if (mode === 'osm') {
        this.map.removeLayer(this.darkLayer);
        this.osmLayer.addTo(this.map);
      } else {
        this.map.removeLayer(this.osmLayer);
        this.darkLayer.addTo(this.map);
      }
    });

    // Toggle Heat Density Layer
    document.getElementById('btnToggleHeatmapLayer')?.addEventListener('click', () => {
      this.showHeatmap = !this.showHeatmap;
      const btn = document.getElementById('btnToggleHeatmapLayer');
      if (btn) {
        btn.innerHTML = this.showHeatmap
          ? `<i class="fa-solid fa-fire-flame-curved"></i> Hide Heat Layer`
          : `<i class="fa-solid fa-fire-flame-curved"></i> Show Heat Layer`;
      }
      this.renderHeatmapAndMarkers();
      App.showToast(`Crime heat gradient layer ${this.showHeatmap ? 'enabled' : 'hidden'}`);
    });

    // Reset View Button
    document.getElementById('btnResetMapView')?.addEventListener('click', () => {
      if (!this.map) return;
      this.map.flyTo([22.5937, 78.9629], 5, { animate: true, duration: 1 });
    });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  HeatmapModule.init();
});
window.HeatmapModule = HeatmapModule;
