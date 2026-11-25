import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { Confirmation } from "./Confirmation";

export const metadata: Metadata = { title: "Agendamento confirmado | Elo Beleza com Propósito" };

export default function ConfirmadoPage() {
  return (
    <>
      <SiteHeader showCta={false} />
      <main id="conteudo" className="mx-auto max-w-2xl px-4 py-10">
        <Suspense fallback={<p className="text-muted">Carregando…</p>}>
          <Confirmation />
        </Suspense>
      </main>
    </>
  );
}
