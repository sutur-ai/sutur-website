import { Header } from '@/components/layout/Header';
import { MotionToggle } from '@/components/layout/MotionToggle';
import { Footer } from '@/components/layout/Footer';
import { FloatingCta } from '@/components/layout/FloatingCta';
import { SectionShell } from '@/components/layout/SectionShell';
import { Hero } from '@/components/hero/Hero';
import { AppsStrip } from '@/components/apps/AppsStrip';
import { Capabilities } from '@/components/capabilities/Capabilities';
import { UseCases } from '@/components/sections/UseCases';
import { Control } from '@/components/sections/Control';
import { HowYouStart } from '@/components/sections/HowYouStart';
import { Faq } from '@/components/sections/Faq';
import { Booking } from '@/components/booking/Booking';

export default function Home() {
  return <div className="sx"><MotionToggle /><div className="page">
    <Header />
    <main>
      <Hero /><AppsStrip /><Capabilities /><UseCases /><Control /><HowYouStart /><Faq />
      <SectionShell id="book" className="booking-section"><div className="wrap">
        <div className="sec-head rv"><div className="label"><b>06</b> Book a demo</div>
          <h2 className="h-section">See Rafic do your <span className="nowrap">work<span className="dot">.</span></span></h2>
          <p className="lead">Thirty minutes, one real task from your week, done live on the tools you already use.</p>
        </div>
        <Booking />
      </div></SectionShell>
    </main>
    <Footer /><FloatingCta />
  </div></div>;
}
