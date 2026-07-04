import { Link } from "react-router-dom";
import type { Blog } from "../types";

export function postHref(post: Blog): string | undefined {
  return post.source === "medium" ? post.url : `/writing/${post.slug}`;
}

export default function PostCard({ post }: { post: Blog }) {
  const meta = (
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
  );

  const inner = (
    <>
      <h3>{post.title}</h3>
      {meta}
      <p className="post-excerpt">{post.excerpt}</p>
    </>
  );

  if (post.source === "medium") {
    return (
      <a className="glass post-card" href={post.url} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link className="glass post-card" to={`/writing/${post.slug}`}>
      {inner}
    </Link>
  );
}
