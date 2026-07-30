import sys
import json
sys.stdout.reconfigure(encoding='utf-8')

from app.services.headhunter_agent import headhunter_sourcing_agent
from app.services.pair_programming import pair_programming_assistant
from app.services.badge_authority import issue_verification_badge

def test_sprint7_services():
    print("=== Testing AI Autonomous Candidate Headhunter & Sourcing Agent ===")
    sourced = headhunter_sourcing_agent(
        role_title="Senior FastAPI Systems Architect",
        required_skills=["FastAPI", "Python", "Docker"]
    )

    assert sourced["total_matches_found"] > 0
    assert "email_subject" in sourced["sourced_candidates"][0]["outreach_sequence"]
    print("✅ AI Headhunter Sourcing Agent passed!")

    print("\n=== Testing Live Pair Programming Assistant ===")
    pair_res = pair_programming_assistant(
        code="def process_data(payload):\n    return payload['data']",
        language="python",
        current_problem="FastAPI Asynchronous Rate Limiter"
    )

    assert pair_res["pairing_status"] is not None
    assert len(pair_res["suggestions"]) > 0
    print("✅ Live Pair Programming Assistant passed!")

    print("\n=== Testing Candidate Verification Badge Authority ===")
    badge = issue_verification_badge(
        candidate_id=1,
        candidate_name="Aarav Mehta",
        badge_type="verified_expert",
        badge_title="Verified FastAPI Expert"
    )

    assert "APEX-PROOF-" in badge["proof_token"]
    assert badge["badge_metadata"]["anti_fraud_passed"] is True
    print("✅ Candidate Verification Badge Authority passed!")

    print("\n✨ All Sprint 7 agent service tests completed successfully!")

if __name__ == "__main__":
    test_sprint7_services()
