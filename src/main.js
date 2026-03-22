/**
 * Nunki — Offline-first PWA
 * No logins. No tracking. Works offline.
 */

import './style.css';
import { FOSTER_SECTIONS, FOSTER_CONTENT } from './foster-content.js';

const INFO_SEEN_KEY = 'nunki-seen-info';

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (window.navigator.standalone === true)
  );
}

function showInfoScreen() {
  const overlay = document.getElementById('info-overlay');
  if (overlay) overlay.classList.add('info-overlay--visible');
}

function hideInfoScreen() {
  const overlay = document.getElementById('info-overlay');
  if (overlay) overlay.classList.remove('info-overlay--visible');
  try { localStorage.setItem(INFO_SEEN_KEY, '1'); } catch {}
}

function initInfoScreen() {
  const overlay = document.createElement('div');
  overlay.id = 'info-overlay';
  overlay.className = 'info-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-labelledby', 'info-title');
  overlay.innerHTML = `
    <div class="info-overlay__backdrop" data-action="close-info" aria-hidden="true"></div>
    <div class="info-overlay__panel">
      <div class="info-overlay__header">
        <h2 id="info-title">Save Nunki for offline use</h2>
        <button type="button" class="info-overlay__close" data-action="close-info" aria-label="Close">×</button>
      </div>
      <div class="info-overlay__body">
        <section class="info-section">
          <h3>How to add to your phone</h3>
          <p><strong>iPhone (Safari):</strong> Tap the Share button (square with arrow) → Add to Home Screen → Add.</p>
          <p><strong>Android (Chrome):</strong> Tap the ⋮ menu → Add to Home screen or Install app → Add.</p>
          <p>Once added, Nunki works like an app and opens without the browser bar.</p>
        </section>
        <section class="info-section">
          <h3>What works offline</h3>
          <p>After you open Nunki once while online, everything is saved for offline use:</p>
          <ul>
            <li><strong>Places</strong> — Shelters, meals, washrooms, safe consumption (Vancouver, Toronto & Hamilton)</li>
            <li><strong>Life skills</strong> — Benefits, taxes, healthcare, jobs, mental health</li>
            <li><strong>Transit tips</strong> — Text stop numbers for real-time arrivals</li>
          </ul>
        </section>
        <section class="info-section">
          <h3>How to get the freshest data</h3>
          <p>Data updates when you open Nunki while connected to the internet. The app checks for new shelter, meal, and washroom info in the background.</p>
          <p><strong>Tip:</strong> Open the app when you have Wi‑Fi or data to refresh. No need to delete and re-add.</p>
        </section>
        <section class="info-section">
          <h3>Privacy</h3>
          <p>No logins. No tracking. Everything stays on your device.</p>
        </section>
      </div>
    </div>
  `;
  overlay.querySelectorAll('[data-action="close-info"]').forEach((el) => {
    el.addEventListener('click', hideInfoScreen);
  });
  document.body.appendChild(overlay);

  const topBar = document.createElement('div');
  topBar.id = 'top-bar';
  topBar.className = 'top-bar';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'info-btn';
  btn.setAttribute('aria-label', 'App info & how to save offline');
  btn.innerHTML = 'i';
  btn.addEventListener('click', showInfoScreen);
  topBar.appendChild(btn);
  document.body.appendChild(topBar);

  const inBrowser = !isStandalone();
  const hasSeen = !!localStorage.getItem(INFO_SEEN_KEY);
  if (inBrowser && !hasSeen) showInfoScreen();
}

function initOfflineIndicator() {
  const bar = document.createElement('div');
  bar.id = 'status-bar';
  bar.className = 'status-bar';
  bar.setAttribute('aria-live', 'polite');
  function update() {
    const online = navigator.onLine;
    let text = online ? 'Online' : 'Offline';
    try {
      if (sessionStorage.getItem('nunki-updated')) {
        sessionStorage.removeItem('nunki-updated');
        text = 'Updated';
        bar.dataset.status = 'updated';
        bar.textContent = text;
        setTimeout(update, 3000);
        return;
      }
    } catch {}
    bar.textContent = text;
    bar.dataset.status = online ? 'online' : 'offline';
  }
  update();
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  const topBar = document.getElementById('top-bar');
  if (topBar) topBar.insertBefore(bar, topBar.firstChild);
  else document.body.appendChild(bar);
}

function setUpdatedFlag() {
  try { sessionStorage.setItem('nunki-updated', '1'); } catch {}
}

const CITIES = {
  vancouver: { name: 'Vancouver', dataFile: 'vancouver.json' },
  toronto: { name: 'Toronto', dataFile: 'toronto.json' },
  hamilton: { name: 'Hamilton', dataFile: 'hamilton.json' },
};

/** Google Forms (public submission) — base view URLs */
const GOOGLE_FORM_SUGGEST_PLACE =
  'https://docs.google.com/forms/d/e/1FAIpQLSdyoqRqDGKCx8w4r4AHaM-UFcENICq2KR_Raag4f-3BQxzK8Q/viewform';
const GOOGLE_FORM_REPORT_ISSUE =
  'https://docs.google.com/forms/d/e/1FAIpQLSdMVjBa-Zr3FOd6k8klAAx1AX-0KspOsw2dBgENxS64Ycf-FQ/viewform';

/**
 * Prefill entry IDs (from each form’s embedded FB_PUBLIC_LOAD_DATA / “Get pre-filled link”).
 * If Google Form questions are reordered or recreated, update these to match.
 */
const FORM_SUGGEST_ENTRY_CITY = '1414695933';
const FORM_REPORT_ENTRY_CITY = '2030346749';
const FORM_REPORT_ENTRY_PLACE_NAME = '793334179';
const FORM_REPORT_ENTRY_TYPE = '489835213';
const FORM_REPORT_ENTRY_OTHER = '468962753';

/** Maps amenity.type → Google Form “Type” option label (report form). */
function reportFormTypeLabel(type) {
  const m = {
    shelter: 'Shelter',
    meal: 'Meals',
    washroom: 'Washroom',
    safe_injection: 'Safe Injection',
    transit_hub: 'Transit Hub',
  };
  return m[type] || 'Washroom';
}

function googleFormPrefillUrl(baseViewUrl, entryPairs) {
  const params = new URLSearchParams();
  params.set('usp', 'pp_url');
  for (const [entryId, value] of entryPairs) {
    if (value == null || String(value).trim() === '') continue;
    params.set(`entry.${entryId}`, String(value));
  }
  return `${baseViewUrl}?${params.toString()}`;
}

function getSuggestPlaceFormUrl(cityDisplayName) {
  return googleFormPrefillUrl(GOOGLE_FORM_SUGGEST_PLACE, [[FORM_SUGGEST_ENTRY_CITY, cityDisplayName]]);
}

/**
 * Report form has no dedicated “record id” field in production; we prefill city, name, type,
 * and put the stable app id in “Other details” for maintainers.
 */
function getReportIssueFormUrl(amenity, cityDisplayName) {
  const other = `App record ID (for maintainers): ${amenity.id}`;
  return googleFormPrefillUrl(GOOGLE_FORM_REPORT_ISSUE, [
    [FORM_REPORT_ENTRY_CITY, cityDisplayName],
    [FORM_REPORT_ENTRY_PLACE_NAME, amenity.name || ''],
    [FORM_REPORT_ENTRY_TYPE, reportFormTypeLabel(amenity.type)],
    [FORM_REPORT_ENTRY_OTHER, other],
  ]);
}

function getTransitTipsParagraph() {
  if (currentCity === 'vancouver') {
    return 'Text your bus stop number to <strong>33333</strong> for real-time arrivals. Find stop numbers on the pole.';
  }
  if (currentCity === 'hamilton') {
    return 'HSR: call <strong>905-527-4441</strong> for next bus times, or use <strong>hsrnow.hamilton.ca</strong> for real-time info.';
  }
  return 'Text your stop number to <strong>898882</strong> (TXTTTC) for real-time bus/streetcar arrivals.';
}

function getTransitDetailFootnote() {
  if (currentCity === 'vancouver') {
    return 'Text stop # to 33333 for arrivals. Route data by permission of TransLink.';
  }
  if (currentCity === 'hamilton') {
    return 'HSR: 905-527-4441 or hsrnow.hamilton.ca.';
  }
  return 'Text stop # to 898882 for arrivals.';
}

const SECTIONS = [
  { id: 'survival', title: 'Places', desc: 'Shelters, meals, washrooms, transit', route: '/survival' },
  { id: 'foster', title: 'Life skills', desc: 'Benefits, taxes, healthcare, jobs', route: '/foster' },
  { id: 'donate', title: 'Donate', desc: 'Support shelters and kitchens', route: '/donate' },
];

const TYPE_LABELS = {
  shelter: 'Shelter',
  meal: 'Meal program',
  washroom: 'Washroom',
  safe_injection: 'Safe consumption',
  transit_hub: 'Transit',
};

let currentCity = null;
let regionData = null;
let currentFilterType = 'all';
let currentRegion = 'all';
let currentSearch = '';
let currentWheelchairOnly = false;
let currentFavoritesOnly = false;
let lastClickedAmenityId = null;

const FAVORITES_KEY = 'nunki-favorites';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch { return []; }
}

function isFavorite(amenityId) {
  return getFavorites().some((f) => f.amenityId === amenityId && f.cityId === currentCity);
}

function toggleFavorite(amenityId) {
  const favs = getFavorites();
  const idx = favs.findIndex((f) => f.amenityId === amenityId && f.cityId === currentCity);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push({ cityId: currentCity, amenityId });
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs)); } catch {}
}

function getAppEl() {
  return document.getElementById('app');
}

function getBase() {
  return import.meta.env.BASE_URL || '/';
}

async function fetchJSON(path) {
  const base = getBase();
  const url = path.startsWith('/') ? path : `${base}data/${path}`;
  const fullUrl = url.startsWith('http') ? url : new URL(url, location.origin).href;
  let res = await fetch(fullUrl).catch(() => null);
  if (!res?.ok) {
    const cached = await caches?.match?.(fullUrl);
    if (cached?.ok) return cached.json();
    if (res?.status === 503) throw new Error('offline');
    throw new Error(res ? `Failed to load ${path}` : 'offline');
  }
  return res.json();
}

/** Pre-fetch assets (JS, CSS) and data so the service worker caches them for offline use. */
function prefetchForOffline() {
  const base = getBase().replace(/\/?$/, '/');
  const origin = location.origin;
  // Cache current page's scripts and styles (they weren't cached on first load—SW wasn't controlling yet)
  document.querySelectorAll('script[src], link[rel="stylesheet"][href]').forEach((el) => {
    const url = (el.src || el.href || '').trim();
    if (url && url.startsWith(origin)) fetch(url).catch(() => {});
  });
  // Cache all data files
  ['vancouver.json', 'toronto.json', 'hamilton.json', 'benefits.json'].forEach((f) =>
    fetch(`${base}data/${f}`).catch(() => {})
  );
}

function renderHome() {
  const city = currentCity ? CITIES[currentCity] : null;
  const app = getAppEl();

  if (!city) {
    app.innerHTML = `
      <main class="page city-select" role="main">
        <h1>Nunki</h1>
        <p style="margin: 1rem 0; color: var(--muted);">Choose your city</p>
        ${Object.entries(CITIES).map(([id, c]) => `
          <button class="city-btn" type="button" data-city="${id}" aria-label="Select ${c.name}">${c.name}</button>
        `).join('')}
      </main>
    `;
    app.querySelectorAll('.city-btn').forEach((btn) => {
      btn.addEventListener('click', () => selectCity(btn.dataset.city));
    });
    return;
  }

  app.innerHTML = `
    <main class="page" role="main">
      <header class="header">
        <h1 class="header-city">${city.name}</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Places, life skills, donate</p>
      </header>
      <nav class="section-grid" aria-label="Main sections">
        ${SECTIONS.map((s) => `
          <button class="section-btn" type="button" data-route="${s.route}">${s.title}<small>${s.desc}</small></button>
        `).join('')}
      </nav>
      <p style="margin-top: 2rem;">
        <button class="back-btn" type="button" data-action="change-city">← Change city</button>
      </p>
    </main>
  `;
  app.querySelectorAll('.section-btn').forEach((btn) => {
    btn.addEventListener('click', () => navigate(btn.dataset.route));
  });
  app.querySelector('[data-action="change-city"]').addEventListener('click', () => {
    currentCity = null;
    regionData = null;
    renderHome();
  });
}

function selectCity(cityId) {
  currentCity = cityId;
  renderHome();
}

function navigate(route) {
  if (route === '/survival') renderSurvival();
  else if (route === '/foster') renderFoster();
  else if (route === '/donate') renderDonate();
  else renderHome();
}

async function renderSurvival() {
  const app = getAppEl();
  const city = CITIES[currentCity];
  if (!city) return;

  app.innerHTML = `
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1 class="header-city">${city.name}</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Places</p>
      </header>
      <p style="color: var(--muted);">Loading…</p>
    </main>
  `;
  app.querySelector('[data-action="back"]').addEventListener('click', () => { regionData = null; renderHome(); });

  try {
    regionData = await fetchJSON(city.dataFile);
    currentFilterType = 'all';
    currentRegion = 'all';
    currentSearch = '';
    currentWheelchairOnly = false;
    currentFavoritesOnly = false;
    lastClickedAmenityId = null;
    renderAmenityList();
  } catch (err) {
    const msg = err.message === 'offline'
      ? "Open Nunki once while connected to load places."
      : `Could not load: ${err.message}`;
    app.querySelector('p').textContent = msg;
  }
}

const AMENITY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'shelter', label: 'Shelters' },
  { id: 'meal', label: 'Meals' },
  { id: 'washroom', label: 'Washrooms' },
  { id: 'safe_injection', label: 'Safe consumption' },
];

/** Human-readable area from meta.regions or title-cased id (e.g. ward-10 → Ward 10). */
function amenityRegionLabel(amenity, regionsList) {
  const id = amenity.region || 'downtown';
  const found = (regionsList || []).find((r) => r.id === id);
  if (found?.name) return found.name;
  return id
    .split('-')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ''))
    .filter(Boolean)
    .join(' ');
}

/** Keep filter chip borders / aria-pressed in sync (fast path only replaced the list, not these). */
function syncFilterChipState(app, filterType, region, wheelchairOnly, favoritesOnly) {
  app.querySelectorAll('.filter-btn[data-filter]').forEach((btn) => {
    const on = btn.dataset.filter === filterType;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  app.querySelectorAll('.filter-btn[data-region]').forEach((btn) => {
    const on = btn.dataset.region === region;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  const wBtn = app.querySelector('[data-wheelchair]');
  if (wBtn) wBtn.setAttribute('aria-pressed', wheelchairOnly ? 'true' : 'false');
  const fBtn = app.querySelector('[data-favorites]');
  if (fBtn) fBtn.setAttribute('aria-pressed', favoritesOnly ? 'true' : 'false');
}

function renderAmenityList(filterType = 'all', region = 'all', search = '', wheelchairOnly = false, favoritesOnly = false) {
  const app = getAppEl();
  if (!regionData || !regionData.amenities) return;

  const amenities = regionData.amenities;
  let filtered = filterType === 'all' ? amenities : amenities.filter((a) => a.type === filterType);
  if (region !== 'all') {
    filtered = filtered.filter((a) => (a.region || 'downtown') === region);
  }
  if (wheelchairOnly) {
    filtered = filtered.filter((a) => (a.notes || '').toLowerCase().includes('wheelchair accessible'));
  }
  if (favoritesOnly) {
    filtered = filtered.filter((a) => isFavorite(a.id));
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter((a) =>
      (a.name || '').toLowerCase().includes(q) ||
      (a.address || '').toLowerCase().includes(q) ||
      (a.intersection || '').toLowerCase().includes(q) ||
      (a.notes || '').toLowerCase().includes(q) ||
      (a.category || '').toLowerCase().includes(q)
    );
  }
  const regions = regionData.meta?.regions || [];
  const cityName = CITIES[currentCity]?.name || 'City';
  const updated = regionData.meta?.updated || '';
  const listHtml = filtered.map((a) => {
    const typeLine = [TYPE_LABELS[a.type] || a.type];
    const addr = (a.address || a.intersection || '').trim();
    if (addr) typeLine.push(addr);
    typeLine.push(amenityRegionLabel(a, regions));
    const sub = typeLine.map(escapeHtml).join(' · ');
    return `
    <li class="amenity-item">
      <button class="amenity-link" type="button" data-id="${a.id}" style="width:100%;text-align:left;border:none;background:none;cursor:pointer;font:inherit;color:inherit;">
        <span style="float:right;color:var(--muted);">${isFavorite(a.id) ? '★' : ''}</span>
        <strong>${escapeHtml(a.name)}</strong>
        <small>${sub}</small>
      </button>
    </li>
  `;
  }).join('');

  const listContainer = document.getElementById('amenity-list-container');
  if (listContainer) {
    listContainer.innerHTML = listHtml;
    const headerSub = document.querySelector('.amenity-list-header-sub');
    if (headerSub) headerSub.textContent = `${filtered.length} places${updated ? ` · Updated ${updated}` : ''}`;
    syncFilterChipState(app, filterType, region, wheelchairOnly, favoritesOnly);
    app.querySelectorAll('.amenity-link[data-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        lastClickedAmenityId = btn.dataset.id;
        const a = amenities.find((x) => x.id === btn.dataset.id);
        if (a) renderAmenityDetail(a);
      });
    });
    if (lastClickedAmenityId) {
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-id="${lastClickedAmenityId}"]`);
        if (el) el.scrollIntoView({ block: 'nearest', behavior: 'auto' });
        lastClickedAmenityId = null;
      });
    }
    return;
  }

  app.innerHTML = `
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back-to-list">← Back</button>
      <header class="header">
        <h1 class="header-city">${cityName}</h1>
        <p class="amenity-list-header-sub" style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${filtered.length} places${updated ? ` · Updated ${updated}` : ''}</p>
      </header>
      <div style="margin-bottom:1rem;">
        <label for="places-search" style="font-size:0.75rem;color:var(--muted);display:block;margin-bottom:0.25rem;">Search by name, address, or notes</label>
        <input id="places-search" type="search" class="search-input" placeholder="e.g. Union Gospel, Hastings…" value="${escapeHtml(search)}" data-action="search" aria-label="Search by name, address, or notes" />
      </div>
      ${regions.length > 0 ? `
      <section class="filter-section" aria-label="Filter by area">
        <h2 class="filter-section-title">Area</h2>
        <div class="filter-chip-row" role="group">
          <button class="filter-btn" type="button" data-region="all" aria-pressed="${region === 'all' ? 'true' : 'false'}">All areas</button>
          ${regions.map((r) => `
            <button class="filter-btn" type="button" data-region="${escapeHtml(r.id)}" aria-pressed="${region === r.id ? 'true' : 'false'}">${escapeHtml(r.name)}</button>
          `).join('')}
        </div>
      </section>
      ` : ''}
      <section class="filter-section" aria-label="Filter by place type">
        <h2 class="filter-section-title">Type</h2>
        <div class="filter-chip-row" role="group">
          ${AMENITY_TYPES.map((t) => `
            <button class="filter-btn" type="button" data-filter="${t.id}" aria-pressed="${filterType === t.id ? 'true' : 'false'}">${t.label}</button>
          `).join('')}
        </div>
      </section>
      <section class="filter-section filter-section--refine" aria-label="Narrow the list">
        <h2 class="filter-section-title">Refine</h2>
        <div class="filter-chip-row" role="group">
          <button class="filter-btn filter-btn--toggle" type="button" data-wheelchair aria-pressed="${wheelchairOnly ? 'true' : 'false'}">Wheelchair accessible</button>
          <button class="filter-btn filter-btn--toggle" type="button" data-favorites aria-pressed="${favoritesOnly ? 'true' : 'false'}">Favorites</button>
        </div>
      </section>
      <section class="submission-actions" aria-label="Suggest a place">
        <a class="submission-btn submission-btn--add" href="${escapeHtml(getSuggestPlaceFormUrl(cityName))}" target="_blank" rel="noopener noreferrer">Suggest a missing place</a>
        <p class="submission-hint">Opens a short Google Form · ${escapeHtml(cityName)} is pre-selected</p>
      </section>
      <ul class="amenity-list" id="amenity-list-container">
        ${listHtml}
      </ul>
      <section class="detail-section" style="margin-top: 2rem;">
        <h3>Transit</h3>
        <p>${getTransitTipsParagraph()}</p>
      </section>
    </main>
  `;
  app.querySelector('[data-action="back-to-list"]').addEventListener('click', () => {
    regionData = null;
    currentFilterType = 'all';
    currentRegion = 'all';
    currentSearch = '';
    currentWheelchairOnly = false;
    currentFavoritesOnly = false;
    lastClickedAmenityId = null;
    renderHome();
  });
  app.querySelector('[data-action="search"]')?.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderAmenityList(currentFilterType, currentRegion, currentSearch, currentWheelchairOnly, currentFavoritesOnly);
  });
  app.querySelector('[data-action="search"]')?.addEventListener('search', (e) => {
    currentSearch = e.target.value || '';
    renderAmenityList(currentFilterType, currentRegion, currentSearch, currentWheelchairOnly, currentFavoritesOnly);
  });
  app.querySelector('[data-wheelchair]')?.addEventListener('click', () => {
    currentWheelchairOnly = !currentWheelchairOnly;
    renderAmenityList(currentFilterType, currentRegion, currentSearch, currentWheelchairOnly, currentFavoritesOnly);
  });
  app.querySelector('[data-favorites]')?.addEventListener('click', () => {
    currentFavoritesOnly = !currentFavoritesOnly;
    renderAmenityList(currentFilterType, currentRegion, currentSearch, currentWheelchairOnly, currentFavoritesOnly);
  });
  app.querySelectorAll('.filter-btn[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilterType = btn.dataset.filter;
      renderAmenityList(currentFilterType, currentRegion, currentSearch, currentWheelchairOnly, currentFavoritesOnly);
    });
  });
  app.querySelectorAll('.filter-btn[data-region]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentRegion = btn.dataset.region;
      renderAmenityList(currentFilterType, currentRegion, currentSearch, currentWheelchairOnly, currentFavoritesOnly);
    });
  });
  app.querySelectorAll('.amenity-link[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      lastClickedAmenityId = btn.dataset.id;
      const a = amenities.find((x) => x.id === btn.dataset.id);
      if (a) renderAmenityDetail(a);
    });
  });
  // Restore scroll to previously clicked item
  if (lastClickedAmenityId) {
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-id="${lastClickedAmenityId}"]`);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      lastClickedAmenityId = null;
    });
  }
}

function sharePlace(amenity) {
  const text = [amenity.name, amenity.address || amenity.intersection, amenity.phone].filter(Boolean).join(' · ');
  if (navigator.share) {
    navigator.share({ title: amenity.name, text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => {});
  }
}

function renderAmenityDetail(amenity) {
  const app = getAppEl();
  const phoneRaw = (amenity.phone || '').trim();
  const phoneDigitsOnly = (phoneRaw.match(/\d/g) || []).join('');
  const hasDialablePhone = phoneDigitsOnly.length >= 10;
  const hasAnyPhone = phoneRaw.length > 0;
  const hours = (amenity.hours || '').trim();
  // Hide generic "call for hours" only when there is no number to call at all
  const hoursRequireCall =
    /call\s+for\s+(hours|info)|call\s+or\s+check\s+with\s+venue/i.test(hours);
  const showHours =
    hours.length > 0 &&
    (!hoursRequireCall || hasDialablePhone || hasAnyPhone);
  const faved = isFavorite(amenity.id);
  const dirUrl = getDirectionsUrl(amenity);
  const cityDisplay = CITIES[currentCity]?.name || 'City';
  const reportFormUrl = getReportIssueFormUrl(amenity, cityDisplay);
  app.innerHTML = `
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back-to-list">← Back to list</button>
      <div class="detail">
        <div style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.5rem;">
          <h2 style="flex:1;margin:0;">${escapeHtml(amenity.name)}</h2>
          <div style="display:flex;gap:0.25rem;">
            <button type="button" class="icon-btn" data-action="favorite" aria-label="${faved ? 'Remove from favorites' : 'Add to favorites'}">${faved ? '★' : '☆'}</button>
            <button type="button" class="icon-btn" data-action="share" aria-label="Share">⎘</button>
          </div>
        </div>
        <p class="detail-meta">${TYPE_LABELS[amenity.type] || amenity.type} · ${escapeHtml(amenity.address || amenity.intersection || '')}</p>
        <div class="detail-section">
          <a href="${dirUrl}" target="_blank" rel="noopener" class="directions-link">Get directions</a>
        </div>
        ${hasAnyPhone ? `
        <div class="detail-section">
          <h3>Phone</h3>
          <p>${hasDialablePhone
    ? `<a href="tel:${phoneDigitsOnly}">${escapeHtml(phoneRaw)}</a>`
    : `<span>${escapeHtml(phoneRaw)}</span>`}</p>
        </div>
        ` : ''}
        ${showHours ? `
        <div class="detail-section">
          <h3>Hours</h3>
          <p>${escapeHtml(hours)}</p>
        </div>
        ` : ''}
        ${amenity.notes ? `
        <div class="detail-section">
          <h3>Notes</h3>
          <p>${escapeHtml(amenity.notes)}</p>
        </div>
        ` : ''}
        ${amenity.category ? `
        <div class="detail-section">
          <h3>Serves</h3>
          <p>${escapeHtml(amenity.category)}</p>
        </div>
        ` : ''}
        ${amenity.nearby_routes?.length ? `
        <div class="detail-section">
          <h3>Nearby transit</h3>
          <p>${amenity.nearby_routes.map((r) => escapeHtml(r)).join(", ")}</p>
          <p style="margin-top:0.5rem;font-size:0.875rem;color:var(--muted);">${getTransitDetailFootnote()}</p>
        </div>
        ` : ''}
        <div class="detail-section detail-section--report">
          <a class="submission-btn submission-btn--report" href="${escapeHtml(reportFormUrl)}" target="_blank" rel="noopener noreferrer">Report wrong or missing info</a>
          <p class="submission-hint">Google Form · place name, type, city, and app record ID pre-filled where the form allows</p>
        </div>
      </div>
    </main>
  `;
  app.querySelector('[data-action="back-to-list"]').addEventListener('click', () => {
    renderAmenityList(currentFilterType, currentRegion, currentSearch, currentWheelchairOnly, currentFavoritesOnly);
  });
  app.querySelector('[data-action="favorite"]')?.addEventListener('click', () => {
    toggleFavorite(amenity.id);
    renderAmenityDetail(amenity);
  });
  app.querySelector('[data-action="share"]').addEventListener('click', () => sharePlace(amenity));
}

function escapeHtml(s) {
  if (!s) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function getDirectionsUrl(amenity) {
  const addr = amenity.address || amenity.intersection || amenity.name || '';
  const q = (amenity.lat != null && amenity.lng != null)
    ? `${amenity.lat},${amenity.lng}`
    : encodeURIComponent(addr);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

async function loadBenefitsContent() {
  const el = document.getElementById('benefits-content');
  if (!el) return;
  try {
    const data = await fetchJSON('benefits.json');
    let html = '';
    for (const [prov, info] of Object.entries(data)) {
      html += `<h3>${escapeHtml(info.province)}</h3>`;
      for (const p of info.programs || []) {
        html += `<div class="benefit-card" style="margin-bottom:1rem;padding:1rem;border:1px solid var(--border);">`;
        html += `<strong>${escapeHtml(p.name)}</strong> (${escapeHtml(p.age)})<br>`;
        html += `<p style="margin:0.5rem 0;">${escapeHtml(p.what)}</p>`;
        if (p.phone) html += `<p>Call <a href="tel:${p.phone.replace(/[\s\-]/g,'')}">${escapeHtml(p.phone)}</a></p>`;
        if (p.link) html += `<p><a href="${escapeHtml(p.link)}" target="_blank" rel="noopener">Learn more</a></p>`;
        html += `</div>`;
      }
    }
    el.innerHTML = html;
  } catch {
    el.innerHTML = '<p>Open Nunki once while connected to load benefits.</p>';
  }
}

function renderFoster(sectionId = null) {
  const app = getAppEl();

  if (sectionId && FOSTER_CONTENT[sectionId]) {
    const content = FOSTER_CONTENT[sectionId];
    app.innerHTML = `
      <main class="page" role="main">
        <button class="back-btn" type="button" data-action="foster-back">← Back</button>
        <header class="header">
          <h1>${escapeHtml(content.title)}</h1>
        </header>
        <div class="detail foster-content">${content.body}</div>
      </main>
    `;
    app.querySelector('[data-action="foster-back"]').addEventListener('click', () => renderFoster());
    if (sectionId === 'benefits') loadBenefitsContent();
    return;
  }

  app.innerHTML = `
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1 class="header-city">${CITIES[currentCity]?.name || 'Life skills'}</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Life skills</p>
      </header>
      <ul class="resource-list">
        ${FOSTER_SECTIONS.map((s) => `
          <li class="resource-item">
            <button class="resource-link resource-btn" type="button" data-route="${s.route}">
              <span class="resource-label">${escapeHtml(s.desc)}</span>
              <span class="resource-title">${escapeHtml(s.title)}</span>
            </button>
          </li>
        `).join('')}
      </ul>
    </main>
  `;
  app.querySelector('[data-action="back"]').addEventListener('click', () => renderHome());
  app.querySelectorAll('.resource-link[data-route]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const route = btn.dataset.route;
      if (route === '/survival') renderSurvival();
      else if (route.startsWith('foster/')) renderFoster(route.replace('foster/', ''));
    });
  });
}

const DONATION_ORGS = {
  vancouver: [
    { name: 'Union Gospel Mission', url: 'https://ugm.ca/ways-to-give', desc: 'Shelters, meals, outreach' },
    { name: 'Covenant House Vancouver', url: 'https://www.covenanthousebc.org/take-action/ways-to-give/', desc: 'Youth shelter, meals' },
    { name: 'Greater Vancouver Food Bank', url: 'https://foodbank.bc.ca/donate/', desc: 'Food for meal programs' },
  ],
  toronto: [
    { name: 'Daily Bread Food Bank', url: 'https://www.dailybread.ca/give-now/', desc: 'Food for meal programs' },
    { name: 'Covenant House Toronto', url: 'https://covenanthousetoronto.ca/how-to-help/', desc: 'Youth shelter' },
    { name: 'Street Haven', url: 'https://streethaven.org/donation/', desc: "Women's shelter" },
  ],
  hamilton: [
    { name: 'Good Shepherd Hamilton', url: 'https://goodshepherdcentres.ca/donate/', desc: 'Shelters, meals, family programs' },
    { name: 'Mission Services Hamilton', url: 'https://missionservices.ca/donate/', desc: 'Shelters, drop-ins' },
    { name: 'Hamilton Food Share', url: 'https://hamiltonfoodshare.org/how-you-can-help/donate', desc: 'Food bank network' },
  ],
};

function renderDonate() {
  const app = getAppEl();
  const city = currentCity || 'vancouver';
  const orgs = DONATION_ORGS[city] || [];
  const cityName = CITIES[city]?.name || city;
  const listHtml = orgs.map((o) =>
    `<li><a href="${escapeHtml(o.url)}" target="_blank" rel="noopener">${escapeHtml(o.name)}</a> — ${escapeHtml(o.desc)}</li>`
  ).join('');
  app.innerHTML = `
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1 class="header-city">${escapeHtml(cityName)}</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Donate — support shelters and kitchens</p>
      </header>
      <div class="detail foster-content">
        <ul>${listHtml}</ul>
      </div>
    </main>
  `;
  app.querySelector('[data-action="back"]').addEventListener('click', () => renderHome());
}

function handleRoute() {
  const hash = window.location.hash.slice(1) || '';
  if (hash === 'survival') { if (!currentCity) currentCity = 'vancouver'; renderSurvival(); }
  else if (hash === 'donate') renderDonate();
  else if (hash.startsWith('foster')) {
    const part = hash.replace('foster', '').replace(/^\//, '');
    if (part && FOSTER_CONTENT[part]) renderFoster(part);
    else renderFoster();
  }
  else renderHome();
}

// Register Service Worker, check for updates (so PWA gets updates too), and pre-fetch for offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${getBase()}sw.js`)
      .then((reg) => {
        if (navigator.onLine) reg.update(); // Only when online — avoids failed requests that can trigger iOS "no internet" popup
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setUpdatedFlag();
          window.location.reload(); // New SW activated — reload to get fresh app
        });
        return reg.ready;
      })
      .then(() => { if (navigator.onLine) prefetchForOffline(); })
      .catch(() => {});
  });
}

window.addEventListener('load', () => {
  initInfoScreen();
  initOfflineIndicator();
});

window.addEventListener('hashchange', handleRoute);
handleRoute();
