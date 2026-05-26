export function ContactMessages() {
  return (
    <div className="card">
      <h2>Contact tracker and note prompts</h2>
      <p>Track outreach, follow-up items, and exact questions to ask.</p>
      <ul className="message-list">
        <li>
          <strong>Best reason to contact:</strong> Ask agencies about Thursday/Friday day roles and training pathway matches.
        </li>
        <li>
          <strong>Biggest concern:</strong> Confirm the role is not mostly aged care, night shift, or full-time labour hire.
        </li>
        <li>
          <strong>Ask specifically:</strong> "Can you recommend part-time family-friendly roles for Dubbo-based workers with existing Monday/Wednesday commitments?"
        </li>
      </ul>
      <p>Recommended follow-up:</p>
      <ul className="small-list">
        <li>Send enquiry. Wait 3 days. Follow up with a brief status request.</li>
        <li>Note the exact employer, role type, start date, and next action.</li>
      </ul>
    </div>
  );
}
