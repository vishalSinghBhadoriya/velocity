import { CTA } from '../components/UI'
import { useMeta } from '../hooks/useMeta'
export default function Missing(){
  useMeta('Page not found','Return to the VELOCITY collection.')
  return <section className="wrap subpage missing-page"><div className="eyebrow"><i className="signal"/> 404</div><h1>OFF <span className="outline-type">TRACK.</span></h1><p>This page or model is unavailable.</p><CTA to="/collection">Back to Collection</CTA></section>
}
