import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { BookingFlow } from "./BookingFlow";

export const metadata: Metadata = { title: "Agendar | Elo Beleza com Propósito" };

export default function AgendarPage() {
  return (
    <>
      <SiteHeader showCta={false} />
      <main id="conteudo">
        <BookingFlow />
      </main>
    </>
  );
}
