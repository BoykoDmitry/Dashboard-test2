# Onboarding Admin Dashboard

A React + TypeScript admin dashboard for monitoring bank client onboarding processes.

## Tech Stack

- **React 18+** with Vite
- **TypeScript**
- **React Router v6** for routing
- **React Bootstrap** (UI components)
- **Chart.js** (charts via `react-chartjs-2`)
- **MSAL & msal-react** (Azure AD authentication)
- **Azure AD** (OAuth2 provider)
- **Environment Variables** for configuration

---

## Features

- Secure login via Azure AD (OAuth2, MSAL)
- Paginated table of onboarding processes
- Filters: status, date range, include/exclude test mode
- Charts:
  - Bar chart (processes per day)
  - Doughnut chart (success vs failed vs in progress)
- KPIs: total, success, failed, in progress
- User profile display (with icon and name)
- Responsive, horizontally stretched dashboard layout
- Drill-down details page for a process
- Environment-based configuration for API and auth
- Error handling and login status display

## Routing

/ → Dashboard (list + charts)

/process/:id → Process details

## API Integration

POST /api/admin/onboarding/list → paginated list

GET /api/admin/onboarding/{id} → details

POST /api/admin/onboarding/metrics/daily → daily volume

POST /api/admin/onboarding/metrics/outcomes → outcome metrics

Use src/api/client.ts for fetch wrapper with base URL from .env.


## Layout (main)

Header KPIs: Total | Success | Failed | In Progress (with % vs total)

Charts row:

Line: Processes per day

Donut: Success vs Failed

Controls bar:

Status dropdown

Date range picker

“Include Test Mode” toggle

State dropdown (optional)

Page size select

Table:

Columns: ID (copyable), Phone, Status (pill), State, Step, Created At (local time), Retries, Test (badge)

Row click ⇒ details drawer/page

Accessibility

Keyboard navigable filters & table

Visible focus states

Semantic table elements (<table>, <th scope="col">, etc.)

Color is not the only status indicator (add icons/text)

Empty / Error / Loading

Skeletons for KPIs, charts, and table

Inline error banners with retry

Clear “no results” guidance


## Acceptance Criteria (plain text)

The main dashboard loads a paginated table of onboarding processes sorted by CreationDate descending by default.

Each table row shows: ID, masked phone number, derived status (success/failed/in progress) with a visual pill, current state, current form step, created-at (localized), retries, and a “test” badge when IsTestMode is true.

The list supports server-side pagination with page sizes of 10, 25 (default), and 50; next/previous controls update the table and a total-count indicator.

Filters include: Status (success/failed/inprogress/all), Date range (from/to), Include Test Mode (toggle), and CurrentState (dropdown). Applying filters updates both the table and charts.

Sorting is available on Created At, Status, and Retries; clicking a sortable header toggles between ascending and descending.

The dashboard shows KPI tiles for totals of Success, Failed, and In Progress (and overall Total) calculated for the active filter set.

The dashboard shows a line chart of “Processes per day” for the active date range; values sum to the KPI Total for that period (subject to the same filters).

The dashboard shows a donut/pie chart for “Success vs Failed” (excluding in-progress from the chart’s slices) aligned with the active filters.

Toggling “Include Test Mode” immediately includes/excludes IsTestMode=true records from the table, KPIs, and charts.

Clicking a row opens a read-only details view (drawer or page) showing the key fields and raw JSON (excluding sensitive fields like Token).

Loading states show skeletons for KPIs, charts, and the table until data arrives, without layout shift.

If the list API fails, an inline error banner appears with a Retry action; charts also show an error state if their APIs fail.

If no rows match the current filters, the table shows a clear “No results” message and a “Clear filters” action.

Phone numbers are masked by default in the table (e.g., +380*****1263); full phone number is only visible in the details view if the user has permission.

The UI is keyboard navigable and uses semantic markup for tables; color is not the sole status indicator.

The frontend never renders sensitive fields like Token; PII is handled per policy.

## Solution Architecture

The Onboarding Admin Dashboard is structured as follows:

- **Frontend (React + Vite):**
  - Implements the UI, routing, authentication, and data visualization.
  - Uses MSAL and msal-react for Azure AD OAuth2 authentication.
  - Communicates with backend APIs using secure access tokens.
  - Features modular components (dashboard, side menu, charts, tables).

- **Authentication:**
  - Azure Active Directory (OAuth2, Authorization Code Flow)
  - MSAL library manages login, token acquisition, and session state
  - User context and token are provided via React context/hooks

- **API Layer:**
  - RESTful endpoints for onboarding process management and metrics
  - All requests require a valid access token (Bearer)
  - API endpoints:
    - `/api/admin/onboarding/list` (POST): paginated list
    - `/api/admin/onboarding/{id}` (GET): process details
    - `/api/admin/onboarding/metrics/daily` (POST): daily metrics
    - `/api/admin/onboarding/metrics/outcomes` (POST): outcome metrics

- **State Management:**
  - React hooks for local state (pagination, filters, charts)
  - Authentication state via MSAL React context

- **Environment Configuration:**
  - `.env` file for API base URL, Azure AD client ID, and authority

- **Extensibility:**
  - Easily add new pages, features, or API endpoints
  - Modular and maintainable codebase

## File Structure

The solution is organized for modularity, scalability, and maintainability:

```
project-root/
├── .env                        # Environment variables for API/auth/config
├── index.html                  # Main HTML file for SPA
├── package.json                # Project dependencies and scripts
├── README.md                   # Project documentation
├── Quipu-GmbH-Onboarding.Api-v1-resolved (1).json # OpenAPI specification
├── src/                        # Application source code
│   ├── api/                    # API integration layer (REST clients, models)
│   ├── assets/                 # Static assets (images, icons, etc.)
│   ├── components/             # Reusable UI components (menus, widgets)
│   ├── pages/                  # Main application views/pages
│   ├── utils/                  # Utility and helper functions
│   ├── App.tsx                 # App root component (routing, layout)
│   ├── main.tsx                # App entry point (bootstrapping, providers)
│   ├── index.css               # Global styles
│   └── vite-env.d.ts           # Vite environment types
├── tsconfig*.json              # TypeScript configuration
├── vite.config.ts              # Vite build/configuration
```

- **API Layer:** All backend communication and models are in `src/api`.
- **Components:** UI building blocks are in `src/components`.
- **Pages:** Main views (dashboard, details, etc.) are in `src/pages`.
- **Utils:** Shared helpers/utilities are in `src/utils`.
- **Configuration:** Environment and build config files are at the root.

This structure supports separation of concerns, easy feature addition, and clear mapping to the solution architecture.

---
