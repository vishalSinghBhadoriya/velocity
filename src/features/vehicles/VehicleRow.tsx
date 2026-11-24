import { Heart, Plus, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Image, SectionLink } from '../../components/UI'
import { money } from '../../data/vehicles'
import type { Vehicle } from '../../data/vehicles'
import { useGarage } from '../../stores/garage'
export function GarageButton({vehicle}:{vehicle:Vehicle}){
  const active=useGarage(state=>state.favourites.includes(vehicle.slug))
  const toggle=useGarage(state=>state.favourite)
  return <button className="icon" aria-label={`Favourite ${vehicle.model}`} aria-pressed={active} onClick={()=>toggle(vehicle.slug)}><Heart fill={active?'currentColor':'none'} size={18}/></button>
}
export function CompareButton({vehicle}:{vehicle:Vehicle}){
  const selected=useGarage(state=>state.comparison.includes(vehicle.slug))
  const maxed=useGarage(state=>state.comparison.length>=3)
  const toggle=useGarage(state=>state.compare)
  return <button className="icon" title={maxed&&!selected?'Comparison holds up to three vehicles':'Toggle comparison'} disabled={maxed&&!selected} aria-label={`Compare ${vehicle.model}`} aria-pressed={selected} onClick={()=>toggle(vehicle.slug)}>{selected?<Check size={18}/>:<Plus size={18}/>}</button>
}
export function VehicleRow({vehicle}:{vehicle:Vehicle}){
  return <article className="lineup-row"><Link className="lineup-image" to={`/vehicle/${vehicle.slug}`} aria-label={`Explore ${vehicle.model}`}><Image file={vehicle.image} alt={`${vehicle.model} concept exterior`}/></Link><div><small>{vehicle.id} / {vehicle.category}</small><h3>{vehicle.model}</h3><p>{vehicle.description}</p><p className="technical">{vehicle.hp.toLocaleString()} hp · {vehicle.speed} km/h · {money(vehicle.price)}</p><div className="actions"><SectionLink to={`/vehicle/${vehicle.slug}`}>Vehicle details</SectionLink><GarageButton vehicle={vehicle}/><CompareButton vehicle={vehicle}/></div></div></article>
}
