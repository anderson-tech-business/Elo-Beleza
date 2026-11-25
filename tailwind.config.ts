import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark) / <alpha-value>)",
        "primary-deep": "rgb(var(--color-primary-deep) / <alpha-value>)",
        "primary-soft": "rgb(var(--color-primary-soft) / <alpha-value>)",
        blush: "rgb(var(--color-blush) / <alpha-value>)",
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        sunken: "rgb(var(--color-sunken) / <alpha-value>)",
        ink: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        field: "rgb(var(--color-field) / <alpha-value>)",
        night: "rgb(var(--color-night) / <alpha-value>)",
        "on-dark": "rgb(var(--color-on-dark) / <alpha-value>)",
        "on-dark-muted": "rgb(var(--color-on-dark-muted) / <alpha-value>)",
        "on-dark-subtle": "rgb(var(--color-on-dark-subtle) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        "danger-soft": "rgb(var(--color-danger-soft) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        "success-soft": "rgb(var(--color-success-soft) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        "gold-light": "rgb(var(--color-gold-light) / <alpha-value>)",
      },
      fontSize: {
        // 11px: só para legendas de mídia e blocos densos da agenda
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        // card: cartões e painéis (16px) · feature: mídias e cartões de destaque (28px)
        card: "1rem",
        feature: "1.75rem",
      },
      boxShadow: {
        lift: "0 18px 40px -24px rgb(var(--color-primary-dark) / 0.45)",
        float: "0 24px 60px -28px rgb(var(--color-primary-dark) / 0.55)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        scrollhint: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
      },
      animation: {
        // Uma vez só (sem loop infinito: WCAG 2.2.2)
        kenburns: "kenburns 2.6s cubic-bezier(0.22,1,0.36,1) both",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
