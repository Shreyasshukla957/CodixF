// MEditor.tsx — MAIN FILE
// Kaam: Sirf state rakhna + API calls karna + Layout banana
// Koi UI nahi hai yahan — sab LeftPanel aur RightPanel mein hai

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import axiosInstance from "@/api/axiosInstance";
import Navbar from "./navbar";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";

// ── Types
type LangKey = "javascript" | "python" | "cpp" | "java";

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
  HiddenTestCases: TestCase[];
  StartCode?: Record<LangKey, string>;
  referencesolution?: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
}

interface OutputResult {
  status_id?: number;
  status?: string;
  stdout?: string;
  stderr?: string;
  message?: string;
  totaltestpassed?: number;
  totaltestcases?: number;
  runtime?: number;
  memory?: number;
}

// ── Component
const MEditor = () => {
  const { id } = useParams();

  // ── State ──
  // Problem data
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  // Editor state — yeh RightPanel ko props mein jaayega
  const [language, setLanguage] = useState<LangKey>("javascript");
  const [code, setCode] = useState("// Start coding here...");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<OutputResult[] | null>(null);

  // ── Fetch problem on mount ──
  useEffect(() => {
    async function fetchProblem() {
      try {
        const res = await axiosInstance.get(`/problem/fetchproblem/${id}`);
        setProblem(res.data.problem ?? res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id]);

  // ── Language ya problem change hone pe start code set karo ──
  useEffect(() => {
    if (problem?.StartCode?.[language]) {
      setCode(problem.StartCode[language]);
    } else {
      setCode("// Start coding here...");
    }
  }, [language, problem]);

  // ── Run handler ──
  const handleRun = async () => {
    try {
      setIsRunning(true);
      setOutput(null);
      const res = await axiosInstance.post(`/run/${id}`, {
        code,
        language,
        problemId: id,
      });
      setOutput(res.data.testResult ?? []);
    } catch (err: any) {
      setOutput([
        { message: err.response?.data?.message ?? "Error running code" },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // ── Submit handler ──
  const handleSubmit = async () => {
    try {
      setIsRunning(true);
      setOutput(null);
      const res = await axiosInstance.post(`/submit/${id}`, {
        code,
        language,
        problemId: id,
      });

      // poora response as-is set karo — message nahi, actual data
      setOutput([res.data]);
    } catch (err: any) {
      setOutput([
        { message: err.response?.data?.message ?? "Error submitting" },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  // ── Loading / Error states ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-sun-bg dark:bg-moon-bg">
        <p className="text-sm font-manrope text-sun-text-muted dark:text-moon-zincy animate-pulse">
          Loading problem...
        </p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-sun-bg dark:bg-moon-bg">
        <p className="text-sm font-manrope text-red-500">Problem not found.</p>
      </div>
    );
  }

  // ── Layout ──
  // MEditor sirf layout hai — LeftPanel aur RightPanel ko props deta hai
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-sun-bg dark:bg-moon-bg font-manrope">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-18">
        {/* Left — description, solution, submissions */}
        <LeftPanel problem={problem} language={language} problemId={id!} />

        {/* Right — editor + run/submit + bottom panel */}
        <RightPanel
          language={language}
          code={code}
          isRunning={isRunning}
          output={output}
          testCases={problem.VisibleTestCases ?? []}
          onLanguageChange={setLanguage}
          onCodeChange={setCode}
          onRun={handleRun}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default MEditor;
