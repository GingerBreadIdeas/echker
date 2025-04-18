from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .api.api_v1.api import api_router
from .core.config import settings
from .db.database import Base, engine, get_db
from .db.init_db import init_db

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mlechker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}


# Initialize database with test data
@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    init_db(db)