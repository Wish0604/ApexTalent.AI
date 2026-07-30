import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text, Enum
from sqlalchemy.orm import relationship
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="candidate")  # "candidate" | "recruiter" | "organization"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False)
    org_profile = relationship("OrganizationProfile", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    # Identity
    full_name = Column(String, nullable=False)
    title = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)

    # Professional Links
    github_username = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)

    # Availability
    availability = Column(String, default="open")  # open | not_looking | open_to_offers
    salary_expectation = Column(String, nullable=True)

    # AI Talent Scores (0–100)
    talent_score = Column(Float, default=0.0)
    coding_score = Column(Float, default=0.0)
    innovation_score = Column(Float, default=0.0)
    leadership_score = Column(Float, default=0.0)
    communication_score = Column(Float, default=0.0)
    community_score = Column(Float, default=0.0)
    consistency_score = Column(Float, default=0.0)
    authenticity_score = Column(Float, default=100.0)

    # JSON flexible fields
    skills_json = Column(Text, default="[]")
    projects_json = Column(Text, default="[]")
    education_json = Column(Text, default="[]")
    experience_json = Column(Text, default="[]")
    certifications_json = Column(Text, default="[]")
    achievements_json = Column(Text, default="[]")
    hackathon_results_json = Column(Text, default="[]")
    github_stats_json = Column(Text, default="{}")
    verification_badges_json = Column(Text, default="[]")

    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="candidate_profile")
    applications = relationship("Application", back_populates="candidate")
    interviews = relationship("Interview", back_populates="candidate")
    challenge_submissions = relationship("ChallengeSubmission", back_populates="candidate")
    contribution_reports = relationship("ContributionReport", back_populates="candidate")
    career_goal = relationship("CareerGoal", back_populates="candidate", uselist=False)


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_name = Column(String, nullable=False)
    department = Column(String, nullable=True)
    website = Column(String, nullable=True)
    logo_url = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    total_hires = Column(Integer, default=0)

    user = relationship("User", back_populates="recruiter_profile")
    jobs = relationship("Job", back_populates="recruiter")
    challenges = relationship("HiringChallenge", back_populates="recruiter")


class OrganizationProfile(Base):
    __tablename__ = "org_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    org_name = Column(String, nullable=False)
    org_type = Column(String, default="community")  # college | community | bootcamp | company | incubator
    website = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    member_count = Column(Integer, default=0)
    events_hosted = Column(Integer, default=0)
    branding_json = Column(Text, default="{}")
    social_links_json = Column(Text, default="{}")

    user = relationship("User", back_populates="org_profile")
    hackathons = relationship("Hackathon", back_populates="org")
    events = relationship("Event", back_populates="org")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    requirements_json = Column(Text, default="[]")
    nice_to_have_json = Column(Text, default="[]")
    salary_range = Column(String, nullable=True)
    location = Column(String, nullable=True)
    job_type = Column(String, default="full-time")      # full-time | part-time | internship | contract
    experience_level = Column(String, default="mid")    # junior | mid | senior | lead
    remote_type = Column(String, default="remote")      # remote | hybrid | onsite
    is_active = Column(Boolean, default=True)
    applications_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    recruiter = relationship("RecruiterProfile", back_populates="jobs")
    applications = relationship("Application", back_populates="job")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    stage = Column(String, default="applied")  # applied | ai_review | challenge | interview | offer | hired | rejected
    match_percentage = Column(Float, default=0.0)
    ai_review_notes = Column(Text, nullable=True)
    recruiter_notes = Column(Text, nullable=True)
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="applications")
    job = relationship("Job", back_populates="applications")


class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("org_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="upcoming")  # upcoming | active | completed
    prize_pool = Column(String, nullable=True)
    max_team_size = Column(Integer, default=4)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    problem_tracks_json = Column(Text, default="[]")
    mentors_json = Column(Text, default="[]")
    judges_json = Column(Text, default="[]")
    submissions_json = Column(Text, default="[]")
    teams_json = Column(Text, default="[]")

    org = relationship("OrganizationProfile", back_populates="hackathons")
    participants = relationship("EventParticipant", back_populates="hackathon")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    org_id = Column(Integer, ForeignKey("org_profiles.id"))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    event_type = Column(String, default="workshop")  # workshop | bootcamp | competition | conference | meetup
    date = Column(DateTime, nullable=True)
    location = Column(String, nullable=True)
    is_online = Column(Boolean, default=True)
    max_participants = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    org = relationship("OrganizationProfile", back_populates="events")


class EventParticipant(Base):
    __tablename__ = "event_participants"

    id = Column(Integer, primary_key=True, index=True)
    hackathon_id = Column(Integer, ForeignKey("hackathons.id"))
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    team_name = Column(String, nullable=True)
    registered_at = Column(DateTime, default=datetime.datetime.utcnow)

    hackathon = relationship("Hackathon", back_populates="participants")


class HiringChallenge(Base):
    __tablename__ = "hiring_challenges"

    id = Column(Integer, primary_key=True, index=True)
    recruiter_id = Column(Integer, ForeignKey("recruiter_profiles.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    challenge_type = Column(String, default="coding")  # coding | design | ml | backend | frontend | open
    rubrics_json = Column(Text, default="{}")
    deliverables_json = Column(Text, default="[]")  # github | demo | ppt | video | docs
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

    # AI Evaluation results
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
    interview_type = Column(String, default="mock")  # mock | technical | behavioral | coding | panel
    status = Column(String, default="scheduled")      # scheduled | in_progress | completed | cancelled
    scheduled_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Scores
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


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String, default="info")  # info | success | warning | job_match | interview | challenge | hackathon
    is_read = Column(Boolean, default=False)
    action_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="notifications")
