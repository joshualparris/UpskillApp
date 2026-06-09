import { Plus, RefreshCcw } from "lucide-react";
import { useState } from "react";
import type { ParentPathwaysState } from "../types";
import { TextBlock } from "./shared";

type Props = {
  parent: ParentPathwaysState;
  onChange: (parent: ParentPathwaysState) => void;
  onAddQuestion: (text: string) => void;
  onResetChecklist: () => void;
  onToggle: (item: string) => void;
};

export function ParentPathwaysPanel({ parent, onChange, onAddQuestion, onResetChecklist, onToggle }: Props) {
  const [newQuestion, setNewQuestion] = useState("");

  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="label">Support and funding</p>
          <h2>Parent Pathways / Yilabara</h2>
        </div>
      </div>
      <div className="parent-grid">
        <TextBlock label="Eligibility" value={parent.eligibility} onChange={(v) => onChange({ ...parent, eligibility: v })} />
        <TextBlock label="Provider contact" value={parent.providerContact} onChange={(v) => onChange({ ...parent, providerContact: v })} />
        <TextBlock label="Funding available" value={parent.fundingAvailable} onChange={(v) => onChange({ ...parent, fundingAvailable: v })} />
        <TextBlock label="Individual fund usage" value={parent.individualFundUsage} onChange={(v) => onChange({ ...parent, individualFundUsage: v })} />
        <TextBlock label="Goals discussed" value={parent.goalsDiscussed} onChange={(v) => onChange({ ...parent, goalsDiscussed: v })} />
        <TextBlock label="Training recommended" value={parent.trainingRecommended} onChange={(v) => onChange({ ...parent, trainingRecommended: v })} />
        <TextBlock label="Appointment notes" value={parent.appointmentNotes} onChange={(v) => onChange({ ...parent, appointmentNotes: v })} />
        <TextBlock label="Agreed next steps" value={parent.agreedNextSteps} onChange={(v) => onChange({ ...parent, agreedNextSteps: v })} />
        <label className="textarea-block">
          Next appointment
          <input type="date" value={parent.nextAppointment} onChange={(e) => onChange({ ...parent, nextAppointment: e.target.value })} />
        </label>
        <label className="textarea-block">
          Documents needed (one per line)
          <textarea
            value={parent.documentsNeeded.join("\n")}
            onChange={(e) =>
              onChange({
                ...parent,
                documentsNeeded: e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
        <div className="checklist">
          <div className="checklist-head">
            <h3>Ask Yilabara</h3>
            <button type="button" className="ghost-button" onClick={onResetChecklist}>
              <RefreshCcw size={14} /> Reset checks
            </button>
          </div>
          {parent.yilabaraChecklistItems.map((item) => (
            <label key={item} className="check-row">
              <input type="checkbox" checked={Boolean(parent.yilabaraChecklist[item])} onChange={() => onToggle(item)} />
              {item}
            </label>
          ))}
          <div className="checklist-add">
            <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Add a question to ask" aria-label="New checklist question" />
            <button
              type="button"
              onClick={() => {
                onAddQuestion(newQuestion);
                setNewQuestion("");
              }}
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
