// =============================================
// GUIDE.JS — AI Audio Guide with Web Speech API
// =============================================

// Monastery narration scripts
const NARRATIONS = {
  rumtek: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Rumtek Monastery, one of the largest and most significant Buddhist monasteries in Sikkim. Perched at an altitude of fourteen hundred and seventy meters above sea level, this magnificent complex is the seat of the Karma Kagyu lineage of Tibetan Buddhism.' },
      { title: 'History', icon: '📜', time: '0:35', text: 'Founded in 1740 by the 12th Karmapa Changchub Dorje, the monastery was later rebuilt and expanded in the 1960s under the 16th Karmapa Rangjung Rigpe Dorje. The original monastery dates back even further, to the 16th century, and was known as Dordrak Chotrul Migyur Dorjee Ling.' },
      { title: 'Architecture', icon: '🎨', time: '1:15', text: 'The monastery complex is a masterpiece of traditional Tibetan architecture. The main prayer hall, known as the Tsuglagkhang, rises three stories high and houses magnificent murals, thangka paintings, and a stunning collection of Buddhist art. The elaborate golden roof glistens in the Himalayan sun, visible from miles around.' },
      { title: 'Sacred Artifacts', icon: '☸️', time: '2:00', text: 'Within the monastery walls lies the Golden Stupa, containing the precious relics of the 16th Karmapa. The monastery library houses over five thousand hand-written and block-printed Buddhist scriptures. The Nalanda Institute for Higher Buddhist Studies, located within the complex, continues the tradition of Buddhist scholarship.' },
      { title: 'Festival Life', icon: '🎭', time: '2:45', text: 'The annual Kagyu Monlam prayers and the spectacular Black Hat Cham dance attract thousands of pilgrims and visitors each year. The sacred masked dances, performed by trained monks, represent the eternal victory of wisdom over ignorance. The ceremonies fill the monastery courtyard with color, music, and devotion.' },
    ],
  },
  pemayangtse: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Pemayangtse Monastery, whose name means "Perfect Sublime Lotus." Situated at over two thousand meters above sea level in West Sikkim, this three-story monastery is one of the oldest and most revered Buddhist institutions in Sikkim.' },
      { title: 'History', icon: '📜', time: '0:40', text: 'Established in 1705 under the patronage of Chogyal Chakdor Namgyal, the third ruler of Sikkim, Pemayangtse has been a center of the Nyingma lineage of Tibetan Buddhism for over three centuries. It is considered the premier monastery of Sikkim, and only Lachhenpa monks of pure Bhutia descent were traditionally allowed to serve here.' },
      { title: 'The Zandok Palri', icon: '🎨', time: '1:20', text: 'The most extraordinary treasure within Pemayangtse is the Zandok Palri, a remarkable seven-tiered model of Guru Rinpoche\'s paradise, handcrafted entirely by one monk over five years. This intricate wooden sculpture rises over six feet high and depicts the celestial realm of Guru Padmasambhava in extraordinary detail.' },
      { title: 'The Landscape', icon: '⛰️', time: '2:05', text: 'From the monastery\'s terrace, on clear days, you can behold the majestic Kanchenjunga, the world\'s third highest mountain, rising above the clouds at over eight thousand meters. The surrounding landscape of rhododendron forests, terraced fields, and ancient prayer walls creates a deeply spiritual atmosphere.' },
    ],
  },
  tashiding: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Tashiding Monastery, considered the most sacred site in all of Sikkim. Perched dramatically atop a conical hilltop at the confluence of the Rangit and Rathong rivers, this ancient monastery radiates an extraordinary spiritual presence.' },
      { title: 'Sacred Status', icon: '☸️', time: '0:38', text: 'Founded in 1716 by Ngadak Sempa Chempo, Tashiding occupies a site believed to have been blessed by Guru Padmasambhava himself. The name Tashiding means "Sublime Spot of the Central Glory." Local tradition holds that anyone who circumambulates the monastery with sincere devotion will be cleansed of all sins accumulated over seven lifetimes.' },
      { title: 'The Bumchu Festival', icon: '🫙', time: '1:20', text: 'The most extraordinary event at Tashiding is the annual Bumchu festival, held on the fifteenth day of the first month of the Tibetan calendar. During this ceremony, a sacred sealed bronze vessel, said to have been placed here by Guru Rinpoche himself, is opened to reveal the level of holy water inside. The water level is interpreted as a prophecy for the coming year.' },
      { title: 'The Stupas', icon: '🔵', time: '2:05', text: 'The monastery compound contains numerous ancient stupas, the most sacred being the Thongwa Rangdol stupa, whose name means "Liberation on Sight." Merely gazing upon this stupa is said to purify one\'s mind and bring liberation. The hilltop location offers breathtaking views across the forested valleys and distant snowpeaks.' },
    ],
  },
  enchey: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Enchey Monastery, a serene hilltop sanctuary above the bustling capital city of Gangtok in East Sikkim. The name Enchey means "solitary temple," and despite its proximity to the city, the monastery maintains a profound sense of peaceful isolation.' },
      { title: 'History', icon: '📜', time: '0:35', text: 'The current structure was built in 1840, though a hermitage has existed at this sacred site for much longer. The great Tantric master Lama Druptop Karpo is said to have flown to this spot and meditated here, establishing its spiritual significance. The monastery belongs to the Nyingma school of Tibetan Buddhism.' },
      { title: 'Chaam Dance', icon: '🎭', time: '1:15', text: 'Enchey Monastery is perhaps most famous for its spectacular annual Chaam dance festival, held in the twelfth month of the Tibetan calendar. Monks in elaborate costumes and fierce masks perform sacred dances in the monastery courtyard, reenacting stories of the triumph of good over evil. These dances have been performed continuously for generations.' },
      { title: 'The View', icon: '🌄', time: '2:00', text: 'From the monastery\'s observation deck, you are rewarded with one of the finest panoramic views in Gangtok. On clear mornings, the entire Kanchenjunga massif spreads across the horizon in a breathtaking display. The prayer flags that flutter around the monastery perimeter carry the monks\' prayers on the mountain winds across the Himalayan landscape.' },
    ],
  },
  ralang: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Ralang Monastery, a beautiful Kagyu monastery nestled in the hills near Ravangla in South Sikkim. Established in 1768, this monastery serves as an important center of spiritual learning and practice for the local Buddhist community.' },
      { title: 'History', icon: '📜', time: '0:38', text: 'Ralang Monastery was founded during the reign of Chogyal Tenzing Namgyal, the sixth ruler of Sikkim. The monastery belongs to the Karma Kagyu lineage and maintains strong connections with Rumtek Monastery, the main seat of the Karmapa. The name Ralang refers to the local area and the monastery has served as a spiritual anchor for the surrounding region for over two and a half centuries.' },
      { title: 'Pang Lhabsol', icon: '⛰️', time: '1:20', text: 'Ralang Monastery is one of the key venues for the celebration of Pang Lhabsol, Sikkim\'s unique thanksgiving festival. This festival honors Mount Kangchenjunga, the world\'s third highest peak, as the guardian deity and protector of Sikkim. The dramatic masked dances representing the mountain deity and warrior guardian Mahakala are among the most spectacular religious performances in the entire Himalayan region.' },
    ],
  },
  namchi: {
    chapters: [
      { title: 'Introduction', icon: '🏯', time: '0:00', text: 'Welcome to Samdruptse Monastery complex in Namchi, home to one of the most dramatic religious monuments in northeast India. The complex is dominated by the massive statue of Guru Padmasambhava, the lotus-born master who brought Tantric Buddhism to Tibet and the Himalayan regions.' },
      { title: 'The Great Statue', icon: '🧘', time: '0:40', text: 'The centerpiece of the complex is a colossal one hundred and thirty five feet tall statue of Guru Rinpoche, making it one of the tallest statues of Guru Padmasambhava in the world. Completed in 2004, the statue stands upon a hill and can be seen from vast distances across South Sikkim. The interior of the statue contains meditation rooms, murals, and sacred objects.' },
      { title: 'The Panorama', icon: '🌄', time: '1:25', text: 'The hilltop location of Samdruptse provides extraordinary panoramic views of the surrounding mountains, valleys, and the town of Namchi below. On clear days, the snow-capped peaks of the Himalayas form a magnificent backdrop to the golden statue. The complex includes beautifully maintained gardens, prayer halls, and a Buddhist museum.' },
    ],
  },
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

document.addEventListener('DOMContentLoaded', () => {
  renderMonasterySelector();
  loadMonastery(0);
  initPlayerControls();
  initSpeedButtons();
  checkSpeechSupport();
});

function checkSpeechSupport() {
  if (!window.speechSynthesis) {
    showToast('Audio synthesis not supported in this browser. Use Chrome for best experience.', 'warning', 5000);
  }
}

function renderMonasterySelector() {
  const grid = document.getElementById('monastery-selector-grid');
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

  // Update selector
  document.querySelectorAll('.selector-card').forEach((c, i) => {
    c.classList.toggle('active', i === idx);
  });

  // Update player info
  document.getElementById('player-img').src = monastery.image;
  document.getElementById('player-img').alt = monastery.name;
  document.getElementById('player-type').textContent = `${monastery.type} · Est. ${monastery.year}`;
  document.getElementById('player-name').textContent = monastery.name;
  document.getElementById('player-meta').textContent = `📍 ${monastery.district} · ⛰️ ${monastery.altitude}`;

  // Load chapters
  const narration = NARRATIONS[monastery.id] || NARRATIONS.rumtek;
  renderChapters(narration.chapters);
  updateTranscriptForChapter(narration.chapters[0]);

  // Reset progress
  resetProgress();
  totalSeconds = narration.chapters.reduce((acc, ch) => acc + 40, 0);
  updateTime(0, totalSeconds);
}

function renderChapters(chapters) {
  const container = document.getElementById('highlight-items');
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

function getFullNarrationText() {
  const monastery = MONASTERIES[currentMonasteryIdx];
  const narration = NARRATIONS[monastery.id] || NARRATIONS.rumtek;
  return narration.chapters.map(ch => ch.text).join(' ... ');
}

function updateTranscriptForChapter(chapter) {
  const body = document.getElementById('transcript-body');
  body.innerHTML = `<p><em style="color:var(--clr-gold);font-style:normal;font-weight:600">${chapter.icon} ${chapter.title}</em></p><br/><p>${chapter.text}</p>`;
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

function startAudio() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const monastery = MONASTERIES[currentMonasteryIdx];
  const narration = NARRATIONS[monastery.id] || NARRATIONS.rumtek;
  const chapter = narration.chapters[currentChapterIdx];

  utterance = new SpeechSynthesisUtterance(chapter.text);
  utterance.rate = speechRate;
  utterance.lang = selectedLang;
  utterance.pitch = 0.95;

  utterance.onend = () => {
    // Move to next chapter
    if (currentChapterIdx < narration.chapters.length - 1) {
      currentChapterIdx++;
      const nextChapter = narration.chapters[currentChapterIdx];
      updateTranscriptForChapter(nextChapter);
      startAudio();
    } else {
      stopAudio();
      showToast('Audio tour complete!', 'success');
    }
  };

  utterance.onerror = () => {
    isPlaying = false;
    setPlayState(false);
  };

  window.speechSynthesis.speak(utterance);
  isPlaying = true;
  setPlayState(true);
  startProgressTimer();
  updateTranscriptForChapter(chapter);
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
  if (playing) waveform.classList.remove('paused');
  else waveform.classList.add('paused');
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
