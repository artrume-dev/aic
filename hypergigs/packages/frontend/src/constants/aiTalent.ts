// AI Talent Roles
export const AI_TALENT_ROLES = [
  'ML Engineer',
  'Data Scientist',
  'LLM Engineer',
  'AI Research Scientist',
  'Computer Vision Engineer',
  'NLP Engineer',
  'MLOps Engineer',
  'Data Engineer',
  'AI Product Manager',
  'AI Solutions Architect',
  'Prompt Engineer',
  'AI/ML Consultant',
  'Deep Learning Engineer',
  'Reinforcement Learning Engineer',
  'AI Ethics Specialist',
] as const;

// Talent Tiers
export const TALENT_TIERS = [
  { value: 'JUNIOR', label: 'Junior', description: '0-2 years experience' },
  { value: 'MID', label: 'Mid-Level', description: '2-5 years experience' },
  { value: 'SENIOR', label: 'Senior', description: '5-10 years experience' },
  { value: 'EXPERT', label: 'Expert', description: '10+ years experience' },
  { value: 'PRINCIPAL', label: 'Principal', description: 'Industry leader' },
] as const;

// Employment Preferences
export const EMPLOYMENT_PREFERENCES = [
  { value: 'CONTRACT', label: 'Contract Only' },
  { value: 'TEMP_TO_PERM', label: 'Temp-to-Perm' },
  { value: 'PERMANENT', label: 'Permanent Only' },
  { value: 'ANY', label: 'Open to Any' },
] as const;

// Availability Status
export const AVAILABILITY_STATUS = [
  { value: 'AVAILABLE', label: 'Available Now', color: 'green' },
  { value: 'BUSY', label: 'Busy', color: 'yellow' },
  { value: 'NOT_LOOKING', label: 'Not Looking', color: 'gray' },
] as const;

// Verification Tiers (assigned after verification)
export const VERIFICATION_TIERS = [
  { value: 'JUNIOR', label: 'Verified Junior', description: 'Entry-level skills verified' },
  { value: 'MID', label: 'Verified Mid-Level', description: 'Intermediate skills verified' },
  { value: 'SENIOR', label: 'Verified Senior', description: 'Advanced skills verified' },
  { value: 'EXPERT', label: 'Verified Expert', description: 'Expert-level skills verified' },
  { value: 'PRINCIPAL', label: 'Verified Principal', description: 'Industry leader verified' },
] as const;

// Common timezones for AI talent
export const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
] as const;

export type TalentRole = typeof AI_TALENT_ROLES[number];
export type TalentTier = typeof TALENT_TIERS[number]['value'];
export type EmploymentPreference = typeof EMPLOYMENT_PREFERENCES[number]['value'];
export type AvailabilityStatus = typeof AVAILABILITY_STATUS[number]['value'];
export type VerificationTier = typeof VERIFICATION_TIERS[number]['value'];
