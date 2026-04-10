import { formatCompactCurrency } from "../../utils/financeUtils";

const TrendChart = ({ title, subtitle, points, accent = "#14b8a6", emptyLabel = "No records yet" }) => {
  const width = 900;
  const height = 300;
  const padding = 36;
  const values = points.map((point) => point.value);
  const maxValue = Math.max(...values, 0);
  const safeMaxValue = maxValue > 0 ? maxValue : 1;

  const chartPoints = points.map((point, index) => {
    const x =
      padding +
      (index * (width - padding * 2)) / Math.max(points.length - 1, 1);
    const y =
      height - padding - (point.value / safeMaxValue) * (height - padding * 2);

    return { ...point, x, y };
  });

  const polyline = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");

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
        <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white p-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-[320px] w-full">
            {[0, 0.25, 0.5, 0.75, 1].map((step) => {
              const y = height - padding - step * (height - padding * 2);

              return (
                <g key={step}>
                  <line
                    x1={padding}
                    x2={width - padding}
                    y1={y}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 8"
                  />
                  <text x="0" y={y + 5} fill="#64748b" fontSize="13">
                    {formatCompactCurrency(step * safeMaxValue)}
                  </text>
                </g>
              );
            })}

            <polyline
              fill="none"
              stroke={accent}
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={polyline}
            />

            {chartPoints.map((point) => (
              <g key={point.label}>
                <circle cx={point.x} cy={point.y} r="6" fill={accent} />
                <text
                  x={point.x}
                  y={height - 6}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="12"
                >
                  {point.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </article>
  );
};

export default TrendChart;
