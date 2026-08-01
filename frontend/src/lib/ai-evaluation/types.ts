// lib/ai-evaluation/types.ts
// Core types for ApexTalent's central AI Evaluation Engine.
// Every evaluation type (coding task, GitHub repo, interview, resume, pitch deck)
// runs through the SAME rubric-driven pipeline defined in engine.ts.

export interface RubricCriterion {
  key: string;
  label: string;
  /** Percentage weight, all criteria in a rubric must sum to 100 */
  weight: number;
  /** What the model should specifically look for */
  description: string;
}

export interface Rubric {
  id: string;
  title: string;
  /** High-level instruction injected into the system prompt */
  context: string;
  criteria: RubricCriterion[];
}

export interface CriterionResult {
  key: string;
  label: string;
  weight: number;
  /** Raw score 0-100 for this criterion only */
  score: number;
  /** score * (weight / 100), contributes to overallScore */
  weightedScore: number;
  /** Specific evidence from the candidate's submission, paraphrased */
  evidence: string;
}

export type HiringRecommendation =
  | "strong_hire"
  | "hire"
  | "lean_hire"
  | "no_hire"
  | "strong_no_hire";

export interface EvaluationResult {
  rubricId: string;
  candidateId?: string;
  overallScore: number; // 0-100, sum of weightedScore across criteria
  criteria: CriterionResult[];
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string[];
  hiringRecommendation: HiringRecommendation;
  summary: string;
  modelUsed: string;
  evaluatedAt: string; // ISO timestamp
}

/** Generic container passed into the engine — text the model actually reads */
export interface SubmissionContext {
  candidateId?: string;
  candidateName?: string;
  taskTitle: string;
  /** The actual content to evaluate: code, README, transcript, resume text, etc. */
  content: string;
  /** Optional extra structured metadata (commit counts, test results, etc.) */
  metadata?: Record<string, unknown>;
}

export interface TeamMemberInput {
  id: string;
  full_name: string;
  /** GitHub username — required to match against contributor stats */
  github_username: string;
}

export interface TeamContributionResult {
  candidate_id: string;
  full_name: string;
  contribution_percentage: number;
  commits_count: number;
  additions: number;
  deletions: number;
  prs_count: number;
  leadership_index: number; // 0-99, derived from commit share + merged PR share
  ownership_role: "Lead Contributor" | "Core Contributor" | "Contributor";
}
