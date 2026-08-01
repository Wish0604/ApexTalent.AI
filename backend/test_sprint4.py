import sys
import json
sys.stdout.reconfigure(encoding='utf-8')
from app.services.recruiter_copilot import generate_hiring_challenge_agent, recruiter_copilot_agent

def test_sprint4_services():
    print("=== Testing AI Hiring Challenge Generator Agent ===")
    challenge = generate_hiring_challenge_agent(
        role_title="FastAPI Microservices Engineer",
        tech_stack=["FastAPI", "PostgreSQL", "Docker", "PyTest"],
        experience_level="senior",
        time_limit_hours=48
    )
    assert challenge["role_title"] == "FastAPI Microservices Engineer"
    assert "FastAPI" in challenge["tech_stack"]
    assert "architecture_weight" in challenge["evaluation_rubric"]
    assert len(challenge["deliverables"]) >= 4
    print("✅ AI Hiring Challenge Generator Agent passed!")

    print("\n=== Testing AI Recruiter Copilot Agent (Candidate Comparison) ===")
    pool = [
        {"id": 1, "full_name": "Aarav Mehta", "title": "Backend Architect", "talent_score": 91.5, "coding_score": 94.0, "skills": ["FastAPI", "Python", "Docker"]},
        {"id": 2, "full_name": "Vikram Malhotra", "title": "ML Engineer", "talent_score": 89.0, "coding_score": 91.0, "skills": ["PyTorch", "Python", "Kubernetes"]}
    ]

    copilot_cmp = recruiter_copilot_agent("Compare Aarav vs Vikram", candidate_pool=pool)
    assert "reply" in copilot_cmp and len(copilot_cmp["reply"]) > 0
    assert "compare_candidates" in copilot_cmp["actions_taken"]
    print("✅ AI Recruiter Copilot (Comparison) passed!")

    print("\n=== Testing AI Recruiter Copilot Agent (Salary Prediction) ===")
    copilot_sal = recruiter_copilot_agent("Predict salary for top backend candidate", candidate_pool=pool)
    assert "reply" in copilot_sal and ("Salary" in copilot_sal["reply"] or "Compensation" in copilot_sal["reply"])
    assert "predict_salary" in copilot_sal["actions_taken"]
    print("✅ AI Recruiter Copilot (Salary Prediction) passed!")

    print("\n=== Testing AI Recruiter Copilot Agent (Interview Questions) ===")
    copilot_q = recruiter_copilot_agent("Suggest technical interview questions for Senior Backend Dev", candidate_pool=pool)
    assert "reply" in copilot_q and ("Questions" in copilot_q["reply"] or "Question" in copilot_q["reply"])
    assert "generate_interview_questions" in copilot_q["actions_taken"]
    print("✅ AI Recruiter Copilot (Interview Questions) passed!")

    print("\n✨ All Sprint 4 agent service tests completed successfully!")

if __name__ == "__main__":
    test_sprint4_services()
