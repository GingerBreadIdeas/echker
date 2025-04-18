from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.api_v1.api import api_router

app = FastAPI(title="Echker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app running on Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}