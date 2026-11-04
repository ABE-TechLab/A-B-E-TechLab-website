/* Unified navigation, motion and progressive interaction across published Framer
 * captures and Framer-derived ABE pages; never introduces a second header. */
(function(){
"use strict";
if(window.__abeUnified)return;window.__abeUnified=true;document.documentElement.classList.add("abex-js");
const LINKS=[["Services","/services"],["Work","/work"],["Process","/process"],["Programs","/programs"],["Products","/products"],["Team","/team"],["About","/about"],["Insights","/insights"]];
const arrow='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M8 7h9v9"/></svg>';
function navMarkup(){return '<ul>'+LINKS.map((x,i)=>'<li><a href="'+x[1]+'"'+(location.pathname===x[1]||location.pathname.startsWith(x[1]+"/")?' aria-current="page"':'')+'><span class="cghd-n">'+String(i+1).padStart(2,"0")+'</span>'+x[0]+'</a></li>').join("")+'</ul>'}
function updateHeader(){
 const header=document.querySelector("header.cghd");if(!header)return;
 const nav=header.querySelector("nav.cghd-nav");
 if(nav&&!nav.dataset.abeUnified){nav.innerHTML=navMarkup();nav.dataset.abeUnified="1";nav.setAttribute("aria-label","ABE TechLab primary navigation")}
 const logo=header.querySelector(".cghd-logo");
 if(logo){logo.href="/";logo.setAttribute("aria-label","ABE TechLab home")}
 const menu=header.querySelector(".abe-mobile-menu")||document.createElement("nav");
 if(!menu.classList.contains("abe-mobile-menu")){
   menu.className="abe-mobile-menu";menu.id="abe-site-menu";menu.setAttribute("aria-label","ABE TechLab mobile navigation");
   menu.innerHTML=LINKS.map((x,i)=>'<a href="'+x[1]+'"><span>'+String(i+1).padStart(2,"0")+'</span>'+x[0]+arrow+'</a>').join("")+'<a href="/contact"><span>09</span>Start a project'+arrow+'</a>';
   header.appendChild(menu);
 }
 const burger=header.querySelector(".cghd-burger");if(burger&&!burger.dataset.abeUnified){
   burger.dataset.abeUnified="1";burger.setAttribute("aria-controls","abe-site-menu");
   burger.addEventListener("click",function(e){e.preventDefault();e.stopImmediatePropagation();let open=menu.classList.toggle("is-open");burger.setAttribute("aria-expanded",String(open));menu.setAttribute("aria-hidden",String(!open));document.documentElement.style.overflow=open?"hidden":""});
   document.addEventListener("keydown",e=>{if(e.key==="Escape"){menu.classList.remove("is-open");burger.setAttribute("aria-expanded","false");document.documentElement.style.overflow=""}});
 }
 if(!menu.classList.contains("is-open"))menu.setAttribute("aria-hidden","true");
}
function footer(){document.querySelectorAll(".cgft-cols").forEach(nav=>{if(nav.dataset.abeUnified)return;
 const anchors=[...nav.querySelectorAll("a")];for(const a of anchors){
   const u=new URL(a.href,location.href);if(u.pathname==="/pricing")a.href="/products";
   if(u.pathname==="/blog")a.href="/insights";
 }
 nav.dataset.abeUnified="1";});}
function motion(){
 const els=[...document.querySelectorAll(".abex [data-abe-reveal]")];if(!("IntersectionObserver" in window)||matchMedia("(prefers-reduced-motion: reduce)").matches){els.forEach(e=>e.classList.add("visible"));return}
 const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target)}}),{threshold:.09,rootMargin:"0px 0px -28px 0px"});
 els.forEach(e=>obs.observe(e));
 document.querySelectorAll(".abex-card").forEach(card=>{if(card.dataset.tilt)return;card.dataset.tilt="1";
 card.addEventListener("pointermove",e=>{if(e.pointerType==="touch")return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.setProperty("--tiltx",(-y*2.7)+"deg");card.style.setProperty("--tilty",(x*3.4)+"deg")});
 card.addEventListener("pointerleave",()=>{card.style.setProperty("--tiltx","0deg");card.style.setProperty("--tilty","0deg")});
 });}
let updating=false;function update(){if(updating)return;updating=true;requestAnimationFrame(()=>{updating=false;updateHeader();footer();motion()})}
document.addEventListener("DOMContentLoaded",update);update();
const mo=new MutationObserver(update);mo.observe(document.documentElement,{subtree:true,childList:true});
const wipe=document.createElement("div");wipe.id="abex-transition";wipe.setAttribute("aria-hidden","true");document.body.appendChild(wipe);
document.addEventListener("click",function(e){
 if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
 const a=e.target.closest&&e.target.closest("a[href]");if(!a||a.target&&a.target!=="_self"||a.hasAttribute("download"))return;
 const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname===location.pathname&&u.search===location.search)return;
 e.preventDefault();e.stopImmediatePropagation();wipe.classList.add("show");setTimeout(()=>location.assign(u.href),210);
},true);
window.addEventListener("pageshow",()=>wipe.classList.remove("show"));
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
