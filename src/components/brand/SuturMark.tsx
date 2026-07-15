export default function SuturMark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-[var(--sutur-deep-interface)] ${className}`}>
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="6" fill="var(--sutur-deep-interface)" />
        <path d="M8 22V10h3l5 8 5-8h3v12h-3v-7l-4 6.5h-2l-4-6.5v7H8z" fill="var(--surface, #fffdfb)" />
      </svg>
      <span>Sutur</span>
    </span>
  );
}

export { SuturMark };