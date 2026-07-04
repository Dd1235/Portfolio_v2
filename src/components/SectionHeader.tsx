/** Section title with a decorative, deterministic hex "address". */
export default function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  let h = 0;
  for (const c of title) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  const hex = `0x${h.toString(16).toUpperCase().padStart(4, "0")}`;
  return (
    <div className="section-header">
      <span className="hex">{hex}</span>
      <h2>{title}</h2>
      <span className="rule" />
      {sub && <span className="sub">{sub}</span>}
    </div>
  );
}
