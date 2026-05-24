export default function ApiInfoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
            त
          </div>
          <h1 className="text-3xl font-bold text-white">Tattva API</h1>
          <p className="mt-2 text-gray-400">
            Open Learning Infrastructure — API Server
          </p>
        </div>

        {/* API Info Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Service Information
            </h2>
            <span className="rounded-full bg-emerald-900/50 px-3 py-1 text-xs font-medium text-emerald-400">
              ● Operational
            </span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Version", value: "0.1.0" },
              { label: "Environment", value: process.env.NODE_ENV ?? "development" },
              { label: "API Base", value: "/api" },
              { label: "Health Check", value: "/api/health" },
              { label: "Docs", value: "/api/docs" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0 last:pb-0"
              >
                <span className="text-sm text-gray-400">{item.label}</span>
                <code className="rounded-md bg-gray-800 px-2 py-0.5 text-sm text-indigo-400">
                  {item.value}
                </code>
              </div>
            ))}
          </div>
        </div>

        {/* Available Endpoints */}
        <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">
            Available Endpoints
          </h2>
          <div className="space-y-2">
            {[
              { method: "GET", path: "/api/health", description: "Health check" },
              { method: "GET", path: "/api/v1/subjects", description: "List subjects" },
              { method: "GET", path: "/api/v1/lessons", description: "List lessons" },
              { method: "GET", path: "/api/v1/users/me", description: "Current user" },
            ].map((endpoint) => (
              <div
                key={endpoint.path}
                className="flex items-center gap-3 rounded-lg border border-gray-800 px-4 py-2"
              >
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    endpoint.method === "GET"
                      ? "bg-emerald-900/50 text-emerald-400"
                      : "bg-blue-900/50 text-blue-400"
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="text-sm text-gray-300">{endpoint.path}</code>
                <span className="ml-auto text-xs text-gray-500">
                  {endpoint.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-600">
          Tattva API &middot; Open Source under MIT License
        </p>
      </div>
    </div>
  );
}
