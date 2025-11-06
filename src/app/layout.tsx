import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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
  title: "Rosalia o Biblia",
  description: "Rosalia o biblia",
};

const renderNavbar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <span className="logo pl-5">Rosalía o la Biblia</span>
      </Link>
      <Link href="https://unkedition.com" target="blank">
        <span>
          <Image src="/icon.webp" alt="unk icon" width={100} height={100} />
        </span>
      </Link>
    </nav>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="RosaliaBiblia" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="bg-effect" />
        {renderNavbar()}
        {children}
      </body>
    </html>
  );
}
