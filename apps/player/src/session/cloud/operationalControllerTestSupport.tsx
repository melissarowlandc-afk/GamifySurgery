import { act } from "react";
import { AuthAccountContext } from "../../auth/AuthAccountContext";
import { phoneTestDom } from "../../mobile/screenTestUtils";
import { createFreshProfile } from "../prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../usePrototypeSession";
import type { CloudGameSession } from "./gameSession";

export async function mountOperationalController(session: CloudGameSession, accountId: string) {
  const env = phoneTestDom(), intervals = new Map<number, { callback: () => void; ms: number }>(); let sequence = 0;
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval(callback: () => void, ms: number) { const id=++sequence; intervals.set(id,{callback,ms});return id; },
    clearInterval(id: number) { intervals.delete(id); } });
  const state=session.state, profile={...createFreshProfile(),activeCampaignId:state.campaignId,tutorialsEnabled:false,
    tutorialGuidanceByCampaign:{[state.campaignId]:{version:2 as const,mode:"off" as const,exposedTopicIds:[]}},campaigns:[{...session.metadata,state}]};
  let current!: PrototypeSession, renders=0,viewMs=0;
  function Game() {
    current=usePrototypeSession({profile,notice:"Public verified clinic"},session);
    const at=performance.now();
    session.playerView(current.state,current.state.openChartEncounterId,current.summaryVisible,current.selectedRoomDefinitionId,current.buildMode,
      current.selectedRoomInstanceId,current.placementOrientation,current.facilityCamera,current.questionReviewFlags,false);
    viewMs+=performance.now()-at;renders++;return <p>{current.state.facilityTick}</p>;
  }
  await env.render(<AuthAccountContext.Provider value={accountId}><Game /></AuthAccountContext.Provider>);
  const pulse=(speed:number)=>{const timer=[...intervals.values()].filter(row=>row.ms===1000/speed).at(-1);if(!timer)throw Error("Missing controller clock");timer.callback();};
  return {env,current:()=>current,get renders(){return renders;},get viewMs(){return viewMs;},reset(){renders=0;viewMs=0;},
    pulse,
    async action(work:(session:PrototypeSession)=>unknown){await act(async()=>{await work(current);await session.durable();});},
    async tick(speed:number){await act(async()=>{pulse(speed);await session.commandsSettled();});}
  };
}
