// lib/ai-evaluation/github-evaluator.ts
//
// Pulls REAL data from the GitHub REST API (README, commits, PRs, sampled
// source files) and hands it to the Gemini-powered AI Evaluation Engine.

import { runRubricEvaluation } from "./engine";
import { REPOSITORY_RUBRIC } from "./rubrics";
import { EvaluationResult } from "./types";

const GITHUB_API = "https://api.github.com";

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function parseRepoUrl(githubUrl: string): { owner: string; repo: string } {
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!match) throw new Error(`Could not parse owner/repo from URL: ${githubUrl}`);
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function ghGet(path: string) {
  try {
    const res = await fetch(`${GITHUB_API}${path}`, { headers: githubHeaders() });
    if (!res.ok) {
      if (res.status === 404) return null;
      return null;
    }
    return res.json();
  } catch (e) {
    return null;
  }
}

export async function fetchRepoContext(githubUrl: string) {
  const { owner, repo } = parseRepoUrl(githubUrl);

  const [repoMeta, readme, commits, pulls, languages, contents] = await Promise.all([
    ghGet(`/repos/${owner}/${repo}`),
    ghGet(`/repos/${owner}/${repo}/readme`),
    ghGet(`/repos/${owner}/${repo}/commits?per_page=30`),
    ghGet(`/repos/${owner}/${repo}/pulls?state=all&per_page=20`),
    ghGet(`/repos/${owner}/${repo}/languages`),
    ghGet(`/repos/${owner}/${repo}/contents`),
  ]);

  const readmeText = readme?.content
    ? Buffer.from(readme.content, "base64").toString("utf-8").slice(0, 6000)
    : "(no README found)";

  const commitSummaries = (commits ?? [])
    .slice(0, 25)
    .map((c: any) => `- ${c.commit?.message?.split("\n")[0]} (${c.commit?.author?.name ?? "unknown"})`)
    .join("\n");

  const pullSummaries = (pulls ?? [])
    .slice(0, 15)
    .map((p: any) => `- #${p.number} "${p.title}" [${p.state}${p.merged_at ? ", merged" : ""}]`)
    .join("\n");

  const sampleFiles = Array.isArray(contents)
    ? contents.filter((f: any) => f.type === "file" && /\.(ts|tsx|js|jsx|py|go|java|rs)$/.test(f.name)).slice(0, 5)
    : [];

  const fileSamples = await Promise.all(
    sampleFiles.map(async (f: any) => {
      const fileData = await ghGet(`/repos/${owner}/${repo}/contents/${f.path}`);
      const text = fileData?.content
        ? Buffer.from(fileData.content, "base64").toString("utf-8").slice(0, 2000)
        : "";
      return `### ${f.path}\n${text}`;
    })
  );

  return {
    owner,
    repo,
    description: repoMeta?.description ?? "(no description)",
    stars: repoMeta?.stargazers_count ?? 0,
    languages: Object.keys(languages ?? {}),
    hasTests: Array.isArray(contents)
      ? contents.some((f: any) => /test|spec/i.test(f.name))
      : false,
    hasCi: Array.isArray(contents) ? contents.some((f: any) => f.name === ".github") : false,
    readmeText,
    commitSummaries,
    pullSummaries,
    fileSamples,
    commitCount: commits?.length ?? 0,
    pullCount: pulls?.length ?? 0,
  };
}

export async function evaluateRepository(
  githubUrl: string,
  candidateId?: string,
  candidateName?: string
): Promise<EvaluationResult> {
  const ctx = await fetchRepoContext(githubUrl);

  const content = `Repository: ${ctx.owner}/${ctx.repo}
Description: ${ctx.description}
Languages: ${ctx.languages.join(", ") || "unknown"}
Has test files: ${ctx.hasTests}
Has CI config (.github): ${ctx.hasCi}

--- README ---
${ctx.readmeText}

--- RECENT COMMITS (${ctx.commitCount}) ---
${ctx.commitSummaries || "(no commits found)"}

--- PULL REQUESTS (${ctx.pullCount}) ---
${ctx.pullSummaries || "(no pull requests found)"}

--- SAMPLED SOURCE FILES ---
${ctx.fileSamples.join("\n\n") || "(no source files sampled)"}`;

  return runRubricEvaluation(REPOSITORY_RUBRIC, {
    candidateId,
    candidateName,
    taskTitle: `GitHub Repository Evaluation: ${ctx.owner}/${ctx.repo}`,
    content,
    metadata: { stars: ctx.stars, languages: ctx.languages },
  });
}
