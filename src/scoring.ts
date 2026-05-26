import type { Agency, AgencyScore, Priority, TrainingOption } from "./types";

const textOf = (agency: Agency) =>
  [agency.name, agency.type, agency.location, agency.notes, agency.nextAction, ...agency.helpsWith, ...agency.joshRelevance, ...agency.kristyRelevance, ...agency.servicesOffered, ...agency.tags]
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

export const scoreAgency = (agency: Agency): AgencyScore => {
  let josh = 0;
  let kristy = 0;

  if (hasAny(agency, ["thursday", "friday", "part-time", "casual"])) josh += 25;
  if (hasAny(agency, ["ict", "admin", "customer service", "school", "government", "training"])) josh += 20;
  if (hasAny(agency, ["dubbo", "central west", "local", "regional"])) josh += 15;
  if (hasAny(agency, ["training", "upskill", "tafe", "funding"])) josh += 15;
  if (hasAny(agency, ["resume", "interview", "coaching"])) josh += 10;
  if (hasAny(agency, ["employer", "recruitment", "placement", "jobs"])) josh += 10;
  if (agency.phone || agency.email || agency.website) josh += 5;
  if (hasAny(agency, ["full-time labour hire", "heavy labour"])) josh -= 20;
  if (hasAny(agency, ["night shift", "heavy labour"])) josh -= 20;
  if (hasAny(agency, ["full availability"])) josh -= 15;
  if (!hasAny(agency, ["dubbo", "central west", "online", "nsw"])) josh -= 10;
  if (hasAny(agency, ["admin burden", "unclear benefit"])) josh -= 10;

  if (hasAny(agency, ["nursing", "nurse", "health", "hospital", "clinic"])) kristy += 30;
  if (hasAny(agency, ["part-time", "casual", "family-friendly", "flexible"])) kristy += 25;
  if (hasAny(agency, ["clinic", "gp", "school", "community", "child", "family health", "hospital pool", "immunisation", "outpatient"])) kristy += 20;
  if (hasAny(agency, ["confidence", "return-to-work", "planning"])) kristy += 10;
  if (hasAny(agency, ["dubbo", "western nsw", "local", "employer"])) kristy += 10;
  if (agency.phone || agency.email || agency.website) kristy += 5;

  const hardPenalty = hasAny(agency, ["aged care", "residential aged care", "nursing homes", "racf"]) && !hasAny(agency, ["non-aged-care", "not aged care"]);
  if (hardPenalty) kristy = Math.min(kristy, 20);

  josh = Math.max(0, Math.min(100, josh));
  kristy = Math.max(0, Math.min(100, kristy));

  return {
    joshScore: josh,
    kristyScore: kristy,
    bestReason: josh >= kristy ? agency.joshRelevance[0] || agency.helpsWith[0] : agency.kristyRelevance[0] || agency.helpsWith[0],
    biggestConcern: hardPenalty ? "May be mostly aged care/RACF, which is a poor fit for Kristy unless manually overridden." : agency.confidence === "low" ? "Low confidence seed record; verify details before acting." : "Contact details, eligibility, and current availability need verification.",
    exactQuestion: josh >= kristy ? "Do you currently have Dubbo roles that can fit Thursday/Friday day work in ICT support, admin, school support, customer service, or digital training?" : "Do you currently have Dubbo part-time or casual RN roles outside aged care, especially GP, clinic, community, school, child/family health, outpatient, immunisation, or hospital pool work?",
    priority: priorityFromScores(josh, kristy, hardPenalty),
    kristyHardPenalty: hardPenalty,
  };
};

export const trainingScore = (option: TrainingOption) =>
  Math.round((option.employabilityImpact * 1.4 + option.timeFit + option.costFit + option.fundingAvailability + option.strengthsAlignment * 1.2 + option.availabilityFit + option.stressFit + option.longTermValue * 1.2) * 1.1);

export const needsVerification = (dateString: string) => {
  if (!dateString) return true;
  const verified = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(verified.getTime())) return true;
  return Date.now() - verified.getTime() > 30 * 24 * 60 * 60 * 1000;
};
