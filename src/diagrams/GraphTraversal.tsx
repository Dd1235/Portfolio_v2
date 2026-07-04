import { useTick } from "./useTick";

const NODES: { x: number; y: number; d: number }[] = [
  { x: 60, y: 90, d: 0 },
  { x: 140, y: 40, d: 1 },
  { x: 150, y: 130, d: 1 },
  { x: 230, y: 70, d: 2 },
  { x: 240, y: 150, d: 2 },
  { x: 320, y: 40, d: 3 },
  { x: 330, y: 110, d: 3 },
  { x: 410, y: 80, d: 4 },
  { x: 420, y: 150, d: 4 },
];
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [2, 3], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7], [6, 8],
];

/** BFS wavefront expanding across a graph, level by level. */
export default function GraphTraversal({ compact = false }: { compact?: boolean }) {
  const tick = useTick(700);
  const level = tick % 6; // 5 = fully explored beat

  return (
    <svg viewBox="0 0 480 190" style={{ width: "100%", maxWidth: compact ? 420 : 560, display: "block" }} role="img" aria-label="Breadth-first search wavefront">
      {EDGES.map(([a, b], i) => {
        const lit = NODES[a].d < level && NODES[b].d <= level;
        return (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke={lit ? "var(--cyan)" : "var(--line-strong)"}
            strokeWidth={lit ? 1.8 : 1.1}
            style={{ transition: "stroke 0.4s" }}
          />
        );
      })}
      {NODES.map((n, i) => {
        const visited = n.d <= level;
        const frontier = n.d === level;
        return (
          <g key={i}>
            {frontier && <circle cx={n.x} cy={n.y} r="14" fill="var(--cyan-soft)" />}
            <circle
              cx={n.x}
              cy={n.y}
              r="8"
              fill={visited ? (frontier ? "var(--lime)" : "var(--cyan)") : "var(--panel-strong)"}
              stroke={visited ? "transparent" : "var(--line-strong)"}
              style={{ transition: "fill 0.4s" }}
            />
          </g>
        );
      })}
      <text x="12" y="182" fontFamily="var(--font-mono)" fontSize="10" fill="var(--ink-faint)">
        bfs · frontier depth {Math.min(level, 4)} {level >= 5 ? "· explored ✓" : ""}
      </text>
    </svg>
  );
}
