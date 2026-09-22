#!/usr/bin/env python3
"""Local, deterministic review packaging for the frozen N2 synthetic outputs."""
from __future__ import annotations

import argparse, hashlib, io, json, math, os, sys
from collections import Counter
from pathlib import Path
from typing import Any
from PIL import Image, ImageDraw, ImageFont

REPO = Path(__file__).resolve().parents[2]
PROOF = REPO / "Photos for Codex 2" / "Codex Patients or Staff or Other Characters 2" / "mixed-batch-2026-09-10" / "pose-process-proof-v1"
RUN = PROOF / "north-south-run-001"
N1 = PROOF / "north-south-v1"
REVIEW = RUN / "review-v1"
PARENT_PRED = PROOF / "parent-evidence" / "north-south-pure-resize-predictions.json"

PINS = {
    RUN / "request-body.json": "9424f0225dfb8463503f7985166f420d4285830644c50c8076d6362aec20df66",
    RUN / "attempt.json": "93033062c94cf63157f673fb509b716439b35d66f4f62cda0680a86e2f55444a",
    RUN / "receipt-response.txt": "6932b4d2423922b4090b21ce353bd430f2235351309b07ef77664760a3bcf948",
    RUN / "receipt.json": "a1f493dca09fccfc0614ec1d564b8fcd1a197df84054d73e395dbc7f8a915b1e",
    RUN / "actual-history.json": "99a2fbade8c596152b8f09b743b286a0f253ca84e05ad3223db5f18bdb288ed4",
    RUN / "ledger-final.json": "e4ddf22b34dacf9f391a0e59da2729fe0c378906c6dc628931c2b7165025e3aa",
    RUN / "audit.json": "6aae2dab17a93e7ef57834d022b9c45f322e5f3fc9460226db8d85becaf180c3",
    N1 / "prepared-graph.json": "a1c65208d2f6264786d6ad0fa53ad963ad19a91309efe0936b1eaa0d5e602e4a",
    N1 / "manifest.json": "77ba0f98702a2498d08bdccd10e56884b8709da0b0e0332a87c10e81312a415b",
    N1 / "transform-receipts.json": "96d9f0f3cc980b44ca57dbced358f82cf0fce7501a66e41e9b199950070b312f",
    PARENT_PRED: "9aa4a2f8649d36d8420008fcb0f8ca1fd37ae0a49175d4f36546e537a8eeb506",
}
PROMPT_ID = "48396b34-2fb8-400d-a39f-e096ac055fe3"
CLIENT_ID = "gamifysurgery-north-south-run-001"
PLATE = (90, 300, 390, 700)
PLATE_REQUESTED = (101, 112, 128)
REQUEST_TO_OBSERVED = {
    (45,119,199):(44,118,199), (199,95,45):(199,95,44),
    (242,221,61):(242,221,60), (255,255,255):(254,254,254),
}

def sha(path: Path) -> str:
    h=hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda:f.read(1<<20),b""): h.update(block)
    return h.hexdigest()

def load_json(path: Path) -> Any:
    with path.open("rb") as f: return json.load(f)

def write_x(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("xb") as f: f.write(data); f.flush(); os.fsync(f.fileno())

def json_bytes(value: Any) -> bytes:
    return (json.dumps(value, indent=2, sort_keys=True, allow_nan=False)+"\n").encode()

def rgb_int(value: int) -> tuple[int,int,int]:
    return ((value>>16)&255,(value>>8)&255,value&255)

def bbox_alpha(im: Image.Image) -> list[int] | None:
    box=im.getchannel("A").getbbox(); return list(box) if box else None

def checker(im: Image.Image, cell=16, bg1=(48,53,61,255), bg2=(66,72,82,255)) -> Image.Image:
    out=Image.new("RGBA",im.size,bg1); d=ImageDraw.Draw(out)
    for y in range(0,im.height,cell):
        for x in range(0,im.width,cell):
            if (x//cell+y//cell)%2: d.rectangle((x,y,min(x+cell-1,im.width-1),min(y+cell-1,im.height-1)),fill=bg2)
    out.alpha_composite(im); return out.convert("RGB")

def font(size=18,bold=False):
    names=["C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf","C:/Windows/Fonts/arial.ttf"]
    for p in names:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

def build_source(piece: dict) -> Image.Image:
    w=piece["source"]["dimensions"]["width"]; h=piece["source"]["dimensions"]["height"]
    im=Image.new("RGBA",(w,h),(0,0,0,0)); px=im.load()
    for primitive in piece["source"]["primitives"]:
        color=rgb_int(primitive["color"])+(255,)
        for y in range(primitive["y"],primitive["y"]+primitive["height"]):
            for x in range(primitive["x"],primitive["x"]+primitive["width"]): px[x,y]=color
    return im

def resize_expected(src: Image.Image, out_h: int) -> Image.Image:
    out=Image.new("RGBA",(src.width,out_h),(0,0,0,0)); a=src.load(); b=out.load()
    for y in range(out_h):
        sy=math.floor((y+0.5)*src.height/out_h)
        for x in range(src.width): b[x,y]=a[x,sy]
    return out

def weighted_centroid(im: Image.Image, region: tuple[int,int,int,int], selector=None) -> tuple[float,float,float]:
    p=im.load(); sx=sy=sw=0.0
    for y in range(region[1],region[3]):
        for x in range(region[0],region[2]):
            rgba=p[x,y]; w=rgba[3]
            if w and (selector is None or selector(rgba)): sw+=w; sx+=(x+0.5)*w; sy+=(y+0.5)*w
    return (sx/sw,sy/sw,sw/255) if sw else (math.nan,math.nan,0)

def principal_axis(im: Image.Image, region: tuple[int,int,int,int]) -> dict:
    cx,cy,count=weighted_centroid(im,region); p=im.load(); xx=yy=xy=sw=0.0
    for y in range(region[1],region[3]):
        for x in range(region[0],region[2]):
            w=p[x,y][3]
            if w: dx=x+0.5-cx;dy=y+0.5-cy;sw+=w;xx+=w*dx*dx;yy+=w*dy*dy;xy+=w*dx*dy
    xx/=sw;yy/=sw;xy/=sw
    theta=.5*math.atan2(2*xy,xx-yy); vx,vy=math.cos(theta),math.sin(theta)
    if vy<0:vx,vy=-vx,-vy
    return {"centroid":[cx,cy],"alphaWeightedPixels":count,"axisScreenAngleFromDownDegrees":math.degrees(math.atan2(vx,vy)),"covariance":{"xx":xx,"xy":xy,"yy":yy}}

def rotate_point(x,y,cx,cy,degrees):
    # Installed AddLayer positive rotation maps the downward rest vector leftward.
    a=math.radians(degrees);dx=x-cx;dy=y-cy
    return (cx+math.cos(a)*dx-math.sin(a)*dy,cy+math.sin(a)*dx+math.cos(a)*dy)

def point_poly(x,y,poly):
    inside=False;j=len(poly)-1
    for i in range(len(poly)):
        xi,yi=poly[i]["x"],poly[i]["y"];xj,yj=poly[j]["x"],poly[j]["y"]
        if ((yi>y)!=(yj>y)) and x < (xj-xi)*(y-yi)/(yj-yi)+xi: inside=not inside
        j=i
    return inside

def edge_distance(x,y,poly):
    best=1e9
    for i in range(len(poly)):
        x1,y1=poly[i]["x"],poly[i]["y"];x2,y2=poly[(i+1)%len(poly)]["x"],poly[(i+1)%len(poly)]["y"]
        dx=x2-x1;dy=y2-y1;t=max(0,min(1,((x-x1)*dx+(y-y1)*dy)/(dx*dx+dy*dy)))
        best=min(best,math.hypot(x-(x1+t*dx),y-(y1+t*dy)))
    return best

def opaque_color_counts(im: Image.Image) -> dict:
    c=Counter()
    for r,g,b,a in im.getdata():
        if a==255:c[f"{r:02x}{g:02x}{b:02x}"]+=1
    return dict(sorted(c.items()))

def authenticate():
    for path,expected in PINS.items():
        if not path.is_file() or sha(path)!=expected: raise RuntimeError(f"pin mismatch: {path}")
    request=load_json(RUN/"request-body.json");history=load_json(RUN/"actual-history.json");audit=load_json(RUN/"audit.json");receipt=load_json(RUN/"receipt.json");prepared=load_json(N1/"prepared-graph.json")
    record=history[PROMPT_ID]
    if receipt["promptId"]!=PROMPT_ID or request["client_id"]!=CLIENT_ID or record["prompt"][1]!=PROMPT_ID or record["prompt"][3]["client_id"]!=CLIENT_ID: raise RuntimeError("own receipt/client mismatch")
    if request["prompt"]!=prepared["graph"] or record["prompt"][2]!=prepared["graph"]: raise RuntimeError("request/history graph mismatch")
    pairs={}
    for node_id,entry in audit["download"]["outputs"].items():
        path=RUN/Path(entry["localName"].replace("\\",os.sep));
        if sha(path)!=entry["sha256"]: raise RuntimeError(f"output hash mismatch {node_id}")
        with Image.open(path) as im:
            im.load()
            if im.size!=(448,1024) or im.format!="PNG": raise RuntimeError(f"bad PNG {node_id}")
        pairs.setdefault(entry["canvas"],{})[entry["role"]]=(path,entry)
    if len(pairs)!=18 or any(set(v)!={"composite","transparency-mask-as-image"} for v in pairs.values()): raise RuntimeError("output pair inventory mismatch")
    return request,record,audit,prepared,pairs

def analyze():
    request,record,audit,prepared,pairs=authenticate(); receipts=load_json(N1/"transform-receipts.json")["receipts"]
    receipt_by={r["canvas"]:r for r in receipts}; kits=[]
    for view in ("north","south"):kits+=load_json(N1/"kits"/f"{view}.json")["pieces"]
    piece_by_hash={p["sourceDefinitionHash"]:p for p in kits}
    canvases={}; sum_hist=Counter(); all_dims=True; output_hashes=[]
    images={}
    for canvas,roles in sorted(pairs.items()):
        comp_source=Image.open(roles["composite"][0]);comp_source.load();mask_source=Image.open(roles["transparency-mask-as-image"][0]);mask_source.load();comp_mode=comp_source.mode;mask_mode=mask_source.mode
        comp=comp_source.convert("RGBA");mask=mask_source.convert("RGBA");images[canvas]=comp
        mp=mask.load();cp=comp.load();relation=Counter();gray=True;mask_alpha=Counter();fractional_values=Counter()
        for y in range(1024):
            for x in range(448):
                r,g,b,a=cp[x,y];mr,mg,mb,ma=mp[x,y];gray &= mr==mg==mb;relation[a+mr]+=1;mask_alpha[ma]+=1
                if 0<a<255:fractional_values[a]+=1
        sum_hist.update(relation)
        canvases[canvas]={"compositeSha256":roles["composite"][1]["sha256"],"maskSha256":roles["transparency-mask-as-image"][1]["sha256"],"dimensions":[448,1024],"sourceModes":{"composite":comp_mode,"transparencyMask":mask_mode},"alphaBbox":bbox_alpha(comp),"fractionalAlphaPixels":sum(fractional_values.values()),"fractionalAlphaRange":[min(fractional_values),max(fractional_values)] if fractional_values else None,"fractionalAlphaValueCounts":{str(k):v for k,v in sorted(fractional_values.items())},"maskRgbGrayscale":bool(gray),"maskAlphaCounts":{str(k):v for k,v in sorted(mask_alpha.items())},"alphaPlusMaskRedCounts":{str(k):v for k,v in sorted(relation.items())}}
        output_hashes += [roles["composite"][1]["sha256"],roles["transparency-mask-as-image"][1]["sha256"]]

    mechanics=images["mechanics-controls"]; mech_receipt=receipt_by["mechanics-controls"]
    control_ids=["mechanics-vertical-no-resize","mechanics-resize-only-min","mechanics-resize-only-max"]
    pure=[]
    for cid in control_ids:
        t=next(x for x in mech_receipt["transforms"] if x["id"]==cid);src=build_source(piece_by_hash[t["sourceDefinitionHash"]]);expected=resize_expected(src,t["transform"]["height"]);x=t["transform"]["quantizedPlacement"]["x"];y=t["transform"]["quantizedPlacement"]["y"]
        actual=mechanics.crop((x,y,x+expected.width,y+expected.height)); ep=expected.load();ap=actual.load();alpha_mis=opaque_rgb_mis=hidden_rgb_mis=0;deltas=Counter()
        for yy in range(expected.height):
            for xx in range(expected.width):
                er,eg,eb,ea=ep[xx,yy];ar,ag,ab,aa=ap[xx,yy]
                alpha_mis+=ea!=aa
                if ea: opaque_rgb_mis+=(er,eg,eb)!=(ar,ag,ab);deltas[(ar-er,ag-eg,ab-eb)]+=1
                else:hidden_rgb_mis+=(er,eg,eb)!=(ar,ag,ab)
        eb=bbox_alpha(expected);eg=[eb[0]+x,eb[1]+y,eb[2]+x,eb[3]+y] if eb else None
        pure.append({"id":cid,"dimensions":[expected.width,expected.height],"placement":[x,y],"pixelComparisons":expected.width*expected.height,"alphaMismatches":alpha_mis,"opaqueRgbMismatchesAgainstLiteralRequested":opaque_rgb_mis,"hiddenRgbMismatches":hidden_rgb_mis,"expectedAlphaBboxGlobal":eg,"actualLocalAlphaBbox":bbox_alpha(actual),"expectedLocalAlphaBbox":eb,"expectedOpaqueColorCounts":opaque_color_counts(expected),"actualOpaqueColorCounts":opaque_color_counts(actual),"opaqueRgbDeltaCounts":{str(k):v for k,v in sorted(deltas.items())}})

    regions={"mechanics-min-span":(88,700,135,825),"mechanics-max-span":(160,700,220,905),"mechanics-nonzero-offcenter":(225,700,310,885),"mechanics-signed-clip":(0,700,25,960)}
    rotations=[]
    for cid,region in regions.items():
        t=next(x for x in mech_receipt["transforms"] if x["id"]==cid);piece=piece_by_hash[t["sourceDefinitionHash"]];src=resize_expected(build_source(piece),t["transform"]["height"]);tr=t["transform"];cx=tr["quantizedPlacement"]["x"]+src.width/2;cy=tr["quantizedPlacement"]["y"]+src.height/2
        local=principal_axis(src,(0,0,src.width,src.height));pred=rotate_point(local["centroid"][0]+tr["quantizedPlacement"]["x"],local["centroid"][1]+tr["quantizedPlacement"]["y"],cx,cy,tr["rotationDegrees"]);actual=principal_axis(mechanics,region)
        marker_results={}
        for name,sel in {"whiteAlong":lambda q:q[0]>240 and q[1]>240 and q[2]>240,"yellowAcross":lambda q:q[0]>220 and q[1]>190 and q[2]<100}.items():
            lc=weighted_centroid(src,(0,0,src.width,src.height),sel);pc=rotate_point(lc[0]+tr["quantizedPlacement"]["x"],lc[1]+tr["quantizedPlacement"]["y"],cx,cy,tr["rotationDegrees"]);ac=weighted_centroid(mechanics,region,sel)
            marker_results[name]={"predictedCentroid":[pc[0],pc[1]],"actualCentroid":[ac[0],ac[1]] if ac[2] else None,"signedResidual":[ac[0]-pc[0],ac[1]-pc[1]] if ac[2] else None,"actualWeightedPixels":ac[2]}
        clipped=cid=="mechanics-signed-clip";expected_axis=local["axisScreenAngleFromDownDegrees"]-tr["rotationDegrees"]
        rotations.append({"id":cid,"declaredRotationDegrees":tr["rotationDegrees"],"discreteResizedSourceAxisScreenAngleFromDownDegrees":local["axisScreenAngleFromDownDegrees"],"expectedAxisScreenAngleFromDownDegrees":None if clipped else expected_axis,"actual":actual,"signedActualMinusExpectedAxisDegrees":None if clipped else actual["axisScreenAngleFromDownDegrees"]-expected_axis,"predictedDiscreteResizedCentroid":[pred[0],pred[1]],"signedActualMinusExpectedCentroid":None if clipped else [actual["centroid"][0]-pred[0],actual["centroid"][1]-pred[1]],"alphaMassPixelEquivalents":{"discreteResizedSource":local["alphaWeightedPixels"],"actual":actual["alphaWeightedPixels"],"signedActualMinusSource":actual["alphaWeightedPixels"]-local["alphaWeightedPixels"]},"continuousSourceBoundsFloatBbox":t["analyticalExpectedGeometry"]["sourceBoundsFloatBbox"],"actualAlphaBboxInIsolationRegion":bbox_alpha(mechanics.crop(region)),"isolationRegion":list(region),"clippingNote":"Full-source centroid/axis is not comparable after left clipping; bbox/count evidence only." if clipped else None,"markerCentroidMethod":"Semantic color selection; reported separately from whole-alpha moment residuals.","markers":marker_results})

    plate_observed=mechanics.getpixel((100,400))[:3]
    depth=[]
    baselines=sorted([r for r in receipts if r["canvas"].startswith("synthetic-binding-baseline-")],key=lambda r:r["canvas"])
    registration_case=next(r for r in receipts if r["canvas"]=="synthetic-north-south-registration-north-phase01")
    for r in baselines+[registration_case]:
        im=images[r["canvas"]];pix=im.load();groups={}
        for group in ("far-leg","far-arm","near-leg","near-arm"):
            polys=[];side=None
            for t in r["transforms"]:
                if t["layer"]["group"]==group:
                    side="left" if "-left-" in t["id"] else "right"
                    polys += [q["polygon"] for q in t["analyticalExpectedGeometry"]["opaquePrimitivePolygons"] if q["id"]=="stem"]
            requested=(45,119,199) if side=="left" else (199,95,45);observed=REQUEST_TO_OBSERVED[requested]
            counts=Counter()
            xs=[p["x"] for poly in polys for p in poly];ys=[p["y"] for poly in polys for p in poly]
            for y in range(max(0,math.floor(min(ys))-2),min(1024,math.ceil(max(ys))+2)):
                for x in range(max(0,math.floor(min(xs))-2),min(448,math.ceil(max(xs))+2)):
                    cx=x+.5;cy=y+.5
                    if not any(point_poly(cx,cy,p) for p in polys):continue
                    inside=PLATE[0]<=cx<PLATE[2] and PLATE[1]<=cy<PLATE[3];rgb=pix[x,y][:3]
                    near_piece=all(abs(rgb[i]-requested[i])<=1 for i in range(3))
                    stable=any(point_poly(cx,cy,p) and edge_distance(cx,cy,p)>=1.25 for p in polys)
                    if inside and rgb==plate_observed:counts["plateVisibleInsideObservable"]+=1;counts["plateVisibleInsideStable"]+=int(stable)
                    if inside and near_piece:counts["pieceVisibleInsideObservable"]+=1;counts["pieceVisibleInsideStable"]+=int(stable)
                    if not inside and near_piece:counts["pieceVisibleOutsideObservable"]+=1;counts["pieceVisibleOutsideStable"]+=int(stable)
            expected_relation="occluded-by-plate" if group.startswith("far") else "visible-over-plate"
            demonstrated=counts["plateVisibleInsideObservable"]>0 if group.startswith("far") else counts["pieceVisibleInsideObservable"]>0
            groups[group]={"anatomicalSide":side,"expectedRelation":expected_relation,"stableInteriorCounts":dict(counts),"relationDemonstrated":demonstrated}
        depth.append({"canvas":r["canvas"],"phaseId":r["selection"]["phaseId"],"view":r["selection"]["view"],"visibility":r["visibility"],"groups":groups,"allFourRelationsDemonstrated":all(v["relationDemonstrated"] for v in groups.values())})

    baseline_hashes=[canvases[r["canvas"]]["compositeSha256"] for r in baselines]
    result={"schemaVersion":1,"state":"local-observed-synthetic-review-root-acceptance-pending","authentication":{"promptId":PROMPT_ID,"clientId":CLIENT_ID,"historyGraphEqualsRequestAndPinned":True,"originalPins":{str(p.relative_to(REPO)).replace('\\','/'):h for p,h in PINS.items()},"outputCount":36,"decodedPngCount":36,"totalOutputBytes":audit["download"]["outputs"] and sum(x["byteLength"] for x in audit["download"]["outputs"].values())},"actualMetrics":{"serverExecutionMs":audit["execution"]["durationMs"],"downloadMs":audit["download"]["durationMs"],"queueMs":None,"operatorMs":None,"savings":None},"canvasAnalysis":canvases,"aggregateMaskRelation":{"alphaPlusMaskRedCounts":{str(k):v for k,v in sorted(sum_hist.items())},"only254Or255":set(sum_hist)<= {254,255},"fractionalAlphaPixels":sum(c["fractionalAlphaPixels"] for c in canvases.values()),"fractionalAlphaRange":[min(c["fractionalAlphaRange"][0] for c in canvases.values() if c["fractionalAlphaRange"]),max(c["fractionalAlphaRange"][1] for c in canvases.values() if c["fractionalAlphaRange"])]},"pureResizeControls":pure,"rotationAndClippingControls":rotations,"depthCoverage":{"plateRequestedRgb":list(PLATE_REQUESTED),"plateObservedRgb":list(plate_observed),"cases":depth,"baselineCaseCount":16,"registrationCaseCount":1,"all17CasesAllFourRelationsDemonstrated":all(x["allFourRelationsDemonstrated"] for x in depth)},"phaseChecks":{"baselineCanvases":len(baselines),"views":sorted(set(x["view"] for x in depth)),"phaseIdsByView":{v:[x["phaseId"] for x in depth if x["view"]==v and x["canvas"].startswith("synthetic-binding-baseline-")] for v in ("north","south")},"uniqueBaselineCompositeHashes":len(set(baseline_hashes)),"changedRegistrationSelection":registration_case["selection"],"changedRegistrationNativeMapping":registration_case["registration"],"changedRegistrationDiffersFromBaselineNorth01":canvases["synthetic-north-south-registration-north-phase01"]["compositeSha256"]!=canvases["synthetic-binding-baseline-north-phase01"]["compositeSha256"]},"findings":{"nearestExactAlphaMapping":"All three isolated controls are compared to floor((dy+0.5)*192/Hq) with no fitting.","rgbQuantization":"Opaque RGB differs from literal requested procedural colors by at most one channel level, including the no-resize control; responsible stage is not isolated.","mask":"Mask is grayscale and alpha+mask-red is measured as 254 or 255, not asserted as exact 255 inversion.","scopeLimit":"Synthetic rectangles establish installed resize/rotation/compositor behavior only. Fractional-alpha clothed donors, hidden surfaces, garment seams, and production art remain untested."}}
    return result,images,receipt_by

def label(draw,xy,text,size=17,bold=False,fill=(236,240,246)):
    draw.text(xy,text,font=font(size,bold),fill=fill)

def overview(images):
    names=sorted(images);tile=(112,256);cell=(132,300);out=Image.new("RGB",(cell[0]*6,cell[1]*3),(25,29,35));d=ImageDraw.Draw(out)
    for i,name in enumerate(names):
        x=(i%6)*cell[0]+10;y=(i//6)*cell[1]+34
        thumb=checker(images[name]).resize(tile,Image.Resampling.NEAREST);out.paste(thumb,(x,y));label(d,(x,y-28),name.replace("synthetic-binding-baseline-","").replace("synthetic-north-south-registration-","reg-")[:22],13,True)
    return out

def mechanics_board(images,receipt_by):
    src=images["mechanics-controls"];crop=src.crop((0,280,448,920));actual=checker(crop);overlay=actual.copy();d=ImageDraw.Draw(overlay)
    r=receipt_by["mechanics-controls"]
    for t in r["transforms"]:
        for q in t["analyticalExpectedGeometry"]["opaquePrimitivePolygons"]:
            pts=[(p["x"],p["y"]-280) for p in q["polygon"]];d.line(pts+[pts[0]],fill=(255,55,230),width=1)
    out=Image.new("RGB",(936,1130),(25,29,35));od=ImageDraw.Draw(out);label(od,(20,12),"Mechanics: actual unchanged pixels | analytical polygon overlay",23,True);out.paste(actual,(20,55));out.paste(overlay,(468,55));
    zoom=checker(src.crop((0,690,448,900))).resize((896,420),Image.Resampling.NEAREST);out.paste(zoom,(20,715));label(od,(20,680),"2x nearest-neighbor zoom: controls, including signed clip at x=0",18,True);return out

def cycles(images,view):
    names=[f"synthetic-binding-baseline-{view}-phase{i:02d}" for i in range(1,9)]
    return [checker(images[n]).resize((224,512),Image.Resampling.NEAREST) for n in names]

def build():
    if REVIEW.exists() and any(p.is_file() for p in REVIEW.iterdir()): raise RuntimeError(f"exclusive final review files already exist: {REVIEW}")
    analysis,images,receipt_by=analyze(); REVIEW.mkdir(parents=False,exist_ok=True)
    write_x(REVIEW/"analysis.json",json_bytes(analysis))
    buffers=[]
    for name,im in [("overview-18-canvases.png",overview(images)),("mechanics-detail.png",mechanics_board(images,receipt_by))]:
        b=io.BytesIO();im.save(b,"PNG");write_x(REVIEW/name,b.getvalue());buffers.append(name)
    for view in ("north","south"):
        frames=cycles(images,view);b=io.BytesIO();frames[0].save(b,"GIF",save_all=True,append_images=frames[1:],duration=180,loop=0,disposal=2);write_x(REVIEW/f"{view}-8-phase.gif",b.getvalue());buffers.append(f"{view}-8-phase.gif")
    readme=f"""# North/south synthetic pixel review v1

This is a local review package for prompt `{PROMPT_ID}`. All 36 original PNGs authenticated and decoded as 448x1024; this directory contains previews and measurements only. The source outputs remain unchanged.

The three isolated controls reproduce the declared nearest-exact **alpha** row map with zero fitting. Opaque source colors do not remain byte-exact: even the no-resize control changes blue `(45,119,199)` to `(44,118,199)`, yellow `(242,221,61)` to `(242,221,60)`, and white to `(254,254,254)`; orange similarly changes one channel. The responsible pipeline stage is not isolated by this graph. Hidden transparent RGB matches the reconstructed source controls.

All 18 masks are grayscale. Across all canvases, alpha plus mask red is only 254 or 255; rotated edges contain fractional alpha. The depth report samples stable polygon interiors and separately records plate-hidden far groups and plate-overlaid near groups for every baseline phase and the changed-registration case.

`overview-18-canvases.png` shows all composites at one uniform 1/4 nearest-neighbor scale. `mechanics-detail.png` contains unchanged actual pixels, a separate analytical polygon overlay, and a 2x control zoom. The GIFs use the declared 180 ms frame duration.

These results cover synthetic procedural rectangles and the installed ImageScale/AddLayer/ImageCompositor path. They do not validate clothed fractional-alpha donors, hidden anatomy, garment seams, production sprites, or art tolerances. Queue/operator time and savings remain unmeasured.
"""
    write_x(REVIEW/"README.md",readme.encode())
    report={"schemaVersion":1,"state":"observed-local-review-built","checks":{"authenticatedOriginalEvidence":True,"decodedPngs":36,"dimensions448x1024":True,"compositeSourceModesRgba":all(x["sourceModes"]["composite"]=="RGBA" for x in analysis["canvasAnalysis"].values()),"maskSourceModesRgb":all(x["sourceModes"]["transparencyMask"]=="RGB" for x in analysis["canvasAnalysis"].values()),"pureResizeAlphaMismatches":sum(x["alphaMismatches"] for x in analysis["pureResizeControls"]),"allMasksGrayscale":all(x["maskRgbGrayscale"] for x in analysis["canvasAnalysis"].values()),"maskRelationOnly254Or255":analysis["aggregateMaskRelation"]["only254Or255"],"all17DepthRelationsDemonstrated":analysis["depthCoverage"]["all17CasesAllFourRelationsDemonstrated"],"uniqueBaselineCompositeHashes":analysis["phaseChecks"]["uniqueBaselineCompositeHashes"]},"claims":{"rootTechnicalAcceptance":False,"privateArtReviewed":False,"artToleranceDefined":False,"savingsMeasured":False}}
    write_x(REVIEW/"validation-report.json",json_bytes(report))
    files=sorted([p for p in REVIEW.iterdir() if p.is_file() and p.name!="checksums.json"])
    checks={"schemaVersion":1,"excludedSelf":"checksums.json","entries":[{"name":p.name,"bytes":p.stat().st_size,"sha256":sha(p)} for p in files]}
    write_x(REVIEW/"checksums.json",json_bytes(checks));return report

def verify():
    authenticate()
    checks=load_json(REVIEW/"checksums.json");
    for e in checks["entries"]:
        p=REVIEW/e["name"]
        if sha(p)!=e["sha256"] or p.stat().st_size!=e["bytes"]: raise RuntimeError(f"review checksum mismatch {p}")
    analysis=load_json(REVIEW/"analysis.json");report=load_json(REVIEW/"validation-report.json")
    if report["checks"]["decodedPngs"]!=36 or analysis["authentication"]["outputCount"]!=36: raise RuntimeError("review inventory mismatch")
    return {"ok":True,"reviewEntries":len(checks["entries"]),"decodedOriginalPngs":36,"pureResizeAlphaMismatches":report["checks"]["pureResizeAlphaMismatches"],"all17DepthRelationsDemonstrated":report["checks"]["all17DepthRelationsDemonstrated"]}

if __name__=="__main__":
    ap=argparse.ArgumentParser();g=ap.add_mutually_exclusive_group(required=True);g.add_argument("--build",action="store_true");g.add_argument("--verify",action="store_true");args=ap.parse_args()
    result=build() if args.build else verify();print(json.dumps(result,indent=2,sort_keys=True))
