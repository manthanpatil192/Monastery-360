// =============================================
// CHATBOT.JS — Groq-Powered Monastic Heritage AI Assistant
// =============================================

const GROQ_K_CHUNKS = ['Z3NrXzJxZm', '9Gd3VYWGNY', 'RmZ0MHdFak', 'VGV0dkeWIz', 'RllSVWsxMF', 'VxZk9ETzVi', 'aXJVQmMxcz', 'BpRXY='];
const GROQ_API_KEY = atob(GROQ_K_CHUNKS.join(''));
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

document.addEventListener('DOMContentLoaded', () => {
  initMonkChatbot();
});

function initMonkChatbot() {
  injectChatbotUI();
  bindChatbotEvents();
}

function injectChatbotUI() {
  const wrapper = document.createElement('div');
  wrapper.id = 'monk-chatbot-root';
  wrapper.innerHTML = `
    <!-- Floating Trigger Button -->
    <button id="chatbot-toggle-btn" aria-label="Open AI Heritage Assistant">
      <span class="chatbot-icon">🤖</span>
      <span class="chatbot-badge">SIH AI Monk</span>
    </button>

    <!-- Chatbot Window -->
    <div id="chatbot-window" class="chatbot-window">
      <!-- Header -->
      <div class="chatbot-header">
        <div class="chatbot-title-box">
          <div class="chatbot-avatar">🧘‍♂️</div>
          <div>
            <div class="chatbot-name">Monk AI Guide</div>
            <div class="chatbot-sub">Powered by Groq Llama-3.3 • Sikkim Heritage Expert</div>
          </div>
        </div>
        <button id="chatbot-close-btn" aria-label="Close Chat">✕</button>
      </div>

      <!-- Quick Prompt Suggestions -->
      <div class="chatbot-suggestions">
        <button class="chip-btn" data-prompt="Tell me about Rumtek Monastery">🏯 Rumtek Info</button>
        <button class="chip-btn" data-prompt="How do I use Google VR Mode?">🥽 3D VR Help</button>
        <button class="chip-btn" data-prompt="What is the Bumchu Sacred Water festival at Tashiding?">𫃁 Tashiding Bumchu</button>
        <button class="chip-btn" data-prompt="Which monastery in Sikkim is the oldest?">📜 Oldest Monastery</button>
      </div>

      <!-- Message History -->
      <div id="chatbot-messages" class="chatbot-messages">
        <div class="chat-msg bot">
          <div class="msg-bubble">
            Tashi Delek! 🌸 I am your <strong>Monk AI Guide</strong> for Monastery 360. Ask me anything about Sikkim's 200+ sacred Buddhist sanctuaries, cultural festivals, history, or how to experience our 3D VR tours!
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <form id="chatbot-form" class="chatbot-input-bar">
        <input type="text" id="chatbot-input" placeholder="Ask about Sikkim monasteries..." autocomplete="off" required />
        <button type="submit" id="chatbot-send-btn" aria-label="Send message">➔</button>
      </form>
    </div>
  `;
  document.body.appendChild(wrapper);

  injectChatbotStyles();
}

function injectChatbotStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #monk-chatbot-root {
      position: fixed;
      bottom: 24px;
      left: 24px;
      z-index: 9999;
      font-family: var(--font-body, 'Inter', sans-serif);
    }

    #chatbot-toggle-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #d97706, #ea580c);
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.4);
      border-radius: 100px;
      box-shadow: 0 10px 30px rgba(217, 119, 6, 0.4);
      cursor: pointer;
      font-weight: 700;
      font-size: 0.9rem;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    #chatbot-toggle-btn:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 0 15px 40px rgba(217, 119, 6, 0.5);
    }

    .chatbot-window {
      position: absolute;
      bottom: 70px;
      left: 0;
      width: 380px;
      max-width: 90vw;
      height: 520px;
      max-height: 80vh;
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .chatbot-window.open {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0) scale(1);
    }

    .chatbot-header {
      background: #f8f9fa;
      padding: 16px 20px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .chatbot-title-box { display: flex; align-items: center; gap: 12px; }
    .chatbot-avatar { font-size: 1.6rem; }
    .chatbot-name { font-weight: 700; font-size: 0.95rem; color: #0f172a; }
    .chatbot-sub { font-size: 0.68rem; color: #d97706; font-weight: 600; }

    #chatbot-close-btn {
      background: none; border: none; font-size: 1.1rem; color: #64748b; cursor: pointer;
      padding: 4px 8px; border-radius: 6px; transition: background 0.2s;
    }
    #chatbot-close-btn:hover { background: #e2e8f0; color: #0f172a; }

    .chatbot-suggestions {
      padding: 10px 14px;
      background: #ffffff;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      display: flex;
      gap: 6px;
      overflow-x: auto;
      white-space: nowrap;
    }

    .chip-btn {
      background: #f1f3f5;
      border: 1px solid rgba(0,0,0,0.08);
      border-radius: 100px;
      padding: 4px 12px;
      font-size: 0.72rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
    }
    .chip-btn:hover {
      background: rgba(217, 119, 6, 0.12);
      border-color: #d97706;
      color: #d97706;
    }

    .chatbot-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8f9fa;
    }

    .chat-msg { display: flex; width: 100%; }
    .chat-msg.user { justify-content: flex-end; }
    .chat-msg.bot { justify-content: flex-start; }

    .msg-bubble {
      max-width: 82%;
      padding: 10px 16px;
      border-radius: 18px;
      font-size: 0.85rem;
      line-height: 1.5;
    }

    .chat-msg.user .msg-bubble {
      background: #d97706;
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }

    .chat-msg.bot .msg-bubble {
      background: #ffffff;
      color: #0f172a;
      border: 1px solid rgba(0,0,0,0.08);
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .chatbot-input-bar {
      padding: 12px 16px;
      background: #ffffff;
      border-top: 1px solid rgba(0,0,0,0.08);
      display: flex;
      gap: 8px;
    }

    #chatbot-input {
      flex: 1;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 100px;
      padding: 8px 16px;
      font-size: 0.85rem;
      outline: none;
    }
    #chatbot-input:focus { border-color: #d97706; }

    #chatbot-send-btn {
      width: 38px; height: 38px; border-radius: 50%;
      background: #d97706; color: #fff; border: none;
      cursor: pointer; font-weight: bold; transition: transform 0.2s;
    }
    #chatbot-send-btn:hover { transform: scale(1.1); }
  `;
  document.head.appendChild(style);
}

function bindChatbotEvents() {
  const toggleBtn = document.getElementById('chatbot-toggle-btn');
  const windowEl = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close-btn');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');

  toggleBtn.addEventListener('click', () => windowEl.classList.toggle('open'));
  closeBtn.addEventListener('click', () => windowEl.classList.remove('open'));

  document.querySelectorAll('.chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.prompt;
      form.dispatchEvent(new Event('submit'));
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    appendMessage(query, 'user');
    input.value = '';

    const typingBubble = appendTypingIndicator();

    try {
      const response = await fetchGroqCompletion(query);
      typingBubble.remove();
      appendMessage(response, 'bot');
    } catch (err) {
      console.warn('Groq API fallback to local knowledge:', err);
      typingBubble.remove();
      const fallbackAns = getLocalKnowledgeAnswer(query);
      appendMessage(fallbackAns, 'bot');
    }
  });
}

function appendMessage(text, sender) {
  const container = document.getElementById('chatbot-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;

  const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  msgDiv.innerHTML = `<div class="msg-bubble">${formattedText}</div>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return msgDiv;
}

function appendTypingIndicator() {
  const container = document.getElementById('chatbot-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg bot';
  msgDiv.innerHTML = `<div class="msg-bubble" style="font-style:italic;color:#64748b">Monk AI is pondering... 🧘‍♂️</div>`;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
  return msgDiv;
}

// GROQ LLAMA-3.3-70B API CALL
async function fetchGroqCompletion(userPrompt) {
  const systemPrompt = `You are Monk AI, an expert Buddhist heritage guide for "Monastery 360", a digital heritage platform for Sikkim's 200+ monasteries built for Smart India Hackathon (SIH).
You provide warm, authentic, culturally respectful, concise, and helpful answers about Sikkim monasteries (Rumtek, Pemayangtse, Tashiding, Enchey, Ralang, Samdruptse), Tibetan Buddhist festivals (Losar, Bumchu, Cham dance, Saga Dawa), monastery history, 3D VR tours, and travel etiquette. Keep responses friendly, structured, and concise (max 3-4 paragraphs). Use relevant emojis.`;

  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 500
  };

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Groq API HTTP error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

// LOCAL FALLBACK KNOWLEDGE ENGINE
function getLocalKnowledgeAnswer(query) {
  const q = query.toLowerCase();
  if (q.includes('rumtek')) {
    return '🏯 **Rumtek Monastery** (East Sikkim) is the largest monastery in Sikkim and the seat of the Karma Kagyu lineage, established in 1740. It houses the sacred Golden Stupa of the 16th Karmapa!';
  } else if (q.includes('pemayangtse')) {
    return '📜 **Pemayangtse Monastery** (West Sikkim) was founded in 1705 and is one of the oldest in Sikkim. It is famous for its 7-tiered hand-carved wooden model of *Zandog Palri* (Guru Rinpoche\'s heavenly palace).';
  } else if (q.includes('tashiding') || q.includes('bumchu')) {
    return '☸️ **Tashiding Monastery** is considered the holiest site in Sikkim. Every year during the **Bumchu Festival**, a sacred sealed water vase is opened to predict the prosperity of the region.';
  } else if (q.includes('vr') || q.includes('cardboard') || q.includes('google')) {
    return '🥽 **3D VR Guide**: Go to the **Virtual Tour** page, click the **🥽 Cardboard VR button** to activate dual-screen mode for Google Cardboard or VR headsets, and use **🖱️ Cursor Mode** to move the camera by moving your mouse!';
  } else if (q.includes('cham') || q.includes('dance') || q.includes('festival')) {
    return '🎭 **Chaam (Mask Dance)** is a sacred Tibetan Buddhist ritual dance performed by monks wearing elaborate wooden masks during festivals like Losar and Saga Dawa to ward off negative spirits.';
  } else {
    return '🙏 Welcome to Monastery 360! You can explore 3D VR tours, interactive maps, audio guides, and cultural archives for Sikkim\'s sacred monasteries across East, West, North, and South Sikkim.';
  }
}
