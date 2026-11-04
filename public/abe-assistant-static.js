/* Small static bridge to ABE TechLab's existing lead-linked assistant APIs. */
(function(){
 "use strict";
 if(window.__abeAssistantLoaded)return;window.__abeAssistantLoaded=true;
 var css=document.createElement("style");css.textContent=[
  ".abe-chat{position:fixed;bottom:19px;left:18px;z-index:2147480999;font-family:Archivo,Inter,Arial,sans-serif;color:#111}",
  ".abe-chat-launch{border:1px solid #A7E021;background:#A7E021;color:#111;display:flex;gap:10px;align-items:center;padding:12px 16px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 9px 26px #0003}",
  ".abe-chat-panel{position:absolute;bottom:55px;left:0;width:min(370px,calc(100vw - 36px));height:min(530px,calc(100dvh - 115px));background:#f9f9f6;border:1px solid #111;box-shadow:0 15px 60px #0004;display:flex;flex-direction:column}",
  ".abe-chat-panel[hidden]{display:none}",
  ".abe-chat-head{background:#111;color:#f9f9f6;padding:16px;display:flex;justify-content:space-between;gap:8px}",
  ".abe-chat-head strong{display:block;font-size:15px;margin-top:4px}.abe-chat-head small{font:700 9px 'JetBrains Mono',monospace;color:#A7E021;letter-spacing:.12em}",
  ".abe-chat-close{border:0;background:transparent;color:white;cursor:pointer;font-size:23px}",
  ".abe-chat-body{flex:1;overflow-y:auto;padding:20px;font-size:13px;line-height:1.6}",
  ".abe-chat-context{padding:8px 16px;font:10px 'JetBrains Mono',monospace;color:#595959;border-bottom:1px solid #ddd}",
  ".abe-chat-msg{margin:0 0 14px;max-width:95%;white-space:pre-wrap;overflow-wrap:anywhere;padding:11px;border:1px solid #d3d3cc}",
  ".abe-chat-msg b{display:block;font-size:10px;margin-bottom:5px;text-transform:uppercase;letter-spacing:.07em}",
  ".abe-chat-msg.client{margin-left:auto;background:#e2edc6;border-color:#bfd977}",
  ".abe-chat-form{display:flex;border-top:1px solid #d0d0ca;padding:10px;gap:6px}.abe-chat-form input{min-width:0;flex:1;padding:11px;border:1px solid #d0d0ca;background:white;font-size:13px;color:#111}.abe-chat-form button{border:0;background:#111;color:#A7E021;padding:0 15px;cursor:pointer}",
  ".abe-chat a{color:#111;text-decoration:underline;text-underline-offset:3px}",
  ".abe-chat :is(button,a,input):focus-visible{outline:3px solid #A7E021;outline-offset:2px}",
  "@media(max-width:600px){.abe-chat{left:12px;bottom:12px}.abe-chat-panel{bottom:55px}}"
 ].join("");document.head.appendChild(css);
 var root=document.createElement("div");root.className="abe-chat";
 root.innerHTML='<button class="abe-chat-launch" type="button">✦ &nbsp; Assistant</button><section class="abe-chat-panel" role="dialog" aria-label="ABE TechLab assistant" hidden><div class="abe-chat-head"><div><small>ABE TECHLAB</small><strong>Client assistant</strong></div><button class="abe-chat-close" type="button" aria-label="Close assistant">×</button></div><div class="abe-chat-context" hidden></div><div class="abe-chat-body" aria-live="polite"></div><form class="abe-chat-form" hidden><input aria-label="Message" placeholder="Your message…"><button type="submit">Send</button></form></section>';
 document.body.appendChild(root);
 var panel=root.querySelector(".abe-chat-panel"),body=root.querySelector(".abe-chat-body"),form=root.querySelector(".abe-chat-form"),field=form.querySelector("input"),context=root.querySelector(".abe-chat-context");
 var lead=null,busy=false;
 function setContent(el,txt){el.textContent=txt}
 function message(sender,txt){var div=document.createElement("div");div.className="abe-chat-msg"+(sender==="client"?" client":"");var b=document.createElement("b");b.textContent=sender==="client"?"You":"ABE assistant";var p=document.createElement("p");p.style.margin="0";p.textContent=txt;div.appendChild(b);div.appendChild(p);body.appendChild(div);body.scrollTop=body.scrollHeight}
 function error(s){message("assistant",s)}
 async function initial(){
   lead=localStorage.getItem("abe_assistant_lead_id");
   body.replaceChildren();
   context.hidden=!lead;form.hidden=!lead;
   if(!lead){var p=document.createElement("p");p.textContent="Begin with a project enquiry so the assistant can keep your conversation connected to the team.";var a=document.createElement("a");a.href="/contact";a.textContent="Start an enquiry →";body.appendChild(p);body.appendChild(a);return}
   context.textContent="Connected enquiry: "+lead.slice(0,8)+"…";
   try{
     var r=await fetch("/api/assistant/chat?lead_id="+encodeURIComponent(lead),{cache:"no-store"}),v=await r.json();
     if(!r.ok)throw Error(v.error||"Assistant unavailable");
     var list=v.messages||[];
     if(list.length){list.forEach(function(x){message(x.sender_type==="client"?"client":"assistant",String(x.content||""))});return}
     r=await fetch("/api/assistant/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lead_id:lead,channel:"website_chat"})});v=await r.json();
     if(r.ok&&v.message)message("assistant",String(v.message.content||""));
     else if(!r.ok)throw Error(v.error||"Assistant unavailable");
   }catch(e){error(e.message||"The assistant is unavailable at the moment.")}
 }
 function open(){panel.hidden=false;initial();root.querySelector(".abe-chat-close").focus()}
 root.querySelector(".abe-chat-launch").addEventListener("click",open);
 root.querySelector(".abe-chat-close").addEventListener("click",function(){panel.hidden=true;root.querySelector(".abe-chat-launch").focus()});
 window.addEventListener("abe-assistant-open",open);
 window.addEventListener("abe-assistant-context",function(){if(!panel.hidden)initial()});
 form.addEventListener("submit",async function(event){
   event.preventDefault();var txt=field.value.trim();if(busy||!lead||!txt)return;
   busy=true;field.disabled=true;message("client",txt);field.value="";
   try{var r=await fetch("/api/assistant/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({lead_id:lead,channel:"website_chat",message:txt})});var j=await r.json();if(!r.ok)throw Error(j.error||"Assistant unavailable");if(j.message)message("assistant",String(j.message.content||""))}
   catch(e){error(e.message||"Unable to send message")}
   finally{busy=false;field.disabled=false;field.focus()}
 });
})();
