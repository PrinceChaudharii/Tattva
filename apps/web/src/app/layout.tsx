import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Tattva — Open Learning Infrastructure",
    template: "%s | Tattva",
  },
  description:
    "India's open-source, NCERT-aligned learning platform. Free, structured, and world-class education for every learner.",
  keywords: [
    "NCERT",
    "education",
    "open source",
    "learning",
    "India",
    "K-12",
    "curriculum",
  ],
  authors: [{ name: "Tattva Team" }],
  openGraph: {
    title: "Tattva — Open Learning Infrastructure",
    description:
      "India's open-source, NCERT-aligned learning platform. Free, structured, and world-class education for every learner.",
    type: "website",
    locale: "en_IN",
    siteName: "Tattva",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tattva — Open Learning Infrastructure",
    description:
      "India's open-source, NCERT-aligned learning platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
