import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LineKind = "command" | "output" | "system" | "error";

interface TerminalLine {
  id: number;
  kind: LineKind;
  text: string;
}

// ─── Boot sequence definition ─────────────────────────────────────────────────

const STACK_JSON = `{
  "backend":  ["Java", "Spring Boot", "Python"],
  "devops":   ["Azure DevOps", "Docker", "CI/CD"],
  "ai":       ["Claude Code", "MCP Servers", "Custom Skills"],
  "frontend": ["HTML/CSS", "JavaScript", "React"]
}`;

const BOOT_SEQUENCE: Array<{ cmd: string; output: string }> = [
  {
    cmd: "whoami",
    output: "Adrian Arroyo Perez — Fullstack Developer & AI Engineer",
  },
  {
    cmd: "cat stack.json",
    output: STACK_JSON,
  },
  {
    cmd: "ls projects/ --highlight",
    output: "petwatch/  ahorrapp/  trading-bot/  ci-cd-pipelines/  e2e-testing/  login-abstracto/",
  },
  {
    cmd: "cat philosophy.txt",
    output: `"I don't just write code. I build systems that build themselves."`,
  },
];

// ─── Interactive command responses ────────────────────────────────────────────

const HELP_TEXT = `Available commands:
  help        — show this help message
  about       — a little about me
  skills      — view full tech stack
  projects    — go to projects section
  contact     — go to contact section
  clear       — clear the terminal
  sudo hire adrian  — you know what to do
`;

const ABOUT_TEXT = `Adrian Arroyo Perez
  Role    : Fullstack Developer & AI Engineer
  Location: Spain
  Focus   : Building AI-powered systems, automation pipelines,
            and production-grade full-stack applications.
  Currently shipping projects that ship themselves.
`;

const SKILLS_TEXT = `Tech Stack:
  Backend  → Java, Spring Boot, Python
  DevOps   → Azure DevOps, Docker, CI/CD pipelines
  AI / LLM → Claude Code, MCP Servers, Custom Skills
  Frontend → HTML/CSS, JavaScript, React
`;

const HIRE_TEXT = `[sudo] password for recruiter: ************
Verifying credentials...
Access granted.
Sending CV to your inbox...
████████████████████ 100%
Done. Welcome aboard. (seriously, let's talk)
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

let nextId = 0;
const mkLine = (kind: LineKind, text: string): TerminalLine => ({
  id: nextId++,
  kind,
  text,
});

const TYPING_SPEED_MS = 40;

// ─── Component ────────────────────────────────────────────────────────────────

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [booting, setBooting] = useState(true);
  // The command currently being typed character-by-character during boot
  const [typingCmd, setTypingCmd] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);

  // Auto-scroll whenever lines change or cursor moves
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typingCmd]);

  // Focus input when clicking anywhere on the terminal (after boot)
  const handleTerminalClick = useCallback(() => {
    if (!booting) inputRef.current?.focus();
  }, [booting]);

  // ── Boot sequence runner ──────────────────────────────────────────────────

  useEffect(() => {
    abortRef.current = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms);
        // tiny cleanup — not strictly needed but tidy
        return () => clearTimeout(t);
      });

    const typeCommand = async (cmd: string) => {
      const full = `$ ${cmd}`;
      for (let i = 0; i <= full.length; i++) {
        if (abortRef.current) return;
        setTypingCmd(full.slice(0, i));
        await sleep(TYPING_SPEED_MS);
      }
      setTypingCmd(null);
    };

    const runBoot = async () => {
      await sleep(300);

      for (const { cmd, output } of BOOT_SEQUENCE) {
        if (abortRef.current) return;

        await typeCommand(cmd);
        if (abortRef.current) return;

        // Commit the finished command line, then show output
        setLines((prev) => [
          ...prev,
          mkLine("command", `$ ${cmd}`),
          mkLine("output", output),
        ]);

        await sleep(350);
      }

      setBooting(false);
      // Small delay then focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    runBoot();

    return () => {
      abortRef.current = true;
    };
  }, []);

  // ── Interactive command handler ───────────────────────────────────────────

  const handleCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();

    const pushCmd = (text: string) => mkLine("command", `$ ${text}`);

    if (cmd === "") return;

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "help") {
      setLines((prev) => [...prev, pushCmd(raw), mkLine("output", HELP_TEXT)]);
      return;
    }

    if (cmd === "about") {
      setLines((prev) => [...prev, pushCmd(raw), mkLine("output", ABOUT_TEXT)]);
      return;
    }

    if (cmd === "skills") {
      setLines((prev) => [...prev, pushCmd(raw), mkLine("output", SKILLS_TEXT)]);
      return;
    }

    if (cmd === "projects") {
      setLines((prev) => [
        ...prev,
        pushCmd(raw),
        mkLine("system", "Navigating to #projects..."),
      ]);
      setTimeout(() => {
        window.location.hash = "#projects";
      }, 400);
      return;
    }

    if (cmd === "contact") {
      setLines((prev) => [
        ...prev,
        pushCmd(raw),
        mkLine("system", "Navigating to #contact..."),
      ]);
      setTimeout(() => {
        window.location.hash = "#contact";
      }, 400);
      return;
    }

    if (cmd === "sudo hire adrian") {
      setLines((prev) => [...prev, pushCmd(raw), mkLine("output", HIRE_TEXT)]);
      return;
    }

    // Unknown command
    setLines((prev) => [
      ...prev,
      pushCmd(raw),
      mkLine("error", `command not found: ${raw.trim()}. Type 'help' for available commands.`),
    ]);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleCommand(inputValue);
        setInputValue("");
      }
    },
    [inputValue, handleCommand]
  );

  // ── Line renderer ─────────────────────────────────────────────────────────

  const renderLine = (line: TerminalLine) => {
    const base = "whitespace-pre-wrap break-words leading-relaxed";

    switch (line.kind) {
      case "command":
        return (
          <div key={line.id} className={`${base} text-[#00ff88] font-semibold`}>
            {line.text}
          </div>
        );
      case "output":
        return (
          <div key={line.id} className={`${base} text-white/90 pl-2`}>
            {line.text}
          </div>
        );
      case "system":
        return (
          <div key={line.id} className={`${base} text-zinc-400 italic`}>
            {line.text}
          </div>
        );
      case "error":
        return (
          <div key={line.id} className={`${base} text-red-400`}>
            {line.text}
          </div>
        );
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 backdrop-blur-md"
      onClick={handleTerminalClick}
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900/90 border-b border-white/10 select-none">
        <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
        <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
        <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
        <span className="ml-auto text-xs text-zinc-400 tracking-wide">
          adrian@portfolio:~$
        </span>
      </div>

      {/* Terminal body */}
      <div
        className="bg-black/60 p-5 min-h-[320px] max-h-[520px] overflow-y-auto text-sm flex flex-col gap-1 cursor-text"
      >
        {/* Committed lines */}
        {lines.map(renderLine)}

        {/* Live-typing command during boot */}
        {typingCmd !== null && (
          <div className="text-[#00ff88] font-semibold whitespace-pre-wrap break-words leading-relaxed">
            {typingCmd}
            <span className="inline-block w-[2px] h-[1em] bg-[#00ff88] ml-px align-middle animate-pulse" />
          </div>
        )}

        {/* Interactive prompt — shown after boot */}
        {!booting && typingCmd === null && (
          <div className="flex items-center text-[#00ff88] font-semibold mt-1">
            <span className="shrink-0">$&nbsp;</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent outline-none border-none text-[#00ff88] caret-[#00ff88] placeholder-zinc-600 font-[inherit] text-sm"
                placeholder="type a command..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
