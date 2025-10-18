// Scoring logic for electives based on user preferences

import type { Elective } from "@/types/Elective";

export interface ScoringOptions {
  academy?: string | undefined;
  interests: string[];
  language?: string | undefined;
  workloadPref?: "light" | "medium" | "heavy" | undefined;
}

export interface ScoringResult {
  score: number;
  reasons: string[];
}

export function scoreElective(e: Elective, opts: ScoringOptions): ScoringResult {
  let score = 0;
  const reasons: string[] = [];

  // academy/provider match (strong)
  if (opts.academy && e.provider) {
    const academyNormalized = opts.academy.toLowerCase();
    if (
      e.provider.toLowerCase().includes(academyNormalized) ||
      academyNormalized.includes(e.provider.toLowerCase())
    ) {
      score += 40;
      reasons.push("Past bij gekozen academie");
    }
  }

  // tags/interests overlap (medium)
  const tags = (e.tags ?? []).map((t) => t.toLowerCase());
  const matches = opts.interests.map((i) => i.toLowerCase()).filter((i) => tags.includes(i));
  if (matches.length > 0) {
    const add = Math.min(12 * matches.length, 36);
    score += add;
    reasons.push(`${matches.length} overeenkomstige interesse${matches.length > 1 ? "n" : ""}`);
  }

  // language preference (small)
  if (opts.language && e.language) {
    if (e.language.toLowerCase().includes(opts.language.toLowerCase())) {
      score += 8;
      reasons.push("Taal komt overeen");
    }
  }

  // workload preference (tiny)
  if (opts.workloadPref && typeof e.credits === "number") {
    if (opts.workloadPref === "light" && e.credits <= 3) {
      score += 8;
      reasons.push("Lichte workload");
    } else if (opts.workloadPref === "medium" && e.credits >= 3 && e.credits <= 6) {
      score += 8;
      reasons.push("Gemiddelde workload");
    } else if (opts.workloadPref === "heavy" && e.credits >= 6) {
      score += 8;
      reasons.push("Zware workload");
    }
  }

  // small boosts
  if (e.tags && e.tags.length > 0) score += Math.min(3, e.tags.length);
  if (e.credits && e.credits >= 3 && e.credits <= 6) score += 2;

  // small penalty for extremely long description (diversiteit)
  if (e.description && e.description.length > 800) score -= 2;

  const raw = Math.max(0, Math.min(100, Math.round(score)));
  return { score: raw, reasons };
}
