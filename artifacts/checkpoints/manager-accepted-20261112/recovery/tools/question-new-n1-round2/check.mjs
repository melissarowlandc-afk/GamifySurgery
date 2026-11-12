import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
const batch=await import('../../packages/clinical-content/src/question-new-n1-round2-20261104.ts');
const test=fs.readFileSync('packages/clinical-content/src/playable-patient-narrative.test.ts','utf8');
const storyLine=test.match(/const STORY_CUE\s*=\s*\/([^\n]+)\/([a-z]*);/);
if(!storyLine)throw new Error('Read the current narrative contract before adapting this check.');
const story=new RegExp(storyLine[1],storyLine[2]);
const longKeys=batch.QUESTION_NEW_N1_ROUND2_REVISED_CASES.flatMap(c=>{
  const choices=c.decisionNodes[0].answerChoices,key=choices.find(c=>c.isCorrect);
  return key.label.length>Math.max(...choices.filter(c=>!c.isCorrect).map(c=>c.label.length))?
    [{caseId:c.id,choices:choices.map(c=>({label:c.label,characters:c.label.length,key:c.isCorrect}))}]:[];
});
const stories=batch.QUESTION_NEW_N1_ROUND2_REVISED_CASES.filter(c=>!story.test(c.presentation)).map(c=>({caseId:c.id,presentation:c.presentation}));
const result={longKeys,stories};
fs.writeFileSync('.local-dev/question-new-n1-round2-20261104/content-check.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
