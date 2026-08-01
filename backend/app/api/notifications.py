from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..db import models
from ..schemas import schemas
from ..core import security
from ..services import webhook_dispatcher

router = APIRouter(prefix="/notifications", tags=["Notifications"])

# Mock webhook store
MOCK_WEBHOOKS = [
    {
        "id": 1,
        "name": "Slack Hiring Alert Channel",
        "target_url": "https://hooks.slack.com/services/T00/B00/XXXXX",
        "channel_type": "slack",
        "events": ["application.stage_updated", "challenge.submitted", "offer.accepted"],
        "is_active": True,
        "created_at": "2026-06-01T10:00:00"
    },
    {
        "id": 2,
        "name": "Discord Candidate Bot",
        "target_url": "https://discord.com/api/webhooks/12345/abcdef",
        "channel_type": "discord",
        "events": ["candidate.invited"],
        "is_active": True,
        "created_at": "2026-06-15T14:30:00"
    }
]


@router.get("/webhooks")
def list_webhooks(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """List configured webhook endpoints."""
    return MOCK_WEBHOOKS


@router.post("/webhooks/create")
def create_webhook(
    req: schemas.WebhookCreateRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Register a new Slack, Discord, or Custom HTTP Webhook."""
    new_hook = {
        "id": len(MOCK_WEBHOOKS) + 1,
        "name": req.name,
        "target_url": req.target_url,
        "channel_type": req.channel_type or "slack",
        "events": req.events or ["application.stage_updated"],
        "is_active": True,
        "created_at": "2026-07-30T09:20:00"
    }
    MOCK_WEBHOOKS.append(new_hook)
    return new_hook


@router.post("/webhooks/test")
def test_webhook_dispatch(
    webhook_id: int = 1,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Triggers a test payload dispatch to verify webhook connection."""
    target_hook = next((w for w in MOCK_WEBHOOKS if w["id"] == webhook_id), MOCK_WEBHOOKS[0])
    
    test_payload = {
        "message": "Verification test event trigger from ApexTalent AI Platform.",
        "candidate_name": "Aarav Mehta",
        "job_title": "Senior FastAPI Systems Architect",
        "stage": "Interview"
    }
    
    res = webhook_dispatcher.dispatch_webhook_event(
        event_type="test.connection_verified",
        payload=test_payload,
        target_url=target_hook["target_url"],
        channel_type=target_hook["channel_type"]
    )
    return res



@router.get("/", response_model=list[schemas.NotificationResponse])
def get_notifications(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).order_by(models.Notification.created_at.desc()).limit(50).all()


@router.get("/unread-count")
def get_unread_count(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    count = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == False
    ).count()
    return {"unread_count": count}


@router.post("/{notification_id}/read")
def mark_read(
    notification_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"message": "Marked as read"}


@router.post("/read-all")
def mark_all_read(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"message": "All notifications marked as read"}


@router.get("/preferences")
def get_notification_preferences(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve user notification and email preferences."""
    prefs = db.query(models.NotificationPreference).filter(
        models.NotificationPreference.user_id == current_user.id
    ).first()
    if not prefs:
        prefs = models.NotificationPreference(user_id=current_user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
    return prefs


@router.post("/preferences")
def update_notification_preferences(
    req: dict,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Update user notification and email preferences."""
    prefs = db.query(models.NotificationPreference).filter(
        models.NotificationPreference.user_id == current_user.id
    ).first()
    if not prefs:
        prefs = models.NotificationPreference(user_id=current_user.id)
        db.add(prefs)

    for field in ["email_welcome", "email_security", "email_interviews", "email_ai_reports", "email_jobs", "email_hackathons", "email_weekly_digest", "in_app_all"]:
        if field in req:
            setattr(prefs, field, bool(req[field]))

    db.commit()
    db.refresh(prefs)
    return prefs


@router.post("/email/test")
def test_email_template(
    template_type: str = "welcome",
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Triggers an email template test for the logged-in user."""
    from ..services import email_service
    first_name = current_user.email.split("@")[0].capitalize()
    
    if template_type == "welcome":
        res = email_service.send_welcome_email(current_user.email, first_name)
    elif template_type == "project":
        res = email_service.send_project_submitted(current_user.email, first_name, "Apex AI Code Analyzer")
    elif template_type == "ai_report":
        res = email_service.send_ai_evaluation_ready(
            current_user.email, first_name, "Apex AI Microservice Engine", 94.5, "Exemplary", "Clean Async Architecture", "Unit Test Coverage"
        )
    elif template_type == "interview":
        res = email_service.send_interview_scheduled(
            current_user.email, first_name, "Senior Backend Systems Engineer", "ApexTalent Partners", "Tomorrow at 10:00 AM IST", "/candidate?tab=interviews"
        )
    elif template_type == "hackathon":
        res = email_service.send_hackathon_registration(current_user.email, first_name, "HackIndia 2026 AI Innovation Hackathon")
    else:
        res = email_service.send_welcome_email(current_user.email, first_name)

    return {"message": f"Email test '{template_type}' triggered successfully", "dispatch_result": res}

