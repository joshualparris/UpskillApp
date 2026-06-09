import { profiles } from "../profiles";
import type { PersonKey } from "../types";

export function ProfileSummary({ person }: { person: PersonKey }) {
  const profile = profiles[person];

  return (
    <section className="profile-summary">
      <p className="profile-summary-lead">{profile.summary}</p>
      <p className="profile-current"><strong>Current:</strong> {profile.currentRole}</p>
      <div className="profile-columns">
        <div>
          <h3>Strengths from resume</h3>
          <ul>{profile.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <h3>Target roles</h3>
          <ul>{profile.targetRoles.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <div className="profile-tags">
        {profile.clearances.map((item) => (
          <span key={item} className="profile-tag">
            {item}
          </span>
        ))}
      </div>
      <details className="resume-details">
        <summary>Resume highlights & contact</summary>
        <ul>{profile.resumeHighlights.map((item) => <li key={item}>{item}</li>)}</ul>
        <p>
          {profile.phone} · {profile.email} · {profile.address}
        </p>
      </details>
    </section>
  );
}
