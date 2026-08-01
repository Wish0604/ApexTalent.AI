# backend/app/services/copilot/tools.py
#
# Every capability from the product plan (Chat Assistant, Hiring Brief,
# Candidate Intelligence, RAG Search, Job Management, Interview
# Copilot, Communication, Pipeline Intelligence, Analytics, Automation,
# Notifications) is exposed to Gemini as a tool here.

COPILOT_TOOLS = [
    {
        "name": "rag_search",
        "description": (
            "Search across candidate resumes, GitHub analyses, interview transcripts, "
            "recruiter notes, job descriptions, and company policy docs using semantic "
            "search. Use this for open-ended natural-language questions like 'find Java "
            "developers who built payment systems' or 'what is our internship hiring policy' "
            "or 'summarize candidate profile' — anything that needs retrieval over stored data."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Natural language search query"},
                "doc_types": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Restrict search to these doc types (resume, github_analysis, interview_transcript, recruiter_note, job_description, company_policy).",
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "compare_candidates",
        "description": "Side-by-side comparison of two or more candidates across Talent Score, Coding Score, Authenticity Index, GitHub commit velocity, and tech-stack fit, with a hiring recommendation.",
        "input_schema": {
            "type": "object",
            "properties": {
                "candidate_ids": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["candidate_ids"],
        },
    },
    {
        "name": "rank_candidates",
        "description": "Rank active applicants (optionally for a specific job) by verified Talent Score and return the top matches.",
        "input_schema": {
            "type": "object",
            "properties": {
                "job_id": {"type": "string", "description": "Optional job to scope the ranking to"},
                "top_n": {"type": "integer", "default": 10},
            },
        },
    },
    {
        "name": "predict_salary",
        "description": "Predict a fair competitive salary range for a candidate based on experience, verified Talent Score, and regional market data.",
        "input_schema": {
            "type": "object",
            "properties": {
                "candidate_id": {"type": "string"},
                "region": {"type": "string", "description": "e.g. 'Bengaluru, India' or 'Remote - US'"},
            },
            "required": ["candidate_id"],
        },
    },
    {
        "name": "generate_interview_questions",
        "description": "Generate role-specific technical/behavioral interview questions, optionally tailored to a specific candidate's gaps.",
        "input_schema": {
            "type": "object",
            "properties": {
                "role": {"type": "string"},
                "focus_areas": {"type": "array", "items": {"type": "string"}},
                "candidate_id": {"type": "string"},
            },
            "required": ["role"],
        },
    },
    {
        "name": "generate_interview_summary",
        "description": "After an interview, generate a structured summary: technical score, communication score, and hiring recommendation from the transcript.",
        "input_schema": {
            "type": "object",
            "properties": {"candidate_id": {"type": "string"}, "interview_id": {"type": "string"}},
            "required": ["candidate_id", "interview_id"],
        },
    },
    {
        "name": "get_todays_hiring_brief",
        "description": "Get today's hiring summary: active jobs, new applicants, interviews today, pending feedback, and AI-recommended next actions.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "get_pipeline_alerts",
        "description": "Get pipeline health alerts: candidates stuck >N days, delayed interviews, unscheduled interviews.",
        "input_schema": {"type": "object", "properties": {"stuck_threshold_days": {"type": "integer", "default": 7}}},
    },
    {
        "name": "explain_hiring_analytics",
        "description": "Answer analytical questions like 'why is hiring taking longer', 'which jobs are hardest to fill', 'best sourcing platform', 'average interview score'.",
        "input_schema": {
            "type": "object",
            "properties": {"question": {"type": "string"}, "job_id": {"type": "string"}},
            "required": ["question"],
        },
    },
    {
        "name": "create_job",
        "description": "Create a new job posting. Generates description, responsibilities, required skills, salary range, and screening questions.",
        "input_schema": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "seniority": {"type": "string"},
                "notes": {"type": "string"},
            },
            "required": ["title"],
        },
    },
    {
        "name": "update_job",
        "description": "Update fields on an existing job posting.",
        "input_schema": {
            "type": "object",
            "properties": {
                "job_id": {"type": "string"},
                "fields": {"type": "object"},
            },
            "required": ["job_id", "fields"],
        },
    },
    {
        "name": "shortlist_candidate",
        "description": "Move a candidate into the shortlist for a job.",
        "input_schema": {
            "type": "object",
            "properties": {"candidate_id": {"type": "string"}, "job_id": {"type": "string"}},
            "required": ["candidate_id", "job_id"],
        },
    },
    {
        "name": "move_candidate",
        "description": "Move a candidate to a different hiring pipeline stage.",
        "input_schema": {
            "type": "object",
            "properties": {
                "candidate_id": {"type": "string"},
                "job_id": {"type": "string"},
                "stage": {"type": "string"},
            },
            "required": ["candidate_id", "job_id", "stage"],
        },
    },
    {
        "name": "schedule_interview",
        "description": "Schedule an interview for a candidate.",
        "input_schema": {
            "type": "object",
            "properties": {
                "candidate_id": {"type": "string"},
                "job_id": {"type": "string"},
                "scheduled_at": {"type": "string"},
                "interview_type": {"type": "string"},
            },
            "required": ["candidate_id", "job_id", "scheduled_at", "interview_type"],
        },
    },
    {
        "name": "assign_assessment",
        "description": "Assign a coding/technical assessment to a candidate.",
        "input_schema": {
            "type": "object",
            "properties": {"candidate_id": {"type": "string"}, "assessment_template_id": {"type": "string"}},
            "required": ["candidate_id", "assessment_template_id"],
        },
    },
    {
        "name": "create_coding_challenge",
        "description": "Create a new coding challenge from a spec (role + focus area).",
        "input_schema": {
            "type": "object",
            "properties": {"title": {"type": "string"}, "role": {"type": "string"}, "focus_area": {"type": "string"}},
            "required": ["title", "role"],
        },
    },
    {
        "name": "draft_communication",
        "description": "Draft candidate communication (interview invitation, rejection, follow-up, WhatsApp message).",
        "input_schema": {
            "type": "object",
            "properties": {
                "candidate_id": {"type": "string"},
                "message_type": {"type": "string"},
                "tone": {"type": "string"},
            },
            "required": ["candidate_id", "message_type"],
        },
    },
    {
        "name": "send_communication",
        "description": "Send a drafted communication to a candidate via email or WhatsApp.",
        "input_schema": {
            "type": "object",
            "properties": {
                "candidate_id": {"type": "string"},
                "channel": {"type": "string"},
                "subject": {"type": "string"},
                "body": {"type": "string"},
            },
            "required": ["candidate_id", "channel", "body"],
        },
    },
    {
        "name": "create_automation_workflow",
        "description": "Create an if-this-then-that hiring automation rule.",
        "input_schema": {
            "type": "object",
            "properties": {
                "trigger": {"type": "object"},
                "actions": {"type": "array", "items": {"type": "object"}},
            },
            "required": ["trigger", "actions"],
        },
    },
    {
        "name": "generate_report",
        "description": "Generate a hiring report (pipeline funnel, time-to-hire, sourcing effectiveness).",
        "input_schema": {
            "type": "object",
            "properties": {
                "report_type": {"type": "string"},
                "date_range_days": {"type": "integer"},
            },
            "required": ["report_type"],
        },
    },
]
