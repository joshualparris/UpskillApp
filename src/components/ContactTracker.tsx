import { Archive, Plus, Trash2 } from "lucide-react";
import { todayIso } from "../lib/export";
import type { Agency, Contact } from "../types";
import { Inline } from "./shared";

type Props = {
  agencies: Agency[];
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
  onAdd: () => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  showArchived: boolean;
};

const statusClass = (status: Contact["status"]) => {
  switch (status) {
    case "Follow up":
      return "status-follow-up";
    case "Waiting":
      return "status-waiting";
    case "Booked":
      return "status-booked";
    case "Closed":
      return "status-closed";
    default:
      return "status-not-started";
  }
};

export function ContactTracker({ agencies, contacts, onChange, onAdd, onArchive, onDelete, showArchived }: Props) {
  const visible = contacts.filter((c) => (showArchived ? true : !c.archived));
  const patch = (id: string, updates: Partial<Contact>) => onChange(contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)));

  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="label">Follow-up system</p>
          <h2>Contact tracker</h2>
        </div>
        <button type="button" onClick={onAdd}>
          <Plus size={16} /> Add follow-up
        </button>
      </div>
      <div className="table-wrap desktop-table">
        <table>
          <thead>
            <tr>
              <th>Agency</th>
              <th>Person</th>
              <th>Channel</th>
              <th>Last</th>
              <th>Next</th>
              <th>Status</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((contact) => (
              <tr key={contact.id} className={contact.nextFollowUp && contact.nextFollowUp <= todayIso() ? "due-row" : undefined}>
                <td>{agencies.find((a) => a.id === contact.agencyId)?.name ?? "Unknown"}</td>
                <td>
                  <Inline value={contact.personContacted} onChange={(v) => patch(contact.id, { personContacted: v })} />
                </td>
                <td>
                  <select className="inline-input" value={contact.channel} onChange={(e) => patch(contact.id, { channel: e.target.value as Contact["channel"] })}>
                    {["Phone", "Email", "Web form", "In person"].map((ch) => (
                      <option key={ch}>{ch}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <Inline type="date" value={contact.lastContact} onChange={(v) => patch(contact.id, { lastContact: v })} />
                </td>
                <td>
                  <Inline type="date" value={contact.nextFollowUp} onChange={(v) => patch(contact.id, { nextFollowUp: v })} />
                </td>
                <td>
                  <select className={`inline-input ${statusClass(contact.status)}`} value={contact.status} onChange={(e) => patch(contact.id, { status: e.target.value as Contact["status"] })}>
                    {["Not started", "Waiting", "Follow up", "Booked", "Closed"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <Inline value={contact.notes} onChange={(v) => patch(contact.id, { notes: v })} />
                </td>
                <td className="row-actions">
                  <button type="button" className="icon-button" aria-label="Archive" onClick={() => onArchive(contact.id)}>
                    <Archive size={14} />
                  </button>
                  <button type="button" className="icon-button danger" aria-label="Delete" onClick={() => onDelete(contact.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="empty-state">
                  No active follow-ups. Click &quot;Add follow-up&quot; to track your next steps.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
