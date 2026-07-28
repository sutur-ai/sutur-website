export function SignalDot() {
  return (
    <>
      {/* word joiner - keeps the dot from wrapping away from the word it follows */}
      {'\u2060'}
      <span className="signal-dot" aria-hidden="true" />
      <span className="visually-hidden">.</span>
    </>
  );
}
