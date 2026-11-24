import type { Vehicle } from '../../data/vehicles'
export interface Configuration { paint: string; wheel: string; interior: string; packages: string[] }
export interface SavedConfiguration { id: string; slug: string; name: string; created: string; configuration: Configuration }
export function defaults(vehicle: Vehicle): Configuration {
  return {paint:vehicle.paints[0].id,wheel:vehicle.wheels[0].id,interior:vehicle.interiors[0].id,packages:[]}
}
export function validate(vehicle: Vehicle, candidate: Partial<Configuration> = {}): Configuration {
  const base = defaults(vehicle)
  return {
    paint: vehicle.paints.find(option=>option.id===candidate.paint)?.id ?? base.paint,
    wheel: vehicle.wheels.find(option=>option.id===candidate.wheel)?.id ?? base.wheel,
    interior: vehicle.interiors.find(option=>option.id===candidate.interior)?.id ?? base.interior,
    packages: vehicle.packages.filter(option=>Array.isArray(candidate.packages) && candidate.packages.includes(option.id)).map(option=>option.id),
  }
}
export function priceLines(vehicle: Vehicle, candidate: Configuration) {
  const config = validate(vehicle,candidate)
  return [
    {name:'Base vehicle',price:vehicle.price},
    ...vehicle.paints.filter(option=>option.id===config.paint),
    ...vehicle.wheels.filter(option=>option.id===config.wheel),
    ...vehicle.interiors.filter(option=>option.id===config.interior),
    ...vehicle.packages.filter(option=>config.packages.includes(option.id)),
  ]
}
export const total = (vehicle: Vehicle, config: Configuration) => priceLines(vehicle,config).reduce((sum,line)=>sum+line.price,0)
export const togglePackage = (config: Configuration, id: string): Configuration => ({...config,packages:config.packages.includes(id)?config.packages.filter(item=>item!==id):[...config.packages,id]})
export function fromQuery(vehicle: Vehicle, search: string) {
  const params = new URLSearchParams(search)
  return validate(vehicle,{paint:params.get('paint')??undefined,wheel:params.get('wheel')??undefined,interior:params.get('interior')??undefined,packages:params.getAll('package')})
}
export function toQuery(config: Configuration) {
  const query = new URLSearchParams({paint:config.paint,wheel:config.wheel,interior:config.interior})
  config.packages.forEach(id=>query.append('package',id))
  return query.toString()
}
