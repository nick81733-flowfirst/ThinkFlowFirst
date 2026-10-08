const doorData = {
  start:{eyebrow:'You were told to Think Flow First',title:'Here’s what that means.',intro:'Think Flow First is an education framework built around a simple question: before deciding what treatment, therapy or longevity intervention comes next, have we paid enough attention to circulation, delivery and the environment in which the body has to respond?',note:'General introduction'},
  stroke:{eyebrow:'Stroke & recovery',title:'After a stroke, flow deserves a place in the conversation.',intro:'Stroke care and rehabilitation are complex. Think Flow First does not replace emergency care, neurology or rehabilitation. It helps families ask whether circulation, delivery and the wider recovery environment deserve attention alongside established care.',note:'Stroke entry door'},
  heart:{eyebrow:'Heart health',title:'The heart moves blood. The rest of the body depends on where it can go.',intro:'Heart health is not only about the pump. It is also about circulation throughout the body. Think Flow First helps people explore that wider picture alongside appropriate medical care.',note:'Heart entry door'},
  parkinsons:{eyebrow:"Parkinson's & supportive care",title:'When the condition is complex, start with foundational questions.',intro:"Parkinson's care may involve medication, movement, rehabilitation and long-term support. Think Flow First adds an educational lens around circulation, delivery and the body's internal environment.",note:"Parkinson's entry door"},
  prevention:{eyebrow:'Prevention',title:'Don’t wait for a major event to start thinking about flow.',intro:'Prevention is about improving the odds before something goes wrong. Think Flow First puts vascular health, circulation and delivery into that conversation.',note:'Prevention entry door'},
  stemcells:{eyebrow:'Stem cells & regenerative therapies',title:'If you are into stem cells, Think Flow First.',intro:'Regenerative therapies focus on what is being introduced into the body. Flow First asks an earlier question: what is the environment those therapies are entering?',note:'Stem cell entry door'},
  longevity:{eyebrow:'Longevity & biohacking',title:'Before you add another therapy, ask about the environment it has to work in.',intro:'NAD+, peptides, PRP, exosomes and other longevity interventions all ask the body to respond. Think Flow First asks whether circulation and delivery deserve attention too.',note:'Longevity entry door'},
  'before-you-travel':{eyebrow:'Before overseas treatment',title:'Before you book the flight, Think Flow First.',intro:'Overseas treatment can involve major cost, hope and uncertainty. Before making the trip, it may be worth asking whether the fundamentals of circulation, delivery and the wider care environment have been considered.',note:'Overseas treatment entry door'},
  recovery:{eyebrow:'Recovery',title:'Recovery is more than one therapy.',intro:'Rehabilitation, movement, nutrition, sleep, medical care and circulation can all be part of the environment around recovery. Think Flow First helps organize that conversation.',note:'Recovery entry door'}
};

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

const params = new URLSearchParams(location.search);
const pathKey = location.pathname.replace(/^\/+|\/+$/g,'') || 'start';
const attribution = {
 originalSource: params.get('src') || params.get('utm_source') || '',
 campaign: params.get('campaign') || params.get('utm_campaign') || '',
 hook: params.get('hook') || params.get('content') || params.get('utm_content') || '',
 deliveryChannel: params.get('via') || '',
 entryDoor: doorData[pathKey] ? pathKey : 'direct',
 landingUrl: location.href
};
if (doorData[pathKey]) localStorage.setItem('tff_attribution', JSON.stringify(attribution));

const app = document.getElementById('app');

function headerBand(kicker,title,lead){
 return `<section class="page-hero"><div class="page-hero-copy"><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${lead}</p></div><div class="orbital"><div class="orbit orbit-a"></div><div class="orbit orbit-b"></div><div class="core">FLOW</div></div></section>`;
}

function flowVisual(){
 return `<div class="flow-visual">
   <div class="flow-node"><span>01</span><strong>Supply</strong><small>Oxygen, nutrients, signals, therapies</small></div>
   <div class="flow-line"></div>
   <div class="flow-node featured"><span>02</span><strong>Flow</strong><small>Circulation and delivery through the body</small></div>
   <div class="flow-line"></div>
   <div class="flow-node"><span>03</span><strong>Response</strong><small>Tissues, recovery, function and adaptation</small></div>
 </div>`;
}

function coreFlowSections(context='general'){
 const tailored = {
  stroke:'In stroke recovery, this does not mean “flow is the treatment.” It means circulation, tissue delivery and the recovery environment are important questions to place alongside rehabilitation and specialist care.',
  heart:'In heart health, the Flow First lens asks us to look beyond one number or one organ and consider how well circulation is supporting the rest of the body.',
  parkinsons:"In Parkinson's, Flow First is a supportive framework, not a disease claim. It asks whether circulation, movement, rehabilitation and the wider internal environment are being considered together.",
  prevention:'In prevention, Flow First means thinking about vascular health and circulation before a major event forces the issue.',
  stemcells:'For regenerative therapies, Flow First is a companion idea: before asking what cells or biological material we are adding, ask what environment those therapies are entering.',
  longevity:'For longevity, Flow First is the foundation question before adding more interventions: is the body moving and delivering what those interventions depend on?',
  'before-you-travel':'Before travelling for treatment, Flow First helps you ask whether the basics have been considered before committing time, money and hope to another intervention.',
  recovery:'In recovery, Flow First sits alongside rehabilitation, movement, nutrition, sleep and medical care as part of the wider recovery environment.',
  general:'Flow First is not a diagnosis and it is not a claim that one therapy solves everything. It is a way of thinking about sequence: before adding more, ask whether the body has the circulation and delivery environment needed to respond.'
 };
 return `
 <section class="section deep" id="flow-first">
   <div class="section-grid">
    <div>
      <div class="eyebrow">What is Flow First?</div>
      <h2>Before asking “what else should we add?”, ask whether the body can deliver what it already has.</h2>
      <p class="section-lead">Every organ, tissue and therapy depends in some way on movement and delivery. Blood carries oxygen, nutrients, hormones, immune cells, metabolic products and many of the substances used in treatment. Flow First simply says: <strong>that delivery environment deserves to be considered early, not as an afterthought.</strong></p>
      <p class="body-copy">${tailored[context] || tailored.general}</p>
    </div>
    <div class="principle-card">
      <div class="eyebrow">The sequence</div>
      <div class="big-quote">“Before more treatment, more supplements, more procedures or more technology — first ask about flow.”</div>
      <p>That is the thinking behind the name <strong>Think Flow First</strong>.</p>
    </div>
   </div>
   ${flowVisual()}
 </section>

 <section class="section soft">
   <div class="eyebrow">Why this matters</div>
   <h2>Flow First is a framework, not a promise.</h2>
   <div class="four-grid">
    <article class="info-card"><span>01</span><h3>Circulation connects the body</h3><p>Different organs do different jobs, but they all depend on an ongoing supply-and-removal system.</p></article>
    <article class="info-card"><span>02</span><h3>Therapies need an environment</h3><p>Whether the intervention is rehabilitation, nutrition, medicine, stem cells or a longevity program, the body still has to receive and respond.</p></article>
    <article class="info-card"><span>03</span><h3>Sequence matters</h3><p>Sometimes the better question is not “what else can we add?” but “what foundations should we examine first?”</p></article>
    <article class="info-card"><span>04</span><h3>It complements, not replaces</h3><p>Flow First is designed to sit alongside appropriate medical care and other therapies, not to replace them.</p></article>
   </div>
 </section>

 <section class="section">
   <div class="compare">
    <div><div class="eyebrow">The usual question</div><h3>“What treatment should I try next?”</h3></div>
    <div class="compare-arrow">→</div>
    <div><div class="eyebrow">The Flow First question</div><h3>“What does my body need in order to respond well?”</h3></div>
   </div>
 </section>`;
}

function rahoTeaser(){
 return `<section class="section dark">
   <div class="section-grid">
    <div>
      <div class="eyebrow light">The experience behind the idea</div>
      <h2>Flow First did not begin as a slogan.</h2>
      <p class="section-lead light-copy">The thinking has been shaped by years of real-world experience inside the RAHO ecosystem in Indonesia — a large community built around advanced flow-focused therapies, education and continuing observation.</p>
      <a class="btn pale" href="/raho">Explore the RAHO story</a>
    </div>
    <div class="metric-stack">
      <div class="metric"><strong>35,000+</strong><span>members reported within the RAHO ecosystem</span></div>
      <div class="metric"><strong>350,000+</strong><span>infusions reported within the ecosystem</span></div>
      <div class="metric"><strong>Patient #001 → today</strong><span>a continuing story of experience, technology and learning</span></div>
    </div>
   </div>
 </section>`;
}

function exploreSection(){
 return `<section class="section" id="explore">
  <div class="eyebrow">Explore by what brought you here</div>
  <h2>Different reasons. One Flow First framework.</h2>
  <p class="section-lead">You do not need to read everything. Start with the subject that matters to you.</p>
  <div class="grid">${entryDoors.map(([slug,name,desc])=>`<a class="card" href="/${slug}${location.search}"><div class="eyebrow">Entry door</div><h3>${name}</h3><p>${desc}</p><span class="arrow">Explore →</span></a>`).join('')}</div>
 </section>`;
}

function shareStrip(){
 return `<div class="share-strip"><div><strong>Know someone who should read this?</strong><div class="small">Share it with a family member, friend or caregiver.</div></div><div class="share-actions"><button class="share-btn" data-share="native">Share</button><button class="share-btn" data-share="whatsapp">WhatsApp</button><button class="share-btn" data-share="telegram">Telegram</button><button class="share-btn" data-share="copy">Copy link</button></div></div>`;
}

function intakeSection(context='start'){
 return `<section class="section soft" id="intake">
   <div class="intake-wrap">
    <div>
      <div class="eyebrow">Tell us about your situation</div>
      <h2>Seven simple questions. No long medical form.</h2>
      <p class="section-lead">Your answers help us understand what brought you here and what kind of follow-up, if any, would be useful.</p>
      <p class="notice">If this is a medical emergency or symptoms are sudden or severe, do not wait for a response from Think Flow First. Contact local emergency services or seek urgent medical care.</p>
    </div>
    <div class="intake-panel" id="intake-panel" data-context="${context}"></div>
   </div>
 </section>`;
}

function renderDoor(slug){
 const d=doorData[slug];
 app.innerHTML = `
  <section class="hero">
   <div>
    <span class="door-note">${d.note}</span>
    <div class="eyebrow">${d.eyebrow}</div>
    <h1>${d.title}</h1>
    <p>${d.intro}</p>
    <div class="hero-actions"><a class="btn" href="#intake">Tell us about your situation</a><a class="btn secondary" href="#flow-first">First, explain Flow First</a></div>
   </div>
   <div class="hero-diagram"><div class="vessel"><i></i><i></i><i></i><i></i><i></i></div><div class="diagram-label">FLOW</div><p>A simple idea: what reaches the tissues matters.</p></div>
  </section>
  ${coreFlowSections(slug)}
  ${rahoTeaser()}
  ${exploreSection()}
  <section class="section">${shareStrip()}</section>
  ${intakeSection(slug)}`;
 initIntake(slug); wireShareButtons();
}

function renderWhat(){
 app.innerHTML = `${headerBand('Core idea','What is Flow First?','A simple way to think about health, recovery and longevity in the right order.')}${coreFlowSections('general')}
 <section class="section soft"><div class="eyebrow">What Flow First is not</div><h2>It is not “blood flow fixes everything.”</h2><div class="three-grid">
  <article class="trust-card"><h3>Not a diagnosis</h3><p>Think Flow First does not diagnose conditions or replace clinical evaluation.</p></article>
  <article class="trust-card"><h3>Not a replacement</h3><p>It is designed to complement appropriate medical care, rehabilitation and other therapies.</p></article>
  <article class="trust-card"><h3>Not a guarantee</h3><p>It is an educational framework for asking better questions and considering foundational physiology earlier.</p></article>
 </div></section>
 ${rahoTeaser()}${exploreSection()}<section class="section">${shareStrip()}</section>`;
 wireShareButtons();
}

function renderWhy(){
 app.innerHTML = `${headerBand('Why flow matters','A delivery system runs through almost everything the body does.','Think Flow First focuses attention on the movement of blood and what that movement makes possible throughout the body.')}${flowVisual()}
 <section class="section"><div class="section-grid"><div><div class="eyebrow">Think in systems</div><h2>Supply. Exchange. Removal. Response.</h2><p class="section-lead">Blood circulation participates in delivering oxygen, nutrients, hormones, immune cells and therapeutic substances, while also helping carry metabolic products away from tissues. That does not mean every condition is caused by poor circulation. It means circulation is too fundamental to ignore.</p></div>
 <div class="principle-card"><h3>Why “First”?</h3><p>Because the question comes early in the sequence. Before assuming that the answer is always another intervention, consider whether the body's delivery environment deserves attention.</p></div></div></section>
 <section class="section soft"><div class="eyebrow">Companion thinking</div><h2>Flow First can sit alongside what you are already doing.</h2><div class="pill-cloud"><span>Rehabilitation</span><span>Medical care</span><span>Stem cells</span><span>PRP</span><span>Peptides</span><span>NAD+</span><span>Exercise</span><span>Nutrition</span><span>Longevity programs</span></div></section>
 ${rahoTeaser()}${exploreSection()}`;
}

function renderRaho(){
 app.innerHTML = `${headerBand('RAHO story','The real-world experience behind Flow First.','Flow First gains depth from the experience, community and technology lineage developed within the RAHO ecosystem in Indonesia.')}

 <section class="section">
  <div class="timeline">
   <div class="timeline-item"><span>01</span><div><div class="eyebrow">The beginning</div><h3>From Patient #001</h3><p>The RAHO story begins with a patient, a problem to solve and the development of an approach centered on flow-focused therapy. The founder story of Eddy Kan and Patient #001 is important because Flow First grew from practical experience before it became a broader educational framework.</p></div></div>
   <div class="timeline-item"><span>02</span><div><div class="eyebrow">The ecosystem grows</div><h3>From individual experience to a community</h3><p>Over time, RAHO developed into a much larger ecosystem involving members, centers, practitioners, education and repeated real-world use of advanced flow-focused infusions.</p></div></div>
   <div class="timeline-item"><span>03</span><div><div class="eyebrow">The learning base</div><h3>35,000+ members and 350,000+ infusions reported</h3><p>These figures describe scale and operational experience. They do <strong>not</strong> by themselves prove treatment effectiveness. They do, however, show that the platform is not based only on a laboratory idea or a handful of users.</p></div></div>
   <div class="timeline-item"><span>04</span><div><div class="eyebrow">The idea broadens</div><h3>From a therapy to a way of thinking</h3><p>Think Flow First takes the central lesson beyond one product: before deciding what to add next, ask whether circulation, delivery and the body's internal environment have been considered.</p></div></div>
  </div>
 </section>

 <section class="section dark">
  <div class="eyebrow light">Scale with perspective</div>
  <h2>Real-world experience is valuable. It is not the same as a randomized clinical trial.</h2>
  <div class="three-grid">
   <article class="dark-card"><strong>35,000+</strong><p>members reported within the RAHO ecosystem.</p></article>
   <article class="dark-card"><strong>350,000+</strong><p>infusions reported across the ecosystem.</p></article>
   <article class="dark-card"><strong>Ongoing</strong><p>education, observation and work toward stronger evidence.</p></article>
  </div>
 </section>

 <section class="section">
  <div class="section-grid">
   <div><div class="eyebrow">Technology lineage</div><h2>Where Advanced Flow fits.</h2><p class="section-lead">Within the wider ecosystem, Advanced Flow refers to an intravenous infusion using hydrogen- and oxygen-based NOVO / IGDS technology. Think Flow First is broader than the infusion itself: the website explains the principle, while specific therapies and programs are considered separately and with appropriate medical oversight.</p></div>
   <div class="principle-card"><div class="eyebrow">Important distinction</div><h3>RAHO gives Flow First history and depth.</h3><p>Think Flow First remains the education platform. RAHO provides the technology lineage, founder story, operating experience and a continuing source of real-world learning.</p></div>
  </div>
 </section>

 <section class="section soft">
  <div class="eyebrow">What we want visitors to understand</div>
  <h2>Experience deserves respect. Claims deserve evidence.</h2>
  <p class="section-lead">The purpose of this page is not to turn reported experience into proof that has not yet been established. It is to show where the Flow First thinking came from, how much practical experience sits behind it, and why further evidence-building matters.</p>
  ${shareStrip()}
 </section>`;
 wireShareButtons();
}

function renderAbout(){
 app.innerHTML = `${headerBand('About / Trust','Why Think Flow First exists.','Think Flow First is an education and navigation platform for people who responded to a Flow First message and want to understand what it means before deciding what to do next.')}

 <section class="section"><div class="section-grid">
  <div><div class="eyebrow">Our purpose</div><h2>Better questions before bigger decisions.</h2><p class="section-lead">People facing illness, recovery decisions or longevity choices are often offered more treatments, more products and more opinions. Think Flow First exists to introduce one foundational question into that process: how well is the body circulating and delivering what it needs?</p></div>
  <div class="principle-card"><h3>Our role</h3><p>Educate. Help visitors organize their questions. Connect interested people with appropriate next steps. We are not an emergency service and this website does not diagnose or prescribe.</p></div>
 </div></section>

 <section class="section soft"><div class="eyebrow">How the pieces relate</div><h2>One idea, several parts of an ecosystem.</h2>
  <div class="four-grid">
   <article class="info-card"><span>01</span><h3>Think Flow First</h3><p>The education and discovery platform you are using now.</p></article>
   <article class="info-card"><span>02</span><h3>Flow First</h3><p>The broader framework: consider circulation, delivery and the internal environment early.</p></article>
   <article class="info-card"><span>03</span><h3>RAHO</h3><p>The Indonesian ecosystem whose experience, founder story and technology lineage give the idea depth.</p></article>
   <article class="info-card"><span>04</span><h3>Providers & programs</h3><p>The places and professionals where people may eventually explore appropriate Flow First-related services.</p></article>
  </div>
 </section>

 <section class="section"><div class="eyebrow">Trust principles</div><h2>What you should expect from us.</h2>
  <div class="three-grid">
   <article class="trust-card"><h3>Clarity over hype</h3><p>We distinguish real-world experience from formal clinical evidence and avoid presenting one as the other.</p></article>
   <article class="trust-card"><h3>Complement, not replace</h3><p>Flow First is designed to work alongside appropriate medical care and established therapies.</p></article>
   <article class="trust-card"><h3>Your choice remains yours</h3><p>The goal is to help you understand and ask better questions, not pressure you into a decision.</p></article>
  </div>
 </section>
 ${rahoTeaser()}`;
}

function renderContact(){
 app.innerHTML = `${headerBand('Contact','Talk to us.','Whether you need help now, have a general question, are asking for a family member or simply want to know when Flow First becomes available where you live, start here.')}
 <section class="section"><div class="contact-layout">
  <div>
   <div class="eyebrow">Choose what fits</div>
   <h2>You do not need to know exactly what to ask.</h2>
   <div class="contact-reasons">
    <div>I'd like help now</div><div>I'm asking for a family member</div><div>I have a general question</div><div>Tell me when it reaches my country</div><div>I'm a healthcare professional</div><div>I'm interested in becoming a provider / partner</div>
   </div>
   <p class="notice">Think Flow First is not an emergency service. For urgent or life-threatening symptoms, contact local emergency services immediately.</p>
  </div>
  <form class="contact-card" id="contact-form">
   <label>Your name<input class="field" name="name" required></label>
   <label>Email<input class="field" type="email" name="email" required></label>
   <label>WhatsApp / Telegram (optional)<input class="field" name="messaging"></label>
   <label>Country<input class="field" name="country"></label>
   <label>What would you like to talk about?<select class="field" name="reason"><option>Help now</option><option>Family member</option><option>General question</option><option>Country availability</option><option>Healthcare professional</option><option>Provider / partner</option><option>Other</option></select></label>
   <label>Your message<textarea class="field" rows="5" name="message" required></textarea></label>
   <button class="btn" type="submit">Send message</button><div class="small" id="contact-status"></div>
  </form>
 </div></section>`;
 document.getElementById('contact-form').addEventListener('submit', submitContact);
}

function renderHistoryLink(){
 app.innerHTML = `${headerBand('Development history','See how Think Flow First is being built.','Major working versions are preserved so stakeholders can review the evolution of the product and learn from the decisions behind each release.')}<section class="section"><a class="btn" href="/history.html">Open development history</a></section>`;
}

if (doorData[pathKey]) renderDoor(pathKey);
else if (pathKey==='what-is-flow-first') renderWhat();
else if (pathKey==='why-flow-matters') renderWhy();
else if (pathKey==='raho') renderRaho();
else if (pathKey==='about') renderAbout();
else if (pathKey==='contact') renderContact();
else if (pathKey==='history') renderHistoryLink();
else renderDoor('start');

function initIntake(context){
 const panel=document.getElementById('intake-panel'); if(!panel) return;
 const questions=[
  {key:'relationship',title:'Who are you asking about?',type:'options',options:['Myself','Spouse / partner','Parent','Child','Relative','Friend / someone else']},
  {key:'situation',title:context==='stroke'?'What happened, and what is the current situation?':context==='prevention'?'What prompted you to start thinking about prevention?':'What is the main health situation or goal you are exploring?',type:'textarea',placeholder:'A short description is enough.'},
  {key:'timing',title:context==='stroke'?'When did the stroke happen?':'How long has this been relevant?',type:'options',options:['Less than 1 month','1–6 months','6–12 months','1–3 years','More than 3 years','Not sure / not applicable']},
  {key:'challenge',title:'What is the biggest concern or challenge right now?',type:'textarea',placeholder:'Tell us in your own words.'},
  {key:'goal',title:'What are you hoping to understand or improve?',type:'textarea',placeholder:'What would make this information useful to you?'},
  {key:'currentCare',title:'What care, treatment or approaches are being used now?',type:'textarea',placeholder:'Specialist care, rehabilitation, medication, stem cells, supplements, none currently…'},
  {key:'country',title:'Where are you based?',type:'text',placeholder:'Country (and city if you wish)'}
 ];
 let step=0; const answers={}; let contact={};
 function progress(){return Math.round((step/(questions.length+2))*100)}
 function showQuestion(){
  const q=questions[step]; let body='';
  if(q.type==='options') body=`<div class="options">${q.options.map(o=>`<button class="option" data-value="${o}">${o}</button>`).join('')}</div>`;
  else if(q.type==='textarea') body=`<textarea class="field" rows="5" id="free-answer" placeholder="${q.placeholder}"></textarea>`;
  else body=`<input class="field" id="free-answer" placeholder="${q.placeholder}">`;
  panel.innerHTML=`<div class="progress"><div style="width:${progress()}%"></div></div><div class="small">Question ${step+1} of ${questions.length}</div><h3 class="q-title">${q.title}</h3>${body}<div class="form-actions">${step>0?'<button class="btn secondary" id="back">Back</button>':''}${q.type!=='options'?'<button class="btn" id="next">Continue</button>':''}</div>`;
  panel.querySelectorAll('.option').forEach(b=>b.onclick=()=>{answers[q.key]=b.dataset.value;step++;nextStage();});
  const n=document.getElementById('next'); if(n)n.onclick=()=>{const v=document.getElementById('free-answer').value.trim();if(!v)return;answers[q.key]=v;step++;nextStage();};
  const back=document.getElementById('back'); if(back)back.onclick=()=>{step--;showQuestion();};
 }
 function showContact(){
  panel.innerHTML=`<div class="progress"><div style="width:82%"></div></div><div class="small">Almost done</div><h3 class="q-title">Where should we send your information and updates?</h3>
   <input class="field" id="name" placeholder="First name"><input class="field" id="email" type="email" placeholder="Email"><input class="field" id="messaging" placeholder="WhatsApp or Telegram number / username (optional)">
   <label class="check-row"><input type="checkbox" id="brief" checked><span>Send me the Flow First Brief and relevant educational updates. I can unsubscribe at any time.</span></label>
   <div class="form-actions"><button class="btn secondary" id="back-contact">Back</button><button class="btn" id="contact-next">Continue</button></div>`;
  document.getElementById('back-contact').onclick=()=>{step=questions.length-1;showQuestion();};
  document.getElementById('contact-next').onclick=()=>{const name=document.getElementById('name').value.trim(),email=document.getElementById('email').value.trim();if(!name||!email)return;contact={name,email,messaging:document.getElementById('messaging').value.trim(),flowFirstBrief:document.getElementById('brief').checked};showIntent();};
 }
 function showIntent(){
  panel.innerHTML=`<div class="progress"><div style="width:92%"></div></div><div class="small">Your next step</div><h3 class="q-title">How would you like us to stay in touch?</h3><p class="small">Select all that apply.</p>
   <div class="intent-grid">
    <label class="intent-select"><input type="checkbox" value="help-now"><span><strong>I’d like help now</strong><small>Have someone review my information and contact me about appropriate next steps.</small></span></label>
    <label class="intent-select"><input type="checkbox" value="country-alert"><span><strong>Let me know when Flow First reaches my country</strong><small>Keep my country and interest on the availability list.</small></span></label>
    <label class="intent-select"><input type="checkbox" value="keep-posted" checked><span><strong>Keep me posted</strong><small>Send educational updates, RAHO insights and the Flow First Brief.</small></span></label>
   </div>
   <div class="form-actions"><button class="btn" id="submit-intent">Finish</button></div>`;
  document.getElementById('submit-intent').onclick=()=>{const intents=[...panel.querySelectorAll('.intent-select input:checked')].map(x=>x.value);if(!intents.length)return;submitLead({...answers,...contact,intents});};
 }
 async function submitLead(allAnswers){
  const saved=JSON.parse(localStorage.getItem('tff_attribution')||'{}');
  const payload={answers:allAnswers,attribution:saved};
  localStorage.setItem('tff_last_submission',JSON.stringify(payload));
  panel.innerHTML=`<div class="progress"><div style="width:100%"></div></div><div class="success"><h3 class="q-title">Thank you, ${allAnswers.name}.</h3><p>We’ve recorded your information and the ways you would like us to stay in touch.</p><p class="small">This staging version records the submission, but advisor routing is not yet connected.</p></div>${shareStrip()}`;
  wireShareButtons();
  try{await fetch('/api/lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});}catch(e){}
 }
 function nextStage(){if(step<questions.length)showQuestion();else showContact();}
 showQuestion();
}

async function submitContact(e){
 e.preventDefault();
 const f=new FormData(e.target); const data=Object.fromEntries(f.entries());
 const payload={type:'contact',answers:data,attribution:JSON.parse(localStorage.getItem('tff_attribution')||'{}')};
 const s=document.getElementById('contact-status'); s.textContent='Sending…';
 try{await fetch('/api/lead',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});s.textContent='Thank you. Your message has been recorded in this staging system.';e.target.reset();}catch(err){s.textContent='We could not send this message. Please try again.';}
}

function trackedShareUrl(){const u=new URL(location.href);u.searchParams.set('shared','1');return u.toString();}
function wireShareButtons(){
 document.querySelectorAll('[data-share]').forEach(btn=>btn.onclick=async()=>{
  const url=trackedShareUrl(), text='I thought you might find this Think Flow First page useful.';
  if(btn.dataset.share==='native'&&navigator.share){try{return await navigator.share({title:'Think Flow First',text,url});}catch(e){}}
  if(btn.dataset.share==='whatsapp')return window.open(`https://wa.me/?text=${encodeURIComponent(text+' '+url)}`,'_blank');
  if(btn.dataset.share==='telegram')return window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,'_blank');
  await navigator.clipboard.writeText(url);btn.textContent='Copied';setTimeout(()=>btn.textContent='Copy link',1500);
 });
}

const menu=document.querySelector('.menu-button');
if(menu)menu.onclick=()=>{const nav=document.querySelector('.nav');nav.classList.toggle('open');};