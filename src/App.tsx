import { useMemo, useState } from 'react';
import { agencies as initialAgencies, initialTrainingOptions, joshProfile, kristyProfile } from './data';
import { computeAgencyScore, computeJoshTrainingScore, computeKristyTrainingScore } from './utils';
import { AgencyTable } from './components/AgencyTable';
import { TrainingTable } from './components/TrainingTable';
import { ProfileCards } from './components/ProfileCards';
import { QuestionGenerator } from './components/QuestionGenerator';
import { ContactMessages } from './components/ContactMessages';
import { NextActions } from './components/NextActions';
import { ManualEntry } from './components/ManualEntry';
import type { Agency, TrainingOption } from './types';

function App() {
  const [agencies, setAgencies] = useState<Agency[]>(initialAgencies);
  const [trainingOptions, setTrainingOptions] = useState<TrainingOption[]>(initialTrainingOptions);

  const agencyScores = useMemo(
    () => agencies.map((agency) => ({ agency, ...computeAgencyScore(agency) })),
    [agencies]
  );

  const topJoshTrainings = useMemo(
    () =>
      trainingOptions
        .map((option) => ({ option, ...computeJoshTrainingScore(option) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    [trainingOptions]
  );

  const topKristyTrainings = useMemo(
    () =>
      trainingOptions
        .map((option) => ({ option, ...computeKristyTrainingScore(option) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    [trainingOptions]
  );

  const nextActions = useMemo(() => {
    const agencyAction = agencyScores.find((item) => item.priority === 'Contact today' || item.priority === 'Contact this week');
    const trainingAction = topJoshTrainings[0] || topKristyTrainings[0];

    return [
      agencyAction
        ? `Call or email ${agencyAction.agency.name} about ${agencyAction.agency.type} support and next steps.`
        : 'Review agency list and mark the best local match.',
      trainingAction
        ? `Check availability for ${trainingAction.option.name}.`
        : 'Review training recommendations to match WorkApp job requirements.',
      'Update verification dates for any agency or provider older than 30 days.',
    ];
  }, [agencyScores, topJoshTrainings, topKristyTrainings]);

  return (
    <div className="page-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">UpskillApp</p>
          <h1>Support ecosystem for Josh & Kristy in Dubbo</h1>
          <p className="hero-copy">
            Find local agencies, training, funding, and practical next actions to improve employability without overwhelm.
          </p>
        </div>
      </header>

      <main>
        <section className="grid-3">
          <ProfileCards joshProfile={joshProfile} kristyProfile={kristyProfile} />
          <div className="card">
            <h2>Today’s best next actions</h2>
            <NextActions actions={nextActions} />
          </div>
          <div className="card">
            <h2>Quick reference</h2>
            <ul className="summary-list">
              <li>Built for Dubbo-specific agencies, training, funding, and pathways.</li>
              <li>Agency fit scoring is separated for Josh and Kristy.</li>
              <li>Training recommendations link to WorkApp readiness.</li>
            </ul>
          </div>
        </section>

        <section className="grid-2">
          <AgencyTable agencies={agencyScores} />
          <TrainingTable
            title="Top training for Josh"
            training={topJoshTrainings}
            profile="Josh"
          />
          <TrainingTable
            title="Top training for Kristy"
            training={topKristyTrainings}
            profile="Kristy"
          />
        </section>

        <section className="grid-2">
          <QuestionGenerator />
          <ContactMessages />
        </section>

        <section className="card">
          <ManualEntry
            addAgency={(agency) => setAgencies((current) => [agency, ...current])}
            addTraining={(training) => setTrainingOptions((current) => [training, ...current])}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
