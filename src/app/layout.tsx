import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LanguageProvider } from "@/lib/languageContext";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradingJ - Trading Journal",
  description: "Modern trading journal application for tracking trades and performance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <LanguageProvider>
            <Navigation />
            {children}
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
