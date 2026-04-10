import { timeRangeOptions } from "../../utils/financeUtils";

const labelMap = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

const RangeTabs = ({ value, onChange, accent = "teal", options = timeRangeOptions }) => {
  const activeStyles = {
    teal: "bg-teal-500 text-white shadow-[0_14px_28px_rgba(20,184,166,0.22)]",
    orange: "bg-orange-500 text-white shadow-[0_14px_28px_rgba(249,115,22,0.22)]",
  };

  return (
    <div className="inline-flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
      {options.map((option) => {
        const isActive = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? activeStyles[accent] || activeStyles.teal
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {labelMap[option] || option}
          </button>
        );
      })}
    </div>
  );
};

export default RangeTabs;
