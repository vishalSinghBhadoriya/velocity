import { vehicles } from '../../data/vehicles'
export function queryVehicles(search='',category='',minimum=0,sort='') {
  const query = search.trim().toLowerCase()
  const results = vehicles.filter(vehicle=>`${vehicle.model} ${vehicle.category} ${vehicle.powertrain}`.toLowerCase().includes(query) && (!category || vehicle.category===category) && vehicle.hp>=minimum)
  if(sort==='low') results.sort((a,b)=>a.price-b.price)
  if(sort==='high') results.sort((a,b)=>b.price-a.price)
  return results
}
