import { scoreAgency } from "./scoring";
import type { Agency, Contact, PersonKey, TrainingOption } from "../types";
import { todayIso } from "./export";

export type TodayAction = {
  id: string;
  label: string;
  detail: string;
  kind: "agency" | "training" | "follow-up" | "checklist";
  minutes: number;
};

export const buildTodayActions = (
  person: PersonKey,
  agencies: Agency[],
  training: TrainingOption[],
  contacts: Contact[],
): { top3: TodayAction[]; quick10: TodayAction | null } => {
  const activeAgencies = agencies.filter((a) => !a.archived);
  const activeTraining = training.filter((t) => !t.archived && (t.person === person || t.person === "both"));
  const scored = activeAgencies
    .map((agency) => ({ agency, score: scoreAgency(agency) }))
    .filter(({ score }) => (person === "josh" ? score.joshScore : !score.kristyHardPenalty && score.kristyScore))
    .sort((a, b) =>
      person === "josh" ? b.score.joshScore - a.score.joshScore : b.score.kristyScore - a.score.kristyScore,
    );

  const topAgency = scored[0];
  const topCourse = activeTraining.sort(
    (a, b) =>
      b.employabilityImpact +
      b.strengthsAlignment -
      (a.employabilityImpact + a.strengthsAlignment),
  )[0];
  const dueContact = contacts.find((c) => !c.archived && c.nextFollowUp && c.nextFollowUp <= todayIso());

  const top3: TodayAction[] = [];
  if (topAgency) {
    top3.push({
      id: `agency-${topAgency.agency.id}`,
      kind: "agency",
      minutes: 15,
      label: `Contact ${topAgency.agency.name}`,
      detail: topAgency.agency.nextAction,
    });
  }
  if (topCourse) {
    top3.push({
      id: `course-${topCourse.id}`,
      kind: "training",
      minutes: 20,
      label: `Check ${topCourse.course}`,
      detail: `${topCourse.provider} — confirm cost, dates, and funding.`,
    });
  }
  if (dueContact) {
    top3.push({
      id: `contact-${dueContact.id}`,
      kind: "follow-up",
      minutes: 10,
      label: "Due follow-up",
      detail: dueContact.notes || "Send a short follow-up message.",
    });
  }

  const quick10: TodayAction = {
    id: "quick-verify",
    kind: "agency",
    minutes: 10,
    label: topAgency ? `Call ${topAgency.agency.phone || topAgency.agency.name}` : "Pick one agency to verify",
    detail: topAgency?.score.exactQuestion ?? "Ask one concrete question about Dubbo roles this week.",
  };

  return { top3: top3.slice(0, 3), quick10 };
};
