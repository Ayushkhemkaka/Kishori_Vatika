"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
function AnalyticsCharts({
  chartData,
  offerData
}) {
  return <div className="space-y-8">
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
        <h2 className="mb-4 text-sm font-medium text-amber-100">
          Visits & unique sessions (last 30 days)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
    dataKey="date"
    tick={{ fill: "#94a3b8", fontSize: 11 }}
    tickFormatter={(v) => v.slice(5)}
  />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <Tooltip
    contentStyle={{
      backgroundColor: "#0f172a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px"
    }}
    labelStyle={{ color: "#fcd34d" }}
    formatter={(value) => [value ?? 0, ""]}
    labelFormatter={(label) => `Date: ${label}`}
  />
              <Line
    type="monotone"
    dataKey="visits"
    stroke="#fbbf24"
    name="Visits"
    strokeWidth={2}
  />
              <Line
    type="monotone"
    dataKey="uniqueSessions"
    stroke="#34d399"
    name="Unique sessions"
    strokeWidth={2}
  />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {offerData.length > 0 && <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
          <h2 className="mb-4 text-sm font-medium text-amber-100">
            Offer clicks (last 30 days)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
    data={offerData}
    margin={{ top: 5, right: 20, left: 5, bottom: 60 }}
  >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
    dataKey="title"
    tick={{ fill: "#94a3b8", fontSize: 10 }}
    angle={-45}
    textAnchor="end"
    height={60}
  />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
    contentStyle={{
      backgroundColor: "#0f172a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "8px"
    }}
  />
                <Bar dataKey="clicks" fill="#fbbf24" name="Clicks" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>}
    </div>;
}
export { AnalyticsCharts };
