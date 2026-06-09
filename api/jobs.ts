import type { VercelRequest, VercelResponse } from "@vercel/node";

type AdzunaJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  created: string;
  salaryMin?: number;
  salaryMax?: number;
  redirectUrl: string;
  contractType?: string;
  contractTime?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const appId = process.env.ADZUNA_APP_ID?.trim();
  const apiKey = process.env.ADZUNA_API_KEY?.trim();

  if (!appId || !apiKey) {
    return res.status(503).json({
      error: "Adzuna API is not configured. Set ADZUNA_APP_ID and ADZUNA_API_KEY in Vercel.",
      configured: false,
    });
  }

  try {
    const what = typeof req.query.what === "string" ? req.query.what : undefined;
    const where = typeof req.query.where === "string" ? req.query.where : "Dubbo";
    const page = Number(req.query.page ?? 1) || 1;
    const resultsPerPage = Math.min(Number(req.query.results_per_page ?? 20) || 20, 50);
    const maxDaysOld = Number(req.query.max_days_old ?? 30) || 30;
    const sortBy =
      req.query.sort_by === "salary" || req.query.sort_by === "relevance" || req.query.sort_by === "date"
        ? req.query.sort_by
        : "date";

    const url = new URL(`https://api.adzuna.com/v1/api/jobs/au/search/${page}`);
    url.searchParams.set("app_id", appId);
    url.searchParams.set("app_key", apiKey);
    url.searchParams.set("results_per_page", String(resultsPerPage));
    url.searchParams.set("content-type", "application/json");
    if (what) url.searchParams.set("what", what);
    if (where) url.searchParams.set("where", where);
    url.searchParams.set("max_days_old", String(maxDaysOld));
    url.searchParams.set("sort_by", sortBy);

    const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    if (!response.ok) {
      const body = await response.text();
      return res.status(502).json({ error: `Adzuna API error ${response.status}`, detail: body.slice(0, 200) });
    }

    const data = (await response.json()) as {
      count?: number;
      results?: Array<{
        id: string;
        title: string;
        description: string;
        created: string;
        redirect_url: string;
        salary_min?: number;
        salary_max?: number;
        contract_type?: string;
        contract_time?: string;
        company?: { display_name?: string };
        location?: { display_name?: string };
      }>;
    };

    const jobs: AdzunaJob[] = (data.results ?? []).map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name ?? "Unknown employer",
      location: job.location?.display_name ?? "Australia",
      description: job.description,
      created: job.created,
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      redirectUrl: job.redirect_url,
      contractType: job.contract_type,
      contractTime: job.contract_time,
    }));

    return res.status(200).json({
      source: "adzuna",
      where,
      what: what ?? null,
      count: data.count ?? jobs.length,
      jobs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job search failed";
    return res.status(500).json({ error: message });
  }
}
