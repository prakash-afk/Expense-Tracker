import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, TrendingDown } from "lucide-react";
import { useEffect } from "react";

const incomeParticles = Array.from({ length: 10 }, (_, index) => index);
const expenseParticles = Array.from({ length: 8 }, (_, index) => index);

const FeedbackBurst = ({ feedback, onClose }) => {
  useEffect(() => {
    if (!feedback.open) {
      return undefined;
    }

    if (feedback.type === "income") {
      const colors = ["#14b8a6", "#22c55e", "#06b6d4", "#facc15", "#ffffff"];
      confetti({
        particleCount: 90,
        spread: 82,
        startVelocity: 42,
        origin: { x: 0.84, y: 0.22 },
        zIndex: 120,
        colors,
      });

      confetti({
        particleCount: 42,
        spread: 58,
        startVelocity: 32,
        origin: { x: 0.76, y: 0.18 },
        zIndex: 120,
        colors,
      });
    }

    const timer = setTimeout(() => {
      onClose();
    }, 2600);

    return () => clearTimeout(timer);
  }, [feedback.open, feedback.type, onClose]);

  return (
    <AnimatePresence>
      {feedback.open ? (
        <motion.div
          key={`${feedback.type}-${feedback.title}`}
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed left-4 right-4 top-24 z-[70] w-auto sm:left-auto sm:right-6 sm:top-28 sm:w-full sm:max-w-sm"
        >
          <div
            className={`relative overflow-hidden rounded-[28px] border px-5 py-5 shadow-[0_30px_60px_rgba(15,23,42,0.18)] ${
              feedback.type === "income"
                ? "border-teal-100 bg-white"
                : "border-orange-100 bg-white"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-1.5 ${
                feedback.type === "income"
                  ? "bg-gradient-to-r from-teal-400 to-emerald-500"
                  : "bg-gradient-to-r from-orange-400 to-rose-500"
              }`}
            />

            {feedback.type === "income" ? (
              <div className="pointer-events-none absolute inset-0">
                {incomeParticles.map((particle) => (
                  <motion.span
                    key={particle}
                    className="absolute h-2.5 w-2.5 rounded-full bg-teal-300/80"
                    style={{
                      left: `${10 + particle * 8}%`,
                      top: "72%",
                    }}
                    animate={{
                      y: [-6, -60 - particle * 4],
                      x: [0, particle % 2 === 0 ? 14 : -14],
                      opacity: [0, 1, 0],
                      scale: [0.6, 1.1, 0.7],
                    }}
                    transition={{
                      duration: 1.1,
                      delay: particle * 0.05,
                      repeat: 1,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="pointer-events-none absolute inset-0">
                {expenseParticles.map((particle) => (
                  <motion.span
                    key={particle}
                    className="absolute h-2 w-10 rounded-full bg-orange-200/70"
                    style={{
                      left: `${14 + particle * 9}%`,
                      top: `${10 + particle * 5}%`,
                    }}
                    animate={{
                      y: [0, 38 + particle * 3],
                      opacity: [0.8, 0],
                      rotate: [0, particle % 2 === 0 ? 8 : -8],
                    }}
                    transition={{
                      duration: 1.1,
                      delay: particle * 0.04,
                      repeat: 1,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative flex items-start gap-4">
              <div
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                  feedback.type === "income"
                    ? "bg-teal-50 text-teal-600"
                    : "bg-orange-50 text-orange-600"
                }`}
              >
                {feedback.type === "income" ? <Sparkles size={22} /> : <TrendingDown size={22} />}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{feedback.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{feedback.message}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default FeedbackBurst;
