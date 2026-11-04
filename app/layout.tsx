import type { Metadata } from "next";
import { absoluteUrl, siteEmail, siteName, siteUrl } from "@/lib/site";

/** Public pages are rendered from the Framer template; App Router supplies APIs and fallback. */
export const metadata: Metadata = {
 metadataBase: new URL(siteUrl),
 title: "ABE TechLab | Product, Research & Technology",
 description: "ABE TechLab researches, shapes, designs and develops useful digital products.",
 openGraph: { title: "ABE TechLab", description: "Product research, strategy, design and development.", type: "website", url: siteUrl },
 alternates: { canonical: siteUrl }
};
const schema = { "@context": "https://schema.org", "@type": "Organization", name: siteName, url: siteUrl, email: siteEmail, "@id": absoluteUrl("#organization") };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
 return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>{children}</body></html>;
}
