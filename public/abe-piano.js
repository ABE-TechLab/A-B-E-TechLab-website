/* ABE TechLab ambient piano. Works on static Framer and Next pages.
 * Requires an explicit click to start audio; no autoplay or global click hijacking.
 */
(function(){
  "use strict";
  if(window.__abePianoLoaded)return;
  window.__abePianoLoaded=true;
  var KEY="abe-techlab-sound-enabled";
  var VIDEO="OKiDwD9kToQ";
  var enabled=false,ready=false,player=null,loading=false;
  var saved;
  try{saved=localStorage.getItem(KEY)}catch{saved=null}
  var css=document.createElement("style");css.textContent=[
    ".abe-piano{position:fixed;right:18px;bottom:18px;z-index:2147481000;font-family:Archivo,Inter,Arial,sans-serif;color:#111}",
    ".abe-piano button{font:inherit;cursor:pointer}",
    ".abe-piano-switch{display:flex;align-items:center;gap:10px;background:#111;color:#f9f9f6!important;border:1px solid #333;padding:12px 16px;border-radius:3px;font-size:12px;font-weight:700;box-shadow:0 10px 30px #0003}",
    ".abe-piano-switch:hover,.abe-piano-switch:focus-visible{border-color:#A7E021;outline-color:#A7E021}",
    ".abe-piano-note{color:#A7E021;font-size:16px}",
    ".abe-piano-prompt{position:absolute;right:0;bottom:62px;background:#111;color:#f9f9f6;width:min(310px,calc(100vw - 36px));padding:20px;border:1px solid #545454;box-shadow:0 18px 45px #0004}",
    ".abe-piano-eyebrow{font:700 10px 'JetBrains Mono',monospace;letter-spacing:.15em;color:#A7E021;text-transform:uppercase}",
    ".abe-piano-prompt strong{display:block;margin-top:9px;font-size:17px;color:#f9f9f6}",
    ".abe-piano-prompt p{margin:9px 0 16px;font-size:12px;line-height:1.65;color:#d0d0cb}",
    ".abe-piano-actions{display:flex;gap:9px;flex-wrap:wrap}",
    ".abe-piano-actions button{font-size:12px;font-weight:700;padding:10px 13px;border:1px solid #888;background:#111;color:#f9f9f6}",
    ".abe-piano-actions button:first-child{background:#A7E021;color:#111;border-color:#A7E021}",
    ".abe-piano button:focus-visible{outline:3px solid #A7E021;outline-offset:2px}",
    "@media(max-width:600px){.abe-piano{right:12px;bottom:12px}.abe-piano-switch{padding:10px 12px}.abe-piano-prompt{bottom:55px}}"
  ].join("");document.head.appendChild(css);
  var root=document.createElement("div");root.className="abe-piano";root.setAttribute("data-abe-piano","true");
  root.innerHTML='<button class="abe-piano-switch" type="button" aria-label="Ambient piano settings" aria-expanded="false"><span aria-hidden="true" class="abe-piano-note">♫</span><span class="abe-piano-state">Sound off</span></button><div class="abe-piano-prompt" role="group" aria-label="Ambient piano controls" hidden><span class="abe-piano-eyebrow">ABE TECHLAB · AMBIENCE</span><strong>Ambient piano</strong><p>Would you like gentle background piano while you browse? You can stop it anytime.</p><div class="abe-piano-actions"><button type="button" data-action="play">Play piano</button><button type="button" data-action="dismiss">Not now</button></div></div>';
  document.body.appendChild(root);
  var toggle=root.querySelector(".abe-piano-switch");
  var prompt=root.querySelector(".abe-piano-prompt");
  var state=root.querySelector(".abe-piano-state");
  var playBtn=root.querySelector('[data-action="play"]');
  var dismiss=root.querySelector('[data-action="dismiss"]');
  function save(v){try{localStorage.setItem(KEY,v)}catch{}}
  function show(show){prompt.hidden=!show;toggle.setAttribute("aria-expanded",String(show));}
  function refresh(){state.textContent=enabled?"Sound on":"Sound off";toggle.setAttribute("aria-label",enabled?"Pause ambient piano":"Play ambient piano");}
  function pause(){enabled=false;save("off");if(player&&player.pauseVideo)player.pauseVideo();refresh();show(false)}
  function start(){
    enabled=true;save("on");refresh();show(false);
    if(ready&&player){try{player.playVideo()}catch{}return}
    if(loading)return;
    loading=true;
    var host=document.createElement("div");host.id="abe-piano-player";host.setAttribute("aria-hidden","true");host.style.cssText="position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;pointer-events:none";document.body.appendChild(host);
    var previous=window.onYouTubeIframeAPIReady;
    function init(){
      if(!window.YT||!window.YT.Player)return;
      player=new window.YT.Player(host,{videoId:VIDEO,playerVars:{autoplay:0,controls:0,loop:1,playlist:VIDEO,playsinline:1,rel:0},events:{
        onReady:function(){ready=true;player.setVolume(18);if(enabled)player.playVideo();},
        onError:function(){enabled=false;refresh();show(true);prompt.querySelector("p").textContent="Audio could not load. You can try again.";loading=false;}
      }});
    }
    window.onYouTubeIframeAPIReady=function(){if(typeof previous==="function")previous();init()};
    if(window.YT&&window.YT.Player)init();
    else{var script=document.createElement("script");script.src="https://www.youtube.com/iframe_api";script.async=true;script.onerror=function(){loading=false;enabled=false;refresh();show(true);};document.body.appendChild(script)}
  }
  toggle.addEventListener("click",function(){if(enabled)pause();else start()});
  playBtn.addEventListener("click",start);
  dismiss.addEventListener("click",function(){save("off");show(false)});
  refresh();
  if(saved===null)show(true);
  else if(saved==="on"){prompt.querySelector("p").textContent="Tap Play piano to resume your preferred background sound.";show(true)}
})();
