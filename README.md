<div align="center">

# 🧪 ABE TechLab

### A product studio for practical technology, systems, and experimentation.

<p>
<img src="https://img.shields.io/badge/status-building-111827" alt="Building">
<img src="https://img.shields.io/badge/license-proprietary-7c3aed" alt="Proprietary license">
<img src="https://img.shields.io/badge/focus-products%20%7C%20systems%20%7C%20AI-0f766e" alt="Products, systems, and AI">
</p>

**Turning ideas into products, internal systems, and useful technology.**

</div>

---

## 🧭 What is ABE TechLab?

ABE TechLab is the technology lab and product-studio layer behind a growing portfolio of software products, experiments, automation systems, and infrastructure work.

<table>
<tr><td width="33%" align="center">

### 🧱 Products
Build and validate real software products.

</td><td width="33%" align="center">

### ⚙️ Systems
Create internal tools and operational infrastructure.

</td><td width="33%" align="center">

### 🧠 Intelligence
Apply Artificial Intelligence (AI), automation, and research to practical problems.

</td></tr>
</table>

## 🔗 Product ecosystem

```mermaid
graph TD
    A[ABE TechLab] --> B[Product Development]
    A --> C[Internal Operations]
    A --> D[Research & Experiments]
    B --> E[SAYRR]
    B --> F[Proqurement]
    B --> G[MortgageOps]
    B --> H[TechTrack]
    B --> I[OHealth+]
    C --> J[Operations Platform]
    D --> K[Cloud Infrastructure]
    D --> L[Developer Tools]
```

<details open>
<summary><strong>🧩 Working principles</strong></summary>

- Build from a clear product problem.
- Separate product truth from prototype appearance.
- Document architecture before complexity grows.
- Prefer measurable, testable foundations.
- Treat security and operational reliability as product concerns.

</details>

## 🛠️ Technology landscape

JavaScript · TypeScript · React · Next.js · Node.js · Python · PostgreSQL · Supabase · Vercel · GitHub · Figma

## 📚 Repository purpose

This repository acts as the public-facing technology-lab workspace and documentation surface. Individual product repositories contain their own implementation details.

## 🔐 Ownership

ABE TechLab materials and software are proprietary unless a repository explicitly states another license. See [`LICENSE`](./LICENSE) for the terms applying to this repository.


## Current website architecture

The public site is authored from the Framer source snapshots in `public/template/`. The build transforms the content and brands them with `scripts/abe-migrate-content.mjs`, generates missing pages with `scripts/abe-generate-pages.mjs`, and reuses actual Framer hero/blog structures through `scripts/abe-template-mirror.mjs`. The `next.config.mjs` rewrites public routes to this HTML. Next.js App Router is retained only for API endpoints, metadata, and a safe fallback. Do not restore the removed Next.js marketing layouts.

The earlier iframe-based audio shell was removed because it could cover the whole page on authenticated previews. Page loading and regular navigation do not depend on framing. The audio control retains the on/off preference but seamless sound across full-document navigation is not guaranteed until a tested single-document router is introduced.
