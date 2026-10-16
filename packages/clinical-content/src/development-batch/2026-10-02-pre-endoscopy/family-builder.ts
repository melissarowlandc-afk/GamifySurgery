import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, source, type CaseSpec, type ChoiceSpec, type DevelopmentConcept } from "./batch-helpers";

export interface VariantChoice { id: string; label: string; rationale: string; test?: { timingProfileId: string; serviceId?: string } }
export interface VariantSpec {
  slug: string; complaint: string; presentation: string; stem: string;
  correct: VariantChoice; distractors: [VariantChoice, VariantChoice, VariantChoice];
  explanation: string; claimIds: string[]; currentUpdate?: string;
  ageYears?: readonly number[]; sexLabels?: readonly ("Female"|"Male"|"Not specified")[]; acuity?: "stable"|"urgent";
  prototypeVitalSigns?: CaseSpec["prototypeVitalSigns"];
  gate?: { id: string; serviceId: string; pendingLabel: string; resultNarrative: string; routeIds: string[] };
}
export interface ConceptSpec {
  id: string; displayName: string; learningObjective: string; stage: 0 | 1 | 2;
  educationalTier: 0 | 1; conceptType: DevelopmentConcept["conceptType"];
  evidenceClaimIds: string[]; variants: [VariantSpec, VariantSpec, VariantSpec, VariantSpec];
}
export interface ClaimSpec { id: string; statement: string; sourceIds: string[]; category: "evaluation"|"management"|"disposition"|"safety_boundary"|"presentation"; certainty?: "high"|"moderate"|"low"; limitation: string|null; population: string }
export interface SourceSpec { id: string; title: string; citation: string; organization: string; authors: string[]; year: number|null; doi?: string; pmid?: string; url: string; sourceClass: "government_guidance"|"professional_society_guideline"|"peer_reviewed_guideline"|"systematic_review"|"narrative_review"|"open_educational_resource"; licenseLabel: string; reuseStatus: "public_domain_conditions_apply"|"cc_by_4_0"|"cc_by_nc_4_0_restricted"|"copyrighted_targeted_verification_only"; authority: string; usageRole?: "evidence"|"cross_check"|"both" }
export interface FamilySpec { slug: string; label: string; concepts: [ConceptSpec, ConceptSpec]; claims: ClaimSpec[]; sources: SourceSpec[]; serviceContracts?: Array<{serviceId:string;allowedRouteIds:string[];delivery:"existing_balance_contract"|"new_external_contract_required"}>; pairing?: { indices:Array<0|1|2|3>; updates:string[] } }

const choice = (item: VariantChoice, isCorrect = false): ChoiceSpec => ({
  id: item.id, label: item.label, rationale: item.rationale, isCorrect,
  ...(item.test?.serviceId ? { serviceId: item.test.serviceId } : {}),
  timing: item.test ? { kind: "test", timingProfileId: item.test.timingProfileId } : { kind: "no_test" },
});

export function buildFamily(spec: FamilySpec) {
  const claims = spec.claims.map((item) => claim({ id:item.id, statement:item.statement, sourceIds:item.sourceIds, evidenceCategory:item.category, certainty:item.certainty??"moderate", limitation:item.limitation, applicablePopulation:item.population, lastCheckedOn:"2026-10-02" }));
  const sources = linkSourcesToClaims(spec.sources.map((item) => source({ id:item.id, title:item.title, completeCitation:item.citation, organizationOrJournal:item.organization, authors:item.authors, publicationYear:item.year, doi:item.doi??null, pmid:item.pmid??null, officialUrl:item.url, accessedOn:"2026-10-02", sourceClass:item.sourceClass, licenseLabel:item.licenseLabel, reuseStatus:item.reuseStatus, reuseNotes:"Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.", authorityAssessment:item.authority, usageRole:item.usageRole??"evidence" })), claims);
  const concepts = spec.concepts.map((item) => concept({ id:item.id, displayName:item.displayName, learningObjective:item.learningObjective, earliestFacilityStage:item.stage, educationalTier:item.educationalTier, conceptType:item.conceptType, evidenceClaimIds:item.evidenceClaimIds }));
  const node = (v: VariantSpec, conceptId: string, allowGate=false) => ({ conceptId, stem:v.stem, choices:[choice(v.correct,true),...v.distractors.map((x)=>choice(x))] as CaseSpec["nodes"][number]["choices"], explanation:v.explanation, claimIds:v.claimIds, ...(v.currentUpdate?{currentUpdate:v.currentUpdate}:{}), ...(allowGate&&v.gate?{gate:v.gate}:{}) });
  const mkCase = (id:string, v:VariantSpec, nodes:CaseSpec["nodes"], stage:0|1|2):CaseSpec => ({ id:`case.gs028c.${spec.slug}.${id}`, displayName:spec.label, chiefComplaint:v.complaint, presentation:v.presentation, ageYears:v.ageYears??[43,68], sexLabels:v.sexLabels??["Female","Male"], stage, acuity:v.acuity??"stable", ...(v.prototypeVitalSigns?{prototypeVitalSigns:v.prototypeVitalSigns}:{}), releasePointId:"release.l0.clinic_evaluation", nodes });
  const [a,b]=spec.concepts;
  const paired=new Set(spec.pairing?.indices??[]);
  const pairedCases=(spec.pairing?.indices??[]).map((index,pairIndex)=>{
    const av=a.variants[index], bv={...b.variants[index],currentUpdate:spec.pairing!.updates[pairIndex]};
    return mkCase(`paired-${av.slug}`,av,[node(av,a.id,true),node(bv,b.id)],Math.max(a.stage,b.stage) as 0|1|2);
  });
  const cases:CaseSpec[]=[...pairedCases,...a.variants.flatMap((v,i)=>paired.has(i as 0|1|2|3)?[]:[mkCase(`a-${v.slug}`,v,[node(v,a.id)],a.stage)]),...b.variants.flatMap((v,i)=>paired.has(i as 0|1|2|3)?[]:[mkCase(`b-${v.slug}`,v,[node(v,b.id)],b.stage)])];
  const built=createDevelopmentFamily({concepts,cases,sourceLabels:spec.sources.map((x)=>x.title)});
  return {...built, authoringConcepts:concepts, claims, sources, serviceContracts:spec.serviceContracts??[]};
}
