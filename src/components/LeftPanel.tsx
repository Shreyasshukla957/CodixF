// LeftPanel.tsx
// Kaam: Problem ka description, solution, aur submissions dikhana
// Props mein problem data + submissions related cheezein aati hain

import { useState } from "react";
import axiosInstance from "@/api/axiosInstance";

// ── Types ──────────────────────────────────────────────
type LangKey = "javascript" | "python" | "cpp" | "java";
type LeftTab = "description" | "solution" | "submissions";

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  description: string;
  tags?: string[];
  VisibleTestCases?: TestCase[];
  StartCode?: Record<LangKey, string>;
  referencesolution?: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
}

interface Submission {
  _id: string;
  language: string;
  code: string;
  status: string;
  runtime: number;
  memory: number;
  totaltestpassed: number;
  totaltestcases: number;
  errormessage?: string;
  createdAt: string;
}

// ── Helper functions ────────────────────────────────────
const difficultyColor = (d: string) => {
  const dl = d?.toLowerCase();
  if (dl === "easy") return "text-emerald-500 dark:text-emerald-400";
  if (dl === "medium") return "text-orange-500 dark:text-orange-400";
  return "text-red-500 dark:text-red-400";
};

const statusColor = (s: string) => {
  if (s === "accepted") return "text-emerald-500 dark:text-emerald-400";
  if (s === "wrong") return "text-red-500 dark:text-red-400";
  return "text-orange-500 dark:text-orange-400";
};

// ── Props ───────────────────────────────────────────────
interface LeftPanelProps {
  problem: Problem;
  language: LangKey;       // solution tab ke liye — kaun si language selected hai
  problemId: string;       // submissions fetch karne ke liye
}

// ── Component ───────────────────────────────────────────
const LEFT_TABS: { key: LeftTab; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "solution", label: "Solution" },
  { key: "submissions", label: "Submissions" },
];

const LeftPanel = ({ problem, language, problemId }: LeftPanelProps) => {
  const [leftTab, setLeftTab] = useState<LeftTab>("description");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // submissions tab click hone pe fetch karo
  const handleTabChange = async (tab: LeftTab) => {
    setLeftTab(tab);
    setSelectedSubmission(null);

    if (tab !== "submissions") return;

    // sirf tab === "submissions" pe fetch karo
    setSubmissionsLoading(true);
    try {
      const res = await axiosInstance.get(`/problem/${problemId}`);
      setSubmissions(res.data.message ?? []);
    } catch {
      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  return (
    <div className="w-[45%] h-full flex flex-col border-r border-sun-border dark:border-moon-zincy/20 overflow-hidden">

      {/* Problem header — title + difficulty + tags */}
      <div className="px-6 pt-6 pb-4 border-b border-sun-border dark:border-moon-zincy/20 shrink-0">
        <h1 className="text-lg font-semibold text-sun-text-primary dark:text-moon-stone tracking-tight">
          {problem.title}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <span className={`text-xs font-semibold capitalize ${difficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          {problem.tags?.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full
                bg-sun-bg-secondary dark:bg-[#27272a]
                text-sun-text-muted dark:text-moon-zincy"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs — Description / Solution / Submissions */}
      <div className="flex border-b border-sun-border dark:border-moon-zincy/20 shrink-0">
        {LEFT_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`px-5 py-2.5 text-xs font-medium capitalize transition-colors
              ${leftTab === key
                ? "border-b-2 border-sun-accent dark:border-moon-lzincy text-sun-text-primary dark:text-moon-stone"
                : "text-sun-text-muted dark:text-moon-zincy hover:text-sun-text-primary dark:hover:text-moon-stone"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* ── Description ── */}
        {leftTab === "description" && (
          <div className="text-sm text-sun-text-primary dark:text-moon-stone leading-7 whitespace-pre-wrap">
            {problem.description}
          </div>
        )}

        {/* ── Solution ── */}
        {leftTab === "solution" && (
          <div>
            {problem.referencesolution ? (
              <div>
                <p className="text-[11px] uppercase tracking-widest text-sun-text-muted dark:text-moon-zincy mb-3 hover:text-moon">
                  Reference Solution — {language}
                </p>
                <pre className="text-xs font-mono bg-sun-bg-secondary dark:bg-[#18181b] p-4 rounded-lg
                  text-sun-text-primary dark:text-moon-stone whitespace-pre-wrap leading-6 overflow-x-auto dark:border dark:border-dashed dark:border-sun-bg/60 ">
                  {problem.referencesolution[language]}
                </pre>
              </div>
            ) : (
              <p className="text-sm text-sun-text-muted dark:text-moon-zincy">
                No solution available.
              </p>
            )}
          </div>
        )}

        {/* ── Submissions ── */}
        {leftTab === "submissions" && (
          <div>
            {selectedSubmission ? (
              // selected submission ka code dikhao
              <div>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex items-center gap-1.5 text-xs text-sun-text-muted dark:text-moon-zincy
                    hover:text-sun-text-primary dark:hover:text-moon-stone mb-4 transition-colors"
                >
                  ← Back to submissions
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-sm font-semibold capitalize ${statusColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                  <span className="text-xs text-sun-text-muted dark:text-moon-zincy capitalize">
                    {selectedSubmission.language}
                  </span>
                  <span className="text-xs text-sun-text-muted dark:text-moon-zincy">
                    {selectedSubmission.totaltestpassed}/{selectedSubmission.totaltestcases} passed
                  </span>
                </div>
                <pre className="text-xs font-mono bg-sun-bg-secondary dark:bg-[#18181b] p-4 rounded-lg
                  text-sun-text-primary dark:text-moon-stone whitespace-pre-wrap leading-6 overflow-x-auto">
                  {selectedSubmission.code}
                </pre>
              </div>
            ) : submissionsLoading ? (
              <p className="text-sm text-sun-text-muted dark:text-moon-zincy animate-pulse">
                Loading submissions...
              </p>
            ) : submissions.length === 0 ? (
              <p className="text-sm text-sun-text-muted dark:text-moon-zincy">
                No submissions yet.
              </p>
            ) : (
              <div className="flex flex-col gap-0">
                {/* Table header */}
                <div className="grid grid-cols-5 text-[10px] uppercase tracking-widest
                  text-sun-text-muted dark:text-moon-zincy pb-2 border-b border-sun-border dark:border-moon-zincy/20">
                  <span>Status</span>
                  <span>Language</span>
                  <span>Runtime</span>
                  <span>Memory</span>
                  <span>Date</span>
                </div>

                {submissions.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="grid grid-cols-5 py-3 text-xs border-b border-sun-border dark:border-moon-zincy/10
                      hover:bg-sun-bg-secondary dark:hover:bg-[#18181b] transition-colors text-left -mx-2 px-2 rounded"
                  >
                    <span className={`font-medium capitalize ${statusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                    <span className="text-sun-text-secondary dark:text-moon-zincy capitalize">
                      {sub.language}
                    </span>
                    <span className="text-sun-text-secondary dark:text-moon-zincy">
                      {sub.runtime ? `${sub.runtime.toFixed(2)}s` : "—"}
                    </span>
                    <span className="text-sun-text-secondary dark:text-moon-zincy">
                      {sub.memory ? `${sub.memory}kb` : "—"}
                    </span>
                    <span className="text-sun-text-muted dark:text-moon-zincy">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;