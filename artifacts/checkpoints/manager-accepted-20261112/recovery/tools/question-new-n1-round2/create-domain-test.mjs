// Reuse the established native clinic fixture technique, without editing its N2 source.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const target='packages/game-domain/tests/question-new-n1-round2-admission.test.ts';
assert.ok(!fs.existsSync(target),'Preserve existing owned test edits.');
let code=fs.readFileSync('packages/game-domain/tests/question-new-n2-admission.test.ts','utf8').replaceAll('\r\n','\n');
code=code.replace('QUESTION_NEW_N2_CASES as cases','QUESTION_NEW_N1_ROUND2_REVISED_CASES as cases')
  .replaceAll('QUESTION_NEW_N2_TESTED_CONCEPTS','QUESTION_NEW_N1_ROUND2_TESTED_CONCEPTS')
  .replaceAll('QUESTION_NEW_N2_TIMING_ENTRIES','QUESTION_NEW_N1_ROUND2_TIMING_ENTRIES')
  .replaceAll('QUESTION_NEW_N2_PRE_RELEASE','QUESTION_NEW_N1_ROUND2_PRE_RELEASE')
  .replaceAll('n2','n1r2').replaceAll('N2','N1 round two');
const begin=code.indexOf('  it("adds exactly thirty-nine');
const end=code.indexOf('  it("shuffles actual frozen keys',begin);
assert.ok(begin>=0&&end>begin);
code=code.slice(0,begin)+`  it("preserves due dates for unchanged meanings and adds only six genuinely new-version opportunities", () => {
    const state = vacant();
    // Real progressed-history model: do not clear old reviews merely because wording changed.
    for (const clinicalCase of QUESTION_NEW_N1_ROUND2_PRE_RELEASE.cases) for (const node of clinicalCase.decisionNodes)
      reviewed(state, { ...clinicalCase, decisionNodes: [node] }, NOW + 86_400_000);
    const expected = new Set(concepts.filter(c => !QUESTION_NEW_N1_ROUND2_PRE_RELEASE.concepts.some(old => old.id === c.id)).map(c => c.id));
    expect(expected.size).toBe(6);
    const integratedPatientCases = context.clinicalRelease.cases.filter(c => c.routineEligible && !c.participant);
    const introduced = new Set<string>();
    for (let count = 0; count < expected.size; count++) {
      const selected = selectRoutineClinicalCase(state, integratedPatientCases, NOW)!;
      expect(selected.kind).toBe("new_concept");
      introduced.add(selected.selectedConceptId);
      reviewed(state, selected.clinicalCase, NOW + 86_400_000);
      state.routineArrivalSequence++;
    }
    expect(introduced).toEqual(expected);
    expect(selectRoutineClinicalCase(state, integratedPatientCases, NOW)).toBeNull();
    expect(getRoutinePatientAvailability(state, NOW, context).reason).toBe("reviews_scheduled");
  });

`+code.slice(end);
code=code.replace('it.each(["sglt2-postoperative-restart", "factor-assays-without-mixing-gate", "vte-prophylaxis-to-treatment", "dnr-versus-active-source-control"])',
  'it.each(["direct-inguinal-anatomy", "celiac-iga-deficiency", "phyllodes-benign-excision", "respiratory-acidosis", "vka-pcc-selection"])')
  .replace('`case.n1r2.${slug}.v1`','`case.n1.${slug}.v1`');
fs.writeFileSync(target,code);
console.log(target);
