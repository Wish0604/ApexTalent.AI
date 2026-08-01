import { NextRequest, NextResponse } from "next/server";
import { runRubricEvaluation } from "@/lib/ai-evaluation/engine";
import { ALL_RUBRICS } from "@/lib/ai-evaluation/rubrics";

export async function POST(req: NextRequest) {
  try {
    const { rubricId, candidateId, candidateName, taskTitle, content, metadata } = await req.json();

    const rubric = ALL_RUBRICS[rubricId];
    if (!rubric) {
      return NextResponse.json(
        { error: `Unknown rubricId "${rubricId}". Valid options: ${Object.keys(ALL_RUBRICS).join(", ")}` },
        { status: 400 }
      );
    }
    if (!content || !taskTitle) {
      return NextResponse.json({ error: "taskTitle and content are required" }, { status: 400 });
    }

    const result = await runRubricEvaluation(rubric, {
      candidateId,
      candidateName,
      taskTitle,
      content,
      metadata,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Evaluation failed:", err);
    return NextResponse.json({ error: err.message ?? "Evaluation failed" }, { status: 500 });
  }
}
