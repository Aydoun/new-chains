export function SnippetCard() {
  return (
    <div className="frame-card flex items-center bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark p-6 rounded shadow-sm group">
      <div className="drag-handle mr-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors">
        <span className="material-icons-outlined">drag_indicator</span>
      </div>
      <div className="flex-grow text-center">
        <h2 className="font-display text-2xl lg:text-3xl text-slate-900 dark:text-slate-100">
          npx prisma migrate dev --name &lt;meaningful_name&gt;
        </h2>
        <p className="text-primary mt-2 text-sm uppercase tracking-wider font-medium">
          choose a meaningful name for your migration
        </p>
      </div>
      <div className="ml-4 flex flex-col items-center space-y-4">
        <button className="text-rose-500 hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]">
          <span className="material-icons-outlined">favorite</span>
        </button>
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <span className="material-icons-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
}
