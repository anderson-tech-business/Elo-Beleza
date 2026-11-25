"use client";

import { workingHours } from "@/data/demo";
import { addAppointment, getState, updateAppointment } from "./store";
import { freeSlots } from "./slots";
import { shift, weekday } from "./time";
import type { Appointment, Payment } from "./types";

/** Conclui um atendimento. Se for toxina, sugere retorno em 15 dias. */
export function concludeAppointment(a: Appointment, paidAmount: number, payment?: Payment): Appointment | null {
  updateAppointment(a.id, { status: "concluido", paidAmount, payment: paidAmount > 0 ? payment : undefined });
  if (a.serviceId !== "toxina") return null;

  const state = getState();
  const exists = state.appointments.some(
    (x) => x.patientId === a.patientId && x.serviceId === "retorno-toxina" && x.date > a.date && x.status !== "cancelado",
  );
  if (exists) return null;

  let date = shift(a.date, 15);
  for (let tries = 0; tries < 10; tries++) {
    if (workingHours[weekday(date)].length) {
      const slot = freeSlots(state, "retorno-toxina", date, [a.professionalId])[0];
      if (slot) {
        return addAppointment({
          patientId: a.patientId,
          serviceId: "retorno-toxina",
          professionalId: a.professionalId,
          date,
          start: slot.time,
          status: "retorno",
          origin: a.origin,
          notes: "Retorno sugerido automaticamente após aplicação de toxina.",
        });
      }
    }
    date = shift(date, 1);
  }
  return null;
}
