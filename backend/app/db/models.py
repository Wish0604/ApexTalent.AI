import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text, Enum, Numeric, Date
)
from sqlalchemy.orm import relationship
from .database import Base


# =============================================================================
# 1. AUTHENTICATION & USER MANAGEMENT MODULE
# =============================================================================

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)  # "candidate" | "recruiter" | "organization" | "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(Text, nullable=False)
    phone = Column(String(20), nullable=True)
    profile_image = Column(Text, nullable=True)
    role = Column(String(50), default="candidate")  # "candidate" | "recruiter" | "organization" | "admin"
    account_status = Column(String(50), default="active")  # active | suspended | pending
    email_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False)
    org_profile = relationship("OrganizationProfile", back_populates="user", uselist=False)
    oauth_accounts = relationship("OAuthAccount", back_populates="user")
    refresh_tokens = relationship("RefreshToken", back_populates="user")
    email_verifications = relationship("EmailVerificationToken", back_populates="user")
    notifications = relationship("Notification", back_populates="user")
    notification_preferences = relationship("NotificationPreference", back_populates="user", uselist=False)
    audit_logs = relationship("AuditLog", back_populates="user")


class OAuthAccount(Base):
    __tablename__ = "oauth_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    provider = Column(String(50), nullable=False)  # google | github | linkedin
    provider_user_id = Column(Text, nullable=False)
    access_token = Column(Text, nullable=True)
    refresh_token = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="oauth_accounts")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(Text, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="refresh_tokens")


class EmailVerificationToken(Base):
    __tablename__ = "email_verifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    token = Column(Text, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="email_verifications")


# =============================================================================
# 2. CANDIDATE MODULE
# =============================================================================

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    # Identity & Bio
    full_name = Column(String, nullable=False)
    headline = Column(Text, nullable=True)
    title = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    portfolio_url = Column(Text, nullable=True)

    # Professional Links & Artifacts
    github_username = Column(String, nullable=True)
    github_url = Column(Text, nullable=True)
    linkedin_url = Column(Text, nullable=True)
    resume_url = Column(Text, nullable=True)

    # Availability & Compensation
    availability = Column(String, default="open")  # open | not_looking | open_to_offers
    salary_expectation = Column(String, nullable=True)

    # AI Talent Intelligence Scores (0–100)
    talent_score = Column(Float, default=0.0)
    coding_score = Column(Float, default=0.0)
    innovation_score = Column(Float, default=0.0)
    leadership_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    community_score = Column(Float, default=0.0)
    consistency_score = Column(Float, default=0.0)
    authenticity_score = Column(Float, default=100.0)

    # Flexible Metadata JSON Storage
    skills_json = Column(Text, default="[]")
    projects_json = Column(Text, default="[]")
    education_json = Column(Text, default="[]")
    experience_json = Column(Text, default="[]")
    certifications_json = Column(Text, default="[]")
    achievements_json = Column(Text, default="[]")
    hackathon_results_json = Column(Text, default="[]")
    github_stats_json = Column(Text, default="{}")
    verification_badges_json = Column(Text, default="[]")

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="candidate_profile")
    candidate_skills = relationship("CandidateSkill", back_populates="candidate")
    education_records = relationship("Education", back_populates="candidate")
    experience_records = relationship("Experience", back_populates="candidate")
    project_records = relationship("Project", back_populates="candidate")
    certificate_records = relationship("Certificate", back_populates="candidate")
    applications = relationship("Application", back_populates="candidate")
    interviews = relationship("Interview", back_populates="candidate")
    challenge_submissions = relationship("ChallengeSubmission", back_populates="candidate")
    contribution_reports = relationship("ContributionReport", back_populates="candidate")
    career_goal = relationship("CareerGoal", back_populates="candidate", uselist=False)
    ai_evaluations = relationship("AiEvaluation", back_populates="candidate")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    level = Column(String(50), default="Intermediate")  # Beginner | Intermediate | Expert

    candidate = relationship("CandidateProfile", back_populates="candidate_skills")
    skill = relationship("Skill")


class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    institute = Column(Text, nullable=False)
    degree = Column(Text, nullable=True)
    specialization = Column(Text, nullable=True)
    graduation_year = Column(Integer, nullable=True)

    candidate = relationship("CandidateProfile", back_populates="education_records")


class Experience(Base):
    __tablename__ = "experience"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    company = Column(Text, nullable=False)
    designation = Column(Text, nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    description = Column(Text, nullable=True)

    candidate = relationship("CandidateProfile", back_populates="experience_records")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    title = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    github_repo = Column(Text, nullable=True)
    live_demo = Column(Text, nullable=True)
    tech_stack_json = Column(Text, default="[]")

    candidate = relationship("CandidateProfile", back_populates="project_records")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    title = Column(Text, nullable=False)
    issuer = Column(Text, nullable=True)
    certificate_url = Column(Text, nullable=True)
    issue_date = Column(Date, nullable=True)

    candidate = relationship("CandidateProfile", back_populates="certificate_records")


# =============================================================================
# 3. RECRUITER & COMPANY MODULE
# =============================================================================

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    website = Column(Text, nullable=True)
    logo_url = Column(Text, nullable=True)
    industry = Column(String(100), nullable=True)
    company_size = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    headquarters = Column(String(255), nullable=True)
    reg_number = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    recruiters = relationship("RecruiterProfile", back_populates="company")
    jobs = relationship("Job", back_populates="company")


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    company_name = Column(String, nullable=False)
    designation = Column(String, nullable=True)
    department = Column(String, nullable=True)
    website = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    total_hires = Column(Integer, default=0)

    user = relationship("User", back_populates="recruiter_profile")
    company = relationship("Company", back_populates="recruiters")
    jobs = relationship("Job", back_populates="recruiter")
    challenges = relationship("HiringChallenge", back_populates="recruiter")


# =============================================================================
# 4. JOB MODULE
# =============================================================================

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements_json = Column(Text, default="[]")
    nice_to_have_json = Column(Text, default="[]")
    salary_range = Column(String, nullable=True)
    salary_min = Column(Float, nullable=True)
    salary_max = Column(Float, nullable=True)
    location = Column(String(255), nullable=True)
    employment_type = Column(String(50), default="full-time")  # full-time | part-time | contract | internship
    job_type = Column(String, default="full-time")
    experience_level = Column(String, default="mid")
    remote_type = Column(String, default="remote")
    status = Column(String(50), default="open")  # open | closed | draft
    is_active = Column(Boolean, default=True)
    applications_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    recruiter = relationship("RecruiterProfile", back_populates="jobs")
    company = relationship("Company", back_populates="jobs")
    job_skills = relationship("JobSkill", back_populates="job")
    applications = relationship("Application", back_populates="job")
    ai_evaluations = relationship("AiEvaluation", back_populates="job")


class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    importance = Column(Integer, default=1)  # 1 = nice to have, 2 = required, 3 = critical

    job = relationship("Job", back_populates="job_skills")
    skill = relationship("Skill")


# =============================================================================
# 5. APPLICATION MODULE
# =============================================================================

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    stage = Column(String, default="applied")  # applied | ai_review | shortlisted | interview | offer | hired | rejected
    status = Column(String(50), default="Applied")  # Applied/Shortlisted/Interview/Rejected/Hired
    match_percentage = Column(Float, default=0.0)
    ai_match_score = Column(Float, default=0.0)
    ai_review_notes = Column(Text, nullable=True)
    recruiter_notes = Column(Text, nullable=True)
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="applications")
    job = relationship("Job", back_populates="applications")


# =============================================================================
# 6. ORGANIZATION MODULE
# =============================================================================

class OrganizationProfile(Base):
    __tablename__ = "org_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    org_name = Column(String, nullable=False)
    name = Column(String, nullable=True)
    org_type = Column(String, default="community")  # college | community | startup | ngo | incubator
    type = Column(String, nullable=True)
    website = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=False)
    member_count = Column(Integer, default=0)
    events_hosted = Column(Integer, default=0)
    branding_json = Column(Text, default="{}")
    social_links_json = Column(Text, default="{}")

    user = relationship("User", back_populates="org_profile")
    hackathons = relationship("Hackathon", foreign_keys="[Hackathon.org_id]", back_populates="org")
    events = relationship("Event", foreign_keys="[Event.org_id]", back_populates="org")


# =============================================================================
# 7. EVENTS MODULE
# =============================================================================

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("org_profiles.id"))
    organization_id = Column(Integer, ForeignKey("org_profiles.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    event_type = Column(String, default="workshop")  # workshop | bootcamp | competition | conference | meetup
    venue = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    is_online = Column(Boolean, default=True)
    date = Column(DateTime, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    max_participants = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    org = relationship("OrganizationProfile", foreign_keys=[org_id], back_populates="events")


# =============================================================================
# 8. HACKATHONS & TEAMS MODULE
# =============================================================================

class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("org_profiles.id"))
    organization_id = Column(Integer, ForeignKey("org_profiles.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="upcoming")  # upcoming | active | completed
    prize_pool = Column(String, nullable=True)
    max_team_size = Column(Integer, default=4)
    registration_deadline = Column(Date, nullable=True)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    problem_tracks_json = Column(Text, default="[]")
    mentors_json = Column(Text, default="[]")
    judges_json = Column(Text, default="[]")
    submissions_json = Column(Text, default="[]")
    teams_json = Column(Text, default="[]")

    org = relationship("OrganizationProfile", foreign_keys=[org_id], back_populates="hackathons")
    participants = relationship("EventParticipant", back_populates="hackathon")
    teams = relationship("Team", back_populates="hackathon")


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    hackathon_id = Column(Integer, ForeignKey("hackathons.id"))
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    hackathon = relationship("Hackathon", back_populates="teams")
    members = relationship("TeamMember", back_populates="team")
    submissions = relationship("HackathonSubmission", back_populates="team")


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    role = Column(String(100), default="Member")

    team = relationship("Team", back_populates="members")
    candidate = relationship("CandidateProfile")


class HackathonSubmission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    github_repo = Column(Text, nullable=True)
    demo_url = Column(Text, nullable=True)
    ppt_url = Column(Text, nullable=True)
    documentation_url = Column(Text, nullable=True)
    ai_score = Column(Float, default=0.0)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    team = relationship("Team", back_populates="submissions")


class EventParticipant(Base):
    __tablename__ = "event_participants"

    id = Column(Integer, primary_key=True, index=True)
    hackathon_id = Column(Integer, ForeignKey("hackathons.id"))
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    team_name = Column(String, nullable=True)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)

    hackathon = relationship("Hackathon", back_populates="participants")


# =============================================================================
# 9. AI INTELLIGENCE MODULE
# =============================================================================

class CandidateEmbedding(Base):
    __tablename__ = "candidate_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"), unique=True)
    embedding_json = Column(Text, nullable=False)  # Vector representation JSON array
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class JobEmbedding(Base):
    __tablename__ = "job_embeddings"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), unique=True)
    embedding_json = Column(Text, nullable=False)  # Vector representation JSON array
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class AiEvaluation(Base):
    __tablename__ = "ai_evaluations"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    score = Column(Float, default=0.0)
    strengths_json = Column(Text, default="[]")
    weaknesses_json = Column(Text, default="[]")
    recommendations_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="ai_evaluations")
    job = relationship("Job", back_populates="ai_evaluations")


# =============================================================================
# 10. MESSAGING MODULE
# =============================================================================

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    messages = relationship("Message", back_populates="conversation")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User")


# =============================================================================
# 11. NOTIFICATIONS MODULE
# =============================================================================

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    body = Column(Text, nullable=True)
    notification_type = Column(String(50), default="info")  # info | success | warning | job_match | interview
    type = Column(String(50), default="info")
    is_read = Column(Boolean, default=False)
    read = Column(Boolean, default=False)
    action_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")


class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    email_welcome = Column(Boolean, default=True)
    email_security = Column(Boolean, default=True)
    email_interviews = Column(Boolean, default=True)
    email_ai_reports = Column(Boolean, default=True)
    email_jobs = Column(Boolean, default=True)
    email_hackathons = Column(Boolean, default=True)
    email_weekly_digest = Column(Boolean, default=True)
    in_app_all = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notification_preferences")


# =============================================================================
# 12. ANALYTICS MODULE
# =============================================================================

class ProfileView(Base):
    __tablename__ = "profile_views"

    id = Column(Integer, primary_key=True, index=True)
    viewer_id = Column(Integer, ForeignKey("users.id"))
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    viewed_at = Column(DateTime, default=datetime.datetime.utcnow)


class RecruiterActivity(Base):
    __tablename__ = "recruiter_activity"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id"))
    action = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


# =============================================================================
# 13. AUDIT LOGS MODULE
# =============================================================================

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(Text, nullable=False)
    module = Column(String(100), nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")


# =============================================================================
# SPECIALIZED PLATFORM FEATURE MODELS
# =============================================================================

class HiringChallenge(Base):
    __tablename__ = "hiring_challenges"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    challenge_type = Column(String, default="coding")
    rubrics_json = Column(Text, default="{}")
    deliverables_json = Column(Text, default="[]")
    deadline_days = Column(Integer, default=7)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    recruiter = relationship("RecruiterProfile", back_populates="challenges")
    submissions = relationship("ChallengeSubmission", back_populates="challenge")


class ChallengeSubmission(Base):
    __tablename__ = "challenge_submissions"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("hiring_challenges.id"))
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    github_url = Column(String, nullable=True)
    demo_url = Column(String, nullable=True)
    ppt_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    notes = Column(Text, nullable=True)

    overall_score = Column(Float, default=0.0)
    architecture_score = Column(Float, default=0.0)
    code_quality_score = Column(Float, default=0.0)
    innovation_score = Column(Float, default=0.0)
    documentation_score = Column(Float, default=0.0)
    evaluation_report_json = Column(Text, default="{}")
    is_evaluated = Column(Boolean, default=False)

    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    challenge = relationship("HiringChallenge", back_populates="submissions")
    candidate = relationship("CandidateProfile", back_populates="challenge_submissions")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id"), nullable=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    interview_type = Column(String, default="mock")
    status = Column(String, default="scheduled")
    scheduled_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    overall_score = Column(Float, default=0.0)
    technical_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    problem_solving_score = Column(Float, default=0.0)

    questions_json = Column(Text, default="[]")
    answers_json = Column(Text, default="[]")
    feedback_json = Column(Text, default="{}")
    transcript_json = Column(Text, default="[]")

    candidate = relationship("CandidateProfile", back_populates="interviews")


class ContributionReport(Base):
    __tablename__ = "contribution_reports"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    hackathon_id = Column(Integer, ForeignKey("hackathons.id"), nullable=True)

    commits = Column(Integer, default=0)
    pull_requests = Column(Integer, default=0)
    issues_closed = Column(Integer, default=0)
    code_lines = Column(Integer, default=0)
    contribution_percentage = Column(Float, default=0.0)
    feature_ownership_json = Column(Text, default="[]")
    collaboration_score = Column(Float, default=0.0)
    leadership_score = Column(Float, default=0.0)
    code_quality_score = Column(Float, default=0.0)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="contribution_reports")


class CareerGoal(Base):
    __tablename__ = "career_goals"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"), unique=True)
    target_role = Column(String, nullable=True)
    target_salary = Column(String, nullable=True)
    timeline_months = Column(Integer, default=6)
    skill_gaps_json = Column(Text, default="[]")
    learning_roadmap_json = Column(Text, default="[]")
    certifications_recommended_json = Column(Text, default="[]")
    progress_percentage = Column(Float, default=0.0)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="career_goal")
