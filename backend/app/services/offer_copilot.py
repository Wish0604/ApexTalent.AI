from typing import Dict, Any, List, Optional

def generate_offer_negotiation_agent(
    candidate_name: str = "Aarav Mehta",
    role_title: str = "Senior FastAPI Systems Architect",
    talent_score: float = 91.5,
    proposed_base: float = 145000.0,
    proposed_equity: str = "0.15%",
    proposed_bonus: float = 15000.0,
    recruiter_max_budget: float = 175000.0
) -> Dict[str, Any]:
    """
    AI Agent that formulates optimal offer packages, retention likelihood scores,
    and counter-offer negotiation strategies for recruiters and candidates.
    """
    total_package = proposed_base + proposed_bonus
    budget_headroom = recruiter_max_budget - total_package

    # Compute retention probability
    if total_package >= (recruiter_max_budget * 0.9):
        retention_prob = 94.5
        market_percentile = "90th Percentile (Top Tier)"
    elif total_package >= (recruiter_max_budget * 0.8):
        retention_prob = 82.0
        market_percentile = "75th Percentile (Competitive)"
    else:
        retention_prob = 62.0
        market_percentile = "50th Percentile (Standard Market)"

    # Strategies
    conservative = {
        "strategy_name": "Cost-Optimized Offer",
        "base_salary": f"${int(proposed_base):,}",
        "equity": proposed_equity,
        "bonus": f"${int(proposed_bonus):,}",
        "total_value": f"${int(total_package):,}",
        "acceptance_likelihood": "72%",
        "recruiter_note": "Preserves maximum budget headroom for performance-based bonuses."
    }

    competitive = {
        "strategy_name": "High-Confidence Market Fit (Recommended)",
        "base_salary": f"${int(proposed_base + 8000):,}",
        "equity": f"{round(float(proposed_equity.replace('%','')) * 1.2, 2)}%",
        "bonus": f"${int(proposed_bonus + 5000):,}",
        "total_value": f"${int(total_package + 13000):,}",
        "acceptance_likelihood": "89%",
        "recruiter_note": "Balanced compensation aligning with top 10% market benchmark."
    }

    aggressive = {
        "strategy_name": "Aggressive Lock-in Offer",
        "base_salary": f"${int(recruiter_max_budget - 5000):,}",
        "equity": f"{round(float(proposed_equity.replace('%','')) * 1.5, 2)}%",
        "bonus": f"${int(proposed_bonus + 10000):,}",
        "total_value": f"${int(recruiter_max_budget + 5000):,}",
        "acceptance_likelihood": "96%",
        "recruiter_note": "Locks in key technical talent with zero counter-offer risk from competing offers."
    }

    # Draft Offer Letter Markdown
    offer_letter_markdown = f"""
# Formal Offer of Employment — ApexTalent Corp

**Date:** July 30, 2026  
**Candidate Name:** {candidate_name}  
**Position:** {role_title}  

Dear **{candidate_name}**,

On behalf of **ApexTalent Corp**, we are thrilled to extend a formal offer of employment for the role of **{role_title}**. Based on your verified Talent Score of **{talent_score}/100** and exceptional technical mastery, we believe you will play a pivotal leadership role in scaling our engineering platform.

### Compensation Breakdown
• **Base Salary:** ${int(proposed_base):,} USD per annum  
• **Annual Target Performance Bonus:** ${int(proposed_bonus):,} USD  
• **Equity Grant:** {proposed_equity} stock options (4-year vesting with 1-year cliff)  
• **Total Target Compensation:** ${int(total_package):,} USD  

### Benefits & Perks
1. 100% Remote flexibility with home-office setup stipend  
2. Comprehensive health, dental, and wellness insurance  
3. Unlimited paid time off (PTO) and annual learning stipend ($3,000)  

We look forward to welcoming you to the team!

Sincerely,  
**ApexTalent Acquisition Operations**
"""

    return {
        "candidate_name": candidate_name,
        "role_title": role_title,
        "talent_score": talent_score,
        "proposed_base": proposed_base,
        "proposed_equity": proposed_equity,
        "proposed_bonus": proposed_bonus,
        "total_package": total_package,
        "retention_probability": retention_prob,
        "market_percentile": market_percentile,
        "budget_headroom": budget_headroom,
        "strategies": [conservative, competitive, aggressive],
        "offer_letter_markdown": offer_letter_markdown.strip()
    }
