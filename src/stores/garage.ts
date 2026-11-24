import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { findVehicle } from '../data/vehicles'
import { validate } from '../features/configurator/configuration'
import type { Configuration, SavedConfiguration } from '../features/configurator/configuration'

interface Garage {
  favourites: string[]; comparison: string[]; saved: SavedConfiguration[]; drafts: Record<string,Configuration>
  favourite: (slug: string) => void; compare: (slug: string) => void
  setDraft: (slug: string, configuration: Configuration) => void
  save: (slug: string,name: string,configuration: Configuration,id?: string) => string
  rename: (id: string,name: string) => void; duplicate: (id: string) => void; remove: (id: string) => void
}
const toggle = (items: string[], slug: string) => items.includes(slug)?items.filter(item=>item!==slug):[...items,slug]
export function restoreGarage(data: unknown) {
  const raw = (data && typeof data==='object' ? data : {}) as Partial<Garage>
  const slugs = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((slug): slug is string=>typeof slug==='string' && !!findVehicle(slug)))] : []
  const saved = Array.isArray(raw.saved) ? raw.saved.flatMap(item=>{
    const vehicle = findVehicle(item?.slug)
    return vehicle && typeof item.id==='string' && typeof item.name==='string' && typeof item.created==='string' && Number.isFinite(Date.parse(item.created)) ? [{...item,configuration:validate(vehicle,item.configuration??{})}] : []
  }) : []
  return {favourites:slugs(raw.favourites),comparison:slugs(raw.comparison).slice(0,3),saved}
}
export const useGarage = create<Garage>()(persist((set,get)=>({
  favourites:[],comparison:[],saved:[],drafts:{},
  favourite:slug=>set(state=>({favourites:toggle(state.favourites,slug)})),
  compare:slug=>set(state=>({comparison:state.comparison.length>=3 && !state.comparison.includes(slug)?state.comparison:toggle(state.comparison,slug)})),
  setDraft:(slug,configuration)=>set(state=>({drafts:{...state.drafts,[slug]:configuration}})),
  save:(slug,name,configuration,id)=>{
    const existing=get().saved.find(item=>item.id===id && item.slug===slug)
    const record={id:existing?.id??crypto.randomUUID(),slug,name:name.trim()||'Untitled build',configuration,created:existing?.created??new Date().toISOString()}
    set(state=>({saved:existing?state.saved.map(item=>item.id===record.id?record:item):[...state.saved,record]}))
    return record.id
  },
  rename:(id,name)=>set(state=>({saved:state.saved.map(item=>item.id===id && name.trim()?{...item,name:name.trim()}:item)})),
  duplicate:id=>{
    const existing=get().saved.find(item=>item.id===id)
    if(existing) get().save(existing.slug,`${existing.name} copy`,existing.configuration)
  },
  remove:id=>set(state=>({saved:state.saved.filter(item=>item.id!==id)})),
}),{name:'velocity-garage-v1',partialize:({favourites,comparison,saved})=>({favourites,comparison,saved}),merge:(stored,current)=>({...current,...restoreGarage(stored)})}))
