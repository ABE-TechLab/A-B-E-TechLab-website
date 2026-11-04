import type {MetadataRoute} from "next";
import {insights} from "@/lib/insights";
import {absoluteUrl} from "@/lib/site";
const routes=[
 "", "/about","/services","/services/product-strategy","/services/research-marketing",
 "/services/product-design","/services/product-development","/services/mobile-development",
 "/services/product-delivery","/work","/work/waste2light","/work/bumars",
 "/work/future-speakers","/work/maka-integrated","/work/cyfamod",
 "/process","/products","/programs","/team","/insights","/contact",
 "/privacy","/terms","/cookies"
];
export default function sitemap():MetadataRoute.Sitemap{
 const pages=routes.map(route=>({
  url:absoluteUrl(route),
  lastModified:new Date(),
  changeFrequency:route===""?"weekly" as const:"monthly" as const,
  priority:route===""?1:route==="/privacy"||route==="/terms"||route==="/cookies"?0.2:route.startsWith("/work/")||route.startsWith("/services/")?0.6:0.7
 }));
 const articles=insights.map(article=>({
  url:absoluteUrl("/insights/"+article.slug),
  lastModified:new Date(article.updatedAt||article.publishedAt),
  changeFrequency:"monthly" as const,
  priority:0.6
 }));
 return [...pages,...articles];
}
