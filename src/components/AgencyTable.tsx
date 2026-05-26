import type { AgencyScore } from '../types';

interface Props {
  agencies: Array<AgencyScore & { agency: import('../types').Agency }>;
}

export function AgencyTable({ agencies }: Props) {
  return (
    <div className="card">
      <h2>Agency Finder & Fit Scoring</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Agency</th>
              <th>Josh</th>
              <th>Kristy</th>
              <th>Priority</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map(({ agency, joshScore, kristyScore, priority, needsVerification }) => (
              <tr key={agency.id}>
                <td>
                  <strong>{agency.name}</strong>
                  <div>{agency.type}</div>
                </td>
                <td>{joshScore}</td>
                <td>{kristyScore}</td>
                <td>
                  <span className={`badge ${priority === 'Contact today' ? 'badge-danger' : priority === 'Contact this week' ? 'badge-warning' : 'badge-good'}`}>
                    {priority}
                  </span>
                </td>
                <td>{needsVerification ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
