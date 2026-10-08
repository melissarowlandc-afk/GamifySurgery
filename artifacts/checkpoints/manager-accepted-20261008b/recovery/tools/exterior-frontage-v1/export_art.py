"""Deterministic crop/resample exports; never paints or extracts concept art."""
from pathlib import Path
import hashlib
import json
import math
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[2]
PACK = Path(__file__).resolve().parent
RUNTIME = ROOT / "apps/player/public/art/environment/frontage-v2"
ASSETS = {
    "bed-west-v2": ((512, 160), (256, 160), "prop"),
    "bed-east-v2": ((512, 160), (256, 160), "prop"),
    "lawn-sage-v2": ((256, 128), (128, 64), "overlay"),
    "lawn-olive-v2": ((256, 128), (128, 64), "overlay"),
    "grass-low-v2": ((64, 32), (32, 28), "cluster"),
    "grass-clover-v2": ((64, 32), (32, 28), "cluster"),
    "grass-upright-v2": ((64, 32), (32, 28), "cluster"),
    "paving-v2": ((128, 128), (0, 0), "material"),
    "curb-a-v2": ((256, 16), (0, 0), "strip"),
    "curb-b-v2": ((256, 16), (0, 0), "strip"),
    "entry-inset-v2": ((128, 64), (0, 0), "decal"),
}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def export(name, spec):
    size, anchor, kind = spec
    source_path = PACK / "originals" / f"{name}.png"
    if not source_path.exists():
        return None
    source = Image.open(source_path).convert("RGBA")
    crop = (0, 0, *source.size)
    if kind in {"prop", "overlay", "cluster"}:
        # Ignore only <3.6% alpha peripheral decoding specks when measuring;
        # preserve every alpha value inside the resulting padded crop.
        bounds = source.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
        if bounds:
            crop = (max(0, bounds[0]-4), max(0, bounds[1]-4),
                    min(source.width, bounds[2]+4), min(source.height, bounds[3]+4))
    cut = source.crop(crop)
    if kind in {"prop", "overlay", "cluster"}:
        available = (size[0]-4, size[1]-4)
        scale = min(available[0]/cut.width, available[1]/cut.height)
        scaled = cut.resize((max(1, round(cut.width*scale)), max(1, round(cut.height*scale))), Image.Resampling.LANCZOS)
        export_image = Image.new("RGBA", size)
        bottom = anchor[1] if kind in {"prop", "cluster"} else size[1]//2 + scaled.height//2
        offset = ((size[0]-scaled.width)//2, max(2, bottom-scaled.height-2))
        export_image.paste(scaled, offset)
        operation = "alpha>8 bounds + 4 source px margin; uniform fit + 2 export px padding, alpha preserved"
    elif kind == "strip":
        # Pick the continuous opaque central band; generation's faint alpha
        # fringe/specks outside it are not part of the authored curb material.
        alpha = source.getchannel("A")
        opaque_rows = [y for y in range(source.height//3, source.height*2//3)
                       if sum(v >= 240 for v in alpha.crop((0,y,source.width,y+1)).get_flattened_data()) > source.width*0.94]
        if not opaque_rows:
            raise ValueError(f"No uninterrupted curb strip: {name}")
        top, bottom = min(opaque_rows), max(opaque_rows)+1
        strip_height = bottom-top
        strip_width = min(source.width, strip_height*16)
        left = (source.width-strip_width)//2
        crop = (left, top, left+strip_width, bottom)
        cut = source.crop(crop)
        # Fill target without changing aspect: central crop to 16:1.
        h = min(cut.height, cut.width/16)
        w = h*16
        cx, cy = cut.width/2, cut.height/2
        local_crop = (round(cx-w/2), round(cy-h/2), round(cx+w/2), round(cy+h/2))
        export_image = cut.crop(local_crop).resize(size, Image.Resampling.LANCZOS)
        operation = f"opaque central band crop {crop}; central aspect crop {local_crop}; uniform resample"
    else:
        ratio = size[0]/size[1]
        h = min(cut.height, cut.width/ratio)
        w = h*ratio
        left, top = round((cut.width-w)/2), round((cut.height-h)/2)
        crop = (left, top, left+round(w), top+round(h))
        export_image = source.crop(crop).resize(size, Image.Resampling.LANCZOS)
        operation = "central aspect-matched crop and uniform resample; alpha preserved"
    target = RUNTIME / f"{name}.png"
    export_image.save(target)
    prompt = PACK / "prompts" / f"{name}.txt"
    return {
        "id": f"frontage:{name}", "original": str(source_path.relative_to(ROOT)).replace("\\", "/"),
        "originalSize": list(source.size), "originalSha256": digest(source_path),
        "prompt": str(prompt.relative_to(ROOT)).replace("\\", "/"), "promptSha256": digest(prompt),
        "export": str(target.relative_to(ROOT)).replace("\\", "/"), "exportSha256": digest(target),
        "nativeSize": list(size), "anchor": list(anchor), "kind": kind,
        "crop": list(crop), "operation": operation,
        "alphaBounds": list(export_image.getchannel("A").getbbox() or (0,0,0,0)),
        "alphaRange": list(export_image.getchannel("A").getextrema()),
    }

def proof():
    # FacilityScene calculateLayout, measured reference canvas 920x325,
    # synthetic 64x40 site. This is an offline renderer-scale proof, not browser QA.
    wall = 242 / (622/4)
    full = math.floor(min(920/64, 325/(40+wall+1)))
    working = math.floor(min(920/14, 325/(6+wall+1)))
    zoom_sizes = [("24px pilot",24)] + [(f"{int(z*100)}%", math.floor(working*z+0.5) if z>1 else math.floor(full+(working-full)*(z-0.1)/0.9+0.5)) for z in [1.1,1,0.7,0.5,0.1]]
    sheet = Image.new("RGB", (1340, 840), "#d1cec2")
    draw = ImageDraw.Draw(sheet)
    draw.text((16,12), "Bed reduction proof: actual pixel rows + 6x nearest-neighbor inspection copies", fill="#262b23")
    draw.text((16,30), "Offline 920x325 / 64x40 fixture; browser QA must record live tileSize and DPR", fill="#262b23")
    for index,(label,tile) in enumerate(zoom_sizes):
        y=70+index*125
        draw.text((16,y), f"{label}: T={tile}; bed={1.55*tile:.2f} x {1.55*160/512*tile:.2f}px", fill="#262b23")
        for side,x in [("west",330),("east",850)]:
            path=RUNTIME/f"bed-{side}-v2.png"
            if not path.exists(): continue
            asset=Image.open(path)
            reduced=asset.resize((max(1,round(1.55*tile)),max(1,round(1.55*160/512*tile))),Image.Resampling.LANCZOS)
            sheet.paste(reduced,(x,y),reduced)
            enlarged=reduced.resize((reduced.width*6,reduced.height*6),Image.Resampling.NEAREST)
            sheet.paste(enlarged,(x+75,y),enlarged)
    sheet.save(PACK/"proof/bed-reduction.png")
    return {"canvas":[920,325],"syntheticSite":[64,40],"fullSiteTileSize":full,"workingTileSize":working,"samples":[{"label":label,"tileSize":tile} for label,tile in zoom_sizes],"browserQA":"pending manager"}

def contact_sheet():
    sheet = Image.new("RGB", (1200,1080), "#9ba187")
    draw = ImageDraw.Draw(sheet)
    for index,(name,(size,anchor,kind)) in enumerate(ASSETS.items()):
        path = RUNTIME/f"{name}.png"
        if not path.exists(): continue
        image = Image.open(path)
        scale = min(350/image.width,190/image.height,3)
        thumb = image.resize((round(image.width*scale),round(image.height*scale)),Image.Resampling.LANCZOS)
        x,y = (index%3)*400,(index//3)*270
        draw.text((x+14,y+14),name,fill="#252920")
        draw.text((x+14,y+34),f"{size[0]}x{size[1]}, anchor {anchor}; {kind}",fill="#252920")
        sheet.paste(thumb,(x+14,y+70),thumb)
    sheet.save(PACK/"proof/kit-contact-sheet.png")

if __name__ == "__main__":
    RUNTIME.mkdir(parents=True, exist_ok=True)
    entries=[result for name,spec in ASSETS.items() if (result:=export(name,spec))]
    contact_sheet()
    receipt={"pack":"exterior-frontage-v1","runtimeVersion":"frontage-v2","date":"2026-10-08","generator":"built-in image_gen.imagegen; no API/CLI or purchases","authorship":"Original AI-generated project artwork; owner Option B art direction; needs manager visual acceptance","references":"Proposal concepts viewed for direction only; no pixels extracted; existing trees/rooms untouched","assets":entries,"bedReductionProof":proof()}
    (PACK/"provenance.json").write_text(json.dumps(receipt,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"exports":len(entries),"assets":[{"id":a["id"],"size":a["nativeSize"],"alphaBounds":a["alphaBounds"]} for a in entries],"bedProof":receipt["bedReductionProof"]},indent=2))
