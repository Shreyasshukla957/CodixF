interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  acceptance?: string;
  tags?: string[];
}

interface Props {
  problems: Problem[];
  solvedIds: string[];
}

const difficultyBadge = (d: string) => {
  const dl = d.toLowerCase();
  if (dl === "easy")
    return "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400";
  if (dl === "medium")
    return "bg-orange-500/10 text-orange-700 dark:bg-orange-400/10 dark:text-orange-400";
  return "bg-red-500/10 text-red-700 dark:bg-red-400/10 dark:text-red-400";
};

const ProblemTable = ({ problems, solvedIds }: Props) => {
  if (problems.length === 0)
    return (
      <div className="py-20 text-center text-sm font-manrope text-sun-text-muted dark:text-moon-zincy">
        No problems found
      </div>
    );

  return (
    <div className="rounded-xl border overflow-hidden border-sun-border dark:border-moon-zincy/30">
      <div
        className="grid grid-cols-12 px-6 py-3 text-[10px] font-manrope uppercase tracking-widest
        bg-sun-bg-secondary border-b border-sun-border text-sun-text-muted
        dark:bg-[#27272a] dark:border-moon-zincy/30 dark:text-moon-zincy"
      >
        <span className="col-span-1">#</span>
        <span className="col-span-5">Title</span>
        <span className="col-span-2">Tag</span>
        <span className="col-span-2">Acceptance</span>
        <span className="col-span-2">Difficulty</span>
      </div>

      {problems.map((problem, index) => (
        <div
          key={problem._id}
          className={`grid grid-cols-12 px-6 py-5 items-center text-sm font-manrope cursor-pointer transition-colors
            ${index !== problems.length - 1 ? "border-b border-sun-border dark:border-moon-zincy/20" : ""}
            ${index % 2 === 0 ? "bg-sun-surface dark:bg-[#18181b]" : "bg-sun-bg dark:bg-[#111113]"}
            hover:bg-sun-bg-secondary dark:hover:bg-[#27272a]`}
        >
          <span className="col-span-1 text-xs font-mono text-sun-text-muted dark:text-moon-zincy">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span
            className={`col-span-5 font-medium truncate pr-4 ${
              solvedIds.includes(problem._id)
                ? "text-emerald-700 dark:text-emerald-400"
                : "text-sun-text-primary dark:text-moon-stone"
            }`}
          >
            {problem.title}
          </span>

          <span className="col-span-2 text-xs text-sun-text-muted dark:text-moon-zincy uppercase tracking-wider truncate pr-2">
            {problem.tags?.[0] ?? "—"}
          </span>

          <span className="col-span-2 text-xs text-sun-text-muted dark:text-moon-zincy">
            {problem.acceptance ?? "—"}
          </span>

          <span
            className={`col-span-2 text-[10px] font-semibold px-2.5 py-1 rounded-full w-fit ${difficultyBadge(problem.difficulty)}`}
          >
            {problem.difficulty}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProblemTable;
