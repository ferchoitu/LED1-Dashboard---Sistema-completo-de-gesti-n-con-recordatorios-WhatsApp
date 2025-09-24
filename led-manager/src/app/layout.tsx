import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LED1 - Panel de Administración",
  description: "Sistema de gestión para pantalla LED en vía pública - Control de clientes, pagos y recordatorios automáticos por WhatsApp",
  keywords: "LED1, gestión clientes, pagos, WhatsApp, recordatorios automáticos, administración",
  authors: [{ name: "LED1" }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LED1 Panel'
  },
  openGraph: {
    title: 'LED1 - Panel de Administración',
    description: 'Sistema de gestión para pantalla LED en vía pública',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mobile-full-height`}
      >
        {children}
      </body>
    </html>
  );
}
