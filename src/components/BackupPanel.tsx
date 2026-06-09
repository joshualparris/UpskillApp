import { Download, Upload, FileSpreadsheet } from "lucide-react";
import { buildWeeklyPlan, downloadJsonBackup, downloadMarkdownPlan, downloadAgenciesCsv } from "../lib/export";
import type { AppPersistedState } from "../types";

type Props = {
  state: AppPersistedState;
  onImport: (json: string) => void;
};

export function BackupPanel({ state, onImport }: Props) {
  const plan = buildWeeklyPlan(state.agencies, state.training, state.contacts, state.parent);

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      try {
        onImport(text);
        alert("Backup imported successfully.");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Import failed");
      }
    };
    input.click();
  };

  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="label">Backup & export</p>
          <h2>Keep your data safe</h2>
        </div>
        <div className="toolbar">
          <button type="button" onClick={() => downloadJsonBackup(state)}>
            <Download size={16} /> Download full backup (JSON)
          </button>
          <button type="button" onClick={handleImport}>
            <Upload size={16} /> Import backup
          </button>
          <button type="button" onClick={() => downloadMarkdownPlan(plan)}>
            <Download size={16} /> Download weekly plan
          </button>
          <button type="button" onClick={() => downloadAgenciesCsv(state.agencies)}>
            <FileSpreadsheet size={16} /> Export Agencies (CSV)
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(plan)}
            aria-label="Copy weekly plan to clipboard"
          >
            Copy weekly plan
          </button>
        </div>
      </div>
      <p className="backup-hint">JSON backup includes agencies, training, contacts, Parent Pathways, checklist, requirement analyses, and settings.</p>
    </section>
  );
}
