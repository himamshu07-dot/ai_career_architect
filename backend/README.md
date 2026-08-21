# AI Career Architect — Backend

FastAPI service that proxies requests to Google's Gemini API. Your Gemini
API key lives here, server-side, and is never sent to the browser.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# then open .env and paste in your real GEMINI_API_KEY
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

Server runs at http://localhost:8000. Check http://localhost:8000/health.

## Endpoint

`POST /api/generate-roadmap`

Request body:
```json
{
  "current_role": "2nd year engineering student",
  "target_role": "Quant researcher",
  "experience_level": "intermediate",
  "hours_per_week": 15,
  "focus_areas": "Python, options pricing, ML"
}
```

Response:
```json
{
  "roadmap": {
    "summary": "...",
    "weeks": [ { "week": 1, "theme": "...", "goals": [...], "tasks": [...], "resources": [...] } ]
  }
}
```

## Connect the frontend

In your Vite React app, call this endpoint instead of Gemini directly:

```js
const res = await fetch("http://localhost:8000/api/generate-roadmap", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    current_role: currentRole,
    target_role: targetRole,
    experience_level: experienceLevel,
    hours_per_week: hoursPerWeek,
    focus_areas: focusAreas,
  }),
});
const data = await res.json();
setRoadmap(data.roadmap);
```

Do **not** put `GEMINI_API_KEY` in the frontend `.env` (as `VITE_...`) —
anything prefixed `VITE_` gets bundled into the shipped JS and is visible
to anyone who opens dev tools. Keep the key only in `backend/.env`.

## Deploying

- Set `GEMINI_API_KEY` as an environment variable on your host (Render,
  Railway, Fly.io, etc.) — don't upload `.env` itself.
- Set `ALLOWED_ORIGINS` to your deployed frontend's real URL once you
  host it, e.g. `ALLOWED_ORIGINS=https://your-app.vercel.app`.
