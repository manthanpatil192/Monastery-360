// =============================================
// SPATIAL TOUR.JS — VisionOS Apple VR Goggle Experience
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initSpatialTour();
});

// Scene definitions per monastery with waypoints & spatial depth
const SCENES = {
  rumtek: [
    { id: 'entrance', name: '🚪 Grand Entrance Gate', bg: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 30%, #1a0a00 100%)', bgImg: 'assets/images/rumtek.png' },
    { id: 'courtyard', name: '👣 Prayer Wheel Courtyard', bg: 'linear-gradient(135deg, #200a00 0%, #4a1c00 50%, #1a0500 100%)', bgImg: 'assets/images/rumtek.png' },
    { id: 'prayer-hall', name: '🪔 Sacred Shrine Hall', bg: 'linear-gradient(135deg, #1a0500 0%, #2d0000 40%, #4a1500 100%)', bgImg: 'assets/images/interior.png' },
    { id: 'rooftop', name: '🌄 Mountain View Rooftop', bg: 'linear-gradient(135deg, #000820 0%, #001a40 50%, #002060 100%)', bgImg: 'assets/images/rumtek.png' },
  ],
  pemayangtse: [
    { id: 'entrance', name: '🚪 Ancient Gateway', bg: 'linear-gradient(135deg, #150a00 0%, #2a1500 50%, #1a0800 100%)', bgImg: 'assets/images/pemayangtse.png' },
    { id: 'shrine', name: '🪔 Main Shrine', bg: 'linear-gradient(135deg, #1a0000 0%, #300000 50%, #200010 100%)', bgImg: 'assets/images/interior.png' },
    { id: 'terrace', name: '🌄 Roof Terrace', bg: 'linear-gradient(135deg, #001030 0%, #002050 60%, #00103a 100%)', bgImg: 'assets/images/pemayangtse.png' },
  ],
  tashiding: [
    { id: 'stupa', name: '☸️ Sacred Stupa Path', bg: 'linear-gradient(135deg, #100010 0%, #200030 50%, #180020 100%)', bgImg: 'assets/images/tashiding.png' },
    { id: 'hilltop', name: '⛰️ Hilltop Sanctuary', bg: 'linear-gradient(135deg, #001020 0%, #002540 60%, #001830 100%)', bgImg: 'assets/images/tashiding.png' },
    { id: 'bumchu', name: '🫙 Bumchu Shrine', bg: 'linear-gradient(135deg, #0a0a00 0%, #1a1500 50%, #100d00 100%)', bgImg: 'assets/images/interior.png' },
  ],
  enchey: [
    { id: 'courtyard', name: '🎭 Dance Courtyard', bg: 'linear-gradient(135deg, #001020 0%, #001a30 50%, #000f20 100%)', bgImg: 'assets/images/enchey.png' },
    { id: 'shrine', name: '🙏 Main Shrine', bg: 'linear-gradient(135deg, #1a0500 0%, #300a00 50%, #1a0300 100%)', bgImg: 'assets/images/interior.png' },
    { id: 'deck', name: '🌄 Observation Deck', bg: 'linear-gradient(135deg, #000515 0%, #000a25 50%, #000518 100%)', bgImg: 'assets/images/enchey.png' },
  ],
};

// Spatial Hotspots & Walk Waypoints
const SPATIAL_ELEMENTS = {
  'rumtek_entrance': {
    waypoints: [
      { x: 50, y: 75, targetScene: 'courtyard', label: '👣 Walk to Courtyard', icon: '🐾' },
      { x: 65, y: 48, targetScene: 'prayer-hall', label: '🚪 Step Inside Shrine', icon: '🛕' },
    ],
    hotspots: [
      { x: 30, y: 42, icon: '🏯', label: 'Main Archway', title: 'The Grand Entrance Arch', desc: 'Hand-carved wooden beams with traditional Tibetan auspicious dragons welcoming pilgrims.', img: 'assets/images/rumtek.png' },
      { x: 75, y: 35, icon: '🔔', label: 'Sacred Bell', title: 'Resonant Temple Bell', desc: 'Rung during dawn and dusk ceremonies. The sound carries across the valley.', img: 'assets/images/interior.png' },
    ]
  },
  'rumtek_courtyard': {
    waypoints: [
      { x: 50, y: 70, targetScene: 'prayer-hall', label: '🪔 Enter Prayer Hall', icon: '👣' },
      { x: 80, y: 45, targetScene: 'rooftop', label: '🌄 Climb to Rooftop', icon: '🧗‍♂️' },
      { x: 20, y: 65, targetScene: 'entrance', label: '🚪 Walk Back to Gate', icon: '⬅️' },
    ],
    hotspots: [
      { x: 45, y: 40, icon: '☸️', label: 'Golden Prayer Wheels', title: 'Mani Wheels', desc: 'Spun clockwise by monks reciting "Om Mani Padme Hum".', img: 'assets/images/rumtek.png' }
    ]
  },
  'rumtek_prayer-hall': {
    waypoints: [
      { x: 50, y: 78, targetScene: 'courtyard', label: '👣 Exit to Courtyard', icon: '🚪' },
    ],
    hotspots: [
      { x: 50, y: 38, icon: '🪔', label: 'Golden Altar', title: 'Central Buddha Altar', desc: 'Houses sacred relics, golden Buddha statues, and glowing butter lamps.', img: 'assets/images/interior.png' },
      { x: 25, y: 50, icon: '📜', label: 'Thangka Scrolls', title: 'Sacred Wall Scrolls', desc: 'Century-old silk scroll paintings depicting enlightened masters.', img: 'assets/images/interior.png' },
      { x: 75, y: 48, icon: '📚', label: 'Scripture Vault', title: 'Kangyur Scriptures', desc: 'Over 5,000 hand-printed sacred Buddhist canons.', img: 'assets/images/interior.png' }
    ]
  }
};

// Global Spatial State
let currentMonastery = null;
let currentScene = null;
let rotationX = 0;
let rotationY = 0;
let cameraScale = 1;
let cameraZ = 0;
let isDragging = false;
let startMouseX = 0, startMouseY = 0;
let isAutoWalking = false;
let autoWalkTimer = null;
let audioEnabled = true;

// Web Audio Synthesizer for Footstep / Spatial Feedback
let audioCtx = null;

function initSpatialTour() {
  initReticleTracking();
  renderMonasteryList();
  loadMonastery(MONASTERIES[0]);
  initSpatialMousePan();
  initWalkControls();
  initSpatialKeyboard();
  initControls();
  initSearch();
}

// -------------------------------------------------------------
// VISION OS SPATIAL RETICLE (EYE TRACKING CURSOR)
// -------------------------------------------------------------
function initReticleTracking() {
  const reticle = document.getElementById('spatial-reticle');
  if (!reticle) return;

  let reticleX = window.innerWidth / 2;
  let reticleY = window.innerHeight / 2;
  let mouseX = reticleX;
  let mouseY = reticleY;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth lerp follow cursor
  function animateReticle() {
    reticleX += (mouseX - reticleX) * 0.25;
    reticleY += (mouseY - reticleY) * 0.25;
    reticle.style.left = `${reticleX}px`;
    reticle.style.top = `${reticleY}px`;
    requestAnimationFrame(animateReticle);
  }
  animateReticle();

  // Detect hover on interactive spatial elements
  document.addEventListener('mouseover', e => {
    const interactive = e.target.closest('button, .monastery-list-item, .waypoint-marker, .hotspot, .spatial-btn, .walk-btn');
    if (interactive) {
      reticle.classList.add('hovering');
    } else {
      reticle.classList.remove('hovering');
    }
  });

  document.addEventListener('mousedown', () => reticle.classList.add('pinching'));
  document.addEventListener('mouseup', () => reticle.classList.remove('pinching'));
}

// -------------------------------------------------------------
// MONASTERY & SCENE LOAD
// -------------------------------------------------------------
function renderMonasteryList() {
  const list = document.getElementById('monastery-list');
  list.innerHTML = '';

  MONASTERIES.forEach(m => {
    const item = document.createElement('div');
    item.className = 'monastery-list-item';
    item.setAttribute('data-id', m.id);
    item.innerHTML = `
      <img src="${m.image}" alt="${m.name}" style="width:48px;height:48px;border-radius:10px;object-fit:cover" />
      <div style="flex:1;min-width:0">
        <div style="font-size:0.85rem;font-weight:600;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.name}</div>
        <div style="font-size:0.72rem;color:var(--clr-text-muted)">📍 ${m.district}</div>
      </div>
    `;
    item.addEventListener('click', () => loadMonastery(m));
    list.appendChild(item);
  });
}

function loadMonastery(monastery) {
  currentMonastery = monastery;

  document.querySelectorAll('.monastery-list-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === monastery.id);
  });

  const nameEl = document.getElementById('monastery-name');
  if (nameEl) nameEl.textContent = monastery.name;

  const scenes = SCENES[monastery.id] || SCENES.rumtek;
  renderSceneTabs(scenes);
  loadScene(scenes[0]);
}

function renderSceneTabs(scenes) {
  const container = document.getElementById('scene-tabs');
  if (!container) return;
  container.innerHTML = '';

  scenes.forEach((sc, i) => {
    const btn = document.createElement('button');
    btn.className = `scene-tab ${i === 0 ? 'active' : ''}`;
    btn.textContent = sc.name;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scene-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      performWalkTransition(() => loadScene(sc));
    });
    container.appendChild(btn);
  });
}

function loadScene(scene) {
  currentScene = scene;
  const canvas = document.getElementById('panorama-canvas');

  canvas.style.background = scene.bg;
  canvas.style.backgroundImage = `url('${scene.bgImg}')`;
  canvas.style.backgroundSize = 'cover';

  rotationX = 0;
  rotationY = 0;
  cameraScale = 1;
  cameraZ = 0;

  updateSpatialStage();

  // Render Waypoints & Hotspots
  const sceneKey = `${currentMonastery.id}_${scene.id}`;
  const data = SPATIAL_ELEMENTS[sceneKey] || generateDefaultSpatial(currentMonastery, scene);
  renderWaypointsAndHotspots(data);

  closeInfoPanel();
  playSpatialChime();
}

function generateDefaultSpatial(monastery, scene) {
  const scenes = SCENES[monastery.id] || SCENES.rumtek;
  const nextScene = scenes.find(s => s.id !== scene.id) || scenes[0];

  return {
    waypoints: [
      { x: 50, y: 70, targetScene: nextScene.id, label: `👣 Step into ${nextScene.name}`, icon: '🐾' }
    ],
    hotspots: monastery.hotspots.slice(0, 2).map((hs, i) => ({
      x: 30 + i * 40,
      y: 45,
      icon: ['🏯', '🪔'][i % 2],
      label: hs,
      title: hs,
      desc: `Sacred spot at ${monastery.name}.`,
      img: monastery.image
    }))
  };
}

// -------------------------------------------------------------
// RENDER SPATIAL WAYPOINTS & HOTSPOTS
// -------------------------------------------------------------
function renderWaypointsAndHotspots(data) {
  const container = document.getElementById('hotspots-container');
  container.innerHTML = '';

  // Render Walk Waypoints (Moving in 3D Space)
  if (data.waypoints) {
    data.waypoints.forEach(wp => {
      const el = document.createElement('div');
      el.className = 'waypoint-marker';
      el.style.left = `${wp.x}%`;
      el.style.top = `${wp.y}%`;
      el.innerHTML = `
        <div class="waypoint-badge">
          <div class="waypoint-icon">${wp.icon}</div>
          <span>${wp.label}</span>
        </div>
      `;
      el.addEventListener('click', () => {
        const scenes = SCENES[currentMonastery.id] || SCENES.rumtek;
        const target = scenes.find(s => s.id === wp.targetScene) || scenes[0];
        performWalkTransition(() => loadScene(target));
      });
      container.appendChild(el);
    });
  }

  // Render Hotspots
  if (data.hotspots) {
    data.hotspots.forEach(hs => {
      const el = document.createElement('div');
      el.className = 'hotspot';
      el.style.left = `${hs.x}%`;
      el.style.top = `${hs.y}%`;
      el.innerHTML = `
        <button class="hotspot-btn">
          <span>${hs.icon}</span>
        </button>
        <div class="hotspot-label">${hs.label}</div>
      `;
      el.addEventListener('click', () => openInfoPanel(hs));
      container.appendChild(el);
    });
  }
}

// -------------------------------------------------------------
// REAL 3D WALKING DISPLACEMENT ANIMATION
// -------------------------------------------------------------
function performWalkTransition(callback) {
  const stage = document.getElementById('panorama-stage');
  if (!stage) { if (callback) callback(); return; }

  playFootstepSound();
  stage.classList.add('stepping-forward');

  setTimeout(() => {
    if (callback) callback();
    stage.classList.remove('stepping-forward');
    stage.style.transform = 'scale(1)';
  }, 600);
}

function stepForward() {
  playFootstepSound();
  cameraZ += 40;
  cameraScale = Math.min(1.8, cameraScale + 0.08);
  triggerWalkBob();
  updateSpatialStage();
  showToast('👣 Walking forward...', 'info', 800);
}

function stepBackward() {
  playFootstepSound();
  cameraZ = Math.max(-50, cameraZ - 40);
  cameraScale = Math.max(0.9, cameraScale - 0.08);
  triggerWalkBob();
  updateSpatialStage();
  showToast('👣 Stepping back...', 'info', 800);
}

function turnLeft() {
  rotationY -= 15;
  updateSpatialStage();
}

function turnRight() {
  rotationY += 15;
  updateSpatialStage();
}

function triggerWalkBob() {
  const stage = document.getElementById('panorama-stage');
  stage.classList.add('walking');
  setTimeout(() => stage.classList.remove('walking'), 600);
}

// -------------------------------------------------------------
// SPATIAL MOUSE PARALLAX & DRAG CONTROLS
// -------------------------------------------------------------
function initSpatialMousePan() {
  const viewer = document.getElementById('tour-viewer');

  // VisionOS Mouse Depth Parallax
  viewer.addEventListener('mousemove', e => {
    if (isDragging) return;
    const rect = viewer.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    // Subtle 3D Gyro Tilt effect on spatial stage
    const tiltX = relY * -12;
    const tiltY = relX * 16;
    const stage = document.getElementById('panorama-stage');
    stage.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY + rotationY * 0.2}deg) scale(${cameraScale}) translateZ(${cameraZ}px)`;
  });

  // Drag Panning
  viewer.addEventListener('mousedown', e => {
    isDragging = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const dx = e.clientX - startMouseX;
    const dy = e.clientY - startMouseY;
    startMouseX = e.clientX;
    startMouseY = e.clientY;

    rotationY += dx * 0.25;
    rotationX = Math.max(-30, Math.min(30, rotationX - dy * 0.2));
    updateSpatialStage();
  });

  window.addEventListener('mouseup', () => isDragging = false);
}

function updateSpatialStage() {
  const canvas = document.getElementById('panorama-canvas');
  const stage = document.getElementById('panorama-stage');

  const bgPosX = (((rotationY % 360) + 360) % 360) / 3.6;
  const bgPosY = 50 + rotationX * 0.4;

  canvas.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
  stage.style.transform = `scale(${cameraScale}) translateZ(${cameraZ}px)`;
}

// -------------------------------------------------------------
// KEYBOARD CONTROLS (W / A / S / D / ARROWS)
// -------------------------------------------------------------
function initSpatialKeyboard() {
  window.addEventListener('keydown', e => {
    if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
      stepForward();
    } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
      stepBackward();
    } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
      turnLeft();
    } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
      turnRight();
    }
  });
}

function initWalkControls() {
  document.getElementById('walk-forward')?.addEventListener('click', stepForward);
  document.getElementById('walk-backward')?.addEventListener('click', stepBackward);
  document.getElementById('walk-left')?.addEventListener('click', turnLeft);
  document.getElementById('walk-right')?.addEventListener('click', turnRight);
}

// -------------------------------------------------------------
// SPATIAL CONTROLS BAR
// -------------------------------------------------------------
function initControls() {
  document.getElementById('ctrl-zoom-in')?.addEventListener('click', () => {
    cameraScale = Math.min(2, cameraScale + 0.15);
    updateSpatialStage();
  });

  document.getElementById('ctrl-zoom-out')?.addEventListener('click', () => {
    cameraScale = Math.max(0.8, cameraScale - 0.15);
    updateSpatialStage();
  });

  document.getElementById('ctrl-reset')?.addEventListener('click', () => {
    rotationX = 0; rotationY = 0; cameraScale = 1; cameraZ = 0;
    updateSpatialStage();
    showToast('Spatial position reset', 'info', 1200);
  });

  const walkBtn = document.getElementById('ctrl-walk');
  walkBtn?.addEventListener('click', () => {
    isAutoWalking = !isAutoWalking;
    walkBtn.classList.toggle('active', isAutoWalking);
    if (isAutoWalking) {
      showToast('Auto Walk Mode Activated 🚶‍♂️', 'info', 2000);
      autoWalkTimer = setInterval(() => {
        stepForward();
        rotationY += 0.5;
      }, 1500);
    } else {
      clearInterval(autoWalkTimer);
      showToast('Auto Walk Paused', 'info', 1200);
    }
  });

  const audioBtn = document.getElementById('ctrl-audio');
  audioBtn?.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    audioBtn.classList.toggle('active', audioEnabled);
    const status = document.getElementById('spatial-sound-status');
    if (status) status.textContent = audioEnabled ? 'Spatial Audio Active' : 'Audio Muted';
    showToast(audioEnabled ? '🔊 Spatial Audio Enabled' : '🔇 Muted', 'info', 1200);
  });

  document.getElementById('ctrl-fullscreen')?.addEventListener('click', () => {
    const viewer = document.getElementById('tour-viewer');
    if (!document.fullscreenElement) {
      viewer.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  });
}

// -------------------------------------------------------------
// PROCEDURAL WEB AUDIO API (FOOTSTEPS & SACRED CHIMES)
// -------------------------------------------------------------
function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

function playFootstepSound() {
  if (!audioEnabled) return;
  initAudioContext();
  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch(e) {}
}

function playSpatialChime() {
  if (!audioEnabled) return;
  initAudioContext();
  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, audioCtx.currentTime); // 528Hz Solfeggio frequency

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.2);
  } catch(e) {}
}

// -------------------------------------------------------------
// INFO PANEL MODAL
// -------------------------------------------------------------
function openInfoPanel(hs) {
  const modal = document.getElementById('info-panel');
  if (!modal) return;
  document.getElementById('info-panel-title').textContent = hs.title;
  document.getElementById('info-panel-desc').textContent = hs.desc;
  const img = document.getElementById('info-panel-img');
  img.src = hs.img;
  modal.classList.add('open');
}

function closeInfoPanel() {
  document.getElementById('info-panel')?.classList.remove('open');
}

document.getElementById('info-panel-close')?.addEventListener('click', closeInfoPanel);

function initSearch() {
  const input = document.getElementById('monastery-search');
  input?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.monastery-list-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });
}
