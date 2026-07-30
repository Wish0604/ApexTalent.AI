from typing import Dict, Any, List, Optional

def generate_online_assessment_agent(
    role_title: str,
    tech_stack: Optional[List[str]] = None,
    mcq_count: int = 5,
    coding_count: int = 1,
    time_limit_mins: int = 60
) -> Dict[str, Any]:
    """
    AI Agent that constructs balanced Online Assessments (OAs)
    combining multiple-choice architecture questions, coding prompts, and grading rubrics.
    """
    stack = tech_stack if tech_stack and len(tech_stack) > 0 else ["FastAPI", "Python", "PostgreSQL", "Docker"]
    stack_str = ", ".join(stack[:3])

    # Generate Multiple Choice Questions
    mcq_questions = [
        {
            "id": 1,
            "category": "Distributed Systems & Architecture",
            "question": f"When scaling a microservice built with {stack[0]}, which mechanism best prevents database connection pool exhaustion under high concurrency?",
            "options": [
                "A. Increasing maximum connection limit without bound",
                "B. Implementing Connection Pooling with PgBouncer / SQLAlchemy QueuePool and async I/O",
                "C. Converting all POST endpoints to synchronous blocking calls",
                "D. Using local in-memory global variables for database state"
            ],
            "correct_answer": "B",
            "explanation": "Connection pooling reuses database connections efficiently without exhausting backend database file descriptors."
        },
        {
            "id": 2,
            "category": "Asynchronous Operations",
            "question": "What is the primary operational difference between `asyncio.gather()` and `asyncio.wait()` in Python?",
            "options": [
                "A. `gather()` preserves order and returns results directly, while `wait()` returns completed and pending task sets",
                "B. `gather()` can only accept 2 tasks, while `wait()` handles unlimited tasks",
                "C. `wait()` blocks the main loop, while `gather()` runs in background threads",
                "D. There is no operational difference"
            ],
            "correct_answer": "A",
            "explanation": "`asyncio.gather()` aggregates task results into a list matching input order, while `wait()` returns done/pending sets for finer control."
        },
        {
            "id": 3,
            "category": "API Security & Rate Limiting",
            "question": "Which HTTP status code is standard for rate-limit quota exceedance?",
            "options": [
                "A. 401 Unauthorized",
                "B. 403 Forbidden",
                "C. 429 Too Many Requests",
                "D. 503 Service Unavailable"
            ],
            "correct_answer": "C",
            "explanation": "HTTP 429 indicates that the client has sent too many requests in a given amount of time."
        },
        {
            "id": 4,
            "category": "Caching & Resilience",
            "question": "In a Redis-backed caching strategy, how does a Cache Stampede (Thundering Herd) problem occur?",
            "options": [
                "A. When Redis memory fills up completely",
                "B. When a heavily queried key expires and hundreds of concurrent requests hit the database simultaneously",
                "C. When network cables are disconnected",
                "D. When Redis persistence fails during snapshotting"
            ],
            "correct_answer": "B",
            "explanation": "Cache stampede happens when concurrent requests attempt to recompute an expired key simultaneously."
        },
        {
            "id": 5,
            "category": "Testing & Isolation",
            "question": "What is the primary benefit of using Dependency Override in FastAPI tests (`app.dependency_overrides`)?",
            "options": [
                "A. It bypasses pydantic data validation completely",
                "B. It allows replacing real database sessions or external services with mock fixtures during testing",
                "C. It speeds up CPU execution by 10x",
                "D. It automatically generates unit tests"
            ],
            "correct_answer": "B",
            "explanation": "Dependency overrides enable seamless swapping of production dependencies with mock implementations in test suits."
        }
    ][:mcq_count]

    # Coding Challenge
    coding_challenge = {
        "title": f"Real-Time Telemetry Rate Limiter for {role_title}",
        "time_budget_mins": 30,
        "problem_description": (
            f"Implement a sliding-window rate limiter class in Python or TypeScript using **{stack_str}**. "
            f"The rate limiter must allow up to 100 requests per minute per IP address, automatically expiring old request timestamps."
        ),
        "input_format": "`is_allowed(client_ip: str, current_timestamp: float) -> bool`",
        "expected_complexity": "Time: O(1) per check, Space: O(K) where K is active request window size",
        "sample_test_case": "Input: `client_ip='192.168.1.1'`, timestamp=100.0 → Output: `True`"
    }

    # Total score calculation
    total_points = (len(mcq_questions) * 10) + (coding_count * 50)

    return {
        "assessment_title": f"Online Assessment (OA): {role_title}",
        "role_title": role_title,
        "tech_stack": stack,
        "time_limit_mins": time_limit_mins,
        "total_points": total_points,
        "mcq_questions": mcq_questions,
        "coding_challenge": coding_challenge,
        "grading_rubric": {
            "mcq_weight": "50%",
            "coding_correctness_weight": "30%",
            "coding_complexity_weight": "20%"
        }
    }
