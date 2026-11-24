import { useEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
export function useStory(scope:RefObject<HTMLDivElement|null>){
  useEffect(()=>{
    const root=scope.current
    if(!root)return
    const responsive=gsap.matchMedia()
    responsive.add('(prefers-reduced-motion: no-preference)',()=>{
      if(root.querySelector('.campaign-hero')){
        gsap.timeline({defaults:{ease:'power3.out'}})
          .from('[data-hero-frame]',{clipPath:'inset(0 100% 0 0)',duration:.55,clearProps:'clipPath'},0)
          .from('[data-hero-photo]',{scale:1.035,opacity:.5,duration:.9,clearProps:'transform,opacity'},0)
          .from('[data-hero-line]',{yPercent:105,duration:.7,stagger:.09,clearProps:'transform'},.13)
          .from('[data-hero-model]',{y:16,opacity:0,duration:.42,clearProps:'transform,opacity'},.34)
          .from('[data-hero-actions]',{y:8,duration:.35,clearProps:'transform'},.37)
      }
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element=>{
        gsap.from(element,{clipPath:'inset(0 100% 0 0)',duration:.75,ease:'power3.out',scrollTrigger:{trigger:element,start:'top 89%'}})
      })
      gsap.utils.toArray<HTMLElement>('[data-counter]').forEach(element=>{
        const target=Number(element.dataset.counter)
        const value={current:0}
        gsap.to(value,{current:target,duration:1.25,ease:'power2.out',scrollTrigger:{trigger:element,start:'top 92%',once:true},onUpdate:()=>{element.textContent=value.current.toLocaleString('en-US',{maximumFractionDigits:target%1?1:0})}})
      })
    },root)
    responsive.add('(min-width: 1050px) and (pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
      const hero=root.querySelector<HTMLElement>('.hero')
      const image=root.querySelector<HTMLElement>('.hero-image')
      const move=(event:PointerEvent)=>{
        if(event.pointerType!=='mouse')return
        gsap.to(image,{x:(event.clientX/innerWidth-.5)*9,y:(event.clientY/innerHeight-.5)*6,duration:.55,overwrite:'auto'})
      }
      hero?.addEventListener('pointermove',move)
      const rail=root.querySelector<HTMLElement>('.story-rail')
      const panels=gsap.utils.toArray<HTMLElement>('.story-panel')
      if(rail && panels.length){
        rail.classList.add('is-cinematic')
        gsap.set(panels.slice(1),{autoAlpha:0})
        const sequence=gsap.timeline({scrollTrigger:{trigger:rail,pin:true,scrub:.45,end:()=>'+='+Math.min(innerWidth*1.2,1600),invalidateOnRefresh:true}})
        panels.slice(1).forEach((panel,index)=>{
          sequence.to(panels[index],{autoAlpha:0,duration:.28},index+.55)
            .fromTo(panel,{autoAlpha:0,clipPath:'inset(0 0 0 12%)'},{autoAlpha:1,clipPath:'inset(0)',duration:.34},index+.55)
        })
        sequence.to({}, {duration:.36})
      }
      return ()=>{hero?.removeEventListener('pointermove',move);gsap.killTweensOf(image);rail?.classList.remove('is-cinematic')}
    },root)
    return ()=>responsive.revert()
  },[scope])
}
