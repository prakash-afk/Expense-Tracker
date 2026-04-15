import {
  formatCompactCurrency,
  getAdaptiveValueTextClass,
} from "../../utils/financeUtils";

const palette = ["#0f9f76", "#12b7d6", "#f97316", "#8b5cf6", "#ef4444", "#0ea5e9", "#22c55e"];

const DonutChart = ({ title, subtitle, items }) => {
  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const segments = items.reduce((result, item, index) => {
    const amount = Number(item.amount || 0);
    const segmentLength = total === 0 ? 0 : (amount / total) * circumference;
    const previousOffset = result.length
      ? result[result.length - 1].strokeOffsetBase + result[result.length - 1].segmentLength
      : 0;

    result.push({
      category: item.category,
      color: palette[index % palette.length],
      dashArray: `${segmentLength} ${circumference}`,
      strokeDashoffset: -previousOffset,
      strokeOffsetBase: previousOffset,
      segmentLength,
    });

    return result;
  }, []);

  return (
    <article className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      {items.length === 0 || total === 0 ? (
        <div className="grid min-h-[260px] place-items-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 text-slate-500">
          No expense categories yet.
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="grid place-items-center">
            <svg viewBox="0 0 220 220" className="h-72 w-72 -rotate-90">
              <circle
                cx="110"
                cy="110"
                r={radius}
                fill="none"
                stroke="#edf2f7"
                strokeWidth="28"
              />

              {segments.map((segment) => (
                <circle
                  key={segment.category}
                  cx="110"
                  cy="110"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="28"
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.strokeDashoffset}
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>

          <div className="grid content-start gap-3">
            {items.map((item, index) => (
              <div
                key={item.category}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: palette[index % palette.length] }}
                  />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{item.category}</p>
                    <p className="text-sm text-slate-500">{item.percent}% of expenses</p>
                  </div>
                </div>

                <span
                  className={`max-w-[42%] break-words text-right font-semibold leading-tight text-slate-900 ${getAdaptiveValueTextClass(formatCompactCurrency(item.amount), {
                    defaultSize: "text-base",
                    longSize: "text-sm",
                    extraLongSize: "text-sm",
                    ultraLongSize: "text-xs",
                  })}`}
                >
                  {formatCompactCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
};

export default DonutChart;
