import { business } from "@/data/demo";
import { toHHMM, toMin } from "./time";

export interface CalEvent {
  title: string;
  date: string; // yyyy-MM-dd (horário de São Paulo)
  start: string; // HH:mm
  durationMin: number;
  details: string;
  uid: string;
}

const stamp = (date: string, hhmm: string) => `${date.replace(/-/g, "")}T${hhmm.replace(":", "")}00`;

function endOf(ev: CalEvent) {
  // Atendimentos nunca passam da meia-noite
  return toHHMM(toMin(ev.start) + ev.durationMin);
}

export function googleCalendarUrl(ev: CalEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${stamp(ev.date, ev.start)}/${stamp(ev.date, endOf(ev))}`,
    ctz: "America/Sao_Paulo",
    details: ev.details,
    location: business.fullAddress,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function icsContent(ev: CalEvent): string {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Elo Beleza com Proposito//Modelo demonstrativo//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:America/Sao_Paulo",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:-0300",
    "TZOFFSETTO:-0300",
    "TZNAME:-03",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${ev.uid}@elobelezacomproposito.com.br`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=America/Sao_Paulo:${stamp(ev.date, ev.start)}`,
    `DTEND;TZID=America/Sao_Paulo:${stamp(ev.date, endOf(ev))}`,
    `SUMMARY:${esc(ev.title)}`,
    `DESCRIPTION:${esc(ev.details)}`,
    `LOCATION:${esc(business.fullAddress)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Lembrete: atendimento amanhã na Elo Beleza",
    "TRIGGER:-PT24H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Lembrete: atendimento em 2 horas na Elo Beleza",
    "TRIGGER:-PT2H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(ev: CalEvent) {
  const blob = new Blob([icsContent(ev)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "elo-beleza-agendamento.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
