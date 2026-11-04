"use client";
import Link from "next/link";
import Image from "next/image";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";
import {ArrowUpRight,Menu,X} from "lucide-react";
const links=[["Services","/services"],["Work","/work"],["Process","/process"],["Products","/products"],["Programs","/programs"],["Team","/team"],["Insights","/insights"],["About","/about"]] as const;
export function Logo(){return <Link href="/" aria-label="ABE TechLab home" className="abe-brand"><Image src="/brand/abe-techlab-mark-dark.svg" alt="" width={42} height={35} unoptimized/><span>ABE TechLab</span></Link>}
export function Header(){
 const [open,setOpen]=useState(false);
 const path=usePathname();
 useEffect(()=>{setOpen(false)},[path]);
 useEffect(()=>{const close=(e:KeyboardEvent)=>{if(e.key==="Escape")setOpen(false)};document.addEventListener("keydown",close);return()=>document.removeEventListener("keydown",close)},[]);
 return <header className="abe-header">
  <div className="abe-header-inner"><Logo/>
   <nav aria-label="Main navigation" className="abe-desktop-nav">{links.map(([name,href],i)=><Link key={href} href={href} aria-current={path===href||path.startsWith(href+"/")?"page":undefined}><span className="abe-nav-index">{String(i+1).padStart(2,"0")}</span>{name}</Link>)}</nav>
   <Link href="/contact" className="abe-header-cta">Start a project <ArrowUpRight size={15}/></Link>
   <button type="button" className="abe-menu-toggle" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="abe-mobile-nav" onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
  </div>
  {open&&<nav id="abe-mobile-nav" className="abe-mobile-nav" aria-label="Mobile navigation">{links.map(([name,href],i)=><Link key={href} href={href}><span>{String(i+1).padStart(2,"0")}</span>{name}<ArrowUpRight size={17}/></Link>)}<Link href="/contact" className="abe-mobile-cta">Start a project <ArrowUpRight size={18}/></Link></nav>}
 </header>;
}
