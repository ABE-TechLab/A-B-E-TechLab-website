# ABE TechLab — Framer UI migration (preview)

## Purpose
Reuse the **published visual UI and animations** captured in `ABE-TechLab/ideal-bassoon` inside the existing Next.js website, **without deleting ABE TechLab’s functionality, APIs, source pages or Vercel environment variables**.

### Implemented preview routes
- `/` → `/template/index.html`
- `/about` → `/template/about/index.html`
- `/blog` → `/template/blog/index.html`
- `/blog/ai-features-that-ship` → `/template/blog/ai-features-that-ship/index.html`
- `/blog/how-much-does-an-mvp-cost` → `/template/blog/how-much-does-an-mvp-cost/index.html`
- `/blog/two-week-sprints` → `/template/blog/two-week-sprints/index.html`
- `/pricing` → `/template/pricing/index.html`
- `/process` → `/template/process/index.html`
- `/services` → `/template/services/index.html`
- `/services/ai-features` → `/template/services/ai-features/index.html`
- `/services/cloud-devops` → `/template/services/cloud-devops/index.html`
- `/services/dedicated-teams` → `/template/services/dedicated-teams/index.html`
- `/services/mobile-apps` → `/template/services/mobile-apps/index.html`
- `/services/product-design` → `/template/services/product-design/index.html`
- `/services/web-apps` → `/template/services/web-apps/index.html`
- `/work` → `/template/work/index.html`
- `/work/carehub` → `/template/work/carehub/index.html`
- `/work/ledgerly` → `/template/work/ledgerly/index.html`
- `/work/pulse` → `/template/work/pulse/index.html`
- `/work/stockroom` → `/template/work/stockroom/index.html`
- `/work/wayfare` → `/template/work/wayfare/index.html`

### Intentionally preserved Next.js routes
- `/contact` — ABE’s existing custom enquiry form, client-side follow-up flow and server-side operations / confirmation email workflow.
- `/api/contact`, `/api/assistant/chat`, `/api/assistant/channel-links` — **unchanged**. Do not replace with the template form.
- `/privacy`, `/terms`, `/cookies` — retain current ABE legal pages rather than template legal copy.
- `/products`, `/programs`, `/team`, `/insights` and `/insights/[slug]` — preserve the existing ABE content until dedicated template-style pages are authored.

### Content mapping still needed before any production promotion

| Cloned visual section | ABE TechLab content to connect |
| --- | --- |
| Home / hero / calls to action | Existing homepage mission, audiences, and focus areas from `data/content.ts` |
| Services | Product Strategy; Research & Product Marketing; Product Design; Product Development; Product Delivery |
| Work / case studies | Verified work: Waste2Light, BuMarS, Future Speakers International School, Maka Integrated, Cyfamod Technologies |
| Process | ABE's actual research, product management, design and delivery approach |
| Blog | Existing `/insights` articles |
| About / people | ABE TechLab story and `data/team.ts` |
| Products and programmes | Existing `/products` and `/programs` routes |
| Contact | Rebuild the distinctive ABE form visually while keeping its API and assisted follow-up flow |
| Pricing / template metrics | **Unverified placeholder content**; remove/rewrite before publishing |

### Migration mechanics
- `public/template/`: 24 static Framer HTML page captures.
- `public/assets/runtime/`: 53 published animation and interaction JS modules.
- `next.config.mjs`: route rewrites to captured HTML; retained Next app code is not deleted.
- Images and fonts are still referenced from original public CDNs.
- Static snapshots are **not the editable Framer source code** and may be harder to maintain than authored Next components.
- Brand name and customer-facing email were switched to ABE TechLab as an initial preview pass. **That does not constitute a full migration of business copy, claims, case studies, pricing or assets.**
- The original template’s enquiry form is not connected. The live form stays on ABE's Next `/contact` route.
- ABE uses existing Vercel project `a-b-e-tech-lab`; environment variables stay at the Vercel project level. No values are copied into Git.

### Before merge to main / release
1. Preview all 21 routed template pages on desktop and mobile; verify animations, nav and direct-link refreshes.
2. Review every template claim, price, metric, photograph, logo, external link, case study and legal statement; replace unverified material with ABE content.
3. Retheme `/contact` using the template style and test `/api/contact` and assistant follow-up end-to-end.
4. Finish `/products`, `/programs`, `/team` and `/insights` visual mapping.
5. Verify preview Git-triggered deployment after repository transfer from the old organization; test production only after content sign-off.
6. Test direct loads, SEO metadata, accessibility, mobile nav, and CDNs.

### Rollback
Remove `next.config.mjs` rewrites (or revert the migration commit). Original Next pages and APIs remain in Git.
