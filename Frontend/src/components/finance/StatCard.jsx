const toneStyles = {
  teal: "bg-teal-50 text-teal-700",
  cyan: "bg-cyan-50 text-cyan-700",
  orange: "bg-orange-50 text-orange-700",
  purple: "bg-violet-50 text-violet-700",
  rose: "bg-rose-50 text-rose-700",
  sky: "bg-sky-50 text-sky-700",
};

const StatCard = ({ icon, label, value, helper, tone = "teal", accent }) => {
  return (
    <article className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
        </div>

        <div className={`rounded-2xl p-3 ${toneStyles[tone] || toneStyles.teal}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {accent ? <span className={accent}>{helper}</span> : <span className="text-slate-500">{helper}</span>}
      </div>
    </article>
  );
};

export default StatCard;
