# AI Career Architect

AI Career Architect is a full-stack career planning application that turns a person's current status, target role, and weekly study capacity into a structured four-week learning roadmap. It uses Google Gemini for personalized planning and enriches the response with relevant YouTube playlists and videos.

**Live frontend:** https://ai-career-architect-eight.vercel.app/

## Features

- Generates a personalized four-week roadmap with Gemini
- Displays objectives, tasks, resources, and milestones for every week
- Creates a downloadable SVG visual roadmap
- Finds YouTube courses and playlists based on the target role and weekly hours
- Includes curated fallback resources for common technology career categories
- Supports printing or saving the generated plan as a PDF
- Runs as a React frontend and FastAPI backend

## Tech stack

- **Frontend:** React 19, Vite 8, Tailwind CSS, custom CSS
- **Backend:** Python, FastAPI, Pydantic, Uvicorn
- **AI:** Google Gemini via `google-generativeai`
- **Resources:** YouTube search integration with curated fallback data
- **Deployment:** Render for the API and static frontend

## Project structure

```text
backend/
  main.py            FastAPI application and Gemini/YouTube integration
  requirements.txt   Python dependencies
  README.md          Backend setup documentation
frontend/
  src/App.jsx        Main React interface and roadmap rendering
  src/main.jsx       React application entry point
  src/index.css      Global styles and Tailwind-generated styles
  package.json       Frontend scripts and dependencies
  vite.config.js     Vite configuration and local API proxy
render.yaml          Render deployment configuration
```

## Local setup

### 1. Configure the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
ALLOWED_ORIGINS=http://localhost:5173
GEMINI_MODEL=gemini-3.6-flash
```

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

Check the API at `http://localhost:8000/health`.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to `http://127.0.0.1:8000` during local development.

## API

### `GET /health`

Checks that the backend is running.

### `POST /api/generate-roadmap`

Request:

```json
{
  "current_role": "Bootcamp graduate with basic Python knowledge",
  "target_role": "Machine Learning Engineer",
  "experience_level": "beginner",
  "hours_per_week": 15,
  "focus_areas": "Python, statistics, machine learning"
}
```

The response contains a four-week roadmap plus a `youtube_resources` array.

## Environment variables

| Variable | Location | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Backend | Authenticates requests to Google Gemini |
| `ALLOWED_ORIGINS` | Backend | Comma-separated CORS origins; defaults to `http://localhost:5173` |
| `GEMINI_MODEL` | Backend | Optional Gemini model override |
| `VITE_API_URL` | Frontend | Optional deployed backend URL; an empty value uses same-origin `/api` |

Never expose `GEMINI_API_KEY` in a Vite environment variable or commit `backend/.env`.

## Build and validation

Frontend:

```bash
cd frontend
npm run build
npm run lint
```

Backend:

```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Deployment

The included `render.yaml` defines separate Render web services for the Python backend and static frontend:

- Backend root: `backend`
- Frontend root: `frontend`
- Backend build: `pip install -r requirements.txt`
- Frontend build: `npm install && npm run build`
- Set `GEMINI_API_KEY` and `VITE_API_URL` in the Render service settings

## License

No license has been specified for this repository.
