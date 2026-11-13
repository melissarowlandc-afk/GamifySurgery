import { decodeJournalValue } from "../journalEncoding";
import { afterEach,expect,it,vi } from "vitest";
import { createGameEvidenceCheckpoint,createInitialGameState } from "@gamify-surgery/game-domain";
import { journalRowText,type JournalRow } from "../localJournal";
import { sha256Utf8 } from "./codecJson";
import { OperationalEngineProcessor } from "./operationalEngineProcessor";
import { dispatchOperationalEngineRequest } from "./operationalEngineDispatch";
import type { OperationalEngineReply } from "./operationalEngineProtocol";
import { deferred } from "./syncTestSupport";

const rollout = vi.hoisted(() => ({ enabled: false }));
vi.mock("../localStorageBuildPolicy", () => ({ get LOCAL_STORAGE_COMPRESSION_WRITES() { return rollout.enabled; } }));
afterEach(()=>vi.restoreAllMocks());
it.each([false,true])("hashes original journal bytes without blocking commands, compressed writes=%s",async writesEnabled=>{
  rollout.enabled=writesEnabled;
  const state=createInitialGameState(),checkpoint=createGameEvidenceCheckpoint(state),engine=new OperationalEngineProcessor();
  engine.handle({id:1,kind:"initialize",checkpoint,visibleState:state,atRealMs:1800000000000});
  const row:JournalRow={delta:null,campaign:{campaignId:state.campaignId,name:"Public Unicode \u03b1 \ud83e\ude7a",status:"resumable",createdAtRealMs:0,updatedAtRealMs:1,
    tutorial:{guidance:null,introDismissed:true,dailyRoutinePause:null,dailyRoutineTipAcknowledgments:[]}},usageQuestions:[],writerGeneration:"public.writer",version:1};
  const expected=await sha256Utf8(journalRowText(row)),gate=deferred(),digest=crypto.subtle.digest.bind(crypto.subtle);
  vi.spyOn(crypto.subtle,"digest").mockImplementation(async(...args)=>{await gate.promise;return digest(...args);});
  const replies:OperationalEngineReply[]=[];
  dispatchOperationalEngineRequest(engine,{id:2,kind:"journalHashes",rows:[{row:structuredClone(row)}]},reply=>replies.push(reply));
  dispatchOperationalEngineRequest(engine,{id:3,kind:"command",expectedVersion:0,command:{type:"SET_SIMULATION_SPEED",speed:4,operationId:"hash.parallel.command"}},reply=>replies.push(reply));
  expect(replies).toHaveLength(1);expect(replies[0]).toMatchObject({id:3,kind:"applied",version:1});
  gate.resolve();await vi.waitFor(()=>expect(replies).toHaveLength(2));
  const reply=replies[1];
  if(reply?.kind!=="journalHashes"||reply.missing)throw Error("Journal hashes missing");
  if(writesEnabled){
    if(!reply.encodedRows)throw Error("Storage encoding missing");
    expect({...reply,encodedRows:await Promise.all(reply.encodedRows.map(value=>decodeJournalValue(value as JournalRow)))})
      .toEqual({id:2,kind:"journalHashes",hashes:[expected],encodedRows:[{...row,sha256:expected}]});
  }else expect(reply).toEqual({id:2,kind:"journalHashes",hashes:[expected]});
  expect(engine.handle({id:4,kind:"checkpoint",expectedVersion:1}).kind).toBe("checkpoint");
});
