// lib/ai-evaluation/rubrics.ts
// Rubric definitions — the "contract" every AI evaluation must follow.

import { Rubric } from "./types";

export const CODING_TASK_RUBRIC: Rubric = {
  id: "coding_task_v1",
  title: "Coding / Technical Task Evaluation",
  context:
    "You are evaluating a candidate's submitted coding solution against the given problem statement. Be strict and specific — do not inflate scores.",
  criteria: [
    { key: "correctness", label: "Correctness", weight: 30, description: "Does the solution actually solve the stated problem? Are edge cases handled?" },
    { key: "code_quality", label: "Code Quality", weight: 20, description: "Readability, naming, structure, idiomatic use of the language/framework." },
    { key: "problem_solving", label: "Problem Solving", weight: 20, description: "Quality of approach/algorithm choice, reasoning shown in comments or structure." },
    { key: "technical_knowledge", label: "Technical Knowledge", weight: 15, description: "Correct and appropriate use of language features, libraries, patterns." },
    { key: "performance", label: "Performance / Optimization", weight: 10, description: "Time/space complexity, unnecessary re-renders/queries, obvious bottlenecks." },
    { key: "documentation", label: "Documentation", weight: 5, description: "Comments, README, docstrings explaining non-obvious decisions." },
  ],
};

export const REPOSITORY_RUBRIC: Rubric = {
  id: "repository_v1",
  title: "GitHub Repository / Project Evaluation",
  context:
    "You are evaluating a candidate's real GitHub repository (README, commit history, pull requests, and sampled source files) as a proxy for engineering ability. Base every score on concrete evidence provided — never assume things not shown.",
  criteria: [
    { key: "problem_fit", label: "Problem/Solution Fit", weight: 20, description: "Does the README/code show the project actually solves what it claims to?" },
    { key: "architecture", label: "Code Structure & Maintainability", weight: 20, description: "Module boundaries, separation of concerns, file organization." },
    { key: "tech_usage", label: "Appropriate Use of Technologies", weight: 15, description: "Are chosen frameworks/libraries suitable and used correctly?" },
    { key: "error_handling", label: "Error Handling", weight: 10, description: "Presence and quality of error handling / edge case coverage in sampled code." },
    { key: "testing", label: "Testing", weight: 10, description: "Presence of test files/CI config and their apparent coverage." },
    { key: "commit_quality", label: "Git Commit Quality", weight: 10, description: "Commit message clarity, atomic commits, meaningful PR history vs. one giant dump." },
    { key: "documentation", label: "Documentation", weight: 10, description: "README completeness: setup instructions, usage, architecture explanation." },
    { key: "complexity", label: "Complexity Handled", weight: 5, description: "Does the project reflect non-trivial engineering effort for its stated scope?" },
  ],
};

export const INTERVIEW_RUBRIC: Rubric = {
  id: "interview_v1",
  title: "AI Interview Response Evaluation",
  context:
    "You are evaluating a candidate's spoken/typed interview answer (already transcribed) to a technical or behavioral question. Judge only what is present in the transcript.",
  criteria: [
    { key: "technical_accuracy", label: "Technical Accuracy", weight: 30, description: "Are technical claims correct?" },
    { key: "relevance", label: "Relevance to Question", weight: 20, description: "Does the answer actually address what was asked?" },
    { key: "problem_solving", label: "Problem-Solving Approach", weight: 20, description: "Structured reasoning, trade-off awareness." },
    { key: "communication", label: "Communication Clarity", weight: 15, description: "Is the explanation clear, well-organized, jargon used appropriately?" },
    { key: "depth", label: "Depth of Explanation", weight: 10, description: "Surface-level vs. genuinely deep understanding." },
    { key: "followup_handling", label: "Follow-up Question Handling", weight: 5, description: "How well the candidate responded to probing follow-ups, if present in transcript." },
  ],
};

export const RESUME_RUBRIC: Rubric = {
  id: "resume_v1",
  title: "Resume → Talent Score Evaluation",
  context:
    "You are scoring a resume against a target role profile. Extract real signal (specific projects, measurable impact, technical depth) rather than rewarding buzzwords.",
  criteria: [
    { key: "relevant_experience", label: "Relevant Experience", weight: 30, description: "How closely past roles/projects match the target role." },
    { key: "technical_depth", label: "Technical Depth", weight: 25, description: "Evidence of real technical work vs. surface-level listing of tools." },
    { key: "impact_evidence", label: "Impact / Outcomes", weight: 20, description: "Quantified results, shipped projects, measurable contributions." },
    { key: "skill_breadth", label: "Skill Breadth & Relevance", weight: 15, description: "Coverage of skills required for the role." },
    { key: "presentation", label: "Resume Clarity & Presentation", weight: 10, description: "Structure, conciseness, absence of fluff." },
  ],
};

export const PITCH_DECK_RUBRIC: Rubric = {
  id: "pitch_deck_v1",
  title: "Pitch Deck / Presentation Evaluation",
  context:
    "You are evaluating a project pitch deck (extracted slide text) for a hackathon or product submission.",
  criteria: [
    { key: "innovation", label: "Innovation", weight: 40, description: "Originality and creativity of the idea/approach." },
    { key: "business_impact", label: "Business / Real-world Impact", weight: 35, description: "Clarity of problem, market need, and viability of the solution." },
    { key: "clarity", label: "Presentation Clarity", weight: 25, description: "Structure, narrative flow, how well slides communicate the idea." },
  ],
};

export const API_DESIGN_RUBRIC: Rubric = {
  id: "api_design_v1",
  title: "REST API Task Evaluation",
  context: "You are evaluating a candidate's REST API implementation for a job-management system.",
  criteria: [
    { key: "functional_correctness", label: "Functional Correctness", weight: 30, description: "Do the endpoints behave as specified?" },
    { key: "api_design", label: "API Design", weight: 20, description: "REST conventions, resource naming, status codes, versioning." },
    { key: "code_quality", label: "Code Quality", weight: 15, description: "Structure, readability, separation of concerns." },
    { key: "database_design", label: "Database Design", weight: 15, description: "Schema normalization, indexing, relationships." },
    { key: "security", label: "Security", weight: 10, description: "Auth, input validation, injection protection." },
    { key: "testing", label: "Testing", weight: 5, description: "Presence and quality of automated tests." },
    { key: "documentation", label: "Documentation", weight: 5, description: "API docs, README, inline comments." },
  ],
};

export const ALL_RUBRICS: Record<string, Rubric> = {
  [CODING_TASK_RUBRIC.id]: CODING_TASK_RUBRIC,
  [REPOSITORY_RUBRIC.id]: REPOSITORY_RUBRIC,
  [INTERVIEW_RUBRIC.id]: INTERVIEW_RUBRIC,
  [RESUME_RUBRIC.id]: RESUME_RUBRIC,
  [PITCH_DECK_RUBRIC.id]: PITCH_DECK_RUBRIC,
  [API_DESIGN_RUBRIC.id]: API_DESIGN_RUBRIC,
};

export function assertRubricIsValid(rubric: Rubric) {
  const total = rubric.criteria.reduce((sum, c) => sum + c.weight, 0);
  if (total !== 100) {
    throw new Error(`Rubric "${rubric.id}" weights sum to ${total}, must be 100`);
  }
}
