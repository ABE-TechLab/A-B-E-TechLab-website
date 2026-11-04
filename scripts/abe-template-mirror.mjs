/**
 * Native Framer component mirroring for added ABE routes.
 * The copied sections below come directly from the new Blog template:
 * .cgph (hero), .cgbl (listing/cards), .cgpo (article).
 * Reuses their CSS, breakpoints and markup instead of recreating their look.
 * Content and article data come from the existing ABE repo.
 */
import {readFile,writeFile,readdir} from "node:fs/promises";
import {join} from "node:path";
import ts from "typescript";
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
function parse(v){
 if(!v)return null;
 if(ts.isAsExpression(v)||ts.isSatisfiesExpression(v)||ts.isParenthesizedExpression(v))return parse(v.expression);
 if(ts.isStringLiteral(v)||ts.isNoSubstitutionTemplateLiteral(v))return v.text;
 if(ts.isArrayLiteralExpression(v))return v.elements.map(parse);
 if(ts.isObjectLiteralExpression(v)){let o={};for(let p of v.properties)if(ts.isPropertyAssignment(p))o[p.name.text??p.name.getText()]=parse(p.initializer);return o}
 return null;
}
async function variable(file,name){
 const raw=await readFile(file,"utf8"),src=ts.createSourceFile(file,raw,ts.ScriptTarget.Latest,true);
 for(const n of src.statements)if(ts.isVariableStatement(n))for(const d of n.declarationList.declarations)if(d.name.getText(src)===name)return parse(d.initializer);
 throw Error("Variable "+name+" missing in "+file);
}
const [blog,post]=await Promise.all([readFile("public/template/blog/index.html","utf8"),readFile("public/template/blog/how-much-does-an-mvp-cost/index.html","utf8")]);
const heroRefs=[...blog.matchAll(/<section class="cg cg-dark cgph[\s\S]*?<\/section>/g)].map(x=>x[0]);
const listRefs=[...blog.matchAll(/<section class="cg cgbl[\s\S]*?<\/section>/g)].map(x=>x[0]);
const postRefs=[...post.matchAll(/<div class="cg cgpo(?: is-ph| is-tab)?"[\s\S]*?<\/div><\/div><\/div>/g)].map(x=>x[0]);
if(heroRefs.length!==3||listRefs.length!==3||postRefs.length!==3)throw Error("Source Framer template changed unexpectedly");
const resp=[["",1200],["is-ph",390],["is-tab",810]];
function heroData(label,one,two,description,facts){
 return heroRefs.map((h,i)=>{
   h=h.replace(/(<nav class="cgph-crumbs"[\s\S]*?<span aria-current="page">)[\s\S]*?(<\/span>)/,(_,a,b)=>a+esc(label)+b)
     .replace(/(<p class="cgph-eb"[^>]*><i[^>]*><\/i>)[\s\S]*?(<\/p>)/,(_,a,b)=>a+"["+String(facts.index||"00").padStart(2,"0")+"] "+esc(label)+b)
     .replace(/(<h1 class="cgph-h1"[^>]*aria-label=")[^"]*(")/,(_,a,b)=>a+esc(one+" "+two.replace(/<[^>]+>/g,""))+b);
   let line=0;
   h=h.replace(/(<span class="cgph-l" aria-hidden="true"><span[^>]*>)[\s\S]*?(<\/span><\/span>)/g,(_,a,b)=>a+(line++===0?esc(one):two)+b);
   h=h.replace(/(<p class="cgph-intro"[^>]*>)[\s\S]*?(<\/p>)/,(_,a,b)=>a+esc(description)+b);
   let fact=0;h=h.replace(/(<dt[^>]*>)[\s\S]*?(<\/dt>[\s\S]*?<dd[^>]*>)[\s\S]*?(<\/dd>)/g,(_,a,b,c)=>{let p=(facts.items||[])[fact++]||["ABE","TechLab"];return a+esc(p[0])+b+esc(p[1])+c});
   return h;
 }).join("");
}
const miniArrow='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
const artAssets=["/images/techtrack.svg","/images/portfolio-platform.svg","/brand/abe-techlab-mark-dark.svg","/images/procurement.svg","/brand/abe-techlab-mark-light.svg"];
function editorialCard(item,index,big){
 let title=esc(item.title||item.name);
 let cat=esc(item.category||item.type||"ABE TechLab");
 let date=item.publishedAt?new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(item.publishedAt)):"";
 let asset=item.image||artAssets[index%artAssets.length];
 const image='<span class="cgbl-cov" style="aspect-ratio:'+(big?"16/10":"4/3")+'"><span class="abe-editorial-art" aria-hidden="true"><span class="abe-editorial-grid"></span><img src="'+esc(asset)+'" alt="" loading="lazy" decoding="async"><span class="abe-editorial-label">ABE TECHLAB / '+String(index+1).padStart(2,"0")+'</span></span></span>';
 const meta='<span class="cgbl-meta" style="font-family:var(--cg-font-m,JetBrains Mono),monospace"><b>'+cat+'</b><span>'+esc(item.readTime||item.status||item.type||"Studio work")+'</span>'+(date?'<span>'+date+'</span>':"")+'</span>';
 return '<a href="'+esc(item.href)+'" class="cgbl-card'+(big?" is-big":"")+'" data-abe-topic="'+esc(item.filter||item.category||"All")+'" data-mirror-reveal style="opacity:0;translate:0 30px;transition:opacity .65s ease '+(120+(index%8)*65)+'ms, translate 1s cubic-bezier(.2,.8,.2,1) '+(120+(index%8)*65)+'ms">'+image+'<span class="cgbl-txt">'+meta+
  '<strong style="font-family:var(--cg-font-d,Archivo),Arial,sans-serif;font-weight:700;font-style:normal"><span>'+title+'</span></strong><span class="cgbl-sum">'+esc(item.excerpt||item.description)+'</span><span class="cgbl-go" style="font-family:var(--cg-font-m,JetBrains Mono),monospace">'+esc(item.action||"Explore")+'<i aria-hidden="true">'+miniArrow+'</i></span></span></a>';
}
function blogList(items,cats){
 return listRefs.map((r,j)=>{
   let start=r.slice(0,r.indexOf("</style>")+8);
   const count=items.length;
   const tabs=cats.map((c,i)=>{
    let n=c==="All"?count:items.filter(x=>(x.filter||x.category)===c).length;
    return '<button type="button" data-mirror-filter="'+esc(c)+'" aria-pressed="'+String(i===0)+'"'+(i===0?' class="is-on"':'')+'>'+esc(c)+'<sup>'+n+'</sup></button>';
   }).join("");
   let featured=editorialCard(items[0],0,true);
   let rest=items.slice(1).map((x,i)=>editorialCard(x,i+1,false)).join("");
   return start+'<div class="cgbl-w"><div class="cgbl-chips" role="group" aria-label="Filter by topic" data-mirror-reveal>'+tabs+'</div>'+
     featured+'<div class="cgbl-grid" style="--n:2">'+rest+'</div></div></section>';
 }).join("");
}
function injectMain(html,newMain){
 const needle=/<main id="main" class="abex">[\s\S]*?<\/main>/;
 if(!needle.test(html))throw Error("Generated page main not found");
 return html.replace(needle,'<main id="main" class="abe-template">'+newMain+'</main>');
}
async function update(route,markup){
 const file=join("public/abe-rendered",route,"index.html");
 const html=await readFile(file,"utf8");
 let result=injectMain(html,markup);
 if(!result.includes("/abe-template-mirror.js"))result=result.replace("</body>",'<script defer src="/abe-template-mirror.js"></script><script defer src="/abe-persistent-shell.js"></script></body>');
 await writeFile(file,result);
}
const products=await variable("app/products/page.tsx","products");
const programs=await variable("app/programs/page.tsx","programs");
const team=await variable("data/team.ts","team");
const projects=await variable("data/content.ts","projects");
const entries=(await readdir("lib/insights/articles")).filter(x=>x.endsWith(".ts"));
const articles=(await Promise.all(entries.map(x=>variable(join("lib/insights/articles",x),"article")))).sort((a,b)=>String(b.publishedAt).localeCompare(a.publishedAt));
const insightsItems=articles.map(a=>({...a,href:"/insights/"+a.slug,action:"Read the note"}));
await update("insights",heroData("Insights","Notes from","our <em class='cgph-acc'>studio.</em>","Research, product thinking and technology insights from ABE TechLab.",{index:7,items:[["articles",String(articles.length)],["topics","4"],["perspective","Research-led"]]})+blogList(insightsItems,["All","Research","Product","Technology","Perspectives"]));
await update("products",heroData("Products","Products with","<em class='cgph-acc'>purpose.</em>","Practical products developed by ABE TechLab in learning, professional identity and recruitment.",{index:5,items:[["products",String(products.length)],["focus","Users first"],["work","Research-led"]]})+blogList(products.map(p=>({title:p.name,excerpt:p.description,category:p.category,status:p.status,href:p.href,action:p.cta,image:p.name==="TechTrack"?"/images/techtrack.svg":p.name==="Portfolio Platform"?"/images/portfolio-platform.svg":"/brand/abe-techlab-mark-dark.svg"})),["All","Education technology","Professional identity technology","Recruitment technology"]));
await update("programs",heroData("Programs","Learn by","<em class='cgph-acc'>doing.</em>","TechTrack learning, bootcamps, internships, kids and future practical technology programmes.",{index:4,items:[["programmes",String(programs.length)],["powered by","TechTrack"],["focus","Hands-on"]]})+blogList(programs.map(p=>({title:p.name,excerpt:p.description,category:p.type,filter:p.type,href:p.id?"/programs#"+p.id:"/contact",action:p.id?"Explore Kids":"Ask about the programme",image:"/images/techtrack.svg"})),["All",...programs.map(p=>p.type)])+
 '<section class="abe-mirror-kids" id="techtrack-kids"><div class="cgbl-w"><p class="abex-kicker">TechTrack Kids</p><h2>Young minds. <em>Real projects.</em></h2><p>Explore practical coding, AI literacy and creativity through hands-on challenges.</p><a href="/contact" class="abex-button">Ask about TechTrack Kids ↗</a></div></section>');
// Keep Team as a direct route from About, but remove from the primary navigation.
await update("team",heroData("Team","People behind","<em class='cgph-acc'>the work.</em>","Human leadership and AI-assisted research supporting the studio.",{index:6,items:[["Human","Leadership"],["AI","Research partner"],["work","Collaborative"]]})+blogList(team.map((m,i)=>({title:m.name,excerpt:m.bio,category:m.type,filter:m.type,status:m.role,href:"/contact",action:"Connect with us",image:m.photo?.src||"/brand/abe-techlab-mark-dark.svg"})),["All","Human","AI"]));
for(const p of projects.filter(x=>["Maka Integrated","Cyfamod Technologies"].includes(x.name))){
 const slug=p.name==="Maka Integrated"?"maka-integrated":"cyfamod";
 const sibling=projects.filter(x=>x.name!==p.name).slice(0,4).map(x=>({title:x.name,excerpt:x.description,category:x.category,href:"/work",action:"View selected work"}));
 await update("work/"+slug,heroData("Selected Work",p.name==="Maka Integrated"?"Maka Integrated":"Cyfamod","<em class='cgph-acc'>Technologies.</em>",p.description,{index:2,items:[["work","Product"],["focus","Strategy"],["project","Collaboration"]]})+blogList(sibling,["All"]));
}
const POST_START=postRefs.map(p=>p.slice(0,p.indexOf("</style>")+8));
function postContent(a,j){
 return POST_START.map((start,i)=>{
  const words=a.title.split(/\s+/).map((w,k)=>'<span class="cg-hd-w"><span class="cg-hd-i" style="transition-delay:'+(150+k*40)+'ms;--pd:'+(650+k*40)+'ms">'+esc(w)+'</span> </span>').join("");
  const date=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(a.publishedAt));
  let related=articles.filter(x=>x.slug!==a.slug&&x.category===a.category).slice(0,3);
  const slug="/insights/"+a.slug;
  return start+'<span class="cgpo-prog" aria-hidden="true"><span></span></span>'+
   '<header class="cgpo-w cgpo-head"><nav class="cgpo-cr" aria-label="Breadcrumb" data-mirror-reveal><ol><li><a href="/">Home</a></li><li><a href="/insights">Insights</a></li><li><span aria-current="page">'+esc(a.category)+'</span></li></ol></nav>'+
   '<h1 class="cg-hd" aria-label="'+esc(a.title)+'" style="font-family:var(--cg-font-d,Archivo),Arial,sans-serif;font-weight:700;font-size:clamp(40px,4.4vw,72px);line-height:.98;max-width:1180px;margin-top:22px"><span class="cg-hd-l" aria-hidden="true">'+words+'</span></h1>'+
   '<div class="cgpo-meta" data-mirror-reveal><em>'+esc(a.category)+'</em><span>'+date+'</span><span>'+esc(a.readTime)+'</span><span class="cgpo-by">By '+esc(a.author)+'</span></div>'+
   '<p class="cgpo-sum" data-mirror-reveal>'+esc(a.excerpt)+'</p></header>'+
   '<div class="cgpo-w"><div class="cgpo-cover"><div class="abe-editorial-art abe-editorial-wide" aria-hidden="true"><span class="abe-editorial-grid"></span><img src="/brand/abe-techlab-mark-light.svg" alt=""><span class="abe-editorial-label">ABE TECHLAB / INSIGHTS</span></div></div></div>'+
   '<div class="cgpo-w cgpo-grid"><div class="cgpo-art"><div class="cg-md">'+a.content.map((p,index)=>'<p data-mirror-reveal>'+esc(p)+'</p>').join("")+'</div></div>'+
   '<aside class="cgpo-side"><div class="cgpo-card"><p>Written by</p><div class="cgpo-au"><span><b>'+esc(a.author)+'</b><em>Research · Product · Technology</em></span></div><p class="cgpo-bio">Perspectives from ABE TechLab, based on practical product work and research.</p><p>Explore</p><a href="/insights">← All insights</a></div></aside></div>'+
   '<div class="cgpo-w cgpo-more"><div class="cgpo-mh"><h2>Keep reading</h2><a href="/insights">All insights ↗</a></div><div class="cgpo-mg">'+related.map((x,k)=>'<a href="/insights/'+esc(x.slug)+'" class="abe-related-note"><span>'+esc(x.category)+'</span><strong>'+esc(x.title)+'</strong><i>Read article ↗</i></a>').join("")+'</div></div></div>';
 }).join("");
}
for(const a of articles)await update("insights/"+a.slug,postContent(a));
console.log("ABE native component mirror: Blog/Insights, all articles, Products, Programs, Team and extra work pages updated.");
