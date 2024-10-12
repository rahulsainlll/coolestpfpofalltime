import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { KindeSessionProvider } from '@/components/KindeSessionProvider'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Coolest pfp",
  description: "CBK ninja techinique",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <KindeSessionProvider>
        {children}
        </KindeSessionProvider>
      </body>
    </html>
  );
}