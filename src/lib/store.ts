"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { generateDemoState } from "@/data/demo";
import type { Appointment, Block, DemoState, Patient, Session } from "./types";
import { todaySP } from "./time";

/**
 * Estado do modelo: dados gerados (seed fixa) + alterações feitas no
 * navegador, guardadas no localStorage. Nada sai do aparelho.
 */
const KEY = "elo-demo-v1";
const SESSION_KEY = "elo-demo-session";

interface Overlay {
  added: Appointment[];
  patches: Record<string, Partial<Appointment>>;
  patients: Patient[];
  blocks: Block[];
}

const emptyOverlay = (): Overlay => ({ added: [], patches: {}, patients: [], blocks: [] });

let base: DemoState | null = null;
let overlay: Overlay | null = null;
let merged: DemoState | null = null;
const listeners = new Set<() => void>();

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* modo privado: mantém só em memória */
  }
}

function loadOverlay(): Overlay {
  if (overlay) return overlay;
  const raw = safeGet(KEY);
  try {
    overlay = raw ? { ...emptyOverlay(), ...JSON.parse(raw) } : emptyOverlay();
  } catch {
    overlay = emptyOverlay();
  }
  return overlay!;
}

function persist() {
  safeSet(KEY, JSON.stringify(overlay));
  merged = null;
  listeners.forEach((l) => l());
}

export function getState(): DemoState {
  if (merged) return merged;
  base ??= generateDemoState(todaySP());
  const o = loadOverlay();
  merged = {
    patients: [...base.patients, ...o.patients],
    appointments: [...base.appointments, ...o.added].map((a) =>
      o.patches[a.id] ? { ...a, ...o.patches[a.id] } : a,
    ),
    blocks: [...o.blocks],
  };
  return merged;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      overlay = null;
      merged = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Estado do demo (null durante a renderização no servidor) */
export function useDemoState(): DemoState | null {
  return useSyncExternalStore(subscribe, getState, () => null);
}

const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function upsertPatient(data: Omit<Patient, "id">): Patient {
  const st = getState();
  const found = st.patients.find((p) => p.email.toLowerCase() === data.email.toLowerCase());
  if (found) return found;
  const p: Patient = { id: uid("p"), ...data };
  loadOverlay().patients.push(p);
  persist();
  return p;
}

export function addAppointment(a: Omit<Appointment, "id">): Appointment {
  const full: Appointment = { id: uid("a"), createdInDemo: true, ...a };
  loadOverlay().added.push(full);
  persist();
  return full;
}

export function updateAppointment(id: string, patch: Partial<Appointment>) {
  const o = loadOverlay();
  o.patches[id] = { ...o.patches[id], ...patch };
  persist();
}

export function addBlock(b: Omit<Block, "id">) {
  loadOverlay().blocks.push({ id: uid("b"), ...b });
  persist();
}

export function removeBlock(id: string) {
  const o = loadOverlay();
  o.blocks = o.blocks.filter((b) => b.id !== id);
  persist();
}

export function resetDemo() {
  overlay = emptyOverlay();
  persist();
}

/* ------------------------- Sessão (login fake) ------------------------- */
const sessionListeners = new Set<() => void>();
let sessionCache: { raw: string | null; value: Session | null } = { raw: undefined as unknown as null, value: null };

function readSession(): Session | null {
  const raw = safeGet(SESSION_KEY);
  if (raw === sessionCache.raw) return sessionCache.value;
  let value: Session | null = null;
  try {
    value = raw ? JSON.parse(raw) : null;
  } catch {
    value = null;
  }
  sessionCache = { raw, value };
  return value;
}

export function setSession(s: Session | null) {
  safeSet(SESSION_KEY, s ? JSON.stringify(s) : null);
  sessionListeners.forEach((l) => l());
}

/** undefined = ainda carregando; null = sem sessão */
export function useSession(): Session | null | undefined {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const s = useSyncExternalStore(
    (cb) => {
      sessionListeners.add(cb);
      return () => sessionListeners.delete(cb);
    },
    readSession,
    () => null,
  );
  return mounted ? s : undefined;
}
