import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ScoreBreakdownItem } from "../types";

export function Summary({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <article className="summary-panel">
      <div className="panel-title">
        {icon}
        <h2>{title}</h2>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export function Metric({
  icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "neutral" | "ok" | "warn";
}) {
  return (
    <article className={`metric ${tone}`}>
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
      </div>
    </article>
  );
}

export function Priority({ priority }: { priority: string }) {
  return <span className={`priority ${priority.toLowerCase().replace(/\s+/g, "-")}`}>{priority}</span>;
}

export function Flag() {
  return (
    <span className="flag">
      <AlertTriangle size={14} /> Verify
    </span>
  );
}

export function Ok() {
  return (
    <span className="ok">
      <CheckCircle2 size={14} /> Current
    </span>
  );
}

export function ScoreBreakdownChips({
  breakdown,
  person,
}: {
  breakdown: ScoreBreakdownItem[];
  person?: "josh" | "kristy";
}) {
  const items = person ? breakdown.filter((b) => b.person === person) : breakdown;
  if (!items.length) return null;
  return (
    <div className="score-chips">
      {items.map((item) => (
        <span key={`${item.label}-${item.points}`} className={item.points < 0 ? "chip-negative" : "chip-positive"}>
          {item.points > 0 ? "+" : ""}
          {item.points} {item.label}
        </span>
      ))}
    </div>
  );
}

export function TextBlock({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="textarea-block">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function Inline({
  value,
  onChange,
  type = "text",
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return <input className="inline-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog-card">
        <h3 id="dialog-title">{title}</h3>
        <p>{message}</p>
        <div className="dialog-actions">
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="danger-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
