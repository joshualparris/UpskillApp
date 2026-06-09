import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCloudState, pushCloudState } from "../api/client";
import { agenciesSeed, contactsSeed, parentPathwaysSeed, trainingSeed } from "../data";
import { emptyState, normalizeAgency, normalizeTraining, validateBackup } from "../lib/backup";
import { todayIso } from "../lib/export";
import { loadLocalState, mergeStates, persistLocalState, STORAGE_KEYS, saveStored, getHouseholdId } from "../lib/storage";
import type { Agency, AppPersistedState, Contact, MessageKind, ParentPathwaysState, PersonKey, RequirementAnalysis, TrainingOption } from "../types";

const inDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export function useAppState() {
  const initial = loadLocalState();
  const [state, setState] = useState<AppPersistedState>(initial);
  const [person, setPerson] = useState<PersonKey>("josh");
  const [query, setQuery] = useState("");
  const [agencyId, setAgencyId] = useState(initial.agencies[0]?.id ?? "");
  const [courseId, setCourseId] = useState(initial.training[0]?.id ?? "");
  const [messageKind, setMessageKind] = useState<MessageKind>("Josh agency");
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "ok" | "local-only" | "error">("idle");
  const [syncMessage, setSyncMessage] = useState("");
  const [saveFlash, setSaveFlash] = useState("");
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const householdId = getHouseholdId();

  const flash = (msg: string) => {
    setSaveFlash(msg);
    setTimeout(() => setSaveFlash(""), 2000);
  };

  const persistAll = useCallback(
    (next: AppPersistedState) => {
      setState(next);
      persistLocalState(next);
      flash("Saved");
      if (syncTimer.current) clearTimeout(syncTimer.current);
      syncTimer.current = setTimeout(async () => {
        setSyncStatus("syncing");
        try {
          const result = await pushCloudState(householdId, next);
          setSyncStatus(result.sync ? "ok" : "local-only");
          setSyncMessage(result.sync ? `Synced ${result.savedAt ?? "now"}` : "Browser-only");
          saveStored(STORAGE_KEYS.lastSync, new Date().toISOString());
        } catch (error) {
          setSyncStatus("error");
          setSyncMessage(error instanceof Error ? error.message : "Sync failed");
        }
      }, 800);
    },
    [householdId],
  );

  useEffect(() => {
    (async () => {
      try {
        const remote = await fetchCloudState(householdId);
        if (remote.state) {
          const merged = mergeStates(loadLocalState(), remote.state as AppPersistedState);
          setState(merged);
          persistLocalState(merged);
        }
        setSyncStatus(remote.sync ? "ok" : "local-only");
        setSyncMessage(remote.sync ? "Cloud sync ready" : "Saved in this browser");
      } catch {
        setSyncStatus("local-only");
        setSyncMessage("Saved in this browser");
      }
    })();
  }, [householdId]);

  const patch = (partial: Partial<AppPersistedState>) => persistAll({ ...state, ...partial });

  const setAgencyList = (agencies: Agency[]) => patch({ agencies });
  const setTrainingList = (training: TrainingOption[]) => patch({ training });
  const setContactList = (contacts: Contact[]) => patch({ contacts });
  const setParentState = (parent: ParentPathwaysState) => patch({ parent });
  const setRequirementText = (requirementText: string) => patch({ requirementText });
  const setAnalyses = (requirementAnalyses: RequirementAnalysis[]) => patch({ requirementAnalyses });
  const setShowArchived = (showArchived: boolean) => patch({ settings: { ...state.settings, showArchived } });

  const resetToSeed = () => {
    const fresh = emptyState();
    fresh.agencies = agenciesSeed;
    fresh.training = trainingSeed;
    fresh.contacts = contactsSeed;
    fresh.parent = parentPathwaysSeed;
    fresh.requirementText = "";
    fresh.requirementAnalyses = [];
    persistAll(fresh);
    setAgencyId(fresh.agencies[0]?.id ?? "");
    setCourseId(fresh.training[0]?.id ?? "");
  };

  const importBackup = (jsonText: string) => {
    const parsed = validateBackup(JSON.parse(jsonText));
    persistAll(parsed);
    setAgencyId(parsed.agencies[0]?.id ?? "");
    setCourseId(parsed.training[0]?.id ?? "");
  };

  const archiveAgency = (id: string) =>
    setAgencyList(state.agencies.map((a) => (a.id === id ? { ...a, archived: true } : a)));
  const deleteAgency = (id: string) => {
    const next = state.agencies.filter((a) => a.id !== id);
    setAgencyList(next);
    if (agencyId === id) setAgencyId(next[0]?.id ?? "");
  };

  const archiveCourse = (id: string) =>
    setTrainingList(state.training.map((t) => (t.id === id ? { ...t, archived: true } : t)));
  const deleteCourse = (id: string) => {
    const next = state.training.filter((t) => t.id !== id);
    setTrainingList(next);
    if (courseId === id) setCourseId(next[0]?.id ?? "");
  };

  const archiveContact = (id: string) =>
    setContactList(state.contacts.map((c) => (c.id === id ? { ...c, archived: true } : c)));
  const deleteContact = (id: string) => setContactList(state.contacts.filter((c) => c.id !== id));

  const addAgency = () => {
    const agency = normalizeAgency({
      id: `agency-${Date.now()}`,
      name: "New agency or provider",
      type: "recruiter",
      location: "Dubbo-relevant",
      helpsWith: ["manual entry"],
      joshRelevance: [],
      kristyRelevance: [],
      eligibilityRules: "Check directly.",
      costs: "Verify before acting.",
      notes: "",
      nextAction: "Verify contact details and ask what they can help with.",
      tags: ["manual"],
      confidence: "low",
      verificationStatus: "unknown",
    });
    setAgencyList([agency, ...state.agencies]);
    setAgencyId(agency.id);
  };

  const addCourse = () => {
    const course = normalizeTraining({
      id: `course-${Date.now()}`,
      person,
      course: "New course",
      provider: "Provider to verify",
      cost: "Check cost",
      fundingPossible: "Check subsidies",
      deliveryMode: "check",
      duration: "Check duration",
      priority: "Maybe later",
      status: "Idea",
      notes: "",
      questions: ["What are days, cost, subsidies, workload, and delivery mode?"],
    });
    setTrainingList([course, ...state.training]);
    setCourseId(course.id);
  };

  const addFollowUp = () => {
    const contact: Contact = {
      id: `contact-${Date.now()}`,
      agencyId: agencyId || state.agencies[0]?.id || "",
      personContacted: "",
      channel: "Phone",
      lastContact: todayIso(),
      nextFollowUp: inDays(3),
      notes: "",
      status: "Waiting",
    };
    setContactList([contact, ...state.contacts]);
  };

  const toggleChecklist = (item: string) =>
    setParentState({
      ...state.parent,
      yilabaraChecklist: { ...state.parent.yilabaraChecklist, [item]: !state.parent.yilabaraChecklist[item] },
    });

  const addChecklistItem = (text: string) => {
    if (!text.trim()) return;
    const item = text.trim();
    setParentState({
      ...state.parent,
      yilabaraChecklistItems: [...state.parent.yilabaraChecklistItems, item],
      yilabaraChecklist: { ...state.parent.yilabaraChecklist, [item]: false },
    });
  };

  const resetChecklist = () =>
    setParentState({
      ...state.parent,
      yilabaraChecklistItems: [...state.parent.yilabaraChecklistItems],
      yilabaraChecklist: Object.fromEntries(state.parent.yilabaraChecklistItems.map((i) => [i, false])),
    });

  return {
    state,
    person,
    setPerson,
    query,
    setQuery,
    agencyId,
    setAgencyId,
    courseId,
    setCourseId,
    messageKind,
    setMessageKind,
    syncStatus,
    syncMessage,
    saveFlash,
    persistAll,
    setAgencyList,
    setTrainingList,
    setContactList,
    setParentState,
    setRequirementText,
    setAnalyses,
    setShowArchived,
    resetToSeed,
    importBackup,
    archiveAgency,
    deleteAgency,
    archiveCourse,
    deleteCourse,
    archiveContact,
    deleteContact,
    addAgency,
    addCourse,
    addFollowUp,
    toggleChecklist,
    addChecklistItem,
    resetChecklist,
  };
}
