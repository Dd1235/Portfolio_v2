import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../state/ThemeContext";

const links = [
  { to: "/about", label: "about" },
  { to: "/projects", label: "projects" },
  { to: "/writing", label: "writing" },
  { to: "/dsa", label: "dsa" },
  { to: "/ml", label: "ml" },
  { to: "/contact", label: "contact" },
];

export default function Nav() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <BrandGlyph />
          <span>
            dedeepya<span style={{ color: "var(--cyan)" }}>.</span>avancha
          </span>
          <span className="brand-sig">// 0xDA</span>
        </Link>
        <nav className={`nav-links${open ? " open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              onClick={() => setOpen(false)}
            >
              ./{l.label}
            </NavLink>
          ))}
          <button className="theme-btn" onClick={toggle} title="Toggle theme">
            {theme === "dark" ? "☀ light" : "☾ dark"}
          </button>
        </nav>
        <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? "close" : "menu"}
        </button>
      </div>
    </header>
  );
}

function BrandGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
      <rect x="1" y="1" width="20" height="20" rx="4" fill="none" stroke="var(--cyan)" strokeWidth="1.4" />
      <rect x="5" y="5" width="5" height="5" rx="1" fill="var(--cyan)" opacity="0.85" />
      <rect x="12" y="5" width="5" height="5" rx="1" fill="var(--cyan)" opacity="0.35" />
      <rect x="5" y="12" width="5" height="5" rx="1" fill="var(--cyan)" opacity="0.35" />
      <rect x="12" y="12" width="5" height="5" rx="1" fill="var(--lime)" opacity="0.85" />
    </svg>
  );
}
