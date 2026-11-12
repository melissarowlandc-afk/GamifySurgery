import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase, TestedConcept } from "./schema";
import { PILONIDAL_DISEASE_SOURCES } from "./development-batch/2026-09-10/pilonidal-disease";

/** Explicit-import authoring sidecar. No registry, manifest or gameplay admission. */
export const SKIN_SOFT_TISSUE_REVIEW = {
  contentVersion: "clinical.question-topic-skin-soft-tissue-benign-infection.2026-11-11.v1",
  reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;
const R = SKIN_SOFT_TISSUE_REVIEW;
export const SKIN_SOFT_TISSUE_SLUG = "skin-soft-tissue-benign-infection";
const sid = (s: string) => `source.${SKIN_SOFT_TISSUE_SLUG}.${s}`;
const cid = (s: string) => `claim.${SKIN_SOFT_TISSUE_SLUG}.${s}`;
const newConcept = (s: string) => `concept.${SKIN_SOFT_TISSUE_SLUG}.${s}.v1`;
const current = "2026-11-11";
const targeted = "Copyright retained. Targeted professional-society factual verification only; no prose, images, tables, algorithms or excerpts reproduced. Public access is not a reusable-content or model-training licence.";
function source(suffix: string, title: string, citation: string, organization: string, authors: string[], year: number, url: string, doi: string | null, authority: string, notes: string, cc = false, government = false): ClinicalSource {
  return { ...R, id: sid(suffix), title, completeCitation: citation, organizationOrJournal: organization, authors,
    publicationYear: year, officialUrl: url, doi, pmid: null, accessedOn: current,
    sourceClass: government ? "government_guidance" : "professional_society_guideline",
    licenseLabel: cc ? "CC BY 4.0" : government ? "Public-sector conditions apply; see reuse notes" : "Copyright; targeted verification",
    reuseStatus: cc ? "cc_by_4_0" : government ? "public_domain_conditions_apply" : "copyrighted_targeted_verification_only",
    reuseNotes: notes, authorityAssessment: authority, usageRole: "both", evidenceClaimIds: [] };
}
const sourceRows: ClinicalSource[] = [
  source("wses-2022", "WSES/GAIS/WSIS/SIS-E/AAST global clinical pathways for patients with skin and soft tissue infections",
    "Sartelli M, Coccolini F, Kluger Y, et al., WSES/GAIS/WSIS/SIS-E/AAST task force. WSES/GAIS/WSIS/SIS-E/AAST global clinical pathways for patients with skin and soft tissue infections. World J Emerg Surg. 2022;17:3. doi:10.1186/s13017-022-00406-2.",
    "World Journal of Emergency Surgery / WSES, GAIS, WSIS, SIS-E, AAST", ["Massimo Sartelli", "Federico Coccolini", "Yoram Kluger", "International multi-society task force (full author list at DOI)"], 2022,
    "https://link.springer.com/article/10.1186/s13017-022-00406-2", "10.1186/s13017-022-00406-2",
    "Multi-society clinical pathways based on a non-systematic evidence review; not a new randomized trial. Direct support for drainage, source control and necrotizing-infection decisions.",
    "Article-level CC BY 4.0 verified in Rights and permissions. Attribution: Sartelli and colleagues, 2022; https://creativecommons.org/licenses/by/4.0/. Original factual synthesis and fictional applications change wording and application; no source expression or artwork retained.", true),
  source("acep-ultrasound-2020", "Abscess Evaluation", "Euerle BD. Abscess Evaluation. American College of Emergency Physicians Sonoguide. August 18, 2020. Accessed November 11, 2026.",
    "American College of Emergency Physicians", ["Brian D. Euerle"], 2020, "https://www.acep.org/sonoguide/procedures/abscess-evaluation", null,
    "Society procedural guidance; useful for equivocal superficial collections, Doppler vascular mimics and ultrasound localization. Not comparative evidence for every drainage technique.",
    targeted + " ACEP privacy/copyright notice linked from Terms of Use inspected; no explicit automated/AI prohibition found in that notice. Only targeted observations section used, no videos or procedure instructions copied."),
  source("iwgdf-infection-2023", "Guidelines on the diagnosis and treatment of foot infection in persons with diabetes (IWGDF/IDSA 2023)",
    "Senneville E, Albalawi Z, van Asten SA, Abbas ZG, Allison G, Aragon-Sanchez J, Embil JM, Lavery LA, Alhasan M, Oz O, Uckay I, Urbancic-Rovan V, Xu ZR, Peters EJG. IWGDF/IDSA guidelines on the diagnosis and treatment of diabetes-related foot infections. Clin Infect Dis. 2023;ciad527. doi:10.1093/cid/ciad527. Official IWGDF guideline PDF, 2023.",
    "International Working Group on the Diabetic Foot / Infectious Diseases Society of America", ["Eric Senneville", "Zaina Albalawi", "Suzanne A. van Asten", "Zulfiqarali G. Abbas", "Geneve Allison", "Javier Aragon-Sanchez", "John M. Embil", "Lawrence A. Lavery", "Majdi Alhasan", "Orhan Oz", "Ilker Uckay", "Vilma Urbancic-Rovan", "Zhang-Rong Xu", "Edgar J. G. Peters"], 2023,
    "https://iwgdfguidelines.org/wp-content/uploads/2023/07/IWGDF-2023-04-Infection-Guideline.pdf", "10.1093/cid/ciad527",
    "Current 2023 intersociety GRADE guideline. Diagnostic testing and medical-versus-surgical choices include conditional recommendations. One publication even when hosted on multiple sites.",
    targeted + " Official IWGDF freely offered PDF and copyright footer checked. No explicit AI restriction located on its download page/PDF. IDSA mirror was excluded after its separate Terms of Use 3.3(b) prohibited automated queries. Verification completed against the official IWGDF-hosted document. PDF summary numbering differs from body: cite named recommendations and body numbers, not a copied algorithm."),
  source("cdc-necrotizing-2025", "Clinical Guidance for Type II Necrotizing Fasciitis",
    "Centers for Disease Control and Prevention. Clinical Guidance for Type II Necrotizing Fasciitis. Group A Strep. August 5, 2025. Accessed November 11, 2026.",
    "Centers for Disease Control and Prevention", ["Centers for Disease Control and Prevention"], 2025,
    "https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/necrotizing-fasciitis.html", null,
    "Federal clinical guidance independently corroborates early surgical exploration and reassessment. Scope is type II disease; it does not establish all polymicrobial regimens.",
    "US federal guidance, public-domain conditions and excluded third-party material acknowledged. Original underlying-fact synthesis only; no photographs, marks or text reused.", false, true),
  source("hs-na-2019", "North American clinical management guidelines for hidradenitis suppurativa, Part I",
    "Alikhan A, Sayed C, Alavi A, Alhusayen R, Brassard A, Burkhart C, Crowell K, Eisen DB, Gottlieb AB, Hamzavi I, Hazen PG, Jaleel T, Kimball AB, Kirby JS, Lowes MA, Micheletti RG, Miller A, Naik HB, Orgill D, Poulin Y. North American clinical management guidelines for hidradenitis suppurativa: Part I. J Am Acad Dermatol. 2019;81(1):76-90. doi:10.1016/j.jaad.2019.02.067.",
    "US and Canadian Hidradenitis Suppurativa Foundations / Journal of the American Academy of Dermatology",
    ["Ali Alikhan", "Christopher Sayed", "Afsaneh Alavi", "Raed Alhusayen", "Alain Brassard", "Craig Burkhart", "Karen Crowell", "Daniel B. Eisen", "Alice B. Gottlieb", "Iltefat Hamzavi", "Paul G. Hazen", "Tasneem Jaleel", "Alexa B. Kimball", "Joslyn S. Kirby", "Michelle A. Lowes", "Robert G. Micheletti", "Angela Miller", "Haley B. Naik", "Dennis Orgill", "Yves Poulin"], 2019,
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC9131894/", "10.1016/j.jaad.2019.02.067",
    "Foundation guideline supports recurrence/tunnel pattern, acute drainage versus chronic deroofing/excision, and the limits of surgery. Procedural evidence is substantially uncontrolled. Not asserted to be the newest complete guideline.",
    targeted + " PMC copyright panel did not establish a CC grant. Society guideline used for targeted factual verification, not a PMC corpus. October 2026 AAD summary cross-check agrees with the limited procedural distinctions used here."),
  source("aad-hs-update-2026", "First joint guidelines of care for hidradenitis suppurativa issued by AAD and HSF",
    "American Academy of Dermatology. First joint guidelines of care for hidradenitis suppurativa issued by American Academy of Dermatology and Hidradenitis Suppurativa Foundation. October 20, 2026. Official guideline announcement. Accessed November 11, 2026.",
    "American Academy of Dermatology / Hidradenitis Suppurativa Foundation", ["American Academy of Dermatology"], 2026,
    "https://www.aad.org/news/hidradenitis-suppurativa-guidelines", null,
    "Current official guideline summary, lower-detail cross-check for procedures. Linked JAAD full guideline returned 403; no inference from inaccessible full text or drug-ranking key.",
    targeted + " AAD Terms of Use checked, including attribution, educational/noncommercial and AI-compilation restrictions. Only attributed targeted educational facts checked; no Academy content incorporated as a corpus. Full JAAD guideline excluded as inaccessible."),
  source("escp-pilonidal-2024", "European Society of Coloproctology guidelines for the management of pilonidal disease",
    "Ojo D, Gallo G, Kleijnen J, Haas S, Danys D, Dardanov D, Pellino G, Jongen J, O'Shea K, Basso L, Christou N, De Nardi P, Brown S, Senapati A. European Society of Coloproctology guidelines for the management of pilonidal disease. BJS. 2024;111(10):znae237. doi:10.1093/bjs/znae237.",
    "European Society of Coloproctology / BJS", ["Dotun Ojo", "Gaetano Gallo", "Jos Kleijnen", "Susanne Haas", "Donatas Danys", "Dragomir Dardanov", "Gianluca Pellino", "Johannes Jongen", "Kathryn O'Shea", "Luigi Basso", "Niki Christou", "Paola De Nardi", "Steven Brown", "Asha Senapati"], 2024,
    "https://www.colonproctologia.com/images/Linee_Guida_Malattia_Pilonidale.pdf", "10.1093/bjs/znae237",
    "Current society guideline directly supports acute drainage, symptom/extent-based choices, anorectal examination when needed, and off-midline closure. Many recommendations are expert opinion; no numerical outcome claims used.",
    targeted + " Public coloproctology-hosted society guideline inspected; first-page copyright reserves rights. Publisher HTML failed. No protected diagram, algorithm, table or excerpt retained; targeted facts only."),
  source("pcds-cyst-2026", "Epidermoid cyst (epithelial cyst)",
    "Cunliffe T; Primary Care Dermatology Society. Epidermoid cyst (syn. epithelial cyst; sebaceous cyst is a misnomer). Updated February 27, 2026. Accessed November 11, 2026.",
    "Primary Care Dermatology Society", ["Tim Cunliffe", "Primary Care Dermatology Society"], 2026,
    "https://www.pcds.org.uk/clinical-guidance/epidermoid-cyst", null,
    "Society practical guidance for skin-centered punctum-bearing lesions and delaying elective removal until inflammation settles. Does not establish a universal antibiotic rule.",
    targeted + " Page/site footer reviewed; no explicit AI prohibition found. Exact delay stated by this source is deliberately not authored as a universal clinical interval."),
  { ...source("pediatric-pilonidal-2021", "Principles in treating pediatric patients with pilonidal disease - An expert perspective",
    "Metzger GA, Apfeld JC, Nishimura L, Lutz C, Deans KJ, Minneci PC. Principles in treating pediatric patients with pilonidal disease - An expert perspective. Ann Med Surg (Lond). 2021;64:102233. doi:10.1016/j.amsu.2021.102233.",
    "Annals of Medicine and Surgery", ["Gregory A. Metzger", "Jordan C. Apfeld", "Leah Nishimura", "Carley Lutz", "Katherine J. Deans", "Peter C. Minneci"], 2021,
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC8040102/", "10.1016/j.amsu.2021.102233",
    "Single-center expert perspective, not comparative proof of one universal regimen. Used to document the existing adolescent conservative-care boundary and disagreement with broader symptomatic-disease guidance.",
    "Article-level CC BY 4.0 verified in copyright panel. Attribution Metzger and colleagues, 2021; https://creativecommons.org/licenses/by/4.0/. Original changed factual synthesis, no copied source text, regimen, timeline or algorithm.", true), sourceClass: "narrative_review" },
  source("nhs-lipoma", "Lipoma", "NHS. Lipoma. Undated current patient-information page. Accessed November 11, 2026. https://www.nhs.uk/conditions/lipoma/.",
    "NHS / Department of Health and Social Care", ["NHS"], 2026, "https://www.nhs.uk/conditions/lipoma/", null,
    "Government patient guidance supports basic observation versus symptom-driven removal; insufficient for sarcoma triage thresholds or surgical technique ranking.",
    "NHS terms sections 3.3-3.6 checked: OGL v3.0 except excluded material. Contains public sector information licensed under the Open Government Licence v3.0: https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/. Original modified factual synthesis; no photos, branding, protected text or NHS endorsement. Bibliographic publication year unknown; 2026 is access year only.", false, true),
  { ...PILONIDAL_DISEASE_SOURCES.find(s => s.id === "source.sc.siccr-pilonidal-2021")!, ...R,
    id: sid("siccr-2021-local"), evidenceClaimIds: [], usageRole: "cross_check",
    reuseNotes: "Reused verified local source/claim mapping from 2026-09-10; no fresh retrieval asserted. Original access date retained. Article-level CC BY 4.0 previously recorded: https://creativecommons.org/licenses/by/4.0/. Attribution Milone and colleagues, 2021; original factual synthesis, no source expression retained." },
];
// An undated government page has no invented publication year.
sourceRows.find(s => s.id === sid("nhs-lipoma"))!.publicationYear = null;
type ClaimInput = [string, string, string[], EvidenceClaim["evidenceCategory"], string];
const claimRows: ClaimInput[] = [
  ["equivocal-ultrasound", "A focal skin swelling with uncertain contents can be assessed with targeted soft-tissue ultrasound.", ["acep-ultrasound-2020"], "evaluation", "Society procedural guidance only; not a rule for deep-space or vascular lesions."],
  ["ultrasound-pocket", "A discrete superficial cavity with mobile internal echoes and no internal flow supports a cutaneous collection when anatomy and examination agree.", ["acep-ultrasound-2020"], "evaluation", "Constructed written acquisition record, not a diagnostic image or an infallible sonographic rule."],
  ["drainage", "A symptomatic accessible cutaneous pus collection generally needs incision and drainage for source control rather than aspiration or an antibiotic change as a replacement.", ["wses-2022", "acep-ultrasound-2020"], "management", "Adjunctive antibiotic selection is a separate decision; no universal no-antibiotic conclusion."],
  ["nonpurulent", "Diffuse skin infection without a collection is managed through a nonpurulent antimicrobial pathway rather than an incision into inflamed tissue.", ["wses-2022"], "management", "Single-publication limitation. A negative superficial sweep does not assess every deep compartment."],
  ["foreignbody", "Persistent infection associated with retained foreign material needs that local source addressed as part of source control.", ["wses-2022", "acep-ultrasound-2020"], "management", "No blind exploration near vessels; localization and expertise determine the safe approach."],
  ["vascular-mimic", "Flow within a cavity communicating with an artery requires vascular assessment before drainage is considered.", ["acep-ultrasound-2020"], "safety_boundary", "One targeted society source; formal arterial mapping is an author application requiring clinical review, not a claim about the exact unvisualized vessel."],
  ["dfi-clinical", "Foot-wound infection in diabetes is assessed from local or systemic inflammatory findings rather than a surface-culture result by itself.", ["iwgdf-infection-2023"], "evaluation", "Single current intersociety publication. Neuropathy, PAD and immune dysfunction may attenuate findings."],
  ["dfi-uninfected", "Antibiotics are not indicated for a clinically uninfected diabetic foot ulcer merely to prevent infection or accelerate closure.", ["iwgdf-infection-2023"], "management", "Single current intersociety publication; a positive culture is not proof of invasive infection."],
  ["dfi-deep", "A deep abscess, gangrene or severe ischemia in an infected diabetic foot warrants urgent surgical-capable assessment despite reassuring surface changes.", ["iwgdf-infection-2023"], "disposition", "Single current intersociety publication. This sidecar reviews outside hospital care from clinic; no onsite inpatient service."],
  ["dfi-tissue", "An aseptically collected tissue specimen is preferred to a superficial swab when culturing a suspected diabetic foot soft-tissue infection.", ["iwgdf-infection-2023"], "evaluation", "Conditional recommendation; some uncomplicated cases may be treated empirically. Sampling must not delay urgent source control."],
  ["dfi-initial-bone", "Initial evaluation of possible diabetic foot osteomyelitis integrates probe-to-bone examination, plain radiographs and inflammatory biomarkers.", ["iwgdf-infection-2023"], "evaluation", "None of these tests alone reliably resolves every case; no invented cutoff used."],
  ["dfi-mri", "MRI is recommended when diabetic foot osteomyelitis remains uncertain after clinical assessment, radiographs and laboratory studies.", ["iwgdf-infection-2023"], "evaluation", "Single current intersociety publication; MRI contraindication or availability could change the offered comparison."],
  ["dfi-bone-culture", "When a microbiological diagnosis of suspected diabetic foot osteomyelitis is needed, aseptic bone sampling is preferred to a soft-tissue or surface specimen.", ["iwgdf-infection-2023"], "evaluation", "Conditional recommendation; exact antibiotic-free interval remains debated and is withheld."],
  ["dfi-medical", "Antibiotic treatment without bone surgery may be considered for selected forefoot osteomyelitis without PAD, exposed bone or a need for immediate drainage.", ["iwgdf-infection-2023"], "management", "Conditional low-certainty evidence. An available option, not a proven superiority claim or a mandate against surgery."],
  ["dfi-pad", "An infected diabetic foot wound with PAD warrants urgent surgical and vascular consultation to coordinate drainage and perfusion care.", ["iwgdf-infection-2023"], "management", "Single intersociety publication; does not prescribe a universal drainage-before-revascularization order."],
  ["dfi-mri-limit", "Marrow edema from neuropathic arthropathy or previous trauma/surgery can reduce MRI specificity for foot osteomyelitis.", ["iwgdf-infection-2023"], "evaluation", "MRI findings require their anatomic/clinical context; bone culture may be appropriate when the distinction changes prolonged treatment."],
  ["necrotizing", "Rapid progression and deep pain can warrant urgent exploration for suspected necrotizing infection even without gas, hypotension or a high laboratory risk score.", ["wses-2022", "cdc-necrotizing-2025"], "safety_boundary", "CDC corroboration concerns type II disease. No risk-score calculation or exact delay threshold is authored."],
  ["necrotizing-control", "Necrotizing infection requires removal of nonviable tissue; the extent follows tissue involvement, with viable tissue preserved where feasible.", ["wses-2022", "cdc-necrotizing-2025"], "management", "Operative judgment and reassessment remain essential; no simplistic skin-sparing mandate."],
  ["necrotizing-relook", "After initial necrotizing-infection debridement, worsening local findings require reassessment for additional operative source control rather than automatic definitive closure.", ["wses-2022", "cdc-necrotizing-2025"], "management", "No exact return-to-OR interval or antibiotic stopping rule is authored."],
  ["hs-pattern", "Recurrent nodules, scars and communicating openings in intertriginous sites support chronic hidradenitis rather than repeated unrelated abscesses.", ["hs-na-2019"], "evaluation", "Clinical pattern, not microbiological proof; no demographic selection weights."],
  ["hs-tunnels", "Recurrent HS tunnels can be treated with deroofing or excision; drainage of an acute collection does not remove chronic tunnels.", ["hs-na-2019", "aad-hs-update-2026"], "management", "Low-quality procedural evidence; does not rank deroofing against every reasonable limited excision."],
  ["hs-extent", "Extensive chronic HS may require regional excision, while treatment elsewhere remains necessary because local surgery does not eliminate the underlying disease.", ["hs-na-2019", "aad-hs-update-2026"], "management", "Reconstruction and exact drug choice are outside the scored scope. Current full JAAD guideline inaccessible."],
  ["hs-acute", "A painful fluctuant HS collection can require acute drainage, with subsequent chronic-disease management addressed separately.", ["hs-na-2019", "aad-hs-update-2026"], "management", "No claim that incision and drainage is preferred to deroofing for every acute lesion."],
  ["pilonidal-pattern", "Natal-cleft pits and recurrent drainage suggest pilonidal disease, but a lesion near the anal canal may need anorectal examination before assigning its source.", ["escp-pilonidal-2024", "siccr-2021-local"], "evaluation", "The new low-opening item scores source assessment, not fistula treatment; anorectal companion belongs to its primary topic."],
  ["pilonidal-acute", "An acute pilonidal abscess is initially drained; definitive chronic-disease treatment is considered after the acute episode.", ["escp-pilonidal-2024"], "management", "Society recommendation substantially expert opinion. No universal definitive operation or interval."],
  ["pilonidal-extent", "Pilonidal management depends on current symptoms, recurrence and extent; asymptomatic pits do not call for prophylactic surgery.", ["escp-pilonidal-2024", "siccr-2021-local"], "management", "Do not infer that symptomatic disease should always receive indefinite conservative care."],
  ["pilonidal-closure", "When excisional pilonidal surgery is chosen, off-midline closure is favored over primary midline closure; no single off-midline flap is established as universally best.", ["escp-pilonidal-2024", "siccr-2021-local"], "management", "Open healing can be reasonable. Patient burden and prior treatment distinguish the compared plans."],
  ["pilonidal-pediatric-boundary", "A pediatric expert perspective describes an initial nonoperative trial for selected adolescents with limited chronic pilonidal symptoms.", ["pediatric-pilonidal-2021"], "management", "Single-center expert practice. Current ESCP guidance advises considering definitive treatment for symptomatic disease. Do not score a universal conservative-first or operation-first claim until Melissa resolves the intended population and treatment-history boundary."],
  ["cyst-pattern", "A slow-growing skin-centered nodule with a punctum can represent an epidermoid cyst; elective removal is easier after inflammation has settled.", ["pcds-cyst-2026"], "evaluation", "One society guidance source; no histological certainty from appearance or universal antibiotic/exact delay rule."],
  ["cyst-stages", "A symptomatic cyst may need treatment of an acute collection before elective removal of a persistent lesion after inflammation resolves.", ["pcds-cyst-2026", "wses-2022"], "management", "Original application of cyst and source-control guidance; exact procedure and pathology handling need clinician review."],
  ["lipoma", "A clinically concordant superficial lipoma can be observed when asymptomatic; symptoms or growth can justify reassessment and possible removal.", ["nhs-lipoma"], "management", "Single lower-detail government patient source. New deep, fixed or discordant masses go to the sarcoma topic; no size cutoff or benign-MRI rule asserted."],
];
export const SKIN_SOFT_TISSUE_ROUND1_CLAIMS: EvidenceClaim[] = claimRows.map(([id, statement, sources, evidenceCategory, limitation]) => ({ ...R,
  id: cid(id), statement, sourceIds: sources.map(sid), evidenceCategory, certainty: "moderate", limitation,
  applicablePopulation: "Patients represented by the explicitly constrained fictional clinic or outside-record-review cases in this sidecar.", lastCheckedOn: current }));
export const SKIN_SOFT_TISSUE_ROUND1_SOURCES: ClinicalSource[] = sourceRows.map(s => ({ ...s,
  evidenceClaimIds: SKIN_SOFT_TISSUE_ROUND1_CLAIMS.filter(c => c.sourceIds.includes(s.id)).map(c => c.id) }));

interface ChoiceSpec { label: string; rationale: string; counterfactual: string; timingProfileId?: string; }
interface NodeSpec {
  slug: string; conceptId: string; previousConceptIds?: string[]; objective: string; task: string;
  update?: string; choices: [ChoiceSpec, ChoiceSpec, ChoiceSpec] | [ChoiceSpec, ChoiceSpec, ChoiceSpec, ChoiceSpec]; claims: string[];
  steps: [string, string]; cueAttack: string; deletion: string; difficulty: string; boundary: string;
  beforeVariantIds: string[]; role: "rewrite" | "replacement" | "gap";
}
interface CaseSpec {
  slug: string; name: string; age: number; sex: "Female" | "Male"; complaint: string; presentation: string;
  chartReview?: boolean; pediatric?: boolean; nodes: NodeSpec[];
}
const choice = (label: string, rationale: string, counterfactual: string, timingProfileId?: string): ChoiceSpec =>
  ({ label, rationale, counterfactual, ...(timingProfileId ? { timingProfileId } : {}) });
const U = "timing.test.ultrasound", M = "timing.test.mri", X = "timing.test.radiography", T = "timing.test.ct", P = "timing.test.clinical_procedure";
const qid = (s: string) => `question.${SKIN_SOFT_TISSUE_SLUG}.${s}.20261111.v1`;
const conceptIds = {
  ultrasound: "concept.cutaneous-abscess.equivocal-ultrasound", drainage: "concept.cutaneous-abscess.incision-drainage",
  uninfected: "concept.diabetic-foot-ulcer.no-antibiotics-without-infection",
  hsPlanning: "concept.hidradenitis-suppurativa.multimodal-specialist-planning",
  closure: "concept.pilonidal-disease.off-midline-closure-planning",
} as const;

const candidateCaseSpecs: CaseSpec[] = [
  { slug: "forearm-course", name: "Maya Turner", age: 39, sex: "Female", complaint: "Forearm swelling",
    presentation: "Maya Turner, a 39-year-old woman, returns to clinic after treatment for forearm redness. The red area has receded, but a rounded firm swelling remains and focal tenderness now limits wrist movement. The skin is intact, with no visible drainage. She is afebrile and the tenderness remains localized.",
    nodes: [
      { slug: "abscess-workup", conceptId: conceptIds.ultrasound, objective: "Select the study that resolves a focal source despite improvement in surrounding inflammation.",
        task: "Which investigation should be requested next for Maya Turner's persistent forearm finding?",
        choices: [choice("Regional soft-tissue ultrasonography", "The focal symptom and uncertain contents require localization of a residual collection, rather than assuming the receding skin border establishes source control.", "Diffuse resolving tenderness without a residual focal finding would weaken the need for imaging.", U),
          choice("Forearm magnetic resonance imaging", "Persistent pain makes deeper infection tempting, but this examination localizes the problem to a superficial focal lesion without a demonstrated deep-space problem.", "A suspected deep compartment or bone process unresolved by initial assessment could justify MRI.", M),
          choice("Forearm plain radiography", "Radiographs can assess radiopaque foreign material or bone, but do not best resolve the contents of this focal superficial swelling.", "A penetrating mechanism with suspected radiopaque material would make radiographs useful.", X)],
        claims: ["equivocal-ultrasound"], steps: ["Separate improvement in surrounding erythema from persistence of a focal source.", "Choose a superficial-content study rather than a deeper or bone-focused study."],
        cueAttack: "Removed the original phrase 'cannot distinguish cellulitis from abscess'; no test is named in presentation or task. All options are regional imaging, including timed distractors.",
        deletion: "Removing the persistent focal limitation leaves only improving redness and removes the reason to investigate. Afebrile/localized findings bound the outpatient phase.",
        difficulty: "Moderate prediction: a resident may overvalue improving skin redness or escalate directly to MRI for persisting pain.", boundary: "If pain localizes deep to fascia or bone, MRI gains priority; if the focal lesion resolves, routine imaging loses its purpose.",
        beforeVariantIds: ["question.cutaneous-abscess.equivocal-ultrasound.v1", "question.cutaneous-abscess.equivocal-ultrasound.v3"], role: "rewrite" },
      { slug: "abscess-drainage", conceptId: conceptIds.drainage, objective: "Choose source control for a residual superficial collection after a partial clinical response.",
        update: "The forearm study shows a subcutaneous cavity with mobile internal debris, no internal flow, and separation from vessels and fascia. The skin redness continues to recede, but pressure over the cavity reproduces Maya's limiting pain.",
        task: "Which procedure should be selected for Maya Turner's remaining forearm lesion?",
        choices: [choice("Incision and drainage", "A symptomatic residual superficial collection needs evacuation. Improvement of the surrounding inflammatory process does not establish that the cavity has emptied.", "If the study showed diffuse edema without a cavity, an incision would lack a source-control target."),
          choice("Ultrasound-guided needle aspiration", "Aspiration is a credible less invasive source-control proposal, but is less dependable than incision and drainage for the offered superficial cutaneous pus cavity.", "A noncutaneous collection in an anatomy suitable for image-guided drainage would change this comparison.", P),
          choice("Complete cutaneous-lesion excision", "Excision is tempting for a persisting lump, but this record establishes an acute collection rather than a quiet encapsulated lesion requiring elective removal.", "A persistent symptomatic epidermoid lesion after inflammation settles could support elective excision.")],
        claims: ["ultrasound-pocket", "drainage", "cyst-stages"], steps: ["Interpret the cavity separately from improving surrounding skin.", "Select an effective procedure for this superficial source and care phase."],
        cueAttack: "Replaced 'large enough to drain' with observed contents and anatomy. All three choices are actual procedures; aspiration has its own wait proposal.",
        deletion: "Without the new cavity/anatomy record, the prior question does not establish a drainable target. Earlier feedback names imaging purpose but not this procedural ranking.",
        difficulty: "Moderate: aspiration is a plausible competitor and the response trajectory can falsely suggest completed source control.", boundary: "No separate cavity changes the key to continued nonpurulent management rather than any offered drainage procedure; re-solve rather than force a key.",
        beforeVariantIds: ["question.cutaneous-abscess.incision-drainage.v1", "question.cutaneous-abscess.incision-drainage.v3"], role: "rewrite" },
    ] },
  { slug: "recurrent-back", name: "Daniel Price", age: 48, sex: "Male", complaint: "Recurrent back swelling",
    presentation: "Daniel Price, a 48-year-old man, returns to clinic after a second drainage at the same upper-back site. The opening has closed, but a tender focus persists. His first episode followed a splinter injury. Examination finds a firm subcutaneous focus under intact skin; surrounding redness has diminished.",
    nodes: [
      { slug: "recurrence-workup", conceptId: conceptIds.ultrasound, objective: "Localize residual fluid or a local nidus in a recurrent superficial lesion.",
        task: "Which investigation should be selected for Daniel Price's recurrent upper-back focus?",
        choices: [choice("Regional soft-tissue ultrasonography", "A recurrent focal lesion after a penetrating event warrants a local anatomical assessment for fluid and retained material.", "A new deep fixed mass with discordant findings requires a different mass-assessment pathway.", U),
          choice("Contrast-enhanced chest CT", "CT tempts a broad search after repeated failure, but the current problem remains a localized superficial focus.", "Suspected deep thoracic extension would change the anatomical study needed.", T),
          choice("Thoracic spine radiographs", "The injury history makes foreign material relevant, but a superficial soft-tissue sweep is better directed at this lesion than spine imaging.", "Focal vertebral findings would create a bone-focused question.", X)],
        claims: ["equivocal-ultrasound", "foreignbody"], steps: ["Recognize same-site recurrence as a reason to reassess local anatomy.", "Choose the study that interrogates that superficial source."],
        cueAttack: "The splinter mechanism is decision-critical rather than an unsupported list of organism risks. The key is not uniquely described as 'targeted' in its rationale before answering.",
        deletion: "Remove recurrence or the penetrating history and the local-nidus inference weakens; remove uncertain examination and ultrasound may no longer be needed.",
        difficulty: "Moderate prediction: repeated treatment failure can provoke an unnecessarily deep scan or an assumption of resistant bacteria.", boundary: "Deep fixation, spine findings or systemic deterioration would invalidate this superficial comparison.",
        beforeVariantIds: ["question.cutaneous-abscess.equivocal-ultrasound.v2", "question.cutaneous-abscess.equivocal-ultrasound.v4"], role: "rewrite" },
      { slug: "foreignbody-source-control", conceptId: newConcept("local-nidus-control"), objective: "Address a demonstrated retained nidus rather than repeat incomplete source control.",
        update: "Ultrasound records a linear echogenic structure with acoustic shadowing inside a small subcutaneous cavity, aligned with Daniel's old puncture tract. It is separate from deeper fascia and vessels. Tenderness persists despite the reduction in surrounding redness.",
        task: "Which procedural plan should be selected for Daniel Price's recurrent back lesion?",
        choices: [choice("Localized exploration with foreign-material removal", "The retained local nidus accounts for recurrence; drainage that leaves it behind may be incomplete source control.", "Without retained material, ordinary cavity drainage could be sufficient."),
          choice("Repeat cavity drainage with drain placement", "Recurrent fluid makes drainage attractive, but a drain does not address the demonstrated retained fragment.", "A persistent cavity without retained material could be managed with an appropriate drainage plan."),
          choice("Excision of overlying skin and subcutis", "Repeated recurrence may prompt skin excision, but the current mapped target is the retained subcutaneous nidus rather than an established field of diseased skin.", "An established symptomatic cutaneous cyst or extensive chronic skin disease could justify lesion excision.")],
        claims: ["foreignbody", "ultrasound-pocket"], steps: ["Relate same-site recurrence to the demonstrated fragment.", "Choose source control that removes that nidus."],
        cueAttack: "All plans intervene on the same site; no 'antibiotics alone' foil. Fragment appears only after the investigation, and the first feedback does not prescribe extraction.",
        deletion: "Delete the fragment finding and routine drainage becomes a credible leading plan. Anatomical separation limits the intended minor-procedure scope.",
        difficulty: "Moderate: a resident may repeat the prior drainage approach despite evidence explaining its failure.", boundary: "A fragment near major vessels would require specialist planning rather than this local exploration.", beforeVariantIds: [], role: "gap" },
    ] },
  { slug: "thigh-followup", name: "Lena Brooks", age: 45, sex: "Female", complaint: "Thigh redness",
    presentation: "Lena Brooks, a 45-year-old woman, attends clinic with painful thigh redness after a skin abrasion. The area is warm and firm. A focused ultrasound sweep across the tender region shows edema between fat lobules but no separate cavity. Tenderness and redness remain superficial, and she has no systemic symptoms.",
    nodes: [
      { slug: "cellulitis-plan", conceptId: "concept.abscess.collection-vs-cellulitis", objective: "Use a nonpurulent pathway when the mapped symptomatic tissue lacks a drainage target.",
        task: "Which treatment should be selected for Lena Brooks's current thigh findings?",
        choices: [choice("Begin a nonpurulent-cellulitis antimicrobial course", "The superficial inflammatory findings and scanned tissue support a nonpurulent pathway; the scan supplies no cavity to evacuate.", "A focal cavity at the symptomatic site would add a drainage requirement."),
          choice("Perform incision and drainage of the thigh", "Painful induration can be mistaken for an abscess, but the mapped area contains no discrete fluid target.", "A newly demonstrated symptomatic cavity would justify drainage."),
          choice("Arrange operative fascial exploration", "Severe pain can provoke concern for deep infection, but this record has localized superficial findings without the progressive deep pattern needed to justify exploration.", "Pain extending beyond the skin changes with rapid progression would change urgency and the key.")],
        claims: ["nonpurulent", "necrotizing"], steps: ["Interpret the mapped edema as lacking a focal source.", "Select the appropriate treatment pathway while maintaining a deep-infection boundary."],
        cueAttack: "Repaired the old caricatures ('every red area', 'no further assessment'). All choices now name actual treatment pathways; necessary depth and progression findings remain.",
        deletion: "Delete the scan and the drainage target is unresolved; delete the superficial stable course and the exploration option cannot be fairly ranked.",
        difficulty: "Moderate prediction with a partial recognition component: the challenge is not equating tenderness with pus while respecting the limitations of a superficial sweep.", boundary: "A cavity changes the procedural choice; rapidly progressive deep pain changes the hospital escalation decision.",
        beforeVariantIds: ["question.abscess.collection-vs-cellulitis.v2"], role: "rewrite" },
      { slug: "residual-collection", conceptId: conceptIds.drainage, objective: "Reassess a changed focal finding rather than treat a prior negative scan as permanent.",
        update: "At a later reassessment, Lena's diffuse redness is smaller, but a new soft center releases opaque material. Repeat ultrasound at that center shows a superficial debris-containing cavity. The prior sweep had shown edema at this same site.",
        task: "Which procedure should be selected for Lena Brooks's new focal thigh finding?",
        choices: [choice("Incision and drainage of the cavity", "The new findings establish a changed source-control problem; the earlier negative study does not negate a later collection.", "If the repeat scan again showed edema without a cavity, drainage would lose its target."),
          choice("Ultrasound-guided aspiration of the cavity", "Aspiration may seem sufficient for a newly formed small pocket, but incision and drainage is the preferred offered cutaneous source-control procedure.", "A collection in another tissue compartment suitable for percutaneous management could change the comparison.", P),
          choice("Excision of the overlying skin and subcutis", "A changing lump can suggest an excision problem, but the record identifies a cutaneous collection rather than a chronic encapsulated lesion.", "A persistent quiet symptomatic cyst after the episode could justify elective lesion removal.")],
        claims: ["drainage", "ultrasound-pocket", "cyst-stages"], steps: ["Recognize that current findings supersede the earlier no-pocket examination.", "Choose the procedure suited to the current superficial source."],
        cueAttack: "The earlier explanation does not predict a later cavity. Replaced generic supportive-care foils with actual procedures and recorded aspiration timing.",
        deletion: "The new update is essential: remove it and the preceding nonpurulent decision still applies.", difficulty: "Moderate: temporal anchoring on a negative study competes with interpreting the current source.",
        boundary: "An unchanged negative examination would retain the nonpurulent pathway; deep extension would require a different procedural setting.",
        beforeVariantIds: ["question.cutaneous-abscess.incision-drainage.v2", "question.cutaneous-abscess.incision-drainage.v4"], role: "rewrite" },
    ] },
  { slug: "deep-foot-chart", name: "Marcus Reed", age: 62, sex: "Male", complaint: "Foot admission review", chartReview: true,
    presentation: "Marcus Reed, a 62-year-old man, attends clinic after a foot-infection admission. The founder reviews the referring hospital's initial records. Oral treatment had reduced the visible redness around a plantar ulcer, but drainage and difficulty bearing weight increased. Imaging described a cavity beneath the plantar fascia extending between flexor tendons; the surface swab was susceptible to the oral drug. He was afebrile with palpable pedal pulses.",
    nodes: [
      { slug: "foot-deep-setting", conceptId: "concept.n3.foot-culture-versus-clinical-infection.v2", objective: "Select hospital surgical-capable care from deep anatomy despite a partial surface response.",
        task: "At the recorded presentation, which initial care plan should Marcus Reed's team have selected for the foot findings?",
        choices: [choice("Hospital drainage/debridement and systemic antimicrobials", "The deep plantar cavity and impaired function require source-control assessment in a hospital-capable setting; improving skin redness does not establish that source control is complete.", "A superficial improving infection without a deep cavity or important morbidity could permit outpatient treatment."),
          choice("Ambulatory drainage/debridement and systemic antimicrobials", "This plan addresses a collection, but the cavity's deep plantar and tendon anatomy exceeds the clinic's minor-procedure scope.", "An accessible cutaneous cavity separated from fascia and tendons could fit an appropriately equipped ambulatory setting."),
          choice("Hospital serial examination and systemic antimicrobials", "The setting acknowledges morbidity, but observing the response to an active drug does not evacuate the demonstrated deep source.", "An infection requiring inpatient medical care but lacking a drainable or necrotic source could fit this plan."),
          choice("Ambulatory serial examination and systemic antimicrobials", "Susceptibility and a receding skin border make medical continuation tempting, but do not resolve the deep source or its setting requirement.", "A stable superficial infection responding to treatment without a deep collection could fit ambulatory medical follow-up.")],
        claims: ["dfi-deep", "dfi-clinical"], steps: ["Weight deep anatomy and function more than superficial response/culture susceptibility.", "Select a setting capable of the required source control."],
        cueAttack: "Rebuilt N3r2's rejected generic setting choices as a balanced 2-by-2 set: hospital/ambulatory crossed with drainage/serial examination, antimicrobials shared. Each component occurs twice, so majority convergence cannot assemble the key. No untreated-ulcer foil; afebrile/pulses remain competing evidence.",
        deletion: "Without the deep-cavity record the outpatient alternative becomes credible. The clinic frame is present-day review, not inpatient runtime placement.",
        difficulty: "Moderate-to-hard: a resident may anchor on susceptible culture, preserved pulses or visible improvement.", boundary: "A cavity confined above fascia with good outpatient response would change the setting comparison.",
        beforeVariantIds: ["question.n3.foot-culture-versus-clinical-infection.v2"], role: "rewrite" },
      { slug: "foot-tissue-specimen", conceptId: newConcept("infected-foot-tissue-sampling"), objective: "Choose a representative soft-tissue culture specimen during source control.",
        update: "The outside team drained Marcus's deep cavity. At the operation the collection lay between soft-tissue planes, without visible bone involvement. A prior swab was taken from fluid on the external dressing. The present decision is the specimen for soft-tissue pathogen identification; bone involvement has not been demonstrated.",
        task: "Which specimen should Marcus Reed's hospital team collect to identify the pathogens in the drained infection?",
        choices: [choice("Aseptic tissue specimen from the operative site", "A tissue specimen samples the infected site more representatively than organisms on an external dressing or surface.", "If bone infection were the question, an aseptically obtained bone specimen would be the relevant target.", P),
          choice("Swab from the draining skin opening", "It is easy to obtain and may grow a pathogen, but surface contamination can misdirect treatment relative to an aseptic tissue sample.", "When tissue sampling is impractical a carefully collected appropriate specimen may still inform care; it is not the preferred offered target here.", P),
          choice("Aseptic bone specimen from the adjacent foot", "A deep diabetic-foot infection can raise concern for bone disease, but the current sampling question concerns the drained soft-tissue cavity and has not established bone involvement.", "Suspected osteomyelitis requiring bone-pathogen identification would make aseptic bone sampling appropriate.", P)],
        claims: ["dfi-tissue", "dfi-bone-culture"], steps: ["Identify which tissue compartment the microbiological question concerns.", "Select a specimen representing that infected compartment rather than its surface drainage."],
        cueAttack: "All options are actual specimen sources with equal placeholder procedure metadata. Removed a 'gold-standard' task cue and did not introduce bone as an unsupported obvious foil.",
        deletion: "Specimen provenance is essential: deleting the dressing origin erases the source-quality distinction. Prior setting feedback does not name this specimen.",
        difficulty: "Moderate: readily available drainage tempts a sampling shortcut after appropriate source control.", boundary: "Changing the target to suspected bone infection changes the preferred specimen compartment.",
        beforeVariantIds: [], role: "gap" },
    ] },
  { slug: "bone-workup", name: "Grace Allen", age: 66, sex: "Female", complaint: "Persistent toe ulcer",
    presentation: "Grace Allen, a 66-year-old woman with diabetes, attends clinic for a persistent toe ulcer. The foot team records a deep tract whose base cannot be confidently characterized with probing. Radiographs show no definite cortical destruction, and inflammatory markers are mildly elevated. The surrounding infection has improved, but the tract persists.",
    nodes: [
      { slug: "foot-mri", conceptId: newConcept("foot-bone-imaging"), objective: "Choose advanced imaging when initial studies leave bone involvement uncertain.", task: "Which investigation should be requested next to assess bone involvement beneath Grace Allen's toe ulcer?",
        choices: [choice("Magnetic resonance imaging of the foot", "The initial clinical, radiographic and laboratory assessment leaves a consequential residual uncertainty about bone and adjacent soft tissue.", "A diagnostic initial workup that already resolved the bone question could make advanced imaging unnecessary.", M),
          choice("Surface swab culture of the ulcer", "Persistent drainage makes another culture tempting, but a surface sample cannot resolve the anatomical bone question.", "A clinically infected wound needing pathogen identification presents a different specimen decision.", P),
          choice("Plain radiography of the involved foot", "Early bone changes can be missed and interval films can help, but the current unresolved tract question warrants the offered recommended advanced study.", "When serial radiographs will resolve a stable question or MRI is unsuitable, the next study must be reconsidered.", X)],
        claims: ["dfi-initial-bone", "dfi-mri", "dfi-clinical"], steps: ["Recognize that initial studies have not excluded bone involvement.", "Choose imaging that addresses the remaining bone/soft-tissue uncertainty."],
        cueAttack: "No 'most sensitive' or 'gold standard' phrase. Repeat radiographs remain a plausible staging error rather than an absurd test; all testing choices carry waits.",
        deletion: "The prior studies establish the care phase; delete them and initial radiographs/probing would be reasonable before advanced imaging.", difficulty: "Moderate: a normal-appearing initial film can be over-read as exclusion, or superficial cultures substituted for anatomy.",
        boundary: "If the initial workup already resolved bone involvement, MRI is no longer the same next decision.", beforeVariantIds: [], role: "gap" },
      { slug: "foot-bone-specimen", conceptId: newConcept("foot-bone-pathogen-sampling"), objective: "Obtain a specimen representing bone when the treatment question is bone-pathogen identification.",
        update: "MRI shows an ulcer tract reaching abnormal distal-phalanx marrow. Grace is stable while the foot team plans treatment. The external swab grew several organisms; the team is selecting a specimen before choosing prolonged therapy.",
        task: "Which specimen should be requested to guide Grace Allen's planned treatment?",
        choices: [choice("Bone obtained aseptically through intact skin", "An aseptic bone specimen directly samples the compartment of concern and limits surface contamination.", "When the question concerns soft-tissue infection without bone involvement, representative tissue is the appropriate target.", P),
          choice("Soft tissue curetted from the ulcer base", "This is better than a superficial swab for soft-tissue infection, but it does not necessarily identify the organism in bone.", "If only soft-tissue infection were suspected, aseptic tissue sampling could be the preferred specimen.", P),
          choice("Drainage swabbed from the ulcer surface", "The sample is convenient and may produce susceptibilities, but those organisms may not represent the bone infection.", "A surface specimen has limited contextual uses when better sampling is impossible; it does not become an equivalent bone specimen.", P)],
        claims: ["dfi-bone-culture", "dfi-tissue"], steps: ["Separate an imaging concern for bone infection from the need to identify its organism.", "Choose tissue provenance that answers the actual microbiological question."],
        cueAttack: "All labels identify specimens; the key's aseptic route is a necessary acquisition fact. No rule about a precise antibiotic-free interval is implied.",
        deletion: "Delete the bone-target question and the tissue-curettage alternative becomes plausible. The prior MRI explanation does not name the sampling route.", difficulty: "Moderate: misapplying the correct soft-tissue sampling rule to a different compartment is the closest error.",
        boundary: "A soft-tissue-only infection changes the appropriate compartment from bone to tissue.", beforeVariantIds: [], role: "gap" },
    ] },
  { slug: "ischemic-foot-chart", name: "Victor Lee", age: 68, sex: "Male", complaint: "Foot salvage review", chartReview: true,
    presentation: "Victor Lee, a 68-year-old man, visits clinic after hospital treatment of a foot wound. The founder reviews his presentation records: a draining ulcer, black toe tissue, spreading warmth and a deep cavity. Pedal Doppler waveforms were monophasic and toe pressure was reported as severely reduced. He was alert and his blood pressure was maintained.",
    nodes: [
      { slug: "foot-infection-pad", conceptId: newConcept("infected-foot-perfusion-coordination"), objective: "Coordinate infected-foot source control with vascular assessment rather than serial isolated care.",
        task: "Which consultation plan should Victor Lee's hospital team have initiated at that presentation?",
        choices: [choice("Urgent surgical and vascular assessment", "The infected deep focus and poor perfusion create interdependent drainage and limb-perfusion decisions requiring coordinated assessment.", "A clinically uninfected ischemic wound would not create the same urgent infected-source consultation question."),
          choice("Scheduled vascular assessment after wound closure", "Poor healing can prompt a later vascular review, but postponing perfusion assessment ignores its current relevance to the infected wound.", "An otherwise resolved wound with a separate stable vascular complaint could be assessed electively."),
          choice("Outpatient ulcer-team assessment after oral treatment", "Preserved alertness and pressure can falsely reassure, but do not erase deep infection, tissue loss and impaired perfusion.", "A superficial infection with adequate perfusion and a favorable response could support outpatient foot-team care.")],
        claims: ["dfi-pad", "dfi-deep"], steps: ["Identify simultaneous source-control and perfusion problems.", "Select a coordinated urgent consultation plan rather than a fixed procedure order."],
        cueAttack: "Removed an exact toe-pressure threshold and any claim that one sequence is universally required. The combined key reflects two observed problems, not a generic 'comprehensive care' label.",
        deletion: "Without either the deep infection or impaired perfusion record the dual consultation rationale changes. Maintained pressure deliberately preserves the credible under-triage error.",
        difficulty: "Moderate-to-hard: a resident may wait for shock or focus on one specialty before recognizing the interdependence.", boundary: "Remove the infection and the urgent drainage coordination no longer follows; restore perfusion and vascular reconstruction is not presumed.",
        beforeVariantIds: ["question.diabetic-foot-infection.clinical-recognition.v4"], role: "replacement", previousConceptIds: ["concept.diabetic-foot-infection.clinical-recognition"] },
    ] },
  { slug: "neuropathic-foot", name: "Iris Morgan", age: 64, sex: "Female", complaint: "Foot scan review",
    presentation: "Iris Morgan, a 64-year-old woman with diabetes and established neuropathic midfoot collapse, attends clinic. A persistent plantar ulcer overlies the deformity. The MRI report describes marrow edema at several collapsed joints and states that superimposed infection cannot be resolved. A surface swab grows mixed organisms. She is stable; the result would determine whether prolonged bone-directed treatment is started.",
    nodes: [
      { slug: "foot-charcot-uncertainty", conceptId: newConcept("foot-bone-pathogen-sampling"), objective: "Resolve a bone-pathogen question when MRI has a relevant specificity limitation.",
        task: "Which specimen should Iris Morgan's foot team select to resolve the diagnosis before prolonged treatment?",
        choices: [choice("Aseptic bone specimen from the involved midfoot", "Neuropathic remodeling limits MRI specificity; a representative bone specimen can answer the consequential infection/pathogen question more directly than the surface culture.", "A clinically resolved bone question would remove the reason for this invasive sampling.", P),
          choice("Swab of the plantar ulcer surface", "Repeated recovery of similar organisms may seem confirmatory, but does not establish that those organisms infect the abnormal bone.", "A separate superficial microbiological question might use surface information when better sampling is unavailable.", P),
          choice("Curettage specimen from the ulcer margin", "Tissue is preferable to a swab for soft-tissue infection, but this sampled compartment would not necessarily resolve the bone question.", "A soft-tissue-only infection requiring a representative culture would make aseptic tissue collection appropriate.", P)],
        claims: ["dfi-mri-limit", "dfi-bone-culture", "dfi-tissue"], steps: ["Recognize a noninfectious reason for the MRI abnormality without declaring infection absent.", "Select the sample that can change the proposed prolonged bone treatment."],
        cueAttack: "No author-supplied 'MRI proves osteomyelitis' conclusion. Options compare specimens; equal procedure waits prevent a preview cue.",
        deletion: "Remove neuropathic remodeling and the explicit imaging uncertainty, and the evidence-status problem changes. Remove the treatment consequence and sampling becomes an inconsequential label exercise.",
        difficulty: "Hard prediction: accepting an abnormal MRI or mixed surface flora as definitive bone infection competes with recognizing their limits.", boundary: "If the question concerns soft-tissue pathogens rather than bone, representative tissue becomes the relevant target.", beforeVariantIds: [], role: "gap" },
    ] },
  { slug: "progressive-thigh-chart", name: "Caleb Stone", age: 52, sex: "Male", complaint: "Hospital infection review", chartReview: true,
    presentation: "Caleb Stone, a 52-year-old man, attends clinic after a thigh-infection admission. The founder reviews the outside hospital's initial record: pain and firm swelling extended beyond a modest area of redness and progressed during antibiotic treatment. CT showed fascial fluid but no gas. The recorded laboratory risk score was low, and his blood pressure was maintained.",
    nodes: [
      { slug: "necrotizing-exploration", conceptId: newConcept("necrotizing-clinical-escalation"), previousConceptIds: ["concept.abscess.rapid-spread-escalation"], objective: "Choose exploration when concerning progression outweighs a falsely reassuring score or lack of gas.",
        task: "Which next intervention should Caleb Stone's hospital team have selected at the recorded presentation?",
        choices: [choice("Urgent operative exploration of the thigh", "Progressive deep pain and fascial findings sustain concern for necrotizing infection; neither absent gas nor a low score reliably excludes it.", "A stable superficial process with a favorable response would not establish this exploration indication."),
          choice("MRI before deciding on operative exploration", "MRI can clarify uncertain anatomy, but should not postpone surgery when the clinical pattern already raises high concern.", "A stable unresolved deep-anatomy question without high clinical suspicion could justify additional imaging.", M),
          choice("Monitored intravenous treatment with interval examination", "A low score and maintained pressure can make observation tempting, but worsening deep findings during treatment require source-control assessment.", "A nonprogressive non-necrotizing infection responding to treatment could fit monitored medical care.")],
        claims: ["necrotizing"], steps: ["Recognize that the negative score/gas findings have limited exclusion value.", "Apply the actual progression and depth to the need for exploration."],
        cueAttack: "No necrotizing diagnosis is supplied before the choice. The acute hospital event is historical; the clinic does not execute emergency surgery. MRI distractor has timing.",
        deletion: "Without progression or deep pain the observation strategy becomes reasonable. Without the negative score/gas record the targeted reassurance error disappears.",
        difficulty: "Moderate-to-hard: competing data can cause a resident to overrule a concerning clinical trajectory with a screening result.", boundary: "A superficial improving process without deep pain would change the priority to medical reassessment rather than immediate exploration.",
        beforeVariantIds: ["question.abscess.rapid-spread-escalation.v2"], role: "replacement" },
      { slug: "necrotizing-return", conceptId: newConcept("necrotizing-repeat-source-control"), objective: "Reassess source control after an initial debridement despite partial systemic improvement.",
        update: "The hospital explored and removed nonviable tissue. Later, Caleb's blood pressure and fever improved, but the wound margin developed new discoloration and tenderness extending past the previously viable edge. The wound remained open.",
        task: "Which procedural plan should Caleb Stone's hospital team have selected for the new wound findings?",
        choices: [choice("Return for operative wound reassessment and debridement", "New local progression can indicate residual or advancing nonviable tissue despite systemic improvement; it warrants reassessment of source control.", "A stable viable wound with controlled infection could move toward reconstruction."),
          choice("Proceed with definitive primary wound closure", "Improved physiology may make reconstruction seem timely, but new marginal deterioration means source control is not yet established.", "A clinically controlled infection with a suitable viable wound could permit definitive closure."),
          choice("Continue bedside dressings before the next operation", "Dressings are part of wound care, but are not a substitute for evaluating new progressive deep infection.", "A stable granulating wound without new deterioration could continue local care while reconstruction is planned.")],
        claims: ["necrotizing-relook"], steps: ["Separate systemic improvement from new local evidence of failed source control.", "Choose re-exploration rather than reconstruction or continued dressings."],
        cueAttack: "No exact return interval supplies a memorized rule. All options are current wound plans; first-node feedback does not announce this later local deterioration.",
        deletion: "Delete the new margin change and wound care or reconstruction could become defensible; the update earns the later decision.", difficulty: "Moderate: reassuring systemic recovery competes with local progression.",
        boundary: "A stable viable wound after completed source control would change the plan toward ongoing wound care/reconstruction.", beforeVariantIds: [], role: "gap" },
      { slug: "necrotizing-skin", conceptId: newConcept("necrotizing-extent-of-debridement"), objective: "Follow tissue viability rather than either indiscriminate excision or inadequate drainage.",
        update: "At re-exploration, the operative record described grey friable fascia that separated easily, extending beyond the skin change. Neighboring muscle contracted and bled when assessed. The surgical team could expose the involved fascia while retaining perfused overlying skin.",
        task: "Which extent of resection best fits Caleb Stone's recorded tissue findings?",
        choices: [choice("Resect the diseased fascia", "Source control follows the involved layers rather than the visible skin boundary; viable skin and muscle need not be sacrificed merely because they neighbor the infected plane.", "Nonviable muscle or skin would need removal as part of adequate debridement."),
          choice("Resect skin, fascia and adjacent muscle", "A broad anatomical resection can seem safer, but the record establishes viable neighboring tissues and permits access to the affected plane.", "Nonviability across those layers would require their removal."),
          choice("Drain fluid through a skin opening", "Drainage may appear to address the fluid, but leaves the described nonviable fascia in place.", "An isolated pus collection without tissue necrosis could be managed primarily through drainage.")],
        claims: ["necrotizing-control"], steps: ["Interpret the different tissue-viability findings and their depth.", "Choose complete removal of nonviable tissue without equating wider resection with adequate source control."],
        cueAttack: "Balanced current operative options; the key does not claim a universal skin-sparing technique. The raw contraction/bleeding findings define the tissue to preserve.",
        deletion: "Removing viable-muscle/perfused-skin observations makes the widest resection impossible to rank; removing diseased fascia erases the source-control problem.",
        difficulty: "Hard prediction: confusing the skin border with infection extent or treating radical removal as automatically superior.", boundary: "If neighboring muscle or skin were nonviable, preserving that tissue would cease to be appropriate.", beforeVariantIds: [], role: "gap" },
    ] },
  { slug: "localized-hs", name: "Priya Ellis", age: 34, sex: "Female", complaint: "Persistent axillary drainage",
    presentation: "Priya Ellis, a 34-year-old woman, returns to clinic after treatment of recurrent axillary nodules. New tender nodules have become uncommon, but the same two openings keep draining. Palpation identifies a short connecting tract. Ultrasound maps one superficial channel without a separate tense cavity; the surrounding skin moves freely.",
    nodes: [
      { slug: "hs-local-planning", conceptId: conceptIds.hsPlanning, objective: "Distinguish persistent structural disease from uncontrolled new inflammatory lesions in longitudinal HS planning.",
        task: "Which referral plan should be selected for Priya Ellis's remaining axillary problem?",
        choices: [choice("Referral for axillary tunnel-procedure assessment", "The response has reduced new inflammatory nodules while a mapped structural tract remains; that residual problem merits procedural assessment within ongoing HS care.", "Continued formation of multiple new nodules without persistent tracts would shift priority toward medical escalation."),
          choice("Referral for axillary medical-treatment escalation", "Repeated drainage suggests active disease, but the record distinguishes fixed tract output from continued new nodules.", "New widespread inflammatory lesions despite adequate therapy would make medical reassessment the main next focus."),
          choice("Referral for axillary abscess-drainage assessment", "Drainage may have helped prior flares, but the current channel is not a new tense collection requiring that acute procedure.", "A new large painful fluctuant collection could require acute drainage.")],
        claims: ["hs-pattern", "hs-tunnels", "hs-acute"], steps: ["Read the treatment response as inflammatory improvement with residual structural disease.", "Match the referral purpose to the remaining problem."],
        cueAttack: "Replaced a uniquely comprehensive 'multidisciplinary referral' key with three specific referral purposes. The clinical diagnosis is appropriate prerequisite context, not the scored answer.",
        deletion: "Without the response and channel map, medical escalation and acute drainage cannot be fairly ranked. No repeated history-only update.",
        difficulty: "Moderate: confusing persistent tract output with failed inflammatory control can lead to the wrong next referral.", boundary: "New widespread nodules would favor medical reassessment; a tense collection would change the acute source-control priority.",
        beforeVariantIds: ["question.hidradenitis-suppurativa.multimodal-specialist-planning.v1", "question.hidradenitis-suppurativa.multimodal-specialist-planning.v2"], role: "rewrite" },
      { slug: "hs-deroof", conceptId: newConcept("hs-local-tunnel-procedure"), previousConceptIds: [conceptIds.hsPlanning], objective: "Match a limited persistent HS tunnel to a lesion-directed procedure.",
        update: "At procedural assessment, Priya's tract remains confined to the same short superficial channel. It repeatedly reopens despite control of new nodules. There is no confluent scarred field or separate tense abscess.",
        task: "Which procedure may be offered for Priya Ellis's residual axillary disease?",
        choices: [choice("Limited axillary deroofing", "Deroofing addresses a recurrent superficial tunnel; the limited distribution does not require the offered broad regional resection.", "An extensive connected field of scarred disease could require a larger excision."),
          choice("Axillary incision and drainage", "A familiar drainage procedure may relieve a tense acute collection, but does not remove the persistent tunnel in this record.", "A large painful acute abscess needing decompression would change the immediate procedure."),
          choice("Regional axillary excision", "Wide excision treats extensive chronic disease, but exceeds the documented limited tract for this offered comparison.", "Broad interconnected tunnels and scar-related functional impairment could justify regional excision.")],
        claims: ["hs-tunnels", "hs-extent", "hs-acute"], steps: ["Interpret the mapped lesion as a localized persistent tunnel rather than an acute collection.", "Select an appropriately scoped procedural option."],
        cueAttack: "First-node feedback identifies the referral problem but does not name deroofing or rank procedures. No claim that deroofing beats every limited excision technique.",
        deletion: "Remove limited extent or absence of confluent scarring and wide excision can become equally defensible. The later mapping determines procedure scope.",
        difficulty: "Moderate: repeat drainage and overly extensive excision are realistic errors at the same procedural stage.", boundary: "An extensive connected scarred field would support regional excision; a tense collection could require acute decompression.", beforeVariantIds: [], role: "gap" },
    ] },
  { slug: "extensive-hs", name: "Rachel Foster", age: 42, sex: "Female", complaint: "Axillary movement pain",
    presentation: "Rachel Foster, a 42-year-old woman with HS, attends clinic after medical treatment reduced new nodules. A broad axillary scar remains tethered and painful during shoulder elevation. Multiple openings communicate across the scarred field, with ongoing drainage. The procedural map shows connected tunnels throughout that field rather than one isolated channel.",
    nodes: [
      { slug: "hs-extensive-excision", conceptId: newConcept("hs-extent-procedure"), objective: "Match chronic HS disease extent and functional burden to procedural scope.",
        task: "Which procedure should be discussed for Rachel Foster's persistent axillary symptoms?",
        choices: [choice("Regional axillary excision", "Extensive interconnected chronic lesions with functional impairment support discussion of regional excision rather than serial acute drainage.", "A short isolated tract without a scarred field could be managed with a limited procedure."),
          choice("Limited axillary deroofing", "A limited procedure is attractive after medical improvement, but one opening does not represent the documented connected field.", "A genuinely isolated recurrent channel could fit lesion-directed deroofing."),
          choice("Axillary incision and drainage", "Tenderness and drainage may prompt another acute procedure, but no separate tense cavity explains the persistent structural burden.", "A superimposed acute fluctuant abscess could need decompression.")],
        claims: ["hs-extent", "hs-tunnels", "hs-acute"], steps: ["Distinguish a broad connected structural burden from isolated inflammatory activity.", "Choose a procedure scope that addresses that field."],
        cueAttack: "The task does not ask for 'definitive' or 'complete' therapy. Raw connected extent and impaired motion do the work; all alternatives are concrete procedures.",
        deletion: "Without the extent map, a limited deroofing proposal could be equally reasonable. Without motion limitation the treatment burden/benefit discussion changes.",
        difficulty: "Moderate-to-hard prediction: a resident may equate reduced nodules with resolved disease or treat one visible opening as the whole problem.", boundary: "Change the map to one isolated channel and a limited procedure becomes reasonable.",
        beforeVariantIds: ["question.hidradenitis-suppurativa.pattern-recognition.v2", "question.hidradenitis-suppurativa.pattern-recognition.v3"], role: "replacement", previousConceptIds: ["concept.hidradenitis-suppurativa.pattern-recognition"] },
      { slug: "hs-remote-lesions", conceptId: newConcept("hs-local-surgery-disease-boundary"), objective: "Limit what local surgical success establishes about HS elsewhere.",
        update: "After the operated axilla heals, Rachel has no drainage there and shoulder movement improves. New tender nodules appear in the opposite axilla and groin. The operated field remains quiet.",
        task: "Which follow-up plan should be selected for Rachel Foster's new lesions?",
        choices: [choice("Dermatology consultation for the newly active regions", "A quiet operated field does not establish control of the disease elsewhere; new sites need medical assessment within ongoing longitudinal HS care.", "Recurrent drainage in the operated field would instead require assessment of local persistence or recurrence."),
          choice("Surgical re-exploration of the healed axilla", "New lesions can be mistaken for failure of the local operation, but the observations identify disease at different sites.", "New drainage or a local tract in that axilla could justify local procedural reassessment."),
          choice("Regional excision of the newly active regions", "Surgical success at one field can tempt a universal procedure strategy, but new inflammatory nodules are not automatically established persistent tunnels.", "Persistent mapped structural lesions at selected sites could warrant procedural treatment.")],
        claims: ["hs-extent", "hs-pattern", "hs-tunnels"], steps: ["Use site-specific postoperative findings to distinguish local success from systemic disease control.", "Select care for the newly active sites rather than revise a healed field."],
        cueAttack: "New-site anatomy appears only in this update. Earlier feedback describes local procedural scope and does not prescribe the later dermatology plan.",
        deletion: "Removing the site map makes local recurrence and remote disease indistinguishable; the update is consequential.", difficulty: "Moderate: overgeneralizing a local operation as a cure changes follow-up and can lead to unnecessary surgery.",
        boundary: "If new drainage occurred in the operated field, local recurrence assessment would move ahead of attributing everything to new-site disease.", beforeVariantIds: [], role: "gap" },
    ] },
  { slug: "hs-acute-chart", name: "Thomas Bell", age: 40, sex: "Male", complaint: "Axillary care review", chartReview: true,
    presentation: "Thomas Bell, a 40-year-old man, attends clinic while the founder reviews records from his outside acute-care visit for HS. At that visit a large tense axillary swelling prevented him lowering the arm. The surrounding chronic tracts were unchanged, and the acute team had mapped a single painful collection. A chronic-disease procedural appointment was already planned for later.",
    nodes: [
      { slug: "hs-acute", conceptId: newConcept("hs-acute-source-control"), objective: "Separate an acute collection's immediate needs from later chronic HS planning.",
        task: "Which initial procedural plan best fits Thomas Bell's recorded acute visit?",
        choices: [choice("Perform axillary incision and drainage", "The immediate problem is a large painful collection; treating it does not settle the later chronic tunnel plan.", "A quiet persistent tunnel without a tense collection would support a chronic lesion-directed procedure."),
          choice("Perform regional axillary excision", "Chronic surgery is relevant, but accelerating a broad excision is not the offered initial decompression strategy for this acute focal burden.", "A planned operation for extensive chronic disease after an acute episode could appropriately proceed when clinically suitable."),
          choice("Defer axillary intervention until the scheduled review", "A planned future review does not address the current painful collection and functional limitation.", "A nonfluctuant mild flare without an acute collection could be reassessed medically rather than urgently drained.")],
        claims: ["hs-acute", "hs-tunnels"], steps: ["Identify a superimposed acute collection separately from unchanged chronic tracts.", "Choose acute decompression without presenting it as chronic cure."],
        cueAttack: "No 'drainage alone' caricature or uniquely comprehensive specialist referral. All options are specific procedural timing/scope plans; the large tense collection makes the acute stage necessary.",
        deletion: "Without acute functional limitation and mapped collection, the planned chronic appointment could remain the leading approach.", difficulty: "Moderate prediction: conflating a chronic treatment plan with adequate treatment of a new acute episode.",
        boundary: "A quiet tract without a tense collection removes the indication for acute drainage.", beforeVariantIds: ["question.hidradenitis-suppurativa.multimodal-specialist-planning.v4"], role: "replacement", previousConceptIds: [conceptIds.hsPlanning] },
    ] },
  { slug: "cleft-episode", name: "Jordan Hale", age: 25, sex: "Male", complaint: "Painful cleft swelling",
    presentation: "Jordan Hale, a 25-year-old man, attends clinic for recurrent upper-cleft drainage that has changed to a painful tense swelling. Several midline pits are present. A focal fluctuant area lies beside them; examination places the lesion well above the anus. He has no systemic illness. He had been considering an elective operation for chronic drainage.",
    nodes: [
      { slug: "pilonidal-acute", conceptId: newConcept("pilonidal-acute-drainage"), objective: "Treat a new acute collection before selecting definitive chronic-disease surgery.",
        task: "Which procedural plan should be selected for Jordan Hale's current cleft swelling?",
        choices: [choice("Incise and drain the acute collection", "The tense focal collection creates an acute source-control problem before the separate chronic-disease treatment decision.", "A quiet draining sinus without a collection would instead require elective disease assessment."),
          choice("Excise the diseased cleft with primary closure", "The prior elective discussion makes excision tempting, but the current acute collection changes the initial treatment phase.", "After the acute episode, selected chronic disease can be managed by excision with an appropriate closure strategy."),
          choice("Perform limited elective pit excision", "Pit-directed treatment can fit selected limited chronic disease, but does not substitute for draining the current tense collection.", "Limited quiet primary disease could be considered for a minimally invasive procedure.")],
        claims: ["pilonidal-acute", "pilonidal-pattern", "pilonidal-extent"], steps: ["Recognize the changed acute state within a chronic history.", "Choose source control before elective disease-treatment selection."],
        cueAttack: "No diagnosis-only task or primary-closure selection sentence that eliminates alternatives. Every option is a real procedure at the cleft; the prior elective plan supplies a credible sequencing trap.",
        deletion: "Remove the new tense collection and elective procedures become reasonable; location bounds the anorectal differential without claiming imaging excluded every fistula.",
        difficulty: "Moderate: applying a previously reasonable elective plan to a changed acute phase.", boundary: "A quiet nonfluctuant sinus changes the decision to elective treatment selection, not another incision.",
        beforeVariantIds: ["question.pilonidal-disease.chronic-sinus-recognition.v1", "question.pilonidal-disease.chronic-sinus-recognition.v3"], role: "replacement", previousConceptIds: ["concept.pilonidal-disease.chronic-sinus-recognition"] },
      { slug: "pilonidal-chronic", conceptId: newConcept("pilonidal-recurrent-elective-planning"), objective: "Escalate persistent function-limiting chronic disease after acute collection resolution.",
        update: "After drainage, Jordan's tense swelling and severe pain resolve. He continues to have daily staining from several interconnected openings across an old midline scar. Similar episodes have recurred after prior pit-directed treatment, and the drainage continues to interrupt work. No acute cavity is found at reassessment.",
        task: "Which referral plan should be selected for Jordan Hale's persistent cleft disease?",
        choices: [choice("Arrange excisional surgery assessment", "Persistent recurrent interconnected disease after a prior limited procedure warrants discussion of an excisional strategy rather than another acute drainage plan.", "A first limited minimally symptomatic episode could reasonably receive a less extensive initial discussion."),
          choice("Arrange repeat cleft abscess drainage", "Recurrent staining can be mistaken for recurrent acute pus, but the new examination identifies no acute cavity.", "A new tense fluctuant swelling would restore the acute drainage priority."),
          choice("Continue cleft hygiene and dressing care", "Local measures remain useful, but this record shows recurrent burdensome disease despite previous treatment rather than a quiet or first limited presentation.", "Asymptomatic pits or acceptable minimal symptoms without treatment failure could support continued conservative follow-up.")],
        claims: ["pilonidal-extent", "pilonidal-acute", "pilonidal-closure"], steps: ["Separate resolved acute swelling from persistent recurrent disease burden.", "Use extent and prior treatment response to select the purpose of referral."],
        cueAttack: "Replaced vague 'individualized management' with a specific referral. Prior feedback identifies acute drainage but does not name the later elective strategy.",
        deletion: "Without the new treatment-history/extent record, an excisional discussion is not uniquely favored. Current no-cavity finding prevents reflex repeat drainage.",
        difficulty: "Moderate-to-hard prediction: repeating acute care or indefinite conservative care despite a different persistent problem.", boundary: "Limited primary disease without prior treatment failure would change the extent of surgical discussion.",
        beforeVariantIds: ["question.pilonidal-disease.chronic-sinus-recognition.v2", "question.pilonidal-disease.chronic-sinus-recognition.v4"], role: "replacement", previousConceptIds: ["concept.pilonidal-disease.chronic-sinus-recognition"] },
      { slug: "pilonidal-closure", conceptId: conceptIds.closure, objective: "Choose a wound strategy after recurrent extensive disease without pre-eliminating the competing plans.",
        update: "At elective consultation Jordan's mapped disease includes the failed midline scar and connected lateral tracts. He can manage a closed wound but has no support for prolonged daily open-cavity care. A resection is planned; the reconstructive discussion compares wound strategies rather than requiring one named flap.",
        task: "Which wound strategy best fits Jordan Hale's recurrent cleft disease and care constraints?",
        choices: [choice("Excision with off-midline closure", "Off-midline closure avoids placing the repair in the recurrent natal midline and fits his need for a closed-wound plan.", "If he preferred and could manage an open wound, secondary healing could be reasonable; it is not universally inferior."),
          choice("Excision with primary midline closure", "A direct closed repair meets the care constraint but repeats a midline strategy with less favorable wound outcomes.", "Primary midline closure is not promoted as the preferred pilonidal strategy; a different non-pilonidal wound may have a different closure comparison."),
          choice("Excision with open secondary healing", "Open healing is a legitimate competing strategy, but its prolonged wound-care burden conflicts with the documented constraint.", "Reliable open-wound support and an informed preference for secondary healing would make this a reasonable option.")],
        claims: ["pilonidal-closure", "pilonidal-extent"], steps: ["Integrate the recurrent scar/extent and the practical open-wound burden.", "Choose an off-midline closed strategy rather than a midline repair or open healing."],
        cueAttack: "Removed 'patient has selected primary closure', which previously deleted half the choices. All choices now answer the same wound-strategy decision. The constraint is necessary because open healing is otherwise valid.",
        deletion: "Delete the wound-care constraint and open healing becomes a valid rival; delete the recurrent midline context and the error being tested loses its practical consequence.",
        difficulty: "Moderate: a resident must distinguish a legitimate open alternative from the less favorable midline option without asserting a universal named-flap ranking.", boundary: "Changing wound-care support/preference can make secondary healing reasonable; it does not make primary midline closure preferable.",
        beforeVariantIds: ["question.pilonidal-disease.off-midline-closure-planning.v1", "question.pilonidal-disease.off-midline-closure-planning.v2", "question.pilonidal-disease.off-midline-closure-planning.v3", "question.pilonidal-disease.off-midline-closure-planning.v4"], role: "rewrite" },
    ] },
  { slug: "low-cleft-opening", name: "Amelia Scott", age: 29, sex: "Female", complaint: "Low cleft drainage",
    presentation: "Amelia Scott, a 29-year-old woman, attends clinic with intermittent drainage near the lower cleft. Two quiet pits are visible higher in the cleft, but the currently draining opening lies close to the anal verge. Palpation does not establish whether it joins the higher pits. She has no acute fluctuant swelling or systemic symptoms.",
    nodes: [
      { slug: "pilonidal-source-exam", conceptId: newConcept("cleft-source-before-treatment"), objective: "Evaluate a potentially different source before treating a low opening as a pilonidal extension.",
        task: "Which assessment should be selected before treating Amelia Scott's draining opening?",
        choices: [choice("Anorectal examination including anoscopy", "The low opening's relation to the anal canal remains unresolved; nearby upper pits do not prove the source of this separate opening.", "A classic upper-cleft lesion with a sufficient examination and no low-opening concern may not need this additional source assessment.", P),
          choice("Ultrasound confined to the upper pits", "The upper pits are a visible potential source, but examining only those pits can miss the relationship of the currently draining opening to the canal.", "A genuinely isolated equivocal upper-cleft collection could be evaluated with targeted ultrasound.", U),
          choice("Routine bacterial culture of the drainage", "A culture may identify organisms, but cannot establish the anatomical connection that changes treatment.", "Established infection needing pathogen identification would present a separate microbiological sampling question.", P)],
        claims: ["pilonidal-pattern"], steps: ["Recognize that a real upper-cleft finding does not establish the provenance of a low opening.", "Choose examination of the relevant anatomy before selecting a treatment."],
        cueAttack: "The task does not announce a fistula or request the sole 'anorectal' choice by name. All options are assessments; all have testing metadata.",
        deletion: "Remove the low-opening/disconnected-source uncertainty and extra examination loses its rationale. No scored fistula management is authored in this lane.",
        difficulty: "Moderate-to-hard: prematurely assigning all drainage to a known nearby disease can lead to the wrong operation.", boundary: "A demonstrated upper-cleft connection with no anal-canal concern changes the assessment needs; persistent uncertainty after examination can justify imaging.", beforeVariantIds: [], role: "gap" },
    ] },
  { slug: "cyst-episode", name: "Robert Lewis", age: 42, sex: "Male", complaint: "Painful back lump",
    presentation: "Robert Lewis, a 42-year-old man, attends clinic with a longstanding upper-back skin lump that intermittently released thick material through a central pore. It has recently become tense and painful. Ultrasound shows a superficial debris-containing cavity, separate from deeper structures. He had booked elective removal before the change in symptoms.",
    nodes: [
      { slug: "cyst-acute", conceptId: newConcept("epidermoid-acute-versus-elective"), previousConceptIds: ["concept.variety3.epidermoid-cyst-recognition"], objective: "Distinguish an acute collection's treatment from a previously planned elective cyst removal.",
        task: "Which procedural plan should be selected for Robert Lewis's current back lesion?",
        choices: [choice("Incision and drainage of the back lump", "The tense symptomatic collection changes the immediate source-control phase; elective removal can be reconsidered after the inflammation settles.", "A quiet persistent symptomatic lesion could proceed to elective removal without an acute drainage step."),
          choice("Complete excision of the back lump", "The prior booking makes definitive removal tempting, but active inflammation makes dissection and wound outcomes less favorable.", "A quiet noninflamed lesion with a removal indication could undergo elective excision."),
          choice("Needle aspiration of the back lump", "Aspiration is a credible attempt to preserve the elective plan, but is less dependable source control for the offered cutaneous collection.", "A different appropriately selected image-guided drainage target could favor percutaneous treatment.", P)],
        claims: ["cyst-pattern", "cyst-stages", "drainage"], steps: ["Infer a changed acute phase from a previously quiet punctum-bearing lesion.", "Choose immediate source control rather than persist with an elective dissection plan."],
        cueAttack: "The old recognition label is no longer the task. Three procedures/plans compete; no explanatory 'alone' option. The booked procedure is a real sequencing trap.",
        deletion: "Remove the new painful cavity and elective excision becomes reasonable. The longstanding pore/material explains the residual-lesion question without supplying a treatment rule.",
        difficulty: "Moderate: a resident may conflate a correct diagnosis and prior booking with a still-appropriate operative phase.", boundary: "A quiet noninflamed lesion changes the plan toward elective removal when indicated.",
        beforeVariantIds: ["question.variety3.epidermoid-upper-back.v1"], role: "replacement" },
      { slug: "cyst-definitive", conceptId: newConcept("symptomatic-epidermoid-residual-lesion"), objective: "Address a persistent symptomatic cyst after the acute collection resolves.",
        update: "At reassessment the redness and tenderness have resolved. Robert's examination again shows a mobile skin-centered nodule with a pore and no fluid cavity. It repeatedly catches on his work harness and becomes irritated. The prior drainage relieved the acute pain but the nodule remains.",
        task: "Which elective procedural plan should be offered for Robert Lewis's remaining back nodule?",
        choices: [choice("Excision of the back nodule", "The acute source-control goal was met, but a symptomatic residual lesion remains; elective removal addresses a different problem from repeat drainage.", "A quiet lesion causing no symptoms could be observed."),
          choice("Incision/drainage of the back nodule", "The previous procedure helped the acute episode, but the present exam shows no collection to evacuate.", "A recurrent tense cavity would create another source-control question."),
          choice("Needle aspiration of the back nodule", "A persistent lump can be mistaken for retained fluid, but the current exam and study show a solid-feeling cutaneous nodule without a cavity.", "A defined fluid collection in a suitable noncutaneous context could be considered for aspiration.", P)],
        claims: ["cyst-pattern", "cyst-stages", "drainage"], steps: ["Separate the success of acute drainage from persistence of a symptomatic underlying lesion.", "Choose an elective lesion-directed plan suited to the current quiet phase."],
        cueAttack: "The prior explanation does not state the later symptom burden or mandate excision of every cyst. The new harness irritation supplies the indication.",
        deletion: "Delete persistent irritation and observation becomes credible; delete the no-cavity findings and repeat source control is unresolved.", difficulty: "Moderate: repeating an intervention that met an earlier goal versus addressing the current residual lesion.",
        boundary: "A new acute cavity would redirect to source control; no symptom burden would allow observation.", beforeVariantIds: [], role: "gap" },
    ] },
];

export const SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS = candidateCaseSpecs;
export const SKIN_SOFT_TISSUE_WITHHELD_CANDIDATES = [
  { caseSlug: "foot-culture", plannedObjective: "Distinguish a healing clinically uninfected ulcer from a positive surface swab", sourceClaimIds: [cid("dfi-clinical"), cid("dfi-uninfected")], reason: "N3r4 review rejected the dense all-clear pattern and no-drug versus add-drug contrast. The candidate repaired label category but did not establish a new consequential second inference; no keyed successor retained. Preserve the stewardship concept and seek a defensible competing clinical boundary or accepted basic role." },
  { caseSlug: "forefoot-selection", plannedObjective: "Apply the narrow eligibility boundary for medical treatment of forefoot osteomyelitis", sourceClaimIds: [cid("dfi-medical")], reason: "Medical treatment may be offered under narrow conditions, but surgical treatment can also be reasonable. The attempted mandatory-surgery and perfusion-reconstruction alternatives failed the credible-competitor gate. No keyed item retained." },
  { caseSlug: "quiet-pits", plannedObjective: "Avoid prophylactic intervention for asymptomatic natal-cleft pits", sourceClaimIds: [cid("pilonidal-extent")], reason: "The supported rule remains straightforward against unnecessary procedures; no accepted basic exception exists. No keyed item retained." },
  { caseSlug: "quiet-skin-lump", plannedObjective: "Avoid reflex procedures for a quiet asymptomatic residual epidermoid lesion", sourceClaimIds: [cid("cyst-pattern")], reason: "A quiet lesion versus urgent procedures did not earn resident-level discrimination. The shoulder recognition item instead maps to the staged symptomatic cyst case. No keyed item retained." },
  { caseSlug: "symptomatic-lipoma", plannedObjective: "Choose observation versus symptom-driven removal for a concordant superficial lipoma", sourceClaimIds: [cid("lipoma")], reason: "Available government patient guidance supports the basic indication but not a difficult procedural tradeoff. No oncologic-resection foil or keyed item retained. Concerning deep masses remain outside this lane." },
  { caseSlug: "calf-flow", plannedObjective: "Choose vascular characterization before incising a flowing cavity", sourceClaimIds: [cid("vascular-mimic")], reason: "B2B04 review2 already rejected the arterial-flow-to-arterial-study recognition chain as easy, with a weak repeated-study competitor. A cosmetic rewording failed the author gate. Historical r6 remains exact; no keyed successor retained." },
  { caseSlug: "calf-pocket", plannedObjective: "Select source control for an avascular cavity beside a patent vein", sourceClaimIds: [cid("ultrasound-pocket"), cid("drainage")], reason: "B2B04 review1 identified a weak aspiration comparison and unscored vein column. The attempted successor did not adequately change that decision boundary. Retain r4/r5 history, use the new response-based forearm/thigh replacement candidates for independent review, and do not export the failed successor." },
].map(row => ({ ...row, unkeyed: true, reviewStatus: "needs_clinician_review", proposedVariantIds: [], nextAction: "Manager and independent reviewer identify a supported consequential comparison or explicitly accept a basic role before further drafting." }));

export const SKIN_SOFT_TISSUE_ROUND1_QUESTIONS: QuestionVariant[] = SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.flatMap(c => c.nodes.map(n => ({
  ...R, id: qid(n.slug), conceptId: n.conceptId, stem: n.task,
  answerChoices: n.choices.map((a, i) => ({ id: `choice.${SKIN_SOFT_TISSUE_SLUG}.${n.slug}.${i + 1}`, label: a.label,
    isCorrect: i === 0, rationale: a.rationale, distractorRationale: i === 0 ? null : a.rationale })),
  explanation: n.choices[0].rationale, supportingEvidenceClaimIds: n.claims.map(cid),
})));
export const SKIN_SOFT_TISSUE_ROUND1_CASES: SyntheticClinicalCase[] = SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.map(c => ({
  id: `case.${SKIN_SOFT_TISSUE_SLUG}.${c.slug}.20261111.v1`, displayName: c.complaint,
  patientPresentationVariantId: `presentation.${SKIN_SOFT_TISSUE_SLUG}.${c.slug}.20261111.v1`,
  patientDisplayName: c.name, prototypeDemographics: { ageYears: c.age, sexLabel: c.sex },
  chiefComplaint: c.complaint, presentation: c.presentation,
  approvedInstantiationProfiles: [{ id: `profile.${SKIN_SOFT_TISSUE_SLUG}.${c.slug}.20261111.v1`,
    prototypeDemographics: { ageYears: c.age, sexLabel: c.sex }, chiefComplaint: c.complaint, presentation: c.presentation }],
  tutorialEligible: false, routineEligible: true, earliestFacilityStage: 1, requiredClinicalSetting: "clinic",
  requiredCapabilityIds: [], rewardTierId: "reward.clinic_basic",
  sourceLabels: ["Original unapproved topic draft; exact sources are attached to each reached decision node."],
  decisionNodes: c.nodes.map((n, ni) => {
    const q = SKIN_SOFT_TISSUE_ROUND1_QUESTIONS.find(q => q.id === qid(n.slug))!;
    const sourceLabels = [...new Set(n.claims.flatMap(id => SKIN_SOFT_TISSUE_ROUND1_CLAIMS.find(cl => cl.id === cid(id))!.sourceIds))]
      .map(id => SKIN_SOFT_TISSUE_ROUND1_SOURCES.find(s => s.id === id)!.title);
    return { id: `node.${SKIN_SOFT_TISSUE_SLUG}.${n.slug}.20261111.v1`, questionVariantId: q.id,
      primaryConceptId: q.conceptId, stem: q.stem, ...(n.update ? { currentUpdate: n.update } : {}),
      answerChoices: q.answerChoices.map(a => ({ id: a.id, label: a.label, isCorrect: a.isCorrect,
        rationale: a.rationale, serviceRequest: null })), shuffleAnswers: true, explanation: q.explanation,
      sourceLabels,
      resultGateAfter: null, terminalDispositions: ni === c.nodes.length - 1 ? q.answerChoices.filter(a => !a.isCorrect).map(a => ({
        answerChoiceId: a.id, kind: "no_terminal_outcome" as const,
        consequenceNarrative: "Review the selected plan and explanation; this teaching encounter does not simulate a clinical outcome.",
        clinicalRationale: a.rationale ?? q.explanation, sourceLabels,
      })) : [] };
  }),
  learningSummary: "Original fictional teaching encounter. Review the current findings, competing plan and post-answer explanation. Clinical content awaits named clinician review.",
}));
export const SKIN_SOFT_TISSUE_ROUND1_AUTHORING_CONCEPTS = [...new Map(SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.flatMap(c => c.nodes).map(n => [n.conceptId, {
  ...R, id: n.conceptId, displayName: n.objective, learningObjective: n.objective,
  conceptType: (n.slug.includes("specimen") || n.slug.includes("sampling") || n.slug.includes("workup") || n.slug.includes("mri") || n.slug.includes("map") || n.slug.includes("uncertainty") || n.slug.includes("exam") ? "workup" : "management") as TestedConcept["conceptType"],
  educationalTier: 1 as const, earliestFacilityStage: 1, evidenceClaimIds: [...new Set(SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.flatMap(c => c.nodes).filter(other => other.conceptId === n.conceptId).flatMap(other => other.claims.map(cid)))],
  previousConceptIds: n.previousConceptIds ?? [],
}])).values()];
export const SKIN_SOFT_TISSUE_ROUND1_CONCEPTS: TestedConcept[] = SKIN_SOFT_TISSUE_ROUND1_AUTHORING_CONCEPTS.map(({ id, displayName, learningObjective, conceptType, earliestFacilityStage }) =>
  ({ id, displayName, learningObjective, conceptType, earliestFacilityStage }));
export const SKIN_SOFT_TISSUE_ROUND1_CASE_REVIEWS = SKIN_SOFT_TISSUE_ROUND1_CASES.map((c, index) => ({
  ...R, caseId: c.id, educationalTier: 1, patientAcuity: "stable", historicalEventAcuity: SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS[index]!.chartReview ? "may_be_urgent" : "not_applicable",
  facilityCapability: "outpatient_clinic_and_ambulatory_surgery_center", earliestFacilityStage: 1,
  requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
  framing: SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS[index]!.chartReview ? "outside_record_review_in_clinic" : "clinic_visit",
  observationBasis: "Constructed fictional observations; no prevalence, demographic weight or clinical cutoff is inferred from exact case values.",
}));
export const SKIN_SOFT_TISSUE_ROUND1_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = SKIN_SOFT_TISSUE_ROUND1_CASES.flatMap((c, ci) => c.decisionNodes.map((n, ni) => {
  const spec = SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS[ci]!.nodes[ni]!;
  return { caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
    classification: spec.choices.some(a => a.timingProfileId) ? { kind: "test_choices", choices: n.answerChoices.map((a, i) => ({
      choiceId: a.id, choiceLabel: a.label, timing: spec.choices[i]!.timingProfileId ? { kind: "test", timingProfileId: spec.choices[i]!.timingProfileId! } : { kind: "no_test" },
    })) } : { kind: "no_test" } };
}));
export const SKIN_SOFT_TISSUE_ROUND1_ORDER_PROPOSALS = SKIN_SOFT_TISSUE_ROUND1_CASES.flatMap(c => c.decisionNodes.map(n => ({
  caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
  execution: "teaching_decision_no_new_order_execution", serviceRequest: null, resultGateAfter: null,
  chronology: "Later updates are fictional later records, visible only at the reached node; they are not results executed by gameplay.",
})));
export const SKIN_SOFT_TISSUE_ROUND1_SOURCE_LINKS = SKIN_SOFT_TISSUE_ROUND1_SOURCES.filter(s => s.officialUrl).map(s => ({
  sourceId: s.id, href: s.officialUrl!, target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
}));
export const SKIN_SOFT_TISSUE_ROUND1_AUTHOR_GATES = SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.flatMap(c => c.nodes.map(n => ({
  ...R, questionVariantId: qid(n.slug), objective: n.objective, role: n.role,
  beforeVariantIds: n.beforeVariantIds, reasoningSteps: n.steps, closestCredibleError: n.choices[1].rationale,
  decidingObservationAndCounterfactual: n.boundary, deletionTest: n.deletion,
  checks: {
    coverTheKey: n.cueAttack,
    oneStageAndCategory: `Task: ${n.task} Compared labels: ${n.choices.map(a => a.label).join("; ")}. All are current-stage options; next-phase rationales stay after the answer.`,
    twoConsequentialSteps: n.steps.join(" Then: "), residentDifficulty: n.difficulty,
    oneBestAnswer: `${n.choices[0].rationale} Boundary/counterfactual: ${n.boundary}`,
  }, distractorAttacks: n.choices.slice(1).map(a => ({ label: a.label, temptationAndError: a.rationale, counterfactual: a.counterfactual })),
  finiteProfileAttack: `One exact ${c.age}-year-old ${c.sex.toLowerCase()} profile for ${c.name}; no name/age/site recombination. Complaint: ${c.complaint}. ${n.cueAttack}`,
  validationRole: "Author self-check only; no independent PASS, measured difficulty, manager acceptance or clinical approval.",
})));
export const SKIN_SOFT_TISSUE_ROUND1_STATEMENT_MAPPINGS = SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.flatMap((c, ci) => c.nodes.map((n, ni) => ({
  caseId: SKIN_SOFT_TISSUE_ROUND1_CASES[ci]!.id, nodeId: SKIN_SOFT_TISSUE_ROUND1_CASES[ci]!.decisionNodes[ni]!.id, questionVariantId: qid(n.slug),
  presentationClaimIds: [...new Set(c.nodes.flatMap(node => node.claims.map(cid)))],
  currentUpdateClaimIds: n.update ? n.claims.map(cid) : [], taskAndKeyClaimIds: n.claims.map(cid),
  explanationClaimIds: n.claims.map(cid), choiceRationaleClaimIds: n.choices.map((a, i) => ({
    choiceId: `choice.${SKIN_SOFT_TISSUE_SLUG}.${n.slug}.${i + 1}`, label: a.label, claimIds: n.claims.map(cid),
  })),
  constructedObservationBoundary: "Names, ages, symptoms, reports and chronology are fictional applications of mapped facts, not empirical observations, diagnostic cutoffs or demographic disease-selection variables.",
})));
export const SKIN_SOFT_TISSUE_ROUND1_IDENTITY_DECISIONS = SKIN_SOFT_TISSUE_ROUND1_AUTHORING_CONCEPTS.map(c => ({
  ...R, conceptId: c.id, previousConceptIds: c.previousConceptIds,
  decision: c.id.startsWith(`concept.${SKIN_SOFT_TISSUE_SLUG}.`) ? (c.previousConceptIds.length ? "new_meaning_explicit_version" : "new_gap_identity") : "preserve_existing_identity",
  changedObjective: c.learningObjective, evidenceClaimIds: c.evidenceClaimIds,
  historyPolicy: "Existing definitions, encounters, choice/timing/order tuples and FSRS cards remain unchanged. New meaning does not inherit a previous concept's FSRS history.",
}));

/** Round two responds once to the exact independent review. Round-one objects above are immutable history. */
export const SKIN_SOFT_TISSUE_REVISION_REVIEW = {
  ...R, contentVersion: "clinical.question-topic-skin-soft-tissue-benign-infection.2026-11-11.v2",
} as const satisfies AuthoredClinicalRecord;
const R2 = SKIN_SOFT_TISSUE_REVISION_REVIEW;
export const SKIN_SOFT_TISSUE_INDEPENDENT_REVIEW = {
  file: "docs/research/question-topic-skin-soft-tissue-benign-infection-review-20261111.json",
  sha256: "94110a8fd3419b6c7d1a697fe742e3d6d9871a08e24225b5b184cb1800c299e4",
  passedVariantIds: [qid("foot-deep-setting"), qid("necrotizing-exploration")],
  clinicalApproval: false,
} as const;
const qid2 = (s: string) => qid(s).replace(/\.v1$/, ".v2");
const priorSpec = (slug: string) => SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.flatMap(c => c.nodes).find(n => n.slug === slug)!;
function revisionCase(slug: string, presentation: string, changes: Partial<NodeSpec>): CaseSpec {
  const original = SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.find(c => c.nodes.some(n => n.slug === slug))!;
  return { ...original, slug: `${slug}.review2`, presentation,
    nodes: [{ ...priorSpec(slug), ...changes, role: "rewrite", beforeVariantIds: [qid(slug)] }] };
}

const addedSources: ClinicalSource[] = [
  { ...source("acep-foreignbody-2020", "Foreign Body Localization",
    "Bryczkowski C. Foreign Body Localization. American College of Emergency Physicians Sonoguide. August 26, 2020. Accessed November 11, 2026.",
    "American College of Emergency Physicians", ["Christopher Bryczkowski"], 2020,
    "https://www.acep.org/sonoguide/procedures/foreign-bodies", null,
    "Society procedural guidance directly supports the limitation of plain films for wood and the use of ultrasound for superficial radiolucent material. Not comparative proof of every extraction approach.",
    targeted + " Targeted introduction/anatomy facts checked. Same ACEP footer policy as the previously recorded Sonoguide source; no images, videos, technique prose or numerical accuracy estimates reused."), ...R2 },
  { ...source("wses-2018", "2018 WSES/SIS-E consensus conference: recommendations for the management of skin and soft-tissue infections",
    "Sartelli M, Guirao X, Hardcastle TC, Kluger Y, Boermeester MA, Rasa K, Ansaloni L, Coccolini F, et al., WSES/SIS-E consensus panel. 2018 WSES/SIS-E consensus conference: recommendations for the management of skin and soft-tissue infections. World J Emerg Surg. 2018;13:58. doi:10.1186/s13017-018-0219-9.",
    "World Society of Emergency Surgery / Surgical Infection Society Europe / World Journal of Emergency Surgery",
    ["Massimo Sartelli", "Xavier Guirao", "Timothy C. Hardcastle", "Yoram Kluger", "Marja A. Boermeester", "Kemal Rasa", "Luca Ansaloni", "Federico Coccolini", "WSES/SIS-E consensus panel; full author list at DOI"], 2018,
    "https://link.springer.com/article/10.1186/s13017-018-0219-9", "10.1186/s13017-018-0219-9",
    "Graded multidisciplinary consensus. Direct source for removal of nonviable tissue with preservation/reassessment of normally perfused or uncertain skin. Overlapping authors/evidence with WSES 2022, not independent trial corroboration.",
    "Article-level CC BY 4.0 verified in Rights and permissions. Attribution Sartelli and colleagues, 2018, https://creativecommons.org/licenses/by/4.0/. Original changed factual synthesis and fictional application only; no source figures, tables, algorithm, prose or numerical timelines reused.", true), ...R2 },
];
const addedClaimInputs: ClaimInput[] = [
  ["r2-wood-film", "A negative plain radiograph does not exclude retained wood in a soft-tissue wound.", ["acep-foreignbody-2020"], "evaluation", "One society procedural source; no numerical sensitivity or material-specific detection threshold authored."],
  ["r2-wood-localization", "Ultrasound can localize superficial radiolucent foreign material and assess its relationship to adjacent structures.", ["acep-foreignbody-2020"], "evaluation", "Operator skill and anatomy matter; a detected object does not authorize blind extraction near vessels."],
  ["r2-wood-ct-limits", "CT can miss retained soft-tissue foreign material and does not reliably exclude every wooden fragment.", ["acep-foreignbody-2020"], "evaluation", "One society procedural source; no numerical diagnostic-accuracy estimate or universal ranking for deep anatomy is authored."],
  ["r2-mri-map", "MRI can assess both marrow and adjacent soft-tissue anatomy in a diabetic foot when initial assessment leaves infection extent uncertain.", ["iwgdf-infection-2023"], "evaluation", "Strong guideline recommendation for MRI after unresolved initial studies; not a claim that MRI always outperforms every nuclear technique."],
  ["r2-nuclear-alternatives", "FDG-PET and labelled-leukocyte imaging are guideline-supported alternatives to MRI for suspected diabetic-foot osteomyelitis.", ["iwgdf-infection-2023"], "evaluation", "Conditional low-certainty recommendation; diagnostic-accuracy comparisons can conflict. Their inferiority is not assumed from their being distractors."],
  ["r2-viable-skin", "Adequate necrotizing-infection debridement can preserve perfused skin and muscle that remain viable over or beside involved deeper tissue.", ["wses-2022", "wses-2018"], "management", "Complete source control takes precedence; no skin-sparing mandate when that skin is nonviable or prevents adequate access."],
  ["r2-skin-reassessment", "When skin viability remains uncertain during necrotizing-infection surgery, retained tissue requires operative reassessment rather than an assumption of permanent viability.", ["wses-2018"], "management", "Consensus guidance; no exact return-to-theatre interval or universal fixed extent is authored."],
  ["r2-pilonidal-lateral", "The ESCP pilonidal guideline recommends lateral incision and drainage for an acute pilonidal abscess.", ["escp-pilonidal-2024"], "management", "Expert-opinion recommendation; no universal claim excluding every alternative procedure, recurrence probability or fixed interval."],
  ["r2-anorectal-examination", "For a draining opening near the anal canal in suspected pilonidal disease, digital anorectal examination and anoscopy assess a possible anorectal source.", ["escp-pilonidal-2024"], "evaluation", "Guideline expert opinion; this examination does not guarantee complete delineation of every fistula."],
  ["r2-anorectal-imaging", "If uncertainty about anorectal disease persists after clinical assessment of suspected pilonidal disease, pelvic MRI or endoanal ultrasonography can supplement the assessment.", ["escp-pilonidal-2024"], "evaluation", "Guideline expert opinion; no universal imaging requirement or superiority between these supplemental tests is claimed."],
];
export const SKIN_SOFT_TISSUE_CLAIMS: EvidenceClaim[] = [
  ...SKIN_SOFT_TISSUE_ROUND1_CLAIMS,
  ...addedClaimInputs.map(([id, statement, sources, evidenceCategory, limitation]): EvidenceClaim => ({
    ...R2, id: cid(id), statement, sourceIds: sources.map(sid), evidenceCategory,
    certainty: ["r2-pilonidal-lateral", "r2-skin-reassessment", "r2-nuclear-alternatives", "r2-anorectal-examination", "r2-anorectal-imaging"].includes(id) ? "low" : "moderate",
    limitation, applicablePopulation: "The explicitly constrained fictional round-two clinic or outside-record-review cases.", lastCheckedOn: current,
  })),
];
export const SKIN_SOFT_TISSUE_SOURCES: ClinicalSource[] = [...SKIN_SOFT_TISSUE_ROUND1_SOURCES, ...addedSources].map(s => ({
  ...s, evidenceClaimIds: SKIN_SOFT_TISSUE_CLAIMS.filter(c => c.sourceIds.includes(s.id)).map(c => c.id),
}));

export const SKIN_SOFT_TISSUE_REVISION_CASE_SPECS: CaseSpec[] = [
  revisionCase("abscess-workup",
    "Maya Turner, a 39-year-old woman, returns to clinic after treatment for forearm redness. The red area has receded, but focal pain persists over a rounded swelling. The swelling can be lifted with the skin over the underlying forearm muscles; passive wrist and finger movement does not reproduce the pain, while pressure directly over the swelling does. She is afebrile and the skin is intact.", {
      task: "Which investigation should be selected next for Maya Turner's persistent forearm finding?",
      choices: [choice("Forearm soft-tissue ultrasonography", "The response discrepancy identifies a persisting focal problem, and the observed examination localizes it above the muscle/tendon structures. Ultrasound can establish its contents and nearby anatomy before a procedure is chosen.", "Pain elicited by passive movement with a deep fixed swelling would strengthen the case for deeper-compartment imaging.", U),
        choice("Forearm magnetic resonance imaging", "Motion-related complaints can prompt a search for muscle or tendon disease, but the direct-pressure and skin-mobility findings currently favor initial superficial assessment.", "Deep fixation, pain with passive movement or unresolved deep-compartment findings could make MRI appropriate.", M),
        choice("Forearm plain radiography", "Persistent pain can raise a bone or radiopaque-object concern, but the observed mobile skin-level focus is not best characterized by a bone-focused first study.", "A bony point of tenderness or a suspected radiopaque foreign object would change the initial imaging question.", X)],
      steps: ["Separate the residual focal pain from the receding surrounding inflammation.", "Use the actual mobility and provocation findings to select superficial rather than tendon/bone-focused initial imaging."],
      cueAttack: "The examination now supplies observed superficial localization instead of an unexplained assumption. It does not name a collection. Every option is forearm imaging with the same level of specificity and a wait proposal.",
      deletion: "Delete the mobility/provocation record and MRI becomes harder to rank because wrist symptoms no longer localize. Delete the residual focus and improving redness may need no focal imaging.",
      difficulty: "Fair moderate retained: resolving skin inflammation competes with persistent focal symptoms and an initially plausible tendon/deep-space explanation. No claim of hard calibration or a basic exception.",
      boundary: "A deep fixed focus with pain on passive motion would change the preferred assessment toward the deeper compartment; disappearance of the focal symptom would remove this imaging indication.",
      update: undefined,
    }),
  revisionCase("recurrence-workup",
    "Daniel Price, a 48-year-old man, returns to clinic with recurrent upper-back tenderness and intermittent staining after a wooden splinter puncture and two drainage procedures. The first procedure note describes evacuation of fluid but no recovered solid material. Plain films covered the marked symptomatic area and reported no radiopaque object. A firm focus remains beneath the skin while the surrounding redness has diminished.", {
      conceptId: newConcept("radiograph-negative-foreignbody-localization"), previousConceptIds: [conceptIds.ultrasound],
      objective: "Select localization of a possible radiolucent nidus despite an adequate negative plain-film examination.",
      task: "Which investigation should be selected next for Daniel Price's recurrent upper-back finding?",
      choices: [choice("Targeted upper-back ultrasonography", "The repeated same-site problem and unrecovered wooden material remain meaningful despite an adequate negative radiograph. Ultrasound is suited to locating a superficial radiolucent nidus and surrounding fluid.", "A clearly radiopaque fragment already localized on adequate films would create a different localization problem.", U),
        choice("Repeat upper-back plain radiography", "A missed fragment is a credible concern, but the documented films covered the correct site and wood can remain undetected by that modality.", "Wrong-site or incomplete initial films, or concern for radiopaque material, could justify another radiographic acquisition.", X),
        choice("Contrast-enhanced upper-back computed tomography", "CT can help define deeper infection, but a recurrent localized superficial problem after wood penetration is better initially interrogated with ultrasound; a negative CT would not reliably settle every wooden-fragment question.", "Suspected deep extension requiring cross-sectional mapping could change the study priority.", T)],
      claims: ["r2-wood-film", "r2-wood-localization", "r2-wood-ct-limits", "foreignbody"],
      steps: ["Interpret the negative film in light of the material and verified acquisition site, rather than as absence of a retained nidus.", "Select a localization modality that can resolve the remaining superficial radiolucent-material question."],
      cueAttack: "Chest/spine target mismatches are gone. All three studies interrogate the symptomatic upper back. The repeat film is a genuine material/acquisition error, not an unexplained disposable completed-test foil.",
      deletion: "Without the wood history or documented coverage of the earlier films, repeating radiographs could become appropriate. Without recurrence and an unrecovered object, the negative film has a different consequence.",
      difficulty: "Moderate-to-hard author prediction: a resident may accept technically adequate but modality-limited negative imaging as proof of absence, or escalate to CT after recurrent treatment failure.",
      boundary: "If the original films omitted the marked site and the suspected material were radiopaque, repeat correctly targeted radiography would become reasonable.", update: undefined,
    }),
  revisionCase("foot-mri",
    "Grace Allen, a 66-year-old woman with diabetes, attends clinic for a persistent toe ulcer. Probing reaches a deep tract but does not establish its base. Foot radiographs show no definite cortical destruction, and inflammatory markers are mildly elevated. The surrounding redness has improved, but the tract and a firm fullness beside it persist. The foot team needs to assess the underlying marrow and adjacent soft tissues before planning further treatment.", {
      task: "Which advanced imaging study should Grace Allen's foot team select next?",
      choices: [choice("Magnetic resonance imaging of the foot", "The initial studies leave an unresolved bone-and-soft-tissue question. MRI is the guideline-recommended next advanced examination and can map both compartments for this planning goal.", "An MRI contraindication or a persistently equivocal MRI would change the comparison and could support a nuclear alternative.", M),
        choice("FDG-PET/CT of the foot", "This is a real guideline-supported alternative, not a nonbone test. It is not the preferred initial advanced examination for the stated unresolved anatomical planning question when MRI has not yet been obtained.", "An unsuitable or equivocal MRI could make FDG-PET/CT a reasonable alternative after specialist discussion.", "timing.test.nuclear_imaging"),
        choice("Labelled-leukocyte imaging of the foot", "This can help with selected bone-infection questions, but MRI is the recommended initial advanced assessment of the persisting tract with marrow and adjacent soft-tissue concerns.", "When MRI is unsuitable or leaves consequential doubt, labelled-leukocyte imaging is a supported alternative.", "timing.test.nuclear_imaging")],
      claims: ["dfi-initial-bone", "dfi-mri", "r2-mri-map", "r2-nuclear-alternatives"],
      steps: ["Recognize that the current tract/fullness and inconclusive initial tests leave both depth and adjacent-tissue questions unresolved.", "Choose the initial advanced study that addresses that combined planning question, distinguishing it from supported alternative pathways."],
      cueAttack: "Replaced the surface swab and unexplained repeat film with two real advanced-imaging alternatives. All three options address the same foot and stage. No test availability permission or most-sensitive wording selects MRI.",
      deletion: "Removing the unresolved tract/fullness and initial-study findings removes the reason to obtain advanced imaging now. No later MRI result is visible in this standalone successor.",
      difficulty: "Fair moderate retained: a routine guideline choice is made among genuine advanced alternatives rather than target mismatches. Do not claim proven MRI accuracy superiority or a hard item.",
      boundary: "MRI contraindication or a consequential equivocal MRI would make the nuclear alternatives appropriate; those conditions are not inferred merely from a negative initial radiograph.", update: undefined,
    }),
  revisionCase("necrotizing-skin",
    "Caleb Stone, a 52-year-old man, attends clinic after hospital treatment for a thigh infection. The founder reviews the operative note from debridement, while systemic treatment and a planned operative reassessment were continuing. The recorded tissue findings are shown for the resection decision at that operation.", {
      update: "Grey, friable fascia separated with little resistance and continued beyond the visible skin redness. The overlying skin produced dermal bleeding when incised, and the adjacent muscle contracted and bled when tested. No additional nonviable skin or muscle was identified in the exposed field; retained tissue would be reassessed at the planned operation.",
      task: "Which debridement plan best fits Caleb Stone's recorded tissue findings at that operation?",
      choices: [choice("Remove all nonviable fascia; retain perfused skin for reassessment", "Resection follows all observed nonviable tissue, including extension beyond the skin change. Perfused skin and viable muscle can be retained with reassessment while source control is completed; any additionally identified nonviable tissue also requires removal.", "Nonviable overlying skin or muscle would have to be removed rather than retained."),
        choice("Remove all nonviable fascia; excise the overlying bleeding skin", "This addresses the deep extent but sacrifices skin whose recorded perfusion does not itself require excision. Wider skin removal is not synonymous with better source control.", "If that skin were devitalized or obstructed adequate debridement, excision could be required."),
        choice("Resect fascia within the redness; retain perfused skin for reassessment", "Preserving perfused skin is reasonable, but limiting the deeper resection to the surface redness leaves described nonviable fascia beyond that boundary.", "If exploration established that the nonviable fascia ended at the surface boundary, that would be a different extent record."),
        choice("Resect fascia within the redness; excise the overlying bleeding skin", "This combines the surface-boundary error with unnecessary sacrifice of recorded perfused skin; neither compensates for residual deeper nonviable tissue.", "Both a different actual deep boundary and nonviable overlying skin would be needed to justify this combined extent.")],
      claims: ["necrotizing-control", "r2-viable-skin", "r2-skin-reassessment"],
      steps: ["Infer that the required deep extent exceeds the visible redness from the observed fascial viability.", "Independently interpret skin/muscle viability and choose complete source control with conditional preservation and reassessment."],
      cueAttack: "Removed the permission that the surgeon could preserve skin. Four same-stage resection plans balance deep extent and skin preservation, with neither component a majority shortcut. No drainage-only filler or unconditional fascia-only rule remains.",
      deletion: "Without the beyond-redness fascial finding the deep-boundary choice changes; without bleeding/contractile observations skin and muscle preservation cannot be ranked. The source-control condition and planned reassessment remain explicit.",
      difficulty: "Moderate-to-hard prediction from two independent extent errors: following skin redness instead of deep tissue findings, or equating radical skin sacrifice with adequate debridement. Clinical review of the tissue interpretation remains required.",
      boundary: "If exploration showed nonviable skin or muscle, it must be included in debridement; if the nonviable fascia actually stopped at the skin border, the extent comparison would change.",
    }),
  revisionCase("hs-deroof",
    "Priya Ellis, a 34-year-old woman with hidradenitis suppurativa, returns to clinic after medical treatment reduced the formation of new tender nodules. Drainage repeatedly returns from the same two axillary openings. Between them, a narrow band is palpable beneath mobile skin. During procedural mapping a probe passed between the openings in the superficial plane, with scant fluid released. The rest of the axillary skin moves freely during arm elevation.", {
      task: "Which procedure is the best next option for Priya Ellis's persistent axillary problem?",
      choices: [choice("Axillary tunnel deroofing", "The response separates reduced new inflammatory lesions from a persisting superficial communicating structure. Deroofing addresses that recurrent structure; repeating acute decompression does not remove it, while regional excision exceeds the documented localized burden.", "A broad interconnected scarred field with impaired motion could support regional excision instead of a lesion-directed procedure."),
        choice("Axillary incision and drainage", "Prior episodes may have improved after drainage, but the remaining problem is repeated output from a communicating structure rather than a newly distended acute pocket.", "A new large tense fluctuant abscess could require acute drainage for relief."),
        choice("Axillary regional excision", "Excision is a legitimate chronic HS treatment. For this mapped localized structure with freely moving surrounding skin, a lesion-directed deroofing option has a more appropriate scope among the offered procedures.", "An extensive connected scarred field or a broader persistent structural burden would change the scope discussion.")],
      claims: ["hs-pattern", "hs-tunnels", "hs-extent", "hs-acute"],
      steps: ["Interpret the treatment response together with the communicating superficial openings as a residual structural problem rather than uncontrolled new nodules.", "Select a procedure matching that residual structure and extent rather than repeating acute decompression or choosing a regional resection."],
      cueAttack: "Merged the referral/procedure repetition into one standalone question. Expanded hidradenitis suppurativa, removed the permissive may-be-offered task and the two explicit negatives that mirrored the distractors. The raw probe/mobility observations must be interpreted; no prior feedback supplies their meaning.",
      deletion: "Without the response and communicating-openings record, an inflammatory flare or acute pocket remains possible. Without the surrounding mobility/extent observations, a regional approach cannot be fairly ranked.",
      difficulty: "Fair moderate retained, not claimed hard: the nearest error is repeating a previously useful acute intervention for a persistent structural problem. Evidence does not rank deroofing above every possible limited excision, which is not asserted here.",
      boundary: "A new tense fluctuant cavity would change the immediate goal toward decompression; a broad tethered connected field would make regional excision a serious alternative.", update: undefined,
    }),
  revisionCase("pilonidal-acute",
    "Jordan Hale, a 25-year-old man, attends clinic with recurrent painful upper-cleft swelling. An earlier needle aspiration relieved the pressure briefly, but the swelling returned. Examination shows several midline pits and a warm, tender fluctuant bulge beside them, well above the anus. He has no systemic illness.", {
      conceptId: newConcept("pilonidal-drainage-access"), previousConceptIds: [newConcept("pilonidal-acute-drainage")],
      objective: "Select acute drainage and its access after transient relief from aspiration of a pilonidal collection.",
      task: "Which immediate procedural approach best fits Jordan Hale's current cleft finding?",
      choices: [choice("Incision and drainage through lateral access", "Recurrent tense fluid after temporary aspiration relief requires a drainage approach rather than repeating a transient decompression. The ESCP guideline recommends lateral access for acute pilonidal abscess drainage.", "If reassessment found quiet pits without a current collection, an acute drainage procedure would no longer fit the care phase."),
        choice("Incision and drainage through the midline pits", "The pits may look like the natural route to the source, but the recommended acute drainage access is lateral rather than an incision through the natal midline.", "An already draining tract requiring a different elective operation would create another access question; this is not a universal claim about every future incision."),
        choice("Repeat needle aspiration of the swelling", "Aspiration is a real less invasive decompression option, but its documented transient effect in this patient makes repeating that approach less appropriate than the recommended drainage procedure.", "A different selected collection or a specific procedural constraint could change the decompression plan; the current record does not establish such a constraint.", P)],
      claims: ["pilonidal-pattern", "pilonidal-acute", "r2-pilonidal-lateral", "drainage"],
      steps: ["Interpret recurrent fluctuant swelling after temporary aspiration relief as persisting acute source burden rather than quiet sinus disease.", "Select an effective acute drainage route, distinguishing lateral access from following the visible midline pits."],
      cueAttack: "All labels are neutral immediate procedural approaches. Removed elective distractor qualifiers and the pre-announced later operation. The closest competitor is a real drainage incision at the wrong access, not an explicitly postponed procedure.",
      deletion: "Remove the transient aspiration response and its role as a close competitor changes. Remove the pits/site examination and the pilonidal access recommendation cannot be applied safely.",
      difficulty: "Fair moderate author prediction: the procedure is not claimed universally superior to every pilonidal technique; the supported access rule competes with a plausible midline route and the patient's prior response. Not an independently accepted foundational exception.",
      boundary: "Quiet pits without a current fluid focus would remove the acute drainage indication; a different source near the anal canal would require source assessment before applying this pilonidal access rule.", update: undefined,
    }),
  revisionCase("pilonidal-closure",
    "Jordan Hale, a 25-year-old man, attends an elective clinic consultation after drainage of an upper-cleft abscess. The tense swelling, warmth and acute pain have resolved. His earlier operations included pit excision followed by excision with a primary midline closure; drainage subsequently reopened along that scar. Current mapping shows connected lateral tracts and the scarred midline. Excision is planned. He can manage the expected care of a closed wound but lacks help for prolonged daily deep open-cavity dressing care; wound complications could still change that burden.", {
      task: "Which wound strategy best fits Jordan Hale's recurrent cleft disease and current care constraints?",
      choices: [choice("Excision with off-midline closure", "The care constraint favors a planned closed-wound strategy over prolonged open-cavity healing, and off-midline closure is favored over another primary midline repair. It does not guarantee uncomplicated healing or eliminate dressing needs.", "Reliable open-wound support and an informed preference for secondary healing could make open treatment a reasonable alternative."),
        choice("Excision with primary midline closure", "A closed repair fits the dressing constraint, but repeating a primary midline strategy is less favorable than off-midline closure for the represented recurrent pilonidal disease.", "This guideline preference does not determine closure for a different non-pilonidal wound; no universal named flap is asserted."),
        choice("Excision with open secondary healing", "Open healing is a legitimate strategy, but its expected ongoing cavity-care burden conflicts with the documented support constraint.", "An acceptable open-wound burden with appropriate support could make this plan reasonable.")],
      claims: ["pilonidal-closure", "pilonidal-extent"],
      steps: ["Use the resolved acute phase and practical wound-care constraint to compare open healing with a planned closed strategy.", "Use the actual prior operation and recurrence to choose the closure strategy rather than treat all closed repairs as equivalent."],
      cueAttack: "This standalone record explicitly resolves the acute abscess, describes prior operations instead of calling a scar failed, and removes author-facing named-flap instruction. All choices remain real wound strategies; the necessary care constraint does not promise zero closed-wound care.",
      deletion: "Without resolution of the acute episode the operative phase is ambiguous. Without the support constraint, open healing can be equally defensible. Without the actual prior operation/recurrence history the applied closure comparison loses its context.",
      difficulty: "Fair moderate retained as in the review: two supported choices concern wound-care burden and closure location. No new numerical recurrence claim or universal named-flap preference.",
      boundary: "If prolonged open-cavity care were acceptable and supported, secondary healing could be reasonable; the absence of an acute abscess remains necessary before this elective closure decision.", update: undefined,
    }),
  revisionCase("pilonidal-source-exam",
    "Amelia Scott, a 29-year-old woman, attends her initial surgical clinic consultation for intermittent lower-cleft drainage. Two quiet pits are visible higher in the cleft, while the draining opening lies close to the anal verge. Palpation does not establish a connection between the openings. She has no tense swelling, spreading redness or systemic symptoms.", {
      task: "Which assessment should be selected first for Amelia Scott's draining opening at this consultation?",
      choices: [choice("Digital anorectal examination with anoscopy", "The low opening's source cannot be inferred from separate upper pits. Initial anorectal examination assesses that possible source; additional imaging may be needed if clinical uncertainty persists and the examination does not map every fistula.", "Persistent uncertainty after adequate anorectal examination can justify pelvic MRI or endoanal ultrasonography.", P),
        choice("Pelvic magnetic resonance imaging", "MRI can map an uncertain tract, but it does not replace the initial clinical anorectal assessment in this stable first-consultation record.", "Unresolved source or extent after an adequate clinical examination could justify MRI.", M),
        choice("Endoanal ultrasonography", "This is a real investigation of the relevant anatomy, unlike the old upper-pits-only foil. It can supplement a clinical examination when the source or tract remains uncertain.", "Persistent concern after clinical assessment, or a specific tract-mapping question, could make endoanal ultrasonography appropriate.", U)],
      claims: ["pilonidal-pattern", "r2-anorectal-examination", "r2-anorectal-imaging"],
      steps: ["Recognize that a low draining opening and separate upper pits may represent different sources.", "Select the initial source-directed clinical assessment rather than equate additional tract imaging with a replacement for examination."],
      cueAttack: "Removed the wrong-site restriction and drainage culture. All three options assess the actual anorectal source and are real clinical alternatives at an initial assessment stage. The task does not promise that anoscopy definitively delineates a fistula.",
      deletion: "Without the location/connection uncertainty this additional anorectal source assessment is not established. If the record instead documented a completed adequate examination with unresolved anatomy, imaging would move forward.",
      difficulty: "Fair moderate retained: the nearest competitor is early MRI for a potentially complex tract, not a deliberately wrong-site scan. Clinical assessment versus supplementary mapping is the decision; no fistula treatment is scored here.",
      boundary: "Persistent uncertainty after adequate anorectal examination would make MRI or endoanal ultrasonography appropriate; upper pits alone do not establish the low opening's source.", update: undefined,
    }),
  revisionCase("cyst-acute",
    "Robert Lewis, a 42-year-old man, attends clinic with a longstanding upper-back skin lump that intermittently released thick material through a central pore. Before this episode he had booked removal because it caught on his work harness. The lump is now newly warm and erythematous, with a tense tender fluctuant center. Ultrasound describes a superficial debris-containing cavity separate from deeper structures.", {
      choices: [choice("Incision and drainage of the back lump", "The longstanding pore-bearing lesion has changed into an acutely inflamed, tense fluid focus. The procedural choice rests on that new examination, not on ultrasound debris proving infection. Acute drainage addresses the current pressure burden while dissection through inflamed tissue is less favorable than in the earlier quiet state.", "A quiet noninflamed symptomatic residual lesion could instead be considered for elective removal."),
        choice("Complete excision of the back lump", "The prior booking remains a tempting plan for the underlying lesion, but the new warmth, erythema, tension and fluctuance change the current procedural phase and make intact dissection less favorable.", "A quiet lesion with a removal indication and no acute inflammatory change could undergo planned excision."),
        choice("Needle aspiration of the back lump", "Aspiration may seem a smaller way to preserve the booked plan, but is less dependable than incision and drainage for the offered symptomatic cutaneous collection.", "A different collection suitable for percutaneous treatment could change this procedural comparison.", P)],
      claims: ["cyst-pattern", "cyst-stages", "drainage"],
      steps: ["Infer a skin-centered epidermoid-type lesion from its chronic pore/material history while recognizing the new inflammatory fluid phase.", "Choose the immediate procedure for that changed phase rather than continue an elective capsule-dissection plan."],
      cueAttack: "Added the actual warmth, erythema and fluctuance that were missing from the first version. Debris is not labelled proof of bacterial infection. Parallel same-site procedures remain, and feedback no longer announces a subsequent elective-removal answer.",
      deletion: "Remove the new inflammatory examination and the prior elective removal becomes credible. Remove the longstanding pore history and the underlying lesion inference is no longer supported. There is no later scored companion to rehearse.",
      difficulty: "Fair moderate retained: the independent review already recognized two consequential phase/lesion inferences, but needed the inflammatory examination to rank immediate drainage against the booked excision.",
      boundary: "A quiet noninflamed lesion with the same symptom burden changes the procedural comparison toward planned lesion removal; ultrasound debris by itself does not establish the acute indication.", update: undefined,
    }),
];

type ItemDisposition = "pass-preserved" | "revised" | "parked";
interface DispositionSpec { slug: string; status: ItemDisposition; attempt: string; resolution: string; remainingRisk?: string; mergedInto?: string; }
const dispositionSpecs: DispositionSpec[] = [
  { slug: "abscess-workup", status: "revised", attempt: "Added observed skin-level mobility and passive-motion/direct-pressure localization; compared equally specified forearm investigations.", resolution: "The explanation's superficial assumption now has visible support and remains conditional about a collection. The response discrepancy and deeper MRI competitor remain meaningful." },
  { slug: "abscess-drainage", status: "parked", attempt: "Considered comparing incision/drainage, aspiration and targeted excision after the documented response, holding surrounding-infection care common.", resolution: "The same uncomplicated cavity still selects routine drainage; improving redness does not distinguish those procedures. No supported close procedural boundary was established.", remainingRisk: "Below the requested moderate/two-step gate; no foundational exception is accepted." },
  { slug: "recurrence-workup", status: "revised", attempt: "Replaced chest/spine foils with same-target ultrasound, repeat radiographs and CT; added the actual negative-film coverage and unrecovered wooden material.", resolution: "Material-specific limitations and acquisition adequacy now determine the next study. A new explicit localization meaning prevents transferring the former collection-ultrasound card." },
  { slug: "foreignbody-source-control", status: "parked", attempt: "Specified removal of the mapped object separately from skin-only excision and cavity drainage, then considered image-guided versus direct extraction near vessels.", resolution: "Removing target overlap repairs clarity but leaves object-to-removal matching. The guidance does not uniquely rank every extraction approach from the recorded anatomy.", remainingRisk: "A new procedural ranking would need supported anatomical constraints; prior feedback would otherwise rehearse the answer." },
  { slug: "cellulitis-plan", status: "parked", attempt: "Considered replacing pathway wording and unsupported procedures with named antimicrobial plans while retaining the necessary no-collection findings.", resolution: "No source-supported patient-specific drug comparison was established within this local-assessment lane. Keeping a generic course or inventing regimens would not resolve clarity/fairness.", remainingRisk: "Specific medicine comparison and credible competing indications remain unresolved; no new dose or regimen authored." },
  { slug: "residual-collection", status: "parked", attempt: "Retained the actual earlier/current scan chronology and compared same-target source-control procedures rather than broader care categories.", resolution: "The earlier negative scan still does not rank the offered procedures once a routine new cavity is given. It duplicates the returned forearm drainage rule.", remainingRisk: "No distinct consequential second inference; merge/retirement remains manager-owned." },
  { slug: "foot-deep-setting", status: "pass-preserved", attempt: "No question or visible patient-context edit. Isolated the passed first node from its returned specimen companion.", resolution: "Exact question, explanation, options, presentation, demographics and profile are preserved. Separate final-node no-outcome records are documented as runtime bookkeeping." },
  { slug: "foot-tissue-specimen", status: "parked", attempt: "Clarified that sampling would occur before the operation finished, removed the meta-instruction and considered relevant deep tissue/pus specimens rather than a task-excluded bone sample.", resolution: "Correct sampling time alone does not create two decisions, while an aseptic pus specimen can also represent the infection. No uniquely ranked difficult provenance comparison was established.", remainingRisk: "Do not treat absence of visible bone as proof against osteomyelitis; the failed version is excluded from active cases." },
  { slug: "foot-mri", status: "revised", attempt: "Replaced the surface swab and unexplained repeat film with actual nuclear alternatives; supplied the unresolved tract and adjacent fullness as the current anatomical question.", resolution: "All options are same-stage advanced foot imaging. MRI is the guideline-recommended initial study for unresolved bone/soft-tissue assessment; supported nuclear alternatives are acknowledged rather than called inferior.", remainingRisk: "Fair moderate, not hard or a claim of universally superior diagnostic accuracy. Independent reviewer must confirm the initial-study ranking." },
  { slug: "foot-bone-specimen", status: "parked", attempt: "Specified culture and histological purposes and gave comparably aseptic collection methods, considering an actual contamination/provenance problem.", resolution: "Once the target compartment is supplied, the original remains one sampling rule; two adequately obtained bone specimens may be legitimate alternatives. No defensible hard ranking was created.", remainingRisk: "No unspecified-analysis promise of diagnostic certainty; optimal antibiotic-free interval remains withheld." },
  { slug: "foot-infection-pad", status: "parked", attempt: "Made all considered responses urgent coordinated surgical/vascular plans instead of assessment versus explicit postponement.", resolution: "The remaining possible distinction was drainage/revascularization order, which the current case and guideline do not uniquely determine. No universal sequence was invented.", remainingRisk: "Combined safety-recognition objective remains important but does not receive an unapproved foundational exception." },
  { slug: "foot-charcot-uncertainty", status: "parked", attempt: "Clarified culture/histology and neutral collection quality; considered discordant MRI/specimen evidence while preserving the genuine radiologist uncertainty.", resolution: "The record still supplies the imaging limitation and bone-directed goal. Replacing them with a new unsupported specimen conflict would not justify a unique sampling key.", remainingRisk: "No claim that abnormal marrow proves infection or that an unspecified specimen resolves every diagnostic uncertainty." },
  { slug: "necrotizing-exploration", status: "pass-preserved", attempt: "No question or visible context change, including the suggested future instrument naming. Isolated the passed node from the two returned companions.", resolution: "Exact passed wording and patient context remain frozen. Required final-node no-outcome records are a separately documented runtime projection." },
  { slug: "necrotizing-return", status: "parked", attempt: "Specified a decision about immediate return rather than ambiguous interim dressings and removed obviously premature closure as a useful competitor.", resolution: "The remaining progressive local findings still lead directly to operative reassessment, repeating the passed node's principle. No supported close same-stage alternative was established.", remainingRisk: "Do not invent a return interval or label routine recognition difficult." },
  { slug: "necrotizing-skin", status: "revised", attempt: "Removed skin-preservation permission; compared four balanced extent/skin plans using actual fascial and tissue-perfusion findings.", resolution: "Every plan involves debridement. The key explicitly removes all nonviable tissue and conditions preservation on perfusion, access and reassessment, rather than prescribing fascia-only resection." },
  { slug: "hs-local-planning", status: "parked", attempt: "Replaced vague tunnel referral with a concrete procedural question and merged the repeated anatomy/response into its deroofing successor.", resolution: "A separate referral node would rehearse the same residual-structure discriminator. One standalone procedure item replaces the pair without scoring it twice.", mergedInto: "hs-deroof", remainingRisk: "A separate score would duplicate the structural-versus-inflammatory inference and preteach its companion; the merged v2 item awaits independent review." },
  { slug: "hs-deroof", status: "revised", attempt: "Merged the referral/procedure pair; used a complete best-next-procedure task and raw mapping observations without the two option-specific absence statements.", resolution: "No prior feedback supplies the structural interpretation. The offered deroofing/drainage/regional-excision comparison is framed as a fair moderate scoped-procedure decision, not superiority over every possible limited excision.", remainingRisk: "Procedural evidence is low quality; independent review and exact clinical sign-off remain required." },
  { slug: "hs-extensive-excision", status: "parked", attempt: "Expanded the diagnosis, removed the rather-than interpretation and considered mapped extent plus functional burden against real chronic procedures.", resolution: "Regional excision and a suitably extensive tissue-sparing/deroofing approach may both be reasonable. The available guidance does not uniquely rank them for this recorded field.", remainingRisk: "No broad-definitive versus acute-drainage filler; full 2026 guideline remained inaccessible in the recorded source survey." },
  { slug: "hs-remote-lesions", status: "parked", attempt: "Moved all considered plans to the symptomatic sites and removed repeated reassurance about the operated field and premature excision foils.", resolution: "The record lacks the new lesions' pattern, treatment response and extent needed to rank medical escalation against a procedure. Supplying a generic assessment key would remain the sole cautious plan.", remainingRisk: "No invented systemic regimen or assumption that all remote lesions require exclusively medical treatment." },
  { slug: "hs-acute", status: "parked", attempt: "Expanded hidradenitis suppurativa and removed the pre-announced chronic appointment rule while retaining pain and functional limitation.", resolution: "Acute collection to drainage still lacks a credible supported second decision among the recorded immediate procedures.", remainingRisk: "No accepted foundational acute-relief role; no active keyed successor." },
  { slug: "pilonidal-acute", status: "revised", attempt: "Removed elective stage qualifiers, added the observed transient aspiration response, and compared actual immediate drainage approaches.", resolution: "The new explicit access construct applies the guideline's lateral drainage recommendation and the patient's response. Old phase-selection history is not transferred.", remainingRisk: "Fair moderate based on expert-opinion access guidance, not a universal ranking of all pilonidal procedures." },
  { slug: "pilonidal-chronic", status: "parked", attempt: "Clarified prior pit/midline procedures, used a neutral management task and considered legitimate elective strategies rather than drainage without a cavity.", resolution: "The elective strategies were not uniquely ranked by these findings. The separate actionable wound-burden/closure decision is retained in its self-contained revised successor.", mergedInto: "pilonidal-closure", remainingRisk: "No claim of one mandatory operation from recurrence alone." },
  { slug: "pilonidal-closure", status: "revised", attempt: "Stated acute resolution in the current record, named the actual previous operation/recurrence, removed the named-flap meta-instruction and corrected any implication of zero closed-wound care.", resolution: "The necessary care constraint and real open-versus-closed/off-midline comparison remain. The item is independently interpretable without the earlier two nodes." },
  { slug: "pilonidal-source-exam", status: "revised", attempt: "Replaced the upper-pits-only scan and culture with same-target pelvic MRI and endoanal ultrasound, and made the initial-consultation stage explicit.", resolution: "The learner must assess possible different source and initial clinical assessment versus supplementary mapping; anoscopy is not promised to map every fistula.", remainingRisk: "Fair moderate initial-assessment decision; no fistula treatment or universal advanced-imaging ranking." },
  { slug: "cyst-acute", status: "revised", attempt: "Added newly observed warmth, erythema and fluctuance, preserved the prior quiet-lesion booking and removed feedback that announces later elective removal.", resolution: "The acute procedural inference now rests on examination rather than debris proving infection. The changed care phase fairly ranks immediate drainage against the booked dissection." },
  { slug: "cyst-definitive", status: "parked", attempt: "Corrected the inflammatory antecedent and removed the preceding elective-removal rehearsal; considered genuinely elective lesion-directed alternatives.", resolution: "The recorded quiet nodule still cannot rank plausible elective techniques from supported patient-specific evidence. Drainage/aspiration remain weak foils for a nonfluid nodule.", remainingRisk: "No unsupported technique ranking or basic-role claim; the symptomatic residual-lesion objective stays visible as a gap." },
];
export const SKIN_SOFT_TISSUE_ITEM_STATUSES = dispositionSpecs.map(d => ({
  reviewedVariantId: qid(d.slug), status: d.status,
  proposedVariantId: d.status === "pass-preserved" ? qid(d.slug) : d.status === "revised" ? qid2(d.slug) : null,
  attempt: d.attempt, resolution: d.resolution, remainingRisk: d.remainingRisk ?? null,
  mergedIntoVariantId: d.mergedInto ? qid2(d.mergedInto) : null,
  clinicalReviewStatus: "needs_clinician_review", independentReview: SKIN_SOFT_TISSUE_INDEPENDENT_REVIEW,
}));

export const SKIN_SOFT_TISSUE_PARKED_ITEMS = SKIN_SOFT_TISSUE_ITEM_STATUSES.filter(s => s.status === "parked");
const passedBindings = SKIN_SOFT_TISSUE_INDEPENDENT_REVIEW.passedVariantIds.map(id => {
  const clinicalCase = SKIN_SOFT_TISSUE_ROUND1_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === id))!;
  return { clinicalCase, node: clinicalCase.decisionNodes.find(n => n.questionVariantId === id)!,
    question: SKIN_SOFT_TISSUE_ROUND1_QUESTIONS.find(q => q.id === id)!,
    spec: SKIN_SOFT_TISSUE_ROUND1_CASE_SPECS.find(c => c.nodes.some(n => qid(n.slug) === id))! };
});
/** Exact reviewed nodes are retained separately from required final-node structural projections. */
export const SKIN_SOFT_TISSUE_PASSED_REVIEWED_NODES = passedBindings.map(b => b.node);
export const SKIN_SOFT_TISSUE_PASS_RUNTIME_PROJECTIONS = passedBindings.map(b => ({
  caseId: b.clinicalCase.id, nodeId: b.node.id, questionVariantId: b.question.id,
  changedFields: ["terminalDispositions"],
  reason: "Splitting the reviewed first node into a one-node case requires a no-terminal-outcome disposition for each wrong final answer under the existing schema. Exact reviewed node, question and patient context remain archived; every question/visible case field stays unchanged.",
  consequenceNarrative: "Review the selected plan and explanation; this teaching encounter does not simulate a clinical outcome.",
  clinicalRationalePolicy: "Copy the exact existing per-choice rationale; do not invent a patient outcome or change the reviewed explanation.",
}));
export const SKIN_SOFT_TISSUE_PASSED_CASES: SyntheticClinicalCase[] = passedBindings.map(b => ({
  ...b.clinicalCase, decisionNodes: [{ ...b.node,
    terminalDispositions: b.question.answerChoices.filter(a => !a.isCorrect).map(a => ({
      answerChoiceId: a.id, kind: "no_terminal_outcome" as const,
      consequenceNarrative: "Review the selected plan and explanation; this teaching encounter does not simulate a clinical outcome.",
      clinicalRationale: a.rationale ?? b.question.explanation, sourceLabels: b.node.sourceLabels,
    })),
  }],
}));
export const SKIN_SOFT_TISSUE_REVISION_QUESTIONS: QuestionVariant[] = SKIN_SOFT_TISSUE_REVISION_CASE_SPECS.flatMap(c => c.nodes.map(n => ({
  ...R2, id: qid2(n.slug), conceptId: n.conceptId, stem: n.task,
  answerChoices: n.choices.map((a, i) => ({ id: `choice.${SKIN_SOFT_TISSUE_SLUG}.${n.slug}.r2.${i + 1}`,
    label: a.label, isCorrect: i === 0, rationale: a.rationale, distractorRationale: i === 0 ? null : a.rationale })),
  explanation: n.choices[0].rationale, supportingEvidenceClaimIds: n.claims.map(cid),
})));
export const SKIN_SOFT_TISSUE_QUESTIONS: QuestionVariant[] = [
  ...passedBindings.map(b => b.question), ...SKIN_SOFT_TISSUE_REVISION_QUESTIONS,
];
export const SKIN_SOFT_TISSUE_REVISION_CASES: SyntheticClinicalCase[] = SKIN_SOFT_TISSUE_REVISION_CASE_SPECS.map(c => ({
  id: `case.${SKIN_SOFT_TISSUE_SLUG}.${c.slug}.20261111.v2`, displayName: c.complaint,
  patientPresentationVariantId: `presentation.${SKIN_SOFT_TISSUE_SLUG}.${c.slug}.20261111.v2`,
  patientDisplayName: c.name, prototypeDemographics: { ageYears: c.age, sexLabel: c.sex },
  chiefComplaint: c.complaint, presentation: c.presentation,
  approvedInstantiationProfiles: [{ id: `profile.${SKIN_SOFT_TISSUE_SLUG}.${c.slug}.20261111.v2`,
    prototypeDemographics: { ageYears: c.age, sexLabel: c.sex }, chiefComplaint: c.complaint, presentation: c.presentation }],
  tutorialEligible: false, routineEligible: true, earliestFacilityStage: 1, requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
  rewardTierId: "reward.clinic_basic", sourceLabels: ["Original unapproved topic revision; exact sources are attached to the decision node."],
  decisionNodes: c.nodes.map(n => {
    const q = SKIN_SOFT_TISSUE_REVISION_QUESTIONS.find(q => q.id === qid2(n.slug))!;
    const sourceLabels = [...new Set(n.claims.flatMap(id => SKIN_SOFT_TISSUE_CLAIMS.find(cl => cl.id === cid(id))!.sourceIds))]
      .map(id => SKIN_SOFT_TISSUE_SOURCES.find(s => s.id === id)!.title);
    return { id: `node.${SKIN_SOFT_TISSUE_SLUG}.${n.slug}.20261111.v2`, questionVariantId: q.id,
      primaryConceptId: q.conceptId, stem: q.stem, ...(n.update ? { currentUpdate: n.update } : {}),
      answerChoices: q.answerChoices.map(a => ({ id: a.id, label: a.label, isCorrect: a.isCorrect, rationale: a.rationale, serviceRequest: null })),
      shuffleAnswers: true, explanation: q.explanation, sourceLabels, resultGateAfter: null,
      terminalDispositions: q.answerChoices.filter(a => !a.isCorrect).map(a => ({
        answerChoiceId: a.id, kind: "no_terminal_outcome" as const,
        consequenceNarrative: "Review the selected plan and explanation; this teaching encounter does not simulate a clinical outcome.",
        clinicalRationale: a.rationale ?? q.explanation, sourceLabels,
      })),
    };
  }),
  learningSummary: "Original fictional teaching revision. Use the current observations and review the post-answer explanation. Clinical content awaits named clinician review.",
}));
/** Current review supply is deliberately single-node until successors receive independent review. */
export const SKIN_SOFT_TISSUE_CASES = [...SKIN_SOFT_TISSUE_PASSED_CASES, ...SKIN_SOFT_TISSUE_REVISION_CASES];
export const SKIN_SOFT_TISSUE_CASE_SPECS: CaseSpec[] = [
  ...passedBindings.map(b => ({ ...b.spec, nodes: [b.spec.nodes.find(n => qid(n.slug) === b.question.id)!] })),
  ...SKIN_SOFT_TISSUE_REVISION_CASE_SPECS,
];
const revisionConcepts = SKIN_SOFT_TISSUE_REVISION_CASE_SPECS.flatMap(c => c.nodes).map(n => ({
  ...R2, id: n.conceptId, displayName: n.objective, learningObjective: n.objective,
  conceptType: (n.slug.includes("workup") || n.slug.includes("mri") || n.slug.includes("exam") ? "workup" : "management") as TestedConcept["conceptType"],
  educationalTier: 1 as const, earliestFacilityStage: 1, evidenceClaimIds: n.claims.map(cid), previousConceptIds: n.previousConceptIds ?? [],
}));
export const SKIN_SOFT_TISSUE_AUTHORING_CONCEPTS = [
  ...passedBindings.map(b => SKIN_SOFT_TISSUE_ROUND1_AUTHORING_CONCEPTS.find(c => c.id === b.question.conceptId)!),
  ...revisionConcepts,
];
export const SKIN_SOFT_TISSUE_CONCEPTS: TestedConcept[] = SKIN_SOFT_TISSUE_AUTHORING_CONCEPTS.map(({ id, displayName, learningObjective, conceptType, earliestFacilityStage }) =>
  ({ id, displayName, learningObjective, conceptType, earliestFacilityStage }));
export const SKIN_SOFT_TISSUE_CASE_REVIEWS = [
  ...passedBindings.map(b => SKIN_SOFT_TISSUE_ROUND1_CASE_REVIEWS.find(c => c.caseId === b.clinicalCase.id)!),
  ...SKIN_SOFT_TISSUE_REVISION_CASES.map((c, index) => ({
    ...R2, caseId: c.id, educationalTier: 1, patientAcuity: "stable",
    historicalEventAcuity: SKIN_SOFT_TISSUE_REVISION_CASE_SPECS[index]!.chartReview ? "may_be_urgent" : "not_applicable",
    facilityCapability: "outpatient_clinic_and_ambulatory_surgery_center", earliestFacilityStage: 1,
    requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
    framing: SKIN_SOFT_TISSUE_REVISION_CASE_SPECS[index]!.chartReview ? "outside_record_review_in_clinic" : "clinic_visit",
    observationBasis: "Fictional exact observations and responses, not diagnostic cutoffs, measured outcomes or demographic disease-selection weights.",
  })),
];
export const SKIN_SOFT_TISSUE_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = [
  ...passedBindings.map(b => SKIN_SOFT_TISSUE_ROUND1_TIMING_ENTRIES.find(t => t.questionVariantId === b.question.id)!),
  ...SKIN_SOFT_TISSUE_REVISION_CASES.flatMap((c, ci) => c.decisionNodes.map((n, ni) => {
    const spec = SKIN_SOFT_TISSUE_REVISION_CASE_SPECS[ci]!.nodes[ni]!;
    return { caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
      classification: spec.choices.some(a => a.timingProfileId) ? { kind: "test_choices" as const,
        choices: n.answerChoices.map((a, i) => ({ choiceId: a.id, choiceLabel: a.label,
          timing: spec.choices[i]!.timingProfileId ? { kind: "test" as const, timingProfileId: spec.choices[i]!.timingProfileId! } : { kind: "no_test" as const } })) }
        : { kind: "no_test" as const } };
  })),
];
export const SKIN_SOFT_TISSUE_ORDER_PROPOSALS = SKIN_SOFT_TISSUE_CASES.flatMap(c => c.decisionNodes.map(n => ({
  caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
  execution: "teaching_decision_no_new_order_execution", serviceRequest: null, resultGateAfter: null,
  chronology: "A self-contained fictional record review or clinic decision; no future result, clinical order or new gameplay service is executed.",
})));
export const SKIN_SOFT_TISSUE_SOURCE_LINKS = SKIN_SOFT_TISSUE_SOURCES.filter(s => s.officialUrl).map(s => ({
  sourceId: s.id, href: s.officialUrl!, target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer",
}));
export const SKIN_SOFT_TISSUE_AUTHOR_GATES = [
  ...passedBindings.map(b => SKIN_SOFT_TISSUE_ROUND1_AUTHOR_GATES.find(g => g.questionVariantId === b.question.id)!),
  ...SKIN_SOFT_TISSUE_REVISION_CASE_SPECS.flatMap(c => c.nodes.map(n => ({
    ...R2, questionVariantId: qid2(n.slug), objective: n.objective, role: n.role, beforeVariantIds: [qid(n.slug)],
    reasoningSteps: n.steps, closestCredibleError: n.choices[1].rationale,
    decidingObservationAndCounterfactual: n.boundary, deletionTest: n.deletion,
    checks: { coverTheKey: n.cueAttack,
      oneStageAndCategory: `Task: ${n.task} Same-stage options: ${n.choices.map(a => a.label).join("; ")}. The independently written post-answer reasons do not appear in the labels.`,
      twoConsequentialSteps: n.steps.join(" Then: "), residentDifficulty: n.difficulty,
      oneBestAnswer: `${n.choices[0].rationale} Counterfactual: ${n.boundary}` },
    distractorAttacks: n.choices.slice(1).map(a => ({ label: a.label, temptationAndError: a.rationale, counterfactual: a.counterfactual })),
    finiteProfileAttack: `One exact ${c.age}-year-old ${c.sex.toLowerCase()} profile for ${c.name}; no profile recombination or preceding feedback. ${n.cueAttack}`,
    validationRole: "One author revision attempt after independent REVISE. Pending independent re-review; author checks confer no PASS or clinical approval.",
  }))),
];
export const SKIN_SOFT_TISSUE_STATEMENT_MAPPINGS = [
  ...passedBindings.map(b => SKIN_SOFT_TISSUE_ROUND1_STATEMENT_MAPPINGS.find(m => m.questionVariantId === b.question.id)!),
  ...SKIN_SOFT_TISSUE_REVISION_CASES.flatMap((c, ci) => c.decisionNodes.map((n, ni) => {
    const spec = SKIN_SOFT_TISSUE_REVISION_CASE_SPECS[ci]!.nodes[ni]!, claimIds = spec.claims.map(cid);
    return { caseId: c.id, nodeId: n.id, questionVariantId: n.questionVariantId,
      presentationClaimIds: claimIds, currentUpdateClaimIds: n.currentUpdate ? claimIds : [],
      taskAndKeyClaimIds: claimIds, explanationClaimIds: claimIds,
      choiceRationaleClaimIds: n.answerChoices.map(a => ({ choiceId: a.id, label: a.label, claimIds })),
      constructedObservationBoundary: "Names, ages, responses, reports and chronology are original fictional applications of the mapped facts; not empirical evidence, cutoffs or prevalence weights.",
    };
  })),
];
export const SKIN_SOFT_TISSUE_IDENTITY_DECISIONS = SKIN_SOFT_TISSUE_AUTHORING_CONCEPTS.map(c => ({
  conceptId: c.id, previousConceptIds: c.previousConceptIds, reviewStatus: "needs_clinician_review",
  decision: SKIN_SOFT_TISSUE_ROUND1_CONCEPTS.some(old => old.id === c.id) ? "preserve_reviewed_concept_identity" : "new_meaning_explicit_version",
  changedObjective: c.learningObjective, evidenceClaimIds: c.evidenceClaimIds,
  historyPolicy: "All prior concepts, questions, nodes, encounters and timing/order tuples remain unchanged in history. New meanings do not inherit the old FSRS card.",
}));
