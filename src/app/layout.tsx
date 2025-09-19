import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Bootstrap} from "@/components/Bootstrap/Bootstrap";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/components/Query/QueryClient.hooks";
import styles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyntheKaia",
  description: "Hybrid DeFi Strategy Vault (stKAIA x Perp Short) For Kaia DeFi Users",
  icons: {
    icon: '/assets/synthekaia-logo.svg',
    shortcut: '/assets/synthekaia-logo.svg',
    apple: '/assets/synthekaia-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <QueryClientProvider client={queryClient}>
              <Bootstrap className={styles.root}>
                  {children}
              </Bootstrap>
          </QueryClientProvider>
      </body>
    </html>
  );
}
