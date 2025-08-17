import os
from fastapi import Header, HTTPException, status

def require_admin(x_admin_token: str | None = Header(default=None)):
    """
    If ADMIN_TOKEN is set in env, requests must include matching X-Admin-Token header.
    If ADMIN_TOKEN is not set, the guard is disabled (useful for local dev).
    """
    expected = os.getenv("ADMIN_TOKEN")
    if not expected:
        return  # guard off in dev when env not set
    if not x_admin_token or x_admin_token != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin token required",
        )
