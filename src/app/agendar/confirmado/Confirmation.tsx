"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { business } from "@/data/demo";
import { downloadIcs, googleCalendarUrl, type CalEvent } from "@/lib/calendar";
import { useDemoState } from "@/lib/store";
import { proById, serviceById } from "@/lib/slots";
import { fmtDate, fmtLong } from "@/lib/time";

export function Confirmation() {
  const params = useSearchParams();
  const id = params.get("id");
  const state = useDemoState();
  if (!state) return <p className="text-muted">Carregando…</p>;

  const appt = state.appointments.find((a) => a.id === id);
  if (!appt) {
    return (
      <div className="card p-6">
        <h1 className="font-serif text-3xl font-semibold text-primary-dark">Agendamento não encontrado</h1>
        <p className="mt-2 text-muted">Ele pode ter sido feito em outro navegador.</p>
        <Link href="/agendar" className="btn-primary mt-6">Fazer um agendamento</Link>
      </div>
    );
  }
  const service = serviceById(appt.serviceId);
  const pro = proById(appt.professionalId);
  const patient = state.patients.find((p) => p.id === appt.patientId);
  const ev: CalEvent = {
    title: `${service.name} — Elo Beleza`,
    date: appt.date,
    start: appt.start,
    durationMin: service.durationMin,
    details: `Atendimento com ${pro.name}.\nEndereço: ${business.fullAddress}\nTelefone: ${business.phone}\n\nChegue com 10 minutos de antecedência.`,
    uid: appt.id,
  };

  const rows: [string, string][] = [
    ["Serviço", service.name],
    ["Profissional", pro.name],
    ["Data", `${fmtDate(appt.date)} (${fmtLong(appt.date).split(",")[0]})`],
    ["Horário", `${appt.start} · ${service.durationMin} min`],
    ["Endereço", business.fullAddress],
  ];

  return (
    <div>
      <div aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-dark text-2xl text-white">✓</div>
      <h1 className="mt-4 font-serif text-4xl font-semibold text-primary-dark">Agendamento confirmado</h1>
      <p className="mt-2 text-muted">
        {patient ? `${patient.name.split(" ")[0]}, ` : ""}esperamos você! Guarde a data na sua agenda.
      </p>

      <dl className="card mt-6 divide-y divide-line">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[110px_1fr] gap-3 px-5 py-3 text-sm">
            <dt className="text-muted">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a href={googleCalendarUrl(ev)} target="_blank" rel="noopener noreferrer" className="btn-primary">
          Adicionar ao Google Calendar
        </a>
        <button type="button" className="btn-outline" onClick={() => downloadIcs(ev)}>
          Baixar .ics
        </button>
      </div>
      <p className="mt-4 rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary-dark">
        Na versão final, o convite chega automaticamente no seu e-mail com lembretes.
      </p>
      <p className="mt-6 text-sm text-muted">
        Precisa remarcar? Fale com a clínica pelo telefone {business.phone}.
      </p>
      <Link href="/" className="btn-ghost mt-4">← Voltar ao início</Link>
    </div>
  );
}
