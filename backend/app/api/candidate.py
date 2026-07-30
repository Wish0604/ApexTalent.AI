from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ..db.database import get_db
from ..db import models
from ..schemas import schemas
from ..core import security
from ..services import mock_ai_services

router = APIRouter(prefix="/candidate", tags=["Candidate Portal"])


@router.get("/profile", response_model=schemas.CandidateProfileResponse)
def get_candidate_profile(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.CandidateProfile(
            user_id=current_user.id,
            full_name=current_user.email.split("@")[0].capitalize(),
            title="Software Engineering Candidate",
            skills_json=json.dumps(["Python", "SQL", "JavaScript"]),
            projects_json=json.dumps([]),
            education_json=json.dumps([]),
            experience_json=json.dumps([]),
            certifications_json=json.dumps([]),
            achievements_json=json.dumps([]),
            hackathon_results_json=json.dumps([]),
            github_stats_json=json.dumps({}),
            verification_badges_json=json.dumps([])
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.post("/profile/edit", response_model=schemas.CandidateProfileResponse)
def edit_candidate_profile(
    profile_data: schemas.CandidateProfileCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    profile.full_name = profile_data.full_name
    if profile_data.title:       profile.title = profile_data.title
    if profile_data.bio:         profile.bio = profile_data.bio
    if profile_data.location:    profile.location = profile_data.location
    if profile_data.github_username: profile.github_username = profile_data.github_username
    if profile_data.linkedin_url:    profile.linkedin_url = profile_data.linkedin_url
    if profile_data.portfolio_url:   profile.portfolio_url = profile_data.portfolio_url
    if profile_data.availability:    profile.availability = profile_data.availability
    if profile_data.salary_expectation: profile.salary_expectation = profile_data.salary_expectation

    db.commit()
    db.refresh(profile)
    return profile


@router.get("/dashboard")
def get_candidate_dashboard(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Aggregated dashboard payload — profile + jobs + hackathons + interviews + notifications."""
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    jobs = db.query(models.Job).filter(models.Job.is_active == True).limit(6).all()
    hackathons = db.query(models.Hackathon).limit(4).all()
    interviews = db.query(models.Interview).filter(models.Interview.candidate_id == (profile.id if profile else 0)).all()
    notifs = db.query(models.Notification).filter(models.Notification.user_id == current_user.id, models.Notification.is_read == False).count()
    applications = db.query(models.Application).filter(models.Application.candidate_id == (profile.id if profile else 0)).count()

    return {
        "profile_complete": bool(profile and profile.github_username and profile.resume_url),
        "unread_notifications": notifs,
        "total_applications": applications,
        "upcoming_interviews": len([i for i in interviews if i.status == "scheduled"]),
        "active_hackathons": len([h for h in hackathons if h.status == "active"]),
        "profile": profile,
        "recent_jobs_count": len(jobs),
    }


@router.get("/jobs")
def get_matching_jobs(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Returns jobs with semantic AI match score against candidate's profile skills."""
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    skills = json.loads(profile.skills_json) if profile and profile.skills_json else []
    jobs = db.query(models.Job).filter(models.Job.is_active == True).all()

    results = []
    for job in jobs:
        req_skills = json.loads(job.requirements_json) if job.requirements_json else []
        matched = set(s.lower() for s in skills) & set(r.lower() for r in req_skills)
        ratio = len(matched) / max(len(req_skills), 1)
        talent_boost = 10 if (profile and profile.talent_score > 80) else 0
        match_pct = min(100, max(30, int(50 + ratio * 40 + talent_boost)))

        results.append({
            "id": job.id,
            "title": job.title,
            "company_name": job.recruiter.company_name if job.recruiter else "ApexTalent Partner",
            "description": job.description,
            "requirements": req_skills,
            "salary_range": job.salary_range,
            "location": job.location,
            "job_type": job.job_type,
            "experience_level": job.experience_level,
            "remote_type": job.remote_type,
            "match_percentage": match_pct,
            "missing_skills": [s for s in req_skills if s.lower() not in set(sk.lower() for sk in skills)],
        })

    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results


@router.post("/apply/{job_id}", response_model=schemas.ApplicationResponse)
def apply_to_job(
    job_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    existing = db.query(models.Application).filter(
        models.Application.candidate_id == profile.id,
        models.Application.job_id == job_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    req_skills = json.loads(job.requirements_json) if job.requirements_json else []
    cand_skills = json.loads(profile.skills_json) if profile.skills_json else []
    matched = set(s.lower() for s in cand_skills) & set(r.lower() for r in req_skills)
    match_pct = min(100, max(30, int(50 + (len(matched) / max(len(req_skills), 1)) * 40)))

    app = models.Application(
        candidate_id=profile.id,
        job_id=job_id,
        stage="applied",
        match_percentage=match_pct,
        ai_review_notes=f"AI Pre-screening: {match_pct}% match. Skills aligned: {', '.join(matched) or 'None'}."
    )
    db.add(app)
    job.applications_count = (job.applications_count or 0) + 1

    # Notify candidate
    notif = models.Notification(
        user_id=current_user.id,
        title="Application Submitted ✅",
        message=f"You applied to '{job.title}'. Your AI match score is {match_pct}%.",
        notification_type="success",
        action_url=f"/candidate?tab=jobs"
    )
    db.add(notif)
    db.commit()
    db.refresh(app)
    return app


@router.get("/applications")
def get_applications(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        return []

    apps = db.query(models.Application).filter(models.Application.candidate_id == profile.id).all()
    result = []
    for app in apps:
        job = db.query(models.Job).filter(models.Job.id == app.job_id).first()
        result.append({
            "id": app.id,
            "job_id": app.job_id,
            "job_title": job.title if job else "Unknown",
            "company": job.recruiter.company_name if (job and job.recruiter) else "Partner Company",
            "stage": app.stage,
            "match_percentage": app.match_percentage,
            "applied_at": app.applied_at.isoformat(),
        })
    return result


@router.get("/career-guidance")
def get_career_guidance(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    skills = json.loads(profile.skills_json) if profile.skills_json else []
    target = profile.title or "Senior Software Engineer"
    roadmap = mock_ai_services.generate_career_roadmap_mock(skills, target)

    # Persist to career goal
    goal = db.query(models.CareerGoal).filter(models.CareerGoal.candidate_id == profile.id).first()
    if not goal:
        goal = models.CareerGoal(
            candidate_id=profile.id,
            target_role=roadmap["target_role"],
            skill_gaps_json=json.dumps(roadmap["skill_gaps"]),
            learning_roadmap_json=json.dumps(roadmap["learning_roadmap"]),
            certifications_recommended_json=json.dumps(roadmap["recommended_certifications"]),
            progress_percentage=roadmap["progress_percentage"]
        )
        db.add(goal)
    else:
        goal.skill_gaps_json = json.dumps(roadmap["skill_gaps"])
        goal.learning_roadmap_json = json.dumps(roadmap["learning_roadmap"])
        goal.progress_percentage = roadmap["progress_percentage"]
    db.commit()
    return roadmap


@router.get("/hackathons")
def get_available_hackathons(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    hackathons = db.query(models.Hackathon).all()
    results = []
    for h in hackathons:
        results.append({
            "id": h.id,
            "title": h.title,
            "description": h.description,
            "status": h.status,
            "prize_pool": h.prize_pool,
            "max_team_size": h.max_team_size,
            "org_name": h.org.org_name if h.org else "ApexTalent Community",
            "start_date": h.start_date.isoformat() if h.start_date else None,
            "end_date": h.end_date.isoformat() if h.end_date else None,
            "problem_tracks": json.loads(h.problem_tracks_json) if h.problem_tracks_json else [],
        })
    return results


@router.post("/hackathon/{hackathon_id}/join")
def join_hackathon(
    hackathon_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    hackathon = db.query(models.Hackathon).filter(models.Hackathon.id == hackathon_id).first()
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    existing = db.query(models.EventParticipant).filter(
        models.EventParticipant.hackathon_id == hackathon_id,
        models.EventParticipant.candidate_id == profile.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this hackathon")

    participant = models.EventParticipant(hackathon_id=hackathon_id, candidate_id=profile.id)
    db.add(participant)

    notif = models.Notification(
        user_id=current_user.id,
        title=f"Registered for {hackathon.title} 🏆",
        message="You're registered! Watch for team formation updates.",
        notification_type="hackathon",
        action_url="/candidate?tab=hackathons"
    )
    db.add(notif)
    db.commit()
    return {"message": "Successfully registered", "hackathon_id": hackathon_id}


@router.get("/interviews")
def get_interviews(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        return []

    interviews = db.query(models.Interview).filter(models.Interview.candidate_id == profile.id).all()
    return [
        {
            "id": i.id,
            "interview_type": i.interview_type,
            "status": i.status,
            "overall_score": i.overall_score,
            "technical_score": i.technical_score,
            "communication_score": i.communication_score,
            "scheduled_at": i.scheduled_at.isoformat() if i.scheduled_at else None,
            "completed_at": i.completed_at.isoformat() if i.completed_at else None,
        }
        for i in interviews
    ]


# ── Sprint 2: AI Agents Endpoints ─────────────────────────────────────────────

from ..services import ai_agents

@router.post("/resume/generate")
def generate_ats_resume(
    req: schemas.GenerateResumeRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    skills = json.loads(profile.skills_json) if profile.skills_json else []
    projects = json.loads(profile.projects_json) if profile.projects_json else []
    
    profile_data = {
        "full_name": profile.full_name,
        "title": profile.title,
        "talent_score": profile.talent_score,
        "github_username": profile.github_username,
        "linkedin_url": profile.linkedin_url,
        "skills": skills,
        "projects": projects
    }

    result = ai_agents.generate_ats_resume_agent(profile_data, req.target_role or "Software Engineer")
    return result


@router.post("/career/mentor-chat")
def mentor_chat(
    req: schemas.CopilotChatRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    skills = json.loads(profile.skills_json) if (profile and profile.skills_json) else ["Python", "FastAPI"]
    target_role = profile.title if profile else "Developer"

    result = ai_agents.career_mentor_chat_agent(req.message, skills, target_role)
    return result


@router.get("/interview/questions")
def get_interview_questions(
    job_title: str = "Backend Systems Engineer",
    current_user: models.User = Depends(security.get_current_user)
):
    questions = ai_agents.generate_interview_questions_agent(job_title)
    return questions


class AnswerEvalRequest(schemas.BaseModel):
    question: str
    candidate_answer: str
    expected_keywords: list[str]

@router.post("/interview/evaluate-answer")
def evaluate_interview_answer(
    req: AnswerEvalRequest,
    current_user: models.User = Depends(security.get_current_user)
):
    eval_result = ai_agents.evaluate_interview_answer_agent(req.question, req.candidate_answer, req.expected_keywords)
    return eval_result


class CertVerifyReq(schemas.BaseModel):
    cert_title: str
    issuer: str

@router.post("/verification/cert")
def verify_cert(
    req: CertVerifyReq,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    result = ai_agents.verify_certificate_ocr_agent(req.cert_title, req.issuer)
    
    # Update badges
    badges = json.loads(profile.verification_badges_json) if profile.verification_badges_json else []
    if result["badge_awarded"] not in badges:
        badges.append(result["badge_awarded"])
        profile.verification_badges_json = json.dumps(badges)
        profile.authenticity_score = min(100.0, profile.authenticity_score + 5.0)
        db.commit()

    return result

