// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { vehicles } from '../data/vehicles'
import { defaults, fromQuery, togglePackage, total } from '../features/configurator/configuration'
import { PaintSelector } from '../features/configurator/PaintSelector'
import { queryVehicles } from '../features/vehicles/catalog'
import { accelerationAt, powerToWeight } from '../features/performance/metrics'
import { restoreGarage, useGarage } from '../stores/garage'
const flagship=vehicles[0]
afterEach(cleanup)
describe('vehicle catalogue',()=>{
  it('combines case-insensitive search, category and power filters',()=>{
    expect(queryVehicles('   electric ','Electric Performance Concept',900).map(car=>car.slug)).toEqual(['vxr-e'])
    expect(queryVehicles('electric','Grand Tourer')).toEqual([])
  })
  it('sorts prices in either direction without changing the dataset',()=>{
    expect(queryVehicles('','',0,'low').map(car=>car.id)).toEqual(['03','02','04','01'])
    expect(queryVehicles('','',0,'high').map(car=>car.id)).toEqual(['01','04','02','03'])
    expect(vehicles[0]).toBe(flagship)
  })
})
describe('configurator',()=>{
  it('deduplicates charges and ignores unknown packages',()=>{
    expect(total(flagship,{...defaults(flagship),paint:'red',packages:['track','track','bogus']})).toBe(839400)
  })
  it('adds and removes a package and resets to factory choices',()=>{
    const original=defaults(flagship)
    const selected=togglePackage(original,'track')
    expect(selected.packages).toEqual(['track'])
    expect(togglePackage(selected,'track')).toEqual(original)
    expect(total(flagship,defaults(flagship))).toBe(flagship.price)
  })
  it('validates URL values against the current vehicle',()=>{
    const search='?paint=red&wheel=bad&interior=bad&package=track&package=track&package=bogus'
    expect(fromQuery(flagship,search)).toEqual({...defaults(flagship),paint:'red',packages:['track']})
    expect(fromQuery(vehicles[1],search).paint).toBe('factory')
  })
  it('exposes a keyboard-addressable button for each supported finish',()=>{
    let selected='silver'
    render(createElement(PaintSelector,{options:flagship.paints,current:selected,onChange:id=>{selected=id}}))
    expect(screen.getByRole('button',{name:'Titanium Silver'}).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button',{name:'Velocity Red'}))
    expect(selected).toBe('red')
  })
})
describe('garage and performance',()=>{
  it('writes saved builds to localStorage and restores them on hydration',async()=>{
    const id=useGarage.getState().save(flagship.slug,'Apex',defaults(flagship))
    const raw=localStorage.getItem('velocity-garage-v1')
    expect(raw).toContain(id)
    useGarage.setState({saved:[]})
    localStorage.setItem('velocity-garage-v1',raw!)
    await useGarage.persist.rehydrate()
    expect(useGarage.getState().saved[0].name).toBe('Apex')
    useGarage.getState().remove(id)
  })
  it('discards stale records and caps the comparison list',()=>{
    const slugs=vehicles.map(car=>car.slug)
    expect(restoreGarage({saved:[null,{slug:'invalid'}],comparison:[...slugs,'invalid'],favourites:[slugs[0],slugs[0]]})).toEqual({saved:[],comparison:slugs.slice(0,3),favourites:[slugs[0]]})
  })
  it('computes power to weight and clamps the sprint display',()=>{
    expect(powerToWeight(flagship)).toBe(738)
    expect(accelerationAt(flagship,1.2)).toBe(50)
    expect(accelerationAt(flagship,-2)).toBe(0)
    expect(accelerationAt(flagship,90)).toBe(100)
  })
})
