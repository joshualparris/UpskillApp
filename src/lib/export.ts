import { scoreAgency, trainingScore } from "./scoring";
import type { Agency, AppPersistedState, Contact, ParentPathwaysState, TrainingOption } from "../types";

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const buildWeeklyPlan = (
  agencies: Agency[],
  training: TrainingOption[],
  contacts: Contact[],
  parent: ParentPathwaysState,
) => {
  const activeAgencies = agencies.filter((a) => !a.archived);
  const activeTraining = training.filter((t) => !t.archived);
  const scored = activeAgencies.map((agency) => ({ agency, score: scoreAgency(agency) }));
  const joshAgencies = scored.sort((a, b) => b.score.joshScore - a.score.joshScore).slice(0, 3);
  const kristyAgencies = scored
    .filter(({ score }) => !score.kristyHardPenalty)
    .sort((a, b) => b.score.kristyScore - a.score.kristyScore)
    .slice(0, 3);
  const joshTraining = activeTraining
    .filter((item) => item.person === "josh" || item.person === "both")
    .sort((a, b) => trainingScore(b) - trainingScore(a))
    .slice(0, 3);
  const kristyTraining = activeTraining
    .filter((item) => item.person === "kristy" || item.person === "both")
    .sort((a, b) => trainingScore(b) - trainingScore(a))
    .slice(0, 3);
  const due = contacts.filter((c) => !c.archived && c.nextFollowUp && c.nextFollowUp <= todayIso());

  const checklistDone = parent.yilabaraChecklistItems.filter((item) => parent.yilabaraChecklist[item]);

  return `# UpskillApp Weekly Pathway Plan

Generated: ${todayIso()}

## Josh next 3 actions
${joshAgencies.map(({ agency }, i) => `${i + 1}. ${agency.nextAction} (${agency.name})`).join("\n")}

## Kristy next 3 actions
${kristyAgencies.map(({ agency }, i) => `${i + 1}. ${agency.nextAction} (${agency.name})`).join("\n")}

## Josh training to check
${joshTraining.map((item, i) => `${i + 1}. ${item.course} - ${item.provider} - ${item.priority}`).join("\n")}

## Kristy training to check
${kristyTraining.map((item, i) => `${i + 1}. ${item.course} - ${item.provider} - ${item.priority}`).join("\n")}

## Follow-ups due
${due.length ? due.map((c) => `- ${c.nextFollowUp}: ${c.notes || "Follow up"}`).join("\n") : "- No dated follow-ups due today."}

## Parent Pathways
- Eligibility: ${parent.eligibility}
- Funding: ${parent.fundingAvailable}
- Next appointment: ${parent.nextAppointment || "Not set"}

## Yilabara checklist
${parent.yilabaraChecklistItems.map((item) => `- [${parent.yilabaraChecklist[item] ? "x" : " "}] ${item}`).join("\n")}

## Checklist completed (${checklistDone.length}/${parent.yilabaraChecklistItems.length})
${checklistDone.length ? checklistDone.map((item) => `- ${item}`).join("\n") : "- None yet"}
`;
};

export const downloadJsonBackup = (state: AppPersistedState) => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `upskillapp-backup-${todayIso()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadMarkdownPlan = (markdown: string) => {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `upskillapp-plan-${todayIso()}.md`;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadAgenciesCsv = (agencies: Agency[]) => {
  const headers = ["Name", "Type", "Location", "Phone", "Email", "Website", "Next Action", "Tags", "Archived"];
  const rows = agencies.map((a) => [
    a.name,
    a.type,
    a.location,
    a.phone,
    a.email,
    a.website,
    a.nextAction,
    a.tags.join(";"),
    a.archived ? "Yes" : "No",
  ]);

  const csvContent = [headers, ...rows]
    .map((e) => e.map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `upskillapp-agencies-${todayIso()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
