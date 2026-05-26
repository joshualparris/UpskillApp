import type { Agency, Contact, ParentPathwaysState, TrainingOption } from "./types";

const staleDate = "2026-04-01";

const agency = (
  id: string,
  name: string,
  type: Agency["type"],
  tags: string[],
  joshRelevance: string[],
  kristyRelevance: string[],
  helpsWith: string[],
  nextAction: string,
  notes: string,
): Agency => ({
  id,
  name,
  type,
  location: tags.includes("online") ? "Online / Dubbo-relevant" : "Dubbo NSW / Central West NSW",
  phone: "",
  email: "",
  website: "",
  openingHours: "Needs verification",
  helpsWith,
  joshRelevance,
  kristyRelevance,
  eligibilityRules: "Check directly before acting.",
  costs: "Verify candidate costs and program rules before committing.",
  fundingOptions: tags.includes("funding") ? ["Parent Pathways", "Smart and Skilled", "Fee-Free TAFE", "Workforce Australia supports"] : [],
  servicesOffered: helpsWith,
  lastVerified: staleDate,
  confidence: "medium",
  notes,
  nextAction,
  tags,
});

export const agenciesSeed: Agency[] = [
  agency("spinifex", "Spinifex Recruiting", "recruiter", ["local", "part-time", "admin", "government", "customer service", "day shift"], ["Thursday/Friday work", "admin", "customer service", "government", "ICT-adjacent support"], ["may know local employers"], ["local recruitment", "temporary placements", "resume discussion", "local employer introductions"], "Call and ask about Thursday/Friday ICT, admin, school support, or customer service work.", "Good first contact for Josh because local temp work may fit fixed availability."),
  agency("programmed", "Programmed", "recruiter", ["labour hire", "admin", "customer service", "verify fit"], ["possible admin or customer service", "possible day shift"], ["limited unless healthcare roles are available"], ["labour hire", "admin placements", "customer service placements"], "Ask specifically for day-shift Thursday/Friday admin, ICT support, or customer service roles.", "Screen out heavy labour, night shift, and full availability requirements."),
  agency("haynes", "Haynes People", "recruiter", ["labour hire", "local", "verify fit"], ["possible local placements if day-shift and structured"], ["limited unless healthcare roles are available"], ["recruitment", "temporary placements"], "Verify whether they have non-heavy day-shift roles that fit Thursday/Friday only.", "Maybe useful, but only if the role type is right."),
  agency("joblink-plus", "Joblink Plus", "employment service", ["training", "resume support", "employment service", "local", "funding"], ["resume support", "training support", "local employment planning"], ["return-to-work planning", "confidence rebuilding", "family-friendly work planning"], ["employment coaching", "training referrals", "resume help", "interview prep"], "Ask what practical support is available without disrupting current work/family commitments.", "Useful if they can provide specific next steps without adding admin burden."),
  agency("sureway", "Sureway", "employment service", ["training", "employment service", "resume support", "funding"], ["training support", "local employer connections"], ["return-to-work planning", "possible family-friendly planning"], ["job search support", "training referrals", "resume help"], "Ask about funded training and specific local employer links.", "Check the actual program fit and admin load."),
  agency("apm", "APM", "employment service", ["employment service", "DES", "verify fit", "funding"], ["structured employment support", "possible training support"], ["return-to-work planning"], ["employment coaching", "job search support", "provider referrals"], "Ask what concrete support they can offer this week.", "Use only if the stream and benefit are clear."),
  agency("yilabara", "Yilabara Dubbo / Parent Pathways", "Parent Pathways", ["parent pathways", "funding", "confidence", "family-friendly", "training", "local"], ["ask whether any support extends to Josh"], ["return-to-work confidence", "training funding", "family-friendly nursing pathway planning"], ["Parent Pathways", "appointments", "action plans", "training support", "funding discussions"], "Book or confirm an appointment and ask the funding checklist questions.", "Priority contact for Kristy support and funding questions."),
  agency("nsw-health", "NSW Health / I Work for NSW", "government", ["nursing", "hospital", "community health", "outpatient", "government", "not aged care", "local"], ["possible ICT/admin support roles"], ["hospital casual pool", "community health", "outpatient nursing", "family-friendly shifts to confirm"], ["job vacancies", "clinical roles", "admin and ICT roles"], "Search for casual pool, outpatient, clinic, community, school, and child/family roles.", "Strong non-aged-care pathway if shifts can fit family life."),
  agency("dubbo-council", "Dubbo Regional Council Jobs", "employer", ["government", "admin", "library", "customer service", "day shift", "local"], ["library/admin", "customer service", "systems support", "predictable day work"], ["limited nursing relevance"], ["local government roles", "admin", "customer service", "library", "systems support"], "Check listings weekly and save roles with Thursday/Friday or part-time fit.", "Good WorkApp partner source for Josh-friendly predictable roles."),
  agency("tafe-nsw", "TAFE NSW Dubbo / TAFE Digital", "training provider", ["training", "TAFE", "TAE40122", "ICT", "business", "funding", "online"], ["TAE40122", "ICT certificates", "business/admin", "digital trainer pathway"], ["possible CPD/refresher pathways to verify"], ["TAFE courses", "TAE40122", "ICT certificates", "business/admin", "Fee-Free TAFE checks"], "Ask about delivery days, workload, subsidies, and whether TAE40122 can fit Monday/Wednesday work.", "Key provider for Josh's long-term trainer/ICT/admin pathways."),
  agency("nursing-agencies", "Nursing recruitment agencies", "nursing agency", ["nursing", "part-time", "casual", "aged care risk", "verify fit"], [], ["nursing work", "part-time/casual", "screen for non-aged-care roles"], ["nursing placement", "shift matching"], "Ask directly whether they have non-aged-care Dubbo roles.", "Useful only if they can exclude aged care/RACF and offer clinic/community/hospital options."),
];

const course = (
  id: string,
  person: TrainingOption["person"],
  courseName: string,
  provider: string,
  priority: TrainingOption["priority"],
  deliveryMode: TrainingOption["deliveryMode"],
  scores: Partial<TrainingOption>,
  jobsUnlocked: string[],
  questions: string[],
  notes: string,
): TrainingOption => ({
  id,
  person,
  course: courseName,
  provider,
  cost: "Check current cost and subsidies",
  fundingPossible: "Ask Parent Pathways, Smart and Skilled, Fee-Free TAFE, Workforce Australia, or employer support where relevant",
  deliveryMode,
  duration: "Check current intake and workload",
  priority,
  status: "Idea",
  employabilityImpact: 6,
  timeFit: 6,
  costFit: 6,
  fundingAvailability: 5,
  strengthsAlignment: 7,
  availabilityFit: 7,
  stressFit: 7,
  longTermValue: 7,
  jobsUnlocked,
  questions,
  notes,
  lastVerified: staleDate,
  ...scores,
});

export const trainingSeed: TrainingOption[] = [
  course("ms-365", "josh", "Microsoft 365 Fundamentals", "Microsoft Learn / exam provider", "Contact this week", "online", { employabilityImpact: 8, timeFit: 9, strengthsAlignment: 10, availabilityFit: 9, longTermValue: 8 }, ["Microsoft 365 support", "MSP Level 1-2", "school ICT", "admin systems support"], ["Can exam fees be funded?", "Which path supports M365 admin work fastest?"], "Fast, aligned with current MSP support, and useful for WorkApp matches."),
  course("tae40122", "josh", "TAE40122 Certificate IV in Training and Assessment", "TAFE NSW or suitable RTO", "Contact this week", "blended", { employabilityImpact: 9, timeFit: 5, costFit: 4, fundingAvailability: 7, strengthsAlignment: 9, stressFit: 5, longTermValue: 10 }, ["digital literacy trainer", "TAFE/RTO trainer", "workplace trainer", "school tech trainer"], ["What days and workload?", "Can assessment fit around Monday/Wednesday work?"], "High long-term value, but load and funding need careful checking."),
  course("comptia-a", "josh", "CompTIA A+", "CompTIA training provider / online learning", "Maybe later", "online", { employabilityImpact: 7, costFit: 5, stressFit: 6 }, ["service desk", "desktop support", "school ICT support", "MSP technician"], ["Is A+ valued by Dubbo employers compared with Microsoft certs?", "Can exam fees be funded?"], "Useful baseline, but Microsoft 365 may be faster given Josh's current role."),
  course("cert-business", "josh", "Certificate IV in Business/Admin", "TAFE NSW or RTO", "Maybe later", "check", { fundingAvailability: 7 }, ["admin officer", "customer service", "systems admin support", "library/admin support"], ["Can units be done online?", "Is it subsidised in NSW?"], "Good bridge if local admin roles appear more often than ICT roles."),
  course("first-aid", "both", "First Aid / CPR / Basic Life Support", "Local first aid provider", "Contact this week", "in person", { timeFit: 9, stressFit: 8 }, ["school support", "community work", "nursing readiness", "training roles"], ["Which dates avoid Monday/Wednesday?", "Can BLS be recognised for nursing requirements?"], "Small practical credential that may remove application blockers."),
  course("immunisation", "kristy", "Immunisation nursing course", "Accredited immunisation training provider", "Contact today", "online", { employabilityImpact: 10, strengthsAlignment: 9, longTermValue: 9 }, ["GP practice nurse", "immunisation clinic", "community health", "school vaccination programs"], ["Is this course accepted in NSW?", "What practical components are required?", "Can funding cover fees?"], "Strong non-aged-care pathway for GP/clinic/community work."),
  course("gp-practice", "kristy", "GP practice nurse orientation and chronic disease management CPD", "Nursing CPD provider / PHN-related training", "Contact today", "online", { employabilityImpact: 9, timeFit: 8, costFit: 7, stressFit: 8 }, ["GP practice nurse", "clinic nurse", "chronic disease nurse", "care plan support"], ["Which modules matter most for GP practices?", "Do local clinics value this CPD?"], "Good family-fit direction and avoids aged care."),
  course("child-family", "kristy", "Child and family health nursing pathway", "University/health pathway provider to verify", "Maybe later", "check", { employabilityImpact: 8, timeFit: 4, costFit: 3, stressFit: 5, longTermValue: 9 }, ["child and family health nurse", "maternal/child services", "community health"], ["What is the minimum pathway for Dubbo roles?", "Can this wait until employment is stable?"], "Excellent fit, but likely not the fastest first step."),
  course("wound-care", "kristy", "Wound care CPD", "Nursing CPD provider", "Contact this week", "online", { employabilityImpact: 7, timeFit: 8, costFit: 7 }, ["GP practice nurse", "clinic nurse", "outpatient nurse", "community health nurse"], ["Is the provider recognised?", "Will this help with clinic applications?"], "Practical CPD that supports non-aged-care nursing applications."),
];

export const contactsSeed: Contact[] = [
  { id: "contact-spinifex", agencyId: "spinifex", personContacted: "", channel: "Phone", lastContact: "", nextFollowUp: "", notes: "Ask for Thursday/Friday ICT, admin, customer service, school support, or digital training work.", status: "Not started" },
  { id: "contact-yilabara", agencyId: "yilabara", personContacted: "", channel: "Phone", lastContact: "", nextFollowUp: "", notes: "Ask about Kristy's eligibility, nursing CPD funding, checks, transport, laptop/phone, and next appointment.", status: "Not started" },
];

export const parentPathwaysSeed: ParentPathwaysState = {
  eligibility: "Needs direct confirmation, especially if Kristy is not currently receiving Parenting Payment.",
  providerContact: "Yilabara Dubbo / Parent Pathways - contact details need verification.",
  appointmentNotes: "",
  goalsDiscussed: "Family-friendly RN work, confidence rebuilding, non-aged-care nursing pathway, funding for CPD/checks.",
  trainingRecommended: "Immunisation, GP practice nurse CPD, CPR/BLS update, child/family health pathway when ready.",
  fundingAvailable: "Ask directly about course fees, checks, transport, materials, laptop/phone, and individual fund rules.",
  individualFundUsage: "",
  documentsNeeded: ["ID", "AHPRA registration details", "resume", "course quotes", "WWCC/police check info if required"],
  nextAppointment: "",
  agreedNextSteps: "Book or confirm first appointment; bring questions and course quotes where possible.",
};
