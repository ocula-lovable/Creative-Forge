"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BaseSchema(BaseModel):
    """Base schema with common fields."""

    class Config:
        """Pydantic config."""
        from_attributes = True


class HealthCheckResponse(BaseSchema):
    """Health check response schema."""

    status: str
    service: str
    timestamp: Optional[datetime] = None
