(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const B=[{id:"benefits",title:"Benefits",desc:"What you're entitled to",route:"foster/benefits"},{id:"taxes",title:"Taxes",desc:"Filing your first return",route:"foster/taxes"},{id:"resumes",title:"Resumes & jobs",desc:"Getting your first job",route:"foster/resumes"},{id:"money",title:"Money basics",desc:"Banking and budgeting",route:"foster/money"},{id:"healthcare",title:"Healthcare",desc:"Getting a doctor, MSP/OHIP",route:"foster/healthcare"},{id:"mental-health",title:"Mental health & addiction",desc:"Free counselling and support",route:"foster/mental-health"},{id:"survival",title:"Need shelter or meals?",desc:"Places",route:"/survival"}],v={benefits:{title:"Benefits",body:`
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
    `}},T="nunki-seen-info";function H(){return window.matchMedia("(display-mode: standalone)").matches||window.matchMedia("(display-mode: fullscreen)").matches||window.matchMedia("(display-mode: minimal-ui)").matches||window.navigator.standalone===!0}function S(){const e=document.getElementById("info-overlay");e&&e.classList.add("info-overlay--visible")}function N(){const e=document.getElementById("info-overlay");e&&e.classList.remove("info-overlay--visible");try{localStorage.setItem(T,"1")}catch{}}function F(){const e=document.createElement("div");e.id="info-overlay",e.className="info-overlay",e.setAttribute("role","dialog"),e.setAttribute("aria-labelledby","info-title"),e.innerHTML=`
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
  `,e.querySelectorAll('[data-action="close-info"]').forEach(a=>{a.addEventListener("click",N)}),document.body.appendChild(e);const o=document.createElement("button");o.type="button",o.className="info-btn",o.setAttribute("aria-label","App info & how to save offline"),o.innerHTML="i",o.addEventListener("click",S),document.body.appendChild(o);const t=!H(),s=!!localStorage.getItem(T);t&&!s&&S()}const g={vancouver:{name:"Vancouver",dataFile:"vancouver.json"},toronto:{name:"Toronto",dataFile:"toronto.json"}},j=[{id:"survival",title:"Places",desc:"Shelters, meals, washrooms, transit",route:"/survival"},{id:"foster",title:"Life skills",desc:"Benefits, taxes, healthcare, jobs",route:"/foster"},{id:"donate",title:"Donate",desc:"Support shelters and kitchens",route:"/donate"}],L={shelter:"Shelter",meal:"Meal program",washroom:"Washroom",safe_injection:"Safe consumption",transit_hub:"Transit"};let l=null,c=null,p="all",f="all",h=null;function m(){return document.getElementById("app")}function k(){return"/"}async function E(e){const o=k(),t=e.startsWith("/")?e:`${o}data/${e}`,s=await fetch(t);if(!s.ok)throw new Error(`Failed to load ${e}`);return s.json()}function O(){const e=k().replace(/\/?$/,"/"),o=location.origin;document.querySelectorAll('script[src], link[rel="stylesheet"][href]').forEach(t=>{const s=(t.src||t.href||"").trim();s&&s.startsWith(o)&&fetch(s).catch(()=>{})}),["vancouver.json","toronto.json","benefits.json"].forEach(t=>fetch(`${e}data/${t}`).catch(()=>{}))}function d(){const e=l?g[l]:null,o=m();if(!e){o.innerHTML=`
      <main class="page city-select" role="main">
        <h1>Nunki</h1>
        <p style="margin: 1rem 0; color: var(--muted);">Choose your city</p>
        ${Object.entries(g).map(([t,s])=>`
          <button class="city-btn" type="button" data-city="${t}" aria-label="Select ${s.name}">${s.name}</button>
        `).join("")}
      </main>
    `,o.querySelectorAll(".city-btn").forEach(t=>{t.addEventListener("click",()=>M(t.dataset.city))});return}o.innerHTML=`
    <main class="page" role="main">
      <header class="header">
        <h1>Nunki</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${e.name}</p>
      </header>
      <nav class="section-grid" aria-label="Main sections">
        ${j.map(t=>`
          <button class="section-btn" type="button" data-route="${t.route}">${t.title}<small>${t.desc}</small></button>
        `).join("")}
      </nav>
      <p style="margin-top: 2rem;">
        <button class="back-btn" type="button" data-action="change-city">← Change city</button>
      </p>
    </main>
  `,o.querySelectorAll(".section-btn").forEach(t=>{t.addEventListener("click",()=>I(t.dataset.route))}),o.querySelector('[data-action="change-city"]').addEventListener("click",()=>{l=null,c=null,d()})}function M(e){l=e,d()}function I(e){e==="/survival"?w():e==="/foster"?y():e==="/donate"?C():d()}async function w(){const e=m(),o=g[l];if(o){e.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1>Places</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${o.name}</p>
      </header>
      <p style="color: var(--muted);">Loading…</p>
    </main>
  `,e.querySelector('[data-action="back"]').addEventListener("click",()=>{c=null,d()});try{c=await E(o.dataFile),p="all",f="all",h=null,b()}catch(t){e.querySelector("p").textContent=`Could not load data: ${t.message}. Try again when you're online.`}}}const _=[{id:"all",label:"All"},{id:"shelter",label:"Shelters"},{id:"meal",label:"Meals"},{id:"washroom",label:"Washrooms"},{id:"safe_injection",label:"Safe consumption"}];function b(e="all",o="all"){const t=m();if(!c||!c.amenities)return;const s=c.amenities;let a=e==="all"?s:s.filter(n=>n.type===e);o!=="all"&&(a=a.filter(n=>(n.region||"downtown")===o));const r=c.meta?.regions||[],u=g[l]?.name||"City";t.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back-to-list">← Back</button>
      <header class="header">
        <h1>${u}</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">${a.length} places</p>
      </header>
      ${r.length>0?`
      <div class="filter-row" style="margin-bottom:0.75rem;">
        <label style="font-size:0.75rem;color:var(--muted);display:block;margin-bottom:0.25rem;">Area</label>
        <div style="display:flex;flex-wrap:wrap;gap:0.5rem;">
          <button class="filter-btn" type="button" data-region="all" aria-pressed="${o==="all"}">All areas</button>
          ${r.map(n=>`
            <button class="filter-btn" type="button" data-region="${i(n.id)}" aria-pressed="${o===n.id}">${i(n.name)}</button>
          `).join("")}
        </div>
      </div>
      `:""}
      <div class="filter-row" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
        ${_.map(n=>`
          <button class="filter-btn" type="button" data-filter="${n.id}" aria-pressed="${e===n.id}">${n.label}</button>
        `).join("")}
      </div>
      <ul class="amenity-list">
        ${a.map(n=>`
          <li class="amenity-item">
            <button class="amenity-link" type="button" data-id="${n.id}" style="width:100%;text-align:left;border:none;background:none;cursor:pointer;font:inherit;color:inherit;">
              <strong>${i(n.name)}</strong>
              <small>${L[n.type]||n.type} · ${i(n.address||n.intersection||"")}</small>
            </button>
          </li>
        `).join("")}
      </ul>
      <section class="detail-section" style="margin-top: 2rem;">
        <h3>Transit</h3>
        <p>${l==="vancouver"?"Text your bus stop number to <strong>33333</strong> for real-time arrivals. Find stop numbers on the pole.":"Text your stop number to <strong>898882</strong> (TXTTTC) for real-time bus/streetcar arrivals."}</p>
      </section>
    </main>
  `,t.querySelector('[data-action="back-to-list"]').addEventListener("click",()=>{c=null,p="all",f="all",h=null,d()}),t.querySelectorAll(".filter-btn[data-filter]").forEach(n=>{n.addEventListener("click",()=>{p=n.dataset.filter,b(p,f)})}),t.querySelectorAll(".filter-btn[data-region]").forEach(n=>{n.addEventListener("click",()=>{f=n.dataset.region,b(p,f)})}),t.querySelectorAll(".amenity-link[data-id]").forEach(n=>{n.addEventListener("click",()=>{h=n.dataset.id;const $=s.find(x=>x.id===n.dataset.id);$&&W($)})}),h&&requestAnimationFrame(()=>{const n=document.querySelector(`[data-id="${h}"]`);n&&n.scrollIntoView({block:"nearest",behavior:"auto"}),h=null})}function W(e){const o=m(),t=(e.phone||"").replace(/[\s\-\(\)]/g,""),s=t.length>=10,a=e.hours||"",r=/^call\s+for\s+(hours|info)/i.test(a.trim()),u=a&&(s||!r);o.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back-to-list">← Back to list</button>
      <div class="detail">
        <h2>${i(e.name)}</h2>
        <p class="detail-meta">${L[e.type]||e.type} · ${i(e.address||e.intersection||"")}</p>
        ${s?`
        <div class="detail-section">
          <h3>Contact</h3>
          <p><a href="tel:${t}">${i((e.phone||"").trim())}</a></p>
        </div>
        `:""}
        ${u?`
        <div class="detail-section">
          <h3>Hours</h3>
          <p>${i(a)}</p>
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
          <p>${e.nearby_routes.map(n=>i(n)).join(", ")}</p>
          <p style="margin-top:0.5rem;font-size:0.875rem;color:var(--muted);">${l==="vancouver"?"Text stop # to 33333 for arrivals. Route data by permission of TransLink.":"Text stop # to 898882 for arrivals."}</p>
        </div>
        `:""}
      </div>
    </main>
  `,o.querySelector('[data-action="back-to-list"]').addEventListener("click",()=>{b(p,f)})}function i(e){if(!e)return"";const o=document.createElement("div");return o.textContent=e,o.innerHTML}async function P(){const e=document.getElementById("benefits-content");if(e)try{const o=await E("benefits.json");let t="";for(const[s,a]of Object.entries(o)){t+=`<h3>${i(a.province)}</h3>`;for(const r of a.programs||[])t+='<div class="benefit-card" style="margin-bottom:1rem;padding:1rem;border:1px solid var(--border);">',t+=`<strong>${i(r.name)}</strong> (${i(r.age)})<br>`,t+=`<p style="margin:0.5rem 0;">${i(r.what)}</p>`,r.phone&&(t+=`<p>Call <a href="tel:${r.phone.replace(/[\s\-]/g,"")}">${i(r.phone)}</a></p>`),r.link&&(t+=`<p><a href="${i(r.link)}" target="_blank" rel="noopener">Learn more</a></p>`),t+="</div>"}e.innerHTML=t}catch{e.innerHTML="<p>Could not load benefits. Try again when you're online.</p>"}}function y(e=null){const o=m();if(e&&v[e]){const t=v[e];o.innerHTML=`
      <main class="page" role="main">
        <button class="back-btn" type="button" data-action="foster-back">← Back</button>
        <header class="header">
          <h1>${i(t.title)}</h1>
        </header>
        <div class="detail foster-content">${t.body}</div>
      </main>
    `,o.querySelector('[data-action="foster-back"]').addEventListener("click",()=>y()),e==="benefits"&&P();return}o.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1>Life skills</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Benefits, taxes, healthcare, jobs</p>
      </header>
      <ul class="resource-list">
        ${B.map(t=>`
          <li class="resource-item">
            <button class="resource-link resource-btn" type="button" data-route="${t.route}">
              <span class="resource-label">${i(t.desc)}</span>
              <span class="resource-title">${i(t.title)}</span>
            </button>
          </li>
        `).join("")}
      </ul>
    </main>
  `,o.querySelector('[data-action="back"]').addEventListener("click",()=>d()),o.querySelectorAll(".resource-link[data-route]").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.route;s==="/survival"?w():s.startsWith("foster/")&&y(s.replace("foster/",""))})})}const q={vancouver:[{name:"Union Gospel Mission",url:"https://ugm.ca/ways-to-give",desc:"Shelters, meals, outreach"},{name:"Covenant House Vancouver",url:"https://www.covenanthousebc.org/take-action/ways-to-give/",desc:"Youth shelter, meals"},{name:"Greater Vancouver Food Bank",url:"https://foodbank.bc.ca/donate/",desc:"Food for meal programs"}],toronto:[{name:"Daily Bread Food Bank",url:"https://www.dailybread.ca/give-now/",desc:"Food for meal programs"},{name:"Covenant House Toronto",url:"https://covenanthousetoronto.ca/how-to-help/",desc:"Youth shelter"},{name:"Street Haven",url:"https://www.streethaven.org/how-you-can-help.html",desc:"Women's shelter"}]};function C(){const e=m(),o=l||"vancouver",t=q[o]||[],s=g[o]?.name||o,a=t.map(r=>`<li><a href="${i(r.url)}" target="_blank" rel="noopener">${i(r.name)}</a> — ${i(r.desc)}</li>`).join("");e.innerHTML=`
    <main class="page" role="main">
      <button class="back-btn" type="button" data-action="back">← Back</button>
      <header class="header">
        <h1>Donate</h1>
        <p style="margin: 0.25rem 0 0; color: var(--muted); font-size: 0.875rem;">Support shelters and kitchens in ${i(s)}</p>
      </header>
      <div class="detail foster-content">
        <ul>${a}</ul>
      </div>
    </main>
  `,e.querySelector('[data-action="back"]').addEventListener("click",()=>d())}function A(){const e=window.location.hash.slice(1)||"";if(e==="survival")l||(l="vancouver"),w();else if(e==="donate")C();else if(e.startsWith("foster")){const o=e.replace("foster","").replace(/^\//,"");o&&v[o]?y(o):y()}else d()}"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register(`${k()}sw.js`).then(e=>(navigator.onLine&&e.update(),navigator.serviceWorker.addEventListener("controllerchange",()=>{window.location.reload()}),e.ready)).then(()=>O()).catch(()=>{})});window.addEventListener("load",F);window.addEventListener("hashchange",A);A();
