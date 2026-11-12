// Reuse established native integration coverage, in new owned tests only.
import fs from 'node:fs';
let clinical=fs.readFileSync('packages/clinical-content/src/question-new-n1-round2-20261104.test.ts','utf8');
clinical=clinical.replaceAll('N1','N2').replaceAll('n1','n2');
clinical=clinical.replace('QUESTION_BANK_PRE_BATCH2B_RELEASE as roundTwoRelease','SYNTHETIC_CLINICAL_RELEASE as roundTwoRelease');
// The other-cohort preservation check must reference N1, never duplicate N2.
clinical=clinical.replace('import { QUESTION_NEW_N2_CASES } from "./question-new-n2-20261104";',
 'import { QUESTION_NEW_N1_ROUND2_CASES as protectedN1Cases } from "./question-new-n1-round2-20261104";');
clinical=clinical.replace('for (const old of QUESTION_NEW_N2_CASES)\n      expect(roundTwoRelease.cases.find(c => c.id === old.id)).toEqual(old);',
 'for (const old of protectedN1Cases)\n      expect(roundTwoRelease.cases.find(c => c.id === old.id)).toEqual(old);');
clinical=clinical.replaceAll('38 returned','37 returned').replace('toHaveLength(40)','toHaveLength(39)').replace('toHaveLength(38)','toHaveLength(37)').replace('toHaveLength(6)','toHaveLength(21)');
clinical=clinical.replace('["phyllodes-benign-margin", "aldosterone-overt-phenotype"]',
 '["irreversible-ischemia-revascularization-boundary", "case-mix-standardized-risk"]');
clinical=clinical.replace('  it("ships the three referenced original PNG schematics',`  it("retains complete manual checks and every distractor counterfactual without granting independent or clinical approval", () => {
    for (const revision of revisions) {
      const check = revision.selfCheck;
      for (const field of [check.coverTheKey, check.sameDecisionStageAndCategory, check.interpretFindings,
        check.consequentialDecision, check.difficultyReason, check.singleBestAnswer, check.deletionTest])
        expect(field.length).toBeGreaterThan(35);
      expect(["moderate", "hard"]).toContain(check.residentDifficulty);
      expect(check.distractorMisreadings.map(d => d.choiceId).sort()).toEqual(revision.item.choices.slice(1).map(c => c.id).sort());
      for (const distractor of check.distractorMisreadings)
        expect(distractor.plausibleMisreading && distractor.whenItWouldBeRight && distractor.whyNotThisRecord).toBeTruthy();
      expect(check.calibrationIds.length).toBeGreaterThan(0);
    }
  });

  it("checks the constructed protocol arithmetic independently of the authored explanations", () => {
    expect(112 / (112 + 12)).toBeCloseTo(0.9032258);
    const positiveLikelihoodRatio = (40 / (40 + 40)) / (20 / (20 + 180));
    const posteriorOdds = (1 / 4) * positiveLikelihoodRatio;
    expect(positiveLikelihoodRatio).toBe(5);
    expect(posteriorOdds / (1 + posteriorOdds)).toBeCloseTo(5 / 9);
    expect(Math.ceil(1 / ((90 - 60) / 1000))).toBe(34);
    expect(1 / ((80 - 30) / 1000)).toBe(20);
    expect(((43 + 12) - (43 + 5)) / 100).toBe(0.07);
    expect(-0.7 > -2 && 1.3 < 2).toBe(true);
    expect(3.2 < 2).toBe(false);
  });

  it("ships the three referenced original PNG schematics`);
fs.writeFileSync('packages/clinical-content/src/question-new-n2-round2-20261104.test.ts',clinical);
let domain=fs.readFileSync('packages/game-domain/tests/question-new-n1-round2-admission.test.ts','utf8');
domain=domain.replaceAll('N1','N2').replaceAll('n1','n2');
domain=domain.replace('adds only six genuinely new-version opportunities','exposes 21 changed-meaning versions without resetting preserved histories')
 .replace('expect(expected.size).toBe(6)','expect(expected.size).toBe(21)')
 .replace('for 32 preserved meanings without copying those histories to six changed constructs','for 16 preserved meanings without copying those histories to 21 changed constructs');
domain=domain.replaceAll('postoperative-ascites-ct','factor-assays-without-mixing-gate');
domain=domain.replace('["direct-inguinal-anatomy", "celiac-iga-deficiency", "phyllodes-benign-excision", "respiratory-acidosis", "vka-pcc-selection"]',
 '["sglt2-postoperative-restart", "naloxone-response-recurrence", "refeeding-baseline-phosphate-attribution", "bile-leak-duct-continuity-boundary", "positive-likelihood-ratio"]');
fs.writeFileSync('packages/game-domain/tests/question-new-n2-round2-admission.test.ts',domain);
console.log('Created separate clinical projection/provenance and native admission/supply/frozen-save tests.');
