import RingBuffer from "./RingBuffer";
import CacheGrid from "./CacheGrid";
import KafkaPipeline from "./KafkaPipeline";
import InvertedIndex from "./InvertedIndex";
import MLPipeline from "./MLPipeline";
import GraphTraversal from "./GraphTraversal";
import AnomalyHeatmap from "./AnomalyHeatmap";
import Waveform from "./Waveform";

const REGISTRY: Record<string, React.ComponentType<{ compact?: boolean }>> = {
  "ring-buffer": RingBuffer,
  "cache-grid": CacheGrid,
  "kafka-pipeline": KafkaPipeline,
  "inverted-index": InvertedIndex,
  "ml-pipeline": MLPipeline,
  "graph-traversal": GraphTraversal,
  "anomaly-heatmap": AnomalyHeatmap,
  waveform: Waveform,
};

export const DIAGRAM_IDS = Object.keys(REGISTRY);

export default function Diagram({ id, compact = false }: { id: string; compact?: boolean }) {
  const Cmp = REGISTRY[id];
  if (!Cmp) return null;
  return <Cmp compact={compact} />;
}
