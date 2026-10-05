const doors = {
  start: {
    eyebrow: 'You were told to Think Flow First',
    title: 'Here’s what that means.',
    intro: 'Before deciding what treatment, therapy or longevity intervention comes next, we ask an earlier question: how well is the body delivering what it needs, where it needs it?',
    note: 'General introduction',
    why: 'Flow First is a way of thinking about circulation, delivery and the internal environment before simply adding more interventions.',
    cta: 'Tell us what brought you here'
  },
  stroke: {
    eyebrow: 'Stroke & recovery',
    title: 'After a stroke, flow deserves a place in the conversation.',
    intro: 'Stroke care and rehabilitation are complex. Think Flow First is an educational framework for asking how circulation, delivery and the recovery environment may fit alongside established care.',
    note: 'Stroke entry door',
    why: 'We do not replace emergency care, neurologists or rehabilitation. We help families ask better questions about the environment in which recovery is taking place.',
    cta: 'Tell us about the stroke situation'
  },
  heart: {
    eyebrow: 'Heart health',
    title: 'The heart moves blood. The rest of the body depends on where it can go.',
    intro: 'Heart health is not only about the pump. It is also about circulation throughout the body. Think Flow First helps people explore that bigger picture alongside proper medical care.',
    note: 'Heart entry door',
    why: 'The goal is not to offer a diagnosis online. It is to help you understand why circulation and delivery are foundational questions worth discussing with your care team.',
    cta: 'Tell us what you are concerned about'
  },
  parkinsons: {
    eyebrow: "Parkinson's & supportive care",
    title: 'When the condition is complex, start with foundational questions.',
    intro: "Parkinson's care may involve medication, movement, rehabilitation and long-term support. Think Flow First adds an educational lens around circulation, delivery and the body's internal environment.",
    note: "Parkinson's entry door",
    why: 'This is not a claim to treat Parkinson’s. It is a way to explore supportive questions that may sit alongside established neurological care.',
    cta: 'Tell us about the current situation'
  },
  prevention: {
    eyebrow: 'Prevention',
    title: 'Don’t wait for a major event to start thinking about flow.',
    intro: 'Prevention is about improving the odds before something goes wrong. Think Flow First puts vascular health, circulation and delivery into that conversation.',
    note: 'Prevention entry door',
    why: 'The purpose is to help you think earlier — before a crisis, before another procedure, and before simply adding more interventions.',
    cta: 'Tell us what prompted your interest'
  },
  stemcells: {
    eyebrow: 'Stem cells & regenerative therapies',
    title: 'If you are into stem cells, you should Think Flow First.',
    intro: 'Regenerative therapies focus on what is being introduced into the body. Flow First asks about the environment those therapies are entering.',
    note: 'Stem cell entry door',
    why: 'We position Flow First as a companion idea: creating a better environment for the rest of your program rather than attacking or replacing existing therapies.',
    cta: 'Tell us where you are in your stem-cell journey'
  },
  longevity: {
    eyebrow: 'Longevity & biohacking',
    title: 'Before you add another therapy, ask about the environment it has to work in.',
    intro: 'NAD+, peptides, PRP, exosomes and other longevity interventions all ask the body to respond. Think Flow First asks whether circulation and delivery deserve attention too.',
    note: 'Longevity entry door',
    why: 'Think Flow First is a companion framework — not an argument against the therapies you already value.',
    cta: 'Tell us what you are currently exploring'
  },
  'before-you-travel': {
    eyebrow: 'Before overseas treatment',
    title: 'Before you book the flight, Think Flow First.',
    intro: 'Overseas treatment can involve major cost, hope and uncertainty. Before making the trip, it may be worth asking whether the fundamentals of circulation and delivery have been considered.',
    note: 'Overseas treatment entry door',
    why: 'The purpose is not to tell you where to travel. It is to help you ask better questions before making a large medical or wellness decision.',
    cta: 'Tell us what treatment you are considering'
  },
  recovery: {
    eyebrow: 'Recovery',
    title: 'Recovery is more than one therapy.',
    intro: 'Rehabilitation, movement, nutrition, sleep, medical care and circulation can all be part of the environment around recovery. Think Flow First helps organize that conversation.',
    note: 'Recovery entry door',
    why: 'This is a supportive educational framework, not a replacement for rehabilitation or medical care.',
    cta: 'Tell us what you are recovering from'
  }
};

const routes = new Set(Object.keys(doors));
let pathKey = location.pathname.replace(/^\/+|\/+$/g, '') || 'start';
if (pathKey === 'what-is-flow-first') pathKey = 'start';
if (pathKey === 'why-flow-matters') pathKey = 'start';
if (!routes.has(pathKey)) pathKey = 'start';
const door = doors[pathKey];

const params = new URLSearchParams(location.search);
const attribution = {
  originalSource: params.get('src') || params.get('utm_source') || '',
  campaign: params.get('campaign') || params.get('utm_campaign') || '',
  hook: params.get('hook') || params.get('content') || params.get('utm_content') || '',
  deliveryChannel: params.get('via') || '',
  entryDoor: pathKey,
  landingUrl: location.href
};
localStorage.setItem('tff_attribution', JSON.stringify(attribution));

const entryDoors = [
  ['stroke','Stroke','For families, survivors and people exploring recovery.'],
  ['heart','Heart Disease','For people thinking about circulation and cardiovascular health.'],
  ['parkinsons',"Parkinson's",'For supportive-care and neurological-health questions.'],
  ['prevention','Prevention','For people who want to act before a major health event.'],
  ['stemcells','Stem Cells','For people considering or already using regenerative therapies.'],
  ['longevity','Longevity & Biohacking','For NAD+, peptides, PRP, exosomes and more.'],
  ['before-you-travel','Before Overseas Treatment','For people considering treatment abroad.'],
  ['recovery','Recovery','For rehabilitation and broader recovery situations.']
];

function sectionHTML() {
  return `
  <section class="hero">
    <div>
      <span class="door-note">${door.note}</span>
      <div class="eyebrow">${door.eyebrow}</div>
      <h1>${door.title}</h1>
      <p>${door.intro}</p>
      <div class="hero-actions">
        <a class="btn" href="#intake">${door.cta}</a>
        <a class="btn secondary" href="#flow-first">First, explain Flow First</a>
      </div>
    </div>
    <div class="hero-card">
      <span class="eyebrow">One simple idea</span>
      <strong>Before adding more, ask about flow.</strong>
      <div class="pulse"></div>
      <p>Circulation is one of the systems that helps move oxygen, nutrients, signals and other substances throughout the body. Flow First starts there.</p>
    </div>
  </section>

  <section class="section alt" id="flow-first">
    <div class="eyebrow">What is Flow First?</div>
    <h2>A framework for asking the earlier question.</h2>
    <p class="section-lead">${door.why}</p>
    <div class="steps">
      <div class="step"><span>01</span><h3>Understand the situation</h3><p>Start with the person, the condition, the timeline and what is already being done.</p></div>
      <div class="step"><span>02</span><h3>Think about flow</h3><p>Consider circulation, delivery and the internal environment as part of the wider picture.</p></div>
      <div class="step"><span>03</span><h3>Decide what comes next</h3><p>Learn, ask better questions, and choose an appropriate next step without pressure.</p></div>
    </div>
  </section>

  <section class="section" id="explore">
    <div class="eyebrow">Explore by what brought you here</div>
    <h2>Different reasons. One Flow First framework.</h2>
    <p class="section-lead">You do not need to read the whole website. Start with the subject that matters to you.</p>
    <div class="grid">
      ${entryDoors.map(([slug,name,desc]) => `<a class="card" href="/${slug}${location.search}"><div class="eyebrow">Entry door</div><h3>${name}</h3><p>${desc}</p><span class="arrow">Explore →</span></a>`).join('')}
    </div>
  </section>

  <section class="section alt" id="raho">
    <div class="eyebrow">Depth behind the idea</div>
    <h2>Flow First did not begin as a slogan.</h2>
    <p class="section-lead">The thinking has been shaped by real-world experience within the RAHO ecosystem in Indonesia, including large-scale use of advanced flow-focused therapies. We use that history to give the Flow First idea context, depth and ongoing learning — while keeping the education here separate from treatment claims.</p>
    <div class="stat-row">
      <div class="stat"><strong>35,000+</strong><small>RAHO members</small></div>
      <div class="stat"><strong>350,000+</strong><small>infusions reported within the ecosystem</small></div>
      <div class="stat"><strong>Patient #001 → today</strong><small>a continuing story of technology, experience and learning</small></div>
    </div>
    <div class="share-strip">
      <div><strong>Know someone who should see this?</strong><div class="small">Share the page with a family member, friend or caregiver.</div></div>
      <div class="share-actions">
        <button class="share-btn" data-share="native">Share</button>
        <button class="share-btn" data-share="whatsapp">WhatsApp</button>
        <button class="share-btn" data-share="telegram">Telegram</button>
        <button class="share-btn" data-share="copy">Copy link</button>
      </div>
    </div>
  </section>

  <section class="section" id="intake">
    <div class="intake-wrap">
      <div>
        <div class="eyebrow">Tell us about your situation</div>
        <h2>Seven simple questions. No long medical form.</h2>
        <p class="section-lead">Your answers help us understand what brought you here and what kind of follow-up, if any, would be useful.</p>
        <p class="notice">If this is a medical emergency or symptoms are sudden or severe, do not wait for a response from Think Flow First. Contact local emergency services or seek urgent medical care.</p>
      </div>
      <div class="intake-panel" id="intake-panel"></div>
    </div>
  </section>`;
}

document.getElementById('app').innerHTML = sectionHTML();

const questions = [
  { key:'relationship', title:'Who are you asking about?', type:'options', options:['Myself','Spouse / partner','Parent','Child','Relative','Friend / someone else'] },
  { key:'situation', title: pathKey === 'stroke' ? 'What happened, and what is the current situation?' : pathKey === 'prevention' ? 'What prompted you to start thinking about prevention?' : 'What is the main health situation or goal you are exploring?', type:'textarea', placeholder:'A short description is enough.' },
  { key:'timing', title: pathKey === 'stroke' ? 'When did the stroke happen?' : 'How long has this been relevant?', type:'options', options:['Less than 1 month','1–6 months','6–12 months','1–3 years','More than 3 years','Not sure / not applicable'] },
  { key:'challenge', title:'What is the biggest concern or challenge right now?', type:'textarea', placeholder:'For example: walking, fatigue, speech, circulation, prevention, treatment decisions…' },
  { key:'goal', title:'What are you hoping to understand or improve?', type:'textarea', placeholder:'Tell us what would make this information useful to you.' },
  { key:'currentCare', title:'What care, treatment or approaches are being used now?', type:'textarea', placeholder:'For example: specialist care, rehabilitation, medication, stem cells, supplements, none currently…' },
  { key:'country', title:'Where are you based?', type:'text', placeholder:'Country (and city if you wish)' }
];

let step = 0;
const answers = {};
const panel = document.getElementById('intake-panel');

function progressPct() { return Math.round((step / (questions.length + 2)) * 100); }

function renderQuestion() {
  const q = questions[step];
  let body = '';
  if (q.type === 'options') body = `<div class="options">${q.options.map(o=>`<button class="option" data-value="${o}">${o}</button>`).join('')}</div>`;
  if (q.type === 'textarea') body = `<textarea class="field" rows="5" id="free-answer" placeholder="${q.placeholder}"></textarea>`;
  if (q.type === 'text') body = `<input class="field" id="free-answer" placeholder="${q.placeholder}" />`;
  panel.innerHTML = `<div class="progress"><div style="width:${progressPct()}%"></div></div><div class="small">Question ${step+1} of ${questions.length}</div><h3 class="q-title">${q.title}</h3>${body}<div class="form-actions">${step>0?'<button class="btn secondary" id="back">Back</button>':''}${q.type!=='options'?'<button class="btn" id="next">Continue</button>':''}</div>`;
  panel.querySelectorAll('.option').forEach(btn=>btn.addEventListener('click',()=>{answers[q.key]=btn.dataset.value; step++; nextStage();}));
  const next = document.getElementById('next'); if(next) next.addEventListener('click',()=>{ const v=document.getElementById('free-answer').value.trim(); if(!v) return; answers[q.key]=v; step++; nextStage(); });
  const back = document.getElementById('back'); if(back) back.addEventListener('click',()=>{step--; renderQuestion();});
}

function renderContact() {
  panel.innerHTML = `<div class="progress"><div style="width:82%"></div></div><div class="small">Almost done</div><h3 class="q-title">Where should we send your information and updates?</h3>
    <input class="field" id="name" placeholder="First name" />
    <input class="field" id="email" type="email" placeholder="Email" />
    <input class="field" id="messaging" placeholder="WhatsApp or Telegram number / username (optional)" />
    <label class="small"><input type="checkbox" id="brief" checked /> Send me the Flow First Brief and relevant educational updates. I can unsubscribe at any time.</label>
    <div class="form-actions"><button class="btn secondary" id="back-contact">Back</button><button class="btn" id="contact-next">Continue</button></div>`;
  document.getElementById('back-contact').onclick=()=>{step=questions.length-1;renderQuestion();};
  document.getElementById('contact-next').onclick=()=>{
    const name=document.getElementById('name').value.trim(); const email=document.getElementById('email').value.trim();
    if(!name || !email) return;
    answers.name=name; answers.email=email; answers.messaging=document.getElementById('messaging').value.trim(); answers.flowFirstBrief=document.getElementById('brief').checked;
    renderIntent();
  };
}

function renderIntent() {
  panel.innerHTML = `<div class="progress"><div style="width:92%"></div></div><div class="small">Your next step</div><h3 class="q-title">What would you like us to do next?</h3>
  <div class="intent-grid">
    <button class="intent" data-intent="help-now"><strong>I’d like help now</strong><span>Have someone review my information and contact me about appropriate next steps.</span></button>
    <button class="intent" data-intent="country-alert"><strong>Let me know when Flow First reaches my country</strong><span>Keep my country and interest on the availability list.</span></button>
    <button class="intent" data-intent="keep-posted"><strong>Just keep me posted</strong><span>Send educational updates, RAHO insights and the Flow First Brief.</span></button>
  </div>`;
  panel.querySelectorAll('[data-intent]').forEach(b=>b.onclick=()=>submitLead(b.dataset.intent));
}

async function submitLead(intent) {
  answers.intent=intent;
  const savedAttribution = JSON.parse(localStorage.getItem('tff_attribution') || '{}');
  const payload = { answers, attribution:savedAttribution };
  localStorage.setItem('tff_last_submission', JSON.stringify(payload));
  panel.innerHTML = `<div class="progress"><div style="width:100%"></div></div><div class="success"><h3 class="q-title">Thank you, ${answers.name}.</h3><p>We’ve recorded that you selected <strong>${intent==='help-now'?'I’d like help now':intent==='country-alert'?'Tell me when it reaches my country':'Just keep me posted'}</strong>.</p><p class="small">You can also share this page with someone else who may find it useful.</p></div><div class="share-actions" style="margin-top:16px"><button class="share-btn" data-share="whatsapp">WhatsApp</button><button class="share-btn" data-share="telegram">Telegram</button><button class="share-btn" data-share="copy">Copy link</button></div>`;
  wireShareButtons();
  try { await fetch('/api/lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)}); } catch(e) { console.warn('Lead submission network error',e); }
}

function nextStage(){ if(step<questions.length) renderQuestion(); else renderContact(); }
renderQuestion();

function trackedShareUrl(){
  const u=new URL(location.href); u.searchParams.set('shared','1');
  if(answers.email) u.searchParams.delete('email');
  return u.toString();
}
function wireShareButtons(){
  document.querySelectorAll('[data-share]').forEach(btn=>btn.onclick=async()=>{
    const url=trackedShareUrl(); const text='I thought you might find this Think Flow First page useful.';
    if(btn.dataset.share==='native' && navigator.share){ try{return await navigator.share({title:'Think Flow First',text,url});}catch(e){} }
    if(btn.dataset.share==='whatsapp') return window.open(`https://wa.me/?text=${encodeURIComponent(text+' '+url)}`,'_blank');
    if(btn.dataset.share==='telegram') return window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,'_blank');
    await navigator.clipboard.writeText(url); btn.textContent='Copied'; setTimeout(()=>btn.textContent='Copy link',1500);
  });
}
wireShareButtons();

document.querySelector('.menu-button').onclick=()=>{
  const nav=document.querySelector('.nav'); nav.style.display=nav.style.display==='flex'?'none':'flex'; nav.style.position='absolute'; nav.style.top='66px'; nav.style.right='16px'; nav.style.flexDirection='column'; nav.style.alignItems='flex-start'; nav.style.padding='18px'; nav.style.background='#fff'; nav.style.border='1px solid #d8e6e0'; nav.style.borderRadius='16px';
};
