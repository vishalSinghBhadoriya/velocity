import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUp, Menu, X } from 'lucide-react'
import { MotionConfig } from 'motion/react'
import Lenis from 'lenis'
const links=[['Collection','/collection'],['Configuration Studio','/configure/vxr-01'],['Performance Lab','/performance'],['My Garage','/garage']]
export function Layout({children}:{children:ReactNode}){
  const {pathname}=useLocation()
  const menu=useRef<HTMLDialogElement>(null)
  const trigger=useRef<HTMLButtonElement>(null)
  const main=useRef<HTMLElement>(null)
  const previous=useRef(pathname)
  useEffect(()=>{
    window.scrollTo({top:0,behavior:'instant'})
    if(previous.current!==pathname){main.current?.focus({preventScroll:true});previous.current=pathname}
  },[pathname])
  useEffect(()=>{
    const preferences=matchMedia('(prefers-reduced-motion: reduce) and (min-width: 900px)')
    const desktop=matchMedia('(min-width: 900px) and (pointer: fine)')
    let lenis:Lenis|undefined
    function sync(){lenis?.destroy();lenis=!preferences.matches && desktop.matches?new Lenis({autoRaf:true}):undefined}
    sync()
    preferences.addEventListener('change',sync);desktop.addEventListener('change',sync)
    return ()=>{preferences.removeEventListener('change',sync);desktop.removeEventListener('change',sync);lenis?.destroy()}
  },[])
  useEffect(()=>{
    const sync=()=>document.documentElement.classList.toggle('scrolled',window.scrollY>50)
    sync();window.addEventListener('scroll',sync,{passive:true})
    return ()=>window.removeEventListener('scroll',sync)
  },[])
  return <MotionConfig reducedMotion="user"><a className="skip" href="#main" onClick={event=>{event.preventDefault();main.current?.focus();main.current?.scrollIntoView()}}>Skip to content</a><header className="site-header">
    <Link className="wordmark" to="/" aria-label="Velocity home"><span>V</span>ELOCITY<span className="wordmark-dot">.</span></Link>
    <nav aria-label="Main navigation">{links.map(([label,path])=><NavLink key={path} to={path} className={({isActive})=>isActive || (path.startsWith('/configure') && pathname.startsWith('/configure/'))?'active':undefined}>{label}</NavLink>)}</nav>
    <button ref={trigger} className="menu-trigger" aria-label="Open navigation" aria-haspopup="dialog" onClick={()=>menu.current?.showModal()}><Menu size={21}/><span>MENU</span></button>
  </header>
  <dialog ref={menu} className="menu-dialog" aria-label="Site navigation" onClose={()=>{if(!main.current?.contains(document.activeElement))trigger.current?.focus()}}>
    <button className="icon" aria-label="Close navigation" onClick={()=>menu.current?.close()}><X/></button>
    <nav>{[['Home','/'],...links,['About','/about']].map(([label,path])=><NavLink key={path} end={path==='/'} to={path} onClick={()=>menu.current?.close()}>{label}</NavLink>)}</nav>
  </dialog>
  <main id="main" ref={main} tabIndex={-1}><div key={pathname} className={pathname==='/'?'route-home':'route-reveal'}>{children}</div></main>
  <footer className="footer wrap">
    <div className="footer-top"><p>Independent frontend development concept.<br/>Vehicles and specifications are fictional.</p><nav aria-label="Footer navigation">{[...links,['About','/about']].map(([label,path])=><Link key={path} to={path}>{label}</Link>)}</nav><button className="icon" onClick={()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})} aria-label="Back to top"><ArrowUp/></button></div>
    <div className="footer-logo" aria-hidden="true">VELOCITY<span>.</span></div><small>© {new Date().getFullYear()} VELOCITY CONCEPT</small>
  </footer></MotionConfig>
}
