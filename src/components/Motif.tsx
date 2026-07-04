/**
 * Bespoke micro-iconography: each card/section gets a small theme-aware SVG
 * motif tied to its content — a matrix for the Linear Algebra TA, head/tail
 * arrows for the SPSC queue, a lag gauge for Kafka — instead of generic icons.
 */
export type MotifName =
  | "headtail"
  | "gauge"
  | "postings"
  | "heatpatch"
  | "waveform"
  | "canvas"
  | "kv"
  | "trophy"
  | "medal"
  | "matrix"
  | "tiles"
  | "graph"
  | "chip";

export default function Motif({ name, size = 34 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 34 34", "aria-hidden": true as const };
  switch (name as MotifName) {
    case "headtail": // ring buffer: circle of slots + head/tail arrows
      return (
        <svg {...common}>
          <circle cx="17" cy="17" r="11" fill="none" stroke="var(--line-strong)" strokeWidth="4" strokeDasharray="4.5 2.5" />
          <circle cx="17" cy="17" r="11" fill="none" stroke="var(--cyan)" strokeWidth="4" strokeDasharray="16 53.1" strokeLinecap="butt" transform="rotate(-45 17 17)" />
          <path d="M27 8l3.4 2-3.6 1.6z" fill="var(--lime)" />
          <path d="M7 26l-3.4-2 3.6-1.6z" fill="var(--amber)" />
        </svg>
      );
    case "gauge": // consumer-lag gauge
      return (
        <svg {...common}>
          <path d="M5 24a12 12 0 0 1 24 0" fill="none" stroke="var(--line-strong)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M5 24a12 12 0 0 1 9-11.6" fill="none" stroke="var(--lime)" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="17" y1="24" x2="11" y2="15" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="17" cy="24" r="2.2" fill="var(--amber)" />
        </svg>
      );
    case "postings": // inverted index postings lists
      return (
        <svg {...common}>
          <rect x="4" y="6" width="7" height="5" rx="1" fill="var(--cyan)" opacity="0.9" />
          <rect x="13" y="6" width="5" height="5" rx="1" fill="var(--line-strong)" />
          <rect x="20" y="6" width="5" height="5" rx="1" fill="var(--cyan)" opacity="0.45" />
          <rect x="4" y="14" width="7" height="5" rx="1" fill="var(--violet)" opacity="0.9" />
          <rect x="13" y="14" width="5" height="5" rx="1" fill="var(--violet)" opacity="0.45" />
          <rect x="4" y="22" width="7" height="5" rx="1" fill="var(--lime)" opacity="0.9" />
          <rect x="13" y="22" width="5" height="5" rx="1" fill="var(--line-strong)" />
          <rect x="20" y="22" width="5" height="5" rx="1" fill="var(--lime)" opacity="0.45" />
          <rect x="27" y="22" width="3" height="5" rx="1" fill="var(--lime)" opacity="0.3" />
        </svg>
      );
    case "heatpatch": // anomaly heatmap patches
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => {
              const hot = (r === 1 && c === 2) || (r === 2 && c === 2);
              const warm = (r === 1 && c === 1) || (r === 2 && c === 1) || (r === 0 && c === 2);
              return (
                <rect
                  key={`${r}${c}`}
                  x={4 + c * 7}
                  y={4 + r * 7}
                  width="6"
                  height="6"
                  rx="1"
                  fill={hot ? "var(--red)" : warm ? "var(--amber)" : "var(--line-strong)"}
                  opacity={hot ? 0.95 : warm ? 0.75 : 0.5}
                />
              );
            })
          )}
        </svg>
      );
    case "waveform":
      return (
        <svg {...common}>
          {[5, 9, 13, 17, 21, 25, 29].map((x, i) => {
            const h = [6, 14, 22, 10, 18, 8, 12][i];
            return (
              <rect key={x} x={x - 1.4} y={17 - h / 2} width="2.8" height={h} rx="1.4" fill={i % 2 ? "var(--violet)" : "var(--cyan)"} opacity={0.55 + 0.45 * ((i * 37) % 10) / 10} />
            );
          })}
        </svg>
      );
    case "canvas": // knowledge graph on a canvas
      return (
        <svg {...common}>
          <rect x="3" y="5" width="28" height="22" rx="3" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
          <line x1="10" y1="12" x2="20" y2="18" stroke="var(--cyan)" strokeWidth="1.2" />
          <line x1="20" y1="18" x2="25" y2="11" stroke="var(--cyan)" strokeWidth="1.2" />
          <line x1="10" y1="12" x2="14" y2="22" stroke="var(--cyan)" strokeWidth="1.2" />
          <circle cx="10" cy="12" r="2.6" fill="var(--lime)" />
          <circle cx="20" cy="18" r="2.6" fill="var(--cyan)" />
          <circle cx="25" cy="11" r="2.2" fill="var(--violet)" />
          <circle cx="14" cy="22" r="2.2" fill="var(--amber)" />
        </svg>
      );
    case "kv":
      return (
        <svg {...common}>
          <rect x="4" y="7" width="11" height="8" rx="2" fill="var(--cyan)" opacity="0.85" />
          <rect x="19" y="7" width="11" height="8" rx="2" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
          <rect x="4" y="19" width="11" height="8" rx="2" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
          <rect x="19" y="19" width="11" height="8" rx="2" fill="var(--lime)" opacity="0.85" />
          <line x1="15" y1="11" x2="19" y2="11" stroke="var(--ink-faint)" strokeWidth="1.4" />
          <line x1="15" y1="23" x2="19" y2="23" stroke="var(--ink-faint)" strokeWidth="1.4" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path d="M11 6h12v7a6 6 0 0 1-12 0z" fill="var(--amber)" opacity="0.9" />
          <path d="M11 8H6a5 5 0 0 0 5 6M23 8h5a5 5 0 0 1-5 6" fill="none" stroke="var(--amber)" strokeWidth="1.8" />
          <rect x="15" y="19" width="4" height="4" fill="var(--amber)" opacity="0.7" />
          <rect x="11" y="24" width="12" height="3" rx="1" fill="var(--amber)" />
        </svg>
      );
    case "medal":
      return (
        <svg {...common}>
          <path d="M12 4h4l2 7h-4zM22 4h-4l-2 7h4z" fill="var(--cyan)" opacity="0.6" />
          <circle cx="17" cy="19" r="8" fill="none" stroke="var(--amber)" strokeWidth="2" />
          <path d="M17 14l1.6 3.2 3.6.5-2.6 2.5.6 3.5-3.2-1.7-3.2 1.7.6-3.5-2.6-2.5 3.6-.5z" fill="var(--amber)" />
        </svg>
      );
    case "matrix": // 2x2 matrix with brackets — linear algebra
      return (
        <svg {...common}>
          <path d="M8 5H5v24h3" fill="none" stroke="var(--ink-dim)" strokeWidth="1.8" />
          <path d="M26 5h3v24h-3" fill="none" stroke="var(--ink-dim)" strokeWidth="1.8" />
          <text x="12" y="15" fontFamily="var(--font-mono)" fontSize="9" fill="var(--cyan)">λ</text>
          <text x="20" y="15" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-dim)">0</text>
          <text x="12" y="26" fontFamily="var(--font-mono)" fontSize="8" fill="var(--ink-dim)">0</text>
          <text x="19" y="26" fontFamily="var(--font-mono)" fontSize="9" fill="var(--violet)">λ</text>
        </svg>
      );
    case "tiles": // image slicing grid with detection box
      return (
        <svg {...common}>
          <rect x="4" y="6" width="26" height="20" rx="2" fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
          <line x1="12.7" y1="6" x2="12.7" y2="26" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2.5 2" />
          <line x1="21.4" y1="6" x2="21.4" y2="26" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2.5 2" />
          <line x1="4" y1="16" x2="30" y2="16" stroke="var(--line-strong)" strokeWidth="1" strokeDasharray="2.5 2" />
          <rect x="14.5" y="17.5" width="5.5" height="5.5" fill="none" stroke="var(--lime)" strokeWidth="1.6" />
          <circle cx="17.2" cy="20.2" r="1.3" fill="var(--lime)" />
        </svg>
      );
    case "graph":
      return (
        <svg {...common}>
          <line x1="8" y1="9" x2="17" y2="16" stroke="var(--line-strong)" strokeWidth="1.3" />
          <line x1="17" y1="16" x2="26" y2="9" stroke="var(--line-strong)" strokeWidth="1.3" />
          <line x1="17" y1="16" x2="11" y2="26" stroke="var(--cyan)" strokeWidth="1.6" />
          <line x1="17" y1="16" x2="24" y2="25" stroke="var(--line-strong)" strokeWidth="1.3" />
          <circle cx="8" cy="9" r="3" fill="var(--cyan)" />
          <circle cx="26" cy="9" r="3" fill="var(--line-strong)" />
          <circle cx="17" cy="16" r="3.4" fill="var(--lime)" />
          <circle cx="11" cy="26" r="3" fill="var(--cyan)" opacity="0.6" />
          <circle cx="24" cy="25" r="3" fill="var(--line-strong)" />
        </svg>
      );
    case "chip":
    default:
      return (
        <svg {...common}>
          <rect x="8" y="8" width="18" height="18" rx="3" fill="none" stroke="var(--cyan)" strokeWidth="1.6" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" fill="var(--cyan)" opacity="0.5" />
          {[11, 17, 23].map((p) => (
            <g key={p} stroke="var(--ink-faint)" strokeWidth="1.4">
              <line x1={p} y1="4" x2={p} y2="8" />
              <line x1={p} y1="26" x2={p} y2="30" />
              <line x1="4" y1={p} x2="8" y2={p} />
              <line x1="26" y1={p} x2="30" y2={p} />
            </g>
          ))}
        </svg>
      );
  }
}
