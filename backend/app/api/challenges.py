from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ..db.database import get_db
from ..db import models
from ..schemas import schemas
from ..core import security
from ..services import mock_ai_services

router = APIRouter(prefix="/challenges", tags=["Hiring Challenges"])


def _get_recruiter(current_user: models.User, db: Session):
    rec = db.query(models.RecruiterProfile).filter(models.RecruiterProfile.user_id == current_user.id).first()
    if not rec:
        rec = models.RecruiterProfile(user_id=current_user.id, company_name="ApexTalent Corp", is_verified=True)
        db.add(rec); db.commit(); db.refresh(rec)
    return rec


@router.post("/create", response_model=schemas.ChallengeResponse)
def create_challenge(
    data: schemas.ChallengeCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    recruiter = _get_recruiter(current_user, db)
    rubrics = {
        "architecture":  {"weight": 0.25, "description": "System design and code structure"},
        "code_quality":  {"weight": 0.25, "description": "Clean, readable, and maintainable code"},
        "innovation":    {"weight": 0.20, "description": "Creative and novel solutions"},
        "documentation": {"weight": 0.15, "description": "README, API docs, and inline comments"},
        "testing":       {"weight": 0.15, "description": "Unit, integration, and E2E test coverage"},
    }
    challenge = models.HiringChallenge(
        recruiter_id=recruiter.id,
        job_id=data.job_id,
        title=data.title,
        description=data.description,
        challenge_type=data.challenge_type,
        rubrics_json=json.dumps(rubrics),
        deliverables_json=json.dumps(data.deliverables or ["github", "documentation"]),
        deadline_days=data.deadline_days or 7,
    )
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


@router.get("/", response_model=list[schemas.ChallengeResponse])
def list_challenges(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.HiringChallenge).filter(models.HiringChallenge.is_active == True).all()


@router.post("/{challenge_id}/submit", response_model=schemas.ChallengeSubmissionResponse)
def submit_challenge(
    challenge_id: int,
    data: schemas.ChallengeSubmitRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    challenge = db.query(models.HiringChallenge).filter(models.HiringChallenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    existing = db.query(models.ChallengeSubmission).filter(
        models.ChallengeSubmission.challenge_id == challenge_id,
        models.ChallengeSubmission.candidate_id == profile.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already submitted for this challenge")

    eval_result = mock_ai_services.score_hackathon_submission_mock(
        data.github_url or "mock://repo",
        data.ppt_url,
        data.demo_url
    )

    sub = models.ChallengeSubmission(
        challenge_id=challenge_id,
        candidate_id=profile.id,
        github_url=data.github_url,
        demo_url=data.demo_url,
        ppt_url=data.ppt_url,
        video_url=data.video_url,
        notes=data.notes,
        overall_score=eval_result["overall_score"],
        architecture_score=eval_result["architecture_score"],
        code_quality_score=eval_result["code_quality_score"],
        innovation_score=eval_result["innovation_score"],
        documentation_score=eval_result["documentation_score"],
        evaluation_report_json=json.dumps(eval_result),
        is_evaluated=True,
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


@router.get("/{challenge_id}/submissions")
def get_challenge_submissions(
    challenge_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    submissions = db.query(models.ChallengeSubmission).filter(
        models.ChallengeSubmission.challenge_id == challenge_id
    ).all()
    result = []
    for s in submissions:
        cand = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == s.candidate_id).first()
        result.append({
            "submission_id": s.id,
            "candidate_name": cand.full_name if cand else "Unknown",
            "candidate_id": s.candidate_id,
            "talent_score": cand.talent_score if cand else 0,
            "overall_score": s.overall_score,
            "architecture_score": s.architecture_score,
            "code_quality_score": s.code_quality_score,
            "innovation_score": s.innovation_score,
            "documentation_score": s.documentation_score,
            "github_url": s.github_url,
            "demo_url": s.demo_url,
            "evaluation_report": json.loads(s.evaluation_report_json or "{}"),
            "submitted_at": s.submitted_at.isoformat(),
        })
    result.sort(key=lambda x: x["overall_score"], reverse=True)
    return result


@router.post("/{challenge_id}/evaluate")
def evaluate_submission(
    challenge_id: int,
    req: schemas.EvaluateSubmissionRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(models.ChallengeSubmission).filter(models.ChallengeSubmission.id == req.submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    result = mock_ai_services.score_hackathon_submission_mock(
        sub.github_url or "mock://repo", sub.ppt_url, sub.demo_url
    )
    sub.overall_score = result["overall_score"]
    sub.architecture_score = result["architecture_score"]
    sub.code_quality_score = result["code_quality_score"]
    sub.innovation_score = result["innovation_score"]
    sub.documentation_score = result["documentation_score"]
    sub.evaluation_report_json = json.dumps(result)
    sub.is_evaluated = True
    db.commit()
    return result
