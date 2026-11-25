"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/components/scroll/gsap";

/** Barra fixa de agendamento no celular, aparece depois do topo da página */
export function MobileCta() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Aparece só depois do topo (que já tem seus próprios botões de agendar)
    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>('section[aria-label="Apresentação"]');
      const limit = hero ? hero.offsetTop + hero.offsetHeight - window.innerHeight * 0.5 : 520;
      // Some enquanto uma seção está presa na tela (para não cobrir a cena)
      const pinned = ScrollTrigger.getAll().some((st) => st.pin && st.isActive);
      setShow(window.scrollY > limit && !pinned);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur transition-transform duration-300 sm:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <Link href="/agendar?servico=avaliacao" tabIndex={show ? 0 : -1} className="btn-primary min-h-12 w-full text-base">
        Agendar avaliação gratuita
      </Link>
    </div>
  );
}
