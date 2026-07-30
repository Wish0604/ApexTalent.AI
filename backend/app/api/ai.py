from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ..db.database import get_db
from ..db import models
from ..schemas import schemas
from ..core import security
from ..services import mock_ai_services

router = APIRouter(prefix="/ai", tags=["AI Intelligence Layer"])


@router.post("/sync-github", response_model=schemas.CandidateProfileResponse)
def sync_github(
    req: schemas.GithubSyncRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    git = mock_ai_services.analyze_github_mock(req.github_username)
    current_skills = json.loads(profile.skills_json or "[]")
    merged_skills = list(set(current_skills + git["tech_stack"]))

    github_project = {
        "name": f"{req.github_username}/core-api",
        "description": f"High-performance microservice backend in {git['languages'][0]}.",
        "tech_stack": git["tech_stack"][:3]
    }
    current_projects = json.loads(profile.projects_json or "[]")
    has_project = any(p.get("name", "").startswith(req.github_username) for p in current_projects)
    if not has_project:
        current_projects.append(github_project)

    has_resume = bool(profile.resume_url)
    scores = mock_ai_services.calculate_talent_score_mock(
        git["coding_score"], git["innovation_score"],
        github_username=True, resume_uploaded=has_resume,
        has_projects=len(current_projects) > 0
    )

    merged_badges = list(set(json.loads(profile.verification_badges_json or "[]") + git["badges"]))

    profile.github_username = req.github_username
    profile.skills_json = json.dumps(merged_skills)
    profile.projects_json = json.dumps(current_projects)
    profile.verification_badges_json = json.dumps(merged_badges)
    profile.github_stats_json = json.dumps(git["stats"])
    profile.talent_score = scores["talent_score"]
    profile.coding_score = scores["coding_score"]
    profile.innovation_score = scores["innovation_score"]
    profile.leadership_score = scores["leadership_score"]
    profile.communication_score = scores["communication_score"]
    profile.community_score = scores["community_score"]
    profile.consistency_score = scores["consistency_score"]
    profile.authenticity_score = scores["authenticity_score"]
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/sync-resume", response_model=schemas.CandidateProfileResponse)
def sync_resume(
    req: schemas.ResumeParseRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    parsed = mock_ai_services.parse_resume_mock(req.resume_url)
    merged_skills = list(set(json.loads(profile.skills_json or "[]") + parsed["skills"]))
    merged_projects = json.loads(profile.projects_json or "[]") + parsed["projects"]
    merged_badges = list(set(json.loads(profile.verification_badges_json or "[]") + parsed["badges"]))

    has_github = bool(profile.github_username)
    scores = mock_ai_services.calculate_talent_score_mock(
        profile.coding_score, profile.innovation_score,
        github_username=has_github, resume_uploaded=True,
        has_projects=len(merged_projects) > 0
    )

    if parsed.get("title"):
        profile.title = parsed["title"]
    if parsed.get("education"):
        profile.education_json = json.dumps(parsed["education"])
    if parsed.get("experience"):
        profile.experience_json = json.dumps(parsed["experience"])

    profile.resume_url = req.resume_url
    profile.skills_json = json.dumps(merged_skills)
    profile.projects_json = json.dumps(merged_projects)
    profile.verification_badges_json = json.dumps(merged_badges)
    profile.talent_score = scores["talent_score"]
    profile.coding_score = scores["coding_score"]
    profile.innovation_score = scores["innovation_score"]
    profile.leadership_score = scores["leadership_score"]
    profile.communication_score = scores["communication_score"]
    profile.community_score = scores["community_score"]
    profile.consistency_score = scores["consistency_score"]
    profile.authenticity_score = scores["authenticity_score"]
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/generate-resume")
def generate_resume(
    req: schemas.GenerateResumeRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    target = req.target_role or profile.title or "Software Engineer"
    if req.job_id:
        job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
        if job:
            target = job.title

    result = mock_ai_services.generate_ats_resume_mock(
        {
            "full_name": profile.full_name,
            "title": profile.title,
            "talent_score": profile.talent_score,
            "skills_json": profile.skills_json,
            "projects_json": profile.projects_json,
            "github_username": profile.github_username,
            "linkedin_url": profile.linkedin_url,
        },
        target_role=target
    )
    return result


@router.post("/career-guidance")
def ai_career_guidance(
    req: schemas.CareerGuidanceRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    skills = json.loads(profile.skills_json or "[]") if profile else []
    return mock_ai_services.generate_career_roadmap_mock(skills, req.target_role)


@router.post("/interview-questions")
def get_interview_questions(
    req: schemas.InterviewQuestionsRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    return mock_ai_services.generate_interview_questions_mock(req.job_title, req.skills, req.interview_type)


@router.post("/evaluate-submission")
def evaluate_submission(
    req: schemas.EvaluateSubmissionRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(models.ChallengeSubmission).filter(models.ChallengeSubmission.id == req.submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    return mock_ai_services.score_hackathon_submission_mock(
        sub.github_url or "mock://repo", sub.ppt_url, sub.demo_url
    )


@router.post("/copilot")
def recruiter_copilot(
    req: schemas.CopilotChatRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """AI Recruiter Copilot — answers natural language hiring questions."""
    msg = req.message.lower()
    candidates = db.query(models.CandidateProfile).all()

    # Intent parsing
    if any(w in msg for w in ["best", "top", "strongest", "highest"]):
        top = sorted(candidates, key=lambda c: c.talent_score, reverse=True)[:3]
        names = ", ".join(c.full_name for c in top)
        reply = f"🏆 Top 3 candidates by Talent Score: **{names}**. All have scores above {top[-1].talent_score if top else 'N/A'}."

    elif any(w in msg for w in ["fastapi", "python", "react", "pytorch", "typescript", "docker", "kubernetes"]):
        keyword = next(w for w in ["fastapi", "python", "react", "pytorch", "typescript", "docker", "kubernetes"] if w in msg)
        matched = [c for c in candidates if keyword in (c.skills_json or "").lower()]
        names = ", ".join(c.full_name for c in matched[:4])
        reply = f"🔍 Found **{len(matched)}** candidate(s) with **{keyword.title()}** expertise: {names or 'None matched'}."

    elif any(w in msg for w in ["compare", "vs", "versus", "difference"]):
        if len(candidates) >= 2:
            a, b = candidates[0], candidates[1]
            reply = (
                f"⚖️ **{a.full_name}** (Score: {a.talent_score}) vs **{b.full_name}** (Score: {b.talent_score}). "
                f"{a.full_name} leads in Coding ({a.coding_score}), while {b.full_name} excels in Innovation ({b.innovation_score})."
            )
        else:
            reply = "I need at least 2 candidates to compare. Try searching for specific skills first."

    elif any(w in msg for w in ["available", "open", "hiring"]):
        open_cands = [c for c in candidates if c.availability == "open"]
        reply = f"✅ **{len(open_cands)}** candidate(s) are currently open to opportunities."

    elif any(w in msg for w in ["interview", "question"]):
        reply = "🎤 I can generate role-specific interview questions. Use the Interview Questions endpoint with a job title and required skills."

    elif any(w in msg for w in ["salary", "pay", "compensation"]):
        reply = "💰 Based on current market data: Senior Engineers ($130K–$180K), ML Engineers ($150K–$200K), Frontend Leads ($110K–$160K). Want a specific role?"

    else:
        total = len(candidates)
        avg_score = sum(c.talent_score for c in candidates) / max(total, 1)
        reply = (
            f"🤖 Platform snapshot: **{total}** candidates, avg Talent Score **{avg_score:.1f}**. "
            "Ask me to find engineers by skill, compare candidates, check availability, or recommend interview questions."
        )

    return {
        "reply": reply,
        "suggestions": [
            "Find top FastAPI engineers",
            "Compare top 2 candidates",
            "Who is available for immediate hire?",
            "Generate interview questions for ML role",
        ]
    }
