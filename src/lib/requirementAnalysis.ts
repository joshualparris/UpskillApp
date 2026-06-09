import { matchRequirements } from "./workappBridge";
import type { Agency, RequirementAnalysis, TrainingOption } from "../types";

export const analyzeRequirementText = (
  inputText: string,
  training: TrainingOption[],
  agencies: Agency[],
): Omit<RequirementAnalysis, "id" | "createdAt"> => {
  const matches = matchRequirements(inputText, training);
  const lower = inputText.toLowerCase();

  const fitsJosh =
    /ict|microsoft|365|help\s*desk|admin|school|library|msp|service desk|customer service|tae|trainer|digital/i.test(
      lower,
    );
  const fitsKristy =
    /nurse|nursing|rn|ahpra|paediatric|pediatric|gp|clinic|immunisation|community health|hospital pool|practice nurse/i.test(
      lower,
    );

  const riskFlags = matches.filter((m) => m.id === "aged-care-risk").map((m) => m.label);
  if (/aged care|nursing home|racf|residential aged/i.test(lower) && !/not aged care|non-aged-care/i.test(lower)) {
    riskFlags.push("Possible aged care focus — verify before pursuing for Kristy");
  }
  if (/full[- ]?time|night shift|7 days|24\/7/i.test(lower)) {
    riskFlags.push("Schedule may not fit Josh Thu/Fri or family-friendly goals");
  }

  const trainingGaps = matches.flatMap((m) => m.training.map((t) => t.course));
  const agenciesToContact = agencies
    .filter((a) => !a.archived)
    .filter((agency) => {
      const text = `${agency.name} ${agency.tags.join(" ")} ${agency.helpsWith.join(" ")}`.toLowerCase();
      return matches.some((m) => text.includes(m.id.split("-")[0]) || m.training.some((t) => text.includes(t.provider.toLowerCase().slice(0, 8))));
    })
    .slice(0, 4)
    .map((a) => a.name);

  const questionsToAsk = [
    ...matches.map((m) => m.action),
    fitsJosh ? "Can this role fit Monday/Wednesday Avance commitments with Thursday/Friday hours?" : "",
    fitsKristy ? "Is this role clearly outside residential aged care?" : "",
    "What checks, training, or funding would remove blockers?",
  ].filter(Boolean);

  const titleLine = inputText.split("\n")[0]?.slice(0, 80) || "Requirement analysis";

  return {
    title: titleLine,
    inputText,
    matchedRequirements: matches.map((m) => m.label),
    trainingGaps: [...new Set(trainingGaps)],
    agenciesToContact: agenciesToContact.length ? agenciesToContact : ["Spinifex Recruiting", "Yilabara / Parent Pathways", "NSW Health careers"],
    questionsToAsk,
    fitsJosh,
    fitsKristy,
    riskFlags,
    summary: matches.length
      ? `Found ${matches.length} requirement theme(s). ${fitsJosh ? "May suit Josh. " : ""}${fitsKristy ? "May suit Kristy. " : ""}${riskFlags.length ? "Review risk flags before acting." : ""}`
      : "No strong keyword matches — paste more of the job ad or add manual notes.",
  };
};
