import GoogleAnalytics from "@/lib/googleAnalytics";
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

// SEO optimizado
export const metadata: Metadata = {
  title:
    "Rosalía o Biblia - ¿Puedes distinguir las letras de Rosalía de los versículos bíblicos?",
  description:
    "Pon a prueba tu conocimiento musical y bíblico. ¿Puedes distinguir entre las letras de Rosalía y los versículos de la Biblia? Un juego divertido y desafiante creado por UNK.",
  keywords: [
    "Rosalía",
    "Biblia",
    "juego",
    "quiz",
    "música",
    "letras",
    "versículos",
    "Motomami",
    "UNK",
    "test musical",
    "juego online",
  ],
  authors: [{ name: "UNK Edition", url: "https://unkedition.com" }],
  creator: "UNK Edition",
  publisher: "UNK Edition",
  metadataBase: new URL("https://rosalia.unkedition.com"),
  alternates: {
    canonical: "/",
  },
  // FAVICONS - Configuración explícita para Google
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://rosalia.unkedition.com",
    siteName: "Rosalía o Biblia",
    title: "Rosalía o Biblia - ¿Letra de Rosalía o versículo bíblico?",
    description:
      "¿Puedes distinguir entre las letras de Rosalía y los versículos de la Biblia? Pon a prueba tu conocimiento en este divertido juego.",
    images: [
      {
        url: "/og-image.png", // Crea esta imagen 1200x630px
        width: 1200,
        height: 630,
        alt: "Rosalía o Biblia - Juego de adivinanzas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rosalía o Biblia - ¿Puedes distinguir?",
    description:
      "¿Letra de Rosalía o versículo bíblico? Pon a prueba tu conocimiento en este divertido juego.",
    images: ["/og-image.png"], // Misma imagen que OpenGraph
    creator: "@unkedition", // Pon tu usuario de Twitter si lo tienes
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "pHFksfHPcm2YUo-i1um-u_Phpyso-IGuxL5Q1oQrPxE", // Añadir cuando configures Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        {/* Theme color para navegadores móviles */}
        <meta name="theme-color" content="#a51d29" />

        {/* Structured Data para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Rosalía o Biblia",
              description:
                "Juego online para distinguir entre letras de Rosalía y versículos bíblicos",
              url: "https://rosalia.unkedition.com",
              applicationCategory: "Game",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "EUR",
              },
              author: {
                "@type": "Organization",
                name: "UNK Edition",
                url: "https://unkedition.com",
                logo: "https://rosalia.unkedition.com/icon.webp",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "100",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}

        <div className="bg-effect" />
        {children}
      </body>
    </html>
  );
}
