# Service Provider Platform

## Overview

This is a full-stack web application built as a service marketplace that connects customers with service providers. The platform enables customers to request services, receive quotes, and hire providers for various services like plumbing, electrical work, cleaning, and more. Service providers can register, manage their profiles, respond to requests, and handle their business operations through a comprehensive dashboard.

## System Architecture

The application follows a monorepo structure with a React frontend, Express.js backend, and PostgreSQL database:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Context API for global state (Auth, Jobs, Notifications)
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Authentication**: Custom JWT-based authentication system
- **File Structure**: Modular route handling with centralized storage interface

## Key Components

### Customer Features
- Service request creation and management
- Provider search and filtering
- Quote comparison and acceptance
- Real-time messaging with providers
- Payment processing
- Review and rating system

### Provider Features
- Business profile management
- Service listing and pricing
- Quote response system
- Job scheduling and calendar management
- Customer communication hub
- Financial dashboard with earnings tracking
- Document verification system

### Admin Features
- Provider verification management
- Platform analytics and reporting
- User management and support
- Content moderation

## Data Flow

1. **Customer Journey**: Customer creates account → Posts service request → Receives quotes from providers → Selects provider → Completes payment → Receives service → Leaves review

2. **Provider Journey**: Provider registers → Completes verification → Browses service requests → Submits quotes → Manages accepted jobs → Receives payments → Builds reputation

3. **Real-time Communication**: WebSocket-based messaging system for instant communication between customers and providers

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive Radix UI component library for accessible, customizable components
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Date Handling**: date-fns for date manipulation and formatting
- **Charts**: Recharts for analytics and financial data visualization
- **Carousel**: Embla Carousel for image galleries and content carousels

### Backend Dependencies
- **Database**: Neon serverless PostgreSQL for scalable database hosting
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type checking and validation
- **File Processing**: Various utilities for handling file uploads and processing

### Development Tools
- **TypeScript**: Full TypeScript support across frontend and backend
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Special plugins for Replit development environment

## Deployment Strategy

### Development Environment
- **Local Development**: Uses Vite dev server with hot module replacement
- **Database**: Connects to Neon PostgreSQL instance via DATABASE_URL environment variable
- **Build Process**: Separate frontend (Vite) and backend (esbuild) build processes

### Production Deployment
- **Frontend**: Static assets served from Express.js after Vite build
- **Backend**: Node.js server with Express handling API routes and static file serving
- **Database**: Drizzle migrations system for schema management
- **Environment**: Production-ready with proper error handling and logging

### Database Schema
- **Users Table**: Customer and provider authentication and basic info
- **Extensible Design**: Schema designed to accommodate additional tables for services, bookings, payments, messages, etc.

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 01, 2025. Initial setup