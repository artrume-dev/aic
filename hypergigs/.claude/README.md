# Claude Code Configuration for HyperGigs

This directory contains configuration files for Claude Code sub-agents and commands.

## 📁 Structure

```
.claude/
├── README.md                    # This file
├── PROJECT-SUMMARY.md           # Comprehensive project documentation
├── ui-agent.md                  # UI/Frontend agent configuration
├── backend-agent.md             # Backend/API agent configuration
├── code-validator-agent.md      # Enterprise code quality agent
├── security-auditor-agent.md    # Security vulnerability agent
└── agents/
    ├── ui.md                    # /ui slash command
    ├── backend.md               # /backend slash command
    ├── code-validator.md        # /code-validator slash command
    └── security-auditor.md      # /security-auditor slash command
```

## 🎯 Available Sub-Agents

### 1. UI Agent (`ui-agent.md`)
**Purpose:** Frontend/UI development specialist

**Expertise:**
- React component development (TypeScript + React 19)
- Tailwind CSS + shadcn/ui styling
- Forms (React Hook Form + Zod)
- State management (Zustand)
- Animations (Framer Motion)
- Responsive design & accessibility
- User experience optimization

**Invoke with:** `/ui`

**Example usage:**
```
/ui Create a new Settings page with tabs for Profile, Notifications, and Privacy
/ui Add a dark mode toggle to the navigation component
/ui Implement a loading skeleton for the freelancers page
/ui Create a modal dialog for confirming portfolio deletion
```

### 2. Backend Agent (`backend-agent.md`)
**Purpose:** Backend/API development specialist

**Expertise:**
- Express.js API development (TypeScript + Express 4)
- Prisma ORM & database management
- RESTful API design
- JWT authentication & authorization
- Service layer business logic
- Database migrations & schema design
- Request validation (express-validator)
- Error handling & security

**Invoke with:** `/backend`

**Example usage:**
```
/backend Create a new API endpoint for user notifications
/backend Add a Comment model to the database with relations to User and Post
/backend Implement pagination for the teams listing endpoint
/backend Add validation for the portfolio creation endpoint
/backend Create a service method to calculate user engagement metrics
```

### 3. Code Validator Agent (`code-validator-agent.md`)
**Purpose:** Enterprise-level code quality validation

**Expertise:**
- SOLID principles and design patterns
- Code complexity and maintainability analysis
- Type safety enforcement (strict TypeScript)
- Error handling and logging validation
- Architecture and design pattern review
- Performance optimization and scalability
- Testing coverage and quality assessment
- Documentation completeness verification

**Invoke with:** `/code-validator`

**Example usage:**
```
/code-validator Review the user authentication module for code quality
/code-validator Validate the new payment processing feature
/code-validator Check if the API endpoints follow enterprise standards
/code-validator Analyze the React components for best practices
```

### 4. Security Auditor Agent (`security-auditor-agent.md`)
**Purpose:** Security vulnerability detection and prevention

**Expertise:**
- OWASP Top 10 vulnerability detection
- Authentication and authorization security
- Input validation and sanitization
- SQL injection and XSS prevention
- JWT token and session security
- API security (CORS, rate limiting, headers)
- Secrets management and encryption
- Dependency vulnerability scanning
- Secure coding practices

**Invoke with:** `/security-auditor`

**Example usage:**
```
/security-auditor Audit the authentication system for vulnerabilities
/security-auditor Check the API endpoints for security issues
/security-auditor Review the file upload feature for security risks
/security-auditor Scan the entire backend for OWASP Top 10 vulnerabilities
```

## 📚 Key Documentation Files

### PROJECT-SUMMARY.md
**Purpose:** Complete codebase understanding for all agents

**Contents:**
- Project overview and architecture
- Technology stack details
- Database schema documentation
- API endpoints reference
- Frontend/backend structure
- Development guidelines
- Deployment information
- Common patterns and best practices

**When to read:**
- Before starting any new feature
- When understanding project context
- When looking for existing patterns
- When debugging complex issues

### ui-agent.md
**Purpose:** Detailed guidelines for UI development

**Contents:**
- React component patterns
- Styling conventions (Tailwind CSS)
- Form handling patterns
- State management examples
- Animation patterns
- Accessibility guidelines
- Performance optimization
- Testing guidelines
- Common UI tasks

**When to read:**
- Before creating new components
- When styling components
- When implementing forms
- When adding animations
- When ensuring accessibility

### code-validator-agent.md
**Purpose:** Enterprise code quality standards and validation

**Contents:**
- SOLID principles with examples
- Code complexity metrics
- Type safety standards
- Error handling patterns
- Database optimization
- React optimization techniques
- Performance best practices
- Code review checklists
- Anti-patterns to avoid
- Validation report templates

**When to read:**
- Before merging new features
- When reviewing code quality
- When refactoring code
- When establishing coding standards
- When training team members

### security-auditor-agent.md
**Purpose:** Security vulnerability detection and prevention

**Contents:**
- OWASP Top 10 vulnerabilities
- Authentication/authorization patterns
- Input validation techniques
- SQL injection prevention
- XSS and CSRF protection
- JWT security best practices
- Secrets management
- Security headers configuration
- Dependency security scanning
- Security audit checklists

**When to read:**
- Before deploying to production
- When handling sensitive data
- When implementing authentication
- When creating new API endpoints
- During security audits

## 🚀 How to Use Sub-Agents

### Method 1: Slash Commands (Recommended)
```bash
# Invoke the UI agent
/ui [describe your UI task]

# Example
/ui Create a responsive card component for displaying team members
```

### Method 2: Direct Reference
```bash
# In your prompt, reference the agent file
@.claude/ui-agent.md Please create a new modal component for...
```

## 🎓 Quick Start Guide

### For UI Tasks:
1. Type `/ui` in the chat
2. Describe your UI task
3. The agent will:
   - Read PROJECT-SUMMARY.md for context
   - Follow ui-agent.md guidelines
   - Reference existing components
   - Create code following project patterns

### For Backend Tasks:
1. Create backend-agent.md (or use general agent)
2. Describe your backend task
3. The agent will handle API/database work

## 📝 Creating New Sub-Agents

### Step 1: Create Agent Configuration
Create a new file: `.claude/[agent-name]-agent.md`

**Template:**
```markdown
# [Agent Name] - HyperGigs [Role] Specialist

You are a specialized agent for [purpose].

## Core Responsibilities
- Responsibility 1
- Responsibility 2

## Project Context
[Relevant tech stack and file locations]

## Design Patterns to Follow
[Code examples and patterns]

## Resources
- **Project Summary**: `.claude/PROJECT-SUMMARY.md`
- **Relevant Files**: List key files
```

### Step 2: Create Slash Command
Create: `.claude/commands/[command-name].md`

**Template:**
```markdown
---
description: Brief description of what this command does
---

You are now acting as the **[Agent Name]** for the HyperGigs project.

**Read and follow the instructions in** `.claude/[agent-name]-agent.md`

**Also read** `.claude/PROJECT-SUMMARY.md` for project context.

[Additional instructions]

Now, please tell me what [type of task] you'd like me to help with.
```

## 💡 Best Practices

### For All Agents:
1. **Always read PROJECT-SUMMARY.md first** - Understand full context
2. **Reference existing code** - Look for similar patterns
3. **Follow TypeScript strictly** - No `any` types
4. **Test your changes** - All states and edge cases
5. **Document complex logic** - Add comments where needed

### For UI Agent:
- Mobile-first responsive design
- Accessibility (ARIA, keyboard navigation)
- Use shadcn/ui components consistently
- Follow Tailwind CSS patterns
- Test loading/error/success states

### For Backend Agent:
- API endpoint conventions (RESTful)
- Database migrations (Prisma)
- Input validation (express-validator)
- Error handling patterns
- Authentication checks

## 🔍 Troubleshooting

### Agent not loading context?
- Ensure PROJECT-SUMMARY.md is up to date
- Check file paths in agent configuration
- Verify slash command references correct agent file

### Inconsistent code style?
- Review existing code patterns in codebase
- Update agent configuration with better examples
- Ensure TypeScript types are properly defined

### Agent missing information?
- Update PROJECT-SUMMARY.md with new features
- Add relevant examples to agent configuration
- Document new patterns as they emerge

## 📊 Current Status

### Completed:
- ✅ PROJECT-SUMMARY.md - Complete project documentation (37 KB)
- ✅ ui-agent.md - Frontend specialist configuration (7.3 KB)
- ✅ /ui command - UI agent slash command
- ✅ backend-agent.md - Backend specialist configuration (21 KB)
- ✅ /backend command - Backend agent slash command
- ✅ code-validator-agent.md - Enterprise code quality agent (33 KB)
- ✅ /code-validator command - Code validation slash command
- ✅ security-auditor-agent.md - Security vulnerability agent (44 KB)
- ✅ /security-auditor command - Security audit slash command
- ✅ README.md - This documentation file

### To Do:
- ⏳ /fullstack command - Full-stack feature agent
- ⏳ /test command - Testing specialist agent

## 🎯 Example Workflows

### Creating a New Feature (Full-Stack)
1. **Planning**: Review PROJECT-SUMMARY.md for architecture
2. **Backend**: Use `/backend` to create API endpoints, update schema
3. **Frontend**: Use `/ui` to create components
4. **Code Quality**: Use `/code-validator` to review implementation
5. **Security**: Use `/security-auditor` to check for vulnerabilities
6. **Testing**: Test all states and edge cases
7. **Documentation**: Update relevant docs

### UI-Only Task
1. `/ui Create a new Settings page`
2. Agent reads ui-agent.md for patterns
3. Agent references existing pages
4. Agent creates component following guidelines
5. Agent ensures responsive design & accessibility

### Backend-Only Task
1. `/backend Create a new notifications API endpoint`
2. Agent reads backend-agent.md for patterns
3. Agent creates route → controller → service
4. Agent updates database schema if needed
5. Agent adds validation and error handling

### Code Quality Review
1. `/code-validator Review the authentication module`
2. Agent analyzes code against enterprise standards
3. Agent checks SOLID principles, type safety, error handling
4. Agent provides categorized issues (Critical → Low)
5. Agent suggests improvements with code examples

### Security Audit
1. `/security-auditor Audit the user management API`
2. Agent scans for OWASP Top 10 vulnerabilities
3. Agent checks authentication, authorization, input validation
4. Agent runs `npm audit` for dependency issues
5. Agent provides severity-based report with fixes

---

**Last Updated:** October 14, 2025
**Project:** HyperGigs - Modern freelance platform
**Claude Code Version:** Latest
