import { Mail, PencilLine, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import InsightRail from "../components/finance/InsightRail";
import PasswordModal from "../components/finance/PasswordModal";
import StatCard from "../components/finance/StatCard";
import TransactionFeed from "../components/finance/TransactionFeed";
import {
  formatCurrency,
  getInitials,
} from "../utils/financeUtils";

const Profile = ({ financeApp }) => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "success" });
  const [formValues, setFormValues] = useState({
    name: financeApp.user?.name || "Demo User",
    email: financeApp.user?.email || "aryan65@example.com",
  });

  useEffect(() => {
    setFormValues({
      name: financeApp.user?.name || "Demo User",
      email: financeApp.user?.email || "aryan65@example.com",
    });
  }, [financeApp.user]);

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    const response = await financeApp.updateProfile(formValues);
    setMessage({
      text: response.message,
      type: response.success ? "success" : "error",
    });
  };

  const summaryCards = [
    {
      label: "Monthly Income",
      value: formatCurrency(financeApp.dashboard.monthlyIncome),
      helper: "Current month",
      icon: <UserRound size={20} />,
      tone: "teal",
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(financeApp.dashboard.monthlyExpense),
      helper: "Current month",
      icon: <Mail size={20} />,
      tone: "orange",
    },
    {
      label: "Savings",
      value: formatCurrency(financeApp.dashboard.savings),
      helper: `${financeApp.dashboard.savingsRate}% saving rate`,
      icon: <ShieldCheck size={20} />,
      tone: "sky",
    },
  ];

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.9fr_1fr]">
        <div className="grid gap-6">
          <article className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
            <div className="bg-gradient-to-r from-cyan-500 to-emerald-600 px-6 py-12 text-center text-white">
              <div className="mx-auto grid h-28 w-28 place-items-center rounded-full border border-white/20 bg-white/12 text-3xl font-bold">
                {getInitials(formValues.name)}
              </div>
              <h1 className="mt-5 text-3xl font-bold sm:text-4xl">{formValues.name}</h1>
              <p className="mt-2 break-all text-base text-white/85 sm:text-lg">{formValues.email}</p>
            </div>

            <div className="grid gap-6 p-6 xl:grid-cols-[1.05fr_0.95fr]">
              <form
                onSubmit={handleProfileSubmit}
                className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                      <UserRound className="text-teal-600" size={24} />
                      Personal Information
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Update the name and email shown across your account.
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
                    <PencilLine size={16} />
                    Edit
                  </span>
                </div>

                <div className="grid gap-5">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">Full Name</span>
                    <input
                      type="text"
                      value={formValues.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      className="h-14 rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-400"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">Email Address</span>
                    <input
                      type="email"
                      value={formValues.email}
                      onChange={(event) => updateField("email", event.target.value)}
                      className="h-14 rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-teal-400"
                    />
                  </label>

                  {message.text ? (
                    <p
                      className={`rounded-2xl px-4 py-3 text-sm ${
                        message.type === "success"
                          ? "border border-teal-100 bg-teal-50 text-teal-700"
                          : "border border-red-100 bg-red-50 text-red-600"
                      }`}
                    >
                      {message.text}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={financeApp.isWorking}
                    className="rounded-2xl bg-teal-500 px-6 py-3.5 font-semibold text-white transition hover:bg-teal-600"
                  >
                    {financeApp.isWorking ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>

              <div className="grid gap-6">
                <div className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
                  <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 sm:text-3xl">
                    <ShieldCheck className="text-teal-600" size={24} />
                    Account Security
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Update your password whenever you want to tighten security.
                  </p>

                  <div className="mt-6 grid gap-4">
                    <button
                      type="button"
                      onClick={() => setIsPasswordModalOpen(true)}
                      className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
                    >
                      Change Password
                    </button>
                    <button
                      type="button"
                      onClick={financeApp.logout}
                      className="rounded-2xl bg-teal-500 px-5 py-3 font-semibold text-white transition hover:bg-teal-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                <section className="grid gap-4">
                  {summaryCards.map((card) => (
                    <StatCard key={card.label} {...card} />
                  ))}
                </section>
              </div>
            </div>
          </article>

          <TransactionFeed
            title="Your Recent Activity"
            subtitle="A quick profile-level look at the latest recorded transactions."
            items={financeApp.allTransactions.slice(0, 5)}
            emptyLabel="Your transactions will appear here after you start tracking."
          />
        </div>

        <InsightRail
          recentTransactions={financeApp.dashboard.recentTransactions}
          expenseDistribution={financeApp.dashboard.expenseDistribution}
        />
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        isWorking={financeApp.isWorking}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={financeApp.updateProfile}
      />
    </>
  );
};

export default Profile;
