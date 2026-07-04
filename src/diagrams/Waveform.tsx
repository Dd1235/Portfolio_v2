import { useTick } from "./useTick";

const STAGES = ["qwen 2 · lyrics", "ace-step · music", "sdxl · art"];

/** Prompt → generation stages → animated waveform. */
export default function Waveform({ compact = false }: { compact?: boolean }) {
  const tick = useTick(600);
  const active = tick % STAGES.length;
  const bars = 36;

  return (
    <svg viewBox="0 0 520 160" style={{ width: "100%", maxWidth: compact ? 460 : 640, display: "block" }} role="img" aria-label="Generative music pipeline with waveform">
      <g fontFamily="var(--font-mono)">
        <rect x="14" y="14" width="150" height="22" rx="11" fill="var(--panel-strong)" stroke="var(--line-strong)" />
        <text x="89" y="29" textAnchor="middle" fontSize="9.5" fill="var(--ink-dim)">"dreamy synthwave…"</text>

        {STAGES.map((s, i) => (
          <g key={s}>
            <rect
              x={190 + i * 112}
              y={14}
              width={102}
              height={22}
              rx="6"
              fill={i === active ? "var(--violet-soft)" : "var(--panel-strong)"}
              stroke={i === active ? "var(--violet)" : "var(--line)"}
              style={{ transition: "fill 0.4s, stroke 0.4s" }}
            />
            <text x={241 + i * 112} y={29} textAnchor="middle" fontSize="9" fill={i === active ? "var(--violet)" : "var(--ink-faint)"} style={{ transition: "fill 0.4s" }}>
              {s}
            </text>
          </g>
        ))}

        {Array.from({ length: bars }, (_, i) => {
          const base = 12 + 34 * Math.abs(Math.sin(i * 0.55 + 1.3));
          const wob = 1 + 0.35 * Math.sin((tick + i) * 0.9);
          const h = Math.min(58, base * wob);
          return (
            <rect
              key={i}
              x={16 + i * 14}
              y={104 - h / 2}
              width="8"
              height={h}
              rx="4"
              fill={i % 3 === 0 ? "var(--violet)" : "var(--cyan)"}
              opacity={0.45 + 0.5 * Math.abs(Math.sin(i * 0.7))}
              style={{ transition: "height 0.5s, y 0.5s" }}
            />
          );
        })}
        <text x="16" y="150" fontSize="9.5" fill="var(--ink-faint)">async gpu jobs · modal + inngest · s3 delivery</text>
      </g>
    </svg>
  );
}
