# Consulting Firm Validation Workflow

## Overview

This document describes the complete workflow for AI consulting firms to register, get validated, and become visible on the HyperGigs marketplace.

## Current Implementation Status

### ✅ Completed Features
1. **Team Registration as Consulting Firm**
   - Teams can register as AI consulting firms via Team Settings
   - Consulting firm profile includes:
     - AI Specializations
     - Tech Stack
     - Industries Served
     - Delivery Models
     - Team Size
     - Founded Year
     - Minimum Project Budget

2. **Data Persistence**
   - All consulting firm fields are properly saved to the database
   - JSON arrays (specializations, tech stack, industries, delivery models) are correctly serialized/deserialized
   - Field name consistency fixed (`minProjectBudget` throughout)

3. **Display on Team Cards**
   - Consulting firm badge shown on team cards
   - AI Specializations displayed (first 3 with "+X more" indicator)
   - Partner Tier badge (when assigned)
   - Verification badge (when verified)

### 🔄 In Progress / To Be Implemented
1. **Admin Validation System**
   - Super admin role and permissions
   - Validation request notifications
   - Verification workflow

2. **Verification Statuses**
   - UNVERIFIED (default)
   - PENDING_VERIFICATION
   - VERIFIED
   - FEATURED
   - REJECTED

## Consulting Firm Registration Flow

### Step 1: User Creates Team
1. User signs up/logs in to HyperGigs
2. Creates a team (Company, Organization, or Team)
3. User becomes team owner automatically

### Step 2: Register as Consulting Firm
1. Navigate to Team Settings (`/teams/{slug}/settings`)
2. Under "Basic Info" tab, check **"Register as AI Consulting Firm"**
3. Switch to "Consulting Firm Profile" tab
4. Fill in consulting firm details:
   - **AI Specializations** (e.g., LLM Integration, Computer Vision)
   - **Tech Stack** (e.g., PyTorch, TensorFlow, LangChain)
   - **Industries Served** (e.g., Healthcare, Finance)
   - **Delivery Models** (Fixed Price, Time & Materials, etc.)
   - **Team Size** (number of consultants)
   - **Founded Year**
   - **Minimum Project Budget**
5. Click "Save Changes"

### Step 3: Data Saved
- All consulting firm data is saved to the `Team` table
- Arrays are JSON-stringified in the database
- `isConsultingFirm` flag is set to `true`
- `verificationStatus` defaults to `UNVERIFIED`

### Step 4: Display on Marketplace
- Team appears in Teams page (`/teams`)
- Shows "AI Consulting Firm" badge
- Displays AI Specializations
- Can be filtered using "AI Consulting Firms" quick filter

## Admin Validation Workflow (To Be Implemented)

### Prerequisites
You will need to set up a super admin account to validate consulting firms.

### Setting Up Super Admin Account

#### Option 1: Direct Database Update
```sql
UPDATE User
SET role = 'SUPER_ADMIN'
WHERE email = 'your-admin-email@example.com';
```

#### Option 2: Seed Script (Recommended)
Create a seed script in `packages/backend/prisma/seed-admin.ts`:

```typescript
import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'admin@hypergigs.com';
  const adminPassword = 'SecurePassword123!'; // Change this!

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      username: 'hypergigs-admin',
      firstName: 'HyperGigs',
      lastName: 'Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      available: false,
    },
  });

  console.log('✅ Super admin created:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run: `npm run seed:admin` (after adding script to package.json)

### Validation Process

#### 1. Consulting Firm Submits Request
**Current State:** Automatic on saving consulting firm profile
**Future Enhancement:** Add explicit "Submit for Verification" button

When a team saves consulting firm info with `isConsultingFirm = true`:
- System should create a notification for admins
- Set `verificationStatus` to `PENDING_VERIFICATION`
- Record submission timestamp

#### 2. Admin Receives Notification
Admins should see:
- Dashboard showing pending verification requests
- Notification badge count
- List of firms awaiting verification

#### 3. Admin Reviews Firm
Admin reviews:
- Company information
- AI Specializations and Tech Stack
- Industries and Delivery Models
- Website and LinkedIn presence
- Portfolio/case studies (if provided)
- Team size claims
- Founded year

#### 4. Admin Makes Decision

**Option A: Approve & Verify**
```typescript
await teamService.updateFirmVerificationStatus(teamId, {
  verificationStatus: 'VERIFIED',
  verifiedBy: adminUserId,
  verificationData: {
    verifiedAt: new Date(),
    verificationNotes: 'Verified through LinkedIn and website',
    verifiedBy: adminUserId,
  },
});
```

**Option B: Feature as Premier Partner**
```typescript
await teamService.updateFirmVerificationStatus(teamId, {
  verificationStatus: 'FEATURED',
  verifiedBy: adminUserId,
});

await teamService.updateConsultingFirmProfile(teamId, {
  partnerTier: 'PREMIER', // or ENTERPRISE
});
```

**Option C: Reject**
```typescript
await teamService.updateFirmVerificationStatus(teamId, {
  verificationStatus: 'REJECTED',
  verifiedBy: adminUserId,
  verificationData: {
    rejectionReason: 'Insufficient information provided',
    rejectedAt: new Date(),
  },
});
```

#### 5. Firm Owner Receives Notification
- Email notification of verification status
- In-app notification
- Updated badge on team profile

## Database Schema

### Team Table (Consulting Firm Fields)

```prisma
model Team {
  // ... basic fields ...

  // Consulting Firm Fields
  isConsultingFirm  Boolean  @default(false)
  partnerTier       String?  // EMERGING, ESTABLISHED, PREMIER, ENTERPRISE
  verificationStatus String? @default("UNVERIFIED")
  verificationDate  DateTime?
  verificationData  String?  // JSON
  verifiedBy        String?  // User ID of admin

  aiSpecializations String?  // JSON array
  techStack         String?  // JSON array
  industries        String?  // JSON array
  deliveryModels    String?  // JSON array

  teamSize          Int?
  foundedYear       Int?
  minProjectBudget  Int?

  projectsCompleted Int      @default(0)
  avgRating         Float?
  responseRate      Float?

  officeLocations   String?  // JSON array
  certifications    String?  // JSON array
  caseStudyUrls     String?  // JSON array
  clientTestimonials String? // JSON array
  pricingModel      String?
  avgProjectDuration Int?
}
```

## API Endpoints

### For Consulting Firms

#### Update Consulting Firm Profile
```typescript
PUT /api/teams/:teamId
Body: {
  isConsultingFirm: true,
  aiSpecializations: ["LLM Integration", "Computer Vision"],
  techStack: ["PyTorch", "TensorFlow"],
  industries: ["Healthcare", "Finance"],
  deliveryModels: ["FIXED_PRICE", "TIME_AND_MATERIALS"],
  teamSize: 25,
  foundedYear: 2020,
  minProjectBudget: 50000
}
```

### For Admins (To Be Implemented)

#### Get Pending Verifications
```typescript
GET /api/admin/consulting-firms/pending
Response: {
  firms: [
    {
      id: "...",
      name: "AI Consulting Co",
      verificationStatus: "PENDING_VERIFICATION",
      submittedAt: "2025-01-15T10:00:00Z",
      // ... firm details ...
    }
  ]
}
```

#### Verify Consulting Firm
```typescript
POST /api/admin/consulting-firms/:teamId/verify
Body: {
  verificationStatus: "VERIFIED",
  verificationNotes: "Verified through LinkedIn",
  partnerTier: "ESTABLISHED" // Optional
}
```

#### Reject Consulting Firm
```typescript
POST /api/admin/consulting-firms/:teamId/reject
Body: {
  rejectionReason: "Insufficient information"
}
```

## Frontend Routes

### User Routes
- `/teams` - Browse all teams (with consulting firm filter)
- `/teams/:slug` - View team profile
- `/teams/:slug/settings` - Edit team & consulting firm settings

### Admin Routes (To Be Implemented)
- `/admin/dashboard` - Admin dashboard
- `/admin/consulting-firms` - Manage consulting firms
- `/admin/consulting-firms/:id` - Review specific firm

## Testing the Workflow

### Manual Testing Steps

1. **Create Test Account**
   ```
   Email: test-firm@example.com
   Username: test-firm
   Password: TestPassword123!
   ```

2. **Create Team**
   - Name: "QuantumAI Consulting"
   - Type: COMPANY
   - Location: "San Francisco"

3. **Register as Consulting Firm**
   - Go to Team Settings
   - Check "Register as AI Consulting Firm"
   - Select AI Specializations:
     - LLM Integration
     - Computer Vision
     - Natural Language Processing
   - Select Tech Stack:
     - PyTorch
     - TensorFlow
     - LangChain
   - Select Industries:
     - Healthcare
     - Finance & Banking
   - Select Delivery Models:
     - Fixed Price
     - Time & Materials
   - Team Size: 15
   - Founded Year: 2020
   - Min Project Budget: $50,000
   - Save Changes

4. **Verify Data Persists**
   - Refresh the page
   - Check that checkbox remains checked
   - Check that Consulting Firm Profile tab shows all data
   - Go to `/teams` page
   - Verify team shows "AI Consulting Firm" badge
   - Verify AI Specializations are displayed

5. **Create Super Admin**
   - Create seed script or update database directly
   - Log in as super admin

6. **Verify Firm (When Admin Panel is Ready)**
   - View pending verifications
   - Review firm details
   - Approve or reject

## Next Steps

### Phase 1: Admin Panel (Immediate)
- [ ] Create admin middleware for route protection
- [ ] Build admin dashboard
- [ ] Implement pending verifications list
- [ ] Add verification/rejection actions
- [ ] Create notification system

### Phase 2: Enhanced Validation (Short-term)
- [ ] Add "Submit for Verification" explicit button
- [ ] Email notifications for status changes
- [ ] In-app notifications
- [ ] Verification badge components
- [ ] Admin notes/comments system

### Phase 3: Advanced Features (Long-term)
- [ ] Automated verification checks (LinkedIn, website)
- [ ] Portfolio/case study uploads
- [ ] Client testimonial system
- [ ] Rating and review system
- [ ] Engagement metrics tracking
- [ ] Featured/promoted listings

## Questions & Answers

### Q: Do I need a super admin account to test validation?
**A:** Yes. The validation workflow requires an admin account with `role = 'SUPER_ADMIN'` to approve/reject consulting firms.

### Q: Can regular users see unverified consulting firms?
**A:** Currently yes. All consulting firms appear in the marketplace. You may want to filter by verification status in the future.

### Q: What happens if a firm is rejected?
**A:** They remain in the system but with `verificationStatus = 'REJECTED'`. You can hide rejected firms from public listings or allow them to resubmit.

### Q: How do we prevent fake consulting firms?
**A:** The admin validation process is the primary safeguard. Additional measures:
- Email domain verification
- LinkedIn profile verification
- Website existence checks
- Manual review of portfolio/case studies

### Q: Can a verified firm lose verification?
**A:** Yes. Admins can update verification status at any time if issues are discovered.

## Support & Development

For issues or questions:
- Check the backend service: `packages/backend/src/services/team.service.ts`
- Check the frontend types: `packages/frontend/src/types/team.ts`
- Review the database schema: `packages/backend/prisma/schema.prisma`
