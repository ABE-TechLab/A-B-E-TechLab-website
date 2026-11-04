# ABE TechLab — unified UI migration

## Branding
Source: ABE-TechLab/Branding, brands/abe-techlab/brand.json.
Working palette: lemon green #A7E021; charcoal #111111; off-white #F9F9F6.
SVG marks copied from the branding repository. The working brand package remains in review/approval pending.

## Pages
Captured Framer UI: home, about, services/service details, work and three selected cases.
Rebuilt in matching Framer-inspired studio UI: Contact, Insights, individual Insight articles, Products, Programs, Team, two additional Work details, Privacy, Terms and Cookies.
Real content: original five ABE portfolio projects, five core services, TechTrack programmes and products, ten original ABE articles, Ayo Richard ABE and ARIA (AI system).
Demo pricing redirects to ABE Products. Demo blog articles redirect to original ABE Insights.

## Functional parity
Original desktop contact fields and original mobile four-step form are preserved, and still POST to /api/contact.
Resend confirmation, Google Apps Script intake, Operations integration, and assistant API routes are unchanged.
Original connected assistant is available on Next-backed pages; a client-side bridge provides it on captured Framer pages.
Ambient piano popup and toggle appear on both kinds of pages; music needs a user click and working browser/YouTube audio support.
Public Framer HTML/runtime content is transformed by scripts/abe-migrate-content.mjs before build.

## Pre-production checks
Review real browser behavior: visual responsiveness, Framer hydration and animations, SPA route handoff, the contact flow, assistant and optional piano playback.
Validate licensing/accuracy of template-origin decorative imagery and media; images are not authenticated as real client screenshots.
Run an authorised non-production contact submission to verify external services. No synthetic lead submitted.
Draft PR remains preview-only until acceptance. Live production has not been changed.
Original Next API source and Git history remain available for rollback.
