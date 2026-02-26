(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const f of a.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&r(f)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();const U=[{id:"benefits",title:"Benefits",desc:"What you're entitled to",route:"foster/benefits"},{id:"taxes",title:"Taxes",desc:"Filing your first return",route:"foster/taxes"},{id:"resumes",title:"Resumes & jobs",desc:"Getting your first job",route:"foster/resumes"},{id:"money",title:"Money basics",desc:"Banking and budgeting",route:"foster/money"},{id:"healthcare",title:"Healthcare",desc:"Getting a doctor, MSP/OHIP",route:"foster/healthcare"},{id:"mental-health",title:"Mental health & addiction",desc:"Free counselling and support",route:"foster/mental-health"},{id:"survival",title:"Need shelter or meals?",desc:"Places",route:"/survival"}],x={benefits:{title:"Benefits",body:`
      <p>Programs you may qualify for when you age out of care. Data loads from benefits.json.</p>
      <p><strong>BC211</strong> — Call <a href="tel:211">211</a> or visit bc211.ca for help finding services.</p>
      <div id="benefits-content"></div>
    `},taxes:{title:"Taxes",body:`
      <p>You need to file a tax return every year, even if you didn't work. Here's the basics.</p>
      <h3>Why file?</h3>
      <ul>
        <li>You might get money back (GST credit, climate action payment, provincial credits).</li>
        <li>Schools, housing programs, and benefits often need proof you filed.</li>
      </ul>
      <h3>When?</h3>
      <p><strong>April 30</strong> is the deadline for most people. Students can file by June 15.</p>
      <h3>Free help</h3>
      <ul>
        <li><strong>Free tax clinics:</strong> If your income is modest (under ~$35,000 for one person), you qualify. Search "free tax clinic" + your city or use the CRA's <a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/community-volunteer-income-tax-program.html" target="_blank" rel="noopener">CVITP clinic finder</a>.</li>
        <li><strong>Free software:</strong> CRA has a list of free certified software at canada.ca/free-taxes.</li>
      </ul>
      <h3>What you need</h3>
      <p>SIN, T4 slips from work (employers send by end of Feb), T5 if you have interest, any other slips. No slips? You still file — report $0 or what you remember.</p>
      <h3>By situation</h3>
      <p><strong>Had a job:</strong> You'll get a T4. File to get tax back if too much was withheld. Use the amount in box 14 of your T4.</p>
      <p><strong>Student:</strong> Claim tuition (T2202), get credits. File by June 15. OSAP/student aid may need your return.</p>
      <p><strong>No income:</strong> You still file. You might get GST credit, climate payment, provincial credits. Call CRA <strong>1-800-959-8281</strong> if stuck.</p>
      <p><strong>Self-employed or gig work:</strong> Report all income. You may owe. Consider a free clinic or accountant.</p>
      <h3>Links</h3>
      <ul>
        <li><a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/community-volunteer-income-tax-program.html" target="_blank" rel="noopener">CRA free tax clinics</a></li>
        <li><a href="https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html" target="_blank" rel="noopener">CRA My Account</a> — sign up to see slips, get refunds</li>
      </ul>
    `},resumes:{title:"Resumes & getting a job",body:`
      <p>Your first resume doesn't need to be fancy. Keep it simple.</p>
      <h3>What to include</h3>
      <ul>
        <li><strong>Contact info</strong> — Phone, email.</li>
        <li><strong>Summary</strong> — One line: "Looking for [type] work. Reliable, eager to learn."</li>
        <li><strong>Experience</strong> — Jobs, volunteer work, school projects. Use action words: "Helped," "Organized," "Managed."</li>
        <li><strong>Education</strong> — School name, years attended.</li>
      </ul>
      <h3>No work experience?</h3>
      <p>List volunteer work, babysitting, odd jobs, or anything that shows you show up. That counts.</p>
      <h3>Types of jobs that often hire youth</h3>
      <ul>
        <li><strong>Retail</strong> — Stores, malls, grocery. Often flexible hours.</li>
        <li><strong>Food service</strong> — Restaurants, cafes, fast food. Tips can help.</li>
        <li><strong>Warehouse & logistics</strong> — Amazon, grocery warehouses. Often hiring.</li>
        <li><strong>Landscaping & labour</strong> — Seasonal, outdoor work.</li>
        <li><strong>Childcare</strong> — Babysitting, daycares. First aid helps.</li>
        <li><strong>Gig work</strong> — Delivery (DoorDash, Uber Eats). You need a phone and transport.</li>
      </ul>
      <h3>Where to look</h3>
      <ul>
        <li>Indeed, LinkedIn, company websites.</li>
        <li>Walk in and ask — restaurants, retail, small shops still hire that way.</li>
        <li>Youth employment programs — search "[city] youth employment" for free help, resume workshops, job matching.</li>
      </ul>
    `},money:{title:"Money basics",body:`
      <p>Banking and budgeting when you're starting out.</p>
      <h3>Get a bank account</h3>
      <ul>
        <li>You need ID (driver's licence, BC Services Card, or passport).</li>
        <li>Banks like TD, Scotiabank, and credit unions offer <strong>no-fee accounts</strong> for students and youth. Ask.</li>
      </ul>
      <h3>Budget (simple version)</h3>
      <ul>
        <li>Write down what comes in (pay, benefits) and what goes out (rent, food, phone).</li>
        <li>Rent first. Then food. Then the rest.</li>
      </ul>
      <h3>Example (someone making $2,000/month)</h3>
      <p><strong>In:</strong> $2,000 (job) + $200 (GST/benefits) = $2,200</p>
      <p><strong>Out:</strong> Rent $1,000, Food $300, Phone $50, Transit $100, Toiletries $50 = $1,500</p>
      <p><strong>Left:</strong> $700 for savings, emergencies, or extras. Try to save even $50–100/month.</p>
      <h3>Avoid</h3>
      <ul>
        <li>Payday loans — very high interest. Avoid if you can.</li>
        <li>Buy now, pay later — easy to overspend.</li>
      </ul>
    `},healthcare:{title:"Healthcare",body:`
      <h3>What you need to do</h3>
      <p>Register for your province's health plan. Without it, doctor visits and hospital care can cost a lot.</p>
      <h3>British Columbia (MSP)</h3>
      <p><strong>Apply:</strong> gov.bc.ca/msp or call <strong>1-800-663-7100</strong>. If you aged out of care, you may already have it — call to check.</p>
      <p><strong>What it covers:</strong> Doctor visits, hospital care, some medical services. Not dental or drugs (unless you have extra coverage).</p>
      <p><strong>Where to go:</strong> Call <strong>811</strong> (HealthLink BC) to find a walk-in clinic or doctor near you. Walk-ins don't need an appointment.</p>
      <h3>Ontario (OHIP)</h3>
      <p><strong>Apply:</strong> ontario.ca/health or ServiceOntario. If you aged out of care, ask your worker.</p>
      <p><strong>What it covers:</strong> Doctor visits, hospital care, some medical services. Not dental or drugs (unless you have extra coverage).</p>
      <p><strong>Where to go:</strong> Call <strong>811</strong> (Health811) to find a clinic. Community health centres often take people without a family doctor.</p>
      <h3>Aftercare Benefits (Ontario, ages 21–25)</h3>
      <p>Free health and dental for 4 years. Your worker must enroll you. Call <strong>1-800-263-2841</strong>.</p>
    `},"mental-health":{title:"Mental health & addiction",body:`
      <p>Free, confidential help is available. You don't need a referral.</p>
      <h3>Crisis lines (24/7)</h3>
      <ul>
        <li><strong>988</strong> or <strong>1-800-784-2433</strong> — Suicide Crisis Helpline</li>
        <li><strong>310-6789</strong> (no area code) — BC mental health support</li>
        <li><strong>1-800-668-6868</strong> — Kids Help Phone (ages 5–29, Canada-wide)</li>
      </ul>
      <h3>British Columbia</h3>
      <p><strong>Foundry</strong> — Free counselling, substance use support, peer support for ages 12–24. No referral needed. In-person at 35 centres or virtual via the Foundry BC app. Phone <strong>1-833-308-6379</strong>. <a href="https://foundrybc.ca" target="_blank" rel="noopener">foundrybc.ca</a></p>
      <p><strong>811</strong> — HealthLink BC can connect you to free or low-cost counselling in your area.</p>
      <h3>Ontario</h3>
      <p><strong>Kids Help Phone</strong> — 24/7 phone and chat. <strong>1-800-668-6868</strong>. <a href="https://kidshelpphone.ca" target="_blank" rel="noopener">kidshelpphone.ca</a></p>
      <p><strong>211 Ontario</strong> — Call 211 or visit 211ontario.ca to find counselling and addiction services near you.</p>
      <h3>Addiction support</h3>
      <p>Foundry (BC) and 211 (both provinces) can connect you to substance use programs. Many are free. You can ask for help without judgment.</p>
    `}},M="nunki-seen-info";function z(){return window.matchMedia("(display-mode: standalone)").matches||window.matchMedia("(display-mode: fullscreen)").matches||window.matchMedia("(display-mode: minimal-ui)").matches||window.navigator.standalone===!0}function j(){const e=document.getElementById("info-overlay");e&&e.classList.add("info-overlay--visible")}function V(){const e=document.getElementById("info-overlay");e&&e.classList.remove("info-overlay--visible");try{localStorage.setItem(M,"1")}catch{}}function J(){const e=document.createElement("div");e.id="info-overlay",e.className="info-overlay",e.setAttribute("role","dialog"),e.setAttribute("aria-labelledby","info-title"),e.innerHTML=`
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
  `,e.querySelectorAll('[data-action="close-info"]').forEach(s=>{s.addEventListener("click",V)}),document.body.appendChild(e);const t=document.createElement("button");t.type="button",t.className="info-btn",t.setAttribute("aria-label","App info & how to save offline"),t.innerHTML="i",t.addEventListener("click",j),document.body.appendChild(t);const o=!z(),r=!!localStorage.getItem(M);o&&!r&&j()}function K(){const e=document.createElement("div");e.id="status-bar",e.className="status-bar",e.setAttribute("aria-live","polite");function t(){const o=navigator.onLine;let r=o?"Online":"Offline";try{if(sessionStorage.getItem("nunki-updated")){sessionStorage.removeItem("nunki-updated"),r="Updated",e.dataset.status="updated",e.textContent=r,setTimeout(t,3e3);return}}catch{}e.textContent=r,e.dataset.status=o?"online":"offline"}t(),window.addEventListener("online",t),window.addEventListener("offline",t),document.body.appendChild(e)}function X(){try{sessionStorage.setItem("nunki-updated","1")}catch{}}const S={vancouver:{name:"Vancouver",dataFile:"vancouver.json"},toronto:{name:"Toronto",dataFile:"toronto.json"}},Q=[{id:"survival",title:"Places",desc:"Shelters, meals, washrooms, transit",route:"/survival"},{id:"foster",title:"Life skills",desc:"Benefits, taxes, healthcare, jobs",route:"/foster"},{id:"donate",title:"Donate",desc:"Support shelters and kitchens",route:"/donate"}],_={shelter:"Shelter",meal:"Meal program",washroom:"Washroom",safe_injection:"Safe consumption",transit_hub:"Transit"};let c=null,v=null,g="all",y="all",u="",h=!1,p=!1,m=null;const W="nunki-favorites";function P(){try{return JSON.parse(localStorage.getItem(W)||"[]")}catch{return[]}}function I(e){return P().some(t=>t.amenityId===e&&t.cityId===c)}function Z(e){const t=P(),o=t.findIndex(r=>r.amenityId===e&&r.cityId===c);o>=0?t.splice(o,1):t.push({cityId:c,amenityId:e});try{localStorage.setItem(W,JSON.stringify(t))}catch{}}function $(){return document.getElementById("app")}function F(){return"/"}async function R(e){const t=F(),o=e.startsWith("/")?e:`${t}data/${e}`,r=await fetch(o);if(!r.ok)throw new Error(`Failed to load ${e}`);return r.json()}function ee(){const e=F().replace(/\/?$/,"/"),t=location.origin;document.querySelectorAll('script[src], link[rel="stylesheet"][href]').forEach(o=>{const r=(o.src||o.href||"").trim();r&&r.startsWith(t)&&fetch(r).catch(()=>{})}),["vancouver.json","toronto.json","benefits.json"].forEach(o=>fetch(`${e}data/${o}`).catch(()=>{}))}function k(){const e=c?S[c]:null,t=$();if(!e){t.innerHTML=`
      <main class="page city-select" role="main">
        <h1>Nunki</h1>
        <p style="margin: 1rem 0; color: var(--muted);">Choose your city</p>
        ${Object.entries(S).map(([o,r])=>`
          <button class="city-btn" type="button" data-city="${o}" aria-label="Select ${r.name}">${r.name}</button>
        `).join("")}
      </main>
    `,t.querySelectorAll(".city-btn").forEach(o=>{o.addEventListener("click",()=>te(o.dataset.city))});return}t.innerHTML=`
    <main class="page" role="main">
      <header class="header">
        <h1>Nunki</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${e.name}</p>
      </header>
      <nav class="section-grid" aria-label="Main sections">
        ${Q.map(o=>`
          <button class="section-btn" type="button" data-route="${o.route}">${o.title}<small>${o.desc}</small></button>
        `).join("")}
      </nav>
      <p style="margin-top: 2rem;">
        <button class="back-btn" type="button" data-action="change-city">← Change city</button>
      </p>
    </main>
  `,t.querySelectorAll(".section-btn").forEach(o=>{o.addEventListener("click",()=>oe(o.dataset.route))}),t.querySelector('[data-action="change-city"]').addEventListener("click",()=>{c=null,v=null,k()})}function te(e){c=e,k()}function oe(e){e==="/survival"?H():e==="/foster"?L():e==="/donate"?Y():k()}async function H(){const e=$(),t=S[c];if(t){e.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1>Places</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${t.name}</p>
      </header>
      <p style="color: var(--muted);">Loading…</p>
    </main>
  `,e.querySelector('[data-action="back"]').addEventListener("click",()=>{v=null,k()});try{v=await R(t.dataFile),g="all",y="all",u="",h=!1,p=!1,m=null,b()}catch(o){e.querySelector("p").textContent=`Could not load data: ${o.message}. Try again when you're online.`}}}const ne=[{id:"all",label:"All"},{id:"shelter",label:"Shelters"},{id:"meal",label:"Meals"},{id:"washroom",label:"Washrooms"},{id:"safe_injection",label:"Safe consumption"}];function b(e="all",t="all",o="",r=!1,s=!1){const a=$();if(!v||!v.amenities)return;const f=v.amenities;let l=e==="all"?f:f.filter(n=>n.type===e);if(t!=="all"&&(l=l.filter(n=>(n.region||"downtown")===t)),r&&(l=l.filter(n=>(n.notes||"").toLowerCase().includes("wheelchair accessible"))),s&&(l=l.filter(n=>I(n.id))),o.trim()){const n=o.trim().toLowerCase();l=l.filter(d=>(d.name||"").toLowerCase().includes(n)||(d.address||"").toLowerCase().includes(n)||(d.intersection||"").toLowerCase().includes(n)||(d.notes||"").toLowerCase().includes(n)||(d.category||"").toLowerCase().includes(n))}const E=v.meta?.regions||[],A=S[c]?.name||"City",T=v.meta?.updated||"",q=l.map(n=>`
    <li class="amenity-item">
      <button class="amenity-link" type="button" data-id="${n.id}" style="width:100%;text-align:left;border:none;background:none;cursor:pointer;font:inherit;color:inherit;">
        <span style="float:right;color:var(--muted);">${I(n.id)?"★":""}</span>
        <strong>${i(n.name)}</strong>
        <small>${_[n.type]||n.type} · ${i(n.address||n.intersection||"")}</small>
      </button>
    </li>
  `).join(""),N=document.getElementById("amenity-list-container");if(N){N.innerHTML=q;const n=document.querySelector(".amenity-list-header-sub");n&&(n.textContent=`${l.length} places${T?` · Updated ${T}`:""}`);const d=a.querySelector("[data-wheelchair]");d&&d.setAttribute("aria-pressed",r);const C=a.querySelector("[data-favorites]");C&&C.setAttribute("aria-pressed",s),a.querySelectorAll(".amenity-link[data-id]").forEach(w=>{w.addEventListener("click",()=>{m=w.dataset.id;const O=f.find(G=>G.id===w.dataset.id);O&&B(O)})}),m&&requestAnimationFrame(()=>{const w=document.querySelector(`[data-id="${m}"]`);w&&w.scrollIntoView({block:"nearest",behavior:"auto"}),m=null});return}a.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back-to-list">← Back</button>
      <header class="header">
        <h1>${A}</h1>
        <p class="amenity-list-header-sub" style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${l.length} places${T?` · Updated ${T}`:""}</p>
      </header>
      <div style="margin-bottom:1rem;">
        <label for="places-search" style="font-size:0.75rem;color:var(--muted);display:block;margin-bottom:0.25rem;">Search by name, address, or notes</label>
        <input id="places-search" type="search" class="search-input" placeholder="e.g. Union Gospel, Hastings…" value="${i(o)}" data-action="search" aria-label="Search by name, address, or notes" />
      </div>
      ${E.length>0?`
      <div class="filter-row" style="margin-bottom:0.75rem;">
        <label style="font-size:0.75rem;color:var(--muted);display:block;margin-bottom:0.25rem;">Area</label>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          <button class="filter-btn" type="button" data-region="all" aria-pressed="${t==="all"}">All areas</button>
          ${E.map(n=>`
            <button class="filter-btn" type="button" data-region="${i(n.id)}" aria-pressed="${t===n.id}">${i(n.name)}</button>
          `).join("")}
        </div>
      </div>
      `:""}
      <div class="filter-row" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
        ${ne.map(n=>`
          <button class="filter-btn" type="button" data-filter="${n.id}" aria-pressed="${e===n.id}">${n.label}</button>
        `).join("")}
        <button class="filter-btn" type="button" data-wheelchair aria-pressed="${r}">Wheelchair accessible</button>
        <button class="filter-btn" type="button" data-favorites aria-pressed="${s}">Favorites</button>
      </div>
      <ul class="amenity-list" id="amenity-list-container">
        ${q}
      </ul>
      <section class="detail-section" style="margin-top: 2rem;">
        <h3>Transit</h3>
        <p>${c==="vancouver"?"Text your bus stop number to <strong>33333</strong> for real-time arrivals. Find stop numbers on the pole.":"Text your stop number to <strong>898882</strong> (TXTTTC) for real-time bus/streetcar arrivals."}</p>
      </section>
    </main>
  `,a.querySelector('[data-action="back-to-list"]').addEventListener("click",()=>{v=null,g="all",y="all",u="",h=!1,p=!1,m=null,k()}),a.querySelector('[data-action="search"]')?.addEventListener("input",n=>{u=n.target.value,b(g,y,u,h,p)}),a.querySelector('[data-action="search"]')?.addEventListener("search",n=>{u=n.target.value||"",b(g,y,u,h,p)}),a.querySelector("[data-wheelchair]")?.addEventListener("click",()=>{h=!h,b(g,y,u,h,p)}),a.querySelector("[data-favorites]")?.addEventListener("click",()=>{p=!p,b(g,y,u,h,p)}),a.querySelectorAll(".filter-btn[data-filter]").forEach(n=>{n.addEventListener("click",()=>{g=n.dataset.filter,b(g,y,u,h,p)})}),a.querySelectorAll(".filter-btn[data-region]").forEach(n=>{n.addEventListener("click",()=>{y=n.dataset.region,b(g,y,u,h,p)})}),a.querySelectorAll(".amenity-link[data-id]").forEach(n=>{n.addEventListener("click",()=>{m=n.dataset.id;const d=f.find(C=>C.id===n.dataset.id);d&&B(d)})}),m&&requestAnimationFrame(()=>{const n=document.querySelector(`[data-id="${m}"]`);n&&n.scrollIntoView({block:"nearest",behavior:"auto"}),m=null})}function ae(e){const t=[e.name,e.address||e.intersection,e.phone].filter(Boolean).join(" · ");navigator.share?navigator.share({title:e.name,text:t}).catch(()=>{}):navigator.clipboard?.writeText(t).then(()=>{})}function B(e){const t=$(),o=(e.phone||"").replace(/[\s\-\(\)]/g,""),r=o.length>=10,s=e.hours||"",a=/^call\s+for\s+(hours|info)/i.test(s.trim()),f=s&&(r||!a),l=I(e.id),E=re(e);t.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back-to-list">← Back to list</button>
      <div class="detail">
        <div style="display:flex;align-items:flex-start;gap:0.5rem;margin-bottom:0.5rem;">
          <h2 style="flex:1;margin:0;">${i(e.name)}</h2>
          <div style="display:flex;gap:0.25rem;">
            <button type="button" class="icon-btn" data-action="favorite" aria-label="${l?"Remove from favorites":"Add to favorites"}">${l?"★":"☆"}</button>
            <button type="button" class="icon-btn" data-action="share" aria-label="Share">⎘</button>
          </div>
        </div>
        <p class="detail-meta">${_[e.type]||e.type} · ${i(e.address||e.intersection||"")}</p>
        <div class="detail-section">
          <a href="${E}" target="_blank" rel="noopener" class="directions-link">Get directions</a>
        </div>
        ${r?`
        <div class="detail-section">
          <h3>Contact</h3>
          <p><a href="tel:${o}">${i((e.phone||"").trim())}</a></p>
        </div>
        `:""}
        ${f?`
        <div class="detail-section">
          <h3>Hours</h3>
          <p>${i(s)}</p>
        </div>
        `:""}
        ${e.notes?`
        <div class="detail-section">
          <h3>Notes</h3>
          <p>${i(e.notes)}</p>
        </div>
        `:""}
        ${e.category?`
        <div class="detail-section">
          <h3>Serves</h3>
          <p>${i(e.category)}</p>
        </div>
        `:""}
        ${e.nearby_routes?.length?`
        <div class="detail-section">
          <h3>Nearby transit</h3>
          <p>${e.nearby_routes.map(A=>i(A)).join(", ")}</p>
          <p style="margin-top:0.5rem;font-size:0.875rem;color:var(--muted);">${c==="vancouver"?"Text stop # to 33333 for arrivals. Route data by permission of TransLink.":"Text stop # to 898882 for arrivals."}</p>
        </div>
        `:""}
      </div>
    </main>
  `,t.querySelector('[data-action="back-to-list"]').addEventListener("click",()=>{b(g,y,u,h,p)}),t.querySelector('[data-action="favorite"]')?.addEventListener("click",()=>{Z(e.id),B(e)}),t.querySelector('[data-action="share"]').addEventListener("click",()=>ae(e))}function i(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}function re(e){const t=e.address||e.intersection||e.name||"";return`https://www.google.com/maps/search/?api=1&query=${e.lat!=null&&e.lng!=null?`${e.lat},${e.lng}`:encodeURIComponent(t)}`}async function se(){const e=document.getElementById("benefits-content");if(e)try{const t=await R("benefits.json");let o="";for(const[r,s]of Object.entries(t)){o+=`<h3>${i(s.province)}</h3>`;for(const a of s.programs||[])o+='<div class="benefit-card" style="margin-bottom:1rem;padding:1rem;border:1px solid var(--border);">',o+=`<strong>${i(a.name)}</strong> (${i(a.age)})<br>`,o+=`<p style="margin:0.5rem 0;">${i(a.what)}</p>`,a.phone&&(o+=`<p>Call <a href="tel:${a.phone.replace(/[\s\-]/g,"")}">${i(a.phone)}</a></p>`),a.link&&(o+=`<p><a href="${i(a.link)}" target="_blank" rel="noopener">Learn more</a></p>`),o+="</div>"}e.innerHTML=o}catch{e.innerHTML="<p>Could not load benefits. Try again when you're online.</p>"}}function L(e=null){const t=$();if(e&&x[e]){const o=x[e];t.innerHTML=`
      <main class="page" role="main">
        <button class="back-btn" type="button" data-action="foster-back">← Back</button>
        <header class="header">
          <h1>${i(o.title)}</h1>
        </header>
        <div class="detail foster-content">${o.body}</div>
      </main>
    `,t.querySelector('[data-action="foster-back"]').addEventListener("click",()=>L()),e==="benefits"&&se();return}t.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1>Life skills</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Benefits, taxes, healthcare, jobs</p>
      </header>
      <ul class="resource-list">
        ${U.map(o=>`
          <li class="resource-item">
            <button class="resource-link resource-btn" type="button" data-route="${o.route}">
              <span class="resource-label">${i(o.desc)}</span>
              <span class="resource-title">${i(o.title)}</span>
            </button>
          </li>
        `).join("")}
      </ul>
    </main>
  `,t.querySelector('[data-action="back"]').addEventListener("click",()=>k()),t.querySelectorAll(".resource-link[data-route]").forEach(o=>{o.addEventListener("click",()=>{const r=o.dataset.route;r==="/survival"?H():r.startsWith("foster/")&&L(r.replace("foster/",""))})})}const ie={vancouver:[{name:"Union Gospel Mission",url:"https://ugm.ca/ways-to-give",desc:"Shelters, meals, outreach"},{name:"Covenant House Vancouver",url:"https://www.covenanthousebc.org/take-action/ways-to-give/",desc:"Youth shelter, meals"},{name:"Greater Vancouver Food Bank",url:"https://foodbank.bc.ca/donate/",desc:"Food for meal programs"}],toronto:[{name:"Daily Bread Food Bank",url:"https://www.dailybread.ca/give-now/",desc:"Food for meal programs"},{name:"Covenant House Toronto",url:"https://covenanthousetoronto.ca/how-to-help/",desc:"Youth shelter"},{name:"Street Haven",url:"https://streethaven.org/donation/",desc:"Women's shelter"}]};function Y(){const e=$(),t=c||"vancouver",o=ie[t]||[],r=S[t]?.name||t,s=o.map(a=>`<li><a href="${i(a.url)}" target="_blank" rel="noopener">${i(a.name)}</a> — ${i(a.desc)}</li>`).join("");e.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1>Donate</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Support shelters and kitchens in ${i(r)}</p>
      </header>
      <div class="detail foster-content">
        <ul>${s}</ul>
      </div>
    </main>
  `,e.querySelector('[data-action="back"]').addEventListener("click",()=>k())}function D(){const e=window.location.hash.slice(1)||"";if(e==="survival")c||(c="vancouver"),H();else if(e==="donate")Y();else if(e.startsWith("foster")){const t=e.replace("foster","").replace(/^\//,"");t&&x[t]?L(t):L()}else k()}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register(`${F()}sw.js`).then(e=>(navigator.onLine&&e.update(),navigator.serviceWorker.addEventListener("controllerchange",()=>{X(),window.location.reload()}),e.ready)).then(()=>ee()).catch(()=>{})});window.addEventListener("load",()=>{J(),K()});window.addEventListener("hashchange",D);D();
