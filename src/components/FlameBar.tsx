import type { SkillGroup } from "../types";

export default function FlameBars({ group }: { group: SkillGroup }) {
  return (
    <div className="flame-group">
      {group.skills.map((s, i) => (
        <div className="flame-bar" key={s.name}>
          <span className="flame-name">{s.name}</span>
          <div className="flame-track">
            <div
              className={`flame-fill tone-${group.tone}`}
              style={{ width: `${s.level}%`, animationDelay: `${i * 0.08}s` }}
            >
              {s.note ?? ""}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
