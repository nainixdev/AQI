# My Air - Real-time Air Quality Monitor

## Overview

This is a modern web application that provides real-time air quality monitoring and weather data. The application features a React-based frontend with a Node.js/Express backend, utilizing external APIs to fetch air quality and weather information. The app supports multiple languages (English/Hindi), dark mode, geolocation services, and provides health recommendations based on air quality data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js for data visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Storage**: In-memory storage (MemStorage class)
- **Development**: Hot reload with Vite integration

## Key Components

### Data Storage
- **Database Schema**: Separate tables for air quality and weather data
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Definition**: Shared schema file with Zod validation
- **Tables**: 
  - `air_quality_data`: Stores AQI, pollutant levels, location data
  - `weather_data`: Stores temperature, humidity, wind, visibility data

### API Integration
- **External APIs**: 
  - OpenWeather API for weather data
  - AQICN (Air Quality Index China Network) for air quality data
- **Endpoints**:
  - `/api/air-quality`: Combined air quality and weather data
  - `/api/geocode`: Reverse geocoding for location names

### UI Components
- **AQI Card**: Main dashboard showing current air quality with color-coded status
- **Weather Grid**: Grid layout displaying weather metrics
- **AQI Chart**: 24-hour trend visualization using Chart.js
- **Location Selector**: Search and geolocation functionality
- **Voice Assistant**: Text-to-speech for accessibility
- **Saved Cities**: Local storage for favorite locations

### PWA Features
- **Service Worker**: Offline functionality and caching
- **Manifest**: Web app manifest for installability
- **Icons**: SVG-based adaptive icons
- **Caching Strategy**: Cache-first for static assets, network-first for API data

## Data Flow

1. **Location Detection**: User allows geolocation or searches for a city
2. **API Requests**: Concurrent calls to air quality and weather APIs
3. **Data Processing**: Server aggregates and formats response data
4. **Client Rendering**: React components display data with real-time updates
5. **Caching**: TanStack Query caches responses with 5-minute stale time
6. **Auto-refresh**: Data refreshes every 10 minutes automatically

## External Dependencies

### Core Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` with `drizzle-zod` for schema validation
- **UI**: Multiple `@radix-ui` packages for accessible components
- **Charts**: `chart.js` for data visualization
- **HTTP Client**: Built-in fetch API
- **Styling**: `tailwindcss`, `class-variance-authority`, `clsx`

### API Services
- **OpenWeather API**: Weather data and geocoding
- **AQICN API**: Real-time air quality measurements
- **Browser Geolocation API**: User location detection

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast JavaScript bundler for production
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development
- **Server**: Express with Vite middleware for HMR
- **Database**: Neon serverless PostgreSQL with environment-based connection
- **Environment Variables**: API keys and database URLs via `.env`

### Production Build
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: ESBuild bundles server code to `dist` directory
- **Static Serving**: Express serves built frontend assets
- **Database Migrations**: Drizzle Kit handles schema migrations

### Environment Configuration
- **Development**: Uses `NODE_ENV=development` with live reload
- **Production**: Uses `NODE_ENV=production` with optimized builds
- **Database**: `DATABASE_URL` environment variable for connection
- **API Keys**: External service credentials via environment variables

The application follows a modern full-stack architecture with clear separation of concerns, leveraging TypeScript for type safety, modern React patterns for the frontend, and a lightweight Express backend with proper error handling and logging.