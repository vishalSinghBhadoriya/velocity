import { useRef } from 'react'
import { CTA, Heading, Image } from '../components/UI'
import { useStory } from '../animations/story'
import { useMeta } from '../hooks/useMeta'
export default function About(){
  const root=useRef<HTMLDivElement>(null)
  useStory(root)
  useMeta('Brand philosophy','The design and engineering principles behind the fictional VELOCITY collection.')
  return <div ref={root}><section className="about-lead"><div className="wrap subpage"><div className="eyebrow"><span className="signal"/> THE PHILOSOPHY</div><h1>BUILT AROUND<br/>THE DRIVER<span className="accent">.</span></h1><p>VELOCITY is an independent frontend development concept that explores the relationship between form, performance and the person at the wheel.</p></div><div className="about-image"><Image file="cockpit" alt="Black leather driver cockpit and steering wheel" eager/></div></section><section className="light"><div className="wrap section manifesto"><div><Heading index="01 / DESIGN" title="FORM FOLLOWS AIR."/><p>A narrow cabin, clean underbody and carefully managed cooling channels shape the way a car moves. The effect matters as much as the silhouette.</p></div><div><Heading index="02 / CRAFT" title="DETAIL BY TOUCH."/><p>Weight, feedback and material texture define the driver’s first impression. We imagined each contact point with the same intent as the bodywork.</p><CTA to="/collection">Explore the Collection</CTA></div></div></section><section className="wrap section manifesto"><Image file="detail" alt="Sculpted VXR-01 front light and duct"/><div><Heading index="03 / ENGINEERING" title="RESPONSE FIRST."/><p>Power, grip and aerodynamics work together. Four fictional powertrains explore how that balance changes across a hypercar, grand tourer, coupe and electric concept.</p></div></section></div>
}
