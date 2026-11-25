"use client";

/**
 * Cenas de rolagem da landing. Cada seção ocupa no mínimo a tela inteira
 * (100svh) e tem uma transição própria:
 *  - Manifesto ......... texto que "acende" palavra por palavra (seção presa)
 *  - Experiência ....... vídeo cresce de cartão para tela cheia (seção presa)
 *  - Estética .......... rolagem horizontal (seção presa)
 *  - Como funciona ..... passos trocando com a seção presa (sticky)
 *  - Depoimentos ....... baralho de cartões entrando um sobre o outro
 *  - Chamada ........... vídeo de fundo que cresce até a tela cheia
 * Sem "reduzir movimento" a página vira um fluxo vertical comum.
 */
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { AmbientVideo } from "@/components/media";
import { EASE, MOTION_OK, gsap, useGSAP } from "./gsap";

/* ================================ Manifesto ================================ */
export function ManifestoScene({
  text,
  stats,
}: {
  text: string;
  stats: { value: string; label: string; star?: boolean }[];
}) {
  const scope = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: "top top", end: "+=160%", pin: true, scrub: EASE.scrub },
        });
        tl.fromTo("[data-word]", { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none" })
          .from("[data-stat]", { yPercent: 60, autoAlpha: 0, stagger: 0.12, ease: "power2.out" }, ">-0.3");
      });
    },
    { scope },
  );

  return (
    <section ref={scope} aria-labelledby="t-manifesto" className="relative flex min-h-[100svh] flex-col justify-center bg-surface px-4 py-20">
      <div className="mx-auto w-full max-w-5xl">
        <p className="eyebrow text-primary-dark">Nosso propósito</p>
        <h2 id="t-manifesto" className="sr-only">Nosso propósito</h2>
        <p className="mt-6 font-serif text-[clamp(2rem,5.2vw,4.5rem)] font-medium leading-[1.08] text-ink">
          {words.map((w, i) => (
            <span key={i} data-word className="inline-block pr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
        <dl className="mt-14 grid grid-cols-2 gap-6 border-t border-line pt-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} data-stat className="flex flex-col-reverse">
              <dt className="mt-1 text-sm text-muted">{s.label}</dt>
              <dd className="font-serif text-4xl font-semibold text-primary-dark sm:text-5xl">
                {s.value}
                {s.star && <span aria-hidden="true" className="ml-1 text-3xl text-gold">★</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ================================ Experiência ================================ */
export function ExperienceScene({
  video,
  poster,
  label,
  serum,
}: {
  video: string;
  poster: StaticImageData;
  label: string;
  serum: { src: StaticImageData; alt: string };
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: "top top", end: "+=140%", pin: true, scrub: EASE.scrub },
        });
        tl.fromTo(
          "[data-exp-media]",
          { clipPath: "inset(18% 22% 18% 22% round 36px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" },
        )
          .fromTo("[data-exp-veil]", { opacity: 0 }, { opacity: 1, ease: "none" }, 0.35)
          .from("[data-exp-copy] > *", { yPercent: 40, autoAlpha: 0, stagger: 0.08, ease: "power2.out" }, 0.45)
          .fromTo("[data-exp-serum]", { yPercent: 60, rotate: -8, autoAlpha: 0 }, { yPercent: 0, rotate: 0, autoAlpha: 1, ease: "power2.out" }, 0.6);
      });
    },
    { scope },
  );

  return (
    <section ref={scope} aria-labelledby="t-exp" className="relative z-10 min-h-[100svh] overflow-hidden bg-night text-white">
      <div data-exp-media className="absolute inset-0">
        <AmbientVideo src={video} poster={poster} label={label} className="h-full w-full" />
        <div data-exp-veil aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/90 via-night/60 to-night/20 opacity-100" />
      </div>
      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl items-end px-4 pb-20 sm:items-center sm:pb-0">
        <div data-exp-copy className="max-w-lg">
          <p className="eyebrow text-blush">A experiência</p>
          <h2 id="t-exp" className="h-section mt-2 text-white">
            Um cuidado feito <em className="font-medium italic text-blush">sem pressa</em>
          </h2>
          <p className="mt-4 text-on-dark">
            Do primeiro contato ao retorno, cada etapa é pensada para você se sentir segura, ouvida e à vontade.
          </p>
          <ul className="mt-6 space-y-3 text-on-dark">
            {["Ambiente reservado e acolhedor", "Produtos registrados e técnica segura", "Orientações claras para o pós"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-6 bg-blush" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div data-exp-serum className="absolute bottom-16 right-[6%] hidden aspect-[4/5] w-44 overflow-hidden rounded-feature border-4 border-night shadow-2xl lg:block">
        <Image src={serum.src} alt={serum.alt} fill sizes="180px" placeholder="blur" className="object-cover" />
      </div>
      <span className="absolute bottom-3 left-4 text-2xs text-on-dark-subtle">Vídeo e imagens ilustrativos</span>
    </section>
  );
}

/* ================================ Estética (horizontal) ================================ */
export interface ServiceCard {
  id: string;
  name: string;
  description: string;
  meta: string;
  image?: { src: StaticImageData; alt: string };
}

export function HorizontalServices({ items }: { items: ServiceCard[] }) {
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        // Parallax das fotos dentro dos cartões, acompanhando o movimento horizontal
        gsap.utils.toArray<HTMLElement>("[data-h-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -10 },
            {
              xPercent: 10,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
        // Teclado: ao focar um cartão fora da tela, rola até ele
        const onFocus = (e: FocusEvent) => {
          const card = (e.target as HTMLElement).closest<HTMLElement>("[data-h-card]");
          const st = tween.scrollTrigger;
          if (!card || !st) return;
          const target = Math.min(distance(), Math.max(0, card.offsetLeft - window.innerWidth * 0.1));
          window.scrollTo({ top: st.start + (target / distance()) * (st.end - st.start) });
        };
        el.addEventListener("focusin", onFocus);
        return () => el.removeEventListener("focusin", onFocus);
      });
    },
    { scope },
  );

  return (
    <section ref={scope} aria-labelledby="t-est" className="relative min-h-[100svh] overflow-hidden bg-bg">
      <div
        ref={track}
        className="flex min-h-[100svh] flex-col gap-6 px-4 py-20 motion-safe:w-max motion-safe:flex-row motion-safe:items-center motion-safe:gap-8 motion-safe:px-[6vw] motion-safe:py-0"
      >
        <div className="w-full shrink-0 motion-safe:w-[82vw] sm:motion-safe:w-[38vw]">
          <p className="eyebrow text-primary-dark">Cuidados com a pele</p>
          <h2 id="t-est" data-split className="h-section mt-2">
            Estética e sobrancelhas
          </h2>
          <p className="mt-4 max-w-sm text-muted">
            Protocolos para a saúde e o viço da pele, com agendamento direto pelo serviço.
          </p>
          <p aria-hidden="true" className="mt-8 hidden items-center gap-3 text-sm font-medium text-primary-dark motion-safe:flex">
            Continue rolando
            <span className="inline-block h-px w-16 bg-primary-dark" />→
          </p>
          <p className="mt-4 text-xs text-muted">Valores e imagens ilustrativos.</p>
        </div>
        {items.map((s, i) => (
          <article
            key={s.id}
            data-h-card
            className="group relative isolate flex h-[64svh] min-h-[380px] w-full shrink-0 flex-col justify-end overflow-hidden rounded-feature p-6 text-white motion-safe:w-[78vw] sm:motion-safe:w-[34vw] lg:motion-safe:w-[28vw]"
          >
            {s.image && (
              <div className="absolute inset-0 -z-20 overflow-hidden">
                <div data-h-img className="absolute -inset-x-[12%] inset-y-0">
                  <Image src={s.image.src} alt={s.image.alt} fill placeholder="blur" sizes="(min-width: 1024px) 30vw, 80vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            )}
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/60 to-transparent" />
            <span aria-hidden="true" className="absolute left-6 top-5 font-serif text-5xl italic text-blush/90">
              0{i + 1}
            </span>
            <h3 className="font-serif text-3xl font-semibold leading-tight">{s.name}</h3>
            <p className="mt-2 text-sm text-on-dark-muted">{s.description}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="text-sm text-on-dark">{s.meta}</p>
              <Link href={`/agendar?servico=${s.id}`} className="btn-light btn-sm min-h-11 shrink-0" aria-label={`Agendar ${s.name}`}>
                Agendar
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ================================ Como funciona (sticky) ================================ */
export function StickySteps({
  steps,
  background,
}: {
  steps: { n: string; title: string; text: string }[];
  background: StaticImageData;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-step]");
        gsap.set(items, { position: "absolute", inset: 0 });
        gsap.set(items.slice(1), { autoAlpha: 0, yPercent: 30 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: "top top", end: `+=${items.length * 90}%`, pin: true, scrub: EASE.scrub },
        });
        tl.fromTo("[data-step-bg]", { scale: 1.25 }, { scale: 1, ease: "none", duration: items.length }, 0);
        tl.fromTo("[data-step-bar]", { scaleY: 0 }, { scaleY: 1, ease: "none", duration: items.length }, 0);
        items.forEach((it, i) => {
          if (i === 0) return;
          tl.to(items[i - 1], { autoAlpha: 0, yPercent: -30, scale: 0.94, duration: 0.5, ease: "power2.in" }, i - 0.4).to(
            it,
            { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: "power2.out" },
            i - 0.1,
          );
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} aria-labelledby="t-como" className="relative isolate min-h-[100svh] overflow-hidden text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <div data-step-bg className="absolute inset-0">
          <Image src={background} alt="" fill placeholder="blur" sizes="100vw" className="object-cover" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/75" />
      <div className="mx-auto grid min-h-[100svh] max-w-6xl content-center gap-10 px-4 pb-28 pt-20 sm:pb-20 md:grid-cols-[1fr_1.2fr] md:items-center">
        <div>
          <p className="eyebrow text-blush">Passo a passo</p>
          <h2 id="t-como" className="h-section mt-2 text-white">
            Como <em className="font-medium italic text-blush">funciona</em>
          </h2>
          <div aria-hidden="true" className="mt-8 hidden h-40 w-px bg-white/20 md:motion-safe:block">
            <div data-step-bar className="h-full w-full origin-top bg-blush" />
          </div>
        </div>
        <ol className="relative grid gap-5 motion-safe:min-h-[360px] sm:motion-safe:min-h-[340px]">
          {steps.map((s) => (
            <li key={s.n} data-step className="glass rounded-feature p-7 sm:p-9">
              <span aria-hidden="true" className="font-serif text-7xl font-medium italic text-blush">
                {s.n}
              </span>
              <h3 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">{s.title}</h3>
              <p className="mt-3 text-base text-on-dark sm:text-lg">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <span className="absolute bottom-3 right-4 text-2xs text-on-dark-subtle">Imagem ilustrativa</span>
    </section>
  );
}

/* ================================ Depoimentos (baralho) ================================ */
export function TestimonialDeck({
  items,
  background,
  reviewsUrl,
}: {
  items: { name: string; procedure: string; text: string }[];
  background: StaticImageData;
  reviewsUrl: string;
}) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        gsap.set(cards, { position: "absolute", inset: 0 });
        gsap.set(cards.slice(1), { yPercent: 160, autoAlpha: 0, rotate: (i) => (i % 2 ? -6 : 6) });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: scope.current, start: "top top", end: `+=${cards.length * 70}%`, pin: true, scrub: EASE.scrub },
        });
        tl.fromTo("[data-deck-bg]", { yPercent: -8 }, { yPercent: 8, ease: "none", duration: cards.length }, 0);
        cards.forEach((c, i) => {
          if (i === 0) return;
          tl.to(c, { autoAlpha: 1, duration: 0.25, ease: "none" }, i - 1)
            .to(c, { yPercent: 0, rotate: i % 2 ? -2 : 2, duration: 1, ease: "power2.out" }, i - 1)
            .to(
            cards.slice(0, i),
            {
              scale: (j) => 1 - (i - j) * 0.05,
              yPercent: (j) => -(i - j) * 7,
              // cartões de trás escurecem e somem aos poucos (sem texto vazando)
              autoAlpha: (j) => Math.max(0, 1 - (i - j) * 0.45),
              duration: 1,
              ease: "power2.out",
            },
            i - 1,
          );
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} aria-labelledby="t-dep" className="relative isolate min-h-[100svh] overflow-hidden text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <div data-deck-bg className="absolute -inset-y-[10%] inset-x-0">
          <Image src={background} alt="" fill placeholder="blur" sizes="100vw" className="object-cover" style={{ objectPosition: "center 40%" }} />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-night/85 to-night/65" />
      <div className="mx-auto grid min-h-[100svh] max-w-6xl content-center gap-8 px-4 pb-28 pt-20 sm:pb-20 md:grid-cols-[1fr_1fr] md:items-center">
        <div>
          <p className="eyebrow text-blush">Depoimentos</p>
          <h2 id="t-dep" className="h-section mt-2 text-white">
            O que dizem as <em className="font-medium italic text-blush">pacientes</em>
          </h2>
          <p className="mt-3 max-w-sm text-sm text-on-dark sm:mt-4 sm:text-base">Depoimentos de exemplo. A nota real da clínica está no Google.</p>
          <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-light mt-4 sm:mt-6">
            Ver avaliações no Google
          </a>
        </div>
        <div className="relative grid gap-4 motion-safe:min-h-[340px] sm:motion-safe:min-h-[380px]">
          {items.map((t) => (
            <figure key={t.name} data-card className="flex flex-col rounded-feature border border-white/15 bg-ink p-7 shadow-2xl">
              <span className="chip self-start bg-white/20 text-white">Exemplo</span>
              <span aria-hidden="true" className="mt-3 font-serif text-6xl leading-none text-blush">“</span>
              <blockquote className="flex-1 font-serif text-xl leading-snug sm:text-3xl">{t.text}</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-on-dark-muted"> · {t.procedure}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================ Chamada com vídeo que cresce ================================ */
export function CtaVideoScene({ video, poster }: { video: string; poster: StaticImageData }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-cta-media]",
          { clipPath: "inset(12% 10% 12% 10% round 40px)", scale: 0.96 },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top 90%", end: "top top", scrub: EASE.scrub },
          },
        );
        gsap.from("[data-cta-copy] > *", {
          yPercent: 50,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 1.2,
          ease: EASE.signature,
          scrollTrigger: { trigger: scope.current, start: "top 40%", once: true },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} aria-labelledby="t-cta" className="relative isolate z-10 flex min-h-[100svh] items-center justify-center overflow-hidden bg-bg text-center text-white">
      <div data-cta-media className="absolute inset-0 -z-10 bg-night">
        <AmbientVideo src={video} poster={poster} label="Vídeo ilustrativo: aplicação de máscara facial" className="h-full w-full" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-night/60" />
      </div>
      <div data-cta-copy className="mx-auto max-w-2xl px-4">
        <p className="eyebrow text-blush">Primeiro passo</p>
        <h2 id="t-cta" className="mt-3 font-serif text-5xl font-semibold leading-tight sm:text-7xl">
          Sua avaliação é <em className="font-medium italic text-blush">gratuita</em>
        </h2>
        <p className="mx-auto mt-4 max-w-md text-on-dark">Escolha o dia e o horário em menos de um minuto, direto pelo celular.</p>
        <div className="mt-8">
          <Link href="/agendar?servico=avaliacao" data-magnetic className="btn-light btn-lg inline-flex">
            Agendar avaliação
          </Link>
        </div>
      </div>
      <span className="absolute bottom-3 left-4 text-2xs text-on-dark-subtle">Vídeo ilustrativo</span>
    </section>
  );
}
