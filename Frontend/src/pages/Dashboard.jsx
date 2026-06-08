import { useEffect, useState } from "react";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationForm from "../components/ApplicationForm";
import Navbar from "../components/Navbar";
import API from "../services/api";
import EditApplicationModal from "../components/EditApplicationModal";
import { toast } from "react-hot-toast";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [editingApp, setEditingApp] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/applications/${id}`);

      toast.success("Application deleted successfully!", {
        style: {
          background: "#0f172a",
          color: "#f1f5f9",
          border: "1px solid #1e293b",
        },
      });

      setApplications(
        applications.filter(
          (app) => app._id !== id
        )
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete application", {
        style: {
          background: "#0f172a",
          color: "#f1f5f9",
          border: "1px solid #1e293b",
        },
      });
    }
  };

  const appliedCount = applications.filter(
    (app) => app.status === "Applied"
  ).length;

  const interviewCount = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const offerCount = applications.filter(
    (app) => app.status === "Offer"
  ).length;

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      (app.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.role || "").toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "All" || app.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      
      {/* Self-contained CSS injection for premium floating and glowing animations */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(1.2deg); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.1; filter: blur(20px); }
            50% { opacity: 0.25; filter: blur(30px); }
          }
          .animate-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* Glassmorphic Header Navigation Bar ( macOS frosted glass effect ) */}
      <div className="w-full bg-white/60 dark:bg-slate-950/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Navbar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Futuristic Hero Section featuring Mascot Character */}
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 py-6 px-8 mb-8 shadow-2xl rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Animated Background Gradients */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl animate-glow"></div>
          <div className="absolute right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl animate-glow" style={{ animationDelay: '1s' }}></div>
          
          {/* Hero Content */}
          <div className="flex-1 z-10 text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Launch Your{" "}
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">Career Terminal 🚀</span>
            </h1>
            <p className="text-slate-400 mt-2 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
              Track your job applications with developer-first speed and visual analytics.
            </p>
          </div>

          {/* illustrated Mascot CatBot */}
          <div className="w-full md:w-auto flex justify-center z-10">
            <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_8px_16px_rgba(139,92,246,0.3)] animate-float" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Head / Monitor shape */}
              <rect x="40" y="55" width="120" height="90" rx="28" fill="#1e1e2e" stroke="#8b5cf6" strokeWidth="5" />
              <rect x="48" y="63" width="104" height="74" rx="20" fill="#11111b" />
              
              {/* Cute glowing developer eyes (Smiling code theme) */}
              <path d="M68 88L78 98L68 108" stroke="#a6e3a1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M122 108H138" stroke="#a6e3a1" strokeWidth="5" strokeLinecap="round" />
              <path d="M96 114C100 117 104 117 108 114" stroke="#a6e3a1" strokeWidth="3" strokeLinecap="round" />

              {/* Cat Ears */}
              <path d="M48 58L32 30L64 54" fill="#1e1e2e" stroke="#8b5cf6" strokeWidth="4" strokeLinejoin="round" />
              <path d="M152 58L168 30L136 54" fill="#1e1e2e" stroke="#8b5cf6" strokeWidth="4" strokeLinejoin="round" />

              {/* Developer glasses */}
              <rect x="58" y="85" width="30" height="20" rx="6" stroke="#f38ba8" strokeWidth="3.5" fill="none" />
              <rect x="112" y="85" width="30" height="20" rx="6" stroke="#f38ba8" strokeWidth="3.5" fill="none" />
              <line x1="88" y1="95" x2="112" y2="95" stroke="#f38ba8" strokeWidth="3.5" />

              {/* Floating job sparkles */}
              <path d="M22 72L24 78L29 80L24 82L22 88L20 82L15 80L20 78L22 72Z" fill="#f9e2af" />
              <path d="M178 112L180 117L185 119L180 121L178 127L176 121L171 119L176 117L178 112Z" fill="#f9e2af" />

              {/* Developer Beanie POMPOM */}
              <circle cx="100" cy="38" r="8" fill="#cba6f7" />

              {/* Laptop glowing device below */}
              <path d="M50 162H150L158 176H42L50 162Z" fill="#313244" stroke="#8b5cf6" strokeWidth="4" />
              <rect x="76" y="165" width="48" height="5" rx="2.5" fill="#bac2de" />
              <path d="M72 162L90 146H110L128 162H72Z" fill="url(#screen-glow)" opacity="0.3" />

              <defs>
                <linearGradient id="screen-glow" x1="100" y1="146" x2="100" y2="162" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        
        {/* Page title and state indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
              Manage your job search pipeline, stats, and records in a single interface.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Live Pipeline
            </span>
          </div>
        </div>

        {/* Premium Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
          
          {/* Total Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-indigo-500/20 dark:hover:border-indigo-500/30 border-t-4 border-t-slate-500">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Applications</p>
              <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .596-.237 1.168-.66 1.59-.422.424-.994.66-1.59.66H6c-.596 0-1.168-.236-1.59-.66-.424-.422-.66-.994-.66-1.59v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 14.15m16.5 0V9.75A2.25 2.25 0 0017.25 7.5H6.75A2.25 2.25 0 004.5 9.75v4.4m15 0a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 14.15M7.5 7.5V4.5a2.25 2.25 0 012.25-2.25h4.5A2.25 2.25 0 0116.5 4.5v3" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{applications.length}</h2>
          </div>

          {/* Applied Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-500/20 dark:hover:border-blue-500/30 border-t-4 border-t-blue-500/80">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Applied</p>
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{appliedCount}</h2>
          </div>

          {/* Interview Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-amber-500/20 dark:hover:border-amber-500/30 border-t-4 border-t-amber-500/80">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Interview</p>
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v5.772z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{interviewCount}</h2>
          </div>

          {/* Rejected Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-rose-500/20 dark:hover:border-rose-500/30 border-t-4 border-t-rose-500/80">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Rejected</p>
              <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{rejectedCount}</h2>
          </div>

          {/* Offer Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 border-t-4 border-t-emerald-500/80">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Offer</p>
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">{offerCount}</h2>
          </div>

        </div>

        {/* Dashboard 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Form Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <ApplicationForm onApplicationAdded={fetchApplications} />
          </div>

          {/* Right Panel: Applications list */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Applications
                </h2>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-full shadow-2xs">
                  Active Listings: {applications.length}
                </span>
              </div>

              {/* Modern Search and Status Filter inputs */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search company or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>

                <div className="relative min-w-[140px]">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-450 dark:text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center shadow-md">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl mb-4 border border-slate-100 dark:border-slate-800/60">
                  <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                  {applications.length === 0 ? "No application cards yet" : "No matching results"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mt-1">
                  {applications.length === 0 
                    ? "Add your first job application using the form on the left to start compiling your board."
                    : "We couldn't find any job applications matching your query or status filter."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredApplications.map((app) => (
                  <div 
                    key={app._id} 
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-1 hover:scale-[1.01] hover:border-indigo-500/20 dark:hover:border-indigo-500/30 transition-all duration-300 min-h-[190px] flex flex-col justify-between w-full"
                  >
                    <ApplicationCard 
                      app={app} 
                      onDelete={handleDelete} 
                      onEdit={() => setEditingApp(app)} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {editingApp && (
        <EditApplicationModal
          app={editingApp}
          onClose={() => setEditingApp(null)}
          onSave={fetchApplications}
        />
      )}
    </div>
  );
}

export default Dashboard;