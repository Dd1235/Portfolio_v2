import type { Metric } from "../types";

export default function TelemetryChip({ metric }: { metric: Metric }) {
  return (
    <span className={`chip tone-${metric.tone ?? "cyan"}`}>
      <span className="chip-label">{metric.label}</span>
      <span className="chip-value">{metric.value}</span>
    </span>
  );
}
