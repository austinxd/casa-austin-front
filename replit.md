# Overview

Casa Austin is a comprehensive property rental management system developed with React and TypeScript. It provides a dashboard for managing multiple vacation rental properties ("Casa Austin 1-4"), covering reservations, client management, calendar availability, and financial tracking. The system integrates with external booking platforms like Airbnb and local booking systems. Its purpose is to streamline property management operations and enhance efficiency for property owners.

# Recent Changes

## October 6, 2025 - Cotizador ERP Endpoint Integration
- **Cotizador API Update**: Migrated to new ERP pricing endpoint with hybrid message generation
  - Updated from `/api/v1/properties/calculate-pricing/` to `/api/v1/properties/calculate-pricing-erp/`
  - Modified in pricingService.ts to use new ERP endpoint
  - New endpoint returns structured response with `direct_available`, `options_with_movements` arrays, and `message1`/`message2`
  - Enhanced PricingData interface to support new API structure:
    - Added MovementRequired interface for reservation transfer details
    - Added optional fields: direct_available, options_with_movements, summary
    - Added discount_applied and movement_required to Property interface
  - Implemented hybrid message generation in CotizadorCenter:
    - Uses backend-generated `message1` for header
    - Dynamically generates `message2` from `options_with_movements` to show alternatives with full movement details:
      - Property name and pricing
      - Client name requiring reservation move
      - Property transfer details (from/to)
      - Affected dates
    - Falls back to backend `message2` when no alternatives exist

## October 6, 2025 - Logout Fix, Reservation Status & Points Features
- **Logout Fix**: Fixed logout functionality that wasn't properly clearing session
  - Added missing 'roll' cookie removal (was only removing 'rollTkn')
  - Added missing 'idSellerAus' cookie removal
  - Reset all state properties to null (token, roll, idSeller, keyRefresh)
  - Resolved inconsistency between cookie read/write/remove operations

## October 6, 2025 - Reservation Status & Points Features
- **Points Adjustment**: Added "Puntos" option to client actions menu (3 dots) in both desktop and mobile views
  - Implemented AdjustPoints modal for adding or removing points from clients
  - Created API service function adjustClientPoints for POST requests to /clients/points/adjust/
  - Created useAdjustPoints hook for managing points adjustment logic
  - Modal features: displays current balance, validates numeric input, supports positive/negative values, shows success/error states
  - Integrated with existing client management workflow following DeleteClient pattern
- **New Reservation Status**: Added "UNDER_REVIEW" status to reservation edit form (/alquileres)
  - Value: "under_review" 
  - Label: "En revision"
  - Backend displays as "En Revisión - Segundo Voucher"

## October 3, 2025 - Client Ordering Filters, Level Column, and Points Balance
- Added ordering filters to the clients page (/clientes)
- Implemented sorting by points balance (highest first) using `-points_balance` parameter
- Implemented sorting by level (highest first) using `-level` parameter  
- Implemented alphabetical sorting by last name using `last_name` parameter
- Added ordering selector in SearchClient component with options: "Sin orden", "Mayor puntos", "Mayor nivel", "Apellido (A-Z)"
- Integrated ordering state management with existing pagination and search functionality
- Added "NIVEL" column to display client level icon (emoji) from level_info object (desktop only)
- Added "PUNTOS" column to display points_balance with decimal formatting (desktop only)
- Implemented responsive mobile layout: NIVEL and PUNTOS columns hidden on mobile, level icon displays beside name, points shown below as "Puntos: XX"
- Added points_balance field to IRegisterClient interface

## October 2, 2025 - Cotizador UX Improvements
- Fixed guest input field overlay issue where "1" prevented entering custom values
- Implemented dual-state approach: string state for UI display, number state for API calls
- Added blur validation to handle empty/invalid inputs gracefully
- Relocated "PRECIO PARA X PERSONAS" header to main availability section (message2)
- Updated clipboard format to include pricing header with WhatsApp/Telegram bold formatting

## October 1, 2025 - TypeScript Compilation Fixes
- Fixed all TypeScript compilation errors across analytics components (109 errors resolved)
- Corrected data access patterns for API responses (using `.data.` accessor properly)
- Implemented proper unique client/IP counting using Sets to prevent duplicate counting
- Added safe data access checks to prevent runtime errors
- Removed unused imports across multiple components
- Build now compiles successfully without errors

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite.
- **UI Framework**: Material-UI (MUI) v5 with custom theming (light/dark mode).
- **State Management**: Redux Toolkit for global state and RTK Query for API data fetching.
- **Routing**: React Router DOM v6.
- **Forms**: React Hook Form for validation.
- **Calendar**: FullCalendar integration.
- **Charts**: ApexCharts with React wrapper.

## Component Structure
- **Reusable Components**: Common UI elements, layout components (sidebar, drawer), and protected routes.
- **Page Components**: Feature-specific CRUD interfaces for Dashboard, Clients, Rentals, Calendar, and Profits.

## Authentication & Authorization
- **Token-based Authentication**: JWT tokens with refresh token mechanism.
- **Cookie Management**: js-cookie for secure token storage.
- **Role-based Access**: Supports different user roles (e.g., admin, maintenance) with route restrictions.
- **Auto-refresh**: Automatic token validation and renewal.

## API Integration
- **Primary API**: Casa Austin backend API.
- **External Services**: Google Apps Script for client document validation and a custom PHP API for additional client data.
- **HTTP Client**: Axios with interceptors.
- **Data Fetching**: RTK Query for efficient API state management and caching.

## Data Management
- **Global State**: Redux store with slices for authentication, clients, rentals, dashboard, and profits.
- **Local State**: React hooks.
- **Form State**: React Hook Form controllers.
- **Caching**: RTK Query for automatic caching and invalidation.

## Styling & Theming
- **Material-UI Theming**: Custom theme configuration with primary/secondary color schemes.
- **Responsive Design**: Mobile-first approach using MUI breakpoints.
- **Typography**: Public Sans font family.

## System Design Choices & Features
- **Mobile-First Design**: Emphasis on responsive and compact layouts, especially for task management and filters.
- **Property Pricing Calculator (Cotizador)**: Standalone page in main navigation menu with real-time pricing calculation, integration with `/api/v1/properties/calculate-pricing/`, client-side validation, and copy-to-clipboard functionality.
- **Enhanced Date Display**: Color-coded and structured date presentation with weekday abbreviations for improved readability.
- **Role-Based Access Control**: Dynamic UI adjustments based on user roles, restricting access to certain tabs and functionalities (e.g., maintenance users have restricted access and default filter settings).
- **Real-Time Progress Timer**: Displays elapsed time for in-progress tasks.
- **Dynamic Card Progression System**: Task cards visually indicate urgency (White → Yellow → Orange → Red) based on time remaining to the scheduled date, with theme-aware colors.
- **Analytics System**: Comprehensive statistics and reporting dashboards (Search, Ingresos, Checkins) based on new Django backend endpoints, with global filtering and diverse chart integrations.

# External Dependencies

## Core Dependencies
- **React Ecosystem**: `react`, `react-dom`, `react-router-dom`.
- **State Management**: `@reduxjs/toolkit`, `react-redux`.
- **UI Framework**: `@mui/material`, `@mui/icons-material`, `@mui/x-data-grid`, `@mui/x-date-pickers`.
- **Forms & Validation**: `react-hook-form`.
- **HTTP Client**: `axios`.
- **Date Management**: `dayjs`.

## Specialized Libraries
- **Calendar**: `@fullcalendar/react`, `@fullcalendar/core`, `@fullcalendar/daygrid`.
- **Charts**: `apexcharts`, `react-apexcharts`.
- **Phone Input**: `react-phone-input-2`.
- **Cookie Management**: `js-cookie`.

## External APIs
- **Casa Austin API**: `https://api.casaaustin.pe/api/v1`.
- **Google Apps Script**: For client document validation.
- **Custom PHP API**: `https://casaaustin.pe/datos/api.php` for additional client data retrieval.