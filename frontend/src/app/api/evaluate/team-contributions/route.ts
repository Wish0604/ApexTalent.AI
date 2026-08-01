import { NextRequest, NextResponse } from "next/server";
import { computeTeamContributions } from "@/lib/ai-evaluation/team-contributions";

export async function POST(req: NextRequest) {
  try {
    const { owner, repo, teamMembers } = await req.json();

    if (!owner || !repo) {
      return NextResponse.json({ error: "owner and repo are required" }, { status: 400 });
    }

    const results = await computeTeamContributions(owner, repo, teamMembers || []);
    return NextResponse.json(results);
  } catch (err: any) {
    console.error("Team contribution calculation failed:", err);
    return NextResponse.json({ error: err.message ?? "Calculation failed" }, { status: 500 });
  }
}
