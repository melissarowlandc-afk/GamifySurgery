import { expect,it } from "vitest";
import { applyGameEvidenceCommand,createGameEvidenceCheckpoint,createInitialGameState,gameEvidenceDelta,type GameCommand } from "@gamify-surgery/game-domain";
import { OperationalEvidenceMirror } from "./operationalEvidenceMirror";
import { operationalStatePatch } from "./operationalStatePatch";

it("maintains exact snapshot/archive bytes and immutable prior heads through append, pruning and baseline reset",()=>{
  const state=createInitialGameState();state.paused=false;
  let checkpoint=createGameEvidenceCheckpoint(state),mirror=OperationalEvidenceMirror.create(checkpoint);
  for(let i=0;i<180;i++){
    const command:GameCommand=i%23===0?{type:"SET_SIMULATION_SPEED",speed:4,operationId:`mirror.speed.${i}`}:
      {type:"ADVANCE_TICK",operationId:`mirror.tick.${i}`,advancedAtRealMs:1800000000000+i*1000};
    const prior=mirror.checkpoint,priorBytes=JSON.stringify(prior),result=applyGameEvidenceCommand(checkpoint,command);
    mirror=mirror.advance(structuredClone(operationalStatePatch(checkpoint.snapshot,result.checkpoint.snapshot)),structuredClone(gameEvidenceDelta(checkpoint,result.checkpoint)));
    expect(JSON.stringify(mirror.checkpoint)).toBe(JSON.stringify(result.checkpoint));expect(JSON.stringify(prior)).toBe(priorBytes);
    checkpoint=result.checkpoint;
    if(i===90){checkpoint=createGameEvidenceCheckpoint(result.state);mirror=OperationalEvidenceMirror.create(structuredClone(checkpoint),true);}
  }
});

it("rejects a recovery snapshot with the wrong head without changing the previous checkpoint",()=>{
  const checkpoint=createGameEvidenceCheckpoint(createInitialGameState()),mirror=OperationalEvidenceMirror.create(checkpoint);
  const result=applyGameEvidenceCommand(checkpoint,{type:"SET_SIMULATION_SPEED",speed:4,operationId:"mirror.invalid"});
  const delta=gameEvidenceDelta(checkpoint,result.checkpoint),before=JSON.stringify(mirror.checkpoint);
  expect(()=>mirror.advance(undefined,delta)).toThrow();expect(JSON.stringify(mirror.checkpoint)).toBe(before);
});
