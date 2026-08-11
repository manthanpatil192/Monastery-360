// =============================================
// MAP.JS — Leaflet Interactive Map Logic
// =============================================

let map;
let markers = [];
let activeMarker = null;

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  renderSidebarList();
  initSearch();
  initControls();
});

function initMap() {
  // Center on Sikkim
  map = L.map('leaflet-map', {
    center: [27.53, 88.5122],
    zoom: 9,
    zoomControl: false, // We use custom controls
    attributionControl: true,
  });

  // Dark tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright" style="color:#f4a832">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);

  // Add markers for all monasteries
  MONASTERIES.forEach(m => addMarker(m));

  // Fix attribution styling
  const attrib = document.querySelector('.leaflet-control-attribution');
  if (attrib) {
    attrib.style.cssText = 'background:rgba(7,7,15,0.7);color:rgba(240,232,213,0.5);border-radius:4px 0 0 0;font-size:0.65rem;border:none';
  }
}

function createCustomIcon(monastery) {
  const html = `
    <div class="marker-pin">
      <span class="marker-icon">🏯</span>
    </div>
  `;
  return L.divIcon({
    html: html,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -40],
  });
}

function addMarker(monastery) {
  const icon = createCustomIcon(monastery);

  const marker = L.marker([monastery.lat, monastery.lng], { icon })
    .addTo(map);

  // Create popup content
  const popupContent = `
    <div class="map-popup">
      <img src="${monastery.image}" alt="${monastery.name}" class="map-popup-img" />
      <div class="map-popup-body">
        <p class="map-popup-type">${monastery.type} · Est. ${monastery.year}</p>
        <h3 class="map-popup-name">${monastery.name}</h3>
        <div class="map-popup-meta">
          <span>📍 ${monastery.district}</span>
          <span>⛰️ ${monastery.altitude}</span>
        </div>
        <div class="map-popup-actions">
          <a href="tour.html" class="map-popup-btn map-popup-btn-primary">🌐 Virtual Tour</a>
          <a href="monasteries.html#${monastery.id}" class="map-popup-btn map-popup-btn-secondary">Learn More</a>
        </div>
      </div>
    </div>
  `;

  marker.bindPopup(popupContent, {
    maxWidth: 260,
    className: 'custom-popup',
  });

  marker.on('click', () => {
    setActiveListItem(monastery.id);
  });

  markers.push({ monastery, marker });
}

function focusMonastery(monastery) {
  map.flyTo([monastery.lat, monastery.lng], 12, { animate: true, duration: 1.2 });
  const entry = markers.find(m => m.monastery.id === monastery.id);
  if (entry) {
    setTimeout(() => entry.marker.openPopup(), 1200);
  }
  setActiveListItem(monastery.id);
}

function setActiveListItem(id) {
  document.querySelectorAll('.map-list-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });
}

function renderSidebarList() {
  const list = document.getElementById('map-list');
  list.innerHTML = '';

  MONASTERIES.forEach(m => {
    const item = document.createElement('div');
    item.className = 'map-list-item';
    item.dataset.id = m.id;
    item.setAttribute('role', 'listitem');
    item.setAttribute('aria-label', `Focus on ${m.name}`);
    item.innerHTML = `
      <img src="${m.image}" alt="${m.name}" class="map-list-thumb" />
      <div class="map-list-info">
        <div class="map-list-name">${m.name}</div>
        <div class="map-list-meta">📍 ${m.district} · ⛰️ ${m.altitude}</div>
      </div>
    `;
    item.addEventListener('click', () => focusMonastery(m));
    list.appendChild(item);
  });
}

function initSearch() {
  const input = document.getElementById('map-search');
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll('.map-list-item').forEach(item => {
      const name = item.querySelector('.map-list-name').textContent.toLowerCase();
      item.style.display = name.includes(q) ? '' : 'none';
    });
  });
}

function initControls() {
  document.getElementById('map-zoom-in').addEventListener('click', () => {
    map.zoomIn();
  });

  document.getElementById('map-zoom-out').addEventListener('click', () => {
    map.zoomOut();
  });

  document.getElementById('map-reset').addEventListener('click', () => {
    map.flyTo([27.53, 88.5122], 9, { animate: true, duration: 1.2 });
    showToast('Map view reset', 'info', 1500);
  });
}
