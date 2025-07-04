# Stahiki - Digital Twin Platform

## Overview

Stahiki is a comprehensive digital twin platform that enables users to create, manage, and simulate digital representations of real-world assets across architecture, industrial, and agricultural domains. The platform integrates AI-powered twin generation, IoT device management, workflow automation, and real-time simulation capabilities with a marketplace for pre-built templates.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript in Vite development environment
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system featuring navy color scheme
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **3D Visualization**: React Three Fiber for 3D model rendering and interaction

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **AI Integration**: OpenAI API for digital twin generation and file analysis
- **Real-time Communication**: WebSocket server for live updates and simulation data
- **File Handling**: Multer for CAD and 3D model file uploads

### Build System
- **Frontend Build**: Vite with React plugin for fast development and optimized production builds
- **Backend Build**: ESBuild for server-side bundling
- **Development**: Hot module replacement with Vite middleware integration
- **TypeScript**: Shared types across client and server with path aliases

## Key Components

### Digital Twin Management
- **Creation Module**: AI-powered twin generation from text prompts or file uploads
- **Type Support**: Architecture (buildings), Industrial (factories), Agriculture (farms)
- **Properties**: Dimensions, materials, features, and domain-specific specifications
- **Model Viewer**: Interactive 3D visualization with camera controls and animation

### IoT Integration
- **Device Management**: Support for various sensor types (temperature, humidity, power, vibration)
- **Real-time Monitoring**: WebSocket-based live data streaming
- **Status Tracking**: Connection status, last values, and update timestamps
- **Twin Association**: Link IoT devices to specific digital twins

### Workflow Automation
- **Visual Builder**: Drag-and-drop interface for creating automation workflows
- **Node Library**: Pre-built nodes for common operations (file input, AI processing, 3D generation)
- **Custom Nodes**: Code editor for creating custom automation logic
- **Industry-Specific**: Specialized nodes for architecture, industrial, and agricultural use cases

### Live Simulation
- **Real-time Metrics**: Production rates, energy efficiency, equipment health monitoring
- **Environment Controls**: Simulation speed, time range, and environmental conditions
- **Performance Analytics**: Safety scores, operational metrics, and predictive insights
- **Interactive Visualization**: 3D model interaction during simulation

### Marketplace
- **Template Library**: Pre-built workflow templates for different industries
- **Filtering System**: Category, price, complexity, and rating filters
- **Rating System**: User ratings and download tracking
- **Template Management**: Upload, purchase, and integration capabilities

## Data Flow

### Digital Twin Creation
1. User provides text prompt or uploads CAD files
2. Frontend sends request to OpenAI service
3. AI generates comprehensive twin specifications
4. Database stores twin metadata and properties
5. 3D model generation queued for processing
6. Real-time updates via WebSocket for progress

### IoT Data Processing
1. IoT devices send sensor data to API endpoints
2. Data validated and stored in database
3. WebSocket broadcasts updates to connected clients
4. Frontend updates real-time dashboards and metrics
5. Twin simulations adjust based on sensor inputs

### Workflow Execution
1. User creates workflow in visual builder
2. Workflow configuration saved as JSON
3. Execution engine processes nodes sequentially
4. External API calls made as needed (AI, file processing)
5. Results propagated through workflow chain
6. Final outputs stored and presented to user

## External Dependencies

### AI Services
- **Google Gemini API**: Gemini-2.5-flash and Gemini-2.5-pro models for twin generation and file analysis
- **Configuration**: Environment-based API key management (GEMINI_API_KEY)
- **Usage**: Text-to-specification conversion, CAD file interpretation, optimization suggestions

### Database
- **PostgreSQL**: Primary data store via Neon serverless
- **Drizzle ORM**: Type-safe database operations with migrations
- **Connection**: Environment-based connection string

### File Storage
- **Multer**: In-memory file handling with 50MB size limit
- **Supported Formats**: CAD files (.dwg, .step, .iges), 3D models (.obj, .stl, .ply)
- **Processing**: AI-based file analysis and specification extraction

### UI Components
- **Radix UI**: Accessible component primitives
- **React Three Fiber**: 3D rendering and interaction
- **React Hook Form**: Form validation and management
- **React Dropzone**: File upload interface

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with Express middleware integration
- **Database**: In-memory storage for development
- **Environment Variables**: DATABASE_URL, GEMINI_API_KEY
- **WebSocket**: Development server on same port as Express
- **AI Integration**: Google Gemini API for twin generation and optimization

### Production Build
- **Frontend**: Static assets built to dist/public
- **Backend**: ESBuild bundle to dist/index.js
- **Database Migrations**: Drizzle migration system
- **Process Management**: Node.js production server
- **Static Serving**: Express serves built frontend assets

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL
- **AI Service**: OpenAI API key configuration
- **File Limits**: Configurable upload size limits
- **WebSocket**: Production WebSocket server setup

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
- July 04, 2025. Switched from OpenAI to Google Gemini AI integration
  * Updated all AI service functions to use Gemini-2.5-flash and Gemini-2.5-pro models
  * Fixed component dependencies and simplified 3D model placeholders
  * Successfully tested AI-powered digital twin generation with realistic specifications
  * Application running smoothly with full API functionality verified
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```