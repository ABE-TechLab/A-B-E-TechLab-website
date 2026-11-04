/**
 * Build-time publishing adapter. Every ABE public page is rendered inside the
 * SAME cloned Framer header/footer, visual tokens and animation system.
 * Existing Next API routes remain the source of truth for lead intake.
 * No fake Framer clients, pricing or testimonials are copied to new pages.
 */
import {readFile,writeFile,readdir,mkdir} from "node:fs/promises";
import {join,dirname} from "node:path";
import ts from "typescript";

const escape=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const value=n=>{
 if(!n)return null;if(ts.isAsExpression(n)||ts.isSatisfiesExpression(n)||ts.isParenthesizedExpression(n))return value(n.expression);
 if(ts.isStringLiteral(n)||ts.isNoSubstitutionTemplateLiteral(n))return n.text;
 if(ts.isNumericLiteral(n))return Number(n.text);
 if(n.kind===ts.SyntaxKind.TrueKeyword)return true;if(n.kind===ts.SyntaxKind.FalseKeyword)return false;
 if(ts.isArrayLiteralExpression(n))return n.elements.map(value);
 if(ts.isObjectLiteralExpression(n)){const o={};for(const p of n.properties)if(ts.isPropertyAssignment(p)){const k=p.name.text??p.name.getText().replace(/^["']|["']$/g,"");o[k]=value(p.initializer)}return o}
 return null;
};
async function readVariable(file,name){
 const text=await readFile(file,"utf8");
 const tree=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,file.endsWith(".tsx")?ts.ScriptKind.TSX:ts.ScriptKind.TS);
 for(const node of tree.statements)if(ts.isVariableStatement(node))for(const decl of node.declarationList.declarations)if(decl.name.getText(tree)===name)return value(decl.initializer);
 throw Error("Missing "+name+" in "+file);
}
async function discover(folder){let out=[];for(const ent of await readdir(folder,{withFileTypes:true})){let path=join(folder,ent.name);if(ent.isDirectory())out.push(...await discover(path));else if(ent.isFile()&&path.endsWith("index.html"))out.push(path)}return out}

const cloned=await readFile("public/template/contact/index.html","utf8");
const destinations=[["Services","/services"],["Work","/work"],["Process","/process"],["Programs","/programs"],["Products","/products"],["About","/about"],["Insights","/insights"]];
const primaryNav='<nav class="cghd-nav" aria-label="ABE TechLab primary navigation"><ul style="font-family:var(--cg-font-m,JetBrains Mono),monospace">'+destinations.map(([name,url],i)=>'<li><a href="'+url+'"><span class="cghd-n">'+String(i+1).padStart(2,"0")+'</span>'+name+'</a></li>').join("")+'</ul></nav>';
const useUnifiedNav=markup=>markup.replace(/<nav class="cghd-nav"[\s\S]*?<\/nav>/,primaryNav);
const header=useUnifiedNav(cloned.match(/<header class="cg cghd[\s\S]*?<\/header>/)?.[0]||"");
const footers=[...cloned.matchAll(/<footer class="cg cg-dark cgft[\s\S]*?<\/footer>/g)].map(x=>x[0]);
if(!header||footers.length!==3)throw Error("Framer shell missing: abort instead of shipping a separate layout");
let sourceHead=cloned.slice(cloned.indexOf("<head>"),cloned.indexOf("</head>")+7)
 .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"")
 .replace(/<link[^>]+rel="modulepreload"[^>]*>/gi,"")
 .replace(/<link[^>]+rel="canonical"[^>]*>/gi,"")
 .replace(/<meta[^>]+(?:property="og:|name="twitter:)[^>]*>/gi,"")
 .replace(/<meta name="description"[^>]*>/gi,"")
 .replace(/<title>[\s\S]*?<\/title>/i,"<title>ABE TechLab</title>");
const footWrap=footers.map((f,i)=>'<div class="abex-footer abex-footer-'+["desktop","tablet","phone"][i]+'">'+f+'</div>').join("");
function page(title,description,main){
 let head=sourceHead.replace("<title>ABE TechLab</title>","<title>"+escape(title)+" | ABE TechLab</title>")
 .replace("</head>",'<meta name="description" content="'+escape(description)+'"><link rel="stylesheet" href="/abe-unified.css"></head>');
 const html='<!doctype html><html lang="en">'+head+'<body><a class="abex-skip" href="#main">Skip to content</a>'+header+'<main id="main" class="abex">'+main+'</main>'+footWrap+
 '<script defer src="/abe-unified.js"></script><script defer src="/abe-piano.js"></script><script defer src="/abe-assistant-static.js"></script></body></html>';
 return html;
}
const hero=(label,title,description,tail="Product research · Strategy · Design · Development")=>
 '<section class="abex-hero"><div class="abex-wrap"><p class="abex-kicker">'+escape(label)+'</p><h1>'+title+'</h1><p class="abex-lede">'+escape(description)+'</p><div class="abex-hero-line"><span>'+escape(tail)+'</span><span>ABE TechLab · Nigeria / Worldwide</span></div></div></section>';
const section=(eyebrow,heading,content,theme="")=>
 '<section class="abex-section '+theme+'"><div class="abex-wrap"><div class="abex-heading" data-abe-reveal><div><p class="abex-kicker">'+escape(eyebrow)+'</p><h2>'+heading+'</h2></div><p>Research-led thinking and purposeful digital experiences.</p></div>'+content+'</div></section>';
const card=(i,meta,title,desc,href,action="Explore")=>
 '<a class="abex-card" data-abe-reveal href="'+escape(href)+'"><span class="num">'+String(i+1).padStart(2,"0")+' / '+escape(meta)+'</span><h3>'+escape(title)+'</h3><p>'+escape(desc)+'</p><div class="foot"><span>'+escape(action)+'</span><span class="arrow" aria-hidden="true">↗</span></div></a>';
const grid=(items,three=false)=>'<div class="abex-grid'+(three?" three":"")+'">'+items.join("")+'</div>';
async function save(route,html){const file=join("public/abe-rendered",route.replace(/^\//,""),"index.html");await mkdir(dirname(file),{recursive:true});await writeFile(file,html);return file;}

const products=await readVariable("data/products.ts","products");
const programs=await readVariable("data/programs.ts","programs");
const team=await readVariable("data/team.ts","team");
const projects=await readVariable("data/content.ts","projects");
const categories=["All","Research","Product","Technology","Perspectives"];
const articleFiles=(await readdir("lib/insights/articles")).filter(f=>f.endsWith(".ts")).sort();
const articles=await Promise.all(articleFiles.map(f=>readVariable(join("lib/insights/articles",f),"article")));
const projectSlugs={"Maka Integrated":"maka-integrated","Cyfamod Technologies":"cyfamod"};

const productMain=hero("01 / Studio products","Products that <em>have a purpose.</em>","We develop practical technology products across learning, professional identity and recruitment.")+
 section("Our products","From ideas to <em>experiences.</em>",grid(products.map((p,i)=>card(i,p.category+" · "+p.status,p.name,p.description,p.href,p.cta))))+
 section("Product thinking","From research to delivery.","<div class='abex-detail' data-abe-reveal><p>Our own products bring together discovery, research, product design, software development and practical learning. We plan for usefulness and improve based on how products are used.</p><p><a class='abex-button' href='/contact'>Discuss a product ↗</a></p></div>","light");
await save("products",page("Products","TechTrack, Portfolio Platform and MeetMind / Vertica.",productMain));

const kidDemo='<div class="abex-table" data-abex-tabs><div class="abex-tabs" aria-label="Explore TechTrack Kids activities">'+
 [["ai","AI & ideas"],["coding","Coding"],["creative","Creativity"]].map((x,i)=>'<button type="button" data-abex-tab="'+x[0]+'" aria-pressed="'+(i===0)+'">'+x[1]+'</button>').join("")+'</div>'+
 [["ai","Investigate how responsible AI tools help us learn and solve problems."],["coding","Plan a simple interactive programme and practice core coding concepts."],["creative","Combine research, design and storytelling in hands-on technology projects."]].map((x,i)=>'<article data-abex-panel="'+x[0]+'"'+(i?' hidden':'')+'><h3>'+({"ai":"Try a new idea","coding":"Build a small project","creative":"Make something original"}[x[0]])+'</h3><p>'+escape(x[1])+'</p></article>').join("")+'</div>';
const programList=programs.map((x,i)=>'<article class="abex-row" data-abe-reveal id="'+escape(x.id||"program-"+(i+1))+'"><span class="count">'+String(i+1).padStart(2,"0")+'</span><div><p class="abex-kicker">'+escape(x.type)+'</p><h3>'+escape(x.name)+'</h3><p>'+escape(x.description)+'</p>'+(x.id==="techtrack-kids"?'<div style="margin-top:28px">'+kidDemo+'</div>':"")+'</div><span aria-hidden="true">↗</span></article>').join("");
await save("programs",page("Programs","TechTrack practical education, bootcamps, internships and Kids programmes.",
 hero("02 / TechTrack learning","Learn through <em>doing.</em>","Practical technology education, workshops, bootcamps and products that connect learning with real work.")+
 section("TechTrack programmes","Explore the <em>pathways.</em>",'<div>'+programList+'</div>',"light")+
 section("Our learning product","TechTrack is <em>built for progress.</em>",'<div class="abex-detail" data-abe-reveal><p>TechTrack supports structured learning, bootcamps, internship experiences and future programmes. Explore our product direction or contact us about a programme.</p><p><a class="abex-button" href="/products">See TechTrack ↗</a></p></div>')));

const teamCards=team.map((x,i)=>{
 const img=x.photo?.src?'<img loading="lazy" src="'+escape(x.photo.src)+'" alt="'+escape(x.photo.alt)+'" style="width:140px;height:150px;object-fit:cover;object-position:top;filter:grayscale(100%);border:1px solid #8a9981;margin-top:24px">':'<div style="margin-top:24px;width:140px;height:150px;background:#A7E021;color:#111;display:grid;place-items:center;font:650 64px Archivo,Arial,sans-serif">AI</div>';
 return '<article class="abex-card" data-abe-reveal><span class="num">'+String(i+1).padStart(2,"0")+' / '+(x.type==="AI"?"AI partner · Not a human": "Human leadership")+'</span>'+img+'<h3 style="margin-top:27px">'+escape(x.name)+'</h3><p><strong>'+escape(x.role)+'</strong></p><p>'+escape(x.bio)+'</p><div class="foot">'+escape(x.note||x.type)+"</div></article>";
});
await save("team",page("Team","Meet the people and AI system supporting ABE TechLab.",
 hero("03 / Our studio","People, purpose <em>and systems.</em>","Human product leadership, AI-assisted research and specialist collaboration as each project needs.")+
 section("The team","Behind the <em>work.</em>",grid(teamCards))+
 section("How we work","We grow with <em>the challenge.</em>",'<div class="abex-detail" data-abe-reveal><p>Research, product strategy, product marketing, design and technology come together in ways that fit the work. Our team profile distinguishes human contributors from AI systems.</p><a class="abex-button" href="/contact">Work with us ↗</a></div>',"light")));

const filters='<div class="abex-tabs" aria-label="Filter insights">'+categories.map((x,i)=>'<button type="button" data-abex-filter="'+x+'" aria-pressed="'+(i===0)+'">'+x+'</button>').join("")+'</div>';
const insightsCards=grid(articles.map((a,i)=>{
 return card(i,a.category+" · "+a.readTime,a.title,a.excerpt,"/insights/"+a.slug,"Read article").replace('class="abex-card"','class="abex-card" data-abex-category="'+escape(a.category)+'"')
}),true);
await save("insights",page("Insights","ABE TechLab articles about product research, strategy and technology.",
 hero("04 / Studio notes","Ideas behind <em>the products.</em>","Perspectives from our research, product thinking, education technology and digital work.")+
 section("Field notes","Read. Think. <em>Build.</em>",filters+insightsCards,"light")));

for(const a of articles){
 const paragraphs=a.content.map(p=>'<p data-abe-reveal>'+escape(p)+'</p>').join("");
 const related=(a.relatedSlugs||[]).map(slug=>articles.find(x=>x.slug===slug)).filter(Boolean).slice(0,3);
 const relatedCards=grid(related.map((x,i)=>card(i,x.category,x.title,x.excerpt,"/insights/"+x.slug,"Read next")),true);
 const articleHtml=hero(a.category+" / "+a.readTime,escape(a.title),a.excerpt,"By "+a.author+" · "+a.publishedAt)+
 '<section class="abex-section light"><div class="abex-wrap"><a href="/insights" class="abex-kicker" style="text-decoration:none">← All insights</a><div class="abex-detail" style="margin-top:45px">'+paragraphs+'</div></div></section>'+
 (related.length?section("Related reading","Keep <em>exploring.</em>",relatedCards):"");
 await save("insights/"+a.slug,page(a.title,a.excerpt,articleHtml));
}

for(const p of projects.filter(x=>projectSlugs[x.name])){
 const slug=projectSlugs[p.name];
 await save("work/"+slug,page(p.name,p.description,
  hero("Selected work / ABE TechLab",escape(p.name),p.description,p.category)+
  section("Project focus","The work and <em>the context.</em>",'<div class="abex-detail" data-abe-reveal><p>'+escape(p.description)+'</p><p>This project is part of ABE TechLab’s existing work and collaborations. We do not publish client metrics, testimonials or results that have not been verified.</p><a class="abex-button" href="/contact">Discuss similar work ↗</a></div>',"light")+
  section("More work","Explore <em>other projects.</em>",grid(projects.filter(x=>x.name!==p.name).slice(0,4).map((x,i)=>card(i,x.category,x.name,x.description,"/work","See selected work"))))));
}

const needs=["New product idea","Website or web application","Product research / strategy","Product marketing / positioning","Product design","Development","Product management","Education / teaching technology","Existing product improvement","Something else"];
const opts=(name,items)=>'<div class="abex-options">'+items.map((x,i)=>'<label><input type="radio" name="'+name+'" value="'+escape(Array.isArray(x)?x[0]:x)+'" required><span>'+escape(Array.isArray(x)?x[1]:x)+'</span></label>').join("")+'</div>';
const field=(name,label,type="text",required=false)=>
 '<label class="abex-field"><span>'+escape(label)+(required?" *":"")+'</span><input type="'+type+'" name="'+name+'"'+(required?" required":"")+' autocomplete="'+(name==="name"?"name":name==="email"?"email":name==="phone"?"tel":name==="company"?"organization":"off")+'"></label>';
const contactForm='<form data-abe-contact aria-label="ABE TechLab enquiry form" data-step="0">'+
 '<div class="abex-step-indicator">Step 1 of 4</div>'+
 '<div class="abex-step active"><h2>First, a little about you.</h2>'+field("name","Your name","text",true)+field("email","Work email","email",true)+field("phone","Phone number (country code)","tel")+field("company","Company / organisation")+'<div class="abex-step-controls"><span></span><button type="button" class="abex-button" data-abex-step-to="next">Next →</button></div></div>'+
 '<div class="abex-step"><h2>What can we help with?</h2><fieldset><legend>Select your main need *</legend>'+opts("need",needs)+'</fieldset><div class="abex-step-controls"><button type="button" class="abex-button" data-abex-step-to="0">← Back</button><button type="button" class="abex-button" data-abex-step-to="next">Next →</button></div></div>'+
 '<div class="abex-step"><h2>Tell us about the work.</h2><label class="abex-field"><span>Expected timeline *</span><select name="timeline" required><option value="">Choose timeline</option>'+["As soon as possible","Within 1–3 months","Within 3–6 months","Exploring / no fixed timeline"].map(x=>'<option>'+escape(x)+'</option>').join("")+'</select></label><label class="abex-field"><span>Project brief *</span><textarea name="message" maxlength="5000" rows="6" placeholder="The idea, problem or outcome..." required></textarea></label><div class="abex-step-controls"><button type="button" class="abex-button" data-abex-step-to="1">← Back</button><button type="button" class="abex-button" data-abex-step-to="next">Next →</button></div></div>'+
 '<div class="abex-step"><h2>Choose your follow-up.</h2><fieldset><legend>Preferred channel *</legend>'+opts("preferred_channel",[["website_chat","Website chat"],["whatsapp","WhatsApp"],["voice_call","Voice call"],["email","Email"]])+'</fieldset><div class="abex-step-controls"><button type="button" class="abex-button" data-abex-step-to="2">← Back</button></div><button type="submit" class="abex-button" style="width:100%;margin-top:20px">Send your enquiry ↗</button></div>'+
 '</form><div id="abex-contact-status" role="status" aria-live="polite" hidden></div>';
const contactBody=hero("05 / Start a project","What are you <em>building?</em>","Tell us about your idea, your research question or your product challenge. You do not need a finished brief to begin.")+
 '<section class="abex-section"><div class="abex-wrap abex-contact-layout"><div data-abe-reveal><p class="abex-kicker">Start a conversation</p><h2 style="font:650 clamp(45px,5vw,73px)/1 Archivo,Arial,sans-serif;letter-spacing:-.07em">Good work starts with <em style="color:#A7E021;font-style:normal">clear questions.</em></h2><p class="abex-lede">Describe what matters. Our team can discuss product research, strategy, marketing, design, development and technology programmes.</p><p style="margin-top:45px"><span class="abex-kicker">Write directly</span></p><a href="mailto:abeayo6@gmail.com" style="font:600 22px Archivo,Arial,sans-serif">abeayo6@gmail.com ↗</a></div>'+
 '<div class="abex-contact-form" data-abe-reveal>'+contactForm+'</div></div></section>';
await save("contact",page("Contact","Contact ABE TechLab for product research, strategy, design, development and education technology.",contactBody));

// Keep the original legal text while presenting it inside the identical shell.
for(const [route,title] of [["privacy","Privacy Policy"],["terms","Terms of Use"],["cookies","Cookie Policy"]]){
 const article=await readFile("data/legal/"+route+".html","utf8");
 if(!article)throw Error("Legal content missing: "+route);
 const content=article.replace(/<h2>/g,'<h2 style="font:600 32px Archivo,Arial,sans-serif;margin:45px 0 16px">').replace(/<\/h2>/g,"</h2>");
 await save(route,page(title,title+" and information from ABE TechLab.",hero("ABE TechLab / Legal",escape(title),"Website policies and information.")+
 '<section class="abex-section light"><div class="abex-wrap"><article class="abex-detail">'+content+'</article></div></section>'));
}

// Keep the original Framer content, animations and UI on the established pages.
// The one global script aligns every captured page's header and links.
for(const file of await discover("public/template")){
 let html=await readFile(file,"utf8");
 html=useUnifiedNav(html);
 if(!html.includes("/abe-unified.css"))html=html.replace("</head>",'<link rel="stylesheet" href="/abe-unified.css"></head>');

 if(!html.includes("/abe-unified.js"))html=html.replace("</body>",'<script defer src="/abe-unified.js"></script></body>');

 await writeFile(file,html);
}
console.log("ABE: all Framer pages unified; built contact, insights, product, programme, team, work and legal pages using the same Framer shell.");
