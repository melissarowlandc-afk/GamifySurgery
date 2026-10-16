import type { SourceSpec } from "./family-builder";

const copyrighted = "Copyrighted guidance; targeted factual verification only" as const;
const c = (item: Omit<SourceSpec, "licenseLabel" | "reuseStatus">): SourceSpec => ({
  ...item,
  licenseLabel: copyrighted,
  reuseStatus: "copyrighted_targeted_verification_only",
});

export const SOURCES = {
  herniaSurge: {
    id: "source.php.herniasurge-2023", title: "International HerniaSurge guideline update",
    citation: "Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080.",
    organization: "BJS Open / HerniaSurge", authors: ["Stabilini C", "van Veenendaal N", "Aasvang E", "et al."], year: 2023,
    doi: "10.1093/bjsopen/zrad080", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10588975/", sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0", reuseStatus: "cc_by_4_0", authority: "International guideline; very-low-certainty block evidence is retained.",
  } satisfies SourceSpec,
  spigelian: {
    id: "source.spigelian.ehs-ahs-2020", title: "EHS/AHS rare-location ventral hernia guideline",
    citation: "Henriksen NA, Kaufmann R, Simons MP, et al. EHS and AHS guidelines for treatment of primary ventral hernias in rare locations or special circumstances. BJS Open. 2020;4(2):342-353. doi:10.1002/bjs5.50252.",
    organization: "European Hernia Society and Americas Hernia Society", authors: ["Henriksen NA", "Kaufmann R", "Simons MP", "et al."], year: 2020,
    doi: "10.1002/bjs5.50252", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7093793/", sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0", reuseStatus: "cc_by_nc_4_0_restricted", authority: "Joint society guideline with limited evidence for Spigelian repair technique.",
  } satisfies SourceSpec,
  mesh: {
    id: "source.mesh.wses-sise-2018", title: "WSES/SIS-E skin and soft-tissue infection consensus",
    citation: "Sartelli M, Guirao X, Hardcastle TC, et al. 2018 WSES/SIS-E consensus conference: recommendations for the management of skin and soft-tissue infections. World J Emerg Surg. 2018;13:58. doi:10.1186/s13017-018-0219-9.",
    organization: "WSES and SIS-E", authors: ["Sartelli M", "Guirao X", "Hardcastle TC", "et al."], year: 2018,
    doi: "10.1186/s13017-018-0219-9", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6295010/", sourceClass: "professional_society_guideline",
    licenseLabel: "Creative Commons Attribution 4.0", reuseStatus: "cc_by_4_0", authority: "Society consensus supporting deep mesh-infection recognition and individualized source control.",
  } satisfies SourceSpec,
  cirrhosis: c({id:"source.cirrhosis.aga-2019",title:"AGA perioperative cirrhosis clinical practice update",citation:"Northup PG, Friedman LS, Kamath PS. AGA Clinical Practice Update on Surgical Risk Assessment and Perioperative Management in Cirrhosis: Expert Review. Clin Gastroenterol Hepatol. 2019;17(4):595-606. doi:10.1016/j.cgh.2018.09.043.",organization:"American Gastroenterological Association",authors:["Northup PG","Friedman LS","Kamath PS"],year:2019,doi:"10.1016/j.cgh.2018.09.043",pmid:"30273751",url:"https://gastro.org/clinical-guidance/surgical-risk-assessment-and-perioperative-management-in-cirrhosis/",sourceClass:"professional_society_guideline",authority:"Society expert review; no one score or fixed cutoff is taught."}),
  ptld: c({id:"source.ptld.ast-2019",title:"AST PTLD and EBV guideline",citation:"Allen UD, Preiksaitis JK; AST Infectious Diseases Community of Practice. Post-transplant lymphoproliferative disorders, Epstein-Barr virus infection, and disease in solid organ transplantation: Guidelines from the American Society of Transplantation Infectious Diseases Community of Practice. Clin Transplant. 2019;33(9):e13652. doi:10.1111/ctr.13652.",organization:"American Society of Transplantation",authors:["Allen UD","Preiksaitis JK","AST Infectious Diseases Community of Practice"],year:2019,doi:"10.1111/ctr.13652",pmid:"31230381",url:"https://pubmed.ncbi.nlm.nih.gov/31230381/",sourceClass:"professional_society_guideline",authority:"Society guideline; tissue diagnosis is the key bounded teaching point."}),
  ptldReview: {id:"source.ptld.frontiers-review-2026",title:"Comprehensive review of PTLD after solid organ transplantation",citation:"Vargas-Nieto LP, Santoyo-Sarmiento D, Ballesteros-García MF, Calderón-Vásquez AM, Pinto-Rodriguez M, Robayo-Romero J, Cormane-Alfaro S, Daza-Buitrago JA. Post-transplant lymphoproliferative disorder after solid organ transplantation: a comprehensive review. Front Transplant. 2026;5:1869288. doi:10.3389/frtra.2026.1869288.",organization:"Frontiers in Transplantation",authors:["Vargas-Nieto LP","Santoyo-Sarmiento D","Ballesteros-García MF","Calderón-Vásquez AM","Pinto-Rodriguez M","Robayo-Romero J","Cormane-Alfaro S","Daza-Buitrago JA"],year:2026,doi:"10.3389/frtra.2026.1869288",url:"https://www.frontiersin.org/journals/transplantation/articles/10.3389/frtra.2026.1869288/full",sourceClass:"narrative_review",licenseLabel:"Creative Commons Attribution 4.0",reuseStatus:"cc_by_4_0",authority:"Accessible 2026 review used as a phenotype and differential cross-check."} satisfies SourceSpec,
  ata: c({id:"source.dtc.ata-2025",title:"2025 ATA differentiated thyroid cancer guideline",citation:"Ringel MD, Sosa JA, et al. 2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer. Thyroid. 2025;35(8):841-985. doi:10.1177/10507256251363120.",organization:"American Thyroid Association",authors:["Ringel MD","Sosa JA","et al."],year:2025,doi:"10.1177/10507256251363120",url:"https://journals.sagepub.com/doi/pdf/10.1177/10507256251363120",sourceClass:"professional_society_guideline",authority:"Current society guideline for preoperative nodal mapping and individualized surgical extent."}),
  ataSummary: c({id:"source.dtc.ata-summary-2025",title:"ATA patient summary of 2025 DTC surgical recommendations",citation:"American Thyroid Association. What are the key changes in the 2025 ATA guidelines for differentiated thyroid cancer? Clinical Thyroidology for the Public. December 2025;18(12):4-5.",organization:"American Thyroid Association",authors:["American Thyroid Association"],year:2025,url:"https://www.thyroid.org/patient-thyroid-information/ct-for-patients/december-2025/vol-18-issue-12-p-4-5/",sourceClass:"open_educational_resource",authority:"Official society summary directly supporting bounded initial surgical-extent examples."}),
  acrDischarge: c({id:"source.discharge.acr-2022",title:"ACR Appropriateness Criteria Evaluation of Nipple Discharge",citation:"Expert Panel on Breast Imaging; Sanford MF, Slanetz PJ, Lewin AA, et al. ACR Appropriateness Criteria Evaluation of Nipple Discharge: 2022 Update. J Am Coll Radiol. 2022;19(11S):S304-S318. doi:10.1016/j.jacr.2022.09.020.",organization:"American College of Radiology",authors:["Sanford MF","Slanetz PJ","Lewin AA","et al."],year:2022,doi:"10.1016/j.jacr.2022.09.020",pmid:"36436958",url:"https://acsearch.acr.org/docs/3099312/Narrative/",sourceClass:"professional_society_guideline",authority:"Evidence-based imaging guidance; rating tables are not reproduced."}),
  nact: c({id:"source.nact.asbrs-2025",title:"ASBrS preoperative management after neoadjuvant systemic therapy",citation:"American Society of Breast Surgeons. Resource Guide: Preoperative Management of Patients Treated with Neoadjuvant Systemic Therapy. January 2025.",organization:"American Society of Breast Surgeons",authors:["American Society of Breast Surgeons"],year:2025,url:"https://www.breastsurgeons.org/docs/statements/asbrs-rg-nst.pdf",sourceClass:"professional_society_guideline",authority:"Expert-informed society resource guide; not represented as an evidence-graded guideline."}),
  bcs: c({id:"source.bcs.asbrs-2026",title:"ASBrS breast-conserving surgery resource guide",citation:"American Society of Breast Surgeons. Resource Guide: Breast Conserving Surgery. February 24, 2026.",organization:"American Society of Breast Surgeons",authors:["American Society of Breast Surgeons"],year:2026,url:"https://spot.breastsurgeons.org/docs/statements/asbrs-breast-conserving-surgery-2026-02-24.pdf",sourceClass:"professional_society_guideline",authority:"Expert-informed society resource guide supporting selected conservation and localization planning."}),
  bccAad: c({id:"source.bcc.aad-current",title:"AAD basal cell carcinoma clinical guideline",citation:"American Academy of Dermatology. Basal Cell Carcinoma Clinical Guideline. Current professional guideline page. Accessed September 29, 2026.",organization:"American Academy of Dermatology",authors:["American Academy of Dermatology"],year:null,url:"https://www.aad.org/member/clinical-quality/guidelines/bcc",sourceClass:"professional_society_guideline",authority:"Society guidance for evaluation and risk context."}),
  bccNci: {id:"source.bcc.nci-pdq-current",title:"NCI Skin Cancer Treatment PDQ",citation:"National Cancer Institute PDQ Adult Treatment Editorial Board. Skin Cancer Treatment (PDQ), Health Professional Version. Current page. Accessed September 29, 2026.",organization:"National Cancer Institute",authors:["NCI PDQ Adult Treatment Editorial Board"],year:null,url:"https://www.cancer.gov/types/skin/hp/skin-treatment-pdq",sourceClass:"government_guidance",licenseLabel:"US government factual material; third-party exclusions apply",reuseStatus:"public_domain_conditions_apply",authority:"Government editorial synthesis for BCC presentation and disease behavior."} satisfies SourceSpec,
  bccS2k: {id:"source.bcc.s2k-2024",title:"S2k basal cell carcinoma guideline update",citation:"Lang BM, Balermpas P, Bauer A, et al. S2k guideline basal cell carcinoma of the skin (update 2023). J Dtsch Dermatol Ges. 2024;22(12):1697-1714. doi:10.1111/ddg.15566.",organization:"German Cancer Society and German Dermatological Society",authors:["Lang BM","Balermpas P","Bauer A","et al."],year:2024,doi:"10.1111/ddg.15566",pmid:"39584658",url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC11626229/",sourceClass:"professional_society_guideline",licenseLabel:"Creative Commons Attribution-NonCommercial 4.0",reuseStatus:"cc_by_nc_4_0_restricted",authority:"Multisociety guideline independently supporting destructive local growth and rare metastasis."} satisfies SourceSpec,
  nutritionEspen: c({id:"source.nutrition.espen-practical-2021",title:"ESPEN practical guideline on clinical nutrition in surgery",citation:"Weimann A, Braga M, Carli F, et al. ESPEN practical guideline: Clinical nutrition in surgery. Clin Nutr. 2021;40(7):4745-4761. doi:10.1016/j.clnu.2021.03.031.",organization:"European Society for Clinical Nutrition and Metabolism",authors:["Weimann A","Braga M","Carli F","et al."],year:2021,doi:"10.1016/j.clnu.2021.03.031",url:"https://doi.org/10.1016/j.clnu.2021.03.031",sourceClass:"professional_society_guideline",authority:"Copyrighted society practical guideline for screening and oral/enteral/parenteral route boundaries."}),
} as const;




















































