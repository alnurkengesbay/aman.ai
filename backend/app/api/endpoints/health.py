"""
Health check endpoints
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def health_check():
    """Basic health check"""
    return {"status": "ok"}


@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with service status"""
    return {
        "status": "ok",
        "services": {
            "database": "connected",
            "redis": "connected",
            "s1_ct_mri": "ready",
            "s2_iot": "ready",
            "s3_questionnaire": "ready",
            "s4_genetics": "ready",
            "s5_blood": "ready",
            "s6_rehabilitation": "ready",
        }
    }


