import { useContent } from "../state/ContentContext";

export default function Contact() {
  const { content } = useContent();
  const { profile } = content;

  return (
    <div className="page container" style={{ maxWidth: 760 }}>
      <div className="contact-hero fade-up">
        <p className="mono dim" style={{ fontSize: "0.78rem" }}>
          $ ping dedeepya --interactive
        </p>
        <h1>Let's talk shop.</h1>
        <p className="dim" style={{ maxWidth: "50ch", margin: "0 auto" }}>
          {profile.openTo} Fastest route is email — I actually reply.
        </p>
        <a className="glass contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <p className="mono dim" style={{ fontSize: "0.7rem", marginTop: "0.6rem" }}>
          64 bytes from {profile.location}: icmp_seq=1 ttl=∞
        </p>
      </div>

      <div className="social-grid fade-up fade-up-2">
        {profile.socials
          .filter((s) => s.kind !== "email")
          .map((s) => (
            <a key={s.kind} className="glass social-card" href={s.url} target="_blank" rel="noreferrer">
              <span className="sc-label">{s.label} ↗</span>
              <span className="sc-handle">{s.handle}</span>
            </a>
          ))}
      </div>
    </div>
  );
}
