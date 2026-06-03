# UNP+ Frontend

UNP+ Frontend is the user-facing web application for the UNP+ project. It provides the interface for discovering, filtering, reviewing, and contributing nature-based solution resources in one place.

The purpose of the project is to gather nature-based solutions into a single web app so users can explore the available tools, programmes, platforms, and guidance without jumping across separate sources. This repository contains only the frontend experience: all AI-assisted processing and backend data handling happen through API calls to the backend service.

## What this app does

- Presents a searchable catalogue of UNP+ resources.
- Filters resources by category, language, payment type, and Urban Nature Plan step.
- Uses semantic search to turn a natural language query into relevant keywords.
- Shows resource insights through charts and summary cards.
- Supports manual contribution of new resources through the UI.
- Connects to backend endpoints for resource retrieval, AI-assisted enrichment, voting, reporting, and link checking.
- Provides login-gated actions in the interface.

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- ApexCharts
- Axios
- Zod
- Google GenAI client for AI-related backend integration
- Testing Library and Vitest for tests

## Project Structure

- `src/App.jsx` - main application layout and page state.
- `src/components/` - UI sections such as filters, charts, resource cards, auth, and contribution forms.
- `src/hooks/` - data and AI helper hooks.
- `src/services/api.js` - backend API calls.
- `src/utils/` - constants, knowledge snippets, and SVG pattern helpers.

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app will start with Vite, usually at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm run test
```

## Backend Integration

This frontend expects a backend API to be available. By default, it calls:

```text
http://localhost:8000
```

If your backend is hosted elsewhere, set the environment variable below before starting the app:

```bash
VITE_API_URL=https://your-backend.example.com
```

## Main User Flows

1. Browse the resource catalogue.
2. Filter and sort the available UNP+ entries.
3. Search with keywords or use semantic search for broader queries.
4. Inspect charts and knowledge snippets for quick context.
5. Log in to unlock contribution features.
6. Submit new resources or report bad links through the UI.

## Notes

- AI processing is not executed in this frontend repository.
- The frontend only sends requests to the backend, which performs the AI and data operations.
- Some interface features depend on backend responses being available.

## License

See [LICENSE](LICENSE) for licensing details.
