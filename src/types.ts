export type PersonKey = "josh" | "kristy";

export type SourceType =
  | "recruiter"
  | "employment service"
  | "Parent Pathways"
  | "training provider"
  | "government"
  | "nursing agency"
  | "RTO"
  | "employer";

export type Priority = "Contact today" | "Contact this week" | "Maybe later" | "Avoid";

export type Agency = {
  id: string;
  name: string;
  type: SourceType;
  location: string;
  phone: string;
  email: string;
  website: string;
  openingHours: string;
  helpsWith: string[];
  joshRelevance: string[];
  kristyRelevance: string[];
  eligibilityRules: string;
  costs: string;
  fundingOptions: string[];
  servicesOffered: string[];
  lastVerified: string;
  confidence: "low" | "medium" | "high";
  notes: string;
  nextAction: string;
  tags: string[];
};

export type AgencyScore = {
  joshScore: number;
  kristyScore: number;
  bestReason: string;
  biggestConcern: string;
  exactQuestion: string;
  priority: Priority;
  kristyHardPenalty: boolean;
};

export type TrainingOption = {
  id: string;
  person: PersonKey | "both";
  course: string;
  provider: string;
  cost: string;
  fundingPossible: string;
  deliveryMode: "online" | "in person" | "blended" | "check";
  duration: string;
  priority: Priority;
  status: "Idea" | "Checking" | "Applied" | "In progress" | "Completed" | "Deferred";
  employabilityImpact: number;
  timeFit: number;
  costFit: number;
  fundingAvailability: number;
  strengthsAlignment: number;
  availabilityFit: number;
  stressFit: number;
  longTermValue: number;
  jobsUnlocked: string[];
  questions: string[];
  notes: string;
  lastVerified: string;
};

export type Contact = {
  id: string;
  agencyId: string;
  personContacted: string;
  channel: "Phone" | "Email" | "Web form" | "In person";
  lastContact: string;
  nextFollowUp: string;
  notes: string;
  status: "Not started" | "Waiting" | "Follow up" | "Booked" | "Closed";
};

export type ParentPathwaysState = {
  eligibility: string;
  providerContact: string;
  appointmentNotes: string;
  goalsDiscussed: string;
  trainingRecommended: string;
  fundingAvailable: string;
  individualFundUsage: string;
  documentsNeeded: string[];
  nextAppointment: string;
  agreedNextSteps: string;
};

export type MessageKind =
  | "Josh agency"
  | "Kristy agency"
  | "Josh training"
  | "Kristy training"
  | "Parent Pathways"
  | "3 day follow-up";
