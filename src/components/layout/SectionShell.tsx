import type { ComponentPropsWithoutRef } from 'react';

export type SectionId = 'top' | 'what' | 'teams' | 'control' | 'start' | 'faq' | 'book';
export function SectionShell({ id, className = 'sec', children, ...props }: Omit<ComponentPropsWithoutRef<'section'>, 'id'> & { id: SectionId }) {
  return <section id={id} className={className} {...props}>{children}</section>;
}
