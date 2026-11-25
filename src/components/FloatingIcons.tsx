"use client";

/**
 * Ícones de linha decorativos no fundo das seções.
 * - Desenham o próprio traço ao entrar na tela (uma vez).
 * - Depois só se movem em resposta à pessoa: rolagem (parallax em
 *   profundidades diferentes) e mouse no desktop. Sem movimento
 *   automático infinito (WCAG 2.2.2).
 * - Com "reduzir movimento", ficam parados.
 */
import { m, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue, type Variants } from "motion/react";
import { useEffect, useRef } from "react";

const paths: Record<string, string[]> = {
  // gota
  drop: ["M12 3c3.5 4.6 6 8 6 11a6 6 0 0 1-12 0c0-3 2.5-6.4 6-11z", "M9.5 15.5a2.6 2.6 0 0 0 2.4 2.4"],
  // brilho de 4 pontas
  sparkle: ["M12 2.5c.6 4.8 2.7 6.9 7.5 7.5-4.8.6-6.9 2.7-7.5 7.5-.6-4.8-2.7-6.9-7.5-7.5 4.8-.6 6.9-2.7 7.5-7.5z", "M19 17.5c.2 1.4.9 2.1 2.3 2.3-1.4.2-2.1.9-2.3 2.3-.2-1.4-.9-2.1-2.3-2.3 1.4-.2 2.1-.9 2.3-2.3z"],
  // folha
  leaf: ["M5 19C5 10 10.5 4.5 19.5 4.5 19.5 13.5 14 19 5 19z", "M5 19 14.5 9.5"],
  // flor de lótus
  lotus: [
    "M12 6c2 2.2 3 4.6 3 7.2S13.8 18 12 19c-1.8-1-3-3.2-3-5.8S10 8.2 12 6z",
    "M12 19c-3.6 0-6.8-2-8-5.2 2.6-.4 5.2.3 7 2",
    "M12 19c3.6 0 6.8-2 8-5.2-2.6-.4-5.2.3-7 2",
  ],
  // coração
  heart: ["M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"],
  // círculo pontilhado (bolha)
  bubble: ["M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z", "M8.5 9.5a4 4 0 0 1 3-2"],
};

export interface IconSpec {
  name: keyof typeof paths;
  top: string;
  left: string;
  size: number;
  /** Profundidade: quanto maior, mais se move (rolagem e mouse) */
  depth: number;
  rotate?: number;
}

/** Conjunto padrão, espalhado pelas bordas para não competir com o texto */
export const defaultIcons: IconSpec[] = [
  { name: "sparkle", top: "8%", left: "6%", size: 34, depth: 1.2, rotate: 40 },
  { name: "drop", top: "18%", left: "88%", size: 40, depth: 0.8, rotate: -20 },
  { name: "leaf", top: "62%", left: "4%", size: 46, depth: 1.5, rotate: 30 },
  { name: "lotus", top: "78%", left: "80%", size: 52, depth: 0.6, rotate: -15 },
  { name: "bubble", top: "40%", left: "94%", size: 26, depth: 2, rotate: 0 },
  { name: "heart", top: "86%", left: "36%", size: 28, depth: 1.1, rotate: 25 },
  { name: "sparkle", top: "30%", left: "48%", size: 18, depth: 2.4, rotate: -30 },
];

// pathLength é válido em <path>, mas os tipos de Variants desta versão não o incluem
const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1 },
} as unknown as Variants;

function useMouse() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5);
      y.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y]);
  return { x: useSpring(x, { stiffness: 50, damping: 18 }), y: useSpring(y, { stiffness: 50, damping: 18 }) };
}

function FloatingIcon({
  spec,
  progress,
  mouse,
  reduce,
  index,
}: {
  spec: IconSpec;
  progress: MotionValue<number>;
  mouse: { x: MotionValue<number>; y: MotionValue<number> };
  reduce: boolean;
  index: number;
}) {
  const k = reduce ? 0 : spec.depth;
  const scrollY = useTransform(progress, [0, 1], [70 * k, -70 * k]);
  const rot = useTransform(progress, [0, 1], [-(spec.rotate ?? 0) / 2, (spec.rotate ?? 0) / 2]);
  const mx = useTransform(mouse.x, (v) => v * 40 * k);
  const my = useTransform(mouse.y, (v) => v * 40 * k);
  const y = useTransform([scrollY, my] as MotionValue<number>[], ([a, b]: number[]) => a + b);

  return (
    <m.svg
      viewBox="0 0 24 24"
      width={spec.size}
      height={spec.size}
      className="absolute"
      style={{ top: spec.top, left: spec.left, x: mx, y, rotate: rot }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[spec.name].map((d, i) => (
        <m.path
          key={i}
          d={d}
          variants={draw}
          initial={reduce ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.15 * index + 0.2 * i, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </m.svg>
  );
}

export function FloatingIcons({
  icons = defaultIcons,
  className = "text-[#B9847A]/60",
}: {
  icons?: IconSpec[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mouse = useMouse();
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      {icons.map((s, i) => (
        <FloatingIcon key={i} spec={s} progress={scrollYProgress} mouse={mouse} reduce={reduce} index={i} />
      ))}
    </div>
  );
}
