import type { TrainingScore, TrainingOption } from '../types';

interface TrainingRow extends TrainingScore {
  option: TrainingOption;
}

interface Props {
  title: string;
  profile: 'Josh' | 'Kristy';
  training: TrainingRow[];
}

export function TrainingTable({ title, profile, training }: Props) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>Top pathway recommendations for {profile}.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Provider</th>
              <th>Priority</th>
              <th>Support</th>
            </tr>
          </thead>
          <tbody>
            {training.map(({ option, score, priority, supportsWorkApp }) => (
              <tr key={option.id}>
                <td>
                  <strong>{option.name}</strong>
                  <div>{option.description}</div>
                </td>
                <td>{option.provider}</td>
                <td>{priority}</td>
                <td>{supportsWorkApp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
