import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const LOGO_URL = "https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770405388/icon-removebg-preview_v3cxkb.png";

export const metadata: Metadata = {
  title: {
    default: "Redlix — Crafting Digital Excellence",
    template: "%s | Redlix Studio",
  },
  description:
    "Boutique digital studio specializing in high-performance web systems, mobile logic, and modern design.",
  metadataBase: new URL("https://redlix.com"),
  icons: {
    icon: [
      { url: LOGO_URL, type: "image/png" },
      { url: LOGO_URL, sizes: "32x32", type: "image/png" },
    ],
    shortcut: LOGO_URL,
    apple: [
      { url: LOGO_URL, sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://redlix.com",
    title: "Redlix — Crafting Digital Excellence",
    description: "Architectural design and engineering for modern digital products.",
    siteName: "Redlix Studio",
    images: [{ url: LOGO_URL, width: 1200, height: 630, alt: "Redlix Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Redlix — Crafting Digital Excellence",
    description: "Boutique digital studio focused on clarity and performance.",
    images: [LOGO_URL],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50`}
      >
        {children}
      </body>
    </html>
  );
}