import { Link } from "react-router-dom";
import { useContent } from "../state/ContentContext";
import SectionHeader from "../components/SectionHeader";
import GraphTraversal from "../diagrams/GraphTraversal";
import ProjectCard from "../components/ProjectCard";
import PostCard from "../components/PostCard";

export default function Dsa() {
  const { content } = useContent();
  const algolens = content.projects.find((p) => p.slug === "algolens" && p.visible);
  const cpPosts = content.blogs.filter(
    (b) => b.visible && b.tags.some((t) => ["Competitive Programming", "DSA"].includes(t))
  );

  return (
    <div className="page container">
      <SectionHeader title="DSA & Competitive Programming" sub="analog skill, digital scoreboard" />

      <div className="two-col fade-up" style={{ alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <p style={{ maxWidth: "56ch" }}>
            Algorithms are the part of the stack that never deprecates. I practice them the way I build
            systems — deliberately, with a scoreboard — and I liked the problem space enough to build a{" "}
            <Link to="/projects/algolens">search engine for it</Link>.
          </p>
          <div className="chip-row">
            <span className="chip tone-cyan">
              <span className="chip-label">corpus indexed</span>
              <span className="chip-value">1,185 problems</span>
            </span>
            <span className="chip tone-violet">
              <span className="chip-label">practice</span>
              <span className="chip-value">deliberate</span>
            </span>
          </div>
        </div>
        <GraphTraversal />
      </div>

      <div className="card-grid" style={{ marginBottom: "2rem" }}>
        {content.dsaProfiles.map((p) => (
          <a key={p.platform} className="glass profile-card" href={p.url} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
            <span className="pf-platform">{p.platform} ↗</span>
            <span className="pf-handle">@{p.handle}</span>
            <span className="pf-note">{p.note}</span>
          </a>
        ))}
      </div>

      {algolens && (
        <>
          <SectionHeader title="Search over the problem space" sub="algolens" />
          <div className="card-grid wide">
            <ProjectCard project={algolens} big />
          </div>
        </>
      )}

      {cpPosts.length > 0 && (
        <>
          <SectionHeader title="Notes from the arena" sub="writing" />
          <div className="card-grid">
            {cpPosts.map((b) => (
              <PostCard key={b.slug} post={b} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
