"""Stand-in art for the Level 4 design previews (NOT final art).

Pediatric Waiting Room, Pediatric Examination Room and Wound/Ostomy Clinic.
These shapes only fix scale, footprint and layering for owner review; Codex
paints the final pieces from each room's ART_BRIEF.md. Project-made
procedural art, no external sources.

Run: python -I tools/room-design/level-4/make_level4_standins.py
"""
import json
import math
import os
import sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "touchup-2026-10", "sprites"))
from make_decor_sprites import Sprite, hexc, shade, shadow_under, OUTLINE  # noqa: E402

TILE = 240
ROOMS = {}


def standin(room, name, w_tiles, h_tiles):
    def deco(fn):
        ROOMS.setdefault(room, {})[name] = (fn, w_tiles, h_tiles)
        return fn
    return deco


# ------------------------------------------------------------ pediatric waiting
@standin("pediatric-waiting", "aquarium", .96, 1.18)
def aquarium(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 7)
    sp.grad_rect(W * .04, H * .54, W * .92, H * .43, hexc("#3f6b4d"), hexc("#294632"), r=6)      # cabinet
    sp.rect(W * .46, H * .62, W * .08, H * .2, hexc("#c9b27a"), r=3, outline=OUTLINE, ow=1.2)
    sp.grad_rect(W * .02, H * .04, W * .96, H * .52, hexc("#9fe0f0"), hexc("#3f8fb8"), r=6)      # tank
    sp.rect(W * .02, H * .02, W * .96, H * .06, hexc("#2b3033"), r=4, outline=OUTLINE)            # lid
    sp.rect(W * .06, H * .46, W * .88, H * .08, hexc("#e8d9a8"), r=3)                              # sand
    for i, (x, y, c) in enumerate([(.2, .2, "#f2994a"), (.55, .3, "#f2c14e"), (.75, .16, "#e05d6f"), (.38, .38, "#7fd18b")]):
        sp.ellipse(W * x, H * y, W * .1, H * .06, hexc(c), ow=1.2)
        sp.poly([(W * x, H * (y + .03)), (W * (x - .04), H * (y + .005)), (W * (x - .04), H * (y + .055))], hexc(c), ow=1)
    for x in (.12, .86):
        sp.line([(W * x, H * .52), (W * (x + .02), H * .24), (W * (x - .02), H * .14)], hexc("#3f8f4d"), 4)
    for k in range(5):
        sp.ellipse(W * (.62 + k * .01), H * (.4 - k * .06), 6, 6, (255, 255, 255, 170), outline=None)


@standin("pediatric-waiting", "kids-table", .70, .46)
def kids_table(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .46, 6)
    for x in (W * .14, W * .82):
        sp.grad_rect(x, H * .42, W * .06, H * .54, hexc("#f2c14e"), hexc("#c99a2e"), horiz=True, r=3)
    sp.grad_rect(W * .04, H * .22, W * .92, H * .24, hexc("#7fc6e8"), hexc("#4b8fb8"), r=12)
    for i, c in enumerate(["#e05d6f", "#7fd18b", "#f2994a"]):
        sp.rect(W * (.24 + i * .2), H * .14, W * .1, H * .1, hexc(c), r=2, outline=OUTLINE, ow=1)   # blocks


@standin("pediatric-waiting", "kid-stool", .30, .40)
def kid_stool(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 5, W * .42, 5)
    for x in (W * .18, W * .72):
        sp.grad_rect(x, H * .38, W * .1, H * .58, hexc("#9aa3a6"), hexc("#5f6a66"), horiz=True, r=3)
    sp.grad_rect(W * .08, H * .22, W * .84, H * .2, hexc("#e05d6f"), hexc("#b03a4e"), r=10)


@standin("pediatric-waiting", "toy-chest", .52, .50)
def toy_chest(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    sp.grad_rect(W * .04, H * .34, W * .92, H * .62, hexc("#f2c14e"), hexc("#c99a2e"), r=8)
    sp.grad_rect(W * .02, H * .2, W * .96, H * .18, hexc("#e05d6f"), hexc("#b03a4e"), r=8)
    sp.ellipse(W * .14, H * .02, W * .24, H * .24, hexc("#7fc6e8"), ow=1.5)                       # ball
    sp.rect(W * .6, H * .06, W * .14, H * .16, hexc("#7fd18b"), r=2, outline=OUTLINE, ow=1.2)    # block
    sp.ellipse(W * .44, H * .52, W * .12, W * .12, hexc("#f7f3e6"), ow=1.2)                       # star badge


@standin("pediatric-waiting", "book-bin", .48, .62)
def book_bin(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    sp.grad_rect(W * .04, H * .4, W * .92, H * .56, hexc("#7fd18b"), hexc("#4f9b5c"), r=6)
    for i, c in enumerate(["#e05d6f", "#4b8fb8", "#f2c14e", "#9b7fd0", "#f2994a"]):
        sp.rect(W * (.1 + i * .16), H * (.08 + (i % 2) * .06), W * .12, H * .36, hexc(c), r=2, outline=OUTLINE, ow=1.2)


@standin("pediatric-waiting", "animal-prints", .70, .38)
def animal_prints(sp):
    W, H = sp.w, sp.h
    for i, (c, shape) in enumerate([("#f2c14e", "giraffe"), ("#7fc6e8", "whale"), ("#7fd18b", "turtle")]):
        x = W * (.02 + i * .33)
        sp.grad_rect(x, H * .1, W * .3, H * .8, hexc("#fbf8ec"), hexc("#e9e2cf"), r=3)
        sp.rect(x, H * .1, W * .3, H * .8, None, r=3, outline=hexc("#c9a46b"), ow=3)
        sp.ellipse(x + W * .07, H * .35, W * .16, H * .34, hexc(c), ow=1.5)


@standin("pediatric-waiting", "wall-clock-kids", .26, .26)
def wall_clock_kids(sp):
    W, H = sp.w, sp.h
    sp.ellipse(3, 3, W - 6, H - 6, hexc("#e05d6f"), ow=2.5)
    sp.ellipse(10, 10, W - 20, H - 20, hexc("#fbf8ec"), ow=1.5)
    sp.line([(W / 2, H / 2), (W / 2 + 9, H / 2 - 10)], (30, 34, 32, 255), 3.5)
    sp.line([(W / 2, H / 2), (W / 2 - 2, H / 2 + 14)], (30, 34, 32, 255), 2.5)


# ------------------------------------------------------------- pediatric exam
@standin("pediatric-exam", "peds-table", .78, 1.72)
def peds_table(sp):
    """Exam table seen end-on/vertical: head at the north, long axis north-south."""
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 8, W * .48, 8)
    sp.grad_rect(W * .08, H * .55, W * .84, H * .42, hexc("#7fc6e8"), hexc("#4b8fb8"), r=8)       # drawer base
    for k in range(3):
        sp.rect(W * .2, H * (.6 + k * .12), W * .6, H * .08, hexc("#a9dcf0"), r=3, outline=OUTLINE, ow=1.2)
    sp.grad_rect(W * .04, H * .06, W * .92, H * .52, hexc("#f2f0e8"), hexc("#d8d3c4"), r=14)      # pad
    sp.grad_rect(W * .1, H * .02, W * .8, H * .14, hexc("#f7f3e6"), hexc("#e2dccb"), r=12)       # head pillow
    sp.rect(W * .3, H * .1, W * .4, H * .5, hexc("#ffffff"), r=6)                                   # paper roll strip
    for i, c in enumerate(["#f2c14e", "#7fd18b", "#e05d6f"]):
        sp.ellipse(W * (.22 + i * .2), H * .7, W * .14, W * .14, hexc(c), ow=1.2)                  # animal decals


@standin("pediatric-exam", "scale-counter", .92, 1.02)
def scale_counter(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    sp.grad_rect(W * .04, H * .42, W * .92, H * .55, hexc("#f7f3e6"), hexc("#d8d3c4"), r=6)      # cabinet
    for x in (.12, .54):
        sp.rect(W * x, H * .5, W * .34, H * .42, hexc("#efe9d8"), r=4, outline=OUTLINE, ow=1.5)
    sp.grad_rect(W * .02, H * .34, W * .96, H * .1, hexc("#7fc6e8"), hexc("#4b8fb8"), r=4)       # counter top
    sp.grad_rect(W * .08, H * .12, W * .5, H * .22, hexc("#e9eef1"), hexc("#b6c2ca"), r=14)      # infant scale tray
    sp.rect(W * .22, H * .22, W * .2, H * .1, hexc("#2f3b44"), r=3, outline=OUTLINE, ow=1.2)
    sp.rect(W * .25, H * .245, W * .14, H * .05, hexc("#9fe0b0"), r=1)
    sp.rect(W * .66, H * .08, W * .1, H * .26, hexc("#c3cbc8"), r=3, outline=OUTLINE, ow=1.2)   # faucet
    sp.ellipse(W * .62, H * .28, W * .3, H * .08, hexc("#dfe7ec"), ow=1.5)                         # basin


@standin("pediatric-exam", "growth-chart", .36, .78)
def growth_chart(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(W * .1, H * .02, W * .8, H * .96, hexc("#fbf8ec"), hexc("#efe6cc"), r=4)
    for k in range(10):
        sp.line([(W * .12, H * (.08 + k * .09)), (W * (.32 if k % 2 else .42), H * (.08 + k * .09))], hexc("#4b8fb8"), 2)
    sp.ellipse(W * .48, H * .06, W * .3, H * .14, hexc("#f2c14e"), ow=1.5)                         # giraffe head
    sp.rect(W * .55, H * .16, W * .14, H * .68, hexc("#f2c14e"), r=4, outline=OUTLINE, ow=1.5)     # neck
    for k in range(5):
        sp.ellipse(W * .57, H * (.22 + k * .12), W * .08, W * .08, hexc("#c99a2e"), outline=None)


@standin("pediatric-exam", "toy-bin", .44, .42)
def toy_bin(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 5, W * .46, 5)
    sp.grad_rect(W * .06, H * .36, W * .88, H * .6, hexc("#9b7fd0"), hexc("#6f58a8"), r=8)
    sp.ellipse(W * .14, H * .06, W * .3, H * .36, hexc("#f2c14e"), ow=1.5)
    sp.rect(W * .52, H * .12, W * .2, H * .26, hexc("#e05d6f"), r=3, outline=OUTLINE, ow=1.2)


@standin("pediatric-exam", "animal-print", .34, .36)
def animal_print(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(4, 4, W - 8, H - 8, hexc("#fbf8ec"), hexc("#e9e2cf"), r=3)
    sp.rect(4, 4, W - 8, H - 8, None, r=3, outline=hexc("#c9a46b"), ow=3)
    sp.ellipse(W * .22, H * .3, W * .56, H * .44, hexc("#7fc6e8"), ow=1.5)
    sp.ellipse(W * .6, H * .36, 6, 6, (30, 30, 30, 255), outline=None)


# ------------------------------------------------------------- wound / ostomy
@standin("wound-ostomy", "wound-recliner", 1.30, .98)
def wound_recliner(sp):
    """Power treatment recliner seen from the side: backrest west, leg rest out to the east."""
    W, H = sp.w, sp.h
    shadow_under(sp, W * .45, H - 8, W * .46, 8)
    sp.grad_rect(W * .26, H * .7, W * .3, H * .26, hexc("#9aa3a6"), hexc("#5f6a66"), r=6)        # base
    sp.poly([(W * .06, H * .08), (W * .2, H * .04), (W * .32, H * .5), (W * .18, H * .56)], hexc("#3f6b8a"))  # backrest
    sp.grad_rect(W * .18, H * .44, W * .44, H * .16, hexc("#4f7f9e"), hexc("#34566e"), r=10)     # seat
    sp.poly([(W * .6, H * .44), (W * .96, H * .36), (W * .98, H * .48), (W * .62, H * .58)], hexc("#4f7f9e"))  # leg rest
    sp.rect(W * .2, H * .36, W * .3, H * .06, hexc("#c3cbc8"), r=3, outline=OUTLINE, ow=1.5)     # arm rest
    sp.rect(W * .72, H * .3, W * .18, H * .08, hexc("#f2f0e8"), r=3, outline=OUTLINE, ow=1.2)    # paper pad


@standin("wound-ostomy", "dressing-cart", .56, .86)
def dressing_cart(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    sp.grad_rect(W * .06, H * .2, W * .88, H * .7, hexc("#e9eef1"), hexc("#b6c2ca"), r=6)
    for k, c in enumerate(["#7fc6e8", "#f2c14e", "#7fd18b", "#e05d6f"]):
        sp.rect(W * .12, H * (.26 + k * .15), W * .76, H * .12, hexc("#f7f9fa"), r=3, outline=OUTLINE, ow=1.2)
        sp.rect(W * .44, H * (.3 + k * .15), W * .12, H * .04, hexc(c), r=2)
    sp.grad_rect(W * .04, H * .12, W * .92, H * .1, hexc("#c3cbc8"), hexc("#8f9a96"), r=3)
    for i, c in enumerate(["#ffffff", "#f2e6c9", "#cfe8f2"]):
        sp.rect(W * (.1 + i * .27), H * .02, W * .22, H * .11, hexc(c), r=2, outline=OUTLINE, ow=1)   # dressing packs
    for x in (W * .12, W * .82):
        sp.ellipse(x - 4, H - 16, 14, 14, hexc("#2a2e2c"), ow=1.5)


@standin("wound-ostomy", "ostomy-shelf", .92, 1.24)
def ostomy_shelf(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    sp.grad_rect(W * .03, H * .02, W * .94, H * .95, hexc("#d9c9a8"), hexc("#a98f62"), r=5)
    for k in range(4):
        y = H * (.06 + k * .23)
        sp.rect(W * .07, y + H * .17, W * .86, 6, hexc("#7a5a34"), r=2)
        for j in range(4):
            c = ["#f7f3e6", "#cfe8f2", "#f2e6c9", "#e9eef1"][(j + k) % 4]
            sp.rect(W * (.1 + j * .21), y + H * .02, W * .18, H * .15, hexc(c), r=2, outline=OUTLINE, ow=1.2)
            sp.rect(W * (.13 + j * .21), y + H * .07, W * .1, H * .03, hexc("#4b8fb8"), r=1)


@standin("wound-ostomy", "exam-lamp", .36, 1.36)
def exam_lamp(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .44, 5)
    sp.rect(W * .1, H * .94, W * .8, H * .04, hexc("#5f6a66"), r=3, outline=OUTLINE, ow=1.5)
    sp.grad_rect(W * .44, H * .24, W * .12, H * .7, hexc("#dfe3e0"), hexc("#8d9692"), horiz=True, r=3)
    sp.line([(W * .5, H * .25), (W * .78, H * .12)], hexc("#8d9692"), 5)
    sp.ellipse(W * .56, H * .02, W * .42, H * .14, hexc("#f4f4f0"), ow=2)
    sp.ellipse(W * .64, H * .06, W * .26, H * .06, hexc("#fff3b0"), outline=None)


@standin("wound-ostomy", "hygiene-sign", .30, .36)
def hygiene_sign(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(4, 4, W - 8, H - 8, hexc("#f7f9fa"), hexc("#dfe7ec"), r=4)
    sp.rect(4, 4, W - 8, H * .24, hexc("#3f6b4d"), r=4, outline=OUTLINE, ow=1.5)
    sp.ellipse(W * .32, H * .4, W * .36, H * .4, hexc("#9fd3ff"), ow=1.5)                       # hands/water drop
    sp.poly([(W * .66, H * .42), (W * .76, H * .62), (W * .56, H * .62)], hexc("#4b8fb8"), ow=1)


def build():
    manifest = {}
    for room, specs in ROOMS.items():
        out = os.path.join(HERE, room, "stand-in")
        os.makedirs(out, exist_ok=True)
        manifest[room] = {}
        for name, (fn, w_tiles, h_tiles) in specs.items():
            sp = Sprite(max(8, round(w_tiles * TILE)), max(8, round(h_tiles * TILE)))
            fn(sp)
            sp.img.resize((sp.w, sp.h), Image.LANCZOS).save(os.path.join(out, name + ".png"))
            manifest[room][name] = {"width": sp.w, "height": sp.h, "widthTiles": w_tiles, "heightTiles": h_tiles}
        with open(os.path.join(out, "manifest.json"), "w") as handle:
            json.dump(manifest[room], handle, indent=1)
    print(json.dumps({room: list(specs) for room, specs in manifest.items()}))


if __name__ == "__main__":
    build()
