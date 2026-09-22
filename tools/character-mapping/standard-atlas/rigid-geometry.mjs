function finitePoint(point, label) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new Error(`${label} must be a finite {x,y} point.`);
}

export function transformPoint(matrix, point) {
  finitePoint(point, 'point');
  return { x: matrix.a * point.x + matrix.c * point.y + matrix.e, y: matrix.b * point.x + matrix.d * point.y + matrix.f };
}

export function invertRigidTransform(matrix) {
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  if (!Number.isFinite(determinant) || Math.abs(determinant) < 1e-9) throw new Error('Rigid transform is singular.');
  return { a: matrix.d/determinant, b:-matrix.b/determinant, c:-matrix.c/determinant, d:matrix.a/determinant, e:(matrix.c*matrix.f-matrix.d*matrix.e)/determinant, f:(matrix.b*matrix.e-matrix.a*matrix.f)/determinant };
}

export function rigidBoneTransform({ sourceStart, sourceEnd, targetStart, targetEnd }) {
  finitePoint(sourceStart,'sourceStart'); finitePoint(sourceEnd,'sourceEnd'); finitePoint(targetStart,'targetStart'); finitePoint(targetEnd,'targetEnd');
  const sx=sourceEnd.x-sourceStart.x,sy=sourceEnd.y-sourceStart.y,tx=targetEnd.x-targetStart.x,ty=targetEnd.y-targetStart.y,sourceLength=Math.hypot(sx,sy),targetLength=Math.hypot(tx,ty);
  if (sourceLength < 1e-6 || targetLength < 1e-6) throw new Error('Rigid bone transform requires non-zero source and target lengths.');
  const scale=targetLength/sourceLength,cos=(sx*tx+sy*ty)/(sourceLength*targetLength),sin=(sx*ty-sy*tx)/(sourceLength*targetLength),matrix={a:scale*cos,b:scale*sin,c:-scale*sin,d:scale*cos,e:0,f:0,scale,rotationRadians:Math.atan2(sin,cos)};
  matrix.e=targetStart.x-matrix.a*sourceStart.x-matrix.c*sourceStart.y;matrix.f=targetStart.y-matrix.b*sourceStart.x-matrix.d*sourceStart.y;
  return Object.freeze(matrix);
}

export function solveTwoBoneIK({ shoulder, target, upperLength, forearmLength, bendSign = 1 }) {
  finitePoint(shoulder,'shoulder'); finitePoint(target,'target');
  if (!(upperLength>0) || !(forearmLength>0) || ![1,-1].includes(bendSign)) throw new Error('IK requires positive bone lengths and bendSign 1 or -1.');
  const dx=target.x-shoulder.x,dy=target.y-shoulder.y,distance=Math.hypot(dx,dy),minimum=Math.abs(upperLength-forearmLength)+1e-6,maximum=upperLength+forearmLength-1e-6,reach=Math.min(maximum,Math.max(minimum,distance||minimum)),ux=distance?dx/distance:1,uy=distance?dy/distance:0,wrist={x:shoulder.x+ux*reach,y:shoulder.y+uy*reach},along=(upperLength**2-forearmLength**2+reach**2)/(2*reach),height=Math.sqrt(Math.max(0,upperLength**2-along**2)),elbow={x:shoulder.x+ux*along-uy*height*bendSign,y:shoulder.y+uy*along+ux*height*bendSign};
  return Object.freeze({ shoulder:{...shoulder}, elbow, wrist, requestedTarget:{...target}, targetClamped:Math.abs(reach-distance)>1e-6, residual:Math.hypot(wrist.x-target.x,wrist.y-target.y) });
}

export function solveStraightTwoBone({ shoulder, target, upperLength, forearmLength }) {
  finitePoint(shoulder,'shoulder'); finitePoint(target,'target');
  if (!(upperLength>0) || !(forearmLength>0)) throw new Error('Straight chain requires positive bone lengths.');
  const dx=target.x-shoulder.x,dy=target.y-shoulder.y,distance=Math.hypot(dx,dy);
  if(distance<1e-6)throw new Error('Straight chain requires a direction away from the shoulder.');
  const ux=dx/distance,uy=dy/distance,elbow={x:shoulder.x+ux*upperLength,y:shoulder.y+uy*upperLength},wrist={x:elbow.x+ux*forearmLength,y:elbow.y+uy*forearmLength};
  return Object.freeze({shoulder:{...shoulder},elbow,wrist,requestedTarget:{...target},targetClamped:false,residual:Math.hypot(wrist.x-target.x,wrist.y-target.y),straight:true});
}

export function signedMarkerSide(start,end,marker){finitePoint(start,'start');finitePoint(end,'end');finitePoint(marker,'marker');return (end.x-start.x)*(marker.y-start.y)-(end.y-start.y)*(marker.x-start.x);}
