import Link from "next/link";
import { Logo } from "./Logo";

export function SiteHeader({ showCta = true }: { showCta?: boolean }) {
  return (
    <header className="border-b border-line bg-bg/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <nav aria-label="Principal" className="flex items-center gap-1 text-sm">
          <a href="/#procedimentos" className="btn-ghost btn-sm hidden min-h-11 sm:inline-flex">Procedimentos</a>
          <a href="/#duvidas" className="btn-ghost btn-sm hidden min-h-11 sm:inline-flex">Dúvidas</a>
          <a href="/#localizacao" className="btn-ghost btn-sm hidden min-h-11 sm:inline-flex">Localização</a>
          {showCta && (
            <Link href="/agendar?servico=avaliacao" className="btn-primary btn-sm min-h-11">
              Agendar avaliação
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
