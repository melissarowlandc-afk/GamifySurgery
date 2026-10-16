import { buildFamily } from "./family-builder";
import { variants } from "./spec-utils";
import { SOURCES } from "./source-catalog";

const CT = "timing.test.ct";
const CTA = "timing.test.ct_angiography";
const MRI = "timing.test.mri";
const US = "timing.test.ultrasound";
const NUCLEAR = "timing.test.nuclear_imaging";

const APPENDICITIS = buildFamily({
  slug: "appendicitis",
  label: "Acute appendicitis",
  sources: [SOURCES.sagesAppendix, SOURCES.wsesAppendix, SOURCES.pcoriCoda],
  claims: [
    {
      id: "claim.gs028c.appendicitis.ct-after-nondiagnostic-us",
      statement:
        "For a hemodynamically stable, nonpregnant adult with ongoing diagnostic uncertainty after a nondiagnostic ultrasound, CT is an appropriate definitive imaging study for suspected appendicitis when MRI is not readily available.",
      sourceIds: [SOURCES.sagesAppendix.id, SOURCES.wsesAppendix.id],
      category: "evaluation",
      certainty: "moderate",
      limitation:
        "Ultrasound is a reasonable first study, and MRI is also definitive; each authored scenario therefore specifies a nondiagnostic ultrasound and lack of timely MRI access.",
      population:
        "Hemodynamically stable, nonpregnant adults with suspected appendicitis, persistent uncertainty after nondiagnostic ultrasound, and no timely MRI access.",
    },
    {
      id: "claim.gs028c.appendicitis.appendicolith-risk",
      statement:
        "Among adults choosing antibiotics for imaging-confirmed uncomplicated appendicitis, an appendicolith is associated with a greater chance of complications or later appendectomy than no appendicolith.",
      sourceIds: [SOURCES.pcoriCoda.id, SOURCES.wsesAppendix.id],
      category: "safety_boundary",
      certainty: "moderate",
      limitation:
        "This risk modifier informs shared decision-making and is not an absolute prohibition on nonoperative care.",
      population:
        "Adults with imaging-confirmed uncomplicated appendicitis who are considering an antibiotics-first strategy.",
    },
    {
      id: "claim.gs028c.appendicitis.appendicolith-operative-pathway",
      statement:
        "For an otherwise fit adult with uncomplicated appendicitis and an appendicolith, hospital surgical evaluation for appendectomy is favored over a routine antibiotics-only pathway.",
      sourceIds: [SOURCES.sagesAppendix.id, SOURCES.pcoriCoda.id],
      category: "management",
      certainty: "moderate",
      limitation:
        "The SAGES recommendation for operative management is conditional, and patient circumstances and preferences still require shared decision-making.",
      population:
        "Otherwise fit adults with imaging-confirmed uncomplicated appendicitis containing an appendicolith.",
    },
  ],
  concepts: [
    {
      id: "concept.appendicitis.stable-adult-ct",
      displayName: "CT for uncertain adult appendicitis",
      learningObjective:
        "Select CT for a stable nonpregnant adult with persistent appendicitis concern after nondiagnostic ultrasound when timely MRI is unavailable.",
      stage: 0,
      educationalTier: 0,
      conceptType: "workup",
      evidenceClaimIds: ["claim.gs028c.appendicitis.ct-after-nondiagnostic-us"],
      variants: variants([
        {
          slug: "nondiagnostic-ultrasound",
          complaint: "Right lower pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents to the clinic with focal right-lower-quadrant pain, anorexia, and localized tenderness. Vital signs are stable. Pregnancy testing is negative, ultrasound did not visualize the appendix or an alternative cause, and timely MRI is unavailable.",
          stem:
            "Which next imaging study should the receiving acute-care team use to evaluate this patient's suspected appendicitis?",
          correct: [
            "Abdominopelvic CT",
            "CT provides definitive cross-sectional evaluation after the nondiagnostic ultrasound in this stable nonpregnant adult.",
          ],
          wrong: [
            [
              "Right-lower-quadrant ultrasound",
              "Repeating the same nondiagnostic modality is less likely to resolve this adult's persistent diagnostic uncertainty.",
              { timingProfileId: US },
            ],
            [
              "Abdominal and pelvic MRI",
              "MRI can be definitive, but waiting for unavailable prompt MRI would delay the acute evaluation in this setting.",
              { timingProfileId: MRI },
            ],
            [
              "Plain abdominal radiographs",
              "Plain radiographs do not provide the definitive appendiceal or alternative-diagnosis assessment needed here.",
              { timingProfileId: "timing.test.radiography" },
            ],
          ],
          explanation:
            "Persistent uncertainty after nondiagnostic ultrasound in a stable nonpregnant adult warrants definitive cross-sectional imaging; with timely MRI unavailable, select CT of the abdomen and pelvis.",
          claims: ["claim.gs028c.appendicitis.ct-after-nondiagnostic-us"],
          acuity: "urgent",
          ageYears: [32, 46],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 94,
            systolicBloodPressureMmHg: 122,
            diastolicBloodPressureMmHg: 76,
            temperatureF: 99.6,
            oxygenSaturationPercent: 99,
          },
          test: { timingProfileId: CT },
        },
        {
          slug: "atypical-older-adult",
          complaint: "New abdominal pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, comes to the clinic with new lower-abdominal pain and maximal tenderness on the right. Hemodynamics are normal, pregnancy is not possible, and ultrasound was nondiagnostic because of overlying bowel gas. The local hospital cannot provide prompt MRI.",
          stem:
            "Which next imaging study best evaluates suspected appendicitis and alternative acute abdominal diagnoses in this stable adult?",
          correct: [
            "Abdominopelvic CT",
            "CT evaluates both the appendix and important competing diagnoses after an inconclusive ultrasound.",
          ],
          wrong: [
            [
              "Abdominal ultrasound",
              "The bowel-gas limitation has already made ultrasound inconclusive in this ongoing acute presentation.",
              { timingProfileId: US },
            ],
            [
              "Abdominal and pelvic MRI",
              "MRI can be definitive, but prompt MRI is unavailable in the stated acute-care pathway.",
              { timingProfileId: MRI },
            ],
            [
              "Plain abdominal radiographs",
              "Plain radiographs do not provide a definitive appendiceal assessment or broad acute differential evaluation.",
              { timingProfileId: "timing.test.radiography" },
            ],
          ],
          explanation:
            "CT is the appropriate definitive study when appendicitis remains possible after inconclusive ultrasound and timely MRI is unavailable in a stable nonpregnant adult.",
          claims: ["claim.gs028c.appendicitis.ct-after-nondiagnostic-us"],
          acuity: "urgent",
          ageYears: [58, 71],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 90,
            systolicBloodPressureMmHg: 128,
            diastolicBloodPressureMmHg: 72,
            temperatureF: 99.4,
            oxygenSaturationPercent: 98,
          },
          test: { timingProfileId: CT },
        },
        {
          slug: "equivocal-exam",
          complaint: "Pain moved right",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents to the clinic with central abdominal pain that migrated to the right lower quadrant. Examination is concerning but not diagnostic, ultrasound is nondiagnostic, pregnancy testing is negative, and MRI is not promptly available. The patient is stable without diffuse peritonitis.",
          stem:
            "Which next imaging study should evaluate this stable adult for suspected appendicitis and competing acute diagnoses?",
          correct: [
            "Abdominopelvic CT",
            "CT is the available definitive study for suspected adult appendicitis after nondiagnostic ultrasound.",
          ],
          wrong: [
            [
              "Graded-compression ultrasound",
              "Another ultrasound does not address why the appendix remained unseen and would prolong the uncertainty.",
              { timingProfileId: US },
            ],
            [
              "Plain abdominal radiographs",
              "Plain radiographs do not provide a definitive appendiceal assessment in this scenario.",
              { timingProfileId: "timing.test.radiography" },
            ],
            [
              "Abdominal and pelvic MRI",
              "MRI can be definitive, but prompt MRI is unavailable in the stated acute-care pathway.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "Migration and focal tenderness keep appendicitis in the differential. After nondiagnostic ultrasound, CT is the available definitive study for this stable nonpregnant adult.",
          claims: ["claim.gs028c.appendicitis.ct-after-nondiagnostic-us"],
          acuity: "urgent",
          ageYears: [27, 39],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 96,
            systolicBloodPressureMmHg: 116,
            diastolicBloodPressureMmHg: 70,
            temperatureF: 100.0,
            oxygenSaturationPercent: 99,
          },
          test: { timingProfileId: CT },
        },
        {
          slug: "competing-diagnoses",
          complaint: "Lower abdominal pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable.",
          stem:
            "Which next imaging study best evaluates both appendicitis and the competing acute diagnoses in this patient?",
          correct: [
            "Abdominopelvic CT",
            "CT provides the needed definitive cross-sectional evaluation of the appendix and alternative acute causes.",
          ],
          wrong: [
            [
              "Plain abdominal radiographs",
              "Plain radiographs cannot localize the cause of these ongoing focal abdominal findings.",
              { timingProfileId: "timing.test.radiography" },
            ],
            [
              "Focused abdominal ultrasound",
              "The focused ultrasound is already inconclusive and does not resolve the broader differential here.",
              { timingProfileId: US },
            ],
            [
              "Abdominal and pelvic MRI",
              "MRI can be definitive, but prompt MRI is unavailable in the stated acute-care pathway.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "For stable nonpregnant adults with persistent concern after inconclusive ultrasound, CT supplies definitive acute evaluation when prompt MRI is unavailable.",
          claims: ["claim.gs028c.appendicitis.ct-after-nondiagnostic-us"],
          acuity: "urgent",
          ageYears: [44, 63],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 92,
            systolicBloodPressureMmHg: 124,
            diastolicBloodPressureMmHg: 78,
            temperatureF: 99.8,
            oxygenSaturationPercent: 98,
          },
          test: { timingProfileId: CT },
        },
      ]),
    },
    {
      id: "concept.appendicitis.appendicolith-operative-pathway",
      displayName: "Appendicolith and appendicitis treatment",
      learningObjective:
        "Recognize an appendicolith as a risk modifier that favors operative hospital care over a routine antibiotics-only pathway while preserving shared decision-making.",
      stage: 0,
      educationalTier: 1,
      conceptType: "management",
      evidenceClaimIds: [
        "claim.gs028c.appendicitis.appendicolith-risk",
        "claim.gs028c.appendicitis.appendicolith-operative-pathway",
      ],
      variants: variants([
        {
          slug: "ct-confirmed-appendicolith",
          complaint: "Appendix CT result",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, brings a same-day outside CT report to the clinic confirming uncomplicated acute appendicitis with an appendicolith. There is no abscess or perforation, and the patient is fit for surgery.",
          stem:
            "Which appendicitis treatment recommendation best accounts for this patient's appendicolith?",
          correct: [
            "Hospital appendectomy pathway",
            "The appendicolith increases the risk of an antibiotics-first pathway and favors operative management in this fit patient.",
          ],
          wrong: [
            [
              "Use hospital antibiotics-first care",
              "An antibiotics-only option requires careful shared decision-making and is less favored when an appendicolith is present.",
            ],
            [
              "Use outpatient antibiotics-first care",
              "Outpatient antibiotics-first care underweights the appendicolith-associated risk in this fit patient.",
            ],
            [
              "Plan interval appendectomy after antibiotics",
              "Routine interval planning accepts an avoidable failure or recurrence risk despite a current operative opportunity.",
            ],
          ],
          explanation:
            "An appendicolith predicts a less favorable antibiotics-first course. For this fit adult, favor appendectomy while explaining that treatment choices still involve patient-specific shared decision-making.",
          claims: [
            "claim.gs028c.appendicitis.appendicolith-risk",
            "claim.gs028c.appendicitis.appendicolith-operative-pathway",
          ],
          acuity: "urgent",
          ageYears: [29, 41],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "asks-for-antibiotics",
          complaint: "Can I avoid surgery?",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, arrives at the clinic with a same-day outside CT confirming uncomplicated appendicitis containing an appendicolith. The patient is an operative candidate and asks whether antibiotics have the same expected course as appendectomy.",
          stem:
            "Which treatment plan is most appropriate for this stable adult with appendicitis and an appendicolith?",
          correct: [
            "Appendectomy after shared discussion",
            "Operative care is favored because an appendicolith raises the chance of complications or later appendectomy with antibiotics-first care.",
          ],
          wrong: [
            [
              "Recommend antibiotics as equivalent treatment",
              "The appendicolith makes equivalent-course counseling inaccurate even though antibiotics can still be discussed.",
            ],
            [
              "Prohibit any antibiotics-first discussion",
              "The evidence supports counseling about increased risk, not an absolute ban on discussing a nonoperative option.",
            ],
            [
              "Defer treatment until symptoms recur",
              "This is active acute appendicitis that requires a hospital treatment decision now, before recurrence or progression.",
            ],
          ],
          explanation:
            "Explain that antibiotics-first care remains a preference-sensitive option in selected cases, but an appendicolith increases adverse-course and later-operation risk, so operative hospital care is favored.",
          claims: [
            "claim.gs028c.appendicitis.appendicolith-risk",
            "claim.gs028c.appendicitis.appendicolith-operative-pathway",
          ],
          acuity: "urgent",
          ageYears: [36, 52],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "no-perforation-but-stone",
          complaint: "Appendicitis treatment choice",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents to the clinic with a same-day outside CT showing uncomplicated appendicitis. The radiologist specifically notes an appendicolith but no perforation, abscess, or diffuse peritonitis. The patient has no major operative contraindication.",
          stem:
            "Which hospital treatment pathway should be recommended for this patient's appendicitis with an appendicolith?",
          correct: [
            "Surgical evaluation for appendectomy",
            "The appendicolith is a meaningful risk modifier that favors appendectomy despite the absence of perforation.",
          ],
          wrong: [
            [
              "Use outpatient antibiotics-first care",
              "An appendicolith makes routine outpatient antibiotics-first care less favorable and requires hospital surgical discussion.",
            ],
            [
              "Use hospital antibiotics-first care",
              "Antibiotics-first care is less favored in a fit patient once the appendicolith risk modifier is known.",
            ],
            [
              "Plan interval appendectomy after antibiotics",
              "Routine interval planning accepts added failure or recurrence risk despite a current operative opportunity.",
            ],
          ],
          explanation:
            "Do not equate uncomplicated imaging with low risk for every nonoperative pathway. The appendicolith shifts counseling toward operative hospital care.",
          claims: [
            "claim.gs028c.appendicitis.appendicolith-risk",
            "claim.gs028c.appendicitis.appendicolith-operative-pathway",
          ],
          acuity: "urgent",
          ageYears: [48, 61],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "prior-antibiotic-preference",
          complaint: "Review appendicitis plan",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, comes to the clinic after initially preferring antibiotics for uncomplicated appendicitis. Final review of the same-day outside CT now identifies an appendicolith. The patient remains stable, is fit for surgery, and has not begun a definitive pathway.",
          stem:
            "How should this patient's appendicolith change the treatment plan for acute appendicitis?",
          correct: [
            "Recommend operative hospital management",
            "The new risk modifier makes appendectomy the favored pathway while still allowing an informed preference discussion.",
          ],
          wrong: [
            [
              "Continue unchanged antibiotics-only planning",
              "The appendicolith materially changes the expected risk of an antibiotics-first course and should change counseling.",
            ],
            [
              "Declare antibiotics medically impossible",
              "An appendicolith increases risk but does not create a universal absolute contraindication to nonoperative care.",
            ],
            [
              "Defer the decision for several weeks",
              "Active appendicitis requires a current hospital treatment decision rather than delayed elective review.",
            ],
          ],
          explanation:
            "Update the shared decision with the appendicolith-specific risk. Appendectomy is favored for this fit adult, without overstating the finding as an absolute ban on antibiotics.",
          claims: [
            "claim.gs028c.appendicitis.appendicolith-risk",
            "claim.gs028c.appendicitis.appendicolith-operative-pathway",
          ],
          acuity: "urgent",
          ageYears: [33, 57],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
  ],
});

const CHOLECYSTITIS = buildFamily({
  slug: "acute-cholecystitis",
  label: "Acute calculous cholecystitis",
  sources: [SOURCES.wsesChole],
  claims: [
    {
      id: "claim.gs028c.cholecystitis.hida-after-equivocal-us",
      statement:
        "When acute calculous cholecystitis remains clinically suspected after equivocal ultrasonography, hepatobiliary scintigraphy is an appropriate clarifying study in selected patients when local resources permit.",
      sourceIds: [SOURCES.wsesChole.id],
      category: "evaluation",
      certainty: "moderate",
      limitation:
        "The guideline notes that HIDA use is constrained by time and resource availability; the claim does not require HIDA for every suspected case.",
      population:
        "Stable adults with persistent clinical suspicion for acute calculous cholecystitis after equivocal ultrasonography and access to hepatobiliary scintigraphy.",
    },
    {
      id: "claim.gs028c.cholecystitis.index-admission-cholecystectomy",
      statement:
        "A fit adult with confirmed acute calculous cholecystitis should receive hospital surgical care with laparoscopic cholecystectomy during the index admission rather than routine delayed interval surgery.",
      sourceIds: [SOURCES.wsesChole.id],
      category: "management",
      certainty: "high",
      limitation:
        "Critical illness, septic shock, anesthetic contraindication, and lack of appropriate expertise require individualized alternatives.",
      population:
        "Fit adults with confirmed acute calculous cholecystitis and access to appropriate hospital surgical expertise.",
    },
  ],
  concepts: [
    {
      id: "concept.cholecystitis.hida-after-equivocal-ultrasound",
      displayName: "HIDA after equivocal gallbladder ultrasound",
      learningObjective:
        "Select hepatobiliary scintigraphy to clarify suspected acute cholecystitis after equivocal ultrasound when another study is needed and available.",
      stage: 0,
      educationalTier: 1,
      conceptType: "workup",
      evidenceClaimIds: ["claim.gs028c.cholecystitis.hida-after-equivocal-us"],
      variants: variants([
        {
          slug: "equivocal-wall-thickening",
          complaint: "Right upper pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents to the clinic with persistent right-upper-quadrant pain, fever, and focal tenderness. Ultrasound shows gallstones and borderline wall thickening but no definitive sonographic Murphy sign. The patient is stable, and the receiving hospital can perform hepatobiliary scintigraphy promptly.",
          stem:
            "Which next imaging study best clarifies whether this patient has acute cholecystitis?",
          correct: [
            "Hepatobiliary scintigraphy",
            "HIDA is the appropriate clarifying study when suspicion persists after equivocal ultrasonography and the test is available.",
          ],
          wrong: [
            [
              "Right-upper-quadrant ultrasound",
              "The initial ultrasound already supplied equivocal rather than definitive information in this persistent presentation.",
              { timingProfileId: US },
            ],
            [
              "Contrast-enhanced abdominal CT",
              "CT is less accurate than HIDA for the specific unresolved acute-cholecystitis question.",
              { timingProfileId: CT },
            ],
            [
              "Abdominal magnetic resonance imaging",
              "MRI is less suitable than available HIDA for the prompt functional assessment requested here.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "Use HIDA selectively when clinical suspicion persists after an equivocal ultrasound and local access permits; resource limitations can justify another pathway.",
          claims: ["claim.gs028c.cholecystitis.hida-after-equivocal-us"],
          acuity: "urgent",
          ageYears: [42, 59],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 101,
            systolicBloodPressureMmHg: 120,
            diastolicBloodPressureMmHg: 72,
            temperatureF: 100.6,
            oxygenSaturationPercent: 98,
          },
          test: { timingProfileId: NUCLEAR },
        },
        {
          slug: "stones-without-secondary-signs",
          complaint: "Gallbladder pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, comes to the clinic with sustained right-upper-quadrant pain, nausea, and inflammatory laboratory findings. Ultrasound confirms stones but the secondary signs of acute inflammation are inconclusive. The patient is stable and HIDA is promptly available at the receiving hospital.",
          stem:
            "Which diagnostic study should be used next to evaluate suspected acute cholecystitis after an equivocal ultrasound?",
          correct: [
            "Hepatobiliary scintigraphy",
            "HIDA tests cystic-duct obstruction and is the best available clarifying study in this selected equivocal case.",
          ],
          wrong: [
            [
              "Right-upper-quadrant ultrasound",
              "The completed ultrasound is already inconclusive and repeating it does not add the functional information requested.",
              { timingProfileId: US },
            ],
            [
              "Noncontrast abdominal CT",
              "CT is not the preferred clarifier for this unresolved functional gallbladder diagnosis when HIDA is available.",
              { timingProfileId: CT },
            ],
            [
              "Biliary magnetic resonance imaging",
              "An anatomic MRI is less suitable than available HIDA for this specific unresolved functional question.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "Gallstones alone do not establish acute cholecystitis. With persistent suspicion, an equivocal ultrasound, and prompt access, HIDA is the appropriate clarifying test.",
          claims: ["claim.gs028c.cholecystitis.hida-after-equivocal-us"],
          acuity: "urgent",
          ageYears: [37, 64],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 98,
            systolicBloodPressureMmHg: 126,
            diastolicBloodPressureMmHg: 78,
            temperatureF: 100.2,
            oxygenSaturationPercent: 99,
          },
          test: { timingProfileId: NUCLEAR },
        },
        {
          slug: "limited-ultrasound",
          complaint: "Persistent biliary pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, remains tender in the right upper quadrant at a clinic visit after several hours of constant pain. Ultrasound visualization is limited and the report is explicitly equivocal for acute cholecystitis. The patient has no shock or generalized peritonitis, and timely HIDA is available at the receiving hospital.",
          stem:
            "Which additional imaging study best addresses suspected acute cholecystitis after an equivocal ultrasound?",
          correct: [
            "Hepatobiliary scintigraphy",
            "HIDA is a suitable high-accuracy next study for selected patients after an equivocal ultrasound.",
          ],
          wrong: [
            [
              "Right-upper-quadrant ultrasound",
              "Repeating a technically limited study is less likely to settle the unresolved diagnostic question.",
              { timingProfileId: US },
            ],
            [
              "Contrast-enhanced abdominal CT",
              "CT is less accurate than HIDA for this specific unresolved acute-cholecystitis question.",
              { timingProfileId: CT },
            ],
            [
              "Abdominal magnetic resonance imaging",
              "MRI is less suitable than available HIDA for the prompt functional assessment requested here.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "In a stable selected patient with ongoing suspicion and equivocal ultrasonography, HIDA can clarify the diagnosis when available without implying universal use.",
          claims: ["claim.gs028c.cholecystitis.hida-after-equivocal-us"],
          acuity: "urgent",
          ageYears: [50, 68],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 96,
            systolicBloodPressureMmHg: 118,
            diastolicBloodPressureMmHg: 70,
            temperatureF: 100.4,
            oxygenSaturationPercent: 98,
          },
          test: { timingProfileId: NUCLEAR },
        },
        {
          slug: "persistent-suspicion",
          complaint: "Fever and biliary pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents to the clinic with fever, persistent right-upper-quadrant pain, and a positive clinical Murphy finding. Ultrasound detects sludge and stones but calls the examination indeterminate for acute cholecystitis. HIDA is available at the receiving hospital without delaying needed acute care.",
          stem:
            "Which imaging test should the acute-care team select to evaluate suspected acute cholecystitis after an indeterminate ultrasound?",
          correct: [
            "Hepatobiliary scintigraphy",
            "HIDA directly addresses the unresolved acute-cholecystitis question after indeterminate ultrasound.",
          ],
          wrong: [
            [
              "Right-upper-quadrant ultrasound",
              "A routine repeat does not add the functional information needed after an indeterminate targeted study.",
              { timingProfileId: US },
            ],
            [
              "Contrast-enhanced abdominal CT",
              "CT is less accurate than HIDA for the specific unresolved acute-cholecystitis diagnosis.",
              { timingProfileId: CT },
            ],
            [
              "Biliary magnetic resonance imaging",
              "MRI provides anatomic information but is less suitable than available HIDA for this functional question.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "HIDA is an appropriate selected next test when ultrasound remains indeterminate and the clinical picture continues to support acute cholecystitis.",
          claims: ["claim.gs028c.cholecystitis.hida-after-equivocal-us"],
          acuity: "urgent",
          ageYears: [45, 73],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 104,
            systolicBloodPressureMmHg: 116,
            diastolicBloodPressureMmHg: 68,
            temperatureF: 101.0,
            oxygenSaturationPercent: 97,
          },
          test: { timingProfileId: NUCLEAR },
        },
      ]),
    },
    {
      id: "concept.cholecystitis.fit-patient-index-admission-cholecystectomy",
      displayName: "Index-admission surgery for acute cholecystitis",
      learningObjective:
        "Send a fit patient with confirmed acute calculous cholecystitis for hospital care and index-admission laparoscopic cholecystectomy.",
      stage: 0,
      educationalTier: 0,
      conceptType: "disposition",
      evidenceClaimIds: [
        "claim.gs028c.cholecystitis.index-admission-cholecystectomy",
      ],
      variants: variants([
        {
          slug: "confirmed-on-ultrasound",
          complaint: "Confirmed gallbladder attack",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, arrives from urgent care with persistent right-upper-quadrant pain, fever, leukocytosis, and an outside ultrasound confirming stones, wall thickening, pericholecystic fluid, and a sonographic Murphy sign. The patient is stable and fit for surgery.",
          stem:
            "Which disposition and definitive treatment plan is appropriate for this fit patient with acute cholecystitis?",
          correct: [
            "Index-admission cholecystectomy",
            "Confirmed acute calculous cholecystitis in a fit patient belongs in hospital surgical care with cholecystectomy during this admission.",
          ],
          wrong: [
            [
              "Routine delayed outpatient cholecystectomy",
              "Routine interval delay exposes the patient to ongoing and recurrent disease without a stated contraindication to index-admission surgery.",
            ],
            [
              "Outpatient antibiotics without surgery",
              "Antibiotics alone do not provide definitive treatment for this fit patient with confirmed disease.",
            ],
            [
              "Clinic observation until pain resolves",
              "A clinic cannot supply the required acute surgical care, and symptom improvement alone does not replace definitive treatment planning.",
            ],
          ],
          explanation:
            "Transfer for hospital surgical care. A fit patient with confirmed acute calculous cholecystitis should generally undergo laparoscopic cholecystectomy during the index admission.",
          claims: ["claim.gs028c.cholecystitis.index-admission-cholecystectomy"],
          acuity: "urgent",
          ageYears: [39, 56],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "hida-confirmed",
          complaint: "HIDA confirmed inflammation",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, brings an outside HIDA result to the clinic after ongoing biliary pain and inflammatory findings. The study confirms acute cholecystitis after an equivocal ultrasound. There is no shock, anesthetic contraindication, or organ failure, and hospital surgical expertise is available.",
          stem:
            "Which definitive treatment plan should occur during this fit patient's admission for acute cholecystitis?",
          correct: [
            "Admit for laparoscopic cholecystectomy",
            "The confirmed diagnosis and operative fitness support definitive surgery during the current admission.",
          ],
          wrong: [
            [
              "Discharge for interval cholecystectomy",
              "A routine delayed operation is not preferred when the patient can undergo index-admission treatment.",
            ],
            [
              "Hospital antibiotics with observation",
              "Antibiotics and observation do not replace definitive source control in this fit operative candidate.",
            ],
            [
              "Percutaneous gallbladder drainage",
              "Drainage is generally an alternative for patients who cannot undergo cholecystectomy, unlike this fit operative candidate.",
            ],
          ],
          explanation:
            "Once acute cholecystitis is confirmed in a fit patient, move from diagnosis to hospital definitive care rather than building a delayed outpatient pathway.",
          claims: ["claim.gs028c.cholecystitis.index-admission-cholecystectomy"],
          acuity: "urgent",
          ageYears: [47, 62],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "premature-ed-discharge",
          complaint: "Pain returned overnight",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns to the clinic after emergency-department discharge following temporary pain improvement despite imaging-confirmed acute calculous cholecystitis. Constant right-upper-quadrant pain and fever have returned. The patient is hemodynamically stable and remains a good operative candidate.",
          stem:
            "Which definitive treatment plan best addresses this fit patient's confirmed acute cholecystitis?",
          correct: [
            "Index-admission surgical treatment",
            "Recurrent symptoms during the same acute episode reinforce the need for hospital care and definitive cholecystectomy.",
          ],
          wrong: [
            [
              "Schedule routine surgery after recovery",
              "Routine delay is unnecessary in a fit patient with active confirmed acute cholecystitis.",
            ],
            [
              "Renew analgesics without reassessment",
              "Symptom treatment alone does not address active gallbladder inflammation or the need for source control.",
            ],
            [
              "Wait for a second recurrent attack",
              "Another attack is not needed to justify definitive care for the already confirmed current episode.",
            ],
          ],
          explanation:
            "This is active confirmed cholecystitis, not routine biliary colic follow-up. Send the patient back for hospital surgical care during the index episode.",
          claims: ["claim.gs028c.cholecystitis.index-admission-cholecystectomy"],
          acuity: "urgent",
          ageYears: [31, 66],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "older-but-fit",
          complaint: "Acute gallbladder infection",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, comes to the clinic with outside imaging-confirmed acute calculous cholecystitis. Despite older age, the preoperative assessment finds no shock, decompensated disease, or anesthetic contraindication. An experienced hospital surgical team is available.",
          stem:
            "Which index-admission treatment pathway should be recommended for this fit patient with acute cholecystitis?",
          correct: [
            "Same-admission cholecystectomy",
            "Age alone does not create a reason to delay definitive hospital treatment in this otherwise fit patient.",
          ],
          wrong: [
            [
              "Antibiotics alone because of age",
              "Chronologic age alone does not replace a patient-specific operative assessment or justify nondefinitive care.",
            ],
            [
              "Elective surgery after several months",
              "Routine delay is not preferred when the current assessment supports index-admission surgery.",
            ],
            [
              "Hospital gallbladder drainage instead",
              "Drainage is not the default substitute for cholecystectomy in this fit operative candidate.",
            ],
          ],
          explanation:
            "Use physiologic fitness and actual contraindications, not age alone, to guide the plan. This fit patient should receive index-admission hospital cholecystectomy.",
          claims: ["claim.gs028c.cholecystitis.index-admission-cholecystectomy"],
          acuity: "urgent",
          ageYears: [72, 81],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
  ],
});

const BILIARY_PANCREATITIS = buildFamily({
  slug: "mild-biliary-pancreatitis",
  label: "Mild acute biliary pancreatitis",
  sources: [SOURCES.acgPancreas, SOURCES.wsesPancreas],
  claims: [
    {
      id: "claim.gs028c.pancreatitis.selective-early-ct",
      statement:
        "Routine early contrast-enhanced CT is unnecessary when acute pancreatitis is already established clinically and the patient is improving without diagnostic uncertainty, organ failure, or signs of a complication.",
      sourceIds: [SOURCES.acgPancreas.id, SOURCES.wsesPancreas.id],
      category: "safety_boundary",
      certainty: "high",
      limitation:
        "CT remains appropriate when the diagnosis is uncertain or the clinical course fails to improve or suggests a complication.",
      population:
        "Adults with clinically established mild acute pancreatitis who are improving without diagnostic uncertainty or complication signs.",
    },
    {
      id: "claim.gs028c.pancreatitis.index-admission-cholecystectomy",
      statement:
        "For mild acute gallstone pancreatitis, laparoscopic cholecystectomy should occur during the index admission, preferably before discharge, when the patient is clinically improving and no local complication requires delay.",
      sourceIds: [SOURCES.acgPancreas.id, SOURCES.wsesPancreas.id],
      category: "management",
      certainty: "high",
      limitation:
        "This timing does not apply to severe pancreatitis or cases with persistent fluid collections or other complications that change operative timing.",
      population:
        "Adults recovering from mild acute gallstone pancreatitis without necrosis, persistent organ failure, or operative contraindication.",
    },
  ],
  concepts: [
    {
      id: "concept.acute-pancreatitis.selective-early-ct",
      displayName: "Selective CT in mild acute pancreatitis",
      learningObjective:
        "Avoid routine early CT when mild acute pancreatitis is clinically established and improving, while reserving CT for uncertainty or failure to improve.",
      stage: 0,
      educationalTier: 0,
      conceptType: "workup",
      evidenceClaimIds: ["claim.gs028c.pancreatitis.selective-early-ct"],
      variants: variants([
        {
          slug: "classic-improving-course",
          complaint: "Do I need a CT?",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, reviews a recent mild-pancreatitis hospitalization in clinic. The records document typical epigastric pain, diagnostic pancreatic enzyme elevation, steady improvement with supportive care, and no organ failure, peritonitis, or diagnostic uncertainty.",
          stem:
            "Which pancreatic imaging strategy was appropriate during this patient's improving early course of acute pancreatitis?",
          correct: [
            "No routine early CT",
            "The diagnosis is established and the patient is improving without a feature that would make early CT useful.",
          ],
          wrong: [
            [
              "Obtain contrast CT immediately",
              "Routine early CT does not add value to this established, improving, uncomplicated presentation.",
              { timingProfileId: CT },
            ],
            [
              "Obtain pancreatic MRI immediately",
              "Routine immediate MRI is also unnecessary when the diagnosis and favorable course are clear.",
              { timingProfileId: MRI },
            ],
            [
              "Schedule daily abdominal ultrasound",
              "Serial ultrasound does not monitor pancreatic severity or replace clinical assessment in this improving course.",
              { timingProfileId: US },
            ],
          ],
          explanation:
            "Use CT selectively. An established diagnosis with clinical improvement and no complication signal does not need routine early cross-sectional imaging.",
          claims: ["claim.gs028c.pancreatitis.selective-early-ct"],
          ageYears: [34, 49],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "biliary-source-known",
          complaint: "Pancreatitis imaging plan",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns to clinic after a recent hospitalization for clinically established mild pancreatitis with ultrasound-demonstrated gallstones and no duct dilation. The record shows steady improvement, reassuring laboratory trends, and no organ failure or alternate diagnostic concern.",
          stem:
            "What is the best plan for routine early pancreatic CT imaging in this improving patient with acute pancreatitis?",
          correct: [
            "Defer CT unless the course changes",
            "An improving mild course with an established diagnosis does not require routine early CT; deterioration or uncertainty would change that decision.",
          ],
          wrong: [
            [
              "Perform CT solely to confirm pancreatitis",
              "The clinical diagnosis is already established, so confirmation alone does not justify early CT.",
              { timingProfileId: CT },
            ],
            [
              "Perform MRI solely to grade severity",
              "Routine early cross-sectional severity imaging is unnecessary in this clearly improving mild case.",
              { timingProfileId: MRI },
            ],
            [
              "Repeat ultrasound to image the pancreas",
              "Ultrasound has answered the biliary-source question and is not a substitute for an indicated pancreatic CT.",
              { timingProfileId: US },
            ],
          ],
          explanation:
            "The absence of a routine early CT does not mean CT is never used. Reserve it for diagnostic uncertainty, failure to improve, or concern for complications.",
          claims: ["claim.gs028c.pancreatitis.selective-early-ct"],
          ageYears: [43, 58],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "requests-necrosis-check",
          complaint: "Check for necrosis?",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, asks at clinic follow-up why no CT was obtained immediately after a straightforward diagnosis of mild acute pancreatitis. The hospital record shows stable vital signs, decreasing pain, and no organ failure, systemic deterioration, or peritoneal finding.",
          stem:
            "Which imaging strategy is appropriate for this improving patient with clinically clear acute pancreatitis?",
          correct: [
            "Defer CT while improvement continues",
            "Early CT is not needed solely for reassurance in an improving uncomplicated course.",
          ],
          wrong: [
            [
              "Obtain contrast CT for baseline anatomy",
              "Baseline anatomy alone does not justify early CT when the diagnosis is established and the course is improving.",
              { timingProfileId: CT },
            ],
            [
              "Obtain pancreatic MRI for baseline anatomy",
              "Routine baseline MRI is unnecessary when mild pancreatitis is established and improving without complication signs.",
              { timingProfileId: MRI },
            ],
            [
              "Obtain serial CT for severity trending",
              "Serial CT adds exposure without a clinical indication in this uncomplicated improving course.",
              { timingProfileId: CT },
            ],
          ],
          explanation:
            "Reassure the patient that clinical monitoring guides uncomplicated early care. Cross-sectional imaging becomes useful if the diagnosis is uncertain or improvement does not occur.",
          claims: ["claim.gs028c.pancreatitis.selective-early-ct"],
          ageYears: [28, 54],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "ready-for-diet-advance",
          complaint: "Improving pancreatitis",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, reviews the final days of a recent mild-pancreatitis hospitalization in clinic. Pain medication needs fell, oral intake returned, hemodynamics remained normal, and no finding suggested infection, necrosis, or another abdominal diagnosis.",
          stem:
            "Which cross-sectional imaging plan was appropriate during this patient's improving early course of acute pancreatitis?",
          correct: [
            "Do not order routine early imaging",
            "Continued clinical improvement without uncertainty or complications supports avoiding routine early CT or MRI.",
          ],
          wrong: [
            [
              "Order contrast CT before discharge",
              "Discharge planning alone is not an indication for CT in an improving uncomplicated case.",
              { timingProfileId: CT },
            ],
            [
              "Order MRI before diet advancement",
              "Diet advancement is guided clinically and does not require routine MRI in this mild course.",
              { timingProfileId: MRI },
            ],
            [
              "Order serial CT for trend monitoring",
              "Serial CT adds radiation and contrast exposure without a clinical indication in this improving patient.",
              { timingProfileId: CT },
            ],
          ],
          explanation:
            "Routine early cross-sectional imaging is unnecessary for clinically established pancreatitis that is improving. A changed course would prompt a new imaging decision.",
          claims: ["claim.gs028c.pancreatitis.selective-early-ct"],
          ageYears: [40, 67],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
    {
      id: "concept.acute-pancreatitis.mild-biliary-chole-before-discharge",
      displayName: "Cholecystectomy before discharge after mild biliary pancreatitis",
      learningObjective:
        "Arrange index-admission cholecystectomy before discharge after mild gallstone pancreatitis when the patient is clinically appropriate.",
      stage: 0,
      educationalTier: 0,
      conceptType: "management",
      evidenceClaimIds: [
        "claim.gs028c.pancreatitis.index-admission-cholecystectomy",
      ],
      variants: variants([
        {
          slug: "improving-with-gallstones",
          complaint: "Prevent another attack",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, is seen in clinic after a recent admission for mild gallstone pancreatitis. The record shows resumed oral intake, no necrosis, persistent organ failure, or fluid collection, and operative fitness before discharge; no cholecystectomy was performed.",
          stem:
            "Which definitive prevention plan for mild biliary pancreatitis should have occurred before this patient left the hospital?",
          correct: [
            "Same-admission cholecystectomy",
            "Index-admission cholecystectomy reduces recurrent biliary events in clinically improving mild disease.",
          ],
          wrong: [
            [
              "Routine delayed cholecystectomy",
              "A routine interval delay is not preferred for this improving uncomplicated mild episode.",
            ],
            [
              "Dietary therapy without cholecystectomy",
              "Dietary counseling does not remove the gallbladder source or provide definitive recurrence prevention.",
            ],
            [
              "No biliary treatment after recovery",
              "Clinical recovery from pancreatitis does not eliminate the risk from the retained gallbladder source.",
            ],
          ],
          explanation:
            "For mild gallstone pancreatitis without a complication that requires delay, complete laparoscopic cholecystectomy during the index admission, preferably before discharge.",
          claims: ["claim.gs028c.pancreatitis.index-admission-cholecystectomy"],
          ageYears: [38, 55],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "after-ercp-clearance",
          complaint: "Next step after ERCP",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, returns to clinic after mild gallstone pancreatitis treated with therapeutic ERCP for a common-duct stone. Hospital records show no necrosis, organ failure, or operative contraindication before discharge, but the gallbladder remains in place.",
          stem:
            "Which definitive gallstone-management step should have been completed during this patient's admission for mild biliary pancreatitis?",
          correct: [
            "Same-admission cholecystectomy",
            "Duct clearance lowers some risk but does not replace same-admission removal of the gallbladder source in mild disease.",
          ],
          wrong: [
            [
              "Treat ERCP as complete prevention",
              "Sphincterotomy and duct clearance do not eliminate all recurrent gallstone-related events from the retained gallbladder.",
            ],
            [
              "Delay surgery until recurrence",
              "Waiting for another biliary event gives up the prevention benefit of index-admission cholecystectomy.",
            ],
            [
              "Use long-term antibiotics instead",
              "Antibiotics do not provide definitive prevention for a retained gallstone source.",
            ],
          ],
          explanation:
            "Even after ERCP and sphincterotomy, mild gallstone pancreatitis generally calls for cholecystectomy during the same admission when clinically appropriate.",
          claims: ["claim.gs028c.pancreatitis.index-admission-cholecystectomy"],
          ageYears: [45, 62],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "discharge-rounds",
          complaint: "Ready for discharge",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, asks in clinic about a recent discharge after mild biliary pancreatitis. The hospital record shows resolved pain, tolerated diet, no local pancreatic complication or persistent organ dysfunction, and available surgical expertise before discharge.",
          stem:
            "Which definitive intervention should have been completed before discharge after this patient's mild biliary pancreatitis?",
          correct: [
            "Index-admission cholecystectomy",
            "The improving uncomplicated course is the setting in which cholecystectomy should be completed before discharge.",
          ],
          wrong: [
            [
              "Elective surgery after a routine delay",
              "A routine delay creates avoidable time for recurrent biliary events without a stated reason to postpone surgery.",
            ],
            [
              "Observation until another episode",
              "A second attack is not required before treating the known gallbladder source.",
            ],
            [
              "ERCP with sphincterotomy alone",
              "Endoscopic sphincter therapy does not replace removal of the gallbladder source in this fit mild-disease setting.",
            ],
          ],
          explanation:
            "Recovery is the opportunity to complete source-directed prevention during the same hospitalization, not a reason to discharge without a cholecystectomy plan.",
          claims: ["claim.gs028c.pancreatitis.index-admission-cholecystectomy"],
          ageYears: [30, 60],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "normalizing-bilirubin",
          complaint: "Gallstone pancreatitis recovery",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, reviews a recent mild-gallstone-pancreatitis admission in clinic. Before discharge, symptoms improved and bilirubin normalized, with no cholangitis, necrosis, persistent fluid collection, organ failure, or operative contraindication.",
          stem:
            "Which cholecystectomy timing plan should have been used to prevent another biliary event after this patient's mild biliary pancreatitis?",
          correct: [
            "Same-admission cholecystectomy",
            "The patient meets the uncomplicated mild-disease context for index-admission cholecystectomy.",
          ],
          wrong: [
            [
              "Cholecystectomy only after recurrence",
              "Waiting for recurrence defeats the purpose of definitive source control during the current admission.",
            ],
            [
              "Routine postponement for several months",
              "There is no severe pancreatitis or local complication in the presentation to justify routine postponement.",
            ],
            [
              "No operation if bilirubin normalizes",
              "Normalizing bilirubin does not remove the gallbladder source of the pancreatitis.",
            ],
          ],
          explanation:
            "Normalizing laboratory values reflect recovery but do not remove the source. Complete cholecystectomy during the index admission when no complication requires delay.",
          claims: ["claim.gs028c.pancreatitis.index-admission-cholecystectomy"],
          ageYears: [52, 70],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
  ],
});

const ACUTE_LIMB_ISCHEMIA = buildFamily({
  slug: "acute-limb-ischemia",
  label: "Acute limb ischemia",
  sources: [SOURCES.accPad],
  claims: [
    {
      id: "claim.gs028c.ali.category-one",
      statement:
        "An acutely ischemic limb with intact sensation and motor function plus audible arterial and venous Doppler signals is viable rather than immediately threatened.",
      sourceIds: [SOURCES.accPad.id],
      category: "evaluation",
      certainty: "high",
      limitation: null,
      population: "Adults with suspected acute limb ischemia.",
    },
    {
      id: "claim.gs028c.ali.category-two-a",
      statement:
        "Acute limb ischemia with sensory loss limited to the toes, no motor weakness, an absent arterial Doppler signal, and an audible venous signal is marginally threatened and salvageable with prompt treatment.",
      sourceIds: [SOURCES.accPad.id],
      category: "evaluation",
      certainty: "high",
      limitation: null,
      population: "Adults with suspected acute limb ischemia.",
    },
    {
      id: "claim.gs028c.ali.category-two-b",
      statement:
        "Acute limb ischemia with sensory loss extending beyond the toes, mild or moderate motor weakness, an absent arterial Doppler signal, and an audible venous signal is immediately threatened and requires immediate revascularization for salvage.",
      sourceIds: [SOURCES.accPad.id],
      category: "evaluation",
      certainty: "high",
      limitation: null,
      population: "Adults with suspected acute limb ischemia.",
    },
    {
      id: "claim.gs028c.ali.category-three",
      statement:
        "An anesthetic, paralyzed acutely ischemic limb with absent arterial and venous Doppler signals is irreversibly damaged and should not undergo attempted revascularization.",
      sourceIds: [SOURCES.accPad.id],
      category: "safety_boundary",
      certainty: "high",
      limitation:
        "Irreversibility requires the complete neurologic and Doppler pattern; absent pulses alone do not establish it.",
      population: "Adults with suspected category III acute limb ischemia.",
    },
    {
      id: "claim.gs028c.ali.ufh-unless-contraindicated",
      statement:
        "Systemic unfractionated heparin should be administered when acute limb ischemia is diagnosed unless anticoagulation is contraindicated.",
      sourceIds: [SOURCES.accPad.id],
      category: "management",
      certainty: "moderate",
      limitation:
        "Active bleeding, high bleeding risk, aortic dissection, major vascular trauma, or prior heparin-induced thrombocytopenia can require withholding heparin or choosing an alternative.",
      population: "Adults with diagnosed acute limb ischemia.",
    },
    {
      id: "claim.gs028c.ali.emergency-vascular-care",
      statement:
        "Acute limb ischemia requires emergency assessment by a clinician able to determine viability and provide revascularization, with immediate transfer when that expertise is unavailable locally.",
      sourceIds: [SOURCES.accPad.id],
      category: "disposition",
      certainty: "high",
      limitation: null,
      population: "Adults with suspected acute limb ischemia.",
    },
  ],
  concepts: [
    {
      id: "concept.acute-limb-ischemia.viability-exam",
      displayName: "Classify acute limb viability",
      learningObjective:
        "Classify acute limb ischemia as viable, marginally threatened, immediately threatened, or irreversible using complete sensory, motor, arterial Doppler, and venous Doppler findings.",
      stage: 0,
      educationalTier: 1,
      conceptType: "diagnosis",
      evidenceClaimIds: [
        "claim.gs028c.ali.category-one",
        "claim.gs028c.ali.category-two-a",
        "claim.gs028c.ali.category-two-b",
        "claim.gs028c.ali.category-three",
      ],
      variants: variants([
        {
          slug: "viable-limb",
          complaint: "Sudden cold foot",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, develops sudden foot pain and coolness during a clinic visit. Sensation is intact, ankle and toe movement are normal, and handheld Doppler detects both arterial and venous signals. Emergency vascular evaluation is already being arranged.",
          stem:
            "How should this patient's acute limb viability be classified from the complete bedside findings?",
          correct: [
            "Category I: viable",
            "No sensory or motor loss with audible arterial and venous signals defines a viable limb.",
          ],
          wrong: [
            [
              "Category IIa: marginally threatened limb",
              "Marginal threat requires at least toe sensory loss and usually loss of the arterial Doppler signal, neither of which is present.",
            ],
            [
              "Category IIb: immediately threatened",
              "Immediate threat requires sensory loss beyond the toes and motor weakness, which are absent here.",
            ],
            [
              "Category III: irreversible",
              "Irreversibility requires profound anesthesia, paralysis, and loss of both arterial and venous Doppler signals.",
            ],
          ],
          explanation:
            "This is category I acute limb ischemia: viable now, but still an emergency that requires prompt specialist evaluation and treatment.",
          claims: [
            "claim.gs028c.ali.category-one",
            "claim.gs028c.ali.emergency-vascular-care",
          ],
          acuity: "urgent",
          ageYears: [54, 68],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 106,
            systolicBloodPressureMmHg: 132,
            diastolicBloodPressureMmHg: 78,
            temperatureF: 98.2,
            oxygenSaturationPercent: 98,
          },
        },
        {
          slug: "marginally-threatened",
          complaint: "Numb toes suddenly",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, has abrupt leg pain and coolness in the clinic. Sensory loss is limited to the toes, motor strength is normal, the arterial Doppler signal is absent, and the venous Doppler signal remains audible. Emergency vascular care is being activated.",
          stem:
            "Which acute limb ischemia category matches all of this patient's bedside findings?",
          correct: [
            "Category IIa: marginally threatened",
            "Toe-limited sensory loss without weakness, absent arterial signal, and preserved venous signal define marginal threat.",
          ],
          wrong: [
            [
              "Category I: viable",
              "A viable limb has no sensory loss and retains an arterial Doppler signal; this patient has neither finding.",
            ],
            [
              "Category IIb: immediately threatened",
              "Immediate threat requires sensory loss beyond the toes and motor weakness, which are absent.",
            ],
            [
              "Category III: irreversible",
              "The limb retains motor function and a venous signal and is not anesthetic or paralyzed.",
            ],
          ],
          explanation:
            "This complete pattern is category IIa: salvageable if treated promptly. The preserved motor function and venous signal distinguish it from more advanced categories.",
          claims: [
            "claim.gs028c.ali.category-two-a",
            "claim.gs028c.ali.emergency-vascular-care",
          ],
          acuity: "urgent",
          ageYears: [61, 74],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 110,
            systolicBloodPressureMmHg: 126,
            diastolicBloodPressureMmHg: 72,
            temperatureF: 98.0,
            oxygenSaturationPercent: 97,
          },
        },
        {
          slug: "immediately-threatened",
          complaint: "Weak numb leg",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, has sudden severe leg pain in the clinic. Numbness extends above the toes, ankle movement is newly weak, the arterial Doppler signal is absent, and the venous Doppler signal remains audible. Emergency revascularization resources are being contacted.",
          stem:
            "How should this patient's acute limb ischemia be classified before immediate revascularization care?",
          correct: [
            "Category IIb: immediately threatened",
            "Sensory loss beyond the toes plus new weakness with absent arterial and preserved venous signals defines immediate threat.",
          ],
          wrong: [
            [
              "Category I: viable",
              "The sensory deficit, weakness, and absent arterial signal exclude a currently viable category I limb.",
            ],
            [
              "Category IIa: marginally threatened limb",
              "Motor weakness and sensory loss beyond the toes are more advanced than category IIa.",
            ],
            [
              "Category III: irreversible",
              "The weakness is not complete paralysis, sensation is not completely absent, and a venous signal is still audible.",
            ],
          ],
          explanation:
            "This is category IIb acute limb ischemia. The limb is salvageable only with immediate revascularization, so classification must not delay emergency care.",
          claims: [
            "claim.gs028c.ali.category-two-b",
            "claim.gs028c.ali.emergency-vascular-care",
          ],
          acuity: "urgent",
          ageYears: [57, 70],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 116,
            systolicBloodPressureMmHg: 118,
            diastolicBloodPressureMmHg: 70,
            temperatureF: 97.9,
            oxygenSaturationPercent: 97,
          },
        },
        {
          slug: "irreversible-limb",
          complaint: "Leg will not move",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents to the clinic after prolonged severe limb symptoms. The foot and lower leg are completely anesthetic, there is complete paralysis, and neither arterial nor venous Doppler signals are audible. Emergency vascular evaluation confirms the examination.",
          stem:
            "Which acute limb ischemia category fits this patient's complete neurologic and Doppler pattern?",
          correct: [
            "Category III: irreversible",
            "Complete anesthesia and paralysis with loss of both arterial and venous signals define irreversible ischemic damage.",
          ],
          wrong: [
            [
              "Category I: viable",
              "A viable limb retains sensation, motor function, and both Doppler signals, the opposite of this examination.",
            ],
            [
              "Category IIa: marginally threatened",
              "Category IIa has toe-limited sensory loss, preserved motor function, and an audible venous signal.",
            ],
            [
              "Category IIb: immediately threatened",
              "Category IIb retains some sensation, some motor function, and a venous Doppler signal; this limb has none.",
            ],
          ],
          explanation:
            "The full category III pattern is profound anesthesia, paralysis, and absent arterial and venous signals. Attempted revascularization of an irreversibly damaged limb can cause systemic harm.",
          claims: ["claim.gs028c.ali.category-three"],
          acuity: "urgent",
          ageYears: [64, 78],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 120,
            systolicBloodPressureMmHg: 104,
            diastolicBloodPressureMmHg: 64,
            temperatureF: 97.8,
            oxygenSaturationPercent: 96,
          },
        },
      ]),
    },
    {
      id: "concept.acute-limb-ischemia.heparin-emergency-transfer",
      displayName: "Immediate care for acute limb ischemia",
      learningObjective:
        "Begin unfractionated heparin unless contraindicated and arrange emergency vascular care or transfer for acute limb ischemia.",
      stage: 0,
      educationalTier: 1,
      conceptType: "disposition",
      evidenceClaimIds: [
        "claim.gs028c.ali.ufh-unless-contraindicated",
        "claim.gs028c.ali.emergency-vascular-care",
      ],
      variants: variants([
        {
          slug: "no-anticoagulation-contraindication",
          complaint: "Sudden painful foot",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, has a newly painful, pale, cool foot with absent arterial Doppler signals and preserved venous signals. There is no active bleeding, major trauma, aortic dissection concern, or history of heparin-induced thrombocytopenia. The clinic lacks vascular intervention capability.",
          stem:
            "Which immediate anticoagulation and disposition plan should be arranged for this patient's acute limb ischemia?",
          correct: [
            "Emergency vascular transfer with heparin",
            "The receiving emergency team should begin unfractionated heparin while providing definitive vascular assessment and revascularization capability.",
          ],
          wrong: [
            [
              "Give aspirin and arrange next-day vascular review",
              "Antiplatelet therapy and routine follow-up do not meet the emergency anticoagulation and revascularization needs of acute limb ischemia.",
            ],
            [
              "Order outpatient CTA before referral",
              "Outpatient imaging would delay emergency vascular care and is unnecessary before transfer in this straightforward presentation.",
              { timingProfileId: CTA },
            ],
            [
              "Arrange urgent same-day vascular review",
              "Same-day review remains too slow for acute limb ischemia requiring emergency vascular capability.",
            ],
          ],
          explanation:
            "Acute limb ischemia is a vascular emergency. Activate emergency transfer without outpatient testing and alert the receiving team to begin unfractionated heparin when no contraindication exists.",
          claims: [
            "claim.gs028c.ali.ufh-unless-contraindicated",
            "claim.gs028c.ali.emergency-vascular-care",
          ],
          acuity: "urgent",
          ageYears: [55, 69],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "prior-hit",
          complaint: "Foot pain after HIT",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, develops examination findings of acute limb ischemia during a clinic visit and has a documented prior episode of heparin-induced thrombocytopenia. The clinic has no revascularization service, and the limb remains potentially salvageable.",
          stem:
            "Which immediate acute-limb-ischemia plan best respects this patient's anticoagulation contraindication?",
          correct: [
            "Transfer for nonheparin anticoagulation",
            "Prior heparin-induced thrombocytopenia requires a nonheparin anticoagulant selected by the receiving emergency vascular team without delaying transfer.",
          ],
          wrong: [
            [
              "Request IV heparin during emergency transfer",
              "The emergency transfer is correct, but re-exposure to heparin conflicts with the documented heparin-induced thrombocytopenia history.",
            ],
            [
              "Avoid heparin and arrange routine review",
              "Avoiding heparin is appropriate, but routine follow-up dangerously delays limb-salvage evaluation.",
            ],
            [
              "Order outpatient duplex before transfer",
              "Additional outpatient testing must not delay emergency transfer for clinically apparent acute limb ischemia.",
              { timingProfileId: US },
            ],
          ],
          explanation:
            "A contraindication changes the medication, not the emergency. Withhold heparin, alert the receiving vascular team so a non-heparin strategy can be selected, and transfer immediately.",
          claims: [
            "claim.gs028c.ali.ufh-unless-contraindicated",
            "claim.gs028c.ali.emergency-vascular-care",
          ],
          acuity: "urgent",
          ageYears: [60, 72],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "active-bleeding",
          complaint: "Cold leg and bleeding",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, develops a suddenly cold, numb leg with absent arterial Doppler signals while also having active major gastrointestinal bleeding. The clinic cannot provide vascular intervention.",
          stem:
            "Which immediate acute-limb-ischemia plan best balances this patient's threatened limb and active bleeding?",
          correct: [
            "Emergency transfer with bleeding alert",
            "Active major bleeding is a contraindication to immediate heparin, but it does not permit delay in emergency vascular care.",
          ],
          wrong: [
            [
              "Request IV heparin during emergency transfer",
              "Transfer is urgent, but active major bleeding makes routine immediate heparin unsafe.",
            ],
            [
              "Stabilize bleeding before vascular transfer",
              "Both emergencies require coordinated hospital management; vascular transfer cannot wait until bleeding care is completed.",
            ],
            [
              "Schedule vascular clinic after bleeding stops",
              "A delayed clinic appointment would miss the narrow limb-salvage window.",
            ],
          ],
          explanation:
            "The anticoagulation rule includes a real safety boundary. With active major bleeding, withhold heparin and arrange immediate coordinated hospital vascular care.",
          claims: [
            "claim.gs028c.ali.ufh-unless-contraindicated",
            "claim.gs028c.ali.emergency-vascular-care",
          ],
          acuity: "urgent",
          ageYears: [58, 75],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "motor-deficit",
          complaint: "New foot weakness",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, develops abrupt leg pain during a clinic visit, with sensory loss beyond the toes, new ankle weakness, an absent arterial Doppler signal, and a preserved venous signal. There is no anticoagulation contraindication, and no vascular specialist is onsite.",
          stem:
            "Which immediate treatment and disposition should the clinic arrange for this patient's threatened acute limb ischemia?",
          correct: [
            "Emergency vascular transfer with heparin",
            "The receiving emergency team should provide anticoagulation and immediate revascularization care without outpatient diagnostic delay.",
          ],
          wrong: [
            [
              "Obtain outpatient CTA before transfer",
              "The complete clinical examination already establishes an immediately threatened limb, so outpatient imaging would create dangerous delay.",
              { timingProfileId: CTA },
            ],
            [
              "Give oral antiplatelet therapy and observe",
              "Observation and antiplatelet therapy do not replace systemic anticoagulation and immediate revascularization assessment.",
            ],
            [
              "Arrange next-day vascular consultation",
              "Motor weakness identifies immediate limb threat, making next-day review too slow.",
            ],
          ],
          explanation:
            "Do not let additional imaging delay care for a category IIb pattern. Activate immediate vascular transfer and alert the receiving team that unfractionated heparin is indicated if safe.",
          claims: [
            "claim.gs028c.ali.category-two-b",
            "claim.gs028c.ali.ufh-unless-contraindicated",
            "claim.gs028c.ali.emergency-vascular-care",
          ],
          acuity: "urgent",
          ageYears: [49, 67],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
  ],
});

const ACUTE_MESENTERIC_ISCHEMIA = buildFamily({
  slug: "acute-mesenteric-ischemia",
  label: "Acute mesenteric ischemia",
  sources: [SOURCES.wsesAmi],
  claims: [
    {
      id: "claim.gs028c.ami.cta-without-delay",
      statement:
        "CT angiography should be performed without delay when acute mesenteric ischemia is suspected.",
      sourceIds: [SOURCES.wsesAmi.id],
      category: "evaluation",
      certainty: "high",
      limitation: null,
      population: "Adults with suspected acute mesenteric ischemia.",
    },
    {
      id: "claim.gs028c.ami.aki-does-not-delay-cta",
      statement:
        "Acute kidney injury alone should not delay CTA when acute mesenteric ischemia is suspected because a missed or delayed diagnosis is more dangerous than the contrast exposure.",
      sourceIds: [SOURCES.wsesAmi.id],
      category: "safety_boundary",
      certainty: "moderate",
      limitation:
        "The receiving acute-care team should still optimize resuscitation and contrast safety without postponing the diagnostic study.",
      population:
        "Adults with suspected acute mesenteric ischemia and concurrent acute kidney injury.",
    },
    {
      id: "claim.gs028c.ami.peritonitis-exploration",
      statement:
        "Overt peritonitis in suspected acute mesenteric ischemia indicates likely bowel infarction and requires prompt operative exploration without additional diagnostic delay.",
      sourceIds: [SOURCES.wsesAmi.id],
      category: "disposition",
      certainty: "high",
      limitation: null,
      population:
        "Adults with suspected or confirmed acute mesenteric ischemia and overt peritonitis.",
    },
  ],
  concepts: [
    {
      id: "concept.acute-mesenteric-ischemia.prompt-cta",
      displayName: "Prompt CTA for acute mesenteric ischemia",
      learningObjective:
        "Transfer for CTA without delay when acute mesenteric ischemia is suspected, including when acute kidney injury is present.",
      stage: 0,
      educationalTier: 1,
      conceptType: "workup",
      evidenceClaimIds: [
        "claim.gs028c.ami.cta-without-delay",
        "claim.gs028c.ami.aki-does-not-delay-cta",
      ],
      variants: variants([
        {
          slug: "atrial-fibrillation",
          complaint: "Sudden severe pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} with atrial fibrillation has sudden severe diffuse abdominal pain that is strikingly greater than the early tenderness on examination. There is no overt peritonitis yet. The clinic cannot perform emergency vascular imaging.",
          stem:
            "Which diagnostic imaging plan should be arranged immediately for this patient's suspected acute mesenteric ischemia?",
          correct: [
            "Mesenteric CT angiography",
            "The embolic risk and pain pattern require CTA without delay at an acute-care hospital.",
          ],
          wrong: [
            [
              "Mesenteric duplex ultrasound",
              "Ultrasound does not provide the prompt mesenteric arterial assessment required for suspected acute ischemia.",
              { timingProfileId: US },
            ],
            [
              "Mesenteric magnetic resonance angiography",
              "MRI is less suitable than immediately available CTA for this acute vascular presentation.",
              { timingProfileId: MRI },
            ],
            [
              "Noncontrast abdominal CT",
              "A noncontrast study does not provide the vascular phase needed to evaluate mesenteric occlusion.",
              { timingProfileId: CT },
            ],
          ],
          explanation:
            "Pain out of proportion with an embolic risk factor should trigger emergency transfer and CTA without delay, before peritonitis develops.",
          claims: ["claim.gs028c.ami.cta-without-delay"],
          acuity: "urgent",
          ageYears: [63, 76],
          sexLabels: ["Female", "Male"],
          test: { timingProfileId: CTA },
        },
        {
          slug: "acute-on-chronic-pattern",
          complaint: "Pain became constant",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, reports at a clinic visit months of postprandial pain and weight loss followed today by abruptly constant severe abdominal pain. Examination is initially less dramatic than the reported pain, and there are no peritoneal signs.",
          stem:
            "Which imaging study should the receiving hospital obtain without delay for this patient's suspected acute mesenteric ischemia?",
          correct: [
            "Mesenteric CT angiography",
            "The acute-on-chronic pattern raises concern for mesenteric arterial occlusion and requires prompt CTA.",
          ],
          wrong: [
            [
              "Portal-venous-phase abdominal CT",
              "A routine portal-venous study is not the dedicated arterial evaluation requested for suspected mesenteric ischemia.",
              { timingProfileId: CT },
            ],
            [
              "Mesenteric duplex ultrasound",
              "Duplex is less suitable than CTA for the prompt comprehensive acute evaluation required here.",
              { timingProfileId: US },
            ],
            [
              "Mesenteric magnetic resonance angiography",
              "MRI is less suitable than immediately available CTA for this acute vascular presentation.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "The sudden change from chronic postprandial symptoms to severe constant pain suggests an acute mesenteric event and warrants immediate CTA.",
          claims: ["claim.gs028c.ami.cta-without-delay"],
          acuity: "urgent",
          ageYears: [58, 72],
          sexLabels: ["Female", "Male"],
          test: { timingProfileId: CTA },
        },
        {
          slug: "kidney-injury",
          complaint: "Severe pain with AKI",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents to the clinic with sudden severe abdominal pain out of proportion to examination findings and a new acute kidney injury. Embolic acute mesenteric ischemia remains the leading concern, and there is no overt peritonitis.",
          stem:
            "Which imaging decision best evaluates suspected acute mesenteric ischemia despite this patient's kidney injury?",
          correct: [
            "Mesenteric CT angiography",
            "The danger of delayed or missed mesenteric ischemia outweighs the contrast concern from acute kidney injury alone.",
          ],
          wrong: [
            [
              "Mesenteric duplex ultrasound",
              "Duplex does not replace prompt comprehensive CTA in this suspected mesenteric emergency.",
              { timingProfileId: US },
            ],
            [
              "Use noncontrast CT instead",
              "Noncontrast CT does not provide the needed mesenteric vascular evaluation.",
              { timingProfileId: CT },
            ],
            [
              "Mesenteric magnetic resonance angiography",
              "MRI is less suitable than immediately available CTA for this acute vascular presentation.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "Do not allow acute kidney injury alone to delay the diagnostic test for a lethal vascular emergency. Transfer, resuscitate, and obtain CTA promptly.",
          claims: [
            "claim.gs028c.ami.cta-without-delay",
            "claim.gs028c.ami.aki-does-not-delay-cta",
          ],
          acuity: "urgent",
          ageYears: [66, 79],
          sexLabels: ["Female", "Male"],
          test: { timingProfileId: CTA },
        },
        {
          slug: "possible-arterial-thrombosis",
          complaint: "Abrupt abdominal pain",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex} with known diffuse atherosclerotic disease develops abrupt, severe central abdominal pain during a clinic visit, with minimal early guarding and no overt peritonitis.",
          stem:
            "Which next diagnostic imaging action is required for this patient's suspected acute mesenteric ischemia?",
          correct: [
            "Mesenteric CT angiography",
            "The vascular risk and disproportionate pain warrant CTA without waiting for laboratory progression.",
          ],
          wrong: [
            [
              "Portal-venous-phase abdominal CT",
              "A routine portal-venous study does not provide the dedicated arterial evaluation required here.",
              { timingProfileId: CT },
            ],
            [
              "Mesenteric duplex ultrasound",
              "Routine ultrasound does not provide the required acute mesenteric arterial assessment.",
              { timingProfileId: US },
            ],
            [
              "Mesenteric magnetic resonance angiography",
              "MRI is less suitable than immediately available CTA for this acute vascular presentation.",
              { timingProfileId: MRI },
            ],
          ],
          explanation:
            "The acute vascular presentation warrants emergency transfer and dedicated mesenteric CTA without delay.",
          claims: ["claim.gs028c.ami.cta-without-delay"],
          acuity: "urgent",
          ageYears: [60, 74],
          sexLabels: ["Female", "Male"],
          test: { timingProfileId: CTA },
        },
      ]),
    },
    {
      id: "concept.acute-mesenteric-ischemia.peritonitis-exploration",
      displayName: "Immediate exploration for mesenteric ischemia with peritonitis",
      learningObjective:
        "Send suspected acute mesenteric ischemia with overt peritonitis for immediate operative exploration without further diagnostic delay.",
      stage: 0,
      educationalTier: 1,
      conceptType: "disposition",
      evidenceClaimIds: ["claim.gs028c.ami.peritonitis-exploration"],
      variants: variants([
        {
          slug: "rigid-abdomen",
          complaint: "Severe pain and rigidity",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, has suspected acute mesenteric ischemia in the clinic and now develops a rigid abdomen with involuntary guarding and rebound tenderness. Emergency surgical and vascular teams are available at the receiving hospital.",
          stem:
            "Which disposition and operative plan should take priority for this patient with suspected acute mesenteric ischemia and peritonitis?",
          correct: [
            "Transfer for emergency exploration",
            "Overt peritonitis implies likely bowel infarction and requires surgery without additional diagnostic delay.",
          ],
          wrong: [
            [
              "CTA before operative transfer",
              "Additional clinic-directed imaging would delay the operative assessment required for overt peritonitis.",
              { timingProfileId: CTA },
            ],
            [
              "Observation with repeat examination",
              "Serial observation is unsafe once overt peritonitis suggests infarcted bowel.",
            ],
            [
              "Endovascular revascularization alone",
              "Revascularization alone does not assess or remove infarcted bowel once overt peritonitis is present.",
            ],
          ],
          explanation:
            "Suspected mesenteric ischemia plus overt peritonitis requires prompt exploration to assess viability, resect nonviable bowel, and coordinate revascularization.",
          claims: ["claim.gs028c.ami.peritonitis-exploration"],
          acuity: "urgent",
          ageYears: [62, 77],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "peritonitis-after-cta",
          complaint: "Pain suddenly worsened",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, brings a same-day outside CTA to the clinic confirming superior mesenteric arterial occlusion. While emergency transfer is being coordinated, the abdomen becomes diffusely tender with rebound and involuntary guarding.",
          stem:
            "What is the required next step after this patient with suspected acute mesenteric ischemia develops peritonitis?",
          correct: [
            "Transfer for emergency exploration",
            "The new overt peritonitis indicates probable infarction and requires prompt operative assessment.",
          ],
          wrong: [
            [
              "Repeat CTA before treatment",
              "The vascular diagnosis is already known and the new peritonitis requires action rather than repeat imaging.",
              { timingProfileId: CTA },
            ],
            [
              "Continue anticoagulation alone",
              "Anticoagulation alone does not assess or remove infarcted bowel once peritonitis is present.",
            ],
            [
              "Observe for laboratory improvement",
              "Laboratory trends cannot make overt peritonitis safe for continued observation.",
            ],
          ],
          explanation:
            "Peritonitis after a known mesenteric occlusion is an operative emergency. Exploration and revascularization planning proceed together.",
          claims: ["claim.gs028c.ami.peritonitis-exploration"],
          acuity: "urgent",
          ageYears: [59, 73],
          sexLabels: ["Female", "Male"],
        },
        {
          slug: "guarding-and-shock",
          complaint: "Abdominal collapse",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, develops a high-risk acute mesenteric ischemia presentation in the clinic with worsening hypotension, diffuse rebound tenderness, and involuntary guarding. Emergency support is underway, and the receiving hospital has operative capability.",
          stem:
            "Which definitive action must accompany resuscitation for this patient's suspected acute mesenteric ischemia with peritonitis?",
          correct: [
            "Transfer for emergency exploration",
            "Resuscitation should proceed without postponing surgery for overt peritonitis and likely bowel infarction.",
          ],
          wrong: [
            [
              "Delay surgery until blood pressure normalizes",
              "Optimization is necessary, but full normalization must not become a reason to postpone required source control and viability assessment.",
            ],
            [
              "Endovascular revascularization alone",
              "Revascularization alone does not assess or remove infarcted bowel in this peritonitic patient.",
            ],
            [
              "Treat with antibiotics alone",
              "Antibiotics support care but cannot replace exploration of suspected infarcted bowel.",
            ],
          ],
          explanation:
            "Continue immediate resuscitation and broad acute-care management, but do not delay operative exploration when peritonitis indicates likely bowel infarction.",
          claims: ["claim.gs028c.ami.peritonitis-exploration"],
          acuity: "urgent",
          ageYears: [65, 80],
          sexLabels: ["Female", "Male"],
          prototypeVitalSigns: {
            heartRateBpm: 126,
            systolicBloodPressureMmHg: 88,
            diastolicBloodPressureMmHg: 54,
            temperatureF: 100.1,
            oxygenSaturationPercent: 95,
          },
        },
        {
          slug: "late-peritoneal-findings",
          complaint: "Severe pain with rebound",
          presentation:
            "{patientName}, a {patientAge}-year-old {patientSex}, presents late to the clinic after abrupt abdominal pain. Examination now shows generalized rebound and involuntary guarding, and the history strongly suggests acute mesenteric ischemia. No prior imaging is available.",
          stem:
            "Which operative plan is most appropriate when this patient with suspected acute mesenteric ischemia has overt peritonitis?",
          correct: [
            "Transfer for emergency exploration",
            "Overt peritonitis is sufficient to prioritize emergency operative assessment over obtaining preoperative CTA.",
          ],
          wrong: [
            [
              "CTA before operative transfer",
              "Additional clinic-directed imaging would delay the prompt surgical assessment required by overt peritonitis.",
              { timingProfileId: CTA },
            ],
            [
              "Hospital anticoagulation with observation",
              "Anticoagulation and observation do not assess or remove infarcted bowel once overt peritonitis is present.",
            ],
            [
              "Endovascular revascularization alone",
              "Revascularization alone does not assess or remove infarcted bowel once overt peritonitis is present.",
            ],
          ],
          explanation:
            "Overt peritonitis in suspected mesenteric ischemia requires prompt surgical assessment and operative treatment without clinic-directed imaging or nonoperative delay.",
          claims: [
            "claim.gs028c.ami.cta-without-delay",
            "claim.gs028c.ami.peritonitis-exploration",
          ],
          acuity: "urgent",
          ageYears: [56, 71],
          sexLabels: ["Female", "Male"],
        },
      ]),
    },
  ],
});

export const URGENT_FAMILIES = [
  APPENDICITIS,
  CHOLECYSTITIS,
  BILIARY_PANCREATITIS,
  ACUTE_LIMB_ISCHEMIA,
  ACUTE_MESENTERIC_ISCHEMIA,
];
