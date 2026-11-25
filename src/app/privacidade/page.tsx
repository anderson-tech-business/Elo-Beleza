import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { business } from "@/data/demo";

export const metadata: Metadata = { title: "Política de Privacidade | Elo Beleza com Propósito" };

export default function Privacidade() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" tabIndex={-1} className="focus:outline-none mx-auto max-w-3xl px-4 py-12">
        <h1 className="h-section">Política de Privacidade</h1>
        <p className="mt-2 text-sm text-muted">Texto-modelo — revisar com assessoria jurídica antes da publicação.</p>
        <div className="mt-8 space-y-6 text-ink [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:mt-2 [&_p]:text-muted">
          <section>
            <h2>Quais dados coletamos</h2>
            <p>
              Para agendar seu atendimento, coletamos nome, e-mail, telefone e data de nascimento. Para avaliações de
              harmonização facial, também coletamos informações de saúde (anamnese), consideradas dados pessoais
              sensíveis pela LGPD (Lei nº 13.709/2018).
            </p>
          </section>
          <section>
            <h2>Para que usamos</h2>
            <p>
              Para confirmar e lembrar seus agendamentos, garantir a segurança dos procedimentos e manter seu histórico de
              atendimento. Dados de saúde são tratados somente com seu consentimento específico.
            </p>
          </section>
          <section>
            <h2>Compartilhamento</h2>
            <p>Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.</p>
          </section>
          <section>
            <h2>Seus direitos</h2>
            <p>
              Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento pelo telefone {business.phone}
              {" "}ou presencialmente em {business.fullAddress}.
            </p>
          </section>
          <section>
            <h2>Neste modelo demonstrativo</h2>
            <p>
              Nenhum dado é enviado a servidores: as informações digitadas ficam apenas no armazenamento local do seu
              navegador.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
