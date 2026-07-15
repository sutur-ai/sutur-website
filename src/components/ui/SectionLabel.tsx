interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <span
      className={`inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[var(--sutur-data-violet)] ${className}`}
    >
      {children}
    </span>
  );
}
