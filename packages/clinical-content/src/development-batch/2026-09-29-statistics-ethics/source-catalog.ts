import type { SourceSpec } from "./family-builder";

const targetedVerification = {
  licenseLabel:
    "Targeted factual verification only; record-level reuse permission was not separately verified.",
  reuseStatus: "copyrighted_targeted_verification_only" as const,
};

const nist = {
  organization: "National Institute of Standards and Technology",
  authors: ["National Institute of Standards and Technology"],
  year: null,
  sourceClass: "government_guidance" as const,
  ...targetedVerification,
};

export const STATISTICS_SOURCES: Record<string, SourceSpec> = {
  nistIndependentT: {
    id: "source.nist.independent-t.2026",
    title: "Two-Sample t-Test",
    citation:
      "National Institute of Standards and Technology. Engineering Statistics Handbook: Two-Sample t-Test. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda353.htm",
    authority:
      "Primary federal methods reference for independent-sample t-test assumptions.",
    ...nist,
  },
  nistPairedT: {
    id: "source.nist.paired-t.2026",
    title: "Paired t-Test",
    citation:
      "National Institute of Standards and Technology. Engineering Statistics Handbook: Paired t-Test. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/handbook/prc/section3/prc311.htm",
    authority:
      "Primary federal methods reference for paired differences and paired t-test assumptions.",
    ...nist,
  },
  nistAnova: {
    id: "source.nist.anova.2026",
    title: "One-Way ANOVA Assumptions",
    citation:
      "National Institute of Standards and Technology. Engineering Statistics Handbook: One-Way ANOVA. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/handbook/prc/section4/prc422.htm",
    authority:
      "Primary federal methods reference for independent observations, normal errors, and common variance.",
    ...nist,
  },
  nistRankSum: {
    id: "source.nist.rank-sum.2026",
    title: "Rank Sum Test",
    citation:
      "National Institute of Standards and Technology. Dataplot Reference Manual: Rank Sum Test. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/ranksum.htm",
    authority:
      "Federal reference for the rank-sum procedure with two independent samples.",
    ...nist,
  },
  nistSignedRank: {
    id: "source.nist.signed-rank.2026",
    title: "Signed Rank Test",
    citation:
      "National Institute of Standards and Technology. Dataplot Reference Manual: Signed Rank Test. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/signrank.htm",
    authority:
      "Federal reference for paired signed-rank analysis and symmetric paired-difference boundary.",
    ...nist,
  },
  nistChiSquare: {
    id: "source.nist.chi-square.2026",
    title: "CHI-SQUARE INDEPENDENCE TEST",
    citation:
      "National Institute of Standards and Technology. Dataplot Reference Manual: CHI-SQUARE INDEPENDENCE TEST. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/chistest.htm",
    authority:
      "Federal reference for chi-square testing of independence in categorical contingency tables.",
    ...nist,
  },
  nistFisher: {
    id: "source.nist.fisher-exact.2026",
    title: "Fisher Exact Test",
    citation:
      "National Institute of Standards and Technology. Dataplot Reference Manual: Fisher Exact Test. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/fishexac.htm",
    authority:
      "Federal reference for Fisher exact testing in sparse two-by-two tables.",
    ...nist,
  },
  nistMcNemar: {
    id: "source.nist.mcnemar.2026",
    title: "McNemar Test",
    citation:
      "National Institute of Standards and Technology. Dataplot Reference Manual: McNemar Test. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/software/dataplot/refman1/auxillar/mcnemar.htm",
    authority:
      "Federal methods reference for McNemar testing of paired binary responses.",
    ...nist,
  },
  nistPValues: {
    id: "source.nist.p-values.2026",
    title: "Critical values and p values",
    citation:
      "National Institute of Standards and Technology. Engineering Statistics Handbook: Critical values and p values. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm",
    authority:
      "Federal reference for the null-conditional, at-least-as-extreme interpretation of p-values.",
    ...nist,
  },
  nistConfidenceIntervals: {
    id: "source.nist.confidence-intervals.2026",
    title: "What are confidence intervals?",
    citation:
      "National Institute of Standards and Technology. Engineering Statistics Handbook: What are confidence intervals? Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm",
    authority:
      "Federal reference for repeated-sampling interpretation of confidence intervals.",
    ...nist,
  },
  nistConfidenceLimits: {
    id: "source.nist.confidence-limits-mean.2026",
    title: "Confidence Limits for the Mean",
    citation:
      "National Institute of Standards and Technology. Engineering Statistics Handbook: Confidence Limits for the Mean. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm",
    authority:
      "Federal cross-check for confidence-limit precision and repeated-sampling interpretation.",
    ...nist,
  },
  nistErrorsPower: {
    id: "source.nist.errors-power.2026",
    title: "Quantitative Techniques",
    citation:
      "National Institute of Standards and Technology. Engineering Statistics Handbook: Quantitative Techniques. Accessed 2026-09-29.",
    url: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm",
    authority:
      "Federal reference for type I error, type II error, and power under a specified alternative.",
    ...nist,
  },
  cdcStudyDesign: {
    id: "source.cdc.field-epi-study-design.2026",
    title: "Design, Conduct, and Analyze Field Studies",
    citation:
      "Centers for Disease Control and Prevention. Field Epidemiology Manual: Design, Conduct, and Analyze Field Studies. Accessed 2026-09-29.",
    organization: "Centers for Disease Control and Prevention",
    authors: ["Centers for Disease Control and Prevention"],
    year: null,
    url: "https://www.cdc.gov/field-epi-manual/php/chapters/design-conduct-analyze-field-studies.html",
    sourceClass: "government_guidance",
    authority:
      "Federal epidemiology reference for study design and association-measure boundaries.",
    ...targetedVerification,
  },
  cdcAnalyzeInterpret: {
    id: "source.cdc.field-epi-analysis.2026",
    title: "Analyzing and Interpreting Data",
    citation:
      "Centers for Disease Control and Prevention. Field Epidemiology Manual: Analyzing and Interpreting Data. Accessed 2026-09-29.",
    organization: "Centers for Disease Control and Prevention",
    authors: ["Centers for Disease Control and Prevention"],
    year: null,
    url: "https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html",
    sourceClass: "government_guidance",
    authority:
      "Federal epidemiology reference for bias, confounding, and interpretation boundaries.",
    ...targetedVerification,
  },
  cdcAccuracy: {
    id: "source.cdc.test-accuracy.2026",
    title: "Principles of Epidemiology: Lesson 5, Appendix A",
    citation:
      "Centers for Disease Control and Prevention. Principles of Epidemiology: Lesson 5, Appendix A. Last reviewed 2012-05-18. Accessed 2026-09-29.",
    organization: "Centers for Disease Control and Prevention",
    authors: ["Centers for Disease Control and Prevention"],
    year: 2012,
    url: "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/appendixa.html",
    sourceClass: "government_guidance",
    authority:
      "Archived federal reference for sensitivity, specificity, and predictive-value denominators; older guidance is a limitation.",
    ...targetedVerification,
  },
  fdaPredictiveValues: {
    id: "source.fda.predictive-values.2026",
    title: "Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers",
    citation:
      "U.S. Food and Drug Administration. Antibody (Serology) Testing for COVID-19: Information for Patients and Consumers. Section: What does predictive value mean? Accessed 2026-09-29.",
    organization: "U.S. Food and Drug Administration",
    authors: ["U.S. Food and Drug Administration"],
    year: null,
    url: "https://www.fda.gov/medical-devices/coronavirus-covid-19-and-medical-devices/antibody-serology-testing-covid-19-information-patients-and-consumers",
    sourceClass: "government_guidance",
    authority:
      "Federal patient-facing cross-check that positive predictive value falls when prevalence is lower, holding test performance context constant; no COVID-19 clinical claim is reused.",
    usageRole: "cross_check",
    ...targetedVerification,
  },
  cochraneNnt: {
    id: "source.cochrane.chapter-15.2026",
    title: "Chapter 15: Interpreting results and drawing conclusions",
    citation:
      "Schünemann HJ, Vist GE, Higgins JPT, Santesso N, Deeks JJ, Glasziou P, Akl EA, Guyatt GH. Chapter 15: Interpreting results and drawing conclusions [last updated August 2023]. In: Cochrane Handbook for Systematic Reviews of Interventions, version 6.5. Cochrane; 2024. Accessed 2026-09-29.",
    organization: "Cochrane",
    authors: [
      "Holger J Schünemann",
      "Gunn E Vist",
      "Julian PT Higgins",
      "Nancy Santesso",
      "Jonathan J Deeks",
      "Paul Glasziou",
      "Elie A Akl",
      "Gordon H Guyatt",
    ],
    year: 2024,
    url: "https://www.cochrane.org/authors/handbooks-and-manuals/handbook/current/chapter-15",
    sourceClass: "narrative_review",
    licenseLabel:
      "Copyrighted targeted factual verification only; original factual synthesis.",
    reuseStatus: "copyrighted_targeted_verification_only",
    authority:
      "Methods reference for absolute risk difference, NNT rounding, comparator, outcome, and time-horizon framing.",
    usageRole: "both",
  },
  ahrqPdca: {
    id: "source.ahrq.pdca.2026",
    title: "Plan-Do-Check-Act Cycle",
    citation:
      "Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29.",
    organization: "Agency for Healthcare Research and Quality",
    authors: ["Agency for Healthcare Research and Quality"],
    year: null,
    url: "https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle",
    sourceClass: "government_guidance",
    authority:
      "Federal quality-improvement reference for iterative Plan-Do-Check-Act cycles.",
    ...targetedVerification,
  },
  ahrqQiMeasures: {
    id: "source.ahrq.qi-measures.2026",
    title: "Chapter 6. Track Performance with Metrics",
    citation:
      "Agency for Healthcare Research and Quality. Chapter 6. Track Performance with Metrics. Last reviewed May 2016. Accessed 2026-09-29.",
    organization: "Agency for Healthcare Research and Quality",
    authors: ["Agency for Healthcare Research and Quality"],
    year: 2016,
    url: "https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html",
    sourceClass: "government_guidance",
    authority:
      "Federal quality-improvement reference for selecting and tracking contextual performance metrics; older page is a limitation.",
    ...targetedVerification,
  },
};
