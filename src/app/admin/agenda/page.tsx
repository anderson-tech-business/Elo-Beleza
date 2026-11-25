"use client";

import { addDays, addMonths, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { paymentLabels, professionals, services, statusLabels, workingHours } from "@/data/demo";
import { concludeAppointment } from "@/lib/actions";
import { addAppointment, addBlock, removeBlock, updateAppointment, upsertPatient, useDemoState, useSession } from "@/lib/store";
import { freeSlots, proById, prosForService, serviceById } from "@/lib/slots";
import { brl, d, fmtDate, fmtLong, iso, shift, toHHMM, toMin, todaySP, weekday } from "@/lib/time";
import type { Appointment, Block, DemoState, Origin, Payment, Status } from "@/lib/types";
import { Modal } from "@/components/Modal";
import { originLabels } from "@/data/demo";
import { statusStyle } from "@/lib/status";

type View = "dia" | "semana" | "mes";


const DAY_START = 8 * 60;
const DAY_END = 19 * 60;
const PX = 1.3; // px por minuto

export default function AgendaPage() {
  const state = useDemoState();
  const session = useSession();
  const [view, setView] = useState<View>("dia");
  const [cursor, setCursor] = useState("");
  const [proFilter, setProFilter] = useState<string[]>(professionals.map((p) => p.id));
  const [svcFilter, setSvcFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Status>("");
  const [selected, setSelected] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "novo" | "bloqueio">(null);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  useEffect(() => {
    let t = todaySP();
    // Se hoje for dia fechado, abre no próximo dia de expediente
    while (!workingHours[weekday(t)].length) t = shift(t, 1);
    setCursor(t);
    if (window.innerWidth >= 1024) setView("semana");
  }, []);

  const isPro = session?.role === "pro";
  const visiblePros = isPro ? [session!.professionalId!] : proFilter;

  const filtered = useMemo(() => {
    if (!state) return [];
    return state.appointments.filter(
      (a) =>
        visiblePros.includes(a.professionalId) &&
        (!svcFilter || a.serviceId === svcFilter) &&
        (!statusFilter || a.status === statusFilter),
    );
  }, [state, visiblePros, svcFilter, statusFilter]);

  if (!state || !session || !cursor) return <p className="text-muted">Carregando agenda…</p>;

  const sel = selected ? state.appointments.find((a) => a.id === selected) ?? null : null;
  const blocks = state.blocks.filter((b) => visiblePros.includes(b.professionalId));

  const move = (dir: number) => {
    if (view === "dia") {
      let n = shift(cursor, dir);
      while (!workingHours[weekday(n)].length) n = shift(n, dir);
      setCursor(n);
    } else if (view === "semana") setCursor(shift(cursor, 7 * dir));
    else setCursor(iso(addMonths(d(cursor), dir)));
  };

  const title =
    view === "dia"
      ? fmtLong(cursor)
      : view === "semana"
        ? `${format(startOfWeek(d(cursor), { weekStartsOn: 1 }), "dd/MM")} – ${format(endOfWeek(d(cursor), { weekStartsOn: 1 }), "dd/MM/yyyy")}`
        : format(d(cursor), "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-primary-dark">Agenda</h1>
          <p className="mt-1 inline-flex items-center gap-2 rounded-full bg-[#E9F1EC] px-3 py-1 text-xs font-medium text-[#2D5A3E]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#3D7B55]" />
            Sincronizado com Google Calendar (simulado no modelo)
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn-outline btn-sm" onClick={() => setModal("bloqueio")}>
            Bloquear horário
          </button>
          <button type="button" className="btn-primary btn-sm" onClick={() => setModal("novo")}>
            + Novo agendamento
          </button>
        </div>
      </div>

      {/* Barra de navegação e filtros */}
      <div className="card mt-4 flex flex-wrap items-center gap-3 p-3">
        <div className="flex rounded-full border border-line p-0.5" role="group" aria-label="Visão">
          {(["dia", "semana", "mes"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${view === v ? "bg-primary-dark text-white" : "text-ink hover:bg-primary-soft"}`}
            >
              {v === "dia" ? "Dia" : v === "semana" ? "Semana" : "Mês"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="btn-ghost btn-sm" onClick={() => move(-1)} aria-label="Anterior">‹</button>
          <button type="button" className="btn-outline btn-sm" onClick={() => setCursor(todaySP())}>Hoje</button>
          <button type="button" className="btn-ghost btn-sm" onClick={() => move(1)} aria-label="Próximo">›</button>
        </div>
        <p className="min-w-0 flex-1 text-sm font-semibold capitalize" aria-live="polite">{title}</p>

        <div className="flex w-full flex-wrap items-center gap-3 border-t border-line pt-3 lg:w-auto lg:border-0 lg:pt-0">
          {!isPro && (
            <fieldset className="flex flex-wrap items-center gap-2">
              <legend className="sr-only">Profissionais</legend>
              {professionals.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5"
                    style={{ accentColor: p.color }}
                    checked={proFilter.includes(p.id)}
                    onChange={(e) =>
                      setProFilter(e.target.checked ? [...proFilter, p.id] : proFilter.filter((x) => x !== p.id))
                    }
                  />
                  {p.name.replace("Dra. ", "").split(" ")[0]}
                </label>
              ))}
            </fieldset>
          )}
          <label className="sr-only" htmlFor="f-svc">Serviço</label>
          <select id="f-svc" className="input w-auto py-1.5 text-xs" value={svcFilter} onChange={(e) => setSvcFilter(e.target.value)}>
            <option value="">Todos os serviços</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="f-status">Status</label>
          <select id="f-status" className="input w-auto py-1.5 text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Status | "")}>
            <option value="">Todos os status</option>
            {(Object.keys(statusLabels) as Status[]).map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Legenda */}
      <ul className="mt-3 flex flex-wrap gap-3 text-xs" aria-label="Legenda de status">
        {(Object.keys(statusLabels) as Status[]).map((s) => (
          <li key={s} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: statusStyle[s].dot }} />
            {statusLabels[s]}
          </li>
        ))}
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-[repeating-linear-gradient(45deg,#d8d0cc_0_3px,#f1ece9_3px_6px)]" />
          Bloqueio
        </li>
      </ul>

      <div className="mt-3">
        {view === "dia" && (
          <TimeGrid
            columns={visiblePros.map((id) => ({ key: id, label: proById(id).name, date: cursor, pros: [id] }))}
            appts={filtered}
            blocks={blocks}
            state={state}
            onSelect={setSelected}
            onBlock={setSelectedBlock}
          />
        )}
        {view === "semana" && (
          <TimeGrid
            columns={Array.from({ length: 7 }, (_, i) => iso(addDays(startOfWeek(d(cursor), { weekStartsOn: 1 }), i)))
              .filter((day) => workingHours[weekday(day)].length || filtered.some((a) => a.date === day))
              .map((day) => ({ key: day, label: format(d(day), "EEE dd/MM", { locale: ptBR }), date: day, pros: visiblePros, onHeader: () => { setCursor(day); setView("dia"); } }))}
            appts={filtered}
            blocks={blocks}
            state={state}
            onSelect={setSelected}
            onBlock={setSelectedBlock}
          />
        )}
        {view === "mes" && (
          <MonthGrid
            cursor={cursor}
            appts={filtered}
            onDay={(day) => {
              setCursor(day);
              setView("dia");
            }}
          />
        )}
      </div>

      {sel && (
        <AppointmentPanel
          appt={sel}
          state={state}
          canSeeAnamnese={!isPro || sel.professionalId === session.professionalId}
          onClose={() => setSelected(null)}
        />
      )}
      {modal === "novo" && (
        <NewAppointmentModal state={state} lockedPro={isPro ? session.professionalId : undefined} defaultDate={cursor} onClose={() => setModal(null)} />
      )}
      {modal === "bloqueio" && (
        <BlockModal lockedPro={isPro ? session.professionalId : undefined} defaultDate={cursor} onClose={() => setModal(null)} />
      )}
      {selectedBlock && (
        <Modal title="Bloqueio de horário" onClose={() => setSelectedBlock(null)}>
          <p className="text-sm">
            <strong>{proById(selectedBlock.professionalId).name}</strong> · {fmtDate(selectedBlock.date)} · {selectedBlock.start}–{selectedBlock.end}
          </p>
          <p className="mt-1 text-sm text-muted">Motivo: {selectedBlock.reason}</p>
          <button
            type="button"
            className="btn-outline mt-5"
            onClick={() => {
              removeBlock(selectedBlock.id);
              setSelectedBlock(null);
            }}
          >
            Remover bloqueio
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------ Grade de horários ------------------------------ */

interface Column {
  key: string;
  label: string;
  date: string;
  pros: string[];
  onHeader?: () => void;
}

function TimeGrid({
  columns,
  appts,
  blocks,
  state,
  onSelect,
  onBlock,
}: {
  columns: Column[];
  appts: Appointment[];
  blocks: Block[];
  state: DemoState;
  onSelect: (id: string) => void;
  onBlock: (b: Block) => void;
}) {
  const hours: number[] = [];
  for (let m = DAY_START; m < DAY_END; m += 60) hours.push(m);
  const height = (DAY_END - DAY_START) * PX;
  const today = todaySP();
  const patientName = (id: string) => state.patients.find((p) => p.id === id)?.name ?? "Paciente";

  if (!columns.length) return <p className="card p-6 text-sm text-muted">Selecione ao menos uma profissional.</p>;

  return (
    <div className="card overflow-x-auto">
      <div className="flex" style={{ minWidth: Math.max(columns.length * 150 + 52, 320) }}>
        {/* Horas */}
        <div className="w-[52px] shrink-0 border-r border-line">
          <div className="h-11 border-b border-line" />
          <div className="relative" style={{ height }}>
            {hours.map((m) => (
              <span key={m} className="absolute right-1.5 -translate-y-1/2 text-[10px] text-muted" style={{ top: (m - DAY_START) * PX }}>
                {m > DAY_START ? toHHMM(m) : ""}
              </span>
            ))}
          </div>
        </div>
        {columns.map((col) => {
          const segments = workingHours[weekday(col.date)];
          const lanes = col.pros;
          const dayAppts = appts.filter((a) => a.date === col.date && lanes.includes(a.professionalId));
          const dayBlocks = blocks.filter((b) => b.date === col.date && lanes.includes(b.professionalId));
          const isToday = col.date === today;
          return (
            <div key={col.key} className="min-w-[150px] flex-1 border-r border-line last:border-r-0">
              <div className={`flex h-11 items-center justify-center border-b border-line px-1 text-center text-xs font-semibold capitalize ${isToday ? "bg-primary-soft text-primary-dark" : ""}`}>
                {col.onHeader ? (
                  <button type="button" onClick={col.onHeader} className="rounded px-1 hover:underline">
                    {col.label}
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: proById(col.pros[0]).color }} />
                    {col.label}
                  </span>
                )}
              </div>
              <div className="relative bg-[#F6F1EE]" style={{ height }}>
                {/* Expediente */}
                {segments.map(([a, b]) => (
                  <div key={a} className="absolute inset-x-0 bg-white" style={{ top: (toMin(a) - DAY_START) * PX, height: (toMin(b) - toMin(a)) * PX }} />
                ))}
                {hours.map((m) => (
                  <div key={m} className="absolute inset-x-0 border-t border-dashed border-line" style={{ top: (m - DAY_START) * PX }} />
                ))}
                {dayBlocks.map((b) => {
                  const lane = lanes.indexOf(b.professionalId);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => onBlock(b)}
                      className="absolute overflow-hidden rounded-md border border-[#d8d0cc] bg-[repeating-linear-gradient(45deg,#e4dcd8_0_4px,#f4efec_4px_8px)] px-1 text-left text-[10px] font-medium text-muted"
                      style={{
                        top: (toMin(b.start) - DAY_START) * PX,
                        height: (toMin(b.end) - toMin(b.start)) * PX,
                        left: `calc(${(lane / lanes.length) * 100}% + 2px)`,
                        width: `calc(${100 / lanes.length}% - 4px)`,
                      }}
                    >
                      {b.reason}
                    </button>
                  );
                })}
                {dayAppts.map((a) => {
                  const svc = serviceById(a.serviceId);
                  const lane = lanes.indexOf(a.professionalId);
                  const st = statusStyle[a.status];
                  const h = svc.durationMin * PX;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => onSelect(a.id)}
                      title={`${a.start} ${patientName(a.patientId)} — ${svc.name} (${statusLabels[a.status]})`}
                      className="absolute overflow-hidden rounded-md border-l-[3px] px-1.5 py-0.5 text-left text-[11px] leading-tight shadow-sm hover:z-10 hover:shadow-md"
                      style={{
                        top: (toMin(a.start) - DAY_START) * PX + 1,
                        height: h - 2,
                        left: `calc(${(lane / lanes.length) * 100}% + 2px)`,
                        width: `calc(${100 / lanes.length}% - 4px)`,
                        background: st.bg,
                        color: st.fg,
                        borderLeftColor: proById(a.professionalId).color,
                        textDecoration: a.status === "cancelado" ? "line-through" : undefined,
                      }}
                    >
                      <span className="font-semibold">{a.start}</span> {patientName(a.patientId).split(" ")[0]}
                      {h > 30 && <span className="block truncate opacity-90">{svc.name}</span>}
                      <span className="sr-only">, {statusLabels[a.status]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ Visão mês ------------------------------ */

function MonthGrid({ cursor, appts, onDay }: { cursor: string; appts: Appointment[]; onDay: (d: string) => void }) {
  const first = startOfWeek(startOfMonth(d(cursor)), { weekStartsOn: 1 });
  const last = endOfWeek(endOfMonth(d(cursor)), { weekStartsOn: 1 });
  const days: string[] = [];
  for (let cur = iso(first); cur <= iso(last); cur = shift(cur, 1)) days.push(cur);
  const month = cursor.slice(0, 7);
  const today = todaySP();

  return (
    <div className="card overflow-hidden">
      <div className="grid grid-cols-7 border-b border-line text-center text-xs font-semibold text-muted">
        {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((w) => (
          <div key={w} className="py-2">{w}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const list = appts.filter((a) => a.date === day);
          const counts = list.reduce<Record<string, number>>((acc, a) => ({ ...acc, [a.status]: (acc[a.status] ?? 0) + 1 }), {});
          const out = day.slice(0, 7) !== month;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onDay(day)}
              className={`min-h-[84px] border-b border-r border-line p-1.5 text-left align-top hover:bg-primary-soft/50 sm:min-h-[104px] ${out ? "bg-[#F6F1EE] text-muted" : ""}`}
            >
              <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${day === today ? "bg-primary-dark text-white" : ""}`}>
                {Number(day.slice(8))}
              </span>
              {list.length > 0 && (
                <>
                  <span className="mt-1 block text-[11px] font-medium text-ink">
                    {list.length} <span className="hidden sm:inline">atend.</span>
                  </span>
                  <span className="mt-1 flex flex-wrap gap-0.5">
                    {(Object.keys(counts) as Status[]).map((s) => (
                      <span key={s} className="rounded px-1 text-[10px] font-medium" style={{ background: statusStyle[s].bg, color: statusStyle[s].fg }}>
                        {counts[s]}
                      </span>
                    ))}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ Painel lateral ------------------------------ */

function AppointmentPanel({
  appt,
  state,
  canSeeAnamnese,
  onClose,
}: {
  appt: Appointment;
  state: DemoState;
  canSeeAnamnese: boolean;
  onClose: () => void;
}) {
  const svc = serviceById(appt.serviceId);
  const pro = proById(appt.professionalId);
  const patient = state.patients.find((p) => p.id === appt.patientId);
  const [mode, setMode] = useState<null | "concluir" | "remarcar">(null);
  const [amount, setAmount] = useState(String(svc.price));
  const [payment, setPayment] = useState<Payment>("pix");
  const [newDate, setNewDate] = useState(appt.date);
  const [newTime, setNewTime] = useState("");
  const [toast, setToast] = useState("");
  const st = statusStyle[appt.status];
  const slots = mode === "remarcar" ? freeSlots(state, appt.serviceId, newDate, [appt.professionalId], appt.id) : [];
  const history = state.appointments
    .filter((a) => a.patientId === appt.patientId && a.id !== appt.id && a.status === "concluido")
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 4);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = appt.status === "confirmado" || appt.status === "retorno";

  return (
    <div className="fixed inset-0 z-[55] flex justify-end bg-black/30" onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        className="h-full w-full max-w-md overflow-y-auto bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="chip" style={{ background: st.bg, color: st.fg }}>{statusLabels[appt.status]}</span>
            <h2 id="panel-title" className="mt-2 font-serif text-2xl font-semibold">{patient?.name}</h2>
          </div>
          <button type="button" className="btn-ghost btn-sm" onClick={onClose} aria-label="Fechar painel" autoFocus>✕</button>
        </div>

        <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-sm">
          <dt className="text-muted">Contato</dt>
          <dd>{patient?.phone}<br /><span className="break-all text-muted">{patient?.email}</span></dd>
          <dt className="text-muted">Serviço</dt>
          <dd>{svc.name} · {svc.durationMin} min</dd>
          <dt className="text-muted">Profissional</dt>
          <dd>{pro.name}</dd>
          <dt className="text-muted">Data</dt>
          <dd>{fmtDate(appt.date)} às {appt.start}</dd>
          <dt className="text-muted">Valor</dt>
          <dd>
            {appt.status === "concluido" && appt.paidAmount !== undefined
              ? `${brl(appt.paidAmount)}${appt.payment ? ` · ${paymentLabels[appt.payment]}` : ""}`
              : svc.price === 0 ? "Sem custo" : `${brl(svc.price)} (tabela)`}
          </dd>
          <dt className="text-muted">Origem</dt>
          <dd>{originLabels[appt.origin]}{appt.createdInDemo ? " · criado no demo" : ""}</dd>
          <dt className="text-muted">Observações</dt>
          <dd>{appt.notes || "—"}</dd>
        </dl>

        {appt.anamnese && (
          <section className="mt-5 rounded-xl border border-line p-4 text-sm">
            <h3 className="font-semibold">Anamnese</h3>
            {canSeeAnamnese ? (
              <ul className="mt-2 space-y-1 text-muted">
                <li>Gestante/lactante: <strong className="text-ink">{appt.anamnese.gestante ? "Sim" : "Não"}</strong></li>
                <li>Alergias: <strong className="text-ink">{appt.anamnese.alergias || "Nenhuma"}</strong></li>
                <li>Anticoagulante: <strong className="text-ink">{appt.anamnese.anticoagulante ? "Sim" : "Não"}</strong></li>
                <li>Procedimento nos últimos 6 meses: <strong className="text-ink">{appt.anamnese.procedimentoRecente ? "Sim" : "Não"}</strong></li>
              </ul>
            ) : (
              <p className="mt-2 text-muted">Dados de saúde visíveis apenas para a profissional responsável e a administração.</p>
            )}
          </section>
        )}

        {history.length > 0 && (
          <section className="mt-5 text-sm">
            <h3 className="font-semibold">Últimos atendimentos</h3>
            <ul className="mt-2 space-y-1 text-muted">
              {history.map((h) => (
                <li key={h.id}>{fmtDate(h.date)} · {serviceById(h.serviceId).name}</li>
              ))}
            </ul>
          </section>
        )}

        {toast && <p role="status" className="mt-5 rounded-xl bg-[#E2F0E6] px-4 py-3 text-sm text-[#2D5A3E]">{toast}</p>}

        {open && mode === null && (
          <div className="mt-6 grid grid-cols-2 gap-2">
            <button type="button" className="btn-primary" onClick={() => setMode("concluir")}>Concluir</button>
            <button type="button" className="btn-outline" onClick={() => setMode("remarcar")}>Remarcar</button>
            <button type="button" className="btn-outline" onClick={() => updateAppointment(appt.id, { status: "faltou" })}>Faltou</button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => confirm("Cancelar este agendamento?") && updateAppointment(appt.id, { status: "cancelado" })}
            >
              Cancelar
            </button>
          </div>
        )}
        {!open && mode === null && (
          <button type="button" className="btn-ghost btn-sm mt-6" onClick={() => updateAppointment(appt.id, { status: "confirmado", paidAmount: undefined, payment: undefined })}>
            Reabrir como Confirmado
          </button>
        )}

        {mode === "concluir" && (
          <form
            className="mt-6 rounded-xl border border-line p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const value = Number(amount.replace(",", "."));
              const ret = concludeAppointment(appt, isNaN(value) ? 0 : value, payment);
              setMode(null);
              if (ret) setToast(`Retorno sugerido criado para ${fmtDate(ret.date)} às ${ret.start}.`);
            }}
          >
            <h3 className="font-semibold">Concluir atendimento</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="amount" className="label">Valor cobrado (R$)</label>
                <input id="amount" inputMode="decimal" className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <label htmlFor="payment" className="label">Pagamento</label>
                <select id="payment" className="input" value={payment} onChange={(e) => setPayment(e.target.value as Payment)}>
                  {(Object.keys(paymentLabels) as Payment[]).map((p) => (
                    <option key={p} value={p}>{paymentLabels[p]}</option>
                  ))}
                </select>
              </div>
            </div>
            {appt.serviceId === "toxina" && <p className="mt-2 text-xs text-muted">Um retorno será sugerido automaticamente para daqui a 15 dias.</p>}
            <div className="mt-4 flex gap-2">
              <button type="submit" className="btn-primary btn-sm">Confirmar conclusão</button>
              <button type="button" className="btn-ghost btn-sm" onClick={() => setMode(null)}>Voltar</button>
            </div>
          </form>
        )}

        {mode === "remarcar" && (
          <form
            className="mt-6 rounded-xl border border-line p-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTime) return;
              updateAppointment(appt.id, { date: newDate, start: newTime });
              setMode(null);
              setToast(`Remarcado para ${fmtDate(newDate)} às ${newTime}.`);
            }}
          >
            <h3 className="font-semibold">Remarcar</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="rdate" className="label">Nova data</label>
                <input id="rdate" type="date" className="input" min={todaySP()} value={newDate} onChange={(e) => { setNewDate(e.target.value); setNewTime(""); }} />
              </div>
              <div>
                <label htmlFor="rtime" className="label">Horário</label>
                <select id="rtime" className="input" value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                  <option value="">{slots.length ? "Escolha" : "Sem vagas"}</option>
                  {slots.map((s) => (
                    <option key={s.time} value={s.time}>{s.time}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button type="submit" className="btn-primary btn-sm" disabled={!newTime}>Salvar</button>
              <button type="button" className="btn-ghost btn-sm" onClick={() => setMode(null)}>Voltar</button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}

/* ------------------------------ Novo agendamento ------------------------------ */

function NewAppointmentModal({
  state,
  lockedPro,
  defaultDate,
  onClose,
}: {
  state: DemoState;
  lockedPro?: string;
  defaultDate: string;
  onClose: () => void;
}) {
  const allowed = services.filter((s) => !lockedPro || proById(lockedPro).serviceIds.includes(s.id));
  const [serviceId, setServiceId] = useState(allowed[0].id);
  const pros = prosForService(serviceId).filter((p) => !lockedPro || p.id === lockedPro);
  const [proId, setProId] = useState(lockedPro ?? pros[0].id);
  const [date, setDate] = useState(defaultDate < todaySP() ? todaySP() : defaultDate);
  const [time, setTime] = useState("");
  const [patientId, setPatientId] = useState("");
  const [newPatient, setNewPatient] = useState({ name: "", phone: "", email: "" });
  const [origin, setOrigin] = useState<Origin>("instagram");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const effectivePro = pros.some((p) => p.id === proId) ? proId : pros[0]?.id;
  const slots = effectivePro ? freeSlots(state, serviceId, date, [effectivePro]) : [];
  const patients = [...state.patients].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  return (
    <Modal title="Novo agendamento" onClose={onClose}>
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          let pid = patientId;
          if (pid === "nova") {
            if (!newPatient.name.trim() || !newPatient.phone.trim()) return setError("Informe nome e telefone da nova paciente.");
            pid = upsertPatient({
              name: newPatient.name.trim(),
              phone: newPatient.phone.trim(),
              email: newPatient.email.trim() || `${Date.now()}@sem-email.local`,
              birthDate: "",
            }).id;
          }
          if (!pid) return setError("Selecione a paciente.");
          if (!time) return setError("Escolha um horário.");
          addAppointment({ patientId: pid, serviceId, professionalId: effectivePro, date, start: time, status: "confirmado", origin, notes: notes || undefined });
          onClose();
        }}
      >
        <div>
          <label htmlFor="n-pat" className="label">Paciente</label>
          <select id="n-pat" className="input" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
            <option value="">Selecione…</option>
            <option value="nova">+ Nova paciente</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        {patientId === "nova" && (
          <div className="grid gap-3 rounded-xl bg-primary-soft/50 p-3 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label htmlFor="n-name" className="label">Nome</label>
              <input id="n-name" className="input" value={newPatient.name} onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })} />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="n-phone" className="label">Telefone</label>
              <input id="n-phone" className="input" value={newPatient.phone} onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="n-email" className="label">E-mail</label>
              <input id="n-email" type="email" className="input" value={newPatient.email} onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })} />
            </div>
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="n-svc" className="label">Serviço</label>
            <select id="n-svc" className="input" value={serviceId} onChange={(e) => { setServiceId(e.target.value); setTime(""); }}>
              {allowed.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="n-pro" className="label">Profissional</label>
            <select id="n-pro" className="input" value={effectivePro} disabled={!!lockedPro} onChange={(e) => { setProId(e.target.value); setTime(""); }}>
              {pros.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="n-date" className="label">Data</label>
            <input id="n-date" type="date" className="input" min={todaySP()} value={date} onChange={(e) => { setDate(e.target.value); setTime(""); }} />
          </div>
          <div>
            <label htmlFor="n-time" className="label">Horário</label>
            <select id="n-time" className="input" value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">{slots.length ? "Escolha" : "Sem vagas neste dia"}</option>
              {slots.map((s) => (
                <option key={s.time} value={s.time}>{s.time}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="n-origin" className="label">Origem</label>
            <select id="n-origin" className="input" value={origin} onChange={(e) => setOrigin(e.target.value as Origin)}>
              {(Object.keys(originLabels) as Origin[]).map((o) => (
                <option key={o} value={o}>{originLabels[o]}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="n-notes" className="label">Observações</label>
          <textarea id="n-notes" rows={2} className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-[#A2342B]">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary">Agendar</button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------ Bloqueio ------------------------------ */

function BlockModal({ lockedPro, defaultDate, onClose }: { lockedPro?: string; defaultDate: string; onClose: () => void }) {
  const [proId, setProId] = useState(lockedPro ?? professionals[0].id);
  const [date, setDate] = useState(defaultDate);
  const [reason, setReason] = useState("Almoço");
  const [start, setStart] = useState("12:00");
  const [end, setEnd] = useState("13:00");
  const [error, setError] = useState("");
  const allDay = reason === "Folga";

  return (
    <Modal title="Bloquear horário" onClose={onClose}>
      <form
        className="grid gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const s = allDay ? "08:00" : start;
          const en = allDay ? "19:00" : end;
          if (toMin(en) <= toMin(s)) return setError("O fim deve ser depois do início.");
          addBlock({ professionalId: proId, date, start: s, end: en, reason });
          onClose();
        }}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="b-pro" className="label">Profissional</label>
            <select id="b-pro" className="input" value={proId} disabled={!!lockedPro} onChange={(e) => setProId(e.target.value)}>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="b-reason" className="label">Motivo</label>
            <select id="b-reason" className="input" value={reason} onChange={(e) => setReason(e.target.value)}>
              {["Almoço", "Folga", "Curso", "Outro"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="b-date" className="label">Data</label>
            <input id="b-date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          {!allDay && (
            <>
              <div>
                <label htmlFor="b-start" className="label">Início</label>
                <input id="b-start" type="time" step={900} className="input" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div>
                <label htmlFor="b-end" className="label">Fim</label>
                <input id="b-end" type="time" step={900} className="input" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </>
          )}
        </div>
        {allDay && <p className="text-sm text-muted">Folga bloqueia o dia inteiro.</p>}
        {error && <p role="alert" className="text-sm text-[#A2342B]">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn-primary">Bloquear</button>
        </div>
      </form>
    </Modal>
  );
}
