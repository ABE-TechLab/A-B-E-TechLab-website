import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {ArrowUpRight,ArrowLeft} from "lucide-react";
import {projects} from "@/data/content";
const cases=[
 {slug:"waste2light",name:"Waste2Light",discipline:"Product development and product management"},
 {slug:"bumars",name:"BuMarS",discipline:"Construction product ecosystem"},
 {slug:"future-speakers",name:"Future Speakers International School",discipline:"Education technology"},
 {slug:"maka-integrated",name:"Maka Integrated",discipline:"Healthcare product strategy and programme management"},
 {slug:"cyfamod",name:"Cyfamod Technologies",discipline:"School management technology"}
] as const;
export function generateStaticParams(){return cases.map(x=>({slug:x.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const item=cases.find(x=>x.slug===slug);if(!item)return{};
 const project=projects.find(x=>x.name===item.name);
 return {title:item.name+" | Selected Work",description:project?.description??item.discipline,alternates:{canonical:"/work/"+slug}};
}
export default async function WorkDetailPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const item=cases.find(x=>x.slug===slug);if(!item)notFound();
 const project=projects.find(x=>x.name===item.name);if(!project)notFound();
 const others=cases.filter(x=>x.slug!==slug);
 return <div className="abe-page">
  <section className="abe-hero"><div className="abe-wrap">
   <Link href="/work" className="abe-back"><ArrowLeft size={15}/> Selected work</Link>
   <p className="abe-eyebrow" style={{marginTop:65}}><span className="abe-dot"/> Studio work / {item.discipline}</p>
   <h1>{project.name}</h1>
   <p className="abe-hero-sub">{project.description}</p>
   <div className="abe-hero-rule"><span>{project.category}</span><span>ABE TechLab / Selected project</span></div>
  </div></section>
  <section className="abe-section"><div className="abe-wrap abe-lead">
   <p className="abe-eyebrow"><span className="abe-dot"/> Our involvement</p>
   <div><h2>{item.discipline}</h2><p style={{marginTop:25}}>{project.description}</p>
    <p style={{marginTop:20,fontSize:13}}>This summary uses ABE TechLab&apos;s existing project records. Specific client outcomes and performance metrics are not asserted without documentation.</p>
    <Link href="/contact" className="abe-primary-link" style={{marginTop:34}}>Discuss a similar project <ArrowUpRight size={18}/></Link>
   </div>
  </div></section>
  <section className="abe-section abe-section-alt"><div className="abe-wrap"><div className="abe-section-heading" style={{marginBottom:32}}><h2>More selected <span style={{color:"#789e21"}}>work.</span></h2></div><div className="abe-grid">{others.map(x=><Link href={"/work/"+x.slug} key={x.slug} className="abe-card" style={{minHeight:240}}><span className="abe-card-label">ABE TechLab / Collaboration</span><h3>{x.name}</h3><div className="abe-card-bottom"><span>{x.discipline}</span><ArrowUpRight size={19}/></div></Link>)}</div></div></section>
 </div>;
}
