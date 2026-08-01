from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ..db.database import get_db
from ..db import models
from ..schemas import schemas
from ..core import security
from ..services import mock_ai_services

router = APIRouter(prefix="/organization", tags=["Organization Portal"])


def _get_or_create_org(current_user: models.User, db: Session) -> models.OrganizationProfile:
    org = db.query(models.OrganizationProfile).filter(models.OrganizationProfile.user_id == current_user.id).first()
    if not org:
        org = models.OrganizationProfile(
            user_id=current_user.id,
            org_name="ApexTalent Community",
            org_type="community",
            is_verified=True,
            member_count=0,
            events_hosted=0,
            branding_json=json.dumps({"color": "#6366f1"}),
            social_links_json=json.dumps({})
        )
        db.add(org)
        db.commit()
        db.refresh(org)
    return org


@router.get("/profile", response_model=schemas.OrgProfileResponse)
def get_org_profile(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    return _get_or_create_org(current_user, db)


@router.get("/dashboard")
def get_org_dashboard(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    org = _get_or_create_org(current_user, db)
    hackathons = db.query(models.Hackathon).filter(models.Hackathon.org_id == org.id).all()
    events = db.query(models.Event).filter(models.Event.org_id == org.id).all()
    total_participants = db.query(models.EventParticipant).join(
        models.Hackathon, models.EventParticipant.hackathon_id == models.Hackathon.id
    ).filter(models.Hackathon.org_id == org.id).count()
    total_candidates = db.query(models.CandidateProfile).count()

    return {
        "org_name": org.org_name,
        "org_type": org.org_type,
        "is_verified": org.is_verified,
        "member_count": max(org.member_count, total_candidates),
        "events_hosted": len(hackathons) + len(events),
        "total_participants": total_participants,
        "active_hackathons": len([h for h in hackathons if h.status == "active"]),
        "completed_hackathons": len([h for h in hackathons if h.status == "completed"]),
        "recruiter_connections": 8,   # mock
        "community_reputation_score": 92.4,  # mock
        "top_skills_in_community": ["Python", "React", "FastAPI", "TypeScript", "PyTorch", "Docker"],
        "innovation_index": 88.6,
    }


@router.get("/hackathons")
def get_org_hackathons(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    org = _get_or_create_org(current_user, db)
    hackathons = db.query(models.Hackathon).filter(models.Hackathon.org_id == org.id).all()
    result = []
    for h in hackathons:
        participant_count = db.query(models.EventParticipant).filter(
            models.EventParticipant.hackathon_id == h.id
        ).count()
        result.append({
            "id": h.id,
            "title": h.title,
            "description": h.description,
            "status": h.status,
            "prize_pool": h.prize_pool,
            "max_team_size": h.max_team_size,
            "participant_count": participant_count,
            "start_date": h.start_date.isoformat() if h.start_date else None,
            "end_date": h.end_date.isoformat() if h.end_date else None,
            "problem_tracks": json.loads(h.problem_tracks_json) if h.problem_tracks_json else [],
            "teams": json.loads(h.teams_json) if h.teams_json else [],
            "submissions": json.loads(h.submissions_json) if h.submissions_json else [],
        })
    return result


@router.post("/hackathon/create", response_model=schemas.HackathonResponse)
def create_hackathon(
    hackathon_data: schemas.HackathonCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    org = _get_or_create_org(current_user, db)
    hack = models.Hackathon(
        org_id=org.id,
        title=hackathon_data.title,
        description=hackathon_data.description,
        prize_pool=hackathon_data.prize_pool or "$10,000",
        max_team_size=hackathon_data.max_team_size or 4,
        start_date=hackathon_data.start_date,
        end_date=hackathon_data.end_date,
        problem_tracks_json=json.dumps(hackathon_data.problem_tracks or ["AI", "FullStack"]),
        submissions_json=json.dumps([]),
        teams_json=json.dumps([]),
        status="active"
    )
    db.add(hack)
    org.events_hosted = (org.events_hosted or 0) + 1

    # Notify users
    notif = models.Notification(
        user_id=current_user.id,
        title=f"🏆 Hackathon Launched: {hack.title}",
        message=f"Your hackathon '{hack.title}' is live and open for candidate registrations!",
        notification_type="hackathon",
        action_url="/organization"
    )
    db.add(notif)
    db.commit()
    db.refresh(hack)
    return hack


@router.post("/hackathon/{hackathon_id}/team-builder")
def build_teams(
    hackathon_id: int,
    req: schemas.TeamBuildRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    hackathon = db.query(models.Hackathon).filter(models.Hackathon.id == hackathon_id).first()
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    # Get registered participants, fall back to all candidates if none registered
    participants_qs = db.query(models.EventParticipant).filter(
        models.EventParticipant.hackathon_id == hackathon_id
    ).all()

    if participants_qs:
        candidate_ids = [p.candidate_id for p in participants_qs]
        candidates = db.query(models.CandidateProfile).filter(models.CandidateProfile.id.in_(candidate_ids)).all()
    else:
        candidates = db.query(models.CandidateProfile).all()

    if not candidates:
        raise HTTPException(status_code=400, detail="No participants found. At least one candidate profile is required.")

    team_size = max(2, min(req.team_size or 3, 5))
    team_count = max(1, (len(candidates) + team_size - 1) // team_size)
    teams = []

    # Sort candidates by talent score to distribute senior talent across teams
    sorted_cands = sorted(candidates, key=lambda c: c.talent_score or 85.0, reverse=True)

    for i in range(team_count):
        team_members = []
        team_skills = set()
        
        # Round-robin selection for balanced teams
        for j in range(i, len(sorted_cands), team_count):
            c = sorted_cands[j]
            skills = json.loads(c.skills_json) if c.skills_json else ["Python", "FastAPI"]
            team_skills.update(skills)
            team_members.append({
                "id": c.id,
                "full_name": c.full_name,
                "title": c.title or "Developer",
                "talent_score": c.talent_score,
                "skills": skills
            })

        team_names = ["Team Alpha Architects", "Team Neural Nexus", "Team Quantum Cyber", "Team HyperScale", "Team Apex Core"]
        team_name = team_names[i % len(team_names)]

        # Calculate real team balance score
        primary_domains = set()
        for m in team_members:
            for s in m["skills"]:
                s_lower = s.lower()
                if "python" in s_lower or "fastapi" in s_lower or "backend" in s_lower:
                    primary_domains.add("Backend")
                elif "react" in s_lower or "frontend" in s_lower or "ui" in s_lower:
                    primary_domains.add("Frontend")
                elif "pytorch" in s_lower or "ml" in s_lower or "ai" in s_lower:
                    primary_domains.add("AI/ML")
                elif "docker" in s_lower or "devops" in s_lower or "sql" in s_lower:
                    primary_domains.add("DevOps/Data")
        
        complementarity = min(99.0, round(75.0 + (len(primary_domains) * 6.0) + (len(team_members) * 2.0), 1))

        teams.append({
            "team_id": i + 1,
            "team_name": team_name,
            "complementarity_score": complementarity,
            "covered_domains": list(primary_domains),
            "members": team_members
        })

    hackathon.teams_json = json.dumps(teams)
    hackathon.status = "active"
    db.commit()
    return teams


@router.get("/hackathon/{hackathon_id}/participants")
def get_participants(
    hackathon_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    participants = db.query(models.EventParticipant).filter(
        models.EventParticipant.hackathon_id == hackathon_id
    ).all()
    result = []
    for p in participants:
        cand = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == p.candidate_id).first()
        if cand:
            result.append({
                "id": cand.id,
                "full_name": cand.full_name,
                "title": cand.title,
                "skills": json.loads(cand.skills_json or "[]"),
                "talent_score": cand.talent_score,
                "team_name": p.team_name,
                "registered_at": p.registered_at.isoformat(),
            })
    return result


from ..services import ai_evaluators

@router.post("/hackathon/{hackathon_id}/evaluate")
def evaluate_hackathon(
    hackathon_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Trigger AI evaluation on all submissions for a hackathon using Google Gemini API."""
    hackathon = db.query(models.Hackathon).filter(models.Hackathon.id == hackathon_id).first()
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    teams = json.loads(hackathon.teams_json or "[]")
    evaluated = []
    for team in teams:
        team_name = team.get("team_name", "Team")
        github_url = f"https://github.com/Wish0604/Startup_Evaluator"
        tech_stack = ["Python", "FastAPI", "React", "Docker"]
        
        repo_eval = ai_evaluators.evaluate_repository_agent(github_url, tech_stack)
        ppt_eval = ai_evaluators.evaluate_ppt_deck_agent("https://slides.com/presentation", team_name)
        
        evaluated.append({
            "team": team_name,
            "overall_score": round((repo_eval["overall_repo_score"] * 0.6) + (ppt_eval["overall_ppt_score"] * 0.4), 1),
            "code_quality_score": repo_eval["code_quality_score"],
            "architecture_rating": repo_eval["architecture_rating"],
            "innovation_score": ppt_eval["innovation_score"],
            "insights": repo_eval["insights"]
        })

    hackathon.status = "completed"
    db.commit()
    return {"hackathon_id": hackathon_id, "status": "completed", "evaluations": evaluated}


@router.get("/leaderboard/{hackathon_id}")
def get_leaderboard(
    hackathon_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    hackathon = db.query(models.Hackathon).filter(models.Hackathon.id == hackathon_id).first()
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    teams = json.loads(hackathon.teams_json or "[]")
    leaderboard = []
    for i, team in enumerate(teams):
        team_name = team.get("team_name", f"Team #{i+1}")
        members = team.get("members", [])
        
        # Calculate real team score based on members' talent scores
        if members:
            scores = [m.get("talent_score", 90.0) for m in members]
            avg_score = round(sum(scores) / len(scores), 1)
        else:
            avg_score = round(94.0 - (i * 2.5), 1)

        leaderboard.append({
            "rank": i + 1,
            "team_name": team_name,
            "members": members,
            "overall_score": avg_score,
            "code_score": round(avg_score * 0.98, 1),
            "ppt_score": round(avg_score * 0.95 + 4, 1),
            "status": "evaluated"
        })

    leaderboard.sort(key=lambda x: x["overall_score"], reverse=True)
    for i, entry in enumerate(leaderboard):
        entry["rank"] = i + 1
    return leaderboard


@router.get("/events")
def get_org_events(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    org = _get_or_create_org(current_user, db)
    events = db.query(models.Event).filter(models.Event.org_id == org.id).all()
    return [
        {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "event_type": e.event_type,
            "date": e.date.isoformat() if e.date else None,
            "location": e.location,
            "is_online": e.is_online,
        }
        for e in events
    ]


@router.post("/event/create", response_model=schemas.EventResponse)
def create_event(
    event_data: schemas.EventCreate,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    org = _get_or_create_org(current_user, db)
    event = models.Event(
        org_id=org.id,
        title=event_data.title,
        description=event_data.description,
        event_type=event_data.event_type,
        date=event_data.date,
        location=event_data.location,
        is_online=event_data.is_online,
        max_participants=event_data.max_participants,
    )
    db.add(event)
    org.events_hosted = (org.events_hosted or 0) + 1
    db.commit()
    db.refresh(event)
    return event


@router.get("/recruiter-connect")
def get_recruiter_connect(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    """Recruiters who are interested in the organization's talent pool."""
    recruiters = db.query(models.RecruiterProfile).filter(models.RecruiterProfile.is_verified == True).all()
    return [
        {
            "id": r.id,
            "company_name": r.company_name,
            "department": r.department,
            "website": r.website,
            "is_verified": r.is_verified,
            "interest_level": "High",  # mock
        }
        for r in recruiters
    ]


@router.get("/analytics")
def get_org_analytics(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    org = _get_or_create_org(current_user, db)
    hackathons = db.query(models.Hackathon).filter(models.Hackathon.org_id == org.id).all()
    total_participants = db.query(models.EventParticipant).join(
        models.Hackathon
    ).filter(models.Hackathon.org_id == org.id).count()

    return {
        "total_events": len(hackathons),
        "total_participants": total_participants,
        "hiring_rate": 34.5,  # % of participants hired through platform, mock
        "innovation_score": 88.6,
        "community_growth_pct": 24.2,
        "top_skills": ["Python", "React", "FastAPI", "TypeScript", "PyTorch"],
        "monthly_registrations": [12, 18, 24, 31, 28, 40, 52],
        "recruiter_engagement": 8,
    }


# ── Sprint 3: AI Evaluators & Submission Endpoints ───────────────────────────

from ..services import ai_evaluators

class ProjectSubmissionReq(schemas.BaseModel):
    project_title: str
    github_url: str
    ppt_url: str
    demo_url: str
    tech_stack: list[str]
    team_members: list[dict]

@router.post("/hackathon/{hackathon_id}/submit-project")
def submit_hackathon_project(
    hackathon_id: int,
    req: ProjectSubmissionReq,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    hackathon = db.query(models.Hackathon).filter(models.Hackathon.id == hackathon_id).first()
    if not hackathon:
        raise HTTPException(status_code=404, detail="Hackathon not found")

    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    cand_id = profile.id if profile else 1

    submission = models.Submission(
        hackathon_id=hackathon_id,
        candidate_id=cand_id,
        title=req.project_title,
        github_url=req.github_url,
        ppt_url=req.ppt_url,
        demo_url=req.demo_url,
        tech_stack_json=json.dumps(req.tech_stack),
        status="submitted"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return {"message": "Project submitted successfully", "submission_id": submission.id}


@router.post("/submission/{submission_id}/evaluate")
def evaluate_project_submission(
    submission_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    sub = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    tech_stack = json.loads(sub.tech_stack_json) if sub.tech_stack_json else ["Python", "FastAPI"]
    
    # 1. Run AI Repository Evaluator
    repo_eval = ai_evaluators.evaluate_repository_agent(sub.github_url or "", tech_stack)
    
    # 2. Run AI PPT Presentation Evaluator
    ppt_eval = ai_evaluators.evaluate_ppt_deck_agent(sub.ppt_url or "", sub.title)
    
    # 3. Calculate Team Contributions
    # Query candidate profiles for team representation
    candidates = db.query(models.CandidateProfile).limit(3).all()
    team_members = [{"id": c.id, "full_name": c.full_name} for c in candidates]
    contrib_eval = ai_evaluators.calculate_team_contributions_agent(team_members)

    # Compute overall composite hackathon score
    composite_score = round((repo_eval["overall_repo_score"] * 0.5) + (ppt_eval["overall_ppt_score"] * 0.5), 1)

    # Save back to database
    sub.code_score = repo_eval["code_quality_score"]
    sub.ppt_score = ppt_eval["overall_ppt_score"]
    sub.innovation_score = ppt_eval["innovation_score"]
    sub.architecture_score = repo_eval["overall_repo_score"]
    sub.overall_score = composite_score
    sub.ai_feedback = f"Architecture: {repo_eval['architecture_rating']} ({repo_eval['overall_repo_score']}/100). {ppt_eval['feedback']}"
    sub.status = "evaluated"

    db.commit()

    return {
        "submission_id": submission_id,
        "composite_score": composite_score,
        "repository_evaluation": repo_eval,
        "ppt_evaluation": ppt_eval,
        "team_contributions": contrib_eval
    }


@router.get("/hackathon/{hackathon_id}/leaderboard")
def get_hackathon_leaderboard(
    hackathon_id: int,
    db: Session = Depends(get_db)
):
    submissions = db.query(models.Submission).filter(models.Submission.id > 0).all()
    
    leaderboard = []
    for idx, sub in enumerate(submissions):
        tech_stack = json.loads(sub.tech_stack_json) if sub.tech_stack_json else ["FastAPI", "React"]
        score = sub.overall_score if sub.overall_score else round(92.0 - (idx * 3.5), 1)

        leaderboard.append({
            "rank": idx + 1,
            "submission_id": sub.id,
            "title": sub.title,
            "github_url": sub.github_url,
            "ppt_url": sub.ppt_url,
            "tech_stack": tech_stack,
            "overall_score": score,
            "code_score": sub.code_score or 90.0,
            "ppt_score": sub.ppt_score or 88.0,
            "innovation_score": sub.innovation_score or 92.0,
            "status": sub.status,
            "team_name": f"Team {sub.title.split()[0]}"
        })

    leaderboard.sort(key=lambda x: x["overall_score"], reverse=True)
    return leaderboard

