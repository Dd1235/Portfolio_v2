import { Link } from "react-router-dom";
import { useContent } from "../state/ContentContext";
import TelemetryChip from "../components/TelemetryChip";
import SectionHeader from "../components/SectionHeader";
import ProjectCard from "../components/ProjectCard";
import PostCard from "../components/PostCard";
import RingBuffer from "../diagrams/RingBuffer";
import CacheGrid from "../diagrams/CacheGrid";

export default function Home() {
  const { content } = useContent();
  const { profile } = content;
  const pinned = content.projects.filter((p) => p.visible && p.pinned);
  const featured = content.blogs.filter((b) => b.visible && b.featured).slice(0, 3);

  return (
    <div className="page container">
      <section className="hero">
        <div className="fade-up">
          <div className="hero-prompt">
            <span className="accent">λ</span> whoami --verbose<span className="cursor-blink" />
          </div>
          <h1>{profile.name}</h1>
          <div className="hero-role">{profile.role}</div>
          <p className="hero-tagline">“{profile.tagline}”</p>
          <p className="hero-sub">{profile.subTagline}</p>
          <div className="hero-cta">
            <a className="btn primary" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              resume.pdf ↓
            </a>
            <Link className="btn" to="/projects">
              ./projects
            </Link>
            <a className="btn" href="https://github.com/Dd1235" target="_blank" rel="noreferrer">
              github ↗
            </a>
          </div>
          <div className="chip-row">
            {profile.heroChips.map((m) => (
              <TelemetryChip key={m.label} metric={m} />
            ))}
          </div>
        </div>
        <div className="hero-art fade-up fade-up-2">
          <RingBuffer />
        </div>
      </section>

      <section className="fade-up fade-up-3">
        <SectionHeader title="Pinned work" sub="benchmark-grade" />
        <div className="card-grid wide">
          {pinned.map((p) => (
            <ProjectCard key={p.slug} project={p} big />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Recent writing" sub="medium + on-site" />
        <div className="card-grid">
          {featured.map((b) => (
            <PostCard key={b.slug} post={b} />
          ))}
        </div>
        <p style={{ marginTop: "1rem" }}>
          <Link className="btn" to="/writing">
            all writing →
          </Link>
        </p>
      </section>

      <section>
        <SectionHeader title="How I think" sub="mechanical sympathy" />
        <div className="glass" style={{ padding: "1.6rem" }}>
          <div className="two-col" style={{ alignItems: "center" }}>
            <div>
              <p style={{ marginBottom: "0.4rem" }}>
                Big-O is where performance analysis starts, not where it ends. The interesting factor-of-ten
                lives in cache lines, memory ordering, GC pressure, and queue depth.
              </p>
              <p className="dim" style={{ margin: 0, fontSize: "0.9rem" }}>
                Every claim on this site is a measurement, not an adjective — that's the whole brand.
              </p>
            </div>
            <CacheGrid compact />
          </div>
        </div>
      </section>
    </div>
  );
}
