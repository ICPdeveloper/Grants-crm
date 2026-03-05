# Altemis CRM

## Overview
A CRM system for Altemis, a grants facilitator consulting company in the blockchain space. The application enables authorized users to manage blockchain projects and track grant application progress through a Kanban-style workflow.

## Authentication
- User authentication system to restrict access to authorized users only
- Users must log in to access and manage CRM data
- Proper error handling during authentication with user-friendly feedback
- User profile initialization to prevent blank screens after sign-in
- Loading states during authentication for visual feedback

## Core Features

### Blockchain Management
- Create, edit, and delete blockchain entries
- Each blockchain can have multiple associated projects
- Upload and display logos for blockchains
- Blockchain details include:
  - Name, description, and type
  - Logo upload and display
  - Social media links (Twitter/X, Discord, Telegram)
  - Official website and documentation links
  - GitHub repository links

### Project Management
- Create, edit, and delete projects associated with specific blockchains
- Upload and display logos for projects
- Project details include:
  - Project name and description
  - Project type (e.g., DeFi, gaming)
  - Associated blockchain
  - Client information
  - Logo upload and display
  - Social media links (Twitter/X, Discord, Telegram)
  - GitHub repository links
  - Video demo links
  - Pitch deck links
  - Official website and documentation

### Project Documents
- Upload files (Excel, Word documents, and other file types) to each project
- Add shared Google Doc/Sheet links to projects
- View and manage all documents associated with a project
- Delete uploaded files and remove Google Doc/Sheet links

### Internal Team Assignment
- Assign multiple Altemis team members to each project with specific roles
- Internal team member roles: "Responsible" and "working on"
- One team member can be assigned as "Responsible" (visually highlighted)
- Multiple team members can be assigned as "working on"
- Add, remove, and update team member assignments
- View team assignments in project details and overview displays

### Project Filtering
- Filter projects by project type, blockchain, client, workflow stage, and assigned team members
- Multiple filters can be applied simultaneously
- Clear filter options to reset view

### Grant Application Tracking
- Kanban-style workflow for tracking grant application steps
- Workflow states: In Progress, Submitted, Accepted, Rejected
- Move projects between any workflow states
- View projects organized by their current workflow state

### Client Management
- Create, edit, and delete client profiles
- Upload and display logos for clients
- Client details include:
  - Contact and company information
  - Logo upload and display
  - Social media profiles (Twitter/X, LinkedIn)
  - Company website
  - Company description
- Link clients to their respective projects

### Grant Program Management
- Create, edit, and delete grant program information
- Grant program details include:
  - Name and description
  - Associated blockchain
  - Grant amounts and funding details
  - Application process information
  - Eligibility criteria
  - Deadlines and timeline information
  - Contact information for administrators
  - Application requirements
- Link grant programs to relevant projects

### Grant Program Integration
- Display related grant programs when viewing a project with ability to link and unlink
- Show associated projects and clients in grant program section
- Allow grant program selection during project creation/editing with blockchain filtering
- Seamless navigation between projects, grant programs, blockchains, and clients

### Project Sharing
- Generate unique, secure shareable links for individual projects
- Shareable links provide view-only access without authentication
- Shared project views display project details, progress, and related grant programs
- Secure token generation with cryptographic encoding
- Comprehensive error handling for invalid or broken links

## Data Storage
The backend stores:
- User authentication data
- Blockchain information with details, social links, and logos
- Project data with profiles, workflow states, details, and logos
- Project documents including uploaded files and Google Doc/Sheet links
- Internal team member information and project assignments with roles
- Client profiles with contact details, social media information, and logos
- Grant program information with associated blockchain and requirements
- Associations between blockchains, projects, clients, and grant programs
- Secure shareable link tokens with project mappings

The backend supports:
- File upload operations for logos and project documents
- Update operations for all entities and their associated data
- Delete operations for all entities and their files
- Query operations with filtering capabilities
- Link and unlink operations between projects and grant programs
- Secure generation and validation of shareable link tokens

## User Interface
- Professional, modern dashboard design
- Dashboard view showing projects organized by workflow state with team member information
- Enhanced project detail view with expandable sections for:
  - Project overview with key details
  - Internal team assignments with role indicators
  - Related grant programs with linking functionality
  - Project documents with file management
  - Social media and resource links
  - Client information and blockchain association
- Project filtering interface with dropdown menus for all filter criteria
- Clear filters functionality
- Logo upload and display functionality for all entities
- Internal team assignment interface with clear role labeling
- Visual highlighting of responsible person
- Forms for creating and editing all entities with expanded field sets
- Kanban board interface for workflow management
- Grant program selection with blockchain filtering
- Enhanced shared project view with error handling
- Loading indicators and error messages
- Empty state displays
- Application content in English
- Responsive design with professional styling
- Consistent visual design throughout

## Image Display Requirements
- Correct uploaded logos must be displayed throughout the application
- Dashboard expanded view must show actual uploaded logos
- Shareable project links must display correct logos
- Proper fallbacks when no image is uploaded
- Images properly sized for their display context

## Typography and Layout Requirements
- Professional typography hierarchy with appropriate font sizes and spacing
- Clean section separation with adequate white space
- Consistent text formatting and alignment
- Enhanced visual organization for better user experience

## Select Component Requirements
- All Select components must use proper placeholder text
- No SelectItem components with empty string values
- Filter dropdowns use placeholders like "All Projects", "All Blockchains", etc.
