"""Procedural decor sprites for the room touch-up proposal.

Original, project-created art (no external sources). Each sprite is drawn at
4x supersampling with dark outlines and soft vertical shading to sit beside the
existing GS-015 painted furniture, then downsampled with LANCZOS.

Native density is 240 px per tile (the Level 3 room art density). The lab and
any later runtime pack read sizes from manifest.json.

Run: python -I sprites/make_decor_sprites.py
"""
import json
import math
import os
from PIL import Image, ImageDraw, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "assets", "decor")
SS = 4            # supersampling factor
TILE = 240        # native px per tile
OUTLINE = (38, 44, 40, 255)


def hexc(h, a=255):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def mix(c1, c2, t):
    return tuple(int(round(c1[i] + (c2[i] - c1[i]) * t)) for i in range(4))


def shade(c, f):
    """f<1 darkens, f>1 lightens toward white."""
    if f <= 1:
        return (int(c[0] * f), int(c[1] * f), int(c[2] * f), c[3])
    t = f - 1
    return mix(c, (255, 255, 255, c[3]), t)


class Sprite:
    def __init__(self, w_px, h_px):
        self.w, self.h = w_px, h_px
        self.img = Image.new("RGBA", (w_px * SS, h_px * SS), (0, 0, 0, 0))
        self.d = ImageDraw.Draw(self.img)

    def s(self, v):
        return v * SS

    def box(self, x, y, w, h):
        return [self.s(x), self.s(y), self.s(x + w), self.s(y + h)]

    def grad_rect(self, x, y, w, h, top, bottom, r=0, outline=True, horiz=False, ow=2.0):
        """Rounded rect with a linear gradient fill and outline."""
        mask = Image.new("L", self.img.size, 0)
        md = ImageDraw.Draw(mask)
        md.rounded_rectangle(self.box(x, y, w, h), radius=self.s(r), fill=255)
        grad = Image.new("RGBA", self.img.size, (0, 0, 0, 0))
        gd = ImageDraw.Draw(grad)
        if horiz:
            x0, x1 = int(self.s(x)), int(self.s(x + w))
            for xx in range(x0, x1 + 1):
                t = (xx - x0) / max(1, x1 - x0)
                gd.line([(xx, self.s(y)), (xx, self.s(y + h))], fill=mix(top, bottom, t))
        else:
            y0, y1 = int(self.s(y)), int(self.s(y + h))
            for yy in range(y0, y1 + 1):
                t = (yy - y0) / max(1, y1 - y0)
                gd.line([(self.s(x), yy), (self.s(x + w), yy)], fill=mix(top, bottom, t))
        self.img.paste(grad, (0, 0), mask)
        if outline:
            self.d.rounded_rectangle(self.box(x, y, w, h), radius=self.s(r), outline=OUTLINE, width=int(self.s(ow)))

    def rect(self, x, y, w, h, fill, r=0, outline=None, ow=2.0):
        self.d.rounded_rectangle(self.box(x, y, w, h), radius=self.s(r), fill=fill,
                                 outline=outline, width=int(self.s(ow)) if outline else 0)

    def ellipse(self, x, y, w, h, fill, outline=OUTLINE, ow=2.0):
        self.d.ellipse(self.box(x, y, w, h), fill=fill, outline=outline, width=int(self.s(ow)) if outline else 0)

    def poly(self, pts, fill, outline=OUTLINE, ow=2.0):
        p = [(self.s(a), self.s(b)) for a, b in pts]
        self.d.polygon(p, fill=fill)
        if outline:
            self.d.line(p + [p[0]], fill=outline, width=int(self.s(ow)), joint="curve")

    def line(self, pts, fill, w=2.0):
        self.d.line([(self.s(a), self.s(b)) for a, b in pts], fill=fill, width=int(self.s(w)), joint="curve")

    def save(self, name):
        out = self.img.resize((self.w, self.h), Image.LANCZOS)
        out.save(os.path.join(OUT, name + ".png"))
        return out


def shadow_under(sp, cx, y, rx, ry, alpha=60):
    layer = Image.new("RGBA", sp.img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([sp.s(cx - rx), sp.s(y - ry), sp.s(cx + rx), sp.s(y + ry)], fill=(20, 26, 22, alpha))
    layer = layer.filter(ImageFilter.GaussianBlur(sp.s(3)))
    sp.img.alpha_composite(layer)


# ---------------------------------------------------------------- sprites
SPRITES = {}


def sprite(name, w_tiles, anchor_y=1.0, mount="floor"):
    def deco(fn):
        SPRITES[name] = (fn, w_tiles, anchor_y, mount)
        return fn
    return deco


@sprite("trash-bin", .30)
def trash_bin(sp, color="#6f8574", lid="#4c5f51"):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 5, W * .42, 5)
    body, lidc = hexc(color), hexc(lid)
    sp.poly([(W * .16, H * .30), (W * .84, H * .30), (W * .78, H - 6), (W * .22, H - 6)], shade(body, 1.0))
    # vertical shading strips
    sp.poly([(W * .60, H * .31), (W * .83, H * .31), (W * .77, H - 7), (W * .58, H - 7)], shade(body, .82), outline=None)
    sp.line([(W * .30, H * .36), (W * .27, H - 14)], shade(body, 1.25), 2.5)
    sp.grad_rect(W * .10, H * .18, W * .80, H * .14, shade(lidc, 1.25), shade(lidc, .85), r=5)
    sp.rect(W * .40, H * .12, W * .20, H * .08, shade(lidc, .9), r=3, outline=OUTLINE)
    sp.rect(W * .36, H - 12, W * .28, 6, shade(body, .7), r=2, outline=OUTLINE, ow=1.5)  # pedal


@sprite("recycle-bin", .30)
def recycle_bin(sp):
    trash_bin(sp, color="#3f78a8", lid="#2d5a80")
    W, H = sp.w, sp.h
    # recycling chevrons
    cx, cy, r = W / 2, H * .60, W * .14
    for k in range(3):
        a = -math.pi / 2 + k * 2 * math.pi / 3
        x, y = cx + r * math.cos(a), cy + r * math.sin(a)
        sp.poly([(x - 5, y), (x + 5, y), (x, y - 7)], (235, 244, 250, 255), outline=None)


@sprite("biohazard-bin", .32)
def biohazard_bin(sp):
    trash_bin(sp, color="#c0392b", lid="#8e2a20")
    W, H = sp.w, sp.h
    cx, cy = W / 2, H * .60
    sp.rect(cx - W * .20, cy - W * .16, W * .40, W * .32, (246, 214, 64, 255), r=4, outline=OUTLINE, ow=1.5)
    for k in range(3):
        a = -math.pi / 2 + k * 2 * math.pi / 3
        sp.ellipse(cx + 6 * math.cos(a) - 4.5, cy + 6 * math.sin(a) - 4.5, 9, 9, None, outline=(30, 30, 30, 255), ow=1.8)
    sp.ellipse(cx - 2, cy - 2, 4, 4, (30, 30, 30, 255), outline=None)


@sprite("sharps-wall", .22, mount="north-wall")
def sharps_wall(sp):
    W, H = sp.w, sp.h
    sp.rect(W * .18, 2, W * .64, H * .16, hexc("#9aa6a0"), r=3, outline=OUTLINE)  # bracket
    sp.grad_rect(W * .10, H * .12, W * .80, H * .80, hexc("#e0473a"), hexc("#a8281e"), r=6)
    sp.grad_rect(W * .16, H * .12, W * .68, H * .22, hexc("#f2f2ee"), hexc("#cfd2cc"), r=4)
    sp.rect(W * .36, H * .18, W * .28, H * .07, (40, 40, 40, 255), r=2)
    sp.rect(W * .25, H * .50, W * .50, H * .22, (246, 214, 64, 255), r=3, outline=OUTLINE, ow=1.2)


@sprite("glove-box-wall", .34, mount="north-wall")
def glove_box_wall(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(4, 4, W - 8, H - 8, hexc("#cfd6d2"), hexc("#a9b4ae"), r=4)
    colors = ["#6fa8dc", "#9b7fd0", "#f2f2ee"]
    bw = (W - 20) / 3
    for i, c in enumerate(colors):
        x = 10 + i * bw
        sp.grad_rect(x, 10, bw - 4, H - 22, shade(hexc(c), 1.1), shade(hexc(c), .8), r=2, ow=1.5)
        sp.ellipse(x + bw * .2, 18, bw * .45, 9, (255, 255, 255, 200), outline=OUTLINE, ow=1.2)


@sprite("towel-dispenser", .22, mount="north-wall")
def towel_dispenser(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(4, 3, W - 8, H * .70, hexc("#f4f4f0"), hexc("#c9ccc6"), r=8)
    sp.rect(W * .30, H * .18, W * .40, H * .10, hexc("#8fa39a"), r=3)
    sp.poly([(W * .26, H * .70), (W * .74, H * .70), (W * .70, H - 4), (W * .30, H - 4)], hexc("#fbfaf4"), ow=1.5)


@sprite("soap-sanitizer-wall", .14, mount="north-wall")
def sanitizer_wall(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(3, 3, W - 6, H * .78, hexc("#f4f4f0"), hexc("#c8ccc6"), r=6)
    sp.rect(W * .25, H * .20, W * .50, H * .22, hexc("#4f9bd0"), r=3)
    sp.rect(W * .35, H * .78, W * .30, H * .16, hexc("#9aa6a0"), r=2, outline=OUTLINE, ow=1.5)


@sprite("grab-bar", .40, mount="north-wall")
def grab_bar(sp):
    W, H = sp.w, sp.h
    for x in (6, W - 22):
        sp.rect(x, H * .15, 16, H * .70, hexc("#9aa3a6"), r=4, outline=OUTLINE)
    sp.grad_rect(12, H * .35, W - 24, H * .30, hexc("#eef2f4"), hexc("#8d969a"), r=int(H * .15))


@sprite("wall-clock", .24, mount="north-wall")
def wall_clock(sp):
    W, H = sp.w, sp.h
    sp.ellipse(3, 3, W - 6, H - 6, hexc("#294632"), ow=2.5)
    sp.ellipse(9, 9, W - 18, H - 18, hexc("#fbf8ec"), ow=1.5)
    cx, cy = W / 2, H / 2
    for k in range(12):
        a = k * math.pi / 6
        r0, r1 = (W - 18) / 2 - 6, (W - 18) / 2 - 2
        sp.line([(cx + r0 * math.cos(a), cy + r0 * math.sin(a)), (cx + r1 * math.cos(a), cy + r1 * math.sin(a))], (40, 50, 44, 255), 2 if k % 3 else 3)
    sp.line([(cx, cy), (cx + 10, cy - 12)], (30, 34, 32, 255), 3.5)
    sp.line([(cx, cy), (cx - 2, cy + 18)], (30, 34, 32, 255), 2.5)
    sp.ellipse(cx - 3, cy - 3, 6, 6, (180, 50, 40, 255), outline=None)


@sprite("wall-tv", .56, mount="north-wall")
def wall_tv(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(3, 3, W - 6, H - 6, hexc("#2b3033"), hexc("#1c2022"), r=5)
    sp.grad_rect(11, 11, W - 22, H - 22, hexc("#7fb6c8"), hexc("#3f6f86"), r=2, ow=1.5)
    # calm scenery: hills and sun
    sp.poly([(11, H - 22), (W * .35, H * .48), (W * .62, H - 22)], hexc("#6f9a6a"), outline=None)
    sp.poly([(W * .40, H - 11), (W * .70, H * .42), (W - 11, H * .70), (W - 11, H - 11)], hexc("#4f7c55"), outline=None)
    sp.ellipse(W * .70, H * .20, 16, 16, hexc("#f6e7a8"), outline=None)
    sp.line([(18, 16), (W * .45, 16)], (255, 255, 255, 70), 3)


@sprite("xray-warning-light", .42, mount="north-wall")
def xray_light(sp):
    W, H = sp.w, sp.h
    sp.grad_rect(3, 3, W - 6, H - 6, hexc("#3a3f3c"), hexc("#262a28"), r=5)
    sp.grad_rect(10, 10, W - 20, H - 20, hexc("#ff6a57"), hexc("#c0281a"), r=3, ow=1.5)
    # "X-RAY" glyph bars (abstract, legible at size without real text rendering)
    cx, cy = W / 2, H / 2
    sp.line([(cx - 34, cy - 9), (cx - 22, cy + 9)], (255, 240, 225, 255), 3)
    sp.line([(cx - 34, cy + 9), (cx - 22, cy - 9)], (255, 240, 225, 255), 3)
    sp.line([(cx - 16, cy), (cx - 8, cy)], (255, 240, 225, 255), 3)
    for i, ch in enumerate("RAY"):
        x = cx - 2 + i * 13
        sp.line([(x, cy + 9), (x, cy - 9), (x + 8, cy - 9), (x + 8, cy + 9)] if ch == "A" else
                [(x, cy + 9), (x, cy - 9), (x + 8, cy - 9), (x + 8, cy), (x, cy), (x + 8, cy + 9)] if ch == "R" else
                [(x, cy - 9), (x + 4, cy), (x + 8, cy - 9), (x + 4, cy), (x + 4, cy + 9)], (255, 240, 225, 255), 2.5)
    sp.line([(cx + 15, cy + 2), (cx + 23, cy + 2)], (255, 240, 225, 255), 2.5)


@sprite("sanitizer-stand", .26)
def sanitizer_stand(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .40, 5)
    sp.grad_rect(W * .18, H - 16, W * .64, 10, hexc("#8f9a96"), hexc("#5f6a66"), r=4)
    sp.grad_rect(W * .44, H * .30, W * .12, H * .66, hexc("#c3cbc8"), hexc("#7e8885"), horiz=True, r=3)
    sp.grad_rect(W * .22, H * .08, W * .56, H * .26, hexc("#f4f4f0"), hexc("#c8ccc6"), r=7)
    sp.rect(W * .34, H * .13, W * .32, H * .09, hexc("#4f9bd0"), r=3)
    sp.rect(W * .40, H * .32, W * .20, H * .04, hexc("#9aa6a0"), r=2, outline=OUTLINE, ow=1.5)


@sprite("floor-scale", .36)
def floor_scale(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .46, 6)
    sp.grad_rect(W * .08, H * .86, W * .84, H * .11, hexc("#e8ebe7"), hexc("#a7b0ab"), r=6)
    sp.rect(W * .20, H * .88, W * .60, H * .04, hexc("#3f4744"), r=2)
    sp.grad_rect(W * .44, H * .22, W * .12, H * .66, hexc("#dfe3e0"), hexc("#8d9692"), horiz=True, r=3)
    sp.grad_rect(W * .26, H * .06, W * .48, H * .20, hexc("#f4f4f0"), hexc("#c8ccc6"), r=6)
    sp.rect(W * .33, H * .10, W * .34, H * .09, hexc("#3c5a4a"), r=2)
    sp.rect(W * .37, H * .125, W * .26, H * .04, hexc("#9fe0b0"), r=1)


@sprite("umbrella-stand", .24)
def umbrella_stand(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 5, W * .42, 5)
    for x, top, c in ((W * .34, H * .02, "#2f6b4f"), (W * .56, H * .10, "#b8483a"), (W * .46, H * .18, "#2f4f7a")):
        sp.line([(x, top + 10), (x, H * .55)], hexc("#3b3b3b"), 3)
        sp.line([(x, top + 6), (x + 7, top), (x + 12, top + 6)], hexc("#3b3b3b"), 3)
        sp.poly([(x - 8, H * .40), (x + 8, H * .40), (x + 4, H * .62), (x - 4, H * .62)], hexc(c), ow=1.5)
    sp.grad_rect(W * .14, H * .50, W * .72, H * .46, hexc("#7c5a3a"), hexc("#4f3622"), horiz=True, r=6)
    sp.line([(W * .14, H * .60), (W * .86, H * .60)], hexc("#b08452"), 2.5)


@sprite("step-stool", .34)
def step_stool(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .46, 5)
    leg = hexc("#9aa3a6")
    for x in (W * .14, W * .80):
        sp.grad_rect(x, H * .18, 8, H * .78, shade(leg, 1.2), shade(leg, .8), horiz=True, r=3)
    sp.grad_rect(W * .10, H * .14, W * .80, H * .14, hexc("#3e4744"), hexc("#262c2a"), r=4)
    sp.grad_rect(W * .10, H * .56, W * .80, H * .12, hexc("#3e4744"), hexc("#262c2a"), r=4)
    for y in (H * .16, H * .58):
        sp.line([(W * .16, y + 4), (W * .84, y + 4)], (120, 130, 126, 255), 1.5)


@sprite("lead-shield", .56)
def lead_shield(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 7, W * .48, 7)
    sp.grad_rect(W * .14, H - 22, W * .72, 10, hexc("#5f6a66"), hexc("#3d4542"), r=4)
    for x in (W * .16, W * .78):
        sp.ellipse(x - 2, H - 14, 12, 12, hexc("#2a2e2c"), ow=1.5)
    sp.grad_rect(W * .08, H * .06, W * .84, H * .74, hexc("#8b9a9f"), hexc("#55666c"), r=6)
    sp.grad_rect(W * .22, H * .14, W * .56, H * .26, hexc("#d8eef2"), hexc("#8fb6bf"), r=3, ow=1.5)
    sp.line([(W * .28, H * .36), (W * .44, H * .18)], (255, 255, 255, 140), 3)
    sp.rect(W * .30, H * .52, W * .40, H * .10, hexc("#e9d24a"), r=3, outline=OUTLINE, ow=1.2)


@sprite("linen-hamper", .36)
def linen_hamper(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .44, 5)
    frame = hexc("#9aa3a6")
    for x in (W * .14, W * .80):
        sp.grad_rect(x, H * .14, 7, H * .78, shade(frame, 1.2), shade(frame, .8), horiz=True, r=3)
    sp.poly([(W * .12, H * .16), (W * .88, H * .16), (W * .82, H * .80), (W * .18, H * .80)], hexc("#7fa6c9"))
    sp.poly([(W * .55, H * .18), (W * .86, H * .18), (W * .80, H * .78), (W * .58, H * .78)], hexc("#6b90b2"), outline=None)
    sp.grad_rect(W * .08, H * .10, W * .84, H * .09, hexc("#c3cbc8"), hexc("#7e8885"), r=3)
    sp.poly([(W * .20, H * .12), (W * .44, H * .02), (W * .70, H * .12)], hexc("#f2f2ec"), ow=1.5)
    for x in (W * .18, W * .76):
        sp.ellipse(x - 2, H - 13, 11, 11, hexc("#2a2e2c"), ow=1.5)


@sprite("positioning-pads", .52)
def positioning_pads(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 5, W * .48, 5)
    sp.grad_rect(W * .05, H * .62, W * .90, H * .32, hexc("#3b6e8f"), hexc("#264b63"), r=8)
    sp.poly([(W * .12, H * .62), (W * .78, H * .62), (W * .78, H * .30)], hexc("#4a86ab"))
    sp.grad_rect(W * .20, H * .14, W * .30, H * .20, hexc("#5a9cc2"), hexc("#3b6e8f"), r=10)


@sprite("sample-cart", .48)
def sample_cart(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .46, 6)
    post = hexc("#a9b2b5")
    for x in (W * .10, W * .86):
        sp.grad_rect(x, H * .22, 7, H * .68, shade(post, 1.2), shade(post, .8), horiz=True, r=3)
        sp.ellipse(x - 3, H - 14, 13, 13, hexc("#2a2e2c"), ow=1.5)
    for y in (H * .24, H * .64):
        sp.grad_rect(W * .06, y, W * .88, H * .07, hexc("#e2e6e4"), hexc("#9aa3a6"), r=3)
    # tube rack with coloured caps
    sp.rect(W * .16, H * .12, W * .40, H * .12, hexc("#f0f0ea"), r=2, outline=OUTLINE, ow=1.5)
    for i, c in enumerate(["#c0392b", "#7d3c98", "#2e86c1", "#f1c40f", "#27ae60"]):
        x = W * .19 + i * W * .07
        sp.rect(x, H * .03, W * .045, H * .11, hexc("#dfe8ec"), r=1, outline=OUTLINE, ow=1)
        sp.rect(x, H * .03, W * .045, H * .035, hexc(c), r=1)
    sp.grad_rect(W * .62, H * .12, W * .24, H * .12, hexc("#5aa0c8"), hexc("#3a7aa0"), r=2, ow=1.5)  # specimen bag box
    sp.rect(W * .20, H * .52, W * .56, H * .12, hexc("#cfd6d2"), r=2, outline=OUTLINE, ow=1.5)


@sprite("step-ladder", .40)
def step_ladder(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 5, W * .44, 5)
    rail = hexc("#e3b23c")
    sp.poly([(W * .30, H * .04), (W * .40, H * .04), (W * .26, H - 6), (W * .14, H - 6)], rail, ow=1.8)
    sp.poly([(W * .60, H * .04), (W * .70, H * .04), (W * .86, H - 6), (W * .74, H - 6)], shade(rail, .8), ow=1.8)
    sp.rect(W * .28, H * .02, W * .44, H * .06, hexc("#c0392b"), r=3, outline=OUTLINE, ow=1.5)
    for k in range(1, 5):
        y = H * (.04 + k * .19)
        x0 = W * (.35 - k * .045)
        sp.rect(x0 - 6, y, W * (.30 + k * .09), 7, hexc("#9aa3a6"), r=2, outline=OUTLINE, ow=1.2)


@sprite("repair-tag", .14)
def repair_tag(sp):
    W, H = sp.w, sp.h
    sp.line([(W * .5, 2), (W * .5, H * .30)], (60, 60, 60, 255), 2)
    sp.poly([(W * .15, H * .30), (W * .85, H * .30), (W * .85, H - 4), (W * .15, H - 4)], hexc("#e74c3c"), ow=1.5)
    sp.ellipse(W * .42, H * .36, W * .16, W * .16, (255, 255, 255, 255), ow=1)
    sp.line([(W * .28, H * .62), (W * .72, H * .62)], (255, 235, 230, 255), 2)
    sp.line([(W * .28, H * .76), (W * .62, H * .76)], (255, 235, 230, 255), 2)


@sprite("corridor-bench", .96)
def corridor_bench(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 7)
    wood, cushion = hexc("#7a5434"), hexc("#3f6b4d")
    for x in (W * .06, W * .88):
        sp.grad_rect(x, H * .40, 14, H * .56, shade(wood, 1.1), shade(wood, .75), horiz=True, r=3)
    sp.grad_rect(W * .04, H * .06, W * .92, H * .34, shade(cushion, 1.15), shade(cushion, .85), r=10)  # backrest
    for x in (W * .30, W * .52, W * .74):
        sp.line([(x, H * .10), (x, H * .36)], shade(cushion, .7), 2)
    sp.grad_rect(W * .02, H * .38, W * .96, H * .22, shade(cushion, 1.2), shade(cushion, .9), r=10)  # seat
    sp.grad_rect(W * .04, H * .58, W * .92, H * .08, shade(wood, 1.15), shade(wood, .8), r=3)


@sprite("curtain-bunch", .26)
def curtain_bunch(sp):
    """Privacy curtain pulled back against the end of a bay divider."""
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 5, W * .48, 5)
    fabric = hexc("#a9cfc0")
    sp.rect(2, 2, W - 4, 9, hexc("#8d969a"), r=4, outline=OUTLINE, ow=1.5)          # ceiling track end
    for k in range(5):
        sp.ellipse(6 + k * (W - 16) / 4, 6, 6, 9, hexc("#d9dedc"), ow=1)           # hooks
    folds = 5
    fw = (W - 8) / folds
    for i in range(folds):
        x = 4 + i * fw
        c = shade(fabric, 1.14 if i % 2 == 0 else .84)
        sway = 3 if i % 2 else -3
        sp.poly([(x, 12), (x + fw, 12), (x + fw + sway, H - 10), (x + sway, H - 10)], c, outline=None)
        # faint printed dots
        for y in range(28, int(H - 14), 26):
            sp.ellipse(x + fw * .35 + sway * (y / H), y, 4, 4, shade(fabric, 1.3), outline=None)
    sp.poly([(4, 12), (W - 4, 12), (W - 1, H - 10), (1, H - 10)], (0, 0, 0, 0), ow=1.8)
    # scalloped hem
    for i in range(folds):
        x = 2 + i * fw
        sp.ellipse(x, H - 16, fw + 2, 12, shade(fabric, .95 if i % 2 else 1.08), ow=1.2)
    sp.rect(2, H * .42, W - 4, 7, hexc("#6f9484"), r=3, outline=OUTLINE, ow=1.2)    # tie-back


@sprite("cpr-manikin", .62)
def cpr_manikin(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 6, W * .48, 6)
    sp.grad_rect(W * .02, H * .40, W * .96, H * .54, hexc("#3f6b8f"), hexc("#2b4c66"), r=8)  # mat
    skin = hexc("#e8b48f")
    sp.ellipse(W * .08, H * .46, W * .18, H * .34, skin, ow=1.8)      # head
    sp.grad_rect(W * .26, H * .44, W * .44, H * .40, hexc("#e9edf0"), hexc("#b8c2c8"), r=10, ow=1.8)  # torso
    sp.ellipse(W * .40, H * .54, W * .14, H * .20, shade(skin, .95), ow=1.2)
    sp.rect(W * .70, H * .52, W * .20, H * .24, hexc("#2e3a44"), r=6, outline=OUTLINE, ow=1.5)  # hips


@sprite("plant-small", .30)
def plant_small(sp):
    W, H = sp.w, sp.h
    shadow_under(sp, W / 2, H - 5, W * .40, 5)
    leaf = hexc("#4f8a4c")
    for k, (dx, dy, rot) in enumerate([(-.18, .30, -.6), (.18, .30, .6), (0, .18, 0), (-.28, .44, -1.0), (.28, .44, 1.0)]):
        cx, cy = W * (.5 + dx), H * dy
        pts = []
        for t in range(12):
            a = t / 12 * 2 * math.pi
            x, y = 9 * math.cos(a), 20 * math.sin(a)
            pts.append((cx + x * math.cos(rot) - y * math.sin(rot), cy + x * math.sin(rot) + y * math.cos(rot)))
        sp.poly(pts, shade(leaf, 1.15 if k % 2 else .9), ow=1.5)
    sp.poly([(W * .24, H * .56), (W * .76, H * .56), (W * .68, H - 5), (W * .32, H - 5)], hexc("#c06a45"), ow=1.8)
    sp.rect(W * .20, H * .53, W * .60, H * .07, hexc("#d37e57"), r=3, outline=OUTLINE, ow=1.5)


def build():
    os.makedirs(OUT, exist_ok=True)
    # height/width aspect per sprite (native px at 240 px/tile)
    aspect = {
        "trash-bin": 1.30, "recycle-bin": 1.30, "biohazard-bin": 1.20, "sharps-wall": 1.30,
        "glove-box-wall": .62, "towel-dispenser": 1.25, "soap-sanitizer-wall": 1.55, "grab-bar": .22,
        "wall-clock": 1.0, "wall-tv": .62, "xray-warning-light": .42, "sanitizer-stand": 3.3,
        "floor-scale": 2.9, "umbrella-stand": 2.2, "step-stool": 1.05, "lead-shield": 1.75,
        "linen-hamper": 1.45, "positioning-pads": .62, "sample-cart": 1.25, "step-ladder": 2.4,
        "repair-tag": 1.4, "corridor-bench": .52, "curtain-bunch": 3.4, "cpr-manikin": .42,
        "plant-small": 1.6,
    }
    manifest = {"density": TILE, "sprites": {}}
    for name, (fn, w_tiles, anchor_y, mount) in SPRITES.items():
        w = max(8, int(round(w_tiles * TILE)))
        h = max(8, int(round(w * aspect[name])))
        sp = Sprite(w, h)
        fn(sp)
        sp.save(name)
        manifest["sprites"][name] = {"width": w, "height": h, "widthTiles": w_tiles, "anchorY": anchor_y, "mount": mount}
    with open(os.path.join(OUT, "manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)
    print("wrote", len(manifest["sprites"]), "sprites to", os.path.normpath(OUT))


if __name__ == "__main__":
    build()
