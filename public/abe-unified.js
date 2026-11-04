/* Unified navigation, motion and progressive interaction across published Framer
 * captures and Framer-derived ABE pages; never introduces a second header. */
(function(){
"use strict";
if(window.__abeUnified)return;window.__abeUnified=true;document.documentElement.classList.add("abex-js");
const LINKS=[["Services","/services"],["Work","/work"],["Process","/process"],["Programs","/programs"],["Products","/products"],["About","/about"],["Insights","/insights"]];
const arrow='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M8 7h9v9"/></svg>';
function navMarkup(){return '<ul>'+LINKS.map((x,i)=>'<li><a href="'+x[1]+'"'+(location.pathname===x[1]||location.pathname.startsWith(x[1]+"/")?' aria-current="page"':'')+'><span class="cghd-n">'+String(i+1).padStart(2,"0")+'</span>'+x[0]+'</a></li>').join("")+'</ul>'}
/* Avoid changing Framer-owned SSR trees before hydration. Reconcile only
   when the browser has finished loading; keep mobile UI outside #main. */
const WORK_CATEGORIES=["All","Software","Construction","Education","Healthcare","School systems"];
const WORK_ROUTE_TYPES={"/work/waste2light":"Software","/work/bumars":"Construction","/work/future-speakers":"Education","/work/maka-integrated":"Healthcare","/work/cyfamod":"School systems"};
function updateHeader(){
 const header=document.querySelector("header.cghd");if(!header)return;
 const nav=header.querySelector("nav.cghd-nav");
 if(nav){
  const anchors=[...nav.querySelectorAll("li>a[href]")];
  const correct=anchors.length===LINKS.length&&anchors.every((a,i)=>a.getAttribute("href")===LINKS[i][1]&&a.textContent.trim().endsWith(LINKS[i][0]));
  if(!correct)nav.innerHTML=navMarkup();
  nav.setAttribute("aria-label","ABE TechLab primary navigation");
  for(const a of nav.querySelectorAll("a[href]")){
   const href=a.getAttribute("href"),active=href===location.pathname||(href!=="/"&&location.pathname.startsWith(href+"/"));
   if(active)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current");
  }
 }
 const logo=header.querySelector(".cghd-logo");if(logo&&logo.getAttribute("href")!=="/")logo.setAttribute("href","/");
 let menu=document.getElementById("abe-site-menu");
 if(!menu){
  menu=document.createElement("nav");menu.className="abe-mobile-menu";menu.id="abe-site-menu";menu.setAttribute("aria-label","ABE TechLab mobile navigation");
  menu.innerHTML=LINKS.map((x,i)=>'<a href="'+x[1]+'"><span>'+String(i+1).padStart(2,"0")+'</span>'+x[0]+arrow+'</a>').join("")+'<a href="/contact"><span>08</span>Start a project'+arrow+'</a>';
  menu.setAttribute("aria-hidden","true");document.body.appendChild(menu);
 }
 // The Framer header can be re-rendered; the menu remains a body-level sibling.
 for(const burger of document.querySelectorAll(".cghd-burger"))burger.setAttribute("aria-controls","abe-site-menu");
}
function setupWorkFilters(){
 document.querySelectorAll(".cgwl").forEach(section=>{
  const chips=[...section.querySelectorAll(".cgwl-chips button")];
  if(chips.length!==WORK_CATEGORIES.length)return;
  chips.forEach((chip,i)=>{
   const type=WORK_CATEGORIES[i],count=i===0?5:1;
   const text=[...chip.childNodes].find(n=>n.nodeType===3);
   if(text&&text.nodeValue!==type)text.nodeValue=type;
   const em=chip.querySelector("em");if(em)em.textContent=String(count).padStart(2,"0");
   chip.dataset.abeWorkCategory=type;
  });
  section.querySelectorAll(".cgwl-card").forEach(card=>{
   const url=card.querySelector("a[href]")?.getAttribute("href")||"";
   const cat=WORK_ROUTE_TYPES[url]||"";
   if(!cat)return;
   card.dataset.abeWorkCategory=cat;
   const meta=card.querySelector(".cgwl-meta > span:nth-child(2)");
   if(meta&&meta.textContent.trim()!==cat+" · Product work")meta.textContent=cat+" · Product work";
  });
 });
}
function ensureTeamMore(){
 document.querySelectorAll("section.cgtm").forEach(section=>{
 if(section.querySelector(".cgtm-view-more"))return;
 const slot=document.createElement("div");slot.className="cgtm-view-more";
 const link=document.createElement("a");link.href="/team";link.textContent="View more about the team";slot.appendChild(link);section.appendChild(slot);
 });
}
function footer(){document.querySelectorAll(".cgft-cols").forEach(nav=>{if(nav.dataset.abeUnified)return;
 const anchors=[...nav.querySelectorAll("a")];for(const a of anchors){
   const u=new URL(a.href,location.href);if(u.pathname==="/pricing")a.href="/products";
   if(u.pathname==="/blog")a.href="/insights";
 }
 nav.dataset.abeUnified="1";});}
let revealObserver=null;
function motion(){
 const els=[...document.querySelectorAll(".abex [data-abe-reveal]:not([data-abe-observed])")];
 if(!els.length)return;
 if(!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion: reduce)").matches){
  els.forEach(e=>{e.dataset.abeObserved="1";e.classList.add("visible")});return;
 }
 if(!revealObserver)revealObserver=new IntersectionObserver(list=>{
  for(const entry of list)if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target)}
 },{threshold:.07,rootMargin:"0px 0px -18px 0px"});
 els.forEach(e=>{e.dataset.abeObserved="1";revealObserver.observe(e)});
 document.documentElement.classList.add("abex-motion-ready");
}
function sync(){
 updateHeader();footer();ensureTeamMore();setupWorkFilters();motion();
}
function reconcile(){
 try{sync()}catch(e){console.warn("ABE enhancement failed; static navigation remains available",e)}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",reconcile,{once:true});else reconcile();
window.addEventListener("load",reconcile,{once:true});
setTimeout(reconcile,650);
setTimeout(reconcile,1850);
setTimeout(reconcile,3600);
/* Framer may replace the original SSR header shortly after first paint.
   Observe ONLY during hydration, and ONLY repair navigation or labels when
   they drift. Never restart scroll observers on DOM changes. */
function watchHydration(){
 const root=document.querySelector("#main[data-framer-hydrate-v2]");
 if(!root||!("MutationObserver" in window))return;
 let scheduled=false;
 const obs=new MutationObserver(()=>{
  const nav=document.querySelector("nav.cghd-nav");
  const links=[...(nav?.querySelectorAll("li>a[href]")||[])];
  const staleNav=links.length!==LINKS.length||links.some((a,i)=>a.getAttribute("href")!==LINKS[i]?.[1]);
  const staleTeam=location.pathname==="/about"&&!document.querySelector(".cgtm-view-more");
  const staleWork=location.pathname==="/work"&&[...document.querySelectorAll(".cgwl-chips button")].some(b=>/Travel|Fintech|Retail|Health & fitness/.test(b.textContent));
  if(!staleNav&&!staleTeam&&!staleWork||scheduled)return;
  scheduled=true;
  requestAnimationFrame(()=>{
   scheduled=false;
   try{if(staleNav)updateHeader();if(staleTeam)ensureTeamMore();if(staleWork)setupWorkFilters()}catch(e){console.warn("ABE hydration reconciliation skipped",e)}
  });
 });
 obs.observe(root,{childList:true,subtree:true});
 setTimeout(()=>obs.disconnect(),8000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",watchHydration,{once:true});else watchHydration();

document.addEventListener("click",e=>{
 const burger=e.target.closest?.(".cghd-burger");
 if(!burger)return;
 e.preventDefault();e.stopImmediatePropagation();
 updateHeader();
 const menu=document.getElementById("abe-site-menu");
 if(!menu)return;
 const open=menu.classList.toggle("is-open");
 const rect=burger.closest("header.cghd")?.getBoundingClientRect();
 menu.style.top=Math.max(50,rect?.bottom||68)+"px";
 menu.setAttribute("aria-hidden",String(!open));
 document.querySelectorAll(".cghd-burger").forEach(b=>b.setAttribute("aria-expanded",String(open)));
 document.documentElement.style.overflow=open?"hidden":"";
},true);
document.addEventListener("keydown",e=>{
 if(e.key!=="Escape")return;
 const menu=document.getElementById("abe-site-menu");
 if(menu){menu.classList.remove("is-open");menu.setAttribute("aria-hidden","true")}
 document.querySelectorAll(".cghd-burger").forEach(b=>b.setAttribute("aria-expanded","false"));
 document.documentElement.style.overflow="";
});
document.addEventListener("click",e=>{
 const chip=e.target.closest?.(".cgwl-chips button");
 if(!chip)return;
 const section=chip.closest(".cgwl");if(!section)return;
 const chips=[...section.querySelectorAll(".cgwl-chips button")];
 const i=chips.indexOf(chip);if(i<0||i>=WORK_CATEGORIES.length)return;
 e.preventDefault();e.stopImmediatePropagation();
 const category=WORK_CATEGORIES[i];
 chips.forEach((b,j)=>{const active=i===j;b.classList.toggle("is-on",active);b.setAttribute("aria-pressed",String(active))});
 let visible=0;section.querySelectorAll(".cgwl-card").forEach(card=>{
  const path=card.querySelector("a[href]")?.getAttribute("href")||"";
  card.hidden=category!=="All"&&WORK_ROUTE_TYPES[path]!==category;
  if(!card.hidden)visible++;
 });
 const count=section.querySelector(".cgwl-count b");if(count)count.textContent=String(visible).padStart(2,"0");
},true);
document.addEventListener("click",function(e){
 if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 const a=e.target.closest&&e.target.closest("a[href]");if(!a||a.target&&a.target!=="_self"||a.hasAttribute("download"))return;
 const raw=a.getAttribute("href")||"";
 if(raw==="#"&&(a.classList.contains("cghd-skip")||a.classList.contains("cg-quiet"))){
  e.preventDefault();e.stopImmediatePropagation();
  if(a.classList.contains("cghd-skip")){const main=document.getElementById("main");main?.scrollIntoView({behavior:"smooth"});main?.focus?.({preventScroll:true})}
  else window.scrollTo({top:0,behavior:"smooth"});
  return;
 }
 if(raw.startsWith("#"))return;
 const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname===location.pathname&&u.search===location.search)return;
 e.preventDefault();e.stopImmediatePropagation();if(window.__abeNavigating)return;window.__abeNavigating=true;location.assign(u.href);
},true);

document.addEventListener("click",e=>{
 let b=e.target.closest?.("[data-abex-filter]");if(b){let selected=b.dataset.abexFilter;document.querySelectorAll("[data-abex-filter]").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));document.querySelectorAll("[data-abex-category]").forEach(x=>{x.hidden=selected!=="All"&&x.dataset.abexCategory!==selected});}
 const tab=e.target.closest?.("[data-abex-tab]");if(tab){const container=tab.closest("[data-abex-tabs]"),selected=tab.dataset.abexTab;container.querySelectorAll("[data-abex-tab]").forEach(x=>x.setAttribute("aria-pressed",String(x===tab)));container.querySelectorAll("[data-abex-panel]").forEach(x=>x.hidden=x.dataset.abexPanel!==selected);}
 const step=e.target.closest?.("[data-abex-step-to]");if(step){let form=step.closest("form"),num=Number(step.dataset.abexStepTo);if(step.dataset.abexStepTo==="next"){num=Number(form.dataset.step||0)+1;const fields=[...form.querySelectorAll(".abex-step.active input[required],.abex-step.active textarea[required],.abex-step.active select[required]")];const missing=fields.find(x=>!x.checkValidity());if(missing){missing.reportValidity();return}}let steps=[...form.querySelectorAll(".abex-step")];num=Math.max(0,Math.min(steps.length-1,num));steps.forEach((x,i)=>x.classList.toggle("active",i===num));form.dataset.step=String(num);form.querySelector(".abex-step-indicator").textContent="Step "+(num+1)+" of "+steps.length;form.querySelector(".abex-step.active input")?.focus();}
});
const form=document.querySelector("form[data-abe-contact]");
if(form)form.addEventListener("submit",async e=>{
 e.preventDefault();const status=document.querySelector("#abex-contact-status");let submit=form.querySelector('button[type="submit"]');let data=Object.fromEntries(new FormData(form).entries());
 if((data.preferred_channel==="whatsapp"||data.preferred_channel==="voice_call")&&!String(data.phone||"").trim()){status.textContent="Please enter your phone number for that follow-up channel.";status.className="abex-notice error";return}
 submit.disabled=true;status.textContent="Sending your enquiry…";status.className="abex-notice";status.hidden=false;
 try{
 const r=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 const j=await r.json();if(!r.ok)throw Error(j.error||"We couldn't send the enquiry.");
 const id=String(j.lead_id||"");if(id){localStorage.setItem("abe_assistant_lead_id",id);window.dispatchEvent(new Event("abe-assistant-context"));}
 status.replaceChildren();status.textContent="Your enquiry was received. ";
 let url=data.preferred_channel==="whatsapp"?j.assistant?.whatsapp:data.preferred_channel==="voice_call"?j.assistant?.call:null;
 if(url){const a=document.createElement("a");a.href=url;a.textContent="Continue your conversation →";a.rel="noopener noreferrer";a.target="_blank";status.appendChild(a)}
 if(data.preferred_channel==="website_chat")window.dispatchEvent(new Event("abe-assistant-open"));
 form.reset();form.dataset.step="0";form.querySelectorAll(".abex-step").forEach((x,i)=>x.classList.toggle("active",i===0));form.querySelector(".abex-step-indicator").textContent="Step 1 of 4";
 }catch(err){status.textContent=err?.message||"Could not send enquiry. Please try again.";status.className="abex-notice error"}
 finally{submit.disabled=false}
});
})();
