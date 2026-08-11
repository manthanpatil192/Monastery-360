// =============================================
// MAIN.JS — Shared utilities for Monastery 360
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollReveal();
  initCounters();
  setActiveNavLink();
  initToast();
});

// =============================================
// NAVBAR — Scroll effect & mobile toggle
// =============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on init

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);

      // Animate hamburger to X
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close on nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => s.style.transform = s.style.opacity = '');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
    });
  }
}

// =============================================
// SET ACTIVE NAV LINK
// =============================================
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// =============================================
// SCROLL REVEAL (Intersection Observer)
// =============================================
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    if (!el.dataset.delay) {
      // Auto-stagger children in the same parent
      const siblings = el.parentElement?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      if (siblings) {
        const idx = Array.from(siblings).indexOf(el);
        el.dataset.delay = idx * 80;
      }
    }
    observer.observe(el);
  });
}

// =============================================
// ANIMATED COUNTERS
// =============================================
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 2000;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeOutCubic(progress);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString();
  };

  requestAnimationFrame(tick);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// =============================================
// TOAST NOTIFICATIONS
// =============================================
let toastContainer;

function initToast() {
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
}

function showToast(message, type = 'info', duration = 3000) {
  if (!toastContainer) initToast();

  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message" style="font-size:0.875rem;color:var(--clr-text)">${message}</span>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

// Format date nicely
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

// Debounce
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Throttle
function throttle(fn, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Random between range
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// =============================================
// MONASTERY DATA
// =============================================
const MONASTERIES = [
  {
    id: 'rumtek',
    name: 'Rumtek Monastery',
    district: 'East Sikkim',
    year: 1740,
    type: 'Kagyu',
    description: 'One of the largest and most significant monasteries in Sikkim, Rumtek is the seat of the Karma Kagyu lineage and houses a remarkable collection of Buddhist art and artifacts.',
    altitude: '1470m',
    image: 'assets/images/rumtek.png',
    lat: 27.3152,
    lng: 88.5426,
    hotspots: ['Main Prayer Hall', 'Golden Stupa', 'Monk Quarters', 'Library'],
    festivals: ['Kagyu Monlam', 'Black Hat Dance'],
    highlights: ['16th Karmapa Seat', '200+ Monks', 'Dharmachakra Stupa']
  },
  {
    id: 'pemayangtse',
    name: 'Pemayangtse Monastery',
    district: 'West Sikkim',
    year: 1705,
    type: 'Nyingma',
    description: 'One of the oldest monasteries in Sikkim, Pemayangtse means "Perfect Sublime Lotus." Its three-story structure houses exquisite murals, thangkas, and a remarkable wooden sculpture of Guru Rinpoche\'s paradise.',
    altitude: '2085m',
    image: 'assets/images/pemayangtse.png',
    lat: 27.3003,
    lng: 88.2333,
    hotspots: ['Prayer Hall', 'Roof Terrace', 'Scripture Room', 'Kitchen'],
    festivals: ['Cham Dance', 'Losar'],
    highlights: ['300+ Year History', 'Zandok Palri Model', 'Himalayan Views']
  },
  {
    id: 'tashiding',
    name: 'Tashiding Monastery',
    district: 'West Sikkim',
    year: 1716,
    type: 'Nyingma',
    description: 'Perched on a conical hilltop between the Rangit and Rathong rivers, Tashiding is considered the holiest site in Sikkim. The sacred Bumchu festival draws pilgrims from across the region.',
    altitude: '1665m',
    image: 'assets/images/tashiding.png',
    lat: 27.3667,
    lng: 88.2167,
    hotspots: ['Bumchu Shrine', 'Thongwa Rangdol Stupa', 'Main Temple', 'Bell Tower'],
    festivals: ['Bumchu', 'Losar'],
    highlights: ['Holiest Site in Sikkim', 'Sacred Water Festival', 'Guru Rinpoche Footprint']
  },
  {
    id: 'enchey',
    name: 'Enchey Monastery',
    district: 'East Sikkim',
    year: 1840,
    type: 'Nyingma',
    description: 'Situated on a hilltop in Gangtok with breathtaking views of Kanchenjunga, Enchey Monastery is known for its annual Chaam dance festival and its beautiful thangka paintings.',
    altitude: '1675m',
    image: 'assets/images/enchey.png',
    lat: 27.3393,
    lng: 88.6083,
    hotspots: ['Dance Courtyard', 'Main Shrine', 'Observation Deck', 'Drum Room'],
    festivals: ['Chaam Dance', 'Saga Dawa'],
    highlights: ['Gangtok City Views', 'Annual Mask Dance', '200+ Prayer Flags']
  },
  {
    id: 'ralang',
    name: 'Ralang Monastery',
    district: 'South Sikkim',
    year: 1768,
    type: 'Kagyu',
    description: 'Located near Ravangla, Ralang Monastery is one of the important Kagyu monasteries in Sikkim. The surrounding area offers stunning views of the Kanchenjunga range.',
    altitude: '1680m',
    image: 'assets/images/rumtek.png',
    lat: 27.2833,
    lng: 88.3833,
    hotspots: ['Main Temple', 'Prayer Wheel Gallery', 'Garden', 'Meditation Hall'],
    festivals: ['Pang Lhabsol', 'Kagyu Monlam'],
    highlights: ['Kanchenjunga Views', 'Mountain Retreat', 'Ancient Scriptures']
  },
  {
    id: 'namchi',
    name: 'Samdruptse Monastery',
    district: 'South Sikkim',
    year: 2004,
    type: 'Nyingma',
    description: 'Dominated by the towering 135-foot statue of Guru Padmasambhava (Guru Rinpoche), this monastery complex in Namchi is one of the most dramatic religious sites in Northeast India.',
    altitude: '1220m',
    image: 'assets/images/pemayangtse.png',
    lat: 27.1667,
    lng: 88.3667,
    hotspots: ['Guru Rinpoche Statue', 'Main Prayer Hall', 'Meditation Cave', 'Museum'],
    festivals: ['Guru Padmasambhava Jayanti', 'Dussehra'],
    highlights: ['135ft Guru Rinpoche Statue', 'Panoramic Views', 'Buddhist Museum']
  }
];

const FESTIVALS = [
  { name: 'Losar', month: 2, day: 10, description: 'Tibetan New Year celebrated with masked dances, prayers, and feasts.', color: '#f4a832', monasteries: ['pemayangtse', 'tashiding', 'enchey'] },
  { name: 'Saga Dawa', month: 5, day: 15, description: 'The most sacred festival commemorating Buddha\'s birth, enlightenment, and parinirvana.', color: '#2a9d8f', monasteries: ['enchey', 'rumtek'] },
  { name: 'Bumchu', month: 2, day: 20, description: 'Sacred water festival at Tashiding where holy water predicts the coming year\'s fortune.', color: '#e05c2a', monasteries: ['tashiding'] },
  { name: 'Pang Lhabsol', month: 8, day: 15, description: 'Thanksgiving festival honoring Mount Kanchenjunga as the guardian deity of Sikkim.', color: '#6a3d9a', monasteries: ['ralang', 'enchey'] },
  { name: 'Chaam Dance', month: 12, day: 18, description: 'Sacred mask dance performances at Enchey and Rumtek monasteries.', color: '#c0392b', monasteries: ['enchey', 'rumtek'] },
  { name: 'Kagyu Monlam', month: 1, day: 5, description: 'Great prayer festival of the Karma Kagyu lineage at Rumtek Monastery.', color: '#f4a832', monasteries: ['rumtek', 'ralang'] },
  { name: 'Guru Rinpoche Jayanti', month: 7, day: 10, description: 'Birthday celebration of Guru Padmasambhava, the founder of Tibetan Buddhism.', color: '#2a9d8f', monasteries: ['namchi', 'pemayangtse'] }
];

// Export for use in other scripts
window.MONASTERIES = MONASTERIES;
window.FESTIVALS = FESTIVALS;
window.showToast = showToast;
