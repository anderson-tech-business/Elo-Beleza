"use client";

import { Fragment, useMemo, useState } from "react";
import { statusLabels } from "@/data/demo";
import { proById, serviceById } from "@/lib/slots";
import { statusStyle } from "@/lib/status";
import { useDemoState, useSession } from "@/lib/store";
import { brl, fmtDate, todaySP } from "@/lib/time";

export default function PacientesPage() {
  const state = useDemoState();
  const session = useSession();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    if (!state || !session) return [];
    const today = todaySP();
    const own = session.role === "pro" ? session.professionalId : null;
    return state.patients
      .map((p) => {
        const appts = state.appointments
          .filter((a) => a.patientId === p.id && (!own || a.professionalId === own))
          .sort((a, b) => (a.date + a.start < b.date + b.start ? 1 : -1));
        const done = appts.filter((a) => a.status === "concluido");
        const next = [...appts].reverse().find((a) => a.date >= today && (a.status === "confirmado" || a.status === "retorno"));
        return {
          p,
          appts,
          visits: done.length,
          last: done[0]?.date,
          next,
          total: done.reduce((s, a) => s + (a.paidAmount ?? 0), 0),
        };
      })
      .filter((r) => r.appts.length > 0)
      .filter((r) => {
        const t = q.trim().toLowerCase();
        return !t || r.p.name.toLowerCase().includes(t) || r.p.phone.includes(t) || r.p.email.toLowerCase().includes(t);
      })
      .sort((a, b) => a.p.name.localeCompare(b.p.name, "pt-BR"));
  }, [state, session, q]);

  if (!state || !session) return <p className="text-muted">Carregando…</p>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-primary-dark">Pacientes</h1>
          <p className="text-sm text-muted">
            {rows.length} pacientes{session.role === "pro" ? " atendidas por você" : ""} · dados fictícios
          </p>
        </div>
        <div className="w-full sm:w-72">
          <label htmlFor="busca" className="sr-only">Buscar paciente</label>
          <input id="busca" type="search" className="input" placeholder="Buscar por nome, telefone ou e-mail" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="card mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th scope="col" className="px-4 py-3 font-medium">Paciente</th>
              <th scope="col" className="px-4 py-3 font-medium">Contato</th>
              <th scope="col" className="px-4 py-3 font-medium">Atendimentos</th>
              <th scope="col" className="px-4 py-3 font-medium">Última visita</th>
              <th scope="col" className="px-4 py-3 font-medium">Próximo</th>
              {session.role === "admin" && <th scope="col" className="px-4 py-3 font-medium">Total gasto</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <Fragment key={r.p.id}>
                <tr className="border-b border-line hover:bg-primary-soft/40">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-left font-medium text-primary-dark underline-offset-2 hover:underline"
                      aria-expanded={open === r.p.id}
                      onClick={() => setOpen(open === r.p.id ? null : r.p.id)}
                    >
                      {r.p.name}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {r.p.phone}
                    <br />
                    <span className="text-xs">{r.p.email}</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{r.visits}</td>
                  <td className="px-4 py-3">{r.last ? fmtDate(r.last) : "—"}</td>
                  <td className="px-4 py-3">
                    {r.next ? `${fmtDate(r.next.date)} · ${serviceById(r.next.serviceId).name}` : "—"}
                  </td>
                  {session.role === "admin" && <td className="px-4 py-3 tabular-nums">{brl(r.total)}</td>}
                </tr>
                {open === r.p.id && (
                  <tr className="border-b border-line bg-bg">
                    <td colSpan={6} className="px-4 py-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Histórico</p>
                      <ul className="grid gap-1.5 sm:grid-cols-2">
                        {r.appts.slice(0, 20).map((a) => (
                          <li key={a.id} className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="tabular-nums text-muted">{fmtDate(a.date)} {a.start}</span>
                            <span>{serviceById(a.serviceId).name}</span>
                            <span className="text-muted">· {proById(a.professionalId).name}</span>
                            <span className="chip" style={{ background: statusStyle[a.status].bg, color: statusStyle[a.status].fg }}>
                              {statusLabels[a.status]}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {r.appts.length > 20 && <p className="mt-2 text-xs text-muted">Mostrando os 20 mais recentes de {r.appts.length}.</p>}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
