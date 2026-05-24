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
    default: "Tattva Docs — Documentation",
    template: "%s | Tattva Docs",
  },
  description:
    "Comprehensive documentation for the Tattva open learning platform. Guides, API references, and contributor resources.",
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans antialiased">
        {/* ── Top Bar ─────────────────────────────────────── */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
                त
              </div>
              <span className="text-lg font-bold text-gray-900">Tattva</span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                Docs
              </span>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <a
                href="/getting-started"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Getting Started
              </a>
              <a
                href="/api-reference"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                API Reference
              </a>
              <a
                href="/guides"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Guides
              </a>
              <a
                href="/contributing"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Contributing
              </a>
            </nav>
            {/* Search placeholder */}
            <div className="flex h-8 w-56 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <span>Search docs…</span>
              <kbd className="ml-auto rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>
        </header>

        <div className="mx-auto flex max-w-7xl">
          {/* ── Sidebar ─────────────────────────────────────── */}
          <aside className="hidden w-64 shrink-0 border-r border-gray-100 lg:block">
            <nav className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Getting Started
                  </h4>
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="/getting-started/introduction"
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Introduction
                      </a>
                    </li>
                    <li>
                      <a
                        href="/getting-started/installation"
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Installation
                      </a>
                    </li>
                    <li>
                      <a
                        href="/getting-started/quick-start"
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Quick Start
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Architecture
                  </h4>
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="/architecture/overview"
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Overview
                      </a>
                    </li>
                    <li>
                      <a
                        href="/architecture/monorepo"
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Monorepo Structure
                      </a>
                    </li>
                    <li>
                      <a
                        href="/architecture/database"
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Database Design
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    API Reference
                  </h4>
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="/api-reference/rest"
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        REST Endpoints
                      </a>
                    </li>
                    <li>
                      <a
                        href="/api-reference/auth"
                        className="block rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        Authentication
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </aside>

          {/* ── Main Content ────────────────────────────────── */}
          <main className="min-w-0 flex-1 px-6 py-10 lg:px-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
