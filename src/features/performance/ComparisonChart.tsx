import { memo } from 'react'
import type { Vehicle } from '../../data/vehicles'
import { specs } from '../../data/vehicles'
import { powerToWeight } from './metrics'

export type Metric=(typeof specs)[number]['key']|'powerToWeight'

export const ComparisonChart=memo(function ComparisonChart({vehicles,metric='hp'}:{vehicles:Vehicle[];metric?:Metric}){
  const spec=metric==='powerToWeight'?{label:'Power-to-weight',unit:'hp/t'}:specs.find(item=>item.key===metric)!
  const rows=vehicles.map(car=>({model:car.model,value:metric==='powerToWeight'?powerToWeight(car):car[metric]}))
  const maximum=Math.max(1,...rows.map(row=>row.value))
  return <figure className="chart">
    <figcaption>{spec.label} / {spec.unit}</figcaption>
    <div aria-hidden="true" className="chart-scale"><span>0</span><span>{maximum.toLocaleString('en-US')} {spec.unit}</span></div>
    <ul className="instrument-chart" key={metric}>{rows.map(row=><li className="instrument-lane" key={row.model}>
      <span>{row.model}</span>
      <svg viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><rect width={row.value/maximum*100} height="16"/></svg>
      <strong>{row.value.toLocaleString('en-US')} {spec.unit}</strong>
    </li>)}</ul>
  </figure>
})
