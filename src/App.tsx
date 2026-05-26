import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  GraduationCap,
  HeartPulse,
  Plus,
  RefreshCcw,
  Search,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { agenciesSeed, contactsSeed, parentPathwaysSeed, trainingSeed } from "./data";
import { needsVerification, scoreAgency, trainingScore } from "./scoring";
import type { Agency, Contact, MessageKind, ParentPathwaysState, PersonKey, TrainingOption } from "./types";

const keys = {
  agencies: "upskillapp.agencies",
  training: "upskillapp.training",
  contacts: "upskillapp.contacts",
  parent: "upskillapp.parent",
};

const readStored = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

const profileText = {
  josh: {
    title: "ICT/MSP support, Microsoft 365, school tech, admin systems, digital training",
    availability: "Needs Thursday/Friday replacement work. Monday and Wednesday are already committed to Avance IT.",
    focus: "Predictable day work with clear steps and low admin load.",
  },
  kristy: {
    title: "Registered Nurse seeking part-time or casual non-aged-care work",
    availability: "Family-friendly shifts where possible.",
    focus: "GP practice, clinic, community, school, child/family health, outpatient, immunisation, or hospital casual pool.",
  },
};

const messageKinds: MessageKind[] = ["Josh agency", "Kristy agency", "Josh training", "Kristy training", "Parent Pathways", "3 day follow-up"];

const todayIso = () => new Date().toISOString().slice(0, 10);

const inDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const buildWeeklyPlan = (
  agencies: Agency[],
  training: TrainingOption[],
  contacts: Contact[],
  parent: ParentPathwaysState,
) => {
  const scored = agencies.map((agency) => ({ agency, score: scoreAgency(agency) }));
  const joshAgencies = scored.sort((a, b) => b.score.joshScore - a.score.joshScore).slice(0, 3);
  const kristyAgencies = scored
    .filter(({ score }) => !score.kristyHardPenalty)
    .sort((a, b) => b.score.kristyScore - a.score.kristyScore)
    .slice(0, 3);
  const joshTraining = training
    .filter((item) => item.person === "josh" || item.person === "both")
    .sort((a, b) => trainingScore(b) - trainingScore(a))
    .slice(0, 3);
  const kristyTraining = training
    .filter((item) => item.person === "kristy" || item.person === "both")
    .sort((a, b) => trainingScore(b) - trainingScore(a))
    .slice(0, 3);
  const due = contacts.filter((contact) => contact.nextFollowUp && contact.nextFollowUp <= todayIso());

  return `# UpskillApp Weekly Pathway Plan

Generated: ${todayIso()}

## Josh next 3 actions
${joshAgencies.map(({ agency }, index) => `${index + 1}. ${agency.nextAction} (${agency.name})`).join("\n")}

## Kristy next 3 actions
${kristyAgencies.map(({ agency }, index) => `${index + 1}. ${agency.nextAction} (${agency.name})`).join("\n")}

## Josh training to check
${joshTraining.map((item, index) => `${index + 1}. ${item.course} - ${item.provider} - ${item.priority}`).join("\n")}

## Kristy training to check
${kristyTraining.map((item, index) => `${index + 1}. ${item.course} - ${item.provider} - ${item.priority}`).join("\n")}

## Follow-ups due
${due.length ? due.map((contact) => `- ${contact.nextFollowUp}: ${contact.notes || "Follow up required"}`).join("\n") : "- No dated follow-ups due today."}

## Parent Pathways notes
- Eligibility: ${parent.eligibility}
- Funding: ${parent.fundingAvailable}
- Next appointment: ${parent.nextAppointment || "Not set"}
`;
};

export function App() {
  const [agencies, setAgencies] = useState<Agency[]>(() => readStored(keys.agencies, agenciesSeed));
  const [training, setTraining] = useState<TrainingOption[]>(() => readStored(keys.training, trainingSeed));
  const [contacts, setContacts] = useState<Contact[]>(() => readStored(keys.contacts, contactsSeed));
  const [parent, setParent] = useState<ParentPathwaysState>(() => readStored(keys.parent, parentPathwaysSeed));
  const [person, setPerson] = useState<PersonKey>("josh");
  const [query, setQuery] = useState("");
  const [agencyId, setAgencyId] = useState(agencies[0]?.id ?? "");
  const [courseId, setCourseId] = useState(training[0]?.id ?? "");
  const [messageKind, setMessageKind] = useState<MessageKind>("Josh agency");

  const scored = useMemo(
    () =>
      agencies
        .map((agency) => ({ agency, score: scoreAgency(agency) }))
        .sort((a, b) => Math.max(b.score.joshScore, b.score.kristyScore) - Math.max(a.score.joshScore, a.score.kristyScore)),
    [agencies],
  );
  const visible = scored.filter(({ agency }) => `${agency.name} ${agency.type} ${agency.location} ${agency.tags.join(" ")} ${agency.nextAction}`.toLowerCase().includes(query.toLowerCase()));
  const topJoshAgencies = scored.filter(({ score }) => score.joshScore > 0).sort((a, b) => b.score.joshScore - a.score.joshScore).slice(0, 5);
  const topKristyAgencies = scored.filter(({ score }) => !score.kristyHardPenalty && score.kristyScore > 0).sort((a, b) => b.score.kristyScore - a.score.kristyScore).slice(0, 5);
  const topJoshTraining = training.filter((item) => item.person === "josh" || item.person === "both").sort((a, b) => trainingScore(b) - trainingScore(a)).slice(0, 5);
  const topKristyTraining = training.filter((item) => item.person === "kristy" || item.person === "both").sort((a, b) => trainingScore(b) - trainingScore(a)).slice(0, 5);

  const selectedAgency = agencies.find((item) => item.id === agencyId) ?? agencies[0];
  const selectedCourse = training.find((item) => item.id === courseId) ?? training[0];
  const action = person === "josh" ? topJoshAgencies[0]?.agency.nextAction : topKristyAgencies[0]?.agency.nextAction;
  const dueFollowUps = contacts.filter((contact) => contact.nextFollowUp && contact.nextFollowUp <= todayIso());
  const needsVerifyCount = agencies.filter((agency) => needsVerification(agency.lastVerified)).length + training.filter((item) => needsVerification(item.lastVerified)).length;
  const planMarkdown = buildWeeklyPlan(agencies, training, contacts, parent);

  const setAgencyList = (next: Agency[]) => {
    setAgencies(next);
    save(keys.agencies, next);
  };
  const setTrainingList = (next: TrainingOption[]) => {
    setTraining(next);
    save(keys.training, next);
  };
  const setContactList = (next: Contact[]) => {
    setContacts(next);
    save(keys.contacts, next);
  };
  const setParentState = (next: ParentPathwaysState) => {
    setParent(next);
    save(keys.parent, next);
  };

  const reset = () => {
    setAgencyList(agenciesSeed);
    setTrainingList(trainingSeed);
    setContactList(contactsSeed);
    setParentState(parentPathwaysSeed);
  };

  const copyWeeklyPlan = async () => {
    await navigator.clipboard.writeText(planMarkdown);
  };

  const downloadWeeklyPlan = () => {
    const blob = new Blob([planMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `upskillapp-plan-${todayIso()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addAgency = () => {
    const agency: Agency = {
      id: `agency-${Date.now()}`,
      name: "New agency or provider",
      type: "recruiter",
      location: "Dubbo-relevant",
      phone: "",
      email: "",
      website: "",
      openingHours: "Needs verification",
      helpsWith: ["manual entry"],
      joshRelevance: [],
      kristyRelevance: [],
      eligibilityRules: "Check directly.",
      costs: "Verify before acting.",
      fundingOptions: [],
      servicesOffered: [],
      lastVerified: "",
      confidence: "low",
      notes: "",
      nextAction: "Verify contact details and ask what they can help with.",
      tags: ["manual"],
    };
    setAgencyList([agency, ...agencies]);
    setAgencyId(agency.id);
  };

  const addCourse = () => {
    const course: TrainingOption = {
      id: `course-${Date.now()}`,
      person,
      course: "New course",
      provider: "Provider to verify",
      cost: "Check cost",
      fundingPossible: "Check subsidies and funding",
      deliveryMode: "check",
      duration: "Check duration",
      priority: "Maybe later",
      status: "Idea",
      employabilityImpact: 5,
      timeFit: 5,
      costFit: 5,
      fundingAvailability: 5,
      strengthsAlignment: 5,
      availabilityFit: 5,
      stressFit: 5,
      longTermValue: 5,
      jobsUnlocked: [],
      questions: ["What are the days, cost, subsidies, workload, delivery mode, and practical requirements?"],
      notes: "",
      lastVerified: "",
    };
    setTrainingList([course, ...training]);
    setCourseId(course.id);
  };

  return (
    <main>
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Dubbo NSW employment support planner</p>
          <h1>UpskillApp</h1>
          <p>Find the agencies, training, funding, and next steps that build the bridge between current options and better work.</p>
        </div>
        <div className="hero-panel">
          <div className="toggle-row">
            <button className={person === "josh" ? "active" : ""} onClick={() => setPerson("josh")}><UserRound size={16} /> Josh</button>
            <button className={person === "kristy" ? "active" : ""} onClick={() => setPerson("kristy")}><HeartPulse size={16} /> Kristy</button>
          </div>
          <h2>{profileText[person].title}</h2>
          <p>{profileText[person].availability}</p>
          <p>{profileText[person].focus}</p>
        </div>
      </header>

      <section className="action-band">
        <div>
          <p className="label">Today's best next action</p>
          <h2>{action ?? "Pick one practical contact and make the first call or email."}</h2>
        </div>
        <button className="ghost-button" onClick={reset}><RefreshCcw size={16} /> Reset seed data</button>
      </section>

      <section className="dashboard-grid">
        <Summary icon={<BriefcaseBusiness size={20} />} title="Josh Pathway" items={[`Best agency: ${topJoshAgencies[0]?.agency.name ?? "Add an agency"}`, `Best course: ${topJoshTraining[0]?.course ?? "Add a course"}`, "Thursday/Friday day work first; M365, school ICT, admin systems, and TAE pathway next."]} />
        <Summary icon={<HeartPulse size={20} />} title="Kristy Pathway" items={[`Best support: ${topKristyAgencies[0]?.agency.name ?? "Add a support"}`, `Best CPD: ${topKristyTraining[0]?.course ?? "Add training"}`, "Exclude aged care, RACF, and nursing-home focused work unless manually overridden."]} />
        <Summary icon={<GraduationCap size={20} />} title="Funding" items={["Ask Yilabara about Parent Pathways eligibility and individual fund rules.", "Check Smart and Skilled and Fee-Free TAFE before committing.", "Bring course quotes, check costs, and dates to appointments."]} />
      </section>

      <section className="metrics-band">
        <Metric icon={<ClipboardList size={18} />} label="Open agencies" value={agencies.length.toString()} />
        <Metric icon={<GraduationCap size={18} />} label="Training options" value={training.length.toString()} />
        <Metric icon={<CalendarClock size={18} />} label="Follow-ups due" value={dueFollowUps.length.toString()} tone={dueFollowUps.length ? "warn" : "ok"} />
        <Metric icon={<AlertTriangle size={18} />} label="Needs verification" value={needsVerifyCount.toString()} tone={needsVerifyCount ? "warn" : "ok"} />
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div><p className="label">Weekly pathway report</p><h2>Next 3 actions</h2></div>
          <div className="toolbar">
            <button onClick={copyWeeklyPlan}><Copy size={16} /> Copy Markdown</button>
            <button onClick={downloadWeeklyPlan}><Download size={16} /> Download</button>
          </div>
        </div>
        <div className="action-grid">
          <ActionList title="Josh" items={topJoshAgencies.slice(0, 3).map(({ agency }) => agency.nextAction)} />
          <ActionList title="Kristy" items={topKristyAgencies.slice(0, 3).map(({ agency }) => agency.nextAction)} />
          <ActionList title="Due follow-ups" items={dueFollowUps.length ? dueFollowUps.map((contact) => contact.notes || `Follow up ${agencies.find((agency) => agency.id === contact.agencyId)?.name ?? "contact"}`) : ["No dated follow-ups due today."]} />
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div><p className="label">Agency finder and scoring</p><h2>Agency CRM</h2></div>
          <div className="toolbar">
            <label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter agencies" /></label>
            <button onClick={addAgency}><Plus size={16} /> Add agency</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Agency</th><th>Type</th><th>Josh</th><th>Kristy</th><th>Priority</th><th>Verification</th><th>Next action</th></tr></thead>
            <tbody>
              {visible.map(({ agency, score }) => (
                <tr key={agency.id} onClick={() => setAgencyId(agency.id)}>
                  <td><strong>{agency.name}</strong><span>{score.bestReason}</span></td>
                  <td>{agency.type}</td>
                  <td>{score.joshScore}</td>
                  <td className={score.kristyHardPenalty ? "warning-text" : ""}>{score.kristyHardPenalty ? "Poor fit" : score.kristyScore}</td>
                  <td><Priority priority={score.priority} /></td>
                  <td>{needsVerification(agency.lastVerified) ? <Flag /> : <Ok />}</td>
                  <td>{agency.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedAgency && <AgencyDetail agency={selectedAgency} agencies={agencies} saveAgencies={setAgencyList} />}
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div><p className="label">Pathway planner</p><h2>Training course finder</h2></div>
          <button onClick={addCourse}><Plus size={16} /> Add course</button>
        </div>
        <div className="pathway-columns">
          <PathwayList title="Josh top 5" items={topJoshTraining} onSelect={setCourseId} />
          <PathwayList title="Kristy top 5" items={topKristyTraining} onSelect={setCourseId} />
        </div>
        {selectedCourse && <CourseDetail course={selectedCourse} training={training} saveTraining={setTrainingList} />}
      </section>

      <section className="section-shell">
        <div className="section-heading"><div><p className="label">Decision helper</p><h2>Compare effort and value</h2></div></div>
        <div className="decision-grid">
          {training
            .slice()
            .sort((a, b) => trainingScore(b) - trainingScore(a))
            .slice(0, 6)
            .map((item) => (
              <article key={item.id} className="decision-card">
                <div className="decision-head">
                  <h3>{item.course}</h3>
                  <strong>{trainingScore(item)}</strong>
                </div>
                <dl>
                  <div><dt>Income bridge</dt><dd>{item.employabilityImpact >= 8 ? "Strong" : item.employabilityImpact >= 6 ? "Moderate" : "Low"}</dd></div>
                  <div><dt>Family load</dt><dd>{item.stressFit >= 8 ? "Low" : item.stressFit >= 6 ? "Manageable" : "Watch carefully"}</dd></div>
                  <div><dt>Cost risk</dt><dd>{item.costFit >= 7 ? "Lower" : item.costFit >= 5 ? "Check first" : "High without funding"}</dd></div>
                  <div><dt>Long-term value</dt><dd>{item.longTermValue >= 8 ? "High" : item.longTermValue >= 6 ? "Useful" : "Limited"}</dd></div>
                </dl>
              </article>
            ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading"><div><p className="label">Support and funding</p><h2>Parent Pathways / Yilabara</h2></div></div>
        <div className="parent-grid">
          <TextBlock label="Eligibility" value={parent.eligibility} onChange={(value) => setParentState({ ...parent, eligibility: value })} />
          <TextBlock label="Funding available" value={parent.fundingAvailable} onChange={(value) => setParentState({ ...parent, fundingAvailable: value })} />
          <TextBlock label="Appointment notes" value={parent.appointmentNotes} onChange={(value) => setParentState({ ...parent, appointmentNotes: value })} />
          <div className="checklist">
            <h3>Ask Yilabara</h3>
            {["Is Kristy eligible if she is not receiving Parenting Payment?", "Can funding help with nursing CPD, immunisation, checks, laptop, phone, transport, or materials?", "Can you help find family-friendly nursing work that is not aged care?", "Can you connect us with employers or only training providers?", "Can the program support Josh too, or only Kristy?", "What is the best first step this week?"].map((item) => <label key={item} className="check-row"><input type="checkbox" /> {item}</label>)}
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div><p className="label">Follow-up system</p><h2>Contact tracker</h2></div>
          <button onClick={() => setContactList([{ id: `contact-${Date.now()}`, agencyId: selectedAgency?.id ?? agencies[0].id, personContacted: "", channel: "Phone", lastContact: todayIso(), nextFollowUp: inDays(3), notes: "", status: "Waiting" }, ...contacts])}><Plus size={16} /> Add follow-up</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Agency</th><th>Person</th><th>Channel</th><th>Last contact</th><th>Next follow-up</th><th>Status</th><th>Notes</th></tr></thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{agencies.find((agency) => agency.id === contact.agencyId)?.name ?? "Unknown"}</td>
                  <td><Inline value={contact.personContacted} onChange={(value) => setContactList(contacts.map((item) => item.id === contact.id ? { ...item, personContacted: value } : item))} /></td>
                  <td>
                    <select className="inline-input" value={contact.channel} onChange={(event) => setContactList(contacts.map((item) => item.id === contact.id ? { ...item, channel: event.target.value as Contact["channel"] } : item))}>
                      {["Phone", "Email", "Web form", "In person"].map((channel) => <option key={channel}>{channel}</option>)}
                    </select>
                  </td>
                  <td><Inline type="date" value={contact.lastContact} onChange={(value) => setContactList(contacts.map((item) => item.id === contact.id ? { ...item, lastContact: value } : item))} /></td>
                  <td><Inline type="date" value={contact.nextFollowUp} onChange={(value) => setContactList(contacts.map((item) => item.id === contact.id ? { ...item, nextFollowUp: value } : item))} /></td>
                  <td>
                    <select className="inline-input" value={contact.status} onChange={(event) => setContactList(contacts.map((item) => item.id === contact.id ? { ...item, status: event.target.value as Contact["status"] } : item))}>
                      {["Not started", "Waiting", "Follow up", "Booked", "Closed"].map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </td>
                  <td><Inline value={contact.notes} onChange={(value) => setContactList(contacts.map((item) => item.id === contact.id ? { ...item, notes: value } : item))} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div><p className="label">Question and message generator</p><h2>Contact message generator</h2></div>
          <select value={messageKind} onChange={(event) => setMessageKind(event.target.value as MessageKind)}>{messageKinds.map((kind) => <option key={kind}>{kind}</option>)}</select>
        </div>
        <textarea className="message-output" readOnly value={generateMessage(messageKind, selectedAgency, selectedCourse)} />
      </section>

      <section className="section-shell">
        <div className="section-heading"><div><p className="label">WorkApp integration layer</p><h2>Requirement bridge</h2></div></div>
        <div className="bridge-grid">
          {[["TAE40122", "Show Josh's TAE40122 pathway and ask providers about workload, delivery days, placement, and funding."], ["Microsoft 365 admin", "Show Microsoft 365 Fundamentals/admin pathway and mark M365 roles as high alignment."], ["Immunisation", "Show Kristy's immunisation course and GP/clinic/community nursing direction."], ["WWCC or police check", "Create a blocker action to confirm cost, processing time, and whether funding can cover it."], ["Factory or warehouse", "Suggest only day-shift bridge work and check WHS/manual handling if it genuinely helps."]].map(([requirement, bridge]) => <article key={requirement}><h3>{requirement}</h3><p>{bridge}</p></article>)}
        </div>
      </section>
    </main>
  );
}

function Summary({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return <article className="summary-panel"><div className="panel-title">{icon}<h2>{title}</h2></div><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

function Metric({ icon, label, value, tone = "neutral" }: { icon: React.ReactNode; label: string; value: string; tone?: "neutral" | "ok" | "warn" }) {
  return <article className={`metric ${tone}`}><span>{icon}</span><div><strong>{value}</strong><small>{label}</small></div></article>;
}

function ActionList({ title, items }: { title: string; items: string[] }) {
  return <article className="action-list"><h3>{title}</h3><ol>{items.map((item) => <li key={item}>{item}</li>)}</ol></article>;
}

function Priority({ priority }: { priority: string }) {
  return <span className={`priority ${priority.toLowerCase().replace(/\s+/g, "-")}`}>{priority}</span>;
}

function Flag() {
  return <span className="flag"><AlertTriangle size={14} /> Verify</span>;
}

function Ok() {
  return <span className="ok"><CheckCircle2 size={14} /> Current</span>;
}

function AgencyDetail({ agency, agencies, saveAgencies }: { agency: Agency; agencies: Agency[]; saveAgencies: (agencies: Agency[]) => void }) {
  const score = scoreAgency(agency);
  const patch = (updates: Partial<Agency>) => saveAgencies(agencies.map((item) => item.id === agency.id ? { ...item, ...updates } : item));
  return (
    <div className="detail-grid">
      <article className="detail-card">
        <h3>{agency.name}</h3>
        <div className="form-grid">
          <label>Name<input value={agency.name} onChange={(event) => patch({ name: event.target.value })} /></label>
          <label>Phone<input value={agency.phone} onChange={(event) => patch({ phone: event.target.value })} /></label>
          <label>Email<input value={agency.email} onChange={(event) => patch({ email: event.target.value })} /></label>
          <label>Last verified<input type="date" value={agency.lastVerified} onChange={(event) => patch({ lastVerified: event.target.value })} /></label>
        </div>
        <label>Next action<textarea value={agency.nextAction} onChange={(event) => patch({ nextAction: event.target.value })} /></label>
        <label>Notes<textarea value={agency.notes} onChange={(event) => patch({ notes: event.target.value })} /></label>
      </article>
      <article className="detail-card question-card">
        <h3>Exact question to ask</h3>
        <p className="quoted">{score.exactQuestion}</p>
        <p><strong>Biggest concern:</strong> {score.biggestConcern}</p>
      </article>
    </div>
  );
}

function PathwayList({ title, items, onSelect }: { title: string; items: TrainingOption[]; onSelect: (id: string) => void }) {
  return <article className="pathway-list"><h3>{title}</h3>{items.map((item) => <button key={item.id} onClick={() => onSelect(item.id)}><span><strong>{item.course}</strong><small>{item.provider} | {item.deliveryMode} | {item.duration}</small></span><b>{trainingScore(item)}</b></button>)}</article>;
}

function CourseDetail({ course, training, saveTraining }: { course: TrainingOption; training: TrainingOption[]; saveTraining: (training: TrainingOption[]) => void }) {
  const patch = (updates: Partial<TrainingOption>) => saveTraining(training.map((item) => item.id === course.id ? { ...item, ...updates } : item));
  return <article className="detail-card"><div className="panel-title"><GraduationCap size={20} /><h3>{course.course}</h3><Priority priority={course.priority} /></div><div className="form-grid"><label>Course<input value={course.course} onChange={(event) => patch({ course: event.target.value })} /></label><label>Provider<input value={course.provider} onChange={(event) => patch({ provider: event.target.value })} /></label><label>Cost<input value={course.cost} onChange={(event) => patch({ cost: event.target.value })} /></label><label>Duration<input value={course.duration} onChange={(event) => patch({ duration: event.target.value })} /></label><label>Status<select value={course.status} onChange={(event) => patch({ status: event.target.value as TrainingOption["status"] })}>{["Idea", "Checking", "Applied", "In progress", "Completed", "Deferred"].map((status) => <option key={status}>{status}</option>)}</select></label><label>Priority<select value={course.priority} onChange={(event) => patch({ priority: event.target.value as TrainingOption["priority"] })}>{["Contact today", "Contact this week", "Maybe later", "Avoid"].map((priority) => <option key={priority}>{priority}</option>)}</select></label><label>Delivery<select value={course.deliveryMode} onChange={(event) => patch({ deliveryMode: event.target.value as TrainingOption["deliveryMode"] })}>{["online", "in person", "blended", "check"].map((mode) => <option key={mode}>{mode}</option>)}</select></label><label>Last verified<input type="date" value={course.lastVerified} onChange={(event) => patch({ lastVerified: event.target.value })} /></label></div><div className="detail-columns"><div><h4>Why it helps</h4><p>{course.notes}</p><h4>Jobs it unlocks</h4><p>{course.jobsUnlocked.join(", ") || "Add target jobs."}</p></div><div><h4>Questions to ask</h4><ul>{course.questions.map((question) => <li key={question}>{question}</li>)}</ul></div></div></article>;
}

function TextBlock({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="textarea-block">{label}<textarea value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Inline({ value, onChange, type = "text" }: { value: string; onChange: (value: string) => void; type?: string }) {
  return <input className="inline-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />;
}

function generateMessage(kind: MessageKind, agency?: Agency, training?: TrainingOption) {
  const agencyName = agency?.name ?? "there";
  const courseName = training?.course ?? "the course";
  const provider = training?.provider ?? "your provider";
  if (kind === "Josh agency") return `Hi ${agencyName},\n\nMy name is Josh Parris and I live in Dubbo. I am looking for Thursday/Friday day work because I currently work Monday and Wednesday in ICT/MSP support.\n\nMy background includes ICT support, Microsoft 365, troubleshooting, service desk, customer service, school ICT, classroom technology, ViewBoard training, documentation, process improvement, and AI-assisted workflows.\n\nI am open to ICT support, admin, customer service, school support, digital training, or suitable predictable day-shift work.\n\nDo you currently have any Dubbo roles that could fit Thursday/Friday availability?`;
  if (kind === "Kristy agency") return `Hi ${agencyName},\n\nKristy Parris is a Registered Nurse in Dubbo looking for part-time or casual nursing work. She is not looking for aged care or residential aged care.\n\nShe is interested in GP practice, clinic, community, school, child/family health, outpatient, immunisation, or hospital casual pool roles. Family-friendly options are preferred where possible.\n\nDo you currently know of any suitable non-aged-care RN roles in Dubbo?`;
  if (kind === "Josh training") return `Hi ${provider},\n\nI am checking whether ${courseName} would suit my current work situation. I work Monday and Wednesday in ICT/MSP support and I am looking to improve my Thursday/Friday work options and longer-term ICT/training pathway.\n\nCould you please confirm delivery mode, days/times, cost, subsidies or fee-free availability, online/in-person/blended options, start dates, weekly workload, assessment requirements, and whether it suits parents or part-time workers?`;
  if (kind === "Kristy training") return `Hi ${provider},\n\nKristy Parris is an RN in Dubbo looking at ${courseName} to support part-time or casual non-aged-care nursing work, especially GP practice, clinic, community, school, child/family health, outpatient, or immunisation roles.\n\nCould you please confirm delivery mode, days/times, cost, subsidies, start dates, workload per week, practical requirements, and whether this pathway is recognised for NSW nursing roles?`;
  if (kind === "Parent Pathways") return `Hi Yilabara / Parent Pathways,\n\nWe are checking whether Kristy Parris may be eligible for support with return-to-work planning, confidence rebuilding, and training for family-friendly nursing work in Dubbo that is not aged care.\n\nCan Parent Pathways help with nursing CPD, immunisation training, police check, Working With Children Check, laptop, phone, transport, course materials, or other work-related costs? Can you connect us with employers as well as training providers? What is the best first step this week?`;
  return `Hi ${agencyName},\n\nI am following up on my message from three days ago about Dubbo work/training options.\n\nCould you please let me know whether there is a suitable next step, person to speak with, current vacancy, course option, or funding pathway to check?`;
}
