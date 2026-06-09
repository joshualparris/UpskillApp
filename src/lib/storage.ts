import { agenciesSeed, contactsSeed, parentPathwaysSeed, trainingSeed } from "../data";
import { emptyState, normalizeAgency, normalizeParent, normalizeTraining } from "./backup";
import type { Agency, AppPersistedState, ParentPathwaysState, TrainingOption } from "../types";
import { BACKUP_VERSION } from "../types";

export const STORAGE_KEYS = {
  agencies: "upskillapp.agencies",
  training: "upskillapp.training",
  contacts: "upskillapp.contacts",
  parent: "upskillapp.parent",
  requirementText: "upskillapp.requirementText",
  analyses: "upskillapp.analyses",
  settings: "upskillapp.settings",
  householdId: "upskillapp.householdId",
  lastSync: "upskillapp.lastSync",
};

export const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const saveStored = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

export const getHouseholdId = () => {
  const existing = localStorage.getItem(STORAGE_KEYS.householdId);
  if (existing) return existing;
  const id = "parris-dubbo";
  localStorage.setItem(STORAGE_KEYS.householdId, id);
  return id;
};

export const loadLocalState = (): AppPersistedState => {
  const base = emptyState();
  const legacyAgencies = readStored(STORAGE_KEYS.agencies, null as Agency[] | null);
  return {
    version: BACKUP_VERSION,
    agencies: legacyAgencies ? legacyAgencies.map((a) => normalizeAgency(a)) : base.agencies,
    training: readStored(STORAGE_KEYS.training, trainingSeed).map((t) => normalizeTraining(t)),
    contacts: readStored(STORAGE_KEYS.contacts, contactsSeed),
    parent: normalizeParent(readStored(STORAGE_KEYS.parent, parentPathwaysSeed)),
    requirementText: readStored(STORAGE_KEYS.requirementText, ""),
    requirementAnalyses: readStored(STORAGE_KEYS.analyses, []),
    settings: readStored(STORAGE_KEYS.settings, { showArchived: false }),
  };
};

export const persistLocalState = (state: AppPersistedState) => {
  saveStored(STORAGE_KEYS.agencies, state.agencies);
  saveStored(STORAGE_KEYS.training, state.training);
  saveStored(STORAGE_KEYS.contacts, state.contacts);
  saveStored(STORAGE_KEYS.parent, state.parent);
  saveStored(STORAGE_KEYS.requirementText, state.requirementText);
  saveStored(STORAGE_KEYS.analyses, state.requirementAnalyses);
  saveStored(STORAGE_KEYS.settings, state.settings);
};

export const mergeStates = (local: AppPersistedState, remote: AppPersistedState | null): AppPersistedState => {
  if (!remote) return local;
  return {
    ...local,
    agencies: remote.agencies?.length ? remote.agencies.map((a) => normalizeAgency(a)) : local.agencies,
    training: remote.training?.length ? remote.training.map((t) => normalizeTraining(t)) : local.training,
    contacts: remote.contacts?.length ? remote.contacts : local.contacts,
    parent: normalizeParent({ ...local.parent, ...remote.parent }),
    requirementText: remote.requirementText || local.requirementText,
    requirementAnalyses: remote.requirementAnalyses?.length ? remote.requirementAnalyses : local.requirementAnalyses,
    settings: remote.settings ?? local.settings,
  };
};

