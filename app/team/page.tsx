import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {ArrowUpRight, Cpu} from "lucide-react";
import {team} from "@/data/team";
export const metadata:Metadata={title:"Team",description:"Meet ABE TechLab founder Ayo Richard ABE and ARIA, an AI research and product partner, plus the studio's approach to collaboration.",alternates:{canonical:"/team"}};
export default function TeamPage(){return <div className="abe-page">
 <section className="abe-hero"><div className="abe-wrap"><p className="abe-eyebrow"><span className="abe-dot"/> People and systems</p><h1>Human thinking. <em>AI-assisted.</em></h1><p className="abe-hero-sub">A product studio combining human leadership with AI-assisted research, strategy and technology. Specialists join collaborations as the work evolves.</p><div className="abe-hero-rule"><span>Leadership / Research / Collaboration</span><span>A growing studio</span></div></div></section>
 <section className="abe-section"><div className="abe-wrap"><div className="abe-section-heading" style={{marginBottom:38}}><h2>Behind the <span style={{color:"#789e21"}}>work.</span></h2><p>Our current studio profile distinguishes human people from AI systems.</p></div>
 <div className="abe-grid">{team.map((member,index)=><article key={member.name} className="abe-card" style={{minHeight:455}}>
  <div style={{display:"flex",alignItems:"start",justifyContent:"space-between",gap:20}}>
   <div style={{width:116,height:116,display:"grid",placeItems:"center",background:"#111",color:"#A7E021",position:"relative",overflow:"hidden"}}>
    {member.photo?<Image src={member.photo.src} alt={member.photo.alt} fill sizes="116px" style={{objectFit:"cover",objectPosition:"top"}}/>:<Cpu size={36} strokeWidth={1.5}/>}
   </div>
   <span className="abe-chip">{member.type==="AI"?"AI system · Not human":"Human team member"}</span>
  </div>
  <p className="abe-card-label" style={{marginTop:25}}>{String(index+1).padStart(2,"0")} / {member.type}</p>
  <h2 style={{marginTop:12}}>{member.name}</h2><strong style={{fontSize:13,letterSpacing:".01em"}}>{member.role}</strong>
  <p style={{marginTop:20}}>{member.bio}</p>{member.note&&<p style={{marginTop:10,fontSize:12}}>{member.note}</p>}
 </article>)}</div>
 </div></section>
 <section className="abe-section abe-section-dark"><div className="abe-wrap abe-lead"><p className="abe-eyebrow" style={{color:"#A7E021"}}>How we collaborate</p><div><h2>A studio that <span style={{color:"#A7E021"}}>grows with the work.</span></h2><p style={{marginTop:25,color:"#cbcbc3"}}>Research, product strategy, marketing, design and technology come together according to each project&apos;s real needs. ABE TechLab works with people and tools to help solve useful problems.</p><Link href="/contact" className="abe-primary-link" style={{marginTop:30}}>Start a project <ArrowUpRight size={17}/></Link></div></div></section>
 </div>}
