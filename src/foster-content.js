/**
 * Life skills content — benefits, taxes, jobs, healthcare
 * Written at ~8th grade reading level. Bullet points. Bold for key info.
 */

export const FOSTER_SECTIONS = [
  { id: 'benefits', title: 'Benefits', desc: "What you're entitled to", route: 'foster/benefits' },
  { id: 'taxes', title: 'Taxes', desc: 'Filing your first return', route: 'foster/taxes' },
  { id: 'resumes', title: 'Resumes & jobs', desc: 'Getting your first job', route: 'foster/resumes' },
  { id: 'money', title: 'Money basics', desc: 'Banking and budgeting', route: 'foster/money' },
  { id: 'healthcare', title: 'Healthcare', desc: 'Getting a doctor, MSP/OHIP', route: 'foster/healthcare' },
  { id: 'mental-health', title: 'Mental health & addiction', desc: 'Free counselling and support', route: 'foster/mental-health' },
  { id: 'survival', title: 'Need shelter or meals?', desc: 'Places', route: '/survival' },
];

export const FOSTER_CONTENT = {
  benefits: {
    title: 'Benefits',
    body: `
      <p>Programs you may qualify for when you age out of care. Data loads from benefits.json.</p>
      <p><strong>BC211</strong> — Call <a href="tel:211">211</a> or visit bc211.ca for help finding services.</p>
      <div id="benefits-content"></div>
    `,
  },
  taxes: {
    title: 'Taxes',
    body: `
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
    `,
  },
  resumes: {
    title: 'Resumes & getting a job',
    body: `
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
    `,
  },
  money: {
    title: 'Money basics',
    body: `
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
    `,
  },
  healthcare: {
    title: 'Healthcare',
    body: `
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
    `,
  },
  'mental-health': {
    title: 'Mental health & addiction',
    body: `
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
    `,
  },
};
