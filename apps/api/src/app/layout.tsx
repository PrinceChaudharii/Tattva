import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tattva API",
  description: "Tattva Learning Platform API Server",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApiLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 font-mono text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
