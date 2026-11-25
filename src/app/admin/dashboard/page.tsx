"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { professionals, statusLabels } from "@/data/demo";
import { computeDashboard, periodRange, type Period } from "@/lib/metrics";
import { proById, serviceById } from "@/lib/slots";
import { useDemoState, useSession } from "@/lib/store";
import { brl, fmtDate, pct, shift, todaySP } from "@/lib/time";

// Cores validadas (contraste ≥ 3:1 e separação para daltonismo)
const SERIES = "#B5573F";
const SERIES_2 = "#3B7EBD";
const AXIS = { fontSize: 11, fill: "#6E6360" };
const GRID = "#EFE7E3";

const brlShort = (v: number) =>
  v >= 1000 ? `R$\u00A0${(v / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}\u00A0mil` : brl(v);

export default function DashboardPage() {
  const session = useSession();
  const state = useDemoState();
  const [period, setPeriod] = useState<Period>("mes");
  const [proId, setProId] = useState("");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [svcMode, setSvcMode] = useState<"qtd" | "valor">("valor");
  const [today, setToday] = useState("");

  useEffect(() => {
    const t = todaySP();
    setToday(t);
    setCustom({ from: shift(t, -30), to: t });
  }, []);

  const range = today ? periodRange(period, today, custom) : null;
  const data = useMemo(
    () => (state && range && today ? computeDashboard(state, range.from, range.to, proId, today) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, range?.from, range?.to, proId, today],
  );

  if (session === undefined) return <p className="text-muted">Carregando…</p>;
  if (session?.role !== "admin") {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <h1 className="font-serif text-2xl font-semibold text-primary-dark">Acesso restrito</h1>
        <p className="mt-2 text-muted">O dashboard é exclusivo do perfil Administradora.</p>
        <Link href="/admin/agenda" className="btn-primary mt-6">Ir para a agenda</Link>
      </div>
    );
  }
  if (!data || !range) return <p className="text-muted">Calculando indicadores…</p>;

  const { kpis } = data;
  const patientName = (id: string) => state!.patients.find((p) => p.id === id)?.name ?? "—";
  const svcData = [...data.byService].sort((a, b) => b[svcMode] - a[svcMode]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-primary-dark">Dashboard</h1>
          <p className="text-sm text-muted">
            {fmtDate(range.from)} a {fmtDate(range.to)} · dados ilustrativos + agendamentos criados neste navegador
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mt-4 flex flex-wrap items-end gap-3 p-3">
        <div className="flex flex-wrap rounded-full border border-line p-0.5" role="group" aria-label="Período">
          {(
            [
              ["mes", "Este mês"],
              ["mes-passado", "Mês passado"],
              ["90d", "Últimos 90 dias"],
              ["custom", "Personalizado"],
            ] as [Period, string][]
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              aria-pressed={period === k}
              onClick={() => setPeriod(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${period === k ? "bg-primary-dark text-white" : "hover:bg-primary-soft"}`}
            >
              {l}
            </button>
          ))}
        </div>
        {period === "custom" && (
          <div className="flex items-end gap-2">
            <div>
              <label htmlFor="from" className="text-xs text-muted">De</label>
              <input id="from" type="date" className="input py-1.5 text-xs" value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} />
            </div>
            <div>
              <label htmlFor="to" className="text-xs text-muted">Até</label>
              <input id="to" type="date" className="input py-1.5 text-xs" value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} />
            </div>
          </div>
        )}
        <div className="ml-auto">
          <label htmlFor="pro" className="sr-only">Profissional</label>
          <select id="pro" className="input w-auto py-1.5 text-xs" value={proId} onChange={(e) => setProId(e.target.value)}>
            <option value="">Todas as profissionais</option>
            {professionals.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Faturamento" value={brl(kpis.faturamento)} />
        <Kpi label="Atendimentos concluídos" value={kpis.concluidos.toLocaleString("pt-BR")} />
        <Kpi label="Ticket médio" value={brl(kpis.ticket)} hint="Atendimentos pagos" />
        <Kpi label="Ocupação da agenda" value={pct(kpis.ocupacao)} />
        <Kpi label="Taxa de faltas" value={pct(kpis.faltas)} />
        <Kpi label="Pacientes novas" value={kpis.novas.toLocaleString("pt-BR")} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Quem mais vende" subtitle="Faturamento por profissional no período (todas)">
          <HBar data={data.byPro} dataKey="faturamento" nameKey="name" money />
        </Panel>
        <Panel title="Atendimentos por profissional" subtitle="Concluídos no período (todas)">
          <HBar data={data.byProCount} dataKey="atendimentos" nameKey="name" />
        </Panel>

        <Panel
          title="Serviços mais vendidos"
          subtitle={svcMode === "valor" ? "Faturamento por serviço" : "Quantidade de atendimentos concluídos"}
          action={
            <div className="flex rounded-full border border-line p-0.5" role="group" aria-label="Métrica">
              {(["valor", "qtd"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={svcMode === m}
                  onClick={() => setSvcMode(m)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${svcMode === m ? "bg-primary-dark text-white" : "hover:bg-primary-soft"}`}
                >
                  {m === "valor" ? "R$" : "Qtd"}
                </button>
              ))}
            </div>
          }
        >
          <HBar data={svcData} dataKey={svcMode} nameKey="name" money={svcMode === "valor"} wide />
        </Panel>
        <Panel title="Faturamento mês a mês" subtitle="Últimos 6 meses">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.monthly} margin={{ top: 16, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="mes" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} tickFormatter={brlShort} width={78} />
              <Tooltip formatter={(v: number) => [brl(v), "Faturamento"]} cursor={{ stroke: "#C9BAB4" }} />
              <Line type="monotone" dataKey="faturamento" stroke={SERIES} strokeWidth={2} dot={{ r: 4, fill: SERIES, stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Novas x recorrentes" subtitle="Pacientes atendidas por mês">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.monthly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="mes" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: "#F6F1EE" }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="novas" name="Novas" stackId="a" fill={SERIES} stroke="#fff" strokeWidth={1} maxBarSize={36} />
              <Bar dataKey="recorrentes" name="Recorrentes" stackId="a" fill={SERIES_2} stroke="#fff" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Ocupação por dia da semana" subtitle="% do expediente com atendimento marcado">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.byWeekday} margin={{ top: 20, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="dia" tick={AXIS} axisLine={false} tickLine={false} />
              <YAxis tick={AXIS} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString("pt-BR")}%`, "Ocupação"]} cursor={{ fill: "#F6F1EE" }} />
              <Bar dataKey="ocupacao" fill={SERIES} radius={[4, 4, 0, 0]} maxBarSize={44}>
                <LabelList dataKey="ocupacao" position="top" formatter={(v: number) => `${Math.round(v)}%`} style={{ fontSize: 11, fill: "#2B2626" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Cancelamentos e faltas" subtitle="Quantidade e valor de tabela perdido" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Kpi label="Faltas" value={String(data.perdas.faltas)} small />
            <Kpi label="Valor perdido com faltas" value={brl(data.perdas.faltasValor)} small />
            <Kpi label="Cancelamentos" value={String(data.perdas.cancel)} small />
            <Kpi label="Valor perdido com cancelamentos" value={brl(data.perdas.cancelValor)} small />
          </div>
          <Table
            head={["Data", "Paciente", "Serviço", "Profissional", "Status", "Valor"]}
            rows={data.perdas.lista.map((a) => [
              fmtDate(a.date),
              patientName(a.patientId),
              serviceById(a.serviceId).name,
              proById(a.professionalId).name,
              statusLabels[a.status],
              brl(serviceById(a.serviceId).price),
            ])}
            empty="Nenhuma falta ou cancelamento no período."
          />
        </Panel>

        <Panel title="Retornos e reaplicações pendentes" subtitle="Retornos agendados e reaplicações de toxina previstas (~4 meses)" className="lg:col-span-2">
          <Table
            head={["Paciente", "Procedimento", "Data prevista", "Situação", "Profissional"]}
            rows={data.pendentes.slice(0, 12).map((p) => [
              patientName(p.patientId),
              p.procedimento,
              fmtDate(p.data),
              p.tipo,
              proById(p.proId).name,
            ])}
            empty="Nada pendente."
          />
          {data.pendentes.length > 12 && <p className="mt-2 text-xs text-muted">+ {data.pendentes.length - 12} outros</p>}
        </Panel>

        <Panel title="Origem do agendamento" subtitle="Agendamentos no período">
          <HBar data={data.origem} dataKey="qtd" nameKey="name" />
        </Panel>
        <Panel title="Formas de pagamento" subtitle="Faturamento por forma de pagamento">
          <HBar data={data.pagamento} dataKey="valor" nameKey="name" money wide />
        </Panel>
      </div>
    </div>
  );
}

function Kpi({ label, value, hint, small }: { label: string; value: string; hint?: string; small?: boolean }) {
  return (
    <div className={`card ${small ? "p-3" : "p-4"}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className={`mt-1 font-semibold tabular-nums text-ink ${small ? "text-lg" : "text-2xl"}`}>{value}</p>
      {hint && <p className="text-[11px] text-muted">{hint}</p>}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`card p-4 ${className}`} aria-label={title}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink">{title}</h2>
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function HBar({
  data,
  dataKey,
  nameKey,
  money,
  wide,
}: {
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey: string;
  money?: boolean;
  wide?: boolean;
}) {
  const fmt = (v: number) => (money ? brlShort(v) : v.toLocaleString("pt-BR"));
  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 40 + 16)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 72, left: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey={nameKey} tick={AXIS} axisLine={false} tickLine={false} width={wide ? 170 : 130} />
        <Tooltip formatter={(v: number) => [money ? brl(v) : v.toLocaleString("pt-BR"), money ? "Faturamento" : "Quantidade"]} cursor={{ fill: "#F6F1EE" }} />
        <Bar dataKey={dataKey} fill={SERIES} radius={[0, 4, 4, 0]} barSize={18}>
          <LabelList dataKey={dataKey} position="right" formatter={fmt} style={{ fontSize: 11, fill: "#2B2626" }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function Table({ head, rows, empty }: { head: string[]; rows: string[][]; empty: string }) {
  if (!rows.length) return <p className="mt-3 text-sm text-muted">{empty}</p>;
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs text-muted">
            {head.map((h) => (
              <th key={h} scope="col" className="py-2 pr-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {r.map((c, j) => (
                <td key={j} className="py-2 pr-3">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
