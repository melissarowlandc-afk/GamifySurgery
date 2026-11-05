import type { GameEvidenceCheckpoint,GameEvidenceDelta } from "@gamify-surgery/game-domain";
import { applyOperationalStatePatch,type OperationalStatePatch } from "./operationalStatePatch";
import { freezeOperationalValue as freeze } from "./operationalFreeze";

type Snapshot=GameEvidenceCheckpoint["snapshot"];
type RecordRow=GameEvidenceCheckpoint["evidence"]["records"][number];
type Log={parent:Log|null;added:readonly RecordRow[];length:number;flat?:readonly RecordRow[]};
const materialize=(log:Log):readonly RecordRow[]=>{
  if(log.flat)return log.flat;
  const chunks:(readonly RecordRow[])[]=[];let cursor:Log|null=log;
  while(cursor&&!cursor.flat){chunks.push(cursor.added);cursor=cursor.parent;}
  const rows:RecordRow[]=[...(cursor?.flat??[])];
  for(let i=chunks.length-1;i>=0;i--)for(const row of chunks[i]!)rows.push(row);
  log.flat=Object.freeze(rows);return log.flat;
};

/** Exact private recovery checkpoint. Snapshot changes use structural sharing;
 * archive records append in O(1) chunks. The full record array is materialized
 * only at an explicit recovery/export/checkpoint boundary, never on a tick.
 */
export class OperationalEvidenceMirror {
  private constructor(private readonly snapshot:Snapshot,private readonly descriptors:PropertyDescriptorMap,private readonly log:Log){}
  static create(checkpoint:GameEvidenceCheckpoint,owned=false):OperationalEvidenceMirror{
    const copy=freeze(owned?checkpoint:structuredClone(checkpoint)),records=copy.evidence.records;
    return new OperationalEvidenceMirror(copy.snapshot,Object.getOwnPropertyDescriptors(copy.evidence),{parent:null,added:records,length:records.length,flat:records});
  }
  advance(patch:OperationalStatePatch|undefined,delta:GameEvidenceDelta):OperationalEvidenceMirror{
    if(delta.fromSequence!==this.snapshot.head.sequence||delta.fromRecord!==this.log.length)throw Error("Recovery mirror prefix mismatch");
    const snapshot=applyOperationalStatePatch(this.snapshot,patch,true);
    if(!Array.isArray(snapshot.patches)||snapshot.campaignId!==this.snapshot.campaignId||snapshot.gameSchemaVersion!==this.snapshot.gameSchemaVersion||
      snapshot.version!==this.snapshot.version||snapshot.head.sequence!==delta.head.sequence||snapshot.head.transitionId!==delta.head.transitionId)
      throw Error("Recovery mirror snapshot mismatch");
    const records=freeze(delta.records);
    return new OperationalEvidenceMirror(snapshot,this.descriptors,{parent:this.log,added:records,length:this.log.length+records.length});
  }
  get checkpoint():GameEvidenceCheckpoint{
    const log=this.log,descriptors={...this.descriptors,records:{enumerable:true,configurable:false,get:()=>materialize(log)}};
    const evidence=Object.freeze(Object.defineProperties({},descriptors)) as GameEvidenceCheckpoint["evidence"];
    return Object.freeze({snapshot:this.snapshot,evidence});
  }
}
