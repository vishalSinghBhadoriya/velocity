import { useParams } from 'react-router-dom'
import { VehicleGallery } from '../features/vehicles/VehicleGallery'
import { CTA, Heading, Image } from '../components/UI'
import { findVehicle, money, specs, vehicles } from '../data/vehicles'
import type { Vehicle as Car } from '../data/vehicles'
import { GarageButton, VehicleRow } from '../features/vehicles/VehicleRow'
import { ComparisonChart } from '../features/performance/ComparisonChart'
import { useMeta } from '../hooks/useMeta'
import Missing from './Missing'
export default function Vehicle(){
  const car=findVehicle(useParams().slug)
  return car?<VehicleDetail key={car.slug} car={car}/>:<Missing/>
}
function VehicleDetail({car}:{car:Car}){
  useMeta(car.model,car.description)
  return <><section className="detail-hero"><Image file={car.image} alt={`${car.model} concept exterior`} eager/><div className="wrap"><div className="eyebrow"><span className="signal"/> {car.id} / {car.category}</div><h1>{car.model}<span className="accent">.</span></h1><p>{car.description}</p><div className="actions"><CTA to={`/configure/${car.slug}`}>Configure This Vehicle</CTA><GarageButton vehicle={car}/></div></div></section>
    <section className="wrap section"><Heading index="01 / GALLERY" title="CLOSER LOOK."/><VehicleGallery car={car}/></section>
    <section className="light"><div className="wrap section"><Heading index="02 / SPECIFICATIONS" title="THE MECHANICS."><p>Fictional concept specifications</p></Heading><dl className="spec-list">{specs.map(spec=><div key={spec.key}><dt>{spec.label}</dt><dd>{car[spec.key].toLocaleString()} {spec.unit}</dd></div>)}<div><dt>Powertrain</dt><dd>{car.powertrain}</dd></div><div><dt>Transmission</dt><dd>{car.transmission}</dd></div><div><dt>Base price</dt><dd>{money(car.price)}</dd></div></dl></div></section>
    <section className="wrap section manifesto"><ComparisonChart vehicles={[car]}/><div><Heading index="03 / STUDIO" title="EXTERIOR FINISHES."/><ul className="finish-list">{car.paints.map(option=><li key={option.id}><i style={{background:option.color}}/>{option.name}</li>)}</ul><CTA to={`/configure/${car.slug}`}>Open Studio</CTA></div></section>
    <section className="wrap section"><Heading index="04 / RELATED" title="IN THE COLLECTION."/><VehicleRow vehicle={vehicles[(vehicles.indexOf(car)+1)%vehicles.length]}/></section>
  </>
}
