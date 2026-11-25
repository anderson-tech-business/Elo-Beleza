/**
 * ============================================================
 *  DADOS DO MODELO DEMONSTRATIVO — Elo Beleza com Propósito
 * ============================================================
 *  Este é o ÚNICO arquivo com dados ilustrativos do projeto.
 *  Para a versão final, troque aqui: profissionais, preços,
 *  depoimentos, horários e o gerador de histórico fictício.
 *
 *  Dados reais (públicos): nome, endereço, telefone, Instagram,
 *  nota e número de avaliações no Google.
 * ============================================================
 */
import type {
  Appointment,
  DemoState,
  Origin,
  Patient,
  Payment,
  Professional,
  Service,
  Status,
} from "@/lib/types";
import { shift, toHHMM, toMin, weekday } from "@/lib/time";

/* ---------------------------------------------------------------
 * 1. Dados reais do negócio
 * ------------------------------------------------------------- */
export const business = {
  name: "Elo Beleza com Propósito",
  shortName: "Elo Beleza",
  street: "Av. Maria Luiza Americano, 1279",
  neighborhood: "Parque do Carmo/Itaquera",
  city: "São Paulo",
  state: "SP",
  zip: "08275-000",
  fullAddress: "Av. Maria Luiza Americano, 1279 – Parque do Carmo/Itaquera, São Paulo – SP, 08275-000",
  phone: "(11) 96445-0512",
  phoneE164: "+5511964450512",
  instagram: "elo_belezacomproposito",
  instagramUrl: "https://www.instagram.com/elo_belezacomproposito/",
  site: "https://elobelezacomproposito.com.br",
  rating: 4.9,
  reviewCount: 146,
  googleReviewsUrl:
    "https://www.google.com/search?q=Elo+Beleza+com+Prop%C3%B3sito+Av.+Maria+Luiza+Americano+1279+avalia%C3%A7%C3%B5es",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=Av.+Maria+Luiza+Americano,+1279+-+Parque+do+Carmo,+S%C3%A3o+Paulo+-+SP,+08275-000&output=embed",
  geo: { lat: -23.5603, lng: -46.4652 },
  responsavelTecnica: "[a confirmar]",
};

/* ---------------------------------------------------------------
 * 2. Profissionais (ilustrativo)
 * ------------------------------------------------------------- */
export const professionals: Professional[] = [
  {
    id: "camila",
    name: "Dra. Camila Rocha",
    role: "Harmonização facial",
    bio: "Responsável pelas avaliações e procedimentos injetáveis. Protocolo individual, com foco em resultado natural e seguro.",
    serviceIds: ["avaliacao", "toxina", "preenchimento", "retorno-toxina"],
    color: "#8C5A50",
  },
  {
    id: "juliana",
    name: "Juliana Alves",
    role: "Esteticista",
    bio: "Cuida da saúde da pele com limpeza, tratamento de acne e microdermoabrasão.",
    serviceIds: ["limpeza", "acne", "microdermo"],
    color: "#5E7A6E",
  },
  {
    id: "bianca",
    name: "Bianca Souza",
    role: "Designer de sobrancelhas",
    bio: "Design de sobrancelha com linha, respeitando o formato natural do rosto.",
    serviceIds: ["sobrancelha", "limpeza"],
    color: "#6B6390",
  },
];

/** Profissional destacada na landing ("Quem atende") */
export const featuredProfessional = {
  professionalId: "camila",
  registro: "[a confirmar]",
};

/* ---------------------------------------------------------------
 * 3. Serviços e preços (ilustrativo)
 * ------------------------------------------------------------- */
export const services: Service[] = [
  {
    id: "avaliacao",
    name: "Avaliação de harmonização",
    category: "harmonizacao",
    durationMin: 30,
    price: 0,
    bookable: true,
    injectable: true,
    description: "Conversa, análise facial e plano individual. Toxina e preenchimento são definidos na avaliação.",
  },
  {
    id: "toxina",
    name: "Toxina botulínica (3 regiões)",
    category: "harmonizacao",
    durationMin: 45,
    price: 1200,
    bookable: false,
    injectable: true,
    description: "Suaviza linhas da testa, da glabela e pés de galinha; também uso preventivo.",
  },
  {
    id: "preenchimento",
    name: "Preenchimento com ácido hialurônico (1 ml)",
    category: "harmonizacao",
    durationMin: 60,
    price: 1400,
    bookable: false,
    injectable: true,
    description: "Olheiras, bigode chinês, mandíbula e queixo; efeito lifting suave.",
  },
  {
    id: "retorno-toxina",
    name: "Retorno toxina",
    category: "harmonizacao",
    durationMin: 15,
    price: 0,
    bookable: false,
    injectable: false,
    description: "Revisão do resultado cerca de 15 dias após a aplicação.",
  },
  {
    id: "limpeza",
    name: "Limpeza de pele",
    category: "estetica",
    durationMin: 90,
    price: 180,
    bookable: true,
    injectable: false,
    description: "Higienização profunda, extração e hidratação, de acordo com o seu tipo de pele.",
  },
  {
    id: "acne",
    name: "Tratamento de acne",
    category: "estetica",
    durationMin: 60,
    price: 200,
    bookable: true,
    injectable: false,
    description: "Protocolo para controle da oleosidade e redução de inflamações.",
  },
  {
    id: "microdermo",
    name: "Microdermoabrasão",
    category: "estetica",
    durationMin: 50,
    price: 220,
    bookable: true,
    injectable: false,
    description: "Renovação suave da pele para textura mais uniforme e viço.",
  },
  {
    id: "sobrancelha",
    name: "Design de sobrancelha com linha",
    category: "estetica",
    durationMin: 30,
    price: 60,
    bookable: true,
    injectable: false,
    description: "Design preciso com linha, respeitando o desenho natural.",
  },
];

/* ---------------------------------------------------------------
 * 4. Expediente (ilustrativo)
 *    0 = domingo ... 6 = sábado. Intervalos em "HH:mm".
 * ------------------------------------------------------------- */
export const workingHours: Record<number, [string, string][]> = {
  0: [],
  1: [],
  2: [["09:00", "12:00"], ["13:00", "19:00"]],
  3: [["09:00", "12:00"], ["13:00", "19:00"]],
  4: [["09:00", "12:00"], ["13:00", "19:00"]],
  5: [["09:00", "12:00"], ["13:00", "19:00"]],
  6: [["09:00", "12:00"], ["13:00", "15:00"]],
};

export const hoursLabel = [
  { days: "Terça a sexta", hours: "9h às 19h" },
  { days: "Sábado", hours: "9h às 15h" },
  { days: "Domingo e segunda", hours: "Fechado" },
];

/** Intervalo entre horários oferecidos no agendamento (min) */
export const slotStepMin = 30;
/** Quantos dias à frente a paciente pode agendar */
export const bookingWindowDays = 60;

/* ---------------------------------------------------------------
 * 5. Depoimentos (EXEMPLOS — não são avaliações reais)
 * ------------------------------------------------------------- */
export const testimonials = [
  {
    name: "Patrícia",
    procedure: "Toxina botulínica",
    text: "Fiquei com medo de ficar artificial, mas o resultado ficou leve. Minhas amigas só disseram que eu parecia descansada.",
  },
  {
    name: "Renata",
    procedure: "Limpeza de pele",
    text: "Atendimento muito cuidadoso, explicaram cada etapa. Saí com a pele leve e já marquei a próxima.",
  },
  {
    name: "Aline",
    procedure: "Avaliação de harmonização",
    text: "Gostei de não ter sido empurrado nenhum procedimento. A avaliação foi honesta e tirou todas as minhas dúvidas.",
  },
  {
    name: "Fernanda",
    procedure: "Design de sobrancelha",
    text: "Respeitou o formato da minha sobrancelha. Ficou natural, do jeito que eu queria.",
  },
];

/* ---------------------------------------------------------------
 * 6. Perguntas frequentes (texto ilustrativo, revisar com a clínica)
 * ------------------------------------------------------------- */
export const faq = [
  {
    q: "Dói?",
    a: "A maioria das pacientes relata apenas um leve desconforto. Usamos agulhas finas e, quando indicado, anestésico tópico. Tudo é conversado na avaliação.",
  },
  {
    q: "Quanto tempo dura o efeito da toxina?",
    a: "Em geral, de 4 a 6 meses, variando conforme o organismo, a região tratada e os hábitos de cada pessoa.",
  },
  {
    q: "Quando vejo o resultado?",
    a: "Na toxina botulínica, o efeito começa a aparecer entre 3 e 7 dias e se completa por volta de 15 dias. No preenchimento, parte do resultado é imediata e se acomoda nas semanas seguintes.",
  },
  {
    q: "Tem retorno?",
    a: "Sim. Após a toxina, agendamos um retorno em cerca de 15 dias para avaliar o resultado e fazer ajustes, se necessário.",
  },
  {
    q: "Quais os cuidados depois?",
    a: "Evitar deitar e fazer atividade física intensa nas primeiras horas, não massagear a região e seguir as orientações individuais passadas pela profissional.",
  },
  {
    q: "Preciso de avaliação antes?",
    a: "Sim, para harmonização facial. A avaliação é gratuita e serve para entender o seu histórico de saúde, o que você deseja e montar um protocolo individual.",
  },
];

/* ---------------------------------------------------------------
 * 7. Rótulos
 * ------------------------------------------------------------- */
export const statusLabels: Record<Status, string> = {
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
  faltou: "Faltou",
  retorno: "Retorno",
};

export const originLabels: Record<Origin, string> = {
  site: "Site",
  instagram: "Instagram",
  google: "Google",
};

export const paymentLabels: Record<Payment, string> = {
  pix: "Pix",
  credito: "Cartão de crédito",
  debito: "Cartão de débito",
  dinheiro: "Dinheiro",
};

/* ---------------------------------------------------------------
 * 8. Pacientes fictícias
 * ------------------------------------------------------------- */
const firstNames = [
  "Ana", "Beatriz", "Carla", "Daniela", "Eduarda", "Fabiana", "Gabriela", "Helena", "Isabela", "Jéssica",
  "Karina", "Larissa", "Mariana", "Natália", "Priscila", "Rafaela", "Sabrina", "Tatiane", "Vanessa", "Yasmin",
  "Adriana", "Bruna", "Camila", "Débora", "Elaine", "Flávia", "Giovana", "Ingrid", "Juliana", "Kelly",
  "Letícia", "Michele", "Nathalia", "Paula", "Renata", "Simone", "Talita", "Viviane", "Aline", "Bianca",
  "Cristiane", "Denise", "Érica", "Fernanda", "Gisele", "Jaqueline", "Luana", "Marcela", "Patrícia", "Roberta",
  "Sandra", "Thaís", "Úrsula", "Valéria", "Amanda", "Carolina", "Lívia", "Monique", "Raquel", "Stefany",
];
const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Ferreira", "Costa", "Rodrigues", "Almeida",
  "Nascimento", "Carvalho", "Gomes", "Martins", "Araújo", "Ribeiro", "Barbosa", "Rocha", "Dias", "Moreira",
];

/* ---------------------------------------------------------------
 * 9. Gerador determinístico de histórico (seed fixa)
 * ------------------------------------------------------------- */
export const seedConfig = {
  seed: 20241125,
  pastDays: 182,
  futureDays: 21,
  patientCount: 60,
  noShowRate: 0.08,
  cancelRate: 0.06,
  /** Ocupação média por profissional (chance de ocupar um horário livre) */
  occupancy: { camila: 0.26, juliana: 0.85, bianca: 0.3 } as Record<string, number>,
  /** Peso de cada serviço no sorteio, por profissional */
  serviceMix: {
    camila: { avaliacao: 3, toxina: 4, preenchimento: 2.5 },
    juliana: { limpeza: 4, acne: 2.5, microdermo: 2 },
    bianca: { sobrancelha: 7, limpeza: 1.5 },
  } as Record<string, Record<string, number>>,
  origins: { instagram: 0.45, site: 0.3, google: 0.25 } as Record<Origin, number>,
  payments: { pix: 0.45, credito: 0.35, debito: 0.12, dinheiro: 0.08 } as Record<Payment, number>,
};

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weighted<T extends string>(rand: () => number, weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [k, w] of entries) {
    r -= w;
    if (r <= 0) return k;
  }
  return entries[entries.length - 1][0];
}

const slug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function generateDemoState(today: string): DemoState {
  const cfg = seedConfig;
  const rand = mulberry32(cfg.seed);
  const svc = Object.fromEntries(services.map((s) => [s.id, s]));

  // Pacientes
  const patients: Patient[] = firstNames.slice(0, cfg.patientCount).map((first, i) => {
    const last = lastNames[Math.floor(rand() * lastNames.length)];
    const year = 1975 + Math.floor(rand() * 28);
    const month = 1 + Math.floor(rand() * 12);
    const day = 1 + Math.floor(rand() * 28);
    const phone = `(11) 9${8000 + Math.floor(rand() * 1999)}-${String(1000 + Math.floor(rand() * 8999))}`;
    return {
      id: `p${i + 1}`,
      name: `${first} ${last}`,
      email: `${slug(first)}.${slug(last)}${i + 1}@exemplo.com`,
      phone,
      birthDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    };
  });
  // Cada paciente "chega" à clínica em um dia diferente (para existir novas x recorrentes)
  const joinDay = patients.map((_, i) => (i < 18 ? 0 : Math.floor(((i - 18) / (cfg.patientCount - 18)) * cfg.pastDays)));

  const appointments: Appointment[] = [];
  const retornosPorDia: Record<string, string[]> = {};
  let seq = 0;

  const start = shift(today, -cfg.pastDays);
  for (let offset = 0; offset <= cfg.pastDays + cfg.futureDays; offset++) {
    const date = shift(start, offset);
    const segments = workingHours[weekday(date)];
    if (!segments.length) continue;
    const isPast = date < today;
    const isToday = date === today;
    // Agenda futura fica menos cheia quanto mais distante
    const futureFactor = isPast || isToday ? 1 : Math.max(0.25, 1 - (offset - cfg.pastDays) / (cfg.futureDays + 4));

    for (const pro of professionals) {
      const busy: [number, number][] = [];
      const fits = (s: number, e: number) => busy.every(([bs, be]) => e <= bs || s >= be);
      const pickPatient = () => {
        const pool = patients.filter((_, i) => joinDay[i] <= offset);
        return pool[Math.floor(rand() * pool.length)].id;
      };
      const push = (serviceId: string, startMin: number, patientId: string) => {
        const s = svc[serviceId];
        busy.push([startMin, startMin + s.durationMin]);
        let status: Status = "confirmado";
        if (isPast) {
          const r = rand();
          status = r < cfg.noShowRate ? "faltou" : r < cfg.noShowRate + cfg.cancelRate ? "cancelado" : "concluido";
        } else if (rand() < 0.03) {
          status = "cancelado";
        }
        if (serviceId === "retorno-toxina" && !isPast) status = status === "cancelado" ? status : "retorno";
        const a: Appointment = {
          id: `a${++seq}`,
          patientId,
          serviceId,
          professionalId: pro.id,
          date,
          start: toHHMM(startMin),
          status,
          origin: weighted(rand, cfg.origins),
        };
        if (status === "concluido" && s.price > 0) {
          a.paidAmount = s.price;
          a.payment = weighted(rand, cfg.payments);
        } else if (status === "concluido") {
          a.paidAmount = 0;
        }
        appointments.push(a);
        if (serviceId === "toxina" && status === "concluido") {
          let ret = shift(date, 15);
          while (!workingHours[weekday(ret)].length) ret = shift(ret, 1);
          (retornosPorDia[ret] ??= []).push(patientId);
        }
      };

      // Retornos de toxina vêm primeiro na agenda da Dra.
      if (pro.id === "camila") {
        const due = retornosPorDia[date] ?? [];
        for (const patientId of due) {
          for (const [a, b] of segments) {
            let placed = false;
            for (let m = toMin(b) - 15; m >= toMin(a); m -= 15) {
              if (fits(m, m + 15)) {
                push("retorno-toxina", m, patientId);
                placed = true;
                break;
              }
            }
            if (placed) break;
          }
        }
      }

      for (const [a, b] of segments) {
        let m = toMin(a);
        const end = toMin(b);
        while (m < end) {
          if (rand() < cfg.occupancy[pro.id] * futureFactor) {
            const serviceId = weighted(rand, cfg.serviceMix[pro.id]);
            const dur = svc[serviceId].durationMin;
            if (m + dur <= end && fits(m, m + dur)) {
              push(serviceId, m, pickPatient());
              m += Math.ceil(dur / 30) * 30;
              continue;
            }
          }
          m += 30;
        }
      }
    }
  }
  return { patients, appointments, blocks: [] };
}

/* ---------------------------------------------------------------
 * 10. Imagens e vídeo (ILUSTRATIVOS — banco de imagens)
 *     Substituir por fotos e vídeos reais da clínica.
 *     Fotos: Unsplash (Licença Unsplash). Vídeo: Mixkit (Licença
 *     gratuita Mixkit). Ambas permitem uso comercial sem atribuição.
 *     Regra do projeto: sem fotos de antes e depois e sem rostos
 *     de banco de imagem no lugar de profissionais ou pacientes reais.
 * ------------------------------------------------------------- */
import heroImg from "@/assets/media/hero.jpg";
import harmonizacaoImg from "@/assets/media/harmonizacao.jpg";
import limpezaImg from "@/assets/media/limpeza.jpg";
import acneImg from "@/assets/media/acne.jpg";
import microdermoImg from "@/assets/media/microdermo.jpg";
import sobrancelhaImg from "@/assets/media/sobrancelha.jpg";
import serumImg from "@/assets/media/serum.jpg";
import cuidadoPoster from "@/assets/media/cuidado-poster.jpg";

export const media = {
  hero: { src: heroImg, alt: "Mulher de perfil com pele natural e cabelos soltos, em luz suave" },
  harmonizacao: { src: harmonizacaoImg, alt: "Profissional de luvas durante procedimento facial em paciente de olhos fechados" },
  serum: { src: serumImg, alt: "Frasco âmbar de sérum com conta-gotas sobre pedra clara" },
  services: {
    limpeza: { src: limpezaImg, alt: "Paciente recebendo máscara facial durante limpeza de pele" },
    acne: { src: acneImg, alt: "Aplicação de máscara com pincel em tratamento facial" },
    microdermo: { src: microdermoImg, alt: "Aparelho de microdermoabrasão sendo usado na testa da paciente" },
    sobrancelha: { src: sobrancelhaImg, alt: "Design de sobrancelha com linha" },
  } as Record<string, { src: typeof heroImg; alt: string }>,
  video: {
    src: "/media/cuidado.mp4",
    poster: cuidadoPoster,
    label: "Vídeo ilustrativo: massagem facial feita com calma por profissional de luvas",
  },
};
