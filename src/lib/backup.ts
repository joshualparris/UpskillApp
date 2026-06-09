import { agenciesSeed, contactsSeed, parentPathwaysSeed, trainingSeed } from "../data";
import type { Agency, AppPersistedState, Contact, ParentPathwaysState, TrainingOption } from "../types";
import { BACKUP_VERSION, DEFAULT_CHECKLIST_ITEMS, defaultSourceTracking } from "../types";

const normalizeSource = <T extends { lastVerified?: string }>(item: T): T => ({
  ...defaultSourceTracking(),
  ...item,
});

export const normalizeAgency = (agency: Partial<Agency> & { id: string; name: string }): Agency =>
  normalizeSource({
    archived: false,
    kristyAgedCareOverride: false,
    type: "recruiter",
    location: "",
    phone: "",
    email: "",
    website: "",
    openingHours: "",
    helpsWith: [],
    joshRelevance: [],
    kristyRelevance: [],
    eligibilityRules: "",
    costs: "",
    fundingOptions: [],
    servicesOffered: [],
    lastVerified: "",
    confidence: "medium",
    notes: "",
    nextAction: "",
    tags: [],
    ...agency,
  }) as Agency;

export const normalizeTraining = (course: Partial<TrainingOption> & { id: string; course: string }): TrainingOption =>
  normalizeSource({
    person: "josh",
    provider: "",
    cost: "",
    fundingPossible: "",
    deliveryMode: "check",
    duration: "",
    priority: "Maybe later",
    status: "Idea",
    employabilityImpact: 5,
    timeFit: 5,
    costFit: 5,
    fundingAvailability: 5,
    strengthsAlignment: 5,
    availabilityFit: 5,
    stressFit: 5,
    longTermValue: 5,
    jobsUnlocked: [],
    questions: [],
    notes: "",
    lastVerified: "",
    archived: false,
    ...course,
  }) as TrainingOption;

export const normalizeParent = (parent: Partial<ParentPathwaysState>): ParentPathwaysState => {
  const items = parent.yilabaraChecklistItems?.length
    ? parent.yilabaraChecklistItems
    : [...DEFAULT_CHECKLIST_ITEMS];
  const checklist = Object.fromEntries(items.map((item) => [item, Boolean(parent.yilabaraChecklist?.[item])]));
  return {
    ...parentPathwaysSeed,
    ...parent,
    yilabaraChecklistItems: items,
    yilabaraChecklist: checklist,
    documentsNeeded: parent.documentsNeeded ?? parentPathwaysSeed.documentsNeeded,
  };
};

export const emptyState = (): AppPersistedState => ({
  version: BACKUP_VERSION,
  agencies: agenciesSeed,
  training: trainingSeed,
  contacts: contactsSeed,
  parent: parentPathwaysSeed,
  requirementText: "",
  requirementAnalyses: [],
  settings: { showArchived: false },
});

export const validateBackup = (raw: unknown): AppPersistedState => {
  if (!raw || typeof raw !== "object") {
    throw new Error("Backup file is not a valid JSON object.");
  }
  const data = raw as Partial<AppPersistedState>;
  if (!Array.isArray(data.agencies) || !Array.isArray(data.training) || !Array.isArray(data.contacts)) {
    throw new Error("Backup is missing agencies, training, or contacts arrays.");
  }

  return {
    version: typeof data.version === "number" ? data.version : 1,
    agencies: data.agencies.map((item) => normalizeAgency(item as Agency)),
    training: data.training.map((item) => normalizeTraining(item as TrainingOption)),
    contacts: (data.contacts as Contact[]).map((c) => ({ archived: false, ...c })),
    parent: normalizeParent((data.parent as ParentPathwaysState) ?? parentPathwaysSeed),
    requirementText: typeof data.requirementText === "string" ? data.requirementText : "",
    requirementAnalyses: Array.isArray(data.requirementAnalyses) ? data.requirementAnalyses : [],
    settings: data.settings ?? { showArchived: false },
  };
};
