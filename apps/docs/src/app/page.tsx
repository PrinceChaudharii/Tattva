export default function DocsHomePage() {
  return (
    <div className="mx-auto max-w-3xl">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Tattva Documentation
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Everything you need to understand, use, and contribute to the Tattva
          open learning platform.
        </p>
      </div>

      {/* ── Quick Links ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          {
            title: "Getting Started",
            description:
              "Set up your development environment and run Tattva locally in minutes.",
            href: "/getting-started",
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
              />
            ),
          },
          {
            title: "Architecture",
            description:
              "Understand the monorepo structure, packages, and how everything fits together.",
            href: "/architecture",
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z"
              />
            ),
          },
          {
            title: "API Reference",
            description:
              "Complete reference for REST endpoints, authentication, and data models.",
            href: "/api-reference",
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            ),
          },
          {
            title: "Contributing",
            description:
              "Learn how to contribute content, code, or translations to Tattva.",
            href: "/contributing",
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            ),
          },
        ].map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="group rounded-xl border border-gray-200 p-6 transition-all hover:border-indigo-200 hover:bg-indigo-50/30"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 transition-colors group-hover:bg-indigo-200">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {link.icon}
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900">
              {link.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{link.description}</p>
          </a>
        ))}
      </div>

      {/* ── Quick Start Code ──────────────────────────────────── */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900">Quick Start</h2>
        <p className="mt-2 text-gray-600">
          Get Tattva running on your machine in under 5 minutes:
        </p>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-950">
          <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-2">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-gray-500">Terminal</span>
          </div>
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-300">
            <code>{`# Clone the repository
git clone https://github.com/tattva-edu/tattva.git
cd tattva

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local

# Start development servers
pnpm dev`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
