-- =============================================================================
-- APEXTALENT AI PLATFORM — FULL PRODUCTION POSTGRESQL DATABASE SCHEMA
-- Covers 13 Core Modules: Auth, Candidate, Recruiter, Jobs, Applications,
-- Organizations, Events, Hackathons, AI Intelligence, Messaging, Notifications,
-- Analytics, and Audit Logs.
-- =============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. AUTHENTICATION & ROLES MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('candidate'), ('recruiter'), ('organization'), ('admin')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    phone VARCHAR(20),
    profile_image TEXT,
    role VARCHAR(50) DEFAULT 'candidate',
    account_status VARCHAR(50) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS oauth_accounts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_verifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. CANDIDATE MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS candidate_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    headline TEXT,
    title VARCHAR(255),
    bio TEXT,
    summary TEXT,
    location VARCHAR(255),
    avatar_url TEXT,
    portfolio_url TEXT,
    github_username VARCHAR(100),
    github_url TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    availability VARCHAR(50) DEFAULT 'open',
    salary_expectation VARCHAR(100),
    talent_score FLOAT DEFAULT 0.0,
    coding_score FLOAT DEFAULT 0.0,
    innovation_score FLOAT DEFAULT 0.0,
    leadership_score FLOAT DEFAULT 0.0,
    communication_score FLOAT DEFAULT 0.0,
    community_score FLOAT DEFAULT 0.0,
    consistency_score FLOAT DEFAULT 0.0,
    authenticity_score FLOAT DEFAULT 100.0,
    skills_json TEXT DEFAULT '[]',
    projects_json TEXT DEFAULT '[]',
    education_json TEXT DEFAULT '[]',
    experience_json TEXT DEFAULT '[]',
    certifications_json TEXT DEFAULT '[]',
    achievements_json TEXT DEFAULT '[]',
    hackathon_results_json TEXT DEFAULT '[]',
    github_stats_json TEXT DEFAULT '{}',
    verification_badges_json TEXT DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS candidate_skills (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    level VARCHAR(50) DEFAULT 'Intermediate'
);

CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    institute TEXT NOT NULL,
    degree TEXT,
    specialization TEXT,
    graduation_year INT
);

CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    designation TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    github_repo TEXT,
    live_demo TEXT,
    tech_stack_json TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS certificates (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    issuer TEXT,
    certificate_url TEXT,
    issue_date DATE
);

-- -----------------------------------------------------------------------------
-- 3. RECRUITER & COMPANY MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website TEXT,
    logo_url TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    description TEXT,
    headquarters VARCHAR(255),
    reg_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruiter_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_id INT REFERENCES companies(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    department VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    total_hires INT DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 4. JOB MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE SET NULL,
    recruiter_id INT REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements_json TEXT DEFAULT '[]',
    nice_to_have_json TEXT DEFAULT '[]',
    salary_range VARCHAR(100),
    salary_min FLOAT,
    salary_max FLOAT,
    location VARCHAR(255),
    employment_type VARCHAR(50) DEFAULT 'full-time',
    job_type VARCHAR(50) DEFAULT 'full-time',
    experience_level VARCHAR(50) DEFAULT 'mid',
    remote_type VARCHAR(50) DEFAULT 'remote',
    status VARCHAR(50) DEFAULT 'open',
    is_active BOOLEAN DEFAULT TRUE,
    applications_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_skills (
    id SERIAL PRIMARY KEY,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    importance INT DEFAULT 1
);

-- -----------------------------------------------------------------------------
-- 5. APPLICATION MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    stage VARCHAR(50) DEFAULT 'applied',
    status VARCHAR(50) DEFAULT 'Applied',
    match_percentage FLOAT DEFAULT 0.0,
    ai_match_score FLOAT DEFAULT 0.0,
    ai_review_notes TEXT,
    recruiter_notes TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 6. ORGANIZATION MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS org_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    org_name VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    org_type VARCHAR(50) DEFAULT 'community',
    type VARCHAR(50),
    website VARCHAR(255),
    logo_url TEXT,
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    member_count INT DEFAULT 0,
    events_hosted INT DEFAULT 0,
    branding_json TEXT DEFAULT '{}',
    social_links_json TEXT DEFAULT '{}'
);

-- -----------------------------------------------------------------------------
-- 7. EVENTS MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    org_id INT REFERENCES org_profiles(id) ON DELETE CASCADE,
    organization_id INT REFERENCES org_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(50) DEFAULT 'workshop',
    venue TEXT,
    location VARCHAR(255),
    is_online BOOLEAN DEFAULT TRUE,
    date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    max_participants INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 8. HACKATHONS MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS hackathons (
    id SERIAL PRIMARY KEY,
    org_id INT REFERENCES org_profiles(id) ON DELETE CASCADE,
    organization_id INT REFERENCES org_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'upcoming',
    prize_pool VARCHAR(100),
    max_team_size INT DEFAULT 4,
    registration_deadline DATE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    problem_tracks_json TEXT DEFAULT '[]',
    mentors_json TEXT DEFAULT '[]',
    judges_json TEXT DEFAULT '[]',
    submissions_json TEXT DEFAULT '[]',
    teams_json TEXT DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    hackathon_id INT REFERENCES hackathons(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'Member'
);

CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    github_repo TEXT,
    demo_url TEXT,
    ppt_url TEXT,
    documentation_url TEXT,
    ai_score FLOAT DEFAULT 0.0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_participants (
    id SERIAL PRIMARY KEY,
    hackathon_id INT REFERENCES hackathons(id) ON DELETE CASCADE,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    team_name VARCHAR(255),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 9. AI INTELLIGENCE MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS candidate_embeddings (
    id SERIAL PRIMARY KEY,
    candidate_id INT UNIQUE REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    embedding_json TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_embeddings (
    id SERIAL PRIMARY KEY,
    job_id INT UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,
    embedding_json TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_evaluations (
    id SERIAL PRIMARY KEY,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
    score FLOAT DEFAULT 0.0,
    strengths_json TEXT DEFAULT '[]',
    weaknesses_json TEXT DEFAULT '[]',
    recommendations_json TEXT DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 10. MESSAGING MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 11. NOTIFICATIONS MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    body TEXT,
    notification_type VARCHAR(50) DEFAULT 'info',
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 12. ANALYTICS MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS profile_views (
    id SERIAL PRIMARY KEY,
    viewer_id INT REFERENCES users(id) ON DELETE CASCADE,
    candidate_id INT REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recruiter_activity (
    id SERIAL PRIMARY KEY,
    recruiter_id INT REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 13. AUDIT LOGS MODULE
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    module VARCHAR(100),
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
