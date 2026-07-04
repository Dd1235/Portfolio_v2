import { useTick } from "./useTick";

const SLOTS = 12;
const R = 88;
const CX = 130;
const CY = 122;

/** Producer/consumer heads chasing each other around a slot ring. */
export default function RingBuffer({ compact = false }: { compact?: boolean }) {
  const tick = useTick(650);
  const head = tick % SLOTS;
  const fill = 3 + (Math.floor(tick / 2) % 5);
  const occupied = new Set<number>();
  for (let i = 0; i < fill; i++) occupied.add((head - 1 - i + SLOTS * 4) % SLOTS);
  const tail = (head - fill + SLOTS * 4) % SLOTS;

  const slot = (i: number) => {
    const a0 = (i / SLOTS) * Math.PI * 2 - Math.PI / 2 + 0.05;
    const a1 = ((i + 1) / SLOTS) * Math.PI * 2 - Math.PI / 2 - 0.05;
    const p = (a: number, r: number) => `${CX + r * Math.cos(a)},${CY + r * Math.sin(a)}`;
    return `M${p(a0, R - 14)} L${p(a0, R + 14)} A${R + 14},${R + 14} 0 0 1 ${p(a1, R + 14)} L${p(a1, R - 14)} A${R - 14},${R - 14} 0 0 0 ${p(a0, R - 14)}Z`;
  };

  const marker = (i: number, r: number) => {
    const a = ((i + 0.5) / SLOTS) * Math.PI * 2 - Math.PI / 2;
    return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
  };

  const hm = marker(head, R + 26);
  const tm = marker(tail, R - 28);

  return (
    <svg
      viewBox="0 0 260 250"
      style={{ width: "100%", maxWidth: compact ? 300 : 380, display: "block", margin: "0 auto" }}
      role="img"
      aria-label="Animated single-producer single-consumer ring buffer"
    >
      {Array.from({ length: SLOTS }, (_, i) => (
        <path
          key={i}
          d={slot(i)}
          fill={occupied.has(i) ? "var(--cyan)" : "var(--panel-strong)"}
          opacity={occupied.has(i) ? 0.75 : 1}
          stroke="var(--line-strong)"
          strokeWidth="1"
          style={{ transition: "fill 0.3s, opacity 0.3s" }}
        />
      ))}
      <circle cx={hm.x} cy={hm.y} r="4" fill="var(--lime)" style={{ transition: "cx 0.4s, cy 0.4s" }} />
      <circle cx={tm.x} cy={tm.y} r="4" fill="var(--amber)" style={{ transition: "cx 0.4s, cy 0.4s" }} />
      <text x={CX} y={CY - 8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--ink-dim)">
        lock-free
      </text>
      <text x={CX} y={CY + 8} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="13" fontWeight="600" fill="var(--ink)">
        SPSC
      </text>
      <text x={CX} y={CY + 24} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--ink-faint)">
        2.6 ns / handoff
      </text>
      {!compact && (
        <g fontFamily="var(--font-mono)" fontSize="9.5">
          <text x="8" y="16" fill="var(--lime)">● head {String(head).padStart(2, "0")} · producer</text>
          <text x="8" y="30" fill="var(--amber)">● tail {String(tail).padStart(2, "0")} · consumer</text>
          <text x="8" y="242" fill="var(--ink-faint)">acquire-release · no locks · no syscalls</text>
        </g>
      )}
    </svg>
  );
}
