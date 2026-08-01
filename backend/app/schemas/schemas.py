from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# ── Auth ──────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str = "candidate"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

# ── Candidate Profile ──────────────────────────────────────────────────────────

class CandidateProfileCreate(BaseModel):
    full_name: str
    title: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    github_username: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    availability: Optional[str] = "open"
    salary_expectation: Optional[str] = None

class CandidateProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    title: Optional[str]
    bio: Optional[str]
    location: Optional[str]
    github_username: Optional[str]
    linkedin_url: Optional[str]
    portfolio_url: Optional[str]
    resume_url: Optional[str]
    availability: Optional[str]
    salary_expectation: Optional[str]
    talent_score: float
    coding_score: float
    innovation_score: float
    leadership_score: float
    communication_score: float
    community_score: float
    consistency_score: float
    authenticity_score: float
    skills_json: str
    projects_json: str
    education_json: str
    experience_json: str
    certifications_json: str
    achievements_json: str
    hackathon_results_json: str
    github_stats_json: str
    verification_badges_json: str
    class Config:
        from_attributes = True

# ── Recruiter Profile ──────────────────────────────────────────────────────────

class RecruiterProfileCreate(BaseModel):
    company_name: str
    department: Optional[str] = None
    website: Optional[str] = None

class RecruiterProfileResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    department: Optional[str]
    website: Optional[str]
    is_verified: bool
    total_hires: int
    class Config:
        from_attributes = True

# ── Organization Profile ───────────────────────────────────────────────────────

class OrgProfileCreate(BaseModel):
    org_name: str
    org_type: Optional[str] = "community"
    website: Optional[str] = None

class OrgProfileResponse(BaseModel):
    id: int
    user_id: int
    org_name: str
    org_type: str
    website: Optional[str]
    is_verified: bool
    member_count: int
    events_hosted: int
    branding_json: str
    social_links_json: str
    class Config:
        from_attributes = True

# ── Job ────────────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: List[str]
    nice_to_have: Optional[List[str]] = []
    salary_range: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[str] = "full-time"
    experience_level: Optional[str] = "mid"
    remote_type: Optional[str] = "remote"

class JobResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    description: str
    requirements_json: str
    nice_to_have_json: str
    salary_range: Optional[str]
    location: Optional[str]
    job_type: str
    experience_level: str
    remote_type: str
    is_active: bool
    applications_count: int
    created_at: datetime
    class Config:
        from_attributes = True

# ── Application ────────────────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    stage: str
    match_percentage: float
    ai_review_notes: Optional[str]
    applied_at: datetime
    class Config:
        from_attributes = True

class PipelineMoveRequest(BaseModel):
    stage: str
    recruiter_notes: Optional[str] = None

# ── Hackathon ──────────────────────────────────────────────────────────────────

class HackathonCreate(BaseModel):
    title: str
    description: str
    prize_pool: Optional[str] = None
    max_team_size: Optional[int] = 4
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    problem_tracks: Optional[List[str]] = []

class HackathonResponse(BaseModel):
    id: int
    org_id: int
    title: str
    description: str
    status: str
    prize_pool: Optional[str] = None
    max_team_size: int = 4
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    problem_tracks_json: Optional[str] = "[]"
    submissions_json: Optional[str] = "[]"
    teams_json: Optional[str] = "[]"
    class Config:
        from_attributes = True

# ── Event ──────────────────────────────────────────────────────────────────────

class EventCreate(BaseModel):
    title: str
    description: str
    event_type: str = "workshop"
    date: Optional[datetime] = None
    location: Optional[str] = None
    is_online: bool = True
    max_participants: Optional[int] = None

class EventResponse(BaseModel):
    id: int
    org_id: int
    title: str
    description: str
    event_type: str
    date: Optional[datetime]
    location: Optional[str]
    is_online: bool
    created_at: datetime
    class Config:
        from_attributes = True

# ── Hiring Challenge ───────────────────────────────────────────────────────────

class ChallengeCreate(BaseModel):
    title: str
    description: str
    challenge_type: str = "coding"
    deliverables: Optional[List[str]] = ["github", "documentation"]
    deadline_days: Optional[int] = 7
    job_id: Optional[int] = None

class ChallengeResponse(BaseModel):
    id: int
    recruiter_id: int
    title: str
    description: str
    challenge_type: str
    rubrics_json: str
    deliverables_json: str
    deadline_days: int
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class ChallengeSubmitRequest(BaseModel):
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    ppt_url: Optional[str] = None
    video_url: Optional[str] = None
    notes: Optional[str] = None

class ChallengeSubmissionResponse(BaseModel):
    id: int
    challenge_id: int
    candidate_id: int
    overall_score: float
    architecture_score: float
    code_quality_score: float
    innovation_score: float
    documentation_score: float
    evaluation_report_json: str
    is_evaluated: bool
    submitted_at: datetime
    class Config:
        from_attributes = True

# ── Interview ──────────────────────────────────────────────────────────────────

class InterviewScheduleRequest(BaseModel):
    interview_type: str = "mock"
    job_id: Optional[int] = None
    scheduled_at: Optional[datetime] = None

class InterviewAnswerRequest(BaseModel):
    question_index: int
    answer: str

class InterviewResponse(BaseModel):
    id: int
    candidate_id: int
    interview_type: str
    status: str
    overall_score: float
    technical_score: float
    communication_score: float
    problem_solving_score: float
    questions_json: str
    feedback_json: str
    class Config:
        from_attributes = True

# ── Career Goal ────────────────────────────────────────────────────────────────

class CareerGoalCreate(BaseModel):
    target_role: str
    target_salary: Optional[str] = None
    timeline_months: Optional[int] = 6

class CareerGoalResponse(BaseModel):
    id: int
    candidate_id: int
    target_role: Optional[str]
    target_salary: Optional[str]
    timeline_months: int
    skill_gaps_json: str
    learning_roadmap_json: str
    certifications_recommended_json: str
    progress_percentage: float
    class Config:
        from_attributes = True

# ── Contribution Report ────────────────────────────────────────────────────────

class ContributionReportResponse(BaseModel):
    id: int
    candidate_id: int
    commits: int
    pull_requests: int
    issues_closed: int
    contribution_percentage: float
    collaboration_score: float
    leadership_score: float
    code_quality_score: float
    generated_at: datetime
    class Config:
        from_attributes = True

# ── Notification ───────────────────────────────────────────────────────────────

class NotificationResponse(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    action_url: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# ── AI Service Requests ────────────────────────────────────────────────────────

class ResumeParseRequest(BaseModel):
    resume_url: str

class GithubSyncRequest(BaseModel):
    github_username: str

class SemanticSearchQuery(BaseModel):
    query: str
    min_score: Optional[float] = None
    skills_filter: Optional[List[str]] = []
    location_filter: Optional[str] = None

class TeamBuildRequest(BaseModel):
    hackathon_id: int
    team_size: int = 3

class GenerateResumeRequest(BaseModel):
    job_id: Optional[int] = None
    target_role: Optional[str] = None

class CareerGuidanceRequest(BaseModel):
    target_role: str

class InterviewQuestionsRequest(BaseModel):
    job_title: str
    skills: List[str]
    interview_type: str = "technical"

class EvaluateSubmissionRequest(BaseModel):
    submission_id: int

class CopilotChatRequest(BaseModel):
    message: str
    candidate_ids: Optional[List[int]] = []
    conversation_history: Optional[List[Dict[str, Any]]] = []
    job_id: Optional[int] = None

class GenerateJDRequest(BaseModel):
    title: str
    requirements: List[str]
    experience_level: str = "mid"
    remote_type: str = "remote"

class GenerateChallengeRequest(BaseModel):
    role_title: str
    tech_stack: Optional[List[str]] = []
    experience_level: Optional[str] = "mid"
    time_limit_hours: Optional[int] = 48
    job_id: Optional[int] = None

class PipelineUpdateStageRequest(BaseModel):
    application_id: int
    stage: str
    recruiter_notes: Optional[str] = None

class LiveCodingEvalRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    problem_title: Optional[str] = "FastAPI Asynchronous Task Queue"



class GenerateAssessmentRequest(BaseModel):
    role_title: str
    tech_stack: Optional[List[str]] = []
    mcq_count: Optional[int] = 5
    coding_count: Optional[int] = 1
    time_limit_mins: Optional[int] = 60

class TeamInviteRequest(BaseModel):
    email: EmailStr
    role: Optional[str] = "Interviewer"
    department: Optional[str] = "Engineering"

class WebhookCreateRequest(BaseModel):
    name: str
    target_url: str
    events: Optional[List[str]] = ["application.stage_updated", "challenge.submitted", "offer.accepted"]
    channel_type: Optional[str] = "slack"

class HeadhunterSourcingRequest(BaseModel):
    role_title: str
    required_skills: Optional[List[str]] = []
    min_talent_score: Optional[float] = 80.0
    location_filter: Optional[str] = None

class PairProgrammingSessionRequest(BaseModel):
    code: str
    language: Optional[str] = "python"
    current_problem: Optional[str] = "FastAPI Concurrent Rate Limiter"

class IssueBadgeRequest(BaseModel):
    badge_type: str = "verified_expert"
    badge_title: str = "Verified FastAPI Expert"




