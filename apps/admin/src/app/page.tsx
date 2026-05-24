export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* ── Stats Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Users",
            value: "52,847",
            change: "+12.5%",
            trend: "up" as const,
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            ),
            color: "indigo",
          },
          {
            title: "Active Lessons",
            value: "10,234",
            change: "+8.2%",
            trend: "up" as const,
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            ),
            color: "emerald",
          },
          {
            title: "Contributors",
            value: "523",
            change: "+24.1%",
            trend: "up" as const,
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            ),
            color: "amber",
          },
          {
            title: "Daily Active",
            value: "8,421",
            change: "-2.3%",
            trend: "down" as const,
            icon: (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            ),
            color: "rose",
          },
        ].map((stat) => {
          const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
            indigo: {
              bg: "bg-indigo-50",
              icon: "text-indigo-600",
              text: "text-indigo-600",
            },
            emerald: {
              bg: "bg-emerald-50",
              icon: "text-emerald-600",
              text: "text-emerald-600",
            },
            amber: {
              bg: "bg-amber-50",
              icon: "text-amber-600",
              text: "text-amber-600",
            },
            rose: {
              bg: "bg-rose-50",
              icon: "text-rose-600",
              text: "text-rose-600",
            },
          };
          const colors = colorMap[stat.color]!;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg} ${colors.icon}`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    {stat.icon}
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                vs. previous month
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Recent Activity & Quick Actions ─────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">
            Recent Activity
          </h2>
          <div className="mt-4 space-y-4">
            {[
              {
                action: "New lesson published",
                detail: "Physics — Chapter 12: Atoms",
                time: "2 min ago",
                type: "content",
              },
              {
                action: "User registration spike",
                detail: "142 new users in the last hour",
                time: "15 min ago",
                type: "users",
              },
              {
                action: "Content review completed",
                detail: "Mathematics — Grade 10, Chapter 5",
                time: "1 hour ago",
                type: "review",
              },
              {
                action: "Translation merged",
                detail: "Hindi translation for Biology Chapter 3",
                time: "3 hours ago",
                type: "translation",
              },
              {
                action: "Database backup completed",
                detail: "Automated daily backup — 2.3 GB",
                time: "6 hours ago",
                type: "system",
              },
            ].map((activity) => (
              <div
                key={activity.action}
                className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
              >
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.detail}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-base font-semibold text-gray-900">
            Quick Actions
          </h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Add New Lesson", href: "/admin/content/new" },
              { label: "Review Submissions", href: "/admin/content/review" },
              { label: "Manage Users", href: "/admin/users" },
              { label: "View Reports", href: "/admin/analytics" },
              { label: "System Settings", href: "/admin/settings" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {action.label}
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
