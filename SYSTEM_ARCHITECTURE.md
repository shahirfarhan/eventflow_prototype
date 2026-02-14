# EventFlow System Architecture

## Overview
EventFlow is a two-sided marketplace connecting Event Organizers with Service Providers (Vendors). The system facilitates discovery, booking, communication, and payment processing.

## Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, ShadCN UI, React Query
- **Backend**: Next.js API Routes (Server Actions / Route Handlers)
- **Database**: PostgreSQL (Prisma ORM) - *Note: Using SQLite for local development environment*
- **Authentication**: NextAuth.js (Auth.js) with JWT strategy
- **State Management**: React Query (Server State), React Context (Auth/UI State)

## Architecture Diagram

```mermaid
graph TD
    User[User (Organizer/Vendor/Admin)] -->|HTTPS| CDN[CDN / Edge]
    CDN -->|Next.js App Router| Frontend[Frontend UI]
    
    subgraph "Next.js Server"
        Frontend -->|Server Actions / API Calls| API[API Routes]
        API -->|Auth| Auth[NextAuth.js]
        API -->|ORM| Prisma[Prisma Client]
    end
    
    subgraph "Data Layer"
        Prisma -->|SQL| DB[(Database)]
    end
    
    subgraph "External Services"
        Payment[Stripe (Mock)]
        Email[Email Service (Mock)]
    end
    
    API --> Payment
    API --> Email
```

## Database Schema Overview
The database is normalized with the following core entities:
- **User**: Base entity for authentication and profile info.
- **VendorProfile**: Extended profile for service providers.
- **Service & Package**: Catalog of offerings by vendors.
- **Event**: Created by organizers to manage their requirements.
- **Booking**: The central transaction record linking Event, Organizer, and Vendor.
- **Quote**: Negotiation records associated with a booking.
- **Message**: Communication between users.
- **Review**: Post-booking feedback.

## API Design Principles
- **RESTful endpoints** for standard CRUD operations via Route Handlers (`/api/...`).
- **Server Actions** for form submissions and mutations to leverage Next.js caching and revalidation.
- **Type Safety** shared between frontend and backend using Prisma generated types.
- **Authentication Middleware** to protect private routes.

## Directory Structure
```
src/
  app/              # Next.js App Router pages and API routes
    (auth)/         # Authentication pages
    (dashboard)/    # Protected dashboard pages
    api/            # API Route Handlers
  components/       # Reusable UI components (ShadCN)
  lib/              # Utilities, Prisma client, Auth config
  hooks/            # Custom React hooks
  types/            # TypeScript definitions
prisma/             # Database schema and seeds
```
