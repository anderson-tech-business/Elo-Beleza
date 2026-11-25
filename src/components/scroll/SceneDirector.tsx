"use client";

/**
 * Efeitos globais da landing, ativados por atributos no HTML:
 *  - data-split        título surge linha a linha por trás de uma máscara
 *  - data-parallax     mídia desliza mais devagar que a página (profundidade)
 *  - data-stack        seção fica presa e escurece enquanto a próxima passa por cima (cortina)
 *  - data-zoom-in      seção entra pequena e arredondada e cresce até a tela cheia
 *  - data-slide="left|right"  bloco entra deslizando pela lateral
 *  - data-magnetic     botão atraído levemente pelo cursor (só desktop)
 * Tudo dentro de matchMedia: com "reduzir movimento" nada disso roda.
 */
import { useRef, type ReactNode } from "react";
import { EASE, MOTION_OK, gsap, ScrollTrigger, SplitText, useGSAP } from "./gsap";

export function SceneDirector({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ ok: MOTION_OK, desktop: `${MOTION_OK} and (min-width: 768px) and (pointer: fine)` }, (ctx) => {
        const { ok, desktop } = ctx.conditions as { ok: boolean; desktop: boolean };
        if (!ok) return;
        const q = gsap.utils.selector(scope);

        // Títulos com máscara (depois das fontes, para quebrar as linhas certo)
        const splits: SplitText[] = [];
        document.fonts.ready.then(() => {
          q<HTMLElement>("[data-split]").forEach((el) => {
            const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
            splits.push(split);
            gsap.from(split.lines, {
              yPercent: 110,
              duration: 1.3,
              stagger: 0.08,
              ease: EASE.signature,
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          });
          ScrollTrigger.refresh();
        });

        // Parallax de mídia
        q<HTMLElement>("[data-parallax]").forEach((el) => {
          const amount = Number(el.dataset.parallax || 12) * (desktop ? 1 : 0.6);
          gsap.fromTo(
            el,
            { yPercent: -amount, scale: 1.15 },
            {
              yPercent: amount,
              scale: 1.15,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Cortina: a seção fica presa e escurece enquanto a seguinte passa por cima
        q<HTMLElement>("[data-stack]").forEach((sec) => {
          const inner = sec.querySelector<HTMLElement>("[data-stack-inner]") ?? sec;
          const dim = sec.querySelector<HTMLElement>("[data-stack-dim]");
          const start = () => (sec.offsetHeight > window.innerHeight ? "bottom bottom" : "top top");
          ScrollTrigger.create({ trigger: sec, start, end: "+=100%", pin: true, pinSpacing: false });
          const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start, end: "+=100%", scrub: true } });
          tl.to(inner, { scale: 0.9, yPercent: -4, ease: "none" }, 0);
          if (dim) tl.to(dim, { opacity: 0.75, ease: "none" }, 0);
        });

        // Zoom de entrada: começa como cartão e vira tela cheia
        q<HTMLElement>("[data-zoom-in]").forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0.88, clipPath: "inset(0% 0% 0% 0% round 48px)" },
            {
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: EASE.scrub },
            },
          );
        });

        // Entrada lateral
        q<HTMLElement>("[data-slide]").forEach((el) => {
          const dir = el.dataset.slide === "right" ? 1 : -1;
          gsap.from(el, {
            xPercent: 18 * dir * (desktop ? 1 : 0.5),
            autoAlpha: 0,
            duration: 1.2,
            ease: EASE.signature,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          });
        });

        // Botões magnéticos (só com mouse)
        const cleanups: (() => void)[] = [];
        if (desktop) {
          q<HTMLElement>("[data-magnetic]").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: EASE.micro });
            const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: EASE.micro });
            const move = (e: PointerEvent) => {
              const r = el.getBoundingClientRect();
              xTo(gsap.utils.clamp(-10, 10, (e.clientX - (r.left + r.width / 2)) * 0.25));
              yTo(gsap.utils.clamp(-10, 10, (e.clientY - (r.top + r.height / 2)) * 0.25));
            };
            const leave = () => {
              xTo(0);
              yTo(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
          });
        }

        return () => {
          splits.forEach((s) => s.revert());
          cleanups.forEach((c) => c());
        };
      });
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
