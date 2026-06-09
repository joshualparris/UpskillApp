import { Archive, Trash2 } from "lucide-react";
import { scoreAgency } from "../lib/scoring";
import type { Agency } from "../types";
import { ScoreBreakdownChips, TextBlock } from "./shared";

type Props = {
  agency: Agency;
  agencies: Agency[];
  onSave: (agencies: Agency[]) => void;
  onArchive: () => void;
  onDelete: () => void;
};

export function AgencyDetail({ agency, agencies, onSave, onArchive, onDelete }: Props) {
  const score = scoreAgency(agency);
  const patch = (updates: Partial<Agency>) => onSave(agencies.map((item) => (item.id === agency.id ? { ...item, ...updates } : item)));

  return (
    <div className="detail-grid">
      <article className="detail-card">
        <div className="detail-card-head">
          <h3>{agency.name}</h3>
          <div className="detail-actions">
            <button type="button" className="icon-button" onClick={onArchive}>
              <Archive size={14} /> Archive
            </button>
            <button type="button" className="icon-button danger" onClick={onDelete}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Name
            <input value={agency.name} onChange={(e) => patch({ name: e.target.value })} />
          </label>
          <label>
            Phone
            <input value={agency.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </label>
          <label>
            Email
            <input value={agency.email} onChange={(e) => patch({ email: e.target.value })} />
          </label>
          <label>
            Website
            <input value={agency.website} onChange={(e) => patch({ website: e.target.value })} />
          </label>
          <label>
            Location
            <input value={agency.location} onChange={(e) => patch({ location: e.target.value })} />
          </label>
          <label>
            Opening hours
            <input value={agency.openingHours} onChange={(e) => patch({ openingHours: e.target.value })} />
          </label>
          <label>
            Last verified
            <input type="date" value={agency.lastVerified} onChange={(e) => patch({ lastVerified: e.target.value })} />
          </label>
          <label>
            Verification status
            <select value={agency.verificationStatus} onChange={(e) => patch({ verificationStatus: e.target.value as Agency["verificationStatus"] })}>
              {["verified", "needs_check", "stale", "unknown"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>
        <h4>Source tracking</h4>
        <div className="form-grid">
          <label>
            Source name
            <input value={agency.sourceName} onChange={(e) => patch({ sourceName: e.target.value })} />
          </label>
          <label>
            Source URL
            <input value={agency.sourceUrl} onChange={(e) => patch({ sourceUrl: e.target.value })} />
          </label>
          <label>
            Last checked
            <input type="date" value={agency.lastChecked} onChange={(e) => patch({ lastChecked: e.target.value })} />
          </label>
          <label>
            Verified by
            <input value={agency.verifiedBy} onChange={(e) => patch({ verifiedBy: e.target.value })} />
          </label>
        </div>
        <TextBlock label="Source notes" value={agency.sourceNotes} onChange={(v) => patch({ sourceNotes: v })} />
        <label className="check-row">
          <input type="checkbox" checked={Boolean(agency.kristyAgedCareOverride)} onChange={(e) => patch({ kristyAgedCareOverride: e.target.checked })} />
          Override aged-care warning (only if role is clearly non-aged-care)
        </label>
        <TextBlock label="Eligibility" value={agency.eligibilityRules} onChange={(v) => patch({ eligibilityRules: v })} />
        <TextBlock label="Costs" value={agency.costs} onChange={(v) => patch({ costs: v })} />
        <TextBlock label="Next action" value={agency.nextAction} onChange={(v) => patch({ nextAction: v })} />
        <TextBlock label="Notes" value={agency.notes} onChange={(v) => patch({ notes: v })} />
      </article>
      <article className="detail-card question-card">
        <h3>Score breakdown</h3>
        <p>
          <strong>Josh:</strong> {score.joshScore}
        </p>
        <ScoreBreakdownChips breakdown={score.joshBreakdown} person="josh" />
        <p>
          <strong>Kristy:</strong> {score.kristyHardPenalty ? "Poor fit (capped)" : score.kristyScore}
        </p>
        <ScoreBreakdownChips breakdown={score.kristyBreakdown} person="kristy" />
        <h3>Exact question to ask</h3>
        <p className="quoted">{score.exactQuestion}</p>
        <p>
          <strong>Biggest concern:</strong> {score.biggestConcern}
        </p>
      </article>
    </div>
  );
}
