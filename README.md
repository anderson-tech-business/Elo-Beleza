# Elo Beleza com Propósito — Modelo demonstrativo

Landing page + plataforma de agendamento navegável para apresentação. **Sem backend**: dados mock + `localStorage`.

## Rodar

```bash
npm install
npm run dev
```

## Rotas

| Rota | Conteúdo |
| --- | --- |
| `/` | Landing page |
| `/agendar` | Fluxo de agendamento (5 passos) |
| `/agendar/confirmado` | Confirmação + Google Calendar / .ics |
| `/admin` | Login simulado (qualquer senha) — Administradora ou Profissional |
| `/admin/agenda` | Agenda Dia / Semana / Mês |
| `/admin/dashboard` | Indicadores (somente Administradora) |
| `/admin/pacientes` | Pacientes e histórico |
| `/privacidade` | Política de Privacidade (modelo) |

## Onde trocar os dados

- **Todos os dados ilustrativos**: `src/data/demo.ts` (profissionais, serviços, preços, expediente, depoimentos, FAQ e gerador de histórico com seed fixa).
- **Cores da marca**: variáveis CSS em `src/app/globals.css`.

O botão "Restaurar demo" na área interna apaga os agendamentos criados no navegador.
