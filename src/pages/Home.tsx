import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CTA, Heading, Image, SectionLink } from '../components/UI'
import { paints, vehicles, specs, paintImage, media } from '../data/vehicles'
import { PaintSelector } from '../features/configurator/PaintSelector'
import { useStory } from '../animations/story'
import { useMeta } from '../hooks/useMeta'

const flagship=vehicles[0]
const story=[
  ['01','The silhouette','The low nose and tight cabin keep frontal area to a minimum.','hero'],
  ['02','Air and light','Slim LED optics frame the cooling channels and exposed carbon splitter.','detail'],
  ['03','Contact patch','Forged wheels and carbon brakes manage energy at each corner.','wheel'],
  ['04','The driver cell','Low-glare materials surround controls placed close to the driver.','cockpit'],
]
let openingPlayed=false
function Opening(){
  const [visible,setVisible]=useState(()=>!openingPlayed)
  useEffect(()=>{
    if(!visible)return
    const image=document.querySelector<HTMLImageElement>('.hero-image img')
    const done=()=>{openingPlayed=true;setVisible(false)}
    if(!image||image.complete){done();return}
    image.addEventListener('load',done,{once:true});image.addEventListener('error',done,{once:true})
    return ()=>{image.removeEventListener('load',done);image.removeEventListener('error',done)}
  },[visible])
  return <AnimatePresence>{visible&&<motion.div className="opening" aria-hidden="true" exit={{clipPath:'inset(0 0 100% 0)'}}><span>VELOCITY<span className="accent">.</span></span><i/><progress aria-label="Loading hero artwork"/></motion.div>}</AnimatePresence>
}
export default function Home(){
  const root=useRef<HTMLDivElement>(null)
  const [paint,setPaint]=useState(paints[0].id)
  useStory(root)
  useMeta('Beyond Performance','Discover four fictional performance machines and configure the VELOCITY VXR-01.')
  return <div ref={root}>
    <section className="hero campaign-hero">
      <div className="hero-image" data-hero-photo><picture><source media="(max-width: 680px)" srcSet={`${media('hero-mobile-sm')} 640w, ${media('hero-mobile')} 1536w`} sizes="100vw"/><Image file="hero" alt="Titanium silver VXR-01 in a concrete tunnel" eager/></picture></div>
      <div className="hero-shade"/><div className="hero-frame" data-hero-frame/><span className="hero-side" aria-hidden="true">01 — VXR DEVELOPMENT SERIES</span>
      <div className="wrap hero-content">
        <div className="eyebrow hero-kicker"><span className="signal"/> INDEPENDENT AUTOMOTIVE CONCEPT</div>
        <h1><span><b data-hero-line>ENGINEERED TO</b></span><span><b className="outline-type" data-hero-line>EXHILARATE<span className="accent">.</span></b></span></h1></div><div className="hero-brief" data-hero-actions>
        <p>An uncompromising pursuit of speed, precision and design.</p>
        <div className="actions"><CTA to="/collection">Explore Collection</CTA><CTA secondary to="/configure/vxr-01">Configure Vehicle</CTA></div>
      </div>
      <div className="wrap hero-bottom"><a href="#performance-intro" className="eyebrow scroll-link" onClick={event=>{event.preventDefault();document.getElementById('performance-intro')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}}><ArrowDown size={15}/> SCROLL TO EXPLORE</a><div className="hero-model" data-hero-model><small>01 / FLAGSHIP HYPERCAR</small><strong>VXR-01</strong></div></div>
    </section>
    <Opening/>
    <section className="light proof-band" id="performance-intro"><div className="wrap section">
      <Heading index="01 / PERFORMANCE" title="POWER IN NUMBERS."><p>VXR-01 · Fictional concept specifications</p></Heading>
      <div className="numbers">{[specs[0],specs[2],specs[3],specs[1]].map(spec=><div key={spec.key}><small>{spec.label}</small><div><strong data-counter={flagship[spec.key]}>{flagship[spec.key].toLocaleString('en-US')}</strong> <span>{spec.unit}</span></div></div>)}</div></div>
    </section>
    <section className="story">
      <div className="wrap"><Heading index="02 / VXR-01 ANATOMY" title="EVERY LINE HAS A JOB."/></div>
      <div className="story-rail"><div className="story-track">{story.map(([n,title,copy,img])=><article className="story-panel" key={n}><Image file={img} alt={title}/><div><small>{n} / {String(story.length).padStart(2,'0')} — VXR-01</small><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div>
    </section>
    <section className="wrap section lineup home-lineup"><Heading index="03 / THE COLLECTION" title="FOUR POINTS OF VIEW."/>
      {vehicles.map(vehicle=><article className="lineup-row" key={vehicle.slug}><Link className="lineup-image" to={`/vehicle/${vehicle.slug}`} aria-label={`Explore ${vehicle.model}`}><Image file={vehicle.image} alt={vehicle.model}/></Link><div><small>{vehicle.id} / {vehicle.category}</small><h3>{vehicle.model}</h3><p>{vehicle.hp.toLocaleString()} hp · {vehicle.speed} km/h</p><SectionLink to={`/vehicle/${vehicle.slug}`}>Discover {vehicle.model}</SectionLink></div></article>)}
    </section>
    <section className="light"><div className="wrap section studio-teaser">
      <div><Heading index="04 / THE STUDIO" title="PICK YOUR FINISH."/><PaintSelector options={paints} current={paint} onChange={setPaint}/><p aria-live="polite">{paints.find(option=>option.id===paint)?.name}</p><CTA to={`/configure/vxr-01?paint=${paint}`}>Configure Your Vehicle</CTA></div>
      <img key={paint} className="paint-preview" src={paintImage(flagship,paint)} alt={`VXR-01 wearing ${paints.find(option=>option.id===paint)?.name}`} loading="lazy"/>
    </div></section>
    <section className="wrap section manifesto"><div data-reveal><Image file="wheel" alt="Forged wheel and carbon ceramic brake detail"/></div><div><Heading index="05 / THE PHILOSOPHY" title="PRECISION IS FELT."/><p>Aero shapes the way the car settles. Materials shape the way it speaks. The best engineering makes both immediately clear from the driver’s seat.</p><SectionLink to="/about">Read our philosophy</SectionLink></div></section>
    <section className="closing"><Image file="detail" alt="VXR-01 ducting and headlight detail"/><div className="wrap"><h2>MAKE PERFORMANCE PERSONAL<span className="accent">.</span></h2><div className="actions"><CTA to="/configure/vxr-01">Configure Your Vehicle</CTA><CTA secondary to="/collection">Explore Collection</CTA></div><ArrowUpRight className="closing-arrow" aria-hidden="true"/></div></section>
  </div>
}
