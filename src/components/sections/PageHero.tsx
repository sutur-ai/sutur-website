import type { ReactNode } from 'react';

interface PageHeroProps {
  kicker: string;
  title: ReactNode;
  description: string;
}

export function PageHero({ kicker, title, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <div>
          <p className="page-kicker">{kicker}</p>
          <h1>{title}</h1>
        </div>
        <p className="lead">{description}</p>
      </div>
    </section>
  );
}
