import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { SuppressErrors } from "@/components/suppress-errors";
import "@/lib/suppress-web3modal-errors";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuralEstate AI - Intelligent RWA Tokenization",
  description: "AI-powered Real-World Asset tokenization platform. Invest in real estate with blockchain security and AI intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SuppressErrors />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

