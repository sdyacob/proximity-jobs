from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any

from ..core.billing import create_checkout_session, handle_webhook, SubscriptionTier

router = APIRouter(prefix="/billing", tags=["billing"])

class CheckoutRequest(BaseModel):
    recruiter_id: int
    tier: str

@router.post("/checkout")
def create_checkout(req: CheckoutRequest):
    """Phase 3: Generate a Stripe checkout URL for the recruiter tier"""
    if req.tier not in [SubscriptionTier.STARTER, SubscriptionTier.GROWTH]:
        raise HTTPException(status_code=400, detail="Invalid subscription tier")
        
    try:
        session_data = create_checkout_session(req.recruiter_id, req.tier)
        return {"checkout_url": session_data["url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Phase 3: Webhook receiver for Stripe subscription payments"""
    payload = await request.json()
    sig_header = request.headers.get("stripe-signature", "")
    
    success = handle_webhook(payload, sig_header)
    if success:
        return {"status": "success"}
    else:
        raise HTTPException(status_code=400, detail="Webhook signature verification failed.")
