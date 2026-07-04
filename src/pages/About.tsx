import { useContent } from "../state/ContentContext";
import SectionHeader from "../components/SectionHeader";
import Markdown from "../components/Markdown";
import Motif from "../components/Motif";
import FlameBars from "../components/FlameBar";

export default function About() {
  const { content } = useContent();
  const { profile } = content;

  return (
    <div className="page container">
      <SectionHeader title="About" sub="cat /proc/self" />

      <div className="about-grid fade-up">
        <div>
          <Markdown source={profile.bioLong} />
        </div>

        <aside className="glass spec-sheet">
          <div className="spec-row">
            <span className="spec-key">host</span>
            <span className="spec-val">{profile.name}</span>
          </div>
          <div className="spec-row">
            <span className="spec-key">location</span>
            <span className="spec-val">{profile.location}</span>
          </div>
          {content.education.map((e) => (
            <div key={e.school}>
              <div className="spec-row">
                <span className="spec-key">degree</span>
                <span className="spec-val">{e.degree}</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">institute</span>
                <span className="spec-val">{e.school}</span>
              </div>
              <div className="spec-row">
                <span className="spec-key">cgpa</span>
                <span className="spec-val" style={{ color: "var(--lime)" }}>
                  {e.gpa}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-key">window</span>
                <span className="spec-val">{e.dates}</span>
              </div>
            </div>
          ))}
          <div className="spec-row">
            <span className="spec-key">status</span>
            <span className="spec-val" style={{ color: "var(--cyan)" }}>
              {profile.openTo}
            </span>
          </div>
        </aside>
      </div>

      <SectionHeader title="Experience" sub="timeline" />
      <div className="timeline">
        {content.experience.map((e) => (
          <div className="timeline-item" key={e.role + e.org}>
            <span className="tl-dates">{e.dates} · {e.location}</span>
            <div className="exp-head">
              <h3>{e.role}</h3>
              <Motif name={e.motif} size={26} />
            </div>
            <div className="tl-org">{e.org}</div>
            <ul>
              {e.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <SectionHeader title="Skills" sub="flamegraph — self-profiled" />
      {content.skillGroups.map((g) => (
        <div key={g.name}>
          <h3 className="mono" style={{ fontSize: "0.85rem", color: "var(--ink-dim)", marginBottom: "0.7rem" }}>
            ▸ {g.name}
          </h3>
          <FlameBars group={g} />
        </div>
      ))}

      <SectionHeader title="Achievements" sub="awards" />
      <div className="two-col">
        {content.achievements.map((a) => (
          <div className="glass award-chip" key={a.title}>
            <Motif name={a.motif} size={30} />
            <div style={{ flex: 1 }}>
              <h4>{a.title}</h4>
              <p>{a.detail}</p>
            </div>
            <span className="award-year">{a.year}</span>
          </div>
        ))}
      </div>

      <SectionHeader title="Coursework" sub="relevant" />
      <div className="chip-row">
        {content.coursework.map((c) => (
          <span key={c} className="tag">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
