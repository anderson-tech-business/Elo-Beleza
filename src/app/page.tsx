import Image from "next/image";
import Link from "next/link";
import { MobileCta } from "@/components/MobileCta";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  AmbientVideo,
  BackgroundImage,
  BackgroundVideo,
  CountUp,
  ParallaxImage,
  RevealImage,
  ScrollMarquee,
} from "@/components/media";
import { HeroIn, HeroItem, MotionProvider, Press, Reveal, Stagger, StaggerItem } from "@/components/motion";
import {
  business,
  faq,
  featuredProfessional,
  hoursLabel,
  media,
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
  { n: "01", title: "Avaliação", text: "Conversa sem pressa, análise facial e histórico de saúde. Juntas, definimos um protocolo individual." },
  { n: "02", title: "Procedimento", text: "Aplicação com técnica segura, produtos registrados e foco em resultado natural e discreto." },
  { n: "03", title: "Retorno", text: "Revisão em cerca de 15 dias para acompanhar o resultado e fazer ajustes, se necessário." },
];

const eyebrow = "text-sm font-semibold uppercase tracking-[0.2em]";

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
        <main id="conteudo" tabIndex={-1} className="focus:outline-none">
          {/* 1. Hero com vídeo de fundo */}
          <section className="relative isolate flex min-h-[calc(100svh-8rem)] items-end overflow-hidden bg-ink text-white sm:min-h-[640px] sm:items-center">
            <BackgroundVideo
              src={media.videos.hero.src}
              mobileSrc={media.videos.hero.mobileSrc}
              poster={media.videos.hero.poster}
              priority
              buttonClassName="right-4 top-4"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1f1b1b] via-[#1f1b1b]/70 to-[#1f1b1b]/20 sm:bg-gradient-to-r sm:from-[#1f1b1b]/90 sm:via-[#1f1b1b]/60 sm:to-[#1f1b1b]/10"
            />
            <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-12 pt-28 sm:py-24 lg:grid-cols-[1.25fr_1fr] lg:items-end">
              <HeroIn>
                <HeroItem>
                  <a
                    href={business.googleReviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass chip px-3 py-1 text-sm text-white"
                  >
                    <span aria-hidden="true" className="mr-1 text-[#F1C27D]">★</span>
                    {rating} · {business.reviewCount} avaliações no Google
                  </a>
                </HeroItem>
                <h1 className="mt-6 max-w-3xl font-serif text-5xl font-semibold leading-[1.02] sm:text-7xl">
                  Harmonização facial <em className="font-medium italic text-[#F0CFC6]">em Itaquera</em>
                </h1>
                <HeroItem>
                  <p className="mt-5 max-w-xl text-lg text-[#EFE7E4]">
                    Resultados naturais, seguros e discretos, com atendimento acolhedor e protocolo individual para
                    realçar a sua beleza — sem exageros.
                  </p>
                </HeroItem>
                <HeroItem className="mt-8 flex flex-wrap items-center gap-4">
                  <Press>
                    <Link href="/agendar?servico=avaliacao" className="btn bg-white px-8 py-4 text-base text-primary-dark hover:bg-primary-soft">
                      Agendar avaliação
                    </Link>
                  </Press>
                  <a href="#procedimentos" className="btn min-h-11 border border-white/50 text-white hover:bg-white/10">
                    Ver procedimentos
                  </a>
                </HeroItem>
                <HeroItem>
                  <p className="mt-4 text-sm text-[#DCD1CD]">Avaliação gratuita · Parque do Carmo, Zona Leste de SP</p>
                </HeroItem>
              </HeroIn>
              <HeroIn className="hidden lg:block">
                <HeroItem from="right">
                  <aside aria-labelledby="t-visita" className="glass rounded-3xl p-6 text-white">
                    <p className={`${eyebrow} text-xs text-[#F0CFC6]`}>Sua primeira visita</p>
                    <h2 id="t-visita" className="mt-1 font-serif text-3xl font-semibold">Começa por uma conversa</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                      {[
                        ["Avaliação gratuita", "sem compromisso"],
                        ["Protocolo individual", "pensado para o seu rosto"],
                        ["Retorno incluso", "em cerca de 15 dias"],
                      ].map(([t, d]) => (
                        <li key={t} className="flex items-start gap-3">
                          <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
                          <span>
                            <span className="font-semibold">{t}</span> <span className="text-[#E5DCD9]">· {d}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </aside>
                </HeroItem>
              </HeroIn>
            </div>
            <span className="absolute bottom-3 right-4 text-[11px] text-white/70">Vídeo ilustrativo</span>
          </section>

          {/* Números */}
          <section aria-label="Em números" className="bg-surface">
            <Stagger as="dl" className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-4 py-10 text-center md:grid-cols-4">
              {[
                { v: <CountUp to={business.rating} decimals={1} />, l: "nota no Google", star: true },
                { v: <CountUp to={business.reviewCount} />, l: "avaliações de pacientes" },
                { v: <CountUp to={15} suffix=" dias" />, l: "para o retorno da toxina" },
                { v: <span>Grátis</span>, l: "avaliação de harmonização" },
              ].map((it, i) => (
                <StaggerItem key={i} className="flex flex-col-reverse">
                  <dt className="mt-1 text-sm text-muted">{it.l}</dt>
                  <dd className="font-serif text-4xl font-semibold text-primary-dark sm:text-5xl">
                    {it.v}
                    {it.star && <span aria-hidden="true" className="ml-1 text-3xl text-[#A8742A]">★</span>}
                  </dd>
                </StaggerItem>
              ))}
            </Stagger>
          </section>
          <ScrollMarquee words={["Resultados naturais", "Protocolo individual", "Atendimento acolhedor", "Segurança em cada etapa", "Beleza com propósito"]} />

          {/* 2. Harmonização — foto de ponta a ponta */}
          <section id="procedimentos" className="relative bg-bg" aria-labelledby="t-harm">
            <div className="grid lg:grid-cols-2">
              <div className="relative">
                <ParallaxImage
                  src={media.harmonizacao.src}
                  alt={media.harmonizacao.alt}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-[380px] sm:h-[480px] lg:h-full lg:min-h-[640px]"
                />
                <span className="chip absolute bottom-3 left-3 bg-white/85 text-[11px] text-muted backdrop-blur">Imagem ilustrativa</span>
              </div>
              <div className="px-4 py-14 sm:px-10 lg:py-20 xl:px-16">
                <Reveal>
                  <p className={`${eyebrow} text-primary-dark`}>Procedimentos</p>
                  <h2 id="t-harm" className="h-section mt-2">Harmonização facial</h2>
                  <p className="mt-3 max-w-xl text-muted">
                    Cada rosto tem uma história. O plano é definido na avaliação, sempre com indicação individual.
                  </p>
                </Reveal>
                <Stagger className="mt-8 grid gap-4">
                  {harmonizacao.map((h) => (
                    <StaggerItem as="article" lift key={h.title} className="card p-6">
                      <h3 className="font-serif text-2xl font-semibold text-ink">{h.title}</h3>
                      <p className="mt-2 text-muted">{h.text}</p>
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Regiões">
                        {h.areas.map((a) => (
                          <li key={a} className="chip bg-primary-soft text-primary-dark">{a}</li>
                        ))}
                      </ul>
                    </StaggerItem>
                  ))}
                </Stagger>
                <Reveal className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-ink">
                    <span className="font-semibold">Não sabe o que escolher?</span>{" "}
                    <span className="text-muted">A avaliação gratuita define o melhor caminho.</span>
                  </p>
                  <Press className="shrink-0">
                    <Link href="/agendar?servico=avaliacao" className="btn-primary">Agendar avaliação</Link>
                  </Press>
                </Reveal>
              </div>
            </div>
          </section>

          {/* Experiência (vídeo) */}
          <section className="relative isolate overflow-hidden bg-ink py-16 text-white sm:py-24" aria-labelledby="t-exp">
            <div className="relative mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <Reveal>
                <p className={`${eyebrow} text-[#E3BDB4]`}>A experiência</p>
                <h2 id="t-exp" className="mt-2 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                  Um cuidado feito <em className="font-medium italic text-[#F0CFC6]">sem pressa</em>
                </h2>
                <p className="mt-4 max-w-md text-[#D9CFCB]">
                  Do primeiro contato ao retorno, cada etapa é pensada para você se sentir segura, ouvida e à vontade.
                </p>
                <ul className="mt-6 space-y-3 text-[#EFE7E4]">
                  {["Ambiente reservado e acolhedor", "Produtos registrados e técnica segura", "Orientações claras para o pós"].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-px w-6 bg-[#E3BDB4]" />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <div>
                <div className="relative">
                  <Reveal>
                    <AmbientVideo
                      src={media.videos.cuidado.src}
                      poster={media.videos.cuidado.poster}
                      label={media.videos.cuidado.label}
                      className="aspect-[16/11] rounded-[28px] shadow-2xl lg:aspect-square"
                    />
                  </Reveal>
                  <RevealImage
                    src={media.serum.src}
                    alt={media.serum.alt}
                    sizes="180px"
                    className="absolute -bottom-10 -left-10 hidden aspect-[4/5] w-44 rounded-3xl border-4 border-ink shadow-xl lg:block"
                  />
                </div>
                <p className="mt-3 text-right text-xs text-[#BFB3AF]">Vídeo e imagens ilustrativos</p>
              </div>
            </div>
          </section>

          {/* 3. Estética */}
          <section className="py-16 sm:py-24" aria-labelledby="t-est">
            <div className="mx-auto max-w-6xl px-4">
              <Reveal className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className={`${eyebrow} text-primary-dark`}>Cuidados com a pele</p>
                  <h2 id="t-est" className="h-section mt-2">Estética e sobrancelhas</h2>
                </div>
                <p className="max-w-sm text-sm text-muted">Valores e imagens ilustrativos. Agende direto pelo serviço.</p>
              </Reveal>
              <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {estetica.map((s) => (
                  <StaggerItem as="article" lift key={s.id} className="group relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-3xl p-5 text-white">
                    {media.services[s.id] && (
                      <Image
                        src={media.services[s.id].src}
                        alt={media.services[s.id].alt}
                        fill
                        placeholder="blur"
                        sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                        className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#1f1b1b] via-[#1f1b1b]/70 to-transparent" />
                    <h3 className="font-serif text-2xl font-semibold leading-tight">{s.name}</h3>
                    <p className="mt-1 text-sm text-[#E5DCD9]">{s.description}</p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-sm">
                        <span className="text-[#E5DCD9]">{s.durationMin} min · a partir de </span>
                        <span className="font-semibold">{brl(s.price)}</span>
                      </p>
                      <Link
                        href={`/agendar?servico=${s.id}`}
                        className="btn btn-sm min-h-11 shrink-0 bg-white text-primary-dark hover:bg-primary-soft"
                        aria-label={`Agendar ${s.name}`}
                      >
                        Agendar
                      </Link>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>

          {/* 4. Como funciona — foto da sala ao fundo */}
          <section className="relative isolate overflow-hidden py-20 text-white sm:py-28" aria-labelledby="t-como">
            <BackgroundImage src={media.backgrounds.sala} />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#1f1b1b]/70" />
            <div className="mx-auto max-w-6xl px-4">
              <Reveal>
                <p className={`${eyebrow} text-[#F0CFC6]`}>Passo a passo</p>
                <h2 id="t-como" className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">Como funciona</h2>
              </Reveal>
              <Stagger as="ol" className="mt-10 grid gap-5 md:grid-cols-3">
                {passos.map((p) => (
                  <StaggerItem as="li" key={p.n} className="glass rounded-3xl p-6">
                    <span aria-hidden="true" className="font-serif text-5xl font-medium italic text-[#F0CFC6]">{p.n}</span>
                    <h3 className="mt-3 font-serif text-2xl font-semibold">{p.title}</h3>
                    <p className="mt-2 text-[#EFE7E4]">{p.text}</p>
                  </StaggerItem>
                ))}
              </Stagger>
              <p className="mt-6 text-xs text-white/70">Imagem ilustrativa</p>
            </div>
          </section>

          {/* 5. Quem atende */}
          <section className="py-16 sm:py-24" aria-labelledby="t-quem">
            <div className="mx-auto max-w-6xl px-4">
              <Reveal>
                <p className={`${eyebrow} text-primary-dark`}>Equipe</p>
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

          {/* 6. Depoimentos — pele em close ao fundo */}
          <section className="relative isolate overflow-hidden py-20 text-white sm:py-28" aria-labelledby="t-dep">
            <BackgroundImage src={media.backgrounds.pele} position="center 40%" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1f1b1b]/80 to-[#1f1b1b]/65" />
            <div className="mx-auto max-w-6xl px-4">
              <Reveal className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className={`${eyebrow} text-[#F0CFC6]`}>Depoimentos</p>
                  <h2 id="t-dep" className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">O que dizem as pacientes</h2>
                </div>
                <a href={business.googleReviewsUrl} target="_blank" rel="noopener noreferrer" className="btn min-h-11 border border-white/60 text-white hover:bg-white/10">
                  Ver avaliações no Google
                </a>
              </Reveal>
              <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {testimonials.map((t) => (
                  <StaggerItem as="figure" key={t.name} className="glass relative flex flex-col rounded-3xl p-5">
                    <span className="chip absolute right-4 top-4 bg-white/20 text-white">Exemplo</span>
                    <span aria-hidden="true" className="font-serif text-6xl leading-none text-[#F0CFC6]">“</span>
                    <blockquote className="flex-1 font-serif text-xl leading-snug">{t.text}</blockquote>
                    <figcaption className="mt-4 text-sm">
                      <span className="font-semibold">{t.name}</span>
                      <span className="text-[#E5DCD9]"> · {t.procedure}</span>
                    </figcaption>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>

          {/* 7. FAQ */}
          <section id="duvidas" className="py-16 sm:py-24" aria-labelledby="t-faq">
            <div className="mx-auto max-w-3xl px-4">
              <Reveal>
                <p className={`${eyebrow} text-primary-dark`}>Dúvidas</p>
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

          {/* Chamada com vídeo de fundo */}
          <section className="relative isolate overflow-hidden py-24 text-center text-white sm:py-32" aria-labelledby="t-cta">
            <BackgroundVideo src={media.videos.avaliacao.src} poster={media.videos.avaliacao.poster} />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#1f1b1b]/65" />
            <Reveal className="mx-auto max-w-2xl px-4">
              <p className={`${eyebrow} text-[#F0CFC6]`}>Primeiro passo</p>
              <h2 id="t-cta" className="mt-3 font-serif text-4xl font-semibold leading-tight sm:text-6xl">
                Sua avaliação é <em className="font-medium italic text-[#F0CFC6]">gratuita</em>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-[#EFE7E4]">Escolha o dia e o horário em menos de um minuto, direto pelo celular.</p>
              <Press className="mt-8 inline-block">
                <Link href="/agendar?servico=avaliacao" className="btn bg-white px-8 py-4 text-base text-primary-dark hover:bg-primary-soft">
                  Agendar avaliação
                </Link>
              </Press>
            </Reveal>
            <span className="absolute bottom-3 left-4 text-[11px] text-white/70">Vídeo ilustrativo</span>
          </section>

          {/* 8. Localização — recepção ao fundo */}
          <section id="localizacao" className="relative isolate overflow-hidden py-16 sm:py-24" aria-labelledby="t-loc">
            <BackgroundImage src={media.backgrounds.recepcao} strength={60} />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#1f1b1b]/45" />
            <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-[1fr_1.4fr]">
              <Reveal className="card p-6 sm:p-8">
                <p className={`${eyebrow} text-primary-dark`}>Onde estamos</p>
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
                <p className="mt-2 text-xs text-muted">Horário e imagem de fundo ilustrativos.</p>
                <Press className="mt-6 inline-block">
                  <Link href="/agendar?servico=avaliacao" className="btn-primary">Agendar avaliação</Link>
                </Press>
              </Reveal>
              <Reveal delay={0.15} className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/40 bg-primary-soft shadow-2xl">
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
                  className="absolute inset-0 h-full w-full"
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
