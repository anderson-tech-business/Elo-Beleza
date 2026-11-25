import { bookingWindowDays, professionals, services, slotStepMin, workingHours } from "@/data/demo";
import type { DemoState } from "./types";
import { nowMinutesSP, shift, toHHMM, toMin, todaySP, weekday } from "./time";

export const serviceById = (id: string) => services.find((s) => s.id === id)!;
export const proById = (id: string) => professionals.find((p) => p.id === id)!;
export const prosForService = (serviceId: string) =>
  professionals.filter((p) => p.serviceIds.includes(serviceId));

/** Intervalos ocupados [início, fim] em minutos de uma profissional num dia */
export function busyIntervals(state: DemoState, proId: string, date: string): [number, number][] {
  const out: [number, number][] = [];
  for (const a of state.appointments) {
    if (a.professionalId !== proId || a.date !== date || a.status === "cancelado") continue;
    const s = toMin(a.start);
    out.push([s, s + serviceById(a.serviceId).durationMin]);
  }
  for (const b of state.blocks) {
    if (b.professionalId !== proId || b.date !== date) continue;
    out.push([toMin(b.start), toMin(b.end)]);
  }
  return out;
}

export interface Slot {
  time: string;
  proIds: string[];
}

/** Horários livres para um serviço numa data, para as profissionais indicadas */
export function freeSlots(
  state: DemoState,
  serviceId: string,
  date: string,
  proIds: string[],
  ignoreAppointmentId?: string,
): Slot[] {
  const dur = serviceById(serviceId).durationMin;
  const segments = workingHours[weekday(date)];
  const today = todaySP();
  if (!segments.length || date < today) return [];
  const minStart = date === today ? nowMinutesSP() + 60 : 0;
  const map = new Map<number, string[]>();
  const st = ignoreAppointmentId
    ? { ...state, appointments: state.appointments.filter((a) => a.id !== ignoreAppointmentId) }
    : state;
  for (const proId of proIds) {
    const busy = busyIntervals(st, proId, date);
    for (const [a, b] of segments) {
      for (let m = toMin(a); m + dur <= toMin(b); m += slotStepMin) {
        if (m < minStart) continue;
        if (busy.every(([bs, be]) => m + dur <= bs || m >= be)) {
          map.set(m, [...(map.get(m) ?? []), proId]);
        }
      }
    }
  }
  return [...map.entries()].sort((x, y) => x[0] - y[0]).map(([m, ids]) => ({ time: toHHMM(m), proIds: ids }));
}

export function bookingRange(): { first: string; last: string } {
  const first = todaySP();
  return { first, last: shift(first, bookingWindowDays) };
}

/** Minutos de expediente de um dia (para cálculo de ocupação) */
export function workingMinutes(date: string): number {
  return workingHours[weekday(date)].reduce((s, [a, b]) => s + toMin(b) - toMin(a), 0);
}
