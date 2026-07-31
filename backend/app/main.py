import sys
import io
import os
import json
import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../.env"))
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env"))

# Force UTF-8 stdout on Windows to allow unicode in print statements
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import engine, Base, SessionLocal
from .db import models
from .api import auth, candidate, recruiter, organization, ai, challenges, interviews, notifications
from .core.security import get_password_hash

# Create all DB tables
Base.metadata.create_all(bind=engine)


def seed_database():
    db = SessionLocal()
    try:
        if db.query(models.User).count() > 0:
            return  # Already seeded

        print("🌱 Seeding database with production mock data...")

        # ── Candidates ────────────────────────────────────────────────────────
        candidates_data = [
            {
                "email": "aarav@apextalent.ai", "name": "Aarav Mehta",
                "title": "Backend Systems Engineer", "bio": "Passionate about building scalable, resilient backend systems. Love FastAPI and distributed architecture.",
                "location": "Pune, India", "github": "aarav_codes", "linkedin": "https://linkedin.com/in/aaravmehta",
                "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "SQLAlchemy", "Redis", "Celery"],
                "projects": [
                    {"name": "FastAPI Microservices Platform", "description": "High-performance distributed API system with Docker orchestration and Redis caching.", "tech_stack": ["FastAPI", "Docker", "PostgreSQL", "Redis"]},
                    {"name": "Real-time Analytics Dashboard", "description": "WebSocket-powered analytics dashboard tracking 100K+ events/day.", "tech_stack": ["FastAPI", "WebSocket", "PostgreSQL", "React"]}
                ],
                "education": [{"degree": "B.Tech Computer Science", "institution": "IIT Bombay", "year": 2021}],
                "experience": [{"role": "Backend Engineer", "company": "Razorpay", "years": 2.5, "description": "Built payment processing APIs handling ₹100Cr+ daily."}],
                "badges": ["GitHub Active", "Resume Verified", "Python Expert"],
                "hackathon_results": [{"event": "HackIndia 2024", "rank": 2, "prize": "₹2,00,000", "project": "AI Payment Fraud Detector"}],
                "talent_score": 87.4, "coding": 90.0, "innovation": 83.0, "leadership": 85.0, "communication": 88.0, "community": 79.0, "consistency": 91.0,
                "availability": "open", "salary": "$120,000 – $150,000",
            },
            {
                "email": "neha@apextalent.ai", "name": "Neha Sharma",
                "title": "Frontend & Design Systems Lead", "bio": "I build delightful, accessible interfaces. Passionate about design systems, micro-animations, and React performance.",
                "location": "Bangalore, India", "github": "neha_ui", "linkedin": "https://linkedin.com/in/nehasharma",
                "skills": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "Storybook"],
                "projects": [
                    {"name": "ApexUI Design System", "description": "Open-source component library with 80+ components, used by 200+ projects.", "tech_stack": ["React", "TypeScript", "Tailwind CSS", "Storybook"]},
                    {"name": "Portfolio Generator", "description": "AI-powered portfolio site builder with real-time preview and export.", "tech_stack": ["Next.js", "Framer Motion", "TypeScript"]}
                ],
                "education": [{"degree": "B.Des Human-Computer Interaction", "institution": "NID Ahmedabad", "year": 2021}],
                "experience": [{"role": "Frontend Engineer", "company": "Meesho", "years": 2, "description": "Led redesign of checkout flow, increasing conversion by 18%."}],
                "badges": ["Resume Verified", "GitHub Active"],
                "hackathon_results": [{"event": "DesignHack 2023", "rank": 1, "prize": "₹1,50,000", "project": "Accessible Banking App"}],
                "talent_score": 88.9, "coding": 84.0, "innovation": 94.0, "leadership": 82.0, "communication": 96.0, "community": 87.0, "consistency": 85.0,
                "availability": "open_to_offers", "salary": "$110,000 – $140,000",
            },
            {
                "email": "vikram@apextalent.ai", "name": "Vikram Malhotra",
                "title": "Machine Learning Engineer", "bio": "Building the next generation of AI systems. Specializes in NLP, vector search, and production ML deployment.",
                "location": "Hyderabad, India", "github": "vikram_ml", "linkedin": "https://linkedin.com/in/vikrammalhotra",
                "skills": ["Python", "PyTorch", "Hugging Face", "Qdrant", "FastAPI", "Scikit-Learn", "LangChain", "MLflow"],
                "projects": [
                    {"name": "Semantic Product Search", "description": "Vector search engine indexing 10M+ products with <50ms latency.", "tech_stack": ["Python", "PyTorch", "Qdrant", "FastAPI"]},
                    {"name": "Document Intelligence API", "description": "LLM-powered document parsing and extraction pipeline for legal PDFs.", "tech_stack": ["LangChain", "Hugging Face", "FastAPI", "OCR"]}
                ],
                "education": [{"degree": "M.S. Artificial Intelligence", "institution": "IIT Delhi", "year": 2022}],
                "experience": [{"role": "ML Engineer", "company": "Flipkart AI Labs", "years": 1.5, "description": "Deployed BERT models for product categorization with 96% accuracy."}],
                "badges": ["GitHub Active", "Resume Verified", "ML Expert"],
                "hackathon_results": [
                    {"event": "Global AI Challenge 2024", "rank": 1, "prize": "$10,000", "project": "HealthCare RAG System"},
                    {"event": "HackIndia 2023", "rank": 3, "prize": "₹75,000", "project": "NLP Resume Parser"}
                ],
                "talent_score": 93.2, "coding": 94.0, "innovation": 97.0, "leadership": 87.0, "communication": 89.0, "community": 92.0, "consistency": 95.0,
                "availability": "open", "salary": "$150,000 – $190,000",
            },
            {
                "email": "priya@apextalent.ai", "name": "Priya Nair",
                "title": "Full Stack Engineer", "bio": "Full-stack developer who loves clean architecture and shipping fast. Experienced in startup environments.",
                "location": "Mumbai, India", "github": "priya_stack", "linkedin": "https://linkedin.com/in/priyanair",
                "skills": ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker", "AWS", "GraphQL", "Prisma"],
                "projects": [
                    {"name": "SaaS Boilerplate", "description": "Production-ready Next.js + FastAPI SaaS template with auth, billing, and RBAC.", "tech_stack": ["Next.js", "FastAPI", "Stripe", "PostgreSQL"]},
                    {"name": "Real-time Collaboration Tool", "description": "Figma-like multiplayer whiteboard using WebRTC and CRDTs.", "tech_stack": ["TypeScript", "WebRTC", "Node.js", "Redis"]}
                ],
                "education": [{"degree": "B.E. Information Technology", "institution": "BITS Pilani", "year": 2020}],
                "experience": [{"role": "Full Stack Engineer", "company": "Groww", "years": 3, "description": "Built investment dashboard features used by 5M+ users."}],
                "badges": ["GitHub Active", "Resume Verified"],
                "hackathon_results": [{"event": "StartupHack 2024", "rank": 2, "prize": "₹1,00,000", "project": "AI Financial Advisor"}],
                "talent_score": 85.1, "coding": 87.0, "innovation": 85.0, "leadership": 80.0, "communication": 88.0, "community": 81.0, "consistency": 86.0,
                "availability": "open", "salary": "$100,000 – $130,000",
            },
            {
                "email": "arjun@apextalent.ai", "name": "Arjun Patel",
                "title": "DevOps & Platform Engineer", "bio": "Infrastructure is code. I build CI/CD pipelines, Kubernetes clusters, and observability stacks that just work.",
                "location": "Remote", "github": "arjun_devops", "linkedin": "https://linkedin.com/in/arjunpatel",
                "skills": ["Kubernetes", "Terraform", "Go", "AWS", "Docker", "GitHub Actions", "Prometheus", "Grafana", "Helm"],
                "projects": [
                    {"name": "GitOps Platform", "description": "Automated GitOps deployment platform on EKS with ArgoCD and Helm.", "tech_stack": ["Kubernetes", "ArgoCD", "Helm", "AWS"]},
                    {"name": "Observability Stack", "description": "Complete Prometheus + Grafana + Loki monitoring solution for microservices.", "tech_stack": ["Prometheus", "Grafana", "Loki", "Docker"]}
                ],
                "education": [{"degree": "B.Tech Information Technology", "institution": "NIT Trichy", "year": 2019}],
                "experience": [{"role": "DevOps Engineer", "company": "Razorpay", "years": 4, "description": "Reduced deployment time by 70% via Kubernetes migration."}],
                "badges": ["GitHub Active", "Resume Verified", "DevOps Expert"],
                "hackathon_results": [],
                "talent_score": 86.3, "coding": 83.0, "innovation": 82.0, "leadership": 88.0, "communication": 86.0, "community": 84.0, "consistency": 92.0,
                "availability": "open_to_offers", "salary": "$130,000 – $165,000",
            }
        ]

        candidate_profiles = []
        candidate_users = []
        for c in candidates_data:
            user = models.User(email=c["email"], hashed_password=get_password_hash("password123"), role="candidate")
            db.add(user)
            db.commit()
            db.refresh(user)
            candidate_users.append(user)

            profile = models.CandidateProfile(
                user_id=user.id, full_name=c["name"], title=c["title"],
                bio=c["bio"], location=c["location"], github_username=c["github"],
                linkedin_url=c["linkedin"], availability=c["availability"],
                salary_expectation=c["salary"],
                skills_json=json.dumps(c["skills"]),
                projects_json=json.dumps(c["projects"]),
                education_json=json.dumps(c["education"]),
                experience_json=json.dumps(c["experience"]),
                certifications_json=json.dumps([]),
                achievements_json=json.dumps([]),
                hackathon_results_json=json.dumps(c["hackathon_results"]),
                github_stats_json=json.dumps({"commits": 320, "prs": 28, "stars": 145, "repos": 24}),
                verification_badges_json=json.dumps(c["badges"]),
                talent_score=c["talent_score"], coding_score=c["coding"],
                innovation_score=c["innovation"], leadership_score=c["leadership"],
                communication_score=c["communication"], community_score=c["community"],
                consistency_score=c["consistency"], authenticity_score=98.5,
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
            candidate_profiles.append(profile)

        # ── Recruiter ─────────────────────────────────────────────────────────
        rec_user = models.User(email="recruiter@apextalent.ai", hashed_password=get_password_hash("password123"), role="recruiter")
        db.add(rec_user)
        db.commit()
        db.refresh(rec_user)

        rec_profile = models.RecruiterProfile(
            user_id=rec_user.id, company_name="ApexTalent Global Corp",
            department="Global Engineering Sourcing", website="https://apextalent.ai",
            is_verified=True, total_hires=47
        )
        db.add(rec_profile)
        db.commit()
        db.refresh(rec_profile)

        # ── Jobs ──────────────────────────────────────────────────────────────
        jobs_data = [
            {
                "title": "Senior Backend Systems Engineer", "description": "Architect resilient microservices and maintain high-throughput FastAPI pipelines for our global payments platform.",
                "requirements": ["FastAPI", "Python", "PostgreSQL", "Docker", "Redis", "Kafka"],
                "salary": "$130,000 – $160,000", "location": "Remote (Global)", "type": "full-time", "level": "senior", "remote": "remote"
            },
            {
                "title": "AI Platform Engineer", "description": "Deploy transformer models, build semantic search indices, and maintain our AI intelligence layer powering 10M+ talent recommendations.",
                "requirements": ["Python", "PyTorch", "Hugging Face", "Qdrant", "FastAPI", "LangChain"],
                "salary": "$150,000 – $190,000", "location": "Hyderabad / Remote", "type": "full-time", "level": "senior", "remote": "hybrid"
            },
            {
                "title": "Frontend Lead Engineer", "description": "Lead the design and development of our candidate-facing portals using Next.js and Framer Motion. Own the design system.",
                "requirements": ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
                "salary": "$110,000 – $145,000", "location": "Bangalore / Remote", "type": "full-time", "level": "lead", "remote": "hybrid"
            },
            {
                "title": "DevOps & Infrastructure Engineer", "description": "Build and maintain our Kubernetes-based infrastructure serving 500K+ daily API requests with 99.99% uptime.",
                "requirements": ["Kubernetes", "Terraform", "AWS", "Docker", "Prometheus", "GitHub Actions"],
                "salary": "$120,000 – $155,000", "location": "Remote", "type": "full-time", "level": "mid", "remote": "remote"
            },
            {
                "title": "Full Stack Engineer (Internship)", "description": "Join our core product team as an intern and work on real features used by thousands of candidates and recruiters.",
                "requirements": ["TypeScript", "Next.js", "FastAPI", "PostgreSQL"],
                "salary": "$4,000 – $6,000 / month", "location": "Pune / Remote", "type": "internship", "level": "junior", "remote": "hybrid"
            }
        ]

        seeded_jobs = []
        for j in jobs_data:
            job = models.Job(
                recruiter_id=rec_profile.id, title=j["title"], description=j["description"],
                requirements_json=json.dumps(j["requirements"]),
                nice_to_have_json=json.dumps(["Open Source contributions", "System design experience"]),
                salary_range=j["salary"], location=j["location"],
                job_type=j["type"], experience_level=j["level"], remote_type=j["remote"],
                applications_count=0, is_active=True
            )
            db.add(job)
            seeded_jobs.append(job)
        db.commit()

        # ── Applications (pipeline seeding) ───────────────────────────────────
        stages = ["applied", "ai_review", "challenge", "interview", "offer"]
        for i, (cprof, job) in enumerate(zip(candidate_profiles[:5], seeded_jobs[:5])):
            app = models.Application(
                candidate_id=cprof.id, job_id=job.id,
                stage=stages[i % len(stages)],
                match_percentage=round(70 + (cprof.talent_score - 80) * 2, 1),
                ai_review_notes=f"AI Pre-screening: Strong match. {cprof.talent_score}/100 Talent Score."
            )
            db.add(app)
            job.applications_count += 1
        db.commit()

        # ── Organization ──────────────────────────────────────────────────────
        org_user = models.User(email="community@apextalent.ai", hashed_password=get_password_hash("password123"), role="organization")
        db.add(org_user)
        db.commit()
        db.refresh(org_user)

        org_profile = models.OrganizationProfile(
            user_id=org_user.id, org_name="ApexTalent Developer Alliance",
            org_type="community", website="https://community.apextalent.ai",
            is_verified=True, member_count=len(candidate_profiles),
            events_hosted=2,
            branding_json=json.dumps({"color": "#6366f1", "logo": None}),
            social_links_json=json.dumps({"twitter": "https://twitter.com/apextalentai", "github": "https://github.com/apextalent"})
        )
        db.add(org_profile)
        db.commit()
        db.refresh(org_profile)

        # ── Hackathons ─────────────────────────────────────────────────────────
        hack1 = models.Hackathon(
            org_id=org_profile.id,
            title="Global AI Developer Challenge 2026",
            description="Build cutting-edge agentic AI workflows and LLM-powered applications. Evaluation focuses on architecture, innovation, and real-world business impact.",
            status="active", prize_pool="$25,000 + Cloud Credits",
            max_team_size=4,
            start_date=datetime.datetime.utcnow(),
            end_date=datetime.datetime.utcnow() + datetime.timedelta(days=14),
            problem_tracks_json=json.dumps(["AI Agents", "Healthcare AI", "FinTech Innovation", "Developer Tools"]),
            mentors_json=json.dumps(["Dr. Priya Rao (IIT)", "Raj Kumar (Google DeepMind)"]),
            judges_json=json.dumps(["CTO, Razorpay", "VP Engineering, Flipkart"]),
            submissions_json=json.dumps([]),
            teams_json=json.dumps([])
        )
        hack2 = models.Hackathon(
            org_id=org_profile.id,
            title="Open Source Sprint — Build for India",
            description="A 72-hour hackathon focused on impactful open-source contributions for digital public goods.",
            status="upcoming", prize_pool="₹5,00,000 + Mentorship",
            max_team_size=3,
            start_date=datetime.datetime.utcnow() + datetime.timedelta(days=30),
            end_date=datetime.datetime.utcnow() + datetime.timedelta(days=33),
            problem_tracks_json=json.dumps(["EdTech", "AgriTech", "Healthcare", "GovTech"]),
            submissions_json=json.dumps([]),
            teams_json=json.dumps([])
        )
        db.add(hack1); db.add(hack2)
        db.commit()
        db.refresh(hack1); db.refresh(hack2)

        # Register all candidates to hackathon 1
        for cprof in candidate_profiles:
            p = models.EventParticipant(hackathon_id=hack1.id, candidate_id=cprof.id)
            db.add(p)
        db.commit()

        # ── Hiring Challenges ──────────────────────────────────────────────────
        challenge1 = models.HiringChallenge(
            recruiter_id=rec_profile.id, job_id=seeded_jobs[0].id,
            title="Design a Scalable Job Matching API",
            description="Build a FastAPI service that semantically matches candidates to jobs using skill embeddings. Include proper error handling, tests, and documentation.",
            challenge_type="backend",
            rubrics_json=json.dumps({"architecture": 0.30, "code_quality": 0.25, "innovation": 0.20, "testing": 0.15, "documentation": 0.10}),
            deliverables_json=json.dumps(["github", "documentation", "demo"]),
            deadline_days=7, is_active=True
        )
        challenge2 = models.HiringChallenge(
            recruiter_id=rec_profile.id, job_id=seeded_jobs[1].id,
            title="Build a RAG-Powered Document Q&A System",
            description="Create an AI system that can ingest PDF documents and answer questions using retrieval-augmented generation. Bonus: Multi-document support.",
            challenge_type="ml",
            rubrics_json=json.dumps({"innovation": 0.35, "architecture": 0.25, "documentation": 0.20, "code_quality": 0.20}),
            deliverables_json=json.dumps(["github", "demo", "ppt"]),
            deadline_days=10, is_active=True
        )
        db.add(challenge1); db.add(challenge2)
        db.commit()

        # ── Seed Interviews (mock) ─────────────────────────────────────────────
        from .services import mock_ai_services
        for cprof, user in zip(candidate_profiles[:3], candidate_users[:3]):
            skills = json.loads(cprof.skills_json or "[]")
            questions = mock_ai_services.generate_interview_questions_mock(cprof.title or "Engineer", skills, "technical")
            interview = models.Interview(
                candidate_id=cprof.id,
                recruiter_id=rec_profile.id,
                job_id=seeded_jobs[0].id,
                interview_type="technical",
                status="scheduled",
                scheduled_at=datetime.datetime.utcnow() + datetime.timedelta(days=3),
                questions_json=json.dumps(questions),
                answers_json=json.dumps([]),
                feedback_json=json.dumps({}),
            )
            db.add(interview)

        # ── Notifications ──────────────────────────────────────────────────────
        for user, cprof in zip(candidate_users, candidate_profiles):
            db.add(models.Notification(
                user_id=user.id,
                title="🎉 Welcome to ApexTalent AI!",
                message="Your AI Talent Profile is ready. Sync your GitHub to boost your Talent Score.",
                notification_type="info"
            ))
            db.add(models.Notification(
                user_id=user.id,
                title="🏆 New Hackathon Available",
                message="Global AI Developer Challenge 2026 is now accepting registrations. Prize pool: $25,000!",
                notification_type="hackathon",
                action_url="/candidate?tab=hackathons"
            ))
            db.add(models.Notification(
                user_id=user.id,
                title=f"💼 {round(70 + (cprof.talent_score - 80) * 2, 0):.0f}% Job Match Found",
                message="We found a strong match for you. Check your Job Matches tab.",
                notification_type="job_match",
                action_url="/candidate?tab=jobs"
            ))

        db.commit()
        print("✅ Database seeded successfully with 5 candidates, 5 jobs, 2 hackathons, 2 challenges, 3 interviews, and notifications.")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding error: {e}")
        raise
    finally:
        db.close()


seed_database()

app = FastAPI(
    title="ApexTalent AI Platform API",
    description="The AI-powered Talent Intelligence Ecosystem — Candidate · Recruiter · Organization",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router,          prefix="/api/v1")
app.include_router(auth.router)           # Direct OAuth callback support (/auth/github/callback)
app.include_router(candidate.router,     prefix="/api/v1")
app.include_router(recruiter.router,     prefix="/api/v1")
app.include_router(organization.router,  prefix="/api/v1")
app.include_router(ai.router,            prefix="/api/v1")
app.include_router(challenges.router,    prefix="/api/v1")
app.include_router(interviews.router,    prefix="/api/v1")
app.include_router(notifications.router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "platform": "ApexTalent AI",
        "version": "2.0.0",
        "status": "operational",
        "portals": ["Candidate", "Recruiter", "Organization"],
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "healthy", "service": "ApexTalent API"}
