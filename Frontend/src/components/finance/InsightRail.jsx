import { ReceiptIndianRupee } from "lucide-react";
import TransactionFeed from "./TransactionFeed";
import {
  formatCurrency,
  getAdaptiveValueTextClass,
} from "../../utils/financeUtils";

const InsightRail = ({ recentTransactions, expenseDistribution }) => {
  return (
    <div className="grid content-start gap-6">
      <TransactionFeed
        title="Recent Transactions"
        subtitle="Transactions are stacked by date, newest first."
        items={recentTransactions}
        emptyLabel="Recent transactions will appear here."
      />

      <article className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
        <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
          <ReceiptIndianRupee className="text-sky-500" size={24} />
          Spending by Category
        </h2>

        <div className="mt-6 grid gap-4">
          {expenseDistribution.slice(0, 5).map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{item.category}</p>
                <p className="text-sm text-slate-500">{item.percent}% of spending</p>
              </div>
              <p
                className={`max-w-[42%] break-words text-right font-bold leading-tight text-slate-900 ${getAdaptiveValueTextClass(formatCurrency(item.amount), {
                  defaultSize: "text-base sm:text-lg",
                  longSize: "text-sm sm:text-base",
                  extraLongSize: "text-sm",
                  ultraLongSize: "text-xs sm:text-sm",
                })}`}
              >
                {formatCurrency(item.amount)}
              </p>
            </div>
          ))}

          {expenseDistribution.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
              Category totals will show up once expenses are added.
            </div>
          ) : null}
        </div>
      </article>
    </div>
  );
};

export default InsightRail;
