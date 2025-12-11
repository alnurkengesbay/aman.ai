"""
Aman AI Platform - FastAPI Backend
==================================
Main application entry point
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print(f"🚀 Starting Aman AI Backend v{settings.VERSION}")
    yield
    # Shutdown
    print("👋 Shutting down Aman AI Backend")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI Platform for Neurodiagnostics and Rehabilitation",
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "service": "aman-ai-backend",
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Aman AI Platform API",
        "docs": f"{settings.API_V1_STR}/docs",
        "version": settings.VERSION,
    }


