import { useTick } from "./useTick";

const COLS = 16;
const ROWS = 6;
const CELL = 26;
const GAP = 5;

/** Memory-block grid with a cache-line highlight sweeping row by row. */
export default function CacheGrid({ compact = false }: { compact?: boolean }) {
  const tick = useTick(900);
  const activeRow = tick % ROWS;

  const w = COLS * (CELL + GAP) + GAP;
  const h = ROWS * (CELL + GAP) + GAP + 20;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: compact ? 420 : 620, display: "block" }} role="img" aria-label="Cache line sweep across a memory grid">
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => {
          const active = r === activeRow;
          const hot = active && (c * 7 + tick * 3) % 5 === 0;
          return (
            <rect
              key={`${r}-${c}`}
              x={GAP + c * (CELL + GAP)}
              y={GAP + r * (CELL + GAP)}
              width={CELL}
              height={CELL}
              rx="4"
              fill={hot ? "var(--cyan)" : active ? "var(--cyan-soft)" : "var(--panel-strong)"}
              stroke={active ? "color-mix(in srgb, var(--cyan) 45%, transparent)" : "var(--line)"}
              strokeWidth="1"
              style={{ transition: "fill 0.5s, stroke 0.5s" }}
            />
          );
        })
      )}
      <text x={GAP} y={h - 5} fontFamily="var(--font-mono)" fontSize="11" fill="var(--ink-faint)">
        line {activeRow} → 0x{(0x7f2a + activeRow * 64).toString(16).toUpperCase()} · 64B stride
      </text>
    </svg>
  );
}
