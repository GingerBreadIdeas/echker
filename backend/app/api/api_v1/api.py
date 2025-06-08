from fastapi import APIRouter

from .endpoints import users, auth, api, chat, visualization, prompt_check

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(api.router, prefix="/api", tags=["api"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(visualization.router, prefix="/visualization", tags=["visualization"])
api_router.include_router(prompt_check.router, tags=["prompt_check"])
