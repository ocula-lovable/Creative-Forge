"""API v1 routes."""

from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/api/v1", tags=["v1"])


@router.get("/status")
async def get_status() -> Dict[str, str]:
    """Get API status."""
    return {"status": "operational", "version": "1.0.0"}
