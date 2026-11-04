/* Bridge for captured Framer routes that must use the original Next.js app. */
(function(){
 "use strict";
 var nextPages=/^\/(?:contact|products|programs|team|insights(?:\/.*)?|privacy|terms|cookies)(?:\/)?$/;
 var nextCases=/^\/work\/(?:maka-integrated|cyfamod)(?:\/)?$/;
 function update(){
   document.querySelectorAll('nav.cghd-nav a[href], .cghd-mobile a[href], .cghd a[href]').forEach(function(a){
     var path;try{path=new URL(a.href,location.origin).pathname;}catch{return;}
     var label=path==="/products"?"Products":path==="/insights"?"Insights":path==="/process"?"Programs":null;
     if(path==="/process")a.href="/programs";
     if(label){
       var texts=Array.from(a.childNodes).filter(function(n){return n.nodeType===3&&n.textContent.trim();});
       var last=texts[texts.length-1];
       if(last&&last.textContent.trim()!==label)last.textContent=label;
       else if(!last)a.querySelectorAll('.cg-l1,.cg-l2').forEach(function(n){if(n.textContent.trim()!==label)n.textContent=label;});
     }
   });
   var footer=document.querySelector("footer.cgft");
   if(footer&&!footer.querySelector(".abe-extra-links")){
     var bar=document.createElement("nav");bar.className="abe-extra-links";bar.setAttribute("aria-label","More ABE TechLab pages");
     bar.style.cssText="display:flex;flex-wrap:wrap;gap:18px;padding:18px 24px;border-top:1px solid rgba(255,255,255,.16);font-size:12px;";
     [["Products","/products"],["Programs","/programs"],["Team","/team"],["Insights","/insights"]].forEach(function(pair){
       var a=document.createElement("a");a.href=pair[1];a.textContent=pair[0];a.style.color="inherit";bar.appendChild(a);
     });footer.appendChild(bar);
   }
 }
 document.addEventListener("click",function(event){
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
   var a=event.target&&event.target.closest&&event.target.closest("a[href]");
   if(!a||a.hasAttribute("download")||(a.target&&a.target!=="_self"))return;
   var u;try{u=new URL(a.href,location.href)}catch{return}
   if(u.origin!==location.origin)return;
   if(nextPages.test(u.pathname)||nextCases.test(u.pathname)){
     event.preventDefault();event.stopImmediatePropagation();location.assign(u.href);
   }
 },true);
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",update);else update();
 var queued=false;
 new MutationObserver(function(){
   if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;update()});
 }).observe(document.documentElement,{childList:true,subtree:true});
})();
