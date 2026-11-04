import Link from "next/link";
import {ArrowUpRight} from "lucide-react";
import {Logo} from "./Header";
const columns=[
 {title:"Explore",items:[["Services","/services"],["Selected Work","/work"],["Our Process","/process"],["About","/about"]]},
 {title:"Studio",items:[["Products","/products"],["Programs","/programs"],["Team","/team"],["Insights","/insights"]]},
 {title:"Connect",items:[["Start a project","/contact"],["Email us","mailto:abeayo6@gmail.com"],["GitHub","https://github.com/ABE-TechLab"]]},
 {title:"Legal",items:[["Privacy","/privacy"],["Terms","/terms"],["Cookies","/cookies"]]}
];
export function Footer(){return <footer className="abe-footer">
 <div className="abe-footer-marquee" aria-hidden="true">Ideas into systems<span>✳</span> Systems into impact<span>✳</span></div>
 <div className="abe-wrap">
 <div className="abe-footer-heading"><div><p className="abe-eyebrow">Have a product in mind?</p><h2>Let&apos;s build <em>something useful.</em></h2></div><Link href="/contact" className="abe-primary-link">Start a project <ArrowUpRight size={20}/></Link></div>
 <div className="abe-footer-grid"><div className="abe-footer-description"><Logo/><p>Research · Product strategy · Product marketing · Design · Development · Delivery</p><a href="mailto:abeayo6@gmail.com">abeayo6@gmail.com</a></div>{columns.map(column=><div key={column.title}><h3>{column.title}</h3><ul>{column.items.map(([label,href])=><li key={href}><Link href={href}>{label}</Link></li>)}</ul></div>)}</div>
 <div className="abe-footer-bottom"><span>© {new Date().getFullYear()} ABE TechLab</span><span>Nigeria · Working globally</span><Link href="/">Back to top ↑</Link></div>
 </div></footer>}
