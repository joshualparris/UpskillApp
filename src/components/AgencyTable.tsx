import { Archive, Plus, Search, Trash2 } from "lucide-react";
import { needsVerification, scoreAgency } from "../lib/scoring";
import type { Agency } from "../types";
import { Flag, Ok, Priority, ScoreBreakdownChips } from "./shared";

type Props = {
  agencies: Agency[];
  query: string;
  onQueryChange: (q: string) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
  onToggleArchived: () => void;
};

export function AgencyTable({
  agencies,
  query,
  onQueryChange,
  selectedId,
  onSelect,
  onAdd,
  onArchive,
  onDelete,
  showArchived,
  onToggleArchived,
}: Props) {
  const visible = agencies
    .filter((a) => (showArchived ? true : !a.archived))
    .map((agency) => ({ agency, score: scoreAgency(agency) }))
    .filter(({ agency }) =>
      `${agency.name} ${agency.type} ${agency.location} ${agency.tags.join(" ")} ${agency.nextAction}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );

  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="label">Agency finder and scoring</p>
          <h2>Agency CRM</h2>
        </div>
        <div className="toolbar">
          <label className="search-box">
            <Search size={16} />
            <input value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder="Filter agencies" aria-label="Filter agencies" />
          </label>
          <button type="button" className="ghost-button" onClick={onToggleArchived}>
            {showArchived ? "Hide archived" : "Show archived"}
          </button>
          <button type="button" onClick={onAdd}>
            <Plus size={16} /> Add agency
          </button>
        </div>
      </div>
      <div className="table-wrap desktop-table">
        <table>
          <thead>
            <tr>
              <th>Agency</th>
              <th>Type</th>
              <th>Josh</th>
              <th>Kristy</th>
              <th>Priority</th>
              <th>Source</th>
              <th>Next action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ agency, score }) => (
              <tr
                key={agency.id}
                className={`${agency.id === selectedId ? "selected" : ""} ${agency.archived ? "archived-row" : ""}`}
                onClick={() => onSelect(agency.id)}
              >
                <td>
                  <strong>{agency.name}</strong>
                  <span>{score.bestReason}</span>
                </td>
                <td>{agency.type}</td>
                <td>
                  {score.joshScore}
                  <ScoreBreakdownChips breakdown={score.joshBreakdown} person="josh" />
                </td>
                <td className={score.kristyHardPenalty ? "warning-text" : ""}>
                  {score.kristyHardPenalty ? "Poor fit" : score.kristyScore}
                  <ScoreBreakdownChips breakdown={score.kristyBreakdown} person="kristy" />
                </td>
                <td>
                  <Priority priority={score.priority} />
                </td>
                <td>
                  <span className={`verify-${agency.verificationStatus}`}>{agency.verificationStatus}</span>
                  {needsVerification(agency.lastVerified) ? <Flag /> : <Ok />}
                </td>
                <td>{agency.nextAction}</td>
                <td className="row-actions" onClick={(e) => e.stopPropagation()}>
                  <button type="button" className="icon-button" aria-label="Archive agency" onClick={() => onArchive(agency.id)}>
                    <Archive size={14} />
                  </button>
                  <button type="button" className="icon-button danger" aria-label="Delete agency" onClick={() => onDelete(agency.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mobile-cards">
        {visible.map(({ agency, score }) => (
          <article key={agency.id} className={`mobile-card ${agency.id === selectedId ? "selected" : ""}`} onClick={() => onSelect(agency.id)}>
            <h3>{agency.name}</h3>
            <p>
              Josh {score.joshScore} · Kristy {score.kristyHardPenalty ? "Poor fit" : score.kristyScore}
            </p>
            <Priority priority={score.priority} />
            <p>{agency.nextAction}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
