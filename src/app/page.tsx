import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MobileCta } from "@/components/MobileCta";
import { Float, HeroIn, HeroItem, MotionProvider, Press, Reveal, Stagger, StaggerItem } from "@/components/motion";
import {
  business,
  faq,
  featuredProfessional,
  hoursLabel,
  professionals,
  services,
  testimonials,
} from "@/data/demo";
import { brl } from "@/lib/time";

const harmonizacao = [
  {
    title: "Toxina botulínica",
    text: "Suaviza linhas da testa, da glabela e pés de galinha. Também pode ser usada de forma preventiva.",
    areas: ["Testa", "Glabela", "Pés de galinha", "Preventivo"],
  },
  {
    title: "Preenchimento com ácido hialurônico",
    text: "Repõe volume e contorno com efeito lifting suave, respeitando as proporções do seu rosto.",
    areas: ["Olheiras", "Bigode chinês", "Mandíbula", "Queixo"],
  },
];

const passos = [
  { n: "1", title: "Avaliação", text: "Conversa sem pressa, análise facial e histórico de saúde. Juntas, definimos um protocolo individual." },
  { n: "2", title: "Procedimento", text: "Aplicação com técnica segura, produtos registrados e foco em resultado natural e discreto." },
  { n: "3", title: "Retorno", text: "Revisão em cerca de 15 dias para acompanhar o resultado e fazer ajustes, se necessário." },
];

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["BeautySalon", "MedicalBusiness"],
    name: business.name,
    url: business.site,
    telephone: business.phoneE164,
    sameAs: [business.instagramUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: business.street,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.zip,
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    areaServed: ["Itaquera", "Parque do Carmo", "Cidade Líder", "Zona Leste de São Paulo"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
      bestRating: 5,
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Home() {
  const estetica = services.filter((s) => s.category === "estetica");
  const pro = professionals.find((p) => p.id === featuredProfessional.professionalId)!;
  const rating = business.rating.toLocaleString("pt-BR");

  return (
    <>
      <JsonLd />
      <SiteHeader />
      <MotionProvider>
      <main id="conteudo">
        {/* 1. Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--color-primary-soft),transparent_60%)]" />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:pb-24 sm:pt-20 lg:grid-cols-[1.25fr_1fr]">
            <HeroIn>
            <HeroItem>
            <a
              href={business.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="chip border border-line bg-white px-3 py-1 text-sm text-ink"
            >
              <span aria-hidden="true" className="mr-1 text-[#A8742A]">★</span>
              {rating} · {business.reviewCount} avaliações no Google
            </a>
            </HeroItem>
            <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-primary-dark sm:text-7xl">
              Harmonização facial em Itaquera
            </h1>
            <HeroItem>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Resultados naturais, seguros e discretos, com atendimento acolhedor e protocolo individual para realçar a
              sua beleza — sem exageros.
            </p>
            </HeroItem>
            <HeroItem className="mt-8">
              <Press>
                <Link href="/agendar?servico=avaliacao" className="btn-primary px-8 py-4 text-base">
                  Agendar avaliação
                </Link>
              </Press>
              <p className="mt-3 text-sm text-muted">Avaliação gratuita · Parque do Carmo, Zona Leste de SP</p>
            </HeroItem>
            </HeroIn>
            <HeroIn className="relative">
            <Float className="pointer-events-none absolute -right-10 -top-12 -z-10 hidden lg:block">
              <div aria-hidden="true" className="h-56 w-56 rounded-full bg-[radial-gradient(circle,#e8cfc6,transparent_70%)] opacity-80" />
            </Float>
            <HeroItem from="right">
            <aside aria-labelledby="t-visita" className="card relative p-6 shadow-[0_20px_60px_-30px_rgba(140,90,80,0.45)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">Sua primeira visita</p>
              <h2 id="t-visita" className="mt-2 font-serif text-3xl font-semibold text-ink">Começa por uma conversa</h2>
              <ul className="mt-5 space-y-4">
                {[
                  ["Avaliação gratuita", "Análise facial e histórico de saúde, sem compromisso."],
                  ["Protocolo individual", "Indicação pensada para o seu rosto, sem exageros."],
                  ["Retorno incluso", "Revisão do resultado da toxina em cerca de 15 dias."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm text-primary-dark">✓</span>
                    <span>
                      <span className="block font-semibold text-ink">{t}</span>
                      <span className="block text-sm text-muted">{d}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-line pt-4 text-sm text-muted">
                <span className="font-medium text-ink">{business.street}</span> · {business.neighborhood}
              </p>
            </aside>
            </HeroItem>
            </HeroIn>
          </div>
        </section>

        {/* 2. Harmonização */}
        <section id="procedimentos" className="bg-surface py-16 sm:py-20" aria-labelledby="t-harm">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-dark">Procedimentos</p>
            <h2 id="t-harm" className="h-section mt-2">Harmonização facial</h2>
            <p className="mt-3 max-w-2xl text-muted">
              Cada rosto tem uma história. O plano é definido na avaliação, sempre com indicação individual.
            </p>
            </Reveal>
            <Stagger className="mt-10 grid gap-6 md:grid-cols-2">
              {harmonizacao.map((h) => (
                <StaggerItem as="article" lift key={h.title} className="card p-6 sm:p-8">
                  <h3 className="font-serif text-2xl font-semibold text-ink">{h.title}</h3>
                  <p className="mt-3 text-muted">{h.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-2" aria-label="Regiões">
                    {h.areas.map((a) => (
                      <li key={a} className="chip bg-primary-soft text-primary-dark">{a}</li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal className="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-primary-soft/60 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-ink">
                <span className="font-semibold">Não sabe o que escolher?</span>{" "}
                <span className="text-muted">A avaliação gratuita define o melhor caminho para você.</span>
              </p>
              <Press className="shrink-0">
                <Link href="/agendar?servico=avaliacao" className="btn-primary">Agendar avaliação</Link>
              </Press>
            </Reveal>
          </div>
        </section>

        {/* 3. Estética */}
        <section className="py-16 sm:py-20" aria-labelledby="t-est">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-dark">Cuidados com a pele</p>
            <h2 id="t-est" className="h-section mt-2">Estética e sobrancelhas</h2>
            </Reveal>
            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {estetica.map((s) => (
                <StaggerItem as="article" lift key={s.id} className="card flex flex-col p-5">
                  <h3 className="font-semibold text-ink">{s.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{s.description}</p>
                  <dl className="mt-4 flex items-end justify-between border-t border-line pt-3 text-sm">
                    <div>
                      <dt className="sr-only">Duração</dt>
                      <dd className="text-muted">{s.durationMin} min</dd>
                    </div>
                    <div className="text-right">
                      <dt className="text-xs text-muted">a partir de</dt>
                      <dd className="font-semibold text-primary-dark">{brl(s.price)}</dd>
                    </div>
                  </dl>
                  <Link
                    href={`/agendar?servico=${s.id}`}
                    className="btn-outline btn-sm mt-4 min-h-11 w-full"
                    aria-label={`Agendar ${s.name}`}
                  >
                    Agendar
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
            <p className="mt-4 text-xs text-muted">Valores ilustrativos.</p>
          </div>
        </section>

        {/* 4. Como funciona */}
        <section className="bg-primary-soft/60 py-16 sm:py-20" aria-labelledby="t-como">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-dark">Passo a passo</p>
            <h2 id="t-como" className="h-section mt-2">Como funciona</h2>
            </Reveal>
            <Stagger as="ol" className="mt-10 grid gap-6 md:grid-cols-3">
              {passos.map((p) => (
                <StaggerItem as="li" lift key={p.n} className="card p-6">
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-dark font-serif text-xl text-white">
                    {p.n}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-muted">{p.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* 5. Quem atende */}
        <section className="py-16 sm:py-20" aria-labelledby="t-quem">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-dark">Equipe</p>
            <h2 id="t-quem" className="h-section mt-2">Quem atende</h2>
            </Reveal>
            <Reveal className="mt-10">
            <article className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
              <div
                role="img"
                aria-label="Foto da profissional (a definir)"
                className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-soft to-[#e2cbc3] font-serif text-4xl text-primary-dark"
              >
                {pro.name.replace("Dra. ", "").split(" ").map((w) => w[0]).join("")}
              </div>
              <div>
                <h3 className="font-serif text-3xl font-semibold">{pro.name}</h3>
                <p className="text-primary-dark">{pro.role}</p>
                <p className="mt-3 max-w-xl text-muted">{pro.bio}</p>
                <p className="mt-3 text-sm text-muted">
                  Registro profissional: <span className="font-medium text-ink">{featuredProfessional.registro}</span>
                </p>
              </div>
            </article>
            </Reveal>
          </div>
        </section>

        {/* 6. Depoimentos */}
        <section className="bg-surface py-16 sm:py-20" aria-labelledby="t-dep">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary-dark">Depoimentos</p>
                <h2 id="t-dep" className="h-section mt-2">O que dizem as pacientes</h2>
              </div>
              <a href={business.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Ver avaliações no Google
              </a>
            </Reveal>
            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {testimonials.map((t) => (
                <StaggerItem as="figure" lift key={t.name} className="card relative flex flex-col p-5">
                  <span className="chip absolute right-4 top-4 bg-[#EFE9E6] text-muted">Exemplo</span>
                  <span aria-hidden="true" className="font-serif text-5xl leading-none text-primary">“</span>
                  <blockquote className="flex-1 text-sm text-ink">{t.text}</blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold">{t.name}</span>
                    <span className="text-muted"> · {t.procedure}</span>
                  </figcaption>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* 7. FAQ */}
        <section id="duvidas" className="py-16 sm:py-20" aria-labelledby="t-faq">
          <div className="mx-auto max-w-3xl px-4">
            <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary-dark">Dúvidas</p>
            <h2 id="t-faq" className="h-section mt-2">Perguntas frequentes</h2>
            </Reveal>
            <Reveal className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
              {faq.map((f) => (
                <details key={f.q} className="group px-5 py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden="true" className="text-xl text-primary-dark transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-4 text-muted">{f.a}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 8. Localização */}
        <section id="localizacao" className="bg-surface py-16 sm:py-20" aria-labelledby="t-loc">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary-dark">Onde estamos</p>
            <h2 id="t-loc" className="h-section mt-2">Localização</h2>
              <address className="mt-6 not-italic text-ink">{business.fullAddress}</address>
              <h3 className="mt-6 font-semibold">Horário de atendimento</h3>
              <dl className="mt-2 space-y-1 text-sm">
                {hoursLabel.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4 border-b border-line py-1.5">
                    <dt className="text-muted">{h.days}</dt>
                    <dd className="font-medium">{h.hours}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-xs text-muted">Horário ilustrativo.</p>
              <Press className="mt-6 inline-block">
                <Link href="/agendar?servico=avaliacao" className="btn-primary">Agendar avaliação</Link>
              </Press>
            </Reveal>
            <Reveal delay={0.15} className="relative overflow-hidden rounded-2xl border border-line bg-primary-soft/60">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.fullAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline btn-sm absolute bottom-3 right-3 z-10 min-h-11 bg-white"
              >
                Abrir no Google Maps
              </a>
              <iframe
                title={`Mapa: ${business.fullAddress}`}
                src={business.mapsEmbedUrl}
                className="relative h-80 w-full md:h-full md:min-h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>
        </section>
      </main>
      </MotionProvider>
      <SiteFooter />
      <MobileCta />
    </>
  );
}
