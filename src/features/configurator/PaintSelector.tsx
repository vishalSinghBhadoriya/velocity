import type { Option } from '../../data/vehicles'
export function PaintSelector({options,current,onChange}:{options:Option[];current:string;onChange:(id:string)=>void}){
  return <fieldset className="paint-field"><legend>Exterior paint</legend><div className="swatches">{options.map(option=><button type="button" className="swatch" key={option.id} aria-label={option.name} aria-pressed={current===option.id} title={option.name} style={{backgroundColor:option.color}} onClick={()=>onChange(option.id)}/>)}</div></fieldset>
}
