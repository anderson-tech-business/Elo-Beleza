"use client";

/**
 * Imagens, vídeo e animações ligadas à rolagem da landing.
 * Tudo usa transform/opacity (sem animar layout) e respeita
 * "reduzir movimento" do sistema.
 */
import Image, { type StaticImageData } from "next/image";
import { animate, m, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ----------------------------- Imagem com parallax ----------------------------- */
export function ParallaxImage({
  src,
  alt,
  className = "",
  sizes,
  strength = 60,
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes: string;
  strength?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-strength / 2, strength / 2]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div className="absolute -inset-y-[12%] inset-x-0" style={{ y }}>
        <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" priority={priority} className="object-cover" />
      </m.div>
    </div>
  );
}

/* ----------------------------- Imagem que se revela ----------------------------- */
export function RevealImage({
  src,
  alt,
  className = "",
  sizes,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes: string;
}) {
  return (
    <m.div
      className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden ${className}`}
      initial={{ clipPath: "inset(12% 12% 12% 12% round 24px)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 24px)", opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" className="object-cover" />
    </m.div>
  );
}

/* ----------------------------- Vídeo ambiente ----------------------------- */
/**
 * Toca sem som e em loop só quando está visível. Tem botão de pausa
 * (WCAG 2.2.2) e não inicia sozinho para quem pede menos movimento.
 */
export function AmbientVideo({
  src,
  poster,
  label,
  className = "",
}: {
  src: string;
  poster: StaticImageData;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(true);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused) v.play().catch(() => setPaused(true));
        else v.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduce, userPaused]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover object-[50%_25%]"
        src={src}
        poster={poster.src}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary-dark shadow-md backdrop-blur transition-transform hover:scale-105"
        aria-label={paused ? "Reproduzir vídeo" : "Pausar vídeo"}
      >
        {paused ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current"><path d="M8 5v14l11-7z" /></svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
        )}
      </button>
    </div>
  );
}

/* ----------------------------- Contador ----------------------------- */
export function CountUp({ to, decimals = 0, suffix = "", className }: { to: number; decimals?: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const fmt = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
  const [text, setText] = useState(fmt(to));

  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setText(fmt(v)) });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {/* leitores de tela leem o valor final, sem a contagem */}
      <span aria-hidden="true">{text}</span>
      <span className="sr-only">{fmt(to)}</span>
    </span>
  );
}

/* ----------------------------- Faixa de palavras ligada à rolagem ----------------------------- */
export function ScrollMarquee({ words }: { words: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["4%", "-28%"]);
  const line = [...words, ...words, ...words];
  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden border-y border-line bg-surface py-5">
      <m.div style={{ x }} className="flex w-max gap-10 whitespace-nowrap font-serif text-3xl text-primary-dark/80 sm:text-5xl">
        {line.map((w, i) => (
          <span key={i} className="flex items-center gap-10">
            {w}
            <span className="text-primary">✦</span>
          </span>
        ))}
      </m.div>
    </div>
  );
}

/* ----------------------------- Linha que se desenha ----------------------------- */
export function DrawLine({ className = "" }: { className?: string }) {
  return (
    <m.div
      aria-hidden="true"
      className={`origin-left bg-primary-dark/40 ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
