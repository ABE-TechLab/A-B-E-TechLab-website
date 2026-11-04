/** Preview integration of the published Framer reference into the ABE TechLab Next.js app.
 * The original React pages, API routes and environment settings remain intact.
 * /contact and legal routes deliberately retain their existing functional Next pages.
 */
const templateRoutes = [
  "/",
  "/about",
  "/blog",
  "/blog/ai-features-that-ship",
  "/blog/how-much-does-an-mvp-cost",
  "/blog/two-week-sprints",
  "/pricing",
  "/process",
  "/services",
  "/services/ai-features",
  "/services/cloud-devops",
  "/services/dedicated-teams",
  "/services/mobile-apps",
  "/services/product-design",
  "/services/web-apps",
  "/work",
  "/work/carehub",
  "/work/ledgerly",
  "/work/pulse",
  "/work/stockroom",
  "/work/wayfare"
];

const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: templateRoutes.map((source) => ({
        source,
        destination: `/template${source === "/" ? "" : source}/index.html`,
      })),
    };
  },
};
export default nextConfig;
