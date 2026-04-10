import { useId } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "../../utils/financeUtils";

const normalizeChartData = (points = []) =>
  points.map((point, index) => ({
    day: point.day ?? Number(point.label ?? index + 1),
    amount: Number(point.amount ?? point.value ?? 0),
  }));

const TooltipCard = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const amount = payload[0]?.value ?? 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-[0_18px_38px_rgba(15,23,42,0.12)]">
      <p className="text-sm font-semibold text-slate-900">Day {label}</p>
      <p className="mt-1 text-base font-bold text-emerald-600">{formatCurrency(amount)}</p>
    </div>
  );
};

const TrendChart = ({
  title,
  subtitle,
  points,
  accent = "#10b981",
  emptyLabel = "No records yet",
}) => {
  const gradientId = useId();
  const chartData = normalizeChartData(points);
  const maxValue = Math.max(...chartData.map((point) => point.amount), 0);

  return (
    <article className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {maxValue === 0 ? (
        <div className="grid min-h-[280px] place-items-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="h-[320px] overflow-hidden rounded-[24px] border border-slate-100 bg-white p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 12, left: 4, bottom: 4 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#e2e8f0"
                strokeDasharray="3 6"
                vertical={false}
                opacity={0.75}
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                width={72}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={formatCompactCurrency}
              />

              <Tooltip
                content={<TooltipCard />}
                cursor={{ stroke: accent, strokeDasharray: "4 4", opacity: 0.45 }}
              />

              <Area
                type="monotone"
                dataKey="amount"
                stroke={accent}
                fill={`url(#${gradientId})`}
                strokeWidth={3}
                animationDuration={1500}
                animationEasing="ease-in-out"
                dot={{ r: 3, fill: accent, stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{
                  r: 7,
                  fill: accent,
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
};

export default TrendChart;
