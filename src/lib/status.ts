import type { Status } from "./types";

export const statusStyle: Record<Status, { bg: string; fg: string; dot: string }> = {
  confirmado: { bg: "#E3EDF4", fg: "#284E69", dot: "#3E6A8A" },
  concluido: { bg: "#E2F0E6", fg: "#2D5A3E", dot: "#3D7B55" },
  cancelado: { bg: "#EEECEB", fg: "#5E5856", dot: "#8A8380" },
  faltou: { bg: "#FBE4E1", fg: "#8E2B23", dot: "#C0453A" },
  retorno: { bg: "#EFE7F6", fg: "#563A73", dot: "#7A57A0" },
};

/** Símbolo exibido junto da cor, para não depender só dela (WCAG 1.4.1) */
export const statusIcon: Record<Status, string> = {
  confirmado: "•",
  concluido: "✓",
  cancelado: "✕",
  faltou: "!",
  retorno: "↻",
};
