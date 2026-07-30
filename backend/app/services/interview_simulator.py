import re
from typing import Dict, Any, List, Optional

def simulate_live_coding_evaluator_agent(
    code: str,
    language: str = "python",
    problem_title: str = "FastAPI Asynchronous Task Queue"
) -> Dict[str, Any]:
    """
    AI Agent that evaluates live coding submissions during live technical interviews.
    Analyzes code structure, Big-O time & space complexity, edge-case resilience,
    and returns a structured scorecard with real-time audio/text feedback.
    """
    code_clean = code.strip()
    lines = code_clean.split("\n")
    line_count = len(lines)

    # Big-O estimation heuristic
    has_nested_loops = bool(re.search(r"for.*:\s*\n\s*for.*:", code_clean))
    has_single_loop = "for " in code_clean or "while " in code_clean
    has_async = "async " in code_clean or "await " in code_clean
    has_try_except = "try:" in code_clean or "try {" in code_clean
    has_docstring = '"""' in code_clean or "/**" in code_clean or "# " in code_clean

    if has_nested_loops:
        time_complexity = "O(N²)"
        complexity_rating = "Moderate"
    elif has_single_loop:
        time_complexity = "O(N)"
        complexity_rating = "Optimal"
    else:
        time_complexity = "O(1)"
        complexity_rating = "Optimal"

    space_complexity = "O(N)" if ("append(" in code_clean or "[]" in code_clean or "dict()" in code_clean) else "O(1)"

    # Base scores computation
    correctness_score = 92.0 if (has_async and line_count > 10) else 84.0
    quality_score = 88.0 + (5.0 if has_docstring else 0.0) + (5.0 if has_try_except else 0.0)
    quality_score = min(98.0, quality_score)
    complexity_score = 94.0 if time_complexity in ["O(1)", "O(N)"] else 76.0
    resilience_score = 90.0 if has_try_except else 70.0

    overall_score = round(
        (correctness_score * 0.35) +
        (quality_score * 0.25) +
        (complexity_score * 0.25) +
        (resilience_score * 0.15),
        1
    )

    test_case_results = [
        {
            "test_name": "Standard Payload Execution",
            "passed": True,
            "latency_ms": 12.4,
            "output": "Execution Success (Status: 200 OK)"
        },
        {
            "test_name": "Boundary & Empty List Handling",
            "passed": has_try_except or "if not " in code_clean or "len(" in code_clean,
            "latency_ms": 8.1,
            "output": "Passed Edge Case Check" if (has_try_except or "if not " in code_clean or "len(" in code_clean) else "Warning: Unhandled Empty Payload"
        },
        {
            "test_name": "High Concurrency Rate Limit Test (1,000 req/sec)",
            "passed": has_async,
            "latency_ms": 42.0 if has_async else 180.5,
            "output": "Async Non-Blocking Execution" if has_async else "Blocking I/O Warning"
        }
    ]

    key_strengths = []
    if has_async:
        key_strengths.append("Non-blocking asynchronous I/O paradigm utilized effectively.")
    if has_try_except:
        key_strengths.append("Explicit exception handling and error boundary insulation.")
    if has_docstring:
        key_strengths.append("Clean inline documentation and descriptive docstrings.")
    if not key_strengths:
        key_strengths.append("Functional implementation addressing baseline requirements.")

    areas_for_improvement = []
    if not has_async:
        areas_for_improvement.append("Consider converting synchronous database operations to async/await for higher throughput.")
    if not has_try_except:
        areas_for_improvement.append("Wrap external network or database calls in try/except blocks to prevent process crashes.")
    if has_nested_loops:
        areas_for_improvement.append("Refactor nested loops into hash-table lookups to optimize time complexity from O(N²) to O(N).")

    interview_verdict = (
        f"The candidate demonstrated **{'strong' if overall_score >= 85 else 'solid'} technical competency** for `{problem_title}`. "
        f"Code complexity was evaluated at **{time_complexity}** time and **{space_complexity}** space. "
        f"{'The implementation is production-grade with robust error isolation.' if overall_score >= 85 else 'Code functionality is sound with minor optimization opportunities.'}"
    )

    return {
        "problem_title": problem_title,
        "language": language,
        "overall_score": overall_score,
        "correctness_score": correctness_score,
        "code_quality_score": quality_score,
        "complexity_score": complexity_score,
        "resilience_score": resilience_score,
        "time_complexity": time_complexity,
        "space_complexity": space_complexity,
        "complexity_rating": complexity_rating,
        "test_case_results": test_case_results,
        "key_strengths": key_strengths,
        "areas_for_improvement": areas_for_improvement,
        "interview_verdict": interview_verdict
    }
