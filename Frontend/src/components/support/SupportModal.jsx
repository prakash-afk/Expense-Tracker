import emailjs from "@emailjs/browser";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ChevronDown, Headset, Mail, MessageSquareText, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";

const SERVICE_ID = "service_qc01axc";
const TEMPLATE_ID = "template_sl2mfup";
const PUBLIC_KEY = "Tknb3kM3AlkFAQPv9";

const faqItems = [
  {
    question: "How do I add income?",
    answer:
      "Open the Income page or use the Add Transaction button on the dashboard, choose Income, fill in the details, and save it.",
  },
  {
    question: "How do I add an expense?",
    answer:
      "Open the Expenses page or use Add Transaction, switch the type to Expense, enter the amount, category, date, and save it.",
  },
  {
    question: "How do I delete a transaction?",
    answer:
      "Go to the Income or Expenses page, find the transaction in the list, and click the delete icon on the right side of that row.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Your tracker data is stored behind authenticated API requests. Only logged-in users can access their own records in the app.",
  },
  {
    question: "How do I change my password?",
    answer:
      "Open the Profile page and use the password change option in the Account Security section.",
  },
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const overlayMotion = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelMotion = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 12,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const SupportModal = ({ isOpen, onClose, user }) => {
  const [formValues, setFormValues] = useState({
    name: user?.name || "",
    email: user?.email || "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState({
    type: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!formValues.name.trim()) {
      nextErrors.name = "Full name is required.";
    }

    if (!formValues.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(formValues.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formValues.message.trim()) {
      nextErrors.message = "Message is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState({ type: "", message: "" });

    if (!validate()) {
      return;
    }

    setIsSending(true);

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: formValues.name.trim(),
          email: formValues.email.trim(),
          message: formValues.message.trim(),
        },
        PUBLIC_KEY,
      );

      setSubmitState({
        type: "success",
        message: "Message sent! We'll get back to you soon.",
      });
      setFormValues({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Support message failed:", error);
      setSubmitState({
        type: "error",
        message: "Something went wrong while sending your message. Please try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex((current) => (current === index ? -1 : index));
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <Motion.div
          className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
          variants={overlayMotion}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Motion.div
            className="w-full max-w-4xl overflow-hidden rounded-[32px] bg-white shadow-[0_40px_100px_rgba(15,23,42,0.25)]"
            variants={panelMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-6 text-white sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white/95">
                    <Headset size={16} />
                    Support
                  </div>
                  <h2 className="mt-4 text-3xl font-bold">Contact Support</h2>
                  <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
                    Send us your question and check the quick FAQ below before you wait for a reply.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/20"
                  aria-label="Close support modal"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="grid max-h-[80vh] gap-6 overflow-y-auto p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr]">
              <section className="rounded-[28px] border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6">
                <h3 className="text-2xl font-bold text-slate-900">Send us a message</h3>
                <p className="mt-2 text-sm text-slate-500">
                  We usually respond with guidance on account, transactions, or dashboard issues.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">Full Name</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                      <UserRound size={18} className="text-slate-400" />
                      <input
                        type="text"
                        value={formValues.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        placeholder="Your full name"
                        className="h-14 w-full bg-transparent outline-none"
                      />
                    </div>
                    {errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">Email Address</span>
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4">
                      <Mail size={18} className="text-slate-400" />
                      <input
                        type="email"
                        value={formValues.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        placeholder="you@example.com"
                        className="h-14 w-full bg-transparent outline-none"
                      />
                    </div>
                    {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold text-slate-700">Message</span>
                    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                      <MessageSquareText size={18} className="mt-1 shrink-0 text-slate-400" />
                      <textarea
                        rows="5"
                        value={formValues.message}
                        onChange={(event) => updateField("message", event.target.value)}
                        placeholder="Tell us what you need help with..."
                        className="w-full resize-none bg-transparent outline-none"
                      />
                    </div>
                    {errors.message ? <p className="text-sm text-red-600">{errors.message}</p> : null}
                  </label>

                  {submitState.message ? (
                    <p
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        submitState.type === "success"
                          ? "border-teal-100 bg-teal-50 text-teal-700"
                          : "border-red-100 bg-red-50 text-red-600"
                      }`}
                    >
                      {submitState.message}
                    </p>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:border-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSending}
                      className="rounded-2xl bg-teal-500 px-6 py-3 font-semibold text-white shadow-[0_16px_34px_rgba(16,185,129,0.24)] transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSending ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </section>

              <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 sm:p-6">
                <h3 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Quick answers to the most common workflow questions in this tracker.
                </p>

                <div className="mt-6 grid gap-3">
                  {faqItems.map((item, index) => {
                    const isOpenItem = openFaqIndex === index;

                    return (
                      <div
                        key={item.question}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                        >
                          <span className="font-semibold text-slate-900">{item.question}</span>
                          <Motion.span
                            animate={{ rotate: isOpenItem ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0 text-slate-500"
                          >
                            <ChevronDown size={18} />
                          </Motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpenItem ? (
                            <Motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-slate-200 px-4 py-4 text-sm leading-6 text-slate-600">
                                {item.answer}
                              </div>
                            </Motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SupportModal;
