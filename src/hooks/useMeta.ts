import { useEffect } from 'react'
export function useMeta(title: string,description: string){
  useEffect(()=>{
    const fullTitle=`${title} — VELOCITY`
    document.title=fullTitle
    document.querySelector('meta[name="description"]')?.setAttribute('content',description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',fullTitle)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content',description)
  },[title,description])
}
