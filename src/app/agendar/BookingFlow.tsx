"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MonthCalendar } from "@/components/MonthCalendar";
import { services } from "@/data/demo";
import { addAppointment, upsertPatient, useDemoState } from "@/lib/store";
import { bookingRange, freeSlots, proById, prosForService, serviceById } from "@/lib/slots";
import { brl, fmtLong, todaySP } from "@/lib/time";
import type { Anamnese, Category } from "@/lib/types";

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

const steps = ["Categoria", "Serviço", "Profissional", "Data e horário", "Seus dados"];

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const phoneDigits = (v: string) => v.replace(/\D/g, "");
const phoneOk = (v: string) => {
  const dg = phoneDigits(v);
  if (dg.length === 11) return /^[1-9][1-9]9\d{8}$/.test(dg);
  if (dg.length === 10) return /^[1-9][1-9][2-5]\d{7}$/.test(dg);
  return false;
};
function maskPhone(v: string) {
  const dg = phoneDigits(v).slice(0, 11);
  if (dg.length <= 2) return dg.length ? `(${dg}` : "";
  if (dg.length <= 6) return `(${dg.slice(0, 2)}) ${dg.slice(2)}`;
  if (dg.length <= 10) return `(${dg.slice(0, 2)}) ${dg.slice(2, 6)}-${dg.slice(6)}`;
  return `(${dg.slice(0, 2)}) ${dg.slice(2, 7)}-${dg.slice(7)}`;
}
function ageOn(birth: string, today: string) {
  const [by, bm, bd] = birth.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  return ty - by - (tm < bm || (tm === bm && td < bd) ? 1 : 0);
}

export function BookingFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const state = useDemoState();
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [proChoice, setProChoice] = useState<string | null>(null); // "any" | id
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [month, setMonth] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", birth: "", notes: "" });
  const [anamnese, setAnamnese] = useState<Anamnese>({ gestante: false, alergias: "", anticoagulante: false, procedimentoRecente: false });
  const [hasAllergy, setHasAllergy] = useState<"" | "sim" | "nao">("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => setMonth(todaySP()), []);
  // Link direto da landing (?servico=limpeza) pula as etapas já respondidas
  useEffect(() => {
    const pre = services.find((s) => s.id === params.get("servico") && s.bookable);
    if (!pre) return;
    setCategory(pre.category);
    setServiceId(pre.id);
    setStep(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const service = serviceId ? serviceById(serviceId) : null;
  const eligible = serviceId ? prosForService(serviceId) : [];
  const proIds = proChoice === "any" ? eligible.map((p) => p.id) : proChoice ? [proChoice] : [];
  const range = useMemo(() => (month ? bookingRange() : null), [month]);

  const dayHasSlots = (day: string) => {
    if (!state || !serviceId || !range || day < range.first || day > range.last) return false;
    return freeSlots(state, serviceId, day, proIds).length > 0;
  };
  const slots = state && serviceId && date ? freeSlots(state, serviceId, date, proIds) : [];
  const isInjectable = service?.category === "harmonizacao";

  function go(n: number) {
    setErrors({});
    setStep(n);
    window.scrollTo({ top: 0 });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (form.name.trim().split(/\s+/).length < 2) e.name = "Informe nome e sobrenome.";
    if (!emailOk(form.email)) e.email = "Informe um e-mail válido. É por ele que você recebe o convite.";
    if (!phoneOk(form.phone)) e.phone = "Informe um celular com DDD, ex.: (11) 91234-5678.";
    if (!form.birth) e.birth = "Informe sua data de nascimento.";
    else {
      const age = ageOn(form.birth, todaySP());
      if (age < 0 || age > 110) e.birth = "Data de nascimento inválida.";
      else if (isInjectable && age < 18) e.birth = "Procedimentos injetáveis são realizados somente a partir de 18 anos.";
    }
    if (isInjectable) {
      if (!hasAllergy) e.alergia = "Responda sobre alergias.";
      if (hasAllergy === "sim" && !anamnese.alergias.trim()) e.alergia = "Conte quais alergias você tem.";
      if (!consent) e.consent = "É preciso autorizar o uso dos dados de saúde para a avaliação.";
    }
    return e;
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`f-${first}`)?.focus();
      return;
    }
    if (!state || !serviceId || !date || !time) return;
    const slot = freeSlots(state, serviceId, date, proIds).find((s) => s.time === time);
    if (!slot) {
      setErrors({ time: "Esse horário acabou de ser ocupado. Escolha outro." });
      go(3);
      return;
    }
    setSubmitting(true);
    const patient = upsertPatient({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: maskPhone(form.phone),
      birthDate: form.birth,
    });
    const appt = addAppointment({
      patientId: patient.id,
      serviceId,
      professionalId: slot.proIds[0],
      date,
      start: time,
      status: "confirmado",
      origin: "site",
      notes: form.notes.trim() || undefined,
      anamnese: isInjectable ? { ...anamnese, alergias: hasAllergy === "sim" ? anamnese.alergias.trim() : "" } : undefined,
    });
    router.push(`/agendar/confirmado?id=${encodeURIComponent(appt.id)}`);
  }

  const cats: { id: Category; title: string; text: string }[] = [
    { id: "harmonizacao", title: "Harmonização facial", text: "Toxina botulínica e preenchimento. Começa por uma avaliação gratuita." },
    { id: "estetica", title: "Estética e sobrancelhas", text: "Limpeza de pele, acne, microdermoabrasão e design de sobrancelha." },
  ];

  const summary = [
    service?.name,
    proChoice ? (proChoice === "any" ? "Qualquer disponível" : proById(proChoice).name) : null,
    date && time ? `${fmtLong(date)} às ${time}` : null,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-6">
      {/* Progresso */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            Passo {step + 1} de {steps.length}
          </span>
          <span className="font-medium text-ink">{steps[step]}</span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-line"
          role="progressbar"
          aria-label="Progresso do agendamento"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={step + 1}
        >
          <div className="h-full rounded-full bg-primary-dark transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <ol className="mt-3 hidden justify-between text-xs sm:flex">
          {steps.map((s, i) => (
            <li key={s} className={i <= step ? "font-medium text-primary-dark" : "text-muted"}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
      </div>

      {summary.length > 0 && step > 0 && (
        <p className="mb-4 rounded-xl bg-primary-soft px-4 py-2 text-sm text-primary-dark">{summary.join(" · ")}</p>
      )}

      {/* Passo 1 */}
      {step === 0 && (
        <section>
          <h1 ref={headingRef} tabIndex={-1} className="outline-none font-serif text-3xl font-semibold text-primary-dark">
            O que você procura?
          </h1>
          <div className="mt-6 grid gap-3">
            {cats.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCategory(c.id);
                  if (c.id === "harmonizacao") setServiceId("avaliacao");
                  else if (category !== c.id) setServiceId(null);
                  setProChoice(null);
                  setDate(null);
                  setTime(null);
                  go(1);
                }}
                className={`card p-5 text-left transition-colors hover:border-primary-dark ${category === c.id ? "border-primary-dark ring-2 ring-primary-soft" : ""}`}
              >
                <span className="flex items-center justify-between gap-4">
                  <span>
                    <span className="block font-serif text-2xl font-semibold text-ink">{c.title}</span>
                    <span className="mt-1 block text-sm text-muted">{c.text}</span>
                  </span>
                  <span aria-hidden="true" className="text-2xl text-primary-dark">›</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Passo 2 */}
      {step === 1 && (
        <section>
          <h1 ref={headingRef} tabIndex={-1} className="outline-none font-serif text-3xl font-semibold text-primary-dark">
            Escolha o serviço
          </h1>
          {category === "harmonizacao" && (
            <p className="mt-2 rounded-xl border border-line bg-white px-4 py-3 text-sm text-muted">
              Toxina e preenchimento são definidos na avaliação.
            </p>
          )}
          <div className="mt-6 grid gap-3">
            {services
              .filter((s) => s.category === category && s.bookable)
              .map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    if (serviceId !== s.id) {
                      setProChoice(null);
                      setDate(null);
                      setTime(null);
                    }
                    setServiceId(s.id);
                    go(2);
                  }}
                  className={`card flex items-center justify-between gap-4 p-5 text-left transition-colors hover:border-primary-dark ${serviceId === s.id ? "border-primary-dark ring-2 ring-primary-soft" : ""}`}
                >
                  <span>
                    <span className="block font-semibold text-ink">{s.name}</span>
                    <span className="mt-1 block text-sm text-muted">{s.description}</span>
                  </span>
                  <span className="shrink-0 text-right text-sm">
                    <span className="block font-semibold text-primary-dark">{s.price === 0 ? "Gratuita" : brl(s.price)}</span>
                    <span className="block text-muted">{s.durationMin} min</span>
                  </span>
                </button>
              ))}
          </div>
          <button type="button" className="btn-ghost mt-6" onClick={() => go(0)}>
            ← Voltar
          </button>
        </section>
      )}

      {/* Passo 3 */}
      {step === 2 && (
        <section>
          <h1 ref={headingRef} tabIndex={-1} className="outline-none font-serif text-3xl font-semibold text-primary-dark">
            Com quem?
          </h1>
          <div className="mt-6 grid gap-3">
            {[{ id: "any", name: "Qualquer disponível", role: "Mostra mais opções de horário" }, ...eligible].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  if (proChoice !== p.id) {
                    setDate(null);
                    setTime(null);
                  }
                  setProChoice(p.id);
                  go(3);
                }}
                className={`card flex items-center gap-4 p-4 text-left transition-colors hover:border-primary-dark ${proChoice === p.id ? "border-primary-dark ring-2 ring-primary-soft" : ""}`}
              >
                <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft font-serif text-lg text-primary-dark">
                  {p.id === "any" ? "✦" : p.name.replace("Dra. ", "").split(" ").map((w) => w[0]).join("")}
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-ink">{p.name}</span>
                  <span className="block text-sm text-muted">{p.role}</span>
                </span>
                <span aria-hidden="true" className="text-2xl text-primary-dark">›</span>
              </button>
            ))}
          </div>
          <button type="button" className="btn-ghost mt-6" onClick={() => go(category === "harmonizacao" ? 0 : 1)}>
            ← Voltar
          </button>
        </section>
      )}

      {/* Passo 4 */}
      {step === 3 && (
        <section>
          <h1 ref={headingRef} tabIndex={-1} className="outline-none font-serif text-3xl font-semibold text-primary-dark">
            Escolha data e horário
          </h1>
          {errors.time && <p className="mt-2 text-sm font-medium text-[#A2342B]">{errors.time}</p>}
          {!state || !month || !range ? (
            <p className="mt-6 text-muted">Carregando agenda…</p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr]">
              <MonthCalendar
                month={month}
                onMonthChange={setMonth}
                selected={date ?? undefined}
                onSelect={(dd) => {
                  setDate(dd);
                  setTime(null);
                  setTimeout(() => document.getElementById("slots")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                }}
                isEnabled={dayHasSlots}
                minMonth={range.first}
                maxMonth={range.last}
              />
              <div id="slots" className="scroll-mt-16">
                {date ? (
                  <>
                    <p className="text-sm font-medium">{cap(fmtLong(date))}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Horários disponíveis">
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          aria-pressed={time === s.time}
                          onClick={() => setTime(s.time)}
                          className={`rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors ${
                            time === s.time ? "border-primary-dark bg-primary-dark text-white" : "border-line bg-white hover:border-primary-dark"
                          }`}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                    {slots.length === 0 && <p className="mt-3 text-sm text-muted">Sem horários neste dia.</p>}
                  </>
                ) : (
                  <p className="text-sm text-muted">Selecione um dia disponível no calendário.</p>
                )}
              </div>
            </div>
          )}
          <div className="sticky bottom-0 -mx-4 mt-6 flex items-center justify-between border-t border-line bg-bg/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:px-0">
            <button type="button" className="btn-ghost" onClick={() => go(2)}>
              ← Voltar
            </button>
            <button type="button" className="btn-primary min-h-12" disabled={!date || !time} onClick={() => go(4)}>
              {time ? `Continuar · ${time}` : "Escolha um horário"}
            </button>
          </div>
        </section>
      )}

      {/* Passo 5 */}
      {step === 4 && (
        <form onSubmit={submit} noValidate>
          <h1 ref={headingRef} tabIndex={-1} className="outline-none font-serif text-3xl font-semibold text-primary-dark">
            Seus dados
          </h1>
          <div className="mt-6 grid gap-4">
            <Field id="name" label="Nome completo" error={errors.name}>
              <input id="f-name" className="input" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? "e-name" : undefined} required />
            </Field>
            <Field id="email" label="E-mail" hint="Obrigatório: o convite e os lembretes chegam por aqui." error={errors.email}>
              <input id="f-email" type="email" inputMode="email" autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={errors.email ? "e-email" : "h-email"} required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="phone" label="Celular" error={errors.phone}>
                <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(11) 91234-5678" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "e-phone" : undefined} required />
              </Field>
              <Field id="birth" label="Data de nascimento" error={errors.birth}>
                <input id="f-birth" type="date" autoComplete="bday" className="input" max={todaySP()} value={form.birth} onChange={(e) => setForm({ ...form, birth: e.target.value })} aria-invalid={!!errors.birth} aria-describedby={errors.birth ? "e-birth" : undefined} required />
              </Field>
            </div>

            {isInjectable && (
              <fieldset className="card mt-2 p-5">
                <legend className="px-1 font-serif text-xl font-semibold text-primary-dark">Anamnese rápida</legend>
                <p className="text-sm text-muted">Essas respostas ajudam a profissional a preparar sua avaliação com segurança.</p>
                <div className="mt-4 grid gap-4">
                  <YesNo id="gestante" label="Está gestante ou amamentando?" value={anamnese.gestante} onChange={(v) => setAnamnese({ ...anamnese, gestante: v })} />
                  <YesNo id="anticoagulante" label="Usa anticoagulante (ex.: AAS, varfarina)?" value={anamnese.anticoagulante} onChange={(v) => setAnamnese({ ...anamnese, anticoagulante: v })} />
                  <YesNo id="recente" label="Fez algum procedimento estético nos últimos 6 meses?" value={anamnese.procedimentoRecente} onChange={(v) => setAnamnese({ ...anamnese, procedimentoRecente: v })} />
                  <fieldset>
                    <legend className="label">Tem alguma alergia?</legend>
                    <div className="flex gap-4 text-sm">
                      {(["nao", "sim"] as const).map((v) => (
                        <label key={v} className="flex items-center gap-2">
                          <input id={v === "nao" ? "f-alergia" : undefined} type="radio" name="alergia" className="h-4 w-4 accent-[var(--color-primary-dark)]" checked={hasAllergy === v} onChange={() => setHasAllergy(v)} />
                          {v === "sim" ? "Sim" : "Não"}
                        </label>
                      ))}
                    </div>
                    {hasAllergy === "sim" && (
                      <div className="mt-2">
                        <label htmlFor="f-alergias" className="label">Quais?</label>
                        <input id="f-alergias" className="input" value={anamnese.alergias} onChange={(e) => setAnamnese({ ...anamnese, alergias: e.target.value })} />
                      </div>
                    )}
                    {errors.alergia && <p className="mt-1 text-sm text-[#A2342B]">{errors.alergia}</p>}
                  </fieldset>
                </div>
                <label className="mt-5 flex items-start gap-3 rounded-xl bg-primary-soft/60 p-3 text-sm">
                  <input id="f-consent" type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary-dark)]" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!errors.consent} />
                  <span>
                    Autorizo o uso dos meus dados de saúde informados acima exclusivamente para a minha avaliação e
                    atendimento, conforme a LGPD e a{" "}
                    <a href="/privacidade" target="_blank" className="text-primary-dark underline">Política de Privacidade</a>.
                  </span>
                </label>
                {errors.consent && <p className="mt-1 text-sm text-[#A2342B]">{errors.consent}</p>}
              </fieldset>
            )}

            <Field id="notes" label="Observações (opcional)">
              <textarea id="f-notes" rows={3} className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
          </div>

          {Object.keys(errors).length > 0 && (
            <p role="alert" className="mt-4 rounded-xl bg-[#FBE9E7] px-4 py-3 text-sm text-[#A2342B]">
              Confira os campos destacados.
            </p>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <button type="button" className="btn-ghost" onClick={() => go(3)}>
              ← Voltar
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              Confirmar agendamento
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="label">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`h-${id}`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`e-${id}`} className="mt-1 text-sm text-[#A2342B]">
          {error}
        </p>
      )}
    </div>
  );
}

function YesNo({ id, label, value, onChange }: { id: string; label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="flex gap-4 text-sm">
        {[false, true].map((v) => (
          <label key={String(v)} className="flex items-center gap-2">
            <input type="radio" name={id} className="h-4 w-4 accent-[var(--color-primary-dark)]" checked={value === v} onChange={() => onChange(v)} />
            {v ? "Sim" : "Não"}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
