import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload: {
    commits?: Array<{ message: string }>;
    ref?: string;
    ref_type?: string;
    action?: string;
    pull_request?: { title: string };
    issue?: { title: string };
    forkee?: { full_name: string };
  };
  created_at: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shortRepo(fullName: string): string {
  const parts = fullName.split("/");
  return parts[parts.length - 1] ?? fullName;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function describeEvent(event: GitHubEvent): string {
  const { type, payload } = event;
  switch (type) {
    case "PushEvent": {
      const count = payload.commits?.length ?? 0;
      const msg = payload.commits?.[0]?.message ?? "";
      const short = msg.length > 50 ? msg.slice(0, 50) + "…" : msg;
      return count > 1 ? `${count} commits — ${short}` : short || `${count} commit`;
    }
    case "CreateEvent":
      return `Created ${payload.ref_type ?? "ref"}${payload.ref ? ` "${payload.ref}"` : ""}`;
    case "DeleteEvent":
      return `Deleted ${payload.ref_type ?? "ref"}${payload.ref ? ` "${payload.ref}"` : ""}`;
    case "PullRequestEvent":
      return `PR ${payload.action ?? ""}: ${payload.pull_request?.title ?? ""}`;
    case "IssuesEvent":
      return `Issue ${payload.action ?? ""}: ${payload.issue?.title ?? ""}`;
    case "IssueCommentEvent":
      return "Commented on an issue";
    case "WatchEvent":
      return "Starred repository";
    case "ForkEvent":
      return `Forked to ${payload.forkee?.full_name ?? ""}`;
    case "ReleaseEvent":
      return "Published a release";
    case "PublicEvent":
      return "Made repository public";
    default:
      return type.replace("Event", "");
  }
}

// ─── Icon components ──────────────────────────────────────────────────────────

function IconCommit() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M10.5 7.75a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm1.43.75a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5z" />
    </svg>
  );
}

function IconBranch() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M11.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm-2.25.75a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.492 2.492 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25zM4.25 12a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM3.5 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z" />
    </svg>
  );
}

function IconPR() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354zM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zm8.25.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0z" />
    </svg>
  );
}

function IconIssue() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z" />
    </svg>
  );
}

function IconFork() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0zM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z" />
    </svg>
  );
}

function IconDefault() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 shrink-0">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

function eventIcon(type: string) {
  switch (type) {
    case "PushEvent": return <IconCommit />;
    case "CreateEvent":
    case "DeleteEvent": return <IconBranch />;
    case "PullRequestEvent": return <IconPR />;
    case "IssuesEvent":
    case "IssueCommentEvent": return <IconIssue />;
    case "WatchEvent": return <IconStar />;
    case "ForkEvent": return <IconFork />;
    default: return <IconDefault />;
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-3 px-4 py-3 animate-pulse"
          style={i < 4 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : undefined}
        >
          <div className="w-4 h-4 rounded-full mt-0.5 bg-white/10 shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-3 w-12 rounded bg-white/10 ml-auto" />
            </div>
            <div className="h-3 w-3/4 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/users/adriarroyo08/events/public?per_page=10", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<GitHubEvent[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setEvents(data.slice(0, 5));
        setStatus("ok");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => { cancelled = true; };
  }, []);

  if (status === "loading") {
    return (
      <div
        className="card overflow-hidden"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        <Skeleton />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="card px-4 py-6 text-center" style={{ color: "var(--color-text-muted)" }}>
        <span className="text-sm">GitHub activity unavailable</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="card px-4 py-6 text-center" style={{ color: "var(--color-text-muted)" }}>
        <span className="text-sm">No recent activity</span>
      </div>
    );
  }

  return (
    <div
      className="card overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {events.map((event, i) => {
        const repo = shortRepo(event.repo.name);
        const ago = timeAgo(event.created_at);
        const desc = describeEvent(event);
        const isLast = i === events.length - 1;

        return (
          <div
            key={event.id}
            className="flex items-start gap-3 px-4 py-3 transition-colors duration-150"
            style={{
              borderBottom: isLast ? undefined : "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "rgba(0,255,136,0.03)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background = "transparent";
            }}
          >
            {/* Icon */}
            <span
              className="mt-0.5 shrink-0"
              style={{ color: "var(--color-green)" }}
              aria-hidden="true"
            >
              {eventIcon(event.type)}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span
                  className="text-xs font-semibold truncate"
                  style={{ color: "var(--color-green)" }}
                  title={event.repo.name}
                >
                  {repo}
                </span>
                <span
                  className="text-xs shrink-0"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {ago}
                </span>
              </div>
              <p
                className="text-xs leading-snug truncate"
                style={{ color: "var(--color-text-secondary)" }}
                title={desc}
              >
                {desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
