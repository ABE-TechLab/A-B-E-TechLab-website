/** Safe Next.js fallback; the public homepage is rewritten to the Framer template. */
export default function Fallback(){
 return <main style={{background:"#111",color:"#F9F9F6",minHeight:"100vh",padding:"12vh 7vw",fontFamily:"Arial,sans-serif"}}>
 <h1 style={{fontSize:"clamp(40px,7vw,80px)"}}>ABE TechLab</h1>
 <p>Product research, strategy, design and technology.</p>
 <p><a href="/contact" style={{color:"#A7E021"}}>Start a project →</a></p></main>;
}
