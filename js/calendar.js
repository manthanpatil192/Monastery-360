// =============================================
// CALENDAR.JS — Festival Calendar Logic
// =============================================

let currentDate = new Date();
let selectedFestival = null;

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// Extended festival data with full details
const FULL_FESTIVALS = [
  {
    name: 'Kagyu Monlam', month: 1, day: 5, color: '#f4a832',
    monasteries: ['Rumtek Monastery', 'Ralang Monastery'],
    description: 'The Great Prayer Festival of the Karma Kagyu lineage held annually at Rumtek Monastery. Monks gather for days of intensive prayer, recitation, and ceremonies to bring peace and happiness to all beings.',
    duration: '3 Days', type: 'Buddhist Prayer', subtitle: 'Great Prayer Festival'
  },
  {
    name: 'Losar', month: 2, day: 10, color: '#f4a832',
    monasteries: ['Pemayangtse Monastery', 'Tashiding Monastery', 'Enchey Monastery'],
    description: 'Tibetan New Year — the most joyous festival celebrated with masked Cham dances, feasts, prayers, and the traditional cleaning of homes and monasteries to welcome the new year.',
    duration: '3 Days', type: 'New Year Festival', subtitle: 'Tibetan Buddhist New Year'
  },
  {
    name: 'Bumchu', month: 2, day: 20, color: '#e05c2a',
    monasteries: ['Tashiding Monastery'],
    description: 'The sacred water festival at Tashiding Monastery where the level of holy water in an ancient sealed vessel is revealed to predict the fortune of the coming year — high water means prosperity.',
    duration: '1 Day', type: 'Pilgrimage Festival', subtitle: 'Sacred Water Revelation'
  },
  {
    name: 'Saga Dawa', month: 5, day: 15, color: '#2a9d8f',
    monasteries: ['Enchey Monastery', 'Rumtek Monastery', 'Pemayangtse Monastery'],
    description: 'The holiest month in Tibetan Buddhism, celebrating the birth, enlightenment, and passing of the Buddha Shakyamuni. A time of intensive prayer, fasting, and pilgrimage to all the major monasteries.',
    duration: '1 Month', type: 'Buddhist Sacred Month', subtitle: 'Triple Auspicious Day of the Buddha'
  },
  {
    name: 'Guru Rinpoche Jayanti', month: 7, day: 10, color: '#6a3d9a',
    monasteries: ['Samdruptse Monastery', 'Pemayangtse Monastery'],
    description: 'The birthday celebration of Guru Padmasambhava, the tantric master who brought Buddhism to Tibet and the Himalayas. Celebrated with special prayers, offerings, and recitations of his biography.',
    duration: '2 Days', type: 'Guru Celebration', subtitle: 'Birthday of the Lotus-Born Master'
  },
  {
    name: 'Pang Lhabsol', month: 8, day: 15, color: '#9b6dd8',
    monasteries: ['Ralang Monastery', 'Enchey Monastery'],
    description: 'Unique to Sikkim, this thanksgiving festival honors Mount Kangchenjunga as the guardian deity and the warrior deity Mahakala. Features dramatic masked dances representing the divine protectors of Sikkim.',
    duration: '2 Days', type: 'Sikkimese Festival', subtitle: 'Thanksgiving to the Guardian Deity'
  },
  {
    name: 'Chaam Dance', month: 12, day: 18, color: '#c0392b',
    monasteries: ['Enchey Monastery', 'Rumtek Monastery'],
    description: 'The sacred masked dance festival performed by trained monks. The colorful dances represent the victory of good over evil and depict stories from Buddhist mythology. One of the most spectacular events in Sikkim.',
    duration: '2 Days', type: 'Sacred Dance Festival', subtitle: 'Masked Dance of the Monastery'
  },
];

document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderFestivalList();
  renderFestivalsOverview();
  initCalendarNav();
});

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById('cal-title').textContent = `${MONTH_NAMES[month]} ${year}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const container = document.getElementById('cal-days');
  container.innerHTML = '';

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'cal-day empty other-month';
    container.appendChild(emptyDay);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day';
    dayEl.setAttribute('role', 'button');
    dayEl.setAttribute('tabindex', '0');

    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    if (isToday) dayEl.classList.add('today');

    // Check for festivals this day
    const festivals = FULL_FESTIVALS.filter(f => f.month - 1 === month && f.day === d);
    if (festivals.length > 0) {
      dayEl.classList.add('has-festival');
      dayEl.style.setProperty('--festival-color', festivals[0].color);
      const dot = document.createElement('div');
      dot.style.cssText = `position:absolute;bottom:4px;width:5px;height:5px;border-radius:50%;background:${festivals[0].color}`;
      dayEl.appendChild(dot);
      dayEl.setAttribute('aria-label', `${d} ${MONTH_NAMES[month]} — ${festivals.map(f => f.name).join(', ')}`);

      const triggerFestival = () => {
        document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
        dayEl.classList.add('selected');
        showFestivalDetail(festivals[0]);
      };

      dayEl.addEventListener('click', triggerFestival);
      dayEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerFestival();
        }
      });
    } else {
      dayEl.setAttribute('aria-label', `${d} ${MONTH_NAMES[month]}`);
    }

    const numSpan = document.createElement('span');
    numSpan.textContent = d;
    dayEl.insertBefore(numSpan, dayEl.firstChild);

    container.appendChild(dayEl);
  }
}

function renderFestivalList() {
  const list = document.getElementById('festival-list');
  list.innerHTML = '';

  FULL_FESTIVALS.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'festival-item';
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `View details for ${f.name}`);
    item.innerHTML = `
      <div class="festival-dot" style="background:${f.color}"></div>
      <div>
        <div class="festival-name">${f.name}</div>
        <div class="festival-date">${MONTH_NAMES[f.month - 1]} ${f.day} · ${f.type}</div>
      </div>
    `;
    const triggerItem = () => {
      document.querySelectorAll('.festival-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      showFestivalDetail(f);
      currentDate = new Date(currentDate.getFullYear(), f.month - 1, 1);
      renderCalendar();
    };
    item.addEventListener('click', triggerItem);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerItem();
      }
    });
    list.appendChild(item);
  });
}

function showFestivalDetail(festival) {
  const detail = document.getElementById('festival-detail');
  detail.classList.add('visible');

  document.getElementById('fd-dot').style.background = festival.color;
  document.getElementById('fd-name').textContent = festival.name;
  document.getElementById('fd-subtitle').textContent = festival.subtitle;
  document.getElementById('fd-desc').textContent = festival.description;
  document.getElementById('fd-date').textContent = `${MONTH_NAMES[festival.month - 1]} ${festival.day}`;
  document.getElementById('fd-duration').textContent = festival.duration;
  document.getElementById('fd-type').textContent = festival.type;

  const mList = document.getElementById('fd-monasteries');
  mList.innerHTML = festival.monasteries.map(m =>
    `<a href="monasteries.html" class="tag tag-default" style="border-color:${festival.color}30;color:${festival.color}">${m}</a>`
  ).join('');

  detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderFestivalsOverview() {
  const grid = document.getElementById('festivals-overview-grid');
  FULL_FESTIVALS.forEach((f, i) => {
    const card = document.createElement('div');
    card.className = 'glass-panel reveal';
    card.dataset.delay = i * 80;
    card.style.cssText = 'padding: 28px; cursor: pointer;';
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', f.name);

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <div style="width:14px;height:14px;border-radius:50%;background:${f.color};flex-shrink:0;box-shadow:0 0 12px ${f.color}50"></div>
        <span style="font-size:0.72rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:${f.color}">${f.type}</span>
      </div>
      <h3 style="font-size:1.2rem;font-weight:700;margin-bottom:6px;color:var(--clr-heading)">${f.name}</h3>
      <p style="font-size:0.75rem;color:var(--clr-text-muted);margin-bottom:12px">${MONTH_NAMES[f.month - 1]} ${f.day} · ${f.duration}</p>
      <p style="font-size:0.875rem;color:var(--clr-text-muted);line-height:1.65;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:16px">${f.description}</p>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${f.monasteries.map(m => `<span style="background:rgba(255,255,255,0.05);border:1px solid var(--clr-border);border-radius:6px;padding:3px 10px;font-size:0.72rem;color:var(--clr-text-muted)">${m}</span>`).join('')}
      </div>
    `;

    card.addEventListener('click', () => {
      showFestivalDetail(f);
      currentDate = new Date(currentDate.getFullYear(), f.month - 1, 1);
      renderCalendar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    grid.appendChild(card);
  });

  if (typeof initScrollReveal === 'function') initScrollReveal();
}

function initCalendarNav() {
  document.getElementById('cal-prev').addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    renderCalendar();
  });

  document.getElementById('cal-next').addEventListener('click', () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    renderCalendar();
  });
}
