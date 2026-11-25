"use client";

/**
 * Topo "preso" na tela com o vídeo controlado pela rolagem.
 *
 * Ato 1 (0–33%): título e chamada. O vídeo começa a avançar.
 * Ato 2 (33–66%): frase de impacto palavra a palavra; o quadro do vídeo
 *                 encolhe de tela cheia para um cartão arredondado.
 * Ato 3 (66–100%): "Sua primeira visita" e botão de agendar.
 *
 * O vídeo foi codificado com quadro-chave a cada 4 quadros para a busca
 * ficar suave. Com "reduzir movimento", vira um topo estático.
 */
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  m,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FloatingIcons, type IconSpec } from "./FloatingIcons";

interface Props {
  src: string;
  mobileSrc: string;
  poster: StaticImageData;
  ratingLabel: string;
  reviewsUrl: string;
}

const heroIcons: IconSpec[] = [
  { name: "sparkle", top: "16%", left: "8%", size: 30, depth: 1.4, rotate: 60 },
  { name: "drop", top: "24%", left: "84%", size: 38, depth: 1, rotate: -30 },
  { name: "leaf", top: "70%", left: "88%", size: 44, depth: 1.6, rotate: 40 },
  { name: "lotus", top: "78%", left: "10%", size: 48, depth: 0.8, rotate: -20 },
  { name: "sparkle", top: "52%", left: "72%", size: 18, depth: 2.2, rotate: -45 },
  { name: "bubble", top: "12%", left: "56%", size: 22, depth: 2, rotate: 0 },
];

const words = ["Natural.", "Seguro.", "Do seu jeito."];

/** Janela de opacidade: aparece em [a,b], some em [c,d] */
function useWindow(p: MotionValue<number>, a: number, b: number, c: number, d: number) {
  return useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
}

function Word({ p, i, text }: { p: MotionValue<number>; i: number; text: string }) {
  const start = 0.36 + i * 0.07;
  const opacity = useTransform(p, [start, start + 0.08, 0.64, 0.7], [0, 1, 1, 0]);
  const y = useTransform(p, [start, start + 0.08], [60, 0]);
  const blur = useTransform(p, [start, start + 0.08], [12, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  return (
    <m.span className="block" style={{ opacity, y, filter }}>
      {i === 1 ? <em className="font-medium italic text-blush">{text}</em> : text}
    </m.span>
  );
}

export function HeroScrub({ src, mobileSrc, poster, ratingLabel, reviewsUrl }: Props) {
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Só troca para a versão estática depois de montar (evita diferença com o HTML do servidor)
  const reduce = mounted && !!prefersReduced;
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [act, setAct] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Suaviza a rolagem antes de mover o vídeo (evita "pulos" no trackpad)
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    setSource(window.matchMedia("(max-width: 640px)").matches ? mobileSrc : src);
  }, [reduce, src, mobileSrc]);

  // Prepara o vídeo para busca (Safari no iPhone só libera quadros após um play)
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !source) return;
    const onLoaded = () => {
      v.play()
        .then(() => {
          v.pause();
          setReady(true);
        })
        .catch(() => setReady(true));
    };
    v.addEventListener("loadeddata", onLoaded, { once: true });
    return () => v.removeEventListener("loadeddata", onLoaded);
  }, [source]);

  // Rolagem → tempo do vídeo
  useMotionValueEvent(p, "change", (v) => {
    const vid = videoRef.current;
    if (vid && ready && vid.duration) {
      const t = Math.min(vid.duration - 0.05, Math.max(0, v * vid.duration));
      if (Math.abs(vid.currentTime - t) > 1 / 30) vid.currentTime = t;
    }
    const next = v < 0.33 ? 0 : v < 0.66 ? 1 : 2;
    setAct((cur) => (cur === next ? cur : next));
  });

  // Quadro do vídeo: tela cheia → cartão arredondado
  const inset = useTransform(p, [0.3, 0.62], [0, 7]);
  const radius = useTransform(p, [0.3, 0.62], [0, 36]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
  const videoScale = useTransform(p, [0, 1], [1.12, 1]);
  const overlay = useTransform(p, [0, 0.3, 0.62, 1], [0.55, 0.45, 0.5, 0.72]);

  // Ato 1
  const a1Opacity = useWindow(p, -1, 0, 0.18, 0.3);
  const a1Y = useTransform(p, [0, 0.3], [0, -120]);
  const a1Scale = useTransform(p, [0, 0.3], [1, 0.92]);
  // Ato 3
  const a3Opacity = useWindow(p, 0.68, 0.78, 1.1, 1.2);
  const a3Y = useTransform(p, [0.68, 0.8], [80, 0]);
  // Barra de progresso
  const bar = useTransform(p, [0, 1], [0, 1]);
  const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);

  if (reduce) {
    return (
      <section className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-ink text-white">
        <Image src={poster} alt="" fill priority placeholder="blur" sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-night/65" />
        <div className="mx-auto w-full max-w-6xl px-4 py-24">
          <Act1 ratingLabel={ratingLabel} reviewsUrl={reviewsUrl} />
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[280svh] bg-ink sm:h-[320vh]" aria-label="Apresentação">
      <div className="sticky top-0 isolate h-[100svh] overflow-hidden text-white">
        {/* Vídeo controlado pela rolagem */}
        <m.div className="absolute inset-0 -z-20 bg-ink" style={{ clipPath }} aria-hidden="true">
          <m.div className="absolute inset-0" style={{ scale: videoScale }}>
            <Image src={poster} alt="" fill priority placeholder="blur" sizes="100vw" className="object-cover" />
            {source && (
              <video
                ref={videoRef}
                src={source}
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
              />
            )}
          </m.div>
          <m.div className="absolute inset-0 bg-night" style={{ opacity: overlay }} />
        </m.div>

        <FloatingIcons icons={heroIcons} className="text-blush/50" />

        {/* Ato 1 */}
        <m.div
          className="absolute inset-0 flex items-end pb-28 pt-28 sm:items-center sm:pb-0"
          style={{ opacity: a1Opacity, y: a1Y, scale: a1Scale }}
          aria-hidden={act !== 0}
          // @ts-expect-error inert é atributo HTML válido; o React 18 ainda não o tipa
          inert={act !== 0 ? "" : undefined}
        >
          <div className="mx-auto w-full max-w-6xl px-4">
            <Act1 ratingLabel={ratingLabel} reviewsUrl={reviewsUrl} />
          </div>
        </m.div>

        {/* Ato 2: frase de impacto */}
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center" aria-hidden={act !== 1}>
          <p className="font-serif text-6xl font-semibold leading-[0.95] sm:text-8xl lg:text-9xl">
            {words.map((w, i) => (
              <Word key={w} p={p} i={i} text={w} />
            ))}
          </p>
        </div>

        {/* Ato 3: primeira visita */}
        <m.div
          className="absolute inset-0 flex items-center justify-center px-6"
          style={{ opacity: a3Opacity, y: a3Y }}
          aria-hidden={act !== 2}
          // @ts-expect-error inert é atributo HTML válido; o React 18 ainda não o tipa
          inert={act !== 2 ? "" : undefined}
        >
          <div className="glass w-full max-w-lg rounded-feature p-7 sm:p-9">
            <p className="eyebrow text-xs text-blush">Sua primeira visita</p>
            <h2 className="h-section mt-2 text-white">
              Começa por uma <em className="font-medium italic text-blush">conversa</em>
            </h2>
            <ul className="mt-5 space-y-3">
              {[
                ["Avaliação gratuita", "sem compromisso"],
                ["Protocolo individual", "pensado para o seu rosto"],
                ["Retorno incluso", "em cerca de 15 dias"],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">✓</span>
                  <span>
                    <span className="font-semibold">{t}</span> <span className="text-on-dark-muted">· {d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/agendar?servico=avaliacao" className="btn-light btn-lg mt-7 w-full">
              Agendar avaliação gratuita
            </Link>
          </div>
        </m.div>

        {/* Dica de rolagem + progresso */}
        <m.div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/80"
          style={{ opacity: hintOpacity }}
        >
          Role para descobrir
          <span className="block h-8 w-px overflow-hidden bg-white/30">
            <span className="block h-1/2 w-full animate-[scrollhint_1.6s_ease-in-out_3] bg-white" />
          </span>
        </m.div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
          <m.div className="h-full origin-left bg-blush" style={{ scaleX: bar }} />
        </div>
        <span className="absolute bottom-3 right-4 text-2xs text-white/60">Vídeo ilustrativo</span>
      </div>
    </section>
  );
}

function Act1({ ratingLabel, reviewsUrl }: { ratingLabel: string; reviewsUrl: string }) {
  return (
    <>
      <a href={reviewsUrl} target="_blank" rel="noopener noreferrer" className="glass chip px-3 py-1 text-sm text-white">
        <span aria-hidden="true" className="mr-1 text-gold-light">★</span>
        {ratingLabel}
      </a>
      <h1 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[1.02] sm:text-7xl lg:text-8xl">
        Harmonização facial <em className="font-medium italic text-blush">em Itaquera</em>
      </h1>
      <p className="mt-5 max-w-xl text-lg text-on-dark">
        Resultados naturais, seguros e discretos, com atendimento acolhedor e protocolo individual para realçar a sua
        beleza — sem exageros.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link href="/agendar?servico=avaliacao" className="btn-light btn-lg">
          Agendar avaliação
        </Link>
        <a href="#procedimentos" className="btn-outline-light">
          Ver procedimentos
        </a>
      </div>
    </>
  );
}
