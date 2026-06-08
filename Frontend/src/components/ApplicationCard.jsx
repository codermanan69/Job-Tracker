function ApplicationCard({ app, onDelete, onEdit }) {
  // Determine badge colors based on status (Applied = Blue, Interview = Amber, Rejected = Red, Offer = Green)
  let badgeTheme = "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20";
  if (app.status === "Interview") {
    badgeTheme = "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20";
  } else if (app.status === "Offer") {
    badgeTheme = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 animate-pulse";
  } else if (app.status === "Rejected") {
    badgeTheme = "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20";
  }

  return (
    <div className="flex flex-col justify-between h-full w-full">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
            {app.companyName}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border shrink-0 shadow-3xs hover:scale-105 cursor-default select-none transition-all duration-200 ${badgeTheme}`}
          >
            {app.status}
          </span>
        </div>

        {/* Role with icon */}
        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-2.5 flex items-center gap-1.5">
          <svg
            className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 14.15v4.25c0 .596-.237 1.168-.66 1.59-.422.424-.994.66-1.59.66H6c-.596 0-1.168-.236-1.59-.66-.424-.422-.66-.994-.66-1.59v-4.25m16.5 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 14.15m16.5 0V9.75A2.25 2.25 0 0017.25 7.5H6.75A2.25 2.25 0 004.5 9.75v4.4m15 0a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 14.15M7.5 7.5V4.5a2.25 2.25 0 012.25-2.25h4.5A2.25 2.25 0 0116.5 4.5v3"
            ></path>
          </svg>
          Role: {app.role}
        </p>

        {/* Notes (rendered conditionally if present) */}
        {app.notes && app.notes.trim() !== "" && (
          <div className="bg-slate-50 dark:bg-slate-950 border-l-2 border-indigo-500/80 p-2.5 rounded-lg text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed mt-3 break-all max-h-24 overflow-y-auto">
            {app.notes}
          </div>
        )}
      </div>

      {/* Card Footer with Edit & Delete */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex-grow py-2 px-3 bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 dark:hover:bg-indigo-950/40 hover:-translate-y-0.5 active:scale-95 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:dark:text-indigo-300 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-200 shadow-2xs"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            ></path>
          </svg>
          Edit
        </button>

        <button
          onClick={() => onDelete(app._id)}
          className="flex-grow py-2 px-3 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 hover:-translate-y-0.5 active:scale-95 text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:dark:text-rose-300 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border border-rose-100 dark:border-rose-900/30 hover:border-rose-200 shadow-2xs"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            ></path>
          </svg>
          Delete
        </button>
      </div>

      <hr className="hidden" />
    </div>
  );
}

export default ApplicationCard;