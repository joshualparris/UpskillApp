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

export type VerificationStatus = "verified" | "needs_check" | "stale" | "unknown";

export type SourceTracking = {
  sourceUrl: string;
  sourceName: string;
  lastChecked: string;
  verifiedBy: string;
  sourceNotes: string;
  verificationStatus: VerificationStatus;
};

export type Agency = SourceTracking & {
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
  archived?: boolean;
  kristyAgedCareOverride?: boolean;
};

export type ScoreBreakdownItem = {
  label: string;
  points: number;
  person?: PersonKey;
};

export type AgencyScore = {
  joshScore: number;
  kristyScore: number;
  joshBreakdown: ScoreBreakdownItem[];
  kristyBreakdown: ScoreBreakdownItem[];
  bestReason: string;
  biggestConcern: string;
  exactQuestion: string;
  priority: Priority;
  kristyHardPenalty: boolean;
};

export type TrainingScoreDetail = {
  total: number;
  breakdown: ScoreBreakdownItem[];
};

export type TrainingOption = SourceTracking & {
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
  archived?: boolean;
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
  archived?: boolean;
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
  yilabaraChecklist: Record<string, boolean>;
  yilabaraChecklistItems: string[];
};

export type MessageKind =
  | "Josh agency"
  | "Kristy agency"
  | "Josh training"
  | "Kristy training"
  | "Parent Pathways"
  | "3 day follow-up";

export type RequirementAnalysis = {
  id: string;
  createdAt: string;
  title: string;
  inputText: string;
  matchedRequirements: string[];
  trainingGaps: string[];
  agenciesToContact: string[];
  questionsToAsk: string[];
  fitsJosh: boolean;
  fitsKristy: boolean;
  riskFlags: string[];
  summary: string;
};

export type AdzunaJobListing = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  created: string;
  salaryMin?: number;
  salaryMax?: number;
  redirectUrl: string;
  contractType?: string;
  contractTime?: string;
};

export type AppSettings = {
  showArchived: boolean;
};

export type AppPersistedState = {
  version: number;
  agencies: Agency[];
  training: TrainingOption[];
  contacts: Contact[];
  parent: ParentPathwaysState;
  requirementText: string;
  requirementAnalyses: RequirementAnalysis[];
  settings: AppSettings;
};

export const BACKUP_VERSION = 2;

export const DEFAULT_CHECKLIST_ITEMS = [
  "Is Kristy eligible if she is not receiving Parenting Payment?",
  "Can funding help with nursing CPD, immunisation, checks, laptop, phone, transport, or materials?",
  "Can you help find family-friendly nursing work that is not aged care?",
  "Can you connect us with employers or only training providers?",
  "Can the program support Josh too, or only Kristy?",
  "What is the best first step this week?",
] as const;

/** @deprecated use DEFAULT_CHECKLIST_ITEMS */
export const YILABARA_CHECKLIST_ITEMS = DEFAULT_CHECKLIST_ITEMS;

export const defaultSourceTracking = (): SourceTracking => ({
  sourceUrl: "",
  sourceName: "",
  lastChecked: "",
  verifiedBy: "",
  sourceNotes: "",
  verificationStatus: "unknown",
});
