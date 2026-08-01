"""
ApexTalent AI — Unified Notification & Email Dispatcher Service
Orchestrates In-App Notifications, External Webhooks, and Email Service.
"""

from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from ..db import models
from . import email_service
from . import webhook_dispatcher

class NotificationService:
    """
    Central Manager for dispatching In-App, Email, and Webhook Notifications.
    """

    @staticmethod
    def _get_or_create_preferences(db: Session, user_id: int) -> models.NotificationPreference:
        prefs = db.query(models.NotificationPreference).filter(
            models.NotificationPreference.user_id == user_id
        ).first()
        if not prefs:
            prefs = models.NotificationPreference(user_id=user_id)
            db.add(prefs)
            db.commit()
            db.refresh(prefs)
        return prefs

    @classmethod
    def dispatch_welcome(cls, db: Session, user: models.User, first_name: Optional[str] = None):
        name = first_name or user.email.split("@")[0].capitalize()

        # 1. In-App Notification
        notif = models.Notification(
            user_id=user.id,
            title="Welcome to ApexTalent AI 🚀",
            message="Your account has been created. Complete your profile to boost recruiter matches.",
            notification_type="success",
            action_url="/candidate?tab=profile"
        )
        db.add(notif)
        db.commit()

        # 2. Email Notification (if preference enabled)
        prefs = cls._get_or_create_preferences(db, user.id)
        if prefs.email_welcome:
            email_service.send_welcome_email(user.email, name)

    @classmethod
    def dispatch_application_submitted(cls, db: Session, user: models.User, job_title: str, match_score: float):
        name = user.email.split("@")[0].capitalize()

        # In-App
        notif = models.Notification(
            user_id=user.id,
            title="Application Submitted ✅",
            message=f"You applied to '{job_title}'. Your AI match score is {match_score}%.",
            notification_type="success",
            action_url="/candidate?tab=jobs"
        )
        db.add(notif)
        db.commit()

        # Email
        prefs = cls._get_or_create_preferences(db, user.id)
        if prefs.email_jobs:
            email_service.send_project_submitted(user.email, name, job_title)

    @classmethod
    def dispatch_stage_updated(cls, db: Session, candidate_user: models.User, job_title: str, company_name: str, new_stage: str):
        name = candidate_user.email.split("@")[0].capitalize()

        stage_titles = {
            "shortlisted": "You've Been Shortlisted! 🌟",
            "interview": "Interview Request 📅",
            "offer": "Job Offer Received 🎉",
            "hired": "Welcome Aboard! 🎊"
        }

        # In-App
        notif = models.Notification(
            user_id=candidate_user.id,
            title=stage_titles.get(new_stage, f"Application Stage Updated: {new_stage.title()}"),
            message=f"Your application for {job_title} at {company_name} was updated to {new_stage.upper()}.",
            notification_type="success" if new_stage in ["shortlisted", "offer", "hired"] else "info",
            action_url="/candidate?tab=applications"
        )
        db.add(notif)
        db.commit()

        # Email
        prefs = cls._get_or_create_preferences(db, candidate_user.id)
        if prefs.email_jobs:
            if new_stage == "shortlisted":
                email_service.send_candidate_shortlisted(candidate_user.email, name, job_title, company_name)
            elif new_stage == "interview":
                email_service.send_interview_invitation(candidate_user.email, name, company_name, job_title)

    @classmethod
    def dispatch_recruiter_new_application(cls, db: Session, recruiter_user: models.User, candidate_name: str, job_title: str, app_id: int):
        recruiter_name = recruiter_user.email.split("@")[0].capitalize()

        # In-App
        notif = models.Notification(
            user_id=recruiter_user.id,
            title="New Application Received 🎯",
            message=f"{candidate_name} applied for {job_title}.",
            notification_type="info",
            action_url=f"/recruiter/pipeline?app={app_id}"
        )
        db.add(notif)
        db.commit()

        # Email
        prefs = cls._get_or_create_preferences(db, recruiter_user.id)
        if prefs.email_jobs:
            email_service.send_new_candidate_applied(recruiter_user.email, recruiter_name, candidate_name, job_title, app_id)

    @classmethod
    def dispatch_interview_scheduled(
        cls, db: Session, user: models.User, job_title: str, company_name: str, date_time_str: str, join_url: str
    ):
        name = user.email.split("@")[0].capitalize()

        # In-App
        notif = models.Notification(
            user_id=user.id,
            title=f"Interview Confirmed: {job_title}",
            message=f"Scheduled for {date_time_str} with {company_name}.",
            notification_type="interview",
            action_url=join_url
        )
        db.add(notif)
        db.commit()

        # Email
        prefs = cls._get_or_create_preferences(db, user.id)
        if prefs.email_interviews:
            email_service.send_interview_scheduled(user.email, name, job_title, company_name, date_time_str, join_url)

    @classmethod
    def dispatch_hackathon_registration(cls, db: Session, user: models.User, hackathon_title: str):
        name = user.email.split("@")[0].capitalize()

        # In-App
        notif = models.Notification(
            user_id=user.id,
            title=f"Hackathon Registration Confirmed 🏆",
            message=f"You are registered for '{hackathon_title}'.",
            notification_type="success",
            action_url="/candidate/hackathons"
        )
        db.add(notif)
        db.commit()

        # Email
        prefs = cls._get_or_create_preferences(db, user.id)
        if prefs.email_hackathons:
            email_service.send_hackathon_registration(user.email, name, hackathon_title)
