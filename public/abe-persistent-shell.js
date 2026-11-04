/*
 * Persistent browsing surface for the ABE TechLab ambient sound.
 *
 * Every Framer snapshot is a separate HTML document, so a normal navigation
 * destroys its audio player. Keeping the content in a same-origin iframe
 * allows the sound controller to stay alive in the top document while each
 * Framer page still receives a fresh native runtime/hydration environment.
 * Only starts for a top-level document. The site is still regular HTML and
 * fully navigable if frame embedding is unavailable or scripting is off.
 */
(function(){
"use strict";
if(window.self!==window.top||window.__abePersistentSite)return;
window.__abePersistentSite=true;
function start(){
 if(!document.body||document.getElementById("abe-persistent-frame"))return;
 const wrap=document.createElement("div");
 wrap.id="abe-persistent-frame";wrap.setAttribute("role","presentation");
 wrap.style.cssText="position:fixed;inset:0;z-index:2147480400;background:#111;width:100%;height:100dvh;overflow:hidden";
 const frame=document.createElement("iframe");
 frame.id="abe-page-frame";frame.title="ABE TechLab website";
 frame.style.cssText="display:block;width:100%;height:100%;border:0;background:#111";
 frame.setAttribute("allow","autoplay");
 frame.setAttribute("referrerpolicy","strict-origin-when-cross-origin");
 frame.src=location.href;
 wrap.appendChild(frame);
 const sound=document.querySelector("[data-abe-piano]");
 if(sound)sound.style.zIndex="2147481000";
 let backNavigation=false;
 let lastFrameURL=location.pathname+location.search+location.hash;
 frame.addEventListener("load",()=>{
   let url;try{url=frame.contentWindow.location}catch{
     // If an authentication or external redirect prevents same-origin access,
     // keep the unframed site readable rather than displaying a blank overlay.
     wrap.remove();document.documentElement.classList.remove("abe-persistent-active");return;
   }
   if(url.origin!==location.origin)return;
   const relative=url.pathname+url.search+url.hash;
   lastFrameURL=relative;
   if(backNavigation){backNavigation=false;return}
   const top=location.pathname+location.search+location.hash;
   if(relative!==top){history.pushState({abe:"site"},"",relative)}
 });
 window.addEventListener("popstate",()=>{
   const target=location.pathname+location.search+location.hash;
   if(target===lastFrameURL)return;
   backNavigation=true;
   frame.src=location.href;
 });
 document.documentElement.classList.add("abe-persistent-active");
 document.body.style.overflow="hidden";
 for(const child of Array.from(document.body.children)){
   if(child===wrap||child===sound||child.tagName==="SCRIPT")continue;
   child.setAttribute("aria-hidden","true");
 }
 document.body.appendChild(wrap);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
else start();
})();
