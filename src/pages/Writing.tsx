import { useMemo, useState } from "react";
import { useContent } from "../state/ContentContext";
import SectionHeader from "../components/SectionHeader";
import PostCard, { postHref } from "../components/PostCard";
import { Link } from "react-router-dom";

export default function Writing() {
  const { content } = useContent();
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () => [...content.blogs.filter((b) => b.visible)].sort((a, b) => b.date.localeCompare(a.date)),
    [content.blogs]
  );

  const tags = useMemo(() => {
    const t = new Set<string>();
    visible.forEach((b) => b.tags.forEach((x) => t.add(x)));
    return ["all", ...Array.from(t).sort()];
  }, [visible]);

  const filtered = filter === "all" ? visible : visible.filter((b) => b.tags.includes(filter));
  const hero = filtered.find((b) => b.featured);
  const rest = filtered.filter((b) => b !== hero);

  return (
    <div className="page container">
      <SectionHeader title="Writing" sub={`${visible.length} posts`} />
      <p className="dim" style={{ maxWidth: "62ch", marginTop: "-0.4rem" }}>
        Performance notes, paper reviews, and the occasional detour into Tolstoy. Native posts render
        here; Medium pieces link out.
      </p>

      <div className="filter-bar">
        {tags.map((t) => (
          <button key={t} className={`filter-btn${filter === t ? " active" : ""}`} onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>

      {hero && <FeaturedPost postSlug={hero.slug} />}

      <div className="card-grid">
        {rest.map((b) => (
          <PostCard key={b.slug} post={b} />
        ))}
      </div>
    </div>
  );
}

function FeaturedPost({ postSlug }: { postSlug: string }) {
  const { content } = useContent();
  const post = content.blogs.find((b) => b.slug === postSlug)!;
  const href = postHref(post);

  const body = (
    <>
      <span className="feat-label">★ featured</span>
      <h3>{post.title}</h3>
      <div className="post-meta">
        <span className={`source-badge ${post.source}`}>{post.source === "medium" ? "medium ↗" : "on-site"}</span>
        <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
        <span>· {post.readingTime} min</span>
        {post.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <p className="post-excerpt" style={{ maxWidth: "70ch" }}>
        {post.excerpt}
      </p>
    </>
  );

  return post.source === "medium" ? (
    <a className="glass featured-post" href={href} target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <Link className="glass featured-post" to={href!}>
      {body}
    </Link>
  );
}
