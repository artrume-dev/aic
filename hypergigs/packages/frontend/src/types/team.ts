export type TeamType = 'COMPANY' | 'ORGANIZATION' | 'TEAM';
export type SubTeamCategory =
  | 'ENGINEERING'
  | 'MARKETING'
  | 'DESIGN'
  | 'HR'
  | 'SALES'
  | 'PRODUCT'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'LEGAL'
  | 'SUPPORT'
  | 'OTHER';
export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type PartnerTier = 'EMERGING' | 'ESTABLISHED' | 'PREMIER' | 'ENTERPRISE';
export type DeliveryModel = 'FIXED_PRICE' | 'TIME_AND_MATERIALS' | 'RETAINER' | 'OUTCOME_BASED';

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: TeamType;
  subTeamCategory?: SubTeamCategory;
  imageUrl?: string;
  avatar?: string;
  website?: string;
  city?: string;
  ownerId?: string;
  parentTeamId?: string;
  isMainTeam: boolean;
  memberCount: number;
  projectCount: number;
  createdAt: string;
  updatedAt: string;

  // Consulting firm specific fields
  isConsultingFirm?: boolean;
  partnerTier?: PartnerTier;
  aiSpecializations?: string[];
  techStack?: string[];
  industries?: string[];
  deliveryModels?: DeliveryModel[];
  teamSize?: number;
  foundedYear?: number;
  minProjectBudget?: number;
  avgProjectDuration?: number;
  successRate?: number;
  clientSatisfactionScore?: number;
  isVerified?: boolean;
  verificationStatus?: string;
  verifiedAt?: string;

  _count?: {
    members: number;
    projects: number;
    subTeams?: number;
    jobPostings?: number;
  };
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: string;
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

export interface TeamWithRole extends Team {
  role: TeamRole;
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  type: TeamType;
  subTeamCategory?: SubTeamCategory;
  imageUrl?: string;
  avatar?: string;
  website?: string;
  city?: string;
  parentTeamId?: string;

  // Consulting firm fields
  isConsultingFirm?: boolean;
  partnerTier?: PartnerTier;
  aiSpecializations?: string[];
  techStack?: string[];
  industries?: string[];
  deliveryModels?: DeliveryModel[];
  teamSize?: number;
  foundedYear?: number;
  minProjectBudget?: number;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  type?: TeamType;
  imageUrl?: string;
  avatar?: string;
  website?: string;
  city?: string;

  // Consulting firm fields
  isConsultingFirm?: boolean;
  partnerTier?: PartnerTier;
  aiSpecializations?: string[];
  techStack?: string[];
  industries?: string[];
  deliveryModels?: DeliveryModel[];
  teamSize?: number;
  foundedYear?: number;
  minProjectBudget?: number;
  avgProjectDuration?: number;
}

export interface SearchTeamsFilters {
  type?: TeamType;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;

  // Consulting firm filters
  isConsultingFirm?: boolean;
  partnerTier?: PartnerTier;
  aiSpecializations?: string[];
  techStack?: string[];
  industries?: string[];
  isVerified?: boolean;
}

export interface PaginatedTeams {
  teams: Team[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AddMemberRequest {
  userId: string;
  role: TeamRole;
}

export interface UpdateMemberRoleRequest {
  role: TeamRole;
}
