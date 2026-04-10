import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, LockKeyhole, X } from "lucide-react";
import { useEffect, useState } from "react";

const PasswordModal = ({ isOpen, isWorking, onClose, onSave }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [formValues, setFormValues] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isOpen) {
      setMessage("");
      setFormValues({
        password: "",
        confirmPassword: "",
      });
    }
  }, [isOpen]);

  const updateField = (field, value) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (formValues.password.length < 8) {
      setMessage("Password should be at least 8 characters long.");
      return;
    }

    if (formValues.password !== formValues.confirmPassword) {
      setMessage("Both password fields should match.");
      return;
    }

    const response = await onSave({ password: formValues.password });

    if (!response.success) {
      setMessage(response.message);
      return;
    }

    setFormValues({ password: "", confirmPassword: "" });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            className="w-full max-w-xl overflow-hidden rounded-[30px] bg-white shadow-[0_40px_80px_rgba(15,23,42,0.24)]"
          >
            <div className="bg-gradient-to-r from-teal-400 to-emerald-500 p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">Change Password</h2>
                  <p className="mt-2 text-sm text-white/85">
                    Keep your account secure with a new password.
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

            <form onSubmit={handleSubmit} className="grid gap-5 p-6">
              {["password", "confirmPassword"].map((field) => (
                <label key={field} className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {field === "password" ? "New Password" : "Confirm Password"}
                  </span>
                  <div className="flex h-14 items-center gap-3 rounded-2xl border border-slate-200 px-4">
                    <LockKeyhole size={18} className="text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formValues[field]}
                      onChange={(event) => updateField(field, event.target.value)}
                      className="w-full outline-none"
                      placeholder={
                        field === "password"
                          ? "Create a strong password"
                          : "Confirm your new password"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="text-slate-500"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
              ))}

              {message ? (
                <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {message}
                </p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-3">
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
                  className="rounded-2xl bg-teal-500 px-6 py-3 font-semibold text-white transition hover:bg-teal-600"
                >
                  {isWorking ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default PasswordModal;
