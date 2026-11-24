import { useEffect, useMemo, useState } from 'react'
import { Heading } from '../components/UI'
import { money, specs, vehicles } from '../data/vehicles'
import { Speedometer } from '../features/performance/Speedometer'
import type { Metric } from '../features/performance/ComparisonChart'
import { ComparisonChart } from '../features/performance/ComparisonChart'
import { accelerationAt, powerToWeight } from '../features/performance/metrics'
import { useGarage } from '../stores/garage'
import { useMeta } from '../hooks/useMeta'
export default function Performance(){
  const selection=useGarage(state=>state.comparison)
  const compare=useGarage(state=>state.compare)
  const [metric,setMetric]=useState<Metric>('hp')
  const [elapsed,setElapsed]=useState(0)
  const [run,setRun]=useState(0)
  const [running,setRunning]=useState(false)
  const selected=useMemo(()=>selection.flatMap(slug=>vehicles.filter(car=>car.slug===slug)),[selection])
  const duration=Math.max(0,...selected.map(car=>car.zero))
  useMeta('Performance Lab','Compare fictional VELOCITY specs, power-to-weight ratios and acceleration.')
  useEffect(()=>{
    if(!run)return
    let frame=0
    let last=0
    const start=performance.now()
    const tick=(now:number)=>{
      const time=Math.min(duration,(now-start)/1000)
      if(time===duration || Math.floor(time*24)!==Math.floor(last*24)){setElapsed(time);last=time}
      if(time<duration)frame=requestAnimationFrame(tick)
      else setRunning(false)
    }
    frame=requestAnimationFrame(tick)
    return ()=>cancelAnimationFrame(frame)
  },[run,duration])
  function simulate(){
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){setElapsed(duration);return}
    setRunning(true);setElapsed(0);setRun(value=>value+1)
  }
  return <section className="wrap subpage lab-page"><div className="eyebrow"><span className="signal"/> PERFORMANCE LAB</div><h1>THE NUMBERS<span className="accent">.</span></h1><p>Select up to three vehicles. All figures are fictional concept specifications.</p><div className="actions lab-selection">{vehicles.map(car=><button className="button secondary" key={car.id} aria-pressed={selection.includes(car.slug)} disabled={selection.length===3&&!selection.includes(car.slug)} onClick={()=>{setRun(0);setElapsed(0);setRunning(false);compare(car.slug)}}>{car.model}</button>)}</div>
  {selected.length===0?<div className="empty"><p>Select a model to view its concept specifications.</p></div>:<>
    <div className="gauge-row">{selected.map((car,index)=><Speedometer car={car} index={index} key={car.id}/>)}</div>
    <div className="lab-grid"><div><label>Chart metric<select value={metric} onChange={event=>setMetric(event.target.value as typeof metric)}>{specs.map(spec=><option value={spec.key} key={spec.key}>{spec.label}</option>)}<option value="powerToWeight">Power-to-weight</option></select></label><ComparisonChart vehicles={selected} metric={metric}/></div><div className="acceleration"><Heading index="ILLUSTRATIVE SIMULATION" title="0–100 KM/H."/><p>Linear interpolation of the published sprint times.</p><button className="button" onClick={simulate}>{running?'Restart sprint':'Run sprint'}</button><p className="technical">{elapsed.toFixed(2)} s elapsed</p>{selected.map(car=><div key={car.id}><label>{car.model} · {accelerationAt(car,elapsed)} km/h<progress max={100} value={accelerationAt(car,elapsed)}/></label></div>)}</div></div>
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Comparison data"><table><caption>Vehicle comparison</caption><thead><tr><th scope="col">Specification</th>{selected.map(car=><th scope="col" key={car.id}>{car.model}</th>)}</tr></thead><tbody>{specs.map(spec=><tr key={spec.key}><th scope="row">{spec.label}</th>{selected.map(car=><td key={car.id}>{car[spec.key].toLocaleString()} {spec.unit}</td>)}</tr>)}<tr><th scope="row"><abbr title="Horsepower divided by curb weight in metric tonnes">Power-to-weight</abbr></th>{selected.map(car=><td key={car.id}>{powerToWeight(car)} hp/t</td>)}</tr><tr><th scope="row">Base price</th>{selected.map(car=><td key={car.id}>{money(car.price)}</td>)}</tr></tbody></table></div>
  </>}</section>
}
