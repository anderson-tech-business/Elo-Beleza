# Design system — Elo Beleza (modelo demonstrativo)

Referência rápida para manter o site consistente. Identidade visual **provisória**: quando a marca oficial chegar, troque os valores em `src/app/globals.css` (`:root`) e tudo se atualiza.

## 1. Onde ficam as coisas

| O quê | Arquivo |
| --- | --- |
| Tokens de cor | `src/app/globals.css` (`:root`, em canais RGB) |
| Mapeamento para classes Tailwind, raios, sombras, tamanhos extras | `tailwind.config.ts` |
| Componentes de estilo (`.btn-*`, `.card`, `.input`, `.chip`, `.eyebrow`, `.h-section`, `.glass`) | `src/app/globals.css` (`@layer components`) |
| Tokens de movimento | `src/lib/motion-tokens.ts` |
| Cores de status da agenda | `src/lib/status.ts` |
| Cores dos gráficos (validadas para daltonismo) | `src/app/admin/dashboard/page.tsx` (`SERIES`, `SERIES_2`) |
| Conteúdo e mídias ilustrativas | `src/data/demo.ts` |

**Regra:** não use hex solto em classes (`text-[#...]`). Se faltar uma cor, crie o token.

## 2. Cores

As cores são definidas como canais RGB (`--color-primary: 185 132 122`) para que a transparência do Tailwind funcione (`bg-bg/95`, `text-primary/60`).

### Marca
| Classe | Hex | Uso |
| --- | --- | --- |
| `primary` | #B9847A | Ícones, destaques decorativos. **Não usar em texto pequeno** (3,2:1) |
| `primary-dark` | #8C5A50 | Botão primário, títulos, links (5,3:1 sobre o fundo) |
| `primary-deep` | #744940 | Hover do botão primário |
| `primary-soft` | #F3E6E1 | Fundos suaves, chips, seleção |
| `blush` | #F0CFC6 | Destaques sobre fundo escuro (itálicos, sobretítulos) |

### Superfícies e texto — claro
| Classe | Hex | Uso |
| --- | --- | --- |
| `bg` | #FBF7F4 | Fundo da página |
| `surface` | #FFFFFF | Cartões, campos |
| `sunken` | #F6F1EE | Áreas rebaixadas, horário fechado na agenda |
| `ink` | #2B2626 | Texto principal (14:1) |
| `muted` | #6E6360 | Texto secundário (5,4:1) |
| `line` | #EADFD9 | Divisórias **decorativas** |
| `field` | #958580 | Borda de campos e controles (3,5:1, WCAG 1.4.11) |

### Superfícies e texto — escuro (sobre vídeo, foto ou seção noturna)
| Classe | Hex | Uso |
| --- | --- | --- |
| `night` | #1F1B1B | Camadas escuras sobre mídia (`bg-night/70`) |
| `on-dark` | #EFE7E4 | Texto corrido |
| `on-dark-muted` | #D9CFCB | Texto secundário |
| `on-dark-subtle` | #BFB3AF | Legendas ("Imagem ilustrativa") |

### Semânticas
| Classe | Uso |
| --- | --- |
| `danger` / `danger-soft` | Mensagens de erro e fundo do alerta |
| `success` / `success-soft` | Confirmações (toast, selo de sincronização) |
| `gold` / `gold-light` | Estrela de avaliação no claro / no escuro |

**Texto sobre mídia:** sempre com camada `night` entre 45% e 90% por trás.

## 3. Tipografia

| Papel | Classe | Observação |
| --- | --- | --- |
| Título principal (h1) | `font-serif text-5xl sm:text-7xl lg:text-8xl` | Só no topo |
| Título de seção (h2) | `.h-section` | **Um tamanho para o site todo** (4xl/5xl). Sobre escuro: `h-section text-white` |
| Sobretítulo | `.eyebrow` + cor (`text-primary-dark` ou `text-blush`) | Maiúsculas, espaçado |
| Destaque editorial | `<em className="font-medium italic text-blush">` | Uma palavra por título, no máximo |
| Corpo | `text-base` / `text-lg` (introduções) | Inter |
| Apoio | `text-sm`, `text-xs` | |
| Legenda mínima | `text-2xs` (11px) | Só legendas de mídia e blocos densos da agenda |

Fontes: **Cormorant Garamond** (títulos) e **Inter** (texto), via `next/font`.

## 4. Espaço, raios e sombras

| Token | Valor | Uso |
| --- | --- | --- |
| `rounded-card` | 16px | `.card`, painéis, acordeão |
| `rounded-feature` | 28px | Mídias, cartões de vidro, cartões de destaque |
| `rounded-xl` | 12px | Campos, botões de horário |
| `rounded-full` | — | Botões, chips, avatares |
| `shadow-lift` | — | Cartão no hover |
| `shadow-float` | — | Cartão flutuando sobre mídia |

Ritmo vertical das seções: `py-16 sm:py-24` (padrão) · `py-20 sm:py-28` (seção com foto de fundo) · `py-24 sm:py-32` (chamada com vídeo).

## 5. Componentes

### Botão
| Classe | Uso |
| --- | --- |
| `.btn-primary` | Ação principal em fundo claro (uma por bloco) |
| `.btn-outline` | Ação secundária em fundo claro |
| `.btn-ghost` | Ação terciária, navegação, "Voltar" |
| `.btn-light` | Ação principal sobre fundo escuro |
| `.btn-outline-light` | Ação secundária sobre fundo escuro |
| `.btn-sm` / `.btn-lg` | Tamanhos (combinar com uma variante) |

Estados: hover (cor), foco (contorno de 3px), desabilitado (`opacity-50`). Em celular, garanta 44px de altura (`min-h-11`).

### Campos
`.label` + `.input` (+ `aria-invalid`, `aria-describedby` com o id da mensagem de erro em `text-danger`). Ver `Field` em `src/app/agendar/BookingFlow.tsx`.

### Cartões
`.card` (claro) · `.glass` (sobre mídia) · cartão de foto inteira (Estética, `rounded-feature` + camada `night`).

### Chips
`.chip` + cores: `bg-primary-soft text-primary-dark` (regiões), status da agenda (`statusStyle` em `src/lib/status.ts`, sempre com símbolo junto da cor).

### Diálogos
`Modal` (`src/components/Modal.tsx`) e painel lateral usam `useDialog`: foco preso, Esc fecha, foco volta para quem abriu.

## 6. Movimento

Tokens em `src/lib/motion-tokens.ts`:

| Token | Valor | Uso |
| --- | --- | --- |
| `ease.out` | `[0.22, 1, 0.36, 1]` | Toda entrada e resposta a gesto |
| `duration.fast` | 0,25 s | Hover, toque |
| `duration.base` | 0,7 s | Texto e cartões entrando |
| `duration.slow` | 1,1 s | Revelação de imagem |
| `duration.draw` | 1,8 s | Ícones se desenhando |
| `stagger` | 0,09 s | Itens em sequência |

Regras:
1. Anime só `transform`, `opacity`, `filter` e `clip-path`.
2. Nada se move sozinho por mais de 5 s sem botão de pausa (WCAG 2.2.2). Movimento contínuo deve responder à rolagem ou ao mouse.
3. Sempre respeitar "reduzir movimento" (`MotionConfig reducedMotion="user"` + `useReducedMotion`).
4. O título principal não anima (não atrasar o carregamento).

## 7. Mídia

- Fotos via `next/image` com `placeholder="blur"`; vídeos sem som, `playsInline`, tocando só quando visíveis, com botão de pausa.
- Toda mídia de banco leva a etiqueta "ilustrativa".
- Sem fotos de antes e depois; sem rosto de banco no lugar de profissional ou paciente.
