import { NextRequest, NextResponse } from "next/server";
import { evaluateRepository } from "@/lib/ai-evaluation/github-evaluator";

export async function POST(req: NextRequest) {
  try {
    const { githubUrl, candidateId, candidateName } = await req.json();

    if (!githubUrl) {
      return NextResponse.json({ error: "githubUrl is required" }, { status: 400 });
    }

    const result = await evaluateRepository(githubUrl, candidateId, candidateName);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Repository evaluation failed:", err);
    return NextResponse.json({ error: err.message ?? "Evaluation failed" }, { status: 500 });
  }
}
