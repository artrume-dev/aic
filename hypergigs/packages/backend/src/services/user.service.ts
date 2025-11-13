import { prisma } from '../lib/prisma.js';
import { logger } from '../utils/logger.js';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  jobTitle?: string;
  location?: string;
  country?: string;
  available?: boolean;
  nextAvailability?: Date;
  avatar?: string;
  hourlyRate?: number;
  currency?: string;
}

export interface SearchUsersFilters {
  role?: string;
  location?: string;
  available?: boolean;
  limit?: number;
  offset?: number;
}

export class UserService {
  /**
   * Get user by ID (public profile view)
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        jobTitle: true,
        location: true,
        country: true,
        avatar: true,
        available: true,
        nextAvailability: true,
        hourlyRate: true,
        currency: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            ownedTeams: true,
            teamMembers: true,
            portfolios: true,
            workExperiences: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        portfolios: {
          orderBy: { createdAt: 'desc' },
          take: 6,
          include: {
            recommendations: {
              where: { status: 'ACCEPTED' },
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    jobTitle: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
            contributors: {
              where: { status: 'ACCEPTED' },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    jobTitle: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        workExperiences: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Parse mediaFiles and createdWith JSON strings to arrays
    const portfoliosWithParsedMedia = user.portfolios.map(portfolio => ({
      ...portfolio,
      mediaFiles: portfolio.mediaFiles ? JSON.parse(portfolio.mediaFiles) : [],
      createdWith: portfolio.createdWith ? JSON.parse(portfolio.createdWith) : [],
    }));

    // Calculate verified badge status
    // User has badge if they have 3+ unique users who gave accepted recommendations (excluding simple likes)
    const uniqueSenders = await prisma.recommendation.findMany({
      where: {
        receiverId: userId,
        status: 'ACCEPTED',
        message: { not: 'Liked this work' },
      },
      select: {
        senderId: true,
      },
      distinct: ['senderId'],
    });

    return {
      ...user,
      portfolios: portfoliosWithParsedMedia,
      hasVerifiedBadge: uniqueSenders.length >= 3,
    };
  }

  /**
   * Get user by username (public profile view)
   */
  async getUserByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        jobTitle: true,
        location: true,
        country: true,
        avatar: true,
        available: true,
        nextAvailability: true,
        hourlyRate: true,
        currency: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            ownedTeams: true,
            teamMembers: true,
            portfolios: true,
            workExperiences: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
        },
        portfolios: {
          orderBy: { createdAt: 'desc' },
          take: 6,
          include: {
            recommendations: {
              where: { status: 'ACCEPTED' },
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    jobTitle: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
            },
            contributors: {
              where: { status: 'ACCEPTED' },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    jobTitle: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        workExperiences: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Parse mediaFiles and createdWith JSON strings to arrays
    const portfoliosWithParsedMedia = user.portfolios.map(portfolio => ({
      ...portfolio,
      mediaFiles: portfolio.mediaFiles ? JSON.parse(portfolio.mediaFiles) : [],
      createdWith: portfolio.createdWith ? JSON.parse(portfolio.createdWith) : [],
    }));

    // Calculate verified badge status
    // User has badge if they have 3+ unique users who gave accepted recommendations (excluding simple likes)
    const uniqueSenders = await prisma.recommendation.findMany({
      where: {
        receiverId: user.id,
        status: 'ACCEPTED',
        message: { not: 'Liked this work' },
      },
      select: {
        senderId: true,
      },
      distinct: ['senderId'],
    });

    return {
      ...user,
      portfolios: portfoliosWithParsedMedia,
      hasVerifiedBadge: uniqueSenders.length >= 3,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileData) {
    // If username is being updated, check uniqueness
    if (data.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: data.username,
          NOT: { id: userId },
        },
      });

      if (existingUser) {
        throw new Error('Username already taken');
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      if (!usernameRegex.test(data.username)) {
        throw new Error('Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        jobTitle: true,
        location: true,
        country: true,
        avatar: true,
        available: true,
        nextAvailability: true,
        hourlyRate: true,
        currency: true,
        updatedAt: true,
      },
    });

    logger.info(`User profile updated: ${userId}`);
    return updatedUser;
  }

  /**
   * Upload/update user avatar
   */
  async updateAvatar(userId: string, avatarUrl: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        avatar: true,
      },
    });

    logger.info(`User avatar updated: ${userId}`);
    return user;
  }

  /**
   * Search users
   */
  async searchUsers(query: string, filters?: SearchUsersFilters) {
    // Note: SQLite doesn't support case-insensitive mode
    // In production (PostgreSQL), add mode: 'insensitive' for case-insensitive search
    const where: any = {
      OR: [
        { firstName: { contains: query } },
        { lastName: { contains: query } },
        { username: { contains: query } },
        { bio: { contains: query } },
      ],
    };

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.location) {
      where.location = { contains: filters.location };
    }

    if (filters?.available !== undefined) {
      where.available = filters.available;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        jobTitle: true,
        location: true,
        avatar: true,
        available: true,
        nextAvailability: true,
        hourlyRate: true,
        _count: {
          select: {
            followers: true,
            teamMembers: true,
          },
        },
        skills: {
          include: {
            skill: true,
          },
          take: 5,
        },
      },
      take: filters?.limit || 20,
      skip: filters?.offset || 0,
      orderBy: { createdAt: 'desc' },
    });

    // Add hasVerifiedBadge to each user
    const usersWithBadge = await Promise.all(
      users.map(async (user) => {
        // Count unique senders who gave accepted recommendations (excluding likes)
        const uniqueSenders = await prisma.recommendation.findMany({
          where: {
            receiverId: user.id,
            status: 'ACCEPTED',
            message: { not: 'Liked this work' },
          },
          select: {
            senderId: true,
          },
          distinct: ['senderId'],
        });

        return {
          ...user,
          hasVerifiedBadge: uniqueSenders.length >= 3,
        };
      })
    );

    return usersWithBadge;
  }

  /**
   * Add skill to user
   */
  async addSkill(userId: string, skillName: string) {
    // Find or create skill
    let skill = await prisma.skill.findUnique({
      where: { name: skillName.toLowerCase() },
    });

    if (!skill) {
      skill = await prisma.skill.create({
        data: { name: skillName.toLowerCase() },
      });
    }

    // Check if user already has this skill
    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId: skill.id,
        },
      },
    });

    if (existingUserSkill) {
      throw new Error('Skill already added');
    }

    // Add skill to user
    const userSkill = await prisma.userSkill.create({
      data: {
        userId,
        skillId: skill.id,
      },
      include: {
        skill: true,
      },
    });

    logger.info(`Skill added to user ${userId}: ${skillName}`);
    return userSkill;
  }

  /**
   * Remove skill from user
   */
  async removeSkill(userId: string, userSkillId: string) {
    // Verify the skill belongs to the user before deleting
    const userSkill = await prisma.userSkill.findFirst({
      where: {
        id: userSkillId,
        userId: userId
      }
    });

    if (!userSkill) {
      throw new Error('Skill not found or unauthorized');
    }

    await prisma.userSkill.delete({
      where: { id: userSkillId }
    });

    logger.info(`Skill removed from user ${userId}: ${userSkillId}`);
    return { success: true };
  }

  /**
   * Add portfolio item
   */
  async addPortfolio(userId: string, data: {
    name: string;
    description?: string;
    companyName?: string;
    role?: string;
    workUrls?: string;
    mediaFiles?: string[];
    createdWith?: string[];
  }) {
    const portfolio = await prisma.portfolio.create({
      data: {
        ...data,
        mediaFiles: data.mediaFiles ? JSON.stringify(data.mediaFiles) : '[]',
        createdWith: data.createdWith ? JSON.stringify(data.createdWith) : '[]',
        userId,
      },
    });

    // Parse mediaFiles and createdWith back to array for response
    const result = {
      ...portfolio,
      mediaFiles: portfolio.mediaFiles ? JSON.parse(portfolio.mediaFiles) : [],
      createdWith: portfolio.createdWith ? JSON.parse(portfolio.createdWith) : [],
    };

    logger.info(`Portfolio item added for user ${userId}`);
    return result;
  }

  /**
   * Update portfolio item
   */
  async updatePortfolio(userId: string, portfolioId: string, data: {
    name?: string;
    description?: string;
    companyName?: string;
    role?: string;
    workUrls?: string;
    mediaFiles?: string[];
    createdWith?: string[];
  }) {
    // Check if portfolio belongs to user
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId,
      },
    });

    if (!portfolio) {
      throw new Error('Portfolio not found or unauthorized');
    }

    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: portfolioId },
      data: {
        ...data,
        mediaFiles: data.mediaFiles ? JSON.stringify(data.mediaFiles) : undefined,
        createdWith: data.createdWith ? JSON.stringify(data.createdWith) : undefined,
      },
    });

    // Parse mediaFiles and createdWith back to array for response
    const result = {
      ...updatedPortfolio,
      mediaFiles: updatedPortfolio.mediaFiles ? JSON.parse(updatedPortfolio.mediaFiles) : [],
      createdWith: updatedPortfolio.createdWith ? JSON.parse(updatedPortfolio.createdWith) : [],
    };

    logger.info(`Portfolio item updated: ${portfolioId}`);
    return result;
  }

  /**
   * Delete portfolio item
   */
  async deletePortfolio(userId: string, portfolioId: string) {
    const portfolio = await prisma.portfolio.findFirst({
      where: {
        id: portfolioId,
        userId,
      },
    });

    if (!portfolio) {
      throw new Error('Portfolio not found or unauthorized');
    }

    await prisma.portfolio.delete({
      where: { id: portfolioId },
    });

    logger.info(`Portfolio item deleted: ${portfolioId}`);
    return { success: true };
  }

  /**
   * Add work experience
   */
  async addWorkExperience(userId: string, data: {
    title: string;
    company: string;
    description?: string;
    startDate: Date;
    endDate?: Date;
    present?: boolean;
  }) {
    const experience = await prisma.workExperience.create({
      data: {
        ...data,
        userId,
        present: data.present || false,
      },
    });

    logger.info(`Work experience added for user ${userId}`);
    return experience;
  }

  /**
   * Update work experience
   */
  async updateWorkExperience(userId: string, experienceId: string, data: {
    title?: string;
    company?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    present?: boolean;
  }) {
    const experience = await prisma.workExperience.findFirst({
      where: {
        id: experienceId,
        userId,
      },
    });

    if (!experience) {
      throw new Error('Work experience not found or unauthorized');
    }

    const updatedExperience = await prisma.workExperience.update({
      where: { id: experienceId },
      data,
    });

    logger.info(`Work experience updated: ${experienceId}`);
    return updatedExperience;
  }

  /**
   * Delete work experience
   */
  async deleteWorkExperience(userId: string, experienceId: string) {
    const experience = await prisma.workExperience.findFirst({
      where: {
        id: experienceId,
        userId,
      },
    });

    if (!experience) {
      throw new Error('Work experience not found or unauthorized');
    }

    await prisma.workExperience.delete({
      where: { id: experienceId },
    });

    logger.info(`Work experience deleted: ${experienceId}`);
    return { success: true };
  }

  /**
   * Get user's portfolio
   */
  async getUserPortfolio(userId: string) {
    return await prisma.portfolio.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get user's work experiences
   */
  async getUserWorkExperiences(userId: string) {
    return await prisma.workExperience.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  // ============================================
  // AI CONSULTING MARKETPLACE FEATURES
  // ============================================

  /**
   * Update AI talent marketplace profile
   */
  async updateTalentProfile(userId: string, data: {
    isAITalent?: boolean;
    talentRole?: string;
    talentTier?: string;
    employmentPreference?: string;
    timezone?: string;
    githubUrl?: string;
    hourlyRateMax?: number;
    availabilityStatus?: string;
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        isAITalent: true,
        talentRole: true,
        talentTier: true,
        employmentPreference: true,
        timezone: true,
        githubUrl: true,
        hourlyRate: true,
        hourlyRateMax: true,
        availabilityStatus: true,
      },
    });

    logger.info(`AI talent profile updated: ${userId}`);
    return user;
  }

  /**
   * Search AI talent with advanced filters
   */
  async searchAITalent(filters: {
    talentRole?: string;
    talentTier?: string;
    employmentPreference?: string;
    verificationStatus?: string;
    verificationTier?: string;
    availabilityStatus?: string;
    skills?: string[]; // Array of skill IDs or names
    minHourlyRate?: number;
    maxHourlyRate?: number;
    timezone?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {
      isAITalent: true,
    };

    if (filters.talentRole) {
      where.talentRole = filters.talentRole;
    }

    if (filters.talentTier) {
      where.talentTier = filters.talentTier;
    }

    if (filters.employmentPreference) {
      where.employmentPreference = filters.employmentPreference;
    }

    if (filters.verificationStatus) {
      where.verificationStatus = filters.verificationStatus;
    }

    if (filters.verificationTier) {
      where.verificationTier = filters.verificationTier;
    }

    if (filters.availabilityStatus) {
      where.availabilityStatus = filters.availabilityStatus;
    }

    if (filters.timezone) {
      where.timezone = { contains: filters.timezone };
    }

    if (filters.minHourlyRate !== undefined || filters.maxHourlyRate !== undefined) {
      where.hourlyRate = {};
      if (filters.minHourlyRate !== undefined) {
        where.hourlyRate.gte = filters.minHourlyRate;
      }
      if (filters.maxHourlyRate !== undefined) {
        where.hourlyRate.lte = filters.maxHourlyRate;
      }
    }

    // Filter by skills if provided
    if (filters.skills && filters.skills.length > 0) {
      where.skills = {
        some: {
          OR: [
            { skillId: { in: filters.skills } },
            { skill: { name: { in: filters.skills } } },
          ],
        },
      };
    }

    const talent = await prisma.user.findMany({
      where,
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        jobTitle: true,
        location: true,
        timezone: true,
        talentRole: true,
        talentTier: true,
        employmentPreference: true,
        hourlyRate: true,
        hourlyRateMax: true,
        currency: true,
        availabilityStatus: true,
        verificationStatus: true,
        verificationTier: true,
        aiSkillScore: true,
        portfolioScore: true,
        experienceScore: true,
        overallScore: true,
        githubUrl: true,
        skills: {
          include: {
            skill: true,
          },
          take: 10,
        },
        _count: {
          select: {
            portfolios: true,
            workExperiences: true,
          },
        },
      },
      orderBy: [
        { verificationStatus: 'desc' },
        { overallScore: 'desc' },
      ],
      take: filters.limit || 20,
      skip: filters.offset || 0,
    });

    logger.info(`Found ${talent.length} AI talent matching filters`);
    return talent;
  }

  /**
   * Update user verification status (admin only)
   */
  async updateVerificationStatus(userId: string, data: {
    verificationStatus: string;
    verificationTier?: string;
    verificationData?: any;
    verifiedBy?: string;
    aiSkillScore?: number;
    portfolioScore?: number;
    experienceScore?: number;
    overallScore?: number;
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: data.verificationStatus,
        verificationTier: data.verificationTier,
        verificationData: data.verificationData ? JSON.stringify(data.verificationData) : undefined,
        verificationDate: new Date(),
        verifiedBy: data.verifiedBy,
        aiSkillScore: data.aiSkillScore,
        portfolioScore: data.portfolioScore,
        experienceScore: data.experienceScore,
        overallScore: data.overallScore,
      },
      select: {
        id: true,
        verificationStatus: true,
        verificationTier: true,
        verificationDate: true,
        verifiedBy: true,
        aiSkillScore: true,
        portfolioScore: true,
        experienceScore: true,
        overallScore: true,
      },
    });

    logger.info(`User verification updated: ${userId} - ${data.verificationStatus}`);
    return user;
  }

  /**
   * Get verification data for a user
   */
  async getVerificationData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        verificationStatus: true,
        verificationTier: true,
        verificationData: true,
        verificationDate: true,
        verifiedBy: true,
        aiSkillScore: true,
        portfolioScore: true,
        experienceScore: true,
        overallScore: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user,
      verificationData: user.verificationData ? JSON.parse(user.verificationData) : {},
    };
  }

  /**
   * Update AI skill scores (for verification system)
   */
  async updateSkillScores(userId: string, scores: {
    aiSkillScore?: number;
    portfolioScore?: number;
    experienceScore?: number;
  }) {
    // Calculate overall score as weighted average
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        aiSkillScore: true,
        portfolioScore: true,
        experienceScore: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const aiSkillScore = scores.aiSkillScore ?? user.aiSkillScore ?? 0;
    const portfolioScore = scores.portfolioScore ?? user.portfolioScore ?? 0;
    const experienceScore = scores.experienceScore ?? user.experienceScore ?? 0;

    // Weighted average: 40% skills, 35% portfolio, 25% experience
    const overallScore = Math.round(
      aiSkillScore * 0.4 + portfolioScore * 0.35 + experienceScore * 0.25
    );

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        aiSkillScore,
        portfolioScore,
        experienceScore,
        overallScore,
      },
      select: {
        id: true,
        aiSkillScore: true,
        portfolioScore: true,
        experienceScore: true,
        overallScore: true,
      },
    });

    logger.info(`User skill scores updated: ${userId} - Overall: ${overallScore}`);
    return updatedUser;
  }

  /**
   * Update user availability status
   */
  async updateAvailabilityStatus(userId: string, status: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { availabilityStatus: status },
      select: {
        id: true,
        availabilityStatus: true,
      },
    });

    logger.info(`User availability updated: ${userId} - ${status}`);
    return user;
  }

  /**
   * Get talent marketplace stats (admin)
   */
  async getTalentStats() {
    const stats = await prisma.user.groupBy({
      by: ['verificationStatus', 'talentTier', 'talentRole'],
      _count: true,
      where: {
        isAITalent: true,
      },
    });

    const totalTalent = await prisma.user.count({
      where: { isAITalent: true },
    });

    const verifiedTalent = await prisma.user.count({
      where: {
        isAITalent: true,
        verificationStatus: { in: ['VERIFIED', 'FEATURED'] },
      },
    });

    const availableTalent = await prisma.user.count({
      where: {
        isAITalent: true,
        availabilityStatus: 'AVAILABLE',
      },
    });

    return {
      totalTalent,
      verifiedTalent,
      availableTalent,
      breakdown: stats,
    };
  }
}

export const userService = new UserService();
