import { buildFamily, type ConceptSpec, type FamilySpec, type VariantSpec } from "./family-builder";
import { ETHICS_SOURCES } from "./ethics-source-catalog";
import { CLINICAL_ANCHORS, type ClinicalAnchorKey } from "./statistics-variants";
type Wrong = [string, string];
type Story = { clinicalAnchor:ClinicalAnchorKey; complaint:string; body:string; task:string; key:string; why:string; keyRationale:string; teachingPoint:string; explanation:string; claimIds:string[]; ageYears:readonly number[]; update?:string; wrong:[Wrong,Wrong,Wrong]; spanish?:boolean; sources?:Array<keyof typeof ETHICS_SOURCES> };
type Topic = { id:string; title:string; objective:string; sources:Array<keyof typeof ETHICS_SOURCES>; stories:[Story,Story,Story,Story] };
// Original teaching cases. Keys are first only in this authoring artifact; runtime shuffles.
// Wording revision: 2026-10-16, round 3 revision 1 diverse clinical anchors.
// Keep why as the existing atomic claim; visible lessons and fallbacks are separate.
const topics: Topic[] = [
  {
    "id": "qualified-interpreter",
    "title": "Use qualified interpretation",
    "objective": "Arrange qualified interpretation when language discordance prevents an informed clinical discussion.",
    "sources": [
      "interpreterAhrq",
      "interpreterHhs",
      "consent"
    ],
    "stories": [
      {
        "complaint": "Preguntas sobre cirugía",
        "spanish": true,
        "body": "{patientName}, una mujer de {patientAge} años, consulta por cálculos biliares sintomáticos confirmados por ecografía. Quiere hablar de la operación propuesta y prefiere español. El cirujano no puede comunicarse adecuadamente con ella. Su hija menor ofrece traducir; no hay una intérprete cualificada presente. La paciente trae preguntas sobre las opciones antes de decidir si acepta la cirugía.",
        "task": "Before discussing laparoscopic cholecystectomy for {patientName}'s symptomatic gallstones, what communication support is needed when patient and surgeon cannot communicate adequately?",
        "key": "Arrange qualified Spanish interpretation",
        "why": "Qualified interpretation supports meaningful consent when patient and clinician cannot communicate adequately. A child's offer does not establish interpreter competence.",
        "wrong": [
          [
            "Use the child's interpretation for consent",
            "The child wants to help, but willingness does not establish the competence needed for this clinical consent discussion. The patient still needs qualified interpretation."
          ],
          [
            "Ask a bilingual clinic clerk to interpret",
            "Speaking Spanish is not itself evidence of competence to interpret clinical information. The employee's qualification has not been established."
          ],
          [
            "Use a translated Spanish consent handout",
            "Written information can support the discussion, but cannot provide the qualified two-way exchange needed for the patient's own clinical questions."
          ]
        ],
        "keyRationale": "Qualified Spanish interpretation supports an understandable discussion and the patient's own questions. Neither the child's offer nor the employee's bilingual skill establishes competence to interpret clinical information.",
        "teachingPoint": "Consent needs an understandable conversation, including the patient's own questions. When patient and clinician cannot communicate adequately, arrange qualified interpretation. A child's offer or an employee's conversational bilingual skill does not establish that competence. Make the conversation possible before asking for a decision; written materials can support, but cannot replace, that exchange.",
        "explanation": "Arrange qualified Spanish interpretation so the patient can discuss the proposed cholecystectomy and ask questions. Neither the child's willingness nor the employee's bilingual conversation establishes interpreter competence.",
        "claimIds": [
          "claim.gs028se.qualified-interpreter.1",
          "claim.gs028se.qualified-interpreter.3",
          "claim.gs028se.qualified-interpreter.4",
          "claim.gallstones.symptomatic-referral"
        ],
        "ageYears": [
          43,
          68
        ],
        "clinicalAnchor": "gallstones"
      },
      {
        "complaint": "Opciones para Graves",
        "spanish": true,
        "body": "{patientName}, una mujer de {patientAge} años, tiene enfermedad de Graves y consulta sobre las opciones de tratamiento, incluida la cirugía. Prefiere español. Una aplicación traduce parte de la conversación, pero sus preguntas y respuestas siguen poco claras. La paciente quiere entender las alternativas antes de decidir; el equipo aún no cuenta con una intérprete cualificada.",
        "task": "What communication support is needed for {patientName}'s Graves-treatment discussion when the translation application leaves the patient's questions and answers unclear?",
        "key": "Arrange qualified medical interpretation",
        "why": "When automated translation leaves important uncertainty, qualified interpretation supports an understandable consent discussion.",
        "wrong": [
          [
            "Use the application's translated discussion",
            "The application's output is already confusing and has not answered the patient's question. Reusing it does not establish an understandable exchange."
          ],
          [
            "Ask a bilingual companion to interpret",
            "A companion's language ability does not automatically establish qualified clinical interpretation. The patient's question needs an accurate, understandable exchange."
          ],
          [
            "Provide translated written treatment information",
            "A translated handout may support information, but it does not by itself resolve the patient's unanswered question through a two-way interpreted conversation."
          ]
        ],
        "keyRationale": "The app has left the patient's question about the Graves treatment unresolved. Qualified interpretation is needed to make the clinical exchange understandable before relying on consent.",
        "teachingPoint": "A translation tool has not solved communication merely because it produces words. Here the patient's clinical question remains unclear, so qualified interpretation is needed for an understandable exchange. Remember the purpose: let the patient understand and ask questions before choosing. A companion or handout does not automatically supply that two-way clinical conversation.",
        "explanation": "The application has left the treatment question unresolved. Arrange qualified interpretation before relying on the consent discussion; translated text alone does not establish that the exchange is understood.",
        "claimIds": [
          "claim.gs028se.qualified-interpreter.2",
          "claim.gs028se.qualified-interpreter.1",
          "claim.gs028se.qualified-interpreter.3",
          "claim.graves-rai-appropriate-candidate.graves-context",
          "claim.graves-rai-appropriate-candidate.preference-sensitive-options"
        ],
        "ageYears": [
          68,
          43
        ],
        "clinicalAnchor": "graves"
      },
      {
        "complaint": "Preguntas sobre biopsia",
        "spanish": true,
        "body": "{patientName}, una mujer de {patientAge} años, consulta sobre una biopsia de una lesión sospechosa de carcinoma escamoso cutáneo. Prefiere español. Su pareja contesta en inglés, pero las preguntas de ella siguen sin entenderse. El equipo no tiene una intérprete cualificada disponible todavía. La paciente intenta preguntar qué se hará antes de dar permiso para la biopsia.",
        "task": "What communication support is needed for {patientName}'s skin-biopsy discussion when a relative answers but the patient's own questions remain unheard?",
        "key": "Arrange qualified Spanish interpretation",
        "why": "Qualified interpretation supports the patient's own questions and decisions when accurate independent communication is lacking; family participation does not automatically replace it.",
        "wrong": [
          [
            "Ask the partner to relay the patient's questions",
            "The patient specifically wants to ask questions directly. Relying on the partner neither provides that exchange nor establishes qualified interpretation."
          ],
          [
            "Ask a bilingual staff member to translate",
            "Bilingual ability alone does not establish clinical interpreter competence. Another employee's language skills must not be treated as qualification by assumption."
          ],
          [
            "Use a translated form for the patient's questions",
            "A translated form cannot conduct the understandable two-way discussion the patient requests. Written support does not substitute for qualified interpretation."
          ]
        ],
        "keyRationale": "Qualified interpretation lets the patient speak and ask questions directly. The partner's answers cannot replace that participation when accurate independent communication is lacking.",
        "teachingPoint": "Family participation can support a patient without replacing the patient's voice. When accurate communication is lacking, qualified interpretation lets the patient ask questions and make the decision directly. Remember to address the patient, not simply whoever speaks most. A partner's willingness or another employee's bilingual ability does not establish qualified clinical interpretation.",
        "explanation": "Arrange qualified Spanish interpretation for the patient's own questions. The partner's answers do not replace an understandable direct discussion, and bilingual ability alone does not establish interpreter competence.",
        "claimIds": [
          "claim.gs028se.qualified-interpreter.3",
          "claim.gs028se.qualified-interpreter.1",
          "claim.gs028se.qualified-interpreter.4",
          "claim.cutaneous-scc.biopsy-for-diagnosis-and-risk",
          "claim.cutaneous-scc.risk-directed-surgery"
        ],
        "ageYears": [
          43,
          68
        ],
        "clinicalAnchor": "cutaneous-scc"
      },
      {
        "complaint": "Preguntas sobre manometría",
        "spanish": true,
        "body": "{patientName}, una mujer de {patientAge} años, consulta por sospecha de acalasia tras excluir una obstrucción estructural. Quiere hablar de la manometría propuesta y prefiere español. La recepcionista conoce algunas frases, pero no está cualificada para interpretar. La paciente todavía no entiende la conversación clínica y trae preguntas antes de decidir si acepta el estudio propuesto.",
        "task": "What communication support is needed before {patientName} decides about esophageal manometry when the receptionist's limited Spanish cannot support the clinical discussion?",
        "key": "Arrange qualified medical interpretation",
        "why": "Knowing a few phrases does not establish the ability to interpret complex clinical information accurately and impartially.",
        "wrong": [
          [
            "Use the receptionist's conversational Spanish",
            "Knowing some phrases is not competence to interpret complex clinical information accurately and impartially. The supplied employee cannot fill that role."
          ],
          [
            "Use an application to translate the discussion",
            "The proposed app does not establish that this clinical consent conversation will be understood. The missing support is qualified interpretation."
          ],
          [
            "Use a translated handout with written replies",
            "Written exchanges do not establish an understandable clinical consent discussion or replace the qualified interpretation needed for the patient's questions."
          ]
        ],
        "keyRationale": "The receptionist is not qualified to interpret clinical information, and the clinician cannot support the full exchange. Arrange qualified interpretation for the patient's manometry questions and informed choice.",
        "teachingPoint": "Knowing some phrases is different from interpreting clinical information accurately and impartially. This employee is not qualified for the discussion, so arrange qualified interpretation before relying on consent. Remember to assess whether the exchange is understandable, not whether someone can produce a translation. Written exchanges and apps do not establish that missing competence here.",
        "explanation": "Arrange qualified interpretation for the clinical discussion. The receptionist is explicitly not qualified, and the proposed app or written exchanges do not establish the needed understandable conversation.",
        "claimIds": [
          "claim.gs028se.qualified-interpreter.4",
          "claim.gs028se.qualified-interpreter.1",
          "claim.achalasia.high-resolution-manometry",
          "claim.achalasia.manometric-recognition"
        ],
        "ageYears": [
          68,
          43
        ],
        "clinicalAnchor": "achalasia"
      }
    ]
  },
  {
    "id": "informed-consent",
    "title": "Make consent understandable and voluntary",
    "objective": "Correct missing understanding, alternatives or voluntariness before elective procedural consent.",
    "sources": [
      "consent",
      "interpreterAhrq"
    ],
    "stories": [
      {
        "sources": [
          "consent"
        ],
        "complaint": "Gallbladder surgery questions",
        "body": "has recurrent symptoms with ultrasound-confirmed gallstones and is discussing laparoscopic cholecystectomy. A signed form lists the operation, but material risks, benefits and alternatives have not been discussed. The surgeon calls the form self-explanatory, then asks the nurse to explain its instructions. The patient has questions before agreeing to surgery.",
        "task": "With qualified interpretation in place, what is needed for informed consent to {patientName}'s laparoscopic cholecystectomy when material information has not been discussed?",
        "key": "Discuss risks, benefits, and alternatives",
        "why": "Consent requires an understandable discussion of the intervention, relevant risks and benefits, and alternatives including foregoing treatment; a signature alone is insufficient.",
        "wrong": [
          [
            "Confirm the form was signed voluntarily",
            "Voluntary signing matters, but confirming it does not supply the omitted risks, benefits, and alternatives. Information and voluntariness are separate needs."
          ],
          [
            "Have the patient reread the consent document",
            "Rereading the document does not by itself supply the clinical conversation that never occurred. A form can document consent without replacing the discussion."
          ],
          [
            "Ask the patient to describe the planned operation",
            "Describing the procedure's purpose checks only part of understanding. The stated gaps about relevant risks, benefits, and alternatives remain."
          ]
        ],
        "keyRationale": "The patient lacks the clinical information needed to choose. Discuss the intervention's relevant risks, benefits, and alternatives, including foregoing it, in an understandable conversation.",
        "teachingPoint": "Informed consent helps a person understand the intervention, its relevant risks and benefits, and alternatives including declining, so the person can choose voluntarily. A signature cannot replace that conversation. The patient needs that discussion before the form can be relied on for the operation. Remember: document the conversation, rather than substituting a document for it.",
        "explanation": "The missing step is an understandable discussion of the intervention, risks, benefits, and alternatives. Confirming a signature or willingness alone does not fill those information gaps.",
        "claimIds": [
          "claim.gs028se.informed-consent.1",
          "claim.gs028se.informed-consent.4",
          "claim.gs028se.qualified-interpreter.1",
          "claim.gallstones.symptomatic-referral"
        ],
        "ageYears": [
          43,
          68
        ],
        "update": "With qualified Spanish interpretation, {patientName}, a {patientAge}-year-old {patientSex}, has recurrent symptoms with ultrasound-confirmed gallstones and is discussing laparoscopic cholecystectomy. A signed form lists the operation, but material risks, benefits and alternatives have not been discussed. The surgeon calls the form self-explanatory, then asks the nurse to explain its instructions. The patient has questions before agreeing to surgery.",
        "clinicalAnchor": "gallstones"
      },
      {
        "sources": [
          "consent"
        ],
        "complaint": "Thyroid treatment options",
        "body": "has Graves disease and is considering surgery after discussing treatment goals. The patient can describe the proposed operation but has not heard the alternatives, including foregoing it. The clinic advertises a choice of appointments; both booking buttons lead to the same unavailable slot. The patient asks what other options exist.",
        "task": "With qualified interpretation in place, what information is missing before {patientName} can make an informed choice about surgery for Graves disease?",
        "key": "Discuss alternatives, including no procedure",
        "why": "An informed decision includes relevant alternatives and the implications of foregoing the proposed intervention, tailored to the patient's situation.",
        "wrong": [
          [
            "Review the operation's expected diagnostic benefit",
            "Expected diagnostic benefit is relevant, but repeating it leaves the question about declining and other options unanswered."
          ],
          [
            "Review the operation's principal procedural risks",
            "Procedural risks are relevant, but reviewing them alone still omits the alternatives and implications of no procedure that the patient is asking about."
          ],
          [
            "Ask the patient to choose a surgical appointment",
            "Choosing an appointment assumes the procedure decision is made. The patient still needs information about alternatives before making that choice."
          ]
        ],
        "keyRationale": "The patient asks whether declining is an option. Discuss relevant alternatives and the implications of foregoing the operation, tailored to the situation.",
        "teachingPoint": "A decision is informed only if the patient can consider relevant alternatives, including foregoing the proposed intervention and what that would mean. Reviewing the procedure's benefits or risks alone leaves that question unanswered. Remember to explain the choice, not only the offered procedure, using an understandable conversation tailored to the patient's situation.",
        "explanation": "Discuss relevant alternatives, including no procedure and its implications. Repeating operation benefits or risks does not answer the patient's specific question about declining.",
        "claimIds": [
          "claim.gs028se.informed-consent.2",
          "claim.gs028se.informed-consent.1",
          "claim.gs028se.qualified-interpreter.2",
          "claim.graves-rai-appropriate-candidate.graves-context",
          "claim.graves-rai-appropriate-candidate.preference-sensitive-options"
        ],
        "ageYears": [
          68,
          43
        ],
        "update": "With qualified Spanish interpretation, {patientName}, a {patientAge}-year-old {patientSex}, has Graves disease and is considering surgery after discussing treatment goals. The patient can describe the proposed operation but has not heard the alternatives, including foregoing it. The clinic advertises a choice of appointments; both booking buttons lead to the same unavailable slot. The patient asks what other options exist.",
        "clinicalAnchor": "graves"
      },
      {
        "complaint": "Biopsy expectations",
        "body": "is discussing biopsy of a lesion suspicious for cutaneous SCC. After hearing the explanation, the patient says the procedure guarantees no scar. The presenter promises questions are welcome, then announces that questions ended on the previous slide. The biopsy has not started, and there is time to revisit the discussion.",
        "task": "With qualified interpretation in place, what should the team do when {patientName} mistakenly expects the skin biopsy to guarantee no scar?",
        "key": "Clarify scarring and ask for teach-back",
        "why": "A demonstrated misunderstanding should be addressed before relying on consent. Asking the patient to explain the plan in their own words helps assess understanding.",
        "wrong": [
          [
            "Repeat the explanation of the biopsy technique",
            "Repeating the biopsy technique does not necessarily address the supposed guarantee about scarring or check that the misunderstanding has been corrected."
          ],
          [
            "Ask the patient to confirm willingness to proceed",
            "Willingness to proceed is different from understanding the expected result. Confirming willingness leaves the demonstrated scarring misconception unresolved."
          ],
          [
            "Review the signed consent form with the patient",
            "Reviewing the form alone does not establish that the specific mistaken expectation has changed. Clarification and a check of understanding are needed."
          ]
        ],
        "keyRationale": "The patient has demonstrated a specific misunderstanding about scarring. Clarify it, then ask the patient to explain the plan in their own words before relying on consent.",
        "teachingPoint": "A nod or signature does not settle a demonstrated misunderstanding. Clarify the mistaken expectation, then ask the patient to explain the plan in their own words to check understanding. Here the concern is a supposed guarantee about scarring. Remember: check what the patient understood, rather than assuming that hearing an explanation means understanding it.",
        "explanation": "Clarify the mistaken scarring guarantee and ask for teach-back before relying on consent. Willingness or another reading of the form does not by itself establish corrected understanding.",
        "claimIds": [
          "claim.gs028se.informed-consent.3",
          "claim.gs028se.informed-consent.1",
          "claim.gs028se.qualified-interpreter.3",
          "claim.cutaneous-scc.biopsy-for-diagnosis-and-risk",
          "claim.cutaneous-scc.risk-directed-surgery"
        ],
        "ageYears": [
          43,
          68
        ],
        "update": "With qualified Spanish interpretation, {patientName}, a {patientAge}-year-old {patientSex}, is discussing biopsy of a lesion suspicious for cutaneous SCC. After hearing the explanation, the patient says the procedure guarantees no scar. The presenter promises questions are welcome, then announces that questions ended on the previous slide. The biopsy has not started, and there is time to revisit the discussion.",
        "clinicalAnchor": "cutaneous-scc"
      },
      {
        "sources": [
          "consent"
        ],
        "complaint": "Manometry permission",
        "body": "is discussing nonurgent manometry for suspected achalasia after structural obstruction was excluded. Information has been provided, but a companion threatens to withhold transportation unless the patient signs. In private, the patient says the study is unwanted. Testing has not started, and there is time to discuss the patient's own choice.",
        "task": "With qualified interpretation in place, how should the team respond when {patientName} privately declines nonurgent manometry after a companion threatens to withhold transportation unless the patient signs?",
        "key": "Pause and support the patient's voluntary choice",
        "why": "Consent must be voluntary; a refusal expressed under coercive pressure should prompt protection of the patient's choice rather than reliance on a pressured signature.",
        "wrong": [
          [
            "Ask the patient to confirm consent with the companion",
            "Asking for confirmation in the companion's presence preserves the setting of pressure. It does not protect the voluntary choice expressed in private."
          ],
          [
            "Offer another appointment with the same companion",
            "A later appointment with the same companion does not itself address the pressure undermining consent. Changing the date is not a voluntariness assessment."
          ],
          [
            "Ask the companion to explain the patient's preferences",
            "The companion's account cannot replace the patient's private expressed preference. Practical support does not give the companion authority to impose the elective choice."
          ]
        ],
        "keyRationale": "The patient privately says the procedure is unwanted after a threat about transport. Pause the elective process and support a voluntary choice rather than rely on the pressured signature.",
        "teachingPoint": "Consent requires a voluntary choice as well as information and understanding. A signature obtained under the pressure described here cannot substitute for the patient's expressed preference. Pause the nonurgent process and support a voluntary decision in private. Remember that a companion's wishes do not become the patient's wishes merely because the companion provides practical support.",
        "explanation": "Pause and support the patient's voluntary choice. The private refusal and companion's threat undermine reliance on a pressured signature for an nonurgent study with no urgent need.",
        "claimIds": [
          "claim.gs028se.informed-consent.4",
          "claim.gs028se.qualified-interpreter.1",
          "claim.achalasia.high-resolution-manometry",
          "claim.achalasia.manometric-recognition"
        ],
        "ageYears": [
          68,
          43
        ],
        "update": "With qualified Spanish interpretation, {patientName}, a {patientAge}-year-old {patientSex}, is discussing nonurgent manometry for suspected achalasia after structural obstruction was excluded. Information has been provided, but a companion threatens to withhold transportation unless the patient signs. In private, the patient says the study is unwanted. Testing has not started, and there is time to discuss the patient's own choice.",
        "clinicalAnchor": "achalasia"
      }
    ]
  },
  {
    "id": "capacity-refusal",
    "title": "Respect capable refusal",
    "objective": "Distinguish an unwelcome choice from impaired decision-making capacity.",
    "sources": [
      "consent",
      "capacity"
    ],
    "stories": [
      {
        "complaint": "Declining appendectomy",
        "body": "has acute appendicitis with an appendicolith and is discussing appendectomy in hospital. The patient accurately explains the recommendation, alternatives and consequences of declining, gives coherent personal reasons and consistently refuses. No immediate emergency prevents discussion. The surgeon favors surgery and asks whether disagreement means somebody else should make the decision.",
        "task": "How should the team respond to {patientName}'s informed refusal of appendectomy when the stated decision-making abilities are intact?",
        "key": "Respect refusal and discuss follow-up",
        "why": "Disagreement with a recommendation does not itself establish incapacity. A capable adult's informed refusal should be respected.",
        "wrong": [
          [
            "Request psychiatric clearance before accepting refusal",
            "The supplied concern is disagreement, not inability to decide. That alone does not establish a need for psychiatric clearance before accepting an informed refusal."
          ],
          [
            "Ask the family to confirm the treatment decision",
            "The patient's demonstrated abilities support making this decision. Family agreement is not what validates this capable adult's informed refusal."
          ],
          [
            "Repeat consent counseling until surgery is accepted",
            "Further counseling can address an unanswered question, but repeating it until agreement replaces the informed choice already demonstrated in this scenario."
          ]
        ],
        "keyRationale": "The patient demonstrates informed understanding, coherent reasoning, and a consistent refusal. Respect that choice and discuss follow-up; surgeon disagreement does not establish incapacity.",
        "teachingPoint": "Capacity concerns the decision in front of you and the patient's demonstrated abilities, not agreement with the clinician. This patient understands the options and personal implications, reasons coherently, and communicates a consistent refusal. Respect that informed choice and discuss follow-up. Remember: a recommendation can be reasonable without making disagreement evidence of incapacity.",
        "explanation": "Respect the informed refusal and discuss follow-up. The patient demonstrates the required abilities; the surgeon's disagreement alone does not justify replacing the decision or requiring psychiatric or family approval.",
        "claimIds": [
          "claim.gs028se.capacity-refusal.1",
          "claim.gs028se.capacity-refusal.3",
          "claim.gs028c.appendicitis.appendicolith-operative-pathway"
        ],
        "ageYears": [
          32,
          61
        ],
        "clinicalAnchor": "appendix"
      },
      {
        "complaint": "Confusion before consent",
        "body": "has confirmed primary hyperparathyroidism with kidney stones and is attending elective parathyroid surgical assessment. Despite signing earlier, the patient is newly confused, cannot explain the operation's purpose after discussion and gives rapidly changing answers. Surgery has not started. A colleague asks whether the earlier signature can authorize the proposed operation.",
        "task": "What should the team do before elective parathyroid surgery when {patientName} is newly confused and cannot understand the operation despite an earlier consent signature?",
        "key": "Pause and assess capacity for this decision",
        "why": "Capacity concerns the present decision and can change. New confusion and inability to understand warrant assessment before an elective intervention.",
        "wrong": [
          [
            "Verify the earlier consent and continue preparation",
            "The earlier signature records an earlier discussion. It does not resolve the patient's new inability to understand the current decision."
          ],
          [
            "Obtain a fresh signature after repeating the explanation",
            "A fresh signature after another repetition does not establish understanding. The patient's present abilities need assessment rather than replacement documentation."
          ],
          [
            "Ask a relative to approve the procedure first",
            "A relative's approval first bypasses assessment of the patient's current decision-making abilities. Address the present concern before assuming someone else should decide."
          ]
        ],
        "keyRationale": "New confusion, inability to explain the purpose, and changing answers raise present capacity concerns. Pause and assess this decision before the elective intervention.",
        "teachingPoint": "Capacity can change, so an earlier signature does not answer a present concern about understanding. New confusion and inability to explain this procedure warrant pausing and assessing the current decision. Remember to assess the person now for this choice. A fresh signature or a relative's approval does not replace addressing that concern.",
        "explanation": "Pause the elective process and assess capacity for the current decision. The earlier form does not resolve new confusion and inability to explain the procedure's purpose.",
        "claimIds": [
          "claim.gs028se.capacity-refusal.2",
          "claim.primary-hyperparathyroidism.biochemical-pattern",
          "claim.primary-hyperparathyroidism.renal-bone-surgery-assessment"
        ],
        "ageYears": [
          74,
          48
        ],
        "clinicalAnchor": "hyperparathyroidism"
      },
      {
        "complaint": "Declining thyroid sampling",
        "body": "has a suspicious thyroid nodule meeting biopsy criteria and is discussing needle sampling. The chart records treated depression. A colleague questions accepting refusal because of that diagnosis. The patient accurately explains the options and personal consequences, reasons coherently and communicates a stable choice against sampling. The procedure has not started.",
        "task": "How should the team assess {patientName}'s refusal of thyroid needle sampling when treated depression is recorded but the stated decision-making abilities are intact?",
        "key": "Assess current decision-making abilities",
        "why": "A diagnosis alone does not establish incapacity; assessment concerns abilities for the specific decision. The described abilities support respecting refusal.",
        "wrong": [
          [
            "Require psychiatric clearance because of depression",
            "Depression alone does not establish incapacity or a requirement for psychiatric clearance. The actual abilities demonstrated in this discussion matter."
          ],
          [
            "Use the family's account of the patient's usual judgment",
            "Family observations can provide context, but a description of usual judgment does not replace assessing the patient's present abilities for this decision."
          ],
          [
            "Judge capacity by agreement with the recommendation",
            "Agreement with the clinician is not a capacity criterion. A reasoned refusal can demonstrate the required abilities even when the clinician favors revision."
          ]
        ],
        "keyRationale": "Assess the demonstrated abilities for this specific decision. Accurate understanding, personal appreciation, coherent reasoning, and a stable choice cannot be dismissed because depression is recorded.",
        "teachingPoint": "A diagnosis is not a capacity verdict. Assess understanding, personal appreciation, reasoning, and communication for the actual decision. The described abilities support respecting this refusal despite the history of depression. Remember to examine what the patient can do in this discussion, rather than replacing an individual assessment with a diagnostic label or agreement test.",
        "explanation": "Judge current abilities for this decision, not depression alone. The patient demonstrates understanding, appreciation, coherent reasoning, and a stable choice, supporting respect for the refusal.",
        "claimIds": [
          "claim.gs028se.capacity-refusal.3",
          "claim.gs028se.capacity-refusal.1",
          "claim.thyroid-nodule.fna-after-selected-ultrasound"
        ],
        "ageYears": [
          45,
          69
        ],
        "clinicalAnchor": "thyroid-nodule"
      },
      {
        "complaint": "Supported treatment decision",
        "body": "has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.",
        "task": "How should the team approach {patientName}'s decision about a varicose-vein intervention when mild cognitive impairment is recorded but supported understanding is demonstrated?",
        "key": "Support and assess the patient's own decision",
        "why": "Cognitive impairment does not eliminate capacity for every decision. Support understanding and assess actual abilities before seeking a substitute decision-maker.",
        "wrong": [
          [
            "Obtain a surrogate's decision because of the diagnosis",
            "Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support."
          ],
          [
            "Require a family countersignature for this consent",
            "A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent."
          ],
          [
            "Require formal testing before discussing the choice",
            "The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities."
          ]
        ],
        "keyRationale": "Support understanding and assess the patient's own abilities for vein intervention. The described informed, consistent choice should not be displaced solely by the cognitive diagnosis.",
        "teachingPoint": "Cognitive impairment does not remove capacity for every decision. Support understanding and assess the patient's actual abilities for this choice before seeking a substitute decision-maker. Plain language enables an informed, consistent choice. Remember that the diagnosis and the decision are separate questions; a label alone does not transfer authority to family or a surrogate.",
        "explanation": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded.",
        "claimIds": [
          "claim.gs028se.capacity-refusal.4",
          "claim.gs028se.capacity-refusal.3",
          "claim.varicose.intervention-referral"
        ],
        "ageYears": [
          68,
          58
        ],
        "clinicalAnchor": "varicose"
      }
    ]
  },
  {
    "id": "surrogate-decisions",
    "title": "Guide surrogates using patient values",
    "objective": "Apply known patient preferences, or best interests when preferences cannot be determined.",
    "sources": [
      "capacity"
    ],
    "stories": [
      {
        "complaint": "Operative decision",
        "body": "is hospitalized with acute calculous cholecystitis and lacks capacity for the proposed operative decision. An authorized surrogate recalls specific conversations rejecting surgery in these circumstances but personally favors it. The surrogate asks whose preferences should guide the choice. The team has those prior wishes available and has not agreed on a plan.",
        "task": "What should guide the authorized surrogate's operative decision for {patientName}'s acute cholecystitis when known patient wishes differ from the surrogate's own preference?",
        "key": "Use the patient's known preferences",
        "why": "Substituted judgment uses the patient's known preferences and values rather than the surrogate's own treatment preference.",
        "wrong": [
          [
            "Use the surrogate's preferred treatment plan",
            "The surrogate represents the patient's known perspective. Personally favoring treatment does not justify replacing the patient's specific contrary wishes."
          ],
          [
            "Use the family's agreed treatment preference",
            "Family agreement does not displace a known patient preference. Counting relatives' choices answers whose plan is popular, rather than what this patient would choose."
          ],
          [
            "Use the option with the greatest expected benefit",
            "Best-interest deliberation is the fallback when wishes cannot be determined. Here known preferences supply the patient's perspective rather than leaving it unknown."
          ]
        ],
        "keyRationale": "Specific prior discussions identify what this patient would choose in these circumstances. Substituted judgment uses those known wishes rather than the surrogate's own preference.",
        "teachingPoint": "Substituted judgment asks what this patient would choose, using known preferences and values. It does not ask what the surrogate would choose for themselves or what most relatives prefer. Here specific prior wishes are available. Remember that the surrogate represents the patient's perspective; best-interest deliberation is the fallback when that perspective cannot be determined.",
        "explanation": "Use the patient's known preferences through substituted judgment. The surrogate's own preference does not replace specific prior wishes about these circumstances.",
        "claimIds": [
          "claim.gs028se.surrogate-decisions.1",
          "claim.gs028se.surrogate-decisions.2",
          "claim.gs028c.cholecystitis.index-admission-cholecystectomy"
        ],
        "ageYears": [
          71,
          46
        ],
        "clinicalAnchor": "cholecystitis"
      },
      {
        "complaint": "Prolapse surgery deliberation",
        "body": "has full-thickness rectal prolapse and lacks capacity for the proposed surgical decision. An authorized surrogate is present. Reasonable efforts have not identified prior wishes or relevant values. The team can discuss this patient's likely benefits and burdens. The surrogate asks how to approach the choice without knowing what the patient would have wanted.",
        "task": "What should guide the authorized surrogate's rectal-prolapse surgical deliberation for {patientName} when prior wishes and relevant values cannot be determined?",
        "key": "The patient's benefits and burdens",
        "why": "When patient preferences and values cannot be determined, surrogate deliberation should focus on the patient's best interests, including benefits and burdens.",
        "wrong": [
          [
            "The choice most family members would make",
            "A family majority does not establish the patient's best interests. The supplied standard requires attention to the patient's benefits and burdens."
          ],
          [
            "The option with the longest possible survival",
            "Possible survival is one consideration, not a complete substitute for weighing benefits, burdens, and suffering. The standard is broader than maximizing duration alone."
          ],
          [
            "The surrogate's preferred treatment for themself",
            "The surrogate's own treatment preference is not the patient's known preference or a complete assessment of the patient's welfare."
          ]
        ],
        "keyRationale": "The patient's wishes and values remain unknown after reasonable efforts. Best-interest deliberation therefore weighs likely benefits, burdens, and suffering for the patient.",
        "teachingPoint": "When the patient's preferences and values cannot be determined, consider the patient's best interests, including likely benefits, burdens, and suffering. This differs from substituting the surrogate's personal choice or counting family votes. Remember to look for the patient's perspective first; when it is unavailable, keep the patient's welfare at the center of deliberation.",
        "explanation": "Use the patient's best interests, weighing benefits and burdens. No prior preferences can be identified, so neither family voting nor the surrogate's personal treatment preference supplies the standard.",
        "claimIds": [
          "claim.gs028se.surrogate-decisions.2",
          "claim.gs028se.surrogate-decisions.1",
          "claim.brief.rectal-prolapse.surgical-referral"
        ],
        "ageYears": [
          35,
          63
        ],
        "clinicalAnchor": "rectal-prolapse"
      },
      {
        "complaint": "Unresolved investigation decision",
        "body": "has recurrent kidney stones and lacks capacity for a proposed metabolic evaluation. Documented wishes oppose that evaluation, but the authorized surrogate requests it. Further conversation has not resolved the disagreement. No immediate emergency prevents additional discussion. The team and surrogate are asking what should happen before the investigation is arranged.",
        "task": "What is the appropriate next step when the surrogate's requested kidney-stone evaluation conflicts with {patientName}'s documented wishes and discussion has not resolved the disagreement?",
        "key": "Seek ethics support for the conflict",
        "why": "Unresolved conflict between a surrogate request and known patient wishes warrants appropriate institutional ethics support rather than automatic compliance.",
        "wrong": [
          [
            "Ask another relative to approve the requested treatment",
            "Another relative's agreement does not resolve the conflict with the patient's documented wishes. Changing who endorses the plan leaves the same ethical concern."
          ],
          [
            "Use the surrogate's current request as the final decision",
            "An authorized surrogate's request is not automatic permission to disregard known patient wishes. The unresolved disagreement calls for appropriate support."
          ],
          [
            "Repeat the same family meeting before seeking advice",
            "The supplied discussion has already failed to resolve the conflict. Repeating it unchanged is not a substitute for seeking the appropriate institutional ethics support."
          ]
        ],
        "keyRationale": "The request still conflicts with documented wishes despite discussion. Appropriate institutional ethics support addresses that unresolved conflict instead of accepting the surrogate's request automatically.",
        "teachingPoint": "A surrogate request does not automatically override known patient wishes. When discussion leaves that conflict unresolved, appropriate institutional ethics support can help address it rather than accepting the request by default. Remember to preserve the patient's perspective during disagreement. Substituting a different relative or repeating an unchanged meeting does not itself resolve the ethical conflict.",
        "explanation": "Seek appropriate institutional ethics support for the unresolved conflict. The surrogate's request remains inconsistent with documented wishes, and there is time to address it without automatic compliance.",
        "claimIds": [
          "claim.gs028se.surrogate-decisions.3",
          "claim.gs028se.surrogate-decisions.1",
          "claim.nephrolithiasis.recurrent-metabolic"
        ],
        "ageYears": [
          56,
          28
        ],
        "clinicalAnchor": "nephrolithiasis"
      },
      {
        "sources": [
          "capacity"
        ],
        "complaint": "Participation in sampling",
        "body": "has a persistent neck mass under malignancy evaluation and needs an authorized surrogate for the complex needle-sampling decision. The patient can express comfort concerns and simple preferences, and wants to remain in the discussion. The surrogate asks whether the patient should leave while the proposed sampling plan is considered by the team.",
        "task": "How should {patientName} participate in the neck-mass sampling discussion when a surrogate must make the complex decision but the patient can express concerns and preferences?",
        "key": "Include the patient as abilities allow",
        "why": "Even when a surrogate must decide, patients should participate to the extent their abilities permit, with attention to their expressed preferences.",
        "wrong": [
          [
            "Ask the surrogate to relay the patient's concerns",
            "Relying only on the surrogate to relay concerns omits the direct participation the patient can still provide. Needing a surrogate does not require that exclusion."
          ],
          [
            "Limit discussion to the surrogate's treatment choice",
            "Limiting discussion to the surrogate's choice ignores the patient's remaining abilities and expressed comfort concerns. Those views still deserve attention."
          ],
          [
            "Use the patient's simple preference as the final decision",
            "A simple preference can inform deliberation without establishing capacity for the complex decision. Participation should not be mistaken for complete final authority."
          ]
        ],
        "keyRationale": "The patient retains abilities to express concerns and preferences. Include that participation while the authorized surrogate handles the complex choice requiring substitute authority.",
        "teachingPoint": "Needing a surrogate for one complex choice does not erase every ability to participate. Include the patient to the extent possible and attend to expressed comfort concerns and preferences, while the surrogate handles the complex decision. Remember that participation and final decision authority are separate; neither exclusion nor substitution of a simple preference fits here.",
        "explanation": "Include the patient as abilities allow, while the surrogate makes the complex decision. Remaining comfort concerns and simple preferences still deserve direct attention.",
        "claimIds": [
          "claim.gs028se.surrogate-decisions.4",
          "claim.gs028f.neck.adult-lateral-malignancy-evaluation",
          "claim.gs028f.neck.needle-before-open"
        ],
        "ageYears": [
          51,
          77
        ],
        "clinicalAnchor": "adult-neck-mass"
      }
    ]
  },
  {
    "id": "perioperative-dnr",
    "title": "Reconsider perioperative resuscitation plans",
    "objective": "Clarify an individualized perioperative resuscitation plan instead of automatically suspending DNR orders.",
    "sources": [
      "dnarAsa",
      "dnarAma"
    ],
    "stories": [
      {
        "complaint": "DNR before repair",
        "body": "is planning elective repair of a symptomatic reducible inguinal hernia and has an existing DNR order. The preoperative checklist proposes automatic suspension during every operation. The patient asks how the order will apply while under anesthesia. No individualized perioperative discussion has occurred, and the team is preparing the operative plan.",
        "task": "How should the team address {patientName}'s existing DNR order before elective inguinal-hernia repair when the checklist proposes automatic suspension?",
        "key": "Discuss and document the patient's preferences",
        "why": "Perioperative DNR orders require individualized review with the patient or surrogate and responsible clinicians; automatic suspension bypasses self-determination.",
        "wrong": [
          [
            "Use the operating room's usual resuscitation plan",
            "A standard operating-room plan does not substitute for reviewing this patient's preferences. It bypasses the individualized discussion required here."
          ],
          [
            "Carry the existing order forward without reconsideration",
            "Leaving the order unchanged without reconsideration skips review of how it applies to the proposed operation and anesthesia. Individualization is needed rather than an automatic default."
          ],
          [
            "Suspend the order while obtaining routine surgical consent",
            "Suspending first and obtaining routine consent does not replace an individualized resuscitation discussion. An automatic suspension bypasses the patient's preferences."
          ]
        ],
        "keyRationale": "Individualized discussion with the patient or surrogate and responsible clinicians establishes and documents preferences for the operative context. The checklist cannot make that decision automatically.",
        "teachingPoint": "Perioperative DNR planning requires an individualized review with the patient or surrogate and responsible clinicians. Automatically suspending the order bypasses that discussion; carrying it forward without reconsideration also leaves the operative context unexplored. Remember to discuss and document the patient's preferences rather than treating entry to the operating room as the decision itself.",
        "explanation": "Discuss and document an individualized resuscitation plan with the patient or surrogate and responsible clinicians. An automatic operating-room rule does not replace that review.",
        "claimIds": [
          "claim.gs028se.perioperative-dnr.1",
          "claim.inguinal-hernia.symptomatic-elective-repair"
        ],
        "ageYears": [
          61,
          32
        ],
        "clinicalAnchor": "inguinal"
      },
      {
        "complaint": "Gastrectomy preferences",
        "body": "has resectable proximal gastric adenocarcinoma and is planning gastrectomy with an existing DNR order. The patient worries that every anesthesia-related intervention would conflict with that order. The anesthesiology team has time to discuss particular interventions and preferences before surgery. The perioperative plan has not yet been documented for this operation.",
        "task": "What should the anesthesia team clarify and document with {patientName} before gastrectomy when an existing DNR order raises questions about perioperative interventions?",
        "key": "Clarify feasible limits and document the plan",
        "why": "The team should clarify requested interventions in the context of anesthesia, identify essential procedures, and document an agreed individualized plan.",
        "wrong": [
          [
            "Carry the current limits into the anesthetic plan",
            "Carrying limits forward without discussion does not clarify their application to anesthesia or the interventions essential to the proposed care."
          ],
          [
            "Use a procedure-specific standard resuscitation plan",
            "A procedure-specific standard is still a generic plan. It does not resolve this patient's requested limits through individualized discussion."
          ],
          [
            "Leave decisions to the anesthetist during the operation",
            "Waiting for decisions during the operation leaves the supplied questions unresolved beforehand. Clarification and agreement belong in the planned discussion."
          ]
        ],
        "keyRationale": "Clarify requested limits, procedures essential to the proposed anesthesia, and an agreed documented plan. That answers the patient's practical questions before the operation.",
        "teachingPoint": "Requested limits need discussion in the context of anesthesia. Clarify the interventions, identify what is essential to planned care, and document an agreed individualized plan with the patient or surrogate and responsible clinicians. Remember that neither a generic procedure policy nor an unchanged order answers every practical question about how those limits apply.",
        "explanation": "Clarify feasible limits, essential anesthetic procedures, and an agreed documented plan. Leaving the issue until the operation or using a generic policy does not resolve the patient's questions beforehand.",
        "claimIds": [
          "claim.gs028se.perioperative-dnr.2",
          "claim.gs028se.perioperative-dnr.1",
          "claim.gastric-adenocarcinoma.prophylactic-splenectomy-no-survival-benefit"
        ],
        "ageYears": [
          48,
          74
        ],
        "clinicalAnchor": "gastric-cancer"
      },
      {
        "complaint": "DNR reinstatement plan",
        "body": "is planning ileal resection for symptomatic Meckel diverticulum involving adjacent bowel. An existing DNR order has been reviewed, and the patient agreed to specific temporary perioperative changes. The written plan does not say when the original limits resume. The patient asks what happens afterward while the team completes the documentation.",
        "task": "What must the team add to {patientName}'s ileal-resection plan after agreeing on temporary perioperative changes to an existing DNR order?",
        "key": "The time for resuming the original limits",
        "why": "Perioperative planning should document when the original directive will be reinstated so temporary modifications do not silently become indefinite.",
        "wrong": [
          [
            "The clinician authorizing the temporary change",
            "Identifying an authorizing clinician does not say when the original limits resume. The missing endpoint remains unresolved."
          ],
          [
            "The interventions permitted during anesthesia",
            "Permitted interventions are already recorded. Repeating them would not supply the omitted timing or condition for reinstatement."
          ],
          [
            "The surrogate confirming the operative goals",
            "The operative goals are already documented. Surrogate confirmation of those goals does not itself establish when the prior limits return."
          ]
        ],
        "keyRationale": "The temporary change needs a documented endpoint for reinstating the original directive. That is the omitted detail identified in this note.",
        "teachingPoint": "Temporary modification needs a documented endpoint for reinstating the original directive. Recording the permitted interventions alone leaves uncertainty about when the earlier limits resume. Remember to plan both the change and its end with the responsible team. This question asks for that missing endpoint, not a universal time that applies to every operation.",
        "explanation": "Document when the original limits will resume. The note already describes the temporary intervention permissions and goals, but a modification without an endpoint can remain ambiguous.",
        "claimIds": [
          "claim.gs028se.perioperative-dnr.3",
          "claim.meckel-diverticulum.resection-extent-base-and-ileum"
        ],
        "ageYears": [
          69,
          45
        ],
        "clinicalAnchor": "meckel"
      },
      {
        "complaint": "Abscess care preferences",
        "body": "has a superficial perianal abscess requiring drainage and an existing DNR order. A staff member proposes omitting routine treatment and comfort measures because of the order. The patient asks whether abscess treatment and other care can continue. No individualized decision to refuse those treatments has been expressed; the team is preparing care.",
        "task": "How should the team interpret {patientName}'s DNR order when a staff member proposes omitting abscess treatment and comfort care?",
        "key": "Resuscitation after cardiopulmonary arrest",
        "why": "DNR concerns resuscitative efforts after arrest; it does not by itself prohibit other appropriate treatment consistent with patient goals.",
        "wrong": [
          [
            "Resuscitation and anesthetic airway support",
            "The order alone does not establish a blanket ban on anesthetic airway support. Perioperative interventions require their own individualized discussion."
          ],
          [
            "Resuscitation and treatment of a new infection",
            "A DNR order alone does not decline appropriate treatment of infection. Adding that restriction silently expands its scope beyond resuscitation."
          ],
          [
            "Resuscitation and diagnostic testing",
            "Diagnostic testing is not automatically prohibited by DNR status. It remains a separate care decision consistent with the patient's goals."
          ]
        ],
        "keyRationale": "DNR alone concerns resuscitative efforts after cardiopulmonary arrest. Other care remains a separate decision guided by the patient's goals.",
        "teachingPoint": "A DNR order concerns resuscitative efforts after cardiopulmonary arrest. By itself it does not prohibit other appropriate evaluation or treatment consistent with the patient's goals. Remember to distinguish the scope of the order from separate decisions about other care. Any further limits need their own discussion rather than being silently inferred from those letters.",
        "explanation": "DNR alone limits resuscitation after cardiopulmonary arrest. It does not by itself decline symptom treatment, diagnostic testing, or other appropriate care consistent with the patient's goals.",
        "claimIds": [
          "claim.gs028se.perioperative-dnr.4",
          "claim.bread-butter.perianal-abscess.prompt-drainage"
        ],
        "ageYears": [
          58,
          77
        ],
        "clinicalAnchor": "perianal-abscess"
      }
    ]
  },
  {
    "id": "error-disclosure",
    "title": "Disclose errors and address safety",
    "objective": "Communicate material errors honestly while arranging appropriate care and avoiding unsupported blame.",
    "sources": [
      "safety"
    ],
    "stories": [
      {
        "complaint": "Operation explanation",
        "body": "is recovering after incisional-hernia repair. A small-bowel enterotomy was recognized and securely repaired, with controlled contamination and adequate source control. The team confirms an unintended operative error and has arranged continuing care. The patient asks why the operation changed. A colleague proposes describing only the repair while omitting the verified error.",
        "task": "What should the team disclose to {patientName} about the verified unintended enterotomy during incisional-hernia repair?",
        "key": "Explain the operative error and continuing care plan",
        "why": "Patients should receive honest information about errors affecting care, including known implications and steps to address them, rather than a misleading explanation.",
        "wrong": [
          [
            "Explain the repair and leave its cause unstated",
            "Describing the repair alone omits the verified error that prompted it. A technically true fragment can still leave the patient with a misleading account."
          ],
          [
            "Explain that review must finish before discussing events",
            "An internal review may clarify remaining uncertainties, but it does not require withholding the verified injury and repair. Known facts and the care plan can be discussed now."
          ],
          [
            "Explain the planned care without mentioning the injury",
            "A forward-looking care plan does not replace an honest account of the verified operative event. The patient has asked why the operation changed."
          ]
        ],
        "keyRationale": "Explain the verified unintended injury, its repair, known implications and continuing care plan honestly. Reporting the repair alone would conceal why the operation changed.",
        "teachingPoint": "Honest disclosure explains the verified error, its known implications and the steps taken to address it. Here that includes the unintended bowel injury, repair and continuing care plan. Remember: separate known facts from remaining uncertainty. A description of the repair alone can mislead if it conceals why the operation changed.",
        "explanation": "Explain the verified unintended injury, its repair, known implications and continuing care plan. An incomplete account or unfinished internal review does not justify concealing known facts.",
        "claimIds": [
          "claim.gs028se.error-disclosure.1",
          "claim.ventral-hernia.controlled-enterotomy-selected-single-stage-repair"
        ],
        "ageYears": [
          46,
          71
        ],
        "clinicalAnchor": "enterotomy"
      },
      {
        "complaint": "Symptoms before aspiration",
        "body": "is preparing for aspiration of a painful simple breast cyst. An unintended medication is given, and the patient develops symptoms. The team recognizes the error, but clinical help has not been arranged. A staff member proposes completing an incident form before seeking assessment. The patient asks for help while the procedure remains paused.",
        "task": "What should the team prioritize after {patientName} develops symptoms from an unintended medication while preparing for breast-cyst aspiration, before clinical help is arranged?",
        "key": "Arrange immediate assessment and patient care",
        "why": "Immediate patient safety and appropriate treatment take priority; candid disclosure and reporting accompany the response rather than delaying needed care.",
        "wrong": [
          [
            "Complete the safety report to obtain a review referral",
            "Completing an incident report first delays needed assessment. The form documents the event; it is not the clinical response to the symptoms."
          ],
          [
            "Contact the disclosure lead before arranging assessment",
            "Disclosure coordination does not need to come before arranging clinical help. The symptomatic patient requires assessment and care now."
          ],
          [
            "Verify the medication record before calling for clinical help",
            "The team already recognizes an unintended medication and new symptoms. Record checking must not become a reason to delay calling for the clinical help required."
          ]
        ],
        "keyRationale": "The patient is symptomatic after an unintended medication. Immediate assessment and appropriate care take priority, with disclosure and reporting accompanying the response.",
        "teachingPoint": "Immediate patient safety and appropriate treatment take priority when symptoms develop after an unintended medication. Arrange assessment and care while candid disclosure and reporting accompany the response. Remember that an incident form records the event; it does not treat the patient. Administrative or disclosure coordination should not delay the indicated clinical help.",
        "explanation": "Arrange immediate assessment and patient care. Disclosure and safety reporting remain part of the response, but completing those steps first must not delay help for the symptomatic patient.",
        "claimIds": [
          "claim.gs028se.error-disclosure.2",
          "claim.breast-cyst.simple-symptomatic.aspiration"
        ],
        "ageYears": [
          63,
          35
        ],
        "clinicalAnchor": "breast-cyst"
      },
      {
        "complaint": "Missing specimen result",
        "body": "returns after diagnostic excision of a small accessible pigmented lesion concerning for melanoma. The clinic confirms the specimen is lost; the cause and clinical implications remain uncertain. A supervisor suspects the courier and proposes that explanation. The patient asks what is known and what happens next while further assessment is arranged.",
        "task": "How should the team explain the confirmed lost diagnostic specimen to {patientName} when its cause and implications remain uncertain?",
        "key": "Explain known facts, uncertainty, and next steps",
        "why": "Disclosure should distinguish verified facts from uncertainty and explain the care and investigation plan; unverified blame is not a factual explanation.",
        "wrong": [
          [
            "Explain the likely courier cause and offer a replacement plan",
            "The proposed courier explanation remains a theory. Presenting it as the cause replaces acknowledged uncertainty with unverified blame."
          ],
          [
            "Wait for a cause to be established before discussing the loss",
            "A cause need not be established before explaining the known loss. The team can disclose verified facts while acknowledging the investigation is incomplete."
          ],
          [
            "Discuss replacement sampling and defer the reason for it",
            "A plan for further sampling cannot replace explaining the verified loss and uncertainty. The exercise also does not establish that a specific repeat procedure is always required."
          ]
        ],
        "keyRationale": "State the confirmed loss, current uncertainty, and care and investigation plan. This separates verified facts from the unverified courier theory.",
        "teachingPoint": "Honest disclosure separates verified facts from theories. You can explain a confirmed loss while its cause is still under investigation, acknowledging uncertainty and describing the care and investigation plan. Remember that uncertainty is information to disclose, not a gap to fill with blame. The known fact is specimen loss, not the suspected courier explanation.",
        "explanation": "Explain the confirmed loss, what remains uncertain, and the care and investigation plan. Do not state the courier theory as fact or withhold the known loss until the investigation is complete.",
        "claimIds": [
          "claim.gs028se.error-disclosure.3",
          "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"
        ],
        "ageYears": [
          28,
          56
        ],
        "clinicalAnchor": "pigmented-lesion"
      },
      {
        "complaint": "Changed biopsy recommendation",
        "body": "has suspected post-transplant lymphoproliferative disorder and returns to clarify a tissue-biopsy discussion. The clinic confirms that another person's chart materially influenced its earlier recommendation. The mistake was caught before treatment, with no demonstrated injury. A colleague proposes silently correcting the plan. The patient asks why the recommendation has changed during today's visit.",
        "task": "What should the team tell {patientName} about the wrong-chart error that materially affected the tissue-biopsy discussion, despite no demonstrated injury?",
        "key": "Explain the material error and its correction",
        "why": "An error materially affecting care information can warrant honest disclosure even without demonstrated injury; absence of harm is not a blanket reason for concealment.",
        "wrong": [
          [
            "Discuss the corrected recommendation and defer the error",
            "Silently giving a corrected recommendation omits the material error that changed the earlier discussion. Absence of injury is not a blanket reason to leave it unexplained."
          ],
          [
            "Use the internal safety report as the disclosure response",
            "Internal reporting and patient disclosure serve different parts of the response. Filing a report does not tell the patient about the material mistake and correction."
          ],
          [
            "Wait for an injury assessment before discussing the mistake",
            "The supplied error materially affected the care discussion. Waiting to demonstrate injury treats harm as a blanket disclosure requirement that the existing claim does not impose."
          ]
        ],
        "keyRationale": "The wrong-chart recommendation materially affected care information. Explain that mistake and its correction even though it was intercepted without demonstrated injury.",
        "teachingPoint": "An error can materially affect a care discussion even when it is intercepted before treatment and no injury is demonstrated. That absence of harm is not a blanket reason to conceal it. Explain the material mistake and correction honestly. Consider what changed the patient's care information, rather than using injury alone as the disclosure test.",
        "explanation": "Explain the material wrong-chart error and its correction. An internal report or silent replacement of the recommendation does not substitute for candid disclosure merely because no injury is demonstrated.",
        "claimIds": [
          "claim.gs028se.error-disclosure.4",
          "claim.ptld.pattern",
          "claim.ptld.tissue"
        ],
        "ageYears": [
          77,
          51
        ],
        "clinicalAnchor": "ptld"
      }
    ]
  },
  {
    "id": "impaired-colleague",
    "title": "Protect patients when a colleague may be impaired",
    "objective": "Respond to credible impairment concerns with immediate safety measures and appropriate assessment or assistance.",
    "sources": [
      "impairment"
    ],
    "stories": [
      {
        "complaint": "Drainage team coverage",
        "body": "is awaiting drainage of a confirmed cutaneous abscess. The assigned clinician becomes newly unsteady, slurs speech and cannot follow the setup checklist. The cause is unknown, qualified coverage is available and drainage has not started. The team is discussing protection of the patient and assessment of the clinician before care proceeds.",
        "task": "What should the team do before {patientName}'s abscess drainage when the assigned clinician is newly unsteady and unable to follow the setup checklist?",
        "key": "Arrange safe coverage and clinical assessment",
        "why": "Observable inability to practice safely warrants patient protection and appropriate assessment; the cause should not be assumed from behavior alone.",
        "wrong": [
          [
            "Proceed with a second clinician observing the procedure",
            "Observation by another clinician does not itself resolve the assigned clinician's inability to perform the setup safely. Use available safe coverage and arrange assessment."
          ],
          [
            "Pause the procedure and ask the clinician to self-assess",
            "Self-assessment alone does not address the observed inability. The team must protect care and arrange appropriate assessment rather than placing the whole response on the affected clinician."
          ],
          [
            "Recheck performance after a brief rest before arranging help",
            "Waiting to see whether rest changes performance delays the available protection and assessment. The present unsafe performance, not an established diagnosis, warrants action."
          ]
        ],
        "keyRationale": "Observed inability to perform safely requires protecting the patient and arranging assessment. Available qualified coverage supports doing that without assuming why the clinician changed.",
        "teachingPoint": "Observable inability to practice safely calls for patient protection and appropriate assessment, even before the cause is known. Arrange safe coverage and help for the clinician rather than assuming intoxication or relying only on self-assessment. Remember to act on the demonstrated performance problem while keeping its cause an open question until appropriately assessed.",
        "explanation": "Arrange safe coverage and appropriate assessment for the clinician. The observed inability requires action, but the behavior alone does not establish its cause.",
        "claimIds": [
          "claim.gs028se.impaired-colleague.1",
          "claim.gs028se.impaired-colleague.2",
          "claim.gs028se.impaired-colleague.4",
          "claim.bread-butter.cutaneous-abscess.incision-drainage"
        ],
        "ageYears": [
          61,
          32
        ],
        "clinicalAnchor": "cutaneous-abscess"
      },
      {
        "complaint": "Biopsy follow-up concerns",
        "body": "needs duodenal-biopsy follow-up during a celiac disease evaluation. The team documents recent clinician confusion and missed instructions that could compromise that follow-up. A supervisor wants the concerns kept private solely to protect the clinician's reputation. The cause remains unknown; the patient's follow-up and the colleague's assessment still need attention today.",
        "task": "How should the team respond to credible clinician-confusion concerns that may compromise {patientName}'s duodenal-biopsy follow-up?",
        "key": "Arrange assessment and appropriate safety reporting",
        "why": "Credible concerns about impaired practice should prompt appropriate assessment, patient protection and reporting according to the setting, while supporting the colleague.",
        "wrong": [
          [
            "Arrange peer coaching and recheck performance at follow-up",
            "Coaching alone treats the concern as a routine skills issue without addressing the documented confusion, appropriate assessment, or safety reporting."
          ],
          [
            "Transfer the follow-up and await an impairment diagnosis",
            "Transferring follow-up may protect that task, but waiting for a diagnosis omits the appropriate assessment and reporting response to the current credible concern."
          ],
          [
            "Ask the clinician to explain the missed instructions first",
            "The clinician's account may inform assessment, but requesting an explanation first must not replace protection and the appropriate response to documented confusion."
          ]
        ],
        "keyRationale": "Documented confusion that could compromise care warrants assessment, appropriate reporting, and patient protection while supporting the colleague. A final cause is not required to start that response.",
        "teachingPoint": "Credible concerns about unsafe practice need patient protection, appropriate assessment, and reporting suited to the setting, alongside support for the colleague. Waiting for a final diagnosis does not resolve the care concern. Remember that protecting reputation cannot replace a safety response; use observed evidence without inventing the cause or treating reporting as a diagnosis.",
        "explanation": "Arrange assessment, appropriate safety reporting, and protection of follow-up while supporting the clinician. Concealment or waiting for a diagnosis leaves the documented practice concern unaddressed.",
        "claimIds": [
          "claim.gs028se.impaired-colleague.2",
          "claim.gs028se.impaired-colleague.1",
          "claim.celiac.adult-biopsy",
          "claim.celiac.gluten-free-treatment"
        ],
        "ageYears": [
          48,
          74
        ],
        "clinicalAnchor": "celiac"
      },
      {
        "complaint": "Clinician fitness question",
        "body": "is discussing treatment options for chronic anal fissure. The clinician performs the relevant duties safely with accommodations for a hand disability, with no observed performance concern. The patient asks how the team determines whether someone can perform the work safely. The consultation has not started, and there is time to address the question.",
        "task": "What should determine the clinician's fitness to conduct {patientName}'s fissure-treatment consultation when a disability is accommodated and actual performance is safe?",
        "key": "Actual ability to perform the care safely",
        "why": "Illness or disability is not synonymous with impairment. Decisions should concern actual ability to perform duties safely, including appropriate accommodations.",
        "wrong": [
          [
            "The clinician's diagnosis and expected disease course",
            "A diagnosis and its expected course are not by themselves a finding of inability to perform this care safely. The actual relevant duties and performance matter."
          ],
          [
            "The clinician's ability without workplace accommodations",
            "Excluding accommodations changes the supplied assessment. Safe performance with appropriate accommodations is relevant to whether the clinician can perform the duties."
          ],
          [
            "The patient's comfort with the clinician's appearance",
            "Appearance or patient discomfort about it does not establish unsafe practice. The scenario supplies safe performance and no observed concern to support that inference."
          ]
        ],
        "keyRationale": "The relevant issue is actual safe performance, including appropriate accommodations. The scenario establishes that ability and supplies no performance concern.",
        "teachingPoint": "Disability and inability to practice safely are different questions. Judge the clinician's actual performance of the relevant duties, including appropriate accommodations. Here safe performance is established and no performance concern exists. Remember to assess the relevant work rather than using appearance, a diagnosis, or ability without accommodations as a substitute for that assessment.",
        "explanation": "Use actual ability to perform the relevant care safely, including appropriate accommodations. The supplied safe performance does not support treating visible disability itself as impairment.",
        "claimIds": [
          "claim.gs028se.impaired-colleague.3",
          "claim.chronic-anal-fissure.topical-ccb-first-line"
        ],
        "ageYears": [
          69,
          45
        ],
        "clinicalAnchor": "chronic-fissure"
      },
      {
        "complaint": "Requested clinical coverage",
        "body": "needs assessment of new dialysis-access dysfunction. The assigned clinician privately reports that a current illness prevents safe concentration and asks to be relieved. Qualified coverage is available and the consultation has not started. A colleague asks how to respond while arranging the patient's assessment and appropriate support for the clinician.",
        "task": "How should the team respond when the clinician assigned to {patientName}'s dialysis-access assessment reports inability to concentrate safely and requests relief?",
        "key": "Arrange safe coverage and appropriate assistance",
        "why": "A clinician recognizing inability to practice safely should be supported in obtaining coverage and appropriate assistance, with patient protection as the priority.",
        "wrong": [
          [
            "Reassign demanding tasks and have the clinician continue",
            "Reassigning only demanding tasks still requires practice despite the stated inability to concentrate safely. It does not provide the requested relief and available coverage."
          ],
          [
            "Offer a short rest before considering relief from duty",
            "A rest trial postpones relief despite the clinician's stated inability and available coverage. Support the request rather than requiring further unsafe practice to demonstrate it."
          ],
          [
            "Cancel the visit and defer assistance to occupational health",
            "Qualified coverage is available, so cancellation does not use that option. Deferring assistance also misses the colleague's current request for help."
          ]
        ],
        "keyRationale": "Arrange the available safe coverage and appropriate assistance. The clinician has recognized a current inability to concentrate safely and asked for relief before the procedure.",
        "teachingPoint": "A clinician who recognizes inability to practice safely should be supported in obtaining coverage and appropriate assistance. Here that concern is already expressed and qualified coverage is available. Remember to respond before an unsafe performance is required to prove the problem. Patient protection and help for the clinician belong in the same response.",
        "explanation": "Arrange safe coverage and appropriate assistance now. The clinician has identified inability to concentrate safely, and qualified replacement care is available before the clinical consultation begins.",
        "claimIds": [
          "claim.gs028se.impaired-colleague.4",
          "claim.gs028se.impaired-colleague.1",
          "claim.gs028d.access.dysfunction-referral"
        ],
        "ageYears": [
          58,
          27
        ],
        "clinicalAnchor": "dialysis-access"
      }
    ]
  },
  {
    "id": "research-consent",
    "title": "Protect voluntary research participation",
    "objective": "Keep research enrollment informed and voluntary, separate from entitlement to ordinary care.",
    "sources": [
      "research",
      "consent"
    ],
    "stories": [
      {
        "complaint": "Optional GIST study",
        "body": "has a gastric GIST and is discussing specialist tissue and operative planning. A recruiter offers an optional study of a new biologic and says ordinary care requires enrollment. That study is not required for clinical care. The patient asks whether declining research would prevent the clinical consultation from continuing as planned.",
        "task": "What should the team explain when {patientName} is told that ordinary gastric-GIST care depends on joining an optional new-biologic study?",
        "key": "Declining enrollment does not forfeit ordinary care",
        "why": "Research participation must be voluntary; ordinary care should not be contingent on joining an optional study.",
        "wrong": [
          [
            "Declining enrollment requires transfer to another clinic",
            "Requiring transfer would impose a loss of ordinary care for declining this optional study. The scenario gives no basis for making that care contingent on enrollment."
          ],
          [
            "Declining enrollment postpones the surgical consultation",
            "Postponing the ordinary consultation because enrollment is declined still makes care conditional on joining. That conflicts with voluntary choice in this setting."
          ],
          [
            "Declining enrollment limits access to routine follow-up",
            "Limiting routine follow-up uses ordinary care to pressure enrollment. The optional study is not required for that care."
          ]
        ],
        "keyRationale": "This study is optional and not required for ordinary care. Clarify that declining enrollment does not forfeit that care, so the invitation can be considered voluntarily.",
        "teachingPoint": "Research participation must be voluntary. When a study is optional and not required for ordinary care, declining it should not forfeit that care. Remember to separate the clinical care decision from the research invitation. Making enrollment a condition of routine care pressures the patient instead of supporting an independent choice about participation.",
        "explanation": "Clarify that declining this optional study does not forfeit ordinary clinic care. The recruiter's stated condition is inconsistent with voluntary participation in a study not required for that care.",
        "claimIds": [
          "claim.gs028se.research-consent.1",
          "claim.gastric-gist.selected-eus-core-molecular-testing"
        ],
        "ageYears": [
          46,
          71
        ],
        "clinicalAnchor": "gist"
      },
      {
        "complaint": "Additional research sampling",
        "body": "has biopsy-confirmed Barrett esophagus and has consented to a clinical endoscopic examination. An optical-test study would add tissue sampling solely for research, which has not been discussed. The coordinator calls the packet concise; it has separate instructions for folding its instructions. The patient asks what the clinical signature permits before the examination starts.",
        "task": "What is needed before additional research-only tissue sampling when {patientName} has consented only to a clinical endoscopic examination for Barrett esophagus?",
        "key": "Complete an appropriate research consent process",
        "why": "Consent to clinical treatment does not automatically authorize an additional research-only procedure; applicable research consent and oversight requirements must be met.",
        "wrong": [
          [
            "Extend the clinical consent to cover the extra sampling",
            "Clinical consent does not expand automatically to an additional undisclosed research procedure. Extending its label does not supply the missing research discussion or applicable oversight."
          ],
          [
            "Use a signed research form as the entire consent process",
            "A signed research form alone is not the entire consent process. The participant needs the relevant understandable discussion and voluntary choice for the added activity."
          ],
          [
            "Ask the treating surgeon to authorize the extra sampling",
            "The surgeon's approval is not the patient's research permission. It does not replace the appropriate consent process and applicable oversight."
          ]
        ],
        "keyRationale": "The additional procedure is research-only and was not discussed in the treatment consent. Address its purpose, added procedure, and voluntary choice through appropriate research consent and oversight.",
        "teachingPoint": "Consent to treatment does not automatically authorize an additional research-only procedure. The research purpose, added procedure, and voluntary choice need appropriate research consent and applicable oversight. A signature has a scope: adding a research activity requires addressing that activity, rather than extending the clinical form by assumption or treating another form as the conversation.",
        "explanation": "Complete the appropriate research consent process and applicable oversight before the additional sampling. The clinical-treatment signature does not automatically cover this undisclosed research-only procedure.",
        "claimIds": [
          "claim.gs028se.research-consent.2",
          "claim.gs028se.research-consent.1",
          "claim.barrett-esophagus.intestinal-metaplasia"
        ],
        "ageYears": [
          35,
          63
        ],
        "clinicalAnchor": "barrett"
      },
      {
        "complaint": "Study assignment question",
        "body": "has a stable, minimally symptomatic desmoid tumor under specialist assessment. A trial offers a new agent or control through random allocation. The presenter says every participant receives personalized attention, then reads the same greeting from a script. The patient expects the surgeon to select the personally best arm and asks how treatment will be assigned.",
        "task": "What should research consent explain when {patientName} expects personally selected treatment in a desmoid-agent trial whose protocol uses random allocation?",
        "key": "Assignment is random and benefit is uncertain",
        "why": "Research consent should explain allocation and uncertainty so participants do not mistake the protocol for individually selected treatment with guaranteed benefit.",
        "wrong": [
          [
            "Assignment is clinical and benefit is individualized",
            "The protocol does not use individualized clinical selection. This wording preserves the patient's mistaken expectation instead of explaining random allocation and uncertain benefit."
          ],
          [
            "Assignment is random and benefit is established",
            "Random assignment is correct, but established benefit is not. No arm is guaranteed better in the supplied protocol."
          ],
          [
            "Assignment is chosen and benefit is uncertain",
            "Uncertainty about benefit is correct, but assignment is not chosen by the surgeon or participant. The protocol uses random allocation."
          ]
        ],
        "keyRationale": "The approved protocol assigns randomly and guarantees no better arm. Clarifying both points corrects the expectation of personally selected treatment with assured benefit.",
        "teachingPoint": "Research consent needs a clear account of allocation and uncertainty. This protocol assigns arms randomly; the surgeon does not choose a personally best arm, and benefit is not guaranteed. Remember to distinguish a research protocol from individually selected treatment. Understanding assignment helps the patient choose whether to join, not a detail for after enrollment.",
        "explanation": "Explain that assignment is random and benefit uncertain. The protocol does not let the surgeon select a personally best arm or guarantee that an arm will be better.",
        "claimIds": [
          "claim.gs028se.research-consent.3",
          "claim.desmoid.initial-active-surveillance-selected-noncritical"
        ],
        "ageYears": [
          56,
          28
        ],
        "clinicalAnchor": "desmoid"
      },
      {
        "complaint": "Leaving optional research",
        "body": "has hidradenitis suppurativa and wants to leave an optional new topical-agent study. The patient wishes to continue ordinary clinical follow-up but declines further research visits. A coordinator threatens to cancel unrelated appointments unless participation continues. The patient asks whether leaving the study means losing access to the clinic's ordinary care.",
        "task": "How should the team respond to {patientName}'s request to leave an optional hidradenitis-agent study when unrelated ordinary appointments are threatened?",
        "key": "Support withdrawal and preserve ordinary follow-up",
        "why": "Participants should be able to withdraw without coercive loss of ordinary care; clinical follow-up can be discussed separately from continued participation.",
        "wrong": [
          [
            "Defer withdrawal until the remaining study visits are complete",
            "Requiring completion of remaining visits before withdrawal makes continued participation compulsory. That does not respect the voluntary withdrawal request."
          ],
          [
            "Require the investigator's approval before withdrawal",
            "Investigator permission is not a condition that justifies compelling continued participation. The patient wants to leave a voluntary study."
          ],
          [
            "Arrange transfer of ordinary care before allowing withdrawal",
            "Requiring transfer first still ties ordinary care to continued enrollment. Preserve the unrelated follow-up rather than using its loss to prevent withdrawal."
          ]
        ],
        "keyRationale": "Support the voluntary withdrawal and discuss ordinary follow-up separately. Unrelated care must not be used as leverage to require continued research participation.",
        "teachingPoint": "Voluntary participation includes being able to withdraw without coercive loss of ordinary care. Discuss ongoing clinical follow-up separately from whether research continues. Remember that stopping research participation and stopping clinical care are different choices. Neither completing unwanted study visits nor obtaining investigator permission should be used as the price of preserving unrelated follow-up.",
        "explanation": "Support withdrawal and preserve ordinary clinical follow-up. The threatened cancellation of unrelated care must not be used to compel continued participation in a voluntary study.",
        "claimIds": [
          "claim.gs028se.research-consent.4",
          "claim.gs028se.research-consent.1",
          "claim.hs.pattern-recognition",
          "claim.hs.multimodal-planning"
        ],
        "ageYears": [
          51,
          77
        ],
        "clinicalAnchor": "hidradenitis"
      }
    ]
  },
  {
    "id": "qi-versus-research",
    "title": "Seek appropriate QI and research oversight",
    "objective": "Classify projects by purpose and methods rather than labels or publication plans alone.",
    "sources": [
      "qi"
    ],
    "stories": [
      {
        "complaint": "Anemia pathway review",
        "body": "has perioperative anemia and is discussing an authorized pilot of a new assessment pathway. Its stated purpose is local improvement, and the team hopes to publish. The editor asks for a dramatic title before receiving the manuscript. The patient asks whether publication plans by themselves make the project research requiring a different review route.",
        "task": "How should publication plans affect classification of the local anemia-assessment pathway project involving {patientName}?",
        "key": "Publication plans alone do not define research",
        "why": "Publication intent alone does not determine whether an activity is research; purpose, design and applicable definitions require appropriate institutional assessment.",
        "wrong": [
          [
            "Publication intent establishes a generalizable research aim",
            "Wanting publication is not by itself proof of a generalizable research aim. The actual purpose and activities still require assessment."
          ],
          [
            "Journal submission determines the need for research review",
            "Journal submission is a publishing step, not the institutional determination of applicable research requirements. The project cannot be classified from that step alone."
          ],
          [
            "Peer review determines the project's research classification",
            "Peer review evaluates a submission; it does not by itself classify the underlying activity under applicable research definitions."
          ]
        ],
        "keyRationale": "A journal plan alone does not determine research classification. The institution must consider the project's purpose, design, and applicable definitions.",
        "teachingPoint": "Publication intent alone does not determine whether an activity is research. Classification depends on its purpose, design, and applicable definitions, assessed through the appropriate institution. Remember that where a report may appear is different from what the project does. This exercise does not establish an exemption or replace assessment with a publishing plan.",
        "explanation": "Explain that publication plans alone do not define research. Appropriate institutional assessment must consider the project's purpose, design, and applicable definitions rather than its intended journal destination.",
        "claimIds": [
          "claim.gs028se.qi-versus-research.1",
          "claim.gs028f.oxygen.anemia-content-limit",
          "claim.gs028f.oxygen.hemoglobin-carriage"
        ],
        "ageYears": [
          32,
          61
        ],
        "clinicalAnchor": "anemia"
      },
      {
        "complaint": "Experimental reflux project",
        "body": "is undergoing assessment for reflux disease and is offered a new experimental treatment-delivery device. A project labeled QI proposes assigning device use to test a generalizable hypothesis. The organizer calls review straightforward, then forwards five messages asking who owns the straightforward-review form. The patient asks what assessment should occur before the additional intervention is introduced.",
        "task": "What oversight step is needed before a project labeled QI tests an experimental reflux-treatment device with {patientName} for a generalizable hypothesis?",
        "key": "Seek institutional assessment before proceeding",
        "why": "Calling a project QI does not exempt an activity that may also be human-subjects research; institutional review should determine applicable requirements.",
        "wrong": [
          [
            "Proceed under the local QI designation while collecting data",
            "Proceeding under the label assumes the very determination that needs assessment. Local improvement terminology cannot exempt an experimental research component by itself."
          ],
          [
            "Use publication plans to decide whether review is needed",
            "Publication plans alone do not determine whether review is needed. The project's experimental activity and purpose must be assessed."
          ],
          [
            "Use standard treatment consent for the added intervention",
            "Standard treatment consent does not settle research classification or applicable research consent requirements for the added intervention."
          ]
        ],
        "keyRationale": "The experimental intervention and generalizable hypothesis require institutional assessment before proceeding. A QI label does not remove possible research requirements.",
        "teachingPoint": "Calling an activity QI does not settle whether it also contains human-subjects research. The added experimental intervention and generalizable aim need institutional assessment before proceeding. Remember to examine purpose and activities rather than accepting a label as an exemption. Applicable review and consent requirements cannot be decided by project branding or ordinary treatment consent alone.",
        "explanation": "Seek institutional assessment before proceeding. The QI label does not resolve the experimental research features or establish that ordinary treatment consent is sufficient.",
        "claimIds": [
          "claim.gs028se.qi-versus-research.2",
          "claim.gs028se.qi-versus-research.1",
          "claim.early.gerd.off-ppi-reflux-monitoring"
        ],
        "ageYears": [
          74,
          48
        ],
        "clinicalAnchor": "gerd"
      },
      {
        "complaint": "Ileostomy improvement project",
        "body": "has a high-output ileostomy after stabilization. The team is implementing an accepted sodium-glucose rehydration plan solely to improve local delivery, without an experimental addition or generalizable research hypothesis. The administrator requests a mission statement for the hydration service before approving cups. The patient asks why practical local measurements do not automatically determine research classification.",
        "task": "What should the team explain about research classification when {patientName}'s ileostomy project implements accepted rehydration practice solely for local improvement?",
        "key": "The stated purpose supports local improvement",
        "why": "Implementing accepted practice and collecting practical improvement data may fall outside the research definition; other institutional obligations still need consideration.",
        "wrong": [
          [
            "The local measurements support research classification",
            "Collecting practical implementation measurements does not by itself make the activity research. Purpose and activities matter, not measurement alone."
          ],
          [
            "The publication plans support research classification",
            "Publication intent alone does not classify an activity as research. The supplied local implementation purpose remains the relevant information to assess."
          ],
          [
            "The patient involvement supports research classification",
            "Involving patients does not automatically establish a research purpose. The activity's purpose and design still determine how it should be assessed."
          ]
        ],
        "keyRationale": "The stated project implements established practice for practical local improvement, with no research component identified. That supports this rationale without erasing other institutional obligations.",
        "teachingPoint": "Implementing established practice and collecting practical local improvement data may fall outside the research definition when no research component is identified. That does not erase other institutional obligations. Remember to ask why the activity is being done and what it adds; measurement, publication interest, or patient involvement alone does not automatically make it research.",
        "explanation": "The stated purpose supports local improvement rather than an identified research component. Practical measurement alone does not determine classification, and other institutional obligations still need consideration.",
        "claimIds": [
          "claim.gs028se.qi-versus-research.3",
          "claim.gs028se.qi-versus-research.1",
          "claim.bread-butter.high-output-ileostomy.renal-electrolyte-magnesium-assessment",
          "claim.bread-butter.high-output-ileostomy.sodium-glucose-oral-rehydration"
        ],
        "ageYears": [
          45,
          69
        ],
        "clinicalAnchor": "ileostomy"
      },
      {
        "complaint": "Anesthesia project review",
        "body": "has documented malignant-hyperthermia susceptibility and a planned trigger-free anesthetic. A project combines local delivery improvement with an experimental monitoring sensor and a generalizable research comparison. Six listed coauthors have yet to see the project; the organizer calls this an ambitious collaboration. The patient asks how the combined project should be assessed before the operation.",
        "task": "How should the team handle review of {patientName}'s anesthesia project when it combines local improvement with an experimental monitoring comparison?",
        "key": "Seek institutional review of the research component",
        "why": "An activity may serve both improvement and research purposes; a research component can trigger applicable review and consent requirements despite local benefit.",
        "wrong": [
          [
            "Review the project under its local improvement designation",
            "A local improvement designation does not erase the research aim or added experimental comparison. Both components need appropriate consideration."
          ],
          [
            "Review the project after generalizable results are obtained",
            "Waiting for generalizable results postpones assessment until after the relevant research activity. Review of applicable requirements belongs before proceeding."
          ],
          [
            "Review the project using publication intent as the criterion",
            "Publication intent alone cannot classify the combined activities. The supplied experimental comparison and generalizable purpose already require appropriate assessment."
          ]
        ],
        "keyRationale": "The activity includes an experimental generalizable research component as well as local improvement. Seek institutional review of that component and its applicable requirements.",
        "teachingPoint": "An activity can serve improvement and research purposes together. A local benefit does not remove the need to assess the research component and its applicable review and consent requirements. Remember that combined aims require examining both components, rather than forcing the project into a single convenient label or waiting until results exist.",
        "explanation": "Seek institutional review of the research component. A project can pursue local improvement and generalizable research together; the local aim does not erase applicable research requirements.",
        "claimIds": [
          "claim.gs028se.qi-versus-research.4",
          "claim.gs028se.qi-versus-research.1",
          "claim.gs028se.qi-versus-research.2",
          "claim.gs028d.mh.trigger-free-plan"
        ],
        "ageYears": [
          58,
          27
        ],
        "clinicalAnchor": "mh"
      }
    ]
  },
  {
    "id": "confidentiality",
    "title": "Protect confidential patient information",
    "objective": "Distinguish authorized care-related disclosure from curiosity or avoidable public exposure.",
    "sources": [
      "confidentiality"
    ],
    "stories": [
      {
        "complaint": "Requested ulcer results",
        "body": "has an uncomplicated H. pylori ulcer and is discussing follow-up. A friend calls for results without authorization or another applicable disclosure exception. The friend describes herself as the patient's unofficial chief information officer, then asks whether that title can be added to the contact list. The clinic has not shared the requested information.",
        "task": "How should the clinic handle a friend's request for {patientName}'s H. pylori results when authorization and another disclosure exception are absent?",
        "key": "Decline disclosure without patient authorization",
        "why": "A friend's interest does not authorize disclosure of confidential information when no applicable exception exists.",
        "wrong": [
          [
            "Ask the friend to verify the patient's date of birth",
            "Knowing identifying details may verify knowledge of the patient, but it does not establish authorization to receive the diagnosis."
          ],
          [
            "Confirm the diagnosis already known to the friend",
            "Confirming a diagnosis is still disclosure. The friend's claim to know it does not provide the missing authorized basis for the clinic to confirm it."
          ],
          [
            "Give the friend a general summary of the procedure",
            "A shorter or more general summary still shares private information. Its length does not replace the missing authorization or exception."
          ]
        ],
        "keyRationale": "The patient has not authorized disclosure and no applicable exception exists. Decline the friend's request rather than treating interest as permission.",
        "teachingPoint": "Interest in a patient does not itself authorize access to confidential information. Here the patient has not authorized the friend's request and no applicable exception exists, so decline disclosure. Remember that confirming a detail or giving a short summary still shares information. Verifying identity details does not supply the missing permission to share the diagnosis.",
        "explanation": "Decline disclosure without patient authorization in this setting. A friend's knowledge, identifying details, or request for only a summary does not create the missing authorized basis.",
        "claimIds": [
          "claim.gs028se.confidentiality.1",
          "claim.brief.h-pylori.active-infection-testing",
          "claim.brief.h-pylori.test-of-cure-plan"
        ],
        "ageYears": [
          71,
          46
        ],
        "clinicalAnchor": "h-pylori"
      },
      {
        "complaint": "Chart access question",
        "body": "has confirmed uncomplicated familial hypocalciuric hypercalcemia and is attending follow-up. A clinic employee who knows the family wants to open the chart solely from curiosity. The employee says being nosy is community engagement, then asks whether it belongs on the appraisal form. No relevant work purpose requires access to this patient's records.",
        "task": "What should govern a clinic employee's access to {patientName}'s calcium-disorder chart when the employee has only personal curiosity and no relevant work purpose?",
        "key": "An authorized work-related reason for access",
        "why": "Clinic employment and personal curiosity do not themselves justify accessing a patient's confidential information.",
        "wrong": [
          [
            "A personal invitation to look up the patient's diagnosis",
            "A personal invitation does not establish a role in authorized care or administrative work. It does not supply the missing work-related purpose for this access."
          ],
          [
            "A verified relationship with the patient's family",
            "Knowing the family is a personal relationship, not an authorized clinical or administrative reason to read the chart."
          ],
          [
            "An active clinic login with chart-reading permission",
            "An active login supplies a technical ability to open records. It does not authorize browsing this chart without a relevant work purpose."
          ]
        ],
        "keyRationale": "Access needs an authorized work-related purpose. This neighbor has no care or administrative role requiring the chart, so familiarity and employment do not justify browsing.",
        "teachingPoint": "A clinic login supplies technical access, not a work-related reason to open every chart. Access should have an authorized purpose connected to the employee's work. Here familiarity and curiosity do not provide one. Remember to distinguish what the system permits someone to click from what their role authorizes them to read for this patient.",
        "explanation": "An authorized work-related reason must govern access. Employment, knowing the family, or having a chart-reading login does not establish a role requiring this patient's information.",
        "claimIds": [
          "claim.gs028se.confidentiality.2",
          "claim.fhh.reassurance-observation-avoid-parathyroid-surgery"
        ],
        "ageYears": [
          35,
          63
        ],
        "clinicalAnchor": "fhh"
      },
      {
        "complaint": "Private adrenal discussion",
        "body": "has an adrenal incidentaloma and is discussing biochemical evaluation. Staff begin an identifiable, nonurgent case conversation in an elevator where visitors can hear. A private clinical workspace is available. The patient has not authorized public discussion, and the team must decide where to continue the conversation about the planned assessment.",
        "task": "Where should the team conduct further identifiable discussion of {patientName}'s adrenal-incidentaloma assessment after the nonurgent elevator conversation?",
        "key": "Move the discussion to a private clinical setting",
        "why": "Clinical communication should avoid unnecessary exposure of identifiable information to people without an authorized reason to hear it.",
        "wrong": [
          [
            "Continue quietly and avoid speaking the patient's name",
            "Omitting the name and speaking quietly does not necessarily prevent identification from other details. The available private workspace addresses the setting directly."
          ],
          [
            "Send the discussion to the team's personal message thread",
            "A personal message thread does not establish an appropriate clinical communication setting. Moving the details there does not resolve the authorized-purpose and exposure concerns."
          ],
          [
            "Discuss the case at the next hallway team huddle",
            "A later hallway huddle remains public. Changing the time does not address who can hear an identifiable case discussion."
          ]
        ],
        "keyRationale": "Move the nonurgent discussion to the available private clinical workspace. That supports care while avoiding unnecessary exposure to the crowded public setting.",
        "teachingPoint": "Clinical discussion needs a setting that avoids unnecessary exposure of identifiable information. Move this nonurgent conversation to the available private clinical workspace. Remember that removing a name or lowering voices does not necessarily remove identification by other details. Changing the time of a public discussion also fails to address who can hear it.",
        "explanation": "Move the discussion to the available private clinical setting. The case remains identifiable, and neither quieter speech nor omitting the name resolves unnecessary public exposure.",
        "claimIds": [
          "claim.gs028se.confidentiality.3",
          "claim.brief.adrenal-incidentaloma.one-mg-dst"
        ],
        "ageYears": [
          56,
          28
        ],
        "clinicalAnchor": "adrenal"
      },
      {
        "complaint": "Authorized specialist coordination",
        "body": "has uncomplicated Mondor disease and authorizes relevant information sharing for a treating specialist's consultation. The referral coordinator offers to send everything because selecting relevant records would involve reading them. The specialist requests the history and findings needed for this visit. The team has the authorization and is preparing the information to share.",
        "task": "How should the clinic handle the treating specialist's relevant information request after {patientName} authorizes Mondor-disease care coordination?",
        "key": "Share relevant information for authorized care",
        "why": "Confidentiality permits appropriate information exchange for authorized care while requiring attention to purpose and unnecessary disclosure; it does not prohibit all coordination.",
        "wrong": [
          [
            "Send the complete chart for the specialist to filter",
            "The whole chart may include information beyond the consultation's purpose. Authorization to coordinate does not justify unnecessary disclosure for the specialist to filter later."
          ],
          [
            "Request a new authorization for each relevant chart item",
            "The supplied authorization already supports relevant coordination. Treating every relevant item as newly prohibited obstructs that authorized care purpose."
          ],
          [
            "Send a de-identified summary for the treating consultation",
            "The specialist needs relevant patient-specific consultation information. A de-identified substitute does not provide the authorized coordination requested in this scenario."
          ]
        ],
        "keyRationale": "The patient has authorized coordination, and the specialist requests relevant information. Share for that purpose while avoiding unnecessary disclosure.",
        "teachingPoint": "Confidentiality permits appropriate exchange for authorized care; it does not prohibit all coordination. Share information relevant to the consultation while avoiding unnecessary disclosure. Remember to match the information to its purpose. Sending the whole chart for someone else to filter, or treating every relevant item as newly forbidden, misses that balance in this supplied setting.",
        "explanation": "Share relevant patient-specific information for the authorized consultation, avoiding unnecessary disclosure. The stated authorization supports that coordination; confidentiality does not require blocking every exchange or sending the entire chart.",
        "claimIds": [
          "claim.gs028se.confidentiality.4",
          "claim.mondor-disease.classic-clinical-phenotype",
          "claim.mondor-disease.supportive-management-and-boundaries"
        ],
        "ageYears": [
          51,
          77
        ],
        "clinicalAnchor": "mondor"
      }
    ]
  }
];
export const ETHICS_CLINICAL_ANCHOR_BY_QUESTION = Object.fromEntries(topics.flatMap(topic =>
  topic.stories.map((story, index) => [`question.statistics-ethics.${topic.id}.v${index + 1}`, story.clinicalAnchor]),
)) as Record<string, ClinicalAnchorKey>;

function variant(topic:Topic, story:Story, index:number):VariantSpec {
  return {slug:`${topic.id}-${index+1}`,complaint:story.complaint,
    presentation:story.spanish?story.body:`{patientName}, a {patientAge}-year-old {patientSex}, ${story.body}`,
    stem:story.task,correct:{id:`key-${index+1}`,label:story.key,rationale:story.keyRationale},
    distractors:story.wrong.map(([label,rationale],i)=>({id:`wrong-${index+1}-${i+1}`,label,rationale})) as VariantSpec["distractors"],
    explanation:story.explanation, teachingPoint:story.teachingPoint,
    claimIds:story.claimIds,ageYears:story.ageYears,sexLabels:story.spanish?["Female"]:index%2===0?["Female","Male"]:["Male","Female"]};
}
function family(a:Topic,b:Topic):FamilySpec {
 const pair=[a,b];return {slug:`${a.id}-${b.id}`,label:"Ethics and communication",
 sources:[...new Set(pair.flatMap(t=>t.sources))].map(k=>ETHICS_SOURCES[k]),
 claims:pair.flatMap(t=>t.stories.map((s,i)=>({id:`claim.gs028se.${t.id}.${i+1}`,statement:s.why,sourceIds:(s.sources ?? t.sources).map(k=>ETHICS_SOURCES[k].id),category:"safety_boundary" as const,limitation:`Ethical guidance does not replace jurisdiction-specific law or institutional policy.${t.sources.length===1?" Single-source limitation.":""}${t.id==="qi-versus-research"?" Older nonbinding OHRP guidance; current definitions govern.":""}`,population:"People in the stated fictional clinical situation."}))),
 ...(a.id==="qualified-interpreter" ? {pairing:{indices:[0,1,2,3] as Array<0|1|2|3>,updates:b.stories.map(story => story.update!)}} : {}),
 concepts:pair.map(t=>({id:`concept.statistics-ethics.${t.id}`,displayName:t.title,learningObjective:t.objective,stage:0,educationalTier:0,conceptType:"applied_science",evidenceClaimIds:t.stories.map((_,i)=>`claim.gs028se.${t.id}.${i+1}`),variants:t.stories.map((s,i)=>variant(t,s,i))})) as [ConceptSpec,ConceptSpec]};
}
export const ETHICS_FAMILIES=Array.from({length:topics.length/2},(_,i)=>{
  const built=buildFamily(family(topics[i*2]!,topics[i*2+1]!));
  return {...built,cases:built.cases.map(clinicalCase=>{
    const labels=clinicalCase.decisionNodes.flatMap(node=>{
      const topic=topics.find(item=>`concept.statistics-ethics.${item.id}`===node.primaryConceptId)!;
      const index=built.questions.filter(item=>item.conceptId===node.primaryConceptId).findIndex(item=>item.id===node.questionVariantId);
      const story=topic.stories[index]!;
      return [...CLINICAL_ANCHORS[story.clinicalAnchor].sourceLabels,
        
      ];
    });
    const sourceLabels=[...new Set([...clinicalCase.sourceLabels,...labels])];
    return {...clinicalCase,sourceLabels,decisionNodes:clinicalCase.decisionNodes.map(node=>({...node,sourceLabels}))};
  })};
});
