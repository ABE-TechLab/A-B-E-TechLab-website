/**
 * Content bridge between the Codeforge Framer snapshot and the verified ABE TechLab site.
 * This runs before the Next build and edits ONLY checked-in public template snapshots
 * and their published runtime. Do not use fake portfolio/metrics/prices from the demo.
 * Sources: data/content.ts, data/team.ts, lib/insights, /products and /programs.
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const common = [
  ["A software development team for startups and growing companies: web apps, mobile apps and AI features, designed, built and shipped in two-week sprints.", "A product, research and technology studio working across research, strategy, product marketing, design, development and technology education."],
  ["Software development studio", "Product, research & technology studio"],
  ["Now booking Q4 builds · 2 slots left", "Product · Research · Design · Development"],
  ["AUSTIN —", "NIGERIA —"],
  ["1100 S Congress Ave, Austin, TX 78704", "Nigeria · Remote collaborations"],
  ["Mon–Fri 09:00–18:00 CT", "Contact us to arrange a conversation"],
  ["Local time · Austin", "Based in Nigeria"],
  ["Austin, Texas", "Nigeria · Working globally"],
  ["Built in Austin, shipped worldwide", "Built around useful products · Working globally"],
  ["The Austin studio, Friday demo day", "A research-led studio with practical product thinking"],
  ["The Austin studio", "ABE TechLab studio"],
  ["founded in Austin", "focused on useful products"],
  ["Founded 2016", "Research-led studio"],
  ["38 engineers and designers", "Human expertise & AI-assisted research"],
  ["38 people, 140+ products", "Product thinking, research and delivery"],
  ["engineers and designers who build software startups can bet on", "researchers and product builders who turn ideas into practical technology"],
  ["Trusted by *140+* product teams", "Selected product work and collaborations"],
  ["Trusted by 140+ product teams", "Selected product work and collaborations"],
  ["Funded startups and growing companies in travel, health, fintech and retail ship their products with us.", "Selected organisations in education, construction, healthcare and technology work with ABE TechLab on practical digital products."],
  ["A software development team for startups and growing companies", "A product research, design and development studio"],
  ["A full squad of senior engineers, a designer and a product lead who join your roadmap as if they were in-house.", "Product direction, research, requirements and roadmaps shaped around your goals and users."],
  ["Fast, secure web platforms and SaaS products, from the first MVP to the version that serves a million users.", "Web applications, dashboards, platforms and internal tools grounded in real user needs."],
  ["Native-quality iOS and Android apps from one codebase, shipped to the App Store and Google Play.", "Product development and delivery support for useful mobile and digital experiences."],
  ["AI that does real work inside your product: search, assistants, document processing and smart automation.", "User research, market insight, product positioning, messaging and go-to-market planning."],
  ["UX research, interface design and design systems that make complex software feel simple.", "Research-led user flows, wireframes, interfaces and usable product design systems."],
  ["Infrastructure, CI/CD and monitoring so every release is boring, and every outage is short.", "Coordinate delivery, testing and launch so ideas move towards useful products."],
  ["Six teams under one roof: web, mobile, AI, design, cloud and dedicated squads. Pick one, or let us run the whole build.", "Five connected services: product strategy, research and marketing, design, development and product delivery."],
  ["Six teams under one roof, so design, code, AI and cloud ship together.", "Research, strategy, design, development and delivery work together."],
  ["Everything a product needs.", "Research, strategy and technology in one place."],
  ["web, mobile, AI, design, cloud and dedicated squads", "research, strategy, design, development and delivery"],
  ["Web apps", "Product development"],
  ["Web Apps", "Product Development"],
  ["Mobile apps", "Digital platforms"],
  ["Mobile Apps", "Digital Platforms"],
  ["AI features", "Research & marketing"],
  ["AI Features", "Research & Marketing"],
  ["Cloud & DevOps", "Product delivery"],
  ["Cloud &amp; DevOps", "Product delivery"],
  ["Dedicated teams", "Product strategy"],
  ["Dedicated Teams", "Product Strategy"],
  ["What we build", "How we help"],
  ["products shipped", "selected projects"],
  ["product teams", "project collaborators"],
  ["client rating", "product focus"],
  ["average store rating", "design thinking"],
  ["median server response", "research-led direction"],
  ["activation after redesign", "experience-led design"],
  ["uptime across client apps", "delivery and support"],
  ["saved per user each week", "insights into what matters"],
  ["to a working team", "to a clear plan"],
  ["140+", "05"],
  ["4.9/5", "05"],
  ["4.8★", "UX"],
  ["12 ms", "UX"],
  ["99.98%", "QA"],
  ["99.99%", "QA"],
  ["+31%", "UX"],
  ["2 wk", "MVP"],
  ["+38% bookings in 90 days", "Product development & management"],
  ["120k downloads in year one", "Construction product ecosystem"],
  ["9 h saved per accountant weekly", "Education technology & school systems"],
  ["−44% missed appointments", "Healthcare product strategy & support"],
  ["5x peak traffic, zero downtime", "School management technology"],
  ["3x faster checkout", "Product thinking and delivery"],
  ["4.9★ app rating", "Practical product experiences"],
  ["A booking platform that lifts bookings 38%", "Digital product work for Waste2Light"],
  ["A running app with 120k downloads in its first year", "Product work across the BuMarS ecosystem"],
  ["An AI finance dashboard that saves 9 hours a week", "Education technology for Future Speakers"],
  ["A patient app that cut no-shows by 44%", "Healthcare product strategy for Maka Integrated"],
  ["A commerce platform that handles 5x holiday traffic", "School management technology for Cyfamod"],
  ["A new web app for weekend trips: search, dynamic pricing and one-page checkout, rebuilt in twelve weeks.", "Product development and management for Waste2Light, including the Waste2Work billing and customer-management system."],
  ["An iOS and Android app that plans runs, tracks them offline and coaches with AI.", "Product strategy and development across the BuMarS construction ecosystem and procurement experiences."],
  ["Bank feeds, invoice reading and month-end reports in one dashboard, with an assistant that answers finance questions.", "Product strategy and technology work for school operations, teaching and learning at Future Speakers International School."],
  ["Booking, reminders, video visits and secure messaging for a network of 30 clinics.", "Product strategy, programme management and administration supporting Maka Integrated and OHealth+."],
  ["Storefront, inventory and point of sale on one system for a retailer with 18 stores.", "Product management, strategy and development for Cyfamod SMS, a school management platform."],
  ["The old site took nine seconds to load and lost half its visitors at checkout.", "The work focused on turning operational needs into a useful product system."],
  ["A Next.js platform with edge caching, a new search, Stripe checkout and a design system for the marketing team.", "The work included product planning, development and practical digital delivery."],
  ["A founder with a coaching method and no app, and a launch date set by a marathon.", "The team worked on a construction product ecosystem and its digital procurement experience."],
  ["A React Native app with offline GPS tracking, HealthKit sync and an AI coach that adapts the plan each week.", "The work covered product management, delivery and product development for the BuMarS ecosystem."],
  ["Accountants spent Mondays copying numbers between five tools.", "The brief focused on improving school systems and making teaching and learning technology useful."],
  ["A dashboard that reads invoices with AI, reconciles bank feeds and writes the month-end summary for review.", "Product strategy and education technology were aligned with the needs of school operations."],
  ["Phone-only booking and paper reminders meant one visit in five was missed.", "Healthcare platform support requires practical product direction and collaboration."],
  ["A HIPAA-ready patient app and clinic portal with smart reminders, rebooking and video visits.", "The work supports Maka Integrated's product portfolio, including the OHealth+ health platform."],
  ["Online and in-store stock never matched, and the site fell over every Black Friday.", "School management workflows require clear requirements and practical software systems."],
  ["A headless storefront with one inventory service shared by the website, the tills and the warehouse.", "The work covered the Cyfamod SMS school management product."],
  ["The old site took nine seconds to load", "Product requirements were clarified"],
  ["Wayfare", "Waste2Light"],
  ["Pulse", "BuMarS"],
  ["Ledgerly", "Future Speakers International School"],
  ["Carehub", "Maka Integrated"],
  ["Stockroom", "Cyfamod Technologies"],
  ["Northpine", "TechTrack"],
  ["Halcyon", "Portfolio Platform"],
  ["Kitewire", "MeetMind / Vertica"],
  ["Sofia Marchetti", "ABE TechLab"],
  ["Jordan Hale", "ABE TechLab"],
  ["Rahul Mehta", "ABE TechLab"],
  ["Dr. Nia Adeyemi", "ABE TechLab"],
  ["Elena Rossi", "ABE TechLab"],
  ["Hannah Cole", "ABE TechLab"],
  ["David Brooks", "ABE TechLab"],
  ["Aisha Karim", "ARIA"],
  ["Daniel Reyes", "Ayo Richard ABE"],
  ["Tom Becker", "Product development"],
  ["Mei Tanaka", "Product design"],
  ["Founder & CEO", "Founder & CEO"],
  ["Head of Engineering", "AI Product & Research Partner"],
  ["Lead Mobile Engineer", "Product development"],
  ["Design Director", "Product design"],
  ["Built two startups as CTO before starting ABE TechLab to build products the right way for others.", "Leads ABE TechLab across product strategy, research, technology, product development and product marketing."],
  ["Leads our engineers and the AI practice. Ex-staff engineer at a fintech unicorn.", "ARIA is an AI system supporting research, market analysis, documentation, ideation and product thinking; not a human employee."],
  ["Has shipped 30+ apps to the App Store, and still tests every release on an old phone.", "Product development focuses on useful websites, platforms and internal tools."],
  ["Turns complicated software into screens people understand on the first try.", "Product design connects user needs with clear digital experiences."],
  ["ABE TechLab felt like our own engineering team from week one. They shipped every two weeks and told us the truth about scope.", "Our approach starts with understanding the problem, users and requirements before committing to a solution."],
  ["We went from a Figma file to 120k downloads in a year. The app is fast, stable and our users love it.", "We combine product research with strategy, design and the practical steps needed to deliver."],
  ["The AI features actually work in production. They measured quality before launch, not after complaints.", "We use AI-assisted research where appropriate while keeping people accountable for product decisions."],
  ["Clean code, real documentation and a handover so good our new hires learned the system in a week.", "Clear documentation, quality checks and realistic delivery plans matter throughout the project."],
  ["They rebuilt our store before the holidays and it held five times the traffic. Nobody got paged.", "We focus on products that solve meaningful problems rather than claims without evidence."],
  ["They rebuilt the whole product without a single day of downtime.", "Our focus is on practical solutions shaped by real needs."],
  ["We launched on time for race day, and the reviews did our marketing.", "Research and product thinking come before assumptions."],
  ["Month-end used to take a week. Now it takes a morning.", "The product should work for the people who use it."],
  ["Our front desks finally stopped living on the phone.", "Clarity, usability and delivery guide the work."],
  ["First holiday season in years where nobody got paged.", "The details matter, from research to delivery."],
  ["Product architecture;Frontend and backend;Payments and auth;Analytics and monitoring", "Requirements and planning;Product design;Development support;Testing and delivery"],
  ["iOS and Android;Push and in-app payments;Offline sync;Store submission", "Mobile product strategy;User flows;Development coordination;Release planning"],
  ["Model selection;Retrieval on your data;Evaluation suite;Cost controls", "Market insight;Product positioning;User research;Launch strategy"],
  ["CI/CD pipelines;Infrastructure as code;Monitoring and alerts;Cost optimisation", "Delivery planning;Testing and quality;Launch support;Continuous improvement"],
  ["Senior engineers;Product lead;Designer on demand;Weekly demos", "Discovery;Requirements;MVP scope;Product roadmap"],
  ["How much does it cost to build an app?", "How is a project scoped and priced?"],
  ["Most MVPs land between $18k and $60k, depending on platforms and integrations. After a free scoping call we send a fixed quote for the first release, so the number does not move.", "Cost depends on scope, timeline and requirements. We start by discussing your needs, then agree on a realistic approach and commercial terms."],
  ["Usually within two weeks. We keep a bench of senior engineers so a new project never waits for hiring.", "Start dates depend on availability and project scope. We can agree on a realistic schedule after discovery."],
  ["Both. About half our clients are funded startups building a first product; the rest are growing companies that need more engineering hands.", "We work on ideas and products for founders, organisations and growing businesses where the project is a good fit."],
  ["A shared Slack channel, a demo of working software every two weeks and a live board of what is in progress. No surprises at the end.", "We agree on communication, milestones and reporting methods based on the project and team."],
  ["Yes. We start with a one-week code audit, fix what is risky and then keep shipping features on top.", "Existing products can be assessed so that risks, user needs and practical improvements are clear."],
  ["We stay on for monitoring, fixes and new features on a monthly retainer, or hand everything over to your team with documentation and training.", "We can discuss support, handover and next steps based on what has been built and agreed."],
  ["Tell us what you are building. You get a reply within one business day, a free scoping call and a fixed quote for the first release.", "Tell us about your product, research, design or technology needs. We will review your enquiry and discuss a suitable next step."],
  ["Reply within 1 business day", "Enquiries reviewed"],
  ["Free 30-minute scoping call", "Scope discussion"],
  ["Fixed quote for the first release", "Project-specific next steps"],
  ["Most MVPs", "Project budgets"],
  ["$18,000", "Custom scope"],
  ["$14,500", "Custom plan"],
  ["$6,000", "Discuss scope"],
  ["$18k", "Custom"],
  ["$24k", "Custom"],
  ["$12k", "Custom"],
  ["$14k", "Custom"],
  ["+$3,500", "By scope"],
  ["$18k to $60k", "Scope-based"],
  ["Prices in USD. Fixed quotes after a free scoping call. No lock-in: plans pause or cancel with 30 days notice.", "Pricing is agreed after discussing scope, requirements and delivery arrangements."],
  ["Launch your first product in 8 weeks", "Clarify and plan your first product"],
  ["40 engineering hours", "Agreed delivery scope"],
  ["38 engineers", "Product collaborators"],
  ["3,412 commits in the last year", "Research · strategy · delivery"],
  ["Built two startups as CTO", "Leads product strategy and research"],
  ["Four engineers, one room", "Start with the problem"],
  ["Codeforge opens in Austin with its first startup client.", "Research user needs, business context and the problem before designing a solution."],
  ["First million users", "Build product clarity"],
  ["A fintech app we built passes one million sign-ups.", "Identify the core user journey, requirements and measurable product outcomes."],
  ["Mobile practice", "Design for usability"],
  ["React Native and native iOS and Android join the web team.", "Use research and design to make complex workflows easier to understand."],
  ["Remote across 6 time zones", "Plan delivery"],
  ["The team grows to 20 and starts working with clients in Europe.", "Coordinate product work through realistic milestones, clear ownership and testing."],
  ["AI features in production", "Use AI thoughtfully"],
  ["Our first retrieval and assistant features go live for clients.", "AI-assisted research and product workflows support human judgement where useful."],
  ["100th product shipped", "Build useful technology"],
  ["A milestone release, and a bigger studio on South Congress.", "Create systems around operational needs and the people who will use them."],
  ["Still demoing working software every two weeks.", "Keep learning from users, stakeholders and real product outcomes."],
  ["We pick proven tools your next hire already knows, so the product stays easy to grow long after launch.", "Technology choices are guided by the project context, future maintenance and delivery needs."],
  ["hello@codeforge-austin.com", "abeayo6@gmail.com"],
  ["+1 512 555 0142", "Contact via the website"],
  ["+1 (512) 555-0142", "Contact via the website"],
  ["© 2026 Codeforge", "© 2026 ABE TechLab"],
  ["Create a free website with Framer, the website builder loved by startups, designers and agencies.", ""],
  ["Codeforge", "ABE TechLab"],
  ["CODEFORGE", "ABE TECHLAB"],
];
const links = [
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
  ["/pricing","/products"],
  ["/blog","/insights"],
];
const editorialCorrections = [
  ["VP Engineering", "Product thinking"],
  ["Engineering Lead", "Product development"],
  ["Head of Product", "Product strategy"],
  ["Senior engineers", "Product specialists"],
  ["engineers and designers", "product collaborators"],
  ["countries our clients ship in", "digital focus areas"],
  ["Launch and 30 days of support", "Planning and support options"],
  ["Sprint 1 · core flow", "Product discovery"],
  ["Sprint 2 · payments", "Design and development"],
  ["QA and code review", "Quality review"],
  ["tools in production", "development approaches"],
  ["client: Waste2Light", "project: Waste2Light"],
  ["scope: design, build, launch", "focus: strategy and delivery"],
  ["Still stuck? Ask a real engineer.", "Still have questions? Get in touch."],
  ["Every one live, every one measured.", "Each one shaped around real needs."],
  ["Shipped to production", "Research, build and learn"],
  ["Get a quote", "Discuss your project"],
  ["How much does an MVP really cost in 2026?", "What to validate before building an MVP"],
  ["AI features that make it to production", "What ABE TechLab actually builds"],
  ["Research & marketing that make it to production", "What ABE TechLab actually builds"],
  ["Why we ship every two weeks, no matter what", "How we approach product strategy"],
  ["The real numbers behind 40 MVPs we shipped, and the three decisions that move the price most.", "Learn what to validate before investing in the next stage of a digital product."],
  ["Why most AI prototypes never launch, and the evaluation habit that fixes it.", "Research, strategy, design and development work together to create useful products."],
  ["Small releases, demo days and the one rule that keeps projects on time.", "Practical product direction and informed trade-offs help projects move forward."],
  ["/blog/how-much-does-an-mvp-cost", "/insights/what-to-validate-before-building-an-mvp"],
  ["/blog/ai-features-that-ship", "/insights/what-abe-techlab-builds"],
  ["/blog/two-week-sprints", "/insights/how-we-approach-product-strategy"],
  ["https://github.com/codeforge", "https://github.com/ABE-TechLab"],
  ["https://dribbble.com/codeforge", "/work"],

 ["Tech Developers for AI Startups, Software & Apps","Product Research, Strategy, Design & Technology"],
 ["Tech Developers for AI Startups, Software &amp; Apps","Product Research, Strategy, Design &amp; Technology"],
 ["A Software Development Studio in Austin","Product, Research & Technology Studio in Nigeria"],
 ["Software Development Services — Product Development, Digital Platforms & AI","Product Services — Strategy, Research, Design & Development"],
 ["Software Development Service","Product & Technology Service"],
 ["Our Work — Case Studies from Startups & Growing Companies","Selected Work — Research, Product & Technology"],
 ["Products we shipped.","Selected work and collaborations."],
 ["Real launches with real numbers. Every case below was designed, built and shipped by the same team you would work with.","Selected collaborations in education, construction, healthcare and digital technology. Each project is described using ABE TechLab's existing portfolio information."],
 ["Product development, mobile apps and Research & marketing for startups and growing companies. Every one live, every one measured.","Selected work across research, product strategy, marketing, design, development and delivery."],
 ["Every project runs on the same board you can see: one ticket for your product, moving a column every sprint.","We use clear product requirements, priorities, responsibilities and regular progress reviews to keep work moving."],
 ["Commits to client repositories over the last 12 months. Every orange square is working software going out.","Illustrative activity visual. Real projects are managed around agreed requirements and delivery milestones."],
 ["Senior engineers and designers who have built products for startups and scale-ups. The people on your kickoff call are the people writing your code.","Our studio combines human product leadership with AI-assisted research and collaboration with specialists as projects require."],
 ["Senior engineers and designers who have built products for startups and scale-ups.","Human product leadership, research, design and technology collaboration."],
 ["Client reviews","Studio principles"],
 ["Every project ends with a review. These are the ones our clients left.","The principles that guide our research, product decisions and collaboration."],
 ["status: live in production","status: selected project"],
 ["Shipped to production","Research to delivery"],
 ["Build your team","Build with clarity"],
 ["Fixed price for a first release, a monthly squad for a roadmap, or a retainer to keep a live product fast. Every plan ships working software every two weeks.","Project scope and milestones depend on your product needs. Start a conversation and we can agree on practical next steps."],
 ["We build the product your customers log into every day: dashboards, marketplaces, booking flows and admin tools, with tests, monitoring and a clean handover.","We build digital products, platforms, dashboards and internal systems around real user and operational needs."],
 ["Apps people keep on their home screen: offline mode, push notifications, in-app payments and a release process that never blocks your team.","We plan and develop practical mobile experiences around user journeys, product quality and delivery needs."],
 ["We add AI where it earns its keep: assistants trained on your data, document extraction, recommendations and workflows that run on their own, with evaluation so quality stays high.","We research user and market needs, clarify product positioning and create messaging and launch strategies grounded in evidence."],
 ["Designers who sit in the same sprint as the engineers: research, flows, high-fidelity screens and a design system your team can grow.","We design user flows, wireframes, interfaces and design systems that connect real problems with usable experiences."],
 ["For companies that need more hands than hiring allows: a stable team that owns a product area, joins your rituals and ships every sprint.","We help turn ideas and problems into a clear product direction, roadmap and realistic MVP scope."],
 ["A senior squad that owns your roadmap","Product management and delivery support"],
 ["Product lead, design on demand","Product strategy and design"],
 ["2 senior engineers","Agreed delivery support"],
 ["Senior engineers","Product specialists"],
 ["Cancel with 30 days notice","Terms agreed per project"],
 ["Two-week sprints with demos","Regular milestones and reviews"],
 ["Product Team","Product Support"],
 ["Book a team","Discuss your project"],
 ["Start the retainer","Start a conversation"],
 ["fixed price","scope-led pricing"],
 ["Fixed price","Scope-led pricing"],
 ["per month","by agreement"],
 ["Custom / month","Custom terms"],
 ["Scope and fixed quote","Scope and proposal"],
 ["Launch to the stores and the web, with monitoring on and our team on call.","Prepare for launch, agree on quality checks and plan support that fits the product."],
 ["Two-week sprints with a demo of working software at the end of each one.","Work is organised into agreed milestones with regular reviews and demonstrations."],
 ["Senior people only","Clarity in every role"],
 ["Every project is run by engineers with at least eight years of shipping. No juniors learning on your budget.","We begin by understanding user needs, requirements and the purpose of the product."],
 ["Working software every two weeks","Visible progress and learning"],
 ["You click through something real at every demo. Progress is a build, never a slide.","Progress is reviewed against the agreed scope, design decisions and deliverables."],
 ["Scope moves, dates do not","Realistic planning"],
 ["When something takes longer, we cut scope with you and keep the release on time.","We review trade-offs and milestones when new requirements or constraints emerge."],
 ["You own everything","Clear handover terms"],
 ["Code, cloud, accounts and designs live in your name from the first commit.","Ownership, access, documentation and handover are agreed for each engagement."],
 ["The studio so far","Our approach"],
 ["Ten years of *shipping*","Research, strategy and delivery"],
 ["Ten years of shipping","Research, strategy and delivery"],
 ["ABE TechLab started in Austin in 2016 with four engineers who were tired of watching good ideas die in slow agencies. We wanted a studio where the people who scope the work are the people who write the code.","ABE TechLab researches, shapes, designs, builds and positions digital products. We connect research and product thinking with technology that serves real users."],
 ["Today we are 38 engineers, designers and product leads. We have shipped more than 140 products for startups and growing companies, from first MVPs to platforms that serve millions of users, and we still demo working software every two weeks.","The studio combines human leadership and AI-assisted research with product strategy, design, development and technology education. We work on our own products and collaborate with organisations on real challenges."],
 ["2016|founded in Austin;38|engineers and designers;140+|products shipped;9|countries our clients ship in","01|research-led approach;05|core services;05|selected projects;03|studio products"],
 ["2016|Four engineers, one room|ABE TechLab opens in Austin with its first startup client.;2018|First million users|A fintech app we built passes one million sign-ups.;2019|Mobile practice|React Native and native iOS and Android join the web team.;2021|Remote across 6 time zones|The team grows to 20 and starts working with clients in Europe.;2023|AI features in production|Our first retrieval and assistant features go live for clients.;2024|100th product shipped|A milestone release, and a bigger studio on South Congress.;2026|38 people, 140+ products|Still demoing working software every two weeks.","01|Understand the problem|Research users, markets, problems and opportunities.;02|Shape the strategy|Clarify product direction, requirements and scope.;03|Design the experience|Create user journeys, prototypes and interfaces.;04|Plan delivery|Agree on priorities, ownership and milestones.;05|Build with care|Develop useful digital products and systems.;06|Test and improve|Review the experience and address issues.;07|Learn and iterate|Use feedback to guide future product decisions."],
 ["Four rules we|*do not* bend","Principles that guide|*our work*"],
 ["We build software|startups can *bet on.*","We turn ideas|into *useful products.*"],
 ["The studio","The studio"],
 ["AUSTIN","NIGERIA"],
 ["Austin","Nigeria"],
 ["12 weeks","Project-specific"],
 ["+38%","01"],
 ["bookings in 90 days","project example"],
 ["120k","02"],
 ["downloads in year one","project example"],
 ["9 h","03"],
 ["saved per accountant weekly","project example"],
 ["−44%","04"],
 ["missed appointments","project example"],
 ["5x","05"],
 ["peak traffic, zero downtime","project example"],
 ["1.1 s page load","Product delivery"],
 ["−52% checkout drop-off","Experience design"],
 ["98.7% extraction accuracy","Research insight"],
 ["3x faster close","Clearer workflows"],
 ["41% weekly active","User needs"],
 ["30 clinics live","Digital health"],
 ["4.9★ patient rating","Product support"],
 ["0 minutes down","Quality focus"],
 ["+22% online revenue","Product strategy"],
 ["4.8★ store rating","Usability focus"],
 ["Our first retrieval and assistant features go live for clients.","AI-assisted workflows can support research and product development when appropriate."],
 ["A HIPAA-ready patient app","A healthcare product strategy"],
 ["The team grows to 20 and starts working with clients in Europe.","Collaborations develop according to each product and project."],
 ["ABE TechLab opens in Nigeria with its first startup client.","ABE TechLab starts from user needs and practical product problems."],
 ["A milestone release, and a bigger studio on South Congress.","Products and delivery approaches evolve as requirements change."]
];

function applyBranding(out,file) {
  // Official working palette from ABE-TechLab/Branding (brand package under review).
  out=out.replace(/#ff5a1f/gi,"#A7E021")
    .replace(/#efede8/gi,"#F9F9F6")
    .replace(/#0d0d0f/gi,"#111111")
    .replace(/rgba\(\s*255\s*,\s*90\s*,\s*31/gi,"rgba(167,224,33")
    .replace(/rgb\(\s*255\s*,\s*90\s*,\s*31\s*\)/gi,"rgb(167,224,33)")
    .replace(/ABE TechLab opens in Nigeria with its first startup client\./g,"ABE TechLab starts from real user needs and practical product problems.");
  if(file.endsWith(".html")){
    out=out.replace(/<link href="https:\/\/framerusercontent\.com\/images\/[^"]+" rel="icon"[^>]*>/g,'<link rel="icon" type="image/svg+xml" href="/brand/abe-techlab-mark-light.svg">')
      .replace(/<link rel="apple-touch-icon" href="https:\/\/framerusercontent\.com\/images\/[^"]+"[^>]*>/g,'<link rel="apple-touch-icon" href="/brand/abe-techlab-mark-light.svg">');
    var style='<style id="abe-brand-identity">.cghd-logo .cghd-mark{display:none!important}.cghd-logo:before{content:"";display:inline-block;width:34px;height:30px;flex:none;background:url(/brand/abe-techlab-mark-light.svg) center/contain no-repeat}.cghd.is-dark .cghd-logo:before{background-image:url(/brand/abe-techlab-mark-dark.svg)}.cgft .cgft-mark{background-image:url(/brand/abe-techlab-mark-dark.svg)!important;background-position:center;background-size:contain;background-repeat:no-repeat}.cgft .cgft-mark>*{visibility:hidden}a:focus-visible,button:focus-visible{outline-color:#A7E021!important}</style>';
    out=out.replace("</head>",style+"</head>");
    if(!out.includes("/abe-piano.js"))out=out.replace("</body>",'<script defer src="/abe-piano.js"></script><script defer src="/abe-assistant-static.js"></script></body>');
  }
  return out;
}

const replacementPairs=[...common,...editorialCorrections,...links].sort((a,b)=>b[0].length-a[0].length);
function transform(input){
  let out=input;
  for (const [from,to] of replacementPairs) if (out.includes(from)) out=out.split(from).join(to);
  return out;
}
async function walk(folder){
  const entries=await readdir(folder,{withFileTypes:true});
  const files=[];
  for(const entry of entries){
    const p=join(folder,entry.name);
    if(entry.isDirectory()) files.push(...await walk(p));
    else if(entry.isFile() && (p.endsWith(".html")||p.endsWith(".mjs"))) files.push(p);
  }
  return files;
}
const roots=["public/template","public/assets/runtime"];
let changed=0, checked=0;
for(const root of roots){
  for(const file of await walk(root)){
    const previous=await readFile(file,"utf8");
    let next=applyBranding(transform(previous),file);
    if(file.endsWith("/template/about/index.html")){
      const steps={"2016":"01","2018":"02","2019":"03","2021":"04","2023":"05","2024":"06","2026":"07"};
      next=next.replace(/>(2016|2018|2019|2021|2023|2024|2026)</g,(m,y)=>">"+steps[y]+"<");
    }
    if(file.endsWith(".html")&&!next.includes("abe-unverified-proof")){
      next=next.replace("</head>",'<style id="abe-unverified-proof">[data-framer-name="CgReviews"]{display:none!important}</style></head>');
    }
    if(file.endsWith(".html")&&!next.includes("/abe-frontend-bridge.js")){
      next=next.replace("</body>",'<script defer src="/abe-frontend-bridge.js"></script></body>');
    }
    checked++;
    if(next!==previous){
      await writeFile(file,next);
      changed++;
    }
  }
}
console.log("ABE content bridge:",checked,"snapshot/runtime files checked,",changed,"updated.");
