# Overview

Casa Austin is a property rental management system built with React and TypeScript. The application serves as a comprehensive dashboard for managing vacation rental properties, handling reservations, clients, calendar availability, and financial tracking. It's designed specifically for managing multiple rental properties ("Casa Austin 1-4") with integrations to Airbnb and local booking systems.

## Recent Changes

**September 15, 2025 - Complete Mobile UX Overhaul & Enhanced Date Display**
- **Mobile TaskCard Optimization**: Comprehensive mobile UX improvements
  - **30% height reduction**: Cards now 140px (vs 200px desktop) with compact padding
  - **Header consolidation**: Title, status, and property info in single optimized row
  - **Staff compression**: Smaller avatars (18px) and compact typography for space efficiency
  - **Action simplification**: Primary actions visible, secondary actions in mobile menu
  - **Touch-friendly design**: 44x44px minimum touch targets, optimized hover states
- **Enhanced Date Display**: Dramatically improved date presentation with visual organization
  - **Larger typography**: Date text increased to 0.8rem (mobile) and 0.85rem (desktop)
  - **Color-coded containers**: Check-out dates in yellow theme, scheduled dates in blue theme
  - **Structured layout**: Label above date with improved spacing and padding
  - **Visual separation**: Individual bordered containers with background colors for clarity
  - **Day abbreviation**: Added weekday names (Lun, Mar, etc.) for better date recognition
- **Mobile Filter System**: Improved filter interface with dropdown approach
  - **Collapsed filters**: Search field + filter button + create button in clean horizontal layout
  - **Expandable design**: Filters reveal below with smooth animation when needed
  - **Visual indicators**: Active filter status shown with color changes and notification dots
  - **No horizontal scroll**: Eliminated uncomfortable horizontal scrolling on mobile
- **Play Button Functionality**: Fixed non-functional play button issue in TaskCard component
  - **Guaranteed refresh**: Moved refetch() to finally block ensuring view updates even on API errors
  - **Debug logging**: Added comprehensive console logging for click tracking and operation confirmation
  - **Error handling**: Improved error management without breaking the refresh mechanism
- **Personal Section UI Consistency**: Applied ButtonPrimary styling and unified header layout
  - **Consistent design**: Replaced MUI Button with ButtonPrimary component for visual consistency
  - **Search field optimization**: Applied same styling patterns as TaskManagement section
  - **Layout harmony**: Implemented "Filtros y Acciones" paper container matching other sections
- **Role-Based Tab Access Control**: Implemented role-based access restrictions for PersonalManagement section
  - **Maintenance users restriction**: Users with "mantenimiento" role can only access the "Tareas" tab
  - **Clean UI adaptation**: Tab interface dynamically adjusts to show only available tabs based on user permissions
  - **Proper tab indexing**: Tab navigation works correctly with reduced tab count for maintenance users
  - **Enhanced Time tab**: Removed header text and made interface more direct for cleaning time analysis
- **Date Filter Enhancement**: Added "Desde hoy" filter button for TaskManagement section
  - **Toggle functionality**: Users can activate/deactivate filter to show only tasks from today onwards
  - **Visual feedback**: Button changes style when active (filled vs outlined) with calendar icon
  - **API integration**: Uses date_from parameter with today's date when filter is enabled
  - **Responsive design**: Available in both mobile and desktop interfaces
  - **Role-based default**: Maintenance users have "Desde hoy" filter enabled by default, focusing on future tasks only

**September 14, 2025 - Mobile-Optimized Task Management Interface & UI Restructuring**
- **TaskCard Component**: Comprehensive responsive design improvements with mobile-first approach and compact layout
  - **Compact design**: 25-28% height reduction (from 240-280px to 180-200px) for better screen utilization
  - **Condensed information**: Optimized typography, spacing, and padding throughout for denser content display
  - **Description clamping**: Limited to 2 lines maximum to prevent excessive card growth
  - **Touch-friendly action buttons**: 44px minimum touch targets on mobile, 32px on desktop
  - **Responsive typography scaling**: Carefully balanced text sizes across all breakpoints (xs, sm, md, lg)
  - **Proper card layouts**: Stack efficiently on mobile devices with improved space utilization
  - **Valid MUI color tokens**: Improved theme consistency
  - **Ellipsis overflow handling**: Property names and long text properly truncated
  - **Dual-date display**: Shows both check-out date (when reservation ended) and scheduled date (when task is programmed) with clear labeling and emojis
  - **Dynamic color progression system**: Card backgrounds use White → Yellow → Orange → Red color progression based on time gap between check-out and scheduled dates, providing clear visual feedback for task urgency. Includes theme-aware colors for light/dark modes and numeric delay chips (Δ{days}d) for accessibility. Updated to daily precision: 0d=White, 1d=Yellow, 2d=Orange, 3d+=Red
- **TaskManagement Component**: Major UI restructuring for cleaner, more functional interface
  - **Removed statistics cards**: Eliminated summary cards showing task counts (Pendientes, Asignadas, En Progreso, Completadas) for cleaner interface
  - **Repositioned action buttons**: Moved create task and search buttons to filter level for better accessibility
  - **Enhanced search functionality**: Added search field with proper styling and positioning
  - **Improved button styling**: Create task button uses consistent ButtonPrimary styling with proper responsive behavior
  - **Streamlined layout**: Single unified "Filtros y Acciones" section replacing separate header and stats sections
  - Quick status filter system with touch-friendly chips remains fully functional
  - Improved empty states with contextual messaging for filtered views
- **Style Consistency Fixes**: Unified design language across the application
  - Fixed "Gestión de Personal" title to match other page titles (removed custom fontSize overrides)
  - Converted all "Crear Tarea" buttons to use ButtonPrimary component for consistency
  - Standardized button styling with #0E6191 background and consistent heights
  - Maintained responsive behavior with proper mobile-friendly layouts
- **API Integration**: Enhanced property color system using real backend data instead of hardcoded values
- **User Experience**: Significantly improved mobile responsiveness, visual consistency, and simplified interface addressing user feedback

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Material-UI (MUI) v5 with custom theming (light/dark mode support)
- **State Management**: Redux Toolkit for global state with RTK Query for API data fetching
- **Routing**: React Router DOM v6 for client-side navigation
- **Forms**: React Hook Form for efficient form handling and validation
- **Calendar**: FullCalendar integration for availability and booking management
- **Charts**: ApexCharts with React wrapper for data visualization

## Component Structure
- **Common Components**: Reusable UI components (inputs, buttons, modals, tables, charts)
- **Layout Components**: Sidebar navigation and drawer layouts for panel interface
- **Protected Routes**: Authentication guards for secure access control
- **Page Components**: Feature-specific CRUD interfaces (Dashboard, Clients, Rentals, Calendar, Profits)

## Authentication & Authorization
- **Token-based Authentication**: JWT tokens with refresh token mechanism
- **Cookie Management**: js-cookie for secure token storage
- **Role-based Access**: Different user roles (admin, maintenance) with route restrictions
- **Auto-refresh**: Automatic token validation and renewal

## API Integration
- **Primary API**: Casa Austin backend API for core functionality
- **External Services**: 
  - Google Apps Script for client document validation (DNI/RUC lookup)
  - Custom PHP API for additional client data retrieval
- **HTTP Client**: Axios with interceptors for token management
- **Data Fetching**: RTK Query for efficient API state management with caching

## Data Management
- **Global State**: Redux store with slices for auth, clients, rentals, dashboard, and profits
- **Local State**: React hooks for component-specific state management
- **Form State**: React Hook Form controllers for complex form interactions
- **Caching**: RTK Query automatic caching and invalidation strategies

## Styling & Theming
- **Material-UI Theming**: Custom theme configuration with primary/secondary color schemes
- **CSS Modules**: Scoped styles for specific components
- **Responsive Design**: Mobile-first approach with MUI breakpoints
- **Typography**: Public Sans font family for consistent branding

## Development Tools
- **TypeScript**: Strict type checking with custom interfaces for API responses
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Automated code formatting
- **Path Aliases**: Clean import statements with @ alias for src directory

# External Dependencies

## Core Dependencies
- **React Ecosystem**: react, react-dom, react-router-dom for core functionality
- **State Management**: @reduxjs/toolkit, react-redux, react-query for data management
- **UI Framework**: @mui/material, @mui/icons-material, @mui/x-data-grid, @mui/x-date-pickers
- **Forms & Validation**: react-hook-form for form management
- **HTTP Client**: axios for API communication
- **Date Management**: dayjs for date manipulation and formatting

## Specialized Libraries
- **Calendar**: @fullcalendar/react, @fullcalendar/core, @fullcalendar/daygrid for booking calendar
- **Charts**: apexcharts, react-apexcharts for data visualization
- **Phone Input**: react-phone-input-2 for international phone number handling
- **Cookie Management**: js-cookie for authentication token storage

## Development Dependencies
- **Build Tools**: vite, @vitejs/plugin-react for development and build process
- **TypeScript**: typescript, @types/* packages for type definitions
- **Linting**: eslint, @typescript-eslint/* for code quality
- **Formatting**: prettier for consistent code style

## External APIs
- **Casa Austin API**: Primary backend API at https://api.casaaustin.pe/api/v1
- **Google Apps Script**: Document validation service for client verification
- **Custom PHP API**: Additional client data retrieval at https://casaaustin.pe/datos/api.php

## Development Environment
- **Node.js**: Required for package management and build process
- **Vite Dev Server**: Hot module replacement on port 5000
- **Preview Server**: Production preview on port 5000 with host binding