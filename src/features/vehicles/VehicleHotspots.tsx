import { useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { X } from 'lucide-react'
import gsap from 'gsap'
import type { Vehicle } from '../../data/vehicles'

interface Bounds { width:number; height:number; left:number; top:number; frameHeight:number; frameWidth:number }
export function VehicleHotspots({car,active,onSelect,children,fullscreen=false}:{
  car:Vehicle; active:number|null; onSelect:(index:number|null)=>void; children:ReactNode; fullscreen?:boolean
}){
  const stage=useRef<HTMLDivElement>(null)
  const panel=useRef<HTMLElement>(null)
  const connector=useRef<SVGLineElement>(null)
  const id=useId()
  const [image,setImage]=useState<Bounds>()
  const [panelHeight,setPanelHeight]=useState(145)
  const feature=active===null?undefined:car.hotspots[active]

  useLayoutEffect(()=>{
    const photo=stage.current?.querySelector('img')
    if(!photo)return
    const measure=()=>{
      if(!photo.naturalWidth||!photo.clientWidth||!photo.clientHeight)return
      // The stage uses centered object-fit: contain. Rebuild the painted rectangle
      // inside the image element so pillarboxing and letterboxing share one model.
      const scale=Math.min(photo.clientWidth/photo.naturalWidth,photo.clientHeight/photo.naturalHeight)
      const width=photo.naturalWidth*scale
      const height=photo.naturalHeight*scale
      setImage({width,height,left:(photo.clientWidth-width)/2,top:(photo.clientHeight-height)/2,frameHeight:photo.clientHeight,frameWidth:photo.clientWidth})
    }
    const observer=new ResizeObserver(measure)
    observer.observe(photo)
    photo.addEventListener('load',measure)
    measure()
    return ()=>{observer.disconnect();photo.removeEventListener('load',measure)}
  },[])

  useLayoutEffect(()=>{
    if(!feature||!image||!panel.current)return
    const motion=gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)',()=>{
      gsap.fromTo(panel.current,{opacity:.35,clipPath:'inset(0 8% 0 0)'},{opacity:1,clipPath:'inset(0)',duration:.28,ease:'power2.out',clearProps:'opacity,clipPath'})
      if(connector.current)gsap.fromTo(connector.current,{strokeDashoffset:1},{strokeDashoffset:0,duration:.3,ease:'power2.out'})
    })
    return ()=>motion.revert()
  },[feature,Boolean(image)])

  useLayoutEffect(()=>{
    const element=panel.current
    if(!element)return
    const measure=()=>setPanelHeight(element.offsetHeight)
    const observer=new ResizeObserver(measure)
    observer.observe(element)
    measure()
    return ()=>observer.disconnect()
  },[feature,Boolean(image)])

  const point=feature&&image?{x:image.left+image.width*feature.x/100,y:image.top+image.height*feature.y/100}:undefined
  let side:'above'|'below'='above'
  let panelX=12
  if(point&&image){
    const width=Math.min(270,image.frameWidth-24)
    const clampX=(x:number)=>Math.max(12,Math.min(x,image.frameWidth-width-12))
    const candidates=[clampX(point.x-width/2),clampX(point.x-width+20),clampX(point.x-20)]
    const markers=car.hotspots.filter(item=>item!==feature).map(item=>({x:image.left+image.width*item.x/100,y:image.top+image.height*item.y/100}))
    let best=Infinity
    for(const direction of ['above','below'] as const){
      const top=direction==='above'?point.y-24-panelHeight:point.y+24
      const overflow=Math.max(0,8-top)+Math.max(0,top+panelHeight-image.frameHeight+8)
      for(const left of candidates){
        const covered=markers.filter(marker=>marker.x+18>left&&marker.x-18<left+width&&marker.y+18>top&&marker.y-18<top+panelHeight).length
        const cost=overflow*10+covered*100+(direction==='below'?20:0)+Math.abs(left-candidates[0])/20
        if(cost<best){best=cost;side=direction;panelX=left}
      }
    }
  }
  const spec=feature?.spec==='powertrain'?car.powertrain:feature?.spec==='wheel'?car.wheels[0]?.name:undefined

  function dismiss(){
    if(active!==null)stage.current?.querySelector<HTMLButtonElement>(`[data-hotspot-index="${active}"]`)?.focus({preventScroll:true})
    onSelect(null)
  }

  return <div className={`hotspot-view ${fullscreen?'hotspot-view-fullscreen':''}`} style={point?{'--point-x':`${point.x}px`,'--point-y':`${point.y}px`,'--panel-x':`${panelX}px`} as CSSProperties:undefined}>
    <div className="hotspot-stage" ref={stage}>
      {children}
      {image&&car.hotspots.map((item,index)=><button type="button" className="hotspot" key={item.name}
        data-hotspot-index={index} style={{left:image.left+image.width*item.x/100,top:image.top+image.height*item.y/100}}
        aria-label={`Feature ${index+1}: ${item.name}`} aria-expanded={active===index} aria-controls={active===index?id:undefined}
        onClick={()=>onSelect(active===index?null:index)}>
        <span className="hotspot-glyph" aria-hidden="true"/>
      </button>)}
      {point&&<svg className={`hotspot-leader leader-${side}`} width="2" height="28" viewBox="0 0 2 28" preserveAspectRatio="none" aria-hidden="true">
        <line ref={connector} x1="1" y1={side==='above'?28:0} x2="1" y2={side==='above'?0:28} pathLength="1"/>
      </svg>}
    </div>
    {feature&&point&&<section ref={panel} id={id} className={`hotspot-panel panel-${side}`} aria-labelledby={`${id}-title`}>
      <button type="button" className="icon hotspot-close" aria-label="Close feature information" onClick={dismiss}><X size={18}/></button>
      <div aria-live="polite" aria-atomic="true">
        <p className="hotspot-number">FEATURE {String((active??0)+1).padStart(2,'0')}</p>
        <h3 id={`${id}-title`}>{feature.name}</h3>
        <p>{feature.text}</p>
        {spec&&<p className="hotspot-spec">{spec}</p>}
      </div>
    </section>}
  </div>
}
