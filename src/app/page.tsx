import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { OperationalProblem } from '@/components/sections/OperationalProblem';
import { ErpSolutions } from '@/components/sections/ErpSolutions';
import { AgentSolutions } from '@/components/sections/AgentSolutions';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { WhySutur } from '@/components/sections/WhySutur';
import { Team } from '@/components/sections/Team';
import BookCall from '@/components/sections/BookCall';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="section-divider" />
        <OperationalProblem />
        <div className="section-divider" />
        <ErpSolutions />
        <div className="section-divider" />
        <AgentSolutions />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <WhySutur />
        <div className="section-divider" />
        <Team />
        <div className="section-divider" />
        <BookCall />
      </main>
      <Footer />
    </>
  );
}