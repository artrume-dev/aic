import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger';
import {
  extractTeamKeywords,
  calculateMatchScore,
  generateMatchReason,
} from '../utils/keywordExtractor.js';

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
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type PartnerTier = 'EMERGING' | 'ESTABLISHED' | 'PREMIER' | 'ENTERPRISE';
export type DeliveryModel = 'FIXED_PRICE' | 'TIME_AND_MATERIALS' | 'RETAINER' | 'OUTCOME_BASED';

export interface CreateTeamData {
  name: string;
  description?: string;
  type: TeamType;
  subTeamCategory?: SubTeamCategory; // Only for sub-teams
  city?: string;
  avatar?: string;
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

export interface UpdateTeamData {
  name?: string;
  description?: string;
  type?: TeamType;
  city?: string;
  avatar?: string;

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

export interface TeamSearchFilters {
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

export class TeamService {
  /**
   * Parse JSON fields in team object
   */
  private parseTeamJsonFields(team: any) {
    if (!team) return team;

    return {
      ...team,
      aiSpecializations: team.aiSpecializations ? JSON.parse(team.aiSpecializations) : [],
      techStack: team.techStack ? JSON.parse(team.techStack) : [],
      industries: team.industries ? JSON.parse(team.industries) : [],
      deliveryModels: team.deliveryModels ? JSON.parse(team.deliveryModels) : [],
    };
  }

  /**
   * Create a new team
   */
  async createTeam(ownerId: string, data: CreateTeamData) {
    // Generate slug from name
    const slug = this.generateSlug(data.name);

    // Check if slug already exists
    const existingTeam = await prisma.team.findUnique({
      where: { slug },
    });

    if (existingTeam) {
      // Add random suffix to make it unique
      const uniqueSlug = `${slug}-${Date.now().toString(36)}`;
      return this.createTeamWithSlug(ownerId, data, uniqueSlug);
    }

    return this.createTeamWithSlug(ownerId, data, slug);
  }

  /**
   * Create team with specific slug
   */
  private async createTeamWithSlug(ownerId: string, data: CreateTeamData, slug: string) {
    // If this is a sub-team, verify parent exists and user is admin
    if (data.parentTeamId) {
      const parentTeam = await prisma.team.findUnique({
        where: { id: data.parentTeamId },
        include: {
          members: {
            where: {
              userId: ownerId,
              role: { in: ['OWNER', 'ADMIN'] },
            },
          },
        },
      });

      if (!parentTeam) {
        throw new Error('Parent team not found');
      }

      if (parentTeam.members.length === 0) {
        throw new Error('Only admins can create sub-teams');
      }

      if (!parentTeam.isMainTeam) {
        throw new Error('Sub-teams can only be created under main teams');
      }
    }

    // Create team and add owner as team member in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const team = await tx.team.create({
        data: {
          name: data.name,
          slug,
          description: data.description,
          type: data.type,
          subTeamCategory: data.subTeamCategory, // Department category for sub-teams
          city: data.city,
          avatar: data.avatar,
          ownerId,
          parentTeamId: data.parentTeamId,
          isMainTeam: !data.parentTeamId, // If has parent, it's a sub-team

          // Consulting firm fields
          isConsultingFirm: data.isConsultingFirm || false,
          partnerTier: data.partnerTier,
          aiSpecializations: data.aiSpecializations ? JSON.stringify(data.aiSpecializations) : '[]',
          techStack: data.techStack ? JSON.stringify(data.techStack) : '[]',
          industries: data.industries ? JSON.stringify(data.industries) : '[]',
          deliveryModels: data.deliveryModels ? JSON.stringify(data.deliveryModels) : '[]',
          teamSize: data.teamSize,
          foundedYear: data.foundedYear,
          minProjectBudget: data.minProjectBudget,
        },
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      });

      // Add owner as a team member with OWNER role
      await tx.teamMember.create({
        data: {
          userId: ownerId,
          teamId: team.id,
          role: 'OWNER',
        },
      });

      return team;
    });

    const teamType = data.parentTeamId ? 'Sub-team' : 'Main team';
    logger.info(`${teamType} created: ${result.name} by user ${ownerId}`);
    return result;
  }

  /**
   * Get team by ID with members
   */
  async getTeamById(teamId: string, includeMembers = true) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
        members: includeMembers
          ? {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    role: true,
                    bio: true,
                    location: true,
                  },
                },
              },
            }
          : false,
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

    return this.parseTeamJsonFields(team);
  }

  /**
   * Get team by slug
   */
  async getTeamBySlug(slug: string) {
    const team = await prisma.team.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                bio: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

    return this.parseTeamJsonFields(team);
  }

  /**
   * Update team (owner only)
   */
  async updateTeam(teamId: string, userId: string, data: UpdateTeamData) {
    // Check if user is the owner
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new Error('Only team owner can update team details');
    }

    // If name is being updated, generate new slug
    let slug = team.slug;
    if (data.name && data.name !== team.name) {
      slug = this.generateSlug(data.name);

      // Check if new slug exists
      const existingSlug = await prisma.team.findUnique({
        where: { slug },
      });

      if (existingSlug && existingSlug.id !== teamId) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }
    }

    // Prepare update data with JSON stringification for array fields
    const updateData: any = { ...data, slug };

    // JSON stringify array fields if they exist
    if (data.aiSpecializations !== undefined) {
      updateData.aiSpecializations = JSON.stringify(data.aiSpecializations);
    }
    if (data.techStack !== undefined) {
      updateData.techStack = JSON.stringify(data.techStack);
    }
    if (data.industries !== undefined) {
      updateData.industries = JSON.stringify(data.industries);
    }
    if (data.deliveryModels !== undefined) {
      updateData.deliveryModels = JSON.stringify(data.deliveryModels);
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
    });

    logger.info(`Team updated: ${updatedTeam.name}`);
    return this.parseTeamJsonFields(updatedTeam);
  }

  /**
   * Delete team (owner only)
   */
  async deleteTeam(teamId: string, userId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new Error('Only team owner can delete the team');
    }

    await prisma.team.delete({
      where: { id: teamId },
    });

    logger.info(`Team deleted: ${team.name} by user ${userId}`);
    return { message: 'Team deleted successfully' };
  }

  /**
   * Search/list teams with filters
   */
  async searchTeams(filters: TeamSearchFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      // Only show main teams (not sub-teams)
      isMainTeam: true,
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.city) {
      // Note: SQLite doesn't support mode: 'insensitive'
      // Production (PostgreSQL) should add mode: 'insensitive' for case-insensitive search
      where.city = { contains: filters.city };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              members: true,
              projects: true,
              jobPostings: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.team.count({ where }),
    ]);

    return {
      teams: teams.map(team => this.parseTeamJsonFields(team)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user's teams
   */
  async getUserTeams(userId: string) {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        userId,
        team: {
          // Only show main teams (not sub-teams)
          isMainTeam: true,
        },
      },
      include: {
        team: {
          include: {
            owner: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                members: true,
                projects: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    return teamMembers.map((tm: any) => {
      const parsedTeam = this.parseTeamJsonFields(tm.team);
      return {
        ...parsedTeam,
        role: tm.role,  // Frontend expects 'role' not 'myRole'
        joinedAt: tm.joinedAt,
      };
    });
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: string) {
    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            role: true,
            location: true,
            available: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' }, // OWNER first, then ADMIN, then MEMBER
        { joinedAt: 'asc' },
      ],
    });

    return members;
  }

  /**
   * Add team member (owner or admin only)
   */
  async addTeamMember(
    teamId: string,
    userId: string,
    newMemberId: string,
    role: MemberRole = 'MEMBER'
  ) {
    // Check if requester has permission
    const requesterMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
      throw new Error('Only team owners and admins can add members');
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: newMemberId,
          teamId,
        },
      },
    });

    if (existingMember) {
      throw new Error('User is already a team member');
    }

    // Only OWNER can add ADMIN or OWNER roles
    if (role !== 'MEMBER' && requesterMember.role !== 'OWNER') {
      throw new Error('Only team owner can assign admin or owner roles');
    }

    const member = await prisma.teamMember.create({
      data: {
        userId: newMemberId,
        teamId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });

    logger.info(`User ${newMemberId} added to team ${teamId} as ${role}`);
    return member;
  }

  /**
   * Remove team member (owner or admin only)
   */
  async removeTeamMember(teamId: string, userId: string, memberIdToRemove: string) {
    // Can't remove yourself if you're the owner
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.ownerId === memberIdToRemove) {
      throw new Error('Cannot remove team owner. Transfer ownership or delete team instead');
    }

    // Check if requester has permission
    const requesterMember = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!requesterMember || !['OWNER', 'ADMIN'].includes(requesterMember.role)) {
      throw new Error('Only team owners and admins can remove members');
    }

    // Check member to remove
    const memberToRemove = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: memberIdToRemove,
          teamId,
        },
      },
    });

    if (!memberToRemove) {
      throw new Error('Member not found in team');
    }

    // Admins can't remove other admins or owner
    if (requesterMember.role === 'ADMIN' && memberToRemove.role !== 'MEMBER') {
      throw new Error('Admins can only remove regular members');
    }

    await prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId: memberIdToRemove,
          teamId,
        },
      },
    });

    logger.info(`User ${memberIdToRemove} removed from team ${teamId}`);
    return { message: 'Member removed successfully' };
  }

  /**
   * Update member role (owner only)
   */
  async updateMemberRole(
    teamId: string,
    userId: string,
    memberIdToUpdate: string,
    newRole: MemberRole
  ) {
    // Check if requester is owner
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.ownerId !== userId) {
      throw new Error('Only team owner can update member roles');
    }

    // Can't change owner's role
    if (team.ownerId === memberIdToUpdate) {
      throw new Error('Cannot change owner role. Transfer ownership instead');
    }

    const updatedMember = await prisma.teamMember.update({
      where: {
        userId_teamId: {
          userId: memberIdToUpdate,
          teamId,
        },
      },
      data: {
        role: newRole,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    logger.info(`Member ${memberIdToUpdate} role updated to ${newRole} in team ${teamId}`);
    return updatedMember;
  }

  /**
   * Leave team (can't leave if you're the owner)
   */
  async leaveTeam(teamId: string, userId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    if (team.ownerId === userId) {
      throw new Error('Team owner cannot leave. Transfer ownership or delete team instead');
    }

    await prisma.teamMember.delete({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    logger.info(`User ${userId} left team ${teamId}`);
    return { message: 'Successfully left team' };
  }

  /**
   * Check if user is team member
   */
  async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    const member = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    return !!member;
  }

  /**
   * Get user's role in team
   */
  async getUserRoleInTeam(teamId: string, userId: string): Promise<MemberRole | null> {
    const member = await prisma.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    return member ? (member.role as MemberRole) : null;
  }

  /**
   * Get sub-teams of a team
   */
  async getSubTeams(parentTeamId: string) {
    const subTeams = await prisma.team.findMany({
      where: {
        parentTeamId,
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return subTeams;
  }

  /**
   * Get suggested members for a team based on intelligent keyword matching
   */
  async getSuggestedMembers(teamId: string, userId: string, limit = 10) {
    // Verify user is a team member
    const isMember = await this.isTeamMember(teamId, userId);
    if (!isMember) {
      throw new Error('Only team members can view member suggestions');
    }

    // Get team details
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!team) {
      throw new Error('Team not found');
    }

    // Extract keywords from team information
    const teamKeywords = extractTeamKeywords({
      name: team.name,
      description: team.description || undefined,
      type: team.type,
      subTeamCategory: team.subTeamCategory || undefined,
    });

    // For consulting firms, also include AI specializations, tech stack, and industries
    if (team.isConsultingFirm) {
      try {
        if (team.aiSpecializations) {
          const specs = JSON.parse(team.aiSpecializations as string) as string[];
          specs.forEach(spec => {
            const specWords = spec.toLowerCase().split(/\s+/);
            specWords.forEach(word => teamKeywords.push(word));
          });
        }
        if (team.techStack) {
          const tech = JSON.parse(team.techStack as string) as string[];
          tech.forEach(t => {
            const techWords = t.toLowerCase().split(/\s+/);
            techWords.forEach(word => teamKeywords.push(word));
          });
        }
        if (team.industries) {
          const industries = JSON.parse(team.industries as string) as string[];
          industries.forEach(ind => {
            const indWords = ind.toLowerCase().split(/\s+/);
            indWords.forEach(word => teamKeywords.push(word));
          });
        }
      } catch (e) {
        logger.warn('Failed to parse consulting firm keywords:', e);
      }
    }

    logger.info(
      `Team "${team.name}" - Type: ${team.type}, SubCategory: ${team.subTeamCategory || 'none'}, isConsultingFirm: ${team.isConsultingFirm || false}`
    );
    logger.info(`Extracted keywords: [${teamKeywords.join(', ')}]`);

    // Get all users who are not already team members
    const existingMemberIds = team.members.map((m) => m.userId);

    // Query users with their skills and work experiences for accurate matching
    const users = await prisma.user.findMany({
      where: {
        id: { notIn: existingMemberIds },
      },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        jobTitle: true,
        location: true,
        country: true,
        available: true,
        skills: {
          include: {
            skill: {
              select: {
                name: true,
              },
            },
          },
        },
        workExperiences: {
          select: {
            title: true,
            description: true,
          },
        },
      },
      take: 100, // Get more users for better matching
    });

    // Calculate match scores for each user
    const teamLocation = {
      city: team.city || undefined,
    };

    const scoredUsers = users
      .map((user) => {
        // Convert nullable fields to undefined for the matching functions
        const userForMatching = {
          bio: user.bio || undefined,
          jobTitle: user.jobTitle || undefined,
          location: user.location || undefined,
          country: user.country || undefined,
          skills: user.skills,
          workExperiences: user.workExperiences.map(exp => ({
            role: exp.title, // Map 'title' to 'role' for the matching function
            description: exp.description || undefined,
          })),
        };

        const score = calculateMatchScore(teamKeywords, userForMatching, teamLocation);
        const matchReason = generateMatchReason(teamKeywords, userForMatching);

        return {
          user: {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar,
            bio: user.bio,
            jobTitle: user.jobTitle,
            location: user.location,
            available: user.available,
          },
          score,
          matchReason,
        };
      })
      .filter((item) => item.score >= 3) // Lower threshold to show more matches (min 3 points - location match)
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, limit); // Limit results

    // Log detailed matching results
    scoredUsers.forEach(item => {
      logger.info(
        `  → ${item.user.username} (${item.user.jobTitle || 'no title'}) - Score: ${item.score} - Reason: ${item.matchReason}`
      );
    });

    logger.info(
      `Found ${scoredUsers.length} suggested members for team ${team.name} (${teamId}) with keyword matching`
    );

    return scoredUsers;
  }

  /**
   * Generate URL-friendly slug from team name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ============================================
  // AI CONSULTING FIRM FEATURES
  // ============================================

  /**
   * Update consulting firm profile
   */
  async updateConsultingFirmProfile(teamId: string, data: {
    isConsultingFirm?: boolean;
    partnerTier?: string;
    aiSpecializations?: string[];
    techStack?: string[];
    industries?: string[];
    deliveryModels?: string[];
    teamSize?: number;
    foundedYear?: number;
    responseRate?: number;
    officeLocations?: string[];
    certifications?: string[];
    caseStudyUrls?: string[];
    clientTestimonials?: string[];
    pricingModel?: string;
    minProjectBudget?: number;
    avgProjectDuration?: number;
  }) {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        isConsultingFirm: data.isConsultingFirm,
        partnerTier: data.partnerTier,
        aiSpecializations: data.aiSpecializations ? JSON.stringify(data.aiSpecializations) : undefined,
        techStack: data.techStack ? JSON.stringify(data.techStack) : undefined,
        industries: data.industries ? JSON.stringify(data.industries) : undefined,
        deliveryModels: data.deliveryModels ? JSON.stringify(data.deliveryModels) : undefined,
        teamSize: data.teamSize,
        foundedYear: data.foundedYear,
        responseRate: data.responseRate,
        officeLocations: data.officeLocations ? JSON.stringify(data.officeLocations) : undefined,
        certifications: data.certifications ? JSON.stringify(data.certifications) : undefined,
        caseStudyUrls: data.caseStudyUrls ? JSON.stringify(data.caseStudyUrls) : undefined,
        clientTestimonials: data.clientTestimonials ? JSON.stringify(data.clientTestimonials) : undefined,
        pricingModel: data.pricingModel,
        minProjectBudget: data.minProjectBudget,
        avgProjectDuration: data.avgProjectDuration,
      },
      select: {
        id: true,
        name: true,
        isConsultingFirm: true,
        partnerTier: true,
        aiSpecializations: true,
        techStack: true,
        industries: true,
        deliveryModels: true,
        teamSize: true,
        foundedYear: true,
        projectsCompleted: true,
        avgRating: true,
        verificationStatus: true,
      },
    });

    logger.info(`Consulting firm profile updated: ${teamId}`);

    return {
      ...team,
      aiSpecializations: team.aiSpecializations ? JSON.parse(team.aiSpecializations) : [],
      techStack: team.techStack ? JSON.parse(team.techStack) : [],
      industries: team.industries ? JSON.parse(team.industries) : [],
      deliveryModels: team.deliveryModels ? JSON.parse(team.deliveryModels) : [],
    };
  }

  /**
   * Search consulting firms with advanced filters
   */
  async searchConsultingFirms(filters: {
    partnerTier?: string;
    aiSpecializations?: string[];
    techStack?: string[];
    industries?: string[];
    deliveryModels?: string[];
    verificationStatus?: string;
    minTeamSize?: number;
    maxTeamSize?: number;
    minProjectBudget?: number;
    location?: string;
    minRating?: number;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {
      isConsultingFirm: true,
    };

    if (filters.partnerTier) {
      where.partnerTier = filters.partnerTier;
    }

    if (filters.verificationStatus) {
      where.verificationStatus = filters.verificationStatus;
    }

    if (filters.minTeamSize !== undefined || filters.maxTeamSize !== undefined) {
      where.teamSize = {};
      if (filters.minTeamSize !== undefined) {
        where.teamSize.gte = filters.minTeamSize;
      }
      if (filters.maxTeamSize !== undefined) {
        where.teamSize.lte = filters.maxTeamSize;
      }
    }

    if (filters.minProjectBudget !== undefined) {
      where.minProjectBudget = {
        lte: filters.minProjectBudget,
      };
    }

    if (filters.minRating !== undefined) {
      where.avgRating = {
        gte: filters.minRating,
      };
    }

    if (filters.location) {
      where.city = { contains: filters.location };
    }

    // Note: For JSON array filtering (specializations, techStack, etc.),
    // we'll need to do post-query filtering in JavaScript since SQLite
    // doesn't support JSON queries efficiently

    const firms = await prisma.team.findMany({
      where,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        avatar: true,
        city: true,
        isConsultingFirm: true,
        partnerTier: true,
        verificationStatus: true,
        verificationDate: true,
        aiSpecializations: true,
        techStack: true,
        industries: true,
        deliveryModels: true,
        teamSize: true,
        foundedYear: true,
        projectsCompleted: true,
        avgRating: true,
        responseRate: true,
        officeLocations: true,
        certifications: true,
        pricingModel: true,
        minProjectBudget: true,
        avgProjectDuration: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: [
        { verificationStatus: 'desc' },
        { avgRating: 'desc' },
        { projectsCompleted: 'desc' },
      ],
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    // Parse JSON fields and apply client-side filtering
    let filteredFirms = firms.map(firm => ({
      ...firm,
      aiSpecializations: firm.aiSpecializations ? JSON.parse(firm.aiSpecializations) : [],
      techStack: firm.techStack ? JSON.parse(firm.techStack) : [],
      industries: firm.industries ? JSON.parse(firm.industries) : [],
      deliveryModels: firm.deliveryModels ? JSON.parse(firm.deliveryModels) : [],
      officeLocations: firm.officeLocations ? JSON.parse(firm.officeLocations) : [],
      certifications: firm.certifications ? JSON.parse(firm.certifications) : [],
    }));

    // Apply client-side filtering for JSON array fields
    if (filters.aiSpecializations && filters.aiSpecializations.length > 0) {
      filteredFirms = filteredFirms.filter(firm =>
        filters.aiSpecializations!.some(spec => firm.aiSpecializations.includes(spec))
      );
    }

    if (filters.techStack && filters.techStack.length > 0) {
      filteredFirms = filteredFirms.filter(firm =>
        filters.techStack!.some(tech => firm.techStack.includes(tech))
      );
    }

    if (filters.industries && filters.industries.length > 0) {
      filteredFirms = filteredFirms.filter(firm =>
        filters.industries!.some(industry => firm.industries.includes(industry))
      );
    }

    if (filters.deliveryModels && filters.deliveryModels.length > 0) {
      filteredFirms = filteredFirms.filter(firm =>
        filters.deliveryModels!.some(model => firm.deliveryModels.includes(model))
      );
    }

    logger.info(`Found ${filteredFirms.length} consulting firms matching filters`);
    return filteredFirms;
  }

  /**
   * Update consulting firm verification status (admin only)
   */
  async updateFirmVerificationStatus(teamId: string, data: {
    verificationStatus: string;
    verificationData?: any;
    verifiedBy?: string;
  }) {
    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        verificationStatus: data.verificationStatus,
        verificationData: data.verificationData ? JSON.stringify(data.verificationData) : undefined,
        verificationDate: new Date(),
        verifiedBy: data.verifiedBy,
      },
      select: {
        id: true,
        name: true,
        verificationStatus: true,
        verificationDate: true,
        verifiedBy: true,
      },
    });

    logger.info(`Consulting firm verification updated: ${teamId} - ${data.verificationStatus}`);
    return team;
  }

  /**
   * Update consulting firm project stats
   */
  async updateFirmStats(teamId: string, data: {
    projectsCompleted?: number;
    avgRating?: number;
    responseRate?: number;
  }) {
    const team = await prisma.team.update({
      where: { id: teamId },
      data,
      select: {
        id: true,
        name: true,
        projectsCompleted: true,
        avgRating: true,
        responseRate: true,
      },
    });

    logger.info(`Consulting firm stats updated: ${teamId}`);
    return team;
  }

  /**
   * Get consulting firm marketplace stats (admin)
   */
  async getConsultingFirmStats() {
    const stats = await prisma.team.groupBy({
      by: ['verificationStatus', 'partnerTier'],
      _count: true,
      where: {
        isConsultingFirm: true,
      },
    });

    const totalFirms = await prisma.team.count({
      where: { isConsultingFirm: true },
    });

    const verifiedFirms = await prisma.team.count({
      where: {
        isConsultingFirm: true,
        verificationStatus: { in: ['VERIFIED', 'FEATURED'] },
      },
    });

    const avgTeamSize = await prisma.team.aggregate({
      where: { isConsultingFirm: true },
      _avg: {
        teamSize: true,
      },
    });

    const avgProjectsCompleted = await prisma.team.aggregate({
      where: { isConsultingFirm: true },
      _avg: {
        projectsCompleted: true,
      },
    });

    return {
      totalFirms,
      verifiedFirms,
      avgTeamSize: avgTeamSize._avg.teamSize || 0,
      avgProjectsCompleted: avgProjectsCompleted._avg.projectsCompleted || 0,
      breakdown: stats,
    };
  }

  /**
   * Get detailed consulting firm profile with all related data
   */
  async getConsultingFirmProfile(teamId: string) {
    const firm = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                avatar: true,
                jobTitle: true,
                bio: true,
                talentRole: true,
                talentTier: true,
                verificationStatus: true,
              },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        _count: {
          select: {
            members: true,
            subTeams: true,
          },
        },
      },
    });

    if (!firm) {
      throw new Error('Consulting firm not found');
    }

    return {
      ...firm,
      aiSpecializations: firm.aiSpecializations ? JSON.parse(firm.aiSpecializations) : [],
      techStack: firm.techStack ? JSON.parse(firm.techStack) : [],
      industries: firm.industries ? JSON.parse(firm.industries) : [],
      deliveryModels: firm.deliveryModels ? JSON.parse(firm.deliveryModels) : [],
      officeLocations: firm.officeLocations ? JSON.parse(firm.officeLocations) : [],
      certifications: firm.certifications ? JSON.parse(firm.certifications) : [],
      caseStudyUrls: firm.caseStudyUrls ? JSON.parse(firm.caseStudyUrls) : [],
      clientTestimonials: firm.clientTestimonials ? JSON.parse(firm.clientTestimonials) : [],
      verificationData: firm.verificationData ? JSON.parse(firm.verificationData) : {},
    };
  }
}

export const teamService = new TeamService();
