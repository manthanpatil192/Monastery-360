// =============================================
// GUIDE.JS — AI Audio Guide (Groq Llama-3.3 + Web Speech API)
// =============================================

const NARRATIONS = {
  rumtek: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Rumtek Monastery, one of the largest and most significant Buddhist monasteries in Sikkim. Perched at an altitude of fourteen hundred and seventy meters above sea level, this magnificent complex is the seat of the Karma Kagyu lineage of Tibetan Buddhism.' },
      { title: 'History', icon: '📜', time: '0:35', text: 'Founded in 1740 by the 12th Karmapa Changchub Dorje, the monastery was later rebuilt and expanded in the 1960s under the 16th Karmapa Rangjung Rigpe Dorje. The original monastery dates back even further, to the 16th century.' },
      { title: 'Architecture', icon: '🎨', time: '1:15', text: 'The monastery complex is a masterpiece of traditional Tibetan architecture. The main prayer hall, known as the Tsuglagkhang, rises three stories high and houses magnificent murals, thangka paintings, and a stunning collection of Buddhist art.' },
      { title: 'Sacred Artifacts', icon: '☸️', time: '2:00', text: 'Within the monastery walls lies the Golden Stupa, containing the precious relics of the 16th Karmapa. The monastery library houses over five thousand hand-written and block-printed Buddhist scriptures.' },
      { title: 'Festival Life', icon: '🎭', time: '2:45', text: 'The annual Kagyu Monlam prayers and the spectacular Black Hat Cham dance attract thousands of pilgrims and visitors each year. The sacred masked dances represent the eternal victory of wisdom over ignorance.' },
    ],
  },
  pemayangtse: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Pemayangtse Monastery, whose name means "Perfect Sublime Lotus." Situated at over two thousand meters above sea level in West Sikkim, this three-story monastery is one of the oldest in Sikkim.' },
      { title: 'History', icon: '📜', time: '0:40', text: 'Established in 1705 under the patronage of Chogyal Chakdor Namgyal, Pemayangtse has been a center of the Nyingma lineage for over three centuries.' },
      { title: 'The Zandok Palri', icon: '🎨', time: '1:20', text: 'The most extraordinary treasure within Pemayangtse is the Zandok Palri, a remarkable seven-tiered model of Guru Rinpoche\'s paradise, handcrafted entirely by one monk over five years.' },
      { title: 'The Landscape', icon: '⛰️', time: '2:05', text: 'From the monastery\'s terrace, on clear days, you can behold the majestic Kanchenjunga, the world\'s third highest mountain, rising above the clouds.' },
    ],
  },
  tashiding: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Tashiding Monastery, considered the most sacred site in all of Sikkim. Perched dramatically atop a conical hilltop, this ancient monastery radiates an extraordinary spiritual presence.' },
      { title: 'Sacred Status', icon: '☸️', time: '0:38', text: 'Founded in 1716 by Ngadak Sempa Chempo, Tashiding occupies a site believed to have been blessed by Guru Padmasambhava himself.' },
      { title: 'The Bumchu Festival', icon: '🫙', time: '1:20', text: 'The most extraordinary event at Tashiding is the annual Bumchu festival, where a sacred sealed bronze vessel is opened to reveal holy water that predicts the coming year.' },
    ],
  },
  enchey: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Enchey Monastery, a serene hilltop sanctuary above Gangtok in East Sikkim. The name Enchey means "solitary temple."' },
      { title: 'History', icon: '📜', time: '0:35', text: 'The current structure was built in 1840. The great Tantric master Lama Druptop Karpo is said to have flown to this spot and meditated here.' },
      { title: 'Chaam Dance', icon: '🎭', time: '1:15', text: 'Enchey Monastery is famous for its spectacular annual Chaam dance festival, where monks in elaborate costumes and masks reenact spiritual stories.' },
    ],
  },
  ralang: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Ralang Monastery, a beautiful Kagyu monastery nestled in the hills near Ravangla in South Sikkim, established in 1768.' },
      { title: 'Pang Lhabsol', icon: '⛰️', time: '1:20', text: 'Ralang is one of the key venues for Pang Lhabsol, Sikkim\'s unique thanksgiving festival honoring Mount Kanchenjunga.' },
    ],
  },
  namchi: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Samdruptse Monastery complex in Namchi, dominated by the colossal 135ft statue of Guru Padmasambhava.' },
      { title: 'The Great Statue', icon: '🧘', time: '0:40', text: 'Completed in 2004, the giant golden statue stands atop Samdruptse hill overlooking South Sikkim.' },
    ],
  }
};

let currentMonasteryIdx = 0;
let currentChapterIdx = 0;
let isPlaying = false;
let speechRate = 1;
let utterance = null;
let progressTimer = null;
let elapsedSeconds = 0;
let totalSeconds = 0;
let selectedLang = 'en-IN';
let narrationMode = 'static'; // 'static' or 'ai'

document.addEventListener('DOMContentLoaded', () => {
  renderMonasterySelector();
  loadMonastery(0);
  initPlayerControls();
  initSpeedButtons();
  initModeToggle();
  checkSpeechSupport();
});

function checkSpeechSupport() {
  if (!window.speechSynthesis) {
    showToast('Audio synthesis not supported in this browser. Use Chrome for best experience.', 'warning', 5000);
  }
}

function renderMonasterySelector() {
  const grid = document.getElementById('monastery-selector-grid');
  if (!grid) return;
  grid.innerHTML = '';

  MONASTERIES.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = `selector-card ${i === 0 ? 'active' : ''}`;
    card.dataset.idx = i;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Select ${m.name}`);
    card.innerHTML = `
      <img src="${m.image}" alt="${m.name}" loading="lazy" />
      <div class="selector-card-name">${m.name}</div>
    `;
    card.addEventListener('click', () => {
      stopAudio();
      loadMonastery(i);
    });
    grid.appendChild(card);
  });
}

function loadMonastery(idx) {
  currentMonasteryIdx = idx;
  currentChapterIdx = 0;
  const monastery = MONASTERIES[idx];

  document.querySelectorAll('.selector-card').forEach((c, i) => {
    c.classList.toggle('active', i === idx);
  });

  document.getElementById('player-img').src = monastery.image;
  document.getElementById('player-img').alt = monastery.name;
  document.getElementById('player-type').textContent = `${monastery.type} · Est. ${monastery.year}`;
  document.getElementById('player-name').textContent = monastery.name;
  document.getElementById('player-meta').textContent = `📍 ${monastery.district} · ⛰️ ${monastery.altitude}`;

  const narration = NARRATIONS[monastery.id] || NARRATIONS.rumtek;
  renderChapters(narration.chapters);
  updateTranscriptForChapter(narration.chapters[0]);

  resetProgress();
  totalSeconds = narration.chapters.reduce((acc, ch) => acc + 40, 0);
  updateTime(0, totalSeconds);
}

function renderChapters(chapters) {
  const container = document.getElementById('highlight-items');
  if (!container) return;
  container.innerHTML = '';
  chapters.forEach((ch, i) => {
    const item = document.createElement('div');
    item.className = 'highlight-item';
    item.dataset.idx = i;
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Play chapter: ${ch.title}`);
    item.innerHTML = `
      <span class="highlight-icon">${ch.icon}</span>
      <span class="highlight-name">${ch.title}</span>
      <span class="highlight-time">${ch.time}</span>
    `;
    item.addEventListener('click', () => {
      stopAudio();
      currentChapterIdx = i;
      updateTranscriptForChapter(ch);
      startAudio();
    });
    container.appendChild(item);
  });
}

function updateTranscriptForChapter(chapter) {
  const body = document.getElementById('transcript-body');
  if (!body) return;
  body.innerHTML = `<p><em style="color:#d97706;font-style:normal;font-weight:700">${chapter.icon || '🎙️'} ${chapter.title}</em></p><br/><p>${chapter.text}</p>`;
}

function initModeToggle() {
  const staticBtn = document.getElementById('mode-static');
  const aiBtn = document.getElementById('mode-ai');

  if (!staticBtn || !aiBtn) return;

  staticBtn.addEventListener('click', () => {
    narrationMode = 'static';
    staticBtn.classList.add('active');
    staticBtn.style.background = '#ffffff'; staticBtn.style.color = '#d97706'; staticBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
    aiBtn.classList.remove('active');
    aiBtn.style.background = 'transparent'; aiBtn.style.color = '#64748b'; aiBtn.style.boxShadow = 'none';
    showToast('Switched to Pre-scripted Audio Guide', 'info', 1500);
  });

  aiBtn.addEventListener('click', () => {
    narrationMode = 'ai';
    aiBtn.classList.add('active');
    aiBtn.style.background = '#ffffff'; aiBtn.style.color = '#d97706'; aiBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
    staticBtn.classList.remove('active');
    staticBtn.style.background = 'transparent'; staticBtn.style.color = '#64748b'; staticBtn.style.boxShadow = 'none';
    showToast('✨ AI Live Narration Activated (Groq Llama-3.3)', 'info', 2000);
  });
}

// AUDIO CONTROLS
function initPlayerControls() {
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-prev').addEventListener('click', () => {
    stopAudio();
    loadMonastery((currentMonasteryIdx - 1 + MONASTERIES.length) % MONASTERIES.length);
  });
  document.getElementById('btn-next').addEventListener('click', () => {
    stopAudio();
    loadMonastery((currentMonasteryIdx + 1) % MONASTERIES.length);
  });
  document.getElementById('btn-rewind').addEventListener('click', () => {
    elapsedSeconds = Math.max(0, elapsedSeconds - 10);
    showToast('Rewound 10 seconds', 'info', 1000);
  });
  document.getElementById('btn-forward').addEventListener('click', () => {
    elapsedSeconds = Math.min(totalSeconds, elapsedSeconds + 10);
    showToast('Forwarded 10 seconds', 'info', 1000);
  });

  document.getElementById('lang-select').addEventListener('change', e => {
    selectedLang = e.target.value;
    if (isPlaying) {
      stopAudio();
      startAudio();
    }
  });
}

function togglePlay() {
  if (isPlaying) {
    pauseAudio();
  } else {
    startAudio();
  }
}

async function startAudio() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const monastery = MONASTERIES[currentMonasteryIdx];
  let textToSpeak = '';

  if (narrationMode === 'ai') {
    showToast('✨ Generating AI Narration via Groq...', 'info', 2000);
    const body = document.getElementById('transcript-body');
    if (body) body.innerHTML = `<p style="color:#d97706;font-weight:600">✨ Generating live AI audio narration script for ${monastery.name} using Groq Llama-3.3...</p>`;

    try {
      if (typeof fetchGroqCompletion === 'function') {
        textToSpeak = await fetchGroqCompletion(`Write a compelling 2-paragraph spoken audio tour guide narration script for ${monastery.name} in ${monastery.district}, Sikkim. Describe its history (est. ${monastery.year}), ${monastery.type} Buddhist lineage, architectural features, and spiritual atmosphere.`);
        updateTranscriptForChapter({ title: `AI Live Narration — ${monastery.name}`, icon: '✨', text: textToSpeak });
      } else {
        throw new Error('Groq engine unavailable');
      }
    } catch (err) {
      console.warn('AI live narration fallback to static:', err);
      showToast('Offline fallback: Using pre-scripted narration', 'warning', 2000);
      const narration = NARRATIONS[monastery.id] || NARRATIONS.rumtek;
      const chapter = narration.chapters[currentChapterIdx];
      textToSpeak = chapter.text;
      updateTranscriptForChapter(chapter);
    }
  } else {
    const narration = NARRATIONS[monastery.id] || NARRATIONS.rumtek;
    const chapter = narration.chapters[currentChapterIdx];
    textToSpeak = chapter.text;
    updateTranscriptForChapter(chapter);
  }

  utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.rate = speechRate;
  utterance.lang = selectedLang;
  utterance.pitch = 0.95;

  utterance.onend = () => {
    stopAudio();
    showToast('Audio guide complete!', 'success');
  };

  utterance.onerror = () => {
    isPlaying = false;
    setPlayState(false);
  };

  window.speechSynthesis.speak(utterance);
  isPlaying = true;
  setPlayState(true);
  startProgressTimer();
}

function pauseAudio() {
  window.speechSynthesis?.pause();
  isPlaying = false;
  setPlayState(false);
  clearInterval(progressTimer);
}

function stopAudio() {
  window.speechSynthesis?.cancel();
  isPlaying = false;
  setPlayState(false);
  clearInterval(progressTimer);
  resetProgress();
}

function setPlayState(playing) {
  const btn = document.getElementById('btn-play');
  btn.textContent = playing ? '⏸' : '▶';
  btn.setAttribute('aria-label', playing ? 'Pause audio' : 'Play audio');

  const waveform = document.getElementById('waveform');
  if (waveform) {
    if (playing) waveform.classList.remove('paused');
    else waveform.classList.add('paused');
  }
}

function startProgressTimer() {
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    elapsedSeconds++;
    const pct = Math.min((elapsedSeconds / Math.max(totalSeconds, 1)) * 100, 100);
    document.getElementById('progress-fill').style.width = `${pct}%`;
    updateTime(elapsedSeconds, totalSeconds);
  }, 1000);
}

function resetProgress() {
  elapsedSeconds = 0;
  clearInterval(progressTimer);
  document.getElementById('progress-fill').style.width = '0%';
  updateTime(0, totalSeconds);
}

function updateTime(current, total) {
  document.getElementById('progress-current').textContent = formatTime(current);
  document.getElementById('progress-total').textContent = formatTime(total);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function initSpeedButtons() {
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      speechRate = parseFloat(btn.dataset.speed);
      if (isPlaying) {
        pauseAudio();
        startAudio();
      }
    });
  });
}

function copyTranscript() {
  const text = document.getElementById('transcript-body').innerText;
  navigator.clipboard?.writeText(text).then(() => {
    showToast('Transcript copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Could not copy transcript', 'error');
  });
}

window.copyTranscript = copyTranscript;
