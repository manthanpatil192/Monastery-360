// =============================================
// TOUR.JS — 360° Virtual Tour Logic
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initTour();
});

// Scene definitions per monastery
const SCENES = {
  rumtek: [
    { id: 'entrance', name: '🚪 Entrance Gate', bg: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 30%, #2a1500 60%, #1a0a00 100%)', bgImg: 'assets/images/rumtek.png' },
    { id: 'prayer-hall', name: '🪔 Prayer Hall', bg: 'linear-gradient(135deg, #1a0500 0%, #2d0000 40%, #4a1500 100%)', bgImg: 'assets/images/interior.png' },
    { id: 'rooftop', name: '🌄 Monastery Rooftop', bg: 'linear-gradient(135deg, #000820 0%, #001a40 50%, #002060 100%)', bgImg: 'assets/images/rumtek.png' },
    { id: 'garden', name: '🌿 Sacred Garden', bg: 'linear-gradient(135deg, #001a05 0%, #003010 50%, #002008 100%)', bgImg: 'assets/images/rumtek.png' },
  ],
  pemayangtse: [
    { id: 'entrance', name: '🚪 Ancient Gateway', bg: 'linear-gradient(135deg, #150a00 0%, #2a1500 50%, #1a0800 100%)', bgImg: 'assets/images/pemayangtse.png' },
    { id: 'shrine', name: '🪔 Main Shrine', bg: 'linear-gradient(135deg, #1a0000 0%, #300000 50%, #200010 100%)', bgImg: 'assets/images/interior.png' },
    { id: 'terrace', name: '🌄 Roof Terrace', bg: 'linear-gradient(135deg, #001030 0%, #002050 60%, #00103a 100%)', bgImg: 'assets/images/pemayangtse.png' },
  ],
  tashiding: [
    { id: 'stupa', name: '☸️ Sacred Stupa', bg: 'linear-gradient(135deg, #100010 0%, #200030 50%, #180020 100%)', bgImg: 'assets/images/tashiding.png' },
    { id: 'hilltop', name: '⛰️ Hilltop View', bg: 'linear-gradient(135deg, #001020 0%, #002540 60%, #001830 100%)', bgImg: 'assets/images/tashiding.png' },
    { id: 'bumchu', name: '🫙 Bumchu Shrine', bg: 'linear-gradient(135deg, #0a0a00 0%, #1a1500 50%, #100d00 100%)', bgImg: 'assets/images/interior.png' },
  ],
  enchey: [
    { id: 'courtyard', name: '🎭 Dance Courtyard', bg: 'linear-gradient(135deg, #001020 0%, #001a30 50%, #000f20 100%)', bgImg: 'assets/images/enchey.png' },
    { id: 'shrine', name: '🙏 Main Shrine', bg: 'linear-gradient(135deg, #1a0500 0%, #300a00 50%, #1a0300 100%)', bgImg: 'assets/images/interior.png' },
    { id: 'deck', name: '🌄 Observation Deck', bg: 'linear-gradient(135deg, #000515 0%, #000a25 50%, #000518 100%)', bgImg: 'assets/images/enchey.png' },
  ],
};

const HOTSPOT_DATA = {
  'rumtek_entrance': [
    { x: 30, y: 45, icon: '🏯', label: 'Main Gate', title: 'The Grand Entrance', desc: 'The elaborate entrance gate of Rumtek Monastery is adorned with traditional Tibetan motifs, auspicious symbols, and colorful prayer flags — welcoming pilgrims for over 300 years.', img: 'assets/images/rumtek.png' },
    { x: 65, y: 35, icon: '🔔', label: 'Prayer Bell', title: 'Sacred Bell Tower', desc: 'The monastery bell rings to signal prayer times and important ceremonies. Its resonant tone can be heard throughout the valley.', img: 'assets/images/interior.png' },
    { x: 50, y: 70, icon: '☸️', label: 'Prayer Wheel', title: 'Mani Prayer Wheels', desc: 'Rows of golden prayer wheels line the walkway. Spinning them clockwise is equivalent to reciting the mantras inscribed inside.', img: 'assets/images/rumtek.png' },
  ],
  'rumtek_prayer-hall': [
    { x: 50, y: 40, icon: '🪔', label: 'Altar', title: 'The Main Altar', desc: 'The main altar houses a magnificent golden Buddha statue flanked by Bodhisattvas. Hundreds of butter lamps illuminate the space.', img: 'assets/images/interior.png' },
    { x: 20, y: 55, icon: '📜', label: 'Thangka', title: 'Ancient Thangka Paintings', desc: 'These silk scroll paintings depict Buddhist deities, mandalas, and the Wheel of Life. Each takes months to create and represents centuries of artistic tradition.', img: 'assets/images/interior.png' },
    { x: 80, y: 50, icon: '📚', label: 'Library', title: 'Scripture Library', desc: 'Over 5,000 hand-written and block-printed Buddhist scriptures in Tibetan, Sanskrit, and other languages are preserved here.', img: 'assets/images/interior.png' },
  ],
  'pemayangtse_entrance': [
    { x: 40, y: 50, icon: '🏯', label: 'Three-Story Hall', title: 'The Trikhang', desc: 'Pemayangtse\'s three-story hall is one of the finest examples of traditional Sikkimese architecture, built in 1705 under the patronage of Chogyal Chakdor Namgyal.', img: 'assets/images/pemayangtse.png' },
    { x: 70, y: 40, icon: '🎨', label: 'Wood Carvings', title: 'Intricate Wood Carvings', desc: 'Every surface is decorated with hand-carved Buddhist motifs. The craftsmanship reflects generations of devotion and artistic mastery.', img: 'assets/images/pemayangtse.png' },
  ],
};

let currentMonastery = null;
let currentScene = null;
let rotationX = 0;
let rotationY = 0;
let isDragging = false;
let lastX = 0, lastY = 0;
let autoRotate = false;
let autoRotateTimer = null;
let scale = 1;
let compassAngle = 0;

function initTour() {
  renderMonasteryList();
  loadMonastery(MONASTERIES[0]);

  initDragControls();
  initControls();
  initSearch();
}

// Render sidebar monastery list
function renderMonasteryList() {
  const list = document.getElementById('monastery-list');
  list.innerHTML = '';

  MONASTERIES.forEach(m => {
    const item = document.createElement('div');
    item.className = 'monastery-list-item';
    item.setAttribute('role', 'option');
    item.setAttribute('data-id', m.id);
    item.setAttribute('aria-label', `Select ${m.name}`);
    item.innerHTML = `
      <img src="${m.image}" alt="${m.name}" class="monastery-list-thumb" />
      <div class="monastery-list-info">
        <div class="monastery-list-name">${m.name}</div>
        <div class="monastery-list-meta">📍 ${m.district} · ${m.type}</div>
      </div>
      <div class="monastery-list-badge"></div>
    `;
    item.addEventListener('click', () => {
      loadMonastery(m);
    });
    list.appendChild(item);
  });
}

// Load a monastery into the tour
function loadMonastery(monastery) {
  currentMonastery = monastery;

  // Update active state
  document.querySelectorAll('.monastery-list-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === monastery.id);
  });

  // Update header
  document.getElementById('monastery-name').textContent = monastery.name;
  document.getElementById('monastery-meta').innerHTML = `
    <span>📍 ${monastery.district}</span>
    <span>⛰️ ${monastery.altitude}</span>
    <span>📅 Est. ${monastery.year}</span>
  `;

  // Load first scene
  const scenes = SCENES[monastery.id] || SCENES.rumtek;
  currentScene = scenes[0];
  renderSceneTabs(scenes);
  loadScene(scenes[0]);
}

// Render scene tabs
function renderSceneTabs(scenes) {
  const container = document.getElementById('scene-tabs');
  container.innerHTML = '';
  scenes.forEach((scene, i) => {
    const btn = document.createElement('button');
    btn.className = `scene-tab ${i === 0 ? 'active' : ''}`;
    btn.textContent = scene.name;
    btn.setAttribute('aria-label', `View ${scene.name}`);
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scene-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      loadScene(scene);
    });
    container.appendChild(btn);
  });
}

// Load a scene
function loadScene(scene) {
  currentScene = scene;

  const canvas = document.getElementById('panorama-canvas');

  // Apply gradient background + image overlay
  canvas.style.background = scene.bg;
  canvas.style.backgroundImage = `url('${scene.bgImg}')`;
  canvas.style.backgroundSize = 'cover';
  canvas.style.backgroundPosition = `${rotationY * 0.1}% 50%`;

  // Animate transition
  canvas.style.opacity = '0';
  setTimeout(() => { canvas.style.opacity = '1'; canvas.style.transition = 'opacity 0.5s'; }, 50);

  // Load hotspots for this scene
  const key = `${currentMonastery.id}_${scene.id}`;
  renderHotspots(HOTSPOT_DATA[key] || generateDefaultHotspots(currentMonastery, scene));

  // Reset view
  rotationX = 0;
  rotationY = 0;
  updatePanorama();

  // Hide drag hint after interaction
  const hint = document.getElementById('drag-hint');
  if (hint) setTimeout(() => hint.classList.add('hidden'), 4000);

  // Close info panel
  closeInfoPanel();
}

// Generate default hotspots if not defined
function generateDefaultHotspots(monastery, scene) {
  return monastery.hotspots.slice(0, 3).map((hs, i) => ({
    x: 20 + i * 25,
    y: 45 + (i % 2 === 0 ? 0 : 10),
    icon: ['🏯', '🪔', '📜', '☸️'][i % 4],
    label: hs,
    title: hs,
    desc: `Explore the ${hs} at ${monastery.name}. This sacred space holds centuries of Buddhist history and spiritual significance.`,
    img: monastery.image,
  }));
}

// Render hotspots
function renderHotspots(hotspots) {
  const container = document.getElementById('hotspots-container');
  container.innerHTML = '';

  hotspots.forEach(hs => {
    const el = document.createElement('div');
    el.className = 'hotspot';
    el.style.left = `${hs.x}%`;
    el.style.top = `${hs.y}%`;
    el.innerHTML = `
      <button class="hotspot-btn" aria-label="${hs.label}">
        <span>${hs.icon}</span>
      </button>
      <div class="hotspot-label">${hs.label}</div>
    `;
    el.addEventListener('click', () => openInfoPanel(hs));
    container.appendChild(el);
  });
}

// Open info panel
function openInfoPanel(hs) {
  document.getElementById('info-panel-type').textContent = '📍 Point of Interest';
  document.getElementById('info-panel-title').textContent = hs.title;
  document.getElementById('info-panel-desc').textContent = hs.desc;
  const img = document.getElementById('info-panel-img');
  img.src = hs.img;
  img.alt = hs.title;
  document.getElementById('info-panel').classList.add('open');
}

// Close info panel
function closeInfoPanel() {
  document.getElementById('info-panel').classList.remove('open');
}

document.getElementById('info-panel-close').addEventListener('click', closeInfoPanel);

// Drag controls for panorama
function initDragControls() {
  const viewer = document.getElementById('tour-viewer');

  // Mouse
  viewer.addEventListener('mousedown', e => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    document.getElementById('drag-hint')?.classList.add('hidden');
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    rotationY += dx * 0.3;
    rotationX = Math.max(-30, Math.min(30, rotationX - dy * 0.2));
    compassAngle = (compassAngle + dx * 0.3) % 360;
    updatePanorama();
  });

  window.addEventListener('mouseup', () => isDragging = false);

  // Touch
  let lastTouchX = 0, lastTouchY = 0;
  viewer.addEventListener('touchstart', e => {
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
    document.getElementById('drag-hint')?.classList.add('hidden');
  });

  viewer.addEventListener('touchmove', e => {
    e.preventDefault();
    const dx = e.touches[0].clientX - lastTouchX;
    const dy = e.touches[0].clientY - lastTouchY;
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
    rotationY += dx * 0.3;
    rotationX = Math.max(-30, Math.min(30, rotationX - dy * 0.2));
    compassAngle = (compassAngle + dx * 0.3) % 360;
    updatePanorama();
  }, { passive: false });
}

// Update panorama visual based on rotation
function updatePanorama() {
  const canvas = document.getElementById('panorama-canvas');
  const normalizedY = ((rotationY % 360) + 360) % 360;
  const bgPosX = (normalizedY / 360) * 100;
  const bgPosY = 50 + rotationX * 0.5;

  canvas.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
  canvas.style.transform = `scale(${scale})`;

  // Update hotspot positions slightly with drag (parallax)
  document.querySelectorAll('.hotspot').forEach(hs => {
    const baseX = parseFloat(hs.dataset.baseX || hs.style.left);
    if (!hs.dataset.baseX) hs.dataset.baseX = hs.style.left;
    hs.style.left = `calc(${hs.dataset.baseX} - ${bgPosX * 0.05}px)`;
  });

  // Update compass
  const needle = document.getElementById('compass-needle');
  if (needle) {
    needle.style.transform = `translate(-50%, -100%) rotate(${-rotationY * 0.5}deg)`;
  }
}

// Tour controls
function initControls() {
  document.getElementById('ctrl-zoom-in').addEventListener('click', () => {
    scale = Math.min(2, scale + 0.1);
    updatePanorama();
  });

  document.getElementById('ctrl-zoom-out').addEventListener('click', () => {
    scale = Math.max(0.8, scale - 0.1);
    updatePanorama();
  });

  document.getElementById('ctrl-reset').addEventListener('click', () => {
    rotationX = 0;
    rotationY = 0;
    scale = 1;
    compassAngle = 0;
    updatePanorama();
    showToast('View reset', 'info', 1500);
  });

  const autoBtn = document.getElementById('ctrl-auto-rotate');
  autoBtn.addEventListener('click', () => {
    autoRotate = !autoRotate;
    autoBtn.textContent = autoRotate ? '⏸️' : '▶️';
    autoBtn.setAttribute('aria-label', autoRotate ? 'Stop auto rotate' : 'Auto rotate');
    if (autoRotate) startAutoRotate();
    else stopAutoRotate();
  });

  document.getElementById('ctrl-fullscreen').addEventListener('click', () => {
    const viewer = document.getElementById('tour-viewer');
    if (!document.fullscreenElement) {
      viewer.requestFullscreen?.().catch(() => {});
      showToast('Press Esc to exit fullscreen', 'info', 2000);
    } else {
      document.exitFullscreen?.();
    }
  });
}

function startAutoRotate() {
  if (autoRotateTimer) return;
  autoRotateTimer = setInterval(() => {
    rotationY += 0.3;
    compassAngle = (compassAngle + 0.3) % 360;
    updatePanorama();
  }, 16);
}

function stopAutoRotate() {
  clearInterval(autoRotateTimer);
  autoRotateTimer = null;
}

// Search
function initSearch() {
  const input = document.getElementById('monastery-search');
  input.addEventListener('input', () => {
    const query = input.value.toLowerCase();
    document.querySelectorAll('.monastery-list-item').forEach(item => {
      const name = item.querySelector('.monastery-list-name').textContent.toLowerCase();
      item.style.display = name.includes(query) ? '' : 'none';
    });
  });
}
