import random
import json
from typing import Dict, Any, List

# ---------------------------------------------------------
# 1. RESUME & PORTFOLIO BUILDER AGENT
# ---------------------------------------------------------
def generate_ats_resume_agent(profile_data: Dict[str, Any], target_job_title: str) -> Dict[str, Any]:
    full_name = profile_data.get("full_name", "Professional Candidate")
    title = target_job_title or profile_data.get("title", "Software Engineer")
    skills = profile_data.get("skills", ["Python", "FastAPI", "React", "TypeScript"])
    projects = profile_data.get("projects", [])

    markdown_resume = f"""# {full_name}
**{title}** | Verified AI Talent Profile Index: {profile_data.get('talent_score', 85.0)}/100
GitHub: github.com/{profile_data.get('github_username', 'candidate')} | LinkedIn: {profile_data.get('linkedin_url', 'linkedin.com')}

---

## Executive Summary
Results-driven **{title}** with strong technical foundation in {", ".join(skills[:4])}. Proven ability to build production-grade scalable web applications, collaborate in high-velocity agile teams, and deliver robust software solutions.

---

## Core Technical Skills
- **Languages & Frameworks:** {", ".join(skills)}
- **Architecture & Systems:** RESTful APIs, Microservices, Event-Driven Architecture, Database Modeling
- **DevOps & Tooling:** Git, Docker, CI/CD Pipelines, Automated Testing

---

## Verified Projects & Technical Experience
"""
    for proj in projects[:3]:
        proj_name = proj.get("name", "Key Project")
        proj_desc = proj.get("description", "Developed high performance scalable application.")
        proj_stack = ", ".join(proj.get("tech_stack", ["Python", "Docker"]))
        markdown_resume += f"""
### {proj_name}
*Tech Stack: {proj_stack}*
- {proj_desc}
- Architected clean code pattern ensuring high maintainability and 99.9% uptime.
- Integrated automated testing and continuous integration pipelines.
"""

    if not projects:
        markdown_resume += f"""
### Production Microservice Suite
*Tech Stack: {", ".join(skills[:3])}*
- Built containerized API services with comprehensive documentation and validation schemas.
- Optimized database queries yielding 40% latency reduction.
"""

    markdown_resume += """
---

## Verified Achievements & Badges
- **Authenticity Score:** Verified by ApexTalent AI Engine (Trust Index: 98/100)
- **Hackathon Performance:** Verified Top Participant
"""

    cover_letter = f"""Dear Hiring Team,

I am writing to express my enthusiastic interest in the {title} role. With hands-on expertise in {", ".join(skills[:3])} and a verified Talent Score of {profile_data.get('talent_score', 85.0)}, I am confident in my ability to immediately contribute to your engineering goals.

Throughout my technical work, I have focused on writing clean, scalable, and well-tested code. My projects demonstrate a commitment to architectural excellence, performance optimization, and effective team collaboration.

I look forward to discussing how my verified skill set aligns with your team's vision.

Sincerely,
{full_name}
"""

    portfolio_html = f"""<div className="p-8 bg-slate-900 text-white rounded-2xl max-w-4xl mx-auto space-y-6">
  <div className="border-b border-slate-800 pb-6">
    <h1 className="text-3xl font-extrabold text-violet-400">{full_name}</h1>
    <p className="text-slate-400 text-lg">{title}</p>
    <div className="flex gap-2 mt-3">
      {"".join([f'<span class="px-2 py-1 bg-violet-950 text-violet-300 text-xs rounded">{s}</span>' for s in skills[:5]])}
    </div>
  </div>
  <div>
    <h2 className="text-xl font-bold text-slate-200 mb-3">Featured Verified Projects</h2>
    <div className="grid md:grid-cols-2 gap-4">
      {"".join([f'<div class="p-4 bg-slate-950 rounded-xl border border-slate-800"><h3 class="font-bold text-violet-300">{p.get("name")}</h3><p class="text-xs text-slate-400 mt-1">{p.get("description")}</p></div>' for p in projects])}
    </div>
  </div>
</div>"""

    return {
        "ats_resume_markdown": markdown_resume,
        "cover_letter_text": cover_letter,
        "portfolio_html": portfolio_html
    }


# ---------------------------------------------------------
# 2. VERIFICATION & AUTHENTICITY SCORE AGENT
# ---------------------------------------------------------
def verify_certificate_ocr_agent(cert_title: str, issuer: str) -> Dict[str, Any]:
    """
    Simulates OCR certificate extraction and issuer signature check.
    """
    authenticity_score = random.randint(92, 99)
    trust_badge = "Verified Certificate"
    
    return {
        "cert_title": cert_title,
        "issuer": issuer,
        "is_verified": True,
        "authenticity_score": authenticity_score,
        "badge_awarded": trust_badge,
        "verification_details": f"OCR text extraction matched issuer signature for '{issuer}'. Metadata checksum verified."
    }


# ---------------------------------------------------------
# 3. CAREER GUIDANCE & MENTOR AGENT
# ---------------------------------------------------------
def career_mentor_chat_agent(user_message: str, current_skills: List[str], target_role: str) -> Dict[str, Any]:
    msg_lower = user_message.lower()
    
    if "salary" in msg_lower or "pay" in msg_lower or "compensation" in msg_lower:
        reply = f"Based on your stack ({', '.join(current_skills[:3])}) and target role as {target_role or 'Senior Developer'}, market benchmarks in North America range from **$125,000 to $165,000/year**, and in India range from **₹18L to ₹32L/year**. Increasing your AI/vector DB expertise can add a 15-20% compensation premium."
    elif "gap" in msg_lower or "learn" in msg_lower or "roadmap" in msg_lower:
        reply = f"To excel as a top 5% {target_role or 'Lead Architect'}, focus on: 1) System Design & Distributed Caching (Redis/Kafka), 2) Vector Databases (Qdrant/Pinecone), and 3) CI/CD Infrastructure. You already have strong proficiency in {', '.join(current_skills[:2])}."
    elif "interview" in msg_lower or "prepare" in msg_lower:
        reply = "I recommend practicing in our **AI Mock Interview Center**. Work through system design scenarios and coding challenges. Focus on explaining architectural trade-offs clearly."
    else:
        reply = f"Great question! As an AI Career Mentor, I see that your verified profile is performing well. With expertise in {', '.join(current_skills)}, your next best step is building a high-impact open source project or competing in a community hackathon to boost your Recruiter Visibility score."

    return {
        "reply": reply,
        "recommended_next_step": "Try a mock interview in the Interview Center or update your learning roadmap."
    }


# ---------------------------------------------------------
# 4. AI INTERVIEW EVALUATION AGENT
# ---------------------------------------------------------
def generate_interview_questions_agent(job_title: str) -> List[Dict[str, Any]]:
    return [
        {
            "id": 1,
            "category": "Technical Architecture",
            "question": f"How would you design a high-throughput microservices architecture for a {job_title or 'Backend'} role handling 50,000 requests per second?",
            "expected_keywords": ["Load Balancer", "Caching", "Redis", "Kafka", "Database Sharding", "Async"]
        },
        {
            "id": 2,
            "category": "Code Quality & Testing",
            "question": "Walk me through how you approach unit testing, integration testing, and error handling in FastAPI / Node services.",
            "expected_keywords": ["Pytest", "Jest", "Mocking", "HTTPException", "Coverage", "CI/CD"]
        },
        {
            "id": 3,
            "category": "Behavioral & Problem Solving",
            "question": "Describe a production incident or bug you encountered in a past project. How did you diagnose and resolve it?",
            "expected_keywords": ["Logs", "Monitoring", "Root Cause Analysis", "Rollback", "Post-mortem"]
        }
    ]

def evaluate_interview_answer_agent(question: str, candidate_answer: str, expected_keywords: List[str]) -> Dict[str, Any]:
    ans_lower = candidate_answer.lower()
    matches = [kw for kw in expected_keywords if kw.lower() in ans_lower]
    keyword_score = (len(matches) / len(expected_keywords)) * 100 if expected_keywords else 80.0
    
    length_bonus = min(20.0, len(candidate_answer.split()) / 2.0)
    score = round(min(100.0, max(50.0, keyword_score * 0.7 + length_bonus + 20.0)), 1)
    
    feedback = f"Strong response covering key concepts: {', '.join(matches) if matches else 'good foundational logic'}. "
    if score >= 85:
        feedback += "Demonstrates deep architectural clarity and practical experience."
    else:
        feedback += f"Consider explicitly highlighting concepts like {', '.join(set(expected_keywords) - set(matches))} to increase your score."
        
    return {
        "score": score,
        "feedback": feedback,
        "keywords_matched": matches
    }
