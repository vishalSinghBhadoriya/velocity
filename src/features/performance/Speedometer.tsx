import { memo, useId } from 'react'
import type { Vehicle } from '../../data/vehicles'

const maximum=420
const point=(angle:number,radius:number)=>[120+radius*Math.cos(angle*Math.PI/180),120+radius*Math.sin(angle*Math.PI/180)]
const ticks=Array.from({length:29},(_,index)=>{
  const angle=135+index*270/28
  return {inside:point(angle,index%4===0?84:91),outside:point(angle,97)}
})

export const Speedometer=memo(function Speedometer({car,index}:{car:Vehicle;index:number}){
  const title=useId()
  const needle=point(135+car.speed/maximum*270,70)
  return <figure className="speedometer">
    <figcaption><span>{String(index+1).padStart(2,'0')}</span>{car.model}</figcaption>
    <svg viewBox="0 0 240 216" role="img" aria-labelledby={title}>
      <title id={title}>{car.model} top speed {car.speed} kilometres per hour</title>
      <path className="dial-track" d="M 46.46 193.54 A 104 104 0 1 1 193.54 193.54" pathLength="100"/>
      <path className="dial-fill" d="M 46.46 193.54 A 104 104 0 1 1 193.54 193.54" pathLength="100" strokeDasharray={`${car.speed/maximum*100} 100`}/>
      {ticks.map(({inside,outside},tick)=><line key={tick} x1={inside[0]} y1={inside[1]} x2={outside[0]} y2={outside[1]} className={tick%4===0?'dial-major':'dial-tick'}/>)}
      <line className="dial-needle" x1="120" y1="120" x2={needle[0]} y2={needle[1]}/>
      <circle cx="120" cy="120" r="4" fill="currentColor"/>
      <text className="dial-value" x="120" y="169">{car.speed}</text>
      <text className="dial-unit" x="120" y="189">KM/H · TOP SPEED</text>
    </svg>
  </figure>
})
