import {describe,expect,it} from "vitest";
import {QUESTION_PROGRAM_BATCH11_ACCEPTED_CASES as cases,QUESTION_PROGRAM_BATCH11_ACCEPTED_TEST_ORDER_RECORDS as orders,PEDIATRIC_CLINIC_FAMILY_CONTEXTS,
  type SyntheticClinicalCase} from "@gamify-surgery/clinical-content";
import {PROTOTYPE_DOMAIN_CONTEXT as current,gameReducer,getClinicalCaseEligibilityIssue,getAnswerChoiceServicePreview,
  serializeGameState,pediatricStillEligibleEntries,clinicalCaseHasSupportedPatientSemantics,createInitialGameState,
  createPatientPixelAppearance,createPediatricFamily,getCurrentCapabilities} from "../src";
import {selectProcedureConsult} from "../src/founder-consults";
import {supportedProcedureContext} from "../src/procedure-context";
import {engProcedureClinic,advanceEngProcedure,openEngConsult,engTick} from "./eng-i01-live-procedure.fixture";
import {createLevelFourRoomsQaState} from "../../../tests/fixtures/level-four-rooms";
import {createPediatricAppointmentsQaState} from "../../../tests/fixtures/pediatric-appointments";

const live=cases.filter(c=>c.procedureContext?.mode==="live");
const chart=cases.filter(c=>c.procedureContext?.mode==="chart_review");
const kind=(c:SyntheticClinicalCase)=>supportedProcedureContext(c)!.kind;

describe("batch11 real ENG-I01 source and clinic admission",()=>{
  it.each(live)("offers $id only at its actual compatible staffed procedure",source=>{
    const c=structuredClone(source);expect(current.clinicalRelease.cases.find(x=>x.id===c.id)).toEqual(c);
    let {state,context,id}=engProcedureClinic(kind(c),c);
    expect(supportedProcedureContext(c)).toEqual(c.procedureContext);
    for (const capability of supportedProcedureContext(c)!.requiredCapabilityIds)
      expect(getCurrentCapabilities(state,context).has(capability),capability).toBe(true);
    const op=()=>state.serviceOperations.find(op=>op.id===id)!;
    expect(op().procedureContext?.familyId).toBe(c.procedureContext!.familyId);
    expect(selectProcedureConsult(state,context,1000,new Set())).toBeNull();
    const ordinary=gameReducer(state,{type:"ADMIT_PATIENT",operationId:"batch11.unsourced",encounterId:"batch11.unsourced",caseId:c.id,patientDisplayName:c.patientDisplayName,arrivalClass:"routine"},context);
    expect(ordinary.operationReceipts["batch11.unsourced"]!.status).toBe("rejected");
    state=advanceEngProcedure(state,context,id);
    const valid=selectProcedureConsult(state,context,1000,new Set());expect(valid?.selection.clinicalCase).toEqual(c);
    expect(valid!.roomId).toBe(op().reservedRoomInstanceIds.find(id=>state.rooms.some(r=>r.id===id&&r.roomDefinitionId===(kind(c)==="operation"?"room.ambulatory_or":"room.endoscopy"))));
    for(const fault of ["family","room","wrong_room","outage","phase","nurse","provider","capability"] as const){
      const bad=structuredClone(state),changed=structuredClone(c),o=bad.serviceOperations.find(o=>o.id===id)!;
      if(fault==="family")o.procedureContext!.familyId=c.procedureContext!.familyId==="procedure.groin_hernia_repair"?"procedure.ventral_hernia_repair":"procedure.groin_hernia_repair";
      if(fault==="room")bad.rooms=bad.rooms.filter(r=>!o.reservedRoomInstanceIds.includes(r.id));
      if(fault==="wrong_room")bad.rooms.find(r=>r.id===valid!.roomId)!.roomDefinitionId=kind(c)==="operation"?"room.endoscopy":"room.ambulatory_or";
      if(fault==="outage")bad.rooms.find(r=>r.id===valid!.roomId)!.maintenance={status:"out_of_service",dueAtFacilityTick:0,outOfServiceAtFacilityTick:0,completedUses:0,appliedUseKeys:[]};
      if(fault==="phase")o.status="walking_between_phases";
      if(fault==="nurse")bad.employees=bad.employees.filter(e=>e.staffRoleDefinitionId!==(kind(c)==="operation"?"staff.or_nurse":"staff.endoscopy_nurse"));
      if(fault==="provider")o.providerReservation=null;
      if(fault==="capability"&&changed.procedureContext?.mode==="live")changed.procedureContext.requiredCapabilityIds.push("capability.not_installed_batch11_control");
      const control={...context,clinicalRelease:{...context.clinicalRelease,cases:context.clinicalRelease.cases.map(x=>x.id===c.id?changed:x)}};
      expect(selectProcedureConsult(bad,control,1000,new Set()),fault).toBeNull();expect(o.consultEncounterId).toBeUndefined();
    }
    const opened=openEngConsult(state,context,id);const frozen=opened.state.encounters[opened.encounterId]!.frozenCase;
    expect(frozen.id).toBe(c.id);expect(frozen.decisionNodes.map(n=>n.questionVariantId)).toEqual(c.decisionNodes.map(n=>n.questionVariantId));
  });

  it("provides every exact testing choice with a side-effect-free planning estimate",()=>{
    expect(orders).toHaveLength(5);
    for(const r of orders){const c=cases.find(c=>c.id===r.caseId)!,n=c.decisionNodes.find(n=>n.id===r.nodeId)!;
      const state=createInitialGameState(current),e=Object.values(state.encounters)[0]!;
      e.frozenCase=structuredClone(c);e.currentNodeIndex=c.decisionNodes.indexOf(n);e.patientMovement=null;e.checkInStatus="checked_in";e.pendingResult=null;
      e.arrivalClass="routine";e.lifecycle="active_action_required";e.terminalFeedback=null;
      e.steps=c.decisionNodes.map((node,i)=>({nodeIndex:i,decisionNodeId:node.id,questionVariantId:node.questionVariantId,primaryConceptId:node.primaryConceptId,
        status:i<e.currentNodeIndex?"completed":i===e.currentNodeIndex?"action_required":"locked",answer:null,result:null}));
      state.facilityLevel=5;state.encounters={[e.id]:e};state.openChartEncounterId=e.id;
      if(c.pediatricProfile){const family=PEDIATRIC_CLINIC_FAMILY_CONTEXTS.find(f=>f.caseId===c.id)!;
        e.patientAppearance=createPatientPixelAppearance(state.campaignSeed,e.id,c.prototypeDemographics);e.patientAppearance.stillId=family.childStillId;
        createPediatricFamily(state,e,"encounter",{displayName:family.parentName,sexLabel:family.parentRelationship==="mother"?"Female":"Male"});}
      const before=serializeGameState(state),p=getAnswerChoiceServicePreview(state,e.id,r.choiceId,current);
      expect(p).toMatchObject({kind:"test",timingProfileId:r.timingProfileId});expect(p!.durationTicks).toBeGreaterThan(0);expect(serializeGameState(state)).toBe(before);
    }
  });
});
