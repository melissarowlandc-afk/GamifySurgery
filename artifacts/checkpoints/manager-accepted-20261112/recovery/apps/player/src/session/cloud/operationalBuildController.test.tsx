import { afterEach,expect,it } from "vitest";
import { cleanupPhoneTests } from "../../mobile/screenTestUtils";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { mountOperationalController } from "./operationalControllerTestSupport";

afterEach(cleanupPhoneTests);
it.each([false,true])("awaits actual build receipts and restores the exact prior state with grouped hallway=%s",async(grouped)=>{
  const f=await operationalSessionFixture();
  try {
    const controller=await mountOperationalController(f.session,f.scope.accountId);
    await controller.action(s=>s.enterBuildMode());await controller.action(s=>s.beginPlacement("room.hallway"));
    let cells:{x:number;y:number}[]|undefined;
    for(let y=0;y<40&&!cells;y++)for(let x=0;x<80&&!cells;x++){
      const proposed=grouped?[{x,y},{x:x+1,y}]:[{x,y}];
      if(controller.current().mobileBuildActions.previewHallway(proposed).buildCells.length===proposed.length)cells=proposed;
    }
    expect(cells).toBeDefined();
    const before=JSON.stringify(controller.current().state),rooms=controller.current().state.rooms.length;
    await controller.action(async s=>{
      const applied=grouped?await s.mobileBuildActions.commitHallway(cells!):await s.placeRoom(cells![0]!.x,cells![0]!.y);
      expect(applied).toBe(true);
    });
    expect(controller.current().state.rooms).toHaveLength(rooms+cells!.length);expect(controller.current().buildUndoCount).toBe(1);
    await controller.action(s=>s.undoBuildAction());
    expect(JSON.stringify(controller.current().state)).toBe(before);expect(controller.current().state).toBe(f.session.state);
    expect(controller.current().buildUndoCount).toBe(0);
  }finally{await cleanupPhoneTests();f.session.dispose();}
});
