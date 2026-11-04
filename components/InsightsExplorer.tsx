"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import type {Insight} from "@/lib/insights/types";
const filters=["All","Research","Product","Technology","Perspectives"] as const;
export default function InsightsExplorer({insights}:{insights:Insight[]}){
 const [selected,setSelected]=useState<(typeof filters)[number]>("All");
 const items=useMemo(()=>insights.filter(x=>selected==="All"||x.category===selected),[insights,selected]);
 return <><div className="abe-chips" style={{marginBottom:34}} aria-label="Filter insights by category">{filters.map(cat=><button className={"abe-chip"+(selected===cat?" abe-chip-active":"")} aria-pressed={selected===cat} key={cat} onClick={()=>setSelected(cat)} type="button">{cat}</button>)}</div>
  <p className="abe-eyebrow" aria-live="polite" style={{marginBottom:20}}>{items.length} {items.length===1?"article":"articles"} / {selected==="All"?"all topics":selected}</p>
  <div className="abe-grid abe-grid-3">{items.map((item,index)=><Link key={item.slug} href={"/insights/"+item.slug} className="abe-card">
    <div style={{display:"flex",justifyContent:"space-between",gap:15}}><span className="abe-card-label">{item.category}</span><span className="abe-card-label">{String(index+1).padStart(2,"0")}</span></div>
    <h2>{item.title}</h2><p>{item.excerpt}</p>
    <div className="abe-card-bottom"><span>{item.readTime}</span><ArrowUpRight size={23}/></div>
  </Link>)}</div></>;
}
