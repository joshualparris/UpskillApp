import { useState } from 'react';
import type { Agency, TrainingOption } from '../types';

interface Props {
  addAgency: (agency: Agency) => void;
  addTraining: (training: TrainingOption) => void;
}

export function ManualEntry({ addAgency, addTraining }: Props) {
  const [agencyName, setAgencyName] = useState('');
  const [trainingName, setTrainingName] = useState('');

  const handleAddAgency = () => {
    if (!agencyName.trim()) return;
    addAgency({
      id: `manual-agency-${Date.now()}`,
      name: agencyName.trim(),
      type: 'support',
      location: 'Dubbo NSW',
      phone: 'TBD',
      email: 'TBD',
      website: '',
      openingHours: 'TBD',
      helps: 'Manual entry; verify details.',
      joshRelevance: 'Verify manually.',
      kristyRelevance: 'Verify manually.',
      eligibility: 'TBD',
      costs: 'TBD',
      funding: 'TBD',
      courses: 'TBD',
      lastVerified: new Date().toISOString().slice(0, 10),
      confidence: 50,
      notes: 'Manually added record. Check details before acting.',
      nextAction: 'Verify contact details and fit.',
      tags: ['needs-verification'],
    });
    setAgencyName('');
  };

  const handleAddTraining = () => {
    if (!trainingName.trim()) return;
    addTraining({
      id: `manual-training-${Date.now()}`,
      name: trainingName.trim(),
      provider: 'Manual entry',
      description: 'Manual training entry. Verify details and funding.',
      focus: 'both',
      delivery: 'TBD',
      duration: 'TBD',
      cost: 'TBD',
      funding: 'TBD',
      alignment: 'Manual entry. Assess against profile goals.',
      lastVerified: new Date().toISOString().slice(0, 10),
      confidence: 50,
      notes: 'Add details after contacting the provider.',
      tags: ['manual'],
    });
    setTrainingName('');
  };

  return (
    <div>
      <h2>Manual entry</h2>
      <p>Add a custom agency or training provider for ongoing tracking.</p>
      <div className="card form-grid">
        <label>
          Agency name
          <input
            value={agencyName}
            onChange={(event) => setAgencyName(event.target.value)}
            placeholder="Enter agency or provider name"
          />
        </label>
        <button type="button" onClick={handleAddAgency}>
          Add agency
        </button>
      </div>
      <div className="card form-grid">
        <label>
          Training option
          <input
            value={trainingName}
            onChange={(event) => setTrainingName(event.target.value)}
            placeholder="Enter course or program name"
          />
        </label>
        <button type="button" onClick={handleAddTraining}>
          Add training
        </button>
      </div>
    </div>
  );
}
