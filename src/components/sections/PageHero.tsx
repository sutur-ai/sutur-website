import type { ReactNode } from 'react';

interface PageHeroProps {
  title: ReactNode;
  description: string;
}

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </div>
    </section>
  );
}
