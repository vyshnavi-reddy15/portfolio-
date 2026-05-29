import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Bundle all project source files at build time as raw strings.
const sourceFiles = import.meta.glob("/src/**/*.{ts,tsx,css,js,jsx,json}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

function buildBundle() {
  const entries = Object.entries(sourceFiles).sort(([a], [b]) => a.localeCompare(b));
  return entries
    .map(([path, code]) => {
      const rel = path.replace(/^\//, "");
      return `${"=".repeat(72)}\nFILE: ${rel}\n${"=".repeat(72)}\n\n${code}\n`;
    })
    .join("\n");
}

export default function CodeExport() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const bundle = useMemo(buildBundle, []);
  const fileCount = Object.keys(sourceFiles).length;

  const download = () => {
    const blob = new Blob([bundle], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-source-code.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bundle);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-[60]">
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="glass-btn rounded-full h-11 w-11 flex items-center justify-center text-base text-ink"
          title="Get the source code"
          aria-label="Get the source code"
        >
          {open ? "✕" : "</>"}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="glass absolute bottom-[calc(100%+0.6rem)] right-0 w-60 rounded-2xl p-4 text-left"
            >
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-terra mb-1">Source code</div>
              <div className="font-mono text-[10px] text-ink-mute mb-3">{fileCount} files bundled</div>
              <div className="space-y-2">
                <button
                  onClick={download}
                  className="glass-btn glass-btn-active w-full rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em]"
                >
                  ↓ Download .txt
                </button>
                <button
                  onClick={copy}
                  className="glass-btn w-full rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink"
                >
                  {copied ? "✓ Copied!" : "⧉ Copy all code"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
