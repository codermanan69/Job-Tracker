import { useState, useContext } from "react";
import { createApplication } from "../services/applicationService";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function ApplicationForm({ onApplicationAdded }) {
  const { isGuest } = useContext(AuthContext);
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) return;

    setLoading(true);
    try {
      const response = await createApplication({
        companyName,
        role,
        status,
        notes,
      }, isGuest);

      console.log(response.data);
      console.log("Application Added");

      // Reset form fields
      setCompanyName("");
      setRole("");
      setStatus("Applied");
      setNotes("");

      toast.success("Application added successfully!", {
        style: {
          background: "#0f172a",
          color: "#f1f5f9",
          border: "1px solid #1e293b",
        },
      });

      // Immediately refresh Dashboard applications list
      if (onApplicationAdded) {
        onApplicationAdded();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add application", {
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

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl w-full transition-colors duration-300">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-5 tracking-tight">
        Add Application
      </h2>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(99,102,241,0.25)] text-white text-sm font-extrabold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-97 cursor-pointer flex items-center justify-center gap-1.5"
        >
          {loading ? (
            "Adding..."
          ) : (
            <>
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
                  d="M12 4.5v15m7.5-7.5h-15"
                ></path>
              </svg>
              Add Application
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;