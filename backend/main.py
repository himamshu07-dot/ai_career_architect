import os
import json
import re
import urllib.request
import urllib.parse
from typing import Optional, List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError(
        "GEMINI_API_KEY is not set. Create a .env file (see .env.example) "
        "and set GEMINI_API_KEY there. Never commit this file or expose the "
        "key to the frontend."
    )

genai.configure(api_key=GEMINI_API_KEY)
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

# Comma-separated list of allowed origins, e.g. "http://localhost:5173,https://yourapp.com"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app = FastAPI(title="AI Career Architect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RoadmapRequest(BaseModel):
    current_role: str
    target_role: str
    experience_level: Optional[str] = "beginner"  # beginner | intermediate | advanced
    hours_per_week: Optional[int] = 10
    focus_areas: Optional[str] = None  # free-text, e.g. "backend, ML"


class RoadmapResponse(BaseModel):
    roadmap: dict


SYSTEM_PROMPT = """You are an expert technical career coach. Given a user's \
current role, target role, and available time, produce a personalised \
4-week roadmap to help them move toward their target role.

Respond with ONLY valid JSON (no markdown fences, no preamble) matching \
this exact shape:

{
  "summary": "1-2 sentence overview of the plan",
  "weekly_hours": 10,
  "weeks": [
    {
      "week": 1,
      "theme": "short theme name",
      "objectives": ["objective 1", "objective 2"],
      "tasks": ["task 1", "task 2", "task 3"],
      "resources": ["resource or topic to study"],
      "milestone": "milestone description"
    }
  ]
}

Produce exactly 4 week objects. Be concrete and specific to the user's \
stated current role, target role, and time budget. Do not include any \
text outside the JSON object."""


def build_user_prompt(req: RoadmapRequest) -> str:
    parts = [
        f"Current role: {req.current_role}",
        f"Target role: {req.target_role}",
        f"Experience level: {req.experience_level}",
        f"Hours available per week: {req.hours_per_week}",
    ]
    if req.focus_areas:
        parts.append(f"Focus areas requested: {req.focus_areas}")
    return "\n".join(parts)


def search_youtube_single(query: str, max_items: int = 4) -> List[Dict]:
    """Fetch search results directly from YouTube and parse actual playlists & video courses."""
    encoded_query = urllib.parse.quote_plus(query)
    url = f"https://www.youtube.com/results?search_query={encoded_query}"
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req, timeout=6).read().decode("utf-8")
    except Exception:
        return []

    m = re.search(r"var ytInitialData = ({.*?});</script>", html)
    if not m:
        return []

    try:
        data = json.loads(m.group(1))
    except Exception:
        return []

    results = []

    def extract_from_item(item):
        if "lockupViewModel" in item:
            lvm = item["lockupViewModel"]
            content_type = lvm.get("contentType", "")
            content_id = lvm.get("contentId", "")

            meta = lvm.get("metadata", {}).get("lockupMetadataViewModel", {})
            title = meta.get("title", {}).get("content", "")

            channel = ""
            description = ""
            meta_parts = (
                meta.get("metadata", {})
                .get("contentMetadataViewModel", {})
                .get("metadataRows", [])
            )
            for row in meta_parts:
                for part in row.get("metadataParts", []):
                    txt = part.get("text", {}).get("content", "")
                    if (
                        not channel
                        and txt
                        and not any(
                            k in txt.lower()
                            for k in [
                                "view",
                                "ago",
                                "course",
                                "playlist",
                                "subscriber",
                                "video",
                            ]
                        )
                    ):
                        channel = txt
                    elif "view" in txt.lower() or "ago" in txt.lower():
                        if not description:
                            description = txt
                        else:
                            description += f" • {txt}"

            if not channel:
                channel = "YouTube Creator"

            thumbnail = None
            ci = lvm.get("contentImage", {})
            if "thumbnailViewModel" in ci:
                sources = (
                    ci["thumbnailViewModel"]
                    .get("image", {})
                    .get("sources", [])
                )
                if sources:
                    thumbnail = sources[-1].get("url")
            elif "collectionThumbnailViewModel" in ci:
                sources = (
                    ci["collectionThumbnailViewModel"]
                    .get("primaryThumbnail", {})
                    .get("thumbnailViewModel", {})
                    .get("image", {})
                    .get("sources", [])
                )
                if sources:
                    thumbnail = sources[-1].get("url")

            is_playlist = "PLAYLIST" in content_type
            if is_playlist:
                res_type = "playlist"
                video_url = f"https://www.youtube.com/playlist?list={content_id}"
                if not thumbnail and content_id:
                    thumbnail = f"https://i.ytimg.com/vi/mqdefault.jpg"
            else:
                res_type = "video"
                video_url = f"https://www.youtube.com/watch?v={content_id}"
                if not thumbnail and content_id:
                    thumbnail = f"https://i.ytimg.com/vi/{content_id}/mqdefault.jpg"

            if title and content_id:
                return {
                    "title": title,
                    "channelTitle": channel,
                    "thumbnail": thumbnail,
                    "url": video_url,
                    "type": res_type,
                    "description": description
                    or (
                        "Complete course playlist"
                        if is_playlist
                        else "In-depth tutorial / lecture"
                    ),
                }

        elif "videoRenderer" in item:
            vr = item["videoRenderer"]
            vid = vr.get("videoId")
            title = (
                vr.get("title", {}).get("runs", [{}])[0].get("text")
                or vr.get("title", {}).get("simpleText", "")
            )
            channel = (
                vr.get("ownerText", {}).get("runs", [{}])[0].get("text")
                or vr.get("shortBylineText", {}).get("runs", [{}])[0].get("text", "")
            )
            thumbs = vr.get("thumbnail", {}).get("thumbnails", [])
            thumb = (
                thumbs[-1].get("url")
                if thumbs
                else f"https://i.ytimg.com/vi/{vid}/mqdefault.jpg"
            )
            return {
                "title": title,
                "channelTitle": channel or "YouTube Creator",
                "thumbnail": thumb,
                "url": f"https://www.youtube.com/watch?v={vid}",
                "type": "video",
                "description": "In-depth video course",
            }

        elif "playlistRenderer" in item:
            pr = item["playlistRenderer"]
            pid = pr.get("playlistId")
            title = (
                pr.get("title", {}).get("simpleText")
                or pr.get("title", {}).get("runs", [{}])[0].get("text", "")
            )
            channel = (
                pr.get("shortBylineText", {}).get("runs", [{}])[0].get("text", "")
            )
            thumbs = pr.get("thumbnails", [{}])[0].get("thumbnails", [])
            thumb = thumbs[-1].get("url") if thumbs else None
            cnt = pr.get("videoCount")
            return {
                "title": title,
                "channelTitle": channel or "YouTube Creator",
                "thumbnail": thumb,
                "url": f"https://www.youtube.com/playlist?list={pid}",
                "type": "playlist",
                "description": (
                    f"Full playlist ({cnt} videos)"
                    if cnt
                    else "Full playlist course"
                ),
            }
        return None

    try:
        sections = (
            data.get("contents", {})
            .get("twoColumnSearchResultsRenderer", {})
            .get("primaryContents", {})
            .get("sectionListRenderer", {})
            .get("contents", [])
        )
        for sec in sections:
            items = sec.get("itemSectionRenderer", {}).get("contents", [])
            for it in items:
                res = extract_from_item(it)
                if res and res not in results:
                    results.append(res)
                    if len(results) >= max_items:
                        break
            if len(results) >= max_items:
                break
    except Exception:
        pass

    return results


def fetch_youtube_resources(
    target_role: str,
    current_role: str,
    hours_per_week: int,
    week_themes: Optional[List[str]] = None,
) -> List[Dict]:
    """Fetch suggested playlists and videos customized to target role and study time."""
    target = (target_role or "").strip()
    if not target:
        return []

    week_themes = week_themes or []
    hours = hours_per_week or 10

    queries = []
    # Queries tailored specifically to user's time availability and targets
    if hours <= 6:
        queries.append(f"{target} crash course playlist")
        queries.append(f"{target} full course")
        queries.append(f"{target} tutorial series playlist")
    elif hours >= 15:
        queries.append(f"{target} full course playlist")
        queries.append(f"{target} complete bootcamp playlist")
        queries.append(f"{target} lectures playlist")
    else:
        queries.append(f"{target} full course playlist")
        queries.append(f"{target} tutorial playlist")
        queries.append(f"{target} course for beginners")

    for theme in week_themes[:2]:
        clean_theme = re.sub(r"[^\w\s]", "", theme).strip()
        if clean_theme and len(clean_theme) > 3:
            queries.append(f"{clean_theme} playlist")

    queries.append(f"{target} playlist")

    all_results = []
    seen_urls = set()

    with ThreadPoolExecutor(max_workers=min(5, len(queries))) as executor:
        futures = {executor.submit(search_youtube_single, q): q for q in queries}
        for future in as_completed(futures):
            try:
                items = future.result()
                for item in items:
                    url = item.get("url")
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        all_results.append(item)
            except Exception:
                pass

    playlists = [r for r in all_results if r.get("type") == "playlist"]
    videos = [r for r in all_results if r.get("type") == "video"]

    selected = []
    selected.extend(playlists[:4])
    for v in videos:
        if len(selected) < 6:
            selected.append(v)
    for p in playlists[4:]:
        if len(selected) < 6:
            selected.append(p)

    return selected[:6]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate-roadmap", response_model=RoadmapResponse)
def generate_roadmap(req: RoadmapRequest):
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        system_instruction=SYSTEM_PROMPT,
    )

    try:
        result = model.generate_content(
            build_user_prompt(req),
            generation_config={
                "response_mime_type": "application/json",
                "temperature": 0.7,
            },
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e}")

    raw_text = result.text.strip()

    try:
        roadmap = json.loads(raw_text)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=502,
            detail="Model did not return valid JSON. Try again.",
        )

    # Extract week themes to personalize YouTube recommendations
    week_themes = []
    if isinstance(roadmap.get("weeks"), list):
        for w in roadmap["weeks"]:
            if isinstance(w, dict) and w.get("theme"):
                week_themes.append(w["theme"])

    # Fetch suggested YouTube playlists and videos tailored to targets and time
    youtube_resources = fetch_youtube_resources(
        target_role=req.target_role,
        current_role=req.current_role,
        hours_per_week=req.hours_per_week or 10,
        week_themes=week_themes,
    )
    roadmap["youtube_resources"] = youtube_resources

    return RoadmapResponse(roadmap=roadmap)

