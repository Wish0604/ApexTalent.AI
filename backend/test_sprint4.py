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
    assert copilot_cmp["comparison_data"] is not None
    assert copilot_cmp["comparison_data"]["candidate_a"]["full_name"] == "Aarav Mehta"
    assert copilot_cmp["comparison_data"]["candidate_b"]["full_name"] == "Vikram Malhotra"
    print("✅ AI Recruiter Copilot (Comparison) passed!")

    print("\n=== Testing AI Recruiter Copilot Agent (Salary Prediction) ===")
    copilot_sal = recruiter_copilot_agent("Predict salary for top backend candidate", candidate_pool=pool)
    assert copilot_sal["salary_prediction"] is not None
    assert "predicted_range" in copilot_sal["salary_prediction"]
    print("✅ AI Recruiter Copilot (Salary Prediction) passed!")

    print("\n=== Testing AI Recruiter Copilot Agent (Interview Questions) ===")
    copilot_q = recruiter_copilot_agent("Suggest technical interview questions for Senior Backend Dev", candidate_pool=pool)
    assert copilot_q["interview_questions"] is not None
    assert len(copilot_q["interview_questions"]) >= 3
    print("✅ AI Recruiter Copilot (Interview Questions) passed!")

    print("\n✨ All Sprint 4 agent service tests completed successfully!")

if __name__ == "__main__":
    test_sprint4_services()
