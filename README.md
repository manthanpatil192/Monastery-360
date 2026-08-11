# 🏯 Monastery 360 — Digital Heritage of Sikkim

> An immersive, AI-powered digital heritage platform preserving and showcasing the sacred Buddhist monasteries of Sikkim, India. Built by **Team Mark42** for **Smart India Hackathon 2025**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-monastery--360--two.vercel.app-d97706?style=for-the-badge&logo=vercel)](https://monastery-360-two.vercel.app)
[![Smart India Hackathon](https://img.shields.io/badge/SIH%202025-Submission-ea580c?style=for-the-badge)](https://www.sih.gov.in)

---

## 📸 Overview

Monastery 360 provides a complete digital heritage ecosystem for Sikkim's monasteries:
- **WebGL 360° VR Photo Spheres** with Google VR Cardboard mode & laptop mouse cursor camera tracking
- **Groq Llama-3.3-70B AI Live Audio Narration** & Web Speech TTS
- **Monk AI Heritage Assistant Chatbot**
- **PWA Offline Support** via Service Worker (`sw.js`) for low-connectivity Himalayan mountain regions
- **Multilingual i18n Support** (English, Hindi, Nepali)

---

## ✨ Features Table

| Feature | Technology / Implementation | Description |
|---------|-----------------------------|-------------|
| 🌐 **WebGL 360° VR Tour** | Three.js + WebGL + WebXR | 360° equirectangular photo spheres with 1.65m ground standing height, Google VR split screen, and mouse cursor camera tracking |
| 🤖 **Monk AI Chatbot** | Groq API (`llama-3.3-70b-versatile`) | Floating AI assistant for Sikkim monastery history, festival advice, and VR guidance |
| 🎙️ **AI Audio Guide** | Groq Llama-3.3 + Web Speech API | Dual-mode narration toggle: **Static Pre-scripted** vs **✨ AI Live Narration** on demand |
| 📲 **PWA Offline Support** | Service Worker (`sw.js`) + `manifest.json` | Full offline caching of core HTML/CSS/JS/images for offline use in remote Himalayan areas |
| 🌐 **Multilingual i18n** | `js/i18n.js` | Instant language switching between **English (EN)**, **Hindi (HI)**, and **Nepali (NE)** |
| 🏯 **Monastery Directory** | Vanilla JS + Glassmorphism | Filterable directory of 6 documented monasteries across East, West, South, and North Sikkim |
| 📚 **Digital Archive** | Lightbox + Masonry Grid | 12 digitized manuscripts, murals, photographs & sacred artifacts |
| 📅 **Cultural Calendar** | Keyboard-Accessible Grid | Interactive calendar tracking 7 major Buddhist festivals (Losar, Bumchu, Chaam) |
| 🗺️ **Interactive Map** | Leaflet.js | Keyboard-accessible geo-tagged map of all Sikkim monastery locations |

---

## 📊 Honest Stat Counters

- **6 Monasteries Documented** (Rumtek, Pemayangtse, Tashiding, Enchey, Ralang, Samdruptse — expanding to 200+)
- **4 Districts Covered** (East, West, South, North Sikkim)
- **321+ Years of History** (1705 Pemayangtse to present day)
- **12+ Digital Artifacts** (Manuscripts, Thangka murals, and ritual artifacts)

---

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla CSS3 (SIH Light & Dark Glassmorphism), Vanilla JS (ES6+)
- **3D Graphics Engine**: Three.js (`SphereGeometry`, `THREE.StereoEffect` for VR Goggles)
- **AI LLM Engine**: Groq API (`llama-3.3-70b-versatile`)
- **Speech Synthesis**: Web Speech API (`SpeechSynthesisUtterance`)
- **Offline PWA**: Service Worker Cache API & Web App Manifest
- **Mapping**: Leaflet.js CDN
- **Fonts**: Outfit + Inter + Cinzel

---

## 🗂️ Project Structure

```
Monastery 360/
├── index.html              # Home page with hero & accurate stat counters
├── tour.html               # WebGL 360° VR Google VR Goggle Tour
├── monasteries.html        # Monastery Directory
├── archive.html            # Digital Archive
├── calendar.html           # Cultural Calendar
├── map.html                # Interactive Map with Leaflet.js
├── guide.html              # AI Audio Guide (Static vs AI Live Narration toggle)
├── manifest.json           # PWA Web App Manifest
├── sw.js                   # PWA Service Worker for offline caching
├── css/
│   ├── global.css          # SIH design system & CSS variables
│   ├── components.css      # Reusable UI components & modals
│   └── animations.css      # Keyframes & scroll reveal
├── js/
│   ├── main.js             # Core logic, monastery data, footer modals, SW registration
│   ├── tour.js             # Three.js 360 WebGL VR & cursor camera tracking engine
│   ├── chatbot.js          # Groq Llama-3.3 Monk AI Assistant chatbot
│   ├── guide.js            # Dual-mode AI audio narration engine
│   ├── i18n.js             # English / Hindi / Nepali translation layer
│   ├── map.js              # Leaflet map logic & keyboard navigation
│   ├── calendar.js         # Festival calendar logic
│   └── archive.js          # Lightbox gallery logic
└── assets/
    └── images/             # 360 panoramas and monastery photographs
```

---

## 🚀 Deployment

Deployed on **Vercel** — [monastery-360-two.vercel.app](https://monastery-360-two.vercel.app)

---

## 🤝 Team

Built by **Team Mark42** for **Smart India Hackathon 2025**  
Problem Statement: Digital Preservation & Immersive VR Presentation of Sikkim's Monastery Heritage

---

## 📄 License

MIT License — free to use and modify for educational and heritage preservation purposes.
