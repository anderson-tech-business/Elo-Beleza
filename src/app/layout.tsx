import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { DemoBanner } from "@/components/DemoBanner";
import { business } from "@/data/demo";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const description =
  "Harmonização facial em Itaquera e Parque do Carmo, Zona Leste de SP. Toxina botulínica e preenchimento com resultado natural e seguro. Nota 4,9 no Google. Agende sua avaliação.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://elo-beleza-demo.vercel.app"),
  title: "Harmonização Facial em Itaquera | Elo Beleza com Propósito",
  description,
  openGraph: {
    title: "Harmonização Facial em Itaquera | Elo Beleza com Propósito",
    description,
    type: "website",
    locale: "pt_BR",
    siteName: business.name,
  },
  robots: { index: false, follow: false }, // modelo demonstrativo
};

export const viewport: Viewport = { themeColor: "#FBF7F4", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-12 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Pular para o conteúdo
        </a>
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
