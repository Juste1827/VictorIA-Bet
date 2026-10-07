import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "VictorIA BET — L'Élite du Pari Sportif par IA",
  description: "Plateforme de pronostics sportifs de haute précision alimentée par intelligence artificielle et la Loi de Poisson.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-inter bg-[#020408] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
