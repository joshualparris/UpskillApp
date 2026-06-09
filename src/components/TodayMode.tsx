import { Clock } from "lucide-react";
import { buildTodayActions } from "../lib/todayActions";
import type { Agency, Contact, PersonKey, TrainingOption } from "../types";

type Props = {
  person: PersonKey;
  agencies: Agency[];
  training: TrainingOption[];
  contacts: Contact[];
  bestAction?: string;
};

export function TodayMode({ person, agencies, training, contacts, bestAction }: Props) {
  const { top3, quick10 } = buildTodayActions(person, agencies, training, contacts);
  const quick = quick10 ?? { label: "Pick one action", detail: "Choose the highest-priority contact.", minutes: 10, id: "fallback", kind: "agency" as const };

  return (
    <section className="section-shell today-mode">
      <div className="section-heading">
        <div>
          <p className="label">Today mode</p>
          <h2>{person === "josh" ? "Josh" : "Kristy"} — focus on what matters today</h2>
        </div>
      </div>
      <article className="today-quick">
        <Clock size={18} />
        <div>
          <h3>10-minute action</h3>
          <p>{quick.label}</p>
          <small>{quick.detail}</small>
        </div>
      </article>
      {bestAction && (
        <p className="today-best">
          <strong>Best next action:</strong> {bestAction}
        </p>
      )}
      <ol className="today-list">
        {top3.map((action) => (
          <li key={action.id}>
            <strong>{action.label}</strong> (~{action.minutes} min)
            <span>{action.detail}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
