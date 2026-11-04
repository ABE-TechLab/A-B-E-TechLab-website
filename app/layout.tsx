import type { Metadata } from "next";
import "./globals.css";
import "./responsive-ui.css";
import "./hero-stack.css";
import "./bridge-theme.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import AmbientPiano from "@/components/AmbientPiano";
import { PageTransition } from "@/components/PageTransition";
import WebsiteAssistant from "@/components/WebsiteAssistant";
import { absoluteUrl, siteEmail, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ABE TechLab | Product, Research, Education & Technology", template: "%s | ABE TechLab" },
  description: "ABE TechLab is a product and technology studio working across product research, strategy, product marketing, design, development, education technology and teaching technology.",
  applicationName: siteName, authors: [{ name: siteName }], creator: siteName, publisher: siteName, category: "technology",
  keywords: ["ABE TechLab", "product strategy", "product research", "market research", "product marketing", "product positioning", "product design", "product development", "education technology", "teaching technology", "learning platforms", "construction technology", "digital products", "technology studio"],
  openGraph: { title: "ABE TechLab | Product, Research, Education & Technology", description: "We research, shape, design, build and position digital products, including technology for learning and teaching.", type: "website", siteName, url: siteUrl, locale: "en_NG" },
  twitter: { card: "summary_large_image", title: "ABE TechLab | Product, Research, Education & Technology", description: "Product research, strategy, marketing, design, development and teaching technology." },
  alternates: { canonical: siteUrl }, robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

const structuredData = { "@context": "https://schema.org", "@graph": [
  { "@type": "Organization", "@id": absoluteUrl("#organization"), name: siteName, url: siteUrl, email: siteEmail, description: "Product and technology studio working across research, strategy, product marketing, design, development, education technology and teaching technology.", founder: { "@id": absoluteUrl("#founder") }, areaServed: "Worldwide", knowsAbout: ["Product research", "Product strategy", "Product marketing", "Product design", "Software development", "Education technology", "Teaching technology"] },
  { "@type": "Person", "@id": absoluteUrl("#founder"), name: "Ayo Richard ABE", worksFor: { "@id": absoluteUrl("#organization") } },
  { "@type": "WebSite", "@id": absoluteUrl("#website"), name: siteName, url: siteUrl, publisher: { "@id": absoluteUrl("#organization") }, inLanguage: "en-NG" }
] };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><PageTransition /><Header /><main>{children}</main><Footer /><AmbientPiano /><WebsiteAssistant /></body></html>;
}
