"use client";

/**
 * Rolagem suave com inércia (Lenis) sincronizada ao GSAP/ScrollTrigger.
 * Uma instância só, criada aqui e destruída ao sair da página.
 * Não roda para quem pede "reduzir movimento".
 */
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "./gsap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: -40 } });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    // Recalcula posições quando fontes e imagens terminam de carregar
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
