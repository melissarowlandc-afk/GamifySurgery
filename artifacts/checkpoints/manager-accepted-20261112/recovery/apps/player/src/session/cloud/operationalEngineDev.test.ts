import { expect,it } from "vitest";
import { createGameEvidenceCheckpoint,createInitialGameState,applyGameEvidenceCommand } from "@gamify-surgery/game-domain";
import { nativeDevCodecFactory } from "./codecWorkerNativeTestSupport";
import { OperationalEngineClient,type OperationalEnginePort } from "./operationalEngineClient";
import { createOperationalPlayerView } from "./operationalViewProjection";
import { sha256Utf8 } from "./codecJson";
import { journalRowText,type JournalRow } from "../localJournal";
it("loads the real Vite module worker and transports exact gameplay/view/journal hashes without network",async()=>{
  const factory=await nativeDevCodecFactory(false,"/src/session/cloud/operationalEngine.worker.ts?worker_file&type=module");
  let client:OperationalEngineClient|undefined;
  try {
    const state=createInitialGameState(),checkpoint=createGameEvidenceCheckpoint(state),atRealMs=1800000000000;
    client=await OperationalEngineClient.create({checkpoint,visibleState:state,atRealMs,projection:{revision:0,args:[null,false,null],asOfRealMs:atRealMs}},
      ()=>factory.create() as unknown as OperationalEnginePort);
    const command={type:"SET_SIMULATION_SPEED",speed:4,operationId:"vite.worker.public"} as const;
    const actual=await client.execute(command),expected=applyGameEvidenceCommand(checkpoint,command);
    expect(JSON.stringify(actual.state)).toBe(JSON.stringify(expected.state));
    expect(JSON.stringify(actual.view)).toBe(JSON.stringify(createOperationalPlayerView(expected.state,[null,false,null],atRealMs)));
    const row:JournalRow={delta:actual.delta,campaign:{campaignId:state.campaignId,name:"Public worker clinic",status:"resumable",createdAtRealMs:0,updatedAtRealMs:1,
      tutorial:{guidance:null,introDismissed:true,dailyRoutinePause:null,dailyRoutineTipAcknowledgments:[]}},usageQuestions:[],version:1};
    const hash=await sha256Utf8(journalRowText(row));
    expect(await client.hashJournalRows([row])).toEqual([hash]);
    // The first hash releases its cached worker delta. Retrying the same row
    // takes the full-data route without failing or advancing the game engine.
    expect(await client.hashJournalRows([row])).toEqual([hash]);
    expect((await client.execute({type:"SET_SIMULATION_SPEED",speed:2,operationId:"vite.after.hash-retry"})).state.simulationSpeed).toBe(2);
    expect(factory.errors).toEqual([]);
  }finally{client?.dispose();await factory.close();}
},120000);
