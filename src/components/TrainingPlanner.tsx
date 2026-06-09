import { Archive, GraduationCap, Plus, Trash2 } from "lucide-react";
import { trainingScore, trainingScoreDetail } from "../lib/scoring";
import type { PersonKey, TrainingOption } from "../types";
import { Priority, ScoreBreakdownChips } from "./shared";

type Props = {
  person: PersonKey;
  training: TrainingOption[];
  courseId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onSave: (training: TrainingOption[]) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
};

export function TrainingPlanner({ person, training, courseId, onSelect, onAdd, onSave, onArchive, onDelete, showArchived }: Props) {
  const active = training.filter((t) => (showArchived ? true : !t.archived));
  const topJosh = active.filter((t) => t.person === "josh" || t.person === "both").sort((a, b) => trainingScore(b) - trainingScore(a)).slice(0, 5);
  const topKristy = active.filter((t) => t.person === "kristy" || t.person === "both").sort((a, b) => trainingScore(b) - trainingScore(a)).slice(0, 5);
  const selected = training.find((t) => t.id === courseId) ?? training[0];

  const PathwayList = ({ title, items }: { title: string; items: TrainingOption[] }) => (
    <article className="pathway-list">
      <h3>{title}</h3>
      {items.map((item) => (
        <button type="button" key={item.id} onClick={() => onSelect(item.id)}>
          <span>
            <strong>{item.course}</strong>
            <small>
              {item.provider} | {item.deliveryMode} | {item.duration}
            </small>
          </span>
          <b>{trainingScore(item)}</b>
        </button>
      ))}
    </article>
  );

  const CourseDetail = ({ course }: { course: TrainingOption }) => {
    const patch = (updates: Partial<TrainingOption>) => onSave(training.map((item) => (item.id === course.id ? { ...item, ...updates } : item)));
    const detail = trainingScoreDetail(course);
    return (
      <article className="detail-card">
        <div className="detail-card-head panel-title">
          <div>
            <GraduationCap size={20} />
            <h3>{course.course}</h3>
            <Priority priority={course.priority} />
          </div>
          <div className="detail-actions">
            <button type="button" className="icon-button" onClick={() => onArchive(course.id)}>
              <Archive size={14} />
            </button>
            <button type="button" className="icon-button danger" onClick={() => onDelete(course.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <ScoreBreakdownChips breakdown={detail.breakdown} />
        <div className="form-grid">
          <label>
            Course
            <input value={course.course} onChange={(e) => patch({ course: e.target.value })} />
          </label>
          <label>
            Provider
            <input value={course.provider} onChange={(e) => patch({ provider: e.target.value })} />
          </label>
          <label>
            Source URL
            <input value={course.sourceUrl} onChange={(e) => patch({ sourceUrl: e.target.value })} />
          </label>
          <label>
            Source name
            <input value={course.sourceName} onChange={(e) => patch({ sourceName: e.target.value })} />
          </label>
          <label>
            Last checked
            <input type="date" value={course.lastChecked} onChange={(e) => patch({ lastChecked: e.target.value })} />
          </label>
          <label>
            Verified by
            <input value={course.verifiedBy} onChange={(e) => patch({ verifiedBy: e.target.value })} />
          </label>
          <label>
            Cost
            <input value={course.cost} onChange={(e) => patch({ cost: e.target.value })} />
          </label>
          <label>
            Duration
            <input value={course.duration} onChange={(e) => patch({ duration: e.target.value })} />
          </label>
        </div>
        <label>
          Source notes
          <textarea value={course.sourceNotes} onChange={(e) => patch({ sourceNotes: e.target.value })} />
        </label>
      </article>
    );
  };

  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="label">Pathway planner</p>
          <h2>Training course finder</h2>
        </div>
        <button type="button" onClick={onAdd}>
          <Plus size={16} /> Add course for {person === "josh" ? "Josh" : "Kristy"}
        </button>
      </div>
      <div className="pathway-columns">
        <PathwayList title="Josh top 5" items={topJosh} />
        <PathwayList title="Kristy top 5" items={topKristy} />
      </div>
      {selected && <CourseDetail course={selected} />}
    </section>
  );
}
