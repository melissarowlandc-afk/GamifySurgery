import fs from 'node:fs';
const b=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-bank-batch2b-before-20261104.json','utf8'));
const start=Number(process.argv[2]??1),end=Number(process.argv[3]??start+4);
for(const t of b.targets.slice(start-1,end)){
 console.log('\n'+t.id+' '+(t.flagId??'proposal '+t.originalProposalRank)+' '+t.variantId+' | '+t.conceptId);
 console.log('Complaint: '+t.cs.chiefComplaint+' | Age/sex '+JSON.stringify(t.cs.prototypeDemographics));
 console.log('Presentation: '+t.cs.presentation);if(t.node.currentUpdate)console.log('Update: '+t.node.currentUpdate);if(t.node.exhibit)console.log('Exhibit: '+JSON.stringify(t.node.exhibit));
 console.log('Task: '+t.node.stem);console.log('Options: '+t.node.answerChoices.map(c=>(c.isCorrect?'KEY ':'')+c.label).join(' | '));
 console.log('Gate: '+JSON.stringify(t.node.resultGateAfter));console.log('Claims: '+JSON.stringify(t.question?.supportingEvidenceClaimIds));
 for(const id of t.question?.supportingEvidenceClaimIds??[])console.log(id+': '+JSON.stringify(b.claims[id]));
 if(t.flagReview)console.log('Final flag review: '+JSON.stringify(t.flagReview));
}
