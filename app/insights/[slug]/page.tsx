import type {Metadata} from "next";
import Link from "next/link";
import {ArrowUpRight,ArrowLeft} from "lucide-react";
import {notFound} from "next/navigation";
import {insights,getInsight,getRelatedInsights} from "@/lib/insights";
import {absoluteUrl} from "@/lib/site";
export function generateStaticParams(){return insights.map(item=>({slug:item.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;const item=getInsight(slug);if(!item)return{};
 return {title:item.title,description:item.excerpt,alternates:{canonical:"/insights/"+slug},openGraph:{title:item.title,description:item.excerpt,type:"article",publishedTime:item.publishedAt,authors:[item.author]}};
}
export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;const article=getInsight(slug);if(!article)notFound();
 const related=getRelatedInsights(article,3);
 const date=new Intl.DateTimeFormat("en-NG",{day:"numeric",month:"long",year:"numeric"}).format(new Date(article.updatedAt||article.publishedAt));
 const structured={"@context":"https://schema.org","@type":"Article",headline:article.title,description:article.excerpt,datePublished:article.publishedAt,dateModified:article.updatedAt||article.publishedAt,mainEntityOfPage:absoluteUrl("/insights/"+slug),author:{"@type":"Organization",name:article.author},publisher:{"@type":"Organization",name:"ABE TechLab"}};
 return <div className="abe-page abe-article-detail">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured)}}/>
  <section className="abe-hero"><div className="abe-wrap">
   <Link href="/insights" className="abe-back"><ArrowLeft size={15}/> All insights</Link>
   <p className="abe-eyebrow" style={{marginTop:60}}><span className="abe-dot"/> {article.category} / {article.readTime}</p>
   <h1>{article.title}</h1><p className="abe-hero-sub">{article.excerpt}</p>
   <div className="abe-hero-rule"><span>By {article.author}</span><span>{date}</span></div>
  </div></section>
  <section className="abe-section"><div className="abe-wrap">
   <div className="abe-prose">{article.content.map((p,i)=><p key={i}>{p}</p>)}</div>
   {article.relatedPaths?.length? <div className="abe-prose" style={{marginTop:70,paddingTop:25,borderTop:"1px solid #ccc"}}><p className="abe-eyebrow" style={{margin:0}}>Related ABE work</p><div className="abe-chips" style={{marginTop:18}}>{article.relatedPaths.map(path=><Link key={path} className="abe-chip" href={path}>{path==="/work"?"Selected Work":path.replace("/","").replaceAll("-"," ")||"Home"} ↗</Link>)}</div></div>:null}
  </div></section>
  <section className="abe-section abe-article-related"><div className="abe-wrap">
   <div className="abe-section-heading" style={{marginBottom:32}}><h2>Keep <span style={{color:"#82a921"}}>reading.</span></h2><Link className="abe-back" style={{color:"#111"}} href="/insights">All insights <ArrowUpRight size={16}/></Link></div>
   <div className="abe-grid abe-grid-3">{related.map(item=><Link key={item.slug} href={"/insights/"+item.slug} className="abe-card"><span className="abe-card-label">{item.category}</span><h3>{item.title}</h3><p>{item.excerpt}</p><div className="abe-card-bottom"><span>{item.readTime}</span><ArrowUpRight size={22}/></div></Link>)}</div>
  </div></section>
 </div>
}
