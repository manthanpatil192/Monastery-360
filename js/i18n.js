// =============================================
// I18N.JS — Multilingual Translation System (English, Hindi, Nepali)
// =============================================

const TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_tour: "Virtual Tour",
    nav_monasteries: "Monasteries",
    nav_archive: "Archive",
    nav_calendar: "Calendar",
    nav_map: "Map",
    nav_guide: "🎙️ Audio Guide",
    hero_title_1: "Discover the Sacred",
    hero_title_2: "Monasteries of Sikkim",
    hero_desc: "Explore Sikkim's sacred Buddhist monasteries through 360° VR photo spheres, digital archives, and AI-powered audio guides.",
    btn_start_tour: "🌐 Start Virtual Tour",
    btn_explore: "Explore Monasteries",
    label_documented: "Monasteries Documented",
    label_districts: "Districts Covered",
    label_history: "Years of History",
    label_artifacts: "Digital Artifacts"
  },
  hi: {
    nav_home: "मुख्य पृष्ठ",
    nav_tour: "वर्चुअल टूर",
    nav_monasteries: "मठ (Monasteries)",
    nav_archive: "डिजिटल संग्रह",
    nav_calendar: "सांस्कृतिक कैलेंडर",
    nav_map: "मानचित्र (Map)",
    nav_guide: "🎙️ ऑडियो गाइड",
    hero_title_1: "सिक्किम के पवित्र",
    hero_title_2: "बौद्ध मठों की खोज करें",
    hero_desc: "360° VR फोटो स्फेयर, डिजिटल आर्काइव और AI ऑडियो गाइड के माध्यम से सिक्किम के प्राचीन मठों का अनुभव करें।",
    btn_start_tour: "🌐 वर्चुअल टूर शुरू करें",
    btn_explore: "मठों की खोज करें",
    label_documented: "मठ प्रलेखित",
    label_districts: "जिले शामिल",
    label_history: "वर्षों का इतिहास",
    label_artifacts: "डिजिटल अवशेष"
  },
  ne: {
    nav_home: "गृह पृष्ठ",
    nav_tour: "भर्चुअल टुर",
    nav_monasteries: "गुम्बाहरू (Monasteries)",
    nav_archive: "डिजिटल सङ्ग्रह",
    nav_calendar: "सांस्कृतिक क्यालेन्डर",
    nav_map: "मानचित्र",
    nav_guide: "🎙️ अडियो गाइड",
    hero_title_1: "सिक्किमका पवित्र",
    hero_title_2: "गुम्बाहरूको खोज गर्नुहोस्",
    hero_desc: "३६०° VR फोटो स्फेयर, डिजिटल अभिलेख र AI अडियो गाइड मार्फत सिक्किमका प्राचीन गुम्बाहरूको अनुभव गर्नुहोस्।",
    btn_start_tour: "🌐 भर्चुअल टुर सुरु गर्नुहोस्",
    btn_explore: "गुम्बाहरू हेर्नुहोस्",
    label_documented: "गुम्बा प्रलेखित",
    label_districts: "जिल्लाहरू",
    label_history: "वर्षको इतिहास",
    label_artifacts: "डिजिटल अवशेषहरू"
  }
};

let currentLang = localStorage.getItem('m360_lang') || 'en';

document.addEventListener('DOMContentLoaded', () => {
  injectLangSelector();
  applyLanguage(currentLang);
});

function injectLangSelector() {
  const navContainer = document.querySelector('.nav-container');
  if (!navContainer || document.getElementById('navbar-lang-select')) return;

  const select = document.createElement('select');
  select.id = 'navbar-lang-select';
  select.style.cssText = 'background:#f1f3f5;border:1px solid rgba(0,0,0,0.1);border-radius:100px;padding:4px 10px;font-size:0.78rem;font-weight:700;color:#0f172a;cursor:pointer;outline:none;margin-left:10px';
  select.innerHTML = `
    <option value="en" ${currentLang === 'en' ? 'selected' : ''}>🇬🇧 EN</option>
    <option value="hi" ${currentLang === 'hi' ? 'selected' : ''}>🇮🇳 HI</option>
    <option value="ne" ${currentLang === 'ne' ? 'selected' : ''}>🇳🇵 NE</option>
  `;

  select.addEventListener('change', (e) => {
    currentLang = e.target.value;
    localStorage.setItem('m360_lang', currentLang);
    applyLanguage(currentLang);
  });

  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.appendChild(select);
  }
}

function applyLanguage(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // Translate Nav Links
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks.length >= 7) {
    navLinks[0].textContent = t.nav_home;
    navLinks[1].textContent = t.nav_tour;
    navLinks[2].textContent = t.nav_monasteries;
    navLinks[3].textContent = t.nav_archive;
    navLinks[4].textContent = t.nav_calendar;
    navLinks[5].textContent = t.nav_map;
    navLinks[6].textContent = t.nav_guide;
  }

  // Hero Elements (if present)
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.innerHTML = `${t.hero_title_1}<br/><span>${t.hero_title_2}</span>`;
  }

  const heroDesc = document.querySelector('.hero-description');
  if (heroDesc) heroDesc.textContent = t.hero_desc;

  const tourBtn = document.getElementById('hero-tour-btn');
  if (tourBtn) tourBtn.textContent = t.btn_start_tour;

  const exploreBtn = document.getElementById('hero-explore-btn');
  if (exploreBtn) exploreBtn.textContent = t.btn_explore;
}
