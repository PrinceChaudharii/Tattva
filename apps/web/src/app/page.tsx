export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Navigation ──────────────────────────────────────── */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-lg font-bold text-white">
              त
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Tattva
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="/subjects"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600"
            >
              Subjects
            </a>
            <a
              href="/explore"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600"
            >
              Explore
            </a>
            <a
              href="/about"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600"
            >
              About
            </a>
            <a
              href="/community"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-indigo-600"
            >
              Community
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* ── Hero Section ────────────────────────────────────── */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white">
          {/* Decorative background elements */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-indigo-100/40 blur-3xl" />
            <div className="absolute bottom-0 -left-20 h-[400px] w-[400px] rounded-full bg-amber-100/30 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 sm:pb-32 sm:pt-28 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
                </span>
                Open Source &amp; Free Forever
              </div>

              {/* Heading */}
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Learn with{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Clarity
                </span>
                ,<br />
                Powered by{" "}
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Tattva
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
                India&apos;s open-source, NCERT-aligned learning infrastructure.
                Structured lessons, interactive content, and world-class
                education — built by the community, for every learner.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href="/explore"
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30"
                >
                  Start Learning
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </a>
                <a
                  href="/contribute"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  Contribute on GitHub
                </a>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { label: "Subjects", value: "30+" },
                { label: "Lessons", value: "10,000+" },
                { label: "Contributors", value: "500+" },
                { label: "Learners", value: "50K+" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Section ───────────────────────────────── */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to learn — the right way
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Built on India&apos;s NCERT framework, designed for clarity and
                mastery.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "NCERT-Aligned",
                  description:
                    "Every lesson follows the NCERT curriculum framework, ensuring alignment with India's national education standards.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  ),
                },
                {
                  title: "Interactive Content",
                  description:
                    "Engage with interactive diagrams, quizzes, and exercises that make learning active rather than passive.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                    />
                  ),
                },
                {
                  title: "Open Source",
                  description:
                    "Community-driven and transparent. Anyone can contribute, review, and improve the content for millions of learners.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                    />
                  ),
                },
                {
                  title: "Multilingual",
                  description:
                    "Access content in Hindi, English, and regional languages. Education should have no language barrier.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
                    />
                  ),
                },
                {
                  title: "Progress Tracking",
                  description:
                    "Track your learning journey with detailed analytics, achievements, and personalized recommendations.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  ),
                },
                {
                  title: "Teacher Tools",
                  description:
                    "Empower educators with lesson planning, classroom analytics, and content customization tools.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                    />
                  ),
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 transition-all hover:border-indigo-100 hover:bg-indigo-50/30"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      {feature.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
                त
              </div>
              <span className="text-sm font-semibold text-gray-700">
                Tattva
              </span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Tattva. Open source under MIT
              License.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
