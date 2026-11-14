/** Outbound arrow drawn as a vector, so phones never swap it for an emoji. */
export default function ArrowOut() {
  return (
    <svg viewBox="0 0 10 10" aria-hidden className="ml-[0.3em] inline-block h-[0.62em] w-[0.62em] -translate-y-[0.06em]" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M1.5 8.5 8.5 1.5M3 1.5h5.5V7" />
    </svg>
  );
}
