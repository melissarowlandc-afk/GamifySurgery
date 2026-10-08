"""Stand-in art for the MRI Room design preview (NOT final art).

Owner direction (2026-10-07): MRI is 4x4 with a glass control window, every
element re-oriented versus CT, never dimmed; Codex paints the final pieces
from ART_BRIEF.md. These shapes only fix scale, footprint and layering for
review. Project-made procedural art; no external sources.

Run: python -I stand-in/make_standins.py
"""
import json
import math
import os
import sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "..", "..", "touchup-2026-10", "sprites"))
from make_decor_sprites import Sprite, hexc, shade, shadow_under, OUTLINE  # noqa: E402

TILE = 240
OUT = os.path.join(HERE, "assets")
SPECS = {}


def standin(name, w_tiles, h_tiles):
    def deco(fn):
        SPECS[name] = (fn, w_tiles, h_tiles)
        return fn
    return deco


@standin("gantry-side", 1.20, 1.62)
def gantry(sp):
    """Magnet housing seen from the side; bore opening on its west face."""
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 8, W * .5, 10, 70)
    sp.grad_rect(W * .05, H * .88, W * .9, H * .1, hexc("#c9d2d8"), hexc("#8f9ba3"), r=8)        # plinth
    sp.grad_rect(W * .04, H * .06, W * .92, H * .84, hexc("#f4f7f9"), hexc("#c8d3da"), r=int(W * .16))  # housing
    sp.grad_rect(W * .04, H * .06, W * .14, H * .84, hexc("#dfe7ec"), hexc("#a9b7c0"), r=int(W * .07))  # west face (bore side)
    sp.ellipse(W * .045, H * .34, W * .11, H * .30, hexc("#3c4a54"), ow=2)                         # bore mouth
    sp.rect(W * .20, H * .40, W * .72, H * .05, hexc("#4b8fb8"), r=4)                               # blue stripe
    sp.rect(W * .66, H * .18, W * .2, H * .12, hexc("#2f3b44"), r=6, outline=OUTLINE)              # status panel
    for i, c in enumerate(["#7fd18b", "#f2c14e", "#9fd3ff"]):
        sp.ellipse(W * (.69 + i * .055), H * .22, 9, 9, hexc(c), outline=None)


def table(sp, occupied):
    W, H = sp.w, sp.h
    shadow_under(sp, W * .45, H - 6, W * .38, 7)
    sp.grad_rect(W * .30, H * .52, W * .26, H * .44, hexc("#c9d2d8"), hexc("#8f9ba3"), r=6)      # pedestal
    sp.grad_rect(W * .02, H * .34, W * .96, H * .18, hexc("#e9eef1"), hexc("#b6c2ca"), r=10)     # cradle
    sp.grad_rect(W * .05, H * .24, W * .90, H * .13, hexc("#9fc6dd"), hexc("#6f9fbd"), r=10)     # cushion
    if occupied:
        sp.grad_rect(W * .14, H * .06, W * .80, H * .22, hexc("#f2f0e8"), hexc("#cfcbbd"), r=16)  # blanket
        sp.ellipse(W * .04, H * .04, W * .13, H * .2, hexc("#c99a7a"), ow=2)                        # head
        sp.rect(W * .03, H * .06, W * .15, H * .06, hexc("#3c4a54"), r=6, outline=OUTLINE, ow=1.5)  # headphones band


@standin("table-empty", 1.05, .62)
def table_empty(sp):
    table(sp, False)


@standin("table-occupied", 1.05, .62)
def table_occupied(sp):
    table(sp, True)


@standin("console", .44, .86)
def console(sp):
    """Narrow desk against the glass; two monitors in profile facing west."""
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    for x in (W * .12, W * .80):
        sp.grad_rect(x, H * .52, 9, H * .44, hexc("#8f9a96"), hexc("#5f6a66"), horiz=True, r=3)
    sp.grad_rect(W * .04, H * .44, W * .92, H * .1, hexc("#e8e2d4"), hexc("#b9b2a2"), r=4)       # desk top
    for i, y in enumerate((H * .08, H * .22)):
        sp.grad_rect(W * .55, y, W * .14, H * .17, hexc("#2b3033"), hexc("#1c2022"), r=3)       # monitor edge-on
        sp.rect(W * .48, y + H * .05, W * .07, H * .07, hexc("#9fd3ff"), r=2)                      # screen glow sliver
    sp.rect(W * .60, H * .37, W * .05, H * .08, hexc("#3c4a54"), r=2, outline=OUTLINE, ow=1.2)   # stand
    sp.rect(W * .14, H * .40, W * .32, H * .04, hexc("#2b3033"), r=2)                              # keyboard


@standin("operator-chair", .40, .70)
def operator_chair(sp):
    """Task chair seen from the side, occupant faces east."""
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .44, 6)
    sp.grad_rect(W * .44, H * .62, W * .1, H * .26, hexc("#9aa3a6"), hexc("#5f6a66"), horiz=True, r=3)
    for x in (W * .1, W * .78):
        sp.ellipse(x, H - 14, 12, 12, hexc("#2a2e2c"), ow=1.5)
    sp.line([(W * .14, H - 10), (W * .84, H - 10)], hexc("#3d4542"), 4)
    sp.grad_rect(W * .14, H * .52, W * .72, H * .12, hexc("#4f6f8a"), hexc("#34506a"), r=8)      # seat
    sp.grad_rect(W * .06, H * .06, W * .18, H * .52, hexc("#4f6f8a"), hexc("#34506a"), r=10)     # backrest (west)


@standin("coil-cabinet", .64, 1.30)
def coil_cabinet(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    sp.grad_rect(W * .04, H * .02, W * .92, H * .95, hexc("#e9eef1"), hexc("#b6c2ca"), r=6)
    for k in range(3):
        y = H * (.08 + k * .3)
        sp.rect(W * .1, y + H * .22, W * .8, 6, hexc("#9aa6ad"), r=2)
        for j, c in enumerate(["#4b8fb8", "#7fb7d6", "#f2c14e"]):
            sp.ellipse(W * (.14 + j * .26), y + H * .06, W * .2, H * .15, hexc(c), ow=1.5)
            sp.ellipse(W * (.19 + j * .26), y + H * .1, W * .1, H * .07, hexc("#e9eef1"), ow=1)


@standin("zone-sign", .46, .40)
def zone_sign(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(3, 3, W - 6, H - 6, hexc("#f7f3e6"), hexc("#ddd6c2"), r=5)
    sp.rect(3, 3, W - 6, H * .3, hexc("#c0392b"), r=5, outline=OUTLINE, ow=1.5)
    sp.poly([(W * .5, H * .42), (W * .68, H * .86), (W * .32, H * .86)], hexc("#f1c40f"), ow=1.5)
    sp.line([(W * .5, H * .55), (W * .5, H * .72)], (30, 30, 30, 255), 3)
    sp.ellipse(W * .5 - 2.5, H * .77, 5, 5, (30, 30, 30, 255), outline=None)


@standin("scan-light", .40, .22)
def scan_light(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(3, 3, W - 6, H - 6, hexc("#3a3f3c"), hexc("#262a28"), r=5)
    sp.grad_rect(9, 9, W - 18, H - 18, hexc("#9fd3ff"), hexc("#4b8fb8"), r=3, ow=1.5)


@standin("lockers", .44, 1.02)
def lockers(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    for i in range(2):
        x = W * (.04 + i * .46)
        sp.grad_rect(x, H * .03, W * .46, H * .94, hexc("#8fb0c4"), hexc("#5f8299"), r=4)
        for k in range(3):
            sp.line([(x + W * .1, H * (.1 + k * .03)), (x + W * .36, H * (.1 + k * .03))], hexc("#4a6a80"), 2)
        sp.rect(x + W * .34, H * .48, W * .05, H * .1, hexc("#e9eef1"), r=2, outline=OUTLINE, ow=1)


@standin("comfort-cart", .48, .62)
def comfort_cart(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .46, 6)
    for x in (W * .1, W * .84):
        sp.grad_rect(x, H * .3, 7, H * .62, hexc("#c3cbc8"), hexc("#7e8885"), horiz=True, r=3)
        sp.ellipse(x - 3, H - 14, 13, 13, hexc("#2a2e2c"), ow=1.5)
    for y in (H * .3, H * .66):
        sp.grad_rect(W * .06, y, W * .88, H * .08, hexc("#e2e6e4"), hexc("#9aa3a6"), r=3)
    sp.grad_rect(W * .12, H * .08, W * .46, H * .22, hexc("#9fc6dd"), hexc("#6f9fbd"), r=8)       # foam pads
    sp.ellipse(W * .62, H * .08, W * .28, H * .22, hexc("#3c4a54"), ow=2)                          # headphones
    sp.ellipse(W * .68, H * .13, W * .16, H * .12, hexc("#e9eef1"), outline=None)
    sp.grad_rect(W * .14, H * .46, W * .7, H * .18, hexc("#f2f0e8"), hexc("#cfcbbd"), r=6)       # blankets


def build():
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for name, (fn, w_tiles, h_tiles) in SPECS.items():
        sp = Sprite(max(8, round(w_tiles * TILE)), max(8, round(h_tiles * TILE)))
        fn(sp)
        sp.img.resize((sp.w, sp.h), Image.LANCZOS).save(os.path.join(OUT, name + ".png"))
        manifest[name] = {"width": sp.w, "height": sp.h, "widthTiles": w_tiles, "heightTiles": h_tiles}
    with open(os.path.join(OUT, "manifest.json"), "w") as handle:
        json.dump(manifest, handle, indent=1)
    print("wrote", len(manifest), "stand-ins")


if __name__ == "__main__":
    build()
