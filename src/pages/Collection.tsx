import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CTA } from '../components/UI'
import { vehicles } from '../data/vehicles'
import { queryVehicles } from '../features/vehicles/catalog'
import { VehicleRow } from '../features/vehicles/VehicleRow'
import { useGarage } from '../stores/garage'
import { useMeta } from '../hooks/useMeta'
export default function Collection(){
  const [search,setSearch]=useState('')
  const [category,setCategory]=useState('')
  const [minimum,setMinimum]=useState(0)
  const [sort,setSort]=useState('')
  const count=useGarage(state=>state.comparison.length)
  const results=queryVehicles(search,category,minimum,sort)
  useMeta('The Collection','Explore four fictional performance concepts by power, price and vehicle category.')
  return <section className="wrap subpage collection-page"><header className="route-heading"><div className="eyebrow"><span className="signal"/> THE COLLECTION</div><h1>FOUR MACHINES<span className="accent">.</span></h1><p>From the VXR-01 hypercar to the all-electric VXR-E.</p></header>
    <div className="filters"><label>Search models<input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="Model or powertrain"/></label><label>Category<select value={category} onChange={event=>setCategory(event.target.value)}><option value="">All categories</option>{vehicles.map(vehicle=><option key={vehicle.id}>{vehicle.category}</option>)}</select></label><label>Minimum output<select value={minimum} onChange={event=>setMinimum(Number(event.target.value))}><option value={0}>Any power</option><option value={600}>600 hp</option><option value={900}>900 hp</option></select></label><label>Sort by<select value={sort} onChange={event=>setSort(event.target.value)}><option value="">Model order</option><option value="low">Price · low to high</option><option value="high">Price · high to low</option></select></label></div>
    <div className="result-bar"><p aria-live="polite">{results.length} {results.length===1?'vehicle':'vehicles'}</p><CTA secondary to="/performance">Compare ({count}/3)</CTA></div>
    {results.length===0&&<div className="empty"><h2>No matching vehicles.</h2><button className="button" onClick={()=>{setSearch('');setCategory('');setMinimum(0);setSort('')}}>Clear filters</button></div>}
    <div className="campaign-list"><AnimatePresence initial={false}>{results.map(vehicle=><motion.div layout="position" key={vehicle.slug} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><VehicleRow vehicle={vehicle}/></motion.div>)}</AnimatePresence></div>
  </section>
}
