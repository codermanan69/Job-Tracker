import { useState, useEffect } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";

function EditApplicationModal({ app, onClose, onSave }) {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill existing application data
  useEffect(() => {
    if (app) {
      setCompanyName(app.companyName || "");
      setRole(app.role || "");
      setStatus(app.status || "Applied");
      setNotes(app.notes || "");
      setError("");
    }
  }, [app]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) {
      setError("Company Name and Role are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.patch(`/applications/${app._id}`, {
        companyName: companyName.trim(),
        role: role.trim(),
        status,
        notes: notes.trim(),
      });

      toast.success("Application updated successfully!", {
        style: {
          background: "#0f172a",
          color: "#f1f5f9",
          border: "1px solid #1e293b",
        },
      });

      if (onSave) {
        await onSave();
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update application. Please try again.");
      toast.error(err.response?.data?.message || "Failed to update application", {
        style: {
          background: "#0f172a",
          color: "#f1f5f9",
          border: "1px solid #1e293b",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay with blur */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Dialog Content Container */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 transform transition-all duration-300 scale-100 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Edit Application
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs font-semibold text-rose-600 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. Google"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Role
            </label>
            <input
              type="text"
              placeholder="e.g. Software Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all cursor-pointer"
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offer">Offer</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Notes
            </label>
            <textarea
              placeholder="Add key notes, follow-up links..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-sm focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700 min-h-[80px]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 hover:dark:text-white text-slate-500 dark:text-slate-400 text-sm font-bold rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-extrabold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(99,102,241,0.25)] duration-200 active:scale-97 cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditApplicationModal;
