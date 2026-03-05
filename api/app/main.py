from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ProximityJobs API",
    description="Backend services for ProximityJobs platform",
    version="1.0.0"
)

# Set up CORS for the Next.js frontend and Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routers import jobs, billing
app.include_router(jobs.router)
app.include_router(billing.router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "ProximityJobs API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
