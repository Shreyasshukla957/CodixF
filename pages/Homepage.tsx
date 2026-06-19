import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import ProblemTable from "../components/problem-table";
import axiosInstance from "../api/axiosInstance";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  acceptance?: string;
  tags?: string[];
}

interface SolvedProblem {
  id: string;
  title: string;
  tags: string[];
  description: string;
  difficulty: string;
}

export const Homepage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("Any difficulty");
  const [tag, setTag] = useState("Any tag");
  const [filter, setFilter] = useState<"All" | "Solved" | "Unsolved">("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, solvedRes] = await Promise.all([
          axiosInstance.get("/problem/fetchallproblem"),
          axiosInstance.get("/problem/user-problem"),
        ]);
        console.log(allRes.data);
        console.log(solvedRes.data);
        setProblems(allRes.data.AllProblem);
        const ids = (solvedRes.data.message as SolvedProblem[]).map(
          (p) => p.id,
        );
        console.log(ids);
        setSolvedIds(ids);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tags = ["Any tag", "array", "Linkedlist", "graph", "dp"];
  const difficulties = ["Any difficulty", "easy", "medium", "hard"];

  const easy = problems.filter(
    (p) => p.difficulty.toLowerCase() === "easy",
  ).length;
  const medium = problems.filter(
    (p) => p.difficulty.toLowerCase() === "medium",
  ).length;
  const hard = problems.filter(
    (p) => p.difficulty.toLowerCase() === "hard",
  ).length;

  const filtered = problems.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty =
      difficulty === "Any difficulty" ||
      p.difficulty.toLowerCase() === difficulty.toLowerCase();
    const matchTag = tag === "Any tag" || p.tags?.includes(tag);
    const matchFilter =
      filter === "All" ||
      (filter === "Solved" && solvedIds.includes(p._id)) ||
      (filter === "Unsolved" && !solvedIds.includes(p._id));
    return matchSearch && matchDifficulty && matchTag && matchFilter;
  });

  return (
    <div className="min-h-screen bg-sun-bg selection:bg-indigo-200  dark:bg-radial-[circle] dark:from-moon-bg-secondary dark:to-moon-bg dark:selection:bg-neutral-200 ">
      <Navbar />

      <div className="max-w-5xl mx-auto px-8 pt-[18%] pb-12 ">
        <div className="mb-4">
          <h1 className="text-4xl font-bold font-geistmono text-sun-text-primary dark:text-moon-stone/90  tracking-tight ">
            Problem Arena
          </h1>
          <p className="text-xl font-light text-sun-text-muted dark:text-moon-zincy mt-1 font-geist">
            level up your skills.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="text-sm px-4 py-2.5 rounded-lg border cursor-pointer font-manrope
              bg-transparent border-sun-border text-sun-text-secondary
              dark:border-moon-zincy/40 dark:text-moon-zincy dark:bg-transparent
              focus:outline-none transition-colors"
          >
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="text-sm px-4 py-2.5 rounded-lg border cursor-pointer font-manrope
              bg-transparent border-sun-border text-sun-text-secondary
              dark:border-moon-zincy/40 dark:text-moon-zincy dark:bg-transparent
              focus:outline-none transition-colors"
          >
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg border border-sun-border dark:border-moon-zincy/40 overflow-hidden">
            {(["All", "Solved", "Unsolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 text-sm py-2.5 font-manrope transition-colors
                  ${
                    filter === f
                      ? "bg-sun-btn text-white dark:bg-moon-lzincy dark:text-moon-bg"
                      : "bg-transparent text-sun-text-secondary dark:text-moon-zincy hover:bg-sun-bg-secondary dark:hover:bg-[#27272a]"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex text-sm px-4 py-2.5 rounded-lg border font-manrope w-[66%]
              bg-sun-surface border-sun-border text-sun-text-primary placeholder:text-sun-text-muted
              dark:bg-[#18181b] dark:border-moon-zincy/30 dark:text-moon-stone dark:placeholder:text-moon-zincy
              focus:outline-none focus:border-sun-accent dark:focus:border-moon-lzincy transition-colors"
          />

          <div className="w-px h-7 bg-sun-border dark:bg-moon-zincy/30 shrink-0" />

          {[
            {
              label: "Total",
              value: problems.length,
              color: "text-sun-text-primary dark:text-moon-stone",
            },
            {
              label: "Easy",
              value: easy,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              label: "Medium",
              value: medium,
              color: "text-orange-500 dark:text-orange-400",
            },
            {
              label: "Hard",
              value: hard,
              color: "text-red-500 dark:text-red-400",
            },
            {
              label: "Solved",
              value: solvedIds.length,
              color: "text-blue-500 dark:text-blue-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center shrink-0 min-w-11"
            >
              <span
                className={`text-sm font-bold font-geist leading-none ${stat.color}`}
              >
                {stat.value}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-sun-text-muted dark:text-moon-zincy font-manrope mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm font-manrope text-sun-text-muted dark:text-moon-zincy">
            Loading problems...
          </div>
        ) : (
          <ProblemTable problems={filtered} solvedIds={solvedIds} />
        )}
      </div>
    </div>
  );
};
