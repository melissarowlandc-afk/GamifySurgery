import type { VariantSpec } from "./family-builder";

type DraftVariant = Omit<VariantSpec, "claimIds"> & { clinicalAnchor: ClinicalAnchorKey };
type FourVariants = [DraftVariant, DraftVariant, DraftVariant, DraftVariant];

// Wording revision: 2026-10-16, round 3 clinical anchors. All content remains needs_clinician_review.
// Invented study observations belong only to unnamed investigational interventions.
export const STATISTICS_VARIANTS: Record<string, FourVariants> = {
  "independent-t": [
    {
      "slug": "two-teams",
      "complaint": "venous leg ulcer study",
      "presentation": "{patientName}, the journal-club lead, reviews a trial of a new compression device for venous leg ulcers in adults whose arterial assessment permits compression. Two groups contribute healing times. The presenter cites his own testimonial as independent confirmation; he submitted it under his middle name so the reviews would look less repetitive. The protocol's assumptions are available.",
      "stem": "Which analysis best fits the study's comparison of mean healing time, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_two-teams",
        "label": "Two-sample t test",
        "rationale": "The study compares means from two groups of different people, and its stated continuous-data assumptions are reasonable. A two-sample t procedure matches that structure."
      },
      "distractors": [
        {
          "id": "d1_two-teams",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        },
        {
          "id": "d2_two-teams",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d3_two-teams",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure."
        }
      ],
      "teachingPoint": "Start with the outcome and who contributed it. This study compares mean healing time between two groups of different people, with reasonable normal-model assumptions and complete follow-up. A two-sample t test fits that question. Remember: sharing an outcome measure does not make observations linked; repeated people or deliberate matching would change the structure.",
      "explanation": "Use a two-sample t test for mean completed healing time: the groups contain different people, and the stated continuous-data assumptions are reasonable.",
      "exhibit": {
        "kind": "abstract",
        "title": "Healing time — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational compression device in venous leg ulcers. Outcome: healing time, in days. Two separately sampled treatment groups contribute one measurement per person. Groups do not overlap and nobody is matched. Measurements are approximately normal with comparable variability and no influential outliers. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "venous-ulcer"
    },
    {
      "slug": "two-cohorts",
      "complaint": "lactational breast abscess study",
      "presentation": "{patientName}, the breast-service research lead, reviews a trial of a new topical agent after drainage of lactational breast abscesses. Different participants received each preparation. Ultrasound measured the remaining cavity area at the protocol visit. A colleague proposes linking the groups because the same sonographer collected all measurements. The report includes the distribution checks for analysis.",
      "stem": "Which analysis best fits the study's comparison of mean remaining abscess-cavity area, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_two-cohorts",
        "label": "Two-sample t test",
        "rationale": "The study compares means from two groups of different people, and its stated continuous-data assumptions are reasonable. A two-sample t procedure matches that structure."
      },
      "distractors": [
        {
          "id": "d1_two-cohorts",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        },
        {
          "id": "d2_two-cohorts",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure."
        },
        {
          "id": "d3_two-cohorts",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table."
        }
      ],
      "teachingPoint": "The scanner does not define the relationship between observations. These abscess-cavity areas come from different people in two nonoverlapping groups, with suitable continuous-data assumptions. A two-sample t test compares their means. Remember to ask who was measured, not whether the groups used the same instrument or had the same number of columns.",
      "explanation": "A two-sample t test fits mean remaining abscess-cavity area in two nonoverlapping groups. Using the same sonographer does not create repeated or matched observations.",
      "exhibit": {
        "kind": "abstract",
        "title": "Remaining abscess-cavity area — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational topical agent in lactational breast abscesses. Outcome: remaining abscess-cavity area, in square centimeters. Two separately sampled treatment groups contribute one measurement per person. Groups do not overlap and nobody is matched. Measurements are approximately normal with comparable variability and no influential outliers. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "lactational-abscess"
    },
    {
      "slug": "two-shifts",
      "complaint": "superficial partial-thickness burn study",
      "presentation": "{patientName}, the burn-service discussion lead, reviews two new cooling dressings for superficial partial-thickness burns. The trial records remaining wound depth at a protocol visit, with each adult contributing one measurement. A colleague has prepared a comparison of dressing labels. The investigators' stated question concerns average remaining depth, and the measurement assumptions appear in the exhibit.",
      "stem": "Which analysis best fits the study's comparison of mean remaining burn depth, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_two-shifts",
        "label": "Two-sample t test",
        "rationale": "The study compares means from two groups of different people, and its stated continuous-data assumptions are reasonable. A two-sample t procedure matches that structure."
      },
      "distractors": [
        {
          "id": "d1_two-shifts",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d2_two-shifts",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure."
        },
        {
          "id": "d3_two-shifts",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table."
        }
      ],
      "teachingPoint": "Device names identify the groups; measured burn depth is the continuous outcome. With two groups of different people and reasonable normal-model assumptions, a two-sample t test fits a comparison of means. Remember to distinguish a group label from the outcome being compared before selecting a categorical or continuous-data procedure.",
      "explanation": "Compare mean burn depth with a two-sample t test under the supplied assumptions. Device labels define groups; they are not the measured outcome.",
      "exhibit": {
        "kind": "abstract",
        "title": "Remaining burn depth — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational cooling dressing in superficial partial-thickness burns. Outcome: remaining burn depth, in millimeters. Two separately sampled treatment groups contribute one measurement per person. Groups do not overlap and nobody is matched. Measurements are approximately normal with comparable variability and no influential outliers. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "burn"
    },
    {
      "slug": "two-scripts",
      "complaint": "chronic anal fissure study",
      "presentation": "{patientName}, the colorectal research lead, reviews a study of a new topical agent for chronic anal fissure. Two hospitals contribute completed healing times from different patients. The company representative calls his presentation a brief overview, then asks whether attending it can count toward everyone's continuing education credits. The report supplies its sampling and distribution details.",
      "stem": "Which analysis best fits the study's comparison of mean fissure-healing time, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_two-scripts",
        "label": "Two-sample t test",
        "rationale": "The study compares means from two groups of different people, and its stated continuous-data assumptions are reasonable. A two-sample t procedure matches that structure."
      },
      "distractors": [
        {
          "id": "d1_two-scripts",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        },
        {
          "id": "d2_two-scripts",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d3_two-scripts",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table."
        }
      ],
      "teachingPoint": "A two-sample t test compares means from two groups of different people when the stated assumptions are reasonable. Each participant contributes one completed fissure-healing time here, with no matching. Remember that two columns alone tell you little: the people, measurement scale and distribution checks determine whether a two-group mean comparison fits.",
      "explanation": "A two-sample t test fits these two groups' mean completed fissure-healing times. There is no matching, and the normal-model assumptions are stated to be reasonable.",
      "exhibit": {
        "kind": "abstract",
        "title": "Fissure-healing time — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational topical agent in chronic anal fissure. Outcome: fissure-healing time, in days. Two hospitals using different study preparations contribute different people, without matching, with one completed healing time per person. Measurements are approximately normal with comparable variability and no influential outliers. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "chronic-fissure"
    }
  ],
  "paired-t": [
    {
      "slug": "same-rooms",
      "complaint": "hidradenitis suppurativa study",
      "presentation": "{patientName}, the skin-service research lead, reviews a new topical agent for hidradenitis suppurativa. Investigators measured involved skin area before and after treatment in the same adults. The coordinator describes appointments as flexible: participants may choose any date, provided it is the one already booked for them. The study reports individual changes and their distribution checks.",
      "stem": "Which analysis best fits the study's comparison of mean involved-skin-area change, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_same-rooms",
        "label": "Paired t test",
        "rationale": "Each change comes from repeated measurements or a designated pair, and those differences are approximately normal. A paired t procedure compares their mean."
      },
      "distractors": [
        {
          "id": "d1_same-rooms",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences."
        },
        {
          "id": "d2_same-rooms",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank uses the signs and ranks of differences. Here the stated question is about mean change and the approximately normal differences support a paired mean model."
        },
        {
          "id": "d3_same-rooms",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences."
        }
      ],
      "teachingPoint": "Repeated measurements from one person belong together. Calculate each person's involved-skin-area change, then analyze those differences; here they are approximately normal, supporting a paired t test. Remember: the unit of analysis is the within-person change. Treating the visits as unrelated groups discards the relationship built into the study design.",
      "explanation": "Use a paired t test on each person's involved-skin-area change. The same people supply both measurements, and the changes are approximately normal.",
      "exhibit": {
        "kind": "abstract",
        "title": "Involved-skin-area change — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational topical agent in hidradenitis suppurativa. Outcome: involved-skin-area change, in square centimeters. The same 18 people are measured before and after treatment. Within-person differences are approximately normal without influential outliers. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "hidradenitis"
    },
    {
      "slug": "same-trainees",
      "complaint": "cutaneous abscess study",
      "presentation": "{patientName}, the surgical research lead, reviews a new irrigation instrument used during drainage of cutaneous abscesses. The same participants had cavity depth measured before and after use. The presenter promises an anonymous discussion, then asks everyone to introduce themselves with names, departments and line managers. The report supplies the distribution of each participant's measured change.",
      "stem": "Which analysis best fits the study's comparison of mean abscess-cavity-depth change, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_same-trainees",
        "label": "Paired t test",
        "rationale": "Each change comes from repeated measurements or a designated pair, and those differences are approximately normal. A paired t procedure compares their mean."
      },
      "distractors": [
        {
          "id": "d1_same-trainees",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences."
        },
        {
          "id": "d2_same-trainees",
          "label": "One-way ANOVA",
          "rationale": "The ordinary unrelated-group ANOVA listed here does not use the designated within-person or matched differences. Extra columns do not remove that linkage."
        },
        {
          "id": "d3_same-trainees",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences."
        }
      ],
      "teachingPoint": "The key distribution check concerns within-person changes, not whether each visit's column looks normal separately. These abscess-cavity-depth changes are approximately normal, supporting a paired t test of mean change. Remember to keep each person's two measurements together; a new visit does not create a new group of unrelated people.",
      "explanation": "The approximately normal within-person abscess-cavity-depth changes support a paired t test. Separate visits do not make the repeated observations into unrelated samples.",
      "exhibit": {
        "kind": "abstract",
        "title": "Abscess-cavity-depth change — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational irrigation instrument in cutaneous abscesses. Outcome: abscess-cavity-depth change, in millimeters. The same 24 people are measured before and after treatment. Within-person differences are approximately normal without influential outliers. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "cutaneous-abscess"
    },
    {
      "slug": "matched-sites",
      "complaint": "pilonidal disease study",
      "presentation": "{patientName}, the colorectal journal-club lead, reviews a new excision technique for chronic pilonidal disease. Investigators matched each recipient with a comparison patient before recording completed healing times. One colleague says, 'They are different people, so the matching cannot matter.' The matching records and the distribution of differences within the designated pairs are available for review.",
      "stem": "Which analysis best fits the study's comparison of mean pilonidal-wound healing-time difference, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_matched-sites",
        "label": "Paired t test",
        "rationale": "Each change comes from repeated measurements or a designated pair, and those differences are approximately normal. A paired t procedure compares their mean."
      },
      "distractors": [
        {
          "id": "d1_matched-sites",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences."
        },
        {
          "id": "d2_matched-sites",
          "label": "One-way ANOVA",
          "rationale": "The ordinary unrelated-group ANOVA listed here does not use the designated within-person or matched differences. Extra columns do not remove that linkage."
        },
        {
          "id": "d3_matched-sites",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank uses the signs and ranks of differences. Here the stated question is about mean change and the approximately normal differences support a paired mean model."
        }
      ],
      "teachingPoint": "Pairing can come from deliberate matching as well as repeated measurements. Here each technique recipient has a designated comparison partner, and their pilonidal-wound healing-time differences are approximately normal. A paired t test analyzes those differences. Remember: different people can still supply linked observations when the study design establishes the pairs in advance.",
      "explanation": "Use a paired t test for the designated partners' pilonidal-wound healing-time differences. Deliberate matching supplies the linkage, and the differences are approximately normal.",
      "exhibit": {
        "kind": "abstract",
        "title": "Pilonidal-wound healing-time difference — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational excision technique in chronic pilonidal disease. Outcome: pilonidal-wound healing-time difference, in days. Fifteen treatment recipients were each matched to a comparison recipient before measurement; the 15 differences are computed within those pairs. Within-pair differences are approximately normal without influential outliers. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "pilonidal"
    },
    {
      "slug": "same-workers",
      "complaint": "skin-graft donor wound study",
      "presentation": "{patientName}, the reconstructive research lead, reviews a new dressing for skin-graft donor wounds. The same participants had wound area recorded at baseline and four weeks. The coordinator calls follow-up effortless; participants phone to confirm an email confirming their telephone appointment. A colleague proposes treating visits as separate groups. The report includes the individual wound-area changes.",
      "stem": "Which analysis best fits the study's comparison of mean donor-wound-area change, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_same-workers",
        "label": "Paired t test",
        "rationale": "Each change comes from repeated measurements or a designated pair, and those differences are approximately normal. A paired t procedure compares their mean."
      },
      "distractors": [
        {
          "id": "d1_same-workers",
          "label": "One-way ANOVA",
          "rationale": "The ordinary unrelated-group ANOVA listed here does not use the designated within-person or matched differences. Extra columns do not remove that linkage."
        },
        {
          "id": "d2_same-workers",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences."
        },
        {
          "id": "d3_same-workers",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank uses the signs and ranks of differences. Here the stated question is about mean change and the approximately normal differences support a paired mean model."
        }
      ],
      "teachingPoint": "Two visits do not mean two unrelated samples when the same people attend both. Use each participant's follow-up-minus-baseline donor-wound area; the approximately normal changes support a paired t test. Remember to analyze the change distribution. A procedure for several unrelated groups would answer a different structural question from this repeated-measurement study.",
      "explanation": "Analyze follow-up-minus-baseline donor-wound area with a paired t test. Both measurements belong to the same people, and their changes meet the supplied normality assumption.",
      "exhibit": {
        "kind": "abstract",
        "title": "Donor-wound-area change — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational donor-site dressing in skin-graft donor wounds. Outcome: donor-wound-area change, in square centimeters. The same 30 people are measured at baseline and four weeks. Within-person differences are approximately normal without influential outliers. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "donor-wound"
    }
  ],
  "one-way-anova": [
    {
      "slug": "three-teams",
      "complaint": "diabetic foot ulcer study",
      "presentation": "{patientName}, the wound-service research lead, reviews new offloading devices for clinically uninfected diabetic foot ulcers. Three separately assigned groups contribute completed healing times. Each manufacturer wants its product designated the reference standard before anyone sees the results. The investigators request one overall comparison of average healing time, with sampling and distribution information supplied in the report.",
      "stem": "Which analysis best fits the study's comparison of mean ulcer-healing time, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_three-teams",
        "label": "One-way ANOVA",
        "rationale": "The requested overall mean comparison includes several groups, each containing different people. The residual-normality and comparable-variance assumptions are stated to fit."
      },
      "distractors": [
        {
          "id": "d1_three-teams",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        },
        {
          "id": "d2_three-teams",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum addresses two groups rather than the requested overall comparison across several treatment groups. It does not supply that multi-group mean test."
        },
        {
          "id": "d3_three-teams",
          "label": "Independent-samples t test",
          "rationale": "A two-sample procedure addresses two groups at a time. The requested overall comparison includes more than two treatment groups together."
        }
      ],
      "teachingPoint": "One-way ANOVA tests an overall question about means across three or more groups when its assumptions fit. These ulcer-healing times come from different people, with suitable residual and spread checks. Remember: one overall test asks whether all group means are equal; a significant result alone would not identify which particular groups differ.",
      "explanation": "Use one-way ANOVA for an overall comparison of mean completed ulcer-healing time across three groups. The stated observation, residual and spread assumptions fit.",
      "exhibit": {
        "kind": "abstract",
        "title": "Ulcer-healing time — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational offloading device in clinically uninfected diabetic foot ulcers. Outcome: ulcer-healing time, in days. 3 separately assigned treatment groups contribute one measurement per person. Groups do not overlap. Model residuals are approximately normal and within-group variances are comparable. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "diabetic-ulcer"
    },
    {
      "slug": "four-formats",
      "complaint": "keloid study",
      "presentation": "{patientName}, the plastic-surgery research lead, reviews four new injectable preparations for keloid scars. Each participant received one preparation, and scar area was measured at the protocol visit. Procurement wants the winning supplier named before opening bids, so that supplier can help write the purchasing criteria. The report supplies assumptions for comparing the groups' average scar areas.",
      "stem": "Which analysis best fits the study's comparison of mean remaining scar area, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_four-formats",
        "label": "One-way ANOVA",
        "rationale": "The requested overall mean comparison includes several groups, each containing different people. The residual-normality and comparable-variance assumptions are stated to fit."
      },
      "distractors": [
        {
          "id": "d1_four-formats",
          "label": "Independent-samples t test",
          "rationale": "A two-sample procedure addresses two groups at a time. The requested overall comparison includes more than two treatment groups together."
        },
        {
          "id": "d2_four-formats",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d3_four-formats",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum addresses two groups rather than the requested overall comparison across several treatment groups. It does not supply that multi-group mean test."
        }
      ],
      "teachingPoint": "Four groups require a procedure that addresses their means together. With continuous scar areas, separate participants, reasonable residual normality and comparable variances, one-way ANOVA fits. Remember to count groups after checking the measurement structure. A two-group procedure does not become an overall four-group test simply because the outcome is continuous.",
      "explanation": "One-way ANOVA compares mean remaining scar area across the four groups together. Each participant appears once, and the supplied model assumptions are reasonable.",
      "exhibit": {
        "kind": "abstract",
        "title": "Remaining scar area — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational injectable scar preparation in keloids. Outcome: remaining scar area, in square centimeters. 4 separately assigned treatment groups contribute one measurement per person. Groups do not overlap. Model residuals are approximately normal and within-group variances are comparable. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "keloid"
    },
    {
      "slug": "three-sites",
      "complaint": "perianal abscess study",
      "presentation": "{patientName}, the colorectal discussion lead, reviews new drainage adjuncts for superficial perianal abscesses. Three groups contribute remaining cavity depths at the protocol visit. Each participant belongs to one group. The investigators request an overall comparison of average depth. A colleague has instead entered the product labels as the outcome; the measurement assumptions accompany the data.",
      "stem": "Which analysis best fits the study's comparison of mean remaining abscess-cavity depth, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_three-sites",
        "label": "One-way ANOVA",
        "rationale": "The requested overall mean comparison includes several groups, each containing different people. The residual-normality and comparable-variance assumptions are stated to fit."
      },
      "distractors": [
        {
          "id": "d1_three-sites",
          "label": "Independent-samples t test",
          "rationale": "A two-sample procedure addresses two groups at a time. The requested overall comparison includes more than two treatment groups together."
        },
        {
          "id": "d2_three-sites",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum addresses two groups rather than the requested overall comparison across several treatment groups. It does not supply that multi-group mean test."
        },
        {
          "id": "d3_three-sites",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table."
        }
      ],
      "teachingPoint": "The device label defines the group, while abscess-cavity depth supplies the measured outcome. One-way ANOVA compares mean depth across these three groups under the stated assumptions. Remember to identify what was measured before choosing a procedure: a table listing group names does not turn a continuous outcome into categorical counts.",
      "explanation": "Use one-way ANOVA to compare mean abscess-cavity depth across three treatment groups. Depth is continuous; treatment labels identify the groups being compared.",
      "exhibit": {
        "kind": "abstract",
        "title": "Remaining abscess-cavity depth — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational drainage adjunct in perianal abscesses. Outcome: remaining abscess-cavity depth, in millimeters. 3 separately assigned treatment groups contribute one measurement per person. Groups do not overlap. Model residuals are approximately normal and within-group variances are comparable. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "perianal-abscess"
    },
    {
      "slug": "five-signs",
      "complaint": "ARDS study",
      "presentation": "{patientName}, the critical-care journal-club lead, reviews five investigational ventilation techniques for adults with ARDS. Each group contributes measured changes in arterial oxygen tension. The designer requests an impartial assessment, then explains how impartial reviewers usually describe his favorite technique. Follow-up measurements are complete, and the report supplies assumptions for an overall comparison of average change.",
      "stem": "Which analysis best fits the study's comparison of mean arterial-oxygen-tension change, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_five-signs",
        "label": "One-way ANOVA",
        "rationale": "The requested overall mean comparison includes several groups, each containing different people. The residual-normality and comparable-variance assumptions are stated to fit."
      },
      "distractors": [
        {
          "id": "d1_five-signs",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        },
        {
          "id": "d2_five-signs",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d3_five-signs",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum addresses two groups rather than the requested overall comparison across several treatment groups. It does not supply that multi-group mean test."
        }
      ],
      "teachingPoint": "One-way ANOVA can compare mean changes across five groups when its assumptions fit. Each participant contributes one oxygen-tension change score to a single group. Remember: the analysis compares group means of those scores; a change score does not make different treatment groups into matched pairs. An overall result does not locate every difference.",
      "explanation": "One-way ANOVA fits the overall comparison of mean arterial-oxygen-tension change across five groups. A significant overall result alone would not identify which groups differ.",
      "exhibit": {
        "kind": "abstract",
        "title": "Arterial-oxygen-tension change — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational ventilation technique in adult ARDS. Outcome: arterial-oxygen-tension change, in mmHg. 5 separately assigned treatment groups contribute one measurement per person. Groups do not overlap. Model residuals are approximately normal and within-group variances are comparable. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "ards"
    }
  ],
  "rank-sum": [
    {
      "slug": "ordinal-teams",
      "complaint": "achalasia study",
      "presentation": "{patientName}, the esophageal research lead, reviews two new endoscopic techniques for achalasia. The study uses ordered, protocol-defined symptom-relief ratings after structural obstruction was excluded. The sponsor calls the report accessible; the scale explanation appears only after the tutorial on accessing the report. Each participant received one technique, and the exhibit describes how the ratings are used.",
      "stem": "Which analysis best fits the study's comparison of symptom-relief ratings, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_ordinal-teams",
        "label": "Wilcoxon rank-sum test",
        "rationale": "These protocol-defined symptom-relief ratings are ordinal, and the two groups contain different people. Rank-sum fits that ranked comparison without assuming equal distances between category labels."
      },
      "distractors": [
        {
          "id": "d1_ordinal-teams",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d2_ordinal-teams",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        },
        {
          "id": "d3_ordinal-teams",
          "label": "Independent-samples t test",
          "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions."
        }
      ],
      "teachingPoint": "Ordered symptom-relief categories preserve rank without promising equal spacing between labels. A Wilcoxon rank-sum test fits the comparison of two groups of different people here. Remember: ordered is not automatically continuous. Using a ranking procedure also does not justify describing every result as an unqualified difference in population medians.",
      "explanation": "Use Wilcoxon rank-sum for ordinal symptom-relief ratings from two groups of different people. Ordered labels do not establish equal spacing for a mean comparison.",
      "exhibit": {
        "kind": "abstract",
        "title": "Symptom-relief ratings — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational endoscopic technique in achalasia. Outcome: symptom-relief ratings, in ordered categories. Two separately sampled groups contribute one result per person, without matching. The protocol uses a five-level ordinal rating, not assumed equally spaced and not an established clinical score. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "achalasia"
    },
    {
      "slug": "skewed-delays",
      "complaint": "gastroparesis study",
      "presentation": "{patientName}, the foregut journal-club lead, reviews a new gastric motility agent for gastroparesis after mechanical obstruction was excluded. Two groups contribute gastric-emptying times, including verified unusually long measurements. The project manager promises a short discussion, then distributes an agenda with a separate agenda briefing. The report describes the distributions and the comparison requested by investigators.",
      "stem": "Which analysis best fits the study's comparison of gastric-emptying-time distributions, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_skewed-delays",
        "label": "Wilcoxon rank-sum test",
        "rationale": "The groups contain different people with completed gastric-emptying times that are unsuitable for the stated normal model. Rank-sum fits this comparison of ranked observations."
      },
      "distractors": [
        {
          "id": "d1_skewed-delays",
          "label": "Independent-samples t test",
          "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions."
        },
        {
          "id": "d2_skewed-delays",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d3_skewed-delays",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table."
        }
      ],
      "teachingPoint": "Check the data structure before the distribution. These completed gastric-emptying times come from two groups of different people, but verified extreme skew makes the stated normal-model comparison unsuitable. Wilcoxon rank-sum fits this ranked comparison. Remember that a median-only interpretation still needs additional distributional assumptions; selecting the procedure does not supply them.",
      "explanation": "Wilcoxon rank-sum fits the two groups' ranked gastric-emptying-time comparison. The verified skew and extremes make the stated normal-model mean comparison unsuitable for this exercise.",
      "exhibit": {
        "kind": "abstract",
        "title": "Gastric-emptying-time distributions — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational gastric motility agent in gastroparesis. Outcome: gastric-emptying-time distributions, in minutes. Two separately sampled groups contribute one result per person, without matching. Measurements are strongly right-skewed with verified influential extremes; a normal-model mean comparison is unsuitable. No common distribution shape is established. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "gastroparesis"
    },
    {
      "slug": "independent-likert",
      "complaint": "carpal tunnel syndrome study",
      "presentation": "{patientName}, the hand-service research lead, reviews two new wrist devices for carpal tunnel syndrome. Participants reported hand function on an ordered scale at the protocol visit. A colleague proposes matching people because both groups used the same form. Another wants to treat the labels as evenly spaced measurements. The study's scale definitions accompany the results.",
      "stem": "Which analysis best fits the study's comparison of hand-function categories, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_independent-likert",
        "label": "Wilcoxon rank-sum test",
        "rationale": "These protocol-defined hand-function ratings are ordinal, and the two groups contain different people. Rank-sum fits that ranked comparison without assuming equal distances between category labels."
      },
      "distractors": [
        {
          "id": "d1_independent-likert",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d2_independent-likert",
          "label": "One-way ANOVA",
          "rationale": "This ordinary mean-based ANOVA does not address the supplied ordinal or unsuitable non-normal comparison. Having groups does not by itself establish its assumptions."
        },
        {
          "id": "d3_independent-likert",
          "label": "Independent-samples t test",
          "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions."
        }
      ],
      "teachingPoint": "A shared rating form does not link people in different groups. These protocol-defined categories are ordinal, so Wilcoxon rank-sum fits their two-group comparison. Remember that numbers printed beside ordered labels do not establish equal distances between them. A mean-based model requires more than a convenient numerical code on the form.",
      "explanation": "The groups contain different people using an ordinal scale, supporting Wilcoxon rank-sum. A shared form neither links the observations nor supplies equal measurement intervals.",
      "exhibit": {
        "kind": "abstract",
        "title": "Hand-function categories — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational wrist device in carpal tunnel syndrome. Outcome: hand-function categories, in ordered categories. Two separately sampled groups contribute one result per person, without matching. The protocol uses a seven-level ordinal rating, not assumed equally spaced and not an established clinical score. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "carpal-tunnel"
    },
    {
      "slug": "two-queues",
      "complaint": "postherniorrhaphy pain study",
      "presentation": "{patientName}, the pain-service journal-club lead, reviews a new targeted nerve-block delivery device for postherniorrhaphy pain. Two groups contribute the duration of symptom relief, with verified long observations retained. No participants are matched. A colleague proposes describing any detected difference as a difference in medians. The report provides the available distribution checks and the intended comparison.",
      "stem": "Which analysis best fits the study's comparison of symptom-relief-duration distributions, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_two-queues",
        "label": "Wilcoxon rank-sum test",
        "rationale": "The groups contain different people with completed symptom-relief durations that are unsuitable for the stated normal model. Rank-sum fits this comparison of ranked observations."
      },
      "distractors": [
        {
          "id": "d1_two-queues",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        },
        {
          "id": "d2_two-queues",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d3_two-queues",
          "label": "Independent-samples t test",
          "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions."
        }
      ],
      "teachingPoint": "Wilcoxon rank-sum compares ranked observations from two groups of different people. It fits the stated non-normal symptom-relief-duration distributions here. Remember the interpretation boundary: without further shape and location assumptions, its result is not automatically a pure median comparison. Choosing a suitable procedure and describing what it establishes are separate steps.",
      "explanation": "Use Wilcoxon rank-sum for the stated ranked symptom-relief-duration comparison. Its result is not automatically a pure median comparison without additional distributional assumptions.",
      "exhibit": {
        "kind": "abstract",
        "title": "Symptom-relief-duration distributions — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational nerve-block delivery device in postherniorrhaphy pain. Outcome: symptom-relief-duration distributions, in hours. Two separately sampled groups contribute one result per person, without matching. Measurements are strongly right-skewed with verified influential extremes; a normal-model mean comparison is unsuitable. No common distribution shape is established. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "postherniorrhaphy-pain"
    }
  ],
  "signed-rank": [
    {
      "slug": "paired-workload",
      "complaint": "Graves disease study",
      "presentation": "{patientName}, the endocrine research lead, reviews a new thyroid-directed agent for Graves disease. The same adults had thyroid volume measured before and after treatment. The reviewer requests raw measurements; the coordinator offers the polished version because it makes a better first impression. The report describes the distribution of individual volume changes and the assumptions under review.",
      "stem": "Which analysis best fits the study's comparison of thyroid-volume change, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_paired-workload",
        "label": "Wilcoxon signed-rank test",
        "rationale": "The study supplies linked continuous differences that are reasonably symmetric but unsuitable for a t model. Signed-rank uses their signs and ranks."
      },
      "distractors": [
        {
          "id": "d1_paired-workload",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences."
        },
        {
          "id": "d2_paired-workload",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences."
        },
        {
          "id": "d3_paired-workload",
          "label": "Paired t test",
          "rationale": "The observations are linked, but the exhibit says their differences are unsuitable for the paired mean model. Linkage alone does not establish its distributional assumptions."
        }
      ],
      "teachingPoint": "Keep each person's measurements linked before considering the distribution. These thyroid-volume differences are reasonably symmetric but unsuitable for the paired mean model, supporting Wilcoxon signed-rank. Remember: signed-rank uses the signs and ranks of nonzero within-pair differences. It is not the same procedure as comparing ranked observations from unrelated groups.",
      "explanation": "Use Wilcoxon signed-rank for the linked thyroid-volume differences: they are reasonably symmetric but unsuitable for the stated paired mean model in this exercise.",
      "exhibit": {
        "kind": "abstract",
        "title": "Thyroid-volume change — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational thyroid-directed agent in Graves disease. Outcome: thyroid-volume change, in cubic centimeters. The same people are measured before and after treatment. Differences are reasonably symmetric but distinctly non-normal, making a paired mean model unsuitable. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "graves"
    },
    {
      "slug": "same-rooms-skewed",
      "complaint": "primary hyperparathyroidism study",
      "presentation": "{patientName}, the endocrine journal-club lead, reviews a new calcium-lowering agent for primary hyperparathyroidism. Serum calcium was measured before and after treatment in the same adults. The presenter insists everyone arrive early for his seminar on respecting colleagues' time. One colleague checked each visit separately; the report also describes the distribution of changes within individual participants.",
      "stem": "Which analysis best fits the study's comparison of serum-calcium change, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_same-rooms-skewed",
        "label": "Wilcoxon signed-rank test",
        "rationale": "The study supplies linked continuous differences that are reasonably symmetric but unsuitable for a t model. Signed-rank uses their signs and ranks."
      },
      "distractors": [
        {
          "id": "d1_same-rooms-skewed",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences."
        },
        {
          "id": "d2_same-rooms-skewed",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences."
        },
        {
          "id": "d3_same-rooms-skewed",
          "label": "One-way ANOVA",
          "rationale": "The ordinary unrelated-group ANOVA listed here does not use the designated within-person or matched differences. Extra columns do not remove that linkage."
        }
      ],
      "teachingPoint": "The relevant distribution is the change within each patient. Here serum-calcium differences are reasonably symmetric but have non-normal tails that make the paired mean model unsuitable. Wilcoxon signed-rank fits the stated conditions. Remember that separate checks of the two visit columns do not replace a check of the differences being analyzed.",
      "explanation": "Wilcoxon signed-rank fits the within-person serum-calcium differences under the supplied symmetry and distribution findings. Checking visit columns separately does not answer that change-distribution question.",
      "exhibit": {
        "kind": "abstract",
        "title": "Serum-calcium change — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational calcium-lowering agent in primary hyperparathyroidism. Outcome: serum-calcium change, in mg/dL. The same people are measured before and after treatment. Differences are reasonably symmetric but distinctly non-normal, making a paired mean model unsuitable. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "hyperparathyroidism"
    },
    {
      "slug": "matched-dyads",
      "complaint": "persistent neck mass study",
      "presentation": "{patientName}, the head-and-neck research lead, reviews a new needle-biopsy technique for persistent neck masses undergoing malignancy evaluation. Recipients were matched to comparison patients before completed biopsy-site healing times were recorded. The investigators want to compare times within those designated pairs. The report supplies the matching structure and the distribution of differences between paired healing times.",
      "stem": "Which analysis best fits the study's comparison of biopsy-site healing-time differences, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_matched-dyads",
        "label": "Wilcoxon signed-rank test",
        "rationale": "The study supplies linked continuous differences that are reasonably symmetric but unsuitable for a t model. Signed-rank uses their signs and ranks."
      },
      "distractors": [
        {
          "id": "d1_matched-dyads",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences."
        },
        {
          "id": "d2_matched-dyads",
          "label": "Independent-samples t test",
          "rationale": "A two-sample t procedure treats the groups as unrelated. It would discard the within-person or designated-pair relationship that supplies this study's differences."
        },
        {
          "id": "d3_matched-dyads",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit."
        }
      ],
      "teachingPoint": "Deliberately matched people can form pairs even when nobody is measured twice. These biopsy-site healing-time differences are reasonably symmetric but unsuitable for a t model, supporting Wilcoxon signed-rank. Remember to follow the design's links. McNemar testing concerns paired binary responses, not the continuous completed healing times recorded within these matched pairs.",
      "explanation": "Use Wilcoxon signed-rank for the designated pairs' continuous biopsy-site healing-time differences. Their reasonable symmetry and unsuitable t-model distribution support that choice over unrelated-group or binary-response procedures.",
      "exhibit": {
        "kind": "abstract",
        "title": "Biopsy-site healing-time differences — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational needle-biopsy technique in persistent adult neck masses. Outcome: biopsy-site healing-time differences, in days. Treatment recipients were matched to comparison recipients before measurement; differences are computed within the designated pairs. Differences are reasonably symmetric but distinctly non-normal, making a paired mean model unsuitable. All times are observed to completion with no censoring. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "adult-neck-mass"
    },
    {
      "slug": "pre-post-counts",
      "complaint": "cubital tunnel syndrome study",
      "presentation": "{patientName}, the hand-service journal-club lead, reviews a new elbow-bracing device for cubital tunnel syndrome. Investigators measured handgrip force before and after treatment in the same adults. Management calls the project frictionless; opening its presentation requires three passwords and a paper permission slip. The report describes individual force changes and the distribution checks for the proposed analysis.",
      "stem": "Which analysis best fits the study's comparison of handgrip-force change, using the measurements and assumptions in the exhibit?",
      "correct": {
        "id": "correct_pre-post-counts",
        "label": "Wilcoxon signed-rank test",
        "rationale": "The study supplies linked continuous differences that are reasonably symmetric but unsuitable for a t model. Signed-rank uses their signs and ranks."
      },
      "distractors": [
        {
          "id": "d1_pre-post-counts",
          "label": "Paired t test",
          "rationale": "The observations are linked, but the exhibit says their differences are unsuitable for the paired mean model. Linkage alone does not establish its distributional assumptions."
        },
        {
          "id": "d2_pre-post-counts",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum compares ranked observations from unrelated groups. It would ignore the repeated-person or matching structure used to form the study's differences."
        },
        {
          "id": "d3_pre-post-counts",
          "label": "Chi-square test of independence",
          "rationale": "Chi-square testing analyzes counts in categories. The requested comparison concerns continuous measurements or ordered ratings, not a categorical contingency table."
        }
      ],
      "teachingPoint": "A Wilcoxon signed-rank procedure fits linked continuous differences that are reasonably symmetric but unsuitable for the stated t model. These repeated handgrip forces meet those supplied conditions. Remember both requirements: linkage distinguishes signed-rank from rank-sum, while symmetry matters for the usual location interpretation. Non-normality alone is not a complete selection rule.",
      "explanation": "The repeated handgrip-force differences support Wilcoxon signed-rank under the stated symmetry and non-normality findings. Non-normal data alone would not establish all the required conditions.",
      "exhibit": {
        "kind": "abstract",
        "title": "Handgrip-force change — illustrative clinical study",
        "body": "Invented protocol observations for an unnamed investigational elbow-bracing device in cubital tunnel syndrome. Outcome: handgrip-force change, in newtons. The same people are measured before and after treatment. Differences are reasonably symmetric but distinctly non-normal, making a paired mean model unsuitable. These practice assumptions supply no real treatment efficacy."
      },
      "clinicalAnchor": "cubital-tunnel"
    }
  ],
  "chi-square": [
    {
      "slug": "role-by-choice",
      "complaint": "appendicitis study",
      "presentation": "{patientName}, the emergency-surgery research lead, reviews three new operative techniques for appendicitis with an appendicolith. The trial records surgical-site infection categories within thirty days. The presenter saves the methods appendix until after discussion because, he says, nobody likes a spoiler. Each participant contributes one category, and the report supplies the table's expected-count assessment for analysis.",
      "stem": "Which analysis best examines the association between study intervention and thirty-day SSI category, using the table and assumptions in the exhibit?",
      "correct": {
        "id": "correct_role-by-choice",
        "label": "Chi-square test",
        "rationale": "Device group and outcome category are categorical variables, with separate observations and adequate expected counts. The requested large-sample association procedure fits those conditions."
      },
      "distractors": [
        {
          "id": "d1_role-by-choice",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit."
        },
        {
          "id": "d2_role-by-choice",
          "label": "Fisher exact test",
          "rationale": "The ordinary two-by-two exact procedure does not match this table's multiple categories. Adequate expected counts support the requested large-sample association analysis."
        },
        {
          "id": "d3_role-by-choice",
          "label": "Independent-samples t test",
          "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions."
        }
      ],
      "teachingPoint": "A chi-square test of independence assesses a relationship between categorical variables when observations are separate and expected counts support the approximation. Here intervention groups and outcome categories define the table. Remember to identify what each cell counts; several categories in a row do not make the same person a repeated observation.",
      "explanation": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational appendectomy technique study: invented practice counts of people by intervention and thirty-day SSI category. Each contributes once; no matching. Expected counts support the requested approximation.",
        "columnHeaders": [
          "No SSI",
          "Superficial SSI",
          "Deeper SSI"
        ],
        "rowHeaders": [
          "New study intervention A",
          "New study intervention B",
          "New study intervention C"
        ],
        "cells": [
          [
            "30",
            "25",
            "25"
          ],
          [
            "25",
            "30",
            "25"
          ],
          [
            "25",
            "25",
            "30"
          ]
        ]
      },
      "clinicalAnchor": "appendix"
    },
    {
      "slug": "shift-by-response",
      "complaint": "gallstones study",
      "presentation": "{patientName}, the biliary research lead, reviews three new dissection instruments used during surgery for symptomatic gallstones. The trial classifies thirty-day surgical-site infection as absent, superficial or deeper. Each participant contributes once and received one instrument. Investigators want to examine the relationship between instrument group and infection category; the report includes the expected-count assessment for the table.",
      "stem": "Which analysis best examines the association between study intervention and thirty-day SSI category, using the table and assumptions in the exhibit?",
      "correct": {
        "id": "correct_shift-by-response",
        "label": "Chi-square test",
        "rationale": "Device group and outcome category are categorical variables, with separate observations and adequate expected counts. The requested large-sample association procedure fits those conditions."
      },
      "distractors": [
        {
          "id": "d1_shift-by-response",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure."
        },
        {
          "id": "d2_shift-by-response",
          "label": "Fisher exact test",
          "rationale": "The ordinary two-by-two exact procedure does not match this table's multiple categories. Adequate expected counts support the requested large-sample association analysis."
        },
        {
          "id": "d3_shift-by-response",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit."
        }
      ],
      "teachingPoint": "Device group and recorded outcome category are both categorical variables. The expected counts support a chi-square approximation, and each person contributes once. Remember that the number of columns does not establish pairing or a continuous outcome. The question concerns an association between categories, not a comparison of numerical means.",
      "explanation": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational gallbladder dissection instrument study: invented practice counts of people by intervention and thirty-day SSI category. Each contributes once; no matching. Expected counts support the requested approximation.",
        "columnHeaders": [
          "No SSI",
          "Superficial SSI",
          "Deeper SSI"
        ],
        "rowHeaders": [
          "New study intervention A",
          "New study intervention B",
          "New study intervention C"
        ],
        "cells": [
          [
            "30",
            "20",
            "10"
          ],
          [
            "20",
            "30",
            "10"
          ],
          [
            "10",
            "20",
            "30"
          ]
        ]
      },
      "clinicalAnchor": "gallstones"
    },
    {
      "slug": "badge-by-completion",
      "complaint": "anal-canal SCC study",
      "presentation": "{patientName}, the oncology discussion lead, reviews two new radiation-delivery devices for localized anal-canal SCC. The study records complete response or incomplete response at its stated assessment visit. A colleague proposes comparing average healing time, but the available records contain only device group and response category. Each participant contributes once, and the expected-count assessment accompanies the table.",
      "stem": "Which analysis best examines the association between study intervention and tumor response at six months, using the table and assumptions in the exhibit?",
      "correct": {
        "id": "correct_badge-by-completion",
        "label": "Chi-square test",
        "rationale": "Device group and outcome category are categorical variables, with separate observations and adequate expected counts. The requested large-sample association procedure fits those conditions."
      },
      "distractors": [
        {
          "id": "d1_badge-by-completion",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit."
        },
        {
          "id": "d2_badge-by-completion",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure."
        },
        {
          "id": "d3_badge-by-completion",
          "label": "Fisher exact test",
          "rationale": "An exact two-by-two comparison could answer another analysis plan. This exhibit explicitly requests the large-sample approximation, whose expected-count conditions are met."
        }
      ],
      "teachingPoint": "The observed counts describe intervention group and whether complete response occurred. With separate observations and adequate expected counts, a chi-square test fits the planned large-sample association analysis. Remember to inspect expected counts and the requested approximation, rather than choosing solely because a table is two by two or has a large total.",
      "explanation": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational anal-cancer radiation device study: invented practice counts of people by intervention and tumor response at six months. Each contributes once; no matching. Expected counts support the requested approximation.",
        "columnHeaders": [
          "Complete response",
          "Incomplete response"
        ],
        "rowHeaders": [
          "New study intervention A",
          "New study intervention B"
        ],
        "cells": [
          [
            "120",
            "80"
          ],
          [
            "80",
            "120"
          ]
        ]
      },
      "clinicalAnchor": "anal-scc"
    },
    {
      "slug": "site-by-category",
      "complaint": "carotid stenosis study",
      "presentation": "{patientName}, the vascular journal-club lead, reviews three new monitoring devices used during carotid operations for symptomatic carotid stenosis. The study classifies postoperative neurologic outcomes at thirty days. The committee requests a concise summary, but each manufacturer insists on a personal foreword. Each participant contributes one category, and the report supplies the expected-count assessment for the comparison.",
      "stem": "Which analysis best examines the association between study intervention and thirty-day neurologic outcome, using the table and assumptions in the exhibit?",
      "correct": {
        "id": "correct_site-by-category",
        "label": "Chi-square test",
        "rationale": "Device group and outcome category are categorical variables, with separate observations and adequate expected counts. The requested large-sample association procedure fits those conditions."
      },
      "distractors": [
        {
          "id": "d1_site-by-category",
          "label": "One-way ANOVA",
          "rationale": "This ordinary mean-based ANOVA does not address the supplied ordinal or unsuitable non-normal comparison. Having groups does not by itself establish its assumptions."
        },
        {
          "id": "d2_site-by-category",
          "label": "Fisher exact test",
          "rationale": "The ordinary two-by-two exact procedure does not match this table's multiple categories. Adequate expected counts support the requested large-sample association analysis."
        },
        {
          "id": "d3_site-by-category",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit."
        }
      ],
      "teachingPoint": "A table can have several rows and columns while asking one categorical-association question. Here a chi-square test fits the separate observations and adequate expected counts. Remember that both conditions matter. Counting rows and columns alone cannot establish them, and numerical cell entries remain counts within categories, not continuous outcome measurements.",
      "explanation": "Use a chi-square test for the categorical intervention/outcome association. Observations are separate, and the supplied expected counts support the requested large-sample approximation.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational carotid monitoring device study: invented practice counts of people by intervention and thirty-day neurologic outcome. Each contributes once; no matching. Expected counts support the requested approximation.",
        "columnHeaders": [
          "No event",
          "Transient deficit",
          "Persistent deficit",
          "Other neurologic event"
        ],
        "rowHeaders": [
          "New study intervention A",
          "New study intervention B",
          "New study intervention C"
        ],
        "cells": [
          [
            "10",
            "10",
            "10",
            "10"
          ],
          [
            "8",
            "12",
            "11",
            "9"
          ],
          [
            "12",
            "8",
            "9",
            "11"
          ]
        ]
      },
      "clinicalAnchor": "carotid"
    }
  ],
  "fisher-exact": [
    {
      "slug": "rare-event",
      "complaint": "gastric GIST study",
      "presentation": "{patientName}, the upper-GI research lead, reviews a small trial of a new stapling instrument used during gastric GIST resection. The report records staple-line leak within thirty days in two separate groups. Participants were not matched, and some table entries are very small. The investigators want to compare leak outcomes; the report provides its expected-count assessment for analysis.",
      "stem": "Which analysis best compares thirty-day staple-line leak between the separate groups, using the sparse table and assumptions in the exhibit?",
      "correct": {
        "id": "correct_rare-event",
        "label": "Fisher exact test",
        "rationale": "The exhibit supplies a sparse two-by-two table from separate participants. An exact categorical comparison fits the stated expected-count problem."
      },
      "distractors": [
        {
          "id": "d1_rare-event",
          "label": "Chi-square test of independence",
          "rationale": "The usual chi-square approximation is unreliable under the stated sparse expected counts. A two-by-two table does not by itself establish that approximation's adequacy."
        },
        {
          "id": "d2_rare-event",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        },
        {
          "id": "d3_rare-event",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit."
        }
      ],
      "teachingPoint": "Fisher's exact test fits this sparse two-by-two comparison of intervention group and outcome status. The supplied expected-count assessment makes a large-sample approximation unreliable. Remember to check the cells, not just the total sample size. A binary outcome from different people also does not create the paired binary structure needed for McNemar testing.",
      "explanation": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational GIST resection stapler: invented practice counts by group and 30-day staple-line leak. Cells count people once, unmatched. Expected counts are sparse; the large-sample approximation is unreliable.",
        "columnHeaders": [
          "Leak",
          "No leak"
        ],
        "rowHeaders": [
          "New study intervention",
          "Study comparator"
        ],
        "cells": [
          [
            "1",
            "8"
          ],
          [
            "0",
            "9"
          ]
        ]
      },
      "clinicalAnchor": "gist"
    },
    {
      "slug": "tiny-pilot",
      "complaint": "rectal prolapse study",
      "presentation": "{patientName}, the colorectal discussion lead, reviews a new fixation technique for rectal prolapse. A small pilot records recurrence within two years in separate groups. The supplier calls the pilot extensive; its sales delegation is larger than the study population. The report contains the observed two-by-two table and the expected-count assessment requested for the recurrence comparison.",
      "stem": "Which analysis best compares two-year recurrence between the separate groups, using the sparse table and assumptions in the exhibit?",
      "correct": {
        "id": "correct_tiny-pilot",
        "label": "Fisher exact test",
        "rationale": "The exhibit supplies a sparse two-by-two table from separate participants. An exact categorical comparison fits the stated expected-count problem."
      },
      "distractors": [
        {
          "id": "d1_tiny-pilot",
          "label": "Chi-square test of independence",
          "rationale": "The usual chi-square approximation is unreliable under the stated sparse expected counts. A two-by-two table does not by itself establish that approximation's adequacy."
        },
        {
          "id": "d2_tiny-pilot",
          "label": "Independent-samples t test",
          "rationale": "This mean-based procedure does not fit the supplied ordinal scale or unsuitable normal-model distribution. A numerical code or a continuous time measurement alone does not establish its assumptions."
        },
        {
          "id": "d3_tiny-pilot",
          "label": "Wilcoxon rank-sum test",
          "rationale": "Rank-sum answers a ranked-observation comparison. This study explicitly requests means and supplies reasonable assumptions for the mean-based procedure."
        }
      ],
      "teachingPoint": "A small two-by-two table with sparse expected counts can require an exact comparison rather than the usual chi-square approximation. Fisher's exact test fits these separate intervention groups. Remember that an empty observed cell is a count, not a continuous measurement; a mean-based procedure would change the question being asked.",
      "explanation": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational prolapse fixation technique: invented practice counts by group and two-year recurrence. Cells count people once, unmatched. Expected counts are sparse; the large-sample approximation is unreliable.",
        "columnHeaders": [
          "Recurrence",
          "No recurrence"
        ],
        "rowHeaders": [
          "New study intervention",
          "Study comparator"
        ],
        "cells": [
          [
            "0",
            "7"
          ],
          [
            "3",
            "4"
          ]
        ]
      },
      "clinicalAnchor": "rectal-prolapse"
    },
    {
      "slug": "sparse-exposure",
      "complaint": "ectopic pregnancy study",
      "presentation": "{patientName}, the gynecology journal-club lead, reviews a new diagnostic pathway for suspected ectopic pregnancy. A small observational study records whether ectopic diagnoses were missed during the protocol assessment. Pathway exposure was uncommon. Participants were not matched or measured repeatedly for this comparison, and the report includes a sparse two-by-two table with an expected-count assessment for analysis.",
      "stem": "Which analysis best compares missed ectopic diagnosis at protocol assessment between the separate groups, using the sparse table and assumptions in the exhibit?",
      "correct": {
        "id": "correct_sparse-exposure",
        "label": "Fisher exact test",
        "rationale": "The exhibit supplies a sparse two-by-two table from separate participants. An exact categorical comparison fits the stated expected-count problem."
      },
      "distractors": [
        {
          "id": "d1_sparse-exposure",
          "label": "One-way ANOVA",
          "rationale": "This ordinary mean-based ANOVA does not address the supplied ordinal or unsuitable non-normal comparison. Having groups does not by itself establish its assumptions."
        },
        {
          "id": "d2_sparse-exposure",
          "label": "Chi-square test of independence",
          "rationale": "The usual chi-square approximation is unreliable under the stated sparse expected counts. A two-by-two table does not by itself establish that approximation's adequacy."
        },
        {
          "id": "d3_sparse-exposure",
          "label": "Paired t test",
          "rationale": "A paired t procedure needs repeated or deliberately matched measurements. This comparison does not supply those links between observations."
        }
      ],
      "teachingPoint": "The comparison concerns categorical intervention exposure and outcome status, with sparse counts in a two-by-two table. Fisher's exact test fits the stated conditions. Remember that an uneven exposure split can leave problematic cells even when the total seems larger. Continuous-outcome procedures do not become suitable merely because the table contains numerical counts.",
      "explanation": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational early-pregnancy diagnostic pathway: invented practice counts by group and missed ectopic diagnosis. Cells count people once, unmatched. Expected counts are sparse; the large-sample approximation is unreliable.",
        "columnHeaders": [
          "Missed diagnosis",
          "No missed diagnosis"
        ],
        "rowHeaders": [
          "New study intervention",
          "Study comparator"
        ],
        "cells": [
          [
            "1",
            "2"
          ],
          [
            "1",
            "18"
          ]
        ]
      },
      "clinicalAnchor": "ectopic"
    },
    {
      "slug": "small-response",
      "complaint": "allergic contact dermatitis study",
      "presentation": "{patientName}, the immunology research lead, reviews a new barrier film for allergic contact dermatitis. The small trial records whether a flare occurred during protocol exposure. The representative offers to answer methods questions afterward, then books his departure for the minute his presentation ends. Each participant contributes one outcome, and the report includes its expected-count assessment.",
      "stem": "Which analysis best compares flare during protocol exposure between the separate groups, using the sparse table and assumptions in the exhibit?",
      "correct": {
        "id": "correct_small-response",
        "label": "Fisher exact test",
        "rationale": "The exhibit supplies a sparse two-by-two table from separate participants. An exact categorical comparison fits the stated expected-count problem."
      },
      "distractors": [
        {
          "id": "d1_small-response",
          "label": "McNemar test",
          "rationale": "McNemar testing concerns paired binary responses. The exhibit instead supplies separate participants or continuous matched differences, so that observation structure does not fit."
        },
        {
          "id": "d2_small-response",
          "label": "Wilcoxon signed-rank test",
          "rationale": "Signed-rank needs repeated or matched observations from which to form differences. The groups in this comparison do not supply those links."
        },
        {
          "id": "d3_small-response",
          "label": "Chi-square test of independence",
          "rationale": "The usual chi-square approximation is unreliable under the stated sparse expected counts. A two-by-two table does not by itself establish that approximation's adequacy."
        }
      ],
      "teachingPoint": "Fisher's exact test addresses the sparse two-by-two categorical comparison described here. Each person contributes one flare outcome, with no pairing. Remember the separate checks: sparse expected counts favor the exact method, while the observation structure rules out a paired binary procedure. Neither the table's two columns nor two groups establishes linkage.",
      "explanation": "Use Fisher's exact test for this sparse two-by-two intervention/outcome table. The stated expected counts make the usual large-sample approximation unreliable for this exercise.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational contact-dermatitis barrier film: invented practice counts by group and protocol-exposure flare. Cells count people once, unmatched. Expected counts are sparse; the large-sample approximation is unreliable.",
        "columnHeaders": [
          "Flare",
          "No flare"
        ],
        "rowHeaders": [
          "New study intervention",
          "Study comparator"
        ],
        "cells": [
          [
            "1",
            "7"
          ],
          [
            "0",
            "8"
          ]
        ]
      },
      "clinicalAnchor": "contact-dermatitis"
    }
  ],
  "study-design": [
    {
      "slug": "cohort-followup",
      "complaint": "inguinal hernia study",
      "presentation": "{patientName}, the hernia-service research lead, reviews a new reinforcement material for symptomatic inguinal hernia repair. Investigators grouped patients by material already received and followed recurrence for two years. The publicity officer wants 'breakthrough' in the title and offers 'breakthrough pending' as a compromise. The clinical teams chose materials; investigators did not allocate the treatments under review.",
      "stem": "Which study design matches how the investigators selected participants, handled the study intervention and measured the clinical outcome described in the exhibit?",
      "correct": {
        "id": "correct_cohort-followup",
        "label": "Prospective cohort study",
        "rationale": "Patients enter by material already received and are followed for recurrence. With no investigator assignment, that forward observation is a prospective cohort."
      },
      "distractors": [
        {
          "id": "d1_cohort-followup",
          "label": "Retrospective case-control study",
          "rationale": "Case-control sampling would begin with recurrence cases and controls. This project instead begins with existing material exposure and observes later outcomes."
        },
        {
          "id": "d2_cohort-followup",
          "label": "Cross-sectional study",
          "rationale": "A cross-sectional snapshot measures exposure and outcome together. These investigators instead follow the exposure groups for later recurrence."
        },
        {
          "id": "d3_cohort-followup",
          "label": "Randomized experiment",
          "rationale": "An experiment would assign the materials. Following patients forward does not create the random allocation absent from this project."
        }
      ],
      "teachingPoint": "Name the design by how people entered the study and what investigators did next. These patients were grouped by material already received and followed for later recurrence, without assigned treatment. That is a prospective cohort. Remember: watching forward in time does not, by itself, make a study randomized or establish a treatment effect.",
      "explanation": "This is a prospective cohort: investigators grouped patients by reinforcement material already received and followed later recurrence without assigning treatment. Forward observation alone does not create randomization.",
      "exhibit": {
        "kind": "abstract",
        "title": "Hernia recurrence — illustrative study design",
        "body": "Patients who already received one of two study reinforcement materials for inguinal hernia repair are grouped by exposure and followed for recurrence over two years. Investigators assign nothing. This unnamed investigational hernia reinforcement material protocol is invented for practice, not an actual study or efficacy estimate."
      },
      "clinicalAnchor": "inguinal"
    },
    {
      "slug": "random-scripts",
      "complaint": "colon cancer study",
      "presentation": "{patientName}, the colorectal journal-club lead, reviews a new monoclonal antibody after resection of localized colon cancer. Investigators allocated participants to study arms and followed recurrence for two years. The representative requests equal speaking time for both products, then volunteers to speak for both. The report gives allocation details; the team is reviewing how the study was organized.",
      "stem": "Which study design matches how the investigators selected participants, handled the study intervention and measured the clinical outcome described in the exhibit?",
      "correct": {
        "id": "correct_random-scripts",
        "label": "Randomized experiment",
        "rationale": "Investigators randomly allocate antibody or control before measuring recurrence. That investigator-created assignment is the defining experimental action in this project."
      },
      "distractors": [
        {
          "id": "d1_random-scripts",
          "label": "Prospective cohort study",
          "rationale": "A cohort would observe existing exposure groups. Here investigators create the groups through random assignment rather than recording treatment already received."
        },
        {
          "id": "d2_random-scripts",
          "label": "Case-control study",
          "rationale": "Case-control selection would start with recurrence status and review exposure. This project assigns study arms before measuring that outcome."
        },
        {
          "id": "d3_random-scripts",
          "label": "Cross-sectional study",
          "rationale": "A cross-sectional survey would measure exposure and outcome together without allocation. Here investigators assign study arms and subsequently measure recurrence."
        }
      ],
      "teachingPoint": "Random assignment is an action by investigators, not a description of who happened to attend. Here they allocated antibody or control randomly before measuring recurrence, making this a randomized experiment. Remember to look for assignment. A cohort observes existing exposures; case-control and cross-sectional designs organize selection and measurement differently.",
      "explanation": "The investigators randomly allocated antibody or control before measuring recurrence. That assignment makes this a randomized experiment rather than observation of treatment groups that already existed.",
      "exhibit": {
        "kind": "abstract",
        "title": "Colon-cancer recurrence — illustrative study design",
        "body": "Investigators randomly allocate people after localized colon-cancer resection to a new monoclonal antibody or control, then follow recurrence for two years. This unnamed investigational monoclonal antibody protocol is invented for practice, not an actual study or efficacy estimate."
      },
      "clinicalAnchor": "colon"
    },
    {
      "slug": "case-control",
      "complaint": "peptic ulcer bleeding study",
      "presentation": "{patientName}, the endoscopy research lead, reviews a new hemostasis device for peptic ulcer bleeding. Investigators selected patients who rebled and comparison patients who did not, then checked earlier device exposure. They did not assign treatment. The study concerns rebleeding after the initial procedure, and the report describes the sampling and sequence of measurements for the discussion.",
      "stem": "Which study design matches how the investigators selected participants, handled the study intervention and measured the clinical outcome described in the exhibit?",
      "correct": {
        "id": "correct_case-control",
        "label": "Case-control study",
        "rationale": "Selection begins with people who rebled and controls who did not; investigators then examine earlier device use. That outcome-first sampling is case-control."
      },
      "distractors": [
        {
          "id": "d1_case-control",
          "label": "Prospective cohort study",
          "rationale": "A cohort comparison would begin with exposure groups. Reviewing earlier records does not make these outcome-selected groups into a cohort."
        },
        {
          "id": "d2_case-control",
          "label": "Randomized experiment",
          "rationale": "The investigators assign no intervention. Selecting rebleeding cases and controls is observational, rather than allocation of a randomized treatment."
        },
        {
          "id": "d3_case-control",
          "label": "Cross-sectional study",
          "rationale": "A cross-sectional study would sample without selecting on rebleeding status and measure current variables together. This design selects cases and controls by outcome."
        }
      ],
      "teachingPoint": "Ask what determined entry into the comparison. Selecting people who rebled and controls who did not, then reviewing earlier device exposure, gives a case-control study. Old records alone do not define that design; outcome-based selection does. Remember the entry rule: a cohort would begin by organizing people according to exposure.",
      "explanation": "Selection began with rebleeding status and then examined earlier device exposure. That outcome-first sampling defines a case-control design, rather than a cohort simply because records were reviewed.",
      "exhibit": {
        "kind": "abstract",
        "title": "Ulcer rebleeding — illustrative study design",
        "body": "Investigators select people with rebleeding after endoscopic treatment of peptic ulcer bleeding and controls without rebleeding, then review previous study-device exposure. Investigators assign nothing. This unnamed investigational endoscopic hemostasis device protocol is invented for practice, not an actual study or efficacy estimate."
      },
      "clinicalAnchor": "ulcer-bleeding"
    },
    {
      "slug": "cross-sectional",
      "complaint": "reflux disease study",
      "presentation": "{patientName}, the foregut journal-club lead, reviews a new wearable test for reflux disease. A survey records device use and current reflux symptoms at one visit, without allocating treatment or following participants afterward. The author calls the questionnaire streamlined; its optional feedback section first requires an explanation of why the feedback is optional. Recruitment details accompany the report.",
      "stem": "Which study design matches how the investigators selected participants, handled the study intervention and measured the clinical outcome described in the exhibit?",
      "correct": {
        "id": "correct_cross-sectional",
        "label": "Cross-sectional study",
        "rationale": "Current device use and reflux symptoms are recorded together, without outcome-based recruitment or follow-up. Those features define this cross-sectional snapshot."
      },
      "distractors": [
        {
          "id": "d1_cross-sectional",
          "label": "Case-control study",
          "rationale": "Case-control recruitment would depend on outcome status. The exhibit explicitly says recruitment does not depend on the current symptom findings."
        },
        {
          "id": "d2_cross-sectional",
          "label": "Prospective cohort study",
          "rationale": "A prospective cohort would organize exposure groups and observe later outcomes. This survey has no follow-up after the same-visit measurements."
        },
        {
          "id": "d3_cross-sectional",
          "label": "Randomized experiment",
          "rationale": "A randomized experiment requires investigator assignment. This survey records device use and symptoms without assigning a device or study arm."
        }
      ],
      "teachingPoint": "A cross-sectional study records exposure and outcome at one time, giving a snapshot. Here device use and current symptoms are measured together, without outcome-based recruitment, assignment or follow-up. Remember what the study actually observed. A report title cannot create a time sequence or treatment allocation that the design never supplied.",
      "explanation": "This is a cross-sectional survey: device use and current reflux symptoms were recorded together, without outcome-based recruitment, subsequent follow-up or investigator-assigned intervention.",
      "exhibit": {
        "kind": "abstract",
        "title": "Reflux findings — illustrative study design",
        "body": "A survey records use of a new wearable reflux test and current reflux symptoms at the same visit. Recruitment is not based on symptom status; there is no follow-up or allocation. This unnamed investigational wearable reflux test protocol is invented for practice, not an actual study or efficacy estimate."
      },
      "clinicalAnchor": "gerd"
    }
  ],
  "bias-confounding": [
    {
      "slug": "baseline-shift",
      "complaint": "incisional hernia study",
      "presentation": "{patientName}, the abdominal-wall research lead, reviews a new reinforcement material for incisional hernia repair. The observational study compares recurrence within two years. The sponsor wants a clean comparison, meaning a report without complicated caveats. The exhibit describes a study site related to both material use and recurrence; the unadjusted report does not account for that site.",
      "stem": "Which problem most directly threatens the unadjusted intervention-outcome comparison when study site relates to both?",
      "correct": {
        "id": "correct_baseline-shift",
        "label": "Confounding by study site",
        "rationale": "Site relates to both intervention use and the outcome, and the comparison ignores it. Their mixed association is the stated confounding concern."
      },
      "distractors": [
        {
          "id": "d1_baseline-shift",
          "label": "Selection bias from enrollment",
          "rationale": "The exhibit describes an ignored third factor in the comparison, not differential entry into the sample. That is the confounding rather than selection mechanism supplied."
        },
        {
          "id": "d2_baseline-shift",
          "label": "Measurement bias from recall",
          "rationale": "No unequal recall or outcome-recording method is described. The stated problem is the ignored relationship of site with both exposure and outcome."
        },
        {
          "id": "d3_baseline-shift",
          "label": "Random error from sample size",
          "rationale": "More observations do not automatically remove the systematic mixing with site. Sample-size variation is not the primary mechanism described."
        }
      ],
      "teachingPoint": "Confounding occurs when an exposure comparison is mixed with another associated factor. Here site relates to both intervention use and the outcome, so the unadjusted association may combine those relationships. Remember the third-factor question: what else differs with exposure and outcome? More observations do not automatically remove that systematic problem.",
      "explanation": "Study site is a confounder in this exercise because it relates to both intervention use and the outcome and is ignored in the comparison.",
      "exhibit": {
        "kind": "abstract",
        "title": "Clinical study — illustrative bias review",
        "body": "An unnamed investigational hernia reinforcement material study: Study site predicts both material use and two-year hernia recurrence. The unadjusted comparison ignores site; that relationship is stipulated for this exercise, not a clinical risk-factor claim. These study conditions are invented for practice, not real intervention results."
      },
      "clinicalAnchor": "incisional"
    },
    {
      "slug": "night-excluded",
      "complaint": "thyroglossal duct cyst study",
      "presentation": "{patientName}, the neck-surgery journal-club lead, reviews a new dissection technique for symptomatic thyroglossal duct cysts. Investigators record surgical-site infection within thirty days. The author says every patient's voice matters; recruitment stopped whenever the coordinator went home. The report presents its conclusion as applying to all eligible patients, although enrollment covered daytime operations and excluded nighttime operations.",
      "stem": "Which bias most directly limits the claim about all eligible surgical patients when recruitment covers daytime operations only?",
      "correct": {
        "id": "correct_night-excluded",
        "label": "Selection bias from daytime-only recruitment",
        "rationale": "Daytime encounters alone are used to make an all-patients claim. The missing nighttime surgical patients create the stated selection concern even with a large daytime sample."
      },
      "distractors": [
        {
          "id": "d1_night-excluded",
          "label": "Confounding by an unmeasured patient characteristic",
          "rationale": "The supplied mechanism is who entered the audit. No patient factor relating both exposure and outcome is identified as the primary concern."
        },
        {
          "id": "d2_night-excluded",
          "label": "Measurement bias from unequal recall windows",
          "rationale": "The exhibit does not describe unequal recall. It describes exclusion of nighttime surgical patients from an all-patients conclusion."
        },
        {
          "id": "d3_night-excluded",
          "label": "Random error from insufficient sample precision",
          "rationale": "A large daytime sample can still exclude the target population of nighttime surgical patients. Greater sampling precision does not repair that selection problem."
        }
      ],
      "teachingPoint": "Selection bias concerns which observations enter the study. A large daytime-only sample still leaves nighttime surgical patients outside an audit presented as applying to all eligible surgical patients. Sample size cannot repair that missing coverage. Distinguish this selection problem from confounding within the comparison or inconsistent measurement after people have entered it.",
      "explanation": "Daytime-only sampling creates the stated selection concern. Adding more daytime surgical patients does not supply the missing nighttime surgical observations needed for the all-patients conclusion.",
      "exhibit": {
        "kind": "abstract",
        "title": "Clinical study — illustrative bias review",
        "body": "An unnamed investigational thyroglossal-cyst dissection technique study: Investigators enroll daytime operations and no nighttime operations, yet present their thirty-day SSI conclusion as applying to all eligible surgical patients. These study conditions are invented for practice, not real intervention results."
      },
      "clinicalAnchor": "thyroglossal"
    },
    {
      "slug": "recall-timing",
      "complaint": "postoperative DVT study",
      "presentation": "{patientName}, the perioperative research lead, reviews a new calf-stimulation device and postoperative DVT. One group reported thrombotic events when they occurred; another recalled events six months later. A colleague points out that everyone used the same form. The investigators are reviewing the collection process, and the report specifies how the two reporting schedules differed during follow-up.",
      "stem": "Which information problem most directly threatens the outcome comparison when one group reports immediately and the other recalls events six months later?",
      "correct": {
        "id": "correct_recall-timing",
        "label": "Measurement bias from unequal recall",
        "rationale": "Immediate recording in one group and recall six months later in the other use unequal measurement processes. That can systematically distort the recorded contrast."
      },
      "distractors": [
        {
          "id": "d1_recall-timing",
          "label": "Selection bias from study enrollment",
          "rationale": "The difference concerns how outcomes were recorded after entry, rather than how people were selected for the study."
        },
        {
          "id": "d2_recall-timing",
          "label": "Confounding by baseline study site",
          "rationale": "No baseline site factor is supplied as relating exposure and the outcome. The stated concern is the unequal reporting schedule."
        },
        {
          "id": "d3_recall-timing",
          "label": "Random error from natural variation",
          "rationale": "The groups are measured by different recall processes. That systematic difference is not simply random variation that a larger sample necessarily removes."
        }
      ],
      "teachingPoint": "Measurement bias can arise when groups' outcomes are recorded differently. Immediate reports and recall six months later use unequal measurement processes, so a difference in reports may reflect how the outcomes were remembered. This is distinct from who was recruited or which baseline factor confounds the comparison. Larger samples do not equalize the reporting methods.",
      "explanation": "The primary concern is measurement bias from unequal recall schedules. The groups' recorded outcomes may differ because one reports immediately and the other recalls much later.",
      "exhibit": {
        "kind": "abstract",
        "title": "Clinical study — illustrative bias review",
        "body": "An unnamed investigational calf-stimulation device study: One group reports postoperative DVT events immediately; the other recalls those events six months later. The reporting schedules differ; no real device effect is supplied. These study conditions are invented for practice, not real intervention results."
      },
      "clinicalAnchor": "dvt"
    },
    {
      "slug": "adjusted-model",
      "complaint": "malignant-hyperthermia susceptibility study",
      "presentation": "{patientName}, the anesthesia journal-club lead, reviews a new monitoring sensor for malignant-hyperthermia susceptibility. An observational model compares recognition of concerning intraoperative changes. Investigators adjusted for recorded differences between groups. Follow-up access relates to both sensor choice and recorded recognition, but important access differences were not measured. The report describes those stipulated relationships and the model under review.",
      "stem": "Which limitation remains after adjustment when an important factor related to both sensor choice and recorded outcomes was not measured?",
      "correct": {
        "id": "correct_adjusted-model",
        "label": "Residual confounding by unmeasured factors",
        "rationale": "Unrecorded follow-up access differences relate to intervention choice and the outcome. Adjustment for other factors leaves that potential confounding unresolved."
      },
      "distractors": [
        {
          "id": "d1_adjusted-model",
          "label": "Random error from the sampling process",
          "rationale": "The exhibit identifies an unrecorded associated factor, not just sampling variability. Greater precision would not supply the missing follow-up access information."
        },
        {
          "id": "d2_adjusted-model",
          "label": "Selection bias from study enrollment",
          "rationale": "No enrollment mechanism is described as the primary concern. The known limitation is confounding by follow-up access differences absent from the model."
        },
        {
          "id": "d3_adjusted-model",
          "label": "Measurement bias from inconsistent outcome recording",
          "rationale": "No inconsistent outcome-recording process is supplied. The gap is a relevant factor the model could not adjust for because it was not recorded."
        }
      ],
      "teachingPoint": "Adjustment can address recorded factors without accounting for unrecorded ones. Follow-up access still relates to both intervention choice and the outcome, so residual confounding remains possible despite adjustment for site and procedure category. Remember that an adjusted label is not a guarantee of an unconfounded result; ask which relevant differences the model could actually use.",
      "explanation": "Residual confounding remains because relevant follow-up access differences were not measured. Adjusting for site and procedure category does not automatically account for that unrecorded factor.",
      "exhibit": {
        "kind": "abstract",
        "title": "Clinical study — illustrative bias review",
        "body": "An unnamed investigational anesthesia monitoring sensor study: The model adjusts for measured site and procedure category. Follow-up access relates to both sensor choice and recorded recognition of concerning intraoperative changes, but important access differences were not recorded. These relationships are stipulated, not general clinical risk-factor claims. These study conditions are invented for practice, not real intervention results."
      },
      "clinicalAnchor": "mh"
    }
  ],
  "sensitivity-specificity": [
    {
      "slug": "sensitivity-90",
      "complaint": "Blood-test question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has an accessible suspicious solid breast mass on completed diagnostic imaging. Core biopsy is arranged. A recruiter offers a study of a new screening blood test. His slides call the evidence transparent, but he keeps skipping the results table. The patient asks how often the test identified disease in the separate validation cohort.",
      "stem": "What is the new investigational breast-cancer blood test's sensitivity in the separate constructed validation cohort shown in the exhibit?",
      "correct": {
        "id": "correct_sensitivity-90",
        "label": "90%",
        "rationale": "Of the 100 people with the condition, 90 screen positive: 90/(90 + 10) = 90%. This is the condition-present denominator sensitivity requires."
      },
      "distractors": [
        {
          "id": "d1_sensitivity-90",
          "label": "10%",
          "rationale": "Ten of 100 people with the condition screen negative. That is the false-negative fraction, not the positive fraction requested for sensitivity."
        },
        {
          "id": "d2_sensitivity-90",
          "label": "75%",
          "rationale": "The calculation 90/(90 + 30) = 75% starts with all positive screens. That gives positive predictive value rather than sensitivity."
        },
        {
          "id": "d3_sensitivity-90",
          "label": "70%",
          "rationale": "The calculation 70/(30 + 70) = 70% starts with people without the condition. It gives specificity, not sensitivity."
        }
      ],
      "teachingPoint": "Sensitivity starts with people who have the condition by the reference assessment: how many tested positive? Here 90 of 100 did, giving 90%. Remember: sensitivity begins with condition present, not with a positive or negative screen. These practice counts explain the measure; they do not calculate this patient's probability after a negative result.",
      "explanation": "Use the condition-present row: 90/(90 + 10) = 90% sensitivity. The positive-result column answers a different question, and this practice table is not a personal risk estimate.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational breast-cancer blood test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
        "columnHeaders": [
          "New blood test positive",
          "New blood test negative"
        ],
        "rowHeaders": [
          "Breast cancer present by reference",
          "Breast cancer absent by reference"
        ],
        "cells": [
          [
            "90",
            "10"
          ],
          [
            "30",
            "70"
          ]
        ]
      },
      "ageYears": [
        58,
        29
      ],
      "sexLabels": [
        "Female",
        "Male"
      ],
      "clinicalAnchor": "breast"
    },
    {
      "slug": "specificity-95",
      "complaint": "Breath-test question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has an uncomplicated duodenal ulcer being evaluated for H. pylori. An optional study offers a new breath test. The patient asks, 'What happened to people who did not have the infection?' Its separate validation table compares the investigational result with a reference assessment. The planned clinical evaluation has not been replaced by enrollment.",
      "stem": "What is the new investigational breast-cancer blood test's specificity in the separate constructed validation cohort shown in the exhibit?",
      "correct": {
        "id": "correct_specificity-95",
        "label": "95%",
        "rationale": "Of the 100 people without the condition, 95 screen negative: 95/(5 + 95) = 95%. This is specificity."
      },
      "distractors": [
        {
          "id": "d1_specificity-95",
          "label": "5%",
          "rationale": "Five of the 100 people without the condition screen positive. That gives the false-positive fraction, the opposite screen result from the one used for specificity."
        },
        {
          "id": "d2_specificity-95",
          "label": "80%",
          "rationale": "The calculation 80/(80 + 20) = 80% uses the condition-present row and gives sensitivity. Specificity starts with condition absent."
        },
        {
          "id": "d3_specificity-95",
          "label": "94%",
          "rationale": "The calculation 80/(80 + 5) is about 94%. It uses the positive-screen column to give positive predictive value, not specificity."
        }
      ],
      "teachingPoint": "Specificity asks how often the screen is negative among people without the condition. In this table, 95 of 100 condition-absent people test negative, giving 95%. Start with condition absent. Starting with positive screens would instead ask about positive predictive value, which is a different measure and denominator.",
      "explanation": "Specificity is 95/(5 + 95) = 95%, using everyone without the condition as the denominator. It is not the proportion of positive results that are correct.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational H. pylori breath test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
        "columnHeaders": [
          "New breath test positive",
          "New breath test negative"
        ],
        "rowHeaders": [
          "H. pylori infection present by reference",
          "H. pylori infection absent by reference"
        ],
        "cells": [
          [
            "80",
            "20"
          ],
          [
            "5",
            "95"
          ]
        ]
      },
      "ageYears": [
        29,
        67
      ],
      "sexLabels": [
        "Male",
        "Female"
      ],
      "clinicalAnchor": "h-pylori"
    },
    {
      "slug": "sensitivity-80",
      "complaint": "Optical-test question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, is discussing biopsy of a lesion suspicious for cutaneous SCC. A brochure describes a new optical skin test's validation cohort. 'The evidence gets one paragraph; the subscription terms get three pages,' the patient says. The patient asks how often the test identified disease among participants known to have it by reference assessment.",
      "stem": "What is the new investigational breast-cancer blood test's sensitivity in the separate constructed validation cohort shown in the exhibit?",
      "correct": {
        "id": "correct_sensitivity-80",
        "label": "80%",
        "rationale": "The condition-present row contains 20 positive and five negative screens. Its positive share is 20/25 = 80%, the sensitivity."
      },
      "distractors": [
        {
          "id": "d1_sensitivity-80",
          "label": "67%",
          "rationale": "The calculation 20/(20 + 10) is about 67% and starts with positive screens. That calculates positive predictive value, not sensitivity."
        },
        {
          "id": "d2_sensitivity-80",
          "label": "20%",
          "rationale": "The calculation 5/(20 + 5) = 20% counts negative screens among people with the condition. That is the false-negative fraction."
        },
        {
          "id": "d3_sensitivity-80",
          "label": "60%",
          "rationale": "The calculation 15/(10 + 15) = 60% uses people without the condition. That calculates specificity rather than sensitivity."
        }
      ],
      "teachingPoint": "Choose the condition-present denominator before calculating sensitivity. This row contains 20 positive screens and five negative screens, so 20/25 = 80%. The remaining five show why sensitivity and the false-negative fraction differ. Counting all positive screens would answer a predictive-value question instead of the condition-based question asked here.",
      "explanation": "There are 25 people with the condition, and 20 screen positive: sensitivity is 80%. The five missed cases belong in that same denominator.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational cutaneous-SCC optical test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
        "columnHeaders": [
          "New optical test positive",
          "New optical test negative"
        ],
        "rowHeaders": [
          "Cutaneous SCC present by reference",
          "Cutaneous SCC absent by reference"
        ],
        "cells": [
          [
            "20",
            "5"
          ],
          [
            "10",
            "15"
          ]
        ]
      },
      "ageYears": [
        72,
        36
      ],
      "sexLabels": [
        "Female",
        "Male"
      ],
      "clinicalAnchor": "cutaneous-scc"
    },
    {
      "slug": "specificity-70",
      "complaint": "Blood-test question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has suspected post-transplant lymphoproliferative disorder and is discussing tissue diagnosis. A recruiter presents a new blood test's separate validation table. The patient asks what negative results mean among participants without the disorder. Reference findings and investigational results appear separately, and the patient wants help interpreting the study before deciding about optional enrollment.",
      "stem": "What is the new investigational breast-cancer blood test's specificity in the separate constructed validation cohort shown in the exhibit?",
      "correct": {
        "id": "correct_specificity-70",
        "label": "70%",
        "rationale": "The condition-absent row has 70 negative screens out of 100 people: 70/(30 + 70) = 70%, the specificity."
      },
      "distractors": [
        {
          "id": "d1_specificity-70",
          "label": "30%",
          "rationale": "Thirty of 100 people without the condition screen positive. That is the false-positive fraction rather than specificity."
        },
        {
          "id": "d2_specificity-70",
          "label": "80%",
          "rationale": "The calculation 16/(16 + 4) = 80% uses people with the condition. That is sensitivity, not specificity."
        },
        {
          "id": "d3_specificity-70",
          "label": "35%",
          "rationale": "The calculation 16/(16 + 30) is about 35%. It uses all positive screens to calculate positive predictive value, not specificity."
        }
      ],
      "teachingPoint": "Specificity uses everyone classified as condition absent, whether their test was positive or negative. Here 70 of those 100 people test negative, so specificity is 70%. Remember the starting group: condition absent. Starting with the positive-result column would instead ask a predictive-value question, regardless of which result interests a particular patient.",
      "explanation": "Use the condition-absent row: 70/(30 + 70) = 70% specificity. A particular patient’s result does not change the denominator defining this test measure.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational PTLD blood test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
        "columnHeaders": [
          "New blood test positive",
          "New blood test negative"
        ],
        "rowHeaders": [
          "PTLD present by reference",
          "PTLD absent by reference"
        ],
        "cells": [
          [
            "16",
            "4"
          ],
          [
            "30",
            "70"
          ]
        ]
      },
      "ageYears": [
        42,
        54
      ],
      "sexLabels": [
        "Male",
        "Female"
      ],
      "clinicalAnchor": "ptld"
    }
  ],
  "predictive-value-prevalence": [
    {
      "slug": "higher-prevalence",
      "complaint": "Positive-test question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, is discussing diagnostic excision of a small pigmented lesion concerning for melanoma. A new optical-test brochure compares two hypothetical populations. Its presenter calls the brochure personalized, then offers two identical covers to choose from. The patient asks why a positive result would have different meanings in the populations before considering optional study enrollment.",
      "stem": "How does the new investigational breast-cancer blood test's positive predictive value change between the hypothetical populations when sensitivity and specificity remain fixed as stated?",
      "correct": {
        "id": "correct_higher-prevalence",
        "label": "Positive predictive value increases",
        "rationale": "With sensitivity and specificity fixed, the higher-prevalence population has a greater true-positive share among positive screens. This supports an increase, without an exact percentage."
      },
      "distractors": [
        {
          "id": "d1_higher-prevalence",
          "label": "Positive predictive value decreases",
          "rationale": "This reverses the direction: higher prevalence increases the true-positive share among positives under the fixed-test assumptions."
        },
        {
          "id": "d2_higher-prevalence",
          "label": "Positive predictive value stays fixed",
          "rationale": "Fixed sensitivity and specificity do not fix positive predictive value. Prevalence also determines the mix of true and false positives."
        },
        {
          "id": "d3_higher-prevalence",
          "label": "Positive predictive value is indeterminate",
          "rationale": "An exact percentage would need more numbers, but the direction follows from higher prevalence with fixed test characteristics. That direction is not indeterminate."
        }
      ],
      "teachingPoint": "Positive predictive value asks what share of positive results come from people with the condition. With sensitivity and specificity held fixed, higher prevalence makes true positives a larger share of positives, so predictive value rises. Remember that the test and the tested population both matter; this comparison gives direction, not a personal percentage.",
      "explanation": "Positive predictive value increases under the stated fixed-test assumptions because prevalence is higher. The exhibit supports the direction of change without supplying an exact personal probability.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational melanoma optical test: invented testing-population assumptions for practice. These comparisons supply no real test performance or personal disease probability.",
        "items": [
          {
            "label": "Sensitivity",
            "value": "Same in the two hypothetical populations"
          },
          {
            "label": "Specificity",
            "value": "Same in the two hypothetical populations"
          },
          {
            "label": "Prevalence",
            "value": "Higher in population B than in population A"
          }
        ]
      },
      "ageYears": [
        29,
        58
      ],
      "sexLabels": [
        "Female",
        "Male"
      ],
      "clinicalAnchor": "pigmented-lesion"
    },
    {
      "slug": "lower-prevalence",
      "complaint": "Positive-test question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has resectable pancreatic tail cancer and is discussing operative planning. A recruiter describes a new screening blood test using hypothetical testing populations. Its brochure advertises 'Precision You Can Hug.' The patient asks whether a positive result means the same thing when fewer people being tested have cancer. The study supplies no prognosis or treatment recommendation.",
      "stem": "How does the new investigational breast-cancer blood test's positive predictive value change between the hypothetical populations when sensitivity and specificity remain fixed as stated?",
      "correct": {
        "id": "correct_lower-prevalence",
        "label": "Positive predictive value decreases",
        "rationale": "With sensitivity and specificity fixed, lower prevalence means false positives form a larger share of positive screens. Positive predictive value therefore decreases."
      },
      "distractors": [
        {
          "id": "d1_lower-prevalence",
          "label": "Positive predictive value increases",
          "rationale": "This reverses the stated comparison. Lower prevalence decreases the true-positive share among positive screens under these fixed-test assumptions."
        },
        {
          "id": "d2_lower-prevalence",
          "label": "Positive predictive value stays fixed",
          "rationale": "Two populations can have the same test characteristics but different predictive values because prevalence differs."
        },
        {
          "id": "d3_lower-prevalence",
          "label": "Positive predictive value is indeterminate",
          "rationale": "The exhibit lacks an exact percentage, but still establishes a decrease under the lower-prevalence, fixed-test assumptions."
        }
      ],
      "teachingPoint": "A test's positive predictive value depends on the population as well as its sensitivity and specificity. With those test characteristics fixed, lower prevalence makes false positives a larger share of positive screens, so predictive value falls. A fixed test is not a fixed predictive value; the exhibit establishes direction without an exact percentage.",
      "explanation": "Positive predictive value decreases in the lower-prevalence setting under the stated assumptions. Unchanged sensitivity and specificity do not make predictive value constant.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational pancreatic-cancer blood test: invented testing-population assumptions for practice. These comparisons supply no real test performance or personal disease probability.",
        "items": [
          {
            "label": "Sensitivity",
            "value": "Same in the two hypothetical populations"
          },
          {
            "label": "Specificity",
            "value": "Same in the two hypothetical populations"
          },
          {
            "label": "Prevalence",
            "value": "Lower in population B than in population A"
          }
        ]
      },
      "ageYears": [
        67,
        42
      ],
      "sexLabels": [
        "Male",
        "Female"
      ],
      "clinicalAnchor": "pancreatic-cancer"
    },
    {
      "slug": "ppv-table",
      "complaint": "Positive-test question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has a suspicious thyroid nodule meeting biopsy criteria, with needle sampling planned. An study offers a new screening blood test and a separate validation table. The patient asks, 'Among the people with a positive result, how many actually had cancer?' Study enrollment remains undecided, and the table describes a constructed cohort rather than today's biopsy.",
      "stem": "Among positive results in the separate constructed validation cohort, what is the new investigational breast-cancer blood test's positive predictive value?",
      "correct": {
        "id": "correct_ppv-table",
        "label": "80%",
        "rationale": "Start with all positive screens: 40 + 10 = 50. Forty had the condition, so positive predictive value is 40/50 = 80%."
      },
      "distractors": [
        {
          "id": "d1_ppv-table",
          "label": "75%",
          "rationale": "The calculation 30/(10 + 30) = 75% uses the condition-absent row. It answers a specificity question, not the positive-screen question asked."
        },
        {
          "id": "d2_ppv-table",
          "label": "20%",
          "rationale": "The calculation 10/(40 + 10) = 20% is the false-positive share among positives. The requested predictive value counts true positives instead."
        },
        {
          "id": "d3_ppv-table",
          "label": "67%",
          "rationale": "The calculation 40/(40 + 20) is about 67%. It begins with people who have the condition and therefore calculates sensitivity."
        }
      ],
      "teachingPoint": "Positive predictive value asks, of all positive results, how many were true positives? Its denominator includes true and false positives. Here 40 of 50 positives had the condition, giving 80%. Sensitivity instead starts with people known to have the condition. Remember which group the question starts with before choosing a row or column.",
      "explanation": "Read the positive-screen column: 40 true positives and 10 false positives. Positive predictive value is 40/50 = 80% for these practice data.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational thyroid-cancer blood test: invented practice counts from a separate validation cohort. Cells count people; reference classification is treated as correct. Not real test performance or a personal disease probability.",
        "columnHeaders": [
          "New blood test positive",
          "New blood test negative"
        ],
        "rowHeaders": [
          "Thyroid cancer present by reference",
          "Thyroid cancer absent by reference"
        ],
        "cells": [
          [
            "40",
            "20"
          ],
          [
            "10",
            "30"
          ]
        ]
      },
      "ageYears": [
        36,
        72
      ],
      "sexLabels": [
        "Female",
        "Male"
      ],
      "clinicalAnchor": "thyroid-nodule"
    },
    {
      "slug": "characteristics-fixed",
      "complaint": "Positive-test question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, is being evaluated for primary aldosteronism and asks about a new urinary assay. Its report compares two hypothetical testing populations. The representative promises one simple answer, then offers three subscription levels for accessing it. The patient notices different positive-result predictions despite identical sensitivity and specificity and asks what could explain that difference.",
      "stem": "Which difference can explain the new investigational breast-cancer blood test's different positive predictive values when testing definitions, sensitivity and specificity remain the same?",
      "correct": {
        "id": "correct_characteristics-fixed",
        "label": "Different prevalence in the tested populations",
        "rationale": "Prevalence can change the true-positive share among positive results even with identical testing processes, sensitivity, and specificity. It is a possible explanation, not an exact value."
      },
      "distractors": [
        {
          "id": "d1_characteristics-fixed",
          "label": "Different sensitivity in the tested populations",
          "rationale": "The exhibit explicitly keeps sensitivity the same. A sensitivity difference cannot explain this exercise without contradicting that condition."
        },
        {
          "id": "d2_characteristics-fixed",
          "label": "Different specificity in the tested populations",
          "rationale": "The exhibit explicitly keeps specificity the same. This proposed explanation changes an assumption that was held fixed."
        },
        {
          "id": "d3_characteristics-fixed",
          "label": "Different definitions of a positive test result",
          "rationale": "The exhibit keeps the testing process and definition of positive the same. Reclassifying results contradicts that supplied comparison."
        }
      ],
      "teachingPoint": "Sensitivity and specificity describe results within condition-status groups; positive predictive value starts with positive results. Changing prevalence can change the mix of true and false positives even when those test characteristics stay fixed. Here prevalence is a possible explanation. The information does not supply its exact value or prove a personal diagnosis.",
      "explanation": "Different prevalence can produce different positive predictive values despite identical test characteristics. The exhibit explicitly holds sensitivity, specificity, and result definitions constant.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational primary-aldosteronism urinary assay: invented testing-population assumptions for practice. These comparisons supply no real test performance or personal disease probability.",
        "items": [
          {
            "label": "Testing process and result definitions",
            "value": "Same at both hypothetical populations"
          },
          {
            "label": "Sensitivity and specificity",
            "value": "Same at both hypothetical populations"
          },
          {
            "label": "Positive predictive value",
            "value": "Different at the two hypothetical populations"
          }
        ]
      },
      "ageYears": [
        54,
        25
      ],
      "sexLabels": [
        "Male",
        "Female"
      ],
      "clinicalAnchor": "aldosteronism"
    }
  ],
  "risk-ratio-odds-ratio": [
    {
      "slug": "cohort-risk",
      "complaint": "acute cholecystitis study",
      "presentation": "{patientName}, the biliary journal-club lead, reviews a new dissection instrument for acute cholecystitis operations. The observational study reports surgical-site infection within thirty days. Its sponsor requests a balanced account: equal space for the data and the company's response to the data. The report supplies risks in exposed and unexposed groups, and the team is reviewing the comparison.",
      "stem": "What risk ratio compares exposed with unexposed participants for the clinical outcome in the constructed cohort?",
      "correct": {
        "id": "correct_cohort-risk",
        "label": "Risk ratio of 2.0",
        "rationale": "Divide exposed risk by unexposed risk: 0.20/0.10 = 2.0. The inputs are probabilities, so the result is a risk ratio."
      },
      "distractors": [
        {
          "id": "d1_cohort-risk",
          "label": "Odds ratio of 2.0",
          "rationale": "The quotient 0.20/0.10 compares risks, not odds. Calling that number an odds ratio changes the scale without doing an odds calculation."
        },
        {
          "id": "d2_cohort-risk",
          "label": "Risk ratio of 0.5",
          "rationale": "The value 0.5 comes from 0.10/0.20, reversing the requested exposed-versus-unexposed direction."
        },
        {
          "id": "d3_cohort-risk",
          "label": "Odds ratio of 0.5",
          "rationale": "This both reverses the comparison and assigns an odds label to a calculation of probabilities. Neither change preserves the requested estimate."
        }
      ],
      "teachingPoint": "Risk is a probability; a risk ratio divides one group's probability by the comparator's. Here 20%/10% = 2.0 for exposed versus unexposed over 30 days. An odds ratio compares odds instead. Remember both the scale and direction: reversing the groups gives a reciprocal, while changing the label changes the claimed measure.",
      "explanation": "Dividing the exposed risk by the unexposed risk gives 0.20/0.10 = 2.0, a risk ratio. That calculation does not become an odds ratio by relabeling it.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational gallbladder dissection instrument study: invented thirty-day SSI estimates for practice. These describe the constructed study, not real efficacy or personal risk.",
        "items": [
          {
            "label": "Exposed group risk",
            "value": "20%"
          },
          {
            "label": "Unexposed group risk",
            "value": "10%"
          }
        ]
      },
      "clinicalAnchor": "cholecystitis"
    },
    {
      "slug": "case-control-or",
      "complaint": "gastric adenocarcinoma study",
      "presentation": "{patientName}, the upper-GI research lead, reviews a new anastomosis technique used during resection of gastric adenocarcinoma. Investigators selected people with a postoperative leak and controls without a leak, then reviewed previous technique exposure. The table gives exposure counts for those selected groups. The report does not supply leak risks in the entire surgical population under study.",
      "stem": "Which association measure can be calculated directly from the case-control exposure table for postoperative leak?",
      "correct": {
        "id": "correct_case-control-or",
        "label": "Exposure odds ratio of 1.8",
        "rationale": "Compare exposure odds in cases and controls: (18/12)/(10/12) = 1.8. This gives an exposure odds ratio for the supplied outcome-selected sample."
      },
      "distractors": [
        {
          "id": "d1_case-control-or",
          "label": "Exposure risk ratio of 1.8",
          "rationale": "The sampling plan selects cases and controls by outcome. Their totals do not provide the population risks needed to justify a risk-ratio label."
        },
        {
          "id": "d2_case-control-or",
          "label": "Exposure odds ratio of 0.56",
          "rationale": "About 0.56 is the reciprocal of 1.8. It describes controls versus cases, reversing the requested exposure-odds comparison."
        },
        {
          "id": "d3_case-control-or",
          "label": "Exposure risk ratio of 0.56",
          "rationale": "This reverses the direction and uses a risk scale unsupported by the outcome-selected sampling totals."
        }
      ],
      "teachingPoint": "In this outcome-selected table, compare exposure odds in cases with exposure odds in controls: (18/12)/(10/12) = 1.8. That is an exposure odds ratio. The sampled case and control totals do not supply population event risks. Remember what the design selected before deciding whether a risk-ratio label is justified.",
      "explanation": "The exposure odds ratio is (18/12)/(10/12) = 1.8 for cases versus controls. Population risks are not supplied, so a risk-ratio label is unsupported.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational gastric anastomosis technique study: invented practice counts of people selected by thirty-day leak status. Cells count prior technique exposure; population leak risks are not supplied.",
        "columnHeaders": [
          "Exposed",
          "Unexposed"
        ],
        "rowHeaders": [
          "Cases",
          "Controls"
        ],
        "cells": [
          [
            "18",
            "12"
          ],
          [
            "10",
            "12"
          ]
        ]
      },
      "clinicalAnchor": "gastric-cancer"
    },
    {
      "slug": "adjusted-odds",
      "complaint": "Merkel cell carcinoma study",
      "presentation": "{patientName}, the skin-oncology discussion lead, reviews a new biologic for Merkel cell carcinoma. An adjusted model reports recurrence odds over two years. The representative offers to simplify the statistics by removing the parts customers ask about. The report supplies an adjusted odds ratio, but no underlying group risks; the team is reviewing the wording of its result.",
      "stem": "How should the adjusted odds ratio of 0.60 for two-year recurrence be described when group risks are unavailable?",
      "correct": {
        "id": "correct_adjusted-odds",
        "label": "Adjusted odds are 0.60 times as high",
        "rationale": "The reported adjusted odds ratio is 0.60. Describing the adjusted odds as 0.60 times the comparison odds keeps the estimate on its reported scale."
      },
      "distractors": [
        {
          "id": "d1_adjusted-odds",
          "label": "Adjusted risk is exactly 0.60 times as high",
          "rationale": "The model reports odds, not an exact ratio of probabilities. Group risks needed for that asserted risk comparison are not supplied."
        },
        {
          "id": "d2_adjusted-odds",
          "label": "Absolute risk falls by 40 percentage points",
          "rationale": "An odds ratio alone does not provide an absolute risk difference. Subtracting it from one cannot create a 40-percentage-point reduction."
        },
        {
          "id": "d3_adjusted-odds",
          "label": "Adjusted event probability is 40% lower",
          "rationale": "An odds ratio of 0.60 cannot automatically be translated into a 40% reduction in event probability. That changes odds into risk without the needed information."
        }
      ],
      "teachingPoint": "Odds and probability are different scales. An adjusted odds ratio of 0.60 says the compared odds are 0.60 times the reference odds, within the reported model. It does not supply the same proportional probability reduction or an absolute risk difference. Keep the measure's name attached to its number when translating a report.",
      "explanation": "The estimate describes adjusted odds at 0.60 times the comparison odds. Without group risks, it cannot provide the asserted exact risk ratio or absolute risk reduction.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational Merkel-cell biologic study: invented two-year recurrence estimates for practice. These describe the constructed study, not real efficacy or personal risk.",
        "items": [
          {
            "label": "Reported measure",
            "value": "Adjusted odds ratio"
          },
          {
            "label": "Estimate",
            "value": "0.60"
          },
          {
            "label": "Underlying group risks",
            "value": "Not supplied"
          }
        ]
      },
      "clinicalAnchor": "merkel"
    },
    {
      "slug": "rare-not-identical",
      "complaint": "marginal ulcer study",
      "presentation": "{patientName}, the bariatric journal-club lead, reviews a new protective agent for marginal ulcer after gastric bypass. The observational report labels its estimate as an exposure odds ratio for rare ulcer recurrence. The editor requests a more exciting conclusion while retaining 'strictly factual.' Underlying group risks are unavailable, and the investigators discuss approximate similarity to a risk ratio.",
      "stem": "Which interpretation preserves the reported measure when an exposure odds ratio for rare ulcer recurrence is discussed as approximately similar to a risk ratio?",
      "correct": {
        "id": "correct_rare-not-identical",
        "label": "Report the estimate as an odds ratio",
        "rationale": "The report actually estimates an odds ratio. Retaining its label preserves the measure despite the stated approximate similarity for this rare outcome."
      },
      "distractors": [
        {
          "id": "d1_rare-not-identical",
          "label": "Report the estimate as a relative risk",
          "rationale": "Approximate similarity does not establish an exact risk ratio. Baseline risks for a direct risk comparison are not supplied."
        },
        {
          "id": "d2_rare-not-identical",
          "label": "Report the estimate as a relative risk reduction",
          "rationale": "A relative risk reduction is a different claim from the reported odds ratio. The supplied information does not justify relabeling the measure that way."
        },
        {
          "id": "d3_rare-not-identical",
          "label": "Report the estimate as an absolute risk difference",
          "rationale": "An absolute risk difference requires probabilities to subtract. The reported odds ratio and missing baseline risks do not supply those values."
        }
      ],
      "teachingPoint": "Approximate similarity is not permission to rename an estimate. The report gives an odds ratio, so retain that label even when discussing a rare outcome. Without the underlying risks, the exhibit does not supply an exact risk ratio or an absolute difference. A useful reporting rule is to preserve the scale you actually estimated.",
      "explanation": "Report the estimate as an odds ratio. The stated approximate similarity does not convert it into an exact risk ratio or supply an absolute risk difference.",
      "exhibit": {
        "kind": "abstract",
        "title": "Ulcer recurrence — illustrative study",
        "body": "An invented study of an unnamed investigational marginal-ulcer protective agent reports an exposure odds ratio for rare one-year ulcer recurrence. Authors discuss approximate similarity to a risk ratio, but underlying group risks are unavailable. These practice conditions supply no real efficacy or clinical risk estimate."
      },
      "clinicalAnchor": "marginal-ulcer"
    }
  ],
  "arr-nnt": [
    {
      "slug": "arr-ten",
      "complaint": "Surgical-study question",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has biopsy-confirmed localized colon cancer and is discussing resection. An optional trial tests a new monoclonal antibody, reporting recurrence over two years. Its brochure announces 'a major improvement' in a typeface larger than the results table. The patient asks what absolute benefit the study showed and how many participants needed treatment for one fewer recurrence.",
      "stem": "For colon-cancer recurrence over two years in the constructed trial, what ARR and NNT describe the new unnamed intervention versus control?",
      "correct": {
        "id": "correct_arr-ten",
        "label": "ARR 10 percentage points; NNT 10 over two years",
        "rationale": "The practice risks are 20/100 and 10/100. Subtracting gives 0.10; 1/0.10 = 10 for the specified outcome over two years."
      },
      "distractors": [
        {
          "id": "d1_arr-ten",
          "label": "ARR 50 percentage points; NNT 2 over two years",
          "rationale": "The outcome risk halves relative to its 20% starting value, but falls by 10 percentage points, not 50. The relative wording does not supply this ARR or NNT."
        },
        {
          "id": "d2_arr-ten",
          "label": "ARR 10 percentage points; NNT 100 over two years",
          "rationale": "The absolute difference is right, but its reciprocal uses the proportion 0.10: 1/0.10 = 10, not 100."
        },
        {
          "id": "d3_arr-ten",
          "label": "ARR 5 percentage points; NNT 20 over two years",
          "rationale": "An NNT of 20 would correspond to an absolute difference of 0.05. These practice risks differ by 0.10 instead."
        }
      ],
      "teachingPoint": "Calculate each group's risk first, then subtract intervention risk from comparator risk. Here 20% minus 10% is 10 percentage points, so NNT is 1/0.10 = 10 over two years. Half the starting risk and a 10-point absolute drop describe the same practice numbers; keep the outcome, comparator, and period attached.",
      "explanation": "The practice risks are 20/100 and 10/100. Their difference is 0.10, giving ARR 10 percentage points and NNT 10 for the specified two-year outcome.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational monoclonal antibody trial: invented practice counts of colon-cancer recurrence within two years. Cells count recurrences and people followed. Follow-up is complete; not real efficacy or personal risk.",
        "columnHeaders": [
          "Recurrence within two years",
          "People followed"
        ],
        "rowHeaders": [
          "Control arm",
          "New unnamed intervention"
        ],
        "cells": [
          [
            "20",
            "100"
          ],
          [
            "10",
            "100"
          ]
        ]
      },
      "ageYears": [
        61,
        34
      ],
      "sexLabels": [
        "Female",
        "Male"
      ],
      "clinicalAnchor": "colon"
    },
    {
      "slug": "arr-five",
      "complaint": "Research-results discussion",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has a resected low-risk cutaneous SCC and asks about an optional new topical-agent trial reporting recurrence over three years. The investigator calls the calculation obvious, then opens a spreadsheet containing twelve hidden tabs. The arms have different totals. The patient wants the absolute benefit and treatment number for the stated follow-up period.",
      "stem": "For cutaneous-SCC recurrence over three years in the constructed trial, what ARR and NNT describe the new unnamed intervention versus control?",
      "correct": {
        "id": "correct_arr-five",
        "label": "ARR 5 percentage points; NNT 20 over three years",
        "rationale": "First divide within each group: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05 and its reciprocal is NNT 20 over three years."
      },
      "distractors": [
        {
          "id": "d1_arr-five",
          "label": "ARR 20 percentage points; NNT 5 over three years",
          "rationale": "Subtracting 30 and 10 events ignores that the groups contain 200 and 100 people. Risks, rather than raw counts, must be subtracted."
        },
        {
          "id": "d2_arr-five",
          "label": "ARR 33 percentage points; NNT 3 over three years",
          "rationale": "About 33% describes the relative reduction from 15% to 10%. The absolute drop is five percentage points, giving NNT 20."
        },
        {
          "id": "d3_arr-five",
          "label": "ARR 10 percentage points; NNT 10 over three years",
          "rationale": "The comparator risk is 30/200 = 15%, not 20%. Using the actual denominator gives a five-point difference rather than ten."
        }
      ],
      "teachingPoint": "Unequal group sizes make raw event-count subtraction misleading. Convert each count to a risk: 30/200 = 15% and 10/100 = 10%. Their absolute difference is five percentage points, so NNT is 1/0.05 = 20 over three years. Remember: divide within groups before subtracting between groups, retaining the specified recurrence outcome and comparator.",
      "explanation": "First calculate risks: 30/200 = 0.15 and 10/100 = 0.10. ARR is 0.05, or five percentage points, and three-year NNT is 20.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational topical agent trial: invented practice counts of cutaneous-SCC recurrence within three years. Cells count recurrences and people followed. Follow-up is complete; not real efficacy or personal risk.",
        "columnHeaders": [
          "Recurrence within three years",
          "People followed"
        ],
        "rowHeaders": [
          "Control arm",
          "New unnamed intervention"
        ],
        "cells": [
          [
            "30",
            "200"
          ],
          [
            "10",
            "100"
          ]
        ]
      },
      "ageYears": [
        38,
        70
      ],
      "sexLabels": [
        "Male",
        "Female"
      ],
      "clinicalAnchor": "cutaneous-scc"
    },
    {
      "slug": "arr-twenty",
      "complaint": "Evidence review",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has recovered from a primary spontaneous pneumothorax and is discussing recurrence prevention. An optional study tested a new pleural device, reporting recurrence over five years. The patient compares the two trial arms and asks how the absolute benefit translates into the number treated for one fewer recurrence during that stated period.",
      "stem": "For pneumothorax recurrence over five years in the constructed trial, what ARR and NNT describe the new unnamed intervention versus control?",
      "correct": {
        "id": "correct_arr-twenty",
        "label": "ARR 20 percentage points; NNT 5 over five years",
        "rationale": "Subtract 10/100 from 30/100 to get 0.20. The reciprocal is 1/0.20 = 5 for the same comparator and five-year outcome."
      },
      "distractors": [
        {
          "id": "d1_arr-twenty",
          "label": "ARR 67 percentage points; NNT 2 over five years",
          "rationale": "The risk falls by about two thirds relative to its starting value, but the absolute drop is 20 percentage points, not 67."
        },
        {
          "id": "d2_arr-twenty",
          "label": "ARR 20 percentage points; NNT 50 over five years",
          "rationale": "The ARR is correct, but 1/0.20 is 5. An NNT of 50 is a reciprocal calculation error."
        },
        {
          "id": "d3_arr-twenty",
          "label": "ARR 10 percentage points; NNT 10 over five years",
          "rationale": "The two practice risks are 30% and 10%, a 20-point difference. A ten-point reduction would describe different inputs."
        }
      ],
      "teachingPoint": "Absolute reduction subtracts risks on the same scale: 30% minus 10% is 20 percentage points. Taking the reciprocal of 0.20 gives NNT 5 for this comparator and outcome over five years. The relative reduction uses a different starting denominator. Remember that percentage points, percentages, and proportions are not interchangeable labels.",
      "explanation": "The practice outcome risks differ by 0.30 - 0.10 = 0.20. ARR is 20 percentage points and NNT is 5 over the stated five-year period.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational pleural device trial: invented practice counts of pneumothorax recurrence within five years. Cells count recurrences and people followed. Follow-up is complete; not real efficacy or personal risk.",
        "columnHeaders": [
          "Recurrence within five years",
          "People followed"
        ],
        "rowHeaders": [
          "Control arm",
          "New unnamed intervention"
        ],
        "cells": [
          [
            "30",
            "100"
          ],
          [
            "10",
            "100"
          ]
        ]
      },
      "ageYears": [
        47,
        28
      ],
      "sexLabels": [
        "Female",
        "Male"
      ],
      "clinicalAnchor": "pneumothorax"
    },
    {
      "slug": "arr-six",
      "complaint": "Study interpretation",
      "presentation": "{patientName}, a {patientAge}-year-old {patientSex}, has a resected gastric GIST and asks about an optional trial of a new biologic reporting recurrence over two years. The patient brings a calculator: 'They called this simple arithmetic, so I assumed they'd brought someone to explain it.' The discussion concerns absolute benefit and the treatment number calculated from the trial's results.",
      "stem": "For gastric-GIST recurrence over two years in the constructed trial, what ARR and NNT describe the new unnamed intervention versus control?",
      "correct": {
        "id": "correct_arr-six",
        "label": "ARR 6 percentage points; NNT 17 over two years",
        "rationale": "The absolute difference is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded upward to NNT 17 over two years."
      },
      "distractors": [
        {
          "id": "d1_arr-six",
          "label": "ARR 6 percentage points; NNT 16 over two years",
          "rationale": "The six-point difference is right, but conventionally rounding NNT upward gives 17. Rounding down to 16 changes that reporting convention."
        },
        {
          "id": "d2_arr-six",
          "label": "ARR 30 percentage points; NNT 4 over two years",
          "rationale": "Thirty percent is the relative reduction from the 20% comparator risk. The absolute reduction is six percentage points, not thirty."
        },
        {
          "id": "d3_arr-six",
          "label": "ARR 14 percentage points; NNT 8 over two years",
          "rationale": "Fourteen percent is the intervention risk, not the difference between group risks. Subtracting from the comparator gives six percentage points."
        }
      ],
      "teachingPoint": "Subtract the risks before taking a reciprocal: 20% minus 14% is six percentage points, or 0.06. Then 1/0.06 is about 16.67; conventionally round NNT upward to 17. Keep the specified recurrence outcome, comparator, and two-year period with the result. The intervention's 14% risk is not itself the reduction.",
      "explanation": "ARR is 0.20 - 0.14 = 0.06. Its reciprocal is about 16.67, conventionally rounded up to NNT 17 for the stated two-year outcome.",
      "exhibit": {
        "kind": "table",
        "caption": "Unnamed investigational biologic trial: invented practice counts of gastric-GIST recurrence within two years. Cells count recurrences and people followed. Follow-up is complete; not real efficacy or personal risk.",
        "columnHeaders": [
          "Recurrence within two years",
          "People followed"
        ],
        "rowHeaders": [
          "Control arm",
          "New unnamed intervention"
        ],
        "cells": [
          [
            "20",
            "100"
          ],
          [
            "14",
            "100"
          ]
        ]
      },
      "ageYears": [
        73,
        56
      ],
      "sexLabels": [
        "Male",
        "Female"
      ],
      "clinicalAnchor": "gist"
    }
  ],
  "p-value": [
    {
      "slug": "p-003",
      "complaint": "acute cholecystitis study",
      "presentation": "{patientName}, the biliary journal-club lead, reviews a new dissection instrument used in acute cholecystitis operations. The trial compares thirty-day surgical-site infection and reports its preplanned analysis. Investigators specified the null model before collecting outcomes. The team has the p-value but is reviewing what that value says about the infection results before drafting the study's written conclusion.",
      "stem": "Which interpretation is justified by the reported p-value for thirty-day SSI in the constructed trial?",
      "correct": {
        "id": "correct_p-003",
        "label": "A 3% chance of results this extreme or more under the null model",
        "rationale": "Assume the specified null model and analysis conditions. Results this incompatible with that model, or more so, have probability 0.03; the probability is conditional on the model."
      },
      "distractors": [
        {
          "id": "d1_p-003",
          "label": "A 3% probability that the null hypothesis is true after observing these results",
          "rationale": "This reverses the conditioning. The p-value assumes the null model to evaluate data, rather than assigning a 3% probability to the null hypothesis after observing data."
        },
        {
          "id": "d2_p-003",
          "label": "A 97% probability that the intervention truly changed the outcome after observing these results",
          "rationale": "One minus p does not supply a posterior probability that the intervention truly changed scores. The complement 0.97 is not that truth probability."
        },
        {
          "id": "d3_p-003",
          "label": "An estimated difference of 0.03 outcome units between the two groups being compared",
          "rationale": "The 0.03 is a probability under a null model, not a difference in outcome units. Read the effect magnitude from its separately reported estimate."
        }
      ],
      "teachingPoint": "A null model is the comparison's starting assumption. A p-value asks how probable data this incompatible with that model, or more so, would be under the model and analysis conditions. Here that probability is 0.03. Remember: probability of data under a model is not probability that the model is true, and is not effect size.",
      "explanation": "Under the specified null model, results this extreme or more have probability 0.03. That is neither the probability of a true null nor the size of the clinical difference.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational gallbladder dissection instrument trial: invented analysis of thirty-day SSI for practice. The null specifies no group difference; the p-value is not an effect size or personal outcome probability.",
        "items": [
          {
            "label": "Null model and analysis",
            "value": "Specified before data collection"
          },
          {
            "label": "p-value",
            "value": "0.03"
          }
        ]
      },
      "clinicalAnchor": "cholecystitis"
    },
    {
      "slug": "p-040",
      "complaint": "rectal prolapse study",
      "presentation": "{patientName}, the colorectal research lead, reviews a new fixation technique for rectal prolapse and recurrence within two years. The press officer wants a headline saying the study settled the issue; the statistician has been offered a footnote in exchange for missing the press conference. The report includes its preplanned null model and the p-value from that analysis.",
      "stem": "Which interpretation is justified by the reported p-value for two-year recurrence in the constructed trial?",
      "correct": {
        "id": "correct_p-040",
        "label": "A 40% chance of results this extreme or more under the null model",
        "rationale": "The 0.40 is the probability of data this extreme or more under the specified null model and its analysis assumptions. A larger number retains the same conditioning."
      },
      "distractors": [
        {
          "id": "d1_p-040",
          "label": "A 40% probability that the null hypothesis is true after observing these results",
          "rationale": "A p-value does not estimate the probability that the null is true. The 0.40 concerns data calculated assuming the null model."
        },
        {
          "id": "d2_p-040",
          "label": "A 60% probability that no group difference exists after observing these results",
          "rationale": "Subtracting p from one gives 0.60 arithmetically, but does not make that the probability of no effect."
        },
        {
          "id": "d3_p-040",
          "label": "An estimated difference of 0.40 outcome units between the two groups being compared",
          "rationale": "A probability under the null model is not a 0.40-unit outcome difference. Effect magnitude requires its own estimate."
        }
      ],
      "teachingPoint": "The null model supplies a starting comparison assumption. A p-value describes the probability of data this extreme or more if that model and its analysis assumptions hold. Here that probability is 0.40. Neither p nor one minus p gives the probability of no effect. Effect size requires a separate estimate.",
      "explanation": "The 0.40 describes data at least this extreme under the specified null model. It does not assign 40% or 60% probability to a hypothesis or quantify the effect.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational rectal-prolapse fixation technique trial: invented analysis of two-year recurrence for practice. The null specifies no group difference; the p-value is not an effect size or personal outcome probability.",
        "items": [
          {
            "label": "Null model and analysis",
            "value": "Specified before data collection"
          },
          {
            "label": "p-value",
            "value": "0.40"
          }
        ]
      },
      "clinicalAnchor": "rectal-prolapse"
    },
    {
      "slug": "p-0001",
      "complaint": "gastric MALT lymphoma study",
      "presentation": "{patientName}, the gastric-oncology discussion lead, reviews a new agent for gastric MALT lymphoma in an invented recurrence-prevention trial after remission. Follow-up lasts two years. The sponsor requests 'life-changing' on every slide, including the Wi-Fi password. The trial reports a very small p-value, with its effect estimate supplied separately; the team is reviewing the interpretation for its report.",
      "stem": "Which interpretation is justified by the reported p-value for two-year lymphoma recurrence in the constructed trial?",
      "correct": {
        "id": "correct_p-0001",
        "label": "A 0.1% chance of results this extreme or more under the null model",
        "rationale": "Under the specified null model and conditions, data this incompatible or more have probability 0.001. The small value does not change what the probability describes."
      },
      "distractors": [
        {
          "id": "d1_p-0001",
          "label": "A 0.1% probability that the null hypothesis is true after observing these results",
          "rationale": "The test assumes the null model when calculating this probability; it does not assign 0.001 probability to the null hypothesis itself."
        },
        {
          "id": "d2_p-0001",
          "label": "A 99.9% probability that the intervention truly changed the outcome after observing these results",
          "rationale": "The complement 0.999 is not a posterior probability that an effect is true. That interpretation does not follow from the reported p-value."
        },
        {
          "id": "d3_p-0001",
          "label": "An estimated difference of 0.001 outcome units between the two groups being compared",
          "rationale": "The number 0.001 is a probability, not an effect in outcome units. The exhibit says the effect estimate is reported separately."
        }
      ],
      "teachingPoint": "A null model is a starting comparison assumption, not the conclusion. Under that model and its assumptions, results at least this incompatible have probability 0.001. A small p-value does not make the effect 0.001 units or assign 0.999 probability to its truth. Read magnitude from the separately reported estimate.",
      "explanation": "The 0.001 refers to data under the specified null model, including more extreme results. It is not a posterior truth probability or the effect estimate.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational gastric-MALT agent trial: invented analysis of two-year lymphoma recurrence for practice. The null specifies no group difference; the p-value is not an effect size or personal outcome probability.",
        "items": [
          {
            "label": "p-value",
            "value": "0.001"
          },
          {
            "label": "Effect estimate",
            "value": "Reported separately"
          }
        ]
      },
      "clinicalAnchor": "gastric-malt"
    },
    {
      "slug": "p-008",
      "complaint": "Meckel diverticulum study",
      "presentation": "{patientName}, the emergency-surgery journal-club lead, reviews a new anastomosis instrument after ileal resection for symptomatic Meckel diverticulum. The trial records leak within thirty days. Its analysis does not reject the prespecified null model, and a draft conclusion says the instruments have exactly equal effects. The report gives the p-value and that proposed conclusion for the team's discussion.",
      "stem": "Which interpretation is justified by the reported p-value for thirty-day leak in the constructed trial?",
      "correct": {
        "id": "correct_p-008",
        "label": "The result does not prove exact equality",
        "rationale": "The p-value does not prove a zero group difference. The exact-equality sentence claims more than the reported probability establishes."
      },
      "distractors": [
        {
          "id": "d1_p-008",
          "label": "The result favors equal group effects",
          "rationale": "Failure to establish a difference is not proof or a supplied probability of equality. The p-value alone does not settle whether the means are exactly equal."
        },
        {
          "id": "d2_p-008",
          "label": "The result indicates a small clinical difference",
          "rationale": "The exhibit supplies no effect magnitude or clinical-importance criterion. A p-value alone cannot establish a small clinical difference."
        },
        {
          "id": "d3_p-008",
          "label": "The result gives an 8% probability of no effect",
          "rationale": "The 0.08 describes data conditional on a null model, not an 8% probability that no effect exists after observing the data."
        }
      ],
      "teachingPoint": "A null model is a starting comparison assumption; a p-value describes data under that model. It does not establish exact group equality, the probability of no effect, or the clinical size of a difference. Remember the boundary: this number alone cannot certify equality, magnitude, or clinical importance.",
      "explanation": "The reported p-value does not prove exact equality. It also does not give an 8% probability of no effect or establish that any difference is clinically small.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational Meckel resection anastomosis instrument trial: invented analysis of thirty-day leak for practice. The null specifies no group difference; the p-value is not an effect size or personal outcome probability.",
        "items": [
          {
            "label": "p-value",
            "value": "0.08"
          },
          {
            "label": "Draft claim",
            "value": "The groups are exactly identical"
          }
        ]
      },
      "clinicalAnchor": "meckel"
    }
  ],
  "confidence-interval": [
    {
      "slug": "ratio-crosses",
      "complaint": "femoral hernia study",
      "presentation": "{patientName}, the groin-surgery research lead, reviews a new reinforcement material for femoral hernia repair. The trial reports recurrence within two years as a risk ratio with an interval. The sponsor welcomes uncertainty in principle, but asks whether it can be moved to the appendix. The team is reviewing how the reported range relates to the no-difference value.",
      "stem": "How does the constructed two-year recurrence risk-ratio interval relate to its null value, and what interpretation is justified?",
      "correct": {
        "id": "correct_ratio-crosses",
        "label": "The interval includes the null value 1",
        "rationale": "One lies between 0.40 and 1.20, so the interval includes the no-association value for a ratio. Inclusion does not establish an exactly true ratio of one."
      },
      "distractors": [
        {
          "id": "d1_ratio-crosses",
          "label": "The interval excludes the null value 1",
          "rationale": "The upper limit is 1.20 and the lower limit is 0.40. One is inside these limits, so it is not excluded."
        },
        {
          "id": "d2_ratio-crosses",
          "label": "The interval gives 95% probability of a real association",
          "rationale": "The 95% level describes coverage of the interval method. It does not give a 95% probability that an association is real."
        },
        {
          "id": "d3_ratio-crosses",
          "label": "The interval supports an exactly absent association",
          "rationale": "An interval containing one is compatible with the ratio null value, but also contains other ratios. It does not prove that the association is exactly absent."
        }
      ],
      "teachingPoint": "For a ratio, the no-association value is 1, because the compared quantities are equal. One falls within 0.40 to 1.20, so this interval includes that null value. Inclusion is not proof that the true ratio is exactly 1. Remember the measure's scale before looking for its null value.",
      "explanation": "The ratio interval from 0.40 to 1.20 contains 1. It is compatible with the ratio null value, without proving an exactly absent association.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational femoral-hernia reinforcement material: invented two-year recurrence risk ratio, unitless ratio (new/control), for practice. No real efficacy or clinical-importance threshold.",
        "items": [
          {
            "label": "Estimate",
            "value": "0.70"
          },
          {
            "label": "95% confidence interval",
            "value": "0.40 to 1.20"
          }
        ]
      },
      "clinicalAnchor": "femoral"
    },
    {
      "slug": "difference-excludes",
      "complaint": "pilonidal disease study",
      "presentation": "{patientName}, the colorectal journal-club lead, reviews a new operative closure technique for chronic pilonidal disease. The trial reports recurrence within two years as an absolute risk difference with a confidence interval. One colleague says the range establishes an important benefit. The report provides no threshold for what difference would matter to patients, and the team is reviewing that interpretation.",
      "stem": "Which statement is justified by the constructed two-year recurrence risk difference of -4 percentage points with a 95% interval from -6 to -2?",
      "correct": {
        "id": "correct_difference-excludes",
        "label": "The interval excludes the null value 0",
        "rationale": "All values from -6 to -2 are below zero. The interval therefore excludes zero, the no-difference value on this scale."
      },
      "distractors": [
        {
          "id": "d1_difference-excludes",
          "label": "The interval includes the null value 0",
          "rationale": "Zero is outside the stated limits. The null for a difference is zero, even though a ratio would use one."
        },
        {
          "id": "d2_difference-excludes",
          "label": "The interval gives 95% probability of clinical benefit",
          "rationale": "The confidence level is not a probability that the intervention provides clinical benefit. The exercise gives no clinical-importance criterion."
        },
        {
          "id": "d3_difference-excludes",
          "label": "The interval establishes a clinically important effect",
          "rationale": "Excluding zero addresses compatibility with the difference null. It does not, by itself, establish a clinically important magnitude."
        }
      ],
      "teachingPoint": "For a difference, the no-difference value is 0, rather than the ratio null of 1. Every value from -6 to -2 lies below zero, so this interval excludes the null. That describes the estimate's uncertainty on its stated scale; it does not alone establish clinical importance or a probability of benefit.",
      "explanation": "The interval from -6 to -2 excludes zero, the null for a risk difference. Excluding zero does not by itself establish a clinically important effect.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational pilonidal closure technique: invented two-year recurrence risk difference, percentage points (new minus control), for practice. No real efficacy or clinical-importance threshold.",
        "items": [
          {
            "label": "Estimate",
            "value": "-4"
          },
          {
            "label": "95% confidence interval",
            "value": "-6 to -2"
          }
        ]
      },
      "clinicalAnchor": "pilonidal"
    },
    {
      "slug": "precision-width",
      "complaint": "lactational breast abscess study",
      "presentation": "{patientName}, the breast-service research lead, reviews two studies of a new aspiration device for lactational breast abscesses. Both report repeat drainage within thirty days on the same scale. A colleague prefers the paper with the most confident title; its author underlined 'definitive' twice. The intervals use the same method and confidence level, and the team is comparing precision.",
      "stem": "Which constructed repeat-drainage risk-difference interval is more precise when method, confidence level and measurement scale are the same?",
      "correct": {
        "id": "correct_precision-width",
        "label": "The 4-to-6 interval is more precise",
        "rationale": "The 4-to-6 interval is narrower than 1-to-9 under the same method, confidence level, and scale. It therefore displays greater sampling precision."
      },
      "distractors": [
        {
          "id": "d1_precision-width",
          "label": "The 1-to-9 interval is more precise",
          "rationale": "The 1-to-9 interval is wider. Under the supplied comparable conditions, that width displays more sampling uncertainty rather than greater precision."
        },
        {
          "id": "d2_precision-width",
          "label": "Both intervals have equal precision",
          "rationale": "Both point estimates are five, but the interval widths differ. A shared center does not imply equal precision."
        },
        {
          "id": "d3_precision-width",
          "label": "Precision cannot be ranked without sample sizes",
          "rationale": "The widths already display relative sampling precision under the same method and scale. The exercise does not require sample sizes to compare those widths."
        }
      ],
      "teachingPoint": "With the same method, confidence level, and scale, a narrower interval displays less sampling uncertainty and therefore greater precision. The 4-to-6 interval is narrower than 1-to-9, even though both center on 5. Remember that the center gives the point estimate while the width conveys precision; equal centers do not imply equal uncertainty.",
      "explanation": "The 4-to-6 interval is more precise because it is narrower under the same method and scale. Both estimates being 5 does not equalize the interval widths.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational lactational-abscess aspiration device: invented thirty-day repeat-drainage risk difference, percentage points (new minus control), for practice. No real efficacy or clinical-importance threshold.",
        "items": [
          {
            "label": "Interval A, 95%",
            "value": "1 to 9"
          },
          {
            "label": "Interval B, 95%",
            "value": "4 to 6"
          },
          {
            "label": "Both estimates",
            "value": "5"
          }
        ]
      },
      "clinicalAnchor": "lactational-abscess"
    },
    {
      "slug": "repeated-sampling",
      "complaint": "gastric adenocarcinoma study",
      "presentation": "{patientName}, the upper-GI journal-club lead, reviews a new biologic after resection of gastric adenocarcinoma. Its trial reports a three-year recurrence risk difference with a frequentist interval. The presenter lists an invited lecture on his CV; the invitation came from the seminar series he organizes himself. The team is reviewing what the stated confidence level describes across repeated studies.",
      "stem": "What does a 95% confidence level describe for repeated use of the stated frequentist three-year recurrence risk-difference interval procedure?",
      "correct": {
        "id": "correct_repeated-sampling",
        "label": "The method covers the true value in 95% of repetitions",
        "rationale": "The 95% level describes long-run coverage by intervals constructed with this procedure under its assumptions. The fixed true value is covered in that proportion of repetitions."
      },
      "distractors": [
        {
          "id": "d1_repeated-sampling",
          "label": "This interval has a 95% chance of containing the truth",
          "rationale": "After observation, this frequentist framework treats the parameter as fixed. Its confidence level does not assign a fresh probability to this particular interval containing that value."
        },
        {
          "id": "d2_repeated-sampling",
          "label": "The null hypothesis has a 5% chance of being correct",
          "rationale": "Neither 95% confidence nor its 5% complement supplies a truth probability for a hypothesis. That is a different question from interval coverage."
        },
        {
          "id": "d3_repeated-sampling",
          "label": "The estimate has a 95% chance of being unbiased",
          "rationale": "Coverage under a procedure does not guarantee the absence of systematic bias. The confidence level is not a probability that the estimate is unbiased."
        }
      ],
      "teachingPoint": "A frequentist confidence level describes repeated use of the interval method under its assumptions. In 95% of those repetitions, intervals produced by the procedure cover the fixed true value. It is a property of the method, not a new probability assigned to this observed interval or a guarantee that the estimate is unbiased.",
      "explanation": "The 95% refers to long-run coverage of intervals produced by the procedure under its assumptions. It does not assign a 95% truth probability to this particular interval.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational gastric-cancer biologic: invented three-year recurrence risk-difference procedure, percentage points (new minus control), for practice. No real efficacy or clinical-importance threshold.",
        "items": [
          {
            "label": "Framework",
            "value": "Standard frequentist procedure"
          },
          {
            "label": "Confidence level",
            "value": "95%"
          }
        ]
      },
      "clinicalAnchor": "gastric-cancer"
    }
  ],
  "errors-power": [
    {
      "slug": "type-one",
      "complaint": "DCIS study",
      "presentation": "{patientName}, the breast-oncology research lead, reviews a new local treatment device for DCIS. A simulation concerns recurrence within five years and stipulates the underlying state. The investigator lists one conference abstract as a presentation, publication and public-engagement project on his appraisal. The analysis rejects its null, and the team is reviewing how to classify that simulated result.",
      "stem": "Which testing error occurs in the simulated DCIS-recurrence analysis when the null is true but the analysis rejects it?",
      "correct": {
        "id": "correct_type-one",
        "label": "Type I error",
        "rationale": "The underlying null is stipulated to be true, yet the analysis rejects it. That truth-and-decision combination defines a type I error."
      },
      "distractors": [
        {
          "id": "d1_type-one",
          "label": "Type II error",
          "rationale": "Type II error would mean failing to reject under a specified true alternative. Both the underlying state and decision differ from this exhibit."
        },
        {
          "id": "d2_type-one",
          "label": "Measurement bias",
          "rationale": "The exhibit gives the hypothesis state and decision, without describing inconsistent outcome measurement. It identifies a testing error rather than that bias mechanism."
        },
        {
          "id": "d3_type-one",
          "label": "Selection bias",
          "rationale": "No systematic exclusion from recruitment is supplied. The stated problem is rejection of a true null, not a selection process."
        }
      ],
      "teachingPoint": "Testing errors compare a decision with the underlying state. Type I error means rejecting a null that is actually true; type II means failing to reject when a specified alternative is true. Here the null is true and was rejected. Remember: first identify what is true, then what the analysis decided.",
      "explanation": "Rejecting a true null is a type I error. The exhibit supplies the true state and testing decision, not evidence of a measurement or recruitment mechanism.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Simulated unnamed investigational local DCIS treatment device trial: the underlying state for five-year recurrence is stipulated for practice. It is not learned from a p-value or asserted for a real intervention.",
        "items": [
          {
            "label": "Underlying state",
            "value": "Null hypothesis true"
          },
          {
            "label": "Analysis decision",
            "value": "Reject the null hypothesis"
          }
        ]
      },
      "clinicalAnchor": "dcis"
    },
    {
      "slug": "type-two",
      "complaint": "hepatocellular carcinoma study",
      "presentation": "{patientName}, the liver-surgery discussion lead, reviews a new resection instrument for solitary hepatocellular carcinoma in a favorable operative profile. A simulation concerns recurrence within three years and stipulates that a specified difference exists. The analysis fails to reject its null model. The team has the underlying state and analysis decision available and is reviewing the testing-error classification.",
      "stem": "Which testing error occurs in the simulated HCC-recurrence analysis when the specified alternative is true but the analysis fails to reject the null?",
      "correct": {
        "id": "correct_type-two",
        "label": "Type II error",
        "rationale": "The specified alternative is stipulated to be true, but the test fails to reject the null. That combination defines a type II error."
      },
      "distractors": [
        {
          "id": "d1_type-two",
          "label": "Type I error",
          "rationale": "Type I error requires rejection under a true null. This exercise instead supplies nonrejection under a true alternative."
        },
        {
          "id": "d2_type-two",
          "label": "Measurement bias",
          "rationale": "No unequal outcome-recording process is described. The facts identify a missed specified alternative by the test."
        },
        {
          "id": "d3_type-two",
          "label": "Selection bias",
          "rationale": "The exhibit does not describe systematic sampling exclusion. The testing decision, compared with the supplied true alternative, identifies the error."
        }
      ],
      "teachingPoint": "Failure to reject does not guarantee a true null. If the specified alternative is actually true and the analysis misses it, the decision is a type II error. Type I is the opposite truth-and-decision combination: rejection under a true null. Keep the underlying state separate from the decision reported by the test.",
      "explanation": "This is a type II error: the specified alternative is true, yet the test fails to reject the null. Nonrejection does not establish that no effect exists.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Simulated unnamed investigational hepatic resection instrument trial: the underlying state for three-year HCC recurrence is stipulated for practice. It is not learned from a p-value or asserted for a real intervention.",
        "items": [
          {
            "label": "Underlying state",
            "value": "Specified alternative true"
          },
          {
            "label": "Analysis decision",
            "value": "Fail to reject the null hypothesis"
          }
        ]
      },
      "clinicalAnchor": "hcc"
    },
    {
      "slug": "power",
      "complaint": "pancreatic cancer study",
      "presentation": "{patientName}, the pancreatic-oncology research lead, reviews a new radiation-delivery technique after pancreatic tail cancer resection. Its trial is planned around recurrence within two years. The grant writer wants a guaranteed discovery and asks whether 'statistically likely' can be upgraded in the budget justification. The calculation specifies the effect, variability and sampling assumptions before any outcomes are collected.",
      "stem": "What does prospective power describe under the specified alternative in the constructed pancreatic-cancer recurrence trial?",
      "correct": {
        "id": "correct_power",
        "label": "Chance of rejection if that alternative is true",
        "rationale": "Under the specified true alternative and design assumptions, power is the probability of rejecting the null. It describes how the planned procedure behaves in that situation."
      },
      "distractors": [
        {
          "id": "d1_power",
          "label": "Chance that a statistically positive result is true",
          "rationale": "This reverses what is conditioned on. Power assumes an alternative to evaluate rejection, rather than estimating whether a statistically positive conclusion is true."
        },
        {
          "id": "d2_power",
          "label": "Chance that the null hypothesis itself is true",
          "rationale": "The plan does not assign a probability to the null hypothesis being true. It calculates a rejection probability under the specified alternative."
        },
        {
          "id": "d3_power",
          "label": "Chance of nonrejection if that alternative is true",
          "rationale": "Nonrejection under a true alternative describes a type II error probability. Power instead concerns rejection under that alternative."
        }
      ],
      "teachingPoint": "Power is the probability that the analysis rejects the null if the specified alternative is true, under the planned design assumptions. It is a statement about a procedure operating in that situation. Remember the direction of conditioning: it does not give the probability that a positive study conclusion or the alternative itself is true.",
      "explanation": "Planned power is the chance of rejecting the null under the specified true alternative and design assumptions. It is not the truth probability of a positive result.",
      "exhibit": {
        "kind": "abstract",
        "title": "Recurrence trial — illustrative analysis",
        "body": "An unnamed investigational pancreatic-cancer radiation technique study of two-year recurrence. Before collecting data, investigators specify the recurrence effect, variability, alpha and sampling design. Power is calculated under that alternative. These study conditions are invented for practice, not real efficacy findings."
      },
      "clinicalAnchor": "pancreatic-cancer"
    },
    {
      "slug": "post-hoc",
      "complaint": "basal cell carcinoma study",
      "presentation": "{patientName}, the skin-oncology journal-club lead, reviews a new topical agent for basal cell carcinoma. The trial evaluates recurrence within two years and does not reject its null model. After seeing the results, authors calculate low power and conclude the agent has no effect. The team is reviewing that conclusion alongside the reported effect estimate and uncertainty.",
      "stem": "Which statement is justified when the constructed basal-cell-carcinoma recurrence trial fails to reject its null and reports low post-hoc power?",
      "correct": {
        "id": "correct_post-hoc",
        "label": "Post-hoc power does not prove no effect",
        "rationale": "A low post-hoc calculation does not establish that the effect is exactly absent. Power is conditional on a specified alternative, rather than a truth probability for the null."
      },
      "distractors": [
        {
          "id": "d1_post-hoc",
          "label": "Low post-hoc power favors an absent effect",
          "rationale": "The later calculation does not make the no-effect conclusion valid. Neither low post-hoc power nor nonrejection supplies proof of an absent effect."
        },
        {
          "id": "d2_post-hoc",
          "label": "Post-hoc power gives the probability of the null",
          "rationale": "Power does not assign a probability to the null hypothesis. It concerns rejection behavior under a specified alternative."
        },
        {
          "id": "d3_post-hoc",
          "label": "The observed p-value is the study's achieved power",
          "rationale": "A p-value concerns observed-or-more-extreme data under a null model; power concerns rejection under an alternative. They are different conditional quantities."
        }
      ],
      "teachingPoint": "Power describes rejection probability under a specified alternative, not the probability that a hypothesis is true. A low post-hoc power calculation after nonrejection does not establish an exactly absent effect. Remember that a second conditional calculation cannot transform the first result into proof of equality or supply the effect size missing from this exercise.",
      "explanation": "Low post-hoc power does not prove no effect. It neither gives the probability of the null nor makes the observed p-value equal to power.",
      "exhibit": {
        "kind": "abstract",
        "title": "Recurrence trial — illustrative analysis",
        "body": "An unnamed investigational basal-cell-carcinoma topical agent study of two-year recurrence. The trial does not reject its recurrence null model. Authors calculate low post-hoc power and claim that no recurrence effect exists. These study conditions are invented for practice, not real efficacy findings."
      },
      "clinicalAnchor": "bcc"
    }
  ],
  "pdsa-act": [
    {
      "slug": "adopt-next",
      "complaint": "celiac disease study",
      "presentation": "{patientName}, the GI improvement lead, reviews an authorized pilot of a new dietitian care pathway for celiac disease. Its symptom aim is met without worsening workload. The project director has booked the national rollout speech; the pilot team has seven minutes to discuss whether a national rollout is warranted. The results describe only the tested local setting.",
      "stem": "Which Act-step decision fits the authorized celiac pathway pilot when its symptom aim is met and the balancing measure does not worsen?",
      "correct": {
        "id": "correct_adopt-next",
        "label": "Adopt locally and plan the next test",
        "rationale": "The test met its aim without worsening balance in the tested setting. Local adoption uses that learning while a next linked test investigates the next step."
      },
      "distractors": [
        {
          "id": "d1_adopt-next",
          "label": "Spread the change and monitor other clinics",
          "rationale": "The results apply to the local test. Spreading immediately to other clinics goes beyond that scope instead of testing the next setting."
        },
        {
          "id": "d2_adopt-next",
          "label": "Repeat the same pilot before making any change",
          "rationale": "The supplied favorable aim and balancing findings support local action. Repeating the identical pilot without acting does not use the stated learning."
        },
        {
          "id": "d3_adopt-next",
          "label": "Adapt the pathway before another local test",
          "rationale": "The findings identify no feature requiring revision before local adoption. Adaptation needs a reason in the learning, rather than a change for its own sake."
        }
      ],
      "teachingPoint": "The Act step turns learning into a decision and a next test. This pathway version met its aim without worsening the balancing measure, supporting local adoption and a linked next cycle. Keep the scope of action tied to the scope of the evidence: a successful small test does not automatically establish performance at every clinic.",
      "explanation": "Adopt the successful pathway locally and plan the next linked test. The favorable aim and balancing findings apply to the tested setting, not an untested wider rollout.",
      "exhibit": {
        "kind": "abstract",
        "title": "Investigational care pathway — illustrative local cycle",
        "body": "An authorized local pilot of an unnamed investigational celiac dietitian pathway meets its symptom-improvement aim without worsening care-planning workload. Findings apply to the tested setting. These observations are invented for practice, not real pathway effectiveness."
      },
      "clinicalAnchor": "celiac"
    },
    {
      "slug": "adapt-burden",
      "complaint": "venous leg ulcer study",
      "presentation": "{patientName}, the wound-service improvement lead, reviews an authorized new compression-device pilot for venous leg ulcers after adequate arterial assessment. Healing is faster, but application rework doubles. The manager calls the pilot paperless; staff print one online form to enter it into another. The team has the healing and workload findings available while planning the next local cycle.",
      "stem": "Which Act-step decision fits the authorized venous-ulcer device pilot when healing is faster but application rework doubles?",
      "correct": {
        "id": "correct_adapt-burden",
        "label": "Adapt device use and retest locally",
        "rationale": "Healing improved but rework doubled. Revise device use to address that burden and use the next test to study the adapted version."
      },
      "distractors": [
        {
          "id": "d1_adapt-burden",
          "label": "Adopt device use and monitor application rework",
          "rationale": "Adopting this version unchanged accepts the documented worsening of rework. The balancing finding calls for adaptation before adoption."
        },
        {
          "id": "d2_adapt-burden",
          "label": "Abandon device use and test another local idea",
          "rationale": "The target improvement supports retaining and adapting the idea. The supplied findings do not require discarding it instead of addressing the added burden."
        },
        {
          "id": "d3_adapt-burden",
          "label": "Repeat device use without revising the process",
          "rationale": "Repeating the same device unchanged does not respond to the increased rework already observed. The next cycle should use that learning."
        }
      ],
      "teachingPoint": "Improvement needs both the intended result and a check for shifted burden. This device shortened wound-closure time but doubled rework, so adapt its use and retest rather than adopting the current version unchanged. The Act step can preserve a promising idea while changing the part that caused trouble. Learning should change the next cycle.",
      "explanation": "Adapt device use to address increased rework, then retest. The improved healing target supports keeping the idea, while the worsened balancing measure argues against adopting this version unchanged.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational venous-ulcer compression device pilot: invented wound closure and application rework findings for practice. Results belong only to this authorized local test, not real intervention efficacy.",
        "items": [
          {
            "label": "Wound-closure time",
            "value": "Shorter"
          },
          {
            "label": "Application rework",
            "value": "Doubled"
          }
        ]
      },
      "clinicalAnchor": "venous-ulcer"
    },
    {
      "slug": "abandon-harm",
      "complaint": "gastroparesis study",
      "presentation": "{patientName}, the foregut improvement lead, reviews an authorized new nutrition-pathway pilot for gastroparesis after obstruction was excluded. Its symptom aim is not met and planning takes longer. The vendor insists the pathway saves time after staff complete extra training on saving time. No specific correctable defect has emerged from review, and the next cycle has not been planned.",
      "stem": "Which Act-step decision fits the authorized gastroparesis pathway pilot when its symptom aim is not met and care planning takes longer, with no specific correctable defect identified?",
      "correct": {
        "id": "correct_abandon-harm",
        "label": "Abandon this version and test another idea",
        "rationale": "This version missed its stated aim and worsened care-planning time. Abandoning the version and testing another idea follows both unfavorable findings."
      },
      "distractors": [
        {
          "id": "d1_abandon-harm",
          "label": "Adapt the pathway labels and repeat this version",
          "rationale": "The observations do not identify a labeling problem to fix. That specific adaptation invents an explanation rather than using the supplied findings."
        },
        {
          "id": "d2_abandon-harm",
          "label": "Adopt the pathway and monitor the next cycle",
          "rationale": "The tested version missed the aim and increased care-planning time, so the evidence does not support adopting it while monitoring later."
        },
        {
          "id": "d3_abandon-harm",
          "label": "Repeat the same test to confirm the findings",
          "rationale": "The stated findings already support changing direction from this version. An unchanged repeat does not use the unfavorable learning to choose the next idea."
        }
      ],
      "teachingPoint": "The Act step permits abandoning a tested version when findings are unfavorable. This pathway missed its symptom aim and increased planning time, supporting another idea for the next test. Remember that the verdict concerns this version. The observations do not establish that every nutrition pathway fails or identify a specific defect to repair.",
      "explanation": "Abandon this unsuccessful pathway version and test another idea. Its symptom aim was missed and planning time increased, without a specific correctable defect identified in the supplied findings.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Unnamed investigational gastroparesis nutrition pathway pilot: invented symptom relief and care-planning time findings for practice. Results belong only to this authorized local test, not real intervention efficacy.",
        "items": [
          {
            "label": "Symptom-relief aim",
            "value": "Not met"
          },
          {
            "label": "Care-planning time",
            "value": "Longer"
          }
        ]
      },
      "clinicalAnchor": "gastroparesis"
    },
    {
      "slug": "incomplete-data",
      "complaint": "carpal tunnel syndrome study",
      "presentation": "{patientName}, the hand-service improvement lead, reviews an authorized new wrist-bracing pathway for carpal tunnel syndrome. The pilot intended to improve hand function, but too many follow-up observations are missing to judge its aim. Colleagues suggest continuing, changing or stopping the pathway. The team has the incomplete records and is preparing its next cycle before deciding about broader use.",
      "stem": "Which Act-step decision fits the authorized wrist-bracing pathway pilot when missing hand-function observations prevent judging its stated aim?",
      "correct": {
        "id": "correct_incomplete-data",
        "label": "Fix data capture and repeat a bounded test",
        "rationale": "The missing observations prevent judging the aim. Repair data capture and repeat a bounded test so the next decision rests on interpretable results."
      },
      "distractors": [
        {
          "id": "d1_incomplete-data",
          "label": "Adopt the change and improve later measurement",
          "rationale": "The incomplete records do not establish success. Adopting first and measuring later turns an information gap into an unsupported favorable verdict."
        },
        {
          "id": "d2_incomplete-data",
          "label": "Adapt the intervention before collecting more data",
          "rationale": "The data gap does not identify an intervention feature to adapt. Fixing measurement addresses the known problem before choosing a specific revision."
        },
        {
          "id": "d3_incomplete-data",
          "label": "Abandon the change and test a different idea",
          "rationale": "Incomplete measurement does not establish that the intervention failed. Abandonment would turn missing evidence into an unsupported unfavorable verdict."
        }
      ],
      "teachingPoint": "An uninterpretable test needs better measurement before an intervention verdict. Here missing observations prevent judging the aim, so repair data capture and repeat a bounded test. Remember the distinction between evidence of failure and failure to collect evidence; the latter does not establish adoption, adaptation, or abandonment of the intervention itself.",
      "explanation": "Fix data capture and repeat a bounded test. The missing observations prevent judging this intervention; they do not establish either success or failure.",
      "exhibit": {
        "kind": "abstract",
        "title": "Investigational care pathway — illustrative local cycle",
        "body": "An authorized local pilot of an unnamed investigational carpal-tunnel wrist-bracing pathway lacks too many hand-function observations to judge its stated aim. These observations are invented for practice, not real pathway effectiveness."
      },
      "clinicalAnchor": "carpal-tunnel"
    }
  ],
  "qi-measures": [
    {
      "slug": "check-in",
      "complaint": "high-output ileostomy study",
      "presentation": "{patientName}, the stoma-service improvement lead, reviews a proposed rehydration delivery device for high-output ileostomy after stabilization. The pilot aims to reduce dehydration while tracking use and workload. The committee wants fewer forms; its proposal requires a form for each form removed. The team is preparing the measurement plan before testing the new device in its authorized local pilot.",
      "stem": "Which set lists a process measure, the intended clinical outcome measure and a balancing measure, in that order, for the ileostomy rehydration device pilot?",
      "correct": {
        "id": "correct_check-in",
        "label": "Device use as planned; dehydration episodes; application workload",
        "rationale": "Device use tracks implementation, dehydration episodes track the clinical aim, and application workload checks an unwanted tradeoff in delivering the intervention."
      },
      "distractors": [
        {
          "id": "d1_check-in",
          "label": "Dehydration episodes; device use as planned; application workload",
          "rationale": "Dehydration episodes measure the clinical outcome, while device use measures implementation. This ordering reverses process and outcome."
        },
        {
          "id": "d2_check-in",
          "label": "Device use as planned; application workload; dehydration episodes",
          "rationale": "Application workload checks a tradeoff, while dehydration episodes is the aim; this ordering swaps outcome and balancing measures."
        },
        {
          "id": "d3_check-in",
          "label": "Application workload; dehydration episodes; device use as planned",
          "rationale": "Application workload belongs in the balancing position, while device use as planned belongs first; this ordering places both incorrectly."
        }
      ],
      "teachingPoint": "A process measure asks whether planned care happened; an outcome measure asks whether patients experienced the intended result. A balancing measure checks an unwanted tradeoff. Here device use, dehydration and workload answer those three questions. Remember: delivery, result, tradeoff. More device applications alone would not establish that dehydration improved.",
      "explanation": "Device use tracks implementation, dehydration episodes track the clinical aim, and application workload checks a tradeoff. Counting applications alone does not establish a clinical improvement.",
      "exhibit": {
        "kind": "abstract",
        "title": "Investigational clinical pilot — illustrative measurement plan",
        "body": "An authorized pilot of an unnamed investigational ileostomy rehydration device for high-output ileostomy aims to improve dehydration episodes. The team is concerned about application workload. This protocol is invented for practice and supplies no real efficacy, diagnostic accuracy or patient-specific prediction."
      },
      "clinicalAnchor": "ileostomy"
    },
    {
      "slug": "preprocedure-reminder",
      "complaint": "hidradenitis suppurativa study",
      "presentation": "{patientName}, the skin-service improvement lead, reviews a new dressing device for hidradenitis suppurativa. The pilot aims to shorten closure time for draining skin lesions while tracking device use and application burden. The coordinator promises real-time documentation, provided staff first leave the room to find a computer. The team is preparing the pilot's measures before any results are collected.",
      "stem": "Which set lists a process measure, the intended clinical outcome measure and a balancing measure, in that order, for the hidradenitis dressing device pilot?",
      "correct": {
        "id": "correct_preprocedure-reminder",
        "label": "Protocol dressing applications; time to lesion closure; extra application work",
        "rationale": "Applications track delivery, lesion-closure time tracks the healing aim, and extra application work checks the unwanted burden of delivering the new dressing."
      },
      "distractors": [
        {
          "id": "d1_preprocedure-reminder",
          "label": "Patients enrolled; protocol dressing applications; extra application work",
          "rationale": "Enrollment and application counts both track study or delivery activity. This set leaves out the clinical healing outcome the pilot intends to improve."
        },
        {
          "id": "d2_preprocedure-reminder",
          "label": "Protocol dressing applications; extra application work; time to lesion closure",
          "rationale": "Extra application work checks burden, not the healing aim. This ordering swaps the clinical outcome and balancing positions."
        },
        {
          "id": "d3_preprocedure-reminder",
          "label": "Time to lesion closure; extra application work; protocol dressing applications",
          "rationale": "Lesion-closure time is the clinical outcome, while applications track delivery. This ordering moves both outside their requested positions."
        }
      ],
      "teachingPoint": "A completed application is evidence of delivery, not evidence that a lesion closed sooner. Keep the clinical outcome separate from implementation counts, and check added work alongside both. Remember: doing the intervention and benefiting from it are different measurements. A balanced set can show whether better healing came with an application burden.",
      "explanation": "Track dressing applications as process, lesion-closure time as outcome, and extra application work as balance. Enrollment and delivery counts cannot replace the intended clinical result.",
      "exhibit": {
        "kind": "abstract",
        "title": "Investigational clinical pilot — illustrative measurement plan",
        "body": "An authorized pilot of an unnamed investigational hidradenitis dressing device for hidradenitis suppurativa aims to improve time to lesion closure. The team is concerned about application workload. This protocol is invented for practice and supplies no real efficacy, diagnostic accuracy or patient-specific prediction."
      },
      "clinicalAnchor": "hidradenitis"
    },
    {
      "slug": "supply-cart",
      "complaint": "spontaneous pneumothorax study",
      "presentation": "{patientName}, the thoracic improvement lead, reviews a new pleural device for recurrence prevention after spontaneous pneumothorax. The pilot will track recurrence and extra procedure time. The supplier offers every dashboard measure except the one requested; adding it requires the advanced transparency package. The team is preparing the measurement plan before the authorized test begins, with outcomes still unobserved.",
      "stem": "Which set lists a process measure, the intended clinical outcome measure and a balancing measure, in that order, for the pleural recurrence-prevention device pilot?",
      "correct": {
        "id": "correct_supply-cart",
        "label": "Protocol device use; recurrence at follow-up; extra procedure time",
        "rationale": "Device use records implementation, recurrence records the prevention aim, and extra procedure time checks the burden added by the intervention."
      },
      "distractors": [
        {
          "id": "d1_supply-cart",
          "label": "Protocol device use; completed procedures; extra procedure time",
          "rationale": "Completed procedures count delivery activity rather than recurrence prevention. The intended clinical outcome is missing from this otherwise organized set."
        },
        {
          "id": "d2_supply-cart",
          "label": "Patients enrolled; completed procedures; protocol device use",
          "rationale": "Enrollment, procedure completion and device use all describe participation or delivery. This set omits both the recurrence result and the extra-time tradeoff."
        },
        {
          "id": "d3_supply-cart",
          "label": "Recurrence at follow-up; protocol device use; extra procedure time",
          "rationale": "Recurrence is the outcome and device use is process. This set reverses those first two positions while keeping the time tradeoff last."
        }
      ],
      "teachingPoint": "Recurrence at follow-up is the clinical result; completing a procedure is a delivery event. Device use therefore belongs among process measures, while extra procedure time checks added burden. Remember to keep the result after treatment distinct from the act of treatment. A busy procedure list cannot by itself establish recurrence prevention.",
      "explanation": "Record protocol device use, recurrence at follow-up and extra procedure time as process, outcome and balance. Completed procedures alone cannot establish that recurrence was prevented.",
      "exhibit": {
        "kind": "abstract",
        "title": "Investigational clinical pilot — illustrative measurement plan",
        "body": "An authorized pilot of an unnamed investigational pleural recurrence-prevention device for spontaneous pneumothorax aims to improve recurrence at protocol follow-up. The team is concerned about extra procedure time. This protocol is invented for practice and supplies no real efficacy, diagnostic accuracy or patient-specific prediction."
      },
      "clinicalAnchor": "pneumothorax"
    },
    {
      "slug": "handoff-template",
      "complaint": "lung-cancer screening study",
      "presentation": "{patientName}, the lung-screening improvement lead, reviews a new lung-cancer screening program for eligible adults. The pilot aims to reduce missed lung cancers at protocol follow-up and may require extra diagnostic visits. Colleagues propose different combinations of measures for the report. The team is planning what to record before testing the unnamed program; no benefit or screening-test performance is supplied.",
      "stem": "Which set lists a process measure, the intended clinical outcome measure and a balancing measure, in that order, for the lung-cancer screening program pilot?",
      "correct": {
        "id": "correct_handoff-template",
        "label": "Completed program screening; missed cancers at follow-up; extra diagnostic visits",
        "rationale": "Completed screening tracks delivery, missed cancers track the program’s diagnostic aim, and extra diagnostic visits check the additional assessment burden."
      },
      "distractors": [
        {
          "id": "d1_handoff-template",
          "label": "Screening invitations sent; screening visits completed; extra diagnostic visits",
          "rationale": "Invitations and completed screening visits both track program activity. This set does not measure missed cancers, the stated clinical aim."
        },
        {
          "id": "d2_handoff-template",
          "label": "Completed program screening; extra diagnostic visits; missed cancers at follow-up",
          "rationale": "Extra diagnostic visits check burden, while missed cancers measure the aim. This ordering swaps the outcome and balancing positions."
        },
        {
          "id": "d3_handoff-template",
          "label": "Missed cancers at follow-up; completed program screening; extra diagnostic visits",
          "rationale": "Missed cancers are the outcome and completed screening is process. This set places those two measures in the reverse order requested."
        }
      ],
      "teachingPoint": "Screening activity and screening success need different measures. Completed screens track delivery; missed cancers at follow-up track the stated diagnostic aim; extra diagnostic visits check burden. Remember to count both what the program does and what it misses. Invitation or attendance totals alone do not establish that the clinical aim improved.",
      "explanation": "Use completed program screening as process, missed cancers at follow-up as outcome, and extra diagnostic visits as balance. Attendance counts do not substitute for the diagnostic aim.",
      "exhibit": {
        "kind": "abstract",
        "title": "Investigational clinical pilot — illustrative measurement plan",
        "body": "An authorized pilot of an unnamed investigational lung-cancer screening program for lung-cancer screening aims to improve missed cancers at protocol follow-up. The team is concerned about extra diagnostic visits. This protocol is invented for practice and supplies no real efficacy, diagnostic accuracy or patient-specific prediction."
      },
      "clinicalAnchor": "lung-screening"
    }
  ]
};

// Existing catalog context only; these are not new clinical claims or objectives.
export const CLINICAL_ANCHORS = {
  "venous-ulcer": {
    "label": "Venous leg ulcer",
    "diagnosisKey": "venous-ulcer",
    "storyTerm": "venous leg ulcer",
    "claimIds": [
      "claim.venous-leg-ulcer.arterial-assessment-before-compression",
      "claim.venous-leg-ulcer.compression-after-adequate-arterial-assessment"
    ],
    "sourceLabels": [
      "ESVS 2022 Clinical Practice Guidelines on Chronic Venous Disease of the Lower Limbs"
    ]
  },
  "lactational-abscess": {
    "label": "Lactational breast abscess",
    "diagnosisKey": "lactational-abscess",
    "storyTerm": "lactational breast abscess",
    "claimIds": [
      "claim.lactational-breast-abscess.targeted-ultrasound",
      "claim.lactational-breast-abscess.selected-drainage"
    ],
    "sourceLabels": [
      "ACR Appropriateness Criteria Breast Imaging During Lactation",
      "Academy of Breastfeeding Medicine Clinical Protocol #36: The Mastitis Spectrum, Revised 2022"
    ]
  },
  "burn": {
    "label": "Superficial partial-thickness burn",
    "diagnosisKey": "burn",
    "storyTerm": "superficial partial-thickness burn",
    "claimIds": [
      "claim.burn.superficial-partial-depth"
    ],
    "sourceLabels": [
      "ABA Guidelines for Burn Patient Referral",
      "2024 Guidelines for First Aid"
    ]
  },
  "chronic-fissure": {
    "label": "Chronic anal fissure",
    "diagnosisKey": "chronic-fissure",
    "storyTerm": "chronic anal fissure",
    "claimIds": [
      "claim.chronic-anal-fissure.topical-ccb-first-line"
    ],
    "sourceLabels": [
      "ASCRS Clinical Practice Guidelines for the Management of Anal Fissures",
      "SIUCP guidelines for the management of anal fissure"
    ]
  },
  "hidradenitis": {
    "label": "Hidradenitis suppurativa",
    "diagnosisKey": "hidradenitis",
    "storyTerm": "hidradenitis suppurativa",
    "claimIds": [
      "claim.hs.pattern-recognition",
      "claim.hs.multimodal-planning"
    ],
    "sourceLabels": [
      "Australasian hidradenitis suppurativa management guidelines",
      "North American HS management guidelines Part I"
    ]
  },
  "cutaneous-abscess": {
    "label": "Uncomplicated cutaneous abscess",
    "diagnosisKey": "cutaneous-abscess",
    "storyTerm": "cutaneous abscess",
    "claimIds": [
      "claim.bread-butter.cutaneous-abscess.incision-drainage"
    ],
    "sourceLabels": [
      "Practice Guidelines for the Diagnosis and Management of Skin and Soft Tissue Infections: 2014 Update",
      "Abscess Evaluation"
    ]
  },
  "pilonidal": {
    "label": "Chronic pilonidal sinus disease",
    "diagnosisKey": "pilonidal",
    "storyTerm": "pilonidal disease",
    "claimIds": [
      "claim.pilonidal-disease.chronic-sinus-recognition",
      "claim.pilonidal-disease.off-midline-closure-planning"
    ],
    "sourceLabels": [
      "Consensus statement of the Italian society of colorectal surgery (SICCR): management and treatment of pilonidal disease",
      "Pilonidal Disease"
    ]
  },
  "donor-wound": {
    "label": "Split-thickness skin-graft donor wound",
    "diagnosisKey": "donor-wound",
    "storyTerm": "skin-graft donor wound",
    "claimIds": [
      "claim.gs028f.reconstruction.donor-retained-epithelium"
    ],
    "sourceLabels": [
      "Skin Grafting, Cryopreservation, and Diseases: A Review Article"
    ]
  },
  "diabetic-ulcer": {
    "label": "Clinically uninfected diabetic foot ulcer",
    "diagnosisKey": "diabetic-ulcer",
    "storyTerm": "diabetic foot ulcer",
    "claimIds": [
      "claim.dfu.no-antibiotics-uninfected"
    ],
    "sourceLabels": [
      "IWGDF/IDSA diabetes-related foot infection guideline"
    ]
  },
  "keloid": {
    "label": "Keloid scar",
    "diagnosisKey": "keloid",
    "storyTerm": "keloid",
    "claimIds": [
      "claim.gs028e.scar_extent"
    ],
    "sourceLabels": [
      "Scars"
    ]
  },
  "perianal-abscess": {
    "label": "Acute superficial perianal abscess",
    "diagnosisKey": "perianal-abscess",
    "storyTerm": "perianal abscess",
    "claimIds": [
      "claim.bread-butter.perianal-abscess.prompt-drainage"
    ],
    "sourceLabels": [
      "The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Anorectal Abscess, Fistula-in-Ano, and Rectovaginal Fistula"
    ]
  },
  "ards": {
    "label": "Adult acute respiratory distress syndrome",
    "diagnosisKey": "ards",
    "storyTerm": "ARDS",
    "claimIds": [
      "claim.gs028d.ards.permeability-edema",
      "claim.gs028d.ards.predicted-body-weight-ventilation"
    ],
    "sourceLabels": [
      "ESICM guidelines on acute respiratory distress syndrome: definition, phenotyping and respiratory support strategies"
    ]
  },
  "achalasia": {
    "label": "Achalasia after exclusion of structural obstruction",
    "diagnosisKey": "achalasia",
    "storyTerm": "achalasia",
    "claimIds": [
      "claim.achalasia.high-resolution-manometry",
      "claim.achalasia.manometric-recognition"
    ],
    "sourceLabels": [
      "2019 Seoul Consensus on Esophageal Achalasia Guidelines"
    ]
  },
  "gastroparesis": {
    "label": "Gastroparesis after exclusion of mechanical obstruction",
    "diagnosisKey": "gastroparesis",
    "storyTerm": "gastroparesis",
    "claimIds": [
      "claim.gastroparesis.diagnostic-framework",
      "claim.gastroparesis.four-hour-solid-meal-scintigraphy"
    ],
    "sourceLabels": [
      "ACG Clinical Guideline: Gastroparesis",
      "AGA Clinical Practice Guideline on Management of Gastroparesis",
      "Gastroparesis"
    ]
  },
  "carpal-tunnel": {
    "label": "Carpal tunnel syndrome",
    "diagnosisKey": "carpal-tunnel",
    "storyTerm": "carpal tunnel syndrome",
    "claimIds": [
      "claim.gs028f.nerve.median-carpal-localization",
      "claim.gs028f.nerve.median-wrist-symptoms"
    ],
    "sourceLabels": [
      "Carpal tunnel syndrome"
    ]
  },
  "postherniorrhaphy-pain": {
    "label": "Neuropathic pain after inguinal hernia repair",
    "diagnosisKey": "postherniorrhaphy-pain",
    "storyTerm": "postherniorrhaphy pain",
    "claimIds": [
      "claim.php.recognition"
    ],
    "sourceLabels": [
      "International HerniaSurge guideline update"
    ]
  },
  "graves": {
    "label": "Graves hyperthyroidism",
    "diagnosisKey": "graves",
    "storyTerm": "Graves disease",
    "claimIds": [
      "claim.graves-rai-appropriate-candidate.graves-context",
      "claim.graves-rai-appropriate-candidate.preference-sensitive-options"
    ],
    "sourceLabels": [
      "Graves’ Disease"
    ]
  },
  "hyperparathyroidism": {
    "label": "Primary hyperparathyroidism with renal involvement",
    "diagnosisKey": "hyperparathyroidism",
    "storyTerm": "primary hyperparathyroidism",
    "claimIds": [
      "claim.primary-hyperparathyroidism.biochemical-pattern",
      "claim.primary-hyperparathyroidism.renal-bone-surgery-assessment"
    ],
    "sourceLabels": [
      "Primary Hyperparathyroidism",
      "Hyperparathyroidism Treatment"
    ]
  },
  "adult-neck-mass": {
    "label": "Persistent unexplained adult neck mass",
    "diagnosisKey": "adult-neck-mass",
    "storyTerm": "persistent neck mass",
    "claimIds": [
      "claim.gs028f.neck.adult-lateral-malignancy-evaluation",
      "claim.gs028f.neck.needle-before-open"
    ],
    "sourceLabels": [
      "Head and Neck Cancer: United Kingdom National Multidisciplinary Guidelines, Sixth Edition"
    ]
  },
  "cubital-tunnel": {
    "label": "Cubital tunnel syndrome",
    "diagnosisKey": "cubital-tunnel",
    "storyTerm": "cubital tunnel syndrome",
    "claimIds": [
      "claim.gs028f.nerve.ulnar-cubital-localization"
    ],
    "sourceLabels": [
      "Hand Therapy – Cubital Tunnel Syndrome"
    ]
  },
  "appendix": {
    "label": "Uncomplicated adult appendicitis with appendicolith",
    "diagnosisKey": "appendix",
    "storyTerm": "appendicitis",
    "claimIds": [
      "claim.gs028c.appendicitis.appendicolith-operative-pathway"
    ],
    "sourceLabels": [
      "SAGES guideline for appendicitis",
      "CODA appendicitis evidence update"
    ]
  },
  "gallstones": {
    "label": "Recurrent symptomatic gallstones",
    "diagnosisKey": "gallstones",
    "storyTerm": "gallstones",
    "claimIds": [
      "claim.gallstones.symptomatic-referral"
    ],
    "sourceLabels": [
      "Treatment for Gallstones",
      "Evidence-based clinical practice guidelines for cholelithiasis 2021"
    ]
  },
  "anal-scc": {
    "label": "Biopsy-confirmed localized anal-canal squamous cell carcinoma",
    "diagnosisKey": "anal-scc",
    "storyTerm": "anal-canal SCC",
    "claimIds": [
      "claim.analscc.biopsy-and-explicit-staging",
      "claim.analscc.localized-chemoradiation-referral"
    ],
    "sourceLabels": [
      "Anal Cancer Treatment (PDQ®)–Health Professional Version"
    ]
  },
  "carotid": {
    "label": "Symptomatic severe carotid stenosis",
    "diagnosisKey": "carotid",
    "storyTerm": "carotid stenosis",
    "claimIds": [
      "claim.carotid-stenosis.symptomatic-endarterectomy-selection"
    ],
    "sourceLabels": [
      "Canadian Stroke Best Practice Recommendations: Management of Extracranial Carotid Disease and Intracranial Atherosclerosis",
      "European Stroke Organisation guideline on endarterectomy and stenting for carotid artery stenosis"
    ]
  },
  "gist": {
    "label": "Gastric gastrointestinal stromal tumor",
    "diagnosisKey": "gist",
    "storyTerm": "gastric GIST",
    "claimIds": [
      "claim.gastric-gist.selected-eus-core-molecular-testing"
    ],
    "sourceLabels": [
      "2023 GEIS Guidelines for gastrointestinal stromal tumors",
      "Gastrointestinal Stromal Tumors Treatment (PDQ®), Health Professional Version"
    ]
  },
  "rectal-prolapse": {
    "label": "External full-thickness rectal prolapse",
    "diagnosisKey": "rectal-prolapse",
    "storyTerm": "rectal prolapse",
    "claimIds": [
      "claim.brief.rectal-prolapse.surgical-referral"
    ],
    "sourceLabels": [
      "Clinical Practice Guidelines for the Treatment of Rectal Prolapse"
    ]
  },
  "ectopic": {
    "label": "Suspected ectopic pregnancy",
    "diagnosisKey": "ectopic",
    "storyTerm": "ectopic pregnancy",
    "claimIds": [
      "claim.gs028f.ectopic.hcg-does-not-locate",
      "claim.gs028f.ectopic.symptoms-require-assessment"
    ],
    "sourceLabels": [
      "Early pregnancy loss",
      "Pregnancy Test",
      "Ectopic Pregnancy",
      "Ectopic pregnancy"
    ]
  },
  "contact-dermatitis": {
    "label": "Confirmed allergic contact dermatitis",
    "diagnosisKey": "contact-dermatitis",
    "storyTerm": "allergic contact dermatitis",
    "claimIds": [
      "claim.gs028e.type_iv"
    ],
    "sourceLabels": [
      "Immunopathogenesis and immunoregulatory mechanisms in allergic contact dermatitis",
      "Immunotoxicity Testing Guidance"
    ]
  },
  "inguinal": {
    "label": "Symptomatic reducible inguinal hernia",
    "diagnosisKey": "inguinal",
    "storyTerm": "inguinal hernia",
    "claimIds": [
      "claim.inguinal-hernia.symptomatic-elective-repair"
    ],
    "sourceLabels": [
      "International guidelines for groin hernia management",
      "Inguinal Hernia"
    ]
  },
  "colon": {
    "label": "Localized resectable colon cancer",
    "diagnosisKey": "colon",
    "storyTerm": "colon cancer",
    "claimIds": [
      "claim.colorectal.histology-confirms",
      "claim.colon-cancer.oncologic-regional-resection"
    ],
    "sourceLabels": [
      "Screening Tests to Detect Colorectal Cancer and Polyps",
      "ASCRS Clinical Practice Guidelines for the Management of Colon Cancer",
      "Colon Cancer Treatment (PDQ), Health Professional Version"
    ]
  },
  "ulcer-bleeding": {
    "label": "Peptic ulcer bleeding",
    "diagnosisKey": "ulcer-bleeding",
    "storyTerm": "peptic ulcer bleeding",
    "claimIds": [
      "claim.peptic-ulcer-bleeding.high-risk-stigmata-require-hemostasis"
    ],
    "sourceLabels": [
      "ACG Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding",
      "Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026"
    ]
  },
  "gerd": {
    "label": "Gastroesophageal reflux disease under evaluation",
    "diagnosisKey": "gerd",
    "storyTerm": "reflux disease",
    "claimIds": [
      "claim.early.gerd.off-ppi-reflux-monitoring"
    ],
    "sourceLabels": [
      "ACG Clinical Guideline: Guidelines for the Diagnosis and Management of Gastroesophageal Reflux Disease",
      "How to select patients for antireflux surgery? The ICARUS guidelines"
    ]
  },
  "incisional": {
    "label": "Stable reducible midline incisional hernia",
    "diagnosisKey": "incisional",
    "storyTerm": "incisional hernia",
    "claimIds": [
      "claim.ventral-hernia.elective-pulmonary-optimization"
    ],
    "sourceLabels": [
      "Midline incisional hernia guidelines: the European Hernia Society"
    ]
  },
  "thyroglossal": {
    "label": "Symptomatic thyroglossal duct cyst",
    "diagnosisKey": "thyroglossal",
    "storyTerm": "thyroglossal duct cyst",
    "claimIds": [
      "claim.brief.thyroglossal-duct-cyst.sistrunk-referral"
    ],
    "sourceLabels": [
      "Thyroglossal Duct Cyst Excision"
    ]
  },
  "dvt": {
    "label": "Surgery-provoked proximal deep vein thrombosis",
    "diagnosisKey": "dvt",
    "storyTerm": "postoperative DVT",
    "claimIds": [
      "claim.postoperative-dvt.prompt-venous-duplex"
    ],
    "sourceLabels": [
      "Testing and Diagnosis for Venous Thromboembolism",
      "Venous Thromboembolism: Deep Vein Thrombosis (DVT)"
    ]
  },
  "mh": {
    "label": "Documented malignant-hyperthermia susceptibility",
    "diagnosisKey": "mh",
    "storyTerm": "malignant-hyperthermia susceptibility",
    "claimIds": [
      "claim.gs028d.mh.trigger-free-plan"
    ],
    "sourceLabels": [
      "JSA guideline for management of malignant hyperthermia in 2025",
      "Perioperative Management of MH Suspected or Susceptible Patients"
    ]
  },
  "breast": {
    "label": "Accessible suspicious solid breast mass",
    "diagnosisKey": "breast",
    "storyTerm": "breast mass",
    "claimIds": [
      "claim.bread-butter.breast-mass.image-guided-core-biopsy"
    ],
    "sourceLabels": [
      "ACR Appropriateness Criteria Palpable Breast Masses: 2022 Update"
    ]
  },
  "h-pylori": {
    "label": "Uncomplicated duodenal ulcer and H. pylori evaluation",
    "diagnosisKey": "h-pylori",
    "storyTerm": "H. pylori",
    "claimIds": [
      "claim.brief.h-pylori.active-infection-testing",
      "claim.brief.h-pylori.test-of-cure-plan"
    ],
    "sourceLabels": [
      "ACG Clinical Guideline: Treatment of Helicobacter pylori Infection",
      "Peptic Ulcer Disease"
    ]
  },
  "cutaneous-scc": {
    "label": "Suspected or confirmed cutaneous squamous cell carcinoma",
    "diagnosisKey": "cutaneous-scc",
    "storyTerm": "cutaneous SCC",
    "claimIds": [
      "claim.cutaneous-scc.biopsy-for-diagnosis-and-risk",
      "claim.cutaneous-scc.risk-directed-surgery"
    ],
    "sourceLabels": [
      "Guidelines of care for the management of cutaneous squamous cell carcinoma",
      "Choosing Wisely recommendations"
    ]
  },
  "ptld": {
    "label": "Suspected post-transplant lymphoproliferative disorder",
    "diagnosisKey": "ptld",
    "storyTerm": "post-transplant lymphoproliferative disorder",
    "claimIds": [
      "claim.ptld.pattern",
      "claim.ptld.tissue"
    ],
    "sourceLabels": [
      "AST PTLD and EBV guideline",
      "Comprehensive review of PTLD after solid organ transplantation"
    ]
  },
  "pigmented-lesion": {
    "label": "Small accessible pigmented lesion concerning for melanoma",
    "diagnosisKey": "pigmented-lesion",
    "storyTerm": "pigmented lesion",
    "claimIds": [
      "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
    ],
    "sourceLabels": [
      "Melanoma Treatment (PDQ), Health Professional Version",
      "Melanoma clinical guideline (Guideline highlights)"
    ]
  },
  "pancreatic-cancer": {
    "label": "Resectable pancreatic body or tail adenocarcinoma",
    "diagnosisKey": "pancreatic-cancer",
    "storyTerm": "pancreatic tail cancer",
    "claimIds": [
      "claim.pancreatic-adenocarcinoma.body-tail-distal-pancreatectomy"
    ],
    "sourceLabels": [
      "Multidisciplinary consensus statement on the clinical management of patients with pancreatic cancer",
      "Pancreatic Cancer Treatment (PDQ): Health Professional Version"
    ]
  },
  "thyroid-nodule": {
    "label": "Suspicious thyroid nodule meeting biopsy criteria",
    "diagnosisKey": "thyroid-nodule",
    "storyTerm": "thyroid nodule",
    "claimIds": [
      "claim.thyroid-nodule.fna-after-selected-ultrasound"
    ],
    "sourceLabels": [
      "Thyroid Nodules"
    ]
  },
  "aldosteronism": {
    "label": "Primary aldosteronism",
    "diagnosisKey": "aldosteronism",
    "storyTerm": "primary aldosteronism",
    "claimIds": [
      "claim.primary-aldosteronism.prepared-arr-screening"
    ],
    "sourceLabels": [
      "Primary Aldosteronism: An Endocrine Society Clinical Practice Guideline"
    ]
  },
  "cholecystitis": {
    "label": "Acute calculous cholecystitis in a fit adult",
    "diagnosisKey": "cholecystitis",
    "storyTerm": "cholecystitis",
    "claimIds": [
      "claim.gs028c.cholecystitis.index-admission-cholecystectomy"
    ],
    "sourceLabels": [
      "WSES acute calculous cholecystitis guideline"
    ]
  },
  "gastric-cancer": {
    "label": "Resectable proximal gastric adenocarcinoma",
    "diagnosisKey": "gastric-cancer",
    "storyTerm": "gastric adenocarcinoma",
    "claimIds": [
      "claim.gastric-adenocarcinoma.prophylactic-splenectomy-no-survival-benefit"
    ],
    "sourceLabels": [
      "Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach",
      "Japanese Gastric Cancer Treatment Guidelines 2021",
      "Randomized Controlled Trial to Evaluate Splenectomy in Total Gastrectomy for Proximal Gastric Carcinoma"
    ]
  },
  "merkel": {
    "label": "Merkel cell carcinoma",
    "diagnosisKey": "merkel",
    "storyTerm": "Merkel cell carcinoma",
    "claimIds": [
      "claim.gs028g.merkel-cell.integrated-diagnosis"
    ],
    "sourceLabels": [
      "Merkel Cell Carcinoma Treatment (PDQ), Health Professional Version"
    ]
  },
  "marginal-ulcer": {
    "label": "Marginal ulcer after gastric bypass",
    "diagnosisKey": "marginal-ulcer",
    "storyTerm": "marginal ulcer",
    "claimIds": [
      "claim.gs028c.marginal-ulcer.h-pylori"
    ],
    "sourceLabels": [
      "ASMBS marginal-ulcer treatment review"
    ]
  },
  "pneumothorax": {
    "label": "Primary spontaneous pneumothorax",
    "diagnosisKey": "pneumothorax",
    "storyTerm": "spontaneous pneumothorax",
    "claimIds": [
      "claim.gs028d.psp.recurrence-referral"
    ],
    "sourceLabels": [
      "Joint ERS/EACTS/ESTS clinical practice guidelines on adults with spontaneous pneumothorax"
    ]
  },
  "gastric-malt": {
    "label": "Localized low-grade gastric MALT lymphoma associated with H. pylori",
    "diagnosisKey": "gastric-malt",
    "storyTerm": "gastric MALT lymphoma",
    "claimIds": [
      "claim.gastric-malt.hpylori-eradication-initial-localized"
    ],
    "sourceLabels": [
      "Gastric mucosa-associated lymphoid tissue lymphoma and Helicobacter pylori infection: a review of current diagnosis and management",
      "Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View",
      "Guideline for the diagnosis and management of marginal zone lymphomas: A British Society of Haematology Guideline",
      "Indolent B-Cell Non-Hodgkin Lymphoma Treatment (PDQ): Health Professional Version"
    ]
  },
  "meckel": {
    "label": "Symptomatic Meckel diverticulum involving adjacent ileum",
    "diagnosisKey": "meckel",
    "storyTerm": "Meckel diverticulum",
    "claimIds": [
      "claim.meckel-diverticulum.resection-extent-base-and-ileum"
    ],
    "sourceLabels": [
      "Meckel's Diverticulum in Adults: Surgical Concerns",
      "Laparoscopic Management of Perforated Meckel's Diverticulum in Adults",
      "Meckel's diverticulectomy: a multi-centre 19-year retrospective study"
    ]
  },
  "femoral": {
    "label": "Stable reducible femoral hernia",
    "diagnosisKey": "femoral",
    "storyTerm": "femoral hernia",
    "claimIds": [
      "claim.bread-butter.femoral-hernia.timely-repair"
    ],
    "sourceLabels": [
      "International guidelines for groin hernia management"
    ]
  },
  "dcis": {
    "label": "Pure ductal carcinoma in situ",
    "diagnosisKey": "dcis",
    "storyTerm": "DCIS",
    "claimIds": [
      "claim.gs028c.dcis.margin-two-mm"
    ],
    "sourceLabels": [
      "Resource Guide on Breast Cancer Breast Conservation Surgery Margins",
      "DCIS margin consensus guideline"
    ]
  },
  "hcc": {
    "label": "Solitary hepatocellular carcinoma in a favorable resection profile",
    "diagnosisKey": "hcc",
    "storyTerm": "hepatocellular carcinoma",
    "claimIds": [
      "claim.hcc.resection.favorable-compensated-cirrhosis-profile"
    ],
    "sourceLabels": [
      "AASLD Practice Guidance on prevention, diagnosis, and treatment of hepatocellular carcinoma"
    ]
  },
  "bcc": {
    "label": "Basal cell carcinoma",
    "diagnosisKey": "bcc",
    "storyTerm": "basal cell carcinoma",
    "claimIds": [
      "claim.bcc.pattern",
      "claim.bcc.local-invasion"
    ],
    "sourceLabels": [
      "NCI Skin Cancer Treatment PDQ",
      "S2k basal cell carcinoma guideline update"
    ]
  },
  "celiac": {
    "label": "Biopsy-confirmed celiac disease",
    "diagnosisKey": "celiac",
    "storyTerm": "celiac disease",
    "claimIds": [
      "claim.celiac.adult-biopsy",
      "claim.celiac.gluten-free-treatment"
    ],
    "sourceLabels": [
      "Celiac Disease Tests",
      "Diagnosis of Celiac Disease",
      "Treatment for Celiac Disease",
      "Celiac Disease"
    ]
  },
  "ileostomy": {
    "label": "Persistently high-output ileostomy after stabilization",
    "diagnosisKey": "ileostomy",
    "storyTerm": "high-output ileostomy",
    "claimIds": [
      "claim.bread-butter.high-output-ileostomy.renal-electrolyte-magnesium-assessment",
      "claim.bread-butter.high-output-ileostomy.sodium-glucose-oral-rehydration"
    ],
    "sourceLabels": [
      "Managing a High Output Stoma",
      "The Use of Oral Rehydration Solutions for the Management of High Output Stomas and Fistulas"
    ]
  },
  "lung-screening": {
    "label": "Lung-cancer screening in eligible adults",
    "diagnosisKey": "lung-screening",
    "storyTerm": "lung-cancer screening",
    "claimIds": [
      "claim.gs028d.lung-screening.eligibility"
    ],
    "sourceLabels": [
      "Screening for Lung Cancer"
    ]
  },
  "varicose": {
    "label": "Symptomatic axial superficial venous reflux",
    "diagnosisKey": "varicose",
    "storyTerm": "varicose veins",
    "claimIds": [
      "claim.varicose.intervention-referral"
    ],
    "sourceLabels": [
      "SVS/AVF/AVLS varicose veins guideline Part II"
    ]
  },
  "nephrolithiasis": {
    "label": "Recurrent nephrolithiasis",
    "diagnosisKey": "nephrolithiasis",
    "storyTerm": "recurrent kidney stones",
    "claimIds": [
      "claim.nephrolithiasis.recurrent-metabolic"
    ],
    "sourceLabels": [
      "Diagnosis of Kidney Stones",
      "Treatment for Kidney Stones"
    ]
  },
  "enterotomy": {
    "label": "Recognized securely repaired enterotomy during incisional-hernia repair",
    "diagnosisKey": "incisional",
    "storyTerm": "enterotomy",
    "claimIds": [
      "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair"
    ],
    "sourceLabels": [
      "EHS Guidelines on the Management of Primary Ventral and Incisional Hernias Under Emergency Conditions",
      "2017 update of the WSES guidelines for emergency repair of complicated abdominal wall hernias",
      "SAGES guidelines for laparoscopic ventral hernia repair"
    ]
  },
  "breast-cyst": {
    "label": "Painful unequivocally simple breast cyst",
    "diagnosisKey": "breast-cyst",
    "storyTerm": "simple breast cyst",
    "claimIds": [
      "claim.breast-cyst.simple-symptomatic.aspiration"
    ],
    "sourceLabels": [
      "The American Society of Breast Surgeons—Benign Breast Disease: Five Things Physicians and Patients Should Question",
      "Benign Breast Conditions"
    ]
  },
  "dialysis-access": {
    "label": "Arteriovenous dialysis-access dysfunction",
    "diagnosisKey": "dialysis-access",
    "storyTerm": "dialysis-access dysfunction",
    "claimIds": [
      "claim.gs028d.access.dysfunction-referral"
    ],
    "sourceLabels": [
      "UK Kidney Association Clinical Practice Guideline on vascular access for haemodialysis"
    ]
  },
  "barrett": {
    "label": "Biopsy-confirmed Barrett esophagus",
    "diagnosisKey": "barrett",
    "storyTerm": "Barrett esophagus",
    "claimIds": [
      "claim.barrett-esophagus.intestinal-metaplasia"
    ],
    "sourceLabels": [
      "Diagnosis of Barrett's Esophagus",
      "Barrett's Esophagus"
    ]
  },
  "desmoid": {
    "label": "Stable minimally symptomatic desmoid tumor",
    "diagnosisKey": "desmoid",
    "storyTerm": "desmoid tumor",
    "claimIds": [
      "claim.desmoid.initial-active-surveillance-selected-noncritical"
    ],
    "sourceLabels": [
      "Current Management of Desmoid Tumors: A Review",
      "SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024)"
    ]
  },
  "anemia": {
    "label": "Anemia in the perioperative setting",
    "diagnosisKey": "anemia",
    "storyTerm": "perioperative anemia",
    "claimIds": [
      "claim.gs028f.oxygen.anemia-content-limit",
      "claim.gs028f.oxygen.hemoglobin-carriage"
    ],
    "sourceLabels": [
      "NHLBI anemia diagnosis: hemoglobin oxygen carriage",
      "FDA pulse-oximetry executive summary: measurement background"
    ]
  },
  "fhh": {
    "label": "Confirmed uncomplicated familial hypocalciuric hypercalcemia",
    "diagnosisKey": "fhh",
    "storyTerm": "familial hypocalciuric hypercalcemia",
    "claimIds": [
      "claim.fhh.reassurance-observation-avoid-parathyroid-surgery"
    ],
    "sourceLabels": [
      "European expert consensus on practical management of specific aspects of parathyroid disorders in adults and in pregnancy: recommendations of the ESE Educational Program of Parathyroid Disorders (PARAT 2021)",
      "Evaluation and Management of Primary Hyperparathyroidism: Summary Statement and Guidelines from the Fifth International Workshop"
    ]
  },
  "adrenal": {
    "label": "Adrenal incidentaloma",
    "diagnosisKey": "adrenal",
    "storyTerm": "adrenal incidentaloma",
    "claimIds": [
      "claim.brief.adrenal-incidentaloma.one-mg-dst"
    ],
    "sourceLabels": [
      "European Society of Endocrinology clinical practice guidelines on the management of adrenal incidentalomas",
      "American Association of Endocrine Surgeons Guidelines for Adrenalectomy: Executive Summary"
    ]
  },
  "mondor": {
    "label": "Uncomplicated Mondor disease",
    "diagnosisKey": "mondor",
    "storyTerm": "Mondor disease",
    "claimIds": [
      "claim.mondor-disease.classic-clinical-phenotype",
      "claim.mondor-disease.supportive-management-and-boundaries"
    ],
    "sourceLabels": [
      "Mondor Disease",
      "Mondor's Disease: A Review of the Literature"
    ]
  },
  "foreign-body": {
    "label": "Confirmed sharp esophageal foreign body",
    "diagnosisKey": "foreign-body",
    "storyTerm": "sharp esophageal foreign body",
    "claimIds": [
      "claim.gs028f.foreign-body.sharp-esophageal-emergency"
    ],
    "sourceLabels": [
      "WSES esophageal emergencies guideline: foreign bodies",
      "ESGE adult upper gastrointestinal foreign-body guideline"
    ]
  },
  "transplant": {
    "label": "Human renal allograft with immunosuppression",
    "diagnosisKey": "transplant",
    "storyTerm": "renal allograft",
    "claimIds": [
      "claim.gs028f.transplant.different-human",
      "claim.gs028f.tacrolimus.t-cell-activation"
    ],
    "sourceLabels": [
      "Definition of allograft",
      "PROGRAF prescribing information: mechanism of action"
    ]
  },
  "asplenia": {
    "label": "Fever with asplenia",
    "diagnosisKey": "asplenia",
    "storyTerm": "fever with asplenia",
    "claimIds": [
      "claim.asplenia.fever-immediate-emergency-care"
    ],
    "sourceLabels": [
      "Fever in Patients with Impaired Spleen Function"
    ]
  },
  "allergy-label": {
    "label": "Unverified preoperative penicillin-allergy label",
    "diagnosisKey": "allergy-label",
    "storyTerm": "penicillin-allergy label",
    "claimIds": [
      "claim.variety3.allergy.label-not-confirmation",
      "claim.variety3.allergy.characterize-reaction"
    ],
    "sourceLabels": [
      "Clinical Features of Penicillin Allergy",
      "Management of Penicillin Allergy in the Perioperative Setting"
    ]
  },
  "child-groin": {
    "label": "Childhood intermittent groin bulge concerning for inguinal hernia",
    "diagnosisKey": "inguinal",
    "storyTerm": "inguinal hernia",
    "claimIds": [
      "claim.pediatric-clinic.dynamic-groin-bulge",
      "claim.pediatric-clinic.clinical-groin-hernia-referral"
    ],
    "sourceLabels": [
      "Hernia",
      "Paediatric Surgery"
    ]
  },
  "child-node": {
    "label": "Uncomplicated reactive childhood cervical lymphadenopathy",
    "diagnosisKey": "child-node",
    "storyTerm": "reactive cervical nodes",
    "claimIds": [
      "claim.pediatric-clinic.reactive-child-neck-nodes",
      "claim.pediatric-clinic.well-child-node-observation"
    ],
    "sourceLabels": [
      "Cervical Lymphadenopathy in Children"
    ]
  }
} as const;
export type ClinicalAnchorKey = keyof typeof CLINICAL_ANCHORS;

export const STATISTICS_CLINICAL_ANCHOR_BY_QUESTION = Object.fromEntries(
  Object.entries(STATISTICS_VARIANTS).flatMap(([topic, variants]) => variants.map((variant, index) => [
    `${topic === "pdsa-act" ? "question.quality-improvement.pdsa-act-and-iterate" : `question.statistics-ethics.${topic}`}.v${index + 1}`,
    variant.clinicalAnchor,
  ])),
) as Record<string, ClinicalAnchorKey>;

// Editorial registry: repeated premises share one key across diagnoses.
export const RESEARCH_PREMISES = {
  "compression-device": {
    "label": "Compression device",
    "kind": "device"
  },
  "topical-agent": {
    "label": "Topical wound or skin agent",
    "kind": "drug"
  },
  "burn-dressing": {
    "label": "Burn cooling dressing",
    "kind": "device"
  },
  "abscess-irrigator": {
    "label": "Abscess irrigation instrument",
    "kind": "device"
  },
  "pilonidal-excision": {
    "label": "Pilonidal excision or closure technique",
    "kind": "technique"
  },
  "donor-dressing": {
    "label": "Skin-graft donor-site dressing",
    "kind": "device"
  },
  "offloading-device": {
    "label": "Diabetic-ulcer offloading device",
    "kind": "device"
  },
  "scar-agent": {
    "label": "Injectable scar preparation",
    "kind": "drug"
  },
  "abscess-drain": {
    "label": "Abscess drainage adjunct",
    "kind": "device"
  },
  "ventilation": {
    "label": "Ventilation technique for ARDS",
    "kind": "technique"
  },
  "achalasia-endoscopy": {
    "label": "Endoscopic technique for achalasia",
    "kind": "technique"
  },
  "prokinetic": {
    "label": "Gastric motility agent",
    "kind": "drug"
  },
  "wrist-brace": {
    "label": "Wrist-bracing device",
    "kind": "device"
  },
  "nerve-block": {
    "label": "Targeted nerve-block delivery device",
    "kind": "device"
  },
  "thyroid-agent": {
    "label": "Thyroid-directed agent",
    "kind": "drug"
  },
  "calcium-agent": {
    "label": "Calcium-lowering agent",
    "kind": "drug"
  },
  "neck-biopsy": {
    "label": "Neck needle-biopsy technique",
    "kind": "technique"
  },
  "elbow-brace": {
    "label": "Elbow-bracing device",
    "kind": "device"
  },
  "appendix-technique": {
    "label": "Appendectomy technique",
    "kind": "technique"
  },
  "gallbladder-instrument": {
    "label": "Gallbladder dissection instrument",
    "kind": "device"
  },
  "anal-radiation": {
    "label": "Anal-cancer radiation delivery device",
    "kind": "device"
  },
  "carotid-monitor": {
    "label": "Carotid-operation monitoring device",
    "kind": "device"
  },
  "gist-instrument": {
    "label": "GIST resection instrument",
    "kind": "device"
  },
  "prolapse-fixation": {
    "label": "Rectal-prolapse fixation technique",
    "kind": "technique"
  },
  "early-pregnancy-pathway": {
    "label": "Early-pregnancy diagnostic pathway",
    "kind": "care pathway"
  },
  "barrier-film": {
    "label": "Skin barrier film for contact dermatitis",
    "kind": "device"
  },
  "hernia-reinforcement": {
    "label": "Hernia reinforcement material or technique",
    "kind": "device"
  },
  "oncology-biologic": {
    "label": "Cancer recurrence-prevention biologic",
    "kind": "drug"
  },
  "hemostasis-device": {
    "label": "Endoscopic hemostasis device",
    "kind": "device"
  },
  "reflux-test": {
    "label": "Wearable reflux assessment device",
    "kind": "test"
  },
  "cyst-dissection": {
    "label": "Thyroglossal-cyst dissection technique",
    "kind": "technique"
  },
  "calf-stimulation": {
    "label": "Calf-stimulation device",
    "kind": "device"
  },
  "anesthesia-monitor": {
    "label": "Anesthesia monitoring sensor",
    "kind": "device"
  },
  "blood-test": {
    "label": "Diagnostic or screening blood test",
    "kind": "test"
  },
  "breath-test": {
    "label": "Active-infection breath test",
    "kind": "test"
  },
  "optical-test": {
    "label": "Optical skin-lesion test",
    "kind": "test"
  },
  "urine-test": {
    "label": "Urinary adrenal-disease assay",
    "kind": "test"
  },
  "anastomosis": {
    "label": "Bowel anastomosis technique or instrument",
    "kind": "technique"
  },
  "ulcer-agent": {
    "label": "Marginal-ulcer protective agent",
    "kind": "drug"
  },
  "pleural-device": {
    "label": "Pleural recurrence-prevention device",
    "kind": "device"
  },
  "pancreatic-radiation": {
    "label": "Pancreatic-cancer radiation delivery technique",
    "kind": "technique"
  },
  "lymphoma-agent": {
    "label": "Gastric lymphoma recurrence-prevention agent",
    "kind": "drug"
  },
  "dcis-device": {
    "label": "Local DCIS treatment device",
    "kind": "device"
  },
  "hepatic-instrument": {
    "label": "Hepatic resection instrument",
    "kind": "device"
  },
  "celiac-pathway": {
    "label": "Dietitian care pathway for celiac disease",
    "kind": "care pathway"
  },
  "nutrition-pathway": {
    "label": "Nutrition care pathway for gastroparesis",
    "kind": "care pathway"
  },
  "rehydration-device": {
    "label": "Ileostomy rehydration delivery device",
    "kind": "device"
  },
  "hs-dressing": {
    "label": "Hidradenitis dressing device",
    "kind": "device"
  },
  "lung-program": {
    "label": "Lung-cancer screening program",
    "kind": "screening program"
  },
  "barrett-test": {
    "label": "Optical Barrett-esophagus study test",
    "kind": "test"
  },
  "desmoid-agent": {
    "label": "Desmoid-tumor study agent",
    "kind": "drug"
  },
  "anemia-pathway": {
    "label": "Perioperative anemia assessment pathway",
    "kind": "care pathway"
  },
  "reflux-delivery": {
    "label": "Reflux treatment delivery device",
    "kind": "device"
  },
  "carpal-pathway": {
    "label": "Wrist-bracing care pathway",
    "kind": "care pathway"
  }
} as const;
export const RESEARCH_PREMISE_BY_QUESTION: Record<string, keyof typeof RESEARCH_PREMISES | null> = {
  "question.statistics-ethics.independent-t.v1": "compression-device",
  "question.statistics-ethics.independent-t.v2": "topical-agent",
  "question.statistics-ethics.independent-t.v3": "burn-dressing",
  "question.statistics-ethics.independent-t.v4": "topical-agent",
  "question.statistics-ethics.paired-t.v1": "topical-agent",
  "question.statistics-ethics.paired-t.v2": "abscess-irrigator",
  "question.statistics-ethics.paired-t.v3": "pilonidal-excision",
  "question.statistics-ethics.paired-t.v4": "donor-dressing",
  "question.statistics-ethics.one-way-anova.v1": "offloading-device",
  "question.statistics-ethics.one-way-anova.v2": "scar-agent",
  "question.statistics-ethics.one-way-anova.v3": "abscess-drain",
  "question.statistics-ethics.one-way-anova.v4": "ventilation",
  "question.statistics-ethics.rank-sum.v1": "achalasia-endoscopy",
  "question.statistics-ethics.rank-sum.v2": "prokinetic",
  "question.statistics-ethics.rank-sum.v3": "wrist-brace",
  "question.statistics-ethics.rank-sum.v4": "nerve-block",
  "question.statistics-ethics.signed-rank.v1": "thyroid-agent",
  "question.statistics-ethics.signed-rank.v2": "calcium-agent",
  "question.statistics-ethics.signed-rank.v3": "neck-biopsy",
  "question.statistics-ethics.signed-rank.v4": "elbow-brace",
  "question.statistics-ethics.chi-square.v1": "appendix-technique",
  "question.statistics-ethics.chi-square.v2": "gallbladder-instrument",
  "question.statistics-ethics.chi-square.v3": "anal-radiation",
  "question.statistics-ethics.chi-square.v4": "carotid-monitor",
  "question.statistics-ethics.fisher-exact.v1": "gist-instrument",
  "question.statistics-ethics.fisher-exact.v2": "prolapse-fixation",
  "question.statistics-ethics.fisher-exact.v3": "early-pregnancy-pathway",
  "question.statistics-ethics.fisher-exact.v4": "barrier-film",
  "question.statistics-ethics.study-design.v1": "hernia-reinforcement",
  "question.statistics-ethics.study-design.v2": "oncology-biologic",
  "question.statistics-ethics.study-design.v3": "hemostasis-device",
  "question.statistics-ethics.study-design.v4": "reflux-test",
  "question.statistics-ethics.bias-confounding.v1": "hernia-reinforcement",
  "question.statistics-ethics.bias-confounding.v2": "cyst-dissection",
  "question.statistics-ethics.bias-confounding.v3": "calf-stimulation",
  "question.statistics-ethics.bias-confounding.v4": "anesthesia-monitor",
  "question.statistics-ethics.sensitivity-specificity.v1": "blood-test",
  "question.statistics-ethics.sensitivity-specificity.v2": "breath-test",
  "question.statistics-ethics.sensitivity-specificity.v3": "optical-test",
  "question.statistics-ethics.sensitivity-specificity.v4": "blood-test",
  "question.statistics-ethics.predictive-value-prevalence.v1": "optical-test",
  "question.statistics-ethics.predictive-value-prevalence.v2": "blood-test",
  "question.statistics-ethics.predictive-value-prevalence.v3": "blood-test",
  "question.statistics-ethics.predictive-value-prevalence.v4": "urine-test",
  "question.statistics-ethics.risk-ratio-odds-ratio.v1": "gallbladder-instrument",
  "question.statistics-ethics.risk-ratio-odds-ratio.v2": "anastomosis",
  "question.statistics-ethics.risk-ratio-odds-ratio.v3": "oncology-biologic",
  "question.statistics-ethics.risk-ratio-odds-ratio.v4": "ulcer-agent",
  "question.statistics-ethics.arr-nnt.v1": "oncology-biologic",
  "question.statistics-ethics.arr-nnt.v2": "topical-agent",
  "question.statistics-ethics.arr-nnt.v3": "pleural-device",
  "question.statistics-ethics.arr-nnt.v4": "oncology-biologic",
  "question.statistics-ethics.p-value.v1": "gallbladder-instrument",
  "question.statistics-ethics.p-value.v2": "prolapse-fixation",
  "question.statistics-ethics.p-value.v3": "lymphoma-agent",
  "question.statistics-ethics.p-value.v4": "anastomosis",
  "question.statistics-ethics.confidence-interval.v1": "hernia-reinforcement",
  "question.statistics-ethics.confidence-interval.v2": "pilonidal-excision",
  "question.statistics-ethics.confidence-interval.v3": "abscess-drain",
  "question.statistics-ethics.confidence-interval.v4": "oncology-biologic",
  "question.statistics-ethics.errors-power.v1": "dcis-device",
  "question.statistics-ethics.errors-power.v2": "hepatic-instrument",
  "question.statistics-ethics.errors-power.v3": "pancreatic-radiation",
  "question.statistics-ethics.errors-power.v4": "topical-agent",
  "question.quality-improvement.pdsa-act-and-iterate.v1": "celiac-pathway",
  "question.quality-improvement.pdsa-act-and-iterate.v2": "compression-device",
  "question.quality-improvement.pdsa-act-and-iterate.v3": "nutrition-pathway",
  "question.quality-improvement.pdsa-act-and-iterate.v4": "carpal-pathway",
  "question.statistics-ethics.qi-measures.v1": "rehydration-device",
  "question.statistics-ethics.qi-measures.v2": "hs-dressing",
  "question.statistics-ethics.qi-measures.v3": "pleural-device",
  "question.statistics-ethics.qi-measures.v4": "lung-program",
  "question.statistics-ethics.qualified-interpreter.v1": null,
  "question.statistics-ethics.qualified-interpreter.v2": null,
  "question.statistics-ethics.qualified-interpreter.v3": null,
  "question.statistics-ethics.qualified-interpreter.v4": null,
  "question.statistics-ethics.informed-consent.v1": null,
  "question.statistics-ethics.informed-consent.v2": null,
  "question.statistics-ethics.informed-consent.v3": null,
  "question.statistics-ethics.informed-consent.v4": null,
  "question.statistics-ethics.capacity-refusal.v1": null,
  "question.statistics-ethics.capacity-refusal.v2": null,
  "question.statistics-ethics.capacity-refusal.v3": null,
  "question.statistics-ethics.capacity-refusal.v4": null,
  "question.statistics-ethics.surrogate-decisions.v1": null,
  "question.statistics-ethics.surrogate-decisions.v2": null,
  "question.statistics-ethics.surrogate-decisions.v3": null,
  "question.statistics-ethics.surrogate-decisions.v4": null,
  "question.statistics-ethics.perioperative-dnr.v1": null,
  "question.statistics-ethics.perioperative-dnr.v2": null,
  "question.statistics-ethics.perioperative-dnr.v3": null,
  "question.statistics-ethics.perioperative-dnr.v4": null,
  "question.statistics-ethics.error-disclosure.v1": null,
  "question.statistics-ethics.error-disclosure.v2": null,
  "question.statistics-ethics.error-disclosure.v3": null,
  "question.statistics-ethics.error-disclosure.v4": null,
  "question.statistics-ethics.impaired-colleague.v1": null,
  "question.statistics-ethics.impaired-colleague.v2": null,
  "question.statistics-ethics.impaired-colleague.v3": null,
  "question.statistics-ethics.impaired-colleague.v4": null,
  "question.statistics-ethics.research-consent.v1": "oncology-biologic",
  "question.statistics-ethics.research-consent.v2": "barrett-test",
  "question.statistics-ethics.research-consent.v3": "desmoid-agent",
  "question.statistics-ethics.research-consent.v4": "topical-agent",
  "question.statistics-ethics.qi-versus-research.v1": "anemia-pathway",
  "question.statistics-ethics.qi-versus-research.v2": "reflux-delivery",
  "question.statistics-ethics.qi-versus-research.v3": null,
  "question.statistics-ethics.qi-versus-research.v4": "anesthesia-monitor",
  "question.statistics-ethics.confidentiality.v1": null,
  "question.statistics-ethics.confidentiality.v2": null,
  "question.statistics-ethics.confidentiality.v3": null,
  "question.statistics-ethics.confidentiality.v4": null,
  "question.gs028f.outcomes.rca-versus-fmea-purpose.v1": null,
  "question.gs028f.outcomes.rca-versus-fmea-purpose.v2": null,
  "question.gs028f.outcomes.rca-versus-fmea-purpose.v3": null,
  "question.gs028f.outcomes.rca-versus-fmea-purpose.v4": null,
  "question.pediatric-clinic.child-asks-about-examination.v1": null,
  "question.pediatric-clinic.child-wants-plan-explained.v2": null
};
