/**
 * Build-time local-link and action integrity audit for the published Framer site.
 * Runs after content replacement and page generation, before Next build.
 */
import {readdir,readFile} from "node:fs/promises";
import {join} from "node:path";
import config from "../next.config.mjs";
const rewrites=await config.rewrites();
const redirects=await config.redirects();
const rules=[...(rewrites.beforeFiles||[]),...redirects];
const allowStatic=["/robots.txt","/sitemap.xml","/favicon.ico"];
function pattern(path){
 return new RegExp("^"+path.split("/").map(part=>{
  if(part.startsWith(":"))return "[^/]+";
  return part.replace(/[.*+?^$(){}|[\]\\]/g,"\\$&");
 }).join("/")+"/?$");
}
const known=rules.map(r=>({path:r.source,re:pattern(r.source)}));
function isKnown(href){return allowStatic.includes(href)||known.some(r=>r.re.test(href))}
async function findHtml(dir){
 const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){
  const file=join(dir,entry.name);
  if(entry.isDirectory())result.push(...await findHtml(file));
  else if(entry.isFile()&&entry.name.endsWith(".html"))result.push(file);
 }return result;
}
const files=[...await findHtml("public/template"),...await findHtml("public/abe-rendered")];
if(files.length<30)throw Error("Unexpectedly few published pages: "+files.length);
const errors=[];
let links=0,buttons=0,forms=0;
for(const file of files){
 const html=await readFile(file,"utf8");
 const anchorRx=/<a\b[^>]*\bhref=(["'])(.*?)\1[^>]*>/gi;
 for(const match of html.matchAll(anchorRx)){
  links++;
  const href=match[2],tag=match[0];
  if(!href||/^\s*javascript:/i.test(href))errors.push(file+": invalid anchor "+href);
  if(href==="#"&&!/cghd-skip|cg-quiet/.test(tag))errors.push(file+": nonfunctional # anchor "+tag.slice(0,100));
  if(href.startsWith("/")){
   const pathname=href.split("#")[0].split("?")[0]||"/";
   if(!isKnown(pathname))errors.push(file+": missing local page "+pathname);
  }
 }
 buttons+=(html.match(/<button\b/gi)||[]).length;
 if(html.includes('data-mirror-filter=')&&!html.includes('src="/abe-template-mirror.js"'))errors.push(file+": filter has no handler");
 if(html.includes('data-abe-contact')){
  forms++;
  for(const field of ["name","email","phone","company","need","timeline","message","preferred_channel"]){
   if(!html.includes('name="'+field+'"'))errors.push(file+": lost contact field "+field);
  }
  if(!html.includes('src="/abe-unified.js"'))errors.push(file+": missing form handler");
 }
 if(html.includes('src="/abe-persistent-shell.js"'))errors.push(file+": iframe shell present");
 if(html.includes('class="cghd-nav"')){
  const nav=html.match(/<nav class="cghd-nav"[\s\S]*?<\/nav>/)?.[0]||"";
  for(const route of ["/services","/work","/process","/programs","/products","/about","/insights"])
   if(!nav.includes('href="'+route+'"'))errors.push(file+": main nav missing "+route);
  if(nav.includes('href="/team"'))errors.push(file+": Team restored to main nav");
 }
}
if(forms!==1)errors.push("Expected exactly one generated contact form, got "+forms);
if(errors.length)throw Error("ABE navigation audit failed:\n"+[...new Set(errors)].slice(0,30).join("\n"));
console.log("ABE link/action audit: "+files.length+" HTML pages, "+links+" anchors and "+buttons+" buttons checked; contact contract and nav OK.");
