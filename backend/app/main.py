from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import tickets, sites, dashboard
from app.routes.tickets import router as ticket_router
from app.routes.sites import router as site_router


app = FastAPI(
    title="SupportGraph API",
    description="Support investigation API powered by CognoDB",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://support-graph.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ticket_router)
app.include_router(site_router)
app.include_router(dashboard.router)


@app.get("/")
def root():
    return {
        "message": "SupportGraph API is running"
    }