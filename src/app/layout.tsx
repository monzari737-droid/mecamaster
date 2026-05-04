import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export const metadata: Metadata = {
  title: "Meca Master - Votre mécanicien en un clic",
  description:
    "Meca Master connecte les propriétaires de véhicules avec des mécaniciens qualifiés et des entreprises de pièces détachées. Service de dépannage SOS, marketplace et gestion complète.",
  keywords: [
    "mécanicien",
    "dépannage",
    "voiture",
    "garage",
    "pièces auto",
    "Côte d'Ivoire",
    "Afrique",
    "SOS",
    "réparation",
  ],
  authors: [{ name: "Meca Master" }],
  creator: "Meca Master",
  publisher: "Meca Master",
  robots: "index, follow",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
      { url: "/icons/icon-512x512.png", sizes: "512x512" },
    ],
    apple: [{ url: "/icons/icon-192x192.png" }],
  },
  themeColor: "#FF8C42",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Meca Master",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://mecamaster.vercel.app",
    title: "Meca Master - Votre mécanicien en un clic",
    description:
      "Connectez-vous instantanément avec des mécaniciens qualifiés près de chez vous. Service SOS, marketplace de pièces, et gestion complète de votre véhicule.",
    siteName: "Meca Master",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Meca Master - Application de mise en relation automobile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meca Master - Votre mécanicien en un clic",
    description:
      "Connectez-vous instantanément avec des mécaniciens qualifiés près de chez vous.",
    images: ["/og-image.jpg"],
    creator: "@mecamaster",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF8C42" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
