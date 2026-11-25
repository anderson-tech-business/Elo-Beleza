export type Category = "harmonizacao" | "estetica";

export type Status = "confirmado" | "concluido" | "cancelado" | "faltou" | "retorno";

export type Origin = "site" | "instagram" | "google";

export type Payment = "pix" | "credito" | "debito" | "dinheiro";

export type Role = "admin" | "pro";

export interface Professional {
  id: string;
  name: string;
  role: string;
  bio: string;
  serviceIds: string[];
  /** Cor de identificação na agenda */
  color: string;
}

export interface Service {
  id: string;
  name: string;
  category: Category;
  durationMin: number;
  price: number;
  /** Exibido para a paciente no fluxo público */
  bookable: boolean;
  injectable: boolean;
  description: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // yyyy-MM-dd
}

export interface Anamnese {
  gestante: boolean;
  alergias: string;
  anticoagulante: boolean;
  procedimentoRecente: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  serviceId: string;
  professionalId: string;
  date: string; // yyyy-MM-dd (horário de São Paulo)
  start: string; // HH:mm
  status: Status;
  origin: Origin;
  /** Valor efetivamente cobrado (somente concluídos) */
  paidAmount?: number;
  payment?: Payment;
  notes?: string;
  anamnese?: Anamnese;
  createdInDemo?: boolean;
}

export interface Block {
  id: string;
  professionalId: string;
  date: string;
  start: string;
  end: string;
  reason: string;
}

export interface DemoState {
  patients: Patient[];
  appointments: Appointment[];
  blocks: Block[];
}

export interface Session {
  role: Role;
  professionalId?: string;
}
