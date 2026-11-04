import type {Metadata} from "next";
import {insights} from "@/lib/insights";
import InsightsExplorer from "@/components/InsightsExplorer";
export const metadata:Metadata={title:"Insights | ABE TechLab",description:"Original ABE TechLab research, strategy, technology and product articles.",alternates:{canonical:"/insights"}};
export default function InsightsPage(){return <div className="abe-page">
 <section className="abe-hero"><div className="abe-wrap">
  <p className="abe-eyebrow"><span className="abe-dot"/> Studio notes / Research & thinking</p>
  <h1>Ideas behind <em>the products.</em></h1>
  <p className="abe-hero-sub">Notes from our research, product thinking, technology and the problems we work to solve. Written from ABE TechLab&apos;s actual content.</p>
  <div className="abe-hero-rule"><span>Research / Product / Technology / Perspectives</span><span>{insights.length} articles in the archive</span></div>
 </div></section>
 <section className="abe-section"><div className="abe-wrap">
  <div className="abe-section-heading" style={{marginBottom:35}}><div><p className="abe-eyebrow"><span className="abe-dot"/> Field notes</p><h2>Read. Think. <span style={{color:"#82a921"}}>Build.</span></h2></div><p>Practical ideas from product research, teaching technology, market understanding and building digital products.</p></div>
  <InsightsExplorer insights={insights}/>
 </div></section></div>}
