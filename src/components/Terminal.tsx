import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LineKind = "command" | "output" | "system" | "error" | "ascii";

interface TerminalLine {
  id: number;
  kind: LineKind;
  text: string;
}

// ─── Boot sequence ───────────────────────────────────────────────────────────

const STACK_JSON = `{
  "backend":  ["Java", "Spring Boot", "Python"],
  "devops":   ["Azure DevOps", "Docker", "CI/CD"],
  "ai":       ["Claude Code", "MCP Servers", "Custom Skills"],
  "frontend": ["HTML/CSS", "JavaScript", "React"]
}`;

const BOOT_SEQUENCE: Array<{ cmd: string; output: string }> = [
  { cmd: "whoami", output: "Adrian Arroyo Perez — Fullstack Developer & AI Engineer" },
  { cmd: "cat stack.json", output: STACK_JSON },
  { cmd: "ls projects/ --highlight", output: "petwatch/  ahorrapp/  trading-bot/  ci-cd-pipelines/  e2e-testing/  login-abstracto/" },
  { cmd: "cat philosophy.txt", output: `"I don't just write code. I build systems that build themselves."` },
];

// ─── Command responses ──────────────────────────────────────────────────────

const HELP_TEXT = `Available commands:
  help          — show this help message
  about         — a little about me
  skills        — view full tech stack
  projects      — go to projects section
  contact       — go to contact section
  clear         — clear the terminal
  history       — show command history
  neofetch      — system info
  pokemon       — catch a wild Pokemon
  matrix        — enter the matrix
  date          — current date
  weather       — check the weather
  echo <text>   — echo text back
  sudo hire adrian  — you know what to do
  ↑/↓           — navigate command history
`;

const ABOUT_TEXT = `Adrian Arroyo Perez
  Role    : Fullstack Developer & AI Engineer
  Location: Cordoba, Spain
  Focus   : Building AI-powered systems, automation pipelines,
            and production-grade full-stack applications.
  Fun     : Pokemon fan, WearOS hacker, trading bot builder
  Currently shipping projects that ship themselves.
`;

const SKILLS_TEXT = `Tech Stack:
  Backend  → Java, Spring Boot, Python, Kotlin
  DevOps   → Azure DevOps, Docker, CI/CD, Linux
  AI / LLM → Claude Code, MCP Servers, Custom Skills
  Frontend → HTML/CSS, JavaScript, React, Astro
  Testing  → Playwright, JUnit, E2E automation
  Data     → SQL, SQLite, PostgreSQL
`;

const HIRE_TEXT = `[sudo] password for recruiter: ************
Verifying credentials...
Access granted ✓
Downloading CV...
████████████████████ 100%
Opening email client...
Done. Welcome aboard. (seriously, let's talk → adriarroyo2002@gmail.com)
`;

const NEOFETCH = `
  ┌──────────────────────┐
  │  ╔══╗  ╔══╗         │    adrian@portfolio
  │  ║AA║  ║/>║         │    ─────────────────
  │  ╚══╝  ╚══╝         │    OS: Web (Astro 5 + React)
  │                      │    Host: Oracle Cloud, Cordoba ES
  │   ██████████████     │    Kernel: Node.js 22
  │   █ Adrian      █    │    Shell: Terminal.tsx v2.0
  │   █ Arroyo      █    │    Theme: Dark [gradient-green]
  │   █ Perez       █    │    WM: Three.js particles
  │   ██████████████     │    CPU: Claude Opus 4.6 (AI co-pilot)
  │                      │    GPU: Tailwind CSS v4
  └──────────────────────┘    Uptime: since Oct 2024
`;

const POKEMON_ART = [
  { name: "Pikachu", art: `
    ⠀⠀⠀⠀⣀⣤⣤⣄⡀
    ⠀⠀⢠⣾⣿⣿⣿⣿⣿⣷⡀
    ⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄
    ⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇   ⚡ A wild Pikachu appeared!
    ⠸⣿⣿⣿⡟⠛⠛⢿⣿⣿⣿⡇   Type: Electric
    ⠀⠹⣿⡿⠁⣠⣤⡀⠹⣿⣿⠃   "Pika pika!"
    ⠀⠀⠈⠁⢰⣿⣿⡇⠀⠀⠁
    ⠀⠀⠀⠀⠈⠛⠛⠁
` },
  { name: "Charmander", art: `
    ⠀⠀⠀⠀⠀⢀⣤⣶⣶⣄
    ⠀⠀⠀⠀⣴⣿⣿⣿⣿⣿⣆
    ⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⡆
    ⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⡇   🔥 A wild Charmander appeared!
    ⠀⠀⠸⣿⣿⠿⠛⠛⢿⣿⣿⡇   Type: Fire
    ⠀⠀⠀⠻⠁⢀⣠⣤⠀⠹⡿⠃   "Char char!"
    ⠀⠀⠀⠀⠀⢸⣿⣿⠀
    ⠀⠀⠀⠀⠀⠈⠛⠋⢀⣠⡄
` },
  { name: "Bulbasaur", art: `
    ⠀⠀⠀⣀⣀⣀⡀
    ⠀⣠⣿⣿⣿⣿⣿⣷⡀
    ⢰⣿⣿⣿⣿⣿⣿⣿⣿⡄
    ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄     🌿 A wild Bulbasaur appeared!
    ⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇     Type: Grass/Poison
    ⠘⣿⣿⣿⣿⣿⣿⡿⠟⠋       "Bulba!"
    ⠀⠈⠙⠛⠛⠋⠁
` },
  { name: "Eevee", art: `
    ⠀⠀⢀⣠⣤⣶⣶⣤⡀
    ⠀⣴⣿⣿⣿⣿⣿⣿⣷⡄
    ⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
    ⠸⣿⣿⡿⠋⠙⢿⣿⣿⡿       ✨ A wild Eevee appeared!
    ⠀⠹⡿⠁⣤⣤⡀⠙⠿⠃       Type: Normal
    ⠀⠀⠀⢸⣿⣿⡇             "Eevee!"
    ⠀⠀⠀⠀⠙⠛⠁
` },
  { name: "Gengar", art: `
    ⠀⠀⣠⣶⣿⣿⣶⣄
    ⠀⣼⣿⣿⣿⣿⣿⣿⣷
    ⢸⣿⣿⣿⣿⣿⣿⣿⣿⡇
    ⣿⡟⠛⣿⣿⣿⡟⠛⢿⣿     👻 A wild Gengar appeared!
    ⢿⣇⣀⣿⠟⠻⣿⣀⣸⡿     Type: Ghost/Poison
    ⠘⢿⣿⣿⣶⣶⣿⣿⡿⠁     "Gengar... hehehe"
    ⠀⠀⠉⠛⠛⠛⠛⠉
` },
];

const WEATHER_TEXT = `Weather in Cordoba, Spain:
  🌡️  32°C  ☀️ Sunny
  💧 Humidity: 25%
  💨 Wind: 12 km/h SW
  (Perfect coding weather)
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
  const [typingCmd, setTypingCmd] = useState<string | null>(null);
  const [matrixMode, setMatrixMode] = useState(false);

  // Command history
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef(false);
  const matrixRef = useRef<number | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typingCmd]);

  const handleTerminalClick = useCallback(() => {
    if (!booting) inputRef.current?.focus();
  }, [booting]);

  // ── Boot sequence ─────────────────────────────────────────────────────────

  useEffect(() => {
    abortRef.current = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => { setTimeout(resolve, ms); });

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
        setLines((prev) => [
          ...prev,
          mkLine("command", `$ ${cmd}`),
          mkLine("output", output),
        ]);
        await sleep(350);
      }
      setBooting(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    runBoot();
    return () => { abortRef.current = true; };
  }, []);

  // ── Matrix effect ─────────────────────────────────────────────────────────

  const startMatrix = useCallback(() => {
    setMatrixMode(true);
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";
    let count = 0;
    matrixRef.current = window.setInterval(() => {
      const line = Array.from({ length: 60 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("");
      setLines((prev) => [...prev, mkLine("system", line)]);
      count++;
      if (count >= 15) {
        if (matrixRef.current) clearInterval(matrixRef.current);
        setLines((prev) => [
          ...prev,
          mkLine("output", ""),
          mkLine("output", "Wake up, Adrian..."),
          mkLine("output", "The Matrix has you..."),
          mkLine("output", "Follow the white rabbit. 🐇"),
          mkLine("output", ""),
        ]);
        setMatrixMode(false);
      }
    }, 120);
  }, []);

  // Cleanup matrix on unmount
  useEffect(() => {
    return () => { if (matrixRef.current) clearInterval(matrixRef.current); };
  }, []);

  // ── Command handler ───────────────────────────────────────────────────────

  const handleCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    const cmd = trimmed.toLowerCase();
    const pushCmd = (text: string) => mkLine("command", `$ ${text}`);

    if (cmd === "") return;

    // Add to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    if (cmd === "help") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", HELP_TEXT)]);
      return;
    }

    if (cmd === "about") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", ABOUT_TEXT)]);
      return;
    }

    if (cmd === "skills") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", SKILLS_TEXT)]);
      return;
    }

    if (cmd === "projects") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("system", "Navigating to #projects...")]);
      setTimeout(() => { window.location.hash = "#projects"; }, 400);
      return;
    }

    if (cmd === "contact") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("system", "Navigating to #contact...")]);
      setTimeout(() => { window.location.hash = "#contact"; }, 400);
      return;
    }

    if (cmd === "sudo hire adrian") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", HIRE_TEXT)]);
      return;
    }

    if (cmd === "neofetch") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("ascii", NEOFETCH)]);
      return;
    }

    if (cmd === "pokemon") {
      const poke = POKEMON_ART[Math.floor(Math.random() * POKEMON_ART.length)];
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("ascii", poke.art)]);
      return;
    }

    if (cmd === "matrix") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("system", "Entering the Matrix...")]);
      setTimeout(startMatrix, 300);
      return;
    }

    if (cmd === "date") {
      const now = new Date().toLocaleString("es-ES", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      });
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", now)]);
      return;
    }

    if (cmd === "weather") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", WEATHER_TEXT)]);
      return;
    }

    if (cmd === "history") {
      const hist = history.map((h, i) => `  ${i + 1}  ${h}`).join("\n") || "  (empty)";
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", hist)]);
      return;
    }

    if (cmd.startsWith("echo ")) {
      const text = trimmed.slice(5);
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", text)]);
      return;
    }

    if (cmd === "whoami") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", "Adrian Arroyo Perez — Fullstack Developer & AI Engineer")]);
      return;
    }

    if (cmd === "pwd") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", "/home/adrian/portfolio")]);
      return;
    }

    if (cmd === "ls") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", "about.md  projects/  stack.json  philosophy.txt  cv.pdf  .secrets")]);
      return;
    }

    if (cmd === "cat .secrets") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", "Nice try 😏 — There are no secrets here, just clean code.")]);
      return;
    }

    if (cmd === "exit") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("system", "Why would you leave? There's so much to explore! 🚀")]);
      return;
    }

    if (cmd === "rm -rf /") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("error", "Permission denied. Nice try though. 🛡️")]);
      return;
    }

    if (cmd === "sudo rm -rf /") {
      setLines((prev) => [
        ...prev, pushCmd(trimmed),
        mkLine("error", "🚨 ALERT: Self-destruct sequence initiated..."),
        mkLine("error", "Just kidding. This portfolio is indestructible."),
      ]);
      return;
    }

    if (cmd === "coffee" || cmd === "cafe") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", "☕ Brewing coffee...\n████████████████████ 100%\nHere you go! Now let's code.")]);
      return;
    }

    if (cmd === "42") {
      setLines((prev) => [...prev, pushCmd(trimmed), mkLine("output", "The Answer to the Ultimate Question of Life, the Universe, and Everything.")]);
      return;
    }

    // Unknown command
    setLines((prev) => [
      ...prev,
      pushCmd(trimmed),
      mkLine("error", `command not found: ${trimmed}. Type 'help' for available commands.`),
    ]);
  }, [history, startMatrix]);

  // ── Key handler with history ──────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (matrixMode) return;

      if (e.key === "Enter") {
        handleCommand(inputValue);
        setInputValue("");
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHistoryIdx((prev) => {
          const next = prev === -1 ? history.length - 1 : Math.max(0, prev - 1);
          if (history[next]) setInputValue(history[next]);
          return next;
        });
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHistoryIdx((prev) => {
          const next = prev + 1;
          if (next >= history.length) {
            setInputValue("");
            return -1;
          }
          setInputValue(history[next]);
          return next;
        });
        return;
      }

      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
        return;
      }
    },
    [inputValue, handleCommand, history, matrixMode]
  );

  // ── Konami code listener ──────────────────────────────────────────────────

  useEffect(() => {
    const code = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let idx = 0;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === code[idx]) {
        idx++;
        if (idx === code.length) {
          idx = 0;
          setLines((prev) => [
            ...prev,
            mkLine("system", "🎮 KONAMI CODE ACTIVATED!"),
            mkLine("ascii", `
  ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
  ★                                     ★
  ★   🏆 ACHIEVEMENT UNLOCKED!          ★
  ★   "The Secret Gamer"                ★
  ★                                     ★
  ★   You found the Konami Code.        ★
  ★   +30 lives, infinite ammo,         ★
  ★   and my eternal respect.           ★
  ★                                     ★
  ★   Now go play PetWatch! 🎮          ★
  ★                                     ★
  ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
`),
          ]);
        }
      } else {
        idx = e.key === code[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Line renderer ─────────────────────────────────────────────────────────

  const renderLine = (line: TerminalLine) => {
    const base = "whitespace-pre-wrap break-words leading-relaxed";
    switch (line.kind) {
      case "command":
        return <div key={line.id} className={`${base} text-[#00ff88] font-semibold`}>{line.text}</div>;
      case "output":
        return <div key={line.id} className={`${base} text-white/90 pl-2`}>{line.text}</div>;
      case "system":
        return <div key={line.id} className={`${base} text-zinc-400 italic`}>{line.text}</div>;
      case "error":
        return <div key={line.id} className={`${base} text-red-400`}>{line.text}</div>;
      case "ascii":
        return <div key={line.id} className={`${base} text-[#00ff88]/80 text-xs leading-none`}>{line.text}</div>;
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────

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
      <div className={`bg-black/60 p-5 min-h-[320px] max-h-[520px] overflow-y-auto text-sm flex flex-col gap-1 cursor-text ${matrixMode ? "text-[#00ff88]" : ""}`}>
        {lines.map(renderLine)}

        {typingCmd !== null && (
          <div className="text-[#00ff88] font-semibold whitespace-pre-wrap break-words leading-relaxed">
            {typingCmd}
            <span className="inline-block w-[2px] h-[1em] bg-[#00ff88] ml-px align-middle animate-pulse" />
          </div>
        )}

        {!booting && typingCmd === null && !matrixMode && (
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
                placeholder="type a command... (try 'help')"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
