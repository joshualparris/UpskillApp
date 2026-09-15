import { ExternalLink } from "lucide-react";

const roles = [
  {
    title: "Guest Experience Officer - Zoo Adventures TWPZ",
    req: "829",
    close: "20 Sep 2026",
    fit: "Best immediate fit",
    status: "Apply now",
    url: "https://careers.taronga.org.au/job/Dubbo-Guest-Experience-Officer-Zoo-Adventures-TWPZ-NSW-2830/1366726266/",
    summary:
      "Casual school-holiday role supervising children, delivering engaging youth education and conservation messages, and supporting guest operations.",
    strengths: [
      "Bachelor of Outdoor Education (Extended): 130+ days of field trips and practical work",
      "Environmental interpretation, naturalist studies, outdoor safety and leading groups",
      "School, youth leadership and high-volume customer-service experience",
      "Current paid NSW Working with Children Check",
    ],
  },
  {
    title: "Food & Beverage Attendant - TWPZ",
    req: "837",
    close: "23 Sep 2026",
    fit: "Good entry route",
    status: "Apply now",
    url: "https://careers.taronga.org.au/job/Dubbo-Food-%26-Beverage-Attendant-TWPZ-NSW-2830/1367190366/",
    summary:
      "Casual hospitality work across Cafe Wild, Waterhole Cafe, events and Zoofari Lodge. Useful as a practical way to become known inside Taronga while pursuing Education roles.",
    strengths: [
      "Previous McDonald's customer service and drive-through experience",
      "Long customer-service history across La Trobe, schools and ICT",
      "Current NSW driver licence and paid WWCC",
      "Willing to obtain current NSW RSA",
    ],
  },
  {
    title: "Keeper - Ungulates TWPZ",
    req: "833",
    close: "24 Sep 2026",
    fit: "Long-term pathway",
    status: "Qualification gap",
    url: "https://careers.taronga.org.au/job/Dubbo-Keeper-Ungulates-TWPZ-NSW-2830/1367159966/",
    summary:
      "Strong personal interest, but current keeping pathway evidence and staff advice indicate animal-care qualifications and hands-on experience are the major gap.",
    strengths: [
      "Taronga pathway: ACM20121 Certificate II in Animal Care",
      "Then ACM30321 Certificate III in Wildlife and Exhibited Animal Care",
      "Build substantial hands-on animal experience alongside study",
      "Horse therapy exposure is relevant context, but not professional keeper experience",
    ],
  },
];

export function TarongaPathwayPanel() {
  return (
    <section className="section-shell">
      <div className="section-heading">
        <div>
          <p className="label">Taronga career pathway · updated 15 Sep 2026</p>
          <h2>Western Plains Zoo opportunities</h2>
        </div>
      </div>

      <p className="jobs-meta">
        Priority: enter through Education / Guest Experience where Josh's existing Outdoor Education background is directly relevant, while treating keeper work as a separate qualification pathway.
      </p>

      <div className="jobs-grid">
        {roles.map((role) => (
          <article className="job-card" key={role.req}>
            <div className="job-card-head">
              <h3>{role.title}</h3>
              <a href={role.url} target="_blank" rel="noreferrer">
                <ExternalLink size={14} /> Apply
              </a>
            </div>
            <p><strong>{role.fit}</strong> · Job Req {role.req} · closes {role.close}</p>
            <p className="job-snippet">{role.summary}</p>
            <ul className="job-gaps">
              {role.strengths.map((strength) => <li key={strength}>{strength}</li>)}
            </ul>
            <p><strong>Status:</strong> {role.status}</p>
          </article>
        ))}
      </div>

      <div className="jobs-grid">
        <article className="job-card">
          <h3>Why Education is the strongest pathway</h3>
          <p>
            Taronga Western Plains Zoo runs curriculum-linked workshops, full-day programs, Zoo Adventures and the ZooSnooz overnight program. These combine outdoor learning, group supervision, environmental interpretation, safety and conservation education.
          </p>
          <ul className="job-gaps">
            <li>Outdoor Education degree included 130+ practical field days.</li>
            <li>Relevant study: Environmental Interpretation, Naturalist Studies, Outdoor Environments, Leading Groups, Safety in Outdoor Environments and Education in the Outdoors.</li>
            <li>Existing work history adds schools, youth leadership, customer service, WHS/compliance and practical problem solving.</li>
            <li>Long-term target: Taronga Education / Community & Cultural Programs roles in Dubbo.</li>
          </ul>
          <a href="https://www.taronga.org.au/learn/dubbo" target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> Explore Dubbo education programs
          </a>
        </article>

        <article className="job-card">
          <h3>Keeper reality check</h3>
          <p>
            A current Taronga staff member told Josh that keeper recruitment is highly competitive and that it took them about 2.5 years of applying to enter the zoo. The same conversation reinforced Certificate II / III animal-care training as the practical keeper pathway.
          </p>
          <ul className="job-gaps">
            <li>Do not present Josh as an experienced keeper yet.</li>
            <li>Use Education / Guest Experience as the immediate route into Taronga.</li>
            <li>If keeping remains a goal, complete Cert II then Cert III and accumulate animal-care hours.</li>
            <li>Taronga's 2027 Certificate III Dubbo intake is a direct specialist pathway, subject to entry requirements and future intake availability.</li>
          </ul>
          <a href="https://www.taronga.org.au/get-involved/work-at-taronga/become-a-zookeeper" target="_blank" rel="noreferrer">
            <ExternalLink size={14} /> Taronga zookeeper pathway
          </a>
        </article>
      </div>

      <details className="job-card">
        <summary><strong>Zoo Adventures target-question answers</strong></summary>
        <h3>Keeping children engaged, safe and on schedule</h3>
        <p>
          Set simple expectations at the start, use regular headcounts and clear meeting points, work closely with other staff, and keep activities interactive with questions, observations and short challenges. Use clear transition warnings and monitor time without making the day feel rushed. Josh's Outdoor Education training provides practical experience in group leadership, environmental interpretation and safety in changing outdoor conditions.
        </p>
        <h3>Safety example</h3>
        <p>
          At Avance, Josh reviewed workplace first-aid arrangements after training, clarified the first-aid kit location and procedures, identified gaps in readiness, prepared concise emergency documentation and took responsibility for regular kit checks. The principle: safety is proactive — identify weaknesses before an incident, clarify responsibilities and follow through with practical controls.
        </p>
      </details>

      <details className="job-card">
        <summary><strong>Food & Beverage application notes</strong></summary>
        <p>
          Hospitality story: previous McDonald's customer-service and drive-through experience, followed by years of customer-facing work at La Trobe University, schools and ICT support. Emphasise friendly service, teamwork, reliability, efficiency and willingness to learn Taronga's systems.
        </p>
        <p>
          Availability should be stated truthfully around current work commitments. Transport: Dubbo local with current NSW driver licence and reliable transport. RSA: previous Victorian RSA training; willing to obtain current NSW RSA rather than claiming it is already current in NSW.
        </p>
      </details>

      <details className="job-card">
        <summary><strong>Keeper application principles</strong></summary>
        <p>
          Be explicit that direct dangerous-animal and formal training experience is limited. Relevant principles are positive reinforcement, consistency, clear cues, careful observation, meaningful choice where appropriate, respect for individual temperament and strict adherence to established safety barriers and procedures. Horse-therapy exposure is useful context, but should not be described as professional animal handling.
        </p>
      </details>
    </section>
  );
}
