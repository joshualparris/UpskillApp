import type { AdzunaJobListing, AppPersistedState } from "../types";

export type JobSearchResponse = {
  source: string;
  where: string;
  what: string | null;
  count: number;
  jobs: AdzunaJobListing[];
  error?: string;
};

export type SyncResponse = {
  sync: boolean;
  householdId: string;
  state: AppPersistedState | null;
  savedAt?: string;
  error?: string;
};

const apiBase = () => import.meta.env.VITE_API_BASE ?? "";

export async function searchJobs(params: {
  what?: string;
  where?: string;
  page?: number;
  resultsPerPage?: number;
  maxDaysOld?: number;
  person?: "josh" | "kristy";
}): Promise<JobSearchResponse> {
  const query = new URLSearchParams();
  if (params.what) query.set("what", params.what);
  query.set("where", params.where ?? "Dubbo");
  if (params.page) query.set("page", String(params.page));
  if (params.resultsPerPage) query.set("results_per_page", String(params.resultsPerPage));
  if (params.maxDaysOld) query.set("max_days_old", String(params.maxDaysOld));

  const response = await fetch(`${apiBase()}/api/jobs?${query.toString()}`);
  const data = (await response.json()) as JobSearchResponse & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? `Job search failed (${response.status})`);
  }
  return data;
}

export async function fetchCloudState(householdId: string): Promise<SyncResponse> {
  const response = await fetch(`${apiBase()}/api/state?householdId=${encodeURIComponent(householdId)}`);
  return (await response.json()) as SyncResponse;
}

export async function pushCloudState(householdId: string, state: AppPersistedState): Promise<SyncResponse> {
  const response = await fetch(`${apiBase()}/api/state?householdId=${encodeURIComponent(householdId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  const data = (await response.json()) as SyncResponse;
  if (!response.ok) {
    throw new Error(data.error ?? `Sync failed (${response.status})`);
  }
  return data;
}
