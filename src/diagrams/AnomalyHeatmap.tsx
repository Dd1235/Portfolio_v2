import { useTick } from "./useTick";

const COLS = 10;
const ROWS = 6;

// deterministic pseudo-heat per cell; a defect blob near (7, 2)
function heat(r: number, c: number): number {
  const dx = c - 7;
  const dy = r - 2;
  const blob = Math.max(0, 1 - (dx * dx + dy * dy) / 5);
  const noise = ((r * 31 + c * 17) % 10) / 45;
  return Math.min(1, blob + noise);
}

/** Patch-grid anomaly heat sweeping in, AUC readout climbing 0.44 → 0.99. */
export default function AnomalyHeatmap({ compact = false }: { compact?: boolean }) {
  const tick = useTick(550);
  const sweep = tick % (COLS + 4); // pause beats at the end
  const frac = Math.min(1, sweep / (COLS - 1));
  const auc = (0.44 + 0.55 * frac).toFixed(2);

  return (
    <svg viewBox="0 0 420 170" style={{ width: "100%", maxWidth: compact ? 400 : 520, display: "block" }} role="img" aria-label="Anomaly detection heatmap on image patches">
      <g fontFamily="var(--font-mono)">
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const revealed = c <= sweep;
            const h = heat(r, c);
            const fill = !revealed
              ? "var(--panel-strong)"
              : h > 0.75
                ? "var(--red)"
                : h > 0.45
                  ? "var(--amber)"
                  : "var(--cyan-soft)";
            return (
              <rect
                key={`${r}${c}`}
                x={14 + c * 26}
                y={12 + r * 22}
                width="22"
                height="18"
                rx="3"
                fill={fill}
                opacity={revealed ? 0.4 + h * 0.6 : 1}
                stroke="var(--line)"
                style={{ transition: "fill 0.35s, opacity 0.35s" }}
              />
            );
          })
        )}
        <text x="14" y="158" fontSize="10" fill="var(--ink-faint)">
          feature-space reconstruction error · carpet/defect
        </text>
        <text x="300" y="158" fontSize="12" fontWeight="600" fill={frac >= 1 ? "var(--lime)" : "var(--amber)"}>
          AUC {auc}
        </text>
      </g>
    </svg>
  );
}
