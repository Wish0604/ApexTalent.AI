from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json, datetime
from ..db.database import get_db
from ..db import models
from ..schemas import schemas
from ..core import security
from ..services import mock_ai_services

router = APIRouter(prefix="/interviews", tags=["Interview Center"])


@router.post("/schedule", response_model=schemas.InterviewResponse)
def schedule_interview(
    req: schemas.InterviewScheduleRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate profile not found")

    skills = json.loads(profile.skills_json or "[]")
    job_title = profile.title or "Software Engineer"
    if req.job_id:
        job = db.query(models.Job).filter(models.Job.id == req.job_id).first()
        if job:
            job_title = job.title

    questions = mock_ai_services.generate_interview_questions_mock(job_title, skills, req.interview_type)

    interview = models.Interview(
        candidate_id=profile.id,
        job_id=req.job_id,
        interview_type=req.interview_type,
        status="scheduled",
        scheduled_at=req.scheduled_at or datetime.datetime.utcnow(),
        questions_json=json.dumps(questions),
        answers_json=json.dumps([]),
        feedback_json=json.dumps({}),
        transcript_json=json.dumps([])
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return interview


@router.post("/{interview_id}/start")
def start_interview(
    interview_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview.status = "in_progress"
    db.commit()

    questions = json.loads(interview.questions_json or "[]")
    return {
        "interview_id": interview_id,
        "status": "in_progress",
        "total_questions": len(questions),
        "first_question": questions[0] if questions else None,
    }


@router.post("/{interview_id}/answer")
def submit_answer(
    interview_id: int,
    req: schemas.InterviewAnswerRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    answers = json.loads(interview.answers_json or "[]")
    transcript = json.loads(interview.transcript_json or "[]")
    questions = json.loads(interview.questions_json or "[]")

    answers.append({"question_index": req.question_index, "answer": req.answer})
    transcript.append({
        "role": "candidate",
        "question_index": req.question_index,
        "text": req.answer,
    })

    interview.answers_json = json.dumps(answers)
    interview.transcript_json = json.dumps(transcript)

    # Check if all questions answered
    is_complete = len(answers) >= len(questions)
    if is_complete:
        q_texts = [q.get("question", "") for q in questions]
        a_texts = [a.get("answer", "") for a in answers]
        eval_result = mock_ai_services.evaluate_interview_mock(q_texts, a_texts)

        interview.status = "completed"
        interview.completed_at = datetime.datetime.utcnow()
        interview.overall_score = eval_result["overall_score"]
        interview.technical_score = eval_result["technical_score"]
        interview.communication_score = eval_result["communication_score"]
        interview.problem_solving_score = eval_result["problem_solving_score"]
        interview.feedback_json = json.dumps(eval_result)
    db.commit()

    next_q = questions[req.question_index + 1] if (req.question_index + 1) < len(questions) else None
    return {
        "answered": len(answers),
        "total": len(questions),
        "is_complete": is_complete,
        "next_question": next_q,
        "instant_feedback": "Good structured answer. Try to be more specific with examples." if len(req.answer.split()) > 20 else "Consider elaborating with a concrete example.",
    }


@router.get("/{interview_id}/report")
def get_interview_report(
    interview_id: int,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(models.Interview).filter(models.Interview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    questions = json.loads(interview.questions_json or "[]")
    answers = json.loads(interview.answers_json or "[]")
    feedback = json.loads(interview.feedback_json or "{}")

    return {
        "interview_id": interview_id,
        "interview_type": interview.interview_type,
        "status": interview.status,
        "overall_score": interview.overall_score,
        "technical_score": interview.technical_score,
        "communication_score": interview.communication_score,
        "problem_solving_score": interview.problem_solving_score,
        "total_questions": len(questions),
        "answered_questions": len(answers),
        "recommendation": feedback.get("recommendation", "Pending"),
        "feedback_summary": feedback.get("feedback_summary", "Interview in progress."),
        "completed_at": interview.completed_at.isoformat() if interview.completed_at else None,
        "qa_pairs": [
            {
                "question": questions[i].get("question") if i < len(questions) else "",
                "answer": answers[i].get("answer") if i < len(answers) else "",
                "category": questions[i].get("category") if i < len(questions) else "",
            }
            for i in range(min(len(questions), len(answers)))
        ]
    }
