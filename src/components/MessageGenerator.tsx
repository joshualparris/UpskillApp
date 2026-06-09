import { generateMessage } from "../lib/messages";
import type { Agency, MessageKind, TrainingOption } from "../types";

const messageKinds: MessageKind[] = ["Josh agency", "Kristy agency", "Josh training", "Kristy training", "Parent Pathways", "3 day follow-up"];

type Props = {
  messageKind: MessageKind;
  onKindChange: (kind: MessageKind) => void;
  agency?: Agency;
  course?: TrainingOption;
};

export function MessageGenerator({ messageKind, onKindChange, agency, course }: Props) {
  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="label">Message generator</p>
          <h2>Contact templates</h2>
        </div>
        <select value={messageKind} onChange={(e) => onKindChange(e.target.value as MessageKind)} aria-label="Message type">
          {messageKinds.map((kind) => (
            <option key={kind}>{kind}</option>
          ))}
        </select>
      </div>
      <textarea className="message-output" readOnly value={generateMessage(messageKind, agency, course)} aria-label="Generated message" />
    </section>
  );
}
