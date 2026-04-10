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

export const getInitials = (name = "User") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export const sortByNewest = (items = []) =>
  [...items].sort((first, second) => {
    const firstDate = new Date(first.createdAt || first.date).getTime();
    const secondDate = new Date(second.createdAt || second.date).getTime();

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
