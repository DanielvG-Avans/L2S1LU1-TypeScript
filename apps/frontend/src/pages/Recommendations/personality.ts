// Personality-based preference derivation logic

export interface DerivedPreferences {
  academy?: string;
  interests: string[];
  workloadPref: "light" | "medium" | "heavy";
  language?: string;
}

export function deriveFromPersonality(
  answers: (string | null)[],
  interests: string[],
): DerivedPreferences {
  const interestCandidates: string[] = [];
  const academyVotes: Record<string, number> = {};
  let workloadScore = 0; // negative -> light, positive -> heavy

  // simple mapping rules per answer
  const mapAnswer = (qIdx: number, answer: string) => {
    switch (qIdx) {
      case 0: // impact
        if (answer === "A") {
          interestCandidates.push("Sustainability", "Data");
          academyVotes["Academie voor Welzijn en Gezondheid (AWG)"] =
            (academyVotes["Academie voor Welzijn en Gezondheid (AWG)"] ?? 0) + 2;
          academyVotes["Academie voor Welzijn Educatie en Gezondheid (AWEG)"] =
            (academyVotes["Academie voor Welzijn Educatie en Gezondheid (AWEG)"] ?? 0) + 2;
          academyVotes["Academie voor Life Sciences en Technologie (ALST)"] =
            (academyVotes["Academie voor Life Sciences en Technologie (ALST)"] ?? 0) + 1;
        }
        if (answer === "B") {
          interestCandidates.push("Design", "Embedded");
          academyVotes["Academie voor Technologie en Design (ATD)"] =
            (academyVotes["Academie voor Technologie en Design (ATD)"] ?? 0) + 3;
          academyVotes["Avans Academie Creative Innovation (AACI)"] =
            (academyVotes["Avans Academie Creative Innovation (AACI)"] ?? 0) + 1;
        }
        if (answer === "C") {
          interestCandidates.push("Projectmanagement", "Web Development");
          academyVotes["Academie voor Business en Entrepreneurship (ABE)"] =
            (academyVotes["Academie voor Business en Entrepreneurship (ABE)"] ?? 0) + 3;
          academyVotes["Academie voor Management en Finance (AMF)"] =
            (academyVotes["Academie voor Management en Finance (AMF)"] ?? 0) + 1;
          workloadScore += 1;
        }
        if (answer === "D") {
          interestCandidates.push("Sustainability", "Design");
          academyVotes["Academie voor Duurzaam Gebouwde Omgeving (ADGO)"] =
            (academyVotes["Academie voor Duurzaam Gebouwde Omgeving (ADGO)"] ?? 0) + 3;
        }
        if (answer === "E") {
          interestCandidates.push("Design", "UX / Product");
          academyVotes["Avans Academie Creative Innovation (AACI)"] =
            (academyVotes["Avans Academie Creative Innovation (AACI)"] ?? 0) + 3;
        }
        break;

      case 1: // projects
        if (answer === "A") {
          interestCandidates.push("Sustainability", "Projectmanagement");
          academyVotes["AWG"] =
            (academyVotes["Academie voor Welzijn en Gezondheid (AWG)"] ?? 0) + 2;
        }
        if (answer === "B") {
          interestCandidates.push("Embedded", "AI / ML");
          academyVotes["ATD"] =
            (academyVotes["Academie voor Technologie en Design (ATD)"] ?? 0) + 2;
        }
        if (answer === "C") {
          interestCandidates.push("Projectmanagement", "Web Development");
          academyVotes["ABE"] =
            (academyVotes["Academie voor Business en Entrepreneurship (ABE)"] ?? 0) + 2;
          workloadScore += 1;
        }
        if (answer === "D") {
          interestCandidates.push("Data");
          academyVotes["AMF"] =
            (academyVotes["Academie voor Management en Finance (AMF)"] ?? 0) + 2;
          workloadScore += 1;
        }
        if (answer === "E") {
          interestCandidates.push("Data", "Sustainability");
          academyVotes["ALST"] =
            (academyVotes["Academie voor Life Sciences en Technologie (ALST)"] ?? 0) + 2;
        }
        break;

      case 2: // environment
        if (answer === "A") {
          interestCandidates.push("Projectmanagement", "UX / Product");
          academyVotes["AWG"] =
            (academyVotes["Academie voor Welzijn en Gezondheid (AWG)"] ?? 0) + 2;
        }
        if (answer === "B") {
          interestCandidates.push("Web Development", "Projectmanagement");
          academyVotes["ABE"] =
            (academyVotes["Academie voor Business en Entrepreneurship (ABE)"] ?? 0) + 2;
          workloadScore += 1;
        }
        if (answer === "C") {
          interestCandidates.push("Data");
          academyVotes["AMF"] =
            (academyVotes["Academie voor Management en Finance (AMF)"] ?? 0) + 2;
        }
        if (answer === "D") {
          interestCandidates.push("Design", "Sustainability");
          academyVotes["ATD"] =
            (academyVotes["Academie voor Technologie en Design (ATD)"] ?? 0) + 2;
          academyVotes["ADGO"] =
            (academyVotes["Academie voor Duurzaam Gebouwde Omgeving (ADGO)"] ?? 0) + 1;
        }
        if (answer === "E") {
          interestCandidates.push("Embedded", "AI / ML");
          academyVotes["ATIx"] =
            (academyVotes["Academie voor Technologie en Innovatie x (ATIx)"] ?? 0) + 2;
          academyVotes["ALST"] =
            (academyVotes["Academie voor Life Sciences en Technologie (ALST)"] ?? 0) + 1;
        }
        break;

      case 3: // subjects
        if (answer === "A") {
          interestCandidates.push("Sustainability");
          academyVotes["AWG"] =
            (academyVotes["Academie voor Welzijn en Gezondheid (AWG)"] ?? 0) + 2;
        }
        if (answer === "B") {
          interestCandidates.push("Projectmanagement", "Data");
          academyVotes["AMF"] =
            (academyVotes["Academie voor Management en Finance (AMF)"] ?? 0) + 2;
          workloadScore += 1;
        }
        if (answer === "C") {
          interestCandidates.push("Data", "Sustainability");
          academyVotes["ALST"] =
            (academyVotes["Academie voor Life Sciences en Technologie (ALST)"] ?? 0) + 3;
        }
        if (answer === "D") {
          interestCandidates.push("Design", "Sustainability");
          academyVotes["ADGO"] =
            (academyVotes["Academie voor Duurzaam Gebouwde Omgeving (ADGO)"] ?? 0) + 2;
          academyVotes["ATD"] =
            (academyVotes["Academie voor Technologie en Design (ATD)"] ?? 0) + 1;
        }
        if (answer === "E") {
          interestCandidates.push("Design", "UX / Product");
          academyVotes["AACI"] =
            (academyVotes["Avans Academie Creative Innovation (AACI)"] ?? 0) + 3;
        }
        break;

      case 4: // problem solving
        if (answer === "A") {
          interestCandidates.push("UX / Product", "Projectmanagement");
          workloadScore -= 1;
        }
        if (answer === "B") {
          interestCandidates.push("Design", "Embedded");
          academyVotes["ATD"] =
            (academyVotes["Academie voor Technologie en Design (ATD)"] ?? 0) + 2;
        }
        if (answer === "C") {
          interestCandidates.push("Data");
          academyVotes["AMF"] =
            (academyVotes["Academie voor Management en Finance (AMF)"] ?? 0) + 2;
          workloadScore += 1;
        }
        if (answer === "D") {
          interestCandidates.push("Design", "UX / Product");
          academyVotes["AACI"] =
            (academyVotes["Avans Academie Creative Innovation (AACI)"] ?? 0) + 1;
        }
        break;
    }
  };

  // iterate answers
  answers.forEach((ans, idx) => {
    if (ans) mapAnswer(idx, ans);
  });

  // pick top academy candidate if any votes exist
  let topAcademy: string | undefined = undefined;
  if (Object.keys(academyVotes).length > 0) {
    const sorted = Object.entries(academyVotes).sort((a, b) => b[1] - a[1]);
    topAcademy = sorted[0][0];
  }

  // dedupe and normalize interest candidates mapping to our INTERESTS list
  const normalized = Array.from(
    new Set(
      interestCandidates
        .map((t) => {
          const lower = t.toLowerCase();
          return interests.find((i) => i.toLowerCase().includes(lower)) ?? t;
        })
        .filter(Boolean),
    ),
  );

  // compute workload preference from workloadScore
  let workloadPref: "light" | "medium" | "heavy" = "medium";
  if (workloadScore <= -1) workloadPref = "light";
  else if (workloadScore >= 2) workloadPref = "heavy";

  return { academy: topAcademy, interests: normalized, workloadPref, language: undefined };
}
