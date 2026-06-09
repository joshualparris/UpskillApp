import { analyzeRequirementText } from "../lib/requirementAnalysis";
import { matchRequirements } from "../lib/workappBridge";
import type { Agency, RequirementAnalysis, TrainingOption } from "../types";

type Props = {
  requirementText: string;
  onTextChange: (text: string) => void;
  training: TrainingOption[];
  agencies: Agency[];
  analyses: RequirementAnalysis[];
  onSaveAnalysis: (analysis: RequirementAnalysis) => void;
};

export function RequirementBridge({ requirementText, onTextChange, training, agencies, analyses, onSaveAnalysis }: Props) {
  const matches = matchRequirements(requirementText, training);

  const saveAnalysis = () => {
    const draft = analyzeRequirementText(requirementText, training, agencies);
    onSaveAnalysis({
      ...draft,
      id: `analysis-${Date.now()}`,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <>
      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="label">WorkApp / job ad analysis</p>
            <h2>Requirement bridge</h2>
          </div>
          <button type="button" onClick={saveAnalysis} disabled={!requirementText.trim()}>
            Save analysis
          </button>
        </div>
        <div className="requirement-scanner">
          <label>
            Paste job ad, WorkApp summary, or training note
            <textarea
              value={requirementText}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder="Paste requirements — lawful manual import only (no scraping)."
            />
          </label>
          <div className="match-panel">
            <h3>Matched recommendations</h3>
            {matches.length ? (
              matches.map((match) => (
                <article key={match.id} className={match.id === "aged-care-risk" ? "risk-match" : ""}>
                  <h4>{match.label}</h4>
                  <p>{match.action}</p>
                  {match.training.length > 0 && <small>Training: {match.training.map((t) => t.course).join(", ")}</small>}
                </article>
              ))
            ) : (
              <p>Paste requirements above to generate pathway suggestions.</p>
            )}
          </div>
        </div>
      </section>

      {analyses.length > 0 && (
        <section className="section-shell">
          <div className="section-heading">
            <div>
              <p className="label">History</p>
              <h2>Saved requirement analyses</h2>
            </div>
          </div>
          <div className="analysis-history">
            {analyses.slice(0, 8).map((item) => (
              <article key={item.id} className="analysis-card">
                <h3>{item.title}</h3>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
                <p>{item.summary}</p>
                <ul>
                  {item.riskFlags.map((r) => (
                    <li key={r} className="risk-text">
                      {r}
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Fit:</strong> {item.fitsJosh ? "Josh " : ""}
                  {item.fitsKristy ? "Kristy" : ""}
                </p>
                <p>
                  <strong>Ask:</strong> {item.questionsToAsk.slice(0, 2).join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
