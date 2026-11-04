/* Original Framer hero and blog-component behaviours adapted to ABE data.
 * Motion is progressive; a failed observer never leaves the page blank. */
(function(){
"use strict";
const root=document.querySelector("main.abe-template");if(!root)return;
const reduced=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
const selectors=[
"[data-mirror-reveal]",".cgph-crumbs",".cgph-eb",".cgph-intro",".cgph-facts",".cgph-l>span",".cgpo .cg-hd-i"
].join(",");
const elements=Array.from(root.querySelectorAll(selectors));
if(!reduced&&"IntersectionObserver" in window){
 requestAnimationFrame(()=>{
  document.documentElement.classList.add("abe-mirror-ready");
  const watcher=new IntersectionObserver(list=>{for(const item of list)if(item.isIntersecting){
    item.target.classList.add("abe-shown");watcher.unobserve(item.target);
  }},{threshold:.055,rootMargin:"0px 0px -8% 0px"});
  elements.forEach(el=>watcher.observe(el));
  // Earlier builds incorrectly hid animated sections indefinitely on error.
  setTimeout(()=>elements.forEach(el=>el.classList.add("abe-shown")),7000);
 });
}else{elements.forEach(el=>el.classList.add("abe-shown"))}
root.addEventListener("click",event=>{
 const btn=event.target.closest("[data-mirror-filter]");if(!btn)return;
 const cat=btn.dataset.mirrorFilter;
 const section=btn.closest(".cgbl");if(!section)return;
 for(const chip of section.querySelectorAll("[data-mirror-filter]")){
  chip.setAttribute("aria-pressed",String(chip===btn));chip.classList.toggle("is-on",chip===btn);
 }
 let count=0;
 for(const item of section.querySelectorAll("[data-abe-topic]")){
  item.hidden=cat!=="All"&&item.dataset.abeTopic!==cat;
  if(!item.hidden)count++;
 }
 section.setAttribute("data-showing",String(count));
});
const canvases=Array.from(root.querySelectorAll(".cgph-cv"));
for(const canvas of canvases){
 const ctx=canvas.getContext("2d");if(!ctx)continue;
 let w=0,h=0,mouse={x:.5,y:.5},frame=0;
 function resize(){const r=canvas.getBoundingClientRect();w=Math.round(r.width);h=Math.round(r.height);if(w&&h){canvas.width=Math.floor(w*Math.min(devicePixelRatio,2));canvas.height=Math.floor(h*Math.min(devicePixelRatio,2));ctx.setTransform(canvas.width/w,0,0,canvas.height/h,0,0)}}
 function draw(){
  if(!w||!h)return;
  ctx.clearRect(0,0,w,h);
  const sz=Math.max(34,Math.min(70,w/20));
  for(let y=sz/2;y<h;y+=sz)for(let x=sz/2;x<w;x+=sz){
   const dx=x-w*mouse.x,dy=y-h*mouse.y,d=Math.hypot(dx,dy);
   const energy=Math.max(0,1-d/250);
   ctx.fillStyle="rgba(167,224,33,"+(.045+energy*.22).toFixed(3)+")";
   const size=energy*4+1.5;ctx.fillRect(x-size/2,y-size/2,size,size);
  }
 }
 canvas.addEventListener("pointermove",e=>{
  const r=canvas.getBoundingClientRect();mouse={x:(e.clientX-r.left)/Math.max(r.width,1),y:(e.clientY-r.top)/Math.max(r.height,1)};
  if(!reduced)draw();
 });
 if("ResizeObserver" in window)new ResizeObserver(()=>{resize();draw()}).observe(canvas);
 else window.addEventListener("resize",()=>{resize();draw()});
 resize();draw();
}
// Keep the article's original progress bar meaningful.
for(const post of root.querySelectorAll(".cgpo")){
 const bar=post.querySelector(".cgpo-prog>span");if(!bar)continue;
 function update(){const box=post.getBoundingClientRect();const total=Math.max(1,post.scrollHeight-innerHeight);let progress=Math.max(0,Math.min(1,-box.top/total));bar.style.width=(progress*100).toFixed(2)+"%";}
 window.addEventListener("scroll",update,{passive:true});update();
}
})();
