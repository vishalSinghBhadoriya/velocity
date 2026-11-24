import { useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'
import { Image } from '../../components/UI'
import { VehicleHotspots } from './VehicleHotspots'
import type { Vehicle } from '../../data/vehicles'

export function VehicleGallery({car}:{car:Vehicle}){
  const [index,setIndex]=useState(0)
  const [hotspot,setHotspot]=useState<number|null>(null)
  const [expanded,setExpanded]=useState(false)
  const gallery=useRef<HTMLDivElement>(null)
  const dialog=useRef<HTMLDialogElement>(null)
  const start=useRef<{x:number;y:number}|null>(null)
  const photos=[
    {file:car.image,label:'Exterior',caption:`${car.model} / exterior profile`},
    ...(car.slug==='vxr-01'?[
      {file:'detail',label:'Lighting and aero',caption:'LED optics and front cooling channels'},
      {file:'wheel',label:'Wheel and brakes',caption:'Forged wheel and carbon ceramic brake'},
    ]:[]),
    {file:car.interior,label:car.slug==='vxr-01'?'Cockpit':'Studio cockpit study',caption:'Driver cell and cabin materials'},
  ]
  const photo=photos[index]
  const step=(direction:number)=>{setHotspot(null);setIndex(current=>(current+direction+photos.length)%photos.length)}
  function key(event:KeyboardEvent){
    if(event.key==='Escape' && hotspot!==null){
      event.preventDefault()
      const container=expanded?dialog.current:gallery.current
      container?.querySelector<HTMLButtonElement>(`[data-hotspot-index="${hotspot}"]`)?.focus({preventScroll:true})
      setHotspot(null)
      return
    }
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault()
      step(event.key==='ArrowLeft'?-1:1)
    }
  }
  function pointerDown(event:PointerEvent){
    if(event.button!==0||(event.target instanceof Element && event.target.closest('button')))return
    event.currentTarget.setPointerCapture(event.pointerId)
    start.current={x:event.clientX,y:event.clientY}
  }
  function pointerUp(event:PointerEvent){
    const origin=start.current
    start.current=null
    if(!origin)return
    const delta=event.clientX-origin.x
    if(Math.abs(delta)>45 && Math.abs(delta)>Math.abs(event.clientY-origin.y)*1.3)step(delta<0?1:-1)
  }
  const swipe={onPointerDown:pointerDown,onPointerUp:pointerUp,onPointerCancel:()=>{start.current=null}}
  const counter=`${String(index+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`
  return <div ref={gallery} className="gallery-system" role="region" aria-label={`${car.model} image gallery`} onKeyDown={key}>
    <figure className="gallery" {...swipe}>
      {index===0
        ? <VehicleHotspots car={car} active={expanded?null:hotspot} onSelect={setHotspot}><Image file={photo.file} alt={photo.label}/></VehicleHotspots>
        : <Image key={photo.file} file={photo.file} alt={photo.label}/>}

      <button className="icon gallery-expand" aria-label="Open fullscreen gallery" onClick={()=>{setExpanded(true);dialog.current?.showModal()}}><Expand size={17}/></button>
    </figure>
    <div className="gallery-caption">
      <p aria-live="polite"><span>{counter}</span> {photo.caption}</p>
      <div className="actions"><button className="icon" aria-label="Previous image" onClick={()=>step(-1)}><ArrowLeft size={18}/></button><button className="icon" aria-label="Next image" onClick={()=>step(1)}><ArrowRight size={18}/></button></div>
    </div>
    <div className="actions gallery-tabs">{photos.map((item,itemIndex)=><button className="button secondary" aria-pressed={index===itemIndex} key={item.label} onClick={()=>{if(index!==itemIndex){setHotspot(null);setIndex(itemIndex)}}}>{item.label}</button>)}</div>
    <dialog ref={dialog} className="preview-dialog gallery-dialog" aria-label="Fullscreen vehicle gallery" onClose={()=>{setExpanded(false);setHotspot(null)}} onCancel={event=>{if(hotspot!==null){event.preventDefault();setHotspot(null)}}}>
      <button className="icon" aria-label="Close gallery" onClick={()=>dialog.current?.close()}><X/></button>
      {expanded&&<div className="fullscreen-gallery" {...swipe}>{index===0
        ? <VehicleHotspots fullscreen car={car} active={hotspot} onSelect={setHotspot}><Image file={photo.file} alt={photo.label}/></VehicleHotspots>
        : <Image key={photo.file} file={photo.file} alt={photo.label}/>}</div>}
      <div className="gallery-caption"><button className="icon" aria-label="Previous fullscreen image" onClick={()=>step(-1)}><ArrowLeft size={18}/></button><p aria-live="polite"><span>{counter}</span> {photo.caption}</p><button className="icon" aria-label="Next fullscreen image" onClick={()=>step(1)}><ArrowRight size={18}/></button></div>
    </dialog>
  </div>
}
