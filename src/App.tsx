import { useMemo, useState } from "react";
import { AgencyDetail } from "./components/AgencyDetail";
import { AgencyTable } from "./components/AgencyTable";
import { BackupPanel } from "./components/BackupPanel";
import { ContactTracker } from "./components/ContactTracker";
import { Hero } from "./components/Hero";
import { JobsPanel } from "./components/JobsPanel";
import { MessageGenerator } from "./components/MessageGenerator";
import { ParentPathwaysPanel } from "./components/ParentPathwaysPanel";
import { ProfileSummary } from "./components/ProfileSummary";
import { RequirementBridge } from "./components/RequirementBridge";
import { SummaryCards } from "./components/SummaryCards";
import { TodayMode } from "./components/TodayMode";
import { TrainingPlanner } from "./components/TrainingPlanner";
import { ConfirmDialog } from "./components/shared";
import { useAppState } from "./hooks/useAppState";
import { scoreAgency, trainingScore } from "./lib/scoring";
import { profiles } from "./profiles";
import type { RequirementAnalysis } from "./types";

export function App() {
  const app = useAppState();
  const { state, person, query, agencyId, courseId, messageKind } = app;
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: string; id: string } | null>(null);

  const activeAgencies = state.agencies.filter((a) => (state.settings.showArchived ? true : !a.archived));

  const scored = useMemo(
    () =>
      activeAgencies
        .map((agency) => ({ agency, score: scoreAgency(agency) }))
        .sort((a, b) => Math.max(b.score.joshScore, b.score.kristyScore) - Math.max(a.score.joshScore, a.score.kristyScore)),
    [activeAgencies],
  );

  const topJoshAgencies = scored.filter(({ score }) => score.joshScore > 0).sort((a, b) => b.score.joshScore - a.score.joshScore);
  const topKristyAgencies = scored
    .filter(({ score }) => !score.kristyHardPenalty && score.kristyScore > 0)
    .sort((a, b) => b.score.kristyScore - a.score.kristyScore);

  const topJoshTraining = state.training
    .filter((t) => !t.archived && (t.person === "josh" || t.person === "both"))
    .sort((a, b) => trainingScore(b) - trainingScore(a));
  const topKristyTraining = state.training
    .filter((t) => !t.archived && (t.person === "kristy" || t.person === "both"))
    .sort((a, b) => trainingScore(b) - trainingScore(a));

  const selectedAgency = state.agencies.find((a) => a.id === agencyId) ?? state.agencies[0];
  const selectedCourse = state.training.find((t) => t.id === courseId) ?? state.training[0];
  const bestAction = person === "josh" ? topJoshAgencies[0]?.agency.nextAction : topKristyAgencies[0]?.agency.nextAction;

  const saveAnalysis = (analysis: RequirementAnalysis) => app.setAnalyses([analysis, ...state.requirementAnalyses]);

  return (
    <main>
      <Hero
        person={person}
        onPersonChange={app.setPerson}
        syncStatus={app.syncStatus}
        syncMessage={app.syncMessage}
        saveFlash={app.saveFlash}
        onResetRequest={() => setConfirmReset(true)}
      />

      <TodayMode person={person} agencies={state.agencies} training={state.training} contacts={state.contacts} bestAction={bestAction} />

      <SummaryCards
        agencies={state.agencies}
        training={state.training}
        contacts={state.contacts}
        topJoshAgency={topJoshAgencies[0]?.agency}
        topKristyAgency={topKristyAgencies[0]?.agency}
        topJoshCourse={topJoshTraining[0]}
        topKristyCourse={topKristyTraining[0]}
      />

      <section className="section-shell profile-shell">
        <div className="section-heading">
          <div>
            <p className="label">Resume-backed profile</p>
            <h2>{profiles[person].fullName}</h2>
          </div>
        </div>
        <ProfileSummary person={person} />
      </section>

      <BackupPanel state={state} onImport={app.importBackup} />

      <AgencyTable
        agencies={state.agencies}
        query={query}
        onQueryChange={app.setQuery}
        selectedId={agencyId}
        onSelect={app.setAgencyId}
        onAdd={app.addAgency}
        onArchive={app.archiveAgency}
        onDelete={(id) => setConfirmDelete({ type: "agency", id })}
        showArchived={state.settings.showArchived}
        onToggleArchived={() => app.setShowArchived(!state.settings.showArchived)}
      />
      {selectedAgency && (
        <AgencyDetail
          agency={selectedAgency}
          agencies={state.agencies}
          onSave={app.setAgencyList}
          onArchive={() => app.archiveAgency(selectedAgency.id)}
          onDelete={() => setConfirmDelete({ type: "agency", id: selectedAgency.id })}
        />
      )}

      <TrainingPlanner
        person={person}
        training={state.training}
        courseId={courseId}
        onSelect={app.setCourseId}
        onAdd={app.addCourse}
        onSave={app.setTrainingList}
        onArchive={app.archiveCourse}
        onDelete={(id) => setConfirmDelete({ type: "course", id })}
        showArchived={state.settings.showArchived}
      />

      <JobsPanel person={person} onApplyToBridge={app.setRequirementText} />

      <ParentPathwaysPanel
        parent={state.parent}
        onChange={app.setParentState}
        onToggle={app.toggleChecklist}
        onAddQuestion={app.addChecklistItem}
        onResetChecklist={app.resetChecklist}
      />

      <ContactTracker
        agencies={state.agencies}
        contacts={state.contacts}
        onChange={app.setContactList}
        onAdd={app.addFollowUp}
        onArchive={app.archiveContact}
        onDelete={(id) => setConfirmDelete({ type: "contact", id })}
        showArchived={state.settings.showArchived}
      />

      <MessageGenerator messageKind={messageKind} onKindChange={app.setMessageKind} agency={selectedAgency} course={selectedCourse} />

      <RequirementBridge
        requirementText={state.requirementText}
        onTextChange={app.setRequirementText}
        training={state.training}
        agencies={state.agencies}
        analyses={state.requirementAnalyses}
        onSaveAnalysis={saveAnalysis}
      />

      <ConfirmDialog
        open={confirmReset}
        title="Reset all data?"
        message="This replaces agencies, training, contacts, and notes with fresh seed data. Download a JSON backup first if you want to keep current edits."
        confirmLabel="Reset seed data"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          app.resetToSeed();
          setConfirmReset(false);
        }}
      />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete permanently?"
        message="Archived items are hidden but recoverable. Delete removes this record completely."
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          if (!confirmDelete) return;
          if (confirmDelete.type === "agency") app.deleteAgency(confirmDelete.id);
          if (confirmDelete.type === "course") app.deleteCourse(confirmDelete.id);
          if (confirmDelete.type === "contact") app.deleteContact(confirmDelete.id);
          setConfirmDelete(null);
        }}
      />
    </main>
  );
}
