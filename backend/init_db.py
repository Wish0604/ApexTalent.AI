"""
ApexTalent AI — Full Database Initialization & Seeding Script
Initializes all 13 database modules across SQLite & PostgreSQL.
"""

import sys
import io
import json
import datetime

if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

from app.db.database import engine, Base, SessionLocal
from app.db import models
from app.core.security import get_password_hash


def init_full_database(reset: bool = True):
    print("==================================================================")
    print("🚀 APEXTALENT AI — INITIALIZING FULL PRODUCTION DATABASE SCHEMA")
    print("==================================================================")

    if reset:
        print("1. Dropping existing tables for clean schema generation...")
        Base.metadata.drop_all(bind=engine)

    print("2. Creating all 13 module database tables...")
    Base.metadata.create_all(bind=engine)
    print("   ✅ Tables created successfully.")

    db = SessionLocal()
    try:
        if db.query(models.User).count() > 0:
            print("   ℹ️ Database already populated with data.")
            return

        print("3. Seeding Roles...")
        roles = ["candidate", "recruiter", "organization", "admin"]
        for rname in roles:
            if not db.query(models.Role).filter(models.Role.name == rname).first():
                db.add(models.Role(name=rname))
        db.commit()

        print("4. Seeding Skills Catalog...")
        skill_names = [
            "Python", "FastAPI", "React", "Next.js", "TypeScript", "Docker",
            "PostgreSQL", "PyTorch", "Kubernetes", "AWS", "Redis", "Tailwind CSS",
            "GraphQL", "Node.js", "Go", "Terraform", "Hugging Face", "Qdrant",
            "System Design", "Kafka"
        ]
        db_skills = {}
        for sname in skill_names:
            sk = models.Skill(name=sname)
            db.add(sk)
            db.commit()
            db.refresh(sk)
            db_skills[sname] = sk

        print("5. Seeding Candidates & Profiles...")
        candidates_data = [
            {
                "email": "aarav@apextalent.ai", "first": "Aarav", "last": "Mehta",
                "title": "Backend Systems Engineer", "bio": "Building scalable distributed systems with FastAPI and Docker.",
                "location": "Pune, India", "github": "aarav_codes", "linkedin": "https://linkedin.com/in/aaravmehta",
                "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "Kafka"],
                "education": [{"institute": "IIT Bombay", "degree": "B.Tech Computer Science", "specialization": "Distributed Systems", "year": 2021}],
                "experience": [{"company": "Razorpay", "designation": "Backend Engineer", "description": "API processing pipelines."}],
                "projects": [{"title": "FastAPI Microservices", "desc": "High-throughput API platform", "tech": ["FastAPI", "Docker", "Redis"]}],
                "score": 87.4, "coding": 90.0, "innovation": 83.0, "leadership": 85.0, "comm": 88.0, "commu": 79.0, "cons": 91.0,
            },
            {
                "email": "neha@apextalent.ai", "first": "Neha", "last": "Sharma",
                "title": "Frontend & Design Systems Lead", "bio": "Building accessible UI components and Next.js applications.",
                "location": "Bangalore, India", "github": "neha_ui", "linkedin": "https://linkedin.com/in/nehasharma",
                "skills": ["React", "Next.js", "TypeScript", "Tailwind CSS"],
                "education": [{"institute": "NID Ahmedabad", "degree": "B.Des HCI", "specialization": "UI/UX", "year": 2021}],
                "experience": [{"company": "Meesho", "designation": "Frontend Lead", "description": "Checkout flow optimization."}],
                "projects": [{"title": "ApexUI Component Library", "desc": "80+ React components", "tech": ["React", "TypeScript", "Tailwind CSS"]}],
                "score": 88.9, "coding": 84.0, "innovation": 94.0, "leadership": 82.0, "comm": 96.0, "commu": 87.0, "cons": 85.0,
            },
            {
                "email": "vikram@apextalent.ai", "first": "Vikram", "last": "Malhotra",
                "title": "Machine Learning Engineer", "bio": "Specialized in NLP, PyTorch, and Qdrant vector search.",
                "location": "Hyderabad, India", "github": "vikram_ml", "linkedin": "https://linkedin.com/in/vikrammalhotra",
                "skills": ["Python", "PyTorch", "Hugging Face", "Qdrant", "FastAPI"],
                "education": [{"institute": "IIT Delhi", "degree": "M.S. AI", "specialization": "Deep Learning", "year": 2022}],
                "experience": [{"company": "Flipkart AI Labs", "designation": "ML Engineer", "description": "BERT categorization pipeline."}],
                "projects": [{"title": "Semantic Search Engine", "desc": "Vector search with <50ms latency", "tech": ["Python", "PyTorch", "Qdrant"]}],
                "score": 93.2, "coding": 94.0, "innovation": 97.0, "leadership": 87.0, "comm": 89.0, "commu": 92.0, "cons": 95.0,
            }
        ]

        candidate_profiles = []
        candidate_users = []
        for c in candidates_data:
            user = models.User(
                first_name=c["first"], last_name=c["last"], email=c["email"],
                hashed_password=get_password_hash("password123"), role="candidate",
                email_verified=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            candidate_users.append(user)

            cprof = models.CandidateProfile(
                user_id=user.id, full_name=f"{c['first']} {c['last']}", headline=f"{c['title']} at ApexTalent",
                title=c["title"], bio=c["bio"], summary=c["bio"], location=c["location"],
                github_username=c["github"], github_url=f"https://github.com/{c['github']}",
                linkedin_url=c["linkedin"], availability="open", salary_expectation="$120,000 – $160,000",
                talent_score=c["score"], coding_score=c["coding"], innovation_score=c["innovation"],
                leadership_score=c["leadership"], communication_score=c["comm"], community_score=c["commu"],
                consistency_score=c["cons"], authenticity_score=99.0,
                skills_json=json.dumps(c["skills"]), projects_json=json.dumps(c["projects"]),
                education_json=json.dumps(c["education"]), experience_json=json.dumps(c["experience"]),
                github_stats_json=json.dumps({"commits": 410, "prs": 35, "stars": 180, "repos": 28}),
                verification_badges_json=json.dumps(["GitHub Active", "Resume Verified"])
            )
            db.add(cprof)
            db.commit()
            db.refresh(cprof)
            candidate_profiles.append(cprof)

            # Normalized tables seeding
            for sk_name in c["skills"]:
                if sk_name in db_skills:
                    db.add(models.CandidateSkill(candidate_id=cprof.id, skill_id=db_skills[sk_name].id, level="Expert"))

            for edu in c["education"]:
                db.add(models.Education(candidate_id=cprof.id, institute=edu["institute"], degree=edu["degree"], specialization=edu["specialization"], graduation_year=edu["year"]))

            for exp in c["experience"]:
                db.add(models.Experience(candidate_id=cprof.id, company=exp["company"], designation=exp["designation"], description=exp["description"]))

            for prj in c["projects"]:
                db.add(models.Project(candidate_id=cprof.id, title=prj["title"], description=prj["desc"], tech_stack_json=json.dumps(prj["tech"])))
        db.commit()

        print("6. Seeding Companies & Recruiters...")
        company = models.Company(
            name="ApexTalent Global Corp", website="https://apextalent.ai",
            logo_url="https://apextalent.ai/logo.png", industry="Artificial Intelligence",
            company_size="100-500", description="Leading evidence-based AI talent platform."
        )
        db.add(company)
        db.commit()
        db.refresh(company)

        rec_user = models.User(
            first_name="Global", last_name="Recruiter", email="recruiter@apextalent.ai",
            hashed_password=get_password_hash("password123"), role="recruiter", email_verified=True
        )
        db.add(rec_user)
        db.commit()
        db.refresh(rec_user)

        rec_profile = models.RecruiterProfile(
            user_id=rec_user.id, company_id=company.id, company_name=company.name,
            designation="VP of Global Sourcing", department="Engineering", is_verified=True, total_hires=52
        )
        db.add(rec_profile)
        db.commit()
        db.refresh(rec_profile)

        print("7. Seeding Jobs & Applications...")
        job = models.Job(
            company_id=company.id, recruiter_id=rec_profile.id,
            title="Senior AI Systems Engineer", description="Architect high-performance FastAPI microservices and vector pipelines.",
            requirements_json=json.dumps(["FastAPI", "Python", "PostgreSQL", "Docker", "PyTorch"]),
            salary_range="$140,000 – $180,000", salary_min=140000, salary_max=180000,
            location="Remote", employment_type="full-time", job_type="full-time",
            experience_level="senior", remote_type="remote", is_active=True, applications_count=len(candidate_profiles)
        )
        db.add(job)
        db.commit()
        db.refresh(job)

        for cprof in candidate_profiles:
            app = models.Application(
                candidate_id=cprof.id, job_id=job.id, stage="ai_review", status="Shortlisted",
                match_percentage=round(75 + (cprof.talent_score - 80) * 1.5, 1),
                ai_match_score=cprof.talent_score, ai_review_notes=f"Strong match. Talent score: {cprof.talent_score}/100"
            )
            db.add(app)
        db.commit()

        print("8. Seeding Organizations, Hackathons & Teams...")
        org_user = models.User(
            first_name="Community", last_name="Lead", email="community@apextalent.ai",
            hashed_password=get_password_hash("password123"), role="organization", email_verified=True
        )
        db.add(org_user)
        db.commit()
        db.refresh(org_user)

        org_profile = models.OrganizationProfile(
            user_id=org_user.id, org_name="ApexTalent Developer Alliance", name="ApexTalent Alliance",
            org_type="community", website="https://community.apextalent.ai", is_verified=True,
            member_count=1200, events_hosted=5
        )
        db.add(org_profile)
        db.commit()
        db.refresh(org_profile)

        hackathon = models.Hackathon(
            org_id=org_profile.id, organization_id=org_profile.id,
            title="Global Agentic AI Hackathon 2026",
            description="Build autonomous agentic workflows using FastAPI and PyTorch.",
            status="active", prize_pool="$30,000", max_team_size=4,
            start_date=datetime.datetime.utcnow(), end_date=datetime.datetime.utcnow() + datetime.timedelta(days=14),
            problem_tracks_json=json.dumps(["AI Agents", "Developer Tools", "Healthcare AI"])
        )
        db.add(hackathon)
        db.commit()
        db.refresh(hackathon)

        team = models.Team(hackathon_id=hackathon.id, name="Neural Agents")
        db.add(team)
        db.commit()
        db.refresh(team)

        for cprof in candidate_profiles:
            db.add(models.TeamMember(team_id=team.id, candidate_id=cprof.id))
        db.commit()

        db.add(models.HackathonSubmission(
            team_id=team.id, title="Agentic Talent Matcher", description="Vector-based autonomous sourcing agent",
            github_repo="https://github.com/apextalent/neural-agents", demo_url="https://demo.apextalent.ai", ai_score=94.5
        ))
        db.commit()

        print("9. Seeding AI Intelligence (Embeddings & Evaluations)...")
        for cprof in candidate_profiles:
            db.add(models.CandidateEmbedding(candidate_id=cprof.id, embedding_json=json.dumps([0.12, 0.85, 0.43, 0.91, 0.77])))
            db.add(models.AiEvaluation(
                candidate_id=cprof.id, job_id=job.id, score=cprof.talent_score,
                strengths_json=json.dumps(["Strong FastAPI skills", "High code quality", "Active GitHub repository"]),
                weaknesses_json=json.dumps(["Limited Kubernetes production experience"]),
                recommendations_json=json.dumps(["Proceed to technical interview phase"])
            ))
        db.commit()

        print("10. Seeding Conversations & Messages...")
        conv = models.Conversation()
        db.add(conv)
        db.commit()
        db.refresh(conv)

        db.add(models.Message(conversation_id=conv.id, sender_id=rec_user.id, message="Hi Aarav, your AI talent score caught our attention for the Senior AI Systems Engineer role!"))
        db.add(models.Message(conversation_id=conv.id, sender_id=candidate_users[0].id, message="Thank you! I would love to discuss the engineering stack."))
        db.commit()

        print("11. Seeding Notifications...")
        for user in candidate_users:
            db.add(models.Notification(
                user_id=user.id, title="🎉 Welcome to ApexTalent AI",
                message="Your full 13-module talent intelligence profile is now live.", notification_type="info"
            ))
        db.commit()

        print("12. Seeding Analytics & Audit Logs...")
        for cprof in candidate_profiles:
            db.add(models.ProfileView(viewer_id=rec_user.id, candidate_id=cprof.id))
        db.add(models.RecruiterActivity(recruiter_id=rec_profile.id, action="Sourced candidate pipeline for AI Engineer role"))
        db.add(models.AuditLog(user_id=rec_user.id, action="Login successful", module="Auth", ip_address="127.0.0.1"))
        db.commit()

        print("==================================================================")
        print("✨ FULL DATABASE INITIALIZATION & SEEDING COMPLETED SUCCESSFULLY!")
        print("==================================================================")

    except Exception as e:
        db.rollback()
        print(f"❌ Initialization Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_full_database(reset=True)
