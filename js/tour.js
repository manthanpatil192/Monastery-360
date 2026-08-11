// =============================================
// TOUR.JS — 3D VR Ground Standing Engine (Seamless 360 Photorealistic Himalayan View)
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initVRGroundTour();
});

// Scene definitions with photorealistic 8K seamless 360 Photo Spheres
const SCENES = {
  rumtek: [
    { id: 'courtyard', name: '🏰 Main Courtyard', bgImg: 'assets/images/pano_rumtek_courtyard.png' },
    { id: 'shrine', name: '🪔 Shrine Interior', bgImg: 'assets/images/pano_shrine_interior.png' },
    { id: 'pemayangtse', name: '⛰️ Majestic Himalayas', bgImg: 'assets/images/pano_himalayas.png' },
    { id: 'tashiding', name: '☸️ Tashiding Stupa', bgImg: 'assets/images/pano_tashiding.png' }
  ],
  pemayangtse: [
    { id: 'main', name: '⛰️ Himalayan Ridge', bgImg: 'assets/images/pano_himalayas.png' },
    { id: 'shrine', name: '🪔 Sacred Shrine', bgImg: 'assets/images/pano_shrine_interior.png' }
  ],
  tashiding: [
    { id: 'stupa', name: '☸️ Sacred Chortens', bgImg: 'assets/images/pano_tashiding.png' },
    { id: 'courtyard', name: '🏰 Courtyard', bgImg: 'assets/images/pano_rumtek_courtyard.png' }
  ],
  enchey: [
    { id: 'shrine', name: '🪔 Main Shrine', bgImg: 'assets/images/pano_shrine_interior.png' },
    { id: 'courtyard', name: '🏰 Monastery View', bgImg: 'assets/images/pano_rumtek_courtyard.png' }
  ]
};

// 3D Spatial Pins
const SPATIAL_PINS = {
  'rumtek_courtyard': [
    { lat: 10, lon: 45, icon: '🪔', label: 'Step Inside Shrine', targetScene: 'shrine', type: 'waypoint' },
    { lat: -5, lon: -60, icon: '📜', label: 'Main Prayer Flags', title: 'Sacred Wind Flags', desc: 'Prayer flags carrying ancient Sanskrit mantras across the Himalayan mountains.', img: 'assets/images/rumtek.png', type: 'hotspot' },
    { lat: 15, lon: 170, icon: '⛰️', label: 'View Kanchenjunga', title: 'Mount Kanchenjunga View', desc: 'Breath-taking panoramic view of the world\'s 3rd highest mountain peak.', img: 'assets/images/hero.png', type: 'hotspot' }
  ],
  'rumtek_shrine': [
    { lat: 0, lon: 0, icon: '☸️', label: 'Golden Buddha', title: 'The Great Golden Buddha', desc: 'Central golden statue of Buddha Shakyamuni flanked by butter lamps.', img: 'assets/images/interior.png', type: 'hotspot' },
    { lat: -10, lon: 90, icon: '📜', label: 'Ancient Thangkas', title: 'Sacred Thangka Scrolls', desc: 'Hand-painted silk scroll paintings depicting deities and mandalas.', img: 'assets/images/interior.png', type: 'hotspot' },
    { lat: 5, lon: -120, icon: '🚪', label: 'Exit to Courtyard', targetScene: 'courtyard', type: 'waypoint' }
  ],
  'rumtek_pemayangtse': [
    { lat: 0, lon: 30, icon: '🏰', label: 'Explore Pemayangtse', title: 'Pemayangtse Monastery', desc: 'One of the oldest monasteries in Sikkim, established in 1705.', img: 'assets/images/pemayangtse.png', type: 'hotspot' },
    { lat: 10, lon: -80, icon: '🪔', label: 'Enter Shrine', targetScene: 'shrine', type: 'waypoint' }
  ],
  'rumtek_tashiding': [
    { lat: 0, lon: 0, icon: '☸️', label: 'Sacred Stupas', title: 'Tashiding Chortens', desc: 'Ancient white stupas at the holiest site in Sikkim.', img: 'assets/images/tashiding.png', type: 'hotspot' },
    { lat: -10, lon: 100, icon: '🏰', label: 'Walk to Rumtek', targetScene: 'courtyard', type: 'waypoint' }
  ]
};

// Three.js Core Globals
let scene, camera, renderer, stereoEffect, sphereMesh, standingFeetGroup;
let isCardboardMode = false;
let isGyroMode = false;

let currentMonastery = null;
let currentScene = null;
let textureLoader = new THREE.TextureLoader();

// Human Standing Height Constant (1.65 meters standing on ground)
const EYE_HEIGHT = 1.65;
let walkStepCount = 0;

// Camera Control & Damping Physics
let isUserInteracting = false;
let onPointerDownPointerX = 0, onPointerDownPointerY = 0;
let onPointerDownLon = 0, onPointerDownLat = 0;
let lon = 0, lat = 0;
let targetLon = 0, targetLat = 0;
let phi = 0, theta = 0;
let fov = 75;
let targetFov = 75;
let isAutoWalking = false;
let autoWalkTimer = null;

function initVRGroundTour() {
  initThreeJS();
  renderMonasteryList();
  loadMonastery(MONASTERIES[0]);
  initWalkControls();
  initSpatialKeyboard();
  initVRControls();
  initGyroscopeSensor();
  initSearch();

  window.addEventListener('resize', onWindowResize);
}

// -------------------------------------------------------------
// THREE.JS SEAMLESS 360 SPHERICAL ENGINE
// -------------------------------------------------------------
function initThreeJS() {
  const container = document.getElementById('tour-viewer');
  const canvas = document.getElementById('webgl-canvas');

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(fov, container.clientWidth / container.clientHeight, 0.1, 1100);
  
  // Set camera to human standing height (1.65m) above ground level (y=0)
  camera.position.set(0, EYE_HEIGHT, 0);
  camera.target = new THREE.Vector3(0, EYE_HEIGHT, -1);

  // High-segment inner sphere geometry (128x64) for smooth seamless texture mapping
  const geometry = new THREE.SphereGeometry(500, 128, 64);
  geometry.scale(-1, 1, 1);

  const material = new THREE.MeshBasicMaterial({
    map: null,
    transparent: true,
    opacity: 1
  });

  sphereMesh = new THREE.Mesh(geometry, material);
  sphereMesh.position.set(0, EYE_HEIGHT, 0);
  // Rotate initial sphere y-axis to hide seam behind camera start angle
  sphereMesh.rotation.y = Math.PI / 2;
  scene.add(sphereMesh);

  // Add 3D First-Person Standing Feet & Ground Shadow Mesh
  createStandingPersonMesh();

  // WebGL Renderer with High Precision & Smooth Filtering
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  if (typeof THREE.StereoEffect !== 'undefined') {
    stereoEffect = new THREE.StereoEffect(renderer);
    stereoEffect.setSize(container.clientWidth, container.clientHeight);
  }

  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('wheel', onDocumentMouseWheel, { passive: false });

  animate();
}

// -------------------------------------------------------------
// 3D FIRST-PERSON STANDING FEET & GROUND SHADOW MESH
// -------------------------------------------------------------
function createStandingPersonMesh() {
  standingFeetGroup = new THREE.Group();

  // Ground Contact Shadow Disc (y = 0.01)
  const shadowGeo = new THREE.CircleGeometry(0.65, 32);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x05050b,
    transparent: true,
    opacity: 0.6
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.set(0, 0.01, 0);
  standingFeetGroup.add(shadowMesh);

  // Left & Right Boots Standing Visual
  const bootMat = new THREE.MeshBasicMaterial({ color: 0x1f1915 });
  const bootGeo = new THREE.BoxGeometry(0.16, 0.1, 0.34);

  const leftFoot = new THREE.Mesh(bootGeo, bootMat);
  leftFoot.position.set(-0.2, 0.05, 0.1);
  standingFeetGroup.add(leftFoot);

  const rightFoot = new THREE.Mesh(bootGeo, bootMat);
  rightFoot.position.set(0.2, 0.05, 0.1);
  standingFeetGroup.add(rightFoot);

  standingFeetGroup.position.set(0, 0, 0);
  scene.add(standingFeetGroup);
}

// -------------------------------------------------------------
// LOAD MONASTERY & SEAMLESS PHOTO SPHERE TEXTURE
// -------------------------------------------------------------
function renderMonasteryList() {
  const list = document.getElementById('monastery-list');
  if (!list) return;
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

function loadScene(sc) {
  currentScene = sc;

  textureLoader.load(sc.bgImg, (texture) => {
    // Configure texture mapping to eliminate vertical seam line
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    sphereMesh.material.map = texture;
    sphereMesh.material.needsUpdate = true;
    showToast(`Standing on ground at ${sc.name}`, 'info', 1200);
  });

  const key = `${currentMonastery.id}_${sc.id}`;
  const pins = SPATIAL_PINS[key] || generateDefaultPins(currentMonastery, sc);
  renderSpatialPins(pins);

  // Reset ground position
  camera.position.set(0, EYE_HEIGHT, 0);
  if (standingFeetGroup) standingFeetGroup.position.set(0, 0, 0);

  closeInfoPanel();
}

function generateDefaultPins(monastery, sc) {
  const scenes = SCENES[monastery.id] || SCENES.rumtek;
  const nextScene = scenes.find(s => s.id !== sc.id) || scenes[0];
  return [
    { lat: 0, lon: 0, icon: '👣', label: `Step into ${nextScene.name}`, targetScene: nextScene.id, type: 'waypoint' },
    { lat: 10, lon: 90, icon: '🪔', label: monastery.name, title: monastery.name, desc: monastery.description, img: monastery.image, type: 'hotspot' }
  ];
}

// -------------------------------------------------------------
// 3D SPATIAL PINS PROJECTION
// -------------------------------------------------------------
function renderSpatialPins(pins) {
  const container = document.getElementById('spatial-pins-container');
  if (!container) return;
  container.innerHTML = '';

  pins.forEach(pin => {
    const el = document.createElement('div');
    el.className = 'spatial-pin';
    el.dataset.lat = pin.lat;
    el.dataset.lon = pin.lon;

    el.innerHTML = `
      <div class="pin-card">
        <div class="pin-icon">${pin.icon}</div>
        <span>${pin.label}</span>
      </div>
    `;

    if (pin.type === 'waypoint') {
      el.addEventListener('click', () => {
        const scenes = SCENES[currentMonastery.id] || SCENES.rumtek;
        const target = scenes.find(s => s.id === pin.targetScene) || scenes[0];
        performWalkTransition(() => loadScene(target));
      });
    } else {
      el.addEventListener('click', () => openInfoPanel(pin));
    }

    container.appendChild(el);
  });
}

function updateSpatialPins() {
  const container = document.getElementById('spatial-pins-container');
  if (!container) return;

  if (isCardboardMode) {
    container.style.display = 'none';
    return;
  }
  container.style.display = '';

  const pins = container.children;
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;

  for (let i = 0; i < pins.length; i++) {
    const pin = pins[i];
    const latDeg = parseFloat(pin.dataset.lat);
    const lonDeg = parseFloat(pin.dataset.lon);

    const phiRad = THREE.MathUtils.degToRad(90 - latDeg);
    const thetaRad = THREE.MathUtils.degToRad(lonDeg);

    const targetVector = new THREE.Vector3();
    targetVector.setFromSphericalCoords(450, phiRad, thetaRad);
    targetVector.add(camera.position);

    const screenVector = targetVector.clone().project(camera);

    if (screenVector.z > 1 || screenVector.z < -1) {
      pin.classList.add('hidden');
      continue;
    }

    pin.classList.remove('hidden');
    const x = (screenVector.x * widthHalf) + widthHalf;
    const y = -(screenVector.y * heightHalf) + heightHalf;

    pin.style.left = `${x}px`;
    pin.style.top = `${y}px`;
  }
}

// -------------------------------------------------------------
// REAL GROUND WALKING STEP MECHANICS
// -------------------------------------------------------------
function performWalkTransition(callback) {
  if (window.TWEEN) {
    new TWEEN.Tween(camera)
      .to({ fov: 40 }, 400)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => camera.updateProjectionMatrix())
      .onComplete(() => {
        if (callback) callback();
        new TWEEN.Tween(camera)
          .to({ fov: 75 }, 500)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => camera.updateProjectionMatrix())
          .start();
      })
      .start();
  } else {
    if (callback) callback();
  }
}

function stepForward() {
  walkStepCount += 1;
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  dir.y = 0; // Strictly on ground floor
  dir.normalize();

  camera.position.addScaledVector(dir, 1.2);
  camera.position.y = EYE_HEIGHT + Math.sin(walkStepCount * 0.8) * 0.06;

  if (standingFeetGroup) standingFeetGroup.position.set(camera.position.x, 0, camera.position.z);
  if (sphereMesh) sphereMesh.position.set(camera.position.x, EYE_HEIGHT, camera.position.z);

  showToast('👣 Stepping forward on ground...', 'info', 800);
}

function stepBackward() {
  walkStepCount += 1;
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  dir.y = 0;
  dir.normalize();

  camera.position.addScaledVector(dir, -1.2);
  camera.position.y = EYE_HEIGHT + Math.sin(walkStepCount * 0.8) * 0.06;

  if (standingFeetGroup) standingFeetGroup.position.set(camera.position.x, 0, camera.position.z);
  if (sphereMesh) sphereMesh.position.set(camera.position.x, EYE_HEIGHT, camera.position.z);

  showToast('👣 Stepping back...', 'info', 800);
}

function turnLeft() { targetLon -= 15; }
function turnRight() { targetLon += 15; }

// -------------------------------------------------------------
// ANIMATION LOOP & GOOGLE CARDBOARD RENDER
// -------------------------------------------------------------
function animate(time) {
  requestAnimationFrame(animate);

  if (window.TWEEN) TWEEN.update(time);

  // Smooth Inertia Damping
  lon += (targetLon - lon) * 0.08;
  lat += (targetLat - lat) * 0.08;
  fov += (targetFov - fov) * 0.08;

  camera.fov = fov;
  camera.updateProjectionMatrix();

  lat = Math.max(-85, Math.min(85, lat));
  phi = THREE.MathUtils.degToRad(90 - lat);
  theta = THREE.MathUtils.degToRad(lon);

  camera.target.x = camera.position.x + 500 * Math.sin(phi) * Math.cos(theta);
  camera.target.y = camera.position.y + 500 * Math.cos(phi);
  camera.target.z = camera.position.z + 500 * Math.sin(phi) * Math.sin(theta);

  camera.lookAt(camera.target);

  updateSpatialPins();

  if (isCardboardMode && stereoEffect) {
    stereoEffect.render(scene, camera);
  } else {
    renderer.render(scene, camera);
  }
}

// -------------------------------------------------------------
// GYROSCOPE & CONTROLS
// -------------------------------------------------------------
function initGyroscopeSensor() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (!isGyroMode) return;
      if (e.alpha !== null && e.beta !== null) {
        targetLon = e.alpha;
        targetLat = e.beta - 45;
      }
    }, true);
  }
}

function initVRControls() {
  const cardboardBtn = document.getElementById('ctrl-cardboard');
  cardboardBtn?.addEventListener('click', () => {
    isCardboardMode = !isCardboardMode;
    cardboardBtn.classList.toggle('active', isCardboardMode);
    document.getElementById('cardboard-overlay')?.classList.toggle('active', isCardboardMode);

    if (isCardboardMode) {
      if (!document.fullscreenElement) {
        document.getElementById('tour-viewer')?.requestFullscreen?.().catch(() => {});
      }
      showToast('🥽 Google Cardboard VR Mode Active', 'info', 2500);
    } else {
      showToast('Exited Google Cardboard Mode', 'info', 1200);
    }
    onWindowResize();
  });

  const gyroBtn = document.getElementById('ctrl-gyro');
  gyroBtn?.addEventListener('click', () => {
    isGyroMode = !isGyroMode;
    gyroBtn.classList.toggle('active', isGyroMode);
    showToast(isGyroMode ? '📱 Gyro Motion Head Tracking Active' : 'Gyro Tracking Off', 'info', 1500);
  });

  document.getElementById('ctrl-zoom-in')?.addEventListener('click', () => { targetFov = Math.max(30, targetFov - 15); });
  document.getElementById('ctrl-zoom-out')?.addEventListener('click', () => { targetFov = Math.min(100, targetFov + 15); });

  document.getElementById('ctrl-reset')?.addEventListener('click', () => {
    targetLon = 0; targetLat = 0; targetFov = 75;
    camera.position.set(0, EYE_HEIGHT, 0);
    if (standingFeetGroup) standingFeetGroup.position.set(0, 0, 0);
    showToast('VR Camera Reset to Eye Level', 'info', 1200);
  });

  const walkBtn = document.getElementById('ctrl-walk');
  walkBtn?.addEventListener('click', () => {
    isAutoWalking = !isAutoWalking;
    walkBtn.classList.toggle('active', isAutoWalking);
    if (isAutoWalking) {
      showToast('Auto Walk Activated 🚶‍♂️', 'info', 2000);
      autoWalkTimer = setInterval(() => { stepForward(); }, 1500);
    } else {
      clearInterval(autoWalkTimer);
      showToast('Auto Walk Paused', 'info', 1200);
    }
  });

  document.getElementById('ctrl-fullscreen')?.addEventListener('click', () => {
    const viewer = document.getElementById('tour-viewer');
    if (!document.fullscreenElement) viewer.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  });
}

function onPointerDown(event) {
  if (event.isPrimary === false) return;
  isUserInteracting = true;
  onPointerDownPointerX = event.clientX;
  onPointerDownPointerY = event.clientY;
  onPointerDownLon = lon;
  onPointerDownLat = lat;

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
}

function onPointerMove(event) {
  if (event.isPrimary === false || !isUserInteracting) return;
  targetLon = (onPointerDownPointerX - event.clientX) * 0.18 + onPointerDownLon;
  targetLat = (event.clientY - onPointerDownPointerY) * 0.18 + onPointerDownLat;
}

function onPointerUp(event) {
  if (event.isPrimary === false) return;
  isUserInteracting = false;
  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp);
}

function onDocumentMouseWheel(event) {
  event.preventDefault();
  targetFov = Math.max(30, Math.min(100, targetFov + event.deltaY * 0.05));
}

function onWindowResize() {
  const container = document.getElementById('tour-viewer');
  if (!container || !renderer || !camera) return;

  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);

  if (stereoEffect) {
    stereoEffect.setSize(container.clientWidth, container.clientHeight);
  }
}

function initSpatialKeyboard() {
  window.addEventListener('keydown', e => {
    if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') stepForward();
    else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') stepBackward();
    else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') turnLeft();
    else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') turnRight();
  });
}

function initWalkControls() {
  document.getElementById('walk-forward')?.addEventListener('click', stepForward);
  document.getElementById('walk-backward')?.addEventListener('click', stepBackward);
  document.getElementById('walk-left')?.addEventListener('click', turnLeft);
  document.getElementById('walk-right')?.addEventListener('click', turnRight);
}

function openInfoPanel(pin) {
  const modal = document.getElementById('info-panel');
  if (!modal) return;
  document.getElementById('info-panel-title').textContent = pin.title;
  document.getElementById('info-panel-desc').textContent = pin.desc;
  const img = document.getElementById('info-panel-img');
  img.src = pin.img;
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
      item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}
