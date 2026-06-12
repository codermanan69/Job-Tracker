import React, { useEffect, useState } from "react";
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
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications");
      setApplications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Job Tracker | Dashboard";
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

  const oaCount = applications.filter(
    (app) => app.status === "OA"
  ).length;

  // Analytics Metrics
  const totalApplications = applications.length;
  const successRate = totalApplications > 0 ? (offerCount / totalApplications) * 100 : 0;
  const interviewRate = totalApplications > 0 ? (interviewCount / totalApplications) * 100 : 0;
  const offerRate = totalApplications > 0 ? (offerCount / totalApplications) * 100 : 0;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const appsThisMonth = applications.filter((app) => {
    const dateStr = app.createdAt || app.appliedDate;
    if (!dateStr) return false;
    const appDate = new Date(dateStr);
    return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
  }).length;

  const appsThisMonthPercent = totalApplications > 0 ? (appsThisMonth / totalApplications) * 100 : 0;

  // Chart 1: Application Status Distribution
  const statusData = [
    { label: "Applied", count: appliedCount, color: "from-blue-500 to-blue-400", hex: "#3b82f6" },
    { label: "OA", count: oaCount, color: "from-cyan-500 to-cyan-400", hex: "#06b6d4" },
    { label: "Interview", count: interviewCount, color: "from-amber-500 to-amber-400", hex: "#f59e0b" },
    { label: "Rejected", count: rejectedCount, color: "from-rose-500 to-rose-400", hex: "#f43f5e" },
    { label: "Offer", count: offerCount, color: "from-emerald-500 to-emerald-400", hex: "#10b981" },
  ];
  const maxStatusCount = Math.max(...statusData.map((d) => d.count), 1);

  // Chart 2: Pipeline Stages
  const pipelineStages = [
    { label: "Applied", count: appliedCount, text: "text-blue-500", gradient: "from-blue-500 to-blue-400", border: "border-blue-500/20" },
    { label: "OA", count: oaCount, text: "text-cyan-500", gradient: "from-cyan-500 to-cyan-400", border: "border-cyan-500/20" },
    { label: "Interview", count: interviewCount, text: "text-amber-500", gradient: "from-amber-500 to-amber-400", border: "border-amber-500/20" },
    { label: "Offer", count: offerCount, text: "text-emerald-500", gradient: "from-emerald-500 to-emerald-400", border: "border-emerald-500/20" },
  ];

  // Chart 3: Monthly Applications Line Chart Calculations
  const getMonthlyData = () => {
    const months = [];
    const nowObj = new Date();
    
    // Last 6 months chronological list
    for (let i = 5; i >= 0; i--) {
      const d = new Date(nowObj.getFullYear(), nowObj.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth(),
        label: d.toLocaleString('default', { month: 'short' }),
        count: 0,
      });
    }
    
    // Group counts
    applications.forEach((app) => {
      const dateStr = app.createdAt || app.appliedDate;
      if (!dateStr) return;
      const appDate = new Date(dateStr);
      const appYear = appDate.getFullYear();
      const appMonth = appDate.getMonth();
      
      const matched = months.find((m) => m.year === appYear && m.month === appMonth);
      if (matched) {
        matched.count += 1;
      }
    });
    
    return months;
  };

  const monthlyData = getMonthlyData();

  // SVG Line Chart Dimensions and Coordinates
  const chartWidth = 500;
  const chartHeight = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  
  const maxMonthlyCount = Math.max(...monthlyData.map((d) => d.count), 1);
  const linePoints = monthlyData.map((d, index) => {
    const x = paddingLeft + (index * (chartWidth - paddingLeft - paddingRight)) / 5;
    const y = (chartHeight - paddingBottom) - (d.count / maxMonthlyCount) * (chartHeight - paddingBottom - paddingTop);
    return { x, y, label: d.label, count: d.count };
  });

  const linePath = linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = linePoints.length > 0
    ? `${linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')} L ${linePoints[linePoints.length - 1].x} ${chartHeight - paddingBottom} L ${linePoints[0].x} ${chartHeight - paddingBottom} Z`
    : '';

  const yAxisTicks = [0, 0.5, 1];

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      (app.companyName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.role || "").toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === "All" || app.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "newest") {
      const dateA = new Date(a.createdAt || a.appliedDate || 0);
      const dateB = new Date(b.createdAt || b.appliedDate || 0);
      return dateB - dateA;
    }
    if (sortBy === "oldest") {
      const dateA = new Date(a.createdAt || a.appliedDate || 0);
      const dateB = new Date(b.createdAt || b.appliedDate || 0);
      return dateA - dateB;
    }
    if (sortBy === "company-az") {
      return (a.companyName || "").localeCompare(b.companyName || "");
    }
    if (sortBy === "company-za") {
      return (b.companyName || "").localeCompare(a.companyName || "");
    }
    return 0;
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

        {/* Premium Analytics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Success Rate Card */}
          <div className="relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Success Rate</span>
              <div className="p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl text-emerald-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalApplications > 0 ? `${successRate.toFixed(1)}%` : "0.0%"}</h2>
            
            {/* Subtle Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </div>

          {/* Applications This Month Card */}
          <div className="relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-500/30 dark:hover:border-blue-500/20 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Apps This Month</span>
              <div className="p-2 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">{appsThisMonth}</h2>
            
            {/* Subtle Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500" 
                style={{ width: `${appsThisMonthPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Interview Rate Card */}
          <div className="relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-amber-500/30 dark:hover:border-amber-500/20 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Interview Rate</span>
              <div className="p-2 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl text-amber-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalApplications > 0 ? `${interviewRate.toFixed(1)}%` : "0.0%"}</h2>
            
            {/* Subtle Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500" 
                style={{ width: `${interviewRate}%` }}
              ></div>
            </div>
          </div>

          {/* Offer Rate Card */}
          <div className="relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-violet-500/30 dark:hover:border-violet-500/20 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110"></div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Offer Rate</span>
              <div className="p-2 bg-violet-500/10 dark:bg-violet-500/20 rounded-xl text-violet-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.468.86-.468 1.033 0l2.407 6.551 6.551 2.407c.468.172.468.86 0 1.033l-6.551 2.407-2.407 6.551" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalApplications > 0 ? `${offerRate.toFixed(1)}%` : "0.0%"}</h2>
            
            {/* Subtle Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-850 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500" 
                style={{ width: `${offerRate}%` }}
              ></div>
            </div>
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

        {/* Premium Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Monthly Applications Line Chart */}
          <div className="lg:col-span-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Monthly Trend
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Applications submitted over the last 6 months
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                Last 6 Months
              </span>
            </div>
            
            <div className="w-full overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                <defs>
                  <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Grid lines */}
                {yAxisTicks.map((tick, i) => {
                  const yVal = paddingTop + tick * (chartHeight - paddingBottom - paddingTop);
                  return (
                    <line 
                      key={i}
                      x1={paddingLeft}
                      y1={yVal}
                      x2={chartWidth - paddingRight}
                      y2={yVal}
                      stroke="currentColor"
                      className="text-slate-200 dark:text-slate-800/40"
                      strokeDasharray="4 4"
                    />
                  );
                })}
                
                {/* Y Axis labels */}
                <text x={paddingLeft - 10} y={paddingTop + 4} textAnchor="end" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 fill-current">
                  {maxMonthlyCount}
                </text>
                <text x={paddingLeft - 10} y={paddingTop + (chartHeight - paddingBottom - paddingTop) / 2 + 4} textAnchor="end" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 fill-current">
                  {Math.round(maxMonthlyCount / 2)}
                </text>
                <text x={paddingLeft - 10} y={chartHeight - paddingBottom + 4} textAnchor="end" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 fill-current">
                  0
                </text>
                
                {/* Area under the line */}
                {areaPath && (
                  <path d={areaPath} fill="url(#line-gradient)" />
                )}
                
                {/* The Line */}
                {linePath && (
                  <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                )}
                
                {/* Dots */}
                {linePoints.map((p, i) => (
                  <g key={i} className="group/dot">
                    {/* Glow effect on hover */}
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="8" 
                      className="fill-indigo-500/20 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200 cursor-pointer" 
                    />
                    {/* Solid circle dot */}
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="4" 
                      className="fill-indigo-500 stroke-white dark:stroke-slate-900 stroke-2 cursor-pointer" 
                    />
                    <text x={p.x} y={chartHeight - 8} textAnchor="middle" className="text-[10px] font-bold text-slate-400 dark:text-slate-500 fill-current">
                      {p.label}
                    </text>
                    <title>{p.count} applications</title>
                  </g>
                ))}
              </svg>
            </div>
          </div>
          
          {/* Application Status Distribution Bar Chart */}
          <div className="lg:col-span-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Status Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Applications segmented by current status
                </p>
              </div>
            </div>
            
            {/* Custom Bar Chart */}
            <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 px-1">
              {statusData.map((item) => {
                const percent = (item.count / maxStatusCount) * 100;
                return (
                  <div key={item.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[9px] font-black text-slate-900 dark:text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {item.count}
                    </span>
                    <div 
                      style={{ height: `${Math.max(6, percent)}%` }}
                      className={`w-full rounded-t-lg bg-gradient-to-t ${item.color} shadow-xs transition-all duration-500 group-hover:scale-x-105 group-hover:brightness-110 relative`}
                    >
                      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white/20 rounded-t-lg"></div>
                      <title>{item.count} applications ({item.label})</title>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate w-full text-center">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Application Pipeline Progress */}
          <div className="lg:col-span-12 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-all duration-300">
            <div className="mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Pipeline Stage Conversion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual transition and conversion metrics along your recruitment tunnel
              </p>
            </div>
            
            {/* conveyor pipeline */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 w-full py-4">
              {pipelineStages.map((stage, index) => (
                <React.Fragment key={stage.label}>
                  <div className={`flex-1 min-w-[150px] w-full bg-white/40 dark:bg-slate-900/45 backdrop-blur-md border ${stage.border} rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-2xs transition-all duration-300 hover:shadow-xs hover:-translate-y-0.5 relative group overflow-hidden`}>
                    <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${stage.gradient}`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {stage.label}
                    </span>
                    <h3 className={`text-2xl font-black mt-1 ${stage.text}`}>
                      {stage.count}
                    </h3>
                    <p className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      {totalApplications > 0 ? `${((stage.count / totalApplications) * 100).toFixed(0)}% of total` : "0% of total"}
                    </p>
                  </div>
                  
                  {index < pipelineStages.length - 1 && (
                    <div className="flex items-center justify-center text-slate-350 dark:text-slate-700 md:rotate-0 rotate-90 shrink-0">
                      <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
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

              {/* Modern Search, Status Filter, and Sorting inputs */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
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

                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  {/* Status Filter */}
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

                  {/* Premium Glassmorphic Sorting Dropdown */}
                  <div className="relative min-w-[150px]">
                    <button
                      type="button"
                      onClick={() => setIsSortOpen(!isSortOpen)}
                      className="w-full flex items-center justify-between gap-2 pl-4 pr-3 py-2.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer shadow-3xs hover:bg-white/60 dark:hover:bg-slate-900/60"
                    >
                      <span className="truncate">Sort By: {
                        sortBy === "newest" ? "Newest First" :
                        sortBy === "oldest" ? "Oldest First" :
                        sortBy === "company-az" ? "Company A-Z" :
                        sortBy === "company-za" ? "Company Z-A" : "Newest First"
                      }</span>
                      <svg className={`w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isSortOpen ? 'rotate-185' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    {isSortOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)}></div>
                        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200 dark:border-slate-800 p-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                          <button
                            type="button"
                            onClick={() => { setSortBy("newest"); setIsSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                              sortBy === "newest"
                                ? "bg-indigo-500 text-white shadow-xs"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Newest First
                          </button>
                          <button
                            type="button"
                            onClick={() => { setSortBy("oldest"); setIsSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                              sortBy === "oldest"
                                ? "bg-indigo-500 text-white shadow-xs"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Oldest First
                          </button>
                          <button
                            type="button"
                            onClick={() => { setSortBy("company-az"); setIsSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                              sortBy === "company-az"
                                ? "bg-indigo-500 text-white shadow-xs"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Company A-Z
                          </button>
                          <button
                            type="button"
                            onClick={() => { setSortBy("company-za"); setIsSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                              sortBy === "company-za"
                                ? "bg-indigo-500 text-white shadow-xs"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                            }`}
                          >
                            Company Z-A
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {sortedApplications.length === 0 ? (
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
                {sortedApplications.map((app) => (
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