export type AgencyType =
  | 'recruiter'
  | 'employment-service'
  | 'parent-pathways'
  | 'training-provider'
  | 'government'
  | 'nursing-agency'
  | 'rto'
  | 'funding'
  | 'support';

export interface Agency {
  id: string;
  name: string;
  type: AgencyType;
  location: string;
  phone: string;
  email: string;
  website: string;
  openingHours: string;
  helps: string;
  joshRelevance: string;
  kristyRelevance: string;
  eligibility: string;
  costs: string;
  funding: string;
  courses: string;
  lastVerified: string;
  confidence: number;
  notes: string;
  nextAction: string;
  tags: string[];
}

export interface TrainingOption {
  id: string;
  name: string;
  provider: string;
  description: string;
  focus: 'josh' | 'kristy' | 'both';
  delivery: string;
  duration: string;
  cost: string;
  funding: string;
  alignment: string;
  lastVerified: string;
  confidence: number;
  notes: string;
  tags: string[];
}

export interface Profile {
  name: string;
  role: string;
  goals: string;
  availability: string;
  notLookingFor: string;
  strengths: string;
}

export interface AgencyScore {
  joshScore: number;
  kristyScore: number;
  bestReason: string;
  biggestConcern: string;
  priority: string;
  needsVerification: boolean;
}

export interface TrainingScore {
  score: number;
  reason: string;
  priority: string;
  supportsWorkApp: string;
}
