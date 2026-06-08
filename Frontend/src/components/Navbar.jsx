import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  // Initialize theme from localStorage (defaulting to dark as requested)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between w-full">
      <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-indigo-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 14.15v4.25c0 .596-.237 1.168-.66 1.59-.422.424-.994.66-1.59.66H6c-.596 0-1.168-.236-1.59-.66-.424-.422-.66-.994-.66-1.59v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 14.15m16.5 0V9.75A2.25 2.25 0 0017.25 7.5H6.75A2.25 2.25 0 004.5 9.75v4.4m15 0a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 14.15M7.5 7.5V4.5a2.25 2.25 0 012.25-2.25h4.5A2.25 2.25 0 0116.5 4.5v3"
          ></path>
        </svg>
        <span>JobTracker</span>
      </h2>

      <div className="flex items-center gap-4">
        {/* Modern Theme Toggle Switch */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 hover:bg-slate-50 hover:dark:bg-slate-900 hover:text-slate-800 hover:dark:text-slate-200 transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.4 12.4l1.58 1.58M3 12h2.25m13.5 0H21m-16.78 6.78l1.58-1.58M18.36 5.64l1.58-1.58M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
              ></path>
            </svg>
          )}
        </button>

        {/* Premium Animated Rotating Border Logout Button */}
        <button
          onClick={handleLogout}
          className="relative p-[1.5px] bg-slate-200 dark:bg-slate-800 rounded-xl overflow-hidden hover:bg-transparent transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
        >
          {/* Conic Gradient rotating spin layer on hover */}
          <span className="absolute -inset-10 bg-[conic-gradient(from_0deg,#6366f1,#a855f7,#06b6d4,#6366f1)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_2.5s_linear_infinite] transition-opacity duration-300 -z-10"></span>

          {/* Mask inner text */}
          <span className="relative block px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 rounded-[11px] group-hover:text-slate-900 group-hover:dark:text-white transition-colors duration-300">
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;