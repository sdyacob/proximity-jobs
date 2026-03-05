# 📍 ProximityJobs
### Location-Aware Job Board Platform & Chrome Extension

> **Stop applying to jobs you'd never commute to.** ProximityJobs filters job listings by your real-world commute tolerance — not just a pin on a map.

---

## 🚀 What Is ProximityJobs?

ProximityJobs is a **location-first job search platform** that solves the #1 hidden pain point in job hunting: geography mismatch.

| The Problem | The Impact | Our Solution |
|---|---|---|
| 50% of applications become 2+ hour commutes | Hours wasted, candidate burnout | Radius filter shows only reachable jobs |
| 60% of recruiter applications ghost after seeing the location | Pipeline waste, hiring delays | Recruiter sets candidate radius; system enforces it |

---

## ✨ Core Features

### For Job Seekers
- 🗺️ **Interactive Commute Map** — Drag a radius circle on a Mapbox map to define your commute tolerance (5–50 km).
- ⏱️ **Real Commute Times** — See exact driving AND transit times per job, not just "distance as the crow flies."
- 😩 **Commute Misery Score** — A single score (0–10) that summarizes commute pain. Green = Easy, Amber = Moderate, Red = Pain Zone.
- 🔔 **Saved Searches & Email Alerts** — Save a search and get alerts when new nearby jobs arrive.

### For Recruiters
- 📌 **Candidate Radius Enforcement** — Set a radius on your job posting. Candidates outside it are automatically rejected with a clear message.
- 📊 **Applicant Pipeline Dashboard** — See average candidate distance, ghost rates, and application counts per job.
- 💳 **Subscription Tiers** — Starter ($49/mo) or Growth ($149/mo) plans with Stripe billing.

### Chrome Extension
- 🔌 **Works on LinkedIn, Indeed & Naukri** — Overlays commute time badges directly on job cards without leaving the site.
- 🌗 **Driving vs Transit Toggle** — Switch transport modes in the extension popup.
- 🎯 **Shadow DOM Isolation** — Badge injection never breaks the host site's styles.

---

## 🏗️ Architecture Overview

```
proximity-jobs/
│
├── web/                    # Next.js App Router (Frontend)
│   └── src/app/
│       ├── page.tsx        # Job Seeker Map View (Mapbox + Radius Selector)
│       ├── recruiter/      # Recruiter Dashboard & Job Posting
│       ├── pricing/        # Stripe Subscription Tiers
│       └── saved/          # Saved Searches & Alerts
│
├── api/                    # FastAPI Backend (Python)
│   └── app/
│       ├── main.py         # App entrypoint + Router registration
│       ├── routers/
│       │   ├── jobs.py     # GET /jobs (spatial search), GET /jobs/{id}/commute
│       │   └── billing.py  # POST /billing/checkout, POST /billing/webhook
│       ├── schemas/
│       │   └── job.py      # Pydantic data models
│       └── core/
│           ├── commute.py  # Redis caching + Haversine straight-line fallback
│           └── billing.py  # Stripe checkout session creation + webhook handler
│
├── extension/              # Chrome Extension (Manifest V3)
│   ├── manifest.json       # Extension config (LinkedIn, Indeed, Naukri)
│   ├── background.js       # Service Worker — API proxy + Misery Score formula
│   ├── content.js          # DOM MutationObserver + Shadow DOM badge injection
│   ├── popup.html          # Extension popup (radius slider, mode toggle)
│   └── popup.js            # Popup state management via chrome.storage
│
├── docker-compose.yml      # PostgreSQL/PostGIS + Redis local infrastructure
├── .github/workflows/      # GitHub Actions CI/CD
└── README.md               # You are here ✅
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS, Clerk Auth, Mapbox GL JS, Turf.js |
| **Backend** | FastAPI, Python 3.11, Pydantic v2, Uvicorn |
| **Database** | PostgreSQL + PostGIS (`ST_DWithin` spatial queries) |
| **Caching** | Redis (route cache, TTL 24h, keyed by geohash) |
| **Extension** | Chrome Manifest V3, MutationObserver, Shadow DOM |
| **Auth** | Clerk.dev |
| **Payments** | Stripe (Checkout Sessions + Webhooks) |
| **Maps** | Mapbox GL JS (Web) + Google Distance Matrix API (Commute Times) |
| **Infra** | Docker Compose, GitHub Actions, Vercel (Web), Railway (API + DB) |

---

## 🔑 Environment Variables

Create a `.env.local` file inside the `web/` directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Mapbox Maps
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Create a `.env` file inside the `api/` directory:

```env
# PostgreSQL Connection
DATABASE_URL=postgresql://proximity_user:proximity_password@localhost:5432/proximity_jobs

# Redis Connection
REDIS_URL=redis://localhost:6379/0

# Google Maps API (for real commute times in production)
GOOGLE_MAPS_API_KEY=AIza...

# Stripe Billing
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## ⚙️ Local Setup & Running

### Step 1: Start the Database & Redis (via Docker)

> Make sure Docker Desktop is running first.

```bash
docker-compose up -d
```
This will start **PostgreSQL/PostGIS** on port `5432` and **Redis** on port `6379`.

---

### Step 2: Run the FastAPI Backend

```bash
cd api

# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server with hot-reload
uvicorn app.main:app --reload
```

✅ API runs at: **`http://localhost:8000`**  
📄 Swagger Docs: **`http://localhost:8000/docs`**

---

### Step 3: Run the Next.js Frontend

> Open a **new terminal** for this step.

```bash
cd web
npm install
npm run dev
```

✅ Web app runs at: **`http://localhost:3000`**

---

### Step 4: Load the Chrome Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder inside this project

✅ The extension is now active on LinkedIn, Indeed, and Naukri job pages.

---

## 📡 Key API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | API health check |
| `GET` | `/jobs?lat=&lng=&radius_km=&mode=` | Optional | Spatial job search using PostGIS `ST_DWithin` |
| `GET` | `/jobs/{id}/commute?origin_lat=&origin_lng=` | Required | Commute time (cached in Redis, falls back to Haversine) |
| `POST` | `/jobs` | Recruiter | Create a job with geocoded office address & candidate radius |
| `POST` | `/billing/checkout` | Recruiter | Generate a Stripe checkout URL for subscription |
| `POST` | `/billing/webhook` | Stripe | Handle subscription payment events |

---

## 😩 Commute Misery Score Formula

```
Misery = (peak_commute_minutes / 60) × transit_transfers × 1.2
```
- `transit_transfers` defaults to `1` for driving.
- Score is **capped at 10**.

| Score | Label | Badge Color |
|---|---|---|
| 0 – 3.0 | Easy Commute | 🟢 Green `#22C55E` |
| 3.1 – 6.0 | Moderate | 🟡 Amber `#F59E0B` |
| 6.1 – 10.0 | Pain Zone | 🔴 Red `#EF4444` |

---

## 💰 Pricing

| Plan | Who It's For | Price | Key Features |
|---|---|---|---|
| **Job Seeker Free** | All seekers | $0/mo | Radius filter, commute time, misery score |
| **Recruiter Starter** | Startups < 50 people | $49/mo | 3 active jobs, candidate radius, basic analytics |
| **Recruiter Growth** | Mid-size companies | $149/mo | Unlimited jobs, candidate heatmap, ATS integrations |
| **Extension Pro** | Power job hunters | $9/mo | Bulk batch commute calc, CSV export, priority alerts |
| **Enterprise** | Large HR teams | Custom | SSO, bulk posting API, dedicated support, SLA |

---

## 🗺️ Delivery Roadmap

| Phase | Weeks | Deliverables | Status |
|---|---|---|---|
| Phase 0 | Week 1 | Monorepo, Next.js + FastAPI scaffold, Docker Compose, CI/CD | ✅ Done |
| Phase 1A | Weeks 2–3 | Chrome Extension: home pin, distance badge on LinkedIn/Indeed/Naukri | ✅ Done |
| Phase 1B | Week 4 | Extension: commute time overlay, misery score badge, mode toggle | ✅ Done |
| Phase 2A | Weeks 5–7 | Web Platform: Auth (Clerk), job seeker onboarding, Mapbox radius UI | ✅ Done |
| Phase 2B | Weeks 8–10 | Recruiter portal: job posting, geocoding, candidate radius enforcement | ✅ Done |
| Phase 2C | Weeks 11–13 | Commute Engine: Distance Matrix, Redis caching, cost estimator | ✅ Done |
| Phase 3 | Weeks 14–16 | Recruiter dashboard, saved searches, email alerts, Stripe billing | ✅ Done |
| Launch | Week 17 | Product Hunt, LinkedIn build-in-public, press outreach | 🚀 Next |

---

## 🤝 Contributing

This project is built using the **Build In Public** approach as defined in `ProximityJobs PRD v1.0`. All phases and decisions are documented and traceable. Contributions and feedback are welcome!

---

*ProximityJobs PRD | Confidential | v1.0 — Build In Public — Ship It*
