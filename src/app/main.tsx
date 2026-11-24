import { Component, StrictMode, Suspense, lazy } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../layouts/Layout'
import '../styles/site.css'
import '../styles/campaign.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/barlow-condensed/800.css'
import '@fontsource/space-grotesk/400.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/ibm-plex-mono/400.css'

const Home = lazy(()=>import('../pages/Home'))
const Collection = lazy(()=>import('../pages/Collection'))
const Vehicle = lazy(()=>import('../pages/Vehicle'))
const Configure = lazy(()=>import('../pages/Configure'))
const Performance = lazy(()=>import('../pages/Performance'))
const Garage = lazy(()=>import('../pages/Garage'))
const About = lazy(()=>import('../pages/About'))
const Missing = lazy(()=>import('../pages/Missing'))
const Router = import.meta.env.BASE_URL === '/velocity/' ? HashRouter : BrowserRouter

class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render(){
    return this.state.failed?<main className="wrap subpage"><h1>Something went wrong.</h1><button className="button" onClick={()=>location.reload()}>Reload VELOCITY</button></main>:this.props.children
  }
}
createRoot(document.getElementById('root')!).render(<StrictMode><ErrorBoundary><Router><Layout><Suspense fallback={<div role="status" className="wrap subpage route-loading">Loading…</div>}><Routes>
  <Route index element={<Home/>}/><Route path="collection" element={<Collection/>}/><Route path="vehicle/:slug" element={<Vehicle/>}/><Route path="configure/:slug" element={<Configure/>}/><Route path="performance" element={<Performance/>}/><Route path="garage" element={<Garage/>}/><Route path="about" element={<About/>}/><Route path="*" element={<Missing/>}/>
</Routes></Suspense></Layout></Router></ErrorBoundary></StrictMode>)
