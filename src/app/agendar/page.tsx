import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { BookingFlow } from "./BookingFlow";

export const metadata: Metadata = { title: "Agendar | Elo Beleza com Propósito" };

export default function AgendarPage() {
  return (
    <>
      <SiteHeader showCta={false} />
      <main id="conteudo" tabIndex={-1} className="focus:outline-none">
        <Suspense fallback={<p className="px-4 py-10 text-center text-muted">Carregando…</p>}>
          <BookingFlow />
        </Suspense>
      </main>
    </>
  );
}
