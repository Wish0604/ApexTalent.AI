from typing import Dict, Any, List, Optional

def headhunter_sourcing_agent(
    role_title: str,
    required_skills: Optional[List[str]] = None,
    candidate_pool: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    AI Autonomous Candidate Headhunter & Outbound Sourcing Agent.
    Scans candidate repository profiles, computes alignment match scores,
    and crafts personalized multi-step candidate outreach sequences.
    """
    req_skills = required_skills if required_skills and len(required_skills) > 0 else ["FastAPI", "Python", "Docker"]
    
    if not candidate_pool:
        candidate_pool = [
            {
                "id": 1,
                "full_name": "Aarav Mehta",
                "title": "Senior FastAPI Systems Architect",
                "talent_score": 91.5,
                "skills": ["FastAPI", "Python", "PostgreSQL", "Docker", "Redis"],
                "github_username": "aaravmehta",
                "top_repo": "production-api-core",
                "authenticity_score": 98.0
            },
            {
                "id": 2,
                "full_name": "Vikram Malhotra",
                "title": "Lead ML Engineer & MLOps Specialist",
                "talent_score": 89.0,
                "skills": ["PyTorch", "Python", "FastAPI", "Docker", "Kubernetes"],
                "github_username": "vikrammalhotra",
                "top_repo": "ml-inference-engine",
                "authenticity_score": 96.0
            }
        ]

    matched_candidates = []
    for cand in candidate_pool:
        skills = cand.get("skills", [])
        overlap = [s for s in skills if any(req.lower() in s.lower() for req in req_skills)]
        alignment_score = min(98.0, round(60.0 + (len(overlap) * 10) + (cand.get("talent_score", 80) * 0.2), 1))

        # Personalized Outreach Sequence
        outreach_sequence = {
            "email_subject": f"Opportunity: {role_title} at ApexTalent Network",
            "email_body": (
                f"Hi {cand.get('full_name').split()[0]},\n\n"
                f"I came across your GitHub profile (@{cand.get('github_username')}) and was thoroughly impressed by your work on **{cand.get('top_repo')}**. "
                f"Your verified mastery in {', '.join(overlap[:3])} and Talent Score of {cand.get('talent_score')}/100 stand out in our developer graph.\n\n"
                f"We are building a high-impact engineering team for a **{role_title}** role. Given your experience in production-grade systems, I would love to connect for a brief 15-minute intro call.\n\n"
                f"Best regards,\n"
                f"ApexTalent Sourcing Operations"
            ),
            "linkedin_inmail": (
                f"Hi {cand.get('full_name').split()[0]}! Noticed your impressive commits on {cand.get('top_repo')} ({', '.join(overlap[:2])}). "
                f"We're recruiting for a {role_title} position ($150k-$180k + equity). Would you be open to exploring this?"
            )
        }

        matched_candidates.append({
            "candidate_id": cand.get("id"),
            "full_name": cand.get("full_name"),
            "title": cand.get("title"),
            "talent_score": cand.get("talent_score"),
            "alignment_score": alignment_score,
            "matching_skills": overlap,
            "github_username": cand.get("github_username"),
            "outreach_sequence": outreach_sequence
        })

    matched_candidates.sort(key=lambda x: x["alignment_score"], reverse=True)

    return {
        "search_role": role_title,
        "target_skills": req_skills,
        "total_matches_found": len(matched_candidates),
        "sourced_candidates": matched_candidates
    }
