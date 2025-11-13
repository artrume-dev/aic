export type UserRole = 'FREELANCER' | 'AGENCY' | 'STARTUP';
export type Currency = 'USD' | 'GBP' | 'EUR';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  bio?: string;
  jobTitle?: string;
  location?: string;
  country?: string;
  avatar?: string;
  available: boolean;
  nextAvailability?: string;
  hourlyRate?: number;
  hourlyRateMax?: number;
  currency: Currency;
  hasVerifiedBadge?: boolean; // True if user has 1+ accepted recommendations

  // AI Talent Marketplace Fields
  isAITalent?: boolean; // True if user is in talent marketplace
  talentRole?: string; // ML_ENGINEER, DATA_SCIENTIST, LLM_ENGINEER, etc.
  talentTier?: string; // JUNIOR, MID, SENIOR, EXPERT, PRINCIPAL
  employmentPreference?: string; // CONTRACT, TEMP_TO_PERM, PERMANENT, ANY
  timezone?: string;

  // Verification Fields
  verificationStatus?: string; // UNVERIFIED, PENDING, UNDER_REVIEW, VERIFIED, VERIFIED_EXPERT, REJECTED
  verificationTier?: string; // JUNIOR, MID, SENIOR, EXPERT, PRINCIPAL (assigned after verification)
  verificationData?: string; // JSON: AI analysis results, scores
  verificationDate?: string;
  verifiedBy?: string;

  // AI Skill Scores (from verification)
  aiSkillScore?: number; // 0-100, AI-calculated skill proficiency
  portfolioScore?: number; // 0-100, AI-evaluated portfolio quality
  experienceScore?: number; // 0-100, AI-validated experience
  overallScore?: number; // 0-100, weighted average

  // Availability Status
  availabilityStatus?: string; // AVAILABLE, BUSY, NOT_LOOKING

  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username: string;
  role: UserRole;
  country?: string;
  invitationToken?: string;
}

export interface OAuthRegisterRequest {
  provider: 'google' | 'linkedin';
  token: string;
  role: UserRole;
  country?: string;
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}
