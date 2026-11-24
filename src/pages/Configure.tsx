import { useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Expand, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { findVehicle, money, paintImage } from '../data/vehicles'
import type { Vehicle } from '../data/vehicles'
import { defaults, fromQuery, priceLines, toQuery, togglePackage, total } from '../features/configurator/configuration'
import { Image } from '../components/UI'
import { PaintSelector } from '../features/configurator/PaintSelector'
import { useGarage } from '../stores/garage'
import { useMeta } from '../hooks/useMeta'
import Missing from './Missing'

export default function Configure(){
  const car=findVehicle(useParams().slug)
  const location=useLocation()
  return car?<Studio key={car.slug+location.search} car={car} search={location.search}/>:<Missing/>
}
function Studio({car,search}:{car:Vehicle;search:string}){
  const params=new URLSearchParams(search)
  const savedId=params.get('build')
  const saved=useGarage(state=>state.saved.find(item=>item.id===savedId&&item.slug===car.slug))
  const draft=useGarage(state=>state.drafts[car.slug])
  const setDraft=useGarage(state=>state.setDraft)
  const store=useGarage(state=>state.save)
  const [initial]=useState(()=>saved?.configuration??(search?fromQuery(car,search):draft??defaults(car)))
  const [configuration,setConfiguration]=useState(initial)
  const [id,setId]=useState(saved?.id)
  const [name,setName]=useState(saved?.name??`${car.model} build`)
  const [notice,setNotice]=useState('')
  const [share,setShare]=useState('')
  const dialog=useRef<HTMLDialogElement>(null)
  const paint=car.paints.find(option=>option.id===configuration.paint)!
  const lines=priceLines(car,configuration)
  const sum=total(car,configuration)
  const url=paintImage(car,paint.id)
  useMeta(`Configure ${car.model}`,`Personalize and save a fictional ${car.model} configuration.`)
  function update(next:typeof configuration){setConfiguration(next);setDraft(car.slug,next);setShare('');setNotice('')}
  async function shareBuild(){
    const target=new URL(window.location.href)
    const query=toQuery(configuration)
    if(target.hash.startsWith('#/'))target.hash=`${target.hash.split('?')[0]}?${query}`
    else {target.search=query;target.hash=''}
    const link=target.href
    setShare(link)
    try{await navigator.clipboard.writeText(link);setNotice('Share link copied.')}catch{setNotice('Share link ready to copy.')}
  }
  function exportBuild(){
    const content=[name,car.model,'Fictional configuration · USD','',...lines.map(line=>`${line.name}  ${money(line.price)}`),'',`Total  ${money(sum)}`].join('\n')
    const file=URL.createObjectURL(new Blob([content],{type:'text/plain'}))
    const anchor=document.createElement('a');anchor.href=file;anchor.download=`${car.slug}-configuration.txt`;anchor.click();setTimeout(()=>URL.revokeObjectURL(file),1000)
    setNotice('Configuration exported.')
  }
  return <section className="wrap subpage studio">
    <div className="eyebrow"><span className="signal"/> CONFIGURATION STUDIO</div><h1>{car.model}<span className="accent">.</span></h1>
    <div className="studio-layout"><div className="studio-stage">
      <div className="viewer"><AnimatePresence initial={false}><motion.img key={url} src={url} alt={`${car.model} · ${paint.name}`} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}/></AnimatePresence><button className="icon" aria-label="Fullscreen vehicle preview" onClick={()=>dialog.current?.showModal()}><Expand size={18}/></button></div>
      <div className="viewer-caption"><span>{car.model} / PHOTOGRAPHIC PREVIEW</span><span>{paint.name}</span></div>
    </div><div className="studio-controls">
      <PaintSelector options={car.paints} current={paint.id} onChange={value=>update({...configuration,paint:value})}/><p aria-live="polite">{paint.name} · {paint.price?money(paint.price):'Included'}</p>
      <details><summary>Factory wheels and interior</summary><div className="material-samples">{car.slug==='vxr-01'&&<Image file="wheel" alt="Factory forged wheel detail"/>}<Image file={car.interior} alt="Studio cockpit and material study"/></div><p>{car.wheels[0].name} · Included</p><p>{car.interiors[0].name} · Included</p></details>
      <details open><summary>Engineering packages</summary><p className="studio-note">Packages update the build summary and price.</p>{car.packages.map(option=><label className="package" key={option.id}><input type="checkbox" checked={configuration.packages.includes(option.id)} onChange={()=>update(togglePackage(configuration,option.id))}/><span>{option.name}<small>{option.description}</small></span><b>{money(option.price)}</b></label>)}</details>
      <details><summary>Itemized price</summary><dl className="spec-list compact">{lines.map(line=><div key={line.name}><dt>{line.name}</dt><dd>{money(line.price)}</dd></div>)}</dl></details>
      <div className="price-total" aria-live="polite"><span>CONCEPT TOTAL / USD</span><strong>{money(sum)}</strong></div>
      <label>Configuration name<input maxLength={80} value={name} onChange={event=>setName(event.target.value)}/></label>
      <div className="actions"><button className="button" onClick={()=>{setId(store(car.slug,name,configuration,id));setNotice('Saved in My Garage.')}}>{id?'Update build':'Save build'}</button><button className="button secondary" onClick={shareBuild}>Share</button><button className="button secondary" onClick={exportBuild}>Export</button><button className="button secondary" onClick={()=>{update(defaults(car));setNotice('Factory configuration restored.')}}>Reset</button></div>
      {share&&<label>Share URL<input readOnly value={share} onFocus={event=>event.target.select()}/></label>}
      <p role="status" className="notice">{notice}</p>
    </div></div>
    <dialog ref={dialog} className="preview-dialog" aria-label="Fullscreen vehicle preview"><button className="icon" aria-label="Close preview" onClick={()=>dialog.current?.close()}><X/></button><img src={url} alt={`${car.model} in ${paint.name}`}/><div className="showroom-label"><strong>{car.model}</strong><span>{paint.name}</span></div></dialog>
  </section>
}
