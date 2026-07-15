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
        <OperationalProblem />
        <ErpSolutions />
        <AgentSolutions />
        <HowItWorks />
        <WhySutur />
        <Team />
        <BookCall />
      </main>
      <Footer />
    </>
  );
}