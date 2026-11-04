import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import { projects } from '@/data/content';

// Real portfolio case pages are generated from the original ABE portfolio data.
// Do not invent outcomes, technology stacks, delivery dates or client quotes.
const cases = [
  { slug:'waste2light', name:'Waste2Light', discipline:'Product Development · Product Management' },
  { slug:'bumars', name:'BuMarS', discipline:'Construction Product Ecosystem' },
  { slug:'future-speakers', name:'Future Speakers International School', discipline:'Education Technology' },
  { slug:'maka-integrated', name:'Maka Integrated', discipline:'Digital Health · Product Strategy' },
  { slug:'cyfamod', name:'Cyfamod Technologies', discipline:'School Management Technology' },
] as const;

export function generateStaticParams(){ return cases.map(c=>({slug:c.slug})); }

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const item=cases.find(c=>c.slug===slug);
  if(!item)return{};
  const project=projects.find(p=>p.name===item.name);
  return {title:item.name+' | Work | ABE TechLab',description:project?.description ?? item.discipline,alternates:{canonical:'/work/'+slug}};
}

export default async function WorkCase({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const item=cases.find(c=>c.slug===slug);
  if(!item)notFound();
  const project=projects.find(p=>p.name===item.name);
  if(!project)notFound();
  const others=cases.filter(c=>c.slug!==slug);
  return <main className="min-h-screen bg-[#efede8] text-[#0d0d0f]">
    <section className="relative overflow-hidden border-b border-black/15 bg-[#0d0d0f] px-5 pb-20 pt-16 text-[#efede8] md:pb-28 md:pt-28">
      <div className="mx-auto max-w-[1180px]">
        <Link href="/work" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#efede8]/60 transition hover:text-[#ff5a1f]"><ArrowLeft size={14}/> All work</Link>
        <div className="mt-16 border-t border-white/20 pt-7"><span className="text-xs font-medium uppercase tracking-[.2em] text-[#ff5a1f]">Selected work · ABE TechLab</span></div>
        <h1 className="mt-6 max-w-5xl text-[clamp(3.5rem,9vw,9rem)] font-semibold leading-[.88] tracking-[-.085em]">{project.name}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-[#efede8]/65 md:text-2xl">{project.description}</p>
        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/20 pt-7 text-xs uppercase tracking-[.15em] text-[#efede8]/60">
          <span>{project.category}</span><span className="h-1.5 w-1.5 rounded-full bg-[#ff5a1f]" aria-hidden="true"/><span>ABE TechLab portfolio</span>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 md:grid-cols-[.45fr_1fr] md:py-28">
      <div className="text-xs font-semibold uppercase tracking-[.2em] text-black/45">Our involvement</div>
      <div>
        <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-.06em] md:text-6xl">{item.discipline}</h2>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-black/65">{project.description}</p>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-black/55">This summary reflects the existing ABE TechLab portfolio. Client metrics or outcomes are intentionally not shown unless documented and approved.</p>
        <Link href="/contact" className="mt-8 inline-flex items-center gap-3 bg-[#ff5a1f] px-6 py-4 text-sm font-semibold text-black">Discuss a similar project <ArrowUpRight size={17}/></Link>
      </div>
    </section>
    <section className="border-t border-black/15 bg-[#e5e1d8] px-5 py-20 md:py-28"><div className="mx-auto max-w-[1180px]">
      <p className="text-xs font-semibold uppercase tracking-[.2em] text-black/45">More selected work</p>
      <div className="mt-10 grid gap-3 md:grid-cols-2">{others.map((other,i)=><Link href={'/work/'+other.slug} key={other.slug} className="group flex min-h-36 flex-col justify-between border border-black/15 bg-[#efede8] p-6 transition hover:bg-[#ff5a1f]"><span className="text-xs text-black/45">0{i+1} / CASE STUDY</span><div className="flex items-end justify-between gap-3"><span className="text-2xl font-semibold tracking-[-.045em]">{other.name}</span><ArrowUpRight size={19}/></div></Link>)}</div>
    </div></section>
  </main>;
}
