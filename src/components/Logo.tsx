import Link from "next/link";

export function Logo({ href = "/", small = false }: { href?: string; small?: boolean }) {
  return (
    <Link href={href} className="inline-flex flex-col leading-none text-primary-dark" aria-label="Elo Beleza com Propósito — início">
      <span className={`font-serif font-semibold ${small ? "text-xl" : "text-2xl"}`}>Elo Beleza</span>
      <span className="mt-0.5 text-2xs uppercase tracking-[0.25em] text-muted">com Propósito</span>
    </Link>
  );
}
