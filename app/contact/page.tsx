"use client";
import {FormEvent,useState} from "react";
import {ArrowUpRight,CheckCircle2} from "lucide-react";
import MobileContactForm from "@/components/MobileContactForm";

const needs=["New product idea","Website or web application","Product research / strategy","Product marketing / positioning","Product design","Development","Product management","Education / teaching technology","Existing product improvement","Something else"];
const channels=[
 {value:"website_chat",label:"Website chat",description:"Continue with the assistant here"},
 {value:"whatsapp",label:"WhatsApp",description:"Continue the conversation in WhatsApp"},
 {value:"voice_call",label:"Voice call",description:"Speak with the AI assistant"},
 {value:"email",label:"Email",description:"Continue the conversation by email"}
];
type ChannelLinks={whatsapp:string|null;call:string|null};
export default function ContactPage(){
 const [sending,setSending]=useState(false);
 const [status,setStatus]=useState<"idle"|"success"|"error">("idle");
 const [error,setError]=useState("");
 const [channel,setChannel]=useState("");
 const [links,setLinks]=useState<ChannelLinks>({whatsapp:null,call:null});
 const [assistantStarted,setAssistantStarted]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(sending)return;
  const form=event.currentTarget;
  const data=Object.fromEntries(new FormData(form).entries());
  const selected=String(data.preferred_channel||"");
  if((selected==="whatsapp"||selected==="voice_call")&&!String(data.phone||"").trim()){
   setStatus("error");setError("Please add your phone number to choose WhatsApp or a voice call.");return;
  }
  setSending(true);setStatus("idle");setError("");
  try{
   const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
   const result=await response.json();
   if(!response.ok)throw new Error(result.error||"We could not deliver the enquiry.");
   const id=String(result.lead_id||"");
   if(id){window.localStorage.setItem("abe_assistant_lead_id",id);window.dispatchEvent(new Event("abe-assistant-context"));}
   setAssistantStarted(Boolean(result.assistant?.started));
   setLinks({whatsapp:result.assistant?.whatsapp??null,call:result.assistant?.call??null});
   setChannel(selected);setStatus("success");form.reset();
   if(selected==="website_chat")window.dispatchEvent(new Event("abe-assistant-open"));
  }catch(err){setStatus("error");setError(err instanceof Error?err.message:"Please try again.");}
  finally{setSending(false);}
 }
 return <div className="abe-page">
  <section className="abe-hero"><div className="abe-wrap">
   <p className="abe-eyebrow"><span className="abe-dot"/> Contact / ABE TechLab</p>
   <h1>What are you <em>building?</em></h1>
   <p className="abe-hero-sub">Tell us about an idea, a research problem, a product or a technology challenge. You do not need a finished brief to begin.</p>
   <div className="abe-hero-rule"><span>Research / Strategy / Design / Development</span><span>Enquiry form ↓</span></div>
  </div></section>
  <section className="abe-section"><div className="abe-wrap abe-contact-grid">
   <aside className="abe-contact-info">
    <p className="abe-eyebrow"><span className="abe-dot"/> Start a conversation</p>
    <h2>Useful products begin with a clear <span style={{color:"#789e21"}}>question.</span></h2>
    <p>Bring the problem or idea. We&apos;ll work out the right next conversation, without asking you to have every detail figured out.</p>
    <div style={{marginTop:38,borderTop:"1px solid #d0d0ca",paddingTop:25}}>
     <p className="abe-eyebrow">What we can discuss</p>
     <div className="abe-tags">{["Product research","Strategy & roadmaps","Product marketing","Design & development","Education technology","Existing software"].map(x=><span className="abe-tag" key={x}>{x}</span>)}</div>
    </div>
    <div style={{marginTop:38,borderTop:"1px solid #d0d0ca",paddingTop:25}}>
     <p className="abe-eyebrow">Write directly</p>
     <a href="mailto:abeayo6@gmail.com" style={{display:"inline-block",marginTop:14,fontSize:20,fontWeight:700,letterSpacing:"-.03em"}}>abeayo6@gmail.com ↗</a>
     <p style={{marginTop:14,fontSize:13}}>Nigeria · Working globally</p>
    </div>
   </aside>
   <div className="abe-contact-contact">
    <div style={{borderBottom:"1px solid #d5d5cd",paddingBottom:22,marginBottom:30,display:"flex",justifyContent:"space-between",gap:16}}>
     <div><p className="abe-eyebrow">New project enquiry</p><h2 style={{font:"800 clamp(26px,3vw,38px)/1.1 var(--abe-display)",letterSpacing:"-.05em",margin:"8px 0 0"}}>Tell us about it.</h2></div>
     <span className="abe-dot" aria-hidden="true"/>
    </div>
    <div className="abe-mobile-form"><MobileContactForm/></div>
    <form className="abe-contact-form abe-desktop-form" aria-busy={sending} onSubmit={submit}>
     <div className="abe-grid" style={{gap:20}}>
      {([["name","Your name","text"],["email","Work email","email"],["phone","Phone number","tel"],["company","Company / organisation","text"]] as const).map(([id,label,type])=><label key={id} className="abe-field"><span>{label}{(id==="name"||id==="email")?" *":""}</span><input id={id} name={id} type={type} required={id==="name"||id==="email"} autoComplete={id==="name"?"name":id==="email"?"email":id==="phone"?"tel":"organization"} placeholder={id==="phone"?"Include country code":""}/></label>)}
     </div>
     <fieldset className="abe-field" style={{border:0,padding:0,margin:0}}><legend>What do you need help with? *</legend><div className="abe-radio-grid">{needs.map(need=><label key={need}><input type="radio" name="need" value={need} required/><span style={{margin:0,color:"#111",textTransform:"none",letterSpacing:0,font:"500 12px var(--abe-display)"}}>{need}</span></label>)}</div></fieldset>
     <label className="abe-field"><span>Expected timeline *</span><select required name="timeline" defaultValue=""><option value="" disabled>Choose a timeline</option>{["As soon as possible","Within 1–3 months","Within 3–6 months","Exploring / no fixed timeline"].map(x=><option key={x}>{x}</option>)}</select></label>
     <label className="abe-field"><span>Tell us about your project *</span><textarea name="message" rows={5} maxLength={5000} required placeholder="What are you looking to build, research or improve?"/></label>
     <fieldset className="abe-field" style={{border:0,padding:0,margin:0}}><legend>How should we continue? *</legend>
      <p className="abe-note" style={{margin:"0 0 14px"}}>Choose how you would like the assistant to continue the conversation.</p>
      <div className="abe-radio-grid">{channels.map(item=><label key={item.value}><input type="radio" name="preferred_channel" value={item.value} required/><span style={{margin:0,color:"#111",textTransform:"none",letterSpacing:0,font:"500 12px var(--abe-display)"}}><strong style={{display:"block",marginBottom:3}}>{item.label}</strong><small>{item.description}</small></span></label>)}</div>
     </fieldset>
     <button type="submit" className="abe-button abe-button-lime" disabled={sending}>{sending?"Sending enquiry…":"Send your enquiry"}<ArrowUpRight size={18}/></button>
    </form>
    <div aria-live="polite" aria-atomic="true">
     {status==="error"&&<div className="abe-message abe-error" role="alert">{error}</div>}
     {status==="success"&&<div className="abe-message" role="status">
      <strong style={{display:"flex",gap:8,alignItems:"center"}}><CheckCircle2 size={18}/> Your enquiry was received.</strong>
      <p>{assistantStarted?"The assistant has started the selected follow-up.":"Your selected follow-up is ready."}</p>
      {channel==="whatsapp"&&(links.whatsapp?<a href={links.whatsapp} target="_blank" rel="noreferrer">Continue on WhatsApp ↗</a>:<p>WhatsApp follow-up is not configured yet.</p>)}
      {channel==="voice_call"&&(links.call?<a href={links.call}>Call the assistant ↗</a>:<p>The assistant phone number is not configured yet.</p>)}
      {channel==="website_chat"&&<p>The assistant window has opened for you.</p>}
      {channel==="email"&&<p>Check your inbox to continue by email.</p>}
     </div>}
    </div>
   </div>
  </div></section>
 </div>;
}
