export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Bonus",
  "Investment",
  "Rental",
  "Gift",
  "Other",
];

export const expenseCategories = [
  "Food",
  "Housing",
  "Transport",
  "Shopping",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Education",
  "Travel",
  "Other",
];

export const timeRangeOptions = ["daily", "weekly", "monthly", "yearly"];

export const formatCurrency = (value, options = {}) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 0,
  }).format(amount);
};

export const formatCurrencyWithDecimals = (value) =>
  formatCurrency(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatCompactCurrency = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
};

export const getAdaptiveValueTextClass = (
  value,
  {
    defaultSize = "text-xl sm:text-2xl",
    longSize = "text-lg sm:text-xl",
    extraLongSize = "text-base sm:text-lg",
    ultraLongSize = "text-sm sm:text-base",
  } = {},
) => {
  const characterCount = String(value ?? "").replace(/\s+/g, "").length;

  if (characterCount >= 18) {
    return ultraLongSize;
  }

  if (characterCount >= 14) {
    return extraLongSize;
  }

  if (characterCount >= 10) {
    return longSize;
  }

  return defaultSize;
};

export const formatDisplayDate = (value) => {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

export const formatInputDate = (value) => {
  if (!value) {
    return new Date().toISOString().split("T")[0];
  }

  return new Date(value).toISOString().split("T")[0];
};

export const formatConsistentDateField = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

export const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const sortByNewest = (items = []) =>
  [...items].sort((first, second) => {
    const firstDate = new Date(first.date || first.createdAt).getTime();
    const secondDate = new Date(second.date || second.createdAt).getTime();

    return secondDate - firstDate;
  });

export const buildMonthlySeries = (items = [], typeKey) => {
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();

  const dailyTotals = Array.from({ length: daysInMonth }, (_, index) => ({
    label: String(index + 1),
    value: 0,
  }));

  items.forEach((item) => {
    const date = new Date(item.date);
    const itemMonth = date.getMonth();
    const itemYear = date.getFullYear();
    const now = new Date();

    if (itemMonth === now.getMonth() && itemYear === now.getFullYear()) {
      dailyTotals[date.getDate() - 1].value += Number(item.amount || 0);
    }
  });

  return dailyTotals.map((point) => ({
    ...point,
    type: typeKey,
  }));
};

export const getMonthLabel = () =>
  new Intl.DateTimeFormat("en-IN", { month: "long" }).format(new Date());

export const createEmptyOverview = (kind) => ({
  total: 0,
  average: 0,
  transactions: 0,
  recentTransactions: [],
  kind,
});

export const clampPercent = (value) => Math.min(Math.max(Number(value || 0), 0), 100);

export const getRangeBounds = (range = "monthly", referenceDate = new Date()) => {
  const now = new Date(referenceDate);
  let start;
  let end;

  switch (range) {
    case "daily":
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case "weekly":
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case "yearly":
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    case "monthly":
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
  }

  return { start, end };
};

export const getSpendingWarning = (monthlyIncome, totalExpense) => {
  const income = Number(monthlyIncome || 0);
  const expense = Number(totalExpense || 0);

  if (income <= 0) {
    if (expense > 0) {
      return {
        level: "CRITICAL",
        percentage: 100,
      };
    }

    return {
      level: "SAFE",
      percentage: 0,
    };
  }

  const percentage = (expense / income) * 100;

  if (percentage >= 95) {
    return { level: "CRITICAL", percentage };
  }

  if (percentage >= 85) {
    return { level: "HIGH", percentage };
  }

  if (percentage >= 70) {
    return { level: "MEDIUM", percentage };
  }

  return { level: "SAFE", percentage };
};

export const filterTransactionsByRange = (items = [], range = "monthly") => {
  const { start, end } = getRangeBounds(range);

  return items.filter((item) => {
    const date = new Date(item.date);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    return date >= start && date <= end;
  });
};

export const downloadTransactionsCsv = (items, filename) => {
  const headers = ["Description", "Category", "Date", "Amount", "Type"];
  const rows = items.map((item) => [
    item.description,
    item.category,
    formatInputDate(item.date),
    item.amount,
    item.type,
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
