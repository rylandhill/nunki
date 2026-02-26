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
            <li><strong>Places</strong> — Shelters, meals, washrooms, safe consumption (Vancouver & Toronto)</li>
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

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'info-btn';
  btn.setAttribute('aria-label', 'App info & how to save offline');
  btn.innerHTML = 'ℹ️';
  btn.addEventListener('click', showInfoScreen);
  document.body.appendChild(btn);

  const inBrowser = !isStandalone();
  const hasSeen = !!localStorage.getItem(INFO_SEEN_KEY);
  if (inBrowser && !hasSeen) showInfoScreen();
}

const CITIES = {
  vancouver: { name: 'Vancouver', dataFile: 'vancouver.json' },
  toronto: { name: 'Toronto', dataFile: 'toronto.json' },
};

const SECTIONS = [
  { id: 'survival', title: 'Places', desc: 'Shelters, meals, washrooms, transit', route: '/survival' },
  { id: 'foster', title: 'Life skills', desc: 'Benefits, taxes, healthcare, jobs', route: '/foster' },
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
let lastClickedAmenityId = null;

function getAppEl() {
  return document.getElementById('app');
}

function getBase() {
  return import.meta.env.BASE_URL || '/';
}

async function fetchJSON(path) {
  const base = getBase();
  const url = path.startsWith('/') ? path : `${base}data/${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
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
  ['vancouver.json', 'toronto.json', 'benefits.json'].forEach((f) =>
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
        <h1>Nunki</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${city.name}</p>
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
        <h1>Places</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${city.name}</p>
      </header>
      <p style="color: var(--muted);">Loading…</p>
    </main>
  `;
  app.querySelector('[data-action="back"]').addEventListener('click', () => { regionData = null; renderHome(); });

  try {
    regionData = await fetchJSON(city.dataFile);
    currentFilterType = 'all';
    currentRegion = 'all';
    lastClickedAmenityId = null;
    renderAmenityList();
  } catch (err) {
    app.querySelector('p').textContent = `Could not load data: ${err.message}. Try again when you're online.`;
  }
}

const AMENITY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'shelter', label: 'Shelters' },
  { id: 'meal', label: 'Meals' },
  { id: 'washroom', label: 'Washrooms' },
  { id: 'safe_injection', label: 'Safe consumption' },
];

function renderAmenityList(filterType = 'all', region = 'all') {
  const app = getAppEl();
  if (!regionData || !regionData.amenities) return;

  const amenities = regionData.amenities;
  let filtered = filterType === 'all' ? amenities : amenities.filter((a) => a.type === filterType);
  if (region !== 'all') {
    filtered = filtered.filter((a) => (a.region || 'downtown') === region);
  }
  const regions = regionData.meta?.regions || [];
  const cityName = CITIES[currentCity]?.name || 'City';
  app.innerHTML = `
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back-to-list">← Back</button>
      <header class="header">
        <h1>${cityName}</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${filtered.length} places</p>
      </header>
      ${regions.length > 0 ? `
      <div class="filter-row" style="margin-bottom:0.75rem;">
        <label style="font-size:0.75rem;color:var(--muted);display:block;margin-bottom:0.25rem;">Area</label>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          <button class="filter-btn" type="button" data-region="all" aria-pressed="${region === 'all'}">All areas</button>
          ${regions.map((r) => `
            <button class="filter-btn" type="button" data-region="${escapeHtml(r.id)}" aria-pressed="${region === r.id}">${escapeHtml(r.name)}</button>
          `).join('')}
        </div>
      </div>
      ` : ''}
      <div class="filter-row" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
        ${AMENITY_TYPES.map((t) => `
          <button class="filter-btn" type="button" data-filter="${t.id}" aria-pressed="${filterType === t.id}">${t.label}</button>
        `).join('')}
      </div>
      <ul class="amenity-list">
        ${filtered.map((a) => `
          <li class="amenity-item">
            <button class="amenity-link" type="button" data-id="${a.id}" style="width:100%;text-align:left;border:none;background:none;cursor:pointer;font:inherit;color:inherit;">
              <strong>${escapeHtml(a.name)}</strong>
              <small>${TYPE_LABELS[a.type] || a.type} · ${escapeHtml(a.address || a.intersection || '')}</small>
            </button>
          </li>
        `).join('')}
      </ul>
      <section class="detail-section" style="margin-top: 2rem;">
        <h3>Transit</h3>
        <p>${currentCity === 'vancouver' ? 'Text your bus stop number to <strong>33333</strong> for real-time arrivals. Find stop numbers on the pole.' : 'Text your stop number to <strong>898882</strong> (TXTTTC) for real-time bus/streetcar arrivals.'}</p>
      </section>
    </main>
  `;
  app.querySelector('[data-action="back-to-list"]').addEventListener('click', () => {
    regionData = null;
    currentFilterType = 'all';
    currentRegion = 'all';
    lastClickedAmenityId = null;
    renderHome();
  });
  app.querySelectorAll('.filter-btn[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilterType = btn.dataset.filter;
      renderAmenityList(currentFilterType, currentRegion);
    });
  });
  app.querySelectorAll('.filter-btn[data-region]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentRegion = btn.dataset.region;
      renderAmenityList(currentFilterType, currentRegion);
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

function renderAmenityDetail(amenity) {
  const app = getAppEl();
  app.innerHTML = `
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back-to-list">← Back to list</button>
      <div class="detail">
        <h2>${escapeHtml(amenity.name)}</h2>
        <p class="detail-meta">${TYPE_LABELS[amenity.type] || amenity.type} · ${escapeHtml(amenity.address || amenity.intersection || '')}</p>
        <div class="detail-section">
          <h3>Contact</h3>
          <p>${amenity.phone ? `<a href="tel:${amenity.phone}">${escapeHtml(amenity.phone)}</a>` : 'Call for info'}</p>
        </div>
        ${amenity.hours ? `
        <div class="detail-section">
          <h3>Hours</h3>
          <p>${escapeHtml(amenity.hours)}</p>
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
          <p style="margin-top:0.5rem;font-size:0.875rem;color:var(--muted);">${currentCity === 'vancouver' ? 'Text stop # to 33333 for arrivals. Route data by permission of TransLink.' : 'Text stop # to 898882 for arrivals.'}</p>
        </div>
        ` : ''}
      </div>
    </main>
  `;
  app.querySelector('[data-action="back-to-list"]').addEventListener('click', () => {
    renderAmenityList(currentFilterType, currentRegion);
  });
}

function escapeHtml(s) {
  if (!s) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
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
    el.innerHTML = '<p>Could not load benefits. Try again when you\'re online.</p>';
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
        <h1>Life skills</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Benefits, taxes, healthcare, jobs</p>
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

function handleRoute() {
  const hash = window.location.hash.slice(1) || '';
  if (hash === 'survival') { if (!currentCity) currentCity = 'vancouver'; renderSurvival(); }
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
          window.location.reload(); // New SW activated — reload to get fresh app
        });
        return reg.ready;
      })
      .then(() => prefetchForOffline())
      .catch(() => {});
  });
}

window.addEventListener('load', initInfoScreen);

window.addEventListener('hashchange', handleRoute);
handleRoute();
