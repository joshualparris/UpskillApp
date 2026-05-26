const messages = [
  {
    title: 'Josh agency enquiry',
    copy:
      'Hi, I’m Josh Parris in Dubbo. I’m looking for Thursday/Friday work and currently do ICT/MSP support Monday and Wednesday. I have skills in Microsoft 365, admin, customer service, school tech and training support, and I’m open to predictable day-shift ICT, admin, customer service or digital training roles. Can you help me find suitable opportunities or employer partners?'
  },
  {
    title: 'Kristy agency enquiry',
    copy:
      'Hi, I’m Kristy Parris, an RN in Dubbo seeking part-time or casual nursing work outside aged care. I’m interested in GP practice, clinic, community health, school nurse, outpatient, immunisation or hospital casual pool roles with family-friendly rostering. Can you let me know what suitable positions are available?'
  },
  {
    title: 'Josh training enquiry',
    copy:
      'Hi, I’m exploring training and want to check delivery mode, days/times, cost, subsidies, fee-free availability, online/in-person/blended options, start dates, weekly workload, placement requirements, and whether the course suits a parent or part-time worker with Monday/Wednesday existing commitments.'
  },
  {
    title: 'Kristy training enquiry',
    copy:
      'Hi, I’m an RN looking for training that supports GP, immunisation, child/family health, school nursing or community health roles. Please share delivery mode, cost, subsidies, fee-free options, timing, workload, practical requirements, and whether it supports family-friendly part-time learners.'
  },
  {
    title: 'Parent Pathways enquiry',
    copy:
      'Hi, we are checking Parent Pathways support for Kristy. Can you confirm eligibility without Parenting Payment, whether funding covers TAFE, TAE, nursing CPD, immunisation training, police checks, WWCC, laptop, transport or course materials, and whether you can support family-friendly nursing pathways outside aged care?'
  },
  {
    title: 'Follow-up after 3 days',
    copy:
      'Hi again. I wanted to follow up on my earlier enquiry and check whether there are updates on suitable roles or training options. I am still interested in progressing quickly and would love any next steps you can recommend.'
  },
];

export function QuestionGenerator() {
  return (
    <div className="card">
      <h2>Contact message generator</h2>
      <p>Use these messages to ask agencies, providers, and Parent Pathways for the right support.</p>
      <ul className="message-list">
        {messages.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>
            <p>{item.copy}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
