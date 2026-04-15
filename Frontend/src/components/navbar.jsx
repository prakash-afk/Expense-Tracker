import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { getInitials } from "../utils/financeUtils";

const Navbar = ({ user, onLogout, onMenuToggle }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const displayName = user?.name || "User";
  const displayEmail = user?.email || "user@expensetracker.com";
  const initials = getInitials(displayName);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    onLogout?.();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-teal-200 hover:text-teal-600 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 rounded-2xl transition hover:opacity-90"
          >
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-cyan-50 to-emerald-50">
              <img src={logo} alt="Expense Tracker logo" className="h-9 w-9 object-contain" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                Expense Tracker
              </h1>
            </div>
          </button>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-teal-200"
          >
            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-lg font-bold text-white shadow-[0_12px_24px_rgba(20,184,166,0.24)]">
                {initials || <UserRound size={20} />}
              </div>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-[180px] truncate text-sm font-semibold text-slate-900">
                {displayName}
              </p>
              <p className="max-w-[220px] truncate text-xs text-slate-500">
                {displayEmail}
              </p>
            </div>

            <ChevronDown
              size={18}
              className={`text-slate-500 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isMenuOpen ? (
            <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_24px_48px_rgba(15,23,42,0.14)]">
              <div className="rounded-[20px] bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-lg font-bold text-white">
                    {initials || <UserRound size={20} />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{displayName}</p>
                    <p className="truncate text-sm text-slate-500">{displayEmail}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
                >
                  <UserRound size={18} />
                  <span className="font-medium">My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
