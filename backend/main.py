"""FastAPI main application entry point for Creative-Forge backend."""

import os
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Initialize FastAPI application
app = FastAPI(
    title="Creative-Forge API",
    description="Backend API for Creative-Forge application",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Execute on application startup."""
    print("Application started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    """Execute on application shutdown."""
    print("Application shutting down")


@app.get("/")
async def root() -> Dict[str, Any]:
    """Root endpoint returning API information."""
    return {
        "message": "Welcome to Creative-Forge API",
        "status": "operational",
        "version": "1.0.0",
        "docs_url": "/api/docs",
    }


@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "service": "Creative-Forge API"}


@app.get("/api/v1/")
async def api_v1_root() -> Dict[str, str]:
    """API v1 root endpoint."""
    return {"message": "Creative-Forge API v1", "status": "ready"}


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code},
    )


if __name__ == "__main__":
    # Development server configuration
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    reload = os.getenv("API_RELOAD", "true").lower() == "true"

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info",
    )
