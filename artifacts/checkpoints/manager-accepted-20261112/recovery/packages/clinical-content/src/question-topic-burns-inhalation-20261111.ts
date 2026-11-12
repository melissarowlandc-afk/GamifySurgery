import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, CaseExhibit, SyntheticClinicalCase, TestedConcept } from "./schema";

/** Explicit import only. No default-release, registry, selector or save mutation. */
export const BURNS_INHALATION_TOPIC_DRAFT = {
  contentVersion: "clinical.question-topic-burns-inhalation.2026-11-11.v1",
  reviewStatus: "needs_clinician_review",
  aiAssistedDrafting: true,
  lastClinicianReview: null,
} as const;
const draft = BURNS_INHALATION_TOPIC_DRAFT;
const sid = (suffix: string) => `source.burns-inhalation.${suffix}`;
const cid = (suffix: string) => `claim.burns-inhalation.${suffix}`;
const qid = (slug: string) => `question.topic.burns-inhalation.${slug}.v1`;
const caseId = (slug: string) => `case.topic.burns-inhalation.${slug}.v1`;
const nodeId = (slug: string) => `node.topic.burns-inhalation.${slug}.v1`;

type SourceInput = Omit<ClinicalSource, keyof typeof draft | "evidenceClaimIds" | "accessedOn">;
const aciRights = "CC BY-ND 4.0 on the document; Crown copyright on the site. Read for information and targeted underlying-fact verification. No source expression, edited document, figure, table or algorithm is reproduced or retained. Original fictional cases are not adaptations of source cases. See https://aci.health.nsw.gov.au/about/copyright and https://creativecommons.org/licenses/by-nd/4.0/. No known automated/AI prohibition found in the checked policy. Attribution: NSW Agency for Clinical Innovation; no endorsement implied.";
const sourceInputs: SourceInput[] = [
  {
    id: sid("jts-compartment-2026"), title: "JTS acute extremity compartment syndrome and fasciotomy, May 2026",
    completeCitation: "Renninger CH, D'Alleyrand JCG, Bowyer M, Stinner DJ, Gosselin MM, McGill RJ, Smith CS, Benavides JM, Osier CJ, Nelson KJ, Horne BR, Stuart JJ, Potter BK, Pittner DE, Tadlock MD, How RA, Kaminski CW Jr, Van Gent JM, Gurney JM. Acute Extremity Compartment Syndrome and the Role of Fasciotomy in Extremity War Wounds. Joint Trauma System CPG ID 17. 21 May 2026.",
    organizationOrJournal: "Joint Trauma System / US Department of Defense", authors: ["Christopher H. Renninger", "Jean-Claude G. D'Alleyrand", "Mark Bowyer", "Daniel J. Stinner", "Michelle M. Gosselin", "Robert J. McGill", "Christopher S. Smith", "Jerome M. Benavides", "Charles J. Osier", "Kenneth J. Nelson", "Brandon R. Horne", "Joseph J. Stuart", "Benjamin K. Potter", "Douglas E. Pittner", "Matthew D. Tadlock", "Remealle A. How", "Carter W. Kaminski Jr", "J. Michael Van Gent", "Jennifer M. Gurney"],
    publicationYear: 2026, doi: null, pmid: null, officialUrl: "https://jts.health.mil/assets/docs/cpgs/Extremity_Compartment_Syndrome_and_Fasciotomy_ID17_21_May_2026.pdf", sourceClass: "government_guidance", licenseLabel: "US government guidance; third-party material excluded", reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "JTS-linked terms checked at https://mrdc.health.mil/index.cfm/terms. Only targeted government recommendation facts; no illustrations, incision diagrams, risk tables, operative templates or source passages retained.",
    authorityAssessment: "Current operational guideline, replacing 2016. Clinical examination and prompt complete fasciotomy support the electrical-burn context; no deployed pressure-monitoring policy or incidence estimates are generalized.", usageRole: "cross_check",
  },
  {
    id: sid("jts-ventilation-2025"), title: "JTS Mechanical Ventilation Basics, April 2025",
    completeCitation: "Papalski W, Brocuglio T, Colver J, Rinderknecht D, Redifer D, Patrick S, Hogsed P, Honnoll R, Tripp M, Tobin J, Cunningham CW, Flieger D, Brooks S, Bond D, Powell EK, How RA, Tadlock MD, Van Gent JM, Gurney J. Mechanical Ventilation Basics. Joint Trauma System CPG ID 92, v1.1. 9 April 2025.",
    organizationOrJournal: "Joint Trauma System / US Department of Defense", authors: ["Wayne Papalski", "Taylor Brocuglio", "Jamie Colver", "Douglas Rinderknecht", "Daniel Redifer", "Sam Patrick", "Phillip Hogsed", "Ryan Honnoll", "Michael Tripp", "Joshua Tobin", "Cord W. Cunningham", "Dana Flieger", "Steve Brooks", "Daniel Bond", "Elizabeth K. Powell", "Remealle A. How", "Matthew D. Tadlock", "J. Michael Van Gent", "Jennifer Gurney"],
    publicationYear: 2025, doi: null, pmid: null, officialUrl: "https://jts.health.mil/assets/docs/cpgs/Mechnical_Ventilation_Basics_09_Apr_2025_ID92_v1.1.pdf", sourceClass: "government_guidance", licenseLabel: "US government guidance; third-party material excluded", reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "JTS-linked terms checked. Targeted Appendix A physiological cross-check only; no device manuals, graphics, tables or copied definitions retained. Older November 2024 URL returned 404; current index supplied the April 2025 document.",
    authorityAssessment: "Primary government ventilator guidance for the pressure/compliance distinction used as context for burn chest release. General ventilation remains owned by critical-respiratory-ventilation; no separate ventilation construct is added here.", usageRole: "cross_check",
  },
  {
    id: sid("nhs-northern-burns-2026"), title: "Northern Burn Care Network adult burn guideline, January 2026",
    completeCitation: "Northern Burn Care Network. Guidelines for referral and management of adult burn patients. NHS Northern Burn Care Network; January 2026. Management of locally infected burn wounds, pp. 39-40.",
    organizationOrJournal: "NHS Northern Burn Care Network", authors: ["Northern Burn Care Network"], publicationYear: 2026, doi: null, pmid: null,
    officialUrl: "https://www.northern-burncare-network.nhs.uk/_common/getdocument?id=383077", sourceClass: "government_guidance", licenseLabel: "NHS clinical guidance; no broad reuse license established", reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Public government-health-system clinical guidance read for targeted underlying facts. Document/site did not establish a broad AI or republication license; no such permission claimed. No copied prose, tables, algorithms, illustrations or source cases retained. Third-party manual-derived figures excluded.",
    authorityAssessment: "Current regional burn guidance distinguishes colonized healing wounds from clinically infected or delayed-healing wounds; antimicrobial dressings can suffice for selected colonization. This is a management cross-check with JTS/NSW, not a quantitative microbiologic threshold.", usageRole: "both",
  },
  {
    id: sid("jts-burn-care-2025"), title: "Joint Trauma System Burn Care, 10 June 2025, v1.3",
    completeCitation: "Williams A, Bryant L, Corkins C, Gamble S, Halgas B, Jones I, Folwell J, McCorcle J, Schultz S, Serio-Melvin M, Shingleton S, Sullivan S, Wiggins A, Tadlock MD, How RA, Van Gent JM, Cancio L, Gurney JM. Burn Care. Joint Trauma System Clinical Practice Guideline ID 12. 10 June 2025. Version 1.3.",
    organizationOrJournal: "Joint Trauma System / US Department of Defense",
    authors: ["Alicia Williams", "Lucas Bryant", "Christopher Corkins", "Sean Gamble", "Barrett Halgas", "Ian Jones", "Jared Folwell", "Jeffery McCorcle", "Susan Schultz", "Maria Serio-Melvin", "Sarah Shingleton", "Scott Sullivan", "Amanda Wiggins", "Matthew D. Tadlock", "Remealle A. How", "J. Michael Van Gent", "Leopoldo Cancio", "Jennifer M. Gurney"],
    publicationYear: 2025, doi: null, pmid: null,
    officialUrl: "https://jts.health.mil/assets/docs/cpgs/Burn_Care_CPG_10_June_2025_ID12_v1.3.pdf",
    sourceClass: "government_guidance", licenseLabel: "US government clinical guidance; third-party rights remain separate",
    reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "JTS links to https://mrdc.health.mil/index.cfm/terms. Copyright policy checked; no blanket permission for third-party materials claimed. Targeted factual synthesis from government-authored recommendations only. No reproduced figure, borrowed table, source excerpt, or Emergency War Surgery corpus. The public CPG index still lists the 2025 Burn Care edition on access date.",
    authorityAssessment: "Current DoD operational guideline. General burn physiology and decompression principles are useful cross-checks; deployed triage, futility claims, exact military fluid algorithms and drug doses are not generalized to civilian clinic care.", usageRole: "both",
  },
  {
    id: sid("nsw-transfer-2026"), title: "Transfer and retrieval of burn patients, November 2026",
    completeCitation: "NSW Agency for Clinical Innovation, Statewide Burn Injury Service. Transfer and retrieval of burn patients: Clinical practice guide. Sydney: ACI; November 2026. ISBN 978-1-74231-611-6.",
    organizationOrJournal: "NSW Agency for Clinical Innovation / Statewide Burn Injury Service", authors: ["NSW Agency for Clinical Innovation", "Statewide Burn Injury Service"],
    publicationYear: 2026, doi: null, pmid: null, officialUrl: "https://aci.health.nsw.gov.au/__data/assets/pdf_file/0004/162634/ACI-Transfer-and-retrieval-of-burn-patients-cpg.pdf",
    sourceClass: "government_guidance", licenseLabel: "CC BY-ND 4.0; factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: aciRights,
    authorityAssessment: "New November 2026 government clinical guide, replacing June 2026. Referral, time-critical retrieval and local co-management are separate pathways. Regional thresholds and transport logistics are not asserted as universal US rules.", usageRole: "both",
  },
  {
    id: sid("nsw-management-2026"), title: "Burn Patient Management, fifth edition, November 2026",
    completeCitation: "NSW Agency for Clinical Innovation, Statewide Burn Injury Service. Burn Patient Management: Clinical practice guide. 5th ed. Sydney: ACI; November 2026.",
    organizationOrJournal: "NSW Agency for Clinical Innovation / Statewide Burn Injury Service", authors: ["NSW Agency for Clinical Innovation", "Statewide Burn Injury Service"],
    publicationYear: 2026, doi: null, pmid: null, officialUrl: "https://aci.health.nsw.gov.au/__data/assets/pdf_file/0009/250020/ACI-Burn-Patient-Management-Clinical-Practice-Guide.pdf",
    sourceClass: "government_guidance", licenseLabel: "CC BY-ND 4.0; factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: aciRights,
    authorityAssessment: "Current regional multidisciplinary government guidance. Supports serial depth assessment, individualized fluid titration, burn wound care and temporary coverage. Specific exact timing and resuscitation formulas differ from other systems and are withheld from universal teaching.", usageRole: "both",
  },
  {
    id: sid("nsw-foundations-2025"), title: "Foundations of burn patient care, December 2025",
    completeCitation: "NSW Agency for Clinical Innovation, Statewide Burn Injury Service. Foundations of burn patient care: Supporting burn care management resources. Sydney: ACI; December 2025.",
    organizationOrJournal: "NSW Agency for Clinical Innovation / Statewide Burn Injury Service", authors: ["NSW Agency for Clinical Innovation", "Statewide Burn Injury Service"],
    publicationYear: 2025, doi: null, pmid: null, officialUrl: "https://aci.health.nsw.gov.au/__data/assets/pdf_file/0004/1032835/Foundations-of-burn-patient-care.pdf",
    sourceClass: "government_guidance", licenseLabel: "Crown copyright; targeted factual verification", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: aciRights.replace("CC BY-ND 4.0 on the document; ", "Document-specific CC license not established; "),
    authorityAssessment: "Government evidence synthesis underlying NSW resources, not an independent cohort or separate corroborating clinical study. Supports exclusion of epidermal erythema from TBSA and early enteral support after major burns.", usageRole: "cross_check",
  },
  {
    id: sid("nsw-escharotomy-2025"), title: "Escharotomy for burn patients, August 2025",
    completeCitation: "NSW Agency for Clinical Innovation, Statewide Burn Injury Service. Escharotomy for burn patients: a guide for clinicians. 3rd ed. Sydney: ACI; August 2025.",
    organizationOrJournal: "NSW Agency for Clinical Innovation / Statewide Burn Injury Service", authors: ["NSW Agency for Clinical Innovation", "Statewide Burn Injury Service"],
    publicationYear: 2025, doi: null, pmid: null, officialUrl: "https://aci.health.nsw.gov.au/__data/assets/pdf_file/0003/162633/ACI-Escharotomy-for-Burn-Patients.pdf",
    sourceClass: "government_guidance", licenseLabel: "CC BY-ND 4.0; factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: aciRights,
    authorityAssessment: "Focused government procedural guidance for restrictive circumferential burns. Independently administered health system from JTS, although underlying physiology overlaps. The guide does not clinically approve a particular fictional patient's operation.", usageRole: "both",
  },
  {
    id: sid("cdc-co-guidance-2026"), title: "CDC clinical guidance for carbon monoxide poisoning",
    completeCitation: "Centers for Disease Control and Prevention, National Center for Environmental Health. Clinical Guidance for Carbon Monoxide Poisoning Following Disasters and Severe Weather. Published July 9, 2024; reviewed August 21, 2026. Accessed November 11, 2026.",
    organizationOrJournal: "Centers for Disease Control and Prevention / National Center for Environmental Health", authors: ["Centers for Disease Control and Prevention"], publicationYear: 2024,
    publicationDateNote: "Page reports 2024 publication and August 21, 2026 subject-matter review.", doi: null, pmid: null,
    officialUrl: "https://www.cdc.gov/carbon-monoxide/hcp/clinical-guidance/index.html", sourceClass: "government_guidance", licenseLabel: "US government information; CDC attribution and non-endorsement conditions", reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "https://www.cdc.gov/other/agencymaterials.html checked. Source: CDC. Freely available on the agency website. Links and references do not imply CDC, ATSDR, HHS or US Government endorsement. Only original factual synthesis; no logos, images, copied prose or altered agency material.",
    authorityAssessment: "Current government clinical guidance for CO testing and hyperbaric consultation. COHb after oxygen is not a stand-alone severity measure. Recommends considering HBO in clinically severe cases; does not prove universal benefit or mandate transport in every case.", usageRole: "both",
  },
  {
    id: sid("esicm-early-enteral-2017"), title: "ESICM early enteral nutrition guideline, 2017",
    completeCitation: "Reintam Blaser A, Starkopf J, Alhazzani W, et al.; ESICM Working Group on Gastrointestinal Function. Early enteral nutrition in critically ill patients: ESICM clinical practice guidelines. Intensive Care Med. 2017;43:380-398. doi:10.1007/s00134-016-4665-0.",
    organizationOrJournal: "European Society of Intensive Care Medicine / Intensive Care Medicine", authors: ["Annika Reintam Blaser", "Joel Starkopf", "Waleed Alhazzani", "ESICM Working Group on Gastrointestinal Function"], publicationYear: 2017,
    doi: "10.1007/s00134-016-4665-0", pmid: "28168570", officialUrl: "https://link.springer.com/article/10.1007/s00134-016-4665-0", sourceClass: "professional_society_guideline",
    licenseLabel: "CC BY-NC 4.0; targeted society-guideline factual verification", reuseStatus: "cc_by_nc_4_0_restricted",
    reuseNotes: "Article-level license checked: https://creativecommons.org/licenses/by-nc/4.0/. Attribution to Reintam Blaser et al./ESICM. This in-house unapproved packet stores independently written facts and original constructed applications, no article text or adapted exhibit. No broad commercial reuse permission claimed. Publisher restrictions and NC license do not grant a general AI corpus license.",
    authorityAssessment: "Evidence-graded society guidance, older edition. Recommendation 2 supports cautious low-dose EN after shock control even with residual stable support; recommendation against EN during bowel ischemia/uncontrolled shock is largely expert opinion. No universal pressor dose, laboratory cutoff or precise start time follows.", usageRole: "both",
  },
  {
    id: sid("dailymed-nithiodote-2025"), title: "NITHIODOTE prescribing information, revised December 2024",
    completeCitation: "Hope Pharmaceuticals. NITHIODOTE (sodium nitrite and sodium thiosulfate) prescribing information. Revised December 2024; DailyMed record updated October 6, 2025. Bethesda: US National Library of Medicine. Accessed November 11, 2026.",
    organizationOrJournal: "US National Library of Medicine DailyMed / Hope Pharmaceuticals", authors: ["Hope Pharmaceuticals"], publicationYear: 2024,
    publicationDateNote: "Drug-label revision and DailyMed record update are different dates.", doi: null, pmid: null,
    officialUrl: "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ff4941b3-9901-4aab-adcf-c5327bede34e", sourceClass: "government_guidance",
    licenseLabel: "Manufacturer regulatory label hosted by government; no blanket public-domain claim", reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Targeted verification of the official regulatory safety warning, not a third-party educational corpus. NLM hosting does not establish reuse rights. No label text, packaging, table or image is retained. https://www.nlm.nih.gov/web_policies.html checked for third-party rights.",
    authorityAssessment: "Primary prescribing-information safety warning supports the added oxygen-carriage risk of sodium nitrite in smoke/CO exposure. Does not independently establish comparative patient outcomes.", usageRole: "cross_check",
  },
  {
    id: sid("ema-cyanokit-current"), title: "Cyanokit European regulatory product information",
    completeCitation: "European Medicines Agency. Cyanokit (hydroxocobalamin), Annex I: Summary of Product Characteristics, sections 4.1-4.4. Current public product-information document accessed November 11, 2026.",
    organizationOrJournal: "European Medicines Agency", authors: ["European Medicines Agency"], publicationYear: null,
    publicationDateNote: "A dated revision was not established from the fetched document; access date is not represented as publication date.", doi: null, pmid: null,
    officialUrl: "https://www.ema.europa.eu/en/documents/product-information/cyanokit-epar-product-information_en.pdf", sourceClass: "government_guidance",
    licenseLabel: "Official regulator product information; targeted factual verification", reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Only targeted regulatory facts are used; no product-information expression, label table or commercial image copied. No corpus or broad reuse permission asserted. Primary government regulatory document rather than a manufacturer marketing page.",
    authorityAssessment: "Regulatory indication and smoke-exposure warning support empiric treatment when suspicion is high. The smoke-specific lactate discussion and infusion time differ from abbreviated JTS guidance; this packet teaches neither an exact lactate trigger nor an infusion rate.", usageRole: "both",
  },
  {
    id: sid("atsdr-hydrogen-fluoride-archived"), title: "ATSDR hydrogen fluoride medical management guideline, archived",
    completeCitation: "Agency for Toxic Substances and Disease Registry. Medical Management Guidelines for Hydrogen Fluoride (HF), CAS 7664-39-3. Toxic Substances Portal. Undated archived government page. Accessed November 11, 2026.",
    organizationOrJournal: "ATSDR / Centers for Disease Control and Prevention", authors: ["Agency for Toxic Substances and Disease Registry"], publicationYear: null,
    publicationDateNote: "Archive banner states no longer updated; publication date not provided. Not represented as a current 2026 guideline.", doi: null, pmid: null,
    officialUrl: "https://wwwn.cdc.gov/TSP/MMG/MMGDetails.aspx?mmgid=1142&toxid=250", sourceClass: "government_guidance", licenseLabel: "US government information; archive limitations and CDC conditions", reuseStatus: "public_domain_conditions_apply",
    reuseNotes: "Source: ATSDR/CDC; freely available on agency website. No CDC/ATSDR/HHS/US Government endorsement implied. Agency-material policy checked. No copied dosage table, excerpt, figure, or proprietary poison reference. Archived status retained.",
    authorityAssessment: "Specific government toxicology guidance for systemic fluoride effects and calcium replacement. Cross-checked against current NSW transfer guidance for HF danger and urgent specialist management. Exact dose, concentration, local injection, and intra-arterial ranking remain outside the drafted item.", usageRole: "both",
  },
];

type ClaimInput = { slug: string; statement: string; sources: string[]; category: EvidenceClaim["evidenceCategory"]; limitation: string; certainty?: EvidenceClaim["certainty"] };
const claimInputs: ClaimInput[] = [
  { slug: "depth-pattern", statement: "Blanching, moisture and retained sensation favor shallower dermal injury; a dry nonblanching insensate region raises concern for full-thickness injury.", sources: ["jts-burn-care-2025", "nsw-management-2026"], category: "evaluation", limitation: "Regional and serial examination is necessary; no single bedside finding proves histologic depth." },
  { slug: "serial-depth", statement: "A burn may deepen after its first assessment; peripheral epithelialization does not establish recovery of a poorly perfused central region.", sources: ["nsw-management-2026", "jts-burn-care-2025"], category: "evaluation", limitation: "Constructed serial observations require burn-clinician review; no fixed conversion timeline is asserted." },
  { slug: "local-care", statement: "A minor burn may receive local outpatient wound care and reassessment when wound, pain and follow-up needs fit local capability.", sources: ["nsw-transfer-2026", "nsw-management-2026"], category: "disposition", limitation: "Both NSW publications are from one health system. Local referral arrangements differ; consultation is not synonymous with transfer." },
  { slug: "special-site-referral", statement: "Burns affecting the hand or major joints warrant burn-specialist assessment when depth or function is concerning.", sources: ["nsw-transfer-2026", "jts-burn-care-2025"], category: "disposition", limitation: "Urgency and physical transfer depend on physiology and receiving-team assessment; no automatic operation is implied." },
  { slug: "pain-capability", statement: "A small burn can require specialist care if dressing and analgesia needs exceed the treating clinic's resources.", sources: ["nsw-transfer-2026", "nsw-management-2026"], category: "disposition", limitation: "Single independent health-system source family; no analgesic dose or pain-score threshold is inferred." },
  { slug: "airway-danger", statement: "Progressive voice or breathing changes after enclosed-space smoke exposure require emergency airway-capable assessment even before measured hypoxemia.", sources: ["jts-burn-care-2025", "nsw-transfer-2026"], category: "safety_boundary", limitation: "Facial soot or singed hair in isolation is not a universal mandate for intubation. Clinic action is EMS transfer; hospital airway treatment is reviewed retrospectively." },
  { slug: "airway-sequence", statement: "An evolving obstructed airway takes priority over diagnostic bronchoscopy in a patient with smoke injury.", sources: ["jts-burn-care-2025", "nsw-management-2026"], category: "management", limitation: "No device, induction drug or preemptive-intubation threshold is taught." },
  { slug: "co-oximetry", statement: "Conventional pulse saturation and arterial oxygen tension do not exclude CO poisoning; blood co-oximetry measures carboxyhemoglobin.", sources: ["cdc-co-guidance-2026", "jts-burn-care-2025"], category: "evaluation", limitation: "Venous or arterial blood is acceptable. Oxygen administration and elapsed time change the measured level." },
  { slug: "co-hbo", statement: "Prior loss of consciousness, persistent neurologic abnormalities or cardiac injury can justify hyperbaric consultation despite a low COHb measured after oxygen.", sources: ["cdc-co-guidance-2026"], category: "management", limitation: "One directly verified current clinical source. Consultation for possible HBO is keyed, not a claim of proven universal benefit or mandatory treatment." },
  { slug: "cyanide", statement: "An enclosed-space fire followed by profound lactic acidosis and circulatory collapse can support empiric hydroxocobalamin for suspected cyanide toxicity.", sources: ["jts-burn-care-2025", "ema-cyanokit-current"], category: "management", limitation: "Lactate is not specific; synthetic values are observations, not a new diagnostic threshold. No exact dose, infusion time or universal antidote trigger authored." },
  { slug: "nitrite-boundary", statement: "A methemoglobin-forming cyanide antidote can further compromise oxygen carriage when CO poisoning coexists.", sources: ["dailymed-nithiodote-2025", "jts-burn-care-2025"], category: "safety_boundary", limitation: "Regulatory safety warning, not an absolute prohibition on nitrite use or proof of comparative outcome benefit. Initial JTS-only support gap was repaired by targeted official-label verification." },
  { slug: "bronchoscopy", statement: "After airway stabilization, bronchoscopy can directly assess and grade smoke-related lower-airway injury when an initial chest radiograph is unrevealing.", sources: ["jts-burn-care-2025"], category: "evaluation", limitation: "One directly verified guideline; CT and radiography assess other injury patterns and are not substitutes for direct airway examination." },
  { slug: "tbsa", statement: "Epidermal erythema is excluded from the partial/full-thickness TBSA used in burn-resuscitation estimates.", sources: ["nsw-foundations-2025", "nsw-management-2026", "jts-burn-care-2025"], category: "evaluation", limitation: "Fictional regional percentages are supplied in the case; no protected body diagram or age-proportion algorithm is reproduced." },
  { slug: "fluid-titration", statement: "An initial burn-fluid estimate must be adjusted to serial urine output and perfusion rather than delivered unchanged despite evidence of excessive resuscitation.", sources: ["jts-burn-care-2025", "nsw-management-2026"], category: "management", limitation: "Guidelines use different initial formulas and urine targets. No universal starting multiplier, exact titration percentage or electrical-injury output target is keyed." },
  { slug: "specified-fluid-formula", statement: "NSW guidance describes a starting estimate of 3 mL/kg per percent dermal-burn TBSA over the first day, with half allocated during the first eight hours measured from injury.", sources: ["nsw-management-2026", "nsw-foundations-2025"], category: "management", limitation: "One regional protocol, explicitly supplied as this fictional hospital's worksheet. Not a universal Parkland/ABA/JTS formula. Patient arithmetic is constructed; subsequent titration is a separate decision." },
  { slug: "limb-escharotomy", statement: "A restrictive circumferential deep thermal burn with worsening distal perfusion despite adequate systemic resuscitation may require escharotomy.", sources: ["jts-burn-care-2025", "nsw-escharotomy-2025"], category: "management", limitation: "Reassess dressings, elevation and perfusion; skin release does not treat every deep muscle-compartment problem." },
  { slug: "chest-escharotomy", statement: "Circumferential deep chest-wall burns can restrict ventilation and require chest escharotomy when the mechanical restriction is clinically significant.", sources: ["jts-burn-care-2025", "nsw-escharotomy-2025"], category: "management", limitation: "Tube obstruction, pneumothorax and parenchymal disease remain alternatives; the constructed record supplies relevant checks without an exact pressure cutoff." },
  { slug: "electrical-muscle", statement: "A small skin wound after high-voltage injury can conceal major muscle damage with pigmenturia and kidney risk.", sources: ["jts-burn-care-2025", "nsw-management-2026"], category: "evaluation", limitation: "Skin TBSA does not quantify electrical deep-tissue damage. No exact voltage or CK threshold is needed." },
  { slug: "electrical-fasciotomy", statement: "High-voltage muscle injury can cause a deep compartment syndrome requiring fascial decompression rather than skin eschar release.", sources: ["jts-burn-care-2025"], category: "management", limitation: "Single directly verified source. The draft includes serial compartment findings; a separate current JTS compartment guideline supports the examination. No numerical pressure cutoff is authored." },
  { slug: "compartment-examination", statement: "Progressive pain on passive muscle stretch and weakness after a substantial extremity injury can indicate compartment syndrome even when arterial pulses remain present.", sources: ["jts-compartment-2026"], category: "evaluation", limitation: "One current government guideline. Tension alone is not a reliable exclusion test; no single symptom or numerical pressure cutoff is treated as definitive." },
  { slug: "ventilator-mechanics", statement: "A rise in both peak and plateau pressure favors reduced respiratory-system compliance, whereas an isolated peak rise can reflect increased flow resistance.", sources: ["jts-ventilation-2025"], category: "evaluation", limitation: "Context only for the burn chest-release decision. Requires an interpretable passive measurement; no pressure target or general ventilator-management question is authored." },
  { slug: "chemical-decontamination", statement: "Dry chemical residue should be removed before copious irrigation; routine acid-base neutralization on skin can cause further injury.", sources: ["jts-burn-care-2025", "nsw-transfer-2026"], category: "management", limitation: "Ranked research gap only; no scored dry-powder item added in this packet. Specific agents can need additional toxicology advice." },
  { slug: "hf-systemic", statement: "Systemic fluoride absorption can lower calcium and magnesium and disturb potassium, causing neuromuscular and cardiac toxicity.", sources: ["atsdr-hydrogen-fluoride-archived", "nsw-transfer-2026"], category: "presentation", limitation: "Archived ATSDR physiology cross-checked against current transfer guidance; local burn size alone does not establish systemic safety." },
  { slug: "hf-calcium", statement: "Systemic hypocalcemia after HF exposure is treated with intravenous calcium under ECG and electrolyte surveillance.", sources: ["atsdr-hydrogen-fluoride-archived"], category: "management", limitation: "One directly verified specific treatment source, explicitly archived. Exact dose, concentration and local/intra-arterial pathways are withheld; clinician/toxicology review required." },
  { slug: "early-enteral", statement: "Extensive-burn patients unable to eat may receive early enteral nutrition after resuscitation when the gastrointestinal tract is usable.", sources: ["nsw-foundations-2025", "esicm-early-enteral-2017"], category: "management", limitation: "No exact-hour cutoff or full-calorie prescription authored. Older critical-care guidance and one current regional source are not two new burn trials." },
  { slug: "quiet-bowel-sounds", statement: "Absent or quiet bowel sounds alone do not establish an enteral-feeding contraindication after perfusion recovery.", sources: ["esicm-early-enteral-2017"], category: "management", limitation: "Single older society guideline, weak recommendation. Obstruction, bowel ischemia and uncontrolled shock remain separate contraindications." },
  { slug: "feeding-deterioration", statement: "New uncontrolled shock or concern for intestinal ischemia warrants pausing enteral delivery during urgent reassessment.", sources: ["esicm-early-enteral-2017"], category: "safety_boundary", limitation: "Single older society guideline; low-certainty expert guidance. A postpyloric tube does not restore bowel perfusion. No pressor cutoff or automatic immediate PN prescription follows." },
  { slug: "deep-burn-closure", statement: "Deep burn regions commonly need removal of nonviable tissue and coverage, while viable epithelializing regions can be preserved.", sources: ["nsw-management-2026", "jts-burn-care-2025"], category: "management", limitation: "No fixed excision day or predetermined graft area is imposed; a burn surgeon must confirm regional depth and readiness." },
  { slug: "temporary-allograft", statement: "Cadaveric allograft can temporarily cover an excised extensive burn when the patient's available donor skin is insufficient for immediate autografting.", sources: ["nsw-management-2026", "nsw-foundations-2025"], category: "management", limitation: "One independent health-system source family. Not a general graft-take question; product comparisons and mandatory timing of replacement are outside scope." },
  { slug: "systemic-antibiotics", statement: "Systemic antimicrobial treatment is reserved for burn infection or another indication rather than routine prophylaxis of a clinically uninfected burn.", sources: ["jts-burn-care-2025", "nsw-management-2026"], category: "management", limitation: "A positive surface swab alone does not establish invasive infection. No numeric fever cutoff or empiric regimen is taught." },
  { slug: "surface-culture-context", statement: "A colonized burn wound that continues to heal without clinical infection can be managed with local antimicrobial wound care and reassessment rather than automatic systemic antibiotics.", sources: ["nhs-northern-burns-2026", "jts-burn-care-2025"], category: "management", limitation: "Delayed healing, tissue deterioration or clinical infection changes the decision; this is not a rule to dismiss every positive culture or invasive organism." },
  { slug: "postpyloric-boundary", statement: "A postpyloric route may address persistent gastric delivery problems but is not a workaround for suspected bowel ischemia or uncontrolled shock.", sources: ["esicm-early-enteral-2017"], category: "management", limitation: "One older society guideline; exact aspirate thresholds and advancement protocols are not authored." },
];

// Round-two targeted verification adds atoms; the reviewed v1 atoms stay exact.
sourceInputs.push(
  {
    id: sid("nsw-ecat-burns-current"), title: "NSW adult ECAT burns protocol",
    completeCitation: "NSW Agency for Clinical Innovation, Emergency Care Institute. Burns: Adult ECAT protocol. Emergency care assessment and treatment. Current online protocol; publication date not stated in retrieved page. Accessed 11 November 2026.",
    organizationOrJournal: "NSW Agency for Clinical Innovation / Emergency Care Institute", authors: ["NSW Agency for Clinical Innovation", "Emergency Care Institute"],
    publicationYear: null, publicationDateNote: "No document-level publication date established; search-index timestamps are not treated as publication dates.", doi: null, pmid: null,
    officialUrl: "https://aci.health.nsw.gov.au/ecat/adult/burns", sourceClass: "government_guidance",
    licenseLabel: "Crown copyright; targeted factual verification", reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: aciRights.replace("CC BY-ND 4.0 on the document; ", "No page-specific CC license established; "),
    authorityAssessment: "Government acute-care protocol supports avoiding circumferential dressings and reassessing distal neurovascular status. No nursing medication standing-order doses or procedural thresholds are generalized.", usageRole: "cross_check",
  },
  {
    id: sid("uk-defence-renal-2026"), title: "UK Defence Medical Command: deployed renal failure, June 2026 review",
    completeCitation: "UK Defence Medical Command. Deployed Management of Renal Failure. Clinical Guidelines for Operations. Last reviewed 16 June 2026; next review 16 June 2027. Accessed 11 November 2026.",
    organizationOrJournal: "UK Defence Medical Command / Ministry of Defence", authors: ["UK Defence Medical Command"], publicationYear: 2026,
    publicationDateNote: "16 June 2026 is the explicit clinical review date, not an asserted original publication date.", doi: null, pmid: null,
    officialUrl: "https://cgo.mod.uk/clinical-guidelines-for-operations/treatment-guidelines/critical-care/deployed-management-of-renal-failure/",
    sourceClass: "government_guidance", licenseLabel: "Government guidance; no page-specific reusable license established", reuseStatus: "copyrighted_targeted_verification_only",
    reuseNotes: "Targeted factual reading of official government guidance only. Page and site navigation checked; no page-specific license or automated/AI-use prohibition was found in the retrieved material. No blanket public-domain/OGL permission inferred, no source text or treatment algorithm retained or adapted, no dose/output target reused. Medical authority is separate from these rights limitations.",
    authorityAssessment: "Current operational government guidance explicitly separates hypovolaemia from intrinsic renal injury with oliguria despite fluids and recommends conservative fluid after euvolaemia. Cross-checks the JTS warning against over-resuscitation. Operational targets and bicarbonate/dialysis regimens are not imported.", usageRole: "both",
  },
);
claimInputs.push(
  { slug: "r2-external-constriction", statement: "Constricting circumferential burn dressings can impair distal circulation; remove an external constriction and reassess neurovascular findings before attributing it to burn eschar or deep muscle compartments.", sources: ["nsw-ecat-burns-current", "nsw-escharotomy-2025"], category: "management", limitation: "One health-system source family. The exact first response is an anatomic/chronologic synthesis of dressing precautions and escharotomy indications; persistent compromise requires urgent specialist escalation, not repeated dressing trials." },
  { slug: "r2-procedural-response", statement: "Burn procedural analgesia should be assessed during the actual dressing procedure after premedication has taken effect; resting comfort alone does not establish adequate wound-care tolerance.", sources: ["nsw-management-2026", "nsw-transfer-2026"], category: "evaluation", limitation: "One health-system source family. A completed observed procedure supports a local care arrangement only for comparable future care; no drug dose, onset interval or guarantee of future tolerance is asserted." },
  { slug: "r2-oliguria-volume-context", statement: "Persistent oliguria after muscle injury does not by itself justify repeated fluid escalation when systemic perfusion has recovered and fluid is accumulating; reassess renal injury, drainage and volume status and limit further unnecessary crystalloid.", sources: ["uk-defence-renal-2026", "jts-burn-care-2025"], category: "management", limitation: "Direction-only decision after documented volume assessment. No urine target, exact fluid reduction, mandatory diuretic or dialysis prescription is inferred. No dynamic-test threshold is invented." },
  { slug: "r2-airway-debris", statement: "After smoke injury and airway stabilization, bronchoscopy can inspect the lower airway and remove retained carbonaceous material or casts contributing to airway obstruction.", sources: ["jts-burn-care-2025"], category: "management", limitation: "Single current guideline. Ventilator mechanics and tube/pleural checks localize the constructed problem; bronchoscopy is not a substitute for initial airway stabilization." },
  { slug: "r2-inhalation-resistance", statement: "During valid passive ventilator measurements, a rising peak pressure with unchanged plateau pressure favors increased flow resistance rather than a new compliance problem.", sources: ["jts-ventilation-2025"], category: "evaluation", limitation: "Single government guideline; applied only to the burn-specific lower-airway complication here. Values are paired fictional measurements, not clinical pressure targets. The original chest-release-context atom remains unchanged." },
  { slug: "r2-airway-localization", statement: "Assessment of new ventilatory difficulty includes tube position and patency and pleural causes before attributing the problem to material beyond the endotracheal tube.", sources: ["jts-ventilation-2025", "jts-burn-care-2025"], category: "evaluation", limitation: "Government-guideline clinical synthesis. A passing catheter or one pleural observation alone does not exclude every tube or pleural problem; the full acquired pattern determines the preferred procedure." },
  { slug: "r2-excision-bed", statement: "Before burn graft coverage, residual nonviable eschar is removed to prepare a viable bleeding recipient bed; temporary coverage does not make retained dead tissue an adequate recipient bed.", sources: ["nsw-foundations-2025", "nsw-management-2026"], category: "management", limitation: "One health-system source family. No exact excision depth, schedule or product ranking is taught. The full constructed operative plan requires burn-surgeon review." },
  { slug: "r2-gastric-intolerance", statement: "After perfusion is controlled, persistent large gastric aspirates despite prokinetic treatment can support postpyloric enteral feeding if bowel ischemia or obstruction is not suspected.", sources: ["esicm-early-enteral-2017"], category: "management", limitation: "Single older society guideline; weak/low-certainty recommendation. Fictional aspirate volumes are observations, not a newly invented threshold. Exact tube-placement technique and feeding advancement remain outside scope." },
);

export const BURNS_INHALATION_TOPIC_CLAIMS: EvidenceClaim[] = claimInputs.map(c => ({ ...draft,
  id: cid(c.slug), statement: c.statement, sourceIds: c.sources.map(sid), evidenceCategory: c.category,
  certainty: c.certainty ?? "moderate", limitation: c.limitation,
  applicablePopulation: "Adults with the specified thermal, smoke, electrical or chemical injury; hospital decisions are reviewed from clinic.", lastCheckedOn: "2026-11-11",
}));
export const BURNS_INHALATION_TOPIC_SOURCES: ClinicalSource[] = sourceInputs.map(s => ({ ...draft, ...s,
  accessedOn: "2026-11-11", evidenceClaimIds: BURNS_INHALATION_TOPIC_CLAIMS.filter(c => c.sourceIds.includes(s.id)).map(c => c.id),
}));

export interface BurnsOptionDraft {
  id: string; label: string; rationale: string; claimSlugs: string[];
  temptation: string; whenReasonable: string; timingProfileId?: string;
}
export interface BurnsNodeDraft {
  slug: string; conceptId: string; previousConceptId?: string; conceptMeaning: "preserved" | "new" | "changed";
  displayName: string; learningObjective: string; conceptType: TestedConcept["conceptType"];
  role: "rewrite" | "replacement" | "gap"; replacesVariantIds: string[];
  currentUpdate?: string; exhibit?: CaseExhibit; stem: string; options: BurnsOptionDraft[]; explanation: string; claimSlugs: string[];
  reasoningSteps: [string, string]; closestError: string; decidingObservation: string; counterfactual: string;
  deletionCheck: string; cueAttack: string; categoryCheck: string; difficulty: string; sequenceCheck: string;
}
export interface BurnsCaseDraft {
  slug: string; name: string; age: number; sex: "Female" | "Male"; complaint: string; presentation: string;
  historicalAcuity: "stable" | "urgent_stable" | "obvious_emergency"; nodes: BurnsNodeDraft[];
}
const option = (id: string, label: string, rationale: string, claimSlugs: string[], temptation: string, whenReasonable: string, timingProfileId?: string): BurnsOptionDraft =>
  ({ id, label, rationale, claimSlugs, temptation, whenReasonable, ...(timingProfileId ? { timingProfileId } : {}) });
const table = (columnHeaders: string[], rowHeaders: string[], cells: string[][]): CaseExhibit =>
  ({ kind: "table", caption: "Constructed teaching record; fictional patient observations", columnHeaders, rowHeaders, cells });

export const BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS: BurnsCaseDraft[] = [
  {
    slug: "limited-scald", name: "Mara Ellis", age: 43, sex: "Female", complaint: "Scald wound review", historicalAcuity: "stable",
    presentation: "{patientName}, a 43-year-old woman, attends clinic after a scald to her upper arm and lateral trunk. The wound map records moist pink blistered skin over 2% of body surface and intact red skin over another 12%. The blistered region blanches briskly and remains tender. Oral analgesia permits dressing changes, and she has attended her arranged follow-up visits.",
    nodes: [{
      slug: "limited-scald-disposition", conceptId: "concept.burn.referral-consultation-selection", conceptMeaning: "preserved", displayName: "Choose local care versus transfer after a scald", conceptType: "disposition",
      learningObjective: "Integrate dermal burn extent, depth and care needs when choosing a burn disposition.", role: "rewrite", replacesVariantIds: ["question.burn.referral-consultation-selection.v1"],
      stem: "Which disposition best fits {patientName}'s scald at this clinic review?",
      options: [
        option("local", "Burn-service consultation with local wound follow-up", "The dermal component is small, with preserved blanching and manageable wound care. The larger intact erythematous area does not establish a large dermal burn requiring transfer.", ["depth-pattern", "tbsa", "local-care"], "Recognize a burn-service consultation can support local care.", "This record supports this plan; reassess if depth, pain or function changes."),
        option("admit", "Burn-service consultation with inpatient burn admission", "Counting every red area as dermal injury exaggerates severity. Current depth, function and care requirements do not establish a need for inpatient admission.", ["tbsa", "local-care"], "Use the combined 14% visible skin change to justify inpatient treatment.", "A genuinely extensive dermal burn or wound-care needs beyond outpatient resources could support admission."),
        option("emergency", "Burn-service consultation with emergency hospital transfer", "There is no physiologic or limb-threatening feature in the recorded course to justify emergency retrieval over planned ambulatory co-management.", ["local-care", "special-site-referral"], "Treat the large red area as an emergency burn regardless of depth.", "New airway compromise, circulatory instability or compromised limb perfusion would change urgency."),
      ],
      explanation: "First separate dermal injury from epidermal erythema. Then match the actual wound and care needs to an outpatient pathway. Consultation can help local management; it does not make every scald an inpatient transfer.", claimSlugs: ["depth-pattern", "tbsa", "local-care", "special-site-referral"],
      reasoningSteps: ["Infer that only the blistered 2% represents the dermal component used in the relevant severity estimate.", "Combine that extent with preserved wound findings and feasible wound care to choose local co-management."],
      closestError: "Admit on the basis of 14% red skin without distinguishing its depth.", decidingObservation: "The additional 12% is intact erythema; dressing care is being completed locally.",
      counterfactual: "If the additional region were blistered dermal injury rather than intact erythema, specialist transfer/admission assessment would replace this uncomplicated local pathway.",
      deletionCheck: "The two regional descriptions distinguish the extent error; blanching distinguishes depth; tolerated dressings and attended reviews establish ambulatory feasibility. Removed the former list of every absent special site. A final anatomic attack corrected the 14% combined red area from one arm to upper arm plus lateral trunk; the original regional allocation was not plausible. Re-solved the same dermal-versus-erythema decision after that repair.",
      cueAttack: "Covered the key: all three options include the same consultation wording and differ only in disposition. No option claims to omit burn input. The task does not name outpatient eligibility. Numbers require depth interpretation rather than key-label matching.",
      categoryCheck: "Three burn-service disposition plans at the same decision point.", difficulty: "Predicted moderate: a resident can overcount epidermal erythema and over-transfer despite seeing a large total red area.",
      sequenceCheck: "Standalone; no preceding depth-label answer or explanation is shown.",
    }],
  },
  {
    slug: "hand-referral", name: "Elena Price", age: 43, sex: "Female", complaint: "Hand wound review", historicalAcuity: "urgent_stable",
    presentation: "{patientName}, a 43-year-old woman, attends clinic after a hot-oil burn across the back of her hand and finger joints. The wound is mottled white and red, with sluggish blanching and little response to light touch. Finger flexion is restricted by the wound. The fingers remain warm with brisk nail-bed refill and unchanged Doppler signals.",
    nodes: [{
      slug: "deep-hand-referral", conceptId: "concept.burn.referral-consultation-selection", conceptMeaning: "preserved", displayName: "Refer a functionally important deep hand burn", conceptType: "disposition",
      learningObjective: "Interpret wound depth and hand function to select prompt burn-specialist assessment without confusing referral with emergency decompression.", role: "rewrite", replacesVariantIds: ["question.burn.referral-consultation-selection.v2"],
      stem: "Which referral plan best fits {patientName}'s hand examination at this clinic visit?",
      options: [
        option("burn", "Arrange prompt assessment by the burn surgical service", "The depth pattern and joint involvement need specialist planning even though distal circulation is maintained.", ["depth-pattern", "special-site-referral"], "Recognize deep hand injury without requiring a large burn area.", "This is appropriate here; the burn team determines transfer and operative needs."),
        option("clinic", "Arrange continued dressings through the general clinic", "A small surface area does not remove the functional and depth concern over hand joints.", ["special-site-referral", "local-care"], "Let limited burn size outweigh depth and function.", "A shallow, epithelializing wound with preserved movement and manageable care could remain on this pathway."),
        option("vascular", "Arrange emergency assessment by the vascular surgical service", "Reduced wound sensation can reflect depth; the recorded distal perfusion does not support an arterial emergency as the primary referral target.", ["depth-pattern", "limb-escharotomy"], "Interpret reduced skin sensation as distal ischemia requiring a different emergency service.", "An acutely cold digit with worsening refill or disappearing Doppler signals would require emergency perfusion assessment."),
      ],
      explanation: "Infer a deeper dermal injury from the regional wound findings, then apply the hand/joint consequence. Preserved distal circulation does not make the burn shallow, but it separates this specialist referral from a current constrictive perfusion emergency.", claimSlugs: ["depth-pattern", "special-site-referral", "local-care", "limb-escharotomy"],
      reasoningSteps: ["Interpret pallor, sluggish blanching and reduced skin sensation as concerning for deeper injury.", "Use joint-area functional restriction to choose prompt burn surgical assessment while distinguishing the perfusion pathway."],
      closestError: "Continue local care because the wound is small, or misroute reduced sensation as primary arterial ischemia.", decidingObservation: "Depth signs and restricted joint motion coexist with preserved distal perfusion.",
      counterfactual: "Replace the central depth findings with a pink briskly blanching epithelializing wound and unrestricted motion: continued clinic dressings becomes reasonable.",
      deletionCheck: "Depth signs establish the injury, joint motion determines its consequence, and distal findings distinguish the competing emergency referral. No absence-of-inhalation padding remains.",
      cueAttack: "The complaint does not say deep burn. Options name three services/plans at the referral stage, with no rationale in labels. Covering the task leaves genuine depth-versus-perfusion interpretation.",
      categoryCheck: "Three referral/follow-up plans, each with a specific treating service.", difficulty: "Predicted moderate: depth-related sensory loss competes with a perfusion interpretation and the small-area local-care heuristic.",
      sequenceCheck: "Standalone; no preceding question names the burn depth.",
    }],
  },
  {
    slug: "smoke-disposition", name: "Nora Bell", age: 43, sex: "Female", complaint: "Fire follow-up", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 43-year-old woman, reviews her outside urgent-care record in clinic after a house fire. At the recorded visit her skin burns were limited to a small facial area. She initially spoke normally; during the visit her voice became coarse and she began pausing between phrases to breathe. Finger oxygen saturation remained 98%.",
    nodes: [{
      slug: "smoke-emergency-disposition", conceptId: "concept.burn.referral-consultation-selection", conceptMeaning: "preserved", displayName: "Escalate a changing airway after smoke exposure", conceptType: "disposition",
      learningObjective: "Use an evolving airway trajectory rather than skin size or pulse saturation to select emergency transfer.", role: "rewrite", replacesVariantIds: ["question.burn.referral-consultation-selection.v3"],
      stem: "Which transfer plan was appropriate when {patientName}'s voice and breathing changed in the outside urgent-care record?",
      options: [
        option("ems", "EMS transfer to emergency care with burn-team coordination", "The progressive voice and breathing changes require airway-capable emergency care; normal pulse saturation does not remove that risk.", ["airway-danger"], "Recognize evolving airway danger despite a small burn and a normal saturation.", "This record supports emergency monitored transfer."),
        option("car", "Private-car transfer to a same-day burn-clinic assessment", "A same-day specialist destination does not provide monitored stabilization during an evolving airway problem.", ["airway-danger", "special-site-referral"], "Recognize the need for a burn service but choose an unmonitored route because saturation is normal.", "A stable patient needing prompt wound assessment without evolving airway or circulatory abnormalities might use a planned ambulatory route."),
        option("scheduled", "Scheduled transfer to the next ambulatory burn appointment", "A future wound appointment does not address progressive breathing abnormalities at the recorded visit.", ["airway-danger", "local-care"], "Let small cutaneous burn size govern the entire disposition.", "A minor superficial injury with a stable respiratory course and feasible wound care may be managed by arranged outpatient follow-up."),
      ],
      explanation: "Interpret the changing voice and breathing as an evolving airway risk, then choose a transport pathway that can provide emergency stabilization. The founder is reviewing a past outside visit; the clinic is not being represented as an emergency department.", claimSlugs: ["airway-danger", "special-site-referral", "local-care"],
      reasoningSteps: ["Infer an evolving airway problem from the progression during the visit despite normal measured saturation.", "Choose emergency monitored transfer rather than a wound-only ambulatory pathway."],
      closestError: "Send by private car to a burn clinic because saturation and skin area appear reassuring.", decidingObservation: "New voice change and breath interruption developed during observation.",
      counterfactual: "If speech and breathing remained unchanged and normal throughout an appropriate assessment, a same-day ambulatory burn review could replace emergency transport.",
      deletionCheck: "Small skin area and saturation are competing severity cues; the time course is decisive. Removed soot and multiple redundant respiratory alarms from the old version.",
      cueAttack: "All choices name a transport/destination plan. The normal saturation is not a permission sentence; the resident must distinguish oxygen measurement from airway trajectory. The task does not label inhalation injury.",
      categoryCheck: "Three transfer pathways; no topical-care-versus-airway category mismatch.", difficulty: "Predicted moderate safety application: the close wrong plan provides rapid burn review but the wrong transport support. Independent reviewers must confirm the difficulty; no basic exception is claimed.",
      sequenceCheck: "Standalone historical chart review; no previous airway feedback supplies the transfer answer.",
    }],
  },
  {
    slug: "procedural-pain", name: "Leah Morgan", age: 43, sex: "Female", complaint: "Dressing pain", historicalAcuity: "urgent_stable",
    presentation: "{patientName}, a 43-year-old woman, attends clinic for a small moist, pink torso scald. She sleeps between dressing changes after oral analgesia. Two attempts to remove the adherent dressing have stopped because she pulls away in pain, leaving part of the wound unexamined. The clinic provides oral analgesia and routine dressings; it has no monitored procedural-sedation service.",
    nodes: [{
      slug: "pain-exceeds-clinic", conceptId: "concept.burn.referral-consultation-selection", conceptMeaning: "preserved", displayName: "Match procedural burn care to capability", conceptType: "disposition",
      learningObjective: "Distinguish controlled background pain from unsuccessful procedural care when selecting a burn referral.", role: "rewrite", replacesVariantIds: ["question.burn.referral-consultation-selection.v4"],
      stem: "Which care arrangement best fits {patientName}'s next wound examination and dressing change?",
      options: [
        option("burn", "Burn-service assessment for monitored procedural wound care", "Resting comfort does not establish tolerance of the procedure. Repeated incomplete dressing care exceeds this clinic's analgesia and monitoring capability.", ["pain-capability"], "Recognize the procedural need rather than infer all pain is controlled from sleep at rest.", "This record warrants specialist assessment; the burn service chooses the analgesia technique."),
        option("clinic", "Clinic dressing changes after the current oral premedication", "The same plan has twice prevented completion of examination and dressing care.", ["pain-capability", "local-care"], "Treat a small superficial-appearing burn as automatically suitable for routine clinic care.", "A completed dressing procedure with tolerable pain would support local follow-up."),
        option("home", "Home dressing changes after the current oral premedication", "Moving the incompletely tolerated procedure home does not supply the missing procedural support or complete the wound assessment.", ["pain-capability", "local-care"], "Use reassuring resting comfort as evidence that home wound care will succeed.", "Successful supervised self-care with adequate analgesia and a fully assessed wound can support home dressings."),
      ],
      explanation: "Separate background comfort from the actual procedure attempted. The failed dressing removals leave wound assessment incomplete; the next care setting must meet that procedural requirement. Burn size alone does not establish outpatient capability.", claimSlugs: ["pain-capability", "local-care"],
      reasoningSteps: ["Interpret sleeping at rest and interrupted dressing removal as different functional evidence.", "Match the uncompleted procedure to the clinic's actual monitoring and analgesia capability."],
      closestError: "Continue oral-premedicated routine care because the burn is small and the patient rests comfortably.", decidingObservation: "Two procedures stopped before the wound could be fully examined.",
      counterfactual: "If the latest removal and examination were completed with tolerable pain after oral premedication, continued clinic care would become reasonable.",
      deletionCheck: "Resting comfort creates the competing inference; failed procedures establish the unmet need; the service description determines feasibility. No generic 'appropriate analgesia failed' conclusion is supplied.",
      cueAttack: "The key is a specific assessment/care arrangement, not a uniquely comprehensive 'individualized' plan. All choices state wound-care setting and analgesia scope. No exact sedation method is preselected.",
      categoryCheck: "Three arrangements for the same next dressing procedure.", difficulty: "Predicted moderate: requires interpreting actual procedural performance against a reassuring resting state.",
      sequenceCheck: "Standalone, with no prior explanation defining uncontrolled procedural pain.",
    }],
  },
  {
    slug: "changing-hand", name: "Julian Reed", age: 38, sex: "Male", complaint: "Hand burn check", historicalAcuity: "urgent_stable",
    presentation: "{patientName}, a 38-year-old man, returns to clinic after a hot-oil burn crossing the dorsal finger joints. The burn service initially arranged clinic dressings and hand exercises. He reports less overall pain. The central wound remains open while its edge has developed small islands of new epithelium. The fingers are warm with unchanged Doppler signals.",
    nodes: [{
      slug: "serial-hand-depth", conceptId: "concept.n1.burn-evolving-hand-depth-reassessment", conceptMeaning: "preserved", displayName: "Reassess a regionally changing hand burn", conceptType: "management",
      learningObjective: "Use serial central versus peripheral wound findings to reconsider the prior hand-burn care plan.", role: "rewrite", replacesVariantIds: ["question.n1.burn-depth-reassessment.v3"],
      exhibit: table(["Central surface", "Central blanching", "Light-touch response"], ["First visit", "Current visit"], [["Moist and pink", "Brisk", "Painful"], ["Pale and dry", "Minimal", "Little response"]]),
      stem: "Which change to {patientName}'s hand-burn plan is supported by the current clinic findings?",
      options: [
        option("assess", "Obtain a new burn-surgical assessment of the wound", "Peripheral epithelialization and less pain do not resolve a central region becoming pale, dry and less responsive. The prior plan needs reconsideration.", ["serial-depth", "special-site-referral"], "Interpret central and peripheral regions separately.", "This record supports a new assessment; it does not predetermine excision or grafting."),
        option("dress", "Continue the existing clinic dressings and exercise schedule", "The healing edge does not establish recovery of the changed central region across important joints.", ["serial-depth", "local-care"], "Interpret falling global pain as uncomplicated healing everywhere.", "A central wound retaining brisk blanching and progressing epithelialization would support the existing plan."),
        option("release", "Arrange emergency release of circumferential burn eschar", "A depth change is not itself a restrictive circumferential perfusion problem. The described dorsal injury and preserved distal findings do not establish that operative indication.", ["limb-escharotomy", "depth-pattern"], "Equate a deeper dry center with any indication for escharotomy.", "A circumferential deep burn with declining distal perfusion despite appropriate assessment would support emergency eschar release."),
      ],
      explanation: "Read each wound region and its trajectory. The center's loss of blanching and touch response can represent worsening depth despite a healing edge. Reconsult the burn surgical service for the changed hand injury. Escharotomy addresses mechanical restriction, not depth alone.", claimSlugs: ["serial-depth", "depth-pattern", "special-site-referral", "limb-escharotomy", "local-care"],
      reasoningSteps: ["Infer a concerning central depth trajectory rather than generalized healing from lower overall pain.", "Change the specialist assessment plan for the joint-area wound, while separating depth assessment from emergency skin decompression."],
      closestError: "Continue the old plan because the edge heals, or select escharotomy simply because the center is deeper.", decidingObservation: "Serial central blanching/sensation deteriorate while distal circulation remains preserved.",
      counterfactual: "If central blanching remained brisk and epithelialization advanced across the center, continuing dressings and therapy would replace repeat surgical depth assessment.",
      deletionCheck: "Deleting the serial exhibit removes the changed-depth inference; deleting distal circulation reopens the decompression ambiguity. Removed a key-revealing clinic-availability sentence from N1 v3.",
      cueAttack: "Complaint and task do not say deepening. The central-versus-edge conflict is required, not rationale paraphrase. Surgical assessment and eschar release are specific actions with distinct indications. The old unsupported distractor now has fresh decompression claims; its historical source hold remains recorded.",
      categoryCheck: "Three next burn-care plans; no exact graft decision is ranked before specialist assessment.", difficulty: "Predicted moderate/hard because lower pain and peripheral healing compete with serial central deterioration.",
      sequenceCheck: "Standalone. Do not pair immediately after a pure depth-label node whose feedback teaches this referral answer.",
    }],
  },
];

BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS.push(
  {
    slug: "fluid-record", name: "Aaron Cole", age: 47, sex: "Male", complaint: "Burn admission review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 47-year-old man, reviews his outside burn-unit admission with the founder in clinic. At arrival he weighed 70 kg and was four hours from the injury. The transport record documented 800 mL of crystalloid already given. The following wound map and starting-fluid worksheet were recorded before the infusion was prescribed.",
    nodes: [
      {
        slug: "resuscitation-clock-and-area", conceptId: "concept.topic.burns-inhalation.resuscitation-clock-area.v1", conceptMeaning: "new", displayName: "Reconcile burn extent and the resuscitation clock", conceptType: "management",
        learningObjective: "Use only dermal-burn extent, elapsed time from injury and prior fluid when applying a specified burn-fluid starting estimate.", role: "gap", replacesVariantIds: [],
        exhibit: table(["Recorded observations"], ["Region A: 14% body surface", "Region B: 8% body surface", "Region C: 12% body surface", "Hospital starting worksheet"], [["Moist blistered wound; pink and tender"], ["Dry nonblanching wound; little touch response"], ["Intact red skin; brisk blanching; no blisters"], ["3 mL/kg per percent dermal-burn TBSA over the first day; half during the first eight hours from injury; subtract fluid already given from that allocation"]]),
        stem: "Using the outside hospital's stated worksheet, which starting infusion rate should have been recorded for {patientName} at arrival, rounded to the nearest whole mL/hour?",
        options: [
          option("378", "Crystalloid at 378 mL/hour", "Count 14% plus 8%, giving 22%. The first allocation is 3 × 70 × 22 / 2 = 2310 mL. Subtract 800 mL, then divide the remaining 1510 mL by the four hours remaining: 377.5 mL/hour.", ["tbsa", "specified-fluid-formula"], "Apply both the depth boundary and the injury-based clock.", "This is the specified worksheet result, not a universal burn-unit starting rate."),
          option("693", "Crystalloid at 693 mL/hour", "This result counts the additional epidermal erythema: (3 × 70 × 34 / 2 − 800) / 4 = 692.5. The intact red region does not belong in this dermal-burn estimate.", ["tbsa", "specified-fluid-formula"], "Correct the clock but overestimate TBSA by counting all visible redness.", "The rate would follow this worksheet if Region C were also a dermal burn."),
          option("189", "Crystalloid at 189 mL/hour", "This result restarts an eight-hour window at arrival: (2310 − 800) / 8 = 188.75. The supplied worksheet measures time from the injury.", ["specified-fluid-formula"], "Use the correct TBSA but restart the resuscitation clock at hospital arrival.", "With eight hours genuinely remaining in the defined allocation period, this divisor could be appropriate."),
        ],
        explanation: "The dermal-burn total is 22%, not the 34% of visibly changed skin. The worksheet's first allocation is 2310 mL; 1510 mL remains after transport fluid. Four hours remain in its injury-based window, giving 377.5, rounded to 378 mL/hour. This calculation applies only to the specified worksheet.", claimSlugs: ["tbsa", "depth-pattern", "specified-fluid-formula"],
        reasoningSteps: ["Interpret the three regional wound descriptions and include partial- and full-thickness regions while excluding intact epidermal erythema.", "Apply the hospital's stated allocation from injury time, credit the recorded transport fluid and prescribe the remaining hourly rate."],
        closestError: "Use the correct clock with all red skin, or the correct burn area with an arrival-based clock.", decidingObservation: "Region C has no dermal injury; four of the eight injury-based hours and 800 mL have already occurred.",
        counterfactual: "If Region C had dermal injury, 693 becomes the matching worksheet result. If time zero were the injury with a full allocation window remaining, the elapsed-time computation would change.",
        deletionCheck: "Every number contributes to area, allocation or remaining-time arithmetic. Removed unrelated vital signs; no empirical efficacy or probability is attributed to the constructed values.",
        cueAttack: "All labels are the same fluid/rate category and unit. Two wrong numbers each implement a credible clinical calculation error. The explicit protocol prevents a contest between differing contemporary starting formulas.",
        categoryCheck: "Three starting crystalloid infusion prescriptions under one supplied hospital protocol.", difficulty: "Predicted hard: combines depth-dependent extent with prior fluid and an injury-based clock; arithmetic is exact enough to re-solve without hidden assumptions.",
        sequenceCheck: "First node. Its explanation gives only this calculation, not the next node's fluid-adjustment answer. Later urine/output observations are not present yet.",
      },
      {
        slug: "fluid-response-adjustment", conceptId: "concept.topic.burns-inhalation.fluid-response-adjustment.v1", conceptMeaning: "new", displayName: "Adjust fluids to the acquired response", conceptType: "management",
        learningObjective: "Reassess the initial burn-fluid prescription using the actual perfusion and urine-output trajectory.", role: "gap", replacesVariantIds: [],
        currentUpdate: "Later in the outside admission, the infusion has been increased above its starting rate. Urine output is 90 then 105 mL in consecutive hours. Blood pressure remains stable, lactate is falling, and peripheral edema is increasing. The urinary catheter drains freely; there has been no electrical injury, diuretic administration or hyperglycemic diuresis.",
        stem: "Which adjustment best fits {patientName}'s later burn-resuscitation record?",
        options: [
          option("reduce", "Reduce the crystalloid infusion and reassess the response", "The urine/perfusion trajectory and rising edema support reducing an excessive infusion rather than continuing a formula as a fixed obligation.", ["fluid-titration"], "Use acquired response rather than treating the starting estimate as a quota.", "This trajectory supports cautious reduction with continued monitoring."),
          option("maintain", "Maintain the crystalloid infusion and reassess the response", "Maintaining the escalated rate despite high urine output, stable perfusion and accumulating edema risks ongoing over-resuscitation.", ["fluid-titration"], "Treat the calculated volume as an amount that must be delivered unchanged.", "Stable urine output near the treating team's target without edema progression could support maintaining the current rate."),
          option("increase", "Increase the crystalloid infusion and reassess the response", "There is no current oliguria or worsening perfusion to support further fluid escalation.", ["fluid-titration"], "Interpret tissue edema as evidence that intravascular replacement must keep increasing.", "Persistent low urine output with evidence of inadequate perfusion after checking other causes could support increasing fluid."),
        ],
        explanation: "The response now matters more than the initial arithmetic. High urine output with stable perfusion and increasing edema supports reducing the crystalloid rate with reassessment. This does not teach a universal percentage change or an electrical-injury urine target.", claimSlugs: ["fluid-titration", "electrical-muscle"],
        reasoningSteps: ["Interpret high output, improving lactate and stable blood pressure as a different trajectory from under-resuscitation, while checking important alternative reasons for high output.", "Reduce the current infusion to avoid continuing excessive volume delivery."],
        closestError: "Maintain an escalated rate to satisfy an initial formula despite a changed response.", decidingObservation: "Serial high urine output and improving perfusion coexist with accumulating edema.",
        counterfactual: "If urine output instead fell with cool extremities and rising lactate, an increase after reassessment would become the relevant fluid direction.",
        deletionCheck: "The update is necessary: without it none of the three adjustment directions can be ranked. The electrical/diuretic/diuresis information resolves alternative output targets or mechanisms.",
        cueAttack: "All labels repeat the same reassessment clause; only infusion direction changes. The question does not call the patient over-resuscitated. No unique cautious combined plan supplies the key.",
        categoryCheck: "Three directions for the same existing infusion at the same time point.", difficulty: "Predicted moderate/hard: over-resuscitation must be inferred despite a large burn and an initially reasonable formula.",
        sequenceCheck: "The first node establishes only the initial worksheet calculation. This new response is revealed later and changes the decision; preceding feedback does not prescribe reduction.",
      },
    ],
  },
  {
    slug: "constrictive-thermal-burn", name: "Simon Blake", age: 52, sex: "Male", complaint: "Burn surgery review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 52-year-old man, reviews outside burn-unit records with the founder in clinic after recovery. Deep dry burns encircled his right forearm and chest. The first decision below occurred after systemic perfusion had improved during resuscitation.",
    nodes: [
      {
        slug: "thermal-limb-release", conceptId: "concept.topic.burns-inhalation.thermal-limb-escharotomy.v1", conceptMeaning: "new", displayName: "Relieve restrictive thermal eschar", conceptType: "management",
        learningObjective: "Distinguish circumferential skin restriction from systemic hypoperfusion and deeper muscle injury when selecting decompression.", role: "gap", replacesVariantIds: [],
        currentUpdate: "The right fingers became cooler with slower refill, and palmar Doppler signals weakened on repeated examination. Dressings and jewelry were removed and the limb elevated; these findings persisted. Blood pressure and the opposite hand's perfusion remained unchanged. The arm had no crush or electrical mechanism.",
        stem: "Which decompression plan best fits {patientName}'s right forearm at this point in the outside record?",
        options: [
          option("eschar", "Perform forearm escharotomy and reassess distal perfusion", "The regional deterioration under a circumferential deep thermal burn persists despite simple external measures and adequate systemic perfusion, supporting release through constrictive eschar.", ["limb-escharotomy"], "Localize the restriction to the burned skin envelope.", "This record supports skin release with immediate perfusion reassessment."),
          option("fascia", "Perform forearm fasciotomy and reassess distal perfusion", "A deeper compartment operation is not the first supported release for this skin-envelope pattern without evidence of muscle injury; reassess after adequate eschar release.", ["limb-escharotomy", "electrical-fasciotomy"], "Treat all burn-related limb ischemia as a fascial compartment syndrome.", "Persisting compartment findings after complete escharotomy or a primary deep muscle-compartment injury could require fasciotomy."),
          option("elevate", "Continue forearm elevation and reassess distal perfusion", "The perfusion trajectory worsens despite elevation and removal of external constriction, so continued observation alone does not resolve the mechanical problem.", ["limb-escharotomy"], "Keep a reasonable early edema measure after its documented failure.", "Stable perfusion and Doppler findings under surveillance could support elevation without immediate surgical release."),
        ],
        explanation: "Local deterioration with stable systemic and opposite-hand perfusion points to the circumferential thermal envelope. Release constrictive eschar, then reassess. Fasciotomy addresses a deeper compartment problem and may be necessary if that problem is demonstrated or perfusion fails to recover after adequate skin release.", claimSlugs: ["limb-escharotomy", "electrical-fasciotomy"],
        reasoningSteps: ["Localize the deteriorating perfusion to the burned forearm rather than global hypovolemia or a dressing.", "Choose skin-envelope decompression and reassessment before a deeper fascial operation in the stated mechanism."],
        closestError: "Perform fasciotomy for every ischemic burned limb rather than distinguish the constraining layer.", decidingObservation: "Circumferential deep thermal skin injury with persistent local perfusion decline after dressings/elevation, without a deep-injury mechanism.",
        counterfactual: "Replace the thermal envelope with high-voltage muscle injury, soft noncircumferential skin and tense painful deep compartments: fasciotomy becomes the relevant release.",
        deletionCheck: "The opposite limb and systemic trajectory distinguish global perfusion; failed external measures establish escalation; mechanism helps distinguish skin versus muscle. Each changes an offered alternative.",
        cueAttack: "All options include the same reassessment phrase. The task names no layer. The vignette supplies the necessary restriction and perfusion findings without labelling compartment syndrome.",
        categoryCheck: "Three decompression/escalation plans for the same threatened extremity.", difficulty: "Predicted hard: the close error is choosing the wrong anatomic release, not ignoring the ischemic hand.",
        sequenceCheck: "First scored node. Its feedback addresses the forearm and does not pre-teach chest-wall release.",
      },
      {
        slug: "thermal-chest-release", conceptId: "concept.topic.burns-inhalation.thermal-chest-escharotomy.v1", conceptMeaning: "new", displayName: "Recognize restrictive chest eschar", conceptType: "management",
        learningObjective: "Use acquired ventilatory and examination findings to distinguish chest-wall restriction from tube obstruction or pleural disease.", role: "gap", replacesVariantIds: [],
        currentUpdate: "Later, during passive controlled ventilation in the outside hospital, delivered tidal volumes fall and both peak and plateau pressures rise; plateau is recorded during an inspiratory hold. A suction catheter passes through the tube and removes little material. Breath sounds are symmetric, bedside pleural ultrasonography shows sliding on both sides, and chest excursion is minimal beneath the circumferential dry chest burn.",
        stem: "Which immediate procedure best fits {patientName}'s later ventilatory findings in the outside hospital record?",
        options: [
          option("chest", "Thoracic escharotomy", "The pressure pattern and restricted excursion localize a compliance problem to the circumferential burned chest wall after the represented tube and pleural checks.", ["chest-escharotomy", "ventilator-mechanics"], "Recognize external thoracic restriction as a reversible cause.", "This constructed restriction pattern supports thoracic eschar release."),
          option("tube", "Endotracheal tube exchange", "An isolated tube obstruction is less consistent with a freely passing catheter and increased plateau as well as peak pressure.", ["chest-escharotomy", "ventilator-mechanics"], "Attribute any abrupt ventilatory difficulty after a fire to an obstructed tube.", "A blocked or displaced tube with catheter-passage failure or other tube findings could require exchange."),
          option("pleura", "Tube thoracostomy", "The symmetric examination and represented pleural sliding do not support a pneumothorax as the cause of the marked external restriction.", ["chest-escharotomy"], "Treat increased airway pressure as a pleural emergency without integrating the chest examination.", "Unilateral loss of sliding with a compatible deteriorating examination would make pleural decompression appropriate."),
        ],
        explanation: "Infer reduced chest compliance from the combined pressures and excursion. Then integrate the tube and pleural checks with the circumferential deep chest wound to select thoracic escharotomy. This is a historical hospital procedure review, not a procedure performed in the founder's clinic.", claimSlugs: ["chest-escharotomy", "ventilator-mechanics"],
        reasoningSteps: ["Interpret increased peak and plateau pressure with restricted excursion as a compliance problem rather than simply intraluminal resistance.", "Use the wound and represented tube/pleural findings to select release of the chest-wall envelope."],
        closestError: "Exchange the endotracheal tube for every post-fire pressure rise.", decidingObservation: "Both pressures rise and the chest wall barely moves despite the represented patent-tube and bilateral-pleural observations.",
        counterfactual: "If the catheter could not pass and plateau pressure remained unchanged, tube obstruction and exchange would become the leading procedure path.",
        deletionCheck: "Removing the update makes chest release unrankable. Pressure relation, catheter passage and pleural observations each distinguish a specific competing cause; the case header alone is insufficient.",
        cueAttack: "All options are specific procedures of similar scope. Chest restriction is an observed movement, not an authored diagnosis. Prior forearm feedback does not explain ventilator pressures; the new data must still be interpreted.",
        categoryCheck: "Three immediate procedures for acquired ventilatory failure.", difficulty: "Predicted hard: external restriction competes with real tube/pleural emergencies and requires integrating several data sources.",
        sequenceCheck: "Forearm and chest nodes share an injury but test different anatomic consequences. No future respiratory data appear in the first node. Manager should also consider standalone exposure for the chest objective.",
      },
    ],
  },
);

BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS.push(
  {
    slug: "electrical-record", name: "Caleb Shaw", age: 36, sex: "Male", complaint: "Electrical injury review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 36-year-old man, reviews his outside hospital admission in clinic after contact with an industrial high-voltage cable. The entry and exit skin wounds together occupied less than 1% of body surface. At the first fluid review his blood pressure was stable, but urine output was falling while he received a maintenance crystalloid infusion.",
    nodes: [
      {
        slug: "electrical-pigment-resuscitation", conceptId: "concept.topic.burns-inhalation.electrical-pigment-resuscitation.v1", conceptMeaning: "new", displayName: "Resuscitate occult electrical muscle injury", conceptType: "management",
        learningObjective: "Recognize major muscle injury concealed by small electrical skin wounds and select the appropriate fluid-monitoring response.", role: "gap", replacesVariantIds: [],
        exhibit: table(["Recorded result"], ["Urine", "Creatine kinase", "Creatinine trend", "Peripheral examination"], [["Dark brown; myoglobin detected"], ["26,000 U/L; laboratory upper reference 200 U/L"], ["Rising on serial samples"], ["Muscle tenderness along the current path; increasing limb swelling"]]),
        stem: "Which fluid plan best fits {patientName}'s first hospital review after the electrical injury?",
        options: [
          option("increase", "Increase crystalloid with renal and electrolyte monitoring", "The muscle and pigment findings indicate a resuscitation problem that is not represented by the small cutaneous TBSA. Carefully increase and titrate fluid while monitoring renal response and electrolytes.", ["electrical-muscle", "fluid-titration"], "Interpret the deep current-path injury rather than apply a tiny-skin-burn heuristic.", "This course supports escalation with reassessment, not an unlimited-volume prescription."),
          option("maintain", "Maintain crystalloid with renal and electrolyte monitoring", "The current maintenance regimen is accompanied by falling output and rising creatinine in pigment-producing muscle injury.", ["electrical-muscle", "fluid-titration"], "Let less than 1% skin involvement define the fluid need.", "Stable urine output and renal indices without major muscle injury could support maintenance treatment."),
          option("reduce", "Reduce crystalloid with renal and electrolyte monitoring", "Swelling alone does not justify restriction while the represented pigment injury and renal response suggest inadequate current delivery. Reassess volume status rather than interpreting all edema as overload.", ["electrical-muscle", "fluid-titration"], "Treat peripheral edema as sufficient proof that more fluid is contraindicated.", "Adequate or excessive output, worsening pulmonary congestion and evidence of volume excess could favor reducing fluid."),
        ],
        explanation: "A small entry/exit area can conceal substantial muscle injury. The CK, myoglobin and renal trajectory support increased monitored crystalloid rather than relying on skin TBSA. Reassess to avoid both inadequate perfusion and fluid excess; this item sets no universal electrical-injury output target.", claimSlugs: ["electrical-muscle", "fluid-titration"],
        reasoningSteps: ["Infer major deep muscle injury from current path, CK and pigment despite minimal skin area.", "Use falling urine output and rising creatinine to change the current fluid regimen under renal/electrolyte surveillance."],
        closestError: "Keep maintenance fluid because the visible burn is tiny, or restrict for edema without integrating renal perfusion.", decidingObservation: "Pigment-producing muscle injury and a worsening renal trajectory coexist with a low cutaneous TBSA.",
        counterfactual: "If CK and urine were normal, output remained adequate and there were no deep muscle findings, maintenance care rather than a pigment-injury resuscitation pathway could fit.",
        deletionCheck: "Skin extent creates the credible underestimate; CK/pigment identify deep injury; output/creatinine establish the acquired response; swelling creates the competing restriction error. No exact CK decision cutoff is invented.",
        cueAttack: "All three options name the same fluid and monitoring bundle; only direction changes. The presentation never supplies the term rhabdomyolysis. The explicit myoglobin result is laboratory evidence, not an eligibility conclusion.",
        categoryCheck: "Three fluid prescription directions with identical monitoring scope.", difficulty: "Predicted moderate/hard: local edema and small skin TBSA compete with systemic muscle-injury evidence.",
        sequenceCheck: "First node. Feedback discusses muscle/renal physiology and does not name the next node's decompression procedure.",
      },
      {
        slug: "electrical-deep-compartment", conceptId: "concept.topic.burns-inhalation.electrical-deep-compartment.v1", conceptMeaning: "new", displayName: "Release a deep compartment after electrical injury", conceptType: "management",
        learningObjective: "Select fascial decompression for a deteriorating deep muscle compartment rather than an escharotomy based on the burn label.", role: "gap", replacesVariantIds: [],
        currentUpdate: "After perfusion improves, the forearm along the electrical current path becomes tense. Pain rises with passive finger extension and active finger movement weakens. Radial and ulnar Doppler signals remain present. The skin between the contact wounds is pliable and does not form a circumferential eschar.",
        stem: "Which procedure best fits {patientName}'s later forearm findings in the outside hospital record?",
        options: [
          option("fascia", "Forearm compartment fasciotomy", "Progressive deep-compartment findings after electrical muscle injury require fascial release; preserved arterial signals do not make the deep tissue pressure problem disappear.", ["electrical-fasciotomy", "compartment-examination"], "Localize the problem to muscle compartments rather than the skin envelope.", "This progressive electrical-injury pattern supports urgent surgical compartment assessment and fasciotomy."),
          option("skin", "Forearm skin escharotomy", "There is no constricting circumferential skin envelope to release, and skin incision would not decompress the affected deep compartments.", ["electrical-fasciotomy", "limb-escharotomy"], "Apply the familiar thermal-burn release to every electrically burned limb.", "A restrictive circumferential thermal eschar with impaired distal perfusion could require escharotomy."),
          option("artery", "Forearm arterial thrombectomy", "The deep tension and stretch-pain trajectory with maintained arterial signals points to compartment pressure rather than a demonstrated arterial occlusion.", ["electrical-fasciotomy", "compartment-examination"], "Treat developing weakness as proof of an occluded major artery.", "A documented arterial thrombotic occlusion with compatible ischemic findings could require revascularization."),
        ],
        explanation: "Integrate the deep pain/tension trajectory with the electrical mechanism and pliable skin. The threatened compartment lies beneath fascia, so skin eschar release does not address it. Maintained Doppler signals cannot by themselves exclude a deep compartment syndrome.", claimSlugs: ["electrical-fasciotomy", "compartment-examination", "limb-escharotomy", "electrical-muscle"],
        reasoningSteps: ["Infer a progressive deep compartment problem from tension, stretch pain and weakness after high-voltage muscle injury.", "Choose fascial release rather than skin release or an arterial operation."],
        closestError: "Perform escharotomy because this is called a burn, or wait for loss of arterial pulses.", decidingObservation: "Deep findings progress beneath pliable noncircumferential skin despite preserved arterial signals.",
        counterfactual: "If the restriction were a circumferential full-thickness thermal envelope without deep-muscle findings, escharotomy would replace fasciotomy as the initial release.",
        deletionCheck: "The later update is indispensable. Skin pliability identifies the anatomic mismatch; progressive stretch pain/weakness establishes urgency; Doppler signals create a plausible false-reassurance error.",
        cueAttack: "Procedure options are parallel and do not include explanatory layer names beyond their actual operation names. No pre-answer label 'compartment syndrome' supplies the diagnosis.",
        categoryCheck: "Three urgent forearm operations addressing different anatomic causes.", difficulty: "Predicted hard: the resident must separate cutaneous burns, deep muscle pressure and arterial flow rather than equate them.",
        sequenceCheck: "The earlier renal decision does not name a release operation. New local findings determine this separate consequential decision.",
      },
    ],
  },
  {
    slug: "co-record", name: "Tessa Grant", age: 41, sex: "Female", complaint: "Smoke exposure review", historicalAcuity: "urgent_stable",
    presentation: "{patientName}, a 41-year-old woman, reviews her outside emergency-hospital records with the founder in clinic. She was removed from an enclosed garage fire and arrived awake and oriented. At the first hospital examination she had persistent headache and nausea but followed instructions normally. Her voice and breathing were unchanged. Finger oxygen saturation was 99%; arterial oxygen tension was high while she received oxygen.",
    nodes: [
      {
        slug: "co-oxygen-discordance", conceptId: "concept.topic.burns-inhalation.co-oxygen-discordance.v1", conceptMeaning: "new", displayName: "Investigate reassuring oxygen readings after a fire", conceptType: "workup",
        learningObjective: "Recognize what routine oxygen measurements fail to establish after smoke exposure and request blood co-oximetry.", role: "gap", replacesVariantIds: [],
        stem: "Which additional blood investigation best addresses {patientName}'s persistent findings after smoke exposure in the initial outside-hospital record?",
        options: [
          option("coox", "Blood co-oximetry", "COHb can impair oxygen carriage despite a reassuring conventional saturation and high dissolved oxygen tension. Blood co-oximetry directly measures the relevant hemoglobin species.", ["co-oximetry"], "Recognize the limits of the existing measurements rather than repeat them.", "This exposure and neurologic course justify direct hemoglobin-species measurement.", "timing.test.basic_labs"),
          option("gas", "Repeat arterial oxygen tension", "Repeating dissolved oxygen measurement does not establish whether hemoglobin is carrying CO.", ["co-oximetry"], "Assume an elevated arterial oxygen tension excludes an oxygen-carriage toxic exposure.", "A new oxygenation or ventilation change, or concern about the prior specimen, could justify repeat blood gas assessment.", "timing.test.basic_labs"),
          option("hemoglobin", "Blood hemoglobin concentration", "Carrier quantity does not measure how much is occupied by CO. It does not resolve this exposure-related discrepancy.", ["co-oximetry"], "Investigate oxygen delivery solely through total hemoglobin concentration.", "Suspected major blood loss or anemia would make concentration an important separate measurement.", "timing.test.basic_labs"),
        ],
        explanation: "Separate dissolved oxygen and conventional saturation from functional hemoglobin carriage. A normal reading does not exclude CO exposure. Add blood co-oximetry while emergency clinicians continue appropriate treatment and reassessment.", claimSlugs: ["co-oximetry"],
        reasoningSteps: ["Interpret the discordance between exposure/neurologic findings and reassuring routine oxygen measurements.", "Choose direct hemoglobin-species measurement rather than another measure of dissolved oxygen or carrier quantity."],
        closestError: "Repeat arterial oxygen tension and treat it as proof that oxygen carriage is adequate.", decidingObservation: "Neurologic findings after enclosed combustion persist despite high measured dissolved oxygen and conventional saturation.",
        counterfactual: "If the question concerned a new low arterial oxygen tension from a respiratory change, repeat blood-gas oxygen assessment would address that different problem; if low hemoglobin from bleeding were present, concentration would matter.",
        deletionCheck: "Exposure and symptoms establish the competing oxygen-delivery concern; saturation/oxygen tension establish what has and has not been measured. Stable voice/breathing keeps this at the blood-investigation stage.",
        cueAttack: "Three named blood measurements have equal placeholder timing profiles. The task does not name CO or request a hemoglobin species. Covered the key: no test alias appears before the options.",
        categoryCheck: "Three blood investigations addressing oxygen delivery; all are testing choices with exact timing identity/label mappings.", difficulty: "Predicted moderate, with a familiarity risk: the applied measurement-limit distinction is clinically consequential, but independent review should challenge whether PGY-2/3 discrimination is sufficient.",
        sequenceCheck: "First node. Its feedback does not discuss HBO indications, persistent neurologic findings after oxygen, or the later result.",
      },
      {
        slug: "co-after-oxygen", conceptId: "concept.topic.burns-inhalation.co-hyperbaric-consultation.v1", conceptMeaning: "new", displayName: "Escalate CO care using the clinical trajectory", conceptType: "management",
        learningObjective: "Avoid dismissing severe CO exposure on the basis of a low post-oxygen COHb and select hyperbaric consultation.", role: "gap", replacesVariantIds: [],
        currentUpdate: "A pre-treatment specimen later returned with COHb 28%. After high-concentration oxygen, COHb is 4%. She now maintains her airway but still cannot retain three new instructions and repeatedly loses her place during a simple task. An EMS report retrieved after the first laboratory review documents loss of consciousness before arrival. The hospital continues oxygen and neurologic monitoring.",
        stem: "Which additional care plan best fits {patientName}'s later outside-hospital assessment?",
        options: [
          option("hbo", "Seek urgent hyperbaric-medicine consultation", "The newly documented loss of consciousness and acquired neurologic deficits remain important despite a lower COHb after treatment. Consultation should consider HBO in the complete clinical setting.", ["co-hbo", "co-oximetry"], "Judge escalation from clinical severity and trajectory, not one treated laboratory value.", "This record supports consultation; the specialist team decides treatment and transport suitability."),
          option("observe", "Continue monitored hospital care without hyperbaric consultation", "Monitored oxygen is already shared background care. With these neurologic features, omitting specialist consideration on the basis of the low treated level underestimates severity.", ["co-hbo"], "Use the post-oxygen COHb to make the existing hospital plan sufficient.", "A mild exposure with complete symptom resolution and no severe clinical features might be managed without HBO after appropriate assessment."),
          option("discharge", "Arrange discharge with scheduled neurologic follow-up", "Persistent deficits and documented loss of consciousness do not fit a routine discharge decision at this assessment.", ["co-hbo"], "Equate biochemical improvement with complete neurologic recovery.", "After adequate treatment and clinical recovery, discharge with warnings and follow-up may become appropriate."),
        ],
        explanation: "A treated COHb is not the complete severity record. Prior unconsciousness and persistent cognitive deficits warrant urgent hyperbaric consultation while current oxygen and monitoring continue. The item keys specialist consideration, not guaranteed benefit or mandatory HBO for every elevated COHb.", claimSlugs: ["co-hbo", "co-oximetry"],
        reasoningSteps: ["Recognize that the falling treated COHb does not erase earlier exposure severity or ongoing neurologic injury.", "Use those clinical features to add hyperbaric consultation rather than discharge or laboratory-driven observation alone."],
        closestError: "Let the post-oxygen value of 4% veto HBO consideration.", decidingObservation: "Persistent objectively described cognitive abnormalities and documented unconsciousness despite biochemical improvement.",
        counterfactual: "If exposure were mild with no loss of consciousness and the neurologic examination normalized after treatment, monitored normobaric care followed by appropriate discharge could replace urgent HBO consultation.",
        deletionCheck: "The initial examination is oriented with intact instruction following. Both pre/post values establish the misleading treated-value trajectory; new cognitive failure and a subsequently retrieved EMS report determine escalation. A deletion attack found that initially supplying unconsciousness/confusion preselected this answer; those facts were moved to the later acquired record and the gate was repeated.",
        cueAttack: "Background oxygen and neurologic monitoring are common to all plans and absent from the key label. No universal COHb cutoff is supplied. The key does not uniquely promise comprehensive treatment.",
        categoryCheck: "Three additional escalation/disposition plans at the post-treatment assessment.", difficulty: "Predicted hard: the laboratory trend is reassuring while clinical severity remains concerning, and consultation is separated from automatic treatment.",
        sequenceCheck: "New treated results, cognitive decline and the subsequently retrieved EMS history earn the second decision. First-node feedback covers testing only; initial headache/nausea with normal instruction following does not preselect hyperbaric escalation. No future findings are shown before that node.",
      },
    ],
  },
);

BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS.push(
  {
    slug: "airway-record", name: "Daniel Frost", age: 58, sex: "Male", complaint: "Fire admission review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 58-year-old man, reviews his outside hospital admission with the founder in clinic after an enclosed workshop fire. At the first recorded assessment he had soot around his mouth and could speak in full sentences. The hospital then documented the serial observations below.",
    nodes: [
      {
        slug: "airway-before-investigation", conceptId: "concept.topic.burns-inhalation.airway-before-investigation.v1", conceptMeaning: "new", displayName: "Secure a deteriorating smoke-exposed airway", conceptType: "management",
        learningObjective: "Interpret an evolving upper-airway trajectory and choose airway control rather than bronchodilator treatment or oxygen observation before transfer.", role: "gap", replacesVariantIds: [],
        currentUpdate: "His voice becomes faint and coarse, saliva pools because swallowing is difficult, and inspiratory noise appears. He remains awake and finger oxygen saturation is 97% on oxygen. The outside team is preparing transfer to a burn unit.",
        stem: "Which airway plan best fits {patientName}'s changing findings before the outside-hospital transfer?",
        options: [
          option("intubate", "Secure the airway by endotracheal intubation before transfer", "Progressive voice, secretion and inspiratory changes indicate a threatened upper airway despite preserved saturation; diagnostic work should not delay airway control.", ["airway-danger", "airway-sequence"], "Use progression rather than waiting for oxygen desaturation.", "This evolving obstruction pattern supports airway control by the outside emergency/anesthesia team."),
          option("bronchodilator", "Give nebulized bronchodilator treatment before transfer", "The progressive voice and secretion changes with inspiratory noise indicate an upper-airway threat; a lower-airway bronchodilator does not secure that airway.", ["airway-danger", "airway-sequence"], "Treat noisy breathing after smoke as lower-airway bronchospasm rather than localize the evolving obstruction.", "Predominantly expiratory wheeze with stable voice, secretion handling and no upper-airway progression could support bronchodilator treatment."),
          option("observe", "Continue oxygen and reassess the airway during transfer", "Oxygen and a reassuring saturation do not prevent mechanical airway obstruction from progressing en route.", ["airway-danger", "airway-sequence"], "Treat oxygenation as evidence that an evolving airway can safely wait.", "A stable voice, secretion handling and respiratory examination after assessment may support observation without routine intubation."),
        ],
        explanation: "The serial findings concern upper-airway patency, not simply oxygen delivery. Secure that airway before transfer rather than wait for hypoxemia or rely on a lower-airway bronchodilator. Facial soot by itself would not establish this same indication.", claimSlugs: ["airway-danger", "airway-sequence", "bronchoscopy"],
        reasoningSteps: ["Infer impending upper-airway obstruction from progressive voice change, secretion handling and inspiratory findings despite preserved saturation.", "Choose airway control rather than a lower-airway bronchodilator or observation during transfer."],
        closestError: "Treat smoke-related noisy breathing as bronchospasm despite evolving voice and secretion changes.", decidingObservation: "Upper-airway function deteriorates across the recorded assessment.",
        counterfactual: "If voice, swallowing and breathing remained normal without progression, diagnostic assessment and observation could replace automatic intubation.",
        deletionCheck: "Serial functional changes are decisive; saturation creates the competing false reassurance and transfer makes timing consequential. Soot alone cannot answer the question after the update is removed.",
        cueAttack: "The task does not name impending obstruction or tell the learner to prioritize safety. All labels are specific airway plans. Replaced the diagnostic-bronchoscopy distractor before handoff so it cannot prime the later bronchoscopy answer. Normal saturation is necessary to test its limits.",
        categoryCheck: "Three airway-stabilization sequences before the same transfer.", difficulty: "Predicted moderate: correct localization must change the intervention before transfer despite preserved saturation. Independent review should challenge familiarity of this safety boundary.",
        sequenceCheck: "First node; no later results are visible. A manual sequence attack found that a bronchoscopy distractor primed the later key; it was replaced with a plausible bronchodilator error. Feedback names airway control only.",
      },
      {
        slug: "lower-airway-assessment", conceptId: "concept.topic.burns-inhalation.lower-airway-assessment.v1", conceptMeaning: "new", displayName: "Investigate lower-airway smoke injury after stabilization", conceptType: "workup",
        learningObjective: "Select direct lower-airway assessment when early chest radiography does not resolve suspected smoke-related mucosal injury.", role: "gap", replacesVariantIds: [],
        currentUpdate: "After intubation and transfer, oxygenation and circulation are stable. Repeated suctioning returns black particulate secretions, and airway pressures fluctuate despite bronchodilator treatment. The first chest radiograph shows no focal opacity or pleural abnormality. The burn team needs to assess the distribution and severity of airway mucosal injury.",
        stem: "Which investigation best addresses {patientName}'s lower-airway assessment in the later burn-unit record?",
        options: [
          option("bronch", "Flexible bronchoscopy", "Direct examination can establish and grade lower-airway mucosal injury and assess retained airway debris after stabilization.", ["bronchoscopy"], "Recognize that a normal early radiograph does not answer a mucosal-injury question.", "This record supports direct lower-airway examination.", "timing.test.advanced_diagnostic"),
          option("ct", "Chest computed tomography", "CT can assess thoracic and parenchymal disease, but the specified unresolved question is mucosal distribution and debris within the airway.", ["bronchoscopy"], "Escalate from a normal radiograph to cross-sectional imaging for every unconfirmed inhalation injury.", "A concern for occult thoracic trauma or another structural pulmonary process could make chest CT appropriate.", "timing.test.ct"),
          option("radiograph", "Repeat chest radiography", "A later radiograph can track pulmonary changes but does not directly grade the airway surface or inspect retained debris.", ["bronchoscopy"], "Wait for the initial normal imaging test to become diagnostic.", "A new parenchymal or pleural finding or monitoring question could justify repeat radiography.", "timing.test.radiography"),
        ],
        explanation: "Match the unresolved anatomy to the investigation. After stabilization, direct lower-airway examination can assess the mucosa and debris even when an early chest radiograph is unrevealing. Imaging still has other roles; the key does not declare CT or radiographs useless.", claimSlugs: ["bronchoscopy"],
        reasoningSteps: ["Interpret the secretion/pressure course as an unresolved lower-airway problem not excluded by the radiograph.", "Choose the modality that directly examines the anatomic target and its severity."],
        closestError: "Treat the normal early radiograph as evidence against inhalation injury or automatically choose CT without matching the target.", decidingObservation: "Persistent airway particulate material and mechanics changes coexist with a radiograph that does not inspect the mucosal target.",
        counterfactual: "If the unresolved target were an occult thoracic injury after a blast rather than airway mucosal injury, CT would become the appropriate next modality.",
        deletionCheck: "The later stable state permits investigation; secretions/pressure establish the unresolved problem; the imaging result distinguishes what is already assessed. Without this update the earlier unstable patient needs stabilization, not this workup decision.",
        cueAttack: "The task names the lower-airway target because matching anatomy to modality is the objective, but does not name direct visualization or a gold standard. All three options are real investigations with modality-matched timing profiles.",
        categoryCheck: "Three investigations after stabilization, without treatment or observation foils.", difficulty: "Predicted moderate: the resident must match unresolved mucosal injury to a modality after a normal radiograph, rather than choose another image reflexively. The prior node no longer names bronchoscopy.",
        sequenceCheck: "After repair, no first-node option or visible feedback names bronchoscopy. The acquired airway findings and new investigation target remain necessary. Paired-only selection is not claimed equivalent to independent standalone testing.",
      },
    ],
  },
  {
    slug: "mixed-smoke-toxicity", name: "Iris Lane", age: 34, sex: "Female", complaint: "Fire treatment review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 34-year-old woman, reviews her outside hospital records in clinic after an enclosed upholstered-furniture fire. She had soot in her mouth, lost consciousness and arrived with circulatory collapse. Her airway was secured and she received oxygen and circulatory support. Lactate remained 16 mmol/L, and blood co-oximetry showed COHb 19%. The hospital laboratory sent a cyanide assay to a reference laboratory.",
    nodes: [{
      slug: "mixed-smoke-antidote", conceptId: "concept.topic.burns-inhalation.mixed-smoke-antidote.v1", conceptMeaning: "new", displayName: "Choose empiric antidote treatment after a fire", conceptType: "management",
      learningObjective: "Integrate severe smoke toxicity and impaired oxygen carriage to choose empiric hydroxocobalamin rather than wait for confirmation or add a methemoglobin-forming regimen.", role: "gap", replacesVariantIds: [],
      stem: "Which antidote plan best fits {patientName}'s recorded hospital condition while supportive treatment continues?",
      options: [
        option("hydrox", "Administer intravenous hydroxocobalamin now", "The exposure, coma/collapse and profound persistent lactate support empiric treatment for suspected cyanide toxicity. Hydroxocobalamin avoids adding the nitrite-associated methemoglobin burden to documented CO exposure.", ["cyanide", "nitrite-boundary"], "Treat a likely mixed exposure without requiring a delayed confirmatory assay.", "This high-suspicion severe exposure supports empiric treatment; exact dose and infusion timing need local toxicology guidance."),
        option("nitrite", "Administer sodium nitrite with thiosulfate now", "This is a genuine cyanide regimen, but sodium nitrite can worsen hypotension and oxygen carriage through methemoglobin formation when CO poisoning coexists. The preferred available alternative here is hydroxocobalamin.", ["cyanide", "nitrite-boundary"], "Recall a cyanide antidote regimen without accounting for concurrent CO-related carriage impairment.", "A confirmed cyanide exposure without the represented oxygen-carriage limitation, or a setting without the preferred alternative, may require toxicology-directed consideration of this regimen."),
        option("assay", "Await the blood cyanide result before antidote treatment", "A reference-laboratory result should not defer treatment when severe exposure and clinical findings make suspicion high.", ["cyanide"], "Require laboratory certainty because lactate is not specific for cyanide.", "A low-suspicion, clinically stable exposure may warrant further evaluation rather than automatic empiric antidote treatment.", "timing.test.advanced_diagnostic"),
      ],
      explanation: "Infer possible cyanide toxicity in addition to the measured CO exposure, then account for the oxygen-carriage and hypotension risks of sodium nitrite when choosing treatment. The history and collapse justify empiric hydroxocobalamin without waiting for a send-out result. Lactate here is a constructed observation, not a universal diagnostic cutoff.", claimSlugs: ["cyanide", "nitrite-boundary", "co-oximetry"],
      reasoningSteps: ["Integrate enclosed combustion, severe neurologic/circulatory findings and persistent lactate to suspect a second smoke toxin rather than assume CO alone explains the course.", "Choose an empiric antidote pathway that addresses that suspicion while accounting for concurrent CO-related oxygen-carriage impairment."],
      closestError: "Give a remembered nitrite regimen without integrating COHb, or wait for definitive testing during collapse.", decidingObservation: "Severe compatible smoke toxicity and documented CO exposure coexist; confirmation is a reference-laboratory assay.",
      counterfactual: "With a clinically stable low-suspicion exposure and rapidly resolving symptoms, diagnostic reassessment rather than automatic empiric hydroxocobalamin could be appropriate. With a different confirmed isolated cyanide exposure, toxicology may consider the nitrite regimen.",
      deletionCheck: "Exposure/soot establish route, collapse/lactate establish severity, COHb distinguishes the close antidote, and send-out provenance explains the confirmation delay. No exact infusion-rate or lactate rule is imposed.",
      cueAttack: "Two real antidote regimens compete; the key is not the only drug. The third plan tests a credible certainty-before-treatment error and carries send-out testing timing metadata. The stem does not say cyanide poisoning.",
      categoryCheck: "Three antidote-treatment plans at the same stabilized-but-critical hospital phase.", difficulty: "Predicted hard: a familiar cyanide antidote can be less suitable in a mixed exposure, and the confirmatory test is not a prerequisite to treatment.",
      sequenceCheck: "Standalone. No preceding question names cyanide or rehearses nitrite risks. Exact ranking remains for clinician/toxicology review.",
    }],
  },
  {
    slug: "fluoride-record", name: "Marcus Vale", age: 49, sex: "Male", complaint: "Chemical burn review", historicalAcuity: "obvious_emergency",
    presentation: "{patientName}, a 49-year-old man, reviews his outside hospital record in clinic after concentrated hydrofluoric acid spilled over his forearm. Irrigation and topical calcium treatment had reduced local pain. During monitored hospital observation he developed hand spasms on both sides and ventricular ectopy; the ECG report described a lengthening QT interval. Serum calcium had fallen below the laboratory reference interval.",
    nodes: [{
      slug: "fluoride-systemic-calcium", conceptId: "concept.topic.burns-inhalation.fluoride-systemic-calcium.v1", conceptMeaning: "new", displayName: "Treat systemic toxicity after an HF burn", conceptType: "management",
      learningObjective: "Recognize systemic fluoride effects despite local improvement and choose systemic rather than local calcium treatment.", role: "gap", replacesVariantIds: [],
      stem: "Which calcium treatment route best fits {patientName}'s later findings in the outside-hospital record?",
      options: [
        option("iv", "Intravenous calcium gluconate", "Bilateral neuromuscular findings, ECG changes and falling serum calcium indicate systemic toxicity; intravenous replacement with surveillance addresses the systemic deficit.", ["hf-systemic", "hf-calcium"], "Distinguish systemic fluoride effects from the improving local wound.", "This systemic pattern supports intravenous treatment with ECG/electrolyte monitoring."),
        option("topical", "Topical calcium gluconate", "Topical treatment targets the exposed skin, but local improvement does not correct the documented systemic calcium deficit and cardiac manifestations.", ["hf-systemic", "hf-calcium"], "Continue the route that helped local pain and infer systemic recovery.", "A local HF burn without systemic findings can require topical calcium under specialist guidance."),
        option("local", "Local calcium gluconate infiltration", "Local infiltration may be considered for selected persistent local injury, but it does not replace systemic treatment for this acquired multisystem pattern.", ["hf-systemic", "hf-calcium"], "Escalate local burn therapy when the decisive new problem is systemic.", "Persistent focal pain despite initial local care, without the represented systemic problem, could prompt specialist-directed local escalation."),
      ],
      explanation: "Reduced local pain is not proof that absorbed fluoride is harmless. Interpret the distant spasms, ECG course and serum calcium together, then use the systemic route under monitoring. No injection concentration, dose or intra-arterial technique is prescribed in this draft.", claimSlugs: ["hf-systemic", "hf-calcium"],
      reasoningSteps: ["Infer systemic fluoride-related calcium toxicity from distant neuromuscular, cardiac and laboratory findings despite local improvement.", "Select systemic intravenous replacement rather than escalating a skin-directed route."],
      closestError: "Continue topical or local calcium because the cutaneous wound is the original injury and its pain improved.", decidingObservation: "New bilateral spasms and cardiac changes accompany a falling serum calcium, beyond the exposed forearm.",
      counterfactual: "If symptoms remained localized with stable serum calcium and ECG findings, topical or specialist-directed local treatment would remain relevant rather than automatic IV treatment.",
      deletionCheck: "The exposure identifies the toxic mechanism; local response creates the credible trap; distant signs and laboratory change establish systemic treatment need. The ECG is a reported observation, not a promised tracing-interpretation exhibit.",
      cueAttack: "Every option is the same named medicine with a different real route. The task does not label systemic hypocalcemia. The key is not a uniquely complete monitoring plan; monitoring is common hospital background care.",
      categoryCheck: "Three calcium delivery routes for the same treatment decision.", difficulty: "Predicted moderate/hard: the clinical course requires separating local wound improvement from absorbed-toxin complications.",
      sequenceCheck: "Standalone. Archived source limitations and exact route choice remain visible for Melissa/toxicology review.",
    }],
  },
);

BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS.push(
  {
    slug: "coverage-record", name: "Owen Marsh", age: 55, sex: "Male", complaint: "Burn reconstruction review", historicalAcuity: "urgent_stable",
    presentation: "{patientName}, a 55-year-old man, reviews his outside burn-unit surgical records with the founder in clinic after extensive trunk and limb burns. Once circulation stabilized, repeated examinations of one trunk wound showed a central dry, nonblanching region with little touch response. Its moist pink peripheral region remained painful and developed advancing epithelial islands.",
    nodes: [
      {
        slug: "regional-excision-plan", conceptId: "concept.topic.burns-inhalation.regional-excision-plan.v1", previousConceptId: "concept.burn.superficial-partial-thickness-recognition", conceptMeaning: "changed", displayName: "Apply regional depth to an excision plan", conceptType: "management",
        learningObjective: "Distinguish nonviable central burn from viable epithelializing peripheral tissue when planning regional excision and coverage.", role: "replacement", replacesVariantIds: ["question.burn.superficial-partial-thickness-recognition.v1", "question.burn.superficial-partial-thickness-recognition.v2", "question.burn.superficial-partial-thickness-recognition.v3", "question.burn.superficial-partial-thickness-recognition.v4"],
        stem: "Which regional wound plan best fits {patientName}'s recorded trunk examination when planning burn excision and coverage?",
        options: [
          option("central", "Plan excision and coverage of the central region", "The central pattern indicates deeper nonviable tissue, while the advancing peripheral epithelialization supports preserving that region rather than treating the field as uniform.", ["depth-pattern", "deep-burn-closure"], "Interpret regional viability and apply it to surgical extent.", "This regional pattern supports a targeted burn-surgical plan, subject to operative assessment."),
          option("whole", "Plan excision and coverage of the entire wound", "Uniform excision would remove the represented viable epithelializing periphery along with the deeper center.", ["depth-pattern", "deep-burn-closure"], "Let the deepest visible part define the entire burn field.", "A wound with consistently deep nonviable tissue throughout could require excision of the whole affected region."),
          option("dress", "Plan continued dressing care for the entire wound", "Peripheral healing does not establish that the dry insensate center will close by the same pathway.", ["serial-depth", "deep-burn-closure"], "Let the healing edge define the entire burn field.", "A uniformly superficial, perfused, epithelializing wound could remain on a dressing pathway."),
        ],
        explanation: "Infer regional tissue viability, then use it to set the surgical field. The central deeper region needs burn-surgical excision/coverage planning; the viable healing edge should not be excised merely because it belongs to the same wound. No exact operation date or graft area is prescribed.", claimSlugs: ["depth-pattern", "serial-depth", "deep-burn-closure"],
        reasoningSteps: ["Interpret central nonblanching sensory loss separately from peripheral epithelialization.", "Apply those differences to the extent of the proposed excision and coverage plan."],
        closestError: "Over-excise the entire field using the deepest region, or under-treat the center using the healing edge.", decidingObservation: "Opposing regional healing/viability findings persist on serial examination.",
        counterfactual: "If the whole field remained dry, nonblanching and nonhealing on serial expert assessment, the whole-wound excision plan would become reasonable. If the center epithelialized, dressing care could replace excision planning.",
        deletionCheck: "Both regional descriptions are essential; removing either makes a uniform plan defensible. Hemodynamic recovery establishes the planning phase. Removed four near-duplicate depth-label tasks rather than manufacturing cosmetic variants.",
        cueAttack: "Options vary surgical extent or continued nonoperative care, not a diagnosis label. There is no paired-component majority matrix. The intermediate scope still requires both regional observations; no stated tissue-preservation preference acts as a tie-breaker.",
        categoryCheck: "Three regional burn-wound plans at the excision/coverage planning stage.", difficulty: "Predicted moderate/hard: the credible errors are opposite whole-field extrapolations from a mixed-depth wound.",
        sequenceCheck: "First node. Feedback discusses regional excision only and does not teach temporary allograft selection.",
      },
      {
        slug: "temporary-burn-coverage", conceptId: "concept.topic.burns-inhalation.temporary-burn-coverage.v1", conceptMeaning: "new", displayName: "Temporize an excised extensive burn", conceptType: "management",
        learningObjective: "Integrate a clean excised bed with limited current donor availability to choose temporary coverage after extensive burns.", role: "gap", replacesVariantIds: [],
        currentUpdate: "During a later operation, a broad excised trunk bed shows viable bleeding tissue and no residual eschar. The unburned thighs and back have already been harvested in earlier stages and remain open donor wounds. Other deep burns are still undergoing staged excision. The team must cover the current bed while those donor regions recover.",
        stem: "Which coverage plan best fits {patientName}'s later operative record?",
        options: [
          option("allograft", "Apply cadaveric allograft over the excised bed", "An excised viable bed needs coverage while current donor regions recover; allograft supplies temporary coverage without treating it as definitive autologous skin.", ["temporary-allograft", "deep-burn-closure"], "Use a temporary burn-coverage resource when current autograft donor skin is limited.", "This staged extensive-burn situation supports temporary allograft pending definitive coverage."),
          option("autograft", "Reharvest the open donor regions for autograft", "The represented donor wounds have not healed; treating them as immediately reusable ignores the operative record and adds donor injury.", ["temporary-allograft"], "Apply autograft as the definitive preference without considering donor readiness.", "Healed donor regions suitable for renewed harvest can support a later autografting stage."),
          option("dress", "Maintain topical dressings over the excised bed", "Simple dressing care does not provide the same temporary biologic coverage for this broad excised bed when a staged coverage pathway is required.", ["temporary-allograft", "deep-burn-closure"], "Carry a superficial-burn dressing pathway forward after substantial excision.", "A smaller superficial epithelializing wound, or a selected short interval before a planned reassessment, may be managed with dressings."),
        ],
        explanation: "The bed has been prepared, but current autograft donor regions are still healing. Temporary cadaveric coverage can bridge that interval during staged major-burn care. It is not permanent autologous coverage, and no fixed replacement date is inferred.", claimSlugs: ["temporary-allograft", "deep-burn-closure"],
        reasoningSteps: ["Interpret the viable excised bed and open donor wounds as different readiness constraints.", "Select temporary coverage rather than reharvesting an unhealed donor site or treating an excised deep wound as a superficial burn."],
        closestError: "Apply the general preference for autograft without checking the actual donor status.", decidingObservation: "The bed is ready for coverage while prior donor sites remain open.",
        counterfactual: "If adequate donor regions were healed and available for harvest, definitive autografting could replace temporary allograft.",
        deletionCheck: "Bed findings establish readiness; donor wounds establish the limiting resource; staged other wounds explain why this is major-burn coverage. The current update is needed beyond the previous regional-depth answer.",
        cueAttack: "The stem does not name a temporary substitute. No option promises an exact graft-take outcome. Review must challenge whether donor-readiness wording makes the question too familiar; the alternative actions remain real surgical plans.",
        categoryCheck: "Three coverage plans for the same prepared burn bed.", difficulty: "Predicted moderate: requires donor/recipient readiness rather than recalling graft physiology; exact material selection needs burn-clinician review.",
        sequenceCheck: "Earlier feedback identifies excision extent but does not introduce allograft. This separate donor-status update determines the later choice.",
      },
    ],
  },
  {
    slug: "nutrition-record", name: "Avery Stone", age: 46, sex: "Female", complaint: "Nutrition record review", historicalAcuity: "urgent_stable",
    presentation: "{patientName}, a 46-year-old woman, reviews her outside burn-unit nutrition records with the founder in clinic. Extensive burns required intubation. During the initial feeding review, blood pressure was maintained after vasopressor discontinuation, lactate was falling and urine output was recovering. Her abdomen was soft with nonbloody drainage but quiet bowel sounds. She could not eat while intubated.",
    nodes: [
      {
        slug: "enteral-after-resuscitation", conceptId: "concept.severe-burn.early-enteral-nutrition", conceptMeaning: "preserved", displayName: "Start enteral support after burn resuscitation", conceptType: "management",
        learningObjective: "Choose initial enteral support after perfusion recovery without treating quiet bowel sounds as a stand-alone contraindication.", role: "replacement", replacesVariantIds: ["question.n1.burn-enteral-nutrition.v1", "question.n1.burn-enteral-nutrition.v2"],
        stem: "Which initial nutrition plan best fits {patientName}'s first outside burn-unit assessment?",
        options: [
          option("enteral", "Start low-rate gastric enteral nutrition", "The acquired perfusion and abdominal record supports a cautious enteral start. Quiet bowel sounds alone do not establish bowel ischemia or obstruction.", ["early-enteral", "quiet-bowel-sounds"], "Integrate the current perfusion trajectory rather than postpone nutrition for a motility sound.", "This represented state supports a cautious monitored start rather than immediate full delivery."),
          option("pn", "Start primary parenteral nutrition", "The record supplies no established reason that the gut route is unusable; a quiet examination alone does not make PN the preferred initial route.", ["early-enteral", "quiet-bowel-sounds"], "Treat intubation and quiet bowel sounds as proof that enteral delivery cannot be used.", "A sustained inability to use the gut can require a separate PN plan after full nutritional assessment."),
          option("wait", "Defer nutrition until stool passage", "Waiting for stool adds a prerequisite not supported by the represented perfusion recovery and abdominal findings.", ["quiet-bowel-sounds", "early-enteral"], "Use a late motility marker as a mandatory gate for feeding.", "Suspected obstruction or bowel ischemia would require reassessment rather than this automatic early-enteral pathway."),
        ],
        explanation: "Interpret the current resuscitation trajectory and abdominal findings together. They support a cautious enteral start despite quiet bowel sounds. This question does not prescribe an exact hour, calorie target, access procedure or advancement schedule.", claimSlugs: ["early-enteral", "quiet-bowel-sounds"],
        reasoningSteps: ["Infer current perfusion recovery from the serial support, lactate and urine course rather than retain the earlier acute-burn state.", "Distinguish a quiet abdomen from a supported enteral contraindication and select the initial nutrition route."],
        closestError: "Choose primary PN or wait for stool because no bowel sounds are heard.", decidingObservation: "Perfusion has recovered and the abdomen is soft with nonbloody drainage; quiet sounds are the remaining misleading feature.",
        counterfactual: "If support were escalating with rising lactate and new abdominal distension, the represented early-enteral start would no longer be supported.",
        deletionCheck: "Perfusion observations determine current eligibility, the abdomen addresses a competing safety concern, quiet sounds test the misconception, and intubation explains inability to eat. No exact resuscitation cutoff is invented.",
        cueAttack: "The vignette does not say adequately resuscitated or functional GI tract. Three specific initial nutrition strategies compete; the key is short and carries no unique caveat. Historical exact row-043 approvals are not transferred to this wording.",
        categoryCheck: "Three initial nutrition prescriptions at the same care phase.", difficulty: "Predicted moderate: requires integrating an acquired perfusion trajectory with the misleading quiet-sounds finding.",
        sequenceCheck: "First node. Its visible explanation does not discuss future route changes, postpyloric feeding or the next node's pause action.",
      },
      {
        slug: "feeding-new-hypoperfusion", conceptId: "concept.n1r3.burn-feeding-new-perfusion-boundary", conceptMeaning: "preserved", displayName: "Pause feeding for a changed burn trajectory", conceptType: "management",
        learningObjective: "Reassess enteral delivery when new hypoperfusion and abdominal findings invalidate an earlier tolerated feeding state.", role: "rewrite", replacesVariantIds: ["question.n1.burn-enteral-nutrition.v3"],
        currentUpdate: "Later, the record shows that gastric feeding had been tolerated. Vasopressor support is then restarted and increased, urine output falls and lactate rises. The abdomen becomes distended and tender, and blood appears in gastric drainage. Urgent resuscitation and abdominal assessment proceed.",
        stem: "Which feeding prescription best fits {patientName}'s later outside-hospital findings while the abdominal assessment proceeds?",
        options: [
          option("pause", "Pause enteral delivery during reassessment", "The new hypoperfusion and abdominal warnings differ from the earlier feeding-eligible state. Changing access does not restore intestinal perfusion.", ["feeding-deterioration", "postpyloric-boundary"], "Reassess current intestinal safety instead of carrying prior eligibility forward.", "This acquired deterioration supports pausing delivery during urgent evaluation."),
          option("gastric", "Continue low-rate gastric enteral delivery", "A low-rate prescription is not sufficient reassurance when support and abdominal findings now raise concern for compromised intestinal safety.", ["feeding-deterioration"], "Apply the earlier successful cautious start as permanent permission to continue.", "Stable perfusion and a benign abdominal trajectory with tolerance could support continuing low-rate delivery."),
          option("jejunal", "Change to low-rate postpyloric enteral delivery", "A postpyloric route can address selected gastric delivery problems but does not bypass hypoperfused bowel or suspected ischemia.", ["postpyloric-boundary", "feeding-deterioration"], "Treat the new findings as isolated gastric intolerance and solve them by moving the tube.", "Persistent nonbloody gastric intolerance with controlled perfusion and no suspected ischemia or obstruction could support a postpyloric pathway."),
        ],
        explanation: "The earlier feeding decision does not remain valid automatically. Interpret the new support/perfusion course and changed abdomen, then pause enteral delivery during urgent assessment. Moving the tube beyond the stomach is not a treatment for compromised bowel perfusion; immediate PN is not inferred.", claimSlugs: ["feeding-deterioration", "postpyloric-boundary"],
        reasoningSteps: ["Recognize that the new hemodynamic and abdominal trajectory differs from isolated gastric intolerance after an otherwise stable start.", "Pause enteral delivery rather than maintain it or shift access past the stomach."],
        closestError: "Advance the tube for presumed gastric intolerance despite a new perfusion problem.", decidingObservation: "Escalating support and worsening perfusion occur with tenderness, distension and bloody drainage after earlier tolerance.",
        counterfactual: "If perfusion stayed controlled and the abdomen remained benign while repeated nonbloody gastric intolerance persisted, a postpyloric route could become reasonable.",
        deletionCheck: "The entire later update changes the prior decision. Neither a previous tolerated feed nor the extensive burn alone determines the answer. The blood, abdominal and perfusion findings distinguish a route problem from a safety boundary.",
        cueAttack: "All labels state a feeding prescription of comparable scope. The task does not label ischemia. Urgent nonnutrition care is common background, not unique to the key. No exact pressor threshold is taught.",
        categoryCheck: "Three enteral-feeding prescriptions at the same reassessment point.", difficulty: "Predicted hard: the competing error is a legitimate route solution applied to a newly unsafe perfusion trajectory.",
        sequenceCheck: "Earlier explanation establishes the actual start state but does not give a pause rule. This node requires the new trajectory; it is not another earliest-start question and does not alter the frozen accepted N2 v3.",
      },
    ],
  },
  {
    slug: "healing-culture", name: "Mina Hart", age: 39, sex: "Female", complaint: "Burn swab result", historicalAcuity: "stable",
    presentation: "{patientName}, a 39-year-old woman, attends clinic for a forearm burn managed with antimicrobial dressings. At consecutive visits the open area has become smaller with new epithelium and less dressing pain. A surface swab taken at the earlier dressing change now reports Pseudomonas aeruginosa, susceptible to ciprofloxacin and cefepime. The wound margin and surrounding skin are unchanged, and she feels well.",
    nodes: [{
      slug: "culture-versus-infection", conceptId: "concept.topic.burns-inhalation.culture-versus-infection.v1", conceptMeaning: "new", displayName: "Interpret a burn surface culture in context", conceptType: "management",
      learningObjective: "Distinguish a positive surface culture in a healing burn from clinical infection when choosing systemic antibiotic escalation.", role: "gap", replacesVariantIds: [],
      stem: "Which antimicrobial plan best fits {patientName}'s wound at this clinic review?",
      options: [
        option("local", "Continue the current antimicrobial dressing regimen", "The healing trajectory and unchanged surrounding skin do not establish infection requiring systemic treatment. Interpret surface growth with the examination and continue reassessment.", ["surface-culture-context", "systemic-antibiotics"], "Distinguish organism recovery from a clinical infection indication.", "This healing course supports continuing local care with reassessment."),
        option("oral", "Add oral ciprofloxacin to the dressing regimen", "Susceptibility states what might treat the organism if systemic therapy were indicated; it does not itself establish that this improving wound requires an antibiotic course.", ["surface-culture-context", "systemic-antibiotics"], "Treat an actionable susceptibility result rather than decide whether infection exists.", "Clinical infection suitable for oral treatment with confirmed susceptibility could make this option relevant after assessment."),
        option("iv", "Add intravenous cefepime to the dressing regimen", "A susceptible surface organism does not establish deep invasive disease or a need for intravenous therapy in this healing, clinically well patient.", ["surface-culture-context", "systemic-antibiotics"], "Escalate route because Pseudomonas is recovered, regardless of sample provenance and course.", "A clinically infected or systemically deteriorating burn may require hospital assessment and systemic therapy guided by appropriate cultures."),
      ],
      explanation: "First interpret the surface specimen alongside actual wound behavior. Then decide whether systemic therapy is indicated. Healing and an unchanged surrounding examination favor local care; a susceptibility report is not a prescription by itself. New tissue deterioration, spreading inflammation or systemic illness would require reassessment.", claimSlugs: ["surface-culture-context", "systemic-antibiotics"],
      reasoningSteps: ["Interpret surface-culture provenance against serial epithelialization, decreasing wound size and clinical course.", "Choose whether to escalate systemic antimicrobial treatment rather than select a drug solely from its susceptibility."],
      closestError: "Use a susceptible antibiotic because a positive result seems to require action.", decidingObservation: "The positive specimen is superficial and the wound continues to heal with an unchanged surrounding examination.",
      counterfactual: "If healing stopped with new tissue breakdown and spreading inflammation, systemic treatment and burn-service reassessment would become appropriate instead of continuation of the current plan.",
      deletionCheck: "Sample provenance and serial course are both necessary; susceptibility makes the oral/IV choices credible. Removed long checklists of absent infection findings. Laboratory susceptibility is a constructed case observation, not a general drug-activity rule.",
      cueAttack: "All labels name the same dressing regimen with a clear systemic escalation difference; no 'antibiotics alone' caricature or uniquely long complete key. Diagnosis is not supplied in the complaint. No procedure or testing order is added by any choice.",
      categoryCheck: "Three antimicrobial plans at the same clinical assessment.", difficulty: "Predicted moderate/hard: an apparently actionable microbiology result competes with a serial healing trajectory and sample limitations.",
      sequenceCheck: "Standalone; no earlier explanation labels the culture colonization. Exact drug/route alternatives require clinical review and do not prescribe doses.",
    }],
  },
);


export const BURNS_INHALATION_TOPIC_REVIEW_ORDER_NOTICE = "key shown first for review only.";

// The v1 definitions above are the immutable independent-review baseline.
function buildArtifacts(definitions: BurnsCaseDraft[], revision: 1 | 2) {
const draft = revision === 1 ? BURNS_INHALATION_TOPIC_DRAFT : { ...BURNS_INHALATION_TOPIC_DRAFT, contentVersion: 'clinical.question-topic-burns-inhalation.2026-11-11.v2' };
const qid = (slug: string) => 'question.topic.burns-inhalation.' + slug + '.v' + revision;
const caseId = (slug: string) => 'case.topic.burns-inhalation.' + slug + '.v' + revision;
const nodeId = (slug: string) => 'node.topic.burns-inhalation.' + slug + '.v' + revision;
const choiceKey = (slug: string, choice: string) => 'choice.topic.burns-inhalation.' + slug + (revision === 1 ? '.' : '.v2.') + choice;
const BURNS_INHALATION_TOPIC_REVIEW_ORDER_NOTICE = "key shown first for review only.";
const allDefinitions = definitions.flatMap(c => c.nodes.map(n => ({ clinicalCase: c, node: n })));
const claimsFor = (node: BurnsNodeDraft) => [...new Set([...node.claimSlugs, ...node.options.flatMap(c => c.claimSlugs)])].map(cid);
const sourceLabelsFor = (claimIds: string[]) => {
  const sourceIds = new Set(BURNS_INHALATION_TOPIC_CLAIMS.filter(c => claimIds.includes(c.id)).flatMap(c => c.sourceIds));
  return BURNS_INHALATION_TOPIC_SOURCES.filter(s => sourceIds.has(s.id)).map(s => s.title);
};

const BURNS_INHALATION_TOPIC_QUESTIONS: QuestionVariant[] = allDefinitions.map(({ node }) => ({
  ...draft, id: qid(node.slug), conceptId: node.conceptId, stem: node.stem,
  answerChoices: node.options.map((choice, i) => ({
    id: choiceKey(node.slug, choice.id),
    label: choice.label, isCorrect: i === 0, rationale: choice.rationale,
    distractorRationale: i === 0 ? null : choice.rationale,
  })),
  explanation: node.explanation, ...(node.exhibit ? { exhibit: node.exhibit } : {}), supportingEvidenceClaimIds: claimsFor(node),
}));
const questionById = new Map(BURNS_INHALATION_TOPIC_QUESTIONS.map(q => [q.id, q]));

const BURNS_INHALATION_TOPIC_CASES: SyntheticClinicalCase[] = definitions.map(definition => {
  const demographics = { ageYears: definition.age, sexLabel: definition.sex };
  const sourceLabels = sourceLabelsFor([...new Set(definition.nodes.flatMap(claimsFor))]);
  return {
    id: caseId(definition.slug), displayName: definition.complaint,
    patientPresentationVariantId: 'presentation.topic.burns-inhalation.' + definition.slug + '.v' + revision,
    releasePointId: 'release.l0.clinic_evaluation',
    patientDisplayName: definition.name, prototypeDemographics: demographics,
    chiefComplaint: definition.complaint, presentation: definition.presentation,
    // Schema field name is legacy. These finite profiles remain unapproved drafts.
    approvedInstantiationProfiles: [{ id: 'profile.topic.burns-inhalation.' + definition.slug + '.v' + revision, prototypeDemographics: demographics,
      chiefComplaint: definition.complaint, presentation: definition.presentation }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: 0,
    requiredClinicalSetting: 'clinic', requiredCapabilityIds: [], rewardTierId: 'reward.clinic_basic', sourceLabels,
    decisionNodes: definition.nodes.map((node, index) => {
      const question = questionById.get(qid(node.slug))!;
      const labels = sourceLabelsFor(question.supportingEvidenceClaimIds);
      return {
        id: nodeId(node.slug), questionVariantId: question.id, primaryConceptId: node.conceptId,
        ...(node.currentUpdate ? { currentUpdate: node.currentUpdate } : {}),
        stem: question.stem,
        answerChoices: question.answerChoices.map(choice => ({ id: choice.id, label: choice.label, isCorrect: choice.isCorrect,
          rationale: choice.rationale!, serviceRequest: null })),
        shuffleAnswers: true, explanation: question.explanation, ...(question.exhibit ? { exhibit: question.exhibit } : {}),
        sourceLabels: labels, resultGateAfter: null,
        terminalDispositions: index === definition.nodes.length - 1
          ? question.answerChoices.filter(choice => !choice.isCorrect).map(choice => ({
            answerChoiceId: choice.id, kind: 'no_terminal_outcome' as const,
            consequenceNarrative: 'The founder reviews the selected plan against the outside record or current clinic findings.',
            clinicalRationale: choice.rationale!, sourceLabels: labels,
          })) : [],
      };
    }),
    learningSummary: definition.nodes.map(node => node.explanation).join(' '),
  };
});

const BURNS_INHALATION_TOPIC_AUTHORING_CONCEPTS = [...new Map(allDefinitions.map(({ node }) => [node.conceptId, {
  ...draft, id: node.conceptId, displayName: node.displayName, learningObjective: node.learningObjective,
  conceptType: node.conceptType, educationalTier: 1 as const, earliestFacilityStage: 0,
  previousConceptId: node.previousConceptId ?? null, conceptMeaning: node.conceptMeaning,
  evidenceClaimIds: [...new Set(allDefinitions.filter(item => item.node.conceptId === node.conceptId).flatMap(item => claimsFor(item.node)))],
  historyPolicy: node.conceptMeaning === 'changed'
    ? revision === 1
      ? 'New scored clinical meaning: operative extent replaces a pure depth label. Keep previous concept/history intact; no FSRS transfer.'
      : 'New scored clinical meaning; previousConceptId records the prior objective. Keep previous concept/history intact; no FSRS transfer.'
    : node.conceptMeaning === 'preserved'
      ? 'Retain stable existing identity for unchanged clinical meaning. Old questions, finite profiles and frozen encounters remain exact.'
      : 'New burn-specific decision identity; no automatic migration of another concept history.',
}])).values()];
const BURNS_INHALATION_TOPIC_TESTED_CONCEPTS: TestedConcept[] = BURNS_INHALATION_TOPIC_AUTHORING_CONCEPTS.map(c => ({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective, conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
}));

const BURNS_INHALATION_TOPIC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = allDefinitions.map(({ clinicalCase, node }) => ({
  caseId: caseId(clinicalCase.slug), nodeId: nodeId(node.slug), questionVariantId: qid(node.slug),
  classification: node.options.some(choice => choice.timingProfileId) ? {
    kind: 'test_choices', choices: node.options.map(choice => ({
      choiceId: choiceKey(node.slug, choice.id), choiceLabel: choice.label,
      timing: choice.timingProfileId ? { kind: 'test', timingProfileId: choice.timingProfileId } : { kind: 'no_test' },
    })),
  } : { kind: 'no_test' },
}));

const BURNS_INHALATION_TOPIC_ORDER_PROPOSALS = allDefinitions.flatMap(({ clinicalCase, node }) => node.options.map(choice => ({
  ...draft, caseId: caseId(clinicalCase.slug), nodeId: nodeId(node.slug), questionVariantId: qid(node.slug),
  choiceId: choiceKey(node.slug, choice.id), choiceLabel: choice.label,
  timing: choice.timingProfileId ? { kind: 'test' as const, timingProfileId: choice.timingProfileId } : { kind: 'no_test' as const },
  serviceRequest: null, resultGateAfter: null, executableOrderAdded: false,
  scope: choice.timingProfileId ? 'Estimate for an offered investigation in a record-review exercise; no new gameplay order or result.' : 'Management/referral/interpretation proposal; existing monitoring and completed chart investigations do not become new orders.',
})));

const BURNS_INHALATION_TOPIC_SOURCE_LINKS = BURNS_INHALATION_TOPIC_SOURCES.map(source => ({
  sourceId: source.id, label: source.title, href: source.officialUrl!, target: '_blank' as const,
  rel: 'noopener noreferrer' as const, referrerPolicy: 'no-referrer' as const,
  attribution: source.organizationOrJournal,
  nonEndorsement: 'Sources are freely linked for factual verification. No source organization endorses this independently authored unapproved prototype.',
}));

const BURNS_INHALATION_TOPIC_AUTHOR_CHECKS = allDefinitions.map(({ clinicalCase, node }) => ({
  ...draft, questionVariantId: qid(node.slug), caseId: caseId(clinicalCase.slug),
  manualAuthorGate: [
    { check: '1. Cover-the-key cue attack', record: node.cueAttack },
    { check: '2. One decision stage/category', record: node.categoryCheck },
    { check: '3. Two consequential supported steps', record: node.reasoningSteps.join(' Then: ') },
    { check: '4. Predicted resident difficulty', record: node.difficulty },
    { check: '5. One defensible key/counterfactual', record: node.decidingObservation + ' Counterfactual: ' + node.counterfactual },
  ],
  closestError: node.closestError, decidingObservation: node.decidingObservation, counterfactual: node.counterfactual,
  deletionCheck: node.deletionCheck, fullVisibleSequenceCheck: node.sequenceCheck,
  finiteProfileCheck: 'One fixed ' + clinicalCase.age + '-year-old ' + clinicalCase.sex.toLowerCase() + ' profile with a named prototype; full presentation, current update, exhibit, prior feedback and all options reviewed. No random clinical data profiles or race/ethnicity weighting.',
  authorReviewRole: 'Author self-check only. No independent PASS, manager acceptance or clinical approval is conferred.',
}));

const BURNS_INHALATION_TOPIC_STATEMENT_MAPPINGS = allDefinitions.map(({ clinicalCase, node }) => ({
  ...draft, caseId: caseId(clinicalCase.slug), questionVariantId: qid(node.slug),
  constructedObservationFields: ['patientDisplayName', 'prototypeDemographics', 'presentation', 'approvedInstantiationProfiles[0]',
    ...(node.currentUpdate ? ['decisionNodes[' + node.slug + '].currentUpdate'] : []), ...(node.exhibit ? ['exhibit.cells', 'exhibit.rowHeaders'] : [])],
  constructedObservationPolicy: 'Names, ages, sex, times, regions, measurements and clinical courses are fictional observations. They are not empirical probabilities, demographic disease weights or new decision thresholds. The sourced clinical interpretation is mapped below.',
  clinicalAssertions: [
    { fields: ['presentation associations', 'currentUpdate associations', 'stem', 'explanation', 'learningObjective', 'terminalDispositions[].clinicalRationale'], evidenceClaimIds: claimsFor(node) },
    ...node.options.map(choice => ({ fields: ['answerChoices[id=' + choiceKey(node.slug, choice.id) + '].label', 'answerChoices[id=' + choiceKey(node.slug, choice.id) + '].rationale', 'option-review[id=' + choice.id + '].whenReasonable'], evidenceClaimIds: choice.claimSlugs.map(cid) })),
  ],
}));

const BURNS_INHALATION_TOPIC_CASE_REVIEWS = definitions.map(c => ({
  ...draft, caseId: caseId(c.slug), educationalTier: 1, currentPatientAcuity: c.presentation.includes('outside') ? 'stable' as const : c.historicalAcuity,
  reviewedEpisodeAcuity: c.historicalAcuity, earliestFacilityStage: 0, requiredCapabilityIds: [] as string[],
  requiredClinicalSetting: 'clinic' as const,
  clinicalSettingScope: 'Current clinic assessment or clinic review of outside hospital records. Hospital interventions are not offered as care inside this clinic.',
  profileReviewStatus: 'needs_clinician_review' as const,
  selectionConstraint: c.nodes.length > 1
    ? 'Paired-only in this authoring sidecar. Existing selection requires all case concepts to be unseen or due; a future-due companion can block the case, and either position may be selected. A later selected node must retain its current update and prior visible context. No selector/FSRS changes.'
    : 'Standalone case in this sidecar.',
  sequenceNotes: c.nodes.map(n => ({ questionVariantId: qid(n.slug), record: n.sequenceCheck })),
}));

const BURNS_INHALATION_TOPIC_PREVIEW_RELEASE = {
  id: 'clinical.topic.burns-inhalation.2026-11-11.v' + revision, schemaVersion: 1,
  publicationStatus: 'synthetic_unapproved_prototype',
  disclaimer: 'Original synthetic authoring preview; not clinically approved. Requires independent review, manager acceptance and exact-version clinical review. Source links do not imply endorsement.',
  concepts: BURNS_INHALATION_TOPIC_TESTED_CONCEPTS, cases: BURNS_INHALATION_TOPIC_CASES,
} as const;
const BURNS_INHALATION_TOPIC_MANIFEST = {
  ...draft, topicSlug: 'burns-inhalation', wave: 8, scope: 'explicit_import_authoring_sidecar',
  caseCount: BURNS_INHALATION_TOPIC_CASES.length, nodeCount: BURNS_INHALATION_TOPIC_QUESTIONS.length,
  conceptCount: BURNS_INHALATION_TOPIC_TESTED_CONCEPTS.length,
  roles: { rewrites: allDefinitions.filter(x => x.node.role === 'rewrite').length,
    replacements: allDefinitions.filter(x => x.node.role === 'replacement').length, newGapNodes: allDefinitions.filter(x => x.node.role === 'gap').length },
  managerAccepted: false, pipelinePassed: false, clinicalApproval: false, publicReleaseAuthorized: false,
  defaultReleaseModified: false, executableOrdersAdded: false, networkDuringGameplay: false,
  integrationOwner: 'Claude Code thread GamifySurgery manager',
};

return {questions: BURNS_INHALATION_TOPIC_QUESTIONS,
cases: BURNS_INHALATION_TOPIC_CASES,
authoring_concepts: BURNS_INHALATION_TOPIC_AUTHORING_CONCEPTS,
tested_concepts: BURNS_INHALATION_TOPIC_TESTED_CONCEPTS,
timing_entries: BURNS_INHALATION_TOPIC_TIMING_ENTRIES,
order_proposals: BURNS_INHALATION_TOPIC_ORDER_PROPOSALS,
source_links: BURNS_INHALATION_TOPIC_SOURCE_LINKS,
author_checks: BURNS_INHALATION_TOPIC_AUTHOR_CHECKS,
statement_mappings: BURNS_INHALATION_TOPIC_STATEMENT_MAPPINGS,
case_reviews: BURNS_INHALATION_TOPIC_CASE_REVIEWS,
preview_release: BURNS_INHALATION_TOPIC_PREVIEW_RELEASE,
manifest: BURNS_INHALATION_TOPIC_MANIFEST};
}

const reviewed = buildArtifacts(BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS, 1);
export const BURNS_INHALATION_TOPIC_REVIEWED_QUESTIONS = reviewed.questions;
export const BURNS_INHALATION_TOPIC_REVIEWED_CASES = reviewed.cases;
export const BURNS_INHALATION_TOPIC_REVIEWED_AUTHORING_CONCEPTS = reviewed.authoring_concepts;
export const BURNS_INHALATION_TOPIC_REVIEWED_TESTED_CONCEPTS = reviewed.tested_concepts;
export const BURNS_INHALATION_TOPIC_REVIEWED_TIMING_ENTRIES = reviewed.timing_entries;
export const BURNS_INHALATION_TOPIC_REVIEWED_ORDER_PROPOSALS = reviewed.order_proposals;
export const BURNS_INHALATION_TOPIC_REVIEWED_SOURCE_LINKS = reviewed.source_links;
export const BURNS_INHALATION_TOPIC_REVIEWED_AUTHOR_CHECKS = reviewed.author_checks;
export const BURNS_INHALATION_TOPIC_REVIEWED_STATEMENT_MAPPINGS = reviewed.statement_mappings;
export const BURNS_INHALATION_TOPIC_REVIEWED_CASE_REVIEWS = reviewed.case_reviews;
export const BURNS_INHALATION_TOPIC_REVIEWED_PREVIEW_RELEASE = reviewed.preview_release;
export const BURNS_INHALATION_TOPIC_REVIEWED_MANIFEST = reviewed.manifest;

// One new-version attempt per returned item. No author self-check grants PASS.
function revisionCase(slug: string, caseChanges: Partial<BurnsCaseDraft>, nodeChanges: Partial<BurnsNodeDraft>): BurnsCaseDraft {
  const oldCase = BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS.find(c => c.nodes.some(n => n.slug === slug))!;
  const oldNode = oldCase.nodes.find(n => n.slug === slug)!;
  return { ...oldCase, slug: slug + '-revision', ...caseChanges,
    nodes: [{ ...oldNode, currentUpdate: undefined, exhibit: undefined, ...nodeChanges }] };
}

const parkedGate = (reason: string): Pick<BurnsNodeDraft, 'reasoningSteps' | 'closestError' | 'decidingObservation' | 'counterfactual' | 'deletionCheck' | 'cueAttack' | 'categoryCheck' | 'difficulty' | 'sequenceCheck'> => ({
  reasoningSteps: ['Interpret the retained raw warning/laboratory findings.', 'The one-attempt revision still reduces to foundational recognition and its immediate associated action; a second consequential resident inference is not established.'],
  closestError: 'Misapply a reassuring measurement or the local treatment pathway despite the retained relevant abnormal observations.',
  decidingObservation: 'The complete case retains the urgent abnormal findings that make the safety or diagnostic response defensible.',
  counterfactual: 'A clinically mild course without the described danger or diagnostic discordance would change the offered action; removing actual danger merely to increase difficulty is not an acceptable revision.',
  deletionCheck: 'Retained warning signs and acquisition chronology. Removing them would change safety or fairness; adding an unrelated decision would not repair the narrow objective.',
  cueAttack: 'One v2 attempt removes the specific returned task/foil wording problems. ' + reason,
  categoryCheck: 'Parallel concrete alternatives retained for inspection only; this is a parked candidate, excluded from proposed supply.',
  difficulty: 'Author gate does not pass: still easy, with no accepted safety/onboarding exception. ' + reason,
  sequenceCheck: 'Parked standalone candidate. No PASS or revised companion shares this case; no independent PASS or clinical approval claimed.',
});

export const BURNS_INHALATION_TOPIC_PARKED_CASE_DEFINITIONS: BurnsCaseDraft[] = [
  revisionCase('smoke-emergency-disposition', {}, {
    stem: "Which immediate care arrangement was indicated when {patientName}'s voice and breathing changed in the recorded visit?",
    options: [
      option('ems', 'Activate EMS for airway-capable emergency transfer', 'The changing voice and breathing require emergency assessment despite a normal conventional saturation; burn-service coordination proceeds with emergency stabilization and transport.', ['airway-danger'], 'Use the evolving clinical airway findings.', 'These urgent findings support this arrangement.'),
      option('specialist', 'Arrange direct ambulance transport to an ambulatory burn service', 'A destination limited to ambulatory wound assessment does not meet the new airway concern, even though the visible skin burn is small.', ['airway-danger', 'special-site-referral'], 'Choose burn-specialist access without matching airway capability.', 'A stable wound-care referral without airway warning signs could use an ambulatory burn pathway.'),
      option('observe', 'Provide urgent-care observation with serial oxygen readings', 'Serial conventional saturation cannot make the acquired voice and breathing changes safe to observe in this setting.', ['airway-danger', 'co-oximetry'], 'Use the reassuring saturation as the main clearance measure.', 'A clinically stable exposure without progressive airway findings could permit observation under an appropriate protocol.'),
    ],
    explanation: 'Progressive voice and breathing changes require airway-capable emergency care. The small external burn and conventional saturation do not establish airway safety.',
    claimSlugs: ['airway-danger', 'co-oximetry', 'special-site-referral'],
    ...parkedGate('The future-appointment foil and production-setting feedback were removed. Credible destination/observation contrasts still make this overt breathing emergency an easy safety-recognition question; no accepted exception exists.'),
  }),
  revisionCase('co-oxygen-discordance', {}, {
    options: [
      option('coox', 'Blood co-oximetry', 'A high arterial oxygen tension and conventional pulse saturation do not exclude impaired oxygen carriage from CO; co-oximetry measures COHb.', ['co-oximetry'], 'Investigate the blood oxygen-carriage problem rather than repeat oxygen tension.', 'The enclosed-fire symptoms despite reassuring conventional oxygen readings support measuring COHb.', 'timing.test.basic_labs'),
      option('lactate', 'Blood lactate concentration', 'Lactate can help assess smoke-related systemic toxicity or poor perfusion but does not determine the carboxyhemoglobin fraction responsible for this diagnostic discordance.', ['cyanide', 'co-oximetry'], 'Use a marker of systemic smoke toxicity as the specific CO measurement.', 'Severe lactic acidosis and collapse after enclosed-space smoke would make lactate important in the cyanide assessment.', 'timing.test.basic_labs'),
      option('hemoglobin', 'Blood hemoglobin concentration', 'Hemoglobin concentration does not quantify the fraction bound to CO. A concentration result cannot replace the indicated dyshemoglobin measurement.', ['co-oximetry'], 'Treat oxygen carriage as solely a matter of hemoglobin quantity.', 'Suspected blood loss or anemia would justify measuring hemoglobin concentration.', 'timing.test.basic_labs'),
    ],
    explanation: 'Normal conventional saturation and high arterial oxygen tension do not exclude CO poisoning. Blood co-oximetry provides a COHb measurement; clinical interpretation must account for oxygen and elapsed time.',
    claimSlugs: ['co-oximetry', 'cyanide'],
    ...parkedGate('The redundant repeat-PaO2 foil was replaced by lactate, a genuine competing smoke-toxicity investigation. The remaining decision is still the familiar CO-to-co-oximetry association, not a fair moderate two-step item.'),
  }),
  revisionCase('airway-before-investigation', {}, {
    currentUpdate: 'His voice becomes faint and coarse, saliva pools because swallowing is difficult, and inspiratory noise appears. He remains awake and finger oxygen saturation is 97% on oxygen. The outside team is preparing transfer to a burn unit.',
    stem: "Which immediate sequence is indicated before {patientName}'s transfer in the outside-hospital record?",
    options: [
      option('intubate', 'Endotracheal intubation, followed by burn-unit transfer', 'The progressive obstructive findings require airway control before transport; normal conventional saturation does not establish patency.', ['airway-danger', 'airway-sequence'], 'Prioritize the changing airway before transport.', 'This progression supports airway control before the transfer.'),
      option('transport', 'Burn-unit transfer, followed by endotracheal intubation', 'Deferring airway control to the receiving unit is unsafe with the represented progressive voice, swallowing and inspiratory findings.', ['airway-danger', 'airway-sequence'], 'Move first to definitive burn expertise despite current airway deterioration.', 'A stable patent airway without progressive warning signs could permit transfer without pre-transfer intubation.'),
      option('image', 'Chest radiography, followed by burn-unit transfer', 'Chest imaging does not resolve the current upper-airway patency problem and should not delay airway management.', ['airway-sequence', 'bronchoscopy'], 'Seek an initial diagnostic study before acting on the airway examination.', 'After airway stabilization, chest imaging can investigate pulmonary or thoracic findings.', 'timing.test.radiography'),
    ],
    explanation: 'The changing voice, secretion handling and inspiratory noise indicate a threatened airway. Stabilize it before transport or nonessential investigation; a reassuring conventional saturation does not negate those observations.',
    ...parkedGate('The airway-plan/intubation wording match and bronchodilator foil were removed. Every clinically fair version retaining pooled saliva and inspiratory noise remains an obvious initial-airway safety decision, overlapping the other smoke-emergency item.'),
  }),
  revisionCase('fluoride-systemic-calcium', {}, {
    stem: "Which immediate treatment best addresses {patientName}'s acquired findings in the outside-hospital record?",
    options: [
      option('iv', 'Intravenous calcium gluconate', 'Bilateral spasm, ectopy, QT lengthening and low serum calcium establish a systemic treatment need beyond the improved local pain.', ['hf-systemic', 'hf-calcium'], 'Separate systemic calcium effects from local wound pain.', 'Systemic symptomatic hypocalcemia supports monitored intravenous calcium with toxicology guidance.'),
      option('topical', 'Topical calcium gluconate', 'Topical treatment addresses the skin exposure but does not treat the represented systemic calcium disturbance.', ['hf-systemic', 'hf-calcium'], 'Continue the locally successful treatment as systemic effects emerge.', 'A localized exposure with pain but no systemic findings can require topical treatment under an agent-specific protocol.'),
      option('local', 'Local calcium gluconate infiltration', 'A local delivery technique is not the systemic treatment indicated by distant neuromuscular and cardiac effects; its agent-specific technique is not prescribed here.', ['hf-systemic', 'hf-calcium'], 'Treat reduced local pain as the only response target.', 'Selected persistent local injury can require specialist-directed local calcium therapy; exact technique remains withheld.'),
    ],
    explanation: 'The acquired distant neuromuscular and cardiac findings with low calcium indicate systemic fluoride toxicity. Intravenous calcium is assessed under ECG and electrolyte surveillance with toxicology guidance; no dose, concentration or local injection technique is taught.',
    ...parkedGate('The task no longer supplies calcium treatment as the category. Nevertheless explicit symptomatic hypocalcemia makes the systemic route obvious. Supported facts do not establish a fair harder competing systemic regimen; inventing dose or administration rankings is withheld.'),
  }),
];

export const BURNS_INHALATION_TOPIC_REVISION_CASE_DEFINITIONS: BurnsCaseDraft[] = [
  revisionCase('deep-hand-referral', {
    presentation: "{patientName}, a 43-year-old woman, reviews an outside hand-burn dressing visit with the founder in clinic. The burn service had planned serial assessment of a mottled dorsal hand wound crossing finger joints. Before the new dressing, her fingers were warm with brisk nail-bed refill and strong Doppler signals. The palm and wrist skin were unburned and pliable.",
  }, {
    conceptId: 'concept.topic.burns-inhalation.external-dressing-constriction.v1', previousConceptId: 'concept.burn.referral-consultation-selection', conceptMeaning: 'changed',
    displayName: 'Respond to a changed hand examination after dressing', conceptType: 'management',
    learningObjective: 'Use chronology and the constraining layer to choose the first response to new distal perfusion loss after hand-burn dressing.',
    currentUpdate: "After a continuous elastic wrap was applied around the hand and wrist, the fingers became cool and tingling, refill slowed and Doppler signals weakened. The wrap felt taut over the swollen hand. Blood pressure and the opposite hand were unchanged; the forearm remained soft. The team was reassessing her at the bedside.",
    stem: "Which immediate intervention is indicated for {patientName}'s changed hand findings in this dressing record?",
    options: [
      option('unwrap', 'Remove the circumferential dressing and reassess the hand', 'The new restriction follows the wrap across unburned pliable skin. Remove that reversible external pressure and immediately repeat the neurovascular examination; persistent compromise requires urgent escalation.', ['r2-external-constriction'], 'Localize the new constriction before choosing an operative layer.', 'This first action fits the new wrap-related deterioration; it does not authorize observation of persistent ischemia.'),
      option('eschar', 'Perform hand escharotomy and reassess the hand', 'The burned skin does not encircle the hand or wrist. The new external wrap must be addressed before attributing the change to restrictive burn eschar.', ['r2-external-constriction', 'limb-escharotomy'], 'Use the burn diagnosis to select a familiar skin-release operation.', 'Persistent perfusion loss beneath circumferential deep eschar after external measures would support burn-surgeon-directed eschar release.'),
      option('fascia', 'Perform forearm fasciotomy and reassess the hand', 'A soft forearm and the immediate post-wrap trajectory favor external constriction over a primary deep forearm compartment problem.', ['r2-external-constriction', 'compartment-examination'], 'Escalate any distal sensory or Doppler change directly to fascial release.', 'Progressive deep tension, stretch pain and weakness after muscle injury despite removal of external pressure would support fasciotomy.'),
    ],
    explanation: 'Distinguish the old wound-depth question from the new circulation problem. The change occurs after circumferential wrapping across pliable unburned skin. Remove the wrap and reassess immediately; neither a burn label nor tingling identifies the tissue layer requiring an operation. Persistent abnormal perfusion needs urgent specialist treatment.',
    claimSlugs: ['r2-external-constriction', 'limb-escharotomy', 'compartment-examination'],
    reasoningSteps: ['Localize the new regional perfusion loss using the pre/post-dressing chronology and unchanged systemic circulation.', 'Select removal of the external constriction before a skin or deep fascial operation.'],
    closestError: 'Choose escharotomy because the injured hand is burned, overlooking that the constraining envelope is the new wrap.',
    decidingObservation: 'Perfusion was preserved before wrapping; deterioration follows a taut circumferential dressing over a noncircumferential wound and pliable palm/wrist.',
    counterfactual: 'If the wrap had already been removed and perfusion still declined beneath circumferential rigid deep eschar, escharotomy would replace dressing removal as the next release.',
    deletionCheck: 'The old depth detail alone no longer selects an option. The paired perfusion examinations, timing, unburned envelope and soft forearm distinguish three different constraining layers.',
    cueAttack: 'No service-name match remains. All labels name a specific intervention followed by the same reassessment; none says external constriction or explains its superiority. Necessary distal warning signs remain.',
    categoryCheck: 'Three immediate interventions for the same acquired hand perfusion problem.',
    difficulty: 'Fair moderate prediction: the nearest error is an unnecessary burn-skin operation for an externally constrained hand. This replaces the former depth-to-referral objective rather than pretending it became harder.',
    sequenceCheck: 'Standalone clinic chart review. No earlier depth/referral feedback is needed; no companion is exposed.',
  }),
  revisionCase('pain-exceeds-clinic', {
    presentation: "{patientName}, a 43-year-old woman, attends clinic for a small moist pink torso scald. Two earlier dressing-removal attempts stopped when she pulled away in pain, leaving part of the wound unseen. She was comfortable at rest. The clinic has staff for oral premedication, wound examination and redressing with vital-sign checks; intravenous drug titration and anesthesia are provided at the affiliated hospital.",
  }, {
    currentUpdate: "At today's observed session, oral premedication was given before wound care. She remained alert with unchanged respiratory observations while the entire dressing was removed, the wound was examined and a new dressing was applied. She allowed the same wound movements that had stopped the earlier attempts. No operative debridement is planned.",
    stem: "Which arrangement best fits {patientName}'s next comparable dressing change after today's observed procedure?",
    options: [
      option('oral', 'Clinic dressing care with the effective oral premedication plan', 'The complete observed procedure, rather than resting comfort, demonstrates that comparable wound care currently fits the clinic resources. Reassess tolerance at each visit.', ['r2-procedural-response', 'pain-capability', 'local-care'], 'Use the newly demonstrated procedural response to choose the care setting.', 'The present full-procedure tolerance supports this arrangement; recurrent incomplete care would change it.'),
      option('iv', 'Hospital dressing care with titrated intravenous analgesia', 'This would address inadequately controlled procedural pain, but the newly completed examination and redressing no longer demonstrate that need for the next comparable change.', ['r2-procedural-response', 'pain-capability'], 'Let two earlier failures mandate escalation despite an observed successful revised approach.', 'If pain again prevents full examination or redressing after appropriate oral premedication, hospital analgesia capability becomes appropriate.'),
      option('anesthesia', 'Day-surgery dressing care with general anesthesia', 'General anesthesia is not established as necessary for a comparable change now completed while alert; an operative procedure or failure of less intensive supported care would change the arrangement.', ['r2-procedural-response', 'pain-capability'], 'Treat an incomplete past dressing examination as a continuing requirement for anesthesia.', 'A necessary operative burn procedure requiring anesthesia would support the day-surgery arrangement.'),
    ],
    explanation: 'The earlier failures concerned procedural pain, so comfort between changes could not settle the setting. The new observation covers removal, full examination and redressing while alert after oral premedication. That response supports comparable clinic care, with reassessment rather than an automatic guarantee of future tolerance.',
    claimSlugs: ['r2-procedural-response', 'pain-capability', 'local-care'],
    reasoningSteps: ['Distinguish resting comfort and partial attempts from an observed complete dressing procedure.', 'Use the actual new procedural response and available resources to select the next comparable care arrangement.'],
    closestError: 'Escalate from the two earlier failures without using the later completed procedure, or infer tolerance merely from resting comfort.',
    decidingObservation: 'The entire removal/examination/redressing now succeeds while alert using the clinic-supported oral plan.',
    counterfactual: 'If the new attempt also stopped before examination despite appropriate oral premedication, the hospital intravenous-analgesia arrangement would become preferable.',
    deletionCheck: 'Delete the new update and the clinic key is no longer supportable. Earlier failed examinations establish the real uncertainty; resources and absence of an operative procedure constrain the alternative arrangements.',
    cueAttack: 'No sentence names the key service as missing. The three arrangements differ in actual route/setting; no duplicate clinic/home repetition or uniquely novel escalation remains. Successful procedure is acquired evidence, not the label adequate analgesia.',
    categoryCheck: 'Three concrete care arrangements for the next comparable dressing procedure.',
    difficulty: 'Fair moderate prediction retained openly. The consequential competitor is escalation based on past failed procedural care, reversed by a complete observed response.',
    sequenceCheck: 'Standalone. No previous explanation tells the learner to keep clinic care; the current procedure must be read.',
  }),
  revisionCase('thermal-limb-release', {}, {
    currentUpdate: 'The right fingers became cooler with slower refill, and palmar Doppler signals weakened on repeated examination. Dressings and jewelry were removed and the limb elevated; these findings persisted. Blood pressure and the opposite hand\'s perfusion remained unchanged. The arm had no crush or electrical mechanism.',
    stem: "Which immediate intervention is indicated for {patientName}'s right forearm at this point in the outside record?",
    options: [
      option('eschar', 'Perform forearm escharotomy and reassess distal perfusion', 'Local compromise persists beneath circumferential deep thermal eschar after external measures and systemic recovery. Release the skin envelope and reassess before assuming deeper decompression is required.', ['limb-escharotomy'], 'Identify the layer creating restriction.', 'This record supports eschar release followed by reassessment.'),
      option('fascia', 'Perform forearm fasciotomy and reassess distal perfusion', 'The stated mechanism and skin-envelope pattern support escharotomy first. A deep compartment problem can still require fascial release if demonstrated or if compromise persists after adequate skin release.', ['limb-escharotomy', 'electrical-fasciotomy'], 'Use the deeper operation for every ischemic burned limb.', 'Primary deep muscle injury with compartment findings or persistent compromise after complete eschar release could require fasciotomy.'),
      option('artery', 'Perform forearm arterial exploration and reassess distal perfusion', 'No focal arterial-injury event is represented; the deterioration develops under a circumferential rigid burn while systemic perfusion is unchanged. The available record supports release of that restriction first.', ['limb-escharotomy', 'compartment-examination'], 'Attribute weakening distal Doppler signals directly to an injured artery.', 'A focal arterial disruption or occlusion demonstrated in a compatible injury would make arterial repair rather than skin release necessary.'),
    ],
    cueAttack: 'The task now asks neutrally for an immediate intervention. All three labels name a procedure and the same reassessment, with no elevation option already defeated by the record. Distal danger signs and failed simple measures remain intact.',
    categoryCheck: 'Three immediate forearm operations; the decision is the anatomic source of perfusion compromise.',
    deletionCheck: 'Failed external measures establish why surgical escalation is now needed; systemic/opposite-hand observations localize the problem. Removing the circumferential rigid envelope removes the basis for choosing the operative layer.',
    difficulty: 'Fair moderate prediction, consistent with independent review: escharotomy versus fasciotomy is the closest meaningful distinction; arterial exploration is a mechanism error, not an omitted-care foil.',
    sequenceCheck: 'Standalone revision. The exact PASS chest node is separately preserved; this feedback no longer primes a companion in the proposed case.',
  }),
  revisionCase('electrical-pigment-resuscitation', {
    presentation: '{patientName}, a 36-year-old man, reviews his outside electrical-injury admission with the founder in clinic. Industrial high-voltage contact caused small entry and exit wounds and marked muscle tenderness. His urine was dark brown with detected myoglobin; creatine kinase was 26,000 U/L (laboratory upper reference 200 U/L). The team initially increased balanced crystalloid and recorded the following later fluid review.',
  }, {
    conceptId: 'concept.topic.burns-inhalation.electrical-oliguria-volume-context.v1', previousConceptId: 'concept.topic.burns-inhalation.electrical-pigment-resuscitation.v1', conceptMeaning: 'changed',
    displayName: 'Reassess oliguria after electrical-injury resuscitation',
    learningObjective: 'Integrate acquired perfusion and fluid-accumulation findings before directing further crystalloid for electrical muscle injury.',
    currentUpdate: 'His 80-kg preinjury weight has risen to 88 kg, with a recorded positive fluid balance of 8 L. Urine output over the last three hours is 15, 12 and 8 mL; creatinine has doubled from baseline. The urinary catheter flushes freely and bladder ultrasonography shows an empty bladder. Blood pressure is stable without vasopressors, extremities are warm and lactate has normalized. New bilateral crackles and an increasing oxygen requirement have appeared; chest radiography shows bilateral interstitial fluid. The renal team is evaluating reversible causes and electrolyte complications.',
    stem: "Which direction for {patientName}'s crystalloid infusion best fits this later outside-hospital review while renal assessment continues?",
    options: [
      option('reduce', 'Reduce crystalloid and reassess perfusion and fluid balance', 'Low output now coexists with recovered systemic perfusion, marked accumulation and new respiratory findings. Continuing to chase output with crystalloid risks worsening overload rather than treating intrinsic renal injury.', ['r2-oliguria-volume-context', 'electrical-muscle'], 'Use the whole acquired volume/perfusion trajectory.', 'The represented accumulation and recovered perfusion support reducing unnecessary delivery while the renal problem is assessed.'),
      option('maintain', 'Maintain crystalloid and reassess perfusion and fluid balance', 'An unchanged infusion continues substantial delivery despite new accumulation and respiratory consequences; the original electrical-injury fluid rationale is no longer sufficient.', ['r2-oliguria-volume-context'], 'Preserve the established resuscitation prescription because the muscle injury remains significant.', 'An appropriate current fluid balance without worsening congestion or hypoperfusion could support maintaining the existing rate.'),
      option('increase', 'Increase crystalloid and reassess perfusion and fluid balance', 'Oliguria and pigmenturia warrant urgent assessment, but do not establish an indication for still more fluid in this newly congested, systemically perfused patient.', ['r2-oliguria-volume-context', 'electrical-muscle'], 'Apply a rhabdomyolysis urine-output goal without checking the current volume response.', 'Oliguria with inadequate replacement, cool extremities and ongoing poor perfusion without accumulation could support additional monitored crystalloid.'),
    ],
    explanation: 'The small skin wounds underestimate muscle injury, so initial monitored fluid replacement was appropriate. The later decision uses the acquired volume and perfusion assessment: very low output persists after recovery of systemic perfusion while weight, fluid balance and respiratory findings worsen. Reduce unnecessary crystalloid while urgently evaluating renal injury and complications; neither a diuretic prescription nor automatic dialysis follows from this question.',
    claimSlugs: ['electrical-muscle', 'r2-oliguria-volume-context'],
    reasoningSteps: ['Interpret persistent oliguria with patent drainage, recovered perfusion and new fluid accumulation rather than equating all low output with inadequate replacement.', 'Change the infusion direction while renal evaluation continues instead of reflexively escalating for pigmenturia.'],
    closestError: 'Increase fluid solely because urine is dark and output is low after electrical injury.',
    decidingObservation: 'Quantified oliguria persists with normalized lactate and warm perfusion, but an 8-L positive balance, weight gain and new pulmonary findings have developed.',
    counterfactual: 'If the fluid balance instead showed inadequate replacement with cool perfusion and rising lactate, and the respiratory/weight accumulation were absent, increasing monitored crystalloid would become reasonable.',
    deletionCheck: 'Without quantitative output and the volume/cardiopulmonary/perfusion assessment the options cannot be fairly ranked. Catheter and bladder observations exclude a readily reversible measurement/drainage explanation.',
    cueAttack: 'No diagnosis label such as over-resuscitated supplies the answer. All labels have the same reassessment scope and differ only in direction. No exact output target or dynamic-test cutoff is asserted.',
    categoryCheck: 'Three directions for the same existing infusion at the same later review.',
    difficulty: 'Predicted moderate/hard: the familiar electrical-pigment fluid rule conflicts with the later renal/volume trajectory. The source supports direction, not a universal reduction fraction.',
    sequenceCheck: 'Standalone later record review. The PASS compartment node keeps its original presentation and examination in a different case; no new volume facts are retrofitted into its frozen context.',
  }),
];

BURNS_INHALATION_TOPIC_REVISION_CASE_DEFINITIONS.push(
  revisionCase('co-after-oxygen', {}, {
    currentUpdate: 'A pre-treatment specimen later returned with COHb 28%. After high-concentration oxygen, COHb is 4%. At the first formal short-term retention assessment, she cannot retain three new instructions and repeatedly loses her place during a simple task. No comparable retention assessment was documented initially. An EMS report retrieved after the first laboratory review documents loss of consciousness before arrival. She maintains her airway; oxygen and neurologic monitoring continue.',
    stem: "Which treatment-assessment pathway best fits {patientName}'s later outside-hospital record?",
    options: [
      option('hbo', 'Obtain urgent hyperbaric-specialist assessment during oxygen treatment', 'The newly retrieved loss of consciousness and now documented cognitive abnormality warrant assessment for possible hyperbaric treatment even though the treated COHb is low. Consultation is not a claim that HBO is mandatory.', ['co-hbo', 'co-oximetry'], 'Judge treatment assessment from clinical severity and treatment-dependent measurements.', 'This combination supports urgent specialist assessment of the possible HBO role.'),
      option('normobaric', 'Complete normobaric oxygen as the definitive treatment pathway', 'The reduced COHb documents a treated sample, not resolution of the newly established neurologic and historical severity findings. Continuing the same pathway without specialist assessment misses the relevant escalation decision.', ['co-hbo', 'co-oximetry'], 'Let the improved laboratory value determine the entire treatment pathway.', 'A mild course with complete symptom and neurologic resolution and no severe exposure features could support completion of normobaric treatment.'),
    ],
    explanation: 'COHb falls during oxygen treatment and does not by itself measure the remaining clinical concern. The first formal retention test establishes a current abnormality; it does not prove decline from an unmeasured baseline. Integrate that finding with the retrieved prehospital loss of consciousness and seek urgent hyperbaric-specialist assessment while current oxygen and monitoring continue.',
    reasoningSteps: ['Interpret the low COHb in relation to oxygen treatment and distinguish a newly measured retention deficit from an undocumented baseline trend.', 'Use the clinical severity history and current examination to choose urgent specialist treatment assessment rather than let the treated value close the decision.'],
    closestError: 'Continue the same oxygen pathway because the most recent COHb is low despite current cognitive abnormality and the retrieved loss of consciousness.',
    decidingObservation: 'The reassuring laboratory value is post-treatment; current formal testing is abnormal and the newly retrieved EMS record documents loss of consciousness.',
    counterfactual: 'If she had complete clinical and neurologic recovery after a mild exposure with no loss of consciousness or other severe feature, completing the normobaric pathway would become the appropriate offered choice.',
    deletionCheck: 'The before/after specimen provenance makes the laboratory change interpretable. Formal-test chronology removes the unsupported claim of persistence or decline. The new EMS history and cognitive assessment determine escalation.',
    cueAttack: 'Removed the discharge straw man and the negatively worded without-consultation label. Oxygen and monitoring are common background. Two genuine treatment pathways remain; no third artificial plan was added merely to pad the set.',
    categoryCheck: 'Two treatment-assessment pathways at the same stage. Item-specific two-option exception follows the independent reviewer suggestion to use a real consultation decision without padded options; manager must accept this presentation exception before integration.',
    difficulty: 'Fair moderate retained: treated-value anchoring is the credible error. No claim of unprimed hard difficulty or universal HBO benefit.',
    sequenceCheck: 'Standalone with the full initial record and later acquired results. The parked co-oximetry node is not required or shown.',
  }),
  revisionCase('lower-airway-assessment', {}, {
    conceptId: 'concept.topic.burns-inhalation.airway-debris-intervention.v1', previousConceptId: 'concept.topic.burns-inhalation.lower-airway-assessment.v1', conceptMeaning: 'changed',
    conceptType: 'management', displayName: 'Localize and address post-fire airway obstruction',
    learningObjective: 'Use passive ventilator measurements and acquired tube/lung observations to select the next procedure for retained lower-airway material.',
    currentUpdate: 'After intubation and transfer, circulation is stable. During passive ventilation with an interpretable inspiratory hold, peak pressure rises from 24 to 42 cm H2O while plateau remains 20 cm H2O. A suction catheter passes freely through the endotracheal tube and removes black particulate material, but the pressure change persists. The tube tip is above the carina on the new radiograph, which also shows right-lower-lobe volume loss. Bilateral pleural sliding is present on ultrasound. Oxygenation remains adequate on the current support.',
    stem: "Which next procedure best fits {patientName}'s acquired ventilatory findings in the later burn-unit record?",
    options: [
      option('bronch', 'Flexible bronchoscopy', 'The isolated peak-pressure rise favors resistance. A passable positioned tube, retained particulate secretions and new lobar volume loss point beyond the tube to lower-airway material that bronchoscopy can inspect and remove.', ['r2-inhalation-resistance', 'r2-airway-debris'], 'Localize resistance before choosing the procedure.', 'This acquired intrabronchial pattern supports bronchoscopy after stabilization.', 'timing.test.advanced_diagnostic'),
      option('tube', 'Endotracheal tube exchange', 'The tube has a documented passable lumen and appropriate position. Those observations make a primary tube problem less compelling than retained material beyond it.', ['r2-inhalation-resistance', 'r2-airway-debris'], 'Treat a rise in peak pressure as a tube blockage without using the tube assessment.', 'Failure of catheter passage or a damaged/obstructed tube would shift the next procedure toward tube exchange.'),
      option('pleura', 'Tube thoracostomy', 'The resistance-predominant measurements and bilateral pleural sliding do not support a pleural collection as the cause of this pressure change.', ['r2-inhalation-resistance', 'r2-airway-localization'], 'Attribute post-fire ventilatory deterioration to a pleural emergency rather than locate the pressure problem.', 'A compatible deteriorating examination with unilateral absent sliding and reduced compliance would support pleural decompression.'),
    ],
    explanation: 'First interpret the separated peak and plateau pressures as a resistance-predominant change. Then use tube passage/position, pleural observations, particulate secretions and lobar volume loss to locate the unresolved problem within the lower airways. Bronchoscopy can inspect and remove retained material. Initial airway stabilization has already occurred.',
    claimSlugs: ['r2-inhalation-resistance', 'r2-airway-debris', 'r2-airway-localization'],
    reasoningSteps: ['Interpret an isolated peak rise during valid passive measurements as increased flow resistance rather than reduced respiratory-system compliance.', 'Use the acquired tube, pleural and secretion/radiographic observations to choose lower-airway inspection and clearance rather than tube replacement or pleural drainage.'],
    closestError: 'Exchange a passable correctly positioned tube merely because peak pressure rose.',
    decidingObservation: 'Plateau is unchanged despite the peak rise; catheter passage and tube position are documented, while particulate material and new lobar volume loss persist.',
    counterfactual: 'If the suction catheter instead could not traverse an obstructed tube, tube exchange would replace bronchoscopy as the immediate offered procedure.',
    deletionCheck: 'Removing the new update removes both the mechanics inference and the procedure selection. The task no longer states a mucosal grading goal; no repeat of an unchanged radiograph is offered. Numeric pressures are fictional observed pairs, not authored treatment thresholds.',
    cueAttack: 'No sentence says the team needs direct mucosal assessment. Labels are three short named procedures. Necessary tube/pleural findings legitimately localize the problem; they are retained rather than hidden for difficulty.',
    categoryCheck: 'Three immediate procedures for the acquired ventilatory problem. Bronchoscopy has explicit test-wait metadata; tube exchange and thoracostomy are management procedures, with no pretend test wait.',
    difficulty: 'Fair moderate prediction: the closest tube error remains credible before the acquired tube checks are interpreted. New meaning is obstruction management, not a target-to-test association.',
    sequenceCheck: 'Standalone. No prior airway-management feedback is visible or needed. The returned initial-airway safety node is parked separately.',
  }),
  revisionCase('temporary-burn-coverage', {}, {
    conceptId: 'concept.topic.burns-inhalation.excision-bed-and-coverage.v1', previousConceptId: 'concept.topic.burns-inhalation.temporary-burn-coverage.v1', conceptMeaning: 'changed',
    displayName: 'Prepare the burn bed and select staged coverage',
    learningObjective: 'Interpret residual recipient-bed findings and the donor map before selecting the next staged burn operation.',
    currentUpdate: 'During a later staged trunk operation, circulation and temperature are stable. A tangential pass exposes punctate bleeding at the edge, but a broad central region remains dry and brown with an adherent layer and no punctate bleeding. The donor map records both thighs, the back and all other unburned donor areas as harvested during previous stages; they still have moist open surfaces. Remaining regions are burned. Cadaveric skin and autograft equipment are available.',
    stem: "Which operative plan best fits {patientName}'s current recipient-bed and donor findings?",
    options: [
      option('excise-allograft', 'Complete tangential excision, then apply cadaveric allograft', 'The center still requires recipient-bed preparation, while the donor map does not establish a healed harvestable source. Temporary allograft follows adequate removal of residual nonviable tissue.', ['r2-excision-bed', 'temporary-allograft'], 'Resolve recipient and donor readiness separately.', 'These combined findings support completing the bed and using temporary coverage.'),
      option('excise-autograft', 'Complete tangential excision, then apply meshed autograft', 'Further recipient preparation is appropriate, but the current donor surfaces have not re-epithelialized. Meshing does not create a harvestable donor site.', ['r2-excision-bed', 'temporary-allograft'], 'Apply the preference for definitive autograft without reading the donor map.', 'With adequate healed harvestable donor skin, completing the bed and autografting could replace temporary coverage.'),
      option('current-allograft', 'Use the current excision level, then apply cadaveric allograft', 'Temporary coverage addresses the donor limitation but does not correct a central recipient bed with retained adherent nonviable tissue.', ['r2-excision-bed', 'temporary-allograft'], 'Treat an allograft bridge as permission to stop preparing the recipient bed.', 'A uniformly prepared viable bleeding bed with the same donor limitation would support proceeding directly to allograft.'),
      option('current-autograft', 'Use the current excision level, then apply meshed autograft', 'This plan overlooks both the central recipient finding and the donor map. Neither a preferred definitive material nor meshing resolves those two readiness constraints.', ['r2-excision-bed', 'temporary-allograft'], 'Carry the usual excise-and-autograft plan forward without checking either operative surface.', 'A fully viable prepared bed and enough healed donor skin would support immediate autografting at that level.'),
    ],
    explanation: 'Read the two surfaces separately. Punctate bleeding at the margin does not make the adherent dry center ready for coverage; complete the necessary burn excision. The donor surfaces are also still open, so use temporary cadaveric coverage after preparing the recipient bed. No fixed donor-healing interval or allograft replacement deadline is implied.',
    claimSlugs: ['r2-excision-bed', 'temporary-allograft', 'deep-burn-closure'],
    reasoningSteps: ['Interpret the regional operative observations as incomplete preparation of the central recipient bed despite a bleeding margin.', 'Apply the actual donor-surface map to select temporary coverage after completing that preparation.'],
    closestError: 'Proceed directly to allograft because it is temporary, overlooking that the recipient bed still needs preparation.',
    decidingObservation: 'Residual adherent dry central tissue coexists with open previously harvested donor surfaces.',
    counterfactual: 'If the entire recipient bed already bled appropriately with no residual adherent layer, direct allografting at the current level would replace further excision. If the donor map instead showed adequate healed harvestable skin, the autograft component would change.',
    deletionCheck: 'Remove the central-bed observations and the first component cannot be selected; remove the donor map and coverage cannot be ranked. Deleted the sentence telling the learner that coverage is needed while donors recover.',
    cueAttack: 'Four balanced combinations expose each excision and graft component twice, preventing majority/novelty inference. No option advertises reharvesting an open donor or contrasts a biologic cover with generic dressings. The key is not uniquely longer or comprehensive.',
    categoryCheck: 'Four operative plans with the same recipient-preparation and coverage scope.',
    difficulty: 'Predicted moderate/hard from two independent operative-readiness errors. This is a new integrated burn-excision meaning, not a general graft-take physiology item.',
    sequenceCheck: 'Standalone later operative review. The PASS regional-excision node is preserved in its own case and does not teach this node before selection.',
  }),
  revisionCase('feeding-new-hypoperfusion', {
    presentation: '{patientName}, a 46-year-old woman, reviews her outside burn-unit nutrition records with the founder in clinic. Extensive burns required intubation. Gastric feeding had initially been tolerated. A subsequent episode brought increasing vasopressor support, falling urine output, rising lactate, a tender distended abdomen and bloody gastric drainage. Enteral delivery was held while resuscitation and abdominal evaluation proceeded. The following feeding review occurred after that episode.',
  }, {
    conceptId: 'concept.topic.burns-inhalation.gastric-intolerance-after-recovery.v1', previousConceptId: 'concept.n1r3.burn-feeding-new-perfusion-boundary', conceptMeaning: 'changed',
    displayName: 'Select a feeding route after perfusion recovery',
    learningObjective: 'Distinguish persistent gastric intolerance after recovery from the earlier unsafe perfusion/abdominal episode when selecting the next nutrition route.',
    currentUpdate: 'Vasopressors have been discontinued, lactate has returned to the reference range and urine output has recovered. Serial examinations now show a soft nontender abdomen without recurrent blood in drainage. Evaluation has found no bowel obstruction; current clinical review does not raise concern for intestinal ischemia. Gastric feeding restarts but produces vomiting and aspirates of 650 and 700 mL in consecutive six-hour collections despite a prokinetic trial. She remains unable to eat while intubated.',
    stem: "Which nutrition route best fits {patientName}'s current findings at this later outside-hospital review?",
    options: [
      option('postpyloric', 'Low-rate postpyloric enteral feeding', 'The acquired course now supports controlled perfusion and a usable intestinal tract, while repeated large gastric aspirates persist despite a prokinetic. Moving delivery beyond the stomach addresses that remaining route problem.', ['r2-gastric-intolerance', 'postpyloric-boundary', 'early-enteral'], 'Reassess the reason for intolerance rather than carry the old contraindication forward.', 'This recovered-perfusion, persistent-gastric-intolerance record supports considering postpyloric delivery.'),
      option('gastric', 'Low-rate gastric enteral feeding', 'That route was actually retried after recovery and continues to produce vomiting and large aspirates despite the prokinetic; the current record supplies a reason to change access.', ['r2-gastric-intolerance'], 'Treat hemodynamic recovery as proof that gastric delivery must now work.', 'After gastric intolerance resolves, a cautious gastric route can again be appropriate.'),
      option('parenteral', 'Intravenous parenteral nutrition', 'The earlier safety episode warrants reassessment, but it does not establish that the recovered intestine is unusable. Persistent gastric delivery difficulty can first be addressed through a postpyloric route under these findings.', ['r2-gastric-intolerance', 'early-enteral', 'feeding-deterioration'], 'Treat the earlier shock warning or continued gastric failure as permanent enteral ineligibility.', 'A continuing contraindication to intestinal delivery or failure to meet needs through feasible enteral access could support a parenteral pathway after nutrition-team assessment.'),
    ],
    explanation: 'The earlier deterioration justified holding enteral delivery; its warnings are preserved in the chronology. The current decision follows recovered perfusion, a benign serial abdomen and evaluation without ongoing obstruction or ischemic concern. Persistent large gastric aspirates after a prokinetic now support considering postpyloric feeding rather than repeating the failed gastric route or treating the whole intestine as unusable.',
    claimSlugs: ['r2-gastric-intolerance', 'postpyloric-boundary', 'feeding-deterioration', 'early-enteral'],
    reasoningSteps: ['Use the acquired recovery and abdominal evaluation to distinguish the current gastric problem from the earlier perfusion-related safety boundary.', 'Select a route beyond the stomach for persistent gastric intolerance after the actual gastric/prokinetic trial.'],
    closestError: 'Choose parenteral nutrition because of the earlier dangerous episode, without updating intestinal eligibility from the recovered course.',
    decidingObservation: 'Perfusion and abdominal findings have recovered, but observed large gastric aspirates and vomiting persist despite a prokinetic.',
    counterfactual: 'If support were escalating again with rising lactate, tenderness and bloody drainage, postpyloric feeding would no longer be the answer; enteral delivery would be held during urgent reassessment. If the gastric intolerance resolved, low-rate gastric feeding would become reasonable.',
    deletionCheck: 'Historical red flags explain why feeding stopped and prevent falsely implying they can be ignored. Current recovery is essential before comparing routes. Actual repeated aspirates/prokinetic response make the later node different from the PASS initial-start question.',
    cueAttack: 'Removed the task echo about urgent reassessment. All labels are nutrition routes; no label recites the vignette or promises uniquely comprehensive care. The current obstruction/ischemia evaluation is retained as a necessary fairness boundary, not concealed to simulate difficulty.',
    categoryCheck: 'Three current nutrition routes after a new evaluation and actual gastric re-trial.',
    difficulty: 'Fair moderate prediction. The current problem must be separated from a dangerous historical episode; it is not presented as a hard obvious-stop safety question.',
    sequenceCheck: 'Standalone new meaning after recovery. The exact PASS enteral-start node is in a separate case. No frozen earlier approval is transferred to this route decision.',
  }),
);

const passSlugs = new Set([
  'limited-scald-disposition', 'serial-hand-depth', 'resuscitation-clock-and-area', 'fluid-response-adjustment',
  'thermal-chest-release', 'electrical-deep-compartment', 'mixed-smoke-antidote', 'regional-excision-plan',
  'enteral-after-resuscitation', 'culture-versus-infection',
]);
const parkedReasons: Record<string, string> = {
  'smoke-emergency-disposition': 'Retained breathing/voice warnings still make immediate airway-capable emergency care an easy recognition decision. No accepted safety exception; no fair moderate two-step repair after one attempt.',
  'co-oxygen-discordance': 'A better lactate competitor removes the redundant-test flaw, but the remaining COHb-measurement association remains foundational/easy without a second consequential inference.',
  'airway-before-investigation': 'Overt progressive upper-airway obstruction remains an easy initial-airway safety decision, duplicated in purpose by smoke-emergency disposition. Warning signs cannot be removed to manufacture difficulty.',
  'fluoride-systemic-calcium': 'Systemic hypocalcemia with distant symptoms still resolves the route immediately. No supported fair competing systemic regimen or accepted foundational exception; dose/technique invention withheld.',
};
const responseSummaries: Record<string, string> = {
  'deep-hand-referral': 'Replaced the service-name match with an acquired pre/post-wrap circulation problem under an existing burn plan. Retained the normal baseline perfusion, added the actual later abnormal examination, and compare external, skin and deep releases. Materially new construct recorded.',
  'pain-exceeds-clinic': 'Retained both incomplete examinations and the actual resource boundary, described resources without naming a missing key service, and added a complete observed procedure after premedication. Three different route/setting arrangements replace duplicate failed oral pathways. Fair moderate, not claimed hard.',
  'thermal-limb-release': 'Neutral immediate-intervention task replaces decompression wording. Retained failed elevation/removal of external pressure and replaced repeat elevation with arterial exploration. The skin-versus-fascial operative distinction remains the closest competitor.',
  'electrical-pigment-resuscitation': 'Added quantified output, positive balance and weight gain, catheter/bladder assessment, recovered perfusion and new cardiopulmonary findings. The later decision now tests avoidance of further accumulation instead of assuming oliguria proves under-resuscitation. No exact fluid or urine target introduced.',
  'co-after-oxygen': 'First formal retention assessment is explicitly newly documented; no unsupported persistence or decline asserted. Kept specimen provenance and retrieved EMS loss of consciousness. Replaced discharge/negative-omission labels with two genuine treatment-assessment pathways per reviewer suggestion.',
  'lower-airway-assessment': 'Removed the supplied mucosal-grading goal and repeat-radiograph foil. Added acquired valid peak/plateau measurements, tube position/passage, pleural findings and lobar volume loss. Three procedures test localization and intervention for airway material; new construct recorded.',
  'temporary-burn-coverage': 'Deleted the cover-while-donors-recover teaching sentence. Added raw regional recipient-bed observations and a complete donor-surface map. Four balanced preparation/coverage combinations expose every component twice; no option advertises reharvesting an open donor. New integrated construct recorded.',
  'feeding-new-hypoperfusion': 'Retained all earlier hemodynamic/abdominal warnings as actual history, removed the task echo, and acquired a subsequent recovered course with persistent gastric intolerance after prokinetic treatment. Route choice is now a distinct new meaning rather than the obvious stop-feeding safety rule.',
};

export const BURNS_INHALATION_TOPIC_ITEM_STATUSES = BURNS_INHALATION_TOPIC_REVIEWED_QUESTIONS.map(question => {
  const slug = question.id.slice('question.topic.burns-inhalation.'.length, -3);
  return {
    reviewedQuestionVariantId: question.id, reviewedNodeId: nodeId(slug),
    status: passSlugs.has(slug) ? 'pass-preserved' as const : parkedReasons[slug] ? 'parked' as const : 'revised' as const,
    proposedQuestionVariantId: passSlugs.has(slug) ? question.id : 'question.topic.burns-inhalation.' + slug + '.v2',
    attemptCount: passSlugs.has(slug) ? 0 : 1,
    independentReviewReference: 'docs/research/question-topic-burns-inhalation-review-20261111.json#' + question.id,
    reviewDisposition: passSlugs.has(slug) ? 'Exact reviewed v1 question, scored node wording and visible profile/header retained. Optional reviewer suggestions deliberately not applied.' : responseSummaries[slug] ?? parkedReasons[slug]!,
    parkedReason: parkedReasons[slug] ?? null,
    independentReReviewStatus: passSlugs.has(slug) ? 'original_exact_PASS' as const : 'not_passed' as const,
    reviewStatus: 'needs_clinician_review' as const, managerAccepted: false, clinicalApproval: false,
  };
});

const passDefinitions = BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS.flatMap(c => {
  const nodes = c.nodes.filter(n => passSlugs.has(n.slug));
  return nodes.length ? [{ ...c, slug: nodes.length === c.nodes.length ? c.slug : c.slug + '-pass-standalone', nodes }] : [];
});
const passCaseByQuestion = new Map<string, string>();
const passCases: SyntheticClinicalCase[] = passDefinitions.map(definition => {
  const original = BURNS_INHALATION_TOPIC_REVIEWED_CASES.find(c => c.decisionNodes.some(n => n.questionVariantId === qid(definition.nodes[0]!.slug)))!;
  if (original.decisionNodes.length === definition.nodes.length) {
    original.decisionNodes.forEach(n => passCaseByQuestion.set(n.questionVariantId, original.id));
    return original;
  }
  const selected = original.decisionNodes.filter(n => definition.nodes.some(d => qid(d.slug) === n.questionVariantId));
  const splitId = caseId(definition.slug);
  selected.forEach(n => passCaseByQuestion.set(n.questionVariantId, splitId));
  return { ...original, id: splitId, decisionNodes: selected.map(n => ({ ...n,
    // A former first node now completes the case. All scored words remain exact;
    // completion uses its existing wrong-choice rationale and neutral narrative.
    terminalDispositions: n.terminalDispositions.length ? n.terminalDispositions : n.answerChoices.filter(c => !c.isCorrect).map(c => ({
      answerChoiceId: c.id, kind: 'no_terminal_outcome' as const,
      consequenceNarrative: 'The founder reviews the selected plan against the outside record or current clinic findings.',
      clinicalRationale: c.rationale!, sourceLabels: n.sourceLabels,
    })),
  })), learningSummary: selected.map(n => n.explanation).join(' ') };
});
const revision = buildArtifacts(BURNS_INHALATION_TOPIC_REVISION_CASE_DEFINITIONS, 2);
export const BURNS_INHALATION_TOPIC_PARKED_ARTIFACTS = buildArtifacts(BURNS_INHALATION_TOPIC_PARKED_CASE_DEFINITIONS, 2);
const passQuestions = BURNS_INHALATION_TOPIC_REVIEWED_QUESTIONS.filter(q => passCaseByQuestion.has(q.id));
const passReference = <T extends { questionVariantId: string; caseId: string }>(rows: T[]): T[] => rows
  .filter(x => passCaseByQuestion.has(x.questionVariantId)).map(x => ({ ...x, caseId: passCaseByQuestion.get(x.questionVariantId)! }));
const passConceptIds = new Set(passQuestions.map(q => q.conceptId));
const currentConcepts = [...BURNS_INHALATION_TOPIC_REVIEWED_AUTHORING_CONCEPTS.filter(c => passConceptIds.has(c.id)), ...revision.authoring_concepts];

export const BURNS_INHALATION_TOPIC_CASE_DEFINITIONS = [...passDefinitions, ...BURNS_INHALATION_TOPIC_REVISION_CASE_DEFINITIONS];
export const BURNS_INHALATION_TOPIC_QUESTIONS = [...passQuestions, ...revision.questions];
export const BURNS_INHALATION_TOPIC_CASES = [...passCases, ...revision.cases];
export const BURNS_INHALATION_TOPIC_AUTHORING_CONCEPTS = [...new Map(currentConcepts.map(c => [c.id, c])).values()];
export const BURNS_INHALATION_TOPIC_TESTED_CONCEPTS = BURNS_INHALATION_TOPIC_AUTHORING_CONCEPTS.map(c => ({
  id: c.id, displayName: c.displayName, learningObjective: c.learningObjective, conceptType: c.conceptType, earliestFacilityStage: c.earliestFacilityStage,
}));
export const BURNS_INHALATION_TOPIC_TIMING_ENTRIES = [...passReference(reviewed.timing_entries), ...revision.timing_entries];
export const BURNS_INHALATION_TOPIC_ORDER_PROPOSALS = [...passReference(reviewed.order_proposals), ...revision.order_proposals];
export const BURNS_INHALATION_TOPIC_SOURCE_LINKS = revision.source_links;
export const BURNS_INHALATION_TOPIC_AUTHOR_CHECKS = [...passReference(reviewed.author_checks), ...revision.author_checks];
export const BURNS_INHALATION_TOPIC_STATEMENT_MAPPINGS = [...passReference(reviewed.statement_mappings), ...revision.statement_mappings];
export const BURNS_INHALATION_TOPIC_CASE_REVIEWS = [
  ...passDefinitions.map(definition => {
    const clinicalCase = passCases.find(c => c.decisionNodes.some(n => n.questionVariantId === qid(definition.nodes[0]!.slug)))!;
    const original = reviewed.case_reviews.find(c => c.caseId === caseId(definition.slug.replace('-pass-standalone', '')))!;
    return { ...original, caseId: clinicalCase.id,
      selectionConstraint: definition.nodes.length > 1 ? original.selectionConstraint : 'Standalone exact PASS node; original visible header/profile preserved. No returned companion is shown.',
      sequenceNotes: original.sequenceNotes.filter(n => clinicalCase.decisionNodes.some(d => d.questionVariantId === n.questionVariantId)) };
  }), ...revision.case_reviews,
];
export const BURNS_INHALATION_TOPIC_PREVIEW_RELEASE = { ...revision.preview_release,
  concepts: BURNS_INHALATION_TOPIC_TESTED_CONCEPTS, cases: BURNS_INHALATION_TOPIC_CASES,
};
export const BURNS_INHALATION_TOPIC_MANIFEST = { ...revision.manifest,
  caseCount: BURNS_INHALATION_TOPIC_CASES.length, nodeCount: BURNS_INHALATION_TOPIC_QUESTIONS.length,
  conceptCount: BURNS_INHALATION_TOPIC_TESTED_CONCEPTS.length,
  independentPassPreserved: 10, revisedPendingIndependentReview: 8, parkedAfterOneAttempt: 4,
  reviewedRound1Nodes: 22, allRound1DefinitionsRetained: true,
  roles: { rewrites: BURNS_INHALATION_TOPIC_CASE_DEFINITIONS.flatMap(c => c.nodes).filter(n => n.role === 'rewrite').length,
    replacements: BURNS_INHALATION_TOPIC_CASE_DEFINITIONS.flatMap(c => c.nodes).filter(n => n.role === 'replacement').length,
    newGapNodes: BURNS_INHALATION_TOPIC_CASE_DEFINITIONS.flatMap(c => c.nodes).filter(n => n.role === 'gap').length },
  composition: 'Only the fluid-record two-node case remains multipart; both exact scored nodes passed. Eight repaired singletons require independent re-review. Four original PASS companions were split without changing their scored wording or visible header/profile. No mixed-review-status multipart case.',
};
