import type { Agency, AgencyScore, TrainingOption, TrainingScore } from './types';

function isRecent(iso: string) {
  const verified = new Date(iso);
  const now = new Date();
  return (now.getTime() - verified.getTime()) / (1000 * 60 * 60 * 24) < 30;
}

function hasTag(item: { tags: string[] }, tag: string) {
  return item.tags.includes(tag);
}

export function computeAgencyScore(agency: Agency): AgencyScore {
  let joshScore = 0;
  let kristyScore = 0;
  const reasons: string[] = [];
  const concerns: string[] = [];

  if (hasTag(agency, 'part-time') || hasTag(agency, 'family-friendly')) {
    joshScore += 25;
  }
  if (hasTag(agency, 'admin') || hasTag(agency, 'customer-service') || hasTag(agency, 'education-support') || hasTag(agency, 'government') || hasTag(agency, 'training')) {
    joshScore += 20;
  }
  if (agency.location.toLowerCase().includes('dubbo') || hasTag(agency, 'regional') || hasTag(agency, 'local')) {
    joshScore += 15;
  }
  if (hasTag(agency, 'training')) {
    joshScore += 15;
  }
  if (agency.helps.toLowerCase().includes('resume') || agency.helps.toLowerCase().includes('interview')) {
    joshScore += 10;
  }
  if (hasTag(agency, 'local-employers')) {
    joshScore += 10;
  }
  if (hasTag(agency, 'easy-contact')) {
    joshScore += 5;
  }
  if (hasTag(agency, 'labour-hire') && !agency.helps.toLowerCase().includes('admin')) {
    joshScore -= 20;
    concerns.push('May focus on labour hire rather than part-time admin or ICT work.');
  }
  if (hasTag(agency, 'night') || hasTag(agency, 'heavy')) {
    joshScore -= 20;
  }
  if (agency.helps.toLowerCase().includes('full availability')) {
    joshScore -= 15;
  }
  if (!agency.location.toLowerCase().includes('dubbo') && !agency.tags.includes('regional')) {
    joshScore -= 10;
  }
  if (agency.helps.toLowerCase().includes('admin burden') || agency.notes.toLowerCase().includes('admin burden')) {
    joshScore -= 10;
  }

  if (hasTag(agency, 'healthcare') || hasTag(agency, 'clinic') || hasTag(agency, 'nursing') || hasTag(agency, 'community')) {
    kristyScore += 30;
  }
  if (hasTag(agency, 'family-friendly') || hasTag(agency, 'part-time')) {
    kristyScore += 25;
  }
  if (hasTag(agency, 'clinic') || hasTag(agency, 'community') || hasTag(agency, 'school') || hasTag(agency, 'immunisation') || hasTag(agency, 'outpatient')) {
    kristyScore += 20;
  }
  if (agency.helps.toLowerCase().includes('confidence') || agency.helps.toLowerCase().includes('return-to-work')) {
    kristyScore += 10;
  }
  if (agency.helps.toLowerCase().includes('employer') || hasTag(agency, 'local-employers')) {
    kristyScore += 10;
  }
  if (hasTag(agency, 'easy-contact')) {
    kristyScore += 5;
  }
  if (agency.tags.includes('nursing-agency') && agency.helps.toLowerCase().includes('aged care')) {
    kristyScore -= 30;
    concerns.push('Mostly aged care focus; poor fit for Kristy unless overridden.');
  }

  const bestReason = reasons.length ? reasons.join(' ') : 'Local support and pathway matching for each profile.';
  const biggestConcern = concerns.length ? concerns.join(' ') : 'Verify role types and suitability before acting.';

  const joshPriority = joshScore >= 60 ? 'Contact today' : joshScore >= 45 ? 'Contact this week' : joshScore >= 25 ? 'Maybe later' : 'Avoid';
  const kristyPriority = kristyScore >= 60 ? 'Contact today' : kristyScore >= 45 ? 'Contact this week' : kristyScore >= 25 ? 'Maybe later' : 'Avoid';
  const priority = joshPriority === 'Contact today' || kristyPriority === 'Contact today' ? 'Contact today' : joshPriority === 'Contact this week' || kristyPriority === 'Contact this week' ? 'Contact this week' : 'Maybe later';

  return {
    joshScore: Math.max(0, Math.min(100, joshScore)),
    kristyScore: Math.max(0, Math.min(100, kristyScore)),
    bestReason,
    biggestConcern,
    priority,
    needsVerification: !isRecent(agency.lastVerified),
  };
}

function scoreTraining(option: TrainingOption, focus: 'josh' | 'kristy') {
  let score = 0;
  const reasons: string[] = [];

  const isJosh = focus === 'josh';
  const isKristy = focus === 'kristy';

  if (option.tags.includes('funded') || option.funding.toLowerCase().includes('fee-free') || option.funding.toLowerCase().includes('subsid')) {
    score += 20;
    reasons.push('Strong funding or fee-free option.');
  }
  if (option.tags.includes('short-course') || option.duration.includes('4–8 weeks') || option.duration.includes('1–4 weeks')) {
    score += 15;
    reasons.push('Shorter completion time for lower overwhelm.');
  }
  if (isJosh && option.tags.includes('ICT')) {
    score += 20;
    reasons.push('Fits Josh’s ICT support pathway.');
  }
  if (isJosh && option.tags.includes('MSP')) {
    score += 15;
  }
  if (isKristy && option.tags.includes('nursing')) {
    score += 25;
    reasons.push('Directly relevant to Kristy’s nursing pathway.');
  }
  if (isKristy && option.tags.includes('clinic')) {
    score += 15;
  }
  if (isKristy && option.tags.includes('family-health')) {
    score += 15;
  }
  if (option.tags.includes('online') || option.delivery.includes('online')) {
    score += 10;
    reasons.push('Flexible delivery supports current schedules.');
  }
  if (option.tags.includes('certificate') || option.tags.includes('TAE')) {
    score += 10;
    reasons.push('Good long-term career value.');
  }
  if (option.description.toLowerCase().includes('premium') || option.cost.toLowerCase().includes('from $1,500')) {
    score -= 10;
  }

  let priority = 'Later';
  if (score >= 60) priority = 'Do now';
  else if (score >= 45) priority = 'Consider soon';
  else if (score >= 30) priority = 'Watch list';

  return {
    score: Math.max(0, Math.min(100, score)),
    reason: reasons.length ? reasons.join(' ') : 'A balanced training pathway to improve local employability.',
    priority,
    supportsWorkApp: isJosh
      ? option.tags.includes('ICT') || option.tags.includes('MSP') || option.tags.includes('training')
        ? 'Yes'
        : 'Maybe'
      : option.tags.includes('nursing') || option.tags.includes('clinic') || option.tags.includes('community')
      ? 'Yes'
      : 'Maybe',
  };
}

export function computeJoshTrainingScore(option: TrainingOption): TrainingScore {
  return scoreTraining(option, 'josh');
}

export function computeKristyTrainingScore(option: TrainingOption): TrainingScore {
  return scoreTraining(option, 'kristy');
}
