import { getAdaptiveValueTextClass } from "../../utils/financeUtils";

const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const createArcPath = (value, radius = 72) => {
  const limitedValue = Math.min(Math.max(value, 0), 100);
  const start = polarToCartesian(100, 100, radius, 0);
  const end = polarToCartesian(100, 100, radius, limitedValue * 1.8);
  const largeArcFlag = limitedValue > 50 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
};

const GaugeCard = ({ title, amount, percent, color, footer }) => {
  const amountClassName = getAdaptiveValueTextClass(amount, {
    defaultSize: "text-[2rem]",
    longSize: "text-[1.7rem]",
    extraLongSize: "text-[1.45rem]",
    ultraLongSize: "text-xl",
  });

  return (
    <article className="rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
      <div className="text-center">
        <p className="text-2xl font-bold" style={{ color }}>
          {title}
        </p>

        <svg viewBox="0 0 200 140" className="mx-auto mt-4 h-40 w-full max-w-[240px]">
          <path
            d={createArcPath(100)}
            fill="none"
            stroke="#edf2f7"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d={createArcPath(percent)}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
          />
        </svg>

        <p className={`mx-auto max-w-full break-words font-bold leading-tight text-slate-900 ${amountClassName}`}>
          {amount}
        </p>
        <p className="mt-2 text-sm text-slate-500">{footer}</p>
      </div>
    </article>
  );
};

export default GaugeCard;
