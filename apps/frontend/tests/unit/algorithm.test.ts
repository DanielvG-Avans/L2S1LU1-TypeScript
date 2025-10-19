// Quick test/demo of the enhanced recommendation algorithm

import {
  scoreElective,
  diversifyResults,
  type ScoringOptions,
} from "../../src/pages/Recommendations/scoring";
import { deriveFromPersonality } from "../../src/pages/Recommendations/personality";
import type { Elective } from "@/types/Elective";

// Mock electives for testing
const mockElectives: Elective[] = [
  {
    code: "AI101",
    name: "Introduction to Artificial Intelligence",
    description:
      "Learn the fundamentals of AI, machine learning, and neural networks. Hands-on projects with Python and TensorFlow.",
    provider: "Academie voor Technologie en Design (ATD)",
    period: "Q1",
    duration: "1 periode",
    credits: 15,
    language: "English",
    location: "Breda",
    level: "NLQF5",
    tags: ["AI / ML", "Data"],
  },
  {
    code: "WEB201",
    name: "Modern Web Development",
    description:
      "Build full-stack web applications using React, Node.js, and TypeScript. Focus on responsive design and API development.",
    provider: "Academie voor Business en Entrepreneurship (ABE)",
    period: "Q2",
    duration: "1 periode",
    credits: 20,
    language: "Nederlands",
    location: "Breda",
    level: "NLQF6",
    tags: ["Web Development", "Design"],
  },
  {
    code: "SUS301",
    name: "Sustainable Urban Planning",
    description:
      "Design eco-friendly cities and communities. Focus on green architecture and environmental impact.",
    provider: "Academie voor Duurzaam Gebouwde Omgeving (ADGO)",
    period: "Q3",
    duration: "2 periodes",
    credits: 30,
    language: "Nederlands",
    location: "Den Bosch",
    level: "NLQF6",
    tags: ["Sustainability", "Design"],
  },
  {
    code: "DATA150",
    name: "Data Analytics Fundamentals",
    description:
      "Master data visualization, SQL databases, and analytics tools. Work with real-world datasets.",
    provider: "Academie voor Management en Finance (AMF)",
    period: "Q1",
    duration: "1 periode",
    credits: 15,
    language: "English",
    location: "Breda",
    level: "NLQF5",
    tags: ["Data", "AI / ML"],
  },
];

// Test 1: Basic scoring
export function testBasicScoring() {
  console.log("=== Test 1: Basic Scoring ===");

  const options: ScoringOptions = {
    academy: "Academie voor Technologie en Design (ATD)",
    interests: ["AI / ML", "Data"],
    language: "English",
    workloadPref: "light",
  };

  const result = scoreElective(mockElectives[0], options);
  console.log("Elective:", mockElectives[0].name);
  console.log("Score:", result.score);
  console.log("Reasons:", result.reasons);
  console.log("Breakdown:", result.breakdown);
  console.log("\n");
}

// Test 2: Content matching
export function testContentMatching() {
  console.log("=== Test 2: Content Matching ===");

  const options: ScoringOptions = {
    interests: ["AI / ML", "Web Development"],
    workloadPref: "medium",
  };

  mockElectives.forEach((elective) => {
    const result = scoreElective(elective, options);
    console.log(`${elective.name}: ${result.score} points`);
    console.log(`  Reasons: ${result.reasons.join(", ")}`);
  });
  console.log("\n");
}

// Test 3: Personality derivation
export function testPersonalityDerivation() {
  console.log("=== Test 3: Personality Derivation ===");

  // Simulate answers: tech-focused student
  const answers = ["B", "B", "E", "E", "B"];
  const interests = ["AI / ML", "Web Development", "Data", "Embedded", "Robotics", "Design"];

  const derived = deriveFromPersonality(answers, interests);
  console.log("Derived academy:", derived.academy);
  console.log("Derived interests:", derived.interests);
  console.log("Derived workload:", derived.workloadPref);
  console.log("\n");
}

// Test 4: Diversity boosting
export function testDiversityBoosting() {
  console.log("=== Test 4: Diversity Boosting ===");

  // Create more electives with same provider
  const expandedElectives: Elective[] = [
    ...mockElectives,
    {
      code: "ATD201",
      name: "Advanced Design Thinking",
      description: "Creative problem solving and innovation",
      provider: "Academie voor Technologie en Design (ATD)",
      period: "Q2",
      duration: "1 periode",
      credits: 15,
      language: "Nederlands",
      location: "Breda",
      level: "NLQF6",
      tags: ["Design"],
    },
    {
      code: "ATD202",
      name: "Prototyping Workshop",
      description: "Hands-on product development",
      provider: "Academie voor Technologie en Design (ATD)",
      period: "Q3",
      duration: "1 periode",
      credits: 15,
      language: "Nederlands",
      location: "Breda",
      level: "NLQF5",
      tags: ["Design", "UX / Product"],
    },
  ];

  const options: ScoringOptions = {
    academy: "Academie voor Technologie en Design (ATD)",
    interests: ["Design"],
    workloadPref: "light",
  };

  const scored = expandedElectives.map((e) => ({
    elective: e,
    ...scoreElective(e, options),
  }));

  scored.sort((a, b) => b.score - a.score);

  console.log("Before diversity:");
  scored.forEach((s) => console.log(`  ${s.elective.provider}: ${s.elective.name} (${s.score})`));

  const diversified = diversifyResults(scored, 2);

  console.log("\nAfter diversity (max 2 per provider):");
  diversified.forEach((s) =>
    console.log(`  ${s.elective.provider}: ${s.elective.name} (${s.score})`),
  );
  console.log("\n");
}

// Run all tests
export function runAllTests() {
  console.log("🧪 Running Enhanced Recommendation Algorithm Tests\n");
  testBasicScoring();
  testContentMatching();
  testPersonalityDerivation();
  testDiversityBoosting();
  console.log("✅ All tests completed!");
}

// Uncomment to run tests:
// runAllTests();
