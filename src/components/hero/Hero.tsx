import { SectionShell } from '@/components/layout/SectionShell';
export function Hero() {
  return <SectionShell id="top" className="hero" style={{ padding: 'clamp(40px,4cqi,80px) 0 clamp(32px,3cqi,56px)' }}><div className="wrap sec-head">
    <div className="label">Meet Rafic, the AI assistant by Sutur</div>
    <h1 className="disp" style={{ fontSize: 'clamp(36px,4.4cqi,80px)', lineHeight: 1.06 }}>Rafic does the work<span className="dot">.</span><br /><em style={{ fontStyle: 'normal' }}>You approve what matters<span className="dot">.</span></em></h1>
    <p className="lead">One assistant for your whole team. It works in your email, your business apps and on your computer, keeps going while you&apos;re away, and asks before anything is sent or deleted.</p>
  </div></SectionShell>;
}
