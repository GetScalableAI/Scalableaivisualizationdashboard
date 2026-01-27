# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Production build (outputs to /build directory)
```

## Project Overview

Scalable AI Visualization Dashboard is a React/TypeScript manufacturing intelligence platform built with Vite. It provides real-time dashboards for manufacturing operations, invoice automation, PO processing, and AI-powered chatbot assistance.

**Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Recharts, Clerk authentication, Framer Motion

## Architecture

### Routing
Tab-based navigation (no react-router). Six main features defined in `App.tsx`:
1. Daily Snapshot (dashboard)
2. Invoice Automation
3. PO Processing
4. 3 Way Matching
5. RFQ to Quote
6. AI Chatbot

### Authentication
Clerk wraps the app in `main.tsx`. SignedOut shows LandingPage, SignedIn shows main app.

### State Management
Multiple React contexts with useReducer pattern:
- **DashboardContext** (`src/components/DailySnapshot/context/DashboardContext.tsx`) - layouts, widgets, presets, edit mode
- **DrillDownContext** - drill-down panel visibility and data selection
- **ReportContext** - report CRUD operations

All persistence uses localStorage (no backend).

### Widget System
The Daily Snapshot dashboard uses react-grid-layout for a drag-and-drop widget system:
- Widgets defined in `src/components/DailySnapshot/widgets/`
- Widget configuration in `src/components/DailySnapshot/hooks/useLayoutManager.ts`
- Widgets identified by string IDs (e.g., 'production-target', 'oee')
- Layout presets: Default, Compact, Detailed, Executive

**To add a new widget**: Create component in `widgets/`, add to AVAILABLE_WIDGETS in useLayoutManager.ts

### Key Directory Structure
```
src/
├── App.tsx                              # Tab router
├── main.tsx                             # Entry with ClerkProvider
├── components/
│   ├── ui/                              # 50+ Radix-based reusable components
│   ├── DailySnapshot/                   # Dashboard feature
│   │   ├── context/                     # State management
│   │   ├── hooks/                       # useLayoutManager, useReports
│   │   ├── widgets/                     # Widget implementations
│   │   ├── services/                    # mockDataService, reportService, llmService
│   │   └── chat/                        # Dashboard chat panel
│   ├── InvoiceAutomation.tsx
│   ├── POProcessing.tsx
│   ├── ThreeWayMatching.tsx
│   ├── RFQToQuote.tsx
│   └── AIChatbot.tsx
```

### Path Aliases
`@/` maps to `./src/` (configured in vite.config.ts and tsconfig)

## Conventions

- **Components**: Functional with hooks, full TypeScript coverage
- **Styling**: Tailwind CSS with shadcn/ui component patterns
- **Widget IDs**: kebab-case (must match between activeWidgets list and layout config)
- **localStorage keys**: `daily-snapshot-layout`, `daily-snapshot-widgets`

## Environment Variables

Required in `.env.local`:
```
VITE_CLERK_PUBLISHABLE_KEY=<clerk-key>
```
