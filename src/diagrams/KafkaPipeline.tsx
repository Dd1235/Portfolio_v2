import { useTick } from "./useTick";

const PHASE_LEN = 24;

/**
 * Producer → broker → consumer flow. Lag builds under overload until the
 * backpressure controller pauses intake, drains, and resumes.
 */
export default function KafkaPipeline({ compact = false }: { compact?: boolean }) {
  const tick = useTick(420);
  const phase = tick % PHASE_LEN;

  // 0-9: lag builds · 10-16: paused, draining · 17-23: recovered flow
  const paused = phase >= 10 && phase <= 16;
  const lag = phase < 10 ? 2 + phase : phase <= 16 ? 12 - (phase - 10) * 1.6 : 2;
  const lagFrac = Math.max(0.05, Math.min(1, lag / 12));
  const state = paused ? "PAUSED" : phase < 10 ? "RISING" : "OK";

  const dotXs = [0, 1, 2, 3].map((i) => 88 + (((tick * 14 + i * 38) % 130)));

  return (
    <svg viewBox="0 0 520 190" style={{ width: "100%", maxWidth: compact ? 460 : 640, display: "block" }} role="img" aria-label="Kafka pipeline with adaptive backpressure">
      <g fontFamily="var(--font-mono)">
        {/* producer */}
        <rect x="14" y="52" width="72" height="52" rx="8" fill="var(--panel-strong)" stroke="var(--line-strong)" />
        <text x="50" y="75" textAnchor="middle" fontSize="10.5" fill="var(--ink)">producer</text>
        <text x="50" y="90" textAnchor="middle" fontSize="9" fill="var(--lime)">9.9k msg/s</text>

        {/* flow producer → broker */}
        <line x1="88" y1="78" x2="218" y2="78" stroke="var(--line-strong)" strokeDasharray="3 4" />
        {!paused &&
          dotXs.map((x, i) => <circle key={i} cx={x} cy={78} r="3" fill="var(--cyan)" opacity="0.85" />)}
        {paused && (
          <g>
            <line x1="140" y1="66" x2="140" y2="90" stroke="var(--amber)" strokeWidth="2.5" />
            <line x1="148" y1="66" x2="148" y2="90" stroke="var(--amber)" strokeWidth="2.5" />
          </g>
        )}

        {/* broker log */}
        <rect x="220" y="40" width="88" height="76" rx="8" fill="var(--panel-strong)" stroke="var(--line-strong)" />
        <text x="264" y="58" textAnchor="middle" fontSize="10.5" fill="var(--ink)">broker log</text>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={232}
            y={66 + i * 10}
            width={Math.max(8, 64 * lagFrac - i * 9)}
            height="6"
            rx="2"
            fill={lagFrac > 0.7 ? "var(--amber)" : "var(--cyan)"}
            opacity={0.9 - i * 0.18}
            style={{ transition: "width 0.35s, fill 0.35s" }}
          />
        ))}

        {/* flow broker → consumer */}
        <line x1="310" y1="78" x2="428" y2="78" stroke="var(--line-strong)" strokeDasharray="3 4" />
        <circle cx={318 + ((tick * 9) % 104)} cy="78" r="3" fill="var(--lime)" opacity="0.9" />

        {/* consumer */}
        <rect x="430" y="52" width="76" height="52" rx="8" fill="var(--panel-strong)" stroke="var(--line-strong)" />
        <text x="468" y="75" textAnchor="middle" fontSize="10.5" fill="var(--ink)">consumer</text>
        <text x="468" y="90" textAnchor="middle" fontSize="9" fill="var(--ink-faint)">slow</text>

        {/* controller feedback arc */}
        <path d="M468 104 Q 380 158 148 96" fill="none" stroke={paused ? "var(--amber)" : "var(--ink-faint)"} strokeWidth="1.3" strokeDasharray="4 4" style={{ transition: "stroke 0.3s" }} />
        <text x="300" y="146" textAnchor="middle" fontSize="9" fill={paused ? "var(--amber)" : "var(--ink-faint)"}>
          adaptive controller · pause ≠ resume threshold
        </text>

        {/* lag gauge */}
        <text x="14" y="176" fontSize="9.5" fill="var(--ink-faint)">consumer lag</text>
        <rect x="104" y="167" width="300" height="10" rx="5" fill="var(--panel-strong)" stroke="var(--line)" />
        <rect x="104" y="167" width={300 * lagFrac} height="10" rx="5" fill={lagFrac > 0.7 ? "var(--amber)" : "var(--lime)"} style={{ transition: "width 0.35s, fill 0.35s" }} />
        <text x="414" y="176" fontSize="9.5" fill={paused ? "var(--amber)" : "var(--lime)"} style={{ transition: "fill 0.3s" }}>
          {state}
        </text>
      </g>
    </svg>
  );
}
