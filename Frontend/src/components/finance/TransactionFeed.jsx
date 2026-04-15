import { ReceiptIndianRupee, TrendingUp, Trash2 } from "lucide-react";
import {
  formatCurrency,
  formatDisplayDate,
  getAdaptiveValueTextClass,
} from "../../utils/financeUtils";

const iconMap = {
  income: TrendingUp,
  expense: ReceiptIndianRupee,
};

const colorMap = {
  income: {
    card: "bg-teal-50 text-teal-700",
    amount: "text-teal-600",
  },
  expense: {
    card: "bg-orange-50 text-orange-700",
    amount: "text-orange-600",
  },
};

const TransactionFeed = ({
  title,
  subtitle,
  items,
  type,
  action,
  emptyLabel,
}) => {
  return (
    <article className="flex h-full flex-col rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>

        {action}
      </div>

      {items.length === 0 ? (
        <div className="grid min-h-[220px] flex-1 place-items-center rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          {items.map((item) => {
            const Icon = iconMap[item.type || type] || ReceiptIndianRupee;
            const colors = colorMap[item.type || type] || colorMap.income;
            const amountLabel = `${item.type === "expense" || type === "expense" ? "-" : "+"}${formatCurrency(item.amount)}`;
            const amountSizeClass = getAdaptiveValueTextClass(amountLabel, {
              defaultSize: "text-lg sm:text-2xl",
              longSize: "text-base sm:text-xl",
              extraLongSize: "text-sm sm:text-lg",
              ultraLongSize: "text-xs sm:text-base",
            });

            return (
              <div
                key={item._id || item.id}
                className="flex items-center justify-between gap-3 rounded-[24px] border border-slate-100 px-4 py-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                  <div className={`shrink-0 rounded-2xl p-3 ${colors.card}`}>
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                      {item.description}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {`${formatDisplayDate(item.date)} | ${item.category}`}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <p
                    className={`shrink-0 whitespace-nowrap text-right tabular-nums font-bold leading-none ${amountSizeClass} ${colors.amount}`}
                  >
                    {amountLabel}
                  </p>

                  {item.onDelete ? (
                    <button
                      type="button"
                      onClick={item.onDelete}
                      className="rounded-2xl border border-slate-200 p-2.5 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
};

export default TransactionFeed;
