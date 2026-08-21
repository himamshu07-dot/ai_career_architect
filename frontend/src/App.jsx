import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Gemini REST API — free tier key stored in frontend/.env as VITE_GEMINI_API_KEY
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// Gemini REST API — Backend handles generation now
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Curated YouTube resources (inline — zero API key required)
// ─────────────────────────────────────────────────────────────────────────────
const CURATED = {
  ml: [
    { title: "Neural Networks: Zero to Hero", channelTitle: "Andrej Karpathy", thumbnail: "https://i.ytimg.com/vi/VMj-3S1tku0/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", type: "playlist", description: "Build neural networks from scratch in pure Python — the definitive series" },
    { title: "But what is a neural network?", channelTitle: "3Blue1Brown", thumbnail: "https://i.ytimg.com/vi/aircAruvnKk/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "playlist", description: "Visual deep learning intuition — visually stunning and crystal clear" },
    { title: "Machine Learning Specialization", channelTitle: "DeepLearning.AI", thumbnail: "https://i.ytimg.com/vi/vStJoetOxJg/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI", type: "playlist", description: "Andrew Ng's comprehensive ML specialization lectures" },
    { title: "StatQuest: Machine Learning", channelTitle: "StatQuest with Josh Starmer", thumbnail: "https://i.ytimg.com/vi/Gv9_4yMHFhI/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF", type: "playlist", description: "Statistics & ML explained with clarity" },
    { title: "Python for Machine Learning & Data Science", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/i_LwzRVP7bg/mqdefault.jpg", url: "https://www.youtube.com/watch?v=i_LwzRVP7bg", type: "video", description: "Complete ML with Python, NumPy, pandas, scikit-learn — 10 hours" },
    { title: "Hugging Face NLP Course", channelTitle: "Hugging Face", thumbnail: "https://i.ytimg.com/vi/00GKzGyWFEs/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PLo2EIpI_JMQvWfQndUesu0nPBAtZ9gP1o", type: "playlist", description: "Transformers & NLP with the Hugging Face ecosystem" },
  ],
  web: [
    { title: "JavaScript Full Course for Beginners", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", type: "video", description: "JavaScript fundamentals — 134 interactive exercises" },
    { title: "React Full Course 2024", channelTitle: "Traversy Media", thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/mqdefault.jpg", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8", type: "video", description: "React crash course — components, hooks, state management" },
    { title: "Next.js 14 Full Course", channelTitle: "JavaScript Mastery", thumbnail: "https://i.ytimg.com/vi/wm5gMKuwSYk/mqdefault.jpg", url: "https://www.youtube.com/watch?v=wm5gMKuwSYk", type: "video", description: "Full-stack Next.js with App Router and Server Actions" },
    { title: "CSS Grid & Flexbox", channelTitle: "Kevin Powell", thumbnail: "https://i.ytimg.com/vi/rg7Fvvl3taU/mqdefault.jpg", url: "https://www.youtube.com/watch?v=rg7Fvvl3taU", type: "video", description: "Master modern CSS layouts" },
    { title: "Node.js and Express Full Course", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/Oe421EPjeBE/mqdefault.jpg", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", type: "video", description: "Backend development with Node.js and Express" },
    { title: "TypeScript for Beginners", channelTitle: "Traversy Media", thumbnail: "https://i.ytimg.com/vi/BCg4U1FzODs/mqdefault.jpg", url: "https://www.youtube.com/watch?v=BCg4U1FzODs", type: "video", description: "Complete TypeScript crash course" },
  ],
  data: [
    { title: "Data Analysis with Python", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/r-uOLxNrNk8/mqdefault.jpg", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8", type: "video", description: "NumPy, Pandas, Matplotlib & Seaborn full course" },
    { title: "Pandas Tutorial", channelTitle: "Corey Schafer", thumbnail: "https://i.ytimg.com/vi/ZyhVh-qRZPA/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS", type: "playlist", description: "Complete Pandas for data analysis" },
    { title: "SQL Full Course", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/HXV3zeQKqGY/mqdefault.jpg", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", type: "video", description: "SQL from beginner to advanced — 4.5 hours" },
    { title: "Statistics for Data Science", channelTitle: "StatQuest with Josh Starmer", thumbnail: "https://i.ytimg.com/vi/qBigTkBLU6g/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUiKZ1", type: "playlist", description: "Statistics fundamentals explained visually" },
    { title: "Power BI Full Course", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/NNSHu0rkew8/mqdefault.jpg", url: "https://www.youtube.com/watch?v=NNSHu0rkew8", type: "video", description: "Business Intelligence with Power BI" },
    { title: "Apache Spark Full Course", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/_C8kWso4ne4/mqdefault.jpg", url: "https://www.youtube.com/watch?v=_C8kWso4ne4", type: "video", description: "Big Data processing with Apache Spark" },
  ],
  devops: [
    { title: "Docker Tutorial for Beginners", channelTitle: "TechWorld with Nana", thumbnail: "https://i.ytimg.com/vi/3c-iBn73dDE/mqdefault.jpg", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", type: "video", description: "Complete Docker crash course" },
    { title: "Kubernetes Tutorial", channelTitle: "TechWorld with Nana", thumbnail: "https://i.ytimg.com/vi/X48VuDVv0do/mqdefault.jpg", url: "https://www.youtube.com/watch?v=X48VuDVv0do", type: "video", description: "Full Kubernetes course — pods, deployments, services" },
    { title: "AWS Full Course", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/ulprqHHWlng/mqdefault.jpg", url: "https://www.youtube.com/watch?v=ulprqHHWlng", type: "video", description: "Amazon Web Services fundamentals" },
    { title: "GitHub Actions CI/CD", channelTitle: "TechWorld with Nana", thumbnail: "https://i.ytimg.com/vi/R8_veQiYBjI/mqdefault.jpg", url: "https://www.youtube.com/watch?v=R8_veQiYBjI", type: "video", description: "CI/CD pipelines with GitHub Actions" },
    { title: "Linux Command Line", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/sWbUDq4S6Y8/mqdefault.jpg", url: "https://www.youtube.com/watch?v=sWbUDq4S6Y8", type: "video", description: "Linux terminal & shell scripting" },
    { title: "Terraform Full Course", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/SLB_c_ayRMo/mqdefault.jpg", url: "https://www.youtube.com/watch?v=SLB_c_ayRMo", type: "video", description: "Infrastructure as Code with Terraform" },
  ],
  python: [
    { title: "Python for Everybody", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/8DvywoWv6fI/mqdefault.jpg", url: "https://www.youtube.com/watch?v=8DvywoWv6fI", type: "video", description: "Complete Python with Dr. Chuck — 14 hours" },
    { title: "Python OOP Tutorials", channelTitle: "Corey Schafer", thumbnail: "https://i.ytimg.com/vi/ZDa-Z5JzLYM/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsqhIuOqKhwlXsIBIdSeYtc", type: "playlist", description: "Object-Oriented Programming with Python" },
    { title: "Python Data Structures & Algorithms", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/pkYVOmU3MgA/mqdefault.jpg", url: "https://www.youtube.com/watch?v=pkYVOmU3MgA", type: "video", description: "DSA fundamentals in Python" },
    { title: "FastAPI Tutorial", channelTitle: "Tech With Tim", thumbnail: "https://i.ytimg.com/vi/tLKKmouUams/mqdefault.jpg", url: "https://www.youtube.com/watch?v=tLKKmouUams", type: "video", description: "Build production REST APIs with FastAPI" },
    { title: "Automate the Boring Stuff", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/1F_OgqRuSdI/mqdefault.jpg", url: "https://www.youtube.com/watch?v=1F_OgqRuSdI", type: "video", description: "Python automation — files, PDFs, spreadsheets" },
    { title: "Django Full Course", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/F5mRW0jo-U4/mqdefault.jpg", url: "https://www.youtube.com/watch?v=F5mRW0jo-U4", type: "video", description: "Full-stack web development with Django" },
  ],
  default: [
    { title: "CS50: Intro to Computer Science", channelTitle: "Harvard University", thumbnail: "https://i.ytimg.com/vi/8mAITcNt710/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PLhQjrBD2T382_R182iC2gNZI9HzWFMC_8", type: "playlist", description: "Harvard's legendary intro CS course" },
    { title: "Python for Everybody", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/8DvywoWv6fI/mqdefault.jpg", url: "https://www.youtube.com/watch?v=8DvywoWv6fI", type: "video", description: "Learn Python from zero — universally useful" },
    { title: "Git & GitHub Crash Course", channelTitle: "Traversy Media", thumbnail: "https://i.ytimg.com/vi/SWYqp7iY_Tc/mqdefault.jpg", url: "https://www.youtube.com/watch?v=SWYqp7iY_Tc", type: "video", description: "Version control with Git — every developer needs this" },
    { title: "Data Structures & Algorithms", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/8hly31xKli0/mqdefault.jpg", url: "https://www.youtube.com/watch?v=8hly31xKli0", type: "video", description: "Essential DSA for technical interviews" },
    { title: "SQL Tutorial", channelTitle: "freeCodeCamp.org", thumbnail: "https://i.ytimg.com/vi/HXV3zeQKqGY/mqdefault.jpg", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY", type: "video", description: "SQL from beginner to expert" },
    { title: "System Design Fundamentals", channelTitle: "Gaurav Sen", thumbnail: "https://i.ytimg.com/vi/quLrc3PbuIw/mqdefault.jpg", url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX", type: "playlist", description: "System design for engineering interviews" },
  ],
};

// Each category has its own keyword pattern. Instead of a waterfall of
// if/else checks (where the FIRST matching category always wins even if a
// later one is a stronger fit), we score every category by how many of its
// keywords appear in the role text and pick the best match. This is what
// was causing most target roles to fall through to the same generic
// "default" list — the old patterns were narrow and only the first match
// counted, so anything not explicitly listed (Product Manager, UI/UX
// Designer, Mobile Developer, Cybersecurity Analyst, etc.) always landed on
// the same six default videos regardless of the role entered.
const CATEGORY_PATTERNS = {
  ml: /machine.?learn|\bml\b|deep.?learn|\bai\b|artificial.?intelligence|neural|\bnlp\b|\bllm\b|generative|computer.?vision|reinforcement.?learn|pytorch|tensorflow|data.?scientist/g,
  web: /\bweb\b|frontend|front.?end|react|vue|angular|next\.?js|\bhtml\b|\bcss\b|javascript|typescript|full.?stack|fullstack|ui.?develop/g,
  data: /data.?sci|data.?anal|analytics|tableau|power.?bi|\bbi\b|\betl\b|data.?eng|spark|warehouse|data.?visual|business.?intelligence/g,
  devops: /devops|cloud|\baws\b|azure|\bgcp\b|kubernetes|docker|ci.?cd|\bsre\b|platform.?engineer|infra|site.?reliab/g,
  python: /\bpython\b|backend|back.?end|\bapi\b|django|flask|fastapi|software.?develop|software.?engineer|\bprogrammer\b|\bcoder\b/g,
};

function getCuratedVideos(role) {
  const r = (role || "").trim();
  const lower = r.toLowerCase();

  let bestKey = null;
  let bestScore = 0;
  for (const [key, pattern] of Object.entries(CATEGORY_PATTERNS)) {
    const matches = lower.match(pattern);
    const score = matches ? matches.length : 0;
    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  if (bestKey) return CURATED[bestKey];
  return CURATED.default;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────
function scrollTo(ref) {
  ref?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────────────────────────────────────
function CountUp({ value, suffix = "" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10);
    if (isNaN(end) || end <= 0) return;
    const duration = 1200;
    const step = Math.ceil(duration / end);
    const timer = setInterval(() => {
      start += 1;
      setDisplay(start);
      if (start >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Typing effect
// ─────────────────────────────────────────────────────────────────────────────
function TypedText({ phrases }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const speed = deleting ? 38 : 75;

  useEffect(() => {
    const current = phrases[idx % phrases.length];
    const timer = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setDeleting(true), 1900);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length - 1 === 0) { setDeleting(false); setIdx((i) => (i + 1) % phrases.length); }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, idx, phrases, speed]);

  return (
    <span className="prism-text font-bold">
      {text}<span className="cursor-blink">|</span>
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Prismatic Orb — SVG-based multi-ring holographic sphere
// ─────────────────────────────────────────────────────────────────────────────
function PrismaticOrb() {
  return (
    <div className="orb-container select-none pointer-events-none">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Sphere base gradient — dark navy with subtle highlight */}
          <radialGradient id="sphereBase" cx="34%" cy="27%" r="75%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#cce8ff" stopOpacity="0.22" />
            <stop offset="12%"  stopColor="#2a4a6e" stopOpacity="0.75" />
            <stop offset="48%"  stopColor="#0d1e31" stopOpacity="1" />
            <stop offset="100%" stopColor="#030810" stopOpacity="1" />
          </radialGradient>

          {/* Magenta inner glow */}
          <radialGradient id="sphereMagenta" cx="65%" cy="70%" r="45%">
            <stop offset="0%"   stopColor="#7b2fa0" stopOpacity="0.28" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Ambient blur filter */}
          <filter id="ambientBlur" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <filter id="cyanGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id="magentaGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="4" />
          </filter>

          {/* Clip the "back" halves of rings to sphere interior */}
          <clipPath id="sphereClip">
            <circle cx="200" cy="200" r="152" />
          </clipPath>
        </defs>

        {/* ── Ambient environment glows (behind orb) ──────────── */}
        <ellipse cx="130" cy="330" rx="130" ry="55" fill="#00D4FF" opacity="0.16" filter="url(#ambientBlur)" />
        <ellipse cx="300" cy="95"  rx="90"  ry="120" fill="#FF3CAC" opacity="0.12" filter="url(#ambientBlur)" />
        <ellipse cx="200" cy="200" rx="70"  ry="50"  fill="#F5A623" opacity="0.04" filter="url(#ambientBlur)" />

        {/* ── Main sphere ─────────────────────────────────────── */}
        <circle cx="200" cy="200" r="152" fill="url(#sphereBase)" />
        <circle cx="200" cy="200" r="152" fill="url(#sphereMagenta)" />

        {/* ── Specular highlights ──────────────────────────────── */}
        <ellipse cx="154" cy="146" rx="56" ry="40" fill="white" opacity="0.065" />
        <ellipse cx="143" cy="137" rx="24" ry="17" fill="white" opacity="0.11"  />
        <ellipse cx="138" cy="132" rx="10" ry="7"  fill="white" opacity="0.18"  />

        {/* ── CYAN RING (horizontal tilt — simulates equatorial ring) */}
        {/* Back half — dimmer, inside sphere clip */}
        <ellipse
          cx="200" cy="324" rx="155" ry="36"
          fill="none" stroke="#00D4FF" strokeWidth="2"
          opacity="0.22" clipPath="url(#sphereClip)"
        />
        {/* Front half glow (wide soft blur) */}
        <path
          d="M 45 324 A 155 36 0 0 1 355 324"
          fill="none" stroke="#00D4FF" strokeWidth="12" opacity="0.18"
          filter="url(#cyanGlow)"
          className="orb-ring-cyan"
        />
        {/* Front half main stroke */}
        <path
          d="M 45 324 A 155 36 0 0 1 355 324"
          fill="none" stroke="#00D4FF" strokeWidth="2.8" opacity="0.95"
          className="orb-ring-cyan"
        />
        {/* Bright core highlight */}
        <path
          d="M 45 324 A 155 36 0 0 1 355 324"
          fill="none" stroke="white" strokeWidth="1" opacity="0.5"
          className="orb-ring-cyan"
        />

        {/* ── MAGENTA RING (vertical tilt — simulates polar ring) */}
        {/* Back half — dimmer, inside sphere */}
        <ellipse
          cx="324" cy="200" rx="36" ry="155"
          fill="none" stroke="#FF3CAC" strokeWidth="1.8"
          opacity="0.2" clipPath="url(#sphereClip)"
        />
        {/* Front half glow */}
        <path
          d="M 324 45 A 36 155 0 0 1 324 355"
          fill="none" stroke="#FF3CAC" strokeWidth="10" opacity="0.15"
          filter="url(#magentaGlow)"
          className="orb-ring-magenta"
        />
        {/* Front half main stroke */}
        <path
          d="M 324 45 A 36 155 0 0 1 324 355"
          fill="none" stroke="#FF3CAC" strokeWidth="2.4" opacity="0.9"
          className="orb-ring-magenta"
        />
        {/* Bright core highlight */}
        <path
          d="M 324 45 A 36 155 0 0 1 324 355"
          fill="none" stroke="white" strokeWidth="0.8" opacity="0.4"
          className="orb-ring-magenta"
        />

        {/* ── Subtle inner depth ring ──────────────────────────── */}
        <circle cx="200" cy="200" r="152" fill="none"
          stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx="200" cy="200" r="148" fill="none"
          stroke="rgba(0,212,255,0.06)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Brutalist input field with hairline bottom border
// ─────────────────────────────────────────────────────────────────────────────
function InputField({ id, label, icon, type = "text", placeholder, value, onChange, min }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;

  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className={`block text-[10px] font-semibold uppercase tracking-widest mb-2 transition-colors duration-200 ${
          active ? "text-[#00D4FF]" : "text-[#4B5563]"
        }`}
      >
        <span className="mr-1.5 opacity-70">{icon}</span>{label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        min={min}
        required
        className="input-aether"
        style={{
          borderBottomColor: focused ? "#00D4FF" : "#1E2A38",
          boxShadow: focused ? "0 1px 0 #00D4FF" : "none",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton loader
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="brutalist-card rounded-xl p-6 flex flex-col gap-4">
      <div className="skeleton h-4 w-16 rounded-full" />
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="space-y-2 mt-1">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-5/6 rounded" />
        <div className="skeleton h-3 w-4/6 rounded" />
      </div>
      <div className="space-y-2 mt-1">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
      </div>
      <div className="mt-auto skeleton h-4 w-2/3 rounded" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Week card — brutalist Aether style
// ─────────────────────────────────────────────────────────────────────────────
const WEEK_THEMES = [
  { accent: "#22c55e", badge: "rgba(34,197,94,0.12)",  border: "rgba(34,197,94,0.25)",  pill: "rgba(34,197,94,0.1)"  },
  { accent: "#3b82f6", badge: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.25)", pill: "rgba(59,130,246,0.1)" },
  { accent: "#a855f7", badge: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)", pill: "rgba(168,85,247,0.1)" },
  { accent: "#f97316", badge: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.25)", pill: "rgba(249,115,22,0.1)" },
];

function WeekCard({ weekData, index }) {
  const t = WEEK_THEMES[index % WEEK_THEMES.length];
  const delays = ["delay-0", "delay-100", "delay-200", "delay-300"];

  return (
    <div
      className={`animate-card-in ${delays[index]} week-card rounded-xl flex flex-col gap-4 overflow-hidden`}
      style={{ background: "#0a0f18", border: `1px solid ${t.border}` }}
    >
      {/* Accent top bar */}
      <div style={{ height: "2px", background: `linear-gradient(90deg, ${t.accent}, transparent)` }} />

      <div className="px-5 pb-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span
              className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-sm mb-2"
              style={{ background: t.badge, color: t.accent, border: `1px solid ${t.border}` }}
            >
              ◆ Week {weekData.week}
            </span>
            <h3
              className="text-white font-semibold text-sm leading-snug"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {weekData.theme}
            </h3>
          </div>
          <span className="text-3xl font-black opacity-[0.07] shrink-0" style={{ color: t.accent, fontFamily: "'Space Grotesk', sans-serif" }}>
            {String(weekData.week).padStart(2, "0")}
          </span>
        </div>

        {/* Objectives */}
        <SectionBlock icon="🎯" label="Objectives" items={weekData.objectives} color={t.accent} />
        {/* Tasks */}
        <SectionBlock icon="✅" label="Tasks" items={weekData.tasks} color="rgba(156,163,175,0.9)" />
        {/* Resources */}
        <SectionBlock icon="📚" label="Resources" items={weekData.resources} color="rgba(107,114,128,0.9)" />

        {/* Milestone */}
        <div
          className="mt-auto rounded-lg px-4 py-3"
          style={{ background: t.pill, border: `1px solid ${t.border}` }}
        >
          <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: t.accent, opacity: 0.7 }}>
            🏆 Milestone
          </p>
          <p className="text-xs font-semibold leading-snug text-gray-200">{weekData.milestone}</p>
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ icon, label, items, color }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-2">
        <span>{icon}</span>{label}
      </p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs" style={{ color }}>
            <span className="shrink-0 mt-0.5 opacity-50">▸</span>
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Visual SVG Roadmap — horizontal flow diagram
// ─────────────────────────────────────────────────────────────────────────────
function RoadmapVisual({ weeks, targetRole }) {
  const svgRef = useRef(null);
  const COLORS  = ["#22c55e", "#3b82f6", "#a855f7", "#f97316"];
  const VW = 1000, VH = 370;
  const nodeY  = 200;
  const nodeR  = 46;
  const xs     = [175, 390, 610, 825];

  function truncate(str, n) {
    return str && str.length > n ? str.slice(0, n) + "…" : str;
  }

  function downloadSVG() {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "ai-career-roadmap.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mb-10 animate-fade-up">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="hairline-cyan w-6" style={{ height: "1px" }} />
          <span className="eyebrow">Visual Roadmap</span>
          <div className="hairline-cyan w-6" style={{ height: "1px" }} />
        </div>
        <button
          onClick={downloadSVG}
          className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500 hover:text-[#00D4FF] transition-colors duration-200"
        >
          <span>↓</span> Download SVG
        </button>
      </div>

      {/* SVG diagram */}
      <div className="roadmap-svg-wrapper">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          {/* Background */}
          <rect width={VW} height={VH} fill="#060c16" />

          {/* Subtle grid */}
          <defs>
            <pattern id="rmGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/>
            </pattern>
            {/* Arrow markers */}
            {COLORS.map((c, i) => (
              <marker key={i} id={`arrow${i}`} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M 0 0 L 7 3 L 0 6 Z" fill={c} opacity="0.7" />
              </marker>
            ))}
          </defs>
          <rect width={VW} height={VH} fill="url(#rmGrid)" />

          {/* Header label */}
          <text
            x={VW / 2} y="34"
            textAnchor="middle"
            fill="rgba(107,114,128,0.6)"
            fontSize="9"
            fontWeight="600"
            fontFamily="'DM Sans', sans-serif"
            letterSpacing="3"
          >
            LEARNING ROADMAP — {(targetRole || "YOUR ROLE").toUpperCase()}
          </text>

          {/* Hairline accent under header */}
          <line x1="50" y1="44" x2={VW - 50} y2="44" stroke="rgba(30,42,56,0.8)" strokeWidth="1" />

          {/* Backbone path */}
          <line x1={xs[0]} y1={nodeY} x2={xs[3]} y2={nodeY}
            stroke="rgba(30,42,56,0.6)" strokeWidth="1" strokeDasharray="4 6" />

          {/* Connection arrows between nodes */}
          {xs.slice(0, -1).map((x, i) => (
            <line
              key={i}
              x1={x + nodeR + 6}
              y1={nodeY}
              x2={xs[i + 1] - nodeR - 4}
              y2={nodeY}
              stroke={COLORS[i]}
              strokeWidth="1.5"
              strokeDasharray="5 4"
              markerEnd={`url(#arrow${i})`}
              opacity="0.55"
            />
          ))}

          {/* Week nodes */}
          {weeks.map((week, i) => {
            const cx = xs[i];
            const cy = nodeY;
            const c  = COLORS[i];
            const milestoneText = truncate(week.milestone, 28);
            const themeText     = truncate(week.theme, 22);
            // Split milestone into two lines
            const mWords = milestoneText.split(" ");
            const midIdx = Math.ceil(mWords.length / 2);
            const mLine1 = mWords.slice(0, midIdx).join(" ");
            const mLine2 = mWords.slice(midIdx).join(" ");

            return (
              <g key={i}>
                {/* Glow halo */}
                <circle cx={cx} cy={cy} r={nodeR + 22} fill={c} opacity="0.04" />
                <circle cx={cx} cy={cy} r={nodeR + 10} fill={c} opacity="0.06" />

                {/* Milestone badge */}
                <rect
                  x={cx - 90} y={cy - 110}
                  width={180} height={52}
                  rx="5"
                  fill="#0a1020"
                  stroke={c} strokeWidth="0.8" strokeOpacity="0.4"
                />
                <text x={cx} y={cy - 95} textAnchor="middle"
                  fill={c} fontSize="7.5" fontWeight="700"
                  fontFamily="'DM Sans', sans-serif" letterSpacing="2.5" opacity="0.7"
                >
                  MILESTONE
                </text>
                <text x={cx} y={cy - 80} textAnchor="middle"
                  fill="rgba(200,210,220,0.8)" fontSize="9.5"
                  fontFamily="'DM Sans', sans-serif"
                >
                  {mLine1}
                </text>
                {mLine2 && (
                  <text x={cx} y={cy - 66} textAnchor="middle"
                    fill="rgba(200,210,220,0.8)" fontSize="9.5"
                    fontFamily="'DM Sans', sans-serif"
                  >
                    {mLine2}
                  </text>
                )}

                {/* Connector line badge → node */}
                <line x1={cx} y1={cy - 58} x2={cx} y2={cy - nodeR}
                  stroke={c} strokeWidth="1" strokeDasharray="2 3" opacity="0.3" />

                {/* Outer ring */}
                <circle cx={cx} cy={cy} r={nodeR + 2} fill="none" stroke={c} strokeWidth="0.8" opacity="0.3" />
                {/* Node circle */}
                <circle cx={cx} cy={cy} r={nodeR} fill="#060c16" stroke={c} strokeWidth="2" />
                {/* Week number */}
                <text x={cx} y={cy + 7} textAnchor="middle"
                  fill={c} fontSize="22" fontWeight="800"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {String(week.week).padStart(2, "0")}
                </text>

                {/* Theme label */}
                <text x={cx} y={cy + nodeR + 22} textAnchor="middle"
                  fill="rgba(229,231,235,0.9)" fontSize="12" fontWeight="600"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {themeText}
                </text>
                {/* Week label */}
                <text x={cx} y={cy + nodeR + 40} textAnchor="middle"
                  fill={c} fontSize="8" fontWeight="600"
                  fontFamily="'DM Sans', sans-serif" letterSpacing="2" opacity="0.6"
                >
                  WEEK {week.week}
                </text>
              </g>
            );
          })}

          {/* Bottom hairline */}
          <line x1="50" y1={VH - 24} x2={VW - 50} y2={VH - 24}
            stroke="rgba(30,42,56,0.6)" strokeWidth="1" />
          <text x={VW - 52} y={VH - 10} textAnchor="end"
            fill="rgba(107,114,128,0.35)" fontSize="8"
            fontFamily="'DM Sans', sans-serif" letterSpacing="2"
          >
            AI CAREER ARCHITECT — GEMINI POWERED
          </text>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// YouTube resource card
// ─────────────────────────────────────────────────────────────────────────────
function VideoCard({ video }) {
  const isPlaylist = video.type === "playlist";
  const isSearch = video.type === "search";
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="video-card block rounded-xl overflow-hidden no-underline"
      style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {!imgError && video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #0d1e31, #0a0f18)",
              borderBottom: "1px solid #1E2A38",
            }}
          >
            <span className="text-4xl opacity-30">{isSearch ? "🔎" : isPlaylist ? "📋" : "▶"}</span>
          </div>
        )}
        {/* Play / playlist overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
            style={{ background: "rgba(0,212,255,0.2)", border: "2px solid rgba(0,212,255,0.5)" }}
          >
            {isSearch ? "🔎" : isPlaylist ? "▶▶" : "▶"}
          </div>
        </div>
        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span
            className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
            style={{
              background: isPlaylist ? "rgba(245,166,35,0.2)" : "rgba(0,212,255,0.15)",
              color:      isPlaylist ? "#F5A623" : "#00D4FF",
              border:     `1px solid ${isPlaylist ? "rgba(245,166,35,0.3)" : "rgba(0,212,255,0.25)"}`,
            }}
          >
            {isSearch ? "Search" : isPlaylist ? "Playlist" : "Video"}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-white text-sm font-semibold leading-snug mb-1.5 line-clamp-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {video.title}
        </p>
        <p className="text-[#00D4FF] text-[10px] font-semibold uppercase tracking-wide mb-2 opacity-75">
          {video.channelTitle}
        </p>
        {video.description && (
          <p className="text-gray-500 text-[11px] leading-snug line-clamp-2">{video.description}</p>
        )}
      </div>
    </a>
  );
}

function YouTubeResources({ targetRole, resources }) {
  const videos = (resources && resources.length > 0) ? resources : getCuratedVideos(targetRole);
  const loading = false;
  const error   = null;

  return (
    <div className="mb-12 animate-fade-up">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="hairline-magenta" style={{ width: "32px", height: "1px" }} />
        <div>
          <p className="eyebrow mb-0.5">▶ Learning Resources</p>
          <p className="text-white text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            YouTube Playlists & Courses
          </p>
        </div>
        <div className="flex-1 hairline-full" style={{ height: "1px" }} />
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}>
              <div className="skeleton" style={{ aspectRatio: "16/9" }} />
              <div className="p-4 space-y-2">
                <div className="skeleton h-3 w-5/6 rounded" />
                <div className="skeleton h-3 w-3/4 rounded" />
                <div className="skeleton h-2.5 w-1/3 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl p-4 text-center" style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}>
          <p className="text-gray-500 text-sm">Could not load video resources. Check backend connection.</p>
        </div>
      )}

      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v, i) => <VideoCard key={i} video={v} />)}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary banner
// ─────────────────────────────────────────────────────────────────────────────
function SummaryBanner({ summary, weeklyHours }) {
  return (
    <div className="rounded-xl p-5 mb-8 animate-fade-up relative overflow-hidden"
      style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}
    >
      <div className="hairline-cyan" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      <div className="flex flex-wrap items-center justify-between gap-6 relative">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm shrink-0"
            style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}
          >
            🗺️
          </div>
          <div className="min-w-0">
            <p className="eyebrow mb-1">Roadmap Summary</p>
            <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          {[
            { value: weeklyHours, label: "hrs / week", color: "#00D4FF" },
            { value: 4,           label: "weeks",      color: "#FF3CAC" },
          ].map(({ value, label, color }) => (
            <div key={label} className="rounded-lg px-4 py-3 text-center"
              style={{ background: "#060c16", border: `1px solid ${color}22` }}
            >
              <p className="text-xl font-black" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>
                <CountUp value={value} />
              </p>
              <p className="text-[9px] uppercase tracking-widest mt-0.5 text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step progress dots
// ─────────────────────────────────────────────────────────────────────────────
function StepDots({ active }) {
  const steps = ["Details", "Generate", "Roadmap"];
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-6 h-6 rounded-sm border flex items-center justify-center text-[9px] font-bold transition-all duration-300"
              style={{
                borderColor: i <= active ? "#00D4FF" : "#1E2A38",
                background:  i <= active ? "rgba(0,212,255,0.1)" : "#0a0f18",
                color:       i <= active ? "#00D4FF" : "#374151",
              }}
            >
              {i < active ? "✓" : i + 1}
            </div>
            <span className="text-[8px] uppercase tracking-widest font-semibold"
              style={{ color: i <= active ? "#00D4FF" : "#374151" }}>
              {label}
            </span>
          </div>
          {i < 2 && (
            <div className="w-10 h-px mb-4 transition-all duration-500"
              style={{ background: i < active ? "#00D4FF" : "#1E2A38" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [form, setForm]       = useState({ current_status: "", target_role: "", weekly_hours: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const resultsRef = useRef(null);
  const step = roadmap ? 2 : loading ? 1 : 0;

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRoadmap(null);
    try {
      // Make a request to the backend API via proxy
      const res = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_role: form.current_status,
          target_role: form.target_role,
          hours_per_week: parseInt(form.weekly_hours, 10) || 10,
        }),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload.detail || `Backend error ${res.status}`);
      }

      setRoadmap(payload.roadmap);
      setTimeout(() => scrollTo(resultsRef), 200);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setRoadmap(null);
    setError(null);
    setForm({ current_status: "", target_role: "", weekly_hours: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ background: "#00070A" }}>
      {/* Background grid */}
      <div className="bg-grid absolute inset-0 pointer-events-none" />
      {/* Radial hero glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,212,255,0.05), transparent 60%)" }} />

      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav className="relative z-20 sticky top-0" style={{ borderBottom: "1px solid #1E2A38", background: "rgba(0,7,10,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center text-sm"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}>
              ⚡
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span className="font-black">AI</span> Career Architect
              </h1>
              <p className="text-[9px] text-gray-600 mt-0.5 tracking-wide">Powered by Gemini 2.0 Flash</p>
            </div>
          </div>

          {/* Status + palette strip (small) */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-3">
              {["#00D4FF","#FF3CAC","#F5A623"].map((c) => (
                <div key={c} className="w-2 h-2 rounded-full" style={{ background: c, opacity: 0.7 }} />
              ))}
            </div>
            <div style={{ width: "1px", height: "16px", background: "#1E2A38" }} />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-gray-600 uppercase tracking-widest">Gemini Online</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">

          {/* ── Left: Editorial text ─────────────────────── */}
          <div className="animate-fade-up max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="hairline-cyan" style={{ width: "28px", height: "1px" }} />
              <span className="eyebrow">AI Career Architect — Field Journal</span>
            </div>

            {/* Giant headline */}
            <h2
              className="display-heading text-[clamp(3rem,8vw,5.5rem)] mb-2 text-white leading-[0.95]"
              style={{ letterSpacing: "-0.04em" }}
            >
              <span className="font-black">Build</span>
              <span className="font-light"> Your</span>
              <br />
              <TypedText phrases={["Tech Career","ML Journey","Web Dev Path","Data Science","DevOps Path","AI Engineer"]} />
            </h2>

            {/* Subline — Aether editorial style */}
            <p className="text-base text-gray-400 mt-4 mb-2 italic leading-relaxed max-w-lg"
              style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>
              A new <span className="font-bold not-italic text-[#F2F1EE]">topology</span> of career intelligence.
              Light, decomposed into signal.
            </p>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed max-w-md">
              An AI-powered career planning interface built for precision.
              Tell Gemini where you are — get a personalised, week-by-week roadmap with curated resources.
            </p>

            {/* Stat pills */}
            <div className="flex flex-wrap gap-3 mb-2">
              {[
                { label: "Generated in", value: "~10 sec", color: "#00D4FF" },
                { label: "Plan length",  value: "4 Weeks", color: "#FF3CAC" },
                { label: "Powered by",   value: "Gemini",  color: "#F5A623" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2 rounded-sm px-3 py-2"
                  style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}>
                  <span className="text-[9px] text-gray-600 uppercase tracking-widest">{label}</span>
                  <span style={{ width: "1px", height: "10px", background: "#1E2A38" }} />
                  <span className="text-xs font-bold" style={{ color, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Prismatic orb ────────────────────────── */}
          <div className="hidden lg:flex items-center justify-center" style={{ width: "420px", flexShrink: 0 }}>
            <PrismaticOrb />
          </div>
        </div>

        {/* Hairline separator */}
        <div className="mt-12 hairline-full" style={{ height: "1px" }} />

        {/* ── Capability Showcase Strip ─────────────────────────── */}
        <div className="hidden sm:block">
          {/* 4-column feature grid */}
          <div className="grid grid-cols-4" style={{ borderTop: "1px solid #1E2A38", background: "#070d17" }}>
            {[
              {
                accent: "#00D4FF",
                stat: "~10s",
                icon: "⚡",
                label: "AI Generation",
                sub: "Gemini 2.0 Flash",
                desc: "Personalised roadmap crafted from your background, goals & available hours",
              },
              {
                accent: "#FF3CAC",
                stat: "SVG",
                icon: "🗺",
                label: "Visual Roadmap",
                sub: "Downloadable Diagram",
                desc: "Interactive flow diagram mapping your complete 28-day learning journey",
              },
              {
                accent: "#F5A623",
                stat: "6+",
                icon: "▶",
                label: "Video Resources",
                sub: "YouTube Matched",
                desc: "Curated playlists & courses automatically matched to your exact target role",
              },
              {
                accent: "#a78bfa",
                stat: "4",
                icon: "🎯",
                label: "Structured Weeks",
                sub: "With Milestones",
                desc: "Objectives, daily tasks & milestone checkpoints — one clear goal per week",
              },
            ].map(({ accent, stat, icon, label, sub, desc }, i) => (
              <div
                key={i}
                className="relative p-6 group overflow-hidden transition-all duration-300 cursor-default"
                style={{
                  borderRight: i < 3 ? "1px solid #1E2A38" : "none",
                }}
              >
                {/* Colored top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0"
                  style={{ height: "2px", background: `linear-gradient(90deg, ${accent}, ${accent}44, transparent)` }}
                />
                {/* Hover radial glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 20% 30%, ${accent}12, transparent 65%)` }}
                />
                <div className="relative">
                  {/* Big stat + icon */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span
                      className="text-3xl font-black"
                      style={{ color: accent, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}
                    >
                      {stat}
                    </span>
                    <span className="text-base" style={{ color: `${accent}70` }}>{icon}</span>
                  </div>
                  {/* Label */}
                  <p className="text-sm font-bold text-white mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {label}
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-widest mb-2 font-semibold"
                    style={{ color: accent, opacity: 0.55 }}
                  >
                    {sub}
                  </p>
                  {/* Description */}
                  <p className="text-[10px] text-gray-600 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tech stack row */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-6 py-3"
            style={{ background: "#04080f", borderTop: "1px solid #1E2A38" }}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[9px] text-gray-700 uppercase tracking-widest font-semibold">Stack</span>
              <div style={{ width: "1px", height: "12px", background: "#1E2A38" }} />
              {[
                { name: "Gemini 2.0 Flash", color: "#00D4FF" },
                { name: "FastAPI",           color: "#22c55e" },
                { name: "React 19",          color: "#3b82f6" },
                { name: "Vite 8",            color: "#F5A623" },
                { name: "YouTube API",       color: "#FF3CAC" },
              ].map(({ name, color }) => (
                <span
                  key={name}
                  className="text-[9px] font-semibold px-2 py-0.5 rounded-sm transition-all duration-200 hover:opacity-100"
                  style={{
                    color,
                    background: `${color}12`,
                    border: `1px solid ${color}22`,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] text-gray-700 uppercase tracking-widest font-semibold">Live Demo</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-20">

        {/* Step indicator */}
        <StepDots active={step} />

        {/* ── Form ──────────────────────────────────────────── */}
        {!roadmap && (
          <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mb-16 rounded-xl animate-fade-up relative overflow-hidden"
            style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}
          >
            <div className="hairline-cyan" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
            <div className="p-8 space-y-7">
              <div>
                <p className="eyebrow mb-1">Configure your path</p>
                <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Tell us about yourself
                </h3>
              </div>

              <InputField
                id="current_status"
                label="Current Status"
                icon="👤"
                placeholder="e.g. Bootcamp grad, know Python basics and basic ML"
                value={form.current_status}
                onChange={handleChange}
              />
              <InputField
                id="target_role"
                label="Target Role"
                icon="🎯"
                placeholder="e.g. Machine Learning Engineer at a startup"
                value={form.target_role}
                onChange={handleChange}
              />
              <InputField
                id="weekly_hours"
                label="Weekly Study Hours"
                icon="⏱"
                type="number"
                placeholder="e.g. 15"
                value={form.weekly_hours}
                onChange={handleChange}
                min="1"
              />

              {/* Error */}
              {error && (
                <div className="rounded-lg px-4 py-3.5 flex items-start gap-3 animate-fade-in"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <span className="text-red-400 shrink-0">⚠</span>
                  <div>
                    <p className="text-red-300 font-semibold text-sm">Something went wrong</p>
                    <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                id="generate-roadmap-btn"
                className="btn-primary w-full py-4 rounded-lg text-sm flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="relative flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                        style={{ background: "#00D4FF" }} />
                      <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-[#00D4FF] border-t-transparent animate-spin" />
                    </span>
                    Gemini is crafting your roadmap…
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Generate My Roadmap
                    <span className="ml-auto text-[10px] font-normal text-gray-600 uppercase tracking-widest">Free →</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── Skeleton while loading ─────────────────────────── */}
        {loading && (
          <div className="mb-16 animate-fade-in">
            <p className="text-center text-gray-600 text-sm mb-8">
              🤖 Gemini is analysing your profile and crafting your personalised roadmap…
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* ── Results ───────────────────────────────────────── */}
        {roadmap && (
          <section ref={resultsRef} className="animate-fade-up">

            {/* Success header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="hairline-cyan" style={{ width: "32px", height: "1px" }} />
              <div>
                <p className="eyebrow mb-0.5">✦ Roadmap Ready</p>
                <h3 className="text-white text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Your 4-Week Learning Plan
                </h3>
              </div>
              <div className="flex-1 hairline-full" style={{ height: "1px" }} />
              <button
                onClick={handleReset}
                className="text-[10px] text-gray-600 hover:text-[#00D4FF] uppercase tracking-widest font-semibold transition-colors duration-200"
              >
                ← Reset
              </button>
            </div>

            {/* Summary */}
            <SummaryBanner summary={roadmap.summary} weeklyHours={roadmap.weekly_hours} />

            {/* Visual SVG Roadmap */}
            <RoadmapVisual weeks={roadmap.weeks} targetRole={form.target_role} />

            {/* Week cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
              {roadmap.weeks.map((week, i) => (
                <WeekCard key={week.week} weekData={week} index={i} />
              ))}
            </div>

            {/* Journey progress bar */}
            <div className="rounded-xl p-5 mb-10 animate-fade-up"
              style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Your 28-Day Journey
                </p>
                <span className="text-[10px] uppercase tracking-widest text-gray-600">
                  4 weeks · {roadmap.weekly_hours}h/week
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((w) => (
                  <div key={w} className="flex-1">
                    <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{ background: "#1E2A38" }}>
                      <div
                        className="h-full rounded-full progress-bar"
                        style={{
                          "--bar-width": "100%",
                          background: ["#22c55e","#3b82f6","#a855f7","#f97316"][w-1],
                          animationDelay: `${(w-1)*200}ms`,
                        }}
                      />
                    </div>
                    <p className="text-[8px] text-gray-600 text-center font-semibold uppercase tracking-wider">Wk {w}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* YouTube Resources */}
            <YouTubeResources targetRole={form.target_role} resources={roadmap.youtube_resources} />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleReset}
                className="rounded-lg py-3 px-8 text-sm font-semibold transition-all duration-200 text-gray-400 hover:text-white"
                style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}
              >
                ← Generate Another Roadmap
              </button>
              <button
                onClick={() => window.print()}
                className="rounded-lg py-3 px-8 text-sm font-semibold transition-all duration-200 text-gray-400 hover:text-[#00D4FF]"
                style={{ background: "#0a0f18", border: "1px solid #1E2A38" }}
              >
                🖨 Print / Save as PDF
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="relative z-10 mt-8" style={{ borderTop: "1px solid #1E2A38" }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>AI</span>
            <span className="text-sm font-light text-gray-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Career Architect</span>
          </div>
          <p className="text-[10px] text-gray-700 uppercase tracking-widest">
            FastAPI · React · Google Gemini 2.0 Flash
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-gray-700 uppercase tracking-widest">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
