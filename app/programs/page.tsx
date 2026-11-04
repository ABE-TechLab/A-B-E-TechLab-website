import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import TechTrackKidsShowcase from "@/components/TechTrackKidsShowcase";
export const metadata:Metadata={title:"Programs | TechTrack",description:"Practical technology programmes from ABE TechLab: TechTrack Learn, Bootcamp, Internship, Kids and future learning experiences.",alternates:{canonical:"/programs"}};
const programs=[
 {number:"01",name:"TechTrack Learn",type:"Practical technology learning",description:"Structured learning for people building practical technology skills through guided lessons, projects and continuous development."},
 {number:"02",name:"TechTrack Bootcamp",type:"Intensive, cohort-based learning",description:"Technology programmes built around structured learning, practical tasks, projects, guided development and delivery."},
 {number:"03",name:"TechTrack Internship",type:"Learning through product work",description:"Experiences that connect learning to real product work, documentation, collaboration and practical delivery."},
 {number:"04",name:"TechTrack Kids",type:"Technology for the next generation",description:"A practical technology experience for children and teenagers to explore AI, coding, creativity and real-world projects.",id:"techtrack-kids"},
 {number:"05",name:"Future Technology Programmes",type:"Programmes in development",description:"Further bootcamps, workshops, fellowships and technology learning experiences shaped around emerging needs."}
];
export default function ProgramsPage(){return <div className="abe-page">
 <section className="abe-hero"><div className="abe-wrap"><p className="abe-eyebrow"><span className="abe-dot"/> Learning / TechTrack</p><h1>Learn by <em>doing.</em></h1><p className="abe-hero-sub">Technology programmes that connect practical learning, real projects and skill development through TechTrack and future ABE TechLab experiences.</p><div className="abe-hero-rule"><span>Learn / Bootcamp / Internship / Kids</span><span>Practical technology education</span></div></div></section>
 <section className="abe-section"><div className="abe-wrap"><div className="abe-section-heading" style={{marginBottom:20}}><h2>Programmes for <span style={{color:"#789e21"}}>builders.</span></h2><p>Learn, practice, collaborate and grow through programmes shaped around real technology work.</p></div>
 {programs.map(item=><article id={item.id} key={item.number} className="abe-feature-line" style={{scrollMarginTop:90,gridTemplateColumns:"65px minmax(0,1fr) 35px"}}>
  <strong>{item.number} /</strong><div><p className="abe-eyebrow">{item.type}</p><h2 style={{marginTop:10}}>{item.name}</h2><p>{item.description}</p>{item.id==="techtrack-kids"&&<div className="abe-kids-detail"><TechTrackKidsShowcase/></div>}</div><ArrowUpRight size={21}/>
 </article>)}
 </div></section>
 <section className="abe-section abe-section-dark"><div className="abe-wrap abe-lead"><p className="abe-eyebrow" style={{color:"#A7E021"}}>Powered by TechTrack</p><div><h2>A digital layer for <span style={{color:"#A7E021"}}>real learning.</span></h2><p style={{marginTop:22,color:"#c7c7c0"}}>TechTrack helps organise structured learning, bootcamps and internship experiences while ABE TechLab shapes the product and programmes around the people using them.</p><Link className="abe-primary-link" href="/products" style={{marginTop:30}}>Explore our products <ArrowUpRight size={18}/></Link></div></div></section>
 </div>}
