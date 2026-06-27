import { useState, useEffect } from "react";

// BottomPanel.tsx
// Kaam: Test cases aur output dikhana
// MEditor se output aur isRunning props mein aata hai

type TestPanelTab = "testcases" | "output";

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

// ── Props
interface BottomPanelProps {
  testCases: TestCase[];
  output: OutputResult[] | null;
  isRunning: boolean;
}

const BottomPanel = ({ testCases, output, isRunning }: BottomPanelProps) => {
  // yeh state sirf BottomPanel ke andar use hoti hai — kisi aur ko nahi chahiye
  const [testPanelOpen, setTestPanelOpen] = useState(true);
  const [testPanelTab, setTestPanelTab] = useState<TestPanelTab>("testcases");

  // jab output aaye toh automatically output tab pe aa jao
  // parent se output update hoga toh yeh useEffect chalega
  useEffect(() => {
    if (output !== null) {
      setTestPanelOpen(true);
      setTestPanelTab("output");
    }
  }, [output]);

  return (
    <div
      className={`shrink-0 flex flex-col border-t border-sun-border dark:border-moon-zincy/20 transition-all duration-200
      ${testPanelOpen ? "h-52" : "h-10"}`}
    >
      {/* Panel header — tabs + toggle button */}
      <div className="flex items-center justify-between px-4 shrink-0 h-10">
        <div className="flex items-center gap-0">
          {(["testcases", "output"] as TestPanelTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setTestPanelOpen(true);
                setTestPanelTab(tab);
              }}
              className={`px-4 h-10 text-xs font-medium capitalize transition-colors
                ${
                  testPanelTab === tab && testPanelOpen
                    ? "border-b-2 border-sun-accent dark:border-moon-lzincy text-sun-text-primary dark:text-moon-stone"
                    : "text-sun-text-muted dark:text-moon-zincy hover:text-sun-text-primary dark:hover:text-moon-stone"
                }`}
            >
              {tab === "testcases" ? "Test Cases" : "Output"}
            </button>
          ))}
        </div>

        {/* open/close toggle */}
        <button
          onClick={() => setTestPanelOpen((p) => !p)}
          className="text-sun-text-muted dark:text-moon-zincy hover:text-sun-text-primary
            dark:hover:text-moon-stone text-xs px-2 transition-colors"
        >
          {testPanelOpen ? "▼" : "▲"}
        </button>
      </div>

      {/* Panel content */}
        {/* Panel content */}
      {testPanelOpen && testPanelTab === "testcases" && (
        <div className="flex-1 overflow-auto px-4 py-3">
          {testCases.length === 0 ? (
            <p className="text-xs text-sun-text-muted dark:text-moon-zincy">
              No visible test cases.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {testCases.map((tc, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-sun-border dark:border-moon-zincy/20 bg-sun-bg-secondary dark:bg-[#18181b] p-3 text-xs"
                >
                  <p className="font-semibold text-sun-text-primary dark:text-moon-stone mb-2">
                    Case {i + 1}
                  </p>

                  <p className="text-sun-text-muted dark:text-moon-zincy">
                    Input
                  </p>
                  <pre className="font-mono whitespace-pre-wrap text-sun-text-primary dark:text-moon-stone mb-2">
                    {tc.input}
                  </pre>

                  <p className="text-sun-text-muted dark:text-moon-zincy">
                    Output
                  </p>
                  <pre className="font-mono whitespace-pre-wrap text-sun-text-primary dark:text-moon-stone">
                    {tc.output}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {testPanelOpen && testPanelTab === "output" && (
        <div className="flex-1 overflow-auto px-4 py-3">
          {isRunning ? (
            <p className="text-xs text-sun-text-muted dark:text-moon-zincy animate-pulse">
              Running...
            </p>
          ) : output === null ? (
            <p className="text-xs text-sun-text-muted dark:text-moon-zincy">
              Run your code to see output.
            </p>
          ) : output.length === 0 ? (
            <p className="text-xs text-sun-text-muted dark:text-moon-zincy">
              No output received.
            </p>
          ) : output.length === 1 && output[0].message ? (
            <p className="text-xs font-mono text-red-400">
              {output[0].message}
            </p>
          ) : output.length === 1 && output[0].totaltestcases !== undefined ? (
            <div className="flex flex-col gap-3">
              <p
                className={`text-sm font-semibold capitalize ${
                  output[0].status === "accepted"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {output[0].status ?? "Result"}
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-sun-bg-secondary dark:bg-[#18181b] border border-sun-border dark:border-moon-zincy/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-sun-text-muted dark:text-moon-zincy mb-1">
                    Test Cases
                  </p>
                  <p className="text-sm font-medium text-sun-text-primary dark:text-moon-stone">
                    {output[0].totaltestpassed ?? 0} /{" "}
                    {output[0].totaltestcases} passed
                  </p>
                </div>

                <div className="rounded-lg bg-sun-bg-secondary dark:bg-[#18181b] border border-sun-border dark:border-moon-zincy/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-sun-text-muted dark:text-moon-zincy mb-1">
                    Runtime
                  </p>
                  <p className="text-sm font-medium text-sun-text-primary dark:text-moon-stone">
                    {output[0].runtime !== undefined
                      ? `${output[0].runtime.toFixed(2)}s`
                      : "-"}
                  </p>
                </div>

                <div className="rounded-lg bg-sun-bg-secondary dark:bg-[#18181b] border border-sun-border dark:border-moon-zincy/20 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-widest text-sun-text-muted dark:text-moon-zincy mb-1">
                    Memory
                  </p>
                  <p className="text-sm font-medium text-sun-text-primary dark:text-moon-stone">
                    {output[0].memory !== undefined
                      ? `${output[0].memory} KB`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {output.map((result, i) => {
                const passed = result.status_id === 3;

                return (
                  <div
                    key={i}
                    className={`rounded-lg p-3 border text-xs font-mono ${
                      passed
                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
                        : "border-red-500/30 bg-red-500/5 text-red-400"
                    }`}
                  >
                    <span className="font-semibold">
                      Case {i + 1}: {passed ? "Passed" : "Failed"}
                    </span>

                    {result.stdout && (
                      <pre className="mt-1 text-sun-text-primary dark:text-moon-stone whitespace-pre-wrap">
                        {result.stdout}
                      </pre>
                    )}

                    {result.stderr && (
                      <pre className="mt-1 text-red-400 whitespace-pre-wrap">
                        {result.stderr}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BottomPanel;
