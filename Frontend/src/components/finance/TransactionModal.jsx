import { AnimatePresence, motion as Motion } from "framer-motion";
import { CalendarDays, IndianRupee, Tag, X } from "lucide-react";
import { useRef, useState } from "react";
import {
  expenseCategories,
  formatConsistentDateField,
  formatInputDate,
  incomeCategories,
} from "../../utils/financeUtils";

const modalMotion = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 14,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const themes = {
  income: {
    action: "Add Income",
    accent: "from-teal-400 to-emerald-500",
    button: "bg-teal-500 hover:bg-teal-600",
  },
  expense: {
    action: "Add Expense",
    accent: "from-orange-400 to-amber-500",
    button: "bg-orange-500 hover:bg-orange-600",
  },
};

const createDefaultFormValues = (activeType, todayInputDate) => ({
  description: "",
  amount: "",
  category: activeType === "income" ? "Salary" : "Food",
  date: todayInputDate,
});

const TransactionForm = ({
  activeType,
  categories,
  theme,
  isWorking,
  onClose,
  onSubmit,
  allowTypeSwitch,
  onTypeChange,
}) => {
  const dateInputRef = useRef(null);
  const todayInputDate = formatInputDate(new Date());
  const [message, setMessage] = useState("");
  const [formValues, setFormValues] = useState(() =>
    createDefaultFormValues(activeType, todayInputDate),
  );

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]:
        field === "date" && value > todayInputDate
          ? todayInputDate
          : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const response = await onSubmit({
      ...formValues,
      amount: Number(formValues.amount),
    });

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    onClose();
  };

  const openDatePicker = () => {
    if (dateInputRef.current?.showPicker) {
      dateInputRef.current.showPicker();
      return;
    }

    dateInputRef.current?.focus();
    dateInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 p-6">
      {allowTypeSwitch ? (
        <div className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Type</span>
          <div className="grid grid-cols-2 gap-3">
            {["income", "expense"].map((itemType) => {
              const isActive = activeType === itemType;

              return (
                <button
                  key={itemType}
                  type="button"
                  onClick={() => onTypeChange?.(itemType)}
                  className={`rounded-2xl px-4 py-3 text-base font-semibold transition ${
                    isActive
                      ? itemType === "income"
                        ? "bg-teal-500 text-white"
                        : "bg-orange-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {itemType === "income" ? "Income" : "Expense"}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Description</span>
        <input
          type="text"
          value={formValues.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder={activeType === "income" ? "Salary, freelance payment..." : "Groceries, rent, bills..."}
          className="h-14 rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-400"
          required
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Amount</span>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 px-4">
            <IndianRupee size={18} className="text-slate-500" />
            <input
              type="number"
              min="1"
              step="0.01"
              value={formValues.amount}
              onChange={(event) => updateField("amount", event.target.value)}
              placeholder="0.00"
              className="w-full outline-none"
              required
            />
          </div>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold text-slate-700">Category</span>
          <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 px-4">
            <Tag size={18} className="text-slate-500" />
            <select
              value={formValues.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="w-full bg-transparent outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-slate-700">Date</span>
        <div
          className="relative flex h-14 items-center gap-3 rounded-2xl border border-slate-200 px-4"
          onClick={openDatePicker}
        >
          <CalendarDays size={18} className="text-slate-500" />
          <input
            type="text"
            value={formatConsistentDateField(formValues.date)}
            readOnly
            placeholder="MM/DD/YYYY"
            className="w-full cursor-pointer bg-transparent outline-none"
          />
          <input
            ref={dateInputRef}
            type="date"
            value={formValues.date}
            onChange={(event) => updateField("date", event.target.value)}
            max={todayInputDate}
            className="pointer-events-none absolute inset-0 opacity-0"
            tabIndex={-1}
            required
          />
        </div>
      </label>

      {message ? (
        <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {message}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isWorking}
          className={`rounded-2xl px-6 py-3 font-semibold text-white transition ${theme.button}`}
        >
          {isWorking ? "Saving..." : theme.action}
        </button>
      </div>
    </form>
  );
};

const TransactionModal = ({
  isOpen,
  type,
  isWorking,
  onClose,
  onSubmit,
  allowTypeSwitch = false,
  onTypeChange,
}) => {
  const activeType = type;
  const categories = activeType === "income" ? incomeCategories : expenseCategories;
  const theme = themes[activeType];

  return (
    <AnimatePresence>
      {isOpen ? (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm"
        >
          <Motion.div
            variants={modalMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl overflow-hidden rounded-[30px] bg-white shadow-[0_40px_80px_rgba(15,23,42,0.24)]"
          >
              <div className={`bg-gradient-to-r ${theme.accent} p-6 text-white`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">{theme.action}</h2>
                  <p className="mt-2 text-sm text-white/85">
                    Save the transaction and the tracker will refresh automatically.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <TransactionForm
              key={activeType}
              activeType={activeType}
              categories={categories}
              theme={theme}
              isWorking={isWorking}
              onClose={onClose}
              onSubmit={onSubmit}
              allowTypeSwitch={allowTypeSwitch}
              onTypeChange={onTypeChange}
            />
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default TransactionModal;
