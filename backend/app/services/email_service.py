"""
ApexTalent AI — Centralized Email & Notification Service Engine
Provides single master HTML design layout & Resend API integration.
"""

import os
import json
import urllib.request
import urllib.parse
import datetime
from typing import Dict, Any, Optional

# Load API key and config from environment
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
EMAIL_FROM = os.getenv("EMAIL_FROM", "ApexTalent AI <notifications@apextalent.ai>").strip()
CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:3000").strip()

def render_email_layout(
    recipient_name: str,
    title: str,
    message_paragraphs: list[str],
    cta_title: Optional[str] = None,
    cta_url: Optional[str] = None,
    info_card: Optional[Dict[str, str]] = None,
    badge_label: Optional[str] = None
) -> str:
    """
    Renders ApexTalent AI Standard Master HTML Email Layout.
    Matching GitHub, Notion & Stripe email aesthetics.
    """
    cta_html = ""
    if cta_title and cta_url:
        full_url = cta_url if cta_url.startswith("http") else f"{CLIENT_URL}{cta_url}"
        cta_html = f"""
        <div style="margin: 32px 0 24px 0; text-align: center;">
            <a href="{full_url}" style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 8px; display: inline-block; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);">
                {cta_title} &rarr;
            </a>
        </div>
        """

    card_html = ""
    if info_card:
        rows = "".join([
            f"""<tr>
                <td style="padding: 10px 14px; font-weight: 600; color: #94a3b8; width: 40%; font-size: 13px;">{k}</td>
                <td style="padding: 10px 14px; color: #f8fafc; font-weight: 500; font-size: 13px;">{v}</td>
            </tr>""" for k, v in info_card.items()
        ])
        card_html = f"""
        <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 16px; margin: 24px 0;">
            <table style="width: 100%; border-collapse: collapse;">
                {rows}
            </table>
        </div>
        """

    badge_html = f'<span style="background-color: rgba(99, 102, 241, 0.2); color: #818cf8; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.5px; border: 1px solid rgba(99, 102, 241, 0.4);">{badge_label}</span><br/><br/>' if badge_label else ""

    paragraphs_html = "".join([f'<p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 15px; line-height: 1.6;">{p}</p>' for p in message_paragraphs])

    return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body style="background-color: #0f172a; margin: 0; padding: 40px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
    <table role="presentation" style="max-width: 580px; margin: 0 auto; background-color: #0f172a; border-collapse: collapse; width: 100%;">
        <!-- Header -->
        <tr>
            <td style="padding: 0 0 32px 0; text-align: center;">
                <div style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: -0.5px;">
                    ⚡ ApexTalent AI
                </div>
                <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-top: 4px;">
                    Next-Gen AI Autonomous Hiring Ecosystem
                </div>
            </td>
        </tr>

        <!-- Main Body Card -->
        <tr>
            <td style="background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 36px 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);">
                {badge_html}
                <h1 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 700; color: #f8fafc; letter-spacing: -0.3px;">
                    {title}
                </h1>
                
                <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 15px; font-weight: 600;">
                    Hello {recipient_name},
                </p>

                {paragraphs_html}
                {card_html}
                {cta_html}

                <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #334155; font-size: 13px; color: #64748b;">
                    Need assistance? Reply directly or contact <a href="mailto:support@apextalent.ai" style="color: #818cf8; text-decoration: none;">support@apextalent.ai</a>.
                </div>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 32px 0 0 0; text-align: center; font-size: 12px; color: #64748b; line-height: 1.5;">
                <p style="margin: 0 0 8px 0;">© 2026 ApexTalent AI Technologies Inc. All rights reserved.</p>
                <p style="margin: 0;">
                    <a href="{CLIENT_URL}/settings" style="color: #64748b; text-decoration: underline;">Manage Notification Preferences</a> &bull; 
                    <a href="{CLIENT_URL}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>"""


def send_email_via_resend(
    to_email: str,
    subject: str,
    html_content: str
) -> Dict[str, Any]:
    """
    Dispatches email via Resend REST API or logs mock payload if RESEND_API_KEY is not configured.
    """
    if not RESEND_API_KEY:
        safe_subject = subject.encode("ascii", errors="ignore").decode("ascii")
        print(f"[EMAIL SERVICE SIMULATED MODE]")
        print(f"   To: {to_email}")
        print(f"   Subject: {safe_subject}")
        print(f"   (Resend API key missing in .env - simulated dispatch successfully logged)")
        return {
            "status": "simulated",
            "message": "Email logged to console (RESEND_API_KEY not configured)",
            "to": to_email,
            "subject": subject
        }

    url = "https://api.resend.com/emails"
    payload = json.dumps({
        "from": EMAIL_FROM,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in [200, 201]:
                res = json.loads(resp.read().decode("utf-8"))
                print(f"[EMAIL DISPATCHED VIA RESEND] ID: {res.get('id')} to {to_email}")
                return {"status": "sent", "resend_id": res.get("id"), "to": to_email}
    except Exception as e:
        print(f"[RESEND DISPATCH ERROR]: {e}")
        return {"status": "error", "error": str(e), "to": to_email}

    return {"status": "failed", "to": to_email}


# =============================================================================
# 15 MVP CORE EMAIL TEMPLATE BUILDERS
# =============================================================================

def send_welcome_email(user_email: str, first_name: str) -> Dict[str, Any]:
    subject = "Welcome to ApexTalent AI 🚀"
    html = render_email_layout(
        recipient_name=first_name,
        title="Welcome to the Future of Autonomous Hiring",
        message_paragraphs=[
            "We're thrilled to welcome you to ApexTalent AI — the intelligence-first career and sourcing platform.",
            "Complete your profile to unlock live AI telemetry scoring, recruiter headhunter matches, and automated hackathons."
        ],
        cta_title="Complete Your Profile",
        cta_url="/candidate?tab=profile",
        badge_label="Account Created"
    )
    return send_email_via_resend(user_email, subject, html)


def send_email_verification(user_email: str, first_name: str, verify_token: str) -> Dict[str, Any]:
    subject = "Verify your email address — ApexTalent AI"
    html = render_email_layout(
        recipient_name=first_name,
        title="Verify Your Email Address",
        message_paragraphs=[
            "Please confirm your email address to activate your full ApexTalent account and unlock candidate matching."
        ],
        cta_title="Verify Email Address",
        cta_url=f"/verify-email?token={verify_token}",
        badge_label="Security Verification"
    )
    return send_email_via_resend(user_email, subject, html)


def send_password_reset(user_email: str, first_name: str, reset_token: str) -> Dict[str, Any]:
    subject = "Reset your password — ApexTalent AI"
    html = render_email_layout(
        recipient_name=first_name,
        title="Password Reset Request",
        message_paragraphs=[
            "We received a request to reset your password. Click the button below to specify a new password.",
            "If you did not request this, you can safely ignore this email."
        ],
        cta_title="Reset Password",
        cta_url=f"/reset-password?token={reset_token}",
        badge_label="Password Security"
    )
    return send_email_via_resend(user_email, subject, html)


def send_password_changed(user_email: str, first_name: str) -> Dict[str, Any]:
    subject = "Security Notice: Your password was changed"
    html = render_email_layout(
        recipient_name=first_name,
        title="Password Updated Successfully",
        message_paragraphs=[
            "Your password for your ApexTalent AI account was recently updated.",
            "If you initiated this change, no further action is required. If you did not make this change, please contact support immediately."
        ],
        cta_title="Go to Dashboard",
        cta_url="/candidate",
        badge_label="Security Alert"
    )
    return send_email_via_resend(user_email, subject, html)


def send_profile_completion_reminder(user_email: str, first_name: str, completion_pct: int) -> Dict[str, Any]:
    subject = f"Your profile is {completion_pct}% complete — Boost recruiter matches"
    html = render_email_layout(
        recipient_name=first_name,
        title="Complete Your Profile for 3x Recruiter Visibility",
        message_paragraphs=[
            f"Your profile is currently <strong>{completion_pct}% complete</strong>.",
            "Candidates with complete profiles get up to 3x more recruiter interview requests and higher AI Talent Scores."
        ],
        cta_title="Complete Profile Now",
        cta_url="/candidate?tab=profile",
        info_card={"Current Status": f"{completion_pct}% Complete", "Recommended Actions": "Link GitHub, Upload Resume, Add Skills"},
        badge_label="Profile Reminder"
    )
    return send_email_via_resend(user_email, subject, html)


def send_project_submitted(user_email: str, first_name: str, project_name: str) -> Dict[str, Any]:
    subject = f"Project Submitted: '{project_name}' — ApexTalent AI"
    html = render_email_layout(
        recipient_name=first_name,
        title="Project Submission Confirmed ✅",
        message_paragraphs=[
            f"Your project <strong>'{project_name}'</strong> has been submitted successfully to the ApexTalent evaluation engine.",
            "Our AI Code Quality & Architectural Evaluator is now analyzing your code repository and technical structure."
        ],
        cta_title="View Submission",
        cta_url="/candidate?tab=projects",
        info_card={"Project Title": project_name, "Status": "Under AI Analysis"},
        badge_label="Project Submission"
    )
    return send_email_via_resend(user_email, subject, html)


def send_ai_evaluation_ready(
    user_email: str,
    first_name: str,
    project_name: str,
    score: float,
    rating: str,
    strengths: str,
    weaknesses: str
) -> Dict[str, Any]:
    subject = f"⭐ AI Report Ready for '{project_name}' (Score: {score}/100)"
    html = render_email_layout(
        recipient_name=first_name,
        title=f"AI Evaluation Complete for '{project_name}'",
        message_paragraphs=[
            f"Great news! The AI evaluation for <strong>'{project_name}'</strong> is complete.",
            f"Your submission received an overall AI rating of <strong>{rating}</strong>."
        ],
        cta_title="View Full AI Report",
        cta_url="/candidate?tab=projects",
        info_card={
            "Overall AI Score": f"{score} / 100",
            "Rating": rating,
            "Top Strengths": strengths,
            "Areas to Improve": weaknesses
        },
        badge_label="AI Report Ready ⭐"
    )
    return send_email_via_resend(user_email, subject, html)


def send_interview_scheduled(
    user_email: str,
    first_name: str,
    job_title: str,
    company_name: str,
    date_time_str: str,
    join_url: str
) -> Dict[str, Any]:
    subject = f"Interview Scheduled: {job_title} at {company_name}"
    html = render_email_layout(
        recipient_name=first_name,
        title=f"Interview Confirmed with {company_name}",
        message_paragraphs=[
            f"You have an upcoming interview scheduled for the <strong>{job_title}</strong> role at <strong>{company_name}</strong>.",
            "Please ensure your microphone and video setup are ready 5 minutes prior to start."
        ],
        cta_title="Join Interview Room",
        cta_url=join_url,
        info_card={
            "Company": company_name,
            "Position": job_title,
            "Date & Time": date_time_str,
            "Format": "Live AI / Recruiter Panel"
        },
        badge_label="Interview Confirmed 📅"
    )
    return send_email_via_resend(user_email, subject, html)


def send_interview_reminder(
    user_email: str,
    first_name: str,
    job_title: str,
    company_name: str,
    date_time_str: str,
    time_frame: str,  # "24 Hours" or "1 Hour"
    join_url: str
) -> Dict[str, Any]:
    subject = f"Reminder ({time_frame}): Interview for {job_title} at {company_name}"
    html = render_email_layout(
        recipient_name=first_name,
        title=f"Interview Reminder ({time_frame} Away)",
        message_paragraphs=[
            f"This is a friendly reminder that your interview for <strong>{job_title}</strong> at <strong>{company_name}</strong> starts in {time_frame}.",
            "Click below to join the interview workspace when ready."
        ],
        cta_title="Join Interview Room",
        cta_url=join_url,
        info_card={
            "Company": company_name,
            "Role": job_title,
            "Scheduled Time": date_time_str
        },
        badge_label="Interview Reminder"
    )
    return send_email_via_resend(user_email, subject, html)


def send_ai_interview_report_ready(
    user_email: str,
    first_name: str,
    job_title: str,
    overall_score: float,
    report_url: str
) -> Dict[str, Any]:
    subject = f"AI Interview Feedback Ready — {job_title} ({overall_score}/100)"
    html = render_email_layout(
        recipient_name=first_name,
        title="Your AI Interview Report is Ready",
        message_paragraphs=[
            f"Your automated interview evaluation for <strong>{job_title}</strong> has been generated.",
            f"You scored <strong>{overall_score}/100</strong> across technical knowledge, communication, and problem-solving."
        ],
        cta_title="View AI Interview Report",
        cta_url=report_url,
        info_card={
            "Role": job_title,
            "AI Interview Score": f"{overall_score} / 100"
        },
        badge_label="Interview Score Card"
    )
    return send_email_via_resend(user_email, subject, html)


def send_new_candidate_applied(
    recruiter_email: str,
    recruiter_name: str,
    candidate_name: str,
    job_title: str,
    app_id: int
) -> Dict[str, Any]:
    subject = f"New Candidate Applied: {candidate_name} for {job_title}"
    html = render_email_layout(
        recipient_name=recruiter_name,
        title="New Application Received 🎯",
        message_paragraphs=[
            f"<strong>{candidate_name}</strong> just applied for the open position: <strong>{job_title}</strong>.",
            "Review their candidate profile, GitHub telemetry, and AI match score in your recruiter pipeline."
        ],
        cta_title="Review Application",
        cta_url=f"/recruiter/pipeline?app={app_id}",
        info_card={"Candidate": candidate_name, "Target Job": job_title},
        badge_label="Recruiter Alert"
    )
    return send_email_via_resend(recruiter_email, subject, html)


def send_candidate_shortlisted(
    user_email: str,
    first_name: str,
    job_title: str,
    company_name: str
) -> Dict[str, Any]:
    subject = f"Congratulations! You've been shortlisted for {job_title} at {company_name} 🎉"
    html = render_email_layout(
        recipient_name=first_name,
        title="You've Been Shortlisted! 🌟",
        message_paragraphs=[
            f"Great news! The hiring team at <strong>{company_name}</strong> has shortlisted your application for <strong>{job_title}</strong>.",
            "They will be scheduling your next round interview shortly."
        ],
        cta_title="View Application Details",
        cta_url="/candidate?tab=applications",
        info_card={"Company": company_name, "Position": job_title, "Status": "Shortlisted"},
        badge_label="Application Update"
    )
    return send_email_via_resend(user_email, subject, html)


def send_interview_invitation(
    user_email: str,
    first_name: str,
    company_name: str,
    job_title: str
) -> Dict[str, Any]:
    subject = f"Direct Invitation: Interview with {company_name} for {job_title}"
    html = render_email_layout(
        recipient_name=first_name,
        title=f"Interview Invitation from {company_name}",
        message_paragraphs=[
            f"A talent partner at <strong>{company_name}</strong> reviewed your profile and extended a direct interview request for <strong>{job_title}</strong>.",
            "Accept or respond to this invitation in your candidate dashboard."
        ],
        cta_title="Accept Invitation",
        cta_url="/candidate?tab=jobs",
        info_card={"Inviter": company_name, "Role": job_title},
        badge_label="Recruiter Invitation"
    )
    return send_email_via_resend(user_email, subject, html)


def send_hackathon_registration(
    user_email: str,
    first_name: str,
    hackathon_title: str
) -> Dict[str, Any]:
    subject = f"Registration Confirmed: '{hackathon_title}' 🏆"
    html = render_email_layout(
        recipient_name=first_name,
        title="Hackathon Registration Confirmed",
        message_paragraphs=[
            f"You're officially registered for <strong>'{hackathon_title}'</strong>!",
            "You can form or join a team, track submission deadlines, and build your project."
        ],
        cta_title="Go to Hackathon Workspace",
        cta_url="/candidate/hackathons",
        info_card={"Event": hackathon_title, "Status": "Registered Participant"},
        badge_label="Hackathon Event"
    )
    return send_email_via_resend(user_email, subject, html)


def send_hackathon_results(
    user_email: str,
    first_name: str,
    hackathon_title: str,
    rank: int,
    prize: str
) -> Dict[str, Any]:
    subject = f"Hackathon Results Published: '{hackathon_title}' 🏆"
    html = render_email_layout(
        recipient_name=first_name,
        title=f"Results Published — Rank #{rank}!",
        message_paragraphs=[
            f"The final results for <strong>'{hackathon_title}'</strong> have been officially announced.",
            f"Your team placed <strong>Rank #{rank}</strong> with award prize: <strong>{prize}</strong>."
        ],
        cta_title="View Leaderboard & Feedback",
        cta_url="/candidate/hackathons",
        info_card={"Event": hackathon_title, "Final Rank": f"#{rank}", "Prize Award": prize},
        badge_label="Hackathon Leaderboard"
    )
    return send_email_via_resend(user_email, subject, html)
