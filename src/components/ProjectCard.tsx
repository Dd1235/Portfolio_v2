import { Link } from "react-router-dom";
import type { Project } from "../types";
import Motif from "./Motif";
import TelemetryChip from "./TelemetryChip";
import Diagram from "../diagrams/Diagram";

export default function ProjectCard({ project, big = false }: { project: Project; big?: boolean }) {
  return (
    <article className="glass bench-card">
      <div className="card-top">
        <div>
          <h3>
            <Link to={`/projects/${project.slug}`}>{project.title}</Link>
          </h3>
          <p className="card-sub">{project.subtitle}</p>
        </div>
        <Motif name={project.motif} />
      </div>

      {big && project.diagram && (
        <div className="card-diagram">
          <Diagram id={project.diagram} compact />
        </div>
      )}

      {project.metrics.length > 0 && (
        <div className="chip-row">
          {project.metrics.slice(0, big ? 5 : 3).map((m) => (
            <TelemetryChip key={m.label} metric={m} />
          ))}
        </div>
      )}

      <div className="card-foot">
        <div className="chip-row">
          {project.stack.slice(0, 4).map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
        </div>
        {project.pinned && <span className="pin-flag">▲ PINNED</span>}
      </div>
    </article>
  );
}
