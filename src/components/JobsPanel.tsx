import { Briefcase, ExternalLink, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { searchJobs } from "../api/client";
import { analyzeWorkAppText, defaultJoshJobQuery, defaultKristyJobQuery, jobListingToRequirementText } from "../lib/workappBridge";
import type { AdzunaJobListing, PersonKey } from "../types";

type Props = {
  person: PersonKey;
  onApplyToBridge: (text: string) => void;
};

export function JobsPanel({ person, onApplyToBridge }: Props) {
  const [what, setWhat] = useState(person === "josh" ? defaultJoshJobQuery() : defaultKristyJobQuery());
  const [where, setWhere] = useState("Dubbo");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState<AdzunaJobListing[]>([]);
  const [count, setCount] = useState(0);

  const runSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await searchJobs({ what, where, resultsPerPage: 15, maxDaysOld: 30 });
      setJobs(result.jobs);
      setCount(result.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Job search failed");
      setJobs([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="label">Adzuna job search</p>
          <h2>Live Dubbo listings</h2>
        </div>
        <button onClick={runSearch} disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
          Search jobs
        </button>
      </div>

      <div className="jobs-toolbar">
        <label>
          Keywords
          <input value={what} onChange={(event) => setWhat(event.target.value)} placeholder="Role keywords" />
        </label>
        <label>
          Location
          <input value={where} onChange={(event) => setWhere(event.target.value)} placeholder="Dubbo" />
        </label>
      </div>

      {error && <p className="error-banner">{error}</p>}

      <p className="jobs-meta">
        <Briefcase size={14} /> {count ? `${count} matches (showing ${jobs.length})` : "Search to load current listings from Adzuna."}
      </p>

      <div className="jobs-grid">
        {jobs.map((job) => {
          const gaps = analyzeWorkAppText(jobListingToRequirementText(job));
          return (
            <article key={job.id} className="job-card">
              <div className="job-card-head">
                <h3>{job.title}</h3>
                <a href={job.redirectUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={14} /> View
                </a>
              </div>
              <p>
                <strong>{job.company}</strong> · {job.location}
              </p>
              {job.salaryMin && (
                <p className="job-salary">
                  Salary: ${job.salaryMin.toLocaleString()}
                  {job.salaryMax ? ` – $${job.salaryMax.toLocaleString()}` : ""}
                </p>
              )}
              <p className="job-snippet">{job.description.slice(0, 220)}…</p>
              {gaps.length > 0 && (
                <ul className="job-gaps">
                  {gaps.slice(0, 3).map((gap) => (
                    <li key={gap.id}>{gap.label}</li>
                  ))}
                </ul>
              )}
              <button type="button" className="ghost-button" onClick={() => onApplyToBridge(jobListingToRequirementText(job))}>
                Send to WorkApp bridge
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
