import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { media } from '../data/vehicles'
export function CTA({to,children,secondary=false}:{to:string;children:ReactNode;secondary?:boolean}){
  return <Link className={`button magnetic ${secondary?'secondary':''}`} to={to} onPointerMove={event=>{
    if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const target=event.currentTarget
    const box=target.getBoundingClientRect()
    target.style.setProperty('--magnet-x',`${(event.clientX-box.left-box.width/2)*.09}px`)
    target.style.setProperty('--magnet-y',`${(event.clientY-box.top-box.height/2)*.16}px`)
  }} onPointerLeave={event=>{
    event.currentTarget.style.removeProperty('--magnet-x')
    event.currentTarget.style.removeProperty('--magnet-y')
  }}>{children}<ArrowUpRight size={16}/></Link>
}
export function Heading({index,title,children}:{index:string;title:string;children?:ReactNode}){
  return <div className="section-heading"><div className="eyebrow"><span className="signal"/> {index}</div><h2>{title}</h2>{children}</div>
}
export function Image({file,alt,className,eager=false}:{file:string;alt:string;className?:string;eager?:boolean}){
  return <img className={className} src={media(file)} srcSet={`${media(file+'-sm')} 640w, ${media(file)} 1536w`} sizes={eager?'100vw':'(max-width: 700px) 100vw, 70vw'} alt={alt} loading={eager?'eager':'lazy'} fetchPriority={eager?'high':'auto'} decoding="async"/>
}
export function SectionLink({to,children}:{to:string;children:ReactNode}){
  return <Link className="text-link" to={to}>{children}<ArrowDownRight size={17}/></Link>
}
