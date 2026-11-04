/**
 * The ABE Next.js app and its APIs remain the host. Only compatible marketing
 * routes are rewritten to the published visual template. Legacy template links
 * are redirected to actual ABE routes. The special contact experience stays in Next.
 */
const visuals = [["/contact","/abe-rendered/contact/index.html"],["/products","/abe-rendered/products/index.html"],["/programs","/abe-rendered/programs/index.html"],["/team","/abe-rendered/team/index.html"],["/insights","/abe-rendered/insights/index.html"],["/insights/:slug","/abe-rendered/insights/:slug/index.html"],["/work/maka-integrated","/abe-rendered/work/maka-integrated/index.html"],["/work/cyfamod","/abe-rendered/work/cyfamod/index.html"],["/privacy","/abe-rendered/privacy/index.html"],["/terms","/abe-rendered/terms/index.html"],["/cookies","/abe-rendered/cookies/index.html"]].concat([
 ["/","/template/index.html"],
 ["/about","/template/about/index.html"],
 ["/services","/template/services/index.html"],
 ["/services/product-development","/template/services/web-apps/index.html"],
 ["/services/mobile-development","/template/services/mobile-apps/index.html"],
 ["/services/research-marketing","/template/services/ai-features/index.html"],
 ["/services/product-design","/template/services/product-design/index.html"],
 ["/services/product-delivery","/template/services/cloud-devops/index.html"],
 ["/services/product-strategy","/template/services/dedicated-teams/index.html"],
 ["/work","/template/work/index.html"],
 ["/work/waste2light","/template/work/wayfare/index.html"],
 ["/work/bumars","/template/work/pulse/index.html"],
 ["/work/future-speakers","/template/work/ledgerly/index.html"],
 ["/process","/template/process/index.html"],
]);
const legacyRedirects = [
 ["/pricing","/products"],
 ["/blog","/insights"],
 ["/blog/ai-features-that-ship","/insights/what-to-validate-before-building-an-mvp"],
 ["/blog/how-much-does-an-mvp-cost","/insights/what-to-validate-before-building-an-mvp"],
 ["/blog/two-week-sprints","/insights/how-we-approach-product-strategy"],
 ["/work/wayfare","/work/waste2light"],
 ["/work/pulse","/work/bumars"],
 ["/work/ledgerly","/work/future-speakers"],
 ["/work/carehub","/work/maka-integrated"],
 ["/work/stockroom","/work/cyfamod"],
 ["/services/web-apps","/services/product-development"],
 ["/services/mobile-apps","/services/mobile-development"],
 ["/services/ai-features","/services/research-marketing"],
 ["/services/cloud-devops","/services/product-delivery"],
 ["/services/dedicated-teams","/services/product-strategy"],
];
const nextConfig = {
  async rewrites(){return {beforeFiles:visuals.map(([source,destination])=>({source,destination}))};},
  async redirects(){return legacyRedirects.map(([source,destination])=>({source,destination,permanent:false}));}
};
export default nextConfig;
