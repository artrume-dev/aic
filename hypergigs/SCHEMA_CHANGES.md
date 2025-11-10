# Database Schema Changes for AI Consulting Marketplace
## Phase 1: Foundation Updates

**Date:** 2025-11-10
**Status:** ✅ Completed - Schema Updated (Migration Pending)

---

## Summary

Updated the Prisma schema to transform HyperGigs from a generic freelance platform to an AI-focused consulting marketplace. Added comprehensive verification system, talent marketplace features, consulting firm capabilities, and payment/commission tracking.

---

## Changes by Model

### 1. User Model - ENHANCED ✨

**Added Fields:**

#### AI Talent Marketplace
- `isAITalent` (Boolean) - Flag for talent marketplace participation
- `talentRole` (String) - Role type (ML_ENGINEER, DATA_SCIENTIST, LLM_ENGINEER, etc.)
- `talentTier` (String) - Tier level (JUNIOR, MID, SENIOR, EXPERT, PRINCIPAL)
- `employmentPreference` (String) - Preferred employment type (CONTRACT, TEMP_TO_PERM, PERMANENT, ANY)
- `timezone` (String) - For remote work coordination
- `githubUrl` (String) - GitHub profile link
- `hourlyRateMax` (Float) - Maximum hourly rate (for range)

#### Verification System
- `verificationStatus` (String) - Verification state (UNVERIFIED, PENDING, UNDER_REVIEW, VERIFIED, VERIFIED_EXPERT, REJECTED)
- `verificationTier` (String) - Assigned tier after verification
- `verificationData` (JSON String) - AI analysis results and scores
- `verificationDate` (DateTime) - When verified
- `verifiedBy` (String) - Admin user ID who approved

#### AI Skill Scores
- `aiSkillScore` (Int 0-100) - AI-calculated skill proficiency
- `portfolioScore` (Int 0-100) - AI-evaluated portfolio quality
- `experienceScore` (Int 0-100) - AI-validated experience
- `overallScore` (Int 0-100) - Weighted average score

#### Availability
- `availabilityStatus` (String) - Current status (AVAILABLE, BUSY, NOT_LOOKING)

**New Indexes:**
- `verificationStatus`
- `talentTier`
- `isAITalent`
- `availabilityStatus`

---

### 2. Team Model - ENHANCED ✨

**Added Fields:**

#### Basic Info
- `country` (String) - Country location
- `website` (String) - Company website

#### Consulting Partner System
- `isConsultingFirm` (Boolean) - Flag for AI consulting firms
- `partnerTier` (String) - Tier (EMERGING, ESTABLISHED, PREMIER, ENTERPRISE)
- `verificationStatus` (String) - Same as User
- `verificationData` (JSON String) - Verification details
- `verificationDate` (DateTime)
- `verifiedBy` (String) - Admin ID

#### AI Specializations
- `aiSpecializations` (JSON Array) - ["LLM_INTEGRATION", "COMPUTER_VISION", etc.]
- `techStack` (JSON Array) - ["PyTorch", "TensorFlow", etc.]
- `industries` (JSON Array) - ["Healthcare", "Finance", etc.]

#### Delivery Models
- `deliveryModels` (JSON Array) - ["ONSITE", "NEARSHORE", "OFFSHORE", "HYBRID"]
- `primaryLocation` (String) - Main office
- `officeLocations` (JSON Array) - Multiple locations

#### Team Statistics
- `teamSize` (Int) - Number of consultants
- `foundedYear` (Int)
- `projectsCompleted` (Int) - Default 0
- `avgRating` (Float) - Average client rating
- `responseRate` (Float) - Response rate percentage

#### Pricing
- `pricingModel` (String) - FIXED_PRICE, TIME_MATERIAL, STAFF_AUG, MANAGED_SERVICES, HYBRID
- `minProjectBudget` (Int)
- `currency` (String) - Default USD

**Updated:**
- `type` comment now includes AI types: AI_CONSULTING_FIRM, AI_STUDIO, ML_AGENCY, DATA_SCIENCE_FIRM, AI_RESEARCH_LAB

**New Indexes:**
- `isConsultingFirm`
- `partnerTier`
- `verificationStatus`

---

### 3. TeamMember Model - ENHANCED ✨

**Added Fields:**

#### Consulting Roles
- `consultingRole` (String) - Consulting hierarchy role (SENIOR_PARTNER, PARTNER, ENGAGEMENT_MANAGER, SENIOR_ML_ENGINEER, ML_ENGINEER, etc.)
- `hourlyRate` (Float) - Member's billable rate
- `billable` (Boolean) - Is member billable to clients (default: true)

**New Indexes:**
- `consultingRole`

---

### 4. Skill Model - ENHANCED ✨

**Added Fields:**
- `category` (String) - AI_SPECIALIZATION, TECH_STACK, SOFT_SKILL, INDUSTRY
- `subcategory` (String) - For AI_SPECIALIZATION: LLM, COMPUTER_VISION, NLP, MLOPS
- `description` (String) - Brief skill description
- `isAISkill` (Boolean) - Flag for AI/ML skills

**New Indexes:**
- `category`
- `isAISkill`

---

### 5. UserSkill Model - ENHANCED ✨

**Added Fields:**

#### Proficiency & Verification
- `proficiency` (String) - BEGINNER, INTERMEDIATE, ADVANCED, EXPERT (default: INTERMEDIATE)
- `yearsOfExperience` (Int) - Years with this skill
- `verified` (Boolean) - AI verified this skill (default: false)
- `verificationScore` (Int 0-100) - AI confidence in skill claim
- `lastUsed` (DateTime) - When skill was last used

**New Indexes:**
- `proficiency`
- `verified`

---

### 6. JobPosting Model - ENHANCED ✨

**Added Fields:**

#### Talent Marketplace
- `jobCategory` (String) - REGULAR or TALENT_HIRE (default: REGULAR)
- `talentRole` (String) - Role type for talent hires
- `employmentType` (String) - CONTRACT, TEMP_TO_PERM, PERMANENT
- `requiredTier` (String) - Minimum tier required
- `requiredSkills` (JSON Array) - Required skills list
- `duration` (String) - Duration for contracts (e.g., "3 months")
- `startDate` (DateTime) - Desired start date
- `hourlyRateMin` (Float) - Min hourly rate for talent
- `hourlyRateMax` (Float) - Max hourly rate for talent

**New Indexes:**
- `jobCategory`
- `talentRole`
- `employmentType`

---

### 7. JobApplication Model - ENHANCED ✨

**Added Fields:**

#### Talent Hire Workflow
- `proposedRate` (Float) - Talent's proposed hourly rate
- `availability` (String) - Talent's availability
- `interviewDate` (DateTime) - Scheduled interview
- `hiredDate` (DateTime) - Date when hired
- `contractUrl` (String) - Generated contract URL
- `commissionAmount` (Float) - Platform commission
- `commissionPaid` (Boolean) - Commission payment status (default: false)

**Updated:**
- `status` now includes: HIRED (in addition to PENDING, REVIEWING, ACCEPTED, REJECTED)

**New Indexes:**
- `hiredDate`

---

### 8. Education Model - NEW 🆕

Complete new model for tracking user education.

**Fields:**
- `id` (UUID)
- `userId` (String) - Foreign key
- `institution` (String) - University/school name
- `degree` (String) - BS, MS, PhD, Certificate
- `fieldOfStudy` (String) - Computer Science, Machine Learning, etc.
- `startDate` (DateTime)
- `endDate` (DateTime)
- `present` (Boolean) - Currently studying (default: false)
- `gpa` (Float)
- `description` (String)
- `verified` (Boolean) - AI or admin verified (default: false)
- `createdAt`, `updatedAt` (DateTime)

**Indexes:**
- `userId`

---

### 9. Engagement Model - NEW 🆕

Tracks consulting projects with clients (separate from generic Project model).

**Fields:**

#### Basic Info
- `id` (UUID)
- `title` (String)
- `description` (String)
- `clientName` (String) - Can be anonymous
- `consultingFirmId` (String) - The consulting firm (Team)
- `clientId` (String) - Optional: If client is on platform
- `status` (String) - PROPOSAL, ACTIVE, COMPLETED, CANCELLED (default: PROPOSAL)

#### Pricing
- `pricingModel` (String) - FIXED_PRICE, TIME_MATERIAL, STAFF_AUG, MANAGED_SERVICES
- `totalValue` (Float) - Total project value
- `currency` (String) - Default USD

#### Delivery
- `deliveryModel` (String) - ONSITE, NEARSHORE, OFFSHORE, HYBRID
- `startDate`, `endDate` (DateTime)
- `duration` (Int) - In weeks

#### Platform Fees
- `platformFeePercent` (Float) - Default 22.5%
- `platformFeeAmount` (Float)
- `platformFeePaid` (Boolean) - Default false

#### Milestones
- `milestones` (JSON Array) - Milestone tracking

**Indexes:**
- `consultingFirmId`
- `clientId`
- `status`
- `createdAt`

---

### 10. Transaction Model - NEW 🆕

Tracks all payments, commissions, and platform fees.

**Fields:**

#### Classification
- `id` (UUID)
- `type` (String) - CONSULTING_PROJECT, TALENT_PLACEMENT, SUBSCRIPTION, FEATURED_LISTING
- `category` (String) - PLATFORM_FEE, PAYOUT, SUBSCRIPTION_PAYMENT, REFUND

#### Parties
- `payerId` (String) - User or Team paying
- `payeeId` (String) - User or Team receiving

#### Amounts
- `amount` (Float) - Total amount
- `currency` (String) - Default USD
- `platformFee` (Float) - Platform's commission
- `payoutAmount` (Float) - Amount after platform fee

#### Context
- `engagementId` (String) - Link to Engagement
- `jobApplicationId` (String) - Link to JobApplication

#### Payment Details
- `paymentMethod` (String) - STRIPE, BANK_TRANSFER, CREDIT_CARD
- `stripePaymentId` (String) - Stripe payment intent ID
- `status` (String) - PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED (default: PENDING)

#### Metadata
- `description` (String)
- `metadata` (JSON) - Additional data
- `createdAt`, `updatedAt`, `completedAt` (DateTime)

**Indexes:**
- `payerId`, `payeeId`
- `type`, `category`, `status`
- `engagementId`, `jobApplicationId`
- `createdAt`

---

### 11. Subscription Model - NEW 🆕

Tracks subscription plans for firms and users.

**Fields:**

#### Subscriber
- `id` (UUID)
- `subscriberId` (String) - User or Team ID
- `subscriberType` (String) - USER or TEAM

#### Plan Details
- `plan` (String) - BASIC, PRO, ENTERPRISE
- `status` (String) - ACTIVE, CANCELLED, EXPIRED, PAST_DUE (default: ACTIVE)

#### Pricing
- `amount` (Float)
- `currency` (String) - Default USD
- `interval` (String) - MONTH, YEAR (default: MONTH)

#### Stripe Integration
- `stripeSubscriptionId` (String)
- `stripeCustomerId` (String)

#### Dates
- `currentPeriodStart`, `currentPeriodEnd` (DateTime)
- `cancelAt`, `cancelledAt` (DateTime)
- `createdAt`, `updatedAt` (DateTime)

**Indexes:**
- `subscriberId`, `subscriberType`
- `status`, `plan`

---

## Migration Status

**✅ Schema Updated**
**⏳ Migration Pending** - Run `prisma migrate dev` to apply changes

### Migration Command

```bash
cd packages/backend
npx prisma migrate dev --name add_ai_consulting_marketplace_features
```

This will:
1. Generate migration SQL
2. Apply changes to database
3. Regenerate Prisma Client with new types

---

## Next Steps

1. **Run Migration** ✅ Apply schema changes
2. **AI Skills Taxonomy** - Create seed data for AI skills
3. **Update TypeScript Types** - Update frontend/backend types
4. **Data Migration Scripts** - Migrate existing data to new fields
5. **Update API Controllers** - Add endpoints for new features
6. **Update UI Components** - Add forms for new fields

---

## Breaking Changes

### ⚠️ Minimal Breaking Changes

All new fields are **optional** or have **default values**, so existing code will continue to work. However:

1. **User.role** - Still defaults to "FREELANCER", but now supports:
   - FREELANCER (existing)
   - AI_TALENT (new)
   - FIRM_MEMBER (new)
   - ADMIN (new)

2. **Team.type** - Still defaults to "TEAM", but now supports AI types:
   - TEAM, COMPANY, ORGANIZATION, DEPARTMENT (existing)
   - AI_CONSULTING_FIRM, AI_STUDIO, ML_AGENCY, DATA_SCIENCE_FIRM, AI_RESEARCH_LAB (new)

3. **Verification fields** - All default to UNVERIFIED, so existing users won't be affected

4. **New models** - Education, Engagement, Transaction, Subscription are completely new, no breaking changes

---

## Database Size Impact

**Estimated size increase:**
- User table: ~15 new columns (mostly nullable)
- Team table: ~20 new columns (mostly nullable)
- 4 new tables (Education, Engagement, Transaction, Subscription)

**Performance:**
- Added 15+ indexes for query optimization
- JSON fields for flexible data (specializations, tech stack, milestones)
- No expected performance degradation due to optional fields

---

## Rollback Plan

If issues occur:

```bash
# Rollback to previous migration
cd packages/backend
npx prisma migrate resolve --rolled-back <migration_name>

# Or restore from backup
# (Always backup database before migration!)
```

---

## Notes

- **JSON Fields:** Using JSON strings for arrays (SQLite compatibility). Will work with PostgreSQL in production.
- **Indexes:** Strategic indexes added for common queries (verification status, talent tier, job category, etc.)
- **Default Values:** All new fields have sensible defaults to prevent breaking existing code
- **Nullable Fields:** Most new fields are nullable for backward compatibility

---

**Status:** Ready for Migration ✅
**Risk Level:** Low (all changes are additive with defaults)
**Next Task:** Run Prisma migration and update TypeScript types
