import { useTick } from "./useTick";

/** Drone frame → tiled crops → detector → merged boxes, accuracy 81→92. */
export default function MLPipeline({ compact = false }: { compact?: boolean }) {
  const tick = useTick(500);
  const cycle = tick % 16;
  const activeTile = cycle % 9;
  const acc = 81 + Math.min(cycle, 11);

  return (
    <svg viewBox="0 0 520 180" style={{ width: "100%", maxWidth: compact ? 460 : 640, display: "block" }} role="img" aria-label="Drone image slicing and detection pipeline">
      <g fontFamily="var(--font-mono)">
        {/* drone frame with 3x3 slicing */}
        <rect x="16" y="24" width="120" height="96" rx="6" fill="var(--panel-strong)" stroke="var(--line-strong)" />
        {Array.from({ length: 9 }, (_, i) => {
          const r = Math.floor(i / 3);
          const c = i % 3;
          return (
            <rect
              key={i}
              x={20 + c * 38}
              y={28 + r * 30}
              width="36"
              height="28"
              rx="2"
              fill={i === activeTile ? "var(--cyan-soft)" : "transparent"}
              stroke={i === activeTile ? "var(--cyan)" : "var(--line)"}
              strokeDasharray={i === activeTile ? "none" : "3 3"}
              style={{ transition: "fill 0.3s, stroke 0.3s" }}
            />
          );
        })}
        <text x="76" y="136" textAnchor="middle" fontSize="9.5" fill="var(--ink-faint)">4K drone frame · sliced</text>

        <path d="M144 72h44" stroke="var(--line-strong)" markerEnd="none" />
        <path d="M182 67l8 5-8 5z" fill="var(--line-strong)" />

        {/* detector */}
        <rect x="196" y="46" width="104" height="52" rx="8" fill="var(--panel-strong)" stroke="var(--line-strong)" />
        <text x="248" y="68" textAnchor="middle" fontSize="10.5" fill="var(--ink)">YOLOv9</text>
        <text x="248" y="84" textAnchor="middle" fontSize="8.5" fill="var(--ink-faint)">per-tile inference</text>

        <path d="M308 72h44" stroke="var(--line-strong)" />
        <path d="M346 67l8 5-8 5z" fill="var(--line-strong)" />

        {/* merged detections */}
        <rect x="360" y="24" width="120" height="96" rx="6" fill="var(--panel-strong)" stroke="var(--line-strong)" />
        <rect x="382" y="44" width="26" height="20" fill="none" stroke="var(--lime)" strokeWidth="1.6" opacity={cycle > 3 ? 1 : 0} style={{ transition: "opacity 0.4s" }} />
        <rect x="428" y="76" width="20" height="16" fill="none" stroke="var(--lime)" strokeWidth="1.6" opacity={cycle > 6 ? 1 : 0} style={{ transition: "opacity 0.4s" }} />
        <rect x="398" y="88" width="14" height="12" fill="none" stroke="var(--amber)" strokeWidth="1.6" opacity={cycle > 9 ? 1 : 0} style={{ transition: "opacity 0.4s" }} />
        <text x="420" y="136" textAnchor="middle" fontSize="9.5" fill="var(--ink-faint)">merged detections</text>

        {/* accuracy readout */}
        <text x="16" y="166" fontSize="10" fill="var(--ink-faint)">mAP</text>
        <rect x="52" y="157" width="300" height="10" rx="5" fill="var(--panel-strong)" stroke="var(--line)" />
        <rect x="52" y="157" width={300 * (acc / 100)} height="10" rx="5" fill={acc >= 92 ? "var(--lime)" : "var(--amber)"} style={{ transition: "width 0.4s, fill 0.4s" }} />
        <text x="362" y="166" fontSize="11" fontWeight="600" fill={acc >= 92 ? "var(--lime)" : "var(--amber)"}>
          {acc}%{acc >= 92 ? " ✓" : ""}
        </text>
        <text x="410" y="166" fontSize="9" fill="var(--ink-faint)">81 → 92</text>
      </g>
    </svg>
  );
}
