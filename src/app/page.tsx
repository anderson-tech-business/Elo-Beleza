import Image from "next/image";
import Link from "next/link";
import { FloatingIcons } from "@/components/FloatingIcons";
import { HeroScrub } from "@/components/HeroScrub";
import { MobileCta } from "@/components/MobileCta";
import { MotionProvider } from "@/components/motion";
import { SceneDirector } from "@/components/scroll/SceneDirector";
import { SmoothScroll } from "@/components/scroll/SmoothScroll";
import {
  CtaVideoScene,
  ExperienceScene,
  HorizontalServices,
  ManifestoScene,
  StickySteps,
  TestimonialDeck,
} from "@/components/scroll/scenes";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
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

/*
 * Landing imersiva: cada seção ocupa no mínimo a tela inteira e tem uma
 * transição própria. Mapa das transições:
 *  1. Topo .............. vídeo controlado pela rolagem (3 atos)
 *  2. Manifesto ......... texto acende palavra por palavra (presa)
 *  3. Harmonização ...... parallax na foto; fica presa e escurece (cortina)
 *  4. Experiência ....... passa por cima; vídeo cresce até a tela cheia (presa)
 *  5. Estética .......... rolagem horizontal (presa)
 *  6. Como funciona ..... passos trocando com a seção presa (sticky)
 *  7. Quem atende ....... entra como cartão e cresce até a tela cheia
 *  8. Depoimentos ....... baralho de cartões (presa)
 *  9. Dúvidas ........... títulos com máscara; fica presa (cortina)
 * 10. Chamada ........... vídeo de fundo cresce até a tela cheia
 * 11. Localização ....... foto com parallax; blocos entram pelas laterais
 */

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

const manifesto =
  "Acreditamos que a beleza mais bonita é a que continua sendo sua. Por isso, cada protocolo começa ouvindo você e termina com um resultado natural, seguro e discreto.";

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
    <SmoothScroll>
      <JsonLd />
      <SiteHeader />
      <MotionProvider>
        <SceneDirector>
          <main id="conteudo" tabIndex={-1} className="focus:outline-none">
            {/* 1. Topo */}
            <HeroScrub
              src={media.videos.hero.src}
              mobileSrc={media.videos.hero.mobileSrc}
              poster={media.videos.hero.poster}
              ratingLabel={`${rating} · ${business.reviewCount} avaliações no Google`}
              reviewsUrl={business.googleReviewsUrl}
            />

            {/* 2. Manifesto */}
            <ManifestoScene
              text={manifesto}
              stats={[
                { value: rating, label: "nota no Google", star: true },
                { value: String(business.reviewCount), label: "avaliações de pacientes" },
                { value: "15 dias", label: "para o retorno da toxina" },
                { value: "Grátis", label: "avaliação de harmonização" },
              ]}
            />

            {/* 3. Harmonização — cortina */}
            <section id="procedimentos" data-stack className="relative min-h-[100svh] overflow-hidden bg-bg" aria-labelledby="t-harm">
              <div data-stack-inner className="grid min-h-[100svh] origin-top lg:grid-cols-2">
                <div className="relative h-[42svh] overflow-hidden lg:h-auto">
                  <div data-parallax="10" className="absolute inset-0">
                    <Image src={media.harmonizacao.src} alt={media.harmonizacao.alt} fill placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <span className="chip absolute bottom-3 left-3 bg-white/85 text-2xs text-muted backdrop-blur">Imagem ilustrativa</span>
                </div>
                <div className="flex flex-col justify-center px-4 py-12 sm:px-10 xl:px-16">
                  <p className="eyebrow text-primary-dark">Procedimentos</p>
                  <h2 id="t-harm" data-split className="h-section mt-2">
                    Harmonização facial
                  </h2>
                  <p className="mt-3 max-w-xl text-muted">
                    Cada rosto tem uma história. O plano é definido na avaliação, sempre com indicação individual.
                  </p>
                  <div className="mt-8 grid gap-4">
                    {harmonizacao.map((h, i) => (
                      <article key={h.title} data-slide={i % 2 ? "right" : "left"} className="card p-6">
                        <h3 className="font-serif text-2xl font-semibold text-ink">{h.title}</h3>
                        <p className="mt-2 text-muted">{h.text}</p>
                        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Regiões">
                          {h.areas.map((a) => (
                            <li key={a} className="chip bg-primary-soft text-primary-dark">{a}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-ink">
                      <span className="font-semibold">Não sabe o que escolher?</span>{" "}
                      <span className="text-muted">A avaliação gratuita define o melhor caminho.</span>
                    </p>
                    <Link href="/agendar?servico=avaliacao" data-magnetic className="btn-primary shrink-0">
                      Agendar avaliação
                    </Link>
                  </div>
                </div>
              </div>
              <div data-stack-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night opacity-0" />
            </section>

            {/* 4. Experiência */}
            <ExperienceScene
              video={media.videos.cuidado.src}
              poster={media.videos.cuidado.poster}
              label={media.videos.cuidado.label}
              serum={media.serum}
            />

            {/* 5. Estética — rolagem horizontal */}
            <HorizontalServices
              items={estetica.map((s) => ({
                id: s.id,
                name: s.name,
                description: s.description,
                meta: `${s.durationMin} min · a partir de ${brl(s.price)}`,
                image: media.services[s.id],
              }))}
            />

            {/* 6. Como funciona — sticky */}
            <StickySteps steps={passos} background={media.backgrounds.sala} />

            {/* 7. Quem atende — cresce até a tela cheia */}
            <section className="relative z-10 bg-night" aria-labelledby="t-quem">
              <div data-zoom-in className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-bg">
                <FloatingIcons
                  icons={[
                    { name: "lotus", top: "14%", left: "84%", size: 56, depth: 1, rotate: -15 },
                    { name: "heart", top: "74%", left: "6%", size: 30, depth: 1.4, rotate: 20 },
                    { name: "sparkle", top: "20%", left: "8%", size: 24, depth: 2, rotate: 45 },
                    { name: "drop", top: "80%", left: "88%", size: 34, depth: 1.2, rotate: -20 },
                  ]}
                />
                <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-[auto_1fr]">
                  <div
                    role="img"
                    aria-label="Foto da profissional (a definir)"
                    data-slide="left"
                    className="flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-primary-soft to-blush font-serif text-6xl text-primary-dark shadow-float sm:h-72 sm:w-72"
                  >
                    {pro.name.replace("Dra. ", "").split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <p className="eyebrow text-primary-dark">Quem atende</p>
                    <h2 id="t-quem" data-split className="h-section mt-2">
                      {pro.name}
                    </h2>
                    <p className="mt-2 text-lg text-primary-dark">{pro.role}</p>
                    <p className="mt-4 max-w-xl text-lg text-muted">{pro.bio}</p>
                    <p className="mt-4 text-sm text-muted">
                      Registro profissional: <span className="font-medium text-ink">{featuredProfessional.registro}</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 8. Depoimentos — baralho */}
            <TestimonialDeck items={testimonials} background={media.backgrounds.pele} reviewsUrl={business.googleReviewsUrl} />

            {/* 9. Dúvidas — cortina */}
            <section id="duvidas" data-stack className="relative min-h-[100svh] overflow-hidden bg-bg" aria-labelledby="t-faq">
              <div data-stack-inner className="relative isolate flex min-h-[100svh] origin-top items-center">
                <FloatingIcons
                  icons={[
                    { name: "drop", top: "12%", left: "8%", size: 40, depth: 1.2, rotate: -25 },
                    { name: "leaf", top: "60%", left: "88%", size: 48, depth: 1.5, rotate: 35 },
                    { name: "bubble", top: "82%", left: "14%", size: 24, depth: 2, rotate: 0 },
                    { name: "sparkle", top: "28%", left: "90%", size: 22, depth: 1.8, rotate: -40 },
                  ]}
                />
                <div className="mx-auto w-full max-w-3xl px-4 py-20">
                  <p className="eyebrow text-primary-dark">Dúvidas</p>
                  <h2 id="t-faq" data-split className="h-section mt-2">
                    Perguntas frequentes
                  </h2>
                  <div className="mt-8 divide-y divide-line rounded-card border border-line bg-surface">
                    {faq.map((f) => (
                      <details key={f.q} className="group px-5 py-1">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                          {f.q}
                          <span aria-hidden="true" className="text-xl text-primary-dark transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <p className="pb-4 text-muted">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
              <div data-stack-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night opacity-0" />
            </section>

            {/* 10. Chamada */}
            <CtaVideoScene video={media.videos.avaliacao.src} poster={media.videos.avaliacao.poster} />

            {/* 11. Localização */}
            <section id="localizacao" className="relative isolate z-10 flex min-h-[100svh] items-center overflow-hidden bg-night py-16" aria-labelledby="t-loc">
              <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
                <div data-parallax="8" className="absolute inset-0">
                  <Image src={media.backgrounds.recepcao} alt="" fill placeholder="blur" sizes="100vw" className="object-cover" />
                </div>
              </div>
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/45" />
              <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 md:grid-cols-[1fr_1.4fr]">
                <div data-slide="left" className="card p-6 sm:p-8">
                  <p className="eyebrow text-primary-dark">Onde estamos</p>
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
                  <Link href="/agendar?servico=avaliacao" data-magnetic className="btn-primary mt-6">
                    Agendar avaliação
                  </Link>
                </div>
                <div data-slide="right" className="relative min-h-[320px] overflow-hidden rounded-card border border-white/40 bg-primary-soft shadow-2xl md:min-h-[460px]">
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
                </div>
              </div>
            </section>
          </main>
        </SceneDirector>
      </MotionProvider>
      <div className="relative z-10 bg-surface">
        <SiteFooter />
      </div>
      <MobileCta />
    </SmoothScroll>
  );
}
