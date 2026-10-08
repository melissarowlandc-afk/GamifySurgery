import { describe, expect, it } from "vitest";
import { getExteriorLawnPatchEnvelope, getExteriorLawnPatches, getExteriorPavingJoints, getFrontageCurbRuns, getFrontageEntryInset, getFrontageTileBuffer } from "./exteriorFrontage";
import { getWorldExteriorLayout } from "./worldExteriorLayout";

describe("Option B frontage surfaces", () => {
  it("retains a fractional curb band through an integer Canvas buffer without inflating or distorting art", () => {
    for (const tile of [1,7,20,24,27,37,41,100]) {
      const height = tile*0.12, width = tile*1.92, scale = height/16;
      const buffer = getFrontageTileBuffer(width,height,scale);
      expect(buffer.bufferHeight).toBeGreaterThanOrEqual(1);
      expect(buffer.bufferWidth).toBeGreaterThanOrEqual(1);
      expect(buffer.bufferHeight*buffer.displayScaleY).toBeCloseTo(height,12);
      expect(buffer.bufferWidth*buffer.displayScaleX).toBeCloseTo(width,12);
      expect(buffer.tileScaleX*buffer.displayScaleX).toBeCloseTo(scale,12);
      expect(buffer.tileScaleY*buffer.displayScaleY).toBeCloseTo(scale,12);
    }
  });
  it("uses two shallow rows with one half-slab stagger independent of render scale", () => {
    const joints = getExteriorPavingJoints(5);
    expect(joints.filter(joint => joint.y1 === joint.y2)).toEqual([{ x1: 0, y1: 0.44, x2: 5, y2: 0.44 }]);
    const rear = joints.filter(joint => joint.y1 === 0 && joint.x1 === joint.x2);
    const front = joints.filter(joint => joint.y1 === 0.44 && joint.x1 === joint.x2);
    expect(rear).toHaveLength(4);
    expect(front).toHaveLength(4);
    for (const [index,joint] of rear.entries()) {
      expect(joint.x1).toBeCloseTo((index+1)*1.2);
      expect(front[index]!.x1).toBeCloseTo(joint.x1-0.6);
    }
    for (const joint of joints) {
      expect(joint.y2).toBeLessThanOrEqual(0.88);
      expect(joint.x2).toBeLessThanOrEqual(5);
    }
    expect(getExteriorPavingJoints(0)).toEqual([]);
  });

  it("preserves the zero-setback walk, flush centered inset and 0.12-tile curb", () => {
    for (const tileSize of [1,7,20,24,27,37,41,100]) {
      const layout = getWorldExteriorLayout({ originX: 53, originY: -111, tileSize, gridColumns: 16, gridRows: 10 });
      const inset = getFrontageEntryInset(6, 10);
      expect(inset).toEqual({ x: 8, y: 10, width: 1, height: 0.5 });
      expect(layout.setbackHeight).toBe(0);
      expect(layout.sidewalkHeight).toBe(tileSize);
      expect(layout.sidewalkBottom-layout.curbTop).toBeCloseTo(tileSize*0.12);
      expect(layout.sidewalkTop+inset.height*tileSize).toBeLessThan(layout.actorSidewalkBaseline);
    }
  });

  it("uniform curb runs completely cover the site without an extra street strip", () => {
    const runs = getFrontageCurbRuns(16);
    expect(runs[0]?.x).toBe(0);
    let right = 0;
    for (const run of runs) {
      expect(run.x).toBeCloseTo(right);
      expect(run.width).toBeGreaterThan(0);
      expect(run.width).toBeLessThanOrEqual(1.92);
      right += run.width;
    }
    expect(right).toBeCloseTo(16);
    expect(runs[0]?.assetId).not.toBe(runs[1]?.assetId);
  });

  it("keeps calm broad patches fixed through redraw and site expansion, off paving", () => {
    const small = getExteriorLawnPatches(72,32);
    const expanded = getExteriorLawnPatches(96,64);
    expect(small).toEqual(getExteriorLawnPatches(72,32));
    expect(small.length).toBeGreaterThan(20);
    expect(new Set(small.map(patch => patch.key)).size).toBe(small.length);
    for (const patch of small) {
      expect(expanded.find(item => item.key === patch.key)).toEqual(patch);
      expect(patch.width).toBeGreaterThanOrEqual(4.3);
      expect(patch.alpha).toBeLessThanOrEqual(0.32);
      const bounds = getExteriorLawnPatchEnvelope(patch);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(72);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(32);
    }
    expect(Math.max(...small.map(patch => patch.width)) - Math.min(...small.map(patch => patch.width))).toBeGreaterThan(7);
    expect(new Set(small.map(patch => patch.rotation)).size).toBe(small.length);
    expect(new Set(small.map(patch => patch.assetId)).size).toBe(2);
    expect(new Set(small.map(patch => `${patch.flipX}:${patch.flipY}`)).size).toBe(4);
    expect(getExteriorLawnPatches(0,0)).toEqual([]);
  });
});
