import { AnimatePresence, motion as Motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import FeedbackBurst from "./finance/FeedbackBurst";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import SupportModal from "./support/SupportModal";

const pageMotion = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

const Layout = ({ financeApp }) => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar
        user={financeApp.user}
        onLogout={financeApp.logout}
        onMenuToggle={() => setIsMobileMenuOpen((current) => !current)}
      />

      <Sidebar
        user={financeApp.user}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((current) => !current)}
        onLogout={financeApp.logout}
        onOpenSupport={() => setIsSupportOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <main className={`app-main ${isSidebarCollapsed ? "app-main-collapsed" : ""}`}>
        <AnimatePresence mode="wait">
          <Motion.div
            key={location.pathname}
            variants={pageMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            className="page-frame"
          >
            <Outlet />
          </Motion.div>
        </AnimatePresence>
      </main>

      <FeedbackBurst
        feedback={financeApp.feedback}
        onClose={financeApp.hideFeedback}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        user={financeApp.user}
      />
    </div>
  );
};

export default Layout;
