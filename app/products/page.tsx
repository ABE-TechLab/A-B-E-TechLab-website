import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
export const metadata:Metadata={title:"Products | ABE TechLab",description:"Discover TechTrack, Portfolio Platform and MeetMind / Vertica, products developed under ABE TechLab.",alternates:{canonical:"/products"}};
const products=[
 {number:"01",name:"TechTrack",category:"Education technology",status:"Active product",description:"A practical learning and development platform connecting courses, bootcamps, internships and technology programmes in a coherent learning experience.",href:"/programs",cta:"Explore the programmes",work:["Structured learning","Bootcamps","Internships","Technology education"]},
 {number:"02",name:"Portfolio Platform",category:"Professional identity technology",status:"In development",description:"A product system for building professional identities, portfolios and career-focused profiles through a shareable destination.",href:"/contact",cta:"Ask about the product",work:["Professional profiles","Digital identity","Portfolio creation"]},
 {number:"03",name:"MeetMind / Vertica",category:"Recruitment technology",status:"In development",description:"AI-assisted recruitment technology exploring structured interviews, candidate participation and evaluation workflows.",href:"/contact",cta:"Discuss the direction",work:["Structured interviews","Recruitment workflows","AI-assisted evaluation"]}
];
export default function ProductsPage(){return <div className="abe-page">
 <section className="abe-hero"><div className="abe-wrap"><p className="abe-eyebrow"><span className="abe-dot"/> Studio-owned products</p><h1>Things we <em>create.</em></h1><p className="abe-hero-sub">Products built and developed under ABE TechLab. Client collaborations live separately in Selected Work.</p><div className="abe-hero-rule"><span>Education / Identity / Recruitment</span><span>{products.length} product directions</span></div></div></section>
 <section className="abe-section"><div className="abe-wrap"><div className="abe-section-heading" style={{marginBottom:34}}><h2>Product <span style={{color:"#789e21"}}>portfolio.</span></h2><p>Technology designed around user problems and practical delivery, not just interfaces.</p></div>
 <div className="abe-grid">{products.map(p=><article key={p.name} className="abe-card" style={{minHeight:370}}>
  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:18}}><span className="abe-card-label">{p.number} / {p.category}</span><span className="abe-chip" style={{fontSize:9}}>{p.status}</span></div>
  <h2 style={{fontSize:"clamp(35px,4.5vw,66px)",marginTop:37}}>{p.name}</h2><p style={{fontSize:15,maxWidth:650}}>{p.description}</p>
  <div className="abe-tags">{p.work.map(x=><span className="abe-tag" key={x}>{x}</span>)}</div>
  <div className="abe-card-bottom"><Link href={p.href} style={{display:"inline-flex",alignItems:"center",gap:12}}>{p.cta} <ArrowUpRight size={20}/></Link><span>{p.status}</span></div>
 </article>)}</div></div></section>
 <section className="abe-section abe-section-dark"><div className="abe-wrap abe-lead"><p className="abe-eyebrow" style={{color:"#A7E021"}}>Product philosophy / ABE TechLab</p><div><h2>Research first. <span style={{color:"#A7E021"}}>Technology with purpose.</span></h2><p style={{color:"#c6c6c0",marginTop:26}}>Our product work connects discovery, research, strategy, product positioning, design and development. We build systems to serve people, not just to ship features.</p><Link className="abe-primary-link" href="/insights" style={{marginTop:32}}>Read our insights <ArrowUpRight size={18}/></Link></div></div></section>
 </div>}
