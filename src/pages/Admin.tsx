import { useState, type ReactNode } from "react";
import { useContent } from "../state/ContentContext";
import { DIAGRAM_IDS } from "../diagrams/Diagram";
import SectionHeader from "../components/SectionHeader";
import Markdown from "../components/Markdown";
import type { Blog, Content, Metric, Project, StorySection, Tone } from "../types";

/**
 * Client-side deterrent only: this keeps casual visitors out of the editor UI,
 * but the content itself ships in the bundle. Change the phrase before deploying.
 */
const PASSPHRASE = "mechanical-sympathy";
const GATE_KEY = "portfolio-admin-ok";

const MOTIFS = ["headtail", "gauge", "postings", "heatpatch", "waveform", "canvas", "kv", "trophy", "medal", "matrix", "tiles", "graph", "chip"];
const TONES: Tone[] = ["cyan", "lime", "amber", "violet"];

export default function Admin() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(GATE_KEY) === "1");
  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />;
  return <AdminPanel />;
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [phrase, setPhrase] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="page container">
      <form
        className="glass admin-gate"
        onSubmit={(e) => {
          e.preventDefault();
          if (phrase === PASSPHRASE) {
            sessionStorage.setItem(GATE_KEY, "1");
            onUnlock();
          } else {
            setErr(true);
          }
        }}
      >
        <p className="mono dim" style={{ fontSize: "0.75rem" }}>sudo edit ./portfolio</p>
        <div className="field">
          <label>passphrase</label>
          <input type="password" value={phrase} onChange={(e) => setPhrase(e.target.value)} autoFocus />
        </div>
        {err && (
          <p className="mono" style={{ color: "var(--red)", fontSize: "0.75rem" }}>
            permission denied (publickey,password)
          </p>
        )}
        <button className="btn primary" type="submit">
          unlock
        </button>
        <p className="dim" style={{ fontSize: "0.72rem", marginTop: "1rem" }}>
          Soft gate — it deters visitors, it is not security. Real privacy means not deploying /admin.
        </p>
      </form>
    </div>
  );
}

type Tab = "profile" | "projects" | "writing" | "data";

function AdminPanel() {
  const { dirty } = useContent();
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div className="page container" style={{ maxWidth: 900 }}>
      <SectionHeader title="Admin" sub={dirty ? "● unexported edits" : "clean"} />
      <p className="admin-note">
        Edits live in this browser's localStorage and update the site instantly. To make them permanent for
        everyone: <strong>Data → Export</strong>, replace <code>src/content/content.json</code>, commit, redeploy.
      </p>

      <div className="admin-tabs">
        {(["profile", "projects", "writing", "data"] as Tab[]).map((t) => (
          <button key={t} className={`filter-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileTab />}
      {tab === "projects" && <ProjectsTab />}
      {tab === "writing" && <WritingTab />}
      {tab === "data" && <DataTab />}
    </div>
  );
}

/* ---------- small form helpers ---------- */

function Text({ label, value, onChange, area = false }: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <div className="field">
      <label>{label}</label>
      {area ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>{children}</div>;
}

const csv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

function metricsToText(ms: Metric[]): string {
  return ms.map((m) => `${m.label} | ${m.value} | ${m.tone ?? "cyan"}`).join("\n");
}

function textToMetrics(t: string): Metric[] {
  return t
    .split("\n")
    .map((l) => l.split("|").map((x) => x.trim()))
    .filter((p) => p[0] && p[1])
    .map(([label, value, tone]) => ({
      label,
      value,
      tone: (TONES as string[]).includes(tone) ? (tone as Tone) : "cyan",
    }));
}

function storyToText(story: StorySection[]): string {
  return story.map((s) => `## ${s.heading}\n\n${s.body}`).join("\n\n");
}

function textToStory(t: string): StorySection[] {
  const parts = t.split(/^## /m).map((x) => x.trim()).filter(Boolean);
  return parts.map((p) => {
    const nl = p.indexOf("\n");
    if (nl === -1) return { heading: p, body: "" };
    return { heading: p.slice(0, nl).trim(), body: p.slice(nl + 1).trim() };
  });
}

/* ---------- Profile ---------- */

function ProfileTab() {
  const { content, update } = useContent();
  const p = content.profile;
  const set = (patch: Partial<Content["profile"]>) =>
    update((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));

  return (
    <div className="glass admin-panel">
      <Row>
        <Text label="name" value={p.name} onChange={(v) => set({ name: v })} />
        <Text label="role line" value={p.role} onChange={(v) => set({ role: v })} />
      </Row>
      <Text label="tagline" value={p.tagline} onChange={(v) => set({ tagline: v })} />
      <Text label="sub-tagline" value={p.subTagline} onChange={(v) => set({ subTagline: v })} />
      <Text label="short bio" value={p.bioShort} onChange={(v) => set({ bioShort: v })} area />
      <Text label="long bio (markdown)" value={p.bioLong} onChange={(v) => set({ bioLong: v })} area />
      <Row>
        <Text label="email" value={p.email} onChange={(v) => set({ email: v })} />
        <Text label="location" value={p.location} onChange={(v) => set({ location: v })} />
      </Row>
      <Text label="open to" value={p.openTo} onChange={(v) => set({ openTo: v })} />
      <Text
        label="hero telemetry chips (label | value | tone per line)"
        value={metricsToText(p.heroChips)}
        onChange={(v) => set({ heroChips: textToMetrics(v) })}
        area
      />
      <p className="dim" style={{ fontSize: "0.72rem" }}>
        Socials, experience, education, skills, and achievements are edited via Data → Export → edit JSON → Import.
      </p>
    </div>
  );
}

/* ---------- Projects ---------- */

function ProjectsTab() {
  const { content, update } = useContent();
  const [editing, setEditing] = useState<string | null>(null);

  const setProjects = (projects: Project[]) => update((prev) => ({ ...prev, projects }));

  const move = (i: number, dir: -1 | 1) => {
    const arr = [...content.projects];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setProjects(arr);
  };

  const addNew = () => {
    const slug = `new-project-${Date.now() % 10000}`;
    setProjects([
      ...content.projects,
      {
        slug,
        title: "New Project",
        subtitle: "",
        description: "",
        stack: [],
        tags: [],
        metrics: [],
        motif: "chip",
        story: [],
        pinned: false,
        visible: false,
      },
    ]);
    setEditing(slug);
  };

  return (
    <>
      {content.projects.map((p, i) => (
        <div key={p.slug}>
          <div className="admin-list-item" style={{ opacity: p.visible ? 1 : 0.55 }}>
            <span className="ali-title">
              {p.title} <span className="dim mono" style={{ fontSize: "0.68rem" }}>/{p.slug}</span>
            </span>
            <span className="ali-actions">
              <button className="icon-btn" onClick={() => move(i, -1)} title="move up">↑</button>
              <button className="icon-btn" onClick={() => move(i, 1)} title="move down">↓</button>
              <button
                className={`icon-btn${p.pinned ? " on" : ""}`}
                onClick={() => setProjects(content.projects.map((x) => (x.slug === p.slug ? { ...x, pinned: !x.pinned } : x)))}
              >
                {p.pinned ? "▲ pinned" : "pin"}
              </button>
              <button
                className="icon-btn"
                onClick={() => setProjects(content.projects.map((x) => (x.slug === p.slug ? { ...x, visible: !x.visible } : x)))}
              >
                {p.visible ? "hide" : "show"}
              </button>
              <button className="icon-btn" onClick={() => setEditing(editing === p.slug ? null : p.slug)}>
                {editing === p.slug ? "close" : "edit"}
              </button>
              <button
                className="icon-btn danger"
                onClick={() => {
                  if (confirm(`Delete project "${p.title}"?`)) setProjects(content.projects.filter((x) => x.slug !== p.slug));
                }}
              >
                ✕
              </button>
            </span>
          </div>
          {editing === p.slug && <ProjectEditor project={p} onSave={(np) => {
            setProjects(content.projects.map((x) => (x.slug === p.slug ? np : x)));
            setEditing(null);
          }} />}
        </div>
      ))}
      <button className="btn" onClick={addNew} style={{ marginTop: "0.6rem" }}>
        + new project
      </button>
    </>
  );
}

function ProjectEditor({ project, onSave }: { project: Project; onSave: (p: Project) => void }) {
  const [d, setD] = useState({
    ...project,
    stackText: project.stack.join(", "),
    tagsText: project.tags.join(", "),
    metricsText: metricsToText(project.metrics),
    storyText: storyToText(project.story),
  });
  const set = (patch: Partial<typeof d>) => setD((prev) => ({ ...prev, ...patch }));

  return (
    <div className="glass admin-panel">
      <Row>
        <Text label="title" value={d.title} onChange={(v) => set({ title: v })} />
        <Text label="slug" value={d.slug} onChange={(v) => set({ slug: v })} />
      </Row>
      <Text label="subtitle" value={d.subtitle} onChange={(v) => set({ subtitle: v })} />
      <Text label="description" value={d.description} onChange={(v) => set({ description: v })} area />
      <Row>
        <Text label="stack (comma-separated)" value={d.stackText} onChange={(v) => set({ stackText: v })} />
        <Text label="tags (comma-separated)" value={d.tagsText} onChange={(v) => set({ tagsText: v })} />
      </Row>
      <Row>
        <Text label="github url" value={d.github ?? ""} onChange={(v) => set({ github: v })} />
        <Text label="dates" value={d.dates ?? ""} onChange={(v) => set({ dates: v })} />
      </Row>
      <Text label="award (optional)" value={d.award ?? ""} onChange={(v) => set({ award: v })} />
      <Row>
        <div className="field">
          <label>diagram</label>
          <select value={d.diagram ?? ""} onChange={(e) => set({ diagram: e.target.value || undefined })}>
            <option value="">none</option>
            {DIAGRAM_IDS.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>motif</label>
          <select value={d.motif} onChange={(e) => set({ motif: e.target.value })}>
            {MOTIFS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </Row>
      <Text label="metrics (label | value | tone per line)" value={d.metricsText} onChange={(v) => set({ metricsText: v })} area />
      <Text label="story (markdown — '## Heading' starts a section)" value={d.storyText} onChange={(v) => set({ storyText: v })} area />
      <button
        className="btn primary"
        onClick={() =>
          onSave({
            slug: d.slug.trim() || project.slug,
            title: d.title,
            subtitle: d.subtitle,
            description: d.description,
            stack: csv(d.stackText),
            tags: csv(d.tagsText),
            metrics: textToMetrics(d.metricsText),
            diagram: d.diagram,
            motif: d.motif,
            github: d.github || undefined,
            dates: d.dates || undefined,
            award: d.award || undefined,
            story: textToStory(d.storyText),
            pinned: d.pinned,
            visible: d.visible,
          })
        }
      >
        save project
      </button>
    </div>
  );
}

/* ---------- Writing ---------- */

function WritingTab() {
  const { content, update } = useContent();
  const [editing, setEditing] = useState<string | null>(null);

  const setBlogs = (blogs: Blog[]) => update((prev) => ({ ...prev, blogs }));

  const add = (source: "local" | "medium") => {
    const slug = `${source}-post-${Date.now() % 10000}`;
    setBlogs([
      {
        slug,
        title: source === "local" ? "New Post" : "New Medium Link",
        source,
        url: source === "medium" ? "https://medium.com/@deepya1235/" : undefined,
        excerpt: "",
        body: source === "local" ? "Write markdown here…" : undefined,
        tags: [],
        readingTime: 5,
        date: new Date().toISOString().slice(0, 10),
        featured: false,
        visible: false,
        relatedProjects: [],
      },
      ...content.blogs,
    ]);
    setEditing(slug);
  };

  return (
    <>
      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "0.8rem" }}>
        <button className="btn" onClick={() => add("local")}>+ write on-site post</button>
        <button className="btn" onClick={() => add("medium")}>+ add medium link</button>
      </div>
      {content.blogs.map((b) => (
        <div key={b.slug}>
          <div className="admin-list-item" style={{ opacity: b.visible ? 1 : 0.55 }}>
            <span className={`source-badge ${b.source}`}>{b.source}</span>
            <span className="ali-title">{b.title}</span>
            <span className="ali-actions">
              <button
                className={`icon-btn${b.featured ? " on" : ""}`}
                onClick={() => setBlogs(content.blogs.map((x) => (x.slug === b.slug ? { ...x, featured: !x.featured } : x)))}
              >
                {b.featured ? "★ featured" : "feature"}
              </button>
              <button
                className="icon-btn"
                onClick={() => setBlogs(content.blogs.map((x) => (x.slug === b.slug ? { ...x, visible: !x.visible } : x)))}
              >
                {b.visible ? "hide" : "show"}
              </button>
              <button className="icon-btn" onClick={() => setEditing(editing === b.slug ? null : b.slug)}>
                {editing === b.slug ? "close" : "edit"}
              </button>
              <button
                className="icon-btn danger"
                onClick={() => {
                  if (confirm(`Delete post "${b.title}"?`)) setBlogs(content.blogs.filter((x) => x.slug !== b.slug));
                }}
              >
                ✕
              </button>
            </span>
          </div>
          {editing === b.slug && (
            <BlogEditor
              blog={b}
              projectSlugs={content.projects.map((p) => p.slug)}
              onSave={(nb) => {
                setBlogs(content.blogs.map((x) => (x.slug === b.slug ? nb : x)));
                setEditing(null);
              }}
            />
          )}
        </div>
      ))}
    </>
  );
}

function BlogEditor({ blog, projectSlugs, onSave }: { blog: Blog; projectSlugs: string[]; onSave: (b: Blog) => void }) {
  const [d, setD] = useState({
    ...blog,
    tagsText: blog.tags.join(", "),
    relatedText: blog.relatedProjects.join(", "),
    bodyText: blog.body ?? "",
  });
  const [preview, setPreview] = useState(false);
  const set = (patch: Partial<typeof d>) => setD((prev) => ({ ...prev, ...patch }));

  return (
    <div className="glass admin-panel">
      <Row>
        <Text label="title" value={d.title} onChange={(v) => set({ title: v })} />
        <Text label="slug" value={d.slug} onChange={(v) => set({ slug: v })} />
      </Row>
      {d.source === "medium" && <Text label="medium url" value={d.url ?? ""} onChange={(v) => set({ url: v })} />}
      <Text label="excerpt" value={d.excerpt} onChange={(v) => set({ excerpt: v })} area />
      <Row>
        <Text label="tags (comma-separated)" value={d.tagsText} onChange={(v) => set({ tagsText: v })} />
        <Text label={`related projects (${projectSlugs.slice(0, 3).join(", ")}…)`} value={d.relatedText} onChange={(v) => set({ relatedText: v })} />
      </Row>
      <Row>
        <div className="field">
          <label>date</label>
          <input type="date" value={d.date.slice(0, 10)} onChange={(e) => set({ date: e.target.value })} />
        </div>
        <div className="field">
          <label>reading time (min)</label>
          <input type="number" min={1} value={d.readingTime} onChange={(e) => set({ readingTime: Math.max(1, Number(e.target.value) || 1) })} />
        </div>
      </Row>
      {d.source === "local" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <label className="mono dim" style={{ fontSize: "0.72rem" }}>body (markdown)</label>
            <button className="icon-btn" onClick={() => setPreview((p) => !p)}>
              {preview ? "edit" : "preview"}
            </button>
          </div>
          {preview ? (
            <div className="md-preview">
              <Markdown source={d.bodyText} />
            </div>
          ) : (
            <div className="field">
              <textarea style={{ minHeight: 320 }} value={d.bodyText} onChange={(e) => set({ bodyText: e.target.value })} />
            </div>
          )}
        </>
      )}
      <button
        className="btn primary"
        style={{ marginTop: "0.8rem" }}
        onClick={() =>
          onSave({
            slug: d.slug.trim() || blog.slug,
            title: d.title,
            source: d.source,
            url: d.source === "medium" ? d.url : undefined,
            excerpt: d.excerpt,
            body: d.source === "local" ? d.bodyText : undefined,
            tags: csv(d.tagsText),
            readingTime: d.readingTime,
            date: d.date,
            featured: d.featured,
            visible: d.visible,
            relatedProjects: csv(d.relatedText).filter((s) => projectSlugs.includes(s)),
          })
        }
      >
        save post
      </button>
    </div>
  );
}

/* ---------- Data ---------- */

function DataTab() {
  const { dirty, exportJson, importJson, reset } = useContent();
  const [msg, setMsg] = useState("");

  return (
    <div className="glass admin-panel">
      <p className="dim" style={{ fontSize: "0.9rem" }}>
        {dirty ? (
          <span className="dirty-flag">● You have edits stored only in this browser.</span>
        ) : (
          "No local edits — the site is serving the committed content.json."
        )}
      </p>
      <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", margin: "1rem 0" }}>
        <button className="btn primary" onClick={exportJson}>
          export content.json ↓
        </button>
        <label className="btn" style={{ cursor: "pointer" }}>
          import content.json ↑
          <input
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                await importJson(f);
                setMsg("Imported — site updated.");
              } catch (err) {
                setMsg(`Import failed: ${(err as Error).message}`);
              }
              e.target.value = "";
            }}
          />
        </label>
        <button
          className="btn danger"
          onClick={() => {
            if (confirm("Discard all local edits and restore the committed content?")) {
              reset();
              setMsg("Reset to committed content.");
            }
          }}
        >
          reset to committed
        </button>
      </div>
      {msg && <p className="mono" style={{ fontSize: "0.78rem", color: "var(--cyan)" }}>{msg}</p>}
      <p className="dim" style={{ fontSize: "0.78rem" }}>
        Publish flow: export → replace <code>src/content/content.json</code> in the repo → commit → deploy.
        The export includes everything (profile, projects, blogs, experience, skills…), so advanced fields
        without a form here can be edited directly in the JSON and re-imported.
      </p>
    </div>
  );
}
