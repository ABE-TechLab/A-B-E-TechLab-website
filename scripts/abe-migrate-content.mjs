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
const replacementPairs=[...common,...links].sort((a,b)=>b[0].length-a[0].length);
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
    let next=transform(previous);
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
