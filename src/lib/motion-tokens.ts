/**
 * Tokens de movimento. Use estes valores em vez de números soltos.
 * Documentação: docs/DESIGN_SYSTEM.md
 */
export const ease = {
  /** Saída suave, sem "quique": entradas, revelações e respostas a gestos */
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const duration = {
  /** Feedback de hover/toque */
  fast: 0.25,
  /** Entradas de texto e cartões */
  base: 0.7,
  /** Revelação de imagens e linhas */
  slow: 1.1,
  /** Ícones se desenhando */
  draw: 1.8,
};

/** Intervalo entre itens de uma lista que entra em sequência */
export const stagger = 0.09;

/** Sombra de elevação no hover (mesma do token `shadow-lift`) */
export const liftShadow = "0 18px 40px -24px rgb(140 90 80 / 0.45)";
