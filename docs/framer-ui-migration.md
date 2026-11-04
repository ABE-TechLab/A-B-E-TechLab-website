# ABE TechLab — UI and page mapping

## Implemented
The existing Next.js application remains the host. The Framer snapshot provides the visual and animation runtime for selected marketing pages. The migration script updates its published HTML and JS copy at build time, while ABE's APIs and other Next pages stay in place.

| Old ABE content | New route | Mapping |
| --- | --- | --- |
| Home and studio mission | / | Captured Framer homepage with ABE content |
| Five services | /services and /services/* | Strategy, research/marketing, product design, product development, delivery, plus digital platform work |
| Selected work | /work | Five verified projects from data/content.ts |
| Waste2Light | /work/waste2light | Cloned case layout with product-development description |
| BuMarS | /work/bumars | Cloned case layout with construction product description |
| Future Speakers International School | /work/future-speakers | Cloned case layout with school-technology description |
| Maka Integrated | /work/maka-integrated | Real ABE project-detail page from data/content.ts |
| Cyfamod Technologies | /work/cyfamod | Real ABE project-detail page from data/content.ts |
| ABE story, founder, ARIA | /about, /team | Mapped studio/team copy; team is still original Next page |
| Ten original articles | /insights and /insights/[slug] | Original authoritative article content; sample blog routes redirect |
| TechTrack, Portfolio Platform, MeetMind / Vertica | /products | Original products page |
| TechTrack programmes | /programs | Original programmes page, including Kids showcase |
| Unique ABE contact form | /contact | Existing form, lead submission and assistant follow-up preserved |
| Contact API and assistant APIs | /api/contact and /api/assistant/* | Untouched original Next server routes |
| Legal pages | /privacy, /terms, /cookies | Original ABE pages, not template legal copy |
| Template pricing | /pricing | Redirect to /products, no invented prices exposed as official |

## Build and navigation
- Build: node scripts/abe-migrate-content.mjs && next build.
- Development: node scripts/abe-migrate-content.mjs && next dev.
- The migration touches only public/template HTML and public/assets/runtime MJS files during build; original Next pages remain editable.
- The client bridge public/abe-frontend-bridge.js forces Next-backed routes to load in Next rather than the captured Framer router.
- Existing Vercel project and environment variables remain unchanged.

## Sources of truth
- data/content.ts (services and collaborations)
- data/team.ts (Ayo Richard ABE and ARIA, explicitly marked as AI)
- app/products/page.tsx, app/programs/page.tsx (products and programmes)
- lib/insights (articles)
- app/contact/page.tsx and app/api (actual intake and follow-up workflows)

## Review before merging
- Published Framer HTML/runtime is not the editable Framer source; replace it with authored maintainable components when convenient.
- Images and fonts may still be loaded from reference CDNs. Sample decorative images are not claimed to depict real ABE projects.
- Audit all case imagery, historical milestones, testimonials, pricing details, business claims, mobile layouts, and external social links. The copy bridge neutralises many but does not certify every element as factually accurate.
- The unique contact form is preserved and visually recoloured, but a fully faithful Framer contact redesign still requires a focused UI implementation.
- Preview contact GET should return 405 (POST-only); never send fake customer leads during testing.
- Keep changes in this PR until responsive and functional preview review passes.

## Rollback
Revert the migration commits or remove next.config.mjs rewrites. Original Next page components and APIs remain in the repository.
