import { useMemo, useState } from "react";
import { useContent } from "../state/ContentContext";
import SectionHeader from "../components/SectionHeader";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const { content } = useContent();
  const [filter, setFilter] = useState<string>("all");

  const visible = content.projects.filter((p) => p.visible);
  const tags = useMemo(() => {
    const t = new Set<string>();
    visible.forEach((p) => p.tags.forEach((x) => t.add(x)));
    return ["all", ...Array.from(t).sort()];
  }, [visible]);

  const filtered = filter === "all" ? visible : visible.filter((p) => p.tags.includes(filter));
  const pinned = filtered.filter((p) => p.pinned);
  const rest = filtered.filter((p) => !p.pinned);

  return (
    <div className="page container">
      <SectionHeader title="Projects" sub={`${visible.length} entries`} />
      <p className="dim" style={{ maxWidth: "62ch", marginTop: "-0.4rem" }}>
        Systems built to be measured: every card carries its own benchmark numbers.
      </p>

      <div className="filter-bar">
        {tags.map((t) => (
          <button key={t} className={`filter-btn${filter === t ? " active" : ""}`} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>

      {pinned.length > 0 && (
        <div className="card-grid wide" style={{ marginBottom: "1.2rem" }}>
          {pinned.map((p) => (
            <ProjectCard key={p.slug} project={p} big />
          ))}
        </div>
      )}
      <div className="card-grid">
        {rest.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
