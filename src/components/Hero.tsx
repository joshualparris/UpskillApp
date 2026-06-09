import { Cloud, HeartPulse, RefreshCcw, UserRound } from "lucide-react";
import { profileText } from "../profiles";
import type { PersonKey } from "../types";

type Props = {
  person: PersonKey;
  onPersonChange: (person: PersonKey) => void;
  syncStatus: string;
  syncMessage: string;
  saveFlash: string;
  onResetRequest: () => void;
};

export function Hero({ person, onPersonChange, syncStatus, syncMessage, saveFlash, onResetRequest }: Props) {
  return (
    <>
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Dubbo NSW employment support planner</p>
          <h1>UpskillApp</h1>
          <p>Agencies, training, funding, follow-ups, and next steps for Josh and Kristy Parris.</p>
        </div>
        <div className="hero-panel">
          <div className="toggle-row" role="tablist" aria-label="Choose person">
            <button type="button" role="tab" aria-selected={person === "josh"} className={person === "josh" ? "active" : ""} onClick={() => onPersonChange("josh")}>
              <UserRound size={16} /> Josh
            </button>
            <button type="button" role="tab" aria-selected={person === "kristy"} className={person === "kristy" ? "active" : ""} onClick={() => onPersonChange("kristy")}>
              <HeartPulse size={16} /> Kristy
            </button>
          </div>
          <h2>{profileText[person].title}</h2>
          <p>{profileText[person].availability}</p>
          <p>{profileText[person].focus}</p>
        </div>
      </header>
      <section className="action-band">
        <div>
          <p className="label">Status</p>
          <h2>{saveFlash || "All changes save automatically in this browser"}</h2>
        </div>
        <div className="action-band-tools">
          <span className={`sync-pill ${syncStatus}`}>
            <Cloud size={14} /> {syncMessage || "Saving…"}
          </span>
          <button type="button" className="ghost-button" onClick={onResetRequest} aria-label="Reset all data to seed">
            <RefreshCcw size={16} /> Reset seed data
          </button>
        </div>
      </section>
    </>
  );
}
