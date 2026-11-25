import Link from "next/link";
import { business } from "@/data/demo";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-3 text-muted">Resultados naturais, seguros e discretos. Protocolo individual para cada paciente.</p>
        </div>
        <address className="not-italic text-muted">
          <p className="font-semibold text-ink">Endereço</p>
          <p className="mt-1">{business.fullAddress}</p>
          <p className="mt-3 font-semibold text-ink">Telefone</p>
          <p className="mt-1">{business.phone}</p>
        </address>
        <div className="text-muted">
          <p className="font-semibold text-ink">Instagram</p>
          <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-primary-dark underline underline-offset-2">
            @{business.instagram}
          </a>
          <p className="mt-3">Responsável técnica: {business.responsavelTecnica}</p>
          <p className="mt-3">
            <Link href="/privacidade" className="text-primary-dark underline underline-offset-2">Política de Privacidade</Link>
            {" · "}
            <Link href="/admin" className="text-primary-dark underline underline-offset-2">Área interna</Link>
          </p>
        </div>
      </div>
      <p className="border-t border-line px-4 pb-24 pt-4 text-center text-xs text-muted sm:pb-4">
        © {new Date().getFullYear()} {business.name}. Os resultados variam de pessoa para pessoa.
      </p>
    </footer>
  );
}
