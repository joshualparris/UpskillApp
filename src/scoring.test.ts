import { describe, expect, it } from "vitest";
import { validateBackup } from "./lib/backup";
import { agenciesSeed } from "./data";
import { matchRequirements } from "./lib/workappBridge";
import { needsVerification, scoreAgency, trainingScore } from "./lib/scoring";
import { trainingSeed } from "./data";

describe("scoreAgency", () => {
  it("scores Spinifex highly for Josh with breakdown", () => {
    const spinifex = agenciesSeed.find((agency) => agency.id === "spinifex");
    const score = scoreAgency(spinifex!);
    expect(score.joshScore).toBeGreaterThan(50);
    expect(score.joshBreakdown.length).toBeGreaterThan(0);
  });

  it("penalises aged-care focused listings for Kristy", () => {
    const aged = {
      ...agenciesSeed[0],
      id: "aged-test",
      tags: ["aged care", "nursing"],
      kristyRelevance: ["nursing"],
    };
    const score = scoreAgency(aged);
    expect(score.kristyHardPenalty).toBe(true);
    expect(score.kristyBreakdown.some((b) => b.label.includes("Aged care"))).toBe(true);
  });

  it("respects aged-care override", () => {
    const aged = {
      ...agenciesSeed[0],
      id: "aged-override",
      tags: ["aged care", "non-aged-care"],
      kristyAgedCareOverride: true,
    };
    const score = scoreAgency(aged);
    expect(score.kristyHardPenalty).toBe(false);
  });
});

describe("trainingScore", () => {
  it("ranks immunisation above lower-priority Kristy options", () => {
    const immunisation = trainingSeed.find((course) => course.id === "immunisation");
    const childFamily = trainingSeed.find((course) => course.id === "child-family");
    expect(trainingScore(immunisation!)).toBeGreaterThan(trainingScore(childFamily!));
  });
});

describe("needsVerification", () => {
  it("flags missing verification dates", () => {
    expect(needsVerification("")).toBe(true);
  });

  it("accepts recent verification", () => {
    expect(needsVerification("2099-01-01")).toBe(false);
  });
});

describe("validateBackup", () => {
  it("rejects invalid backup", () => {
    expect(() => validateBackup({})).toThrow();
  });

  it("accepts minimal valid backup", () => {
    const backup = validateBackup({
      agencies: agenciesSeed,
      training: trainingSeed,
      contacts: [],
    });
    expect(backup.agencies.length).toBeGreaterThan(0);
    expect(backup.parent.yilabaraChecklistItems.length).toBeGreaterThan(0);
  });
});

describe("matchRequirements", () => {
  it("detects M365 requirements", () => {
    const matches = matchRequirements("Microsoft 365 admin required", trainingSeed);
    expect(matches.some((m) => m.id === "m365")).toBe(true);
  });
});
