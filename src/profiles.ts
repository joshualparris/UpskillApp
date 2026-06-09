import type { PersonKey } from "./types";

export type PersonProfile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  availability: string;
  focus: string;
  summary: string;
  currentRole: string;
  strengths: string[];
  technicalSkills: string[];
  clearances: string[];
  targetRoles: string[];
  targetEmployers: string[];
  resumeHighlights: string[];
  adzunaKeywords: string;
};

export const profiles: Record<PersonKey, PersonProfile> = {
  josh: {
    fullName: "Joshua Parris",
    email: "joshualukeparris@gmail.com",
    phone: "0457 633 371",
    address: "101 Boundary Road, Dubbo NSW 2830",
    title: "ICT support · MSP · school/library tech · admin systems · digital training",
    availability:
      "Works Monday and Wednesday at Avance Business Technology (MSP). Seeking Thursday/Friday day work in Dubbo without disrupting current role.",
    focus:
      "Bridge income with predictable ICT, admin, customer service, or school support roles while building Microsoft 365 and TAE40122 pathways.",
    summary:
      "Administrator and ICT support professional with 10+ years across university, school, and MSP settings. Currently providing MSP help desk support at Avance in Dubbo, with recent school ICT/library experience at Dubbo Christian School.",
    currentRole: "ICT Support — Avance Business Technology, Dubbo (from Apr 2026)",
    strengths: [
      "MSP help desk (phone, email, tickets)",
      "Microsoft 365 and Google Workspace support",
      "Device imaging, onboarding, and troubleshooting",
      "School ICT and library systems (cataloguing, teacher support)",
      "Customer care, CRM, and stakeholder communication",
      "Scheduling, exams, compliance, and process improvement",
      "Coaching, mentoring, and digital literacy training",
    ],
    technicalSkills: [
      "Microsoft 365 admin and end-user support",
      "Google Workspace",
      "Active Directory / password resets",
      "Windows reimaging and device setup",
      "Jira Service Desk",
      "Oracle CRM",
      "Library cataloguing (Dewey)",
    ],
    clearances: ["WWCC", "National police check", "ADF negative vetting (Reserves)"],
    targetRoles: [
      "ICT support / help desk",
      "MSP Level 1–2 technician",
      "School ICT or library support",
      "Administration officer",
      "Customer service / student services",
      "Digital literacy trainer",
    ],
    targetEmployers: [
      "Local MSPs and IT providers",
      "Schools and education providers",
      "Council / government admin",
      "Employment services (resume already strong)",
    ],
    resumeHighlights: [
      "La Trobe University — Senior Officer Customer Care & business processes (2021–2025)",
      "Dubbo Christian School — ICT and Library Support (Jan–Jul 2026)",
      "Victory Christian College — compliance, scheduling, timetabling",
      "Cert III Library and Information Services (TAFE NSW)",
      "Bachelor of Outdoor Education (La Trobe)",
    ],
    adzunaKeywords:
      "ICT OR helpdesk OR Microsoft 365 OR admin OR school OR library OR customer service OR MSP",
  },
  kristy: {
    fullName: "Kristy Parris",
    email: "kristywatsonj@gmail.com",
    phone: "0402 643 863",
    address: "101 Boundary Road, Dubbo NSW 2830",
    title: "Registered Nurse — paediatrics, acute care, family-centred practice",
    availability:
      "Recently relocated to Dubbo. Seeking part-time or casual RN work with family-friendly hours. Not seeking residential aged care.",
    focus:
      "GP practice, clinic, community, school/child health, outpatient, immunisation, or hospital casual pool — leveraging 10+ years in paediatric acute care.",
    summary:
      "AHPRA-registered nurse with extensive paediatric ward experience at Bendigo Health (2017–2026), plus rehabilitation and graduate rotations. Skilled in acute assessment, family education, wound care, deterioration recognition, and multidisciplinary collaboration.",
    currentRole: "Relocating to Dubbo — most recent: RN, Children's Ward, Bendigo Health (to Jan 2026)",
    strengths: [
      "Paediatric acute assessment and stabilisation",
      "Parent education and therapeutic rapport",
      "Wound care and fluid management",
      "Respiratory/neuro observations and escalation",
      "Rehabilitation and sub-acute care",
      "Multidisciplinary teamwork",
      "Documentation, admin, and organisation",
    ],
    technicalSkills: [
      "Paediatric acute presentations",
      "IV cannulation assistance",
      "Bronchodilator and asthma management",
      "Eating disorder / adolescent mental health (ward context)",
      "Rehabilitation care planning",
    ],
    clearances: ["AHPRA registration 8340754679", "WWCC (confirm current)", "Police check (confirm current)"],
    targetRoles: [
      "Registered Nurse — GP practice",
      "Clinic or community health nurse",
      "Child and family health / school nursing",
      "Immunisation nurse",
      "Hospital casual pool (non-aged-care areas)",
      "Outpatient or day surgery",
    ],
    targetEmployers: [
      "GP practices and medical clinics",
      "NSW Health / Western NSW LHD",
      "Community health and PHN programs",
      "Child and family health services",
      "Immunisation providers",
    ],
    resumeHighlights: [
      "Bendigo Health Children's Ward RN (Oct 2017 – Jan 2026)",
      "Inpatient rehabilitation RN (2015–2017)",
      "Graduate rotations: child/adolescent, rehab, orthopaedics",
      "Bachelor of Nursing — ACU Ballarat (2013)",
      "Circle of Security — Catholic Care Bendigo (2025)",
    ],
    adzunaKeywords:
      "registered nurse OR practice nurse OR paediatric OR child health OR immunisation OR community health OR clinic",
  },
};

export const profileText = {
  josh: {
    title: profiles.josh.title,
    availability: profiles.josh.availability,
    focus: profiles.josh.focus,
  },
  kristy: {
    title: profiles.kristy.title,
    availability: profiles.kristy.availability,
    focus: profiles.kristy.focus,
  },
};
