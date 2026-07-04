import { Link, useParams } from "react-router-dom";
import { useContent } from "../state/ContentContext";
import Markdown from "../components/Markdown";
import ProjectCard from "../components/ProjectCard";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug } = useParams();
  const { content } = useContent();
  const post = content.blogs.find((b) => b.slug === slug && b.visible);

  if (!post) return <NotFound />;
  if (post.source === "medium" && post.url) {
    // external post: bounce out
    window.location.replace(post.url);
    return null;
  }

  const related = content.projects.filter((p) => p.visible && post.relatedProjects.includes(p.slug));

  return (
    <div className="page container" style={{ maxWidth: 780 }}>
      <div className="blog-header fade-up">
        <Link to="/writing" className="crumb mono dim" style={{ display: "block", marginBottom: "1rem", fontSize: "0.75rem" }}>
          ← ./writing
        </Link>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span className="source-badge local">on-site</span>
          <span>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          <span>· {post.readingTime} min read</span>
          {post.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="fade-up fade-up-2">
        <Markdown source={post.body ?? ""} />
      </div>

      {related.length > 0 && (
        <div className="related-box glass">
          <h4>related project</h4>
          <div className="card-grid">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
