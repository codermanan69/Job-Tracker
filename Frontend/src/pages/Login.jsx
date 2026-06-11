import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";  

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.data.token
      );
      setToken(response.data.token);
      toast.success("Login successful!", {
        style: {
          background: "#0f172a",
          color: "#f1f5f9",
          border: "1px solid #1e293b",
        },
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Login Failed",
        {
          style: {
            background: "#0f172a",
            color: "#f1f5f9",
            border: "1px solid #1e293b",
          },
        }
      );
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center p-4 bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Custom CSS animations for background glows, floating, and card fade-in */}
      <style>
        {`
          @keyframes float-mascot {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-5px) rotate(0.8deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-float-hero {
            animation: float-mascot 4s ease-in-out infinite;
          }
          .animate-card-in {
            animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}
      </style>

      {/* Layered gradients for backing glow */}
      <div className="absolute right-1/4 top-1/4 w-96 h-96 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none"></div>
      <div className="absolute left-1/4 bottom-1/4 w-96 h-96 rounded-full bg-violet-600/5 blur-3xl pointer-events-none"></div>

      {/* UPPER CENTER: Logo and Title */}
      <div className="flex flex-col items-center gap-1.5 mb-1.5 z-10 animate-card-in">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg shadow-xs">
            <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .596-.237 1.168-.66 1.59-.422.424-.994.66-1.59.66H6c-.596 0-1.168-.236-1.59-.66-.424-.422-.66-.994-.66-1.59v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 14.15m16.5 0V9.75A2.25 2.25 0 0017.25 7.5H6.75A2.25 2.25 0 004.5 9.75v4.4m15 0a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 14.15M7.5 7.5V4.5a2.25 2.25 0 012.25-2.25h4.5A2.25 2.25 0 0116.5 4.5v3" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tight text-white">Job Tracker</span>
        </div>
      </div>

      {/* MID CENTER: Floating Robot Mascot */}
      <div className="z-10 animate-card-in mb-4">
        <svg className="w-24 h-24 drop-shadow-[0_8px_16px_rgba(139,92,246,0.25)] animate-float-hero" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="55" width="120" height="90" rx="28" fill="#1e1e2e" stroke="#8b5cf6" strokeWidth="5" />
          <rect x="48" y="63" width="104" height="74" rx="20" fill="#11111b" />
          
          <path d="M68 88L78 98L68 108" stroke="#a6e3a1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M122 108H138" stroke="#a6e3a1" strokeWidth="5" strokeLinecap="round" />
          <path d="M96 114C100 117 104 117 108 114" stroke="#a6e3a1" strokeWidth="3" strokeLinecap="round" />

          <path d="M48 58L32 30L64 54" fill="#1e1e2e" stroke="#8b5cf6" strokeWidth="4" strokeLinejoin="round" />
          <path d="M152 58L168 30L136 54" fill="#1e1e2e" stroke="#8b5cf6" strokeWidth="4" strokeLinejoin="round" />

          <rect x="58" y="85" width="30" height="20" rx="6" stroke="#f38ba8" strokeWidth="3.5" fill="none" />
          <rect x="112" y="85" width="30" height="20" rx="6" stroke="#f38ba8" strokeWidth="3.5" fill="none" />
          <line x1="88" y1="95" x2="112" y2="95" stroke="#f38ba8" strokeWidth="3.5" />

          <path d="M22 72L24 78L29 80L24 82L22 88L20 82L15 80L20 78L22 72Z" fill="#f9e2af" />
          <path d="M178 112L180 117L185 119L180 121L178 127L176 121L171 119L176 117L178 112Z" fill="#f9e2af" />

          <circle cx="100" cy="38" r="8" fill="#cba6f7" />

          <path d="M50 162H150L158 176H42L50 162Z" fill="#313244" stroke="#8b5cf6" strokeWidth="4" />
          <rect x="76" y="165" width="48" height="5" rx="2.5" fill="#bac2de" />
          <path d="M72 162L90 146H110L128 162H72Z" fill="url(#screen-glow-mascot-login)" opacity="0.3" />

          <defs>
            <linearGradient id="screen-glow-mascot-login" x1="100" y1="146" x2="100" y2="162" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* LOWER CENTER: Compact Login Card */}
      <div className="w-full max-w-sm bg-slate-900/45 backdrop-blur-lg border border-slate-800/80 p-6 rounded-2xl shadow-2xl z-10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)] animate-card-in opacity-0">
        <h2 className="text-lg font-black text-slate-100 tracking-tight text-left">
          Welcome back
        </h2>
        <p className="text-slate-400 text-[11px] mt-1 mb-4 text-left font-medium leading-relaxed">
          Enter your credentials to manage your job application pipeline.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 placeholder:text-slate-700 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none text-xs transition-all shadow-inner"
              required
            />
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-slate-100 placeholder:text-slate-700 focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none text-xs transition-all shadow-inner"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 mt-1 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold uppercase tracking-wider text-[10px] rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(99,102,241,0.25)] active:scale-97 cursor-pointer flex items-center justify-center gap-1.5"
          >
            Login
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800/60 text-center">
          <p className="text-slate-400 text-[11px] font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;