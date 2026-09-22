import { createCanvas } from '@napi-rs/canvas';
import { slotRect } from './schema-v1.mjs';
import { rigidBoneTransform } from './rigid-geometry.mjs';
import { drawStandardSlot } from './standard-character-renderer.mjs';
import { leftEdge, rightEdge } from '../layered-pilot/gray-overshirt-v2/lower-render-v2.mjs';

const get = (object, path) => path.split('.').reduce((value, key) => value?.[key], object);
function transverseScale(matrix,start,end,widthScale){
  if(widthScale===1)return matrix;
  const length=Math.hypot(end.x-start.x,end.y-start.y)||1,nx=-(end.y-start.y)/length,ny=(end.x-start.x)/length,extra=widthScale-1;
  const aa=1+extra*nx*nx,ac=extra*nx*ny,dd=1+extra*ny*ny;
  const a=matrix.a*aa+matrix.c*ac,b=matrix.b*aa+matrix.d*ac,c=matrix.a*ac+matrix.c*dd,d=matrix.b*ac+matrix.d*dd;
  return{a,b,c,d,e:matrix.e+(matrix.a-a)*start.x+(matrix.c-c)*start.y,f:matrix.f+(matrix.b-b)*start.x+(matrix.d-d)*start.y};
}

// Opt-in for profiles whose continuous garment source has already been split
// into overlapping atlas thigh/shin slots. Each cloth segment follows one
// bone-axis registration with a fixed transverse width, rather than a
// frame-dependent sheared four-corner texture warp.
export function drawRigidProfileLowerLeg(context, loaded, view, side, joints, options = {}) {
  if (view !== 'east' && view !== 'west') throw Error(`Rigid profile lower requires East/West, got ${view}`);
  const leg = loaded.lower?.[view]?.[side];
  if (!leg?.thigh || !leg?.shin || !leg?.shoe) throw Error(`missing packed lower slots for ${view}/${side}`);
  const { thigh, shin, shoe } = leg, scale = options.textureScale ?? .48, widthScale=options.transverseWidthScale??1;
  const visualAnkle = { x: joints.ankle.x, y: joints.soleContact.y - shoe.rect.height * scale };
  // Use the canonical ankle for cloth length. The boot is drawn afterward and
  // hides the excess cloth inside its cuff, rather than shortening the shin.
  const trouserAnkle = { x: joints.ankle.x, y: joints.ankle.y + 1.5 };
  const thighEnd = joints.knee;
  const shinStart = joints.knee;
  const thighMatrix = transverseScale(rigidBoneTransform({ sourceStart: thigh.landmarks.joint.hip, sourceEnd: thigh.landmarks.joint.knee, targetStart: joints.hip, targetEnd: thighEnd }),thigh.landmarks.joint.hip,thigh.landmarks.joint.knee,widthScale);
  const shinMatrix = transverseScale(rigidBoneTransform({ sourceStart: shin.landmarks.joint.knee, sourceEnd: shin.landmarks.joint.ankle, targetStart: shinStart, targetEnd: trouserAnkle }),shin.landmarks.joint.knee,shin.landmarks.joint.ankle,widthScale);
  const cloth = createCanvas(160, 320), clothContext = cloth.getContext('2d'),pantWidth=options.pantWidth??20;
  for(const [part,matrix,start,end] of [[thigh,thighMatrix,joints.hip,thighEnd],[shin,shinMatrix,shinStart,trouserAnkle]]){
    const segment=createCanvas(160,320),segmentContext=segment.getContext('2d');
    drawStandardSlot(segmentContext,part.image,part.id,matrix);
    // Clip each source fragment independently so a square crop corner cannot
    // protrude at the knee; the expanded donor overlap seals both round caps.
    segmentContext.globalCompositeOperation='destination-in';
    segmentContext.strokeStyle='#fff';segmentContext.lineWidth=pantWidth;segmentContext.lineCap='round';
    segmentContext.beginPath();segmentContext.moveTo(start.x,start.y);segmentContext.lineTo(end.x,end.y);segmentContext.stroke();
    clothContext.drawImage(segment,0,0);
  }
  context.drawImage(cloth, 0, 0);
  const center = get(shoe.landmarks, 'reference.center');
  const base = visualAnkle.x - (center.x - (shoe.rect.x - slotRect(shoe.id).x)) * scale;
  const width = shoe.rect.width * scale, height = shoe.rect.height * scale;
  const cuffLeft = leftEdge(cloth, Math.floor(trouserAnkle.y - 10), Math.ceil(trouserAnkle.y));
  const cuffRight = rightEdge(cloth, Math.floor(trouserAnkle.y - 10), Math.ceil(trouserAnkle.y));
  const x = cuffLeft < 0 || cuffRight < 0 ? base : Math.max(cuffRight + 1 - width, Math.min(cuffLeft - 1, base));
  const y = visualAnkle.y;
  context.drawImage(shoe.image, shoe.rect.x, shoe.rect.y, shoe.rect.width, shoe.rect.height, x, y, width, height);
  return { joints, visualAnkle, trouserAnkle, scale, rigidSegments: true, transverseWidthScale:widthScale, matrices: { thigh: thighMatrix, shin: shinMatrix }, shoeDestination: { x, y, width, height }, soleY: y + height, cuffLeft, cuffRight, heelEdge: view === 'east' ? x : x + width };
}
