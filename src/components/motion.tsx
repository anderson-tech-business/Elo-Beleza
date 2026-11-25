"use client";

/**
 * Animações da landing (Motion). Componentes pequenos e client-side para
 * que a página continue sendo um componente de servidor.
 * - LazyMotion + domAnimation: carrega só o necessário (bundle menor).
 * - reducedMotion="user": quem pede menos movimento no sistema vê só fades.
 */
import { LazyMotion, MotionConfig, domAnimation, m, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease, liftShadow, stagger } from "@/lib/motion-tokens";


export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
};

/** Bloco que aparece ao entrar na tela */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
};

type Tag = "div" | "ul" | "ol" | "dl";
type ItemTag = "div" | "li" | "article" | "figure";

/** Lista cujos itens entram em sequência ao rolar */
export function Stagger({
  children,
  className,
  as = "div",
  label,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  label?: string;
}) {
  const C = m[as];
  return (
    <C
      className={className}
      aria-label={label}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={container}
    >
      {children}
    </C>
  );
}

/** Item de <Stagger>; com `lift`, sobe levemente no hover */
export function StaggerItem({
  children,
  className,
  as = "div",
  lift = false,
}: {
  children: ReactNode;
  className?: string;
  as?: ItemTag;
  lift?: boolean;
}) {
  const C = m[as];
  return (
    <C
      className={className}
      variants={fadeUp}
      whileHover={
        lift
          ? { y: -6, boxShadow: liftShadow, transition: { duration: duration.fast, ease: ease.out } }
          : undefined
      }
    >
      {children}
    </C>
  );
}

/** Entrada do topo da página (ao carregar, não ao rolar) */
export function HeroIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
    >
      {children}
    </m.div>
  );
}

export function HeroItem({ children, className, from = "up" }: { children: ReactNode; className?: string; from?: "up" | "right" }) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...(from === "up" ? { y: 18 } : { x: 32 }) },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration: duration.base + 0.1, ease: ease.out } },
      }}
    >
      {children}
    </m.div>
  );
}

/** Retorno tátil para botões principais */
export function Press({ children, className = "inline-block" }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      tabIndex={-1} // o link interno já é focável; evita parada dupla no Tab
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </m.div>
  );
}

/** Entrada lenta e única (decorativa). Sem repetição infinita: WCAG 2.2.2 */
export function Float({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.6, ease: ease.out, delay: 0.3 }}
    >
      {children}
    </m.div>
  );
}
