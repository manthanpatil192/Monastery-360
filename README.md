# 🏯 Monastery 360 — Digital Heritage of Sikkim

> An immersive digital heritage platform preserving and showcasing the sacred Buddhist monasteries of Sikkim, India.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-monastery--360--two.vercel.app-f4a832?style=for-the-badge&logo=vercel)](https://monastery-360-two.vercel.app)
[![Smart India Hackathon](https://img.shields.io/badge/SIH%202025-Submission-e05c2a?style=for-the-badge)](https://www.sih.gov.in)

---

## 📸 Preview

A dark glassmorphism heritage platform featuring:
- Immersive 360° virtual tours of Sikkim's monasteries
- Interactive hotspot-based exploration
- Digital archive of rare manuscripts, murals & photographs
- Cultural festival calendar
- Interactive Leaflet.js map of all monastery locations
- AI-powered audio narration guide

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌐 **360° Virtual Tour** | CSS/JS panorama viewer with drag-to-pan, hotspots, scene switching, auto-rotate & fullscreen |
| 🏯 **Monastery Directory** | Filterable grid of 6 documented monasteries with detailed profiles |
| 📚 **Digital Archive** | Masonry gallery of 12+ artifacts — manuscripts, murals, photos & artifacts with lightbox |
| 📅 **Cultural Calendar** | Interactive calendar with festival markers for 7 major Buddhist festivals |
| 🗺️ **Interactive Map** | Leaflet.js map centered on Sikkim with custom markers and popup info cards |
| 🎙️ **AI Audio Guide** | Web Speech API narrations for all 6 monasteries — chapters, speed control, language selector |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, SEO optimized
- **Vanilla CSS** — Custom design system with glassmorphism, CSS variables, animations
- **Vanilla JavaScript** — No frameworks, pure ES6+
- **Leaflet.js** (CDN) — Interactive map
- **Web Speech API** — Audio guide narration
- **Google Fonts** — Cinzel + Outfit + Inter

---

## 🗂️ Project Structure

```
Monastery 360/
├── index.html              # Home page
├── tour.html               # 360° Virtual Tour
├── monasteries.html        # Monastery Directory
├── archive.html            # Digital Archive
├── calendar.html           # Cultural Calendar
├── map.html                # Interactive Map
├── guide.html              # AI Audio Guide
├── css/
│   ├── global.css          # Design system & CSS variables
│   ├── components.css      # Reusable UI components
│   └── animations.css      # Keyframes & scroll reveal
├── js/
│   ├── main.js             # Shared logic, monastery data
│   ├── tour.js             # 360° panorama viewer
│   ├── map.js              # Leaflet map logic
│   ├── calendar.js         # Festival calendar
│   ├── archive.js          # Gallery & lightbox
│   └── guide.js            # Web Speech API audio guide
└── assets/
    └── images/             # AI-generated monastery images
```

---

## 🏯 Monasteries Covered

1. **Rumtek Monastery** — Karma Kagyu seat, East Sikkim (Est. 1740)
2. **Pemayangtse Monastery** — Nyingma, West Sikkim (Est. 1705)
3. **Tashiding Monastery** — Holiest site, West Sikkim (Est. 1716)
4. **Enchey Monastery** — Gangtok hilltop, East Sikkim (Est. 1840)
5. **Ralang Monastery** — Kagyu, South Sikkim (Est. 1768)
6. **Samdruptse Monastery** — Giant Guru Rinpoche statue, South Sikkim (Est. 2004)

---

## 🎉 Festivals Tracked

Losar · Bumchu · Saga Dawa · Pang Lhabsol · Chaam Dance · Kagyu Monlam · Guru Rinpoche Jayanti

---

## 🚀 Deployment

Deployed on **Vercel** — [monastery-360-two.vercel.app](https://monastery-360-two.vercel.app)

To deploy your own copy:
```bash
npm install -g vercel
vercel login
vercel --yes
```

---

## 🤝 Team

Built by **Team Mark42** for **Smart India Hackathon 2025**  
Problem: Digital preservation of Sikkim's Buddhist monastery heritage

---

## 📄 License

MIT License — free to use and modify for educational and heritage purposes.
