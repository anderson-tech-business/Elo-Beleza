import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { originLabels, paymentLabels, professionals, services } from "@/data/demo";
import { serviceById, workingMinutes } from "./slots";
import { d, iso, shift, weekday } from "./time";
import type { Appointment, DemoState, Origin, Payment } from "./types";

export type Period = "mes" | "mes-passado" | "90d" | "custom";

export function periodRange(p: Period, today: string, custom: { from: string; to: string }) {
  if (p === "mes") return { from: iso(startOfMonth(d(today))), to: today };
  if (p === "mes-passado") {
    const m = addMonths(d(today), -1);
    return { from: iso(startOfMonth(m)), to: iso(endOfMonth(m)) };
  }
  if (p === "90d") return { from: shift(today, -89), to: today };
  return custom.from <= custom.to ? custom : { from: custom.to, to: custom.from };
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const revenue = (xs: Appointment[]) => sum(xs.map((a) => (a.status === "concluido" ? a.paidAmount ?? 0 : 0)));

function daysBetween(from: string, to: string) {
  const out: string[] = [];
  for (let c = from; c <= to; c = shift(c, 1)) out.push(c);
  return out;
}

/** Data da primeira visita (não cancelada) de cada paciente */
function firstVisits(state: DemoState) {
  const first: Record<string, string> = {};
  for (const a of state.appointments) {
    if (a.status === "cancelado") continue;
    if (!first[a.patientId] || a.date < first[a.patientId]) first[a.patientId] = a.date;
  }
  return first;
}

export function computeDashboard(state: DemoState, from: string, to: string, proId: string, today: string) {
  const pros = proId ? [proId] : professionals.map((p) => p.id);
  const inPeriod = state.appointments.filter((a) => a.date >= from && a.date <= to);
  const scoped = inPeriod.filter((a) => pros.includes(a.professionalId));
  const done = scoped.filter((a) => a.status === "concluido");
  const paid = done.filter((a) => (a.paidAmount ?? 0) > 0);
  const faltas = scoped.filter((a) => a.status === "faltou");
  const cancel = scoped.filter((a) => a.status === "cancelado");

  // Ocupação: minutos agendados (não cancelados) / minutos de expediente
  const days = daysBetween(from, to);
  const capacity = sum(days.map(workingMinutes)) * pros.length;
  const booked = sum(scoped.filter((a) => a.status !== "cancelado").map((a) => serviceById(a.serviceId).durationMin));

  const first = firstVisits(state);
  const novas = new Set(scoped.filter((a) => a.status !== "cancelado" && first[a.patientId] === a.date).map((a) => a.patientId));

  const fat = revenue(scoped);
  const kpis = {
    faturamento: fat,
    concluidos: done.length,
    ticket: paid.length ? fat / paid.length : 0,
    ocupacao: capacity ? booked / capacity : 0,
    faltas: done.length + faltas.length ? faltas.length / (done.length + faltas.length) : 0,
    novas: novas.size,
  };

  // Ranking por profissional (sempre todas, para comparação)
  const byPro = professionals
    .map((p) => {
      const xs = inPeriod.filter((a) => a.professionalId === p.id);
      return {
        id: p.id,
        name: p.name,
        faturamento: revenue(xs),
        atendimentos: xs.filter((a) => a.status === "concluido").length,
      };
    })
    .sort((a, b) => b.faturamento - a.faturamento);
  const byProCount = [...byPro].sort((a, b) => b.atendimentos - a.atendimentos);

  // Serviços
  const byService = services
    .map((s) => {
      const xs = done.filter((a) => a.serviceId === s.id);
      return { name: s.name, qtd: xs.length, valor: revenue(xs) };
    })
    .filter((s) => s.qtd > 0);

  // Últimos 6 meses (independe do filtro de período)
  const months = Array.from({ length: 6 }, (_, i) => addMonths(startOfMonth(d(today)), i - 5));
  const allPro = state.appointments.filter((a) => pros.includes(a.professionalId));
  const monthly = months.map((m) => {
    const key = format(m, "yyyy-MM");
    const xs = allPro.filter((a) => a.date.startsWith(key));
    const done = xs.filter((a) => a.status === "concluido");
    const pats = new Set(done.map((a) => a.patientId));
    let nov = 0;
    pats.forEach((p) => {
      if (first[p]?.startsWith(key)) nov++;
    });
    return {
      mes: format(m, "MMM/yy", { locale: ptBR }),
      faturamento: revenue(xs),
      novas: nov,
      recorrentes: pats.size - nov,
    };
  });

  // Ocupação por dia da semana
  const wdNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const byWeekday = [2, 3, 4, 5, 6].map((wd) => {
    const ds = days.filter((x) => weekday(x) === wd);
    const cap = sum(ds.map(workingMinutes)) * pros.length;
    const bk = sum(
      scoped
        .filter((a) => a.status !== "cancelado" && weekday(a.date) === wd)
        .map((a) => serviceById(a.serviceId).durationMin),
    );
    return { dia: wdNames[wd], ocupacao: cap ? Math.round((bk / cap) * 1000) / 10 : 0 };
  });

  // Perdas
  const lost = (xs: Appointment[]) => sum(xs.map((a) => serviceById(a.serviceId).price));
  const perdas = {
    faltas: faltas.length,
    faltasValor: lost(faltas),
    cancel: cancel.length,
    cancelValor: lost(cancel),
    lista: [...faltas, ...cancel].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 8),
  };

  // Origem e pagamento
  const origem = (Object.keys(originLabels) as Origin[])
    .map((o) => ({ name: originLabels[o], qtd: scoped.filter((a) => a.origin === o && a.status !== "cancelado").length }))
    .sort((a, b) => b.qtd - a.qtd);
  const pagamento = (Object.keys(paymentLabels) as Payment[])
    .map((p) => ({ name: paymentLabels[p], valor: revenue(paid.filter((a) => a.payment === p)) }))
    .sort((a, b) => b.valor - a.valor);

  // Retornos e reaplicações pendentes
  const pend: { patientId: string; procedimento: string; data: string; tipo: string; proId: string }[] = [];
  for (const a of allPro) {
    if (a.status === "retorno" && a.date >= today)
      pend.push({ patientId: a.patientId, procedimento: "Retorno toxina", data: a.date, tipo: "Agendado", proId: a.professionalId });
  }
  const lastTox: Record<string, Appointment> = {};
  for (const a of allPro) {
    if (a.serviceId === "toxina" && (a.status === "concluido" || a.status === "confirmado")) {
      if (!lastTox[a.patientId] || a.date > lastTox[a.patientId].date) lastTox[a.patientId] = a;
    }
  }
  for (const a of Object.values(lastTox)) {
    if (a.status !== "concluido") continue;
    const due = shift(a.date, 120);
    if (due >= shift(today, -30) && due <= shift(today, 45))
      pend.push({ patientId: a.patientId, procedimento: "Reaplicação de toxina", data: due, tipo: due < today ? "Atrasada" : "Prevista", proId: a.professionalId });
  }
  pend.sort((a, b) => (a.data < b.data ? -1 : 1));

  return { kpis, byPro, byProCount, byService, monthly, byWeekday, perdas, origem, pagamento, pendentes: pend };
}
