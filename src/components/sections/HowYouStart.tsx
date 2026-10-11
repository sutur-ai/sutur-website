import { SectionShell } from '@/components/layout/SectionShell';
import { Founders } from './Founders';
export function HowYouStart() {
  return <SectionShell id="start" className="sec glow"><div className="wrap">
    <div className="sec-head rv"><div className="label"><b>04</b> How you start</div>
      <h2 className="h-section">Drop it in{'\u2060'}<span className="dot">.</span> Use it fully{'\u2060'}<span className="dot">.</span></h2><p className="lead">No setup project, no migration. After one call, your team is using Rafic to its full potential.</p></div>
    <Founders />
  </div></SectionShell>;
}
