import { useTick } from "./useTick";

const TERMS = ["sliding", "window", "duplicates"];
const POSTINGS: Record<string, number[]> = {
  sliding: [0, 2, 5, 7],
  window: [0, 2, 4, 7, 9],
  duplicates: [2, 3, 7],
};
const RESULTS = [
  { name: "longest-substring-no-repeat", score: 0.94 },
  { name: "sliding-window-maximum", score: 0.81 },
  { name: "contains-duplicate-ii", score: 0.66 },
];

/** Query terms lighting up postings lists → BM25-ranked results. */
export default function InvertedIndex({ compact = false }: { compact?: boolean }) {
  const tick = useTick(1100);
  const active = tick % TERMS.length;

  return (
    <svg viewBox="0 0 520 200" style={{ width: "100%", maxWidth: compact ? 460 : 640, display: "block" }} role="img" aria-label="Inverted index postings lists ranking documents">
      <g fontFamily="var(--font-mono)">
        <text x="14" y="22" fontSize="10" fill="var(--ink-faint)">query</text>
        {TERMS.map((t, i) => (
          <g key={t}>
            <rect
              x={60 + i * 105}
              y={8}
              width={95}
              height={20}
              rx="10"
              fill={i === active ? "var(--cyan-soft)" : "var(--panel-strong)"}
              stroke={i === active ? "var(--cyan)" : "var(--line)"}
              style={{ transition: "fill 0.4s, stroke 0.4s" }}
            />
            <text x={107 + i * 105} y={22} textAnchor="middle" fontSize="10" fill={i === active ? "var(--cyan)" : "var(--ink-dim)"} style={{ transition: "fill 0.4s" }}>
              {t}
            </text>
          </g>
        ))}

        {TERMS.map((t, i) => (
          <g key={t}>
            <text x="14" y={62 + i * 26} fontSize="9.5" fill={i === active ? "var(--cyan)" : "var(--ink-faint)"}>
              {t.slice(0, 7)} →
            </text>
            {Array.from({ length: 10 }, (_, d) => {
              const hit = POSTINGS[t].includes(d);
              const lit = hit && i === active;
              return (
                <rect
                  key={d}
                  x={86 + d * 24}
                  y={52 + i * 26}
                  width="18"
                  height="14"
                  rx="3"
                  fill={lit ? "var(--cyan)" : hit ? "var(--cyan-soft)" : "var(--panel-strong)"}
                  stroke="var(--line)"
                  style={{ transition: "fill 0.4s" }}
                />
              );
            })}
          </g>
        ))}
        <text x="86" y="140" fontSize="9" fill="var(--ink-faint)">postings · term → docs</text>

        <text x="14" y="163" fontSize="10" fill="var(--ink-faint)">bm25 top-k</text>
        {RESULTS.map((r, i) => (
          <g key={r.name}>
            <rect x="110" y={152 + i * 15} width={330 * r.score} height="10" rx="3" fill={i === 0 ? "var(--lime)" : "var(--violet)"} opacity={1 - i * 0.28} />
            <text x={118 + 330 * r.score} y={161 + i * 15} fontSize="8.5" fill="var(--ink-dim)">
              {r.name} · {r.score.toFixed(2)}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
