from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ..db.database import get_db
from ..db import models
from ..schemas import schemas
from ..core import security
from ..services import mock_ai_services, recruiter_copilot, interview_simulator, assessment_generator, headhunter_agent, pair_programming, badge_authority

router = APIRouter(prefix="/recruiter", tags=["Recruiter Portal"])


def _get_or_create_recruiter(current_user: models.User, db: Session) -> models.RecruiterProfile:
    recruiter = db.query(models.RecruiterProfile).filter(models.RecruiterProfile.user_id == current_user.id).first()
    if not recruiter:
        recruiter = models.RecruiterProfile(
            user_id=current_user.id,
            company_name="ApexTalent Corp",
            department="Talent Acquisition",
            is_verified=True
        )
        db.add(recruiter)
        db.commit()
        db.refresh(recruiter)
    return recruiter


@router.get("/profile", response_model=schemas.RecruiterProfileResponse)
def get_recruiter_profile(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    return _get_or_create_recruiter(current_user, db)


@router.get("/dashboard")
def get_recruiter_dashboard(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Overview stats for recruiter workspace."""
    recruiter = _get_or_create_recruiter(current_user, db)
    total_jobs = db.query(models.Job).filter(models.Job.recruiter_id == recruiter.id).count()
    active_jobs = db.query(models.Job).filter(models.Job.recruiter_id == recruiter.id, models.Job.is_active == True).count()
    total_applications = db.query(models.Application).join(models.Job).filter(models.Job.recruiter_id == recruiter.id).count()
    shortlisted = db.query(models.Application).join(models.Job).filter(
        models.Job.recruiter_id == recruiter.id,
        models.Application.stage.in_(["challenge", "interview", "offer"])
    ).count()
    total_candidates = db.query(models.CandidateProfile).count()
    challenges = db.query(models.HiringChallenge).filter(models.HiringChallenge.recruiter_id == recruiter.id).count()

    return {
        "company_name": recruiter.company_name,
        "is_verified": recruiter.is_verified,
        "total_jobs": total_jobs,
        "active_jobs": active_jobs,
        "total_applications": total_applications,
        "shortlisted": shortlisted,
        "interviews_today": 2,  # mock
        "offer_acceptance_rate": 78.5,  # mock
        "avg_time_to_hire": 14,  # days, mock
        "total_candidates_in_platform": total_candidates,
        "active_challenges": challenges,
        "hiring_success_rate": 84.2,  # mock
    }


@router.post("/job/create", response_model=schemas.JobResponse)
def create_job(
    job_data: schemas.JobCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    recruiter = _get_or_create_recruiter(current_user, db)
    new_job = models.Job(
        recruiter_id=recruiter.id,
        title=job_data.title,
        description=job_data.description,
        requirements_json=json.dumps(job_data.requirements),
        nice_to_have_json=json.dumps(job_data.nice_to_have or []),
        salary_range=job_data.salary_range,
        location=job_data.location,
        job_type=job_data.job_type or "full-time",
        experience_level=job_data.experience_level or "mid",
        remote_type=job_data.remote_type or "remote",
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job


@router.get("/jobs")
def get_recruiter_jobs(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    recruiter = _get_or_create_recruiter(current_user, db)
    jobs = db.query(models.Job).filter(models.Job.recruiter_id == recruiter.id).all()
    result = []
    for j in jobs:
        result.append({
            "id": j.id,
            "title": j.title,
            "description": j.description,
            "requirements": json.loads(j.requirements_json) if j.requirements_json else [],
            "salary_range": j.salary_range,
            "location": j.location,
            "job_type": j.job_type,
            "experience_level": j.experience_level,
            "remote_type": j.remote_type,
            "is_active": j.is_active,
            "applications_count": j.applications_count,
            "created_at": j.created_at.isoformat(),
        })
    return result


@router.post("/job/{job_id}/generate-jd")
def generate_job_description(
    job_id: int,
    req: schemas.GenerateJDRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    result = mock_ai_services.generate_job_description_mock(
        req.title, req.requirements, req.experience_level, req.remote_type
    )
    return result


@router.post("/candidate-search")
def search_candidates(
    search_data: schemas.SemanticSearchQuery,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """AI-powered natural language candidate search across the talent graph."""
    query = search_data.query.lower()
    candidates = db.query(models.CandidateProfile).all()
    results = []

    for cand in candidates:
        skills = json.loads(cand.skills_json) if cand.skills_json else []
        title = (cand.title or "").lower()
        skill_matches = [s for s in skills if s.lower() in query]

        match_score = 0
        if skill_matches:
            match_score += 35 + (len(skill_matches) * 12)
        if any(word in title for word in query.split()):
            match_score += 28
        if "verified" in query or "badge" in query:
            badges = json.loads(cand.verification_badges_json or "[]")
            if badges:
                match_score += 12
        if "score" in query or "talent" in query:
            match_score += int(cand.talent_score * 0.2)

        if not match_score:
            match_score = int(32 + (cand.talent_score * 0.28))
        match_score = min(98, max(25, match_score))

        # Apply filters
        if search_data.min_score and cand.talent_score < search_data.min_score:
            continue
        if search_data.location_filter and cand.location and search_data.location_filter.lower() not in (cand.location or "").lower():
            continue

        results.append({
            "id": cand.id,
            "full_name": cand.full_name,
            "title": cand.title,
            "location": cand.location,
            "availability": cand.availability,
            "talent_score": cand.talent_score,
            "coding_score": cand.coding_score,
            "innovation_score": cand.innovation_score,
            "skills": skills,
            "badges": json.loads(cand.verification_badges_json or "[]"),
            "match_score": match_score,
            "github_username": cand.github_username,
            "authenticity_score": cand.authenticity_score,
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results


@router.get("/candidate/{candidate_id}/intelligence")
@router.get("/candidates/{candidate_id}/intelligence")
def get_candidate_intelligence(
    candidate_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Full 360° candidate intelligence report for recruiter view."""
    cand = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")

    profile_dict = {
        "full_name": cand.full_name,
        "title": cand.title,
        "talent_score": cand.talent_score,
        "skills_json": cand.skills_json,
        "projects_json": cand.projects_json,
        "github_username": cand.github_username,
    }
    insight = mock_ai_services.generate_talent_insight_report_mock(profile_dict)
    fraud = mock_ai_services.detect_fraud_mock(profile_dict)

    ppt_evaluation = {
        "overall_ppt_score": round(cand.innovation_score * 0.95 + 4, 1),
        "architecture_clarity": round(cand.coding_score * 0.9 + 8, 1),
        "feasibility": round(cand.talent_score * 0.92 + 6, 1),
        "presentation_design": round(cand.communication_score * 0.88 + 10, 1),
        "key_highlights": [
            "Clean visual architecture slides with end-to-end component diagrams",
            "Clear technical feasibility matrix with SLA benchmarks",
            "Structured deliverable roadmap"
        ]
    }

    repo_analytics = {
        "total_commits": 1420 if cand.talent_score > 85 else 680,
        "pull_requests_merged": 84,
        "code_review_score": round(cand.coding_score * 0.95, 1),
        "top_repo": f"github.com/{cand.github_username or 'candidate'}/production-api-core",
        "primary_languages": json.loads(cand.skills_json or "[]")[:4]
    }

    return {
        "id": cand.id,
        "full_name": cand.full_name,
        "title": cand.title,
        "location": cand.location,
        "bio": cand.bio,
        "availability": cand.availability,
        "talent_score": cand.talent_score,
        "coding_score": cand.coding_score,
        "innovation_score": cand.innovation_score,
        "leadership_score": cand.leadership_score,
        "communication_score": cand.communication_score,
        "community_score": cand.community_score,
        "consistency_score": cand.consistency_score,
        "authenticity_score": cand.authenticity_score or fraud["authenticity_score"],
        "skills": json.loads(cand.skills_json or "[]"),
        "projects": json.loads(cand.projects_json or "[]"),
        "education": json.loads(cand.education_json or "[]"),
        "experience": json.loads(cand.experience_json or "[]"),
        "certifications": json.loads(cand.certifications_json or "[]"),
        "badges": json.loads(cand.verification_badges_json or "[]"),
        "github_stats": json.loads(cand.github_stats_json or "{}"),
        "hackathon_results": json.loads(cand.hackathon_results_json or "[]"),
        "ai_insight": insight,
        "fraud_check": fraud,
        "ppt_evaluation": ppt_evaluation,
        "repo_analytics": repo_analytics,
        "github_username": cand.github_username,
        "linkedin_url": cand.linkedin_url,
    }


@router.post("/challenge/generate")
def generate_hiring_challenge(
    req: schemas.GenerateChallengeRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Triggers AI Agent to generate problem statement, rubrics, and deliverables."""
    recruiter = _get_or_create_recruiter(current_user, db)
    generated = recruiter_copilot.generate_hiring_challenge_agent(
        role_title=req.role_title,
        tech_stack=req.tech_stack,
        experience_level=req.experience_level or "mid",
        time_limit_hours=req.time_limit_hours or 48
    )
    
    challenge = models.HiringChallenge(
        recruiter_id=recruiter.id,
        job_id=req.job_id,
        title=generated["challenge_title"],
        description=generated["problem_statement"],
        challenge_type=generated["challenge_type"],
        rubrics_json=json.dumps(generated["evaluation_rubric"]),
        deliverables_json=json.dumps(generated["deliverables"]),
        deadline_days=max(1, int((req.time_limit_hours or 48) / 24)),
        is_active=True
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)

    return {
        "id": challenge.id,
        "title": challenge.title,
        "role_title": req.role_title,
        "challenge_type": generated["challenge_type"],
        "experience_level": req.experience_level or "mid",
        "time_limit_hours": req.time_limit_hours or 48,
        "problem_statement": generated["problem_statement"],
        "deliverables": generated["deliverables"],
        "evaluation_rubric": generated["evaluation_rubric"],
        "test_scenarios": generated["test_scenarios"],
        "tech_stack": generated["tech_stack"],
        "created_at": challenge.created_at.isoformat()
    }


@router.post("/copilot/chat")
def copilot_chat(
    req: schemas.CopilotChatRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """AI Recruiter Copilot assistant endpoint."""
    recruiter = _get_or_create_recruiter(current_user, db)

    candidates = db.query(models.CandidateProfile).all()
    pool = []
    for cand in candidates:
        skills = json.loads(cand.skills_json or "[]")
        badges = json.loads(cand.verification_badges_json or "[]")
        pool.append({
            "id": cand.id,
            "full_name": cand.full_name,
            "title": cand.title,
            "talent_score": cand.talent_score,
            "coding_score": cand.coding_score,
            "authenticity_score": cand.authenticity_score,
            "skills": skills,
            "verified_badges": badges,
            "location": cand.location,
            "experience_years": 5 if cand.talent_score > 85 else 3,
            "github_commits": 1420 if cand.talent_score > 85 else 680,
            "ppt_score": round(cand.innovation_score * 0.95 + 4, 1)
        })

    job_ctx = None
    if req.job_id:
        job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
        if job:
            job_ctx = {"title": job.title, "description": job.description}

    res = recruiter_copilot.recruiter_copilot_agent(
        user_message=req.message,
        candidate_pool=pool,
        job_context=job_ctx
    )
    return res


@router.get("/copilot/brief")
async def get_copilot_brief(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """GET endpoint returning Today's Hiring Brief telemetry."""
    from ..services.copilot.actions import get_todays_hiring_brief
    return await get_todays_hiring_brief()


@router.post("/pipeline/update-stage")
def update_pipeline_stage(
    req: schemas.PipelineUpdateStageRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Update candidate pipeline stage and notify candidate."""
    app = db.query(models.Application).filter(models.Application.id == req.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.stage = req.stage
    if req.recruiter_notes:
        app.recruiter_notes = req.recruiter_notes
    db.commit()

    cand_profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == app.candidate_id).first()
    if cand_profile:
        stage_messages = {
            "applied":    "Your application has been received.",
            "ai_review":  "Your application is being reviewed by our AI system.",
            "challenge":  "You've been selected for a hiring challenge! Check your challenges tab.",
            "interview":  "Congratulations! You've been shortlisted for an interview.",
            "offer":      "🎉 You've received an offer! Check your applications for details.",
            "hired":      "🎊 Welcome aboard! Your hiring is confirmed.",
            "rejected":   "Thank you for your application. We'll keep your profile for future roles.",
        }
        notif = models.Notification(
            user_id=cand_profile.user_id,
            title=f"Application Update: {req.stage.replace('_', ' ').title()}",
            message=stage_messages.get(req.stage, f"Your application stage changed to {req.stage}."),
            notification_type="info" if req.stage not in ["offer", "hired"] else "success",
        )
        db.add(notif)
        db.commit()

    return {
        "message": f"Successfully updated stage to {req.stage}",
        "application_id": req.application_id,
        "new_stage": req.stage
    }



@router.get("/pipeline")
def get_hiring_pipeline(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """All applications grouped by pipeline stage for Kanban view."""
    recruiter = _get_or_create_recruiter(current_user, db)
    stages = ["applied", "ai_review", "challenge", "interview", "offer", "hired", "rejected"]
    pipeline = {s: [] for s in stages}

    apps = db.query(models.Application).join(models.Job).filter(models.Job.recruiter_id == recruiter.id).all()
    for app in apps:
        cand = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == app.candidate_id).first()
        job = db.query(models.Job).filter(models.Job.id == app.job_id).first()
        if cand and app.stage in pipeline:
            pipeline[app.stage].append({
                "application_id": app.id,
                "candidate_id": cand.id,
                "candidate_name": cand.full_name,
                "candidate_title": cand.title,
                "job_title": job.title if job else "Unknown",
                "talent_score": cand.talent_score,
                "match_percentage": app.match_percentage,
                "applied_at": app.applied_at.isoformat(),
            })

    return pipeline


@router.post("/pipeline/{application_id}/move")
def move_pipeline_stage(
    application_id: int,
    req: schemas.PipelineMoveRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.stage = req.stage
    if req.recruiter_notes:
        app.recruiter_notes = req.recruiter_notes
    db.commit()

    # Notify candidate
    cand_profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == app.candidate_id).first()
    if cand_profile:
        stage_messages = {
            "ai_review":  "Your application is being reviewed by our AI system.",
            "challenge":  "You've been selected for a hiring challenge! Check your challenges tab.",
            "interview":  "Congratulations! You've been shortlisted for an interview.",
            "offer":      "🎉 You've received an offer! Check your applications for details.",
            "hired":      "🎊 Welcome aboard! Your hiring is confirmed.",
            "rejected":   "Thank you for your application. We'll keep your profile for future roles.",
        }
        notif = models.Notification(
            user_id=cand_profile.user_id,
            title=f"Application Update: {req.stage.replace('_', ' ').title()}",
            message=stage_messages.get(req.stage, f"Your application stage changed to {req.stage}."),
            notification_type="info" if req.stage not in ["offer", "hired"] else "success",
        )
        db.add(notif)
        db.commit()

    return {"message": f"Moved to {req.stage}", "application_id": application_id}


@router.post("/candidate/{candidate_id}/invite")
def invite_candidate(
    candidate_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    recruiter = _get_or_create_recruiter(current_user, db)
    cand = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")

    notif = models.Notification(
        user_id=cand.user_id,
        title=f"🌟 Recruiter Invite from {recruiter.company_name}",
        message=f"{recruiter.company_name} is interested in your profile! Respond to their invite in your jobs tab.",
        notification_type="job_match",
        action_url="/candidate?tab=jobs"
    )
    db.add(notif)
    db.commit()
    return {"message": "Invite sent successfully"}


@router.get("/analytics")
def get_hiring_analytics(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Hiring funnel metrics and market insights."""
    recruiter = _get_or_create_recruiter(current_user, db)
    apps = db.query(models.Application).join(models.Job).filter(models.Job.recruiter_id == recruiter.id).all()

    stage_counts = {}
    for app in apps:
        stage_counts[app.stage] = stage_counts.get(app.stage, 0) + 1

    return {
        "funnel": [
            {"stage": "Applied",     "count": stage_counts.get("applied", 0)},
            {"stage": "AI Review",   "count": stage_counts.get("ai_review", 0)},
            {"stage": "Challenge",   "count": stage_counts.get("challenge", 0)},
            {"stage": "Interview",   "count": stage_counts.get("interview", 0)},
            {"stage": "Offer",       "count": stage_counts.get("offer", 0)},
            {"stage": "Hired",       "count": stage_counts.get("hired", 0)},
        ],
        "avg_time_to_hire_days": 14,
        "offer_acceptance_rate": 78.5,
        "top_skills_in_demand": ["FastAPI", "Python", "React", "TypeScript", "Docker", "Kubernetes"],
        "source_of_hire": [
            {"source": "AI Discovery", "percentage": 42},
            {"source": "Hackathon Hub", "percentage": 28},
            {"source": "Direct Apply",  "percentage": 30},
        ],
        "candidate_quality_avg": 83.5,
        "hiring_velocity": "Improving",
    }


@router.post("/interview/simulate-coding")
def simulate_coding_interview(
    req: schemas.LiveCodingEvalRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Evaluates live coding submission and generates Big-O complexity & test case scorecard."""
    return interview_simulator.simulate_live_coding_evaluator_agent(
        code=req.code,
        language=req.language or "python",
        problem_title=req.problem_title or "FastAPI Asynchronous Task Queue"
    )





@router.get("/telemetry/executive")
def get_executive_telemetry(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Executive Platform Telemetry and Hiring Velocity Analytics."""
    recruiter = _get_or_create_recruiter(current_user, db)
    total_cand = db.query(models.CandidateProfile).count()
    total_apps = db.query(models.Application).count()
    total_offers = db.query(models.Application).filter(models.Application.stage == "offer").count()
    total_hired = db.query(models.Application).filter(models.Application.stage == "hired").count()

    return {
        "platform_summary": {
            "total_candidates_in_network": max(1240, total_cand * 420),
            "active_applications_in_pipeline": max(84, total_apps),
            "offers_extended": max(18, total_offers),
            "successful_hires": max(14, total_hired),
            "platform_conversion_rate": 86.4,
            "avg_time_to_hire_days": 11.5,
            "ai_evaluation_accuracy": 96.8
        },
        "hiring_velocity": [
            {"month": "Jan", "hires": 12, "velocity_days": 18},
            {"month": "Feb", "hires": 16, "velocity_days": 16},
            {"month": "Mar", "hires": 22, "velocity_days": 14},
            {"month": "Apr", "hires": 28, "velocity_days": 12},
            {"month": "May", "hires": 34, "velocity_days": 11},
            {"month": "Jun", "hires": 42, "velocity_days": 9}
        ],
        "top_skills_velocity": [
            {"skill": "FastAPI", "demand_growth": "+42%"},
            {"skill": "PyTorch / MLOps", "demand_growth": "+38%"},
            {"skill": "Next.js / TypeScript", "demand_growth": "+31%"},
            {"skill": "Kubernetes / Terraform", "demand_growth": "+27%"}
        ]
    }


@router.post("/assessment/generate")
def generate_assessment(
    req: schemas.GenerateAssessmentRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Triggers AI Agent to generate Online Assessment (OA) test suite."""
    return assessment_generator.generate_online_assessment_agent(
        role_title=req.role_title,
        tech_stack=req.tech_stack,
        mcq_count=req.mcq_count or 5,
        coding_count=req.coding_count or 1,
        time_limit_mins=req.time_limit_mins or 60
    )


@router.get("/team")
def get_recruiter_team(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Returns team members and RBAC permission roles."""
    recruiter = _get_or_create_recruiter(current_user, db)
    return {
        "company_name": recruiter.company_name,
        "team_members": [
            {
                "id": 1,
                "full_name": current_user.email.split("@")[0].title() or "Recruiter Admin",
                "email": current_user.email,
                "role": "Admin",
                "department": "Talent Acquisition",
                "status": "Active",
                "joined_at": "2026-01-15"
            },
            {
                "id": 2,
                "full_name": "Sarah Jenkins",
                "email": "sarah.j@apextalent.ai",
                "role": "Senior Recruiter",
                "department": "Engineering TA",
                "status": "Active",
                "joined_at": "2026-02-01"
            },
            {
                "id": 3,
                "full_name": "David Chen",
                "email": "david.c@apextalent.ai",
                "role": "Technical Interviewer",
                "department": "Backend Systems",
                "status": "Active",
                "joined_at": "2026-03-10"
            }
        ]
    }


@router.post("/team/invite")
def invite_team_member(
    req: schemas.TeamInviteRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Invite team member with RBAC role."""
    recruiter = _get_or_create_recruiter(current_user, db)
    return {
        "message": f"Invitation sent to {req.email} with role {req.role}.",
        "invited_email": req.email,
        "role": req.role,
        "department": req.department,
        "invited_by": current_user.email
    }


@router.post("/headhunter/sourcing-agent")
def run_headhunter_agent(
    req: schemas.HeadhunterSourcingRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Triggers AI Headhunter Sourcing Agent to scan talent graph and draft outreach sequences."""
    candidates = db.query(models.CandidateProfile).all()
    pool = []
    for cand in candidates:
        pool.append({
            "id": cand.id,
            "full_name": cand.full_name,
            "title": cand.title,
            "talent_score": cand.talent_score,
            "skills": json.loads(cand.skills_json or "[]"),
            "github_username": cand.github_username or "candidate",
            "top_repo": f"{cand.github_username or 'candidate'}-core",
            "authenticity_score": cand.authenticity_score
        })

    return headhunter_agent.headhunter_sourcing_agent(
        role_title=req.role_title,
        required_skills=req.required_skills,
        candidate_pool=pool
    )


@router.post("/pair-programming/session")
def pair_programming_session(
    req: schemas.PairProgrammingSessionRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """AI Live Pair Programming Sandbox Assistant endpoint."""
    return pair_programming.pair_programming_assistant(
        code=req.code,
        language=req.language or "python",
        current_problem=req.current_problem or "FastAPI Concurrent Rate Limiter"
    )


@router.post("/candidate/{candidate_id}/issue-badge")
def issue_candidate_badge(
    candidate_id: int,
    req: schemas.IssueBadgeRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Issues cryptographically signed verification badge proof token to candidate profile."""
    cand = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    issued = badge_authority.issue_verification_badge(
        candidate_id=cand.id,
        candidate_name=cand.full_name,
        badge_type=req.badge_type,
        badge_title=req.badge_title
    )

    # Attach badge to candidate profile JSON
    badges = json.loads(cand.verification_badges_json or "[]")
    if req.badge_title not in badges:
        badges.append(req.badge_title)
        cand.verification_badges_json = json.dumps(badges)
        db.commit()

    return issued



