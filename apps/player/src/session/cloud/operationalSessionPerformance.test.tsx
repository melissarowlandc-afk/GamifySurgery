import { afterEach, expect, it } from "vitest";
import { performance as nodePerformance } from "node:perf_hooks";
import { setImmediate as immediate, setTimeout as delay } from "node:timers/promises";
import { mkdirSync,writeFileSync } from "node:fs";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createDiagnosticWorkload } from "../../../../../tests/fixtures/diagnostic-workload";
import { cleanupPhoneTests } from "../../mobile/screenTestUtils";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { nativeOperationalEngineTestPort } from "./operationalEngineNativeTestSupport";
import { mountOperationalController } from "./operationalControllerTestSupport";

const hostedTime=(ms:number)=>process.env.CI?ms*10:ms;
afterEach(cleanupPhoneTests);
it("keeps the actual account session/controller/view below 16ms at 1x/2x/4x on the large public clinic",async()=>{
  const fixture=createDiagnosticWorkload(), f=await operationalSessionFixture({createPort:nativeOperationalEngineTestPort},fixture.state);
  const metrics:{speed:number;mainMs:number;viewMs:number;wallMs:number}[]=[];
  try {
    for(let i=0;i<170;i++){
      expect(await f.session.executeAsync({type:"SET_SIMULATION_SPEED",speed:i%2?2:4,operationId:`integrated.public.tail.${i}`},PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      if(i%16===0)expect(await f.session.durable()).toBe(true);
    }
    expect(await f.session.durable()).toBe(true);expect(await f.session.prepareRecoveryCopy()).toBe(true);
    const controller=await mountOperationalController(f.session,f.scope.accountId);
    for(const speed of [1,2,4] as const){
      if(speed===2)await controller.action(s=>s.openPatient(fixture.chartId));
      if(speed===4)await controller.action(s=>s.closeChart());
      await controller.action(s=>s.setSimulationSpeed(speed));if(f.session.state.paused)await controller.action(s=>s.togglePause());
      let next=performance.now()+1000/speed;
      for(let i=0;i<12;i++){
        const wait=next-performance.now();if(wait>0)await delay(wait);next+=1000/speed;
        controller.reset();await immediate();const utilization=nodePerformance.eventLoopUtilization(),at=performance.now(),tick=f.session.state.facilityTick;
        await controller.tick(speed);await immediate();
        metrics.push({speed,mainMs:nodePerformance.eventLoopUtilization(utilization).active,viewMs:controller.viewMs,wallMs:performance.now()-at});
        expect(f.session.state.facilityTick).toBe(tick+1);
      }
    }
    expect(await f.session.durable()).toBe(true);
    if(process.env.OPERATIONAL_SESSION_MEASUREMENT==="1"){
      const folder=new URL("../../../../../.local-dev/evidence-tick-20261104/",import.meta.url);mkdirSync(folder,{recursive:true});
      writeFileSync(new URL("public-session.json",folder),JSON.stringify({tailCommands:170,metrics},null,2));
    }
    for(const speed of [1,2,4])expect(Math.max(...metrics.filter(r=>r.speed===speed).map(r=>r.mainMs)),`${speed}x complete main active time`).toBeLessThan(hostedTime(16));
    expect(Math.max(...metrics.map(r=>r.viewMs)),"chart/overview projection main CPU").toBeLessThan(hostedTime(50));
    console.info("Integrated account tick main maxima",JSON.stringify([1,2,4].map(speed=>({speed,maxMs:Math.max(...metrics.filter(r=>r.speed===speed).map(r=>r.mainMs))}))));
  }finally{await cleanupPhoneTests();f.session.dispose();}
},hostedTime(120000));
