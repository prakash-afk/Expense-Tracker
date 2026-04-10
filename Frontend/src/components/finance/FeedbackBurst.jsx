import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Sparkles, TrendingDown } from "lucide-react";
import { useEffect } from "react";

const incomeParticles = Array.from({ length: 10 }, (_, index) => index);
const expenseParticles = Array.from({ length: 8 }, (_, index) => index);
const warningParticles = Array.from({ length: 8 }, (_, index) => index);

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
    }, feedback.type === "warning" ? 3600 : 2600);

    return () => clearTimeout(timer);
  }, [feedback.open, feedback.type, onClose]);

  const isIncome = feedback.type === "income";
  const isWarning = feedback.type === "warning";
  const cardClasses = isIncome
    ? "border-teal-100 bg-white"
    : isWarning
      ? "border-amber-100 bg-white"
      : "border-orange-100 bg-white";
  const barClasses = isIncome
    ? "bg-gradient-to-r from-teal-400 to-emerald-500"
    : isWarning
      ? "bg-gradient-to-r from-amber-400 to-orange-500"
      : "bg-gradient-to-r from-orange-400 to-rose-500";
  const iconClasses = isIncome
    ? "bg-teal-50 text-teal-600"
    : isWarning
      ? "bg-amber-50 text-amber-600"
      : "bg-orange-50 text-orange-600";

  return (
    <AnimatePresence>
      {feedback.open ? (
        <motion.div
          key={`${feedback.type}-${feedback.title}`}
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={
            isWarning
              ? { opacity: 1, y: 0, scale: 1, x: [0, -5, 5, -3, 0] }
              : { opacity: 1, y: 0, scale: 1 }
          }
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed left-4 right-4 top-24 z-[70] w-auto sm:left-auto sm:right-6 sm:top-28 sm:w-full sm:max-w-sm"
        >
          <div className={`relative overflow-hidden rounded-[28px] border px-5 py-5 shadow-[0_30px_60px_rgba(15,23,42,0.18)] ${cardClasses}`}>
            <div className={`absolute inset-x-0 top-0 h-1.5 ${barClasses}`} />

            {isIncome ? (
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
            ) : isWarning ? (
              <div className="pointer-events-none absolute inset-0">
                <motion.div
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-100/70"
                  animate={{ scale: [0.9, 1.08, 0.94], opacity: [0.45, 0.85, 0.45] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                {warningParticles.map((particle) => (
                  <motion.span
                    key={particle}
                    className="absolute h-2.5 w-2.5 rounded-full bg-amber-300/80"
                    style={{
                      left: `${14 + particle * 8}%`,
                      top: `${24 + (particle % 3) * 14}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.25, 0.9, 0.25],
                      scale: [0.8, 1.15, 0.8],
                    }}
                    transition={{
                      duration: 1.4,
                      delay: particle * 0.06,
                      repeat: Infinity,
                      ease: "easeInOut",
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
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClasses}`}>
                {isIncome ? (
                  <Sparkles size={22} />
                ) : isWarning ? (
                  <AlertTriangle size={22} />
                ) : (
                  <TrendingDown size={22} />
                )}
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
