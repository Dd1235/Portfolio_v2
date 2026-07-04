import { useContent } from "../state/ContentContext";
import SectionHeader from "../components/SectionHeader";
import MLPipeline from "../diagrams/MLPipeline";
import AnomalyHeatmap from "../diagrams/AnomalyHeatmap";
import ProjectCard from "../components/ProjectCard";
import Motif from "../components/Motif";

const LEADERBOARD = [
  { approach: "Pixel-space autoencoder", auc: "0.44", best: false },
  { approach: "Skip-AE (MSE/SSIM)", auc: "0.41–0.56", best: false },
  { approach: "ResNet50 features + KNN", auc: "0.74", best: false },
  { approach: "ViT features + KNN", auc: "0.95", best: false },
  { approach: "PatchCore (simplified)", auc: "0.98", best: false },
  { approach: "ResNet50 feature-space AE", auc: "0.99", best: true },
];

export default function Ml() {
  const { content } = useContent();
  const tectoro = content.experience.find((e) => e.org.includes("Tectoro"));
  const mlProjects = content.projects.filter(
    (p) => p.visible && p.tags.some((t) => ["ML", "GenAI", "Computer Vision"].includes(t)) && p.slug !== "mvtec-anomaly"
  );

  return (
    <div className="page container">
      <SectionHeader title="ML & Research" sub="applied, measured" />
      <p className="dim" style={{ maxWidth: "64ch", marginTop: "-0.4rem" }}>
        Machine learning with the same rules as my systems work: compare alternatives, hold the
        evaluation fixed, report the number.
      </p>

      {tectoro && (
        <>
          <SectionHeader title="Drone defect detection" sub="tectoro internship" />
          <div className="glass" style={{ padding: "1.6rem" }}>
            <div className="exp-head" style={{ marginBottom: "0.4rem" }}>
              <Motif name={tectoro.motif} size={30} />
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                  {tectoro.role} · {tectoro.org}
                </h3>
                <span className="dim mono" style={{ fontSize: "0.72rem" }}>
                  {tectoro.dates} · {tectoro.location}
                </span>
              </div>
            </div>
            <p className="dim" style={{ fontSize: "0.95rem" }}>{tectoro.summary}</p>
            <MLPipeline />
            <ul className="dim" style={{ fontSize: "0.9rem", marginTop: "1rem" }}>
              {tectoro.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      <SectionHeader title="Anomaly detection study" sub="mvtec ad · unsupervised" />
      <div className="two-col" style={{ alignItems: "start" }}>
        <div className="glass" style={{ padding: "1.4rem" }}>
          <p className="dim" style={{ fontSize: "0.92rem" }}>
            Train on defect-free carpet images only; detect stains, cuts, holes, and contamination at test
            time. Six approaches, one leaderboard — the finding is that <strong>representation beats
            architecture</strong>: the same autoencoder idea jumps from AUC 0.44 to 0.99 when moved into a
            pretrained network's feature space.
          </p>
          <table className="leaderboard">
            <thead>
              <tr>
                <th>approach</th>
                <th>auc</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((r) => (
                <tr key={r.approach} className={r.best ? "best" : ""}>
                  <td>{r.approach}{r.best ? " ★" : ""}</td>
                  <td className="mono">{r.auc}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <a className="btn" href="https://github.com/Dd1235/TinkerWithCV/tree/main/MVTec_AD" target="_blank" rel="noreferrer">
            notebooks ↗
          </a>
        </div>
        <div className="glass" style={{ padding: "1.4rem" }}>
          <AnomalyHeatmap />
          <p className="dim mono" style={{ fontSize: "0.72rem", marginTop: "0.8rem" }}>
            // anomaly score heat over image patches — the defect blob lights up in feature space
          </p>
        </div>
      </div>

      <SectionHeader title="More ML & GenAI builds" sub="projects" />
      <div className="card-grid">
        {mlProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
