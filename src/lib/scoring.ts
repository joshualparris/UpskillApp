import type { Agency, AgencyScore, PersonKey, Priority, ScoreBreakdownItem, TrainingOption, TrainingScoreDetail } from "../types";

const textOf = (agency: Agency) =>
  [
    agency.name,
    agency.type,
    agency.location,
    agency.notes,
    agency.nextAction,
    ...agency.helpsWith,
    ...agency.joshRelevance,
    ...agency.kristyRelevance,
    ...agency.servicesOffered,
    ...agency.tags,
  ]
    .join(" ")
    .toLowerCase();

const hasAny = (agency: Agency, terms: string[]) => {
  const text = textOf(agency);
  return terms.some((term) => text.includes(term.toLowerCase()));
};

const priorityFromScores = (josh: number, kristy: number, penalty: boolean): Priority => {
  if (penalty && josh < 50) return "Avoid";
  const best = Math.max(josh, penalty ? 0 : kristy);
  if (best >= 75) return "Contact today";
  if (best >= 55) return "Contact this week";
  if (best >= 30) return "Maybe later";
  return "Avoid";
};

const add = (breakdown: ScoreBreakdownItem[], label: string, points: number, person: PersonKey) => {
  if (points !== 0) breakdown.push({ label, points, person });
};

export const scoreAgency = (agency: Agency): AgencyScore => {
  const joshBreakdown: ScoreBreakdownItem[] = [];
  const kristyBreakdown: ScoreBreakdownItem[] = [];
  let josh = 0;
  let kristy = 0;

  const bump = (person: PersonKey, label: string, points: number) => {
    if (person === "josh") {
      josh += points;
      add(joshBreakdown, label, points, "josh");
    } else {
      kristy += points;
      add(kristyBreakdown, label, points, "kristy");
    }
  };

  if (hasAny(agency, ["thursday", "friday", "part-time", "casual"])) bump("josh", "Thu/Fri or flexible", 25);
  if (hasAny(agency, ["ict", "admin", "customer service", "school", "government", "training"]))
    bump("josh", "ICT/admin/school", 20);
  if (hasAny(agency, ["msp", "help desk", "helpdesk", "library", "microsoft", "365", "avance", "crm", "ticket"]))
    bump("josh", "MSP/M365/library", 15);
  if (hasAny(agency, ["dubbo", "central west", "local", "regional"])) {
    bump("josh", "Local Dubbo", 15);
    bump("kristy", "Local Dubbo", 10);
  }
  if (hasAny(agency, ["training", "upskill", "tafe", "funding"])) bump("josh", "Training/funding", 15);
  if (hasAny(agency, ["resume", "interview", "coaching"])) bump("josh", "Career support", 10);
  if (hasAny(agency, ["employer", "recruitment", "placement", "jobs"])) bump("josh", "Jobs/placements", 10);
  if (agency.phone || agency.email || agency.website) {
    bump("josh", "Contact details", 5);
    bump("kristy", "Contact details", 5);
  }
  if (hasAny(agency, ["full-time labour hire", "heavy labour"])) bump("josh", "Heavy labour risk", -20);
  if (hasAny(agency, ["night shift", "heavy labour"])) bump("josh", "Night/heavy shift", -20);
  if (hasAny(agency, ["full availability"])) bump("josh", "Full availability", -15);
  if (!hasAny(agency, ["dubbo", "central west", "online", "nsw"])) bump("josh", "Not local/online", -10);
  if (hasAny(agency, ["admin burden", "unclear benefit"])) bump("josh", "Admin burden", -10);

  if (hasAny(agency, ["nursing", "nurse", "health", "hospital", "clinic"])) bump("kristy", "Nursing/health", 30);
  if (hasAny(agency, ["part-time", "casual", "family-friendly", "flexible"]))
    bump("kristy", "Part-time/family-friendly", 25);
  if (
    hasAny(agency, [
      "clinic",
      "gp",
      "school",
      "community",
      "child",
      "family health",
      "hospital pool",
      "immunisation",
      "outpatient",
    ])
  )
    bump("kristy", "GP/clinic/community", 20);
  if (hasAny(agency, ["paediatric", "pediatric", "children", "child and family", "family health", "rehabilitation"]))
    bump("kristy", "Paediatric/child health", 15);
  if (hasAny(agency, ["confidence", "return-to-work", "planning"])) bump("kristy", "Return-to-work", 10);

  const agedCareTagged =
    hasAny(agency, ["aged care", "residential aged care", "nursing homes", "racf"]) &&
    !hasAny(agency, ["non-aged-care", "not aged care"]);
  const hardPenalty = agedCareTagged && !agency.kristyAgedCareOverride;

  if (hardPenalty) {
    const penalty = kristy - 20;
    kristy = 20;
    add(kristyBreakdown, "Aged care/RACF penalty", -Math.max(penalty, 0), "kristy");
  } else if (agedCareTagged && agency.kristyAgedCareOverride) {
    add(kristyBreakdown, "Aged care override on", 0, "kristy");
  }

  josh = Math.max(0, Math.min(100, josh));
  kristy = Math.max(0, Math.min(100, kristy));

  return {
    joshScore: josh,
    kristyScore: kristy,
    joshBreakdown,
    kristyBreakdown,
    bestReason: josh >= kristy ? agency.joshRelevance[0] || agency.helpsWith[0] : agency.kristyRelevance[0] || agency.helpsWith[0],
    biggestConcern: hardPenalty
      ? "May be mostly aged care/RACF — poor fit unless you marked non-aged-care override."
      : agency.verificationStatus === "needs_check" || agency.verificationStatus === "unknown"
        ? "Source not verified yet — confirm before acting."
        : agency.confidence === "low"
          ? "Low confidence record; verify details before acting."
          : "Confirm eligibility and current availability.",
    exactQuestion:
      josh >= kristy
        ? "Do you have Thursday/Friday Dubbo roles for an MSP help desk professional (M365, ticketing, device setup) or school ICT/library/admin support?"
        : "Do you have part-time or casual RN roles in Dubbo outside aged care — especially GP, clinic, child health, immunisation, community, or hospital pool?",
    priority: priorityFromScores(josh, kristy, hardPenalty),
    kristyHardPenalty: hardPenalty,
  };
};

export const trainingScoreDetail = (option: TrainingOption): TrainingScoreDetail => {
  const breakdown: ScoreBreakdownItem[] = [];
  const parts = [
    { label: "Employability", value: option.employabilityImpact * 1.4 },
    { label: "Time fit", value: option.timeFit },
    { label: "Cost fit", value: option.costFit },
    { label: "Funding", value: option.fundingAvailability },
    { label: "Strengths alignment", value: option.strengthsAlignment * 1.2 },
    { label: "Availability", value: option.availabilityFit },
    { label: "Stress/family load", value: option.stressFit },
    { label: "Long-term value", value: option.longTermValue * 1.2 },
  ];
  const subtotal = parts.reduce((sum, part) => sum + part.value, 0);
  parts.forEach((part) => breakdown.push({ label: part.label, points: Math.round(part.value) }));
  const total = Math.round(subtotal * 1.1);
  breakdown.push({ label: "Weighted total (×1.1)", points: total - Math.round(subtotal) });
  return { total, breakdown };
};

export const trainingScore = (option: TrainingOption) => trainingScoreDetail(option).total;

export const needsVerification = (dateString: string) => {
  if (!dateString) return true;
  const verified = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(verified.getTime())) return true;
  return Date.now() - verified.getTime() > 30 * 24 * 60 * 60 * 1000;
};
