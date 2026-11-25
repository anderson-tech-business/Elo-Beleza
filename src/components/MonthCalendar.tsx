"use client";

import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { d, iso, shift, todaySP } from "@/lib/time";

interface Props {
  month: string; // qualquer data do mês exibido (yyyy-MM-dd)
  onMonthChange: (m: string) => void;
  selected?: string;
  onSelect: (date: string) => void;
  isEnabled: (date: string) => boolean;
  minMonth?: string;
  maxMonth?: string;
}

const weekdays = ["D", "S", "T", "Q", "Q", "S", "S"];
const weekdaysFull = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export function MonthCalendar({ month, onMonthChange, selected, onSelect, isEnabled, minMonth, maxMonth }: Props) {
  const first = iso(startOfMonth(d(month)));
  const last = iso(endOfMonth(d(month)));
  const lead = d(first).getDay();
  const days: (string | null)[] = Array(lead).fill(null);
  for (let cur = first; cur <= last; cur = shift(cur, 1)) days.push(cur);

  const ym = (s: string) => s.slice(0, 7);
  const today = todaySP();
  const canPrev = !minMonth || ym(first) > ym(minMonth);
  const canNext = !maxMonth || ym(first) < ym(maxMonth);

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          className="btn-ghost h-11 w-11 p-0 text-xl"
          onClick={() => onMonthChange(iso(addMonths(d(first), -1)))}
          disabled={!canPrev}
          aria-label="Mês anterior"
        >
          ‹
        </button>
        <p className="font-semibold" aria-live="polite">
          {(() => {
            const t = format(d(first), "MMMM 'de' yyyy", { locale: ptBR });
            return t.charAt(0).toUpperCase() + t.slice(1);
          })()}
        </p>
        <button
          type="button"
          className="btn-ghost h-11 w-11 p-0 text-xl"
          onClick={() => onMonthChange(iso(addMonths(d(first), 1)))}
          disabled={!canNext}
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted" aria-hidden="true">
        {weekdays.map((w, i) => (
          <span key={i} className="py-1">{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1" role="group" aria-label="Dias do mês">
        {days.map((day, i) => {
          if (!day) return <span key={`e${i}`} />;
          const enabled = isEnabled(day);
          const isSel = day === selected;
          const isToday = day === today;
          return (
            <button
              key={day}
              type="button"
              disabled={!enabled}
              onClick={() => onSelect(day)}
              aria-pressed={isSel}
              aria-label={`${format(d(day), "d 'de' MMMM", { locale: ptBR })}, ${weekdaysFull[d(day).getDay()]}${enabled ? "" : ", sem horários"}`}
              className={`aspect-square rounded-full text-sm transition-colors ${
                isSel
                  ? "bg-primary-dark font-semibold text-white"
                  : enabled
                    ? "bg-primary-soft/50 font-semibold text-ink hover:bg-primary-soft"
                    : "cursor-not-allowed text-muted/50"
              } ${isToday && !isSel ? "ring-1 ring-inset ring-primary-dark" : ""}`}
            >
              {Number(day.slice(8))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
