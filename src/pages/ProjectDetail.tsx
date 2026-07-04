import { Link, useParams } from "react-router-dom";
import { useContent } from "../state/ContentContext";
import Markdown from "../components/Markdown";
import Motif from "../components/Motif";
import Diagram from "../diagrams/Diagram";
import PostCard from "../components/PostCard";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { content } = useContent();
  const project = content.projects.find((p) => p.slug === slug && p.visible);
  if (!project) return <NotFound />;

  const related = content.blogs.filter((b) => b.visible && b.relatedProjects.includes(project.slug));

  return (
    <div className="page container" style={{ maxWidth: 860 }}>
      <div className="detail-hero fade-up">
        <Link to="/projects" className="crumb">
          ← ./projects
        </Link>
        <div className="exp-head">
          <Motif name={project.motif} size={40} />
          <h1 style={{ margin: 0 }}>{project.title}</h1>
        </div>
        <p className="dim" style={{ fontSize: "1.05rem", marginTop: "0.5rem" }}>
          {project.subtitle}
        </p>
        <div className="chip-row" style={{ margin: "0.8rem 0" }}>
          {project.stack.map((s) => (
            <span key={s} className="tag">
              {s}
            </span>
          ))}
          {project.dates && <span className="tag">{project.dates}</span>}
        </div>
        {project.award && (
          <p className="pin-flag" style={{ margin: "0.3rem 0" }}>
            ★ {project.award}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "0.6rem" }}>
          {project.github && (
            <a className="btn" href={project.github} target="_blank" rel="noreferrer">
              source ↗
            </a>
          )}
        </div>
      </div>

      {project.diagram && (
        <div className="detail-diagram fade-up fade-up-2">
          <Diagram id={project.diagram} />
        </div>
      )}

      {project.metrics.length > 0 && (
        <div className="stat-row fade-up fade-up-2">
          {project.metrics.map((m) => (
            <div key={m.label} className={`stat tone-${m.tone ?? "cyan"}`}>
              <span className="stat-value">{m.value}</span>
              <span className="stat-label">{m.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="fade-up fade-up-3">
        {project.story.map((s, i) => (
          <section className="story-section" key={s.heading}>
            <h2>
              <span className="idx">{String(i + 1).padStart(2, "0")}</span> {s.heading}
            </h2>
            <Markdown source={s.body} />
          </section>
        ))}
      </div>

      {related.length > 0 && (
        <div className="related-box glass">
          <h4>related writing</h4>
          <div className="card-grid">
            {related.map((b) => (
              <PostCard key={b.slug} post={b} />
            ))}
          </div>
        </div>
      )}

      {project.metrics.length > 0 && (
        <p className="dim mono" style={{ fontSize: "0.72rem", marginTop: "2rem" }}>
          // numbers above are from my own benchmark runs — methodology in the repo.
        </p>
      )}
    </div>
  );
}
