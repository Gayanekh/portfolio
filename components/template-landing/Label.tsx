// Every section's label on /template-landing (the user chose /other-landing's
// style): a small square, then the name in mono capitals. No numbers.
export default function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 flex items-center gap-2.5 font-mono text-[0.75rem] uppercase tracking-[0.04em] text-[color-mix(in_srgb,var(--fg)_72%,transparent)]">
      <span aria-hidden="true" className="size-1.5 bg-current" />
      {children}
    </p>
  );
}
