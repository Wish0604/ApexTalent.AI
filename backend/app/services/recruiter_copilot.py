import asyncio
from typing import Dict, Any, List, Optional
from .copilot.agent import recruiter_copilot_agent as gemini_copilot_agent
from .copilot.actions import get_todays_hiring_brief

def generate_hiring_challenge_agent(
    role_title: str,
    tech_stack: Optional[List[str]] = None,
    experience_level: str = "mid",
    time_limit_hours: int = 48
) -> Dict[str, Any]:
    stack = tech_stack if tech_stack and len(tech_stack) > 0 else ["FastAPI", "PostgreSQL", "Docker", "PyTest"]
    stack_str = ", ".join(stack[:4])
    
    role_lower = role_title.lower()
    if "ml" in role_lower or "ai" in role_lower or "data" in role_lower:
        challenge_type = "ml"
        problem_statement = (
            f"Build an end-to-end machine learning inference microservice for **{role_title}** using **{stack_str}**. "
            f"The service must include model loading, input validation schema, latency logging (<50ms budget), "
            f"and an automated evaluation script validating model accuracy and precision."
        )
        deliverables = [
            "GitHub Repository with clean code, Dockerfile, and docker-compose.yml",
            "Model training/evaluation notebook with metrics (F1-score, Precision-Recall curve)",
            "FastAPI / Flask inference API with POST /predict endpoint",
            "Unit & Integration test suite with >80% coverage",
            "Architecture design document detailing model serving optimizations"
        ]
        rubric = {
            "model_performance_weight": "30%",
            "architecture_weight": "25%",
            "code_quality_weight": "25%",
            "testing_weight": "10%",
            "documentation_weight": "10%"
        }
        test_scenarios = [
            "Batch prediction with 1,000 requests under 500ms response time",
            "Malformed JSON payload handling with HTTP 422 standard response",
            "Model hot-reloading without service downtime"
        ]
    elif "frontend" in role_lower or "fullstack" in role_lower or "react" in role_lower:
        challenge_type = "frontend"
        problem_statement = (
            f"Develop a responsive, high-performance web application interface for **{role_title}** using **{stack_str}**. "
            f"The UI must support real-time state management, glassmorphism design tokens, optimistic UI updates, "
            f"and accessible UI components complying with WCAG 2.1 AA standards."
        )
        deliverables = [
            "GitHub Repository containing Next.js / React source code & Tailwind CSS / Vanilla CSS modules",
            "Interactive live demo deployed on Vercel or Netlify",
            "Comprehensive Jest / Cypress E2E test suite",
            "Design system documentation & Figma link (if applicable)"
        ]
        rubric = {
            "ui_ux_design_weight": "35%",
            "code_quality_weight": "25%",
            "performance_accessibility_weight": "20%",
            "testing_weight": "10%",
            "documentation_weight": "10%"
        }
        test_scenarios = [
            "Lighthouse performance score >90 across Mobile and Desktop views",
            "Dynamic filtering and sorting of 500+ items without UI stutter",
            "Graceful error boundary handling for failed API requests"
        ]
    else:
        challenge_type = "backend"
        problem_statement = (
            f"Design and implement a resilient production backend microservice for a **{role_title}** using **{stack_str}**. "
            f"The service must feature JWT authentication, rate limiting (Redis/In-Memory), structured JSON logging, "
            f"database connection pooling, and automated PyTest unit & integration tests."
        )
        deliverables = [
            "GitHub repository containing production-ready source code & Dockerfile",
            "README.md with one-step setup (`docker-compose up`) & Swagger/OpenAPI docs",
            "Postman Collection or HTTP curl log proof of verification",
            "Architecture overview markdown file detailing caching and fault-tolerance"
        ]
        rubric = {
            "architecture_weight": "35%",
            "code_quality_weight": "30%",
            "testing_weight": "20%",
            "documentation_weight": "15%"
        }
        test_scenarios = [
            "Concurrent handling of 100 requests/sec with zero error rates",
            "Automated rollback on transaction failure during multi-table writes",
            "Security audit passing non-privileged user access controls"
        ]

    return {
        "challenge_title": f"Real-World {role_title} Engineering Challenge",
        "role_title": role_title,
        "challenge_type": challenge_type,
        "experience_level": experience_level,
        "time_limit_hours": time_limit_hours,
        "problem_statement": problem_statement,
        "deliverables": deliverables,
        "evaluation_rubric": rubric,
        "tech_stack": stack,
        "test_scenarios": test_scenarios
    }


def recruiter_copilot_agent(
    user_message: str,
    candidate_pool: Optional[List[Dict[str, Any]]] = None,
    job_context: Optional[Dict[str, Any]] = None,
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    """
    Synchronous wrapper for the Gemini Tool-Use Recruiter Copilot Agent.
    """
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
    if loop.is_running():
        # Running inside FastAPI event loop
        import nest_asyncio
        nest_asyncio.apply()
        return loop.run_until_complete(gemini_copilot_agent(user_message, conversation_history))
    else:
        return loop.run_until_complete(gemini_copilot_agent(user_message, conversation_history))
