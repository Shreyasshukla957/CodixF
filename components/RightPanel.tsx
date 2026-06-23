// RightPanel.tsx
// Kaam: Monaco editor + language selector + Run/Submit buttons + BottomPanel
// Sab editor related cheezein yahan hain

import Editor from "@monaco-editor/react";
import BottomPanel from "./BottomPanel";

type LangKey = "javascript" | "python" | "cpp" | "java";

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
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

const LANGUAGES: { label: string; value: LangKey }[] = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
];

// ── Props
interface RightPanelProps {
  language: LangKey;
  code: string;
  isRunning: boolean;
  output: OutputResult[] | null;
  testCases: TestCase[];
  onLanguageChange: (lang: LangKey) => void;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onSubmit: () => void;
}

const RightPanel = ({
  language,
  code,
  isRunning,
  output,
  testCases,
  onLanguageChange,
  onCodeChange,
  onRun,
  onSubmit,
}: RightPanelProps) => {
  return (
    <div className="w-[55%] h-full flex flex-col overflow-hidden">
      {/* Language selector + Run/Submit buttons */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sun-border dark:border-moon-zincy/20 shrink-0">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as LangKey)}
          className="text-xs px-3 py-1.5 rounded-lg border cursor-pointer
            bg-transparent border-sun-border dark:border-moon-zincy/40
            text-sun-text-secondary dark:text-moon-zincy
            focus:outline-none transition-colors"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            onClick={onRun}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors
              border-sun-border dark:border-moon-zincy/40
              text-sun-text-secondary dark:text-moon-zincy
              hover:bg-sun-bg-secondary dark:hover:bg-[#27272a]
              disabled:opacity-50"
          >
            {isRunning ? "Running..." : "Run"}
          </button>
          <button
            onClick={onSubmit}
            disabled={isRunning}
            className="px-4 py-1.5 text-xs font-medium rounded-lg transition-colors
              bg-emerald-600 hover:bg-emerald-700
              text-white disabled:opacity-50"
          >
            {isRunning ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden min-h-0">
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          onChange={(val) => onCodeChange(val ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily: "JetBrains Mono, Fira Code, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            roundedSelection: true,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      {/* Bottom panel — test cases + output */}
      {/* RightPanel ke andar hai kyunki yeh editor ke neeche hi render hoga */}
      <BottomPanel
        testCases={testCases}
        output={output}
        isRunning={isRunning}
      />
    </div>
  );
};

export default RightPanel;
