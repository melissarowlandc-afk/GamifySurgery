import '../economy-audit/source-loader.mjs';
const modules=await Promise.all(['intra-op','endoscopy','wound-ostomy','pediatric'].map(s=>import(`../../packages/clinical-content/src/question-new-n4-${s}.ts`)));
export const items=modules.flatMap(m=>Object.values(m).flat()).filter(i=>i&&typeof i==='object'&&i.slug);
