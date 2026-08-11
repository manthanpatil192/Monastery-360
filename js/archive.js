// =============================================
// ARCHIVE.JS — Digital Archive Gallery Logic
// =============================================

const ARCHIVE_ITEMS = [
  { id: 1, title: 'Kangchenjunga Mandala', category: 'mural', monastery: 'Rumtek', year: '18th Century', img: 'assets/images/interior.png', desc: 'An exquisite mandala representing Mount Kangchenjunga as the divine protector of Sikkim. Painted with natural pigments on cloth.', medium: 'Mineral pigments on cloth', dimensions: '120 × 120 cm', condition: 'Good', height: 300 },
  { id: 2, title: 'Prajnaparamita Manuscript', category: 'manuscript', monastery: 'Pemayangtse', year: '16th Century', img: 'assets/images/interior.png', desc: 'A rare palm-leaf manuscript of the Prajnaparamita Sutra in Sanskrit, illuminated with gold ink. One of the oldest texts in the monastery\'s collection.', medium: 'Gold ink on palm leaf', dimensions: '60 × 15 cm', condition: 'Fair — partially restored', height: 200 },
  { id: 3, title: 'Ancient Prayer Hall View', category: 'photo', monastery: 'Tashiding', year: 'c. 1920', img: 'assets/images/interior.png', desc: 'One of the earliest photographic records of Tashiding Monastery\'s main prayer hall. Captured by a British expedition.', medium: 'Gelatin silver print', dimensions: '25 × 20 cm', condition: 'Excellent — digitally restored', height: 250 },
  { id: 4, title: 'Guru Rinpoche Thangka', category: 'mural', monastery: 'Enchey', year: '19th Century', img: 'assets/images/interior.png', desc: 'A magnificent thangka painting of Guru Padmasambhava in his eight manifestations, surrounded by rainbow light and lotus flowers.', medium: 'Natural pigments and gold on silk', dimensions: '90 × 140 cm', condition: 'Very Good', height: 380 },
  { id: 5, title: 'Ritual Bell & Dorje Set', category: 'artifact', monastery: 'Rumtek', year: '17th Century', img: 'assets/images/interior.png', desc: 'A sacred pair of ritual bell (ghanta) and thunderbolt scepter (dorje) used in tantric ceremonies. Cast in bronze with intricate Sanskrit engravings.', medium: 'Cast bronze', dimensions: 'Bell: 18cm height', condition: 'Excellent', height: 220 },
  { id: 6, title: 'Losar Festival Procession', category: 'photo', monastery: 'Pemayangtse', year: '1975', img: 'assets/images/interior.png', desc: 'Monks in ceremonial robes carrying sacred objects during the Losar (New Year) procession at Pemayangtse Monastery.', medium: 'Color photograph', dimensions: '30 × 20 cm', condition: 'Good', height: 200 },
  { id: 7, title: 'Kalachakra Tantra Pages', category: 'manuscript', monastery: 'Tashiding', year: '15th Century', img: 'assets/images/interior.png', desc: 'Rare illuminated pages from the Kalachakra Tantra, one of the most sacred texts in Tibetan Buddhism. Contains detailed astronomical calculations.', medium: 'Ink and gold on vellum', dimensions: '45 × 30 cm each', condition: 'Fragile — under preservation', height: 280 },
  { id: 8, title: 'The Wheel of Life', category: 'mural', monastery: 'Ralang', year: '18th Century', img: 'assets/images/interior.png', desc: 'A detailed depiction of the Bhavachakra (Wheel of Life) showing the six realms of existence and the twelve links of dependent origination.', medium: 'Fresco on plaster', dimensions: '200 × 200 cm', condition: 'Good — partially restored', height: 340 },
  { id: 9, title: 'Ceremonial Butter Lamps', category: 'artifact', monastery: 'Enchey', year: '18th Century', img: 'assets/images/interior.png', desc: 'A set of seven golden butter lamps representing the seven offerings to the Buddha. Crafted in gold-plated copper with intricate floral designs.', medium: 'Gold-plated copper', dimensions: 'Various sizes, 15-45cm', condition: 'Very Good', height: 240 },
  { id: 10, title: 'Monastery Panorama 1935', category: 'photo', monastery: 'Rumtek', year: '1935', img: 'assets/images/rumtek.png', desc: 'A panoramic photograph of Rumtek Monastery taken during the reign of Chogyal Tashi Namgyal. Shows the original structure before restoration.', medium: 'Black & white photograph', dimensions: '50 × 15 cm', condition: 'Good — digitally enhanced', height: 180 },
  { id: 11, title: 'Green Tara Statue', category: 'artifact', monastery: 'Pemayangtse', year: '16th Century', img: 'assets/images/interior.png', desc: 'A magnificent bronze statue of Green Tara in the traditional seated position. One of the oldest religious objects in the monastery.', medium: 'Bronze with mineral pigments', dimensions: '45cm height', condition: 'Excellent', height: 260 },
  { id: 12, title: 'Cham Dance Costume', category: 'artifact', monastery: 'Enchey', year: 'Early 20th Century', img: 'assets/images/interior.png', desc: 'A complete ceremonial Cham dance costume including the ornate mask, robes, and accessories used in the annual masked dance performances.', medium: 'Silk brocade, metal, papier-mâché', dimensions: 'Full outfit', condition: 'Fair — undergoing conservation', height: 300 },
];

let currentItems = [...ARCHIVE_ITEMS];
let currentFilter = 'all';
let lightboxIdx = 0;

document.addEventListener('DOMContentLoaded', () => {
  renderArchive(ARCHIVE_ITEMS);
  initTabs();
  initSearch();
  initLightbox();
});

function renderArchive(items) {
  const grid = document.getElementById('archive-grid');
  grid.innerHTML = '';

  items.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'archive-item reveal';
    el.dataset.delay = (i % 3) * 80;
    el.setAttribute('role', 'listitem');
    el.setAttribute('aria-label', item.title);
    el.style.setProperty('--item-height', item.height + 'px');

    el.innerHTML = `
      <div style="position:relative;overflow:hidden">
        <img src="${item.img}" alt="${item.title}" class="archive-item-img" style="height:${item.height * 0.6}px;object-fit:cover" loading="lazy" />
        <button class="archive-item-view-btn" aria-label="View ${item.title}">👁</button>
        <div class="archive-item-overlay">
          <p class="archive-item-category">${getCategoryLabel(item.category)}</p>
          <h3 class="archive-item-title">${item.title}</h3>
        </div>
      </div>
      <div class="archive-item-info">
        <p class="archive-item-category">${getCategoryLabel(item.category)}</p>
        <h3 class="archive-item-title">${item.title}</h3>
        <p class="archive-item-meta">📍 ${item.monastery} · ${item.year}</p>
      </div>
    `;

    el.addEventListener('click', () => openLightbox(i));
    grid.appendChild(el);
  });

  if (typeof initScrollReveal === 'function') initScrollReveal();
}

function getCategoryLabel(cat) {
  const labels = {
    manuscript: '📜 Manuscript',
    mural: '🎨 Mural / Thangka',
    photo: '📷 Photograph',
    artifact: '🏺 Artifact',
  };
  return labels[cat] || cat;
}

function initTabs() {
  document.querySelectorAll('.archive-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.archive-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentFilter = tab.dataset.tab;
      applyFilters();
    });
  });
}

function initSearch() {
  document.getElementById('archive-search').addEventListener('input', e => {
    applyFilters(e.target.value);
  });
}

function applyFilters(search = '') {
  currentItems = ARCHIVE_ITEMS.filter(item => {
    const matchesTab = currentFilter === 'all' || item.category === currentFilter;
    const matchesSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.monastery.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });
  renderArchive(currentItems);
}

function initLightbox() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navigateLightbox(1));

  document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(idx) {
  lightboxIdx = idx;
  updateLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(dir) {
  lightboxIdx = (lightboxIdx + dir + currentItems.length) % currentItems.length;
  updateLightbox();
}

function updateLightbox() {
  const item = currentItems[lightboxIdx];
  if (!item) return;

  document.getElementById('lb-category').textContent = getCategoryLabel(item.category);
  document.getElementById('lb-title').textContent = item.title;
  document.getElementById('lb-desc').textContent = item.desc;
  document.getElementById('lightbox-img').src = item.img;
  document.getElementById('lightbox-img').alt = item.title;

  document.getElementById('lb-meta').innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--clr-border)">
      <span style="color:var(--clr-text-muted);font-size:0.8rem">📍 Monastery</span>
      <span style="font-size:0.85rem;font-weight:500">${item.monastery}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--clr-border)">
      <span style="color:var(--clr-text-muted);font-size:0.8rem">📅 Period</span>
      <span style="font-size:0.85rem;font-weight:500">${item.year}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--clr-border)">
      <span style="color:var(--clr-text-muted);font-size:0.8rem">🎨 Medium</span>
      <span style="font-size:0.85rem;font-weight:500">${item.medium}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--clr-border)">
      <span style="color:var(--clr-text-muted);font-size:0.8rem">📐 Dimensions</span>
      <span style="font-size:0.85rem;font-weight:500">${item.dimensions}</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--clr-border)">
      <span style="color:var(--clr-text-muted);font-size:0.8rem">✅ Condition</span>
      <span style="font-size:0.85rem;font-weight:500;color:var(--clr-gold)">${item.condition}</span>
    </div>
  `;
}
