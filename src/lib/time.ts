import { addDays, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const TZ = "America/Sao_Paulo";

/** Data de hoje (yyyy-MM-dd) no fuso de São Paulo */
export function todaySP(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Minutos desde 00:00 agora, no fuso de São Paulo */
export function nowMinutesSP(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

/** Converte yyyy-MM-dd em Date local (meio-dia, evita problemas de fuso) */
export function d(date: string): Date {
  return parseISO(date + "T12:00:00");
}

export function iso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function shift(date: string, days: number): string {
  return iso(addDays(d(date), days));
}

export function toMin(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function toHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function fmtDate(date: string): string {
  return format(d(date), "dd/MM/yyyy");
}

export function fmtLong(date: string): string {
  return format(d(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function fmtShort(date: string): string {
  return format(d(date), "EEE, dd/MM", { locale: ptBR });
}

export function weekday(date: string): number {
  return d(date).getDay();
}

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const pct = (v: number) =>
  `${(v * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
