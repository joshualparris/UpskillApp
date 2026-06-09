import { profiles } from "../profiles";
import type { Agency, MessageKind, TrainingOption } from "../types";

export function generateMessage(kind: MessageKind, agency?: Agency, training?: TrainingOption) {
  const agencyName = agency?.name ?? "there";
  const courseName = training?.course ?? "the course";
  const provider = training?.provider ?? "your provider";
  const josh = profiles.josh;
  const kristy = profiles.kristy;

  if (kind === "Josh agency")
    return `Hi ${agencyName},

My name is ${josh.fullName} and I live in Dubbo (${josh.phone}, ${josh.email}).

I am looking for Thursday/Friday day work. I currently work Monday and Wednesday as ICT Support at Avance Business Technology (MSP help desk — tickets, M365, device imaging, and customer support).

Recent experience includes Dubbo Christian School (ICT and library support), and 10+ years at La Trobe University in customer care, student ICT, scheduling/exams, and business process roles. I hold Cert III Library and Information Services (TAFE NSW) and am strong in Microsoft 365, Google Workspace, Active Directory, Jira, and CRM platforms. Clearances: WWCC and police check.

I am open to ICT support, school ICT/library, admin, customer service, or digital training roles that fit Thursday/Friday.

Do you currently have any Dubbo roles that match this background and availability?`;

  if (kind === "Kristy agency")
    return `Hi ${agencyName},

My name is ${kristy.fullName} (AHPRA registered nurse, ${kristy.phone}, ${kristy.email}). We have recently relocated to Dubbo.

I am seeking part-time or casual nursing work and am not looking for residential aged care. My background is 10+ years as a Registered Nurse on the Children's Ward at Bendigo Health (to January 2026), with earlier rehabilitation nursing and graduate rotations in child/adolescent, rehab, and orthopaedics.

Clinical strengths include paediatric acute assessment, family education, wound care, fluid management, deterioration recognition, and multidisciplinary collaboration. I am interested in GP practice, clinic, community health, child and family health, school nursing, immunisation, outpatient, or hospital casual pool roles with family-friendly hours where possible.

Do you currently have suitable non-aged-care RN opportunities in Dubbo or Western NSW?`;

  if (kind === "Josh training")
    return `Hi ${provider},

I am ${josh.fullName} checking whether ${courseName} fits my situation. I work Mon/Wed in MSP ICT support at Avance in Dubbo and want to strengthen Thursday/Friday employability and longer-term training/ICT pathways.

Could you please confirm delivery mode, days/times, cost, Smart and Skilled or Fee-Free eligibility, start dates, weekly workload, and whether the course suits someone already working in M365/help desk roles?`;

  if (kind === "Kristy training")
    return `Hi ${provider},

I am ${kristy.fullName}, an AHPRA-registered nurse recently relocated to Dubbo, exploring ${courseName} to support part-time or casual non-aged-care nursing (GP, clinic, child health, immunisation, or community roles).

Could you please confirm NSW recognition, delivery mode, cost, subsidies (including Parent Pathways if applicable), practical requirements, and whether this builds on paediatric hospital experience?`;

  if (kind === "Parent Pathways")
    return `Hi Yilabara / Parent Pathways,

We are ${josh.fullName} and ${kristy.fullName}, recently relocated to Dubbo (${kristy.address}).

Kristy is an AHPRA-registered paediatric nurse (10+ years Bendigo Health Children's Ward) seeking return-to-work support for family-friendly, non-aged-care nursing in Dubbo. Josh works Mon/Wed in ICT/MSP support and is exploring Thursday/Friday bridge work.

Can Parent Pathways help with nursing CPD (immunisation, GP practice modules), WWCC/police checks, transport, laptop/phone, course materials, or other work-related costs? Can you connect us with employers as well as training providers? What is the best first step this week?`;

  return `Hi ${agencyName},

I am following up on my message from three days ago about Dubbo work/training options.

Could you please let me know whether there is a suitable next step, person to speak with, current vacancy, course option, or funding pathway to check?`;
}
