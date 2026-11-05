import {entry} from './question-flags-round2-specs-20261104.mjs';
const draft={contentVersion:'question-flags-round2.evidence.2026-11-04.v1',reviewStatus:'needs_clinician_review',aiAssistedDrafting:true,lastClinicianReview:null,lastCheckedOn:'2026-11-04'};
const make=(id,basis,statement,limitation)=>({...draft,id,statement,
 sourceIds:[...new Set(basis.flatMap(id=>entry.claims[id].sourceIds))],evidenceCategory:'evaluation',certainty:'moderate',
 applicablePopulation:'The explicitly controlled or reported adult retrospective profiles in the round-two question-flag drafts.',
 limitation,basisClaimIds:basis,
 verificationScope:'Offline application/physical inference from previously recorded claims. No source was newly retrieved; source access dates and reuse restrictions remain unchanged. Clinician/source-alignment review is pending.'});
export const claims=[
 make('claim.qf2.fixed-volume-peak-plateau-pattern',
  ['claim.gs028g.laparoscopy-respiratory.diaphragm-compliance','claim.gs028g.laparoscopy-respiratory.diaphragm-compliance.fact2'],
  'At unchanged tidal volume, inspiratory flow and PEEP, a matched increase in peak and plateau pressure with an unchanged peak-to-plateau difference supports increased elastic pressure requirements rather than an isolated increase in airway resistance.',
  'Qualitative physical application of the recorded diaphragm/compliance relation. It is not a newly verified ventilator algorithm, universal diagnosis or instruction to choose settings; the question explicitly supplies the acquisition controls.'),
 make('claim.qf2.qualitative-co2-acid-base-pattern',
  ['claim.gs028e.laparoscopy.co2-load-respiratory-acidemia','claim.gs028e.laparoscopy.peritoneal-co2-uptake'],
  'In the supplied qualitative record, higher arterial CO2 with lower pH and unchanged bicarbonate supports a respiratory CO2-load interpretation rather than a new primary fixed-acid process.',
  'A case-specific acid-base inference, not a numeric compensation rule, exclusion of every mixed disorder, or proof that peritoneal absorption is the sole cause in every operation.'),
 make('claim.qf2.sleep-questionnaire-domain-interpretation',
  ['claim.gs028d.osa.validated-screen'],
  'A STOP-Bang OSA-probability report and an Epworth daytime-sleepiness report address different targets; a reassuring sleepiness report does not establish absence of OSA or turn a probability screen into a confirmed diagnosis.',
  'Uses names and reported outputs only, without questionnaire items, scoring implementation, numeric cutoffs or diagnostic-study thresholds. The domain application requires anaesthesia/source-alignment review; no fresh verification is claimed.'),
];
