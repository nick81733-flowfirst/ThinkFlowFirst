import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

const el = id => document.getElementById(id);
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const configured = !SUPABASE_URL.includes("YOUR_PROJECT") && !SUPABASE_PUBLISHABLE_KEY.includes("YOUR_PUBLIC");
const db = configured ? createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true}}) : null;
let user=null, admin=false, documents=[], versions=[], packages=[], packageItems=[], snapshots=[], invites=[];
const notify=(message,error=false)=>{const node=el("message");node.textContent=message;node.classList.remove("hidden");node.classList.toggle("error",error);};
const value=id=>el(id).value.trim();
const exec=async(fn,success)=>{try{await fn();if(success)notify(success);}catch(e){console.error(e);notify(e?.message||"Operation failed",true);}};
const requireOk=(r)=>{if(r.error)throw r.error;return r.data;};
async function init(){
  const {data:{session}}=await db.auth.getSession();
  await updateSession(session);
  db.auth.onAuthStateChange((_event, session)=>{setTimeout(()=>updateSession(session),0);});
}
async function updateSession(session){
  user=session?.user||null;
  el("login").classList.toggle("hidden",!!user);el("logged").classList.toggle("hidden",!user);
  if(!user)return;
  el("welcome").textContent="Welcome, "+(user.email||"recipient");
  admin=!!requireOk(await db.from("portal_admins").select("user_id").eq("user_id",user.id).maybeSingle());
  el("admin-nav").classList.toggle("hidden",!admin);
  el("recipient").classList.toggle("hidden",admin);
  if(admin){showTab("library");await refreshAdmin();}
  else await refreshRecipient();
}
el("send-code").onclick=()=>exec(async()=>{
  const email=value("email");if(!email)throw new Error("Enter your email address");
  requireOk(await db.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin+window.location.pathname,shouldCreateUser:true}}));
},"Check your email for the verification link. Access still requires an administrator invitation.");
el("logout").onclick=()=>exec(async()=>{requireOk(await db.auth.signOut());},"Signed out.");
function showTab(tab){document.querySelectorAll(".tab").forEach(n=>n.classList.toggle("hidden",n.id!==tab));document.querySelectorAll("[data-tab]").forEach(n=>n.classList.toggle("active",n.dataset.tab===tab));}
document.querySelectorAll("[data-tab]").forEach(n=>n.onclick=()=>showTab(n.dataset.tab));
async function refreshAdmin(){
  documents=requireOk(await db.from("portal_documents").select("*").order("created_at",{ascending:false}));
  versions=requireOk(await db.from("portal_document_versions").select("*").order("created_at",{ascending:false}));
  packages=requireOk(await db.from("portal_packages").select("*").order("updated_at",{ascending:false}));
  packageItems=requireOk(await db.from("portal_package_items").select("*").order("position"));
  snapshots=requireOk(await db.from("portal_snapshots").select("*").order("captured_at",{ascending:false}));
  invites=requireOk(await db.from("portal_invites").select("*").order("created_at",{ascending:false}));
  renderLibrary();renderPackages();renderSnapshots();await refreshAdmins();
}
function versionLabel(v){let doc=documents.find(d=>d.id===v.document_id);return (doc?.title||"Resource")+" · v"+v.version_no+(v.kind==="external_url"?" · LIVE EXTERNAL LINK":" · PDF/file");}
function renderLibrary(){
  el("library-list").innerHTML=documents.map(d=>{
    const vs=versions.filter(v=>v.document_id===d.id);
    return `<article class="item"><h3>${escapeHtml(d.title)}</h3><p class="muted">${escapeHtml(d.description)} · ${escapeHtml(d.audience)} ${escapeHtml(d.evidence_level||"")}</p>
      <div>${vs.map(v=>`<span class="tag">v${v.version_no} · ${escapeHtml(v.kind)} · ${escapeHtml(v.id.slice(0,8))}</span>`).join("")}</div>
      <div class="item-actions"><button data-new-version="${d.id}" class="outline">Add updated version</button></div></article>`;
  }).join("")||'<div class="panel">No resources yet. Upload a file or register a URL.</div>';
  document.querySelectorAll("[data-new-version]").forEach(n=>n.onclick=()=>addVersionPrompt(n.dataset.newVersion));
}
async function uploadVersion(documentId,file,url){
  const all=versions.filter(v=>v.document_id===documentId),versionNo=Math.max(0,...all.map(v=>v.version_no))+1;
  if(!file&&!url)throw new Error("Choose a file or a URL");
  if(file&&url)throw new Error("Choose either a file or a URL");
  if(url){new URL(url);requireOk(await db.from("portal_document_versions").insert({document_id:documentId,version_no:versionNo,kind:"external_url",external_url:url,created_by:user.id}));return;}
  const bytes=await file.arrayBuffer();
  const digest=await crypto.subtle.digest("SHA-256",bytes);
  const hash=Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");
  // Reuse the same binary object when hash matches; no second storage upload.
  const existing=versions.find(v=>v.sha256===hash && v.storage_path);
  const path=existing?.storage_path||("files/"+hash);
  if(!existing){
    const {error}=await db.storage.from("portal-private").upload(path,file,{upsert:false,contentType:file.type||"application/octet-stream"});
    if(error)throw error;
  }
  requireOk(await db.from("portal_document_versions").insert({document_id:documentId,version_no:versionNo,kind:"file",storage_path:path,sha256:hash,bytes:file.size,created_by:user.id}));
}
el("add-resource").onclick=()=>exec(async()=>{
  const title=value("doc-title"),file=el("doc-file").files[0],url=value("doc-url");
  if(!title)throw new Error("Enter a title");
  if(!file&&!url)throw new Error("Select a file or enter a URL");
  const doc=requireOk(await db.from("portal_documents").insert({title,description:value("doc-description"),audience:value("doc-audience"),evidence_level:value("doc-level")||null,created_by:user.id}).select().single());
  await uploadVersion(doc.id,file,url);
  el("doc-title").value="";el("doc-description").value="";el("doc-url").value="";el("doc-file").value="";
  await refreshAdmin();
},"Resource added to the master library.");
function addVersionPrompt(documentId){
  const input=document.createElement("input");input.type="file";input.accept=".pdf,.doc,.docx,.ppt,.pptx";input.style.display="none";
  document.body.append(input);input.onchange=()=>exec(async()=>{if(!input.files[0])return;await uploadVersion(documentId,input.files[0],"");await refreshAdmin();input.remove();},"New immutable file version saved.");
  input.click();
}
el("create-package").onclick=()=>exec(async()=>{
  if(!value("package-name"))throw new Error("Enter a package name");
  requireOk(await db.from("portal_packages").insert({name:value("package-name"),audience:value("package-audience"),created_by:user.id}));
  el("package-name").value="";await refreshAdmin();
},"Package created.");
function renderPackages(){
  const sorted=versions.map(v=>({id:v.id,text:versionLabel(v)}));
  el("package-list").innerHTML=packages.map(p=>{
    const items=packageItems.filter(i=>i.package_id===p.id);
    return `<article class="item"><h3>${escapeHtml(p.name)}</h3><p class="muted">${escapeHtml(p.audience)} · ${items.length} selected versions</p>
    <div>${items.map((i,index)=>`<div class="docpick"><span>${index+1}.</span><span>${escapeHtml(sorted.find(v=>v.id===i.version_id)?.text||"Unknown")}</span>
    <button class="outline" data-remove-item="${i.id}">Remove</button></div>`).join("")}</div>
    <select id="select-${p.id}"><option value="">Select a document version</option>${sorted.filter(v=>!items.some(i=>i.version_id===v.id)).map(v=>`<option value="${v.id}">${escapeHtml(v.text)}</option>`).join("")}</select>
    <div class="item-actions"><button data-add-item="${p.id}" class="outline">Add selected resource</button><button data-capture="${p.id}" ${items.length===0?"disabled":""}>Take snapshot</button></div></article>`;
  }).join("")||'<div class="panel">Create your first doctor or patient package.</div>';
  document.querySelectorAll("[data-add-item]").forEach(n=>n.onclick=()=>exec(async()=>{
    const pid=n.dataset.addItem,vid=value("select-"+pid);
    if(!vid)throw new Error("Select a resource");
    const position=packageItems.filter(i=>i.package_id===pid).length;
    requireOk(await db.from("portal_package_items").insert({package_id:pid,version_id:vid,position}));await refreshAdmin();
  },"Resource added to package."));
  document.querySelectorAll("[data-remove-item]").forEach(n=>n.onclick=()=>exec(async()=>{requireOk(await db.from("portal_package_items").delete().eq("id",n.dataset.removeItem));await refreshAdmin();},"Removed from draft; historical snapshots unchanged."));
  document.querySelectorAll("[data-capture]").forEach(n=>n.onclick=()=>exec(async()=>{const result=requireOk(await db.rpc("portal_capture_snapshot",{p_package_id:n.dataset.capture}));await refreshAdmin();showTab("snapshots");notify("Immutable snapshot captured: "+result);}));
}
function renderSnapshots(){
  el("snapshot-list").innerHTML=snapshots.map(s=>{
    const shared=invites.filter(i=>i.snapshot_id===s.id);
    return `<article class="item"><h3>${escapeHtml(s.title)}</h3><p class="muted">Snapshot ${escapeHtml(s.id.slice(0,8))} · ${new Date(s.captured_at).toLocaleString()} · ${shared.length} invitations</p>
      <div>${shared.map(i=>`<div class="docpick"><span>${escapeHtml(i.recipient_name)} (${escapeHtml(i.email)}) · ${i.revoked_at?"Revoked":new Date(i.expires_at)<new Date()?"Expired":"Active"}</span>
      ${i.revoked_at?"":`<button class="outline" data-revoke="${i.id}">Revoke</button>`}</div>`).join("")}</div>
      <div class="fields"><label>Recipient name<input id="name-${s.id}" placeholder="Dr. Partner"></label><label>Verified email address<input type="email" id="mail-${s.id}" placeholder="doctor@example.com"></label><label>Organization<input id="org-${s.id}" placeholder="Clinic"></label><label>Expiry<input type="date" id="expiry-${s.id}"></label></div>
      <div class="item-actions"><button data-invite="${s.id}">Authorize recipient</button><button class="outline" data-view-snapshot="${s.id}">View manifest</button></div><p class="muted">Authorization stores access rights. It does not automatically send an email invitation.</p><div id="manifest-${s.id}"></div></article>`;
  }).join("")||'<div class="panel">No snapshots yet. Capture one from a package.</div>';
  document.querySelectorAll("[data-invite]").forEach(n=>n.onclick=()=>exec(async()=>{
    const id=n.dataset.invite,email=value("mail-"+id).toLowerCase(),name=value("name-"+id),org=value("org-"+id),expiry=value("expiry-"+id);
    if(!email||!name)throw new Error("Recipient name and email are required");
    const expires_at=expiry?new Date(expiry+"T23:59:59").toISOString():new Date(Date.now()+30*86400000).toISOString();
    requireOk(await db.from("portal_invites").insert({snapshot_id:id,email,recipient_name:name,organization:org,expires_at,created_by:user.id}));
    await refreshAdmin();
  },"Recipient authorized. No email sent."));
  document.querySelectorAll("[data-revoke]").forEach(n=>n.onclick=()=>exec(async()=>{
    requireOk(await db.from("portal_invites").update({revoked_at:new Date().toISOString()}).eq("id",n.dataset.revoke));await refreshAdmin();
  },"Access revoked."));
  document.querySelectorAll("[data-view-snapshot]").forEach(n=>n.onclick=()=>exec(async()=>{
    const id=n.dataset.viewSnapshot;
    const rows=requireOk(await db.from("portal_snapshot_items").select("*").eq("snapshot_id",id).order("position"));
    el("manifest-"+id).innerHTML=rows.map(i=>`<div class="review-resource"><b>${escapeHtml(i.title_at_capture)}</b> <small class="muted">${escapeHtml(i.version_id.slice(0,8))}</small><p>${escapeHtml(i.note)}</p></div>`).join("");
  }));
}

async function refreshAdmins(){
  const admins=requireOk(await db.rpc("portal_list_admins"));
  el("admin-list").innerHTML=admins.map(a=>`<div class="docpick"><div style="flex:1"><strong>${escapeHtml(a.email)}</strong><p class="muted">${a.user_id===user.id?"You · ":""}Administrator since ${new Date(a.created_at).toLocaleDateString()}</p></div><button class="outline" data-remove-admin="${a.user_id}" ${admins.length<=1?"disabled":""}>Remove</button></div>`).join("")||'<p>No administrators found.</p>';
  document.querySelectorAll("[data-remove-admin]").forEach(n=>n.onclick=()=>exec(async()=>{
    const target=admins.find(a=>a.user_id===n.dataset.removeAdmin);
    if(!target||!window.confirm("Revoke administrator access for "+target.email+"?"))return;
    requireOk(await db.rpc("portal_revoke_admin",{p_user_id:target.user_id}));
    if(target.user_id===user.id){await updateSession((await db.auth.getSession()).data.session);notify("Your administrator access has been revoked.");}
    else {await refreshAdmins();notify("Administrator access revoked.");}
  }));
  const events=requireOk(await db.from("portal_admin_audit").select("*").order("occurred_at",{ascending:false}).limit(20));
  el("admin-audit").innerHTML=events.map(e=>`<div class="docpick"><span>${escapeHtml(e.action)} · ${new Date(e.occurred_at).toLocaleString()} · ${escapeHtml(e.target_id.slice(0,8))}</span></div>`).join("")||'<p class="muted">No changes yet.</p>';
}
el("add-admin").onclick=()=>exec(async()=>{
  const email=value("new-admin-email").toLowerCase();
  if(!email||!el("new-admin-email").checkValidity())throw new Error("Enter a valid email address.");
  if(!window.confirm("Grant full administrator access to "+email+"?"))return;
  requireOk(await db.rpc("portal_grant_admin",{p_email:email}));
  el("new-admin-email").value="";
  await refreshAdmins();
  notify("Administrator access granted to "+email+".");
});

async function refreshRecipient(){
  const myEmail=user.email?.toLowerCase()||"";
  const mine=requireOk(await db.from("portal_invites").select("*").eq("email",myEmail).is("revoked_at",null).gt("expires_at",new Date().toISOString()));
  const results=[];
  for(const i of mine){
    const snap=requireOk(await db.from("portal_snapshots").select("*").eq("id",i.snapshot_id).maybeSingle());
    if(!snap)continue;
    const items=requireOk(await db.from("portal_snapshot_items").select("*").eq("snapshot_id",snap.id).order("position"));
    results.push({invite:i,snap,items});
  }
  el("recipient-list").innerHTML=results.map(({invite,snap,items})=>`<article class="item"><h3>${escapeHtml(snap.title)}</h3>
    <p class="muted">Snapshot captured ${new Date(snap.captured_at).toLocaleDateString()} · Access expires ${new Date(invite.expires_at).toLocaleDateString()}</p>
    ${items.map((item,k)=>`<div class="review-resource"><b>${k+1}. ${escapeHtml(item.title_at_capture)}</b><p>${escapeHtml(item.description_at_capture)}</p><p class="muted">${escapeHtml(item.note)}</p><button data-open-resource="${item.version_id}" data-invite-id="${invite.id}" class="outline">Open resource</button></div>`).join("")}
    <div class="fields"><label>Questions for the sender<textarea id="question-${invite.id}" rows="2" placeholder="Optional question"></textarea></label></div>
    <div class="item-actions"><button data-question="${invite.id}" class="outline">Submit question</button><button data-ack="${invite.id}">I reviewed these materials</button></div>
    <p class="muted">Acknowledgment confirms your declaration, not comprehension or agreement.</p></article>`).join("")||'<div class="panel">No active invitations for your verified email. Ask the sender to authorize your address.</div>';
  document.querySelectorAll("[data-open-resource]").forEach(n=>n.onclick=()=>exec(async()=>{
    const v=requireOk(await db.from("portal_document_versions").select("*").eq("id",n.dataset.openResource).single());
    if(v.kind==="external_url"){
      // External links are LIVE and may change. Open only http(s) URLs.
      const url=new URL(v.external_url);if(!["https:","http:"].includes(url.protocol))throw new Error("Invalid external URL");
      window.open(url.href,"_blank","noopener,noreferrer");
    }else{
      const result=requireOk(await db.storage.from("portal-private").createSignedUrl(v.storage_path,60));
      window.open(result.signedUrl,"_blank","noopener,noreferrer");
    }
    await logEvent(n.dataset.inviteId,v.id,"opened");
  }));
  document.querySelectorAll("[data-question]").forEach(n=>n.onclick=()=>exec(async()=>{const msg=value("question-"+n.dataset.question);if(!msg)throw new Error("Write your question");await logEvent(n.dataset.question,null,"question",msg);el("question-"+n.dataset.question).value="";},"Question saved for the sender."));
  document.querySelectorAll("[data-ack]").forEach(n=>n.onclick=()=>exec(async()=>{await logEvent(n.dataset.ack,null,"acknowledged");},"Review acknowledgment recorded."));
}
async function logEvent(invite_id,version_id,kind,message=null){requireOk(await db.from("portal_review_events").insert({invite_id,version_id,kind,message,created_by:user.id}));}
if(configured){init().catch(e=>notify("Portal setup error: "+e.message,true));}
else {notify("Setup required: connect the portal to a dedicated Supabase project before using authentication or files.",true);el("send-code").disabled=true;}
