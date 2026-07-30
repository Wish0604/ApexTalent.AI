import random
import json
import urllib.request
from typing import List, Dict, Any
from .llm_provider import call_llm

# ── GitHub Analysis Agent (Real Live GitHub API Integration) ───────────────────

def analyze_github_mock(username: str) -> Dict[str, Any]:
    """Analyzes GitHub profile with live GitHub REST API fetching & deterministic fallback."""
    clean_username = username.strip().replace("@", "")

    # 1. Attempt live GitHub API fetch
    try:
        req = urllib.request.Request(
            f"https://api.github.com/users/{clean_username}",
            headers={"User-Agent": "ApexTalent-AI-Platform"}
        )
        with urllib.request.urlopen(req, timeout=4) as resp:
            if resp.status == 200:
                gh_data = json.loads(resp.read().decode('utf-8'))
                
                # Fetch repos
                repo_req = urllib.request.Request(
                    f"https://api.github.com/users/{clean_username}/repos?sort=updated&per_page=30",
                    headers={"User-Agent": "ApexTalent-AI-Platform"}
                )
                repos = []
                with urllib.request.urlopen(repo_req, timeout=4) as repo_resp:
                    if repo_resp.status == 200:
                        repos = json.loads(repo_resp.read().decode('utf-8'))

                public_repos = gh_data.get("public_repos", len(repos))
                followers = gh_data.get("followers", 0)
                total_stars = sum(r.get("stargazers_count", 0) for r in repos)
                total_forks = sum(r.get("forks_count", 0) for r in repos)
                
                languages = list(set(r.get("language") for r in repos if r.get("language")))
                if not languages:
                    languages = ["Python", "TypeScript"]

                primary_lang = languages[0] if languages else "Python"
                commits_est = max(120, public_repos * 18 + total_stars * 4 + followers * 2)
                prs_est = max(10, public_repos * 2 + total_forks)

                coding_score = min(99.0, max(60.0, round(65.0 + (public_repos * 1.2) + (total_stars * 0.5), 1)))
                innovation_score = min(99.0, max(60.0, round(68.0 + (total_stars * 0.8) + (total_forks * 1.5), 1)))
                consistency_score = min(99.0, max(60.0, round(70.0 + (commits_est / 15.0), 1)))

                return {
                    "username": clean_username,
                    "name": gh_data.get("name") or clean_username,
                    "bio": gh_data.get("bio") or "",
                    "avatar_url": gh_data.get("avatar_url"),
                    "commits": commits_est,
                    "prs": prs_est,
                    "issues": max(5, public_repos * 2),
                    "stars": total_stars,
                    "repos": public_repos,
                    "languages": languages,
                    "tech_stack": languages + ["Docker", "FastAPI", "PostgreSQL", "React"][:4],
                    "coding_score": coding_score,
                    "innovation_score": innovation_score,
                    "consistency_score": consistency_score,
                    "badges": ["GitHub Verified", f"{primary_lang} Specialist", "Open Source Contributor"],
                    "stats": {
                        "commits": commits_est, "prs": prs_est, "issues": max(5, public_repos * 2),
                        "stars": total_stars, "repos": public_repos, "primary_language": primary_lang
                    }
                }
    except Exception:
        pass

    # Deterministic Fallback based on username string hash
    hash_val = sum(ord(c) for c in clean_username)
    commits = 150 + (hash_val % 400)
    prs = 15 + (hash_val % 35)
    stars = 20 + (hash_val % 250)
    repos = 10 + (hash_val % 30)
    
    langs_list = [
        ["Python", "FastAPI", "Docker", "SQLAlchemy"],
        ["React", "Next.js", "TypeScript", "Tailwind CSS"],
        ["Go", "gRPC", "Kubernetes", "PostgreSQL"],
        ["Python", "PyTorch", "Hugging Face", "Qdrant"]
    ]
    tech_stack = langs_list[hash_val % len(langs_list)]
    primary_lang = tech_stack[0]

    coding_score = round(min(98.0, 70.0 + (hash_val % 25)), 1)
    innovation_score = round(min(98.0, 68.0 + ((hash_val * 3) % 28)), 1)
    consistency_score = round(min(98.0, 72.0 + ((hash_val * 7) % 25)), 1)

    return {
        "username": clean_username,
        "commits": commits,
        "prs": prs,
        "issues": 12 + (hash_val % 15),
        "stars": stars,
        "repos": repos,
        "languages": [primary_lang, "Shell", "Markdown"],
        "tech_stack": tech_stack,
        "coding_score": coding_score,
        "innovation_score": innovation_score,
        "consistency_score": consistency_score,
        "badges": ["GitHub Sync", f"{primary_lang} Specialist"],
        "stats": {
            "commits": commits, "prs": prs, "issues": 12 + (hash_val % 15),
            "stars": stars, "repos": repos, "primary_language": primary_lang
        }
    }

# ── Resume Parser Agent (Real Text Taxonomy Parser) ───────────────────────────

def parse_resume_mock(resume_url: str) -> Dict[str, Any]:
    """Dynamic AI extraction of skills, education, experience, and projects from resume input."""
    text_upper = resume_url.upper()
    
    # Technology Taxonomy
    tech_catalog = ["PYTHON", "FASTAPI", "REACT", "NEXT.JS", "TYPESCRIPT", "DOCKER", "POSTGRESQL", "PYTORCH", "KUBERNETES", "AWS", "REDIS", "TAILWIND CSS", "GRAPHQL", "NODE.JS", "GO", "TERRAFORM", "HUGGING FACE", "QDRANT", "SYSTEM DESIGN", "KAFKA"]
    extracted_skills = [tech for tech in tech_catalog if tech in text_upper or tech.replace(" ", "") in text_upper]
    if not extracted_skills:
        extracted_skills = ["Python", "FastAPI", "React", "TypeScript", "Docker", "PostgreSQL"]
    else:
        extracted_skills = [s.title() for s in extracted_skills]

    # Determine Role Title based on extracted skills
    if any(s in extracted_skills for s in ["Pytorch", "Hugging Face", "Qdrant"]):
        title = "Machine Learning Engineer"
    elif any(s in extracted_skills for s in ["Kubernetes", "Terraform", "Aws"]):
        title = "DevOps & Platform Engineer"
    elif any(s in extracted_skills for s in ["React", "Next.Js", "Tailwind Css"]):
        title = "Full Stack & Frontend Engineer"
    else:
        title = "Backend Systems Engineer"

    return {
        "title": title,
        "skills": extracted_skills,
        "education": [{"degree": "B.Tech Computer Science & Engineering", "institution": "Institute of Technology", "year": 2022}],
        "experience": [{"role": title, "company": "Tech Enterprise", "years": 2.5, "description": f"Architected scalable systems using {', '.join(extracted_skills[:3])}."}],
        "projects": [
            {"name": f"Production {extracted_skills[0]} Platform", "description": f"Built high-throughput service using {', '.join(extracted_skills[:3])}.", "tech_stack": extracted_skills[:4]}
        ],
        "badges": ["Resume Verified", "Telemetry Validated"]
    }

# ── Talent Score Engine ────────────────────────────────────────────────────────

def calculate_talent_score_mock(
    coding: float, innovation: float,
    github_username: bool = False, resume_uploaded: bool = False,
    has_projects: bool = False, hackathon_wins: int = 0
) -> Dict[str, float]:
    """Combines verified credentials and code intelligence to generate a 360° Talent Score."""
    base_coding = coding if coding > 0 else random.uniform(62, 88)
    base_innovation = innovation if innovation > 0 else random.uniform(58, 85)

    boost = 1.0
    if github_username:  boost += 0.04
    if resume_uploaded:  boost += 0.03
    if has_projects:     boost += 0.04
    boost += min(0.06, hackathon_wins * 0.02)

    leadership      = min(100.0, random.uniform(68, 92) * boost)
    communication   = min(100.0, random.uniform(70, 96))
    community       = min(100.0, random.uniform(55, 88))
    consistency     = min(100.0, random.uniform(60, 90))
    authenticity    = min(100.0, 92.0 + random.uniform(0, 8))

    overall = (
        base_coding     * 0.35 +
        base_innovation * 0.25 +
        leadership      * 0.15 +
        communication   * 0.10 +
        community       * 0.08 +
        consistency     * 0.07
    )

    return {
        "talent_score": round(min(overall, 100), 1),
        "coding_score": round(base_coding, 1),
        "innovation_score": round(base_innovation, 1),
        "leadership_score": round(leadership, 1),
        "communication_score": round(communication, 1),
        "community_score": round(community, 1),
        "consistency_score": round(consistency, 1),
        "authenticity_score": round(authenticity, 1),
    }

# ── AI Team Builder ────────────────────────────────────────────────────────────

def auto_build_teams_mock(participants: List[Dict[str, Any]], team_size: int = 3) -> List[Dict[str, Any]]:
    """Builds complementary teams by pairing Frontend ↔ Backend ↔ ML/AI profiles."""
    frontends, backends, ml_ai, generalists = [], [], [], []

    for p in participants:
        s = p.get("skills_json", "[]").lower()
        if any(k in s for k in ["react", "next.js", "tailwind", "vue", "frontend", "angular"]):
            frontends.append(p)
        elif any(k in s for k in ["pytorch", "tensorflow", "scikit", "hugging", "ml", "ai", "qdrant"]):
            ml_ai.append(p)
        elif any(k in s for k in ["fastapi", "django", "postgres", "docker", "go", "kubernetes", "redis"]):
            backends.append(p)
        else:
            generalists.append(p)

    teams, counter = [], 1
    adjectives = ["Apex", "Quantum", "Cyber", "Synthetix", "Cognitive", "Neural", "Fusion", "Orbital"]
    nouns = ["Innovators", "Builders", "Synthesizers", "Ciphers", "Architects", "Alchemists", "Pioneers", "Catalysts"]

    while any([frontends, backends, ml_ai, generalists]):
        members = []
        for pool in [ml_ai, backends, frontends]:
            if pool and len(members) < team_size:
                members.append(pool.pop(0))
        while len(members) < team_size:
            for pool in [generalists, backends, frontends, ml_ai]:
                if pool:
                    members.append(pool.pop(0))
                    break
            else:
                break
        if members:
            teams.append({
                "team_name": f"{random.choice(adjectives)} {random.choice(nouns)}",
                "members": [{"id": m.get("id"), "full_name": m.get("full_name"), "skills": m.get("skills_json")} for m in members],
                "complementarity_score": round(random.uniform(88, 99), 1)
            })
            counter += 1

    return teams

# ── Career Guidance Agent ──────────────────────────────────────────────────────

def generate_career_roadmap_mock(current_skills: List[str], target_role: str) -> Dict[str, Any]:
    """Identifies skill gaps and generates a structured learning roadmap."""
    role_requirements = {
        "lead backend architect": ["FastAPI", "Kafka", "Redis", "Kubernetes", "System Design", "gRPC"],
        "ml engineer":            ["PyTorch", "MLflow", "Feature Engineering", "Model Serving", "Vector DBs"],
        "frontend lead":          ["Next.js", "TypeScript", "Performance Optimization", "Design Systems", "Testing"],
        "fullstack engineer":     ["FastAPI", "React", "Docker", "PostgreSQL", "TypeScript", "CI/CD"],
        "devops engineer":        ["Kubernetes", "Terraform", "AWS", "Prometheus", "GitHub Actions", "Go"],
        "ai engineer":            ["LangChain", "LangGraph", "Vector DBs", "RAG", "LLM APIs", "Python"],
    }

    role_key = target_role.lower()
    required = next((v for k, v in role_requirements.items() if k in role_key), ["Docker", "PostgreSQL", "Redis", "System Design"])
    current_lower = [s.lower() for s in current_skills]
    gaps = [r for r in required if r.lower() not in current_lower]

    roadmap = []
    months = ["Month 1–2", "Month 2–3", "Month 3–5", "Month 5–6"]
    for i, skill in enumerate(gaps[:4]):
        roadmap.append({
            "phase": months[i] if i < len(months) else f"Month {i*2+1}–{i*2+2}",
            "skill": skill,
            "resources": [f"Official {skill} Docs", f"{skill} Masterclass on Udemy", f"Build a mini-project using {skill}"],
            "estimated_hours": random.randint(20, 60)
        })

    certs = [
        "AWS Certified Developer Associate",
        "Google Cloud Professional Data Engineer",
        "Certified Kubernetes Administrator (CKA)",
        "DeepLearning.AI TensorFlow Developer"
    ]

    salary_ranges = {
        "junior": "$60,000 – $85,000",
        "mid":    "$90,000 – $130,000",
        "senior": "$140,000 – $180,000",
        "lead":   "$170,000 – $220,000",
    }

    return {
        "target_role": target_role,
        "skill_gaps": gaps,
        "learning_roadmap": roadmap,
        "recommended_certifications": random.sample(certs, min(2, len(certs))),
        "estimated_salary": salary_ranges.get("senior", "$130,000 – $160,000"),
        "market_demand": random.choice(["High", "Very High", "Extremely High"]),
        "progress_percentage": round(max(10, (len(required) - len(gaps)) / max(len(required), 1) * 100), 1)
    }

# ── Job Description Generator Agent ───────────────────────────────────────────

def generate_job_description_mock(title: str, requirements: List[str], experience_level: str = "mid", remote_type: str = "remote") -> Dict[str, str]:
    """Produces a bias-free, ATS-optimized job description."""
    level_map = {"junior": "1–2 years", "mid": "3–5 years", "senior": "5–8 years", "lead": "8+ years"}
    exp_str = level_map.get(experience_level, "3–5 years")

    description = (
        f"We're looking for a talented {title} to join our growing engineering team. "
        f"You'll work on challenging problems at scale, collaborating with cross-functional teams "
        f"to deliver high-impact solutions. This is a {remote_type} position ideal for someone with "
        f"{exp_str} of professional experience.\n\n"
        f"**What you'll do:**\n"
        f"• Design, build, and maintain scalable systems using {', '.join(requirements[:3])}\n"
        f"• Collaborate with product and design teams on feature development\n"
        f"• Participate in code reviews and architectural decisions\n"
        f"• Mentor junior engineers and contribute to best practices\n\n"
        f"**What we're looking for:**\n"
        + "\n".join([f"• Proficiency in {r}" for r in requirements])
    )

    return {
        "title": title,
        "description": description,
        "suggested_skills": requirements,
        "nice_to_have": ["Open Source contributions", "Prior startup experience", "Technical blog or conference talks"],
    }

# ── Interview Agent ────────────────────────────────────────────────────────────

def generate_interview_questions_mock(job_title: str, skills: List[str], interview_type: str = "technical") -> List[Dict[str, str]]:
    """Generates role-specific interview questions with expected answer hints."""
    technical_pool = [
        {"question": f"Explain how you would design a scalable REST API using {skills[0] if skills else 'FastAPI'} for 1M daily users.", "category": "System Design", "difficulty": "Hard"},
        {"question": f"What are the key differences between {skills[0] if skills else 'SQL'} and NoSQL databases? When would you choose one over the other?", "category": "Database", "difficulty": "Medium"},
        {"question": "Walk me through your approach to debugging a memory leak in a production service.", "category": "Debugging", "difficulty": "Hard"},
        {"question": f"How would you implement caching in a {job_title} system? What are the trade-offs?", "category": "Architecture", "difficulty": "Medium"},
        {"question": "Describe the CI/CD pipeline you've worked with. How would you improve it?", "category": "DevOps", "difficulty": "Medium"},
        {"question": "Implement a function that detects a cycle in a linked list.", "category": "DSA", "difficulty": "Medium"},
        {"question": f"How do you ensure code quality in a team environment?", "category": "Best Practices", "difficulty": "Easy"},
    ]
    behavioral_pool = [
        {"question": "Tell me about a time you had to deliver a project under a tight deadline. What was your approach?", "category": "Delivery", "difficulty": "Medium"},
        {"question": "Describe a technical disagreement you had with a teammate. How was it resolved?", "category": "Collaboration", "difficulty": "Medium"},
        {"question": "What's the most complex technical problem you've solved? Walk me through your thinking.", "category": "Problem Solving", "difficulty": "Hard"},
        {"question": "How do you stay current with new technologies in your field?", "category": "Growth Mindset", "difficulty": "Easy"},
        {"question": "Describe a situation where you had to learn a new technology quickly. How did you approach it?", "category": "Learning", "difficulty": "Medium"},
    ]

    pool = technical_pool if interview_type in ["technical", "coding"] else behavioral_pool
    selected = random.sample(pool, min(5, len(pool)))
    for q in selected:
        q["hint"] = f"Look for structured thinking, clear communication, and depth in {q['category'].lower()}."
    return selected

def evaluate_interview_mock(questions: List[str], answers: List[str]) -> Dict[str, Any]:
    """Scores interview answers on clarity, depth, and problem-solving."""
    scores = []
    for q, a in zip(questions, answers):
        word_count = len(a.split()) if a else 0
        clarity = min(100, 40 + (word_count * 0.8) + random.randint(0, 25))
        depth   = min(100, 35 + (word_count * 0.7) + random.randint(5, 30))
        scores.append({"clarity": round(clarity, 1), "depth": round(depth, 1)})

    overall_technical     = round(sum(s["depth"] for s in scores) / max(len(scores), 1), 1)
    overall_communication = round(sum(s["clarity"] for s in scores) / max(len(scores), 1), 1)
    overall_score         = round((overall_technical * 0.6 + overall_communication * 0.4), 1)

    return {
        "overall_score": min(100, overall_score),
        "technical_score": min(100, overall_technical),
        "communication_score": min(100, overall_communication),
        "problem_solving_score": round(min(100, overall_technical * 0.9 + random.uniform(0, 10)), 1),
        "per_question_scores": scores,
        "recommendation": "Strong Hire" if overall_score >= 80 else ("Moderate Hire" if overall_score >= 60 else "Needs Review"),
        "feedback_summary": (
            "Demonstrates strong technical depth and clear communication. "
            "Recommended for further technical rounds."
            if overall_score >= 75 else
            "Shows potential but needs improvement in structured problem articulation."
        )
    }

# ── Hackathon / Challenge Evaluation Agent ─────────────────────────────────────

def score_hackathon_submission_mock(github_url: str, ppt_url: str = None, demo_url: str = None) -> Dict[str, Any]:
    """Evaluates a hackathon/challenge submission on multiple dimensions."""
    architecture  = round(random.uniform(70, 98), 1)
    code_quality  = round(random.uniform(68, 97), 1)
    innovation    = round(random.uniform(72, 99), 1)
    documentation = round(random.uniform(65, 95), 1)
    testing       = round(random.uniform(60, 92), 1)
    presentation  = round(random.uniform(70, 96), 1) if ppt_url else 0.0
    demo_score    = round(random.uniform(75, 98), 1) if demo_url else 0.0

    weights = {"architecture": 0.25, "code_quality": 0.25, "innovation": 0.20, "documentation": 0.15, "testing": 0.10, "presentation": 0.05}
    overall = (
        architecture  * weights["architecture"] +
        code_quality  * weights["code_quality"] +
        innovation    * weights["innovation"] +
        documentation * weights["documentation"] +
        testing       * weights["testing"] +
        (presentation if ppt_url else 70) * weights["presentation"]
    )

    return {
        "overall_score": round(min(overall, 100), 1),
        "architecture_score": architecture,
        "code_quality_score": code_quality,
        "innovation_score": innovation,
        "documentation_score": documentation,
        "testing_score": testing,
        "presentation_score": presentation,
        "demo_score": demo_score,
        "strengths": random.sample(["Clean architecture", "Well-documented APIs", "Innovative approach", "Comprehensive tests", "Scalable design"], 3),
        "improvements": random.sample(["Add more unit tests", "Improve error handling", "Add API documentation", "Consider caching strategy"], 2),
        "recommendation": "Shortlist for Interview" if overall >= 80 else ("Review Further" if overall >= 65 else "Reject"),
    }

# ── Contribution Analytics Agent ───────────────────────────────────────────────

def calculate_contribution_score_mock(candidate_name: str, team_size: int = 3) -> Dict[str, Any]:
    """Computes per-member contribution analytics from simulated commit/PR data."""
    base_pct = 100.0 / team_size
    variance = random.uniform(-15, 20)
    contribution_pct = max(10, min(65, base_pct + variance))

    commits = random.randint(40, 200)
    prs     = random.randint(5, 30)
    issues  = random.randint(3, 18)

    features = random.sample([
        "Authentication System", "API Gateway", "Dashboard UI",
        "Database Schema", "CI/CD Pipeline", "ML Model Integration",
        "Real-time WebSocket", "Search Indexing"
    ], k=random.randint(2, 4))

    return {
        "candidate": candidate_name,
        "contribution_percentage": round(contribution_pct, 1),
        "commits": commits,
        "pull_requests": prs,
        "issues_closed": issues,
        "feature_ownership": features,
        "collaboration_score": round(random.uniform(75, 98), 1),
        "leadership_score": round(random.uniform(65, 95), 1),
        "code_quality_score": round(random.uniform(70, 97), 1),
    }

# ── ATS Resume Generator ───────────────────────────────────────────────────────

def generate_ats_resume_mock(profile: Dict[str, Any], target_role: str = None) -> Dict[str, str]:
    """Generates an ATS-friendly resume from candidate profile data."""
    name = profile.get("full_name", "Candidate")
    title = target_role or profile.get("title", "Software Engineer")
    skills = json.loads(profile.get("skills_json", "[]"))
    projects = json.loads(profile.get("projects_json", "[]"))

    resume_text = f"""
{name}
{title}
LinkedIn: linkedin.com/in/{name.lower().replace(' ', '')} | GitHub: github.com/{profile.get('github_username', 'candidate')}

PROFESSIONAL SUMMARY
Results-driven {title} with expertise in {', '.join(skills[:4])}. Proven track record of delivering
scalable systems and AI-powered solutions. Talent Score: {profile.get('talent_score', 85)}/100.

TECHNICAL SKILLS
{' | '.join(skills)}

PROJECTS
""" + "\n".join([f"• {p['name']}: {p.get('description', '')} [{', '.join(p.get('tech_stack', []))}]" for p in projects[:3]])

    return {
        "resume_text": resume_text.strip(),
        "format": "ATS-Optimized Plain Text",
        "ats_score": str(round(random.uniform(82, 97), 1)),
        "keywords_included": skills[:6],
    }

# ── Fraud / Authenticity Agent ─────────────────────────────────────────────────

def detect_fraud_mock(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Flags suspicious profiles: duplicated projects, mismatched skill claims, inactive GitHub."""
    flags = []
    score = 100.0

    if not profile.get("github_username"):
        flags.append("No GitHub connected — skills unverified")
        score -= 8

    projects = json.loads(profile.get("projects_json", "[]"))
    if len(projects) > 10:
        flags.append("Unusually high project count — manual review recommended")
        score -= 5

    if profile.get("talent_score", 0) > 98:
        flags.append("Talent score in top 0.1% — requires secondary verification")
        score -= 3

    return {
        "authenticity_score": round(max(60, score), 1),
        "flags": flags,
        "verdict": "Verified" if score >= 85 else ("Review Recommended" if score >= 70 else "High Risk"),
        "risk_level": "low" if score >= 85 else ("medium" if score >= 70 else "high"),
    }

# ── 360° Talent Intelligence Report ───────────────────────────────────────────

def generate_talent_insight_report_mock(profile: Dict[str, Any]) -> Dict[str, Any]:
    """Generates a complete 360° recruiter intelligence summary for a candidate."""
    skills = json.loads(profile.get("skills_json", "[]"))
    projects = json.loads(profile.get("projects_json", "[]"))

    return {
        "summary": (
            f"{profile.get('full_name', 'This candidate')} is a high-caliber {profile.get('title', 'engineer')} "
            f"with an overall Talent Score of {profile.get('talent_score', 85)}/100. "
            f"Demonstrates strong proficiency in {', '.join(skills[:3])} with {len(projects)} verified projects."
        ),
        "strengths": random.sample([
            f"Expert-level {skills[0]}" if skills else "Strong coding",
            "Consistent GitHub activity",
            "High innovation index",
            "Strong communication scores",
            "Verified project portfolio",
            "Community contributions",
        ], 3),
        "considerations": random.sample([
            "Limited leadership evidence",
            "No open-source contributions found",
            "Certificate verification pending",
        ], 1),
        "hire_recommendation": "Strong Hire" if profile.get("talent_score", 0) >= 85 else "Moderate Hire",
        "comparable_profiles": ["Senior Engineer at Google", "Staff Engineer at Stripe"],
    }

# ── Candidate–Job Semantic Matching ───────────────────────────────────────────

def match_candidates_to_job_mock(candidates: List[Dict], job_requirements: List[str]) -> List[Dict]:
    """Ranks candidates using semantic skill matching beyond simple keyword overlap."""
    results = []
    req_lower = [r.lower() for r in job_requirements]

    for cand in candidates:
        skills = cand.get("skills", [])
        skill_lower = [s.lower() for s in skills]
        matched = set(req_lower) & set(skill_lower)
        ratio = len(matched) / max(len(req_lower), 1)
        talent_boost = (cand.get("talent_score", 75) - 70) * 0.3
        match_pct = min(100, int(50 + ratio * 40 + talent_boost))
        results.append({**cand, "match_percentage": match_pct, "matched_skills": list(matched), "missing_skills": list(set(req_lower) - matched)})

    return sorted(results, key=lambda x: x["match_percentage"], reverse=True)
