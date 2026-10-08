import { buildFamily, type ConceptSpec, type FamilySpec, type VariantSpec } from "./family-builder";
import { ETHICS_SOURCES } from "./ethics-source-catalog";
type Wrong = [string, string];
type Story = { complaint:string; body:string; task:string; key:string; why:string; keyRationale:string; wrong:[Wrong,Wrong,Wrong]; spanish?:boolean; sources?:Array<keyof typeof ETHICS_SOURCES> };
type Topic = { id:string; title:string; objective:string; sources:Array<keyof typeof ETHICS_SOURCES>; stories:[Story,Story,Story,Story] };
// Original teaching cases. Keys are first only in this authoring artifact; runtime shuffles.
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
        "complaint": "Consent discussion",
        "spanish": true,
        "body": "{patientName}, una mujer de {patientAge} años, viene a hablar de una operación electiva de hernia. Dice: «No entiendo el formulario en inglés». Está estable; el cirujano no habla español. Su hijo de diez años ofrece traducir.",
        "task": "How should you begin consent for elective hernia repair when the patient cannot understand the clinician's language?",
        "key": "Arrange qualified Spanish interpretation",
        "why": "Qualified interpretation supports meaningful consent when patient and clinician cannot communicate adequately. A child's offer does not establish interpreter competence.",
        "wrong": [
          [
            "Use the child's interpretation for consent",
            "A willing child does not establish the competence needed for this consent discussion."
          ],
          [
            "Ask a bilingual clinic clerk to interpret",
            "Speaking Spanish does not establish that the clerk is qualified to interpret clinical information."
          ],
          [
            "Use a translated Spanish consent handout",
            "Written information can help, but it does not provide the qualified interpretation needed for the patient's questions."
          ]
        ],
        "keyRationale": "The clinician and patient cannot communicate adequately, and the child is not a qualified interpreter."
      },
      {
        "complaint": "Biopsy questions",
        "spanish": true,
        "body": "{patientName}, una mujer de {patientAge} años, consulta por una biopsia cutánea electiva. Pregunta: «¿Me quitarán toda la lesión?». El médico solo habla inglés. Una aplicación traduce la pregunta de forma confusa; la paciente sigue sin entender.",
        "task": "What communication support should you arrange before elective skin-biopsy consent when automated translation remains unclear?",
        "key": "Arrange qualified medical interpretation",
        "why": "When automated translation leaves important uncertainty, qualified interpretation supports an understandable consent discussion.",
        "wrong": [
          [
            "Use the application's translated discussion",
            "The application has already left important uncertainty about the procedure."
          ],
          [
            "Ask a bilingual companion to interpret",
            "A companion's language ability does not establish qualified medical interpretation."
          ],
          [
            "Provide translated written biopsy information",
            "A translated handout does not resolve the patient's unanswered questions in a two-way discussion."
          ]
        ],
        "keyRationale": "The application has left the patient's question unresolved, so the discussion needs qualified interpretation."
      },
      {
        "complaint": "Operation questions",
        "spanish": true,
        "body": "{patientName}, una mujer de {patientAge} años, llega para hablar de la extirpación electiva de una lesión cutánea. El cirujano no habla español. Su pareja contesta todas las preguntas; ella dice: «Quiero hablar yo y hacer mis propias preguntas».",
        "task": "How should you support the patient's own questions during the elective lesion-excision discussion?",
        "key": "Arrange qualified Spanish interpretation",
        "why": "Qualified interpretation supports the patient's own questions and decisions when accurate independent communication is lacking; family participation does not automatically replace it.",
        "wrong": [
          [
            "Ask the partner to relay the patient's questions",
            "The patient wants to speak directly; relying on the partner does not establish qualified interpretation."
          ],
          [
            "Ask a bilingual staff member to translate",
            "Bilingual ability alone does not establish competence for this clinical discussion."
          ],
          [
            "Use a translated form for the patient's questions",
            "A form cannot replace the understandable discussion the patient is requesting."
          ]
        ],
        "keyRationale": "The patient wants to speak and ask questions directly; the partner's answers cannot substitute for that discussion."
      },
      {
        "complaint": "Treatment discussion",
        "spanish": true,
        "body": "{patientName}, una mujer de {patientAge} años, está estable y quiere discutir la extirpación de un quiste. No comprende inglés. El cirujano tampoco comprende español; una recepcionista conoce algunas frases, pero no está capacitada para interpretar información clínica.",
        "task": "What communication support should you arrange before elective cyst-removal consent when the available employee is not a qualified interpreter?",
        "key": "Arrange qualified medical interpretation",
        "why": "Knowing a few phrases does not establish the ability to interpret complex clinical information accurately and impartially.",
        "wrong": [
          [
            "Use the receptionist's conversational Spanish",
            "The receptionist is explicitly not qualified to interpret clinical information."
          ],
          [
            "Use an application to translate the discussion",
            "An application does not establish the qualified interpretation needed for elective consent."
          ],
          [
            "Use a translated handout with written replies",
            "Written exchanges do not establish that the clinical consent discussion is understood."
          ]
        ],
        "keyRationale": "The receptionist's limited language skills do not qualify that employee to interpret this consent discussion."
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
        "complaint": "Procedure questions",
        "body": "brings a signed hernia-repair form but says, 'I signed at reception; nobody explained what could go wrong.' The elective procedure has not started.",
        "task": "What should happen before elective hernia repair when the patient signed a form without a discussion of risks and options?",
        "key": "Discuss risks, benefits, and alternatives",
        "why": "Consent requires an understandable discussion of the intervention, relevant risks and benefits, and alternatives including foregoing treatment; a signature alone is insufficient.",
        "wrong": [
          [
            "Confirm the form was signed voluntarily",
            "Voluntariness matters, but it does not supply the missing discussion of risks, benefits and alternatives."
          ],
          [
            "Have the patient reread the consent document",
            "Rereading a document does not replace the omitted clinical discussion."
          ],
          [
            "Ask the patient to describe the planned operation",
            "Understanding the procedure's name or purpose alone does not address the missing risks and alternatives."
          ]
        ],
        "keyRationale": "The form was signed without the clinical discussion needed for an informed choice."
      },
      {
        "sources": [
          "consent"
        ],
        "complaint": "Hernia options",
        "body": "asks whether declining an elective skin biopsy is an option. The booking conversation covered only the proposed biopsy; the patient is stable and has not decided.",
        "task": "How should you address a patient's unanswered question about declining an elective skin biopsy?",
        "key": "Discuss alternatives, including no procedure",
        "why": "An informed decision includes relevant alternatives and the implications of foregoing the proposed intervention, tailored to the patient's situation.",
        "wrong": [
          [
            "Review the biopsy's expected diagnostic benefit",
            "Benefit is relevant, but the patient specifically asks about the option of declining."
          ],
          [
            "Review the biopsy's principal procedural risks",
            "Risks are relevant, but they do not answer the question about alternatives, including no procedure."
          ],
          [
            "Ask the patient to choose a biopsy appointment",
            "Scheduling treats the decision as settled while the question about declining remains unanswered."
          ]
        ],
        "keyRationale": "The patient has not decided and specifically asks about foregoing the proposed biopsy."
      },
      {
        "complaint": "Consent confusion",
        "body": "nods through a lesion-excision explanation, then asks whether the signed form guarantees no scar. The elective procedure has not begun and there is time to clarify.",
        "task": "How should you address a patient's belief that consent to lesion excision guarantees no scar?",
        "key": "Clarify scarring and ask for teach-back",
        "why": "A demonstrated misunderstanding should be addressed before relying on consent. Asking the patient to explain the plan in their own words helps assess understanding.",
        "wrong": [
          [
            "Repeat the explanation of the removal technique",
            "Technique alone does not address the patient's mistaken expectation about scarring."
          ],
          [
            "Ask the patient to confirm willingness to proceed",
            "Willingness is not an understanding check when a material misunderstanding remains."
          ],
          [
            "Review the signed consent form with the patient",
            "Reviewing a form without addressing the specific misunderstanding does not establish understanding of scarring."
          ]
        ],
        "keyRationale": "The patient's scar question reveals a misunderstanding that should be clarified and checked before proceeding."
      },
      {
        "sources": [
          "consent"
        ],
        "complaint": "Decision pressure",
        "body": "says a companion threatened to stop providing rides unless cyst removal goes ahead. In private the patient says, 'I do not want this removed.' No urgent medical need exists.",
        "task": "How should you respond to pressured consent for elective cyst removal?",
        "key": "Pause and support the patient's voluntary choice",
        "why": "Consent must be voluntary; a refusal expressed under coercive pressure should prompt protection of the patient's choice rather than reliance on a pressured signature.",
        "wrong": [
          [
            "Ask the patient to confirm consent with the companion",
            "The companion's pressure may continue to shape the answer; confirmation in that setting does not resolve voluntariness."
          ],
          [
            "Offer another appointment with the same companion",
            "A later date does not itself address the pressure affecting this choice."
          ],
          [
            "Ask the companion to explain the patient's preferences",
            "The capable patient's own voluntary choice is needed, rather than a companion's account."
          ]
        ],
        "keyRationale": "The patient privately refuses and describes pressure from the companion; the elective procedure can pause."
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
        "complaint": "Declining surgery",
        "body": "declines elective hernia repair after explaining its benefits, risks, alternatives and consequences of refusal accurately. The patient gives consistent personal reasons; the surgeon strongly disagrees.",
        "task": "How should you respond to a capable adult's informed refusal of elective hernia repair?",
        "key": "Respect refusal and discuss follow-up",
        "why": "Disagreement with a recommendation does not itself establish incapacity. A capable adult's informed refusal should be respected.",
        "wrong": [
          [
            "Request psychiatric clearance before accepting refusal",
            "Disagreement with the surgeon does not establish incapacity or a need for psychiatric clearance."
          ],
          [
            "Ask the family to confirm the treatment decision",
            "Family agreement is not required to validate a capable adult's informed refusal."
          ],
          [
            "Repeat consent counseling until surgery is accepted",
            "Counseling can clarify uncertainty, but it should not be used to replace a capable patient's informed choice."
          ]
        ],
        "keyRationale": "The patient accurately explains the options and consistently refuses; clinician disagreement does not establish incapacity."
      },
      {
        "complaint": "Consent reassessment",
        "body": "arrives for an elective procedure newly confused, cannot explain its purpose after repeated explanations, and gives rapidly changing answers. A signed consent from an earlier visit is in the chart.",
        "task": "What should happen before an elective procedure when the patient is newly confused despite an earlier signed consent?",
        "key": "Pause and assess capacity for this decision",
        "why": "Capacity concerns the present decision and can change. New confusion and inability to understand warrant assessment before an elective intervention.",
        "wrong": [
          [
            "Verify the earlier consent and continue preparation",
            "The earlier signature does not establish capacity for the current decision amid new confusion."
          ],
          [
            "Obtain a fresh signature after repeating the explanation",
            "A new signature does not resolve the observed difficulty understanding and reasoning."
          ],
          [
            "Ask a relative to approve the procedure first",
            "The current decision-making abilities should be assessed before assuming the patient needs a surrogate."
          ]
        ],
        "keyRationale": "New confusion and inability to explain the procedure raise current capacity concerns that the earlier form does not resolve."
      },
      {
        "complaint": "Treatment refusal",
        "body": "has treated depression and declines elective scar revision. The patient explains the options accurately, appreciates their personal effects, reasons coherently and communicates a stable choice.",
        "task": "How should capacity for elective scar revision be judged in a patient with treated depression?",
        "key": "Assess current decision-making abilities",
        "why": "A diagnosis alone does not establish incapacity; assessment concerns abilities for the specific decision. The described abilities support respecting refusal.",
        "wrong": [
          [
            "Require psychiatric clearance because of depression",
            "A diagnosis alone does not determine capacity for this treatment decision."
          ],
          [
            "Use the family's account of the patient's usual judgment",
            "Family observations may inform an assessment but do not replace the patient's demonstrated decision-making abilities."
          ],
          [
            "Judge capacity by agreement with the recommendation",
            "Agreement with the clinician is not a capacity criterion."
          ]
        ],
        "keyRationale": "The patient describes the options, applies them personally, reasons coherently, and communicates a stable choice."
      },
      {
        "complaint": "Decision assistance",
        "body": "has mild cognitive impairment and wants a skin lesion removed. With plain-language explanation, the patient describes its purpose, risks and alternatives, applies them personally, and consistently chooses removal.",
        "task": "How should consent authority be approached for elective lesion removal when a patient with cognitive impairment demonstrates understanding?",
        "key": "Support and assess the patient's own decision",
        "why": "Cognitive impairment does not eliminate capacity for every decision. Support understanding and assess actual abilities before seeking a substitute decision-maker.",
        "wrong": [
          [
            "Obtain a surrogate's decision because of the diagnosis",
            "Cognitive impairment alone does not establish incapacity when the patient demonstrates the relevant abilities."
          ],
          [
            "Require a family countersignature for this consent",
            "A family signature does not replace assessment of this patient's own decision-making abilities."
          ],
          [
            "Require formal testing before discussing the choice",
            "The decision requires assessment of relevant abilities, rather than making a test score a prerequisite to participation."
          ]
        ],
        "keyRationale": "With support, the patient demonstrates abilities relevant to this specific decision rather than automatic need for a substitute."
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
        "complaint": "Care planning",
        "body": "cannot make the current treatment decision. The authorized surrogate recalls specific discussions in which the patient rejected the proposed treatment in these circumstances, although the surrogate personally favors it.",
        "task": "What should guide an authorized surrogate when the patient's known wishes differ from the surrogate's own preference?",
        "key": "Use the patient's known preferences",
        "why": "Substituted judgment uses the patient's known preferences and values rather than the surrogate's own treatment preference.",
        "wrong": [
          [
            "Use the surrogate's preferred treatment plan",
            "The surrogate's own preference differs from the patient's known wishes."
          ],
          [
            "Use the family's agreed treatment preference",
            "Family agreement does not replace the patient's known treatment preferences."
          ],
          [
            "Use the option with the greatest expected benefit",
            "A benefit-based standard does not replace known applicable patient wishes."
          ]
        ],
        "keyRationale": "The patient previously rejected this treatment in these circumstances; the surrogate should represent those wishes."
      },
      {
        "complaint": "Surrogate consultation",
        "body": "lacks capacity for a proposed intervention. Despite reasonable efforts, the authorized surrogate and team cannot identify prior wishes or relevant values; they must consider likely benefits, burdens and suffering.",
        "task": "When prior patient values cannot be determined, what should guide an authorized surrogate's treatment decision?",
        "key": "The patient's benefits and burdens",
        "why": "When patient preferences and values cannot be determined, surrogate deliberation should focus on the patient's best interests, including benefits and burdens.",
        "wrong": [
          [
            "The choice most family members would make",
            "A family vote does not assess the patient's likely benefits, burdens and suffering."
          ],
          [
            "The option with the longest possible survival",
            "Survival alone does not account for the patient's likely burdens and suffering."
          ],
          [
            "The surrogate's preferred treatment for themself",
            "The surrogate's personal preferences do not substitute for the patient's best interests."
          ]
        ],
        "keyRationale": "Reasonable efforts have not identified prior wishes, so deliberation should focus on the patient's likely benefits and burdens."
      },
      {
        "complaint": "Family disagreement",
        "body": "lacks capacity and has clearly documented wishes against the proposed treatment. The authorized surrogate requests it anyway; discussion has not resolved the conflict, and there is no immediate emergency.",
        "task": "What should the team do when a surrogate's treatment request remains in conflict with documented patient wishes?",
        "key": "Seek ethics support for the conflict",
        "why": "Unresolved conflict between a surrogate request and known patient wishes warrants appropriate institutional ethics support rather than automatic compliance.",
        "wrong": [
          [
            "Ask another relative to approve the requested treatment",
            "A second relative's agreement does not resolve the conflict with documented patient wishes."
          ],
          [
            "Use the surrogate's current request as the final decision",
            "The unresolved conflict requires further support rather than treating the request as decisive."
          ],
          [
            "Repeat the same family meeting before seeking advice",
            "Discussion has already failed to resolve the conflict; repeating it alone does not add the needed ethics support."
          ]
        ],
        "keyRationale": "Discussion has not resolved the conflict and there is time to obtain appropriate ethics support."
      },
      {
        "sources": [
          "capacity"
        ],
        "complaint": "Supported planning",
        "body": "lacks capacity for a complex treatment decision but can express comfort concerns and simple preferences. The authorized surrogate asks whether the patient should leave while the team decides.",
        "task": "How should a patient who lacks capacity for a complex treatment choice participate in the surrogate discussion?",
        "key": "Include the patient as abilities allow",
        "why": "Even when a surrogate must decide, patients should participate to the extent their abilities permit, with attention to their expressed preferences.",
        "wrong": [
          [
            "Ask the surrogate to relay the patient's concerns",
            "Relaying concerns can help but does not replace involving the patient directly as abilities permit."
          ],
          [
            "Limit discussion to the surrogate's treatment choice",
            "This excludes the preferences and concerns the patient can still express."
          ],
          [
            "Use the patient's simple preference as the final decision",
            "A simple preference does not establish capacity for the complex treatment choice or replace the surrogate's role."
          ]
        ],
        "keyRationale": "The patient can express comfort concerns and simple preferences even though a surrogate is needed for the complex choice."
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
        "complaint": "Preoperative planning",
        "body": "has a DNR order and attends a consultation before an elective hospital operation. A checklist says every DNR order disappears upon entering the operating room; the patient asks whether this is required.",
        "task": "How should an elective operation's resuscitation plan be established for a patient with a DNR order?",
        "key": "Discuss and document the patient's preferences",
        "why": "Perioperative DNR orders require individualized review with the patient or surrogate and responsible clinicians; automatic suspension bypasses self-determination.",
        "wrong": [
          [
            "Use the operating room's usual resuscitation plan",
            "A default plan does not resolve the patient's individual resuscitation preferences."
          ],
          [
            "Carry the existing order forward without reconsideration",
            "The perioperative context requires discussion rather than assuming the existing wording settles it."
          ],
          [
            "Suspend the order while obtaining routine surgical consent",
            "Routine surgical consent does not itself establish agreement to a resuscitation modification."
          ]
        ],
        "keyRationale": "The patient's existing directive needs an individualized discussion rather than automatic suspension."
      },
      {
        "complaint": "Anesthesia preferences",
        "body": "wants an elective hospital operation while retaining some resuscitation limits. The patient asks which interventions are integral to anesthesia and which respond to an unexpected arrest.",
        "task": "How should requested resuscitation limits be addressed before an elective operation involving anesthesia?",
        "key": "Clarify feasible limits and document the plan",
        "why": "The team should clarify requested interventions in the context of anesthesia, identify essential procedures, and document an agreed individualized plan.",
        "wrong": [
          [
            "Carry the current limits into the anesthetic plan",
            "The team must first clarify the requested limits and their feasibility in the anesthesia context."
          ],
          [
            "Use a procedure-specific standard resuscitation plan",
            "A standard plan does not establish the patient's agreed limits."
          ],
          [
            "Leave decisions to the anesthetist during the operation",
            "Deferring decisions does not provide the preoperative discussion and documentation requested."
          ]
        ],
        "keyRationale": "The patient requests specific limits that need review in the context of the planned anesthesia."
      },
      {
        "complaint": "Postoperative planning",
        "body": "agrees to a temporary, specifically documented modification of a DNR order for a hospital operation. The preoperative note does not state when the original limits resume.",
        "task": "Which missing detail should be documented when a DNR order is temporarily modified for an operation?",
        "key": "The time for resuming the original limits",
        "why": "Perioperative planning should document when the original directive will be reinstated so temporary modifications do not silently become indefinite.",
        "wrong": [
          [
            "The clinician authorizing the temporary change",
            "Naming a clinician does not specify when the original limits resume."
          ],
          [
            "The interventions permitted during anesthesia",
            "The permitted interventions do not resolve the missing endpoint of the temporary modification."
          ],
          [
            "The surrogate confirming the operative goals",
            "Identifying a surrogate does not establish when the original limits resume."
          ]
        ],
        "keyRationale": "The note describes a temporary modification but omits when the original directive resumes."
      },
      {
        "complaint": "Treatment concerns",
        "body": "has a DNR order and asks whether the clinic will refuse ordinary symptom treatment. The patient has not declined other care and wants active treatment consistent with personal goals.",
        "task": "What does a DNR order alone limit when a patient still wants other care?",
        "key": "Resuscitation after cardiopulmonary arrest",
        "why": "DNR concerns resuscitative efforts after arrest; it does not by itself prohibit other appropriate treatment consistent with patient goals.",
        "wrong": [
          [
            "Resuscitation and anesthetic airway support",
            "A DNR order alone does not settle every anesthesia intervention; those preferences need their own discussion."
          ],
          [
            "Resuscitation and treatment of a new infection",
            "A DNR order does not by itself decline treatment of other conditions."
          ],
          [
            "Resuscitation and diagnostic testing",
            "A DNR order does not by itself decline diagnostic evaluation."
          ]
        ],
        "keyRationale": "The patient has not refused other care; DNR status alone concerns resuscitation after arrest."
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
        "complaint": "Result follow-up",
        "body": "returns after a verified clinic routing error delayed a biopsy report. Appropriate follow-up is being arranged. A colleague proposes telling the patient only that 'the computer was slow.'",
        "task": "How should you explain a verified routing error that delayed the patient's biopsy report?",
        "key": "Explain the routing error and corrective plan",
        "why": "Patients should receive honest information about errors affecting care, including known implications and steps to address them, rather than a misleading explanation.",
        "wrong": [
          [
            "Discuss the follow-up plan and defer the error explanation",
            "Follow-up matters, but it does not replace disclosure of the verified error that delayed care."
          ],
          [
            "Wait for the routing investigation before discussing the error",
            "The verified error can be explained now while remaining uncertainty is acknowledged."
          ],
          [
            "Have the laboratory explain the clinic's routing delay",
            "Referring the patient elsewhere does not address the clinic's responsibility to explain its verified error."
          ]
        ],
        "keyRationale": "The routing error is verified and follow-up is being arranged; an invented computer explanation would mislead the patient."
      },
      {
        "complaint": "Medication concern",
        "body": "has just received an unintended medication in clinic and develops symptoms. The team recognizes the error; a staff member wants everyone to finish an incident form before calling for clinical help.",
        "task": "What should take priority when an unintended medication has been given and the patient develops symptoms?",
        "key": "Arrange immediate assessment and patient care",
        "why": "Immediate patient safety and appropriate treatment take priority; candid disclosure and reporting accompany the response rather than delaying needed care.",
        "wrong": [
          [
            "Complete the safety report to obtain a review referral",
            "Reporting should not delay assessment and care of the symptomatic patient."
          ],
          [
            "Contact the disclosure lead before arranging assessment",
            "Disclosure support is useful, but immediate patient care takes priority."
          ],
          [
            "Verify the medication record before calling for clinical help",
            "The error is already recognized and the patient is symptomatic; further documentation should not delay care."
          ]
        ],
        "keyRationale": "The patient is symptomatic after a recognized medication error, so clinical help should precede paperwork."
      },
      {
        "complaint": "Care explanation",
        "body": "asks why a specimen was lost. The clinic has verified the loss but not its cause. A supervisor suggests blaming a courier because 'that is probably what happened.'",
        "task": "What should initial disclosure communicate when the patient's specimen is lost but the cause remains unknown?",
        "key": "Explain known facts, uncertainty, and next steps",
        "why": "Disclosure should distinguish verified facts from uncertainty and explain the care and investigation plan; unverified blame is not a factual explanation.",
        "wrong": [
          [
            "Explain the likely courier cause and offer a replacement plan",
            "The suspected cause has not been verified and should not be presented as the explanation."
          ],
          [
            "Wait for a cause to be established before discussing the loss",
            "Known facts and next steps can be disclosed while the cause remains uncertain."
          ],
          [
            "Discuss replacement sampling and defer the reason for it",
            "A next-step plan does not replace explaining the verified loss and current uncertainty."
          ]
        ],
        "keyRationale": "The specimen loss is verified, but the courier theory and consequences have not been established."
      },
      {
        "complaint": "Chart correction",
        "body": "returns to clarify a recommendation discussed at the last visit. The clinic confirms it came from another person's chart and was intercepted before treatment. The clinician asks whether absence of injury eliminates the need to explain the mistake.",
        "task": "How should you address a wrong-chart recommendation that materially affected the patient's care discussion without causing injury?",
        "key": "Explain the material error and its correction",
        "why": "An error materially affecting care information can warrant honest disclosure even without demonstrated injury; absence of harm is not a blanket reason for concealment.",
        "wrong": [
          [
            "Discuss the corrected recommendation and defer the error",
            "The correction alone does not explain the material mistake in the prior care discussion."
          ],
          [
            "Use the internal safety report as the disclosure response",
            "Internal reporting does not substitute for communicating the material error to the patient."
          ],
          [
            "Wait for an injury assessment before discussing the mistake",
            "The error materially affected the care discussion even though treatment injury did not occur."
          ]
        ],
        "keyRationale": "The incorrect recommendation entered this patient's care discussion, so lack of injury does not justify concealment."
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
        "complaint": "Procedure safety",
        "body": "waits for an elective procedure. The assigned clinician is newly stumbling, slurring speech and unable to follow the setup checklist. Qualified coverage is available; the cause of the change is unknown.",
        "task": "How should you protect a patient awaiting an elective procedure when the assigned clinician cannot perform the setup safely?",
        "key": "Arrange safe coverage and clinical assessment",
        "why": "Observable inability to practice safely warrants patient protection and appropriate assessment; the cause should not be assumed from behavior alone.",
        "wrong": [
          [
            "Proceed with a second clinician observing the procedure",
            "Observation does not replace safe coverage when the assigned clinician cannot perform the setup safely."
          ],
          [
            "Pause the procedure and ask the clinician to self-assess",
            "The observed inability to work safely calls for coverage and clinical assessment, rather than relying on self-assessment alone."
          ],
          [
            "Recheck performance after a brief rest before arranging help",
            "A rest-and-recheck approach defers the safe coverage and assessment warranted by the current findings."
          ]
        ],
        "keyRationale": "The observed performance is unsafe and qualified coverage is available; the cause can be assessed without being presumed."
      },
      {
        "complaint": "Follow-up safety",
        "body": "reports missed instructions from a clinician. The team has also documented recent confusion that could compromise care. A supervisor proposes keeping these concerns secret to protect the clinician's reputation.",
        "task": "How should the clinic address documented clinician confusion that may compromise this patient's follow-up?",
        "key": "Arrange assessment and appropriate safety reporting",
        "why": "Credible concerns about impaired practice should prompt appropriate assessment, patient protection and reporting according to the setting, while supporting the colleague.",
        "wrong": [
          [
            "Arrange peer coaching and recheck performance at follow-up",
            "Coaching alone does not address the documented concern requiring assessment and appropriate safety reporting."
          ],
          [
            "Transfer the follow-up and await an impairment diagnosis",
            "Protecting this visit does not replace addressing the documented safety concern through assessment and reporting."
          ],
          [
            "Ask the clinician to explain the missed instructions first",
            "An explanation alone does not address the additional documented confusion that may compromise care."
          ]
        ],
        "keyRationale": "Documented confusion and missed instructions require a safety response for the patient's ongoing care."
      },
      {
        "complaint": "Clinician reassurance",
        "body": "is scheduled for elective lesion removal and asks whether the treating clinician's visible hand disability makes the procedure unsafe. The clinician performs the relevant duties safely with appropriate accommodations and has no observed performance concerns.",
        "task": "What should guide whether a clinician with a hand disability can provide this patient's care safely?",
        "key": "Actual ability to perform the care safely",
        "why": "Illness or disability is not synonymous with impairment. Decisions should concern actual ability to perform duties safely, including appropriate accommodations.",
        "wrong": [
          [
            "The clinician's diagnosis and expected disease course",
            "A diagnosis is not a substitute for evaluating performance of the relevant duties."
          ],
          [
            "The clinician's ability without workplace accommodations",
            "Safety should be judged with appropriate accommodations rather than assuming they cannot be used."
          ],
          [
            "The patient's comfort with the clinician's appearance",
            "Patient concerns deserve discussion, but appearance does not determine functional ability to provide safe care."
          ]
        ],
        "keyRationale": "The clinician safely performs the relevant duties with accommodations and has no observed performance concerns."
      },
      {
        "complaint": "Coverage concern",
        "body": "awaits an elective procedure when the clinician privately says a current illness prevents safe concentration and requests relief. Qualified coverage is available.",
        "task": "How should the team protect a patient awaiting an elective procedure when the clinician requests relief because of illness?",
        "key": "Arrange safe coverage and appropriate assistance",
        "why": "A clinician recognizing inability to practice safely should be supported in obtaining coverage and appropriate assistance, with patient protection as the priority.",
        "wrong": [
          [
            "Reassign demanding tasks and have the clinician continue",
            "Task adjustments do not resolve the clinician's stated inability to concentrate safely for this care."
          ],
          [
            "Offer a short rest before considering relief from duty",
            "A rest period does not replace coverage and assistance when the clinician requests relief for current unsafe concentration."
          ],
          [
            "Cancel the visit and defer assistance to occupational health",
            "Qualified coverage is available; cancellation alone also fails to address the clinician's need for appropriate assistance."
          ]
        ],
        "keyRationale": "The clinician identifies a current inability to concentrate safely and qualified coverage is available."
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
        "complaint": "Study invitation",
        "body": "is offered an optional study during a surgical consultation. A recruiter says ordinary clinic care is available only if the patient enrolls, although this study is not required for that care.",
        "task": "What should you clarify when a recruiter makes ordinary surgical care conditional on joining an optional study?",
        "key": "Declining enrollment does not forfeit ordinary care",
        "why": "Research participation must be voluntary; ordinary care should not be contingent on joining an optional study.",
        "wrong": [
          [
            "Declining enrollment requires transfer to another clinic",
            "Transfer of ordinary care would preserve the coercive condition on enrollment."
          ],
          [
            "Declining enrollment postpones the surgical consultation",
            "Delaying unrelated ordinary care would make the optional study a condition of care."
          ],
          [
            "Declining enrollment limits access to routine follow-up",
            "Restricting unrelated follow-up would undermine voluntary participation."
          ]
        ],
        "keyRationale": "The study is optional and not required for the ordinary care being offered."
      },
      {
        "complaint": "Research questions",
        "body": "has consented to elective cyst removal. A coordinator proposes an extra research-only tissue sampling procedure under the same signature; its purpose, additional procedure and voluntary nature have not been discussed.",
        "task": "What is needed before an additional research-only procedure that was not covered by the patient's clinical-treatment consent?",
        "key": "Complete an appropriate research consent process",
        "why": "Consent to clinical treatment does not automatically authorize an additional research-only procedure; applicable research consent and oversight requirements must be met.",
        "wrong": [
          [
            "Extend the clinical consent to cover the extra sampling",
            "The clinical signature does not establish an appropriate consent process for the undisclosed research-only procedure."
          ],
          [
            "Use a signed research form as the entire consent process",
            "A signature alone does not supply the missing purpose, procedure and voluntary-participation discussion."
          ],
          [
            "Ask the treating surgeon to authorize the extra sampling",
            "The surgeon's authorization does not replace the patient's appropriate research consent process."
          ]
        ],
        "keyRationale": "The research-only sampling procedure and its voluntary nature were not part of the clinical consent discussion."
      },
      {
        "complaint": "Study expectations",
        "body": "considers a randomized study and says, 'My surgeon will put me in whichever arm is best for me.' The approved protocol uses random allocation, and no arm is guaranteed better.",
        "task": "What should be clarified when a patient expects their surgeon to select the personally best arm of a randomized study?",
        "key": "Assignment is random and benefit is uncertain",
        "why": "Research consent should explain allocation and uncertainty so participants do not mistake the protocol for individually selected treatment with guaranteed benefit.",
        "wrong": [
          [
            "Assignment is clinical and benefit is individualized",
            "The protocol uses random allocation rather than the surgeon's clinical selection of a personally preferred arm."
          ],
          [
            "Assignment is random and benefit is established",
            "Random allocation does not guarantee that the assigned arm will provide a superior personal outcome."
          ],
          [
            "Assignment is chosen and benefit is uncertain",
            "The protocol uses random allocation rather than participant choice of the study arm."
          ]
        ],
        "keyRationale": "The protocol allocates randomly and does not guarantee that either arm is better for the patient."
      },
      {
        "complaint": "Leaving a study",
        "body": "wants to withdraw from a voluntary study and continue ordinary clinical follow-up. The coordinator threatens to cancel unrelated clinic appointments unless participation continues.",
        "task": "How should you respond when a study participant is threatened with loss of ordinary follow-up for withdrawing?",
        "key": "Support withdrawal and preserve ordinary follow-up",
        "why": "Participants should be able to withdraw without coercive loss of ordinary care; clinical follow-up can be discussed separately from continued participation.",
        "wrong": [
          [
            "Defer withdrawal until the remaining study visits are complete",
            "Requiring further participation does not support the patient's voluntary withdrawal."
          ],
          [
            "Require the investigator's approval before withdrawal",
            "Participation is voluntary rather than dependent on the investigator granting permission to leave."
          ],
          [
            "Arrange transfer of ordinary care before allowing withdrawal",
            "Making unrelated follow-up contingent on transfer preserves a penalty for withdrawal."
          ]
        ],
        "keyRationale": "The patient wants to withdraw from a voluntary study while continuing unrelated ordinary follow-up."
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
        "complaint": "Project questions",
        "body": "asks about including their clinic visit in a local reminder project. Its team plans a journal article and claims that publication automatically makes the project human-subjects research.",
        "task": "What should you explain to a patient when publication plans are used to classify a clinic improvement project as research?",
        "key": "Publication plans alone do not define research",
        "why": "Publication intent alone does not determine whether an activity is research; purpose, design and applicable definitions require appropriate institutional assessment.",
        "wrong": [
          [
            "Publication intent establishes a generalizable research aim",
            "An intention to publish does not by itself establish the purpose and activities that define research."
          ],
          [
            "Journal submission determines the need for research review",
            "Oversight is based on the activity, rather than waiting for a submission decision."
          ],
          [
            "Peer review determines the project's research classification",
            "Editorial review does not by itself establish institutional research classification."
          ]
        ],
        "keyRationale": "The team's plan for an article does not by itself determine the project's purpose or applicable classification."
      },
      {
        "complaint": "Data project consent",
        "body": "is invited into a project labeled 'QI' that adds an experimental intervention to test a generalizable hypothesis. The organizer says that label means no institutional assessment is needed.",
        "task": "How should a proposed experimental project involving the patient be assessed when the organizer claims a QI label removes oversight?",
        "key": "Seek institutional assessment before proceeding",
        "why": "Calling a project QI does not exempt an activity that may also be human-subjects research; institutional review should determine applicable requirements.",
        "wrong": [
          [
            "Proceed under the local QI designation while collecting data",
            "The QI label does not remove the need to assess the experimental and generalizable components."
          ],
          [
            "Use publication plans to decide whether review is needed",
            "Publication intent alone does not classify the activity or determine its oversight."
          ],
          [
            "Use standard treatment consent for the added intervention",
            "Clinical consent does not resolve the research classification and oversight question."
          ]
        ],
        "keyRationale": "The project adds an experimental intervention for a generalizable hypothesis, so the QI label cannot settle its requirements."
      },
      {
        "complaint": "Workflow project",
        "body": "asks why the clinic tracks reminder delivery at their visits. The project implements an established practice to improve the local process and collect practical implementation data; no research component has been identified.",
        "task": "What should you explain about research classification for a local project implementing an established reminder practice?",
        "key": "The stated purpose supports local improvement",
        "why": "Implementing accepted practice and collecting practical improvement data may fall outside the research definition; other institutional obligations still need consideration.",
        "wrong": [
          [
            "The local measurements support research classification",
            "Collecting implementation data for local improvement does not automatically make the activity research."
          ],
          [
            "The publication plans support research classification",
            "Publication intent alone does not establish research."
          ],
          [
            "The patient involvement supports research classification",
            "Patient involvement alone does not determine research classification; the purpose and activities matter."
          ]
        ],
        "keyRationale": "The stated project implements an established local practice and no research component has been identified."
      },
      {
        "complaint": "Project oversight",
        "body": "is invited to a project combining local improvement with an experimental comparison intended to produce generalizable knowledge. The investigator says a project must be either QI or research, never both.",
        "task": "How should a project involving the patient be assessed when it combines local improvement and generalizable research aims?",
        "key": "Seek institutional review of the research component",
        "why": "An activity may serve both improvement and research purposes; a research component can trigger applicable review and consent requirements despite local benefit.",
        "wrong": [
          [
            "Review the project under its local improvement designation",
            "The local improvement aim does not remove the need to review the research component."
          ],
          [
            "Review the project after generalizable results are obtained",
            "Waiting for results does not address the research component before proceeding."
          ],
          [
            "Review the project using publication intent as the criterion",
            "Publication intent alone does not classify the combined activities."
          ]
        ],
        "keyRationale": "The experimental comparison has a research aim even though the project also intends a local benefit."
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
        "complaint": "Privacy request",
        "body": "asks that an elective procedure remain private. A friend calls for the diagnosis; the patient has not authorized disclosure, and no relevant legal or safety exception applies.",
        "task": "How should the clinic respond when a friend requests the patient's diagnosis without authorization or an applicable exception?",
        "key": "Decline disclosure without patient authorization",
        "why": "A friend's interest does not authorize disclosure of confidential information when no applicable exception exists.",
        "wrong": [
          [
            "Ask the friend to verify the patient's date of birth",
            "Identity details do not establish the patient's authorization to disclose the diagnosis."
          ],
          [
            "Confirm the diagnosis already known to the friend",
            "Confirming private information is still disclosure without authorization or an applicable exception."
          ],
          [
            "Give the friend a general summary of the procedure",
            "A selected or summarized detail still requires an authorized basis for disclosure."
          ]
        ],
        "keyRationale": "The patient has not authorized the friend's request and no relevant exception is present."
      },
      {
        "complaint": "Chart privacy",
        "body": "recognizes a neighbor working in the clinic and asks whether that employee can browse the chart. The neighbor has no role in the patient's care or authorized administrative work.",
        "task": "What should govern a clinic employee's access to a neighbor's chart when the employee has no authorized role in that patient's care?",
        "key": "An authorized work-related reason for access",
        "why": "Clinic employment and personal curiosity do not themselves justify accessing a patient's confidential information.",
        "wrong": [
          [
            "A personal invitation to look up the patient's diagnosis",
            "A personal invitation does not establish an authorized work-related reason for this employee to access the chart."
          ],
          [
            "A verified relationship with the patient's family",
            "Knowing the family does not establish an authorized role in the patient's care or administration."
          ],
          [
            "An active clinic login with chart-reading permission",
            "Technical access does not establish an authorized work-related purpose for opening this chart."
          ]
        ],
        "keyRationale": "The neighbor has no care or administrative role requiring this chart, so employment and familiarity do not authorize access."
      },
      {
        "complaint": "Public discussion",
        "body": "learns that staff discussed their identifiable biopsy case in a crowded elevator. The conversation was not urgent and a private clinical workspace was available. The patient asks how the team will handle further discussion.",
        "task": "How should the team handle discussion of the patient's identifiable case in a crowded public setting?",
        "key": "Move the discussion to a private clinical setting",
        "why": "Clinical communication should avoid unnecessary exposure of identifiable information to people without an authorized reason to hear it.",
        "wrong": [
          [
            "Continue quietly and avoid speaking the patient's name",
            "Other details can still identify the patient, and a private clinical setting is available."
          ],
          [
            "Send the discussion to the team's personal message thread",
            "Moving identifiable details to a personal thread does not establish an appropriate private clinical communication setting."
          ],
          [
            "Discuss the case at the next hallway team huddle",
            "Changing the time does not address discussion in a public setting."
          ]
        ],
        "keyRationale": "The patient's case is identifiable, the elevator is crowded, and a private workspace is available."
      },
      {
        "complaint": "Care coordination",
        "body": "has authorized coordination with a treating specialist who requests information relevant to the consultation. A colleague claims confidentiality prohibits every exchange between clinicians.",
        "task": "How should a specialist's request for relevant consultation information be handled when the patient has authorized care coordination?",
        "key": "Share relevant information for authorized care",
        "why": "Confidentiality permits appropriate information exchange for authorized care while requiring attention to purpose and unnecessary disclosure; it does not prohibit all coordination.",
        "wrong": [
          [
            "Send the complete chart for the specialist to filter",
            "Authorized coordination does not justify unnecessary disclosure beyond the consultation's purpose."
          ],
          [
            "Request a new authorization for each relevant chart item",
            "The stated authorization already supports relevant care coordination; treating every item as prohibited impedes that purpose."
          ],
          [
            "Send a de-identified summary for the treating consultation",
            "De-identification does not substitute for the relevant patient-specific information requested for authorized care."
          ]
        ],
        "keyRationale": "The patient has authorized the coordination and the requested information is relevant to the specialist's consultation."
      }
    ]
  }
];
function variant(topic:Topic, story:Story, index:number):VariantSpec {
  return {slug:`${topic.id}-${index+1}`,complaint:story.complaint,
    presentation:story.spanish?story.body:`{patientName}, a {patientAge}-year-old {patientSex}, ${story.body}`,
    stem:story.task,correct:{id:`key-${index+1}`,label:story.key,rationale:story.keyRationale},
    distractors:story.wrong.map(([label,rationale],i)=>({id:`wrong-${index+1}-${i+1}`,label,rationale})) as VariantSpec["distractors"],
    explanation:story.why, teachingPoint:story.why,
    claimIds:[`claim.gs028se.${topic.id}.${index+1}`],sexLabels:story.spanish?["Female"]:["Female","Male"]};
}
function family(a:Topic,b:Topic):FamilySpec {
 const pair=[a,b];return {slug:`${a.id}-${b.id}`,label:"Ethics and communication",
 sources:[...new Set(pair.flatMap(t=>t.sources))].map(k=>ETHICS_SOURCES[k]),
 claims:pair.flatMap(t=>t.stories.map((s,i)=>({id:`claim.gs028se.${t.id}.${i+1}`,statement:s.why,sourceIds:(s.sources ?? t.sources).map(k=>ETHICS_SOURCES[k].id),category:"safety_boundary" as const,limitation:`Ethical guidance does not replace jurisdiction-specific law or institutional policy.${t.sources.length===1?" Single-source limitation.":""}${t.id==="qi-versus-research"?" Older nonbinding OHRP guidance; current definitions govern.":""}`,population:"People in the stated fictional clinical situation."}))),
 ...(a.id==="qualified-interpreter" ? {pairing:{indices:[0,1,2,3] as Array<0|1|2|3>,updates:[
    "With qualified Spanish interpretation in place, {patientName} says the hernia-repair form was signed at reception without a discussion of risks or alternatives. The operation has not started.",
    "With qualified interpretation in place, {patientName} asks whether declining the elective skin biopsy is an option. The booking conversation covered only the proposed biopsy.",
    "With qualified Spanish interpretation in place, {patientName} says the lesion-excision form guarantees no scar. The elective procedure has not started.",
    "In a private interpreted conversation, {patientName} says a companion threatened to withhold rides unless cyst removal goes ahead and says, 'I do not want this removed.' There is no urgent clinical need.",
  ]}} : {}),
 concepts:pair.map(t=>({id:`concept.statistics-ethics.${t.id}`,displayName:t.title,learningObjective:t.objective,stage:0,educationalTier:0,conceptType:"applied_science",evidenceClaimIds:t.stories.map((_,i)=>`claim.gs028se.${t.id}.${i+1}`),variants:t.stories.map((s,i)=>variant(t,s,i))})) as [ConceptSpec,ConceptSpec]};
}
export const ETHICS_FAMILIES=Array.from({length:topics.length/2},(_,i)=>buildFamily(family(topics[i*2]!,topics[i*2+1]!)));

