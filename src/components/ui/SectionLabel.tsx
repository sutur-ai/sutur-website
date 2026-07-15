interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

export { SectionLabel };