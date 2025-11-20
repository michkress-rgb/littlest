// ================================================
// LITTLEST WAY - PRAYER TRACKER APPLICATION
// ================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  update, 
  onValue, 
  push,
  increment
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// ================================================
// FIREBASE CONFIGURATION
// ================================================
const firebaseConfig = {
  apiKey: "AIzaSyDTX23Nf_6FZsPPf7nDdBVbXoHEQKvXr1s",
  authDomain: "littlest-7ffe5.firebaseapp.com",
  databaseURL: "https://littlest-7ffe5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "littlest-7ffe5",
  storageBucket: "littlest-7ffe5.firebasestorage.app",
  messagingSenderId: "869175074742",
  appId: "1:869175074742:web:ccb8d0fee2e1ff21d21485"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ================================================
// GLOBAL STATE
// ================================================
const state = {
  currentDate: new Date(),
  todayString: '',
  todayDailyData: {},
  activeIntentions: {},
  activeNovenas: {},
  currentChild: "child1",
  favorites: [],
  scrollPositions: {}
};

// Session constants
const PIN_KEY = 'littlest_way_auth';
const REQUIRED_PIN = '332211';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// ================================================
// UTILITY FUNCTIONS
// ================================================
const utils = {
  // Get local ISO date string
  localISODate(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const da = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${da}`;
  },

  // Show toast notification
  showToast(message, type = "success") {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Save scroll position
  saveScrollPosition(viewId) {
    const view = document.getElementById(viewId);
    if (view) {
      state.scrollPositions[viewId] = view.scrollTop;
    }
  },

  // Restore scroll position
  restoreScrollPosition(viewId) {
    const view = document.getElementById(viewId);
    if (view && state.scrollPositions[viewId]) {
      view.scrollTop = state.scrollPositions[viewId];
    }
  }
};

// ================================================
// SESSION MANAGEMENT
// ================================================
const session = {
  check() {
    const saved = localStorage.getItem(PIN_KEY);
    if (!saved) return false;

    try {
      const data = JSON.parse(saved);
      const now = Date.now();
      
      // Check if session is valid and not expired
      if (data.pin === REQUIRED_PIN && data.expiry > now) {
        return true;
      }
      
      // Session expired, clear it
      this.clear();
      return false;
    } catch (e) {
      this.clear();
      return false;
    }
  },

  save(pin) {
    const data = {
      pin: pin,
      expiry: Date.now() + SESSION_DURATION
    };
    localStorage.setItem(PIN_KEY, JSON.stringify(data));
  },

  clear() {
    localStorage.removeItem(PIN_KEY);
  }
};

// ================================================
// UI MANAGEMENT
// ================================================
const ui = {
  showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add("active");
  },

  showView(viewId) {
    // Save scroll position of current view
    const currentView = document.querySelector('.app-view.active');
    if (currentView) {
      utils.saveScrollPosition(currentView.id);
    }

    // Switch views
    document.querySelectorAll(".app-view").forEach(v => v.classList.remove("active"));
    const view = document.getElementById(viewId);
    if (view) {
      view.classList.add("active");
      utils.restoreScrollPosition(viewId);
    }

    // Update menu
    document.querySelectorAll(".menu-item").forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewId);
    });

    // Close menu on mobile
    this.closeMenu();
  },

  openMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay active';
    overlay.id = 'menuOverlay';
    overlay.addEventListener('click', () => this.closeMenu());
    document.body.appendChild(overlay);
    if (menu) menu.classList.add('open');
  },

  closeMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    if (menu) menu.classList.remove('open');
    if (overlay) overlay.remove();
  },

  toggleTheme() {
    document.body.classList.toggle("dark-mode");
    const icon = document.querySelector(".theme-icon");
    if (icon) {
      icon.textContent = document.body.classList.contains("dark-mode") ? "☀" : "☾";
    }
    localStorage.setItem('darkMode', document.body.classList.contains("dark-mode"));
  },

  updateDateDisplay() {
    const today = utils.localISODate(new Date());
    const displayEl = document.getElementById("currentDateDisplay");
    if (!displayEl) return;
    
    if (state.todayString === today) {
      displayEl.textContent = "Today";
      displayEl.classList.remove("not-today");
    } else {
      const options = { month: 'short', day: 'numeric', year: 'numeric' };
      displayEl.textContent = state.currentDate.toLocaleDateString('en-US', options);
      displayEl.classList.add("not-today");
    }

    // Disable next button if viewing today
    const nextBtn = document.getElementById("nextDayBtn");
    if (nextBtn) {
      nextBtn.disabled = (state.todayString === today);
    }
  }
};

// ================================================
// DATA MANAGEMENT
// ================================================
const data = {
  async loadAll() {
    state.todayString = utils.localISODate(state.currentDate);
    
    try {
      // Load daily data
      const dailySnapshot = await get(ref(db, `dailyData/${state.todayString}`));
      state.todayDailyData = dailySnapshot.val() || {};

      // Load intentions
      const intSnapshot = await get(ref(db, "intentions"));
      const allIntentions = intSnapshot.val() || {};
      state.activeIntentions = {};
      for (const [key, val] of Object.entries(allIntentions)) {
        if (!val.deleted && !val.answered) {
          state.activeIntentions[key] = val;
        }
      }

      // Load novenas
      const novSnapshot = await get(ref(db, "novenas"));
      const allNovenas = novSnapshot.val() || {};
      state.activeNovenas = {};
      for (const [key, val] of Object.entries(allNovenas)) {
        if (!val.deleted && !val.answered) {
          state.activeNovenas[key] = val;
        }
      }

      // Load favorites
      const favs = localStorage.getItem('favorites');
      state.favorites = favs ? JSON.parse(favs) : [];

      this.setupRealtimeListeners();
      render.all();
      ui.updateDateDisplay();
    } catch (error) {
      console.error("Failed to load data:", error);
      utils.showToast("Failed to load data. Working offline.", "error");
    }
  },

  setupRealtimeListeners() {
    onValue(ref(db, `dailyData/${state.todayString}`), (snapshot) => {
      state.todayDailyData = snapshot.val() || {};
      render.all();
    });

    onValue(ref(db, "intentions"), (snapshot) => {
      const allIntentions = snapshot.val() || {};
      state.activeIntentions = {};
      for (const [key, val] of Object.entries(allIntentions)) {
        if (!val.deleted && !val.answered) {
          state.activeIntentions[key] = val;
        }
      }
      render.intentions();
    });

    onValue(ref(db, "novenas"), (snapshot) => {
      const allNovenas = snapshot.val() || {};
      state.activeNovenas = {};
      for (const [key, val] of Object.entries(allNovenas)) {
        if (!val.deleted && !val.answered) {
          state.activeNovenas[key] = val;
        }
      }
      render.novenas();
    });
  },

  async exportData() {
    try {
      const dailySnapshot = await get(ref(db, 'dailyData'));
      const intentionsSnapshot = await get(ref(db, 'intentions'));
      const novenasSnapshot = await get(ref(db, 'novenas'));

      const exportData = {
        dailyData: dailySnapshot.val() || {},
        intentions: intentionsSnapshot.val() || {},
        novenas: novenasSnapshot.val() || {},
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `littlest-way-export-${utils.localISODate()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      utils.showToast("Data exported successfully");
    } catch (error) {
      utils.showToast("Export failed: " + error.message, "error");
    }
  }
};

// ================================================
// RENDER FUNCTIONS
// ================================================
const render = {
  all() {
    this.dashboard();
    this.dailyPrayers();
    this.rosary();
    this.devotions();
    this.intentions();
    this.novenas();
  },

  dashboard() {
    // Calculate totals
    const rosaryCount = (state.todayDailyData.rosary?.joyful || 0) + 
                       (state.todayDailyData.rosary?.sorrowful || 0) + 
                       (state.todayDailyData.rosary?.glorious || 0) + 
                       (state.todayDailyData.rosary?.luminous || 0);
    
    const devotionsCount = Object.values(state.todayDailyData.devotions || {}).reduce((sum, val) => sum + val, 0);
    const intentionsCount = state.todayDailyData.intentionsTotal || 0;
    const wayCount = state.todayDailyData.wayOfCross || 0;
    const stMichaelCount = state.todayDailyData.stMichaelChaplet || 0;
    const silentMinutes = state.todayDailyData.silentPrayerMinutes || 0;

    const total = rosaryCount + devotionsCount + intentionsCount + wayCount + stMichaelCount + Math.floor(silentMinutes / 10);
    
    // Update stats
    const countEl = document.getElementById("todayPrayersCount");
    if (countEl) countEl.textContent = total;

    const goal = parseInt(localStorage.getItem("dailyGoal") || "10");
    const progress = Math.min(100, Math.round((total / goal) * 100));
    const progressEl = document.getElementById("dailyGoalProgress");
    if (progressEl) progressEl.textContent = progress + "%";

    // Update streak
    const streakEl = document.getElementById("streakCount");
    if (streakEl) streakEl.textContent = "0"; // TODO: Calculate actual streak

    // Update quick action states
    const massDone = !!state.todayDailyData.massDone;
    const scriptureDone = !!(state.todayDailyData.reading && state.todayDailyData.reading.scripture);
    const lectioDone = !!(state.todayDailyData.reading && state.todayDailyData.reading.lectio);
    
    const massBtn = document.getElementById("quickMass");
    const scriptureBtn = document.getElementById("quickScripture");
    const lectioBtn = document.getElementById("quickLectio");
    
    if (massBtn) massBtn.classList.toggle("active", massDone);
    if (scriptureBtn) scriptureBtn.classList.toggle("active", scriptureDone);
    if (lectioBtn) lectioBtn.classList.toggle("active", lectioDone);

    // Render favorites
    this.favorites();
  },

  favorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;

    if (state.favorites.length === 0) {
      container.innerHTML = '<p class="empty-state">Add your most-used prayers to quick access</p>';
      return;
    }

    // TODO: Render actual favorite prayers
    container.innerHTML = '<p class="empty-state">Favorites feature coming soon...</p>';
  },

  dailyPrayers() {
    const container = document.getElementById('dailyPrayersList');
    if (!container) return;

    const prayers = [
      { key: 'morningAspirations', name: 'Morning Aspirations' },
      { key: 'actFaith', name: 'Act of Faith' },
      { key: 'actHope', name: 'Act of Hope' },
      { key: 'actLove', name: 'Act of Love' },
      { key: 'memorare', name: 'Memorare' }
    ];

    container.innerHTML = prayers.map(p => {
      const count = state.todayDailyData.dailyPrayers?.[p.key] || 0;
      return this.createPrayerItem(p.name, count, `dailyPrayer:${p.key}`);
    }).join('');
  },

  rosary() {
    const container = document.getElementById('rosaryList');
    if (!container) return;

    const mysteries = [
      { key: 'joyful', name: 'Joyful Mysteries', detail: 'Mon, Sat' },
      { key: 'sorrowful', name: 'Sorrowful Mysteries', detail: 'Tue, Fri' },
      { key: 'glorious', name: 'Glorious Mysteries', detail: 'Wed, Sun' },
      { key: 'luminous', name: 'Luminous Mysteries', detail: 'Thursday' }
    ];

    container.innerHTML = mysteries.map(m => {
      const count = state.todayDailyData.rosary?.[m.key] || 0;
      return this.createPrayerItem(m.name, count, `rosary:${m.key}`, m.detail);
    }).join('');
  },

  devotions() {
    const container = document.getElementById('devotionsList');
    if (!container) return;

    const devotions = [
      { key: 'divMercy', name: 'Divine Mercy Chaplet', detail: '3 PM Hour of Mercy' },
      { key: 'angelus', name: 'Angelus', detail: '6 AM, 12 PM, 6 PM' },
      { key: 'sacredHeart', name: 'Sacred Heart', detail: 'First Friday' }
    ];

    container.innerHTML = devotions.map(d => {
      const count = state.todayDailyData.devotions?.[d.key] || 0;
      return this.createPrayerItem(d.name, count, `devotion:${d.key}`, d.detail);
    }).join('');
  },

  intentions() {
    const container = document.getElementById('intentionsList');
    if (!container) return;

    if (Object.keys(state.activeIntentions).length === 0) {
      container.innerHTML = '<p class="empty-state">No active intentions. Click "+ Add" to begin.</p>';
      return;
    }

    container.innerHTML = Object.entries(state.activeIntentions).map(([id, int]) => {
      const count = state.todayDailyData.intentionsBy?.[id] || 0;
      const createdDate = new Date(int.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      return `
        <div class="intention-item">
          <div class="intention-header">
            <div class="intention-title">${int.title}</div>
          </div>
          ${int.note ? `<div class="intention-note">${int.note}</div>` : ''}
          <div class="intention-meta">
            <div class="intention-count">${count} prayers today</div>
            <div class="intention-actions">
              <button class="counter-btn" onclick="actions.addIntentionCount('${id}', 1)">+1</button>
              <button class="counter-btn" onclick="actions.addIntentionCount('${id}', 10)">+10</button>
              ${count > 0 ? `<button class="counter-btn minus" onclick="actions.addIntentionCount('${id}', -1)">-1</button>` : ''}
              <button class="btn btn-secondary btn-small" onclick="actions.markIntentionAnswered('${id}')">Answered</button>
              <button class="btn-icon" onclick="actions.deleteIntention('${id}')" title="Delete">🗑️</button>
            </div>
          </div>
          <div class="intention-date">Added: ${createdDate}</div>
        </div>
      `;
    }).join('');
  },

  novenas() {
    const container = document.getElementById('novenaList');
    if (!container) return;

    if (Object.keys(state.activeNovenas).length === 0) {
      container.innerHTML = '<p class="empty-state">No active novenas. Click "+ Add" to begin.</p>';
      return;
    }

    // TODO: Implement full novena rendering
    container.innerHTML = '<p class="empty-state">Novenas rendering coming soon...</p>';
  },

  createPrayerItem(name, count, actionKey, detail = '') {
    return `
      <div class="prayer-item">
        <div class="prayer-info">
          <div class="prayer-name">${name}</div>
          ${detail ? `<div class="prayer-detail">${detail}</div>` : ''}
        </div>
        <div class="prayer-actions">
          <div class="count-display">${count}</div>
          <div class="counter-btns">
            <button class="counter-btn" onclick="actions.increment('${actionKey}', 1)">+1</button>
            ${count > 0 ? `<button class="counter-btn minus" onclick="actions.increment('${actionKey}', -1)">-1</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }
};

// ================================================
// USER ACTIONS
// ================================================
const actions = {
  async increment(actionKey, delta) {
    const [type, key] = actionKey.split(':');
    const path = `dailyData/${state.todayString}/${type}/${key}`;
    const current = state.todayDailyData[type]?.[key] || 0;
    const newVal = Math.max(0, current + delta);
    await set(ref(db, path), newVal);
  },

  async addIntentionCount(intentionId, delta) {
    const current = state.todayDailyData.intentionsBy?.[intentionId] || 0;
    const newVal = Math.max(0, current + delta);
    const updates = {};
    updates[`dailyData/${state.todayString}/intentionsTotal`] = increment(delta);
    updates[`dailyData/${state.todayString}/intentionsBy/${intentionId}`] = newVal;
    await update(ref(db), updates);
  },

  async toggleQuickAction(type) {
    if (type === 'mass') {
      const current = !!state.todayDailyData.massDone;
      await set(ref(db, `dailyData/${state.todayString}/massDone`), !current);
      utils.showToast(current ? "Mass: cleared" : "Mass: done");
    } else if (type === 'scripture') {
      const current = !!(state.todayDailyData.reading?.scripture);
      await set(ref(db, `dailyData/${state.todayString}/reading/scripture`), !current);
      utils.showToast(current ? "Scripture: cleared" : "Scripture: done");
    } else if (type === 'lectio') {
      const current = !!(state.todayDailyData.reading?.lectio);
      await set(ref(db, `dailyData/${state.todayString}/reading/lectio`), !current);
      utils.showToast(current ? "Lectio: cleared" : "Lectio: done");
    }
  },

  async quickAddIntention() {
    const input = document.getElementById('quickIntentionInput');
    if (!input) return;

    const title = input.value.trim();
    if (!title) {
      utils.showToast("Please enter an intention", "error");
      return;
    }

    const data = {
      title,
      note: '',
      updatedAt: Date.now(),
      createdAt: Date.now(),
      deleted: false,
      answered: false
    };

    try {
      await set(push(ref(db, "intentions")), data);
      input.value = '';
      utils.showToast("Intention added");
    } catch (error) {
      utils.showToast("Error: " + error.message, "error");
    }
  },

  async deleteIntention(id) {
    if (!confirm("Delete this intention?")) return;
    await update(ref(db, `intentions/${id}`), { deleted: true, deletedAt: Date.now() });
    utils.showToast("Intention removed");
  },

  async markIntentionAnswered(id) {
    if (!confirm("Mark this intention as answered?")) return;
    await update(ref(db, `intentions/${id}`), { 
      answered: true,
      answeredDate: Date.now()
    });
    utils.showToast("Intention marked as answered");
  },

  setDailyGoal() {
    const goal = prompt("Set daily prayer goal:", localStorage.getItem("dailyGoal") || "10");
    if (goal && !isNaN(goal)) {
      localStorage.setItem("dailyGoal", goal);
      render.dashboard();
      utils.showToast("Daily goal updated");
    }
  },

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      session.clear();
      location.reload();
    }
  }
};

// ================================================
// EVENT LISTENERS
// ================================================
function setupEventListeners() {
  // PIN screen
  const pinInput = document.getElementById('pinInput');
  const pinBtn = document.getElementById('pinSubmitBtn');
  
  if (pinInput && pinBtn) {
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handlePinSubmit();
    });
    pinBtn.addEventListener('click', handlePinSubmit);
  }

  // Menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const closeMenu = document.getElementById('closeMenu');
  
  if (menuToggle) menuToggle.addEventListener('click', () => ui.openMenu());
  if (closeMenu) closeMenu.addEventListener('click', () => ui.closeMenu());

  // Menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    if (item.dataset.view) {
      item.addEventListener('click', () => ui.showView(item.dataset.view));
    }
  });

  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', () => ui.toggleTheme());

  // Date navigation
  const prevBtn = document.getElementById('prevDayBtn');
  const nextBtn = document.getElementById('nextDayBtn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      state.currentDate.setDate(state.currentDate.getDate() - 1);
      ui.updateDateDisplay();
      data.loadAll();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const today = utils.localISODate(new Date());
      if (state.todayString !== today) {
        state.currentDate.setDate(state.currentDate.getDate() + 1);
        ui.updateDateDisplay();
        data.loadAll();
      }
    });
  }

  // Quick actions
  const quickMass = document.getElementById('quickMass');
  const quickScripture = document.getElementById('quickScripture');
  const quickLectio = document.getElementById('quickLectio');
  
  if (quickMass) quickMass.addEventListener('click', () => actions.toggleQuickAction('mass'));
  if (quickScripture) quickScripture.addEventListener('click', () => actions.toggleQuickAction('scripture'));
  if (quickLectio) quickLectio.addEventListener('click', () => actions.toggleQuickAction('lectio'));

  // Quick add intention
  const quickAddBtn = document.getElementById('quickAddIntentionBtn');
  if (quickAddBtn) quickAddBtn.addEventListener('click', () => actions.quickAddIntention());

  // Menu actions
  const setGoalBtn = document.getElementById('setGoalBtn');
  const exportBtn = document.getElementById('exportDataBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (setGoalBtn) setGoalBtn.addEventListener('click', () => actions.setDailyGoal());
  if (exportBtn) exportBtn.addEventListener('click', () => data.exportData());
  if (logoutBtn) logoutBtn.addEventListener('click', () => actions.logout());

  // Modal close on background click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

// ================================================
// PIN HANDLING
// ================================================
function handlePinSubmit() {
  const pinInput = document.getElementById('pinInput');
  if (!pinInput) return;

  const pin = pinInput.value.trim();
  if (pin === REQUIRED_PIN) {
    session.save(pin);
    ui.showScreen('loadingScreen');
    setTimeout(async () => {
      await startApp();
    }, 400);
  } else {
    pinInput.value = '';
    utils.showToast("Incorrect PIN", "error");
  }
}

// ================================================
// APP INITIALIZATION
// ================================================
async function startApp() {
  try {
    await data.loadAll();
    ui.showScreen('mainApp');
  } catch (error) {
    console.error("Failed to start app:", error);
    utils.showToast("Failed to load. Please refresh.", "error");
    ui.showScreen('mainApp');
  }
}

// ================================================
// DOCUMENT READY
// ================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Check for saved theme
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = document.querySelector('.theme-icon');
    if (icon) icon.textContent = "☀";
  }

  // Setup all event listeners
  setupEventListeners();

  // Check session
  if (session.check()) {
    ui.showScreen('loadingScreen');
    setTimeout(async () => {
      await startApp();
    }, 400);
  } else {
    ui.showScreen('pinScreen');
  }
});

// ================================================
// EXPOSE ACTIONS GLOBALLY (for onclick handlers)
// ================================================
window.actions = actions;
window.showPrayerInfo = (key) => {
  // TODO: Implement prayer info modal
  utils.showToast("Prayer info coming soon");
};
window.closePrayerTextModal = () => {
  const modal = document.getElementById('prayerTextModal');
  if (modal) modal.classList.remove('active');
};

// ================================================
// ERROR HANDLING
// ================================================
window.addEventListener('error', (e) => {
  console.error('Global error:', e.message, e.filename, e.lineno);
  utils.showToast("An error occurred", "error");
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  utils.showToast("An error occurred", "error");
});
