import { AlertTriangle, BriefcaseBusiness, CalendarClock, ClipboardList, GraduationCap, HeartPulse } from "lucide-react";
import { profiles } from "../profiles";
import { needsVerification } from "../lib/scoring";
import type { Agency, Contact, TrainingOption } from "../types";
import { Metric, Summary } from "./shared";

type Props = {
  agencies: Agency[];
  training: TrainingOption[];
  contacts: Contact[];
  topJoshAgency?: Agency;
  topKristyAgency?: Agency;
  topJoshCourse?: TrainingOption;
  topKristyCourse?: TrainingOption;
};

export function SummaryCards({
  agencies,
  training,
  contacts,
  topJoshAgency,
  topKristyAgency,
  topJoshCourse,
  topKristyCourse,
}: Props) {
  const activeAgencies = agencies.filter((a) => !a.archived);
  const activeTraining = training.filter((t) => !t.archived);
  const due = contacts.filter((c) => !c.archived && c.nextFollowUp && c.nextFollowUp <= new Date().toISOString().slice(0, 10));
  const needsVerify =
    activeAgencies.filter((a) => needsVerification(a.lastVerified)).length +
    activeTraining.filter((t) => needsVerification(t.lastVerified)).length;

  return (
  <>
    <section className="dashboard-grid">
      <Summary
        icon={<BriefcaseBusiness size={20} />}
        title="Josh Pathway"
        items={[
          `Best agency: ${topJoshAgency?.name ?? "Add an agency"}`,
          `Best course: ${topJoshCourse?.course ?? "Add a course"}`,
          `Resume: ${profiles.josh.currentRole}`,
        ]}
      />
      <Summary
        icon={<HeartPulse size={20} />}
        title="Kristy Pathway"
        items={[
          `Best support: ${topKristyAgency?.name ?? "Add a support"}`,
          `Best CPD: ${topKristyCourse?.course ?? "Add training"}`,
          `Resume: paediatric RN — avoid aged care by default`,
        ]}
      />
      <Summary
        icon={<GraduationCap size={20} />}
        title="Funding"
        items={[
          "Yilabara / Parent Pathways — confirm eligibility and fund rules.",
          "Smart and Skilled / Fee-Free TAFE before paying course fees.",
          "Bring quotes, check costs, and dates to appointments.",
        ]}
      />
    </section>
    <section className="metrics-band">
      <Metric icon={<ClipboardList size={18} />} label="Active agencies" value={activeAgencies.length.toString()} />
      <Metric icon={<GraduationCap size={18} />} label="Training options" value={activeTraining.length.toString()} />
      <Metric icon={<CalendarClock size={18} />} label="Follow-ups due" value={due.length.toString()} tone={due.length ? "warn" : "ok"} />
      <Metric icon={<AlertTriangle size={18} />} label="Needs verification" value={needsVerify.toString()} tone={needsVerify ? "warn" : "ok"} />
    </section>
  </>
  );
}
