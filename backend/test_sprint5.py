import sys
import json
sys.stdout.reconfigure(encoding='utf-8')

from app.services.interview_simulator import simulate_live_coding_evaluator_agent

def test_sprint5_services():
    print("=== Testing Live Coding Simulator Evaluator Agent ===")
    sample_code = """
import asyncio

async def fetch_data(url: str):
    try:
        await asyncio.sleep(0.01)
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "reason": str(e)}
"""
    result = simulate_live_coding_evaluator_agent(
        code=sample_code,
        language="python",
        problem_title="FastAPI Asynchronous Task Queue"
    )

    assert result["overall_score"] > 80.0
    assert result["time_complexity"] == "O(1)"
    assert len(result["test_case_results"]) == 3
    print("✅ Live Coding Simulator Agent passed!")

    print("\n✨ All Sprint 5 agent service tests completed successfully!")

if __name__ == "__main__":
    test_sprint5_services()
