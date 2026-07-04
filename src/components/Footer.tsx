import { Link } from "react-router-dom";
import { useContent } from "../state/ContentContext";

export default function Footer() {
  const { content } = useContent();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>
          © {year} {content.profile.name} — built with respect for the machine underneath.
        </span>
        <span className="foot-socials">
          {content.profile.socials
            .filter((s) => s.kind !== "email")
            .map((s) => (
              <a key={s.kind} href={s.url} target="_blank" rel="noreferrer">
                {s.label.toLowerCase()}
              </a>
            ))}
          <Link to="/admin" title="admin" style={{ opacity: 0.5 }}>
            0xAD
          </Link>
        </span>
      </div>
    </footer>
  );
}
