import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CTA, Heading } from '../components/UI'
import { findVehicle, money, paintImage } from '../data/vehicles'
import { total } from '../features/configurator/configuration'
import type { SavedConfiguration } from '../features/configurator/configuration'
import { VehicleRow } from '../features/vehicles/VehicleRow'
import { useMeta } from '../hooks/useMeta'
import { useGarage } from '../stores/garage'
function Build({item}:{item:SavedConfiguration}){
  const [editing,setEditing]=useState(false)
  const [name,setName]=useState(item.name)
  const rename=useGarage(state=>state.rename)
  const duplicate=useGarage(state=>state.duplicate)
  const remove=useGarage(state=>state.remove)
  const car=findVehicle(item.slug)!
  return <article className="lineup-row"><Link className="lineup-image" to={`/configure/${car.slug}?build=${encodeURIComponent(item.id)}`}><img src={paintImage(car,item.configuration.paint)} alt={`Edit ${item.name}`} loading="lazy"/></Link><div><small>{car.model} / {new Date(item.created).toLocaleDateString()}</small><h3>{item.name}</h3><p className="technical">{money(total(car,item.configuration))}</p>{editing?<form className="actions" onSubmit={event=>{event.preventDefault();rename(item.id,name);setEditing(false)}}><label>Build name<input autoFocus required maxLength={80} value={name} onChange={event=>setName(event.target.value)}/></label><button className="button">Save name</button><button type="button" className="button secondary" onClick={()=>setEditing(false)}>Cancel</button></form>:<div className="actions"><CTA to={`/configure/${car.slug}?build=${encodeURIComponent(item.id)}`}>Edit build</CTA><button className="button secondary" onClick={()=>{setName(item.name);setEditing(true)}}>Rename</button><button className="button secondary" onClick={()=>duplicate(item.id)}>Duplicate</button><button className="button secondary" onClick={()=>remove(item.id)}>Remove</button></div>}</div></article>
}
export default function Garage(){
  const favourites=useGarage(state=>state.favourites)
  const saved=useGarage(state=>state.saved)
  useMeta('My Garage','Return to your favourite VELOCITY vehicles and saved configurations.')
  return <section className="wrap subpage garage-page"><div className="eyebrow"><span className="signal"/> PERSONAL GARAGE</div><h1>YOUR GARAGE<span className="accent">.</span></h1><div className="garage-index"><p>Favourites and builds saved in this browser.</p><span>{saved.length} BUILDS</span><span>{favourites.length} FAVOURITES</span></div><div className="garage-section"><Heading index="01 / BUILDS" title="SAVED CONFIGURATIONS."/>{saved.length?saved.map(item=><Build item={item} key={item.id}/>):<div className="empty"><p>Your first saved configuration will appear here.</p><CTA to="/configure/vxr-01">Open the Studio</CTA></div>}</div><div className="garage-section"><Heading index="02 / FAVOURITES" title="FAVOURITE VEHICLES."/>{favourites.length?favourites.map(slug=><VehicleRow vehicle={findVehicle(slug)!} key={slug}/>):<div className="empty"><p>Favourite a vehicle to keep it close.</p><CTA secondary to="/collection">Browse the Collection</CTA></div>}</div></section>
}
