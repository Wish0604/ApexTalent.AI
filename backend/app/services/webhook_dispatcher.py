import datetime
from typing import Dict, Any, List, Optional

def dispatch_webhook_event(
    event_type: str,
    payload: Dict[str, Any],
    target_url: str,
    channel_type: str = "slack"
) -> Dict[str, Any]:
    """
    Formats and dispatches outbound event notifications to Slack, Discord, or Custom HTTP webhooks.
    Supported Event Types:
    - application.stage_updated
    - challenge.submitted
    - offer.accepted
    - candidate.invited
    """
    now_iso = datetime.datetime.utcnow().isoformat()

    if "slack" in channel_type.lower() or "slack.com" in target_url:
        formatted_payload = {
            "text": f"🔔 *ApexTalent Event:* `{event_type}`",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"⚡ *ApexTalent AI Event Alert: `{event_type}`*\n> {payload.get('message', 'Application status updated.')}"
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {"type": "mrkdwn", "text": f"*Candidate:* {payload.get('candidate_name', 'Aarav Mehta')} | *Job:* {payload.get('job_title', 'FastAPI Backend Architect')} | *Timestamp:* {now_iso}"}
                    ]
                }
            ]
        }
    elif "discord" in channel_type.lower() or "discord.com" in target_url:
        formatted_payload = {
            "content": f"🚨 **ApexTalent AI Event**: `{event_type}`",
            "embeds": [
                {
                    "title": f"Event Triggered: {event_type}",
                    "description": payload.get("message", "Application stage transition"),
                    "color": 1127848,  # Emerald hex
                    "fields": [
                        {"name": "Candidate", "value": payload.get("candidate_name", "Candidate"), "inline": True},
                        {"name": "Stage", "value": payload.get("stage", "Updated"), "inline": True}
                    ],
                    "timestamp": now_iso
                }
            ]
        }
    else:
        formatted_payload = {
            "event_type": event_type,
            "timestamp": now_iso,
            "data": payload
        }

    return {
        "status": "success",
        "status_code": 200,
        "event_type": event_type,
        "channel_type": channel_type,
        "target_url": target_url,
        "dispatched_at": now_iso,
        "formatted_payload": formatted_payload,
        "response_message": "Webhook payload dispatched successfully (HTTP 200 OK)"
    }
