import { profiles } from "../profiles";
import type { AdzunaJobListing, TrainingOption } from "../types";

export type WorkAppGap = {
  id: string;
  label: string;
  action: string;
  source: "requirement" | "job-listing";
  training: TrainingOption[];
};

const bridgeRules = [
  {
    id: "tae",
    label: "TAE40122 / trainer requirement",
    keywords: ["tae40122", "certificate iv in training", "training and assessment", "workplace trainer", "rto trainer", "trainer"],
    trainingHints: ["tae40122", "training"],
  },
  {
    id: "m365",
    label: "Microsoft 365 admin/support",
    keywords: ["microsoft 365", "m365", "office 365", "sharepoint", "onedrive", "teams", "exchange online"],
    trainingHints: ["microsoft", "365"],
  },
  {
    id: "it-foundation",
    label: "General ICT support foundation",
    keywords: ["service desk", "helpdesk", "desktop support", "network", "troubleshooting", "comptia", "active directory", "ict support"],
    trainingHints: ["comptia", "microsoft"],
  },
  {
    id: "immunisation",
    label: "Immunisation nursing",
    keywords: ["immunisation", "immunization", "vaccination", "vaccine", "cold chain"],
    trainingHints: ["immunisation"],
  },
  {
    id: "gp-practice",
    label: "GP practice / clinic nursing",
    keywords: ["gp practice", "practice nurse", "clinic nurse", "care plan", "chronic disease", "medicare item", "registered nurse"],
    trainingHints: ["gp", "practice", "wound"],
  },
  {
    id: "paediatric",
    label: "Paediatric / child & family health",
    keywords: ["paediatric", "pediatric", "children", "child health", "family health", "school nurse", "maternal", "child and family"],
    trainingHints: ["child", "family", "immunisation"],
  },
  {
    id: "checks",
    label: "Checks or clearances",
    keywords: ["working with children", "wwcc", "police check", "national police", "clearance", "first aid", "cpr", "basic life support"],
    trainingHints: ["first aid", "cpr", "basic life"],
  },
  {
    id: "aged-care-risk",
    label: "Aged care / RACF risk",
    keywords: ["aged care", "residential aged care", "racf", "nursing home"],
    trainingHints: [] as string[],
  },
];

export const bridgeActions: Record<string, string> = {
  tae: "Show Josh's TAE40122 pathway and ask providers about workload, delivery days, placement, recognition, and funding.",
  m365: "Prioritise Microsoft 365 Fundamentals/admin learning and mark the role as strongly aligned with Josh's current ICT support work.",
  "it-foundation": "Compare Microsoft 365 Fundamentals against CompTIA A+ and only add broader certs if local roles keep asking for them.",
  immunisation: "Show Kristy's immunisation course pathway and ask whether the course is accepted for NSW practice.",
  "gp-practice": "Show GP practice nurse CPD and chronic disease/care plan training as a practical non-aged-care pathway.",
  paediatric: "Kristy's Bendigo Children's Ward background is a strong match — prioritise child health, school nursing, and family-centred clinic roles.",
  checks: "Create a blocker action to confirm cost, processing time, required documents, and whether Parent Pathways or an employer can fund it.",
  "aged-care-risk": "Flag as poor fit for Kristy unless the role is clearly non-aged-care and manually overridden.",
};

export function matchRequirements(text: string, training: TrainingOption[]): WorkAppGap[] {
  const lower = text.toLowerCase();
  if (!lower.trim()) return [];

  return bridgeRules
    .filter((rule) => rule.keywords.some((keyword) => lower.includes(keyword)))
    .map((rule) => ({
      id: rule.id,
      label: rule.label,
      action: bridgeActions[rule.id] ?? "Review pathway options.",
      source: "requirement" as const,
      training: training.filter((item) => {
        const haystack = `${item.course} ${item.provider} ${item.notes} ${item.jobsUnlocked.join(" ")}`.toLowerCase();
        return rule.trainingHints.some((hint) => haystack.includes(hint));
      }),
    }));
}

export function analyzeWorkAppText(text: string): WorkAppGap[] {
  return matchRequirements(text, []);
}

export function jobListingToRequirementText(job: AdzunaJobListing): string {
  return `${job.title}\n${job.company}\n${job.location}\n${job.description}`;
}

export function defaultJoshJobQuery() {
  return profiles.josh.adzunaKeywords;
}

export function defaultKristyJobQuery() {
  return profiles.kristy.adzunaKeywords;
}
