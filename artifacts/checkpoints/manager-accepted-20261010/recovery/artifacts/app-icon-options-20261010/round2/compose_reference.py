"""Compose a people-free reference from approved game art; write only round2."""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent.parent
REF = ROOT / "receipts/references"
SOURCE_RECTS = {
    "frontDesk": (476, 78, 996, 392),
    "filingCabinet": (48, 19, 257, 393),
    "secretaryChair": (293, 56, 445, 328),
    "waterCooler": (1064, 184, 1215, 508),
    "wasteBin": (72, 420, 184, 564),
    "noticeBoard": (299, 401, 504, 568),
    "wallClock": (651, 439, 764, 542),
    "visitorChair": (865, 681, 1097, 935),
}
def save_json(name, data):
    with (ROOT / name).open("w", encoding="utf-8", newline="\n") as out:
        out.write(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
def clean(sprite):
    alpha = sprite.getchannel("A").point(lambda x: 0 if x < 64 else x)
    sprite.putalpha(alpha)
    return sprite
def main():
    for folder in ("icons", "preview-60", "receipts/generated", "receipts/references"):
        (ROOT / folder).mkdir(parents=True, exist_ok=True)
    round1 = ROOT.parent
    baseline = [p for p in round1.rglob("*") if p.is_file() and ROOT not in p.parents]
    save_json("receipts/round1-baseline.json", [
        {"path": str(p.relative_to(REPO)).replace("\\", "/"), "sha256": sha(p)}
        for p in sorted(baseline)
    ])
    v2_name = "apps/player/public/art/rooms/front-desk-v2/front-desk-components-v2.png"
    v4_name = "apps/player/public/art/rooms/front-desk-v4/front-desk-shell-v4.png"
    waiting_name = "apps/player/public/art/rooms/level-1-v1/waiting-fixtures-v1.png"
    with Image.open(REPO / v2_name) as source:
        atlas = source.convert("RGBA")
    with Image.open(REPO / waiting_name) as source:
        waiting = source.convert("RGBA")
    sprites = {
        name: clean((waiting if name == "visitorChair" else atlas).crop(rect))
        for name, rect in SOURCE_RECTS.items()
    }
    sprites["visitorChair"] = sprites["visitorChair"].transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    with Image.open(REPO / v4_name) as source:
        shell = clean(source.convert("RGBA"))
    room = shell.copy()
    # Blank-note treatment removes the original tiny chart bars from reference
    # objects. Their paper/pin blocks keep the recognizable furniture forms.
    board = sprites["noticeBoard"]
    draw = ImageDraw.Draw(board)
    draw.rectangle((119, 29, 184, 138), fill="#f4e9cf")
    draw.rectangle((149, 22, 157, 36), fill="#367f88")
    for name, cx, cy, w, h in [("noticeBoard", 480, 215, 205, 167), ("wallClock", 680, 215, 113, 103)]:
        sprite = sprites[name].resize((w, h), Image.Resampling.NEAREST)
        room.alpha_composite(sprite, (int(cx - w/2), int(cy - h/2)))
    # Exact approved floor and fixture ratios from FrontDeskPresentation and
    # FRONT_DESK_V4_SHELL_LAYOUT; only art is composed, with no scene actors.
    floor = (212, 339, 832, 622)
    placements = [
        ("filingCabinet", .10, .20, .22, .50),
        ("waterCooler", .84, .20, .66/5, 1.14/4),
        ("wasteBin", .95, .20, .085, .18),
        ("secretaryChair", .40, .50, .16, .24),
        ("frontDesk", .40, .70, .40, .31),
        ("visitorChair", .90, .94, .16, .29),
    ]
    # User requested the actual entry mat: roomTouchups.ts color/geometry.
    draw = ImageDraw.Draw(room)
    mx, my = round(212 + 2.12 * 832/5), round(339 + 3.40 * 622/4)
    mw, mh = round(.76 * 832/5), round(.46 * 622/4)
    draw.rectangle((mx, my, mx+mw, my+mh), fill="#5b4a3b", outline="#232720", width=5)
    for x in range(mx+9, mx+mw-5, 9):
        draw.line((x, my+6, x, my+mh-6), fill="#80644b", width=3)
    placement_receipt = []
    for name, x, y, width, height in placements:
        sprite = sprites[name]
        scale = min(width * floor[2] / sprite.width, height * floor[3] / sprite.height)
        target = (round(sprite.width * scale), round(sprite.height * scale))
        sprite = sprite.resize(target, Image.Resampling.NEAREST)
        left, top = round(floor[0]+x*floor[2]-target[0]/2), round(floor[1]+y*floor[3]-target[1])
        room.alpha_composite(sprite, (left, top))
        placement_receipt.append({"sprite": name, "position": [left,top], "size": list(target)})
    occluder = shell.crop((157, 941, 1097, 1094))
    room.alpha_composite(occluder, (157,941))
    room = room.crop((150,88,1104,1100))
    # Entire reference composition fits within ~78% of a 1024px square.
    scale = 800/max(room.size)
    target = (round(room.width*scale), round(room.height*scale))
    room = room.resize(target, Image.Resampling.NEAREST)
    reference = Image.new("RGBA",(1024,1024),"#f4e9cf")
    reference.alpha_composite(room,((1024-target[0])//2,(1024-target[1])//2))
    reference.convert("RGB").save(REF / "front-desk-approved-composition.png")
    # Furniture study board documents the vivid material colors from source.
    board = Image.new("RGB",(1024,720),"#f4e9cf")
    d = ImageDraw.Draw(board)
    for index, name in enumerate(SOURCE_RECTS):
        x,y = 24+(index%4)*250, 32+(index//4)*340
        sprite=sprites[name].copy()
        sprite.thumbnail((210,260),Image.Resampling.NEAREST)
        board.paste(sprite,(x,y+30),sprite)
        d.text((x,y),name,fill="#232720")
    board.save(REF / "front-desk-furniture-study.png")
    refs=json.loads((ROOT/"receipts/style-study.json").read_text(encoding="utf-8"))["source_references"]
    save_json("receipts/reference-hashes.json",[{"path":p,"sha256":sha(REPO/p)} for p in refs])
    save_json("receipts/front-desk-composition.json",{
        "status":"original local composition from approved game artwork",
        "shell":v4_name, "furniture_atlas":v2_name, "chair_atlas":waiting_name,
        "source_rects_xyxy":{k:list(v) for k,v in SOURCE_RECTS.items()},
        "source_floor_xywh":list(floor), "floor_fixture_placements":placement_receipt,
        "rear_wall_decor":"FRONT_DESK_V4_SHELL_LAYOUT",
        "entry_mat":"roomTouchups.ts room.front_desk; #5b4a3b; 2.12,3.40,.76,.46 tiles",
        "visitor_chair":"approved southeast crop mirrored to face into room",
        "notes":"No people. Blank note/pin blocks replace tiny chart-like marks. Reference only; final icons are generated edits.",
        "reference_sha256":sha(REF/"front-desk-approved-composition.png")
    })
    print("Prepared approved Front Desk room composition and vivid furniture study.")
    print(f"Protected {len(baseline)} existing Round-1 files; source hashes recorded.")
if __name__=="__main__":
    main()
