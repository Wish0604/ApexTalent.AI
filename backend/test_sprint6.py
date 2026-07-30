import sys
import json
sys.stdout.reconfigure(encoding='utf-8')

from app.services.assessment_generator import generate_online_assessment_agent
from app.services.webhook_dispatcher import dispatch_webhook_event

def test_sprint6_services():
    print("=== Testing Automated Online Assessment (OA) Generator Agent ===")
    oa = generate_online_assessment_agent(
        role_title="FastAPI Systems Architect",
        tech_stack=["FastAPI", "PostgreSQL", "Redis", "Docker"],
        mcq_count=5,
        coding_count=1,
        time_limit_mins=60
    )

    assert oa["role_title"] == "FastAPI Systems Architect"
    assert len(oa["mcq_questions"]) == 5
    assert oa["coding_challenge"] is not None
    assert oa["total_points"] == 100
    print("✅ Online Assessment Generator Agent passed!")

    print("\n=== Testing Outbound Webhook Dispatcher ===")
    payload = {
        "message": "Candidate Aarav Mehta advanced to Offer stage.",
        "candidate_name": "Aarav Mehta",
        "job_title": "FastAPI Systems Architect",
        "stage": "Offer"
    }

    slack_disp = dispatch_webhook_event(
        event_type="application.stage_updated",
        payload=payload,
        target_url="https://hooks.slack.com/services/T00/B00/XXXXX",
        channel_type="slack"
    )

    assert slack_disp["status"] == "success"
    assert "blocks" in slack_disp["formatted_payload"]

    discord_disp = dispatch_webhook_event(
        event_type="application.stage_updated",
        payload=payload,
        target_url="https://discord.com/api/webhooks/123/abc",
        channel_type="discord"
    )
    assert discord_disp["status"] == "success"
    assert "embeds" in discord_disp["formatted_payload"]
    print("✅ Webhook Dispatcher Service passed!")

    print("\n✨ All Sprint 6 agent service tests completed successfully!")

if __name__ == "__main__":
    test_sprint6_services()
