import type { Profile } from '../types';

interface Props {
  joshProfile: Profile;
  kristyProfile: Profile;
}

export function ProfileCards({ joshProfile, kristyProfile }: Props) {
  return (
    <div className="card profile-grid">
      <div className="profile-card">
        <h3>{joshProfile.name}</h3>
        <p><strong>Role:</strong> {joshProfile.role}</p>
        <p>{joshProfile.goals}</p>
        <p><strong>Availability:</strong> {joshProfile.availability}</p>
        <p><strong>Not looking for:</strong> {joshProfile.notLookingFor}</p>
        <p><strong>Strengths:</strong> {joshProfile.strengths}</p>
        <div className="tag-line">
          <span className="tag-pill">Dubbo</span>
          <span className="tag-pill">Part-time</span>
          <span className="tag-pill">ICT support</span>
        </div>
      </div>
      <div className="profile-card">
        <h3>{kristyProfile.name}</h3>
        <p><strong>Role:</strong> {kristyProfile.role}</p>
        <p>{kristyProfile.goals}</p>
        <p><strong>Availability:</strong> {kristyProfile.availability}</p>
        <p><strong>Not looking for:</strong> {kristyProfile.notLookingFor}</p>
        <p><strong>Strengths:</strong> {kristyProfile.strengths}</p>
        <div className="tag-line">
          <span className="tag-pill">Nurse</span>
          <span className="tag-pill">Family-friendly</span>
          <span className="tag-pill">Non-aged-care</span>
        </div>
      </div>
    </div>
  );
}
