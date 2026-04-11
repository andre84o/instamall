"""
Generates palm-overlay.png: 562x1000 RGBA image, transparent background,
with tropical palm/monstera leaf decorations in top-left and bottom-right corners.
"""
import math
from PIL import Image, ImageDraw

W, H = 562, 1000

img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# ── Color palette ──
DARK   = (27,  67,  50,  230)   # #1B4332
MED    = (45, 106,  79,  220)   # #2D6A4F
BRIGHT = (64, 145, 108,  210)   # #40916C
LIGHT  = (82, 183, 136,  190)   # #52B788
PALE   = (116, 198, 157, 170)   # #74C69D

def draw_leaf(draw, base, tip, color, width_ratio=0.22):
    """Draw a single tapered leaf from base to tip."""
    bx, by = base
    tx, ty = tip
    dx, dy = tx - bx, ty - by
    length = math.hypot(dx, dy)
    if length < 2:
        return
    # Normal (perpendicular) unit vector
    nx, ny = -dy / length, dx / length
    half_w = length * width_ratio
    # Mid-point with slight lateral offset for curvature
    mx = (bx + tx) / 2 + nx * half_w * 0.4
    my = (by + ty) / 2 + ny * half_w * 0.4
    # Build a polygon approximating the bezier leaf shape
    steps = 16
    side_a, side_b = [], []
    for i in range(steps + 1):
        t = i / steps
        # One curved edge
        px = (1-t)**2 * bx + 2*(1-t)*t * (mx + nx*half_w) + t**2 * tx
        py = (1-t)**2 * by + 2*(1-t)*t * (my + ny*half_w) + t**2 * ty
        side_a.append((px, py))
        # Other curved edge
        qx = (1-t)**2 * bx + 2*(1-t)*t * (mx - nx*half_w) + t**2 * tx
        qy = (1-t)**2 * by + 2*(1-t)*t * (my - ny*half_w) + t**2 * ty
        side_b.append((qx, qy))
    poly = side_a + list(reversed(side_b))
    draw.polygon(poly, fill=color)

def draw_palm_frond(draw, sx, sy, cpx, cpy, ex, ey,
                    stem_color, left_color, right_color,
                    stem_width, max_leaf_len, num_pairs):
    """Draw a palm frond: curved stem + leaflet pairs along it."""
    # Draw stem as a series of line segments
    pts = []
    steps = 40
    for i in range(steps + 1):
        t = i / steps
        x = (1-t)**2 * sx + 2*(1-t)*t * cpx + t**2 * ex
        y = (1-t)**2 * sy + 2*(1-t)*t * cpy + t**2 * ey
        pts.append((x, y))
    for i in range(len(pts) - 1):
        draw.line([pts[i], pts[i+1]], fill=stem_color, width=stem_width)

    # Draw leaflet pairs at evenly-spaced t values
    for i in range(1, num_pairs + 1):
        t = i / (num_pairs + 1)
        # Bezier point
        bx = (1-t)**2 * sx + 2*(1-t)*t * cpx + t**2 * ex
        by = (1-t)**2 * sy + 2*(1-t)*t * cpy + t**2 * ey
        # Tangent
        tdx = 2*(1-t)*(cpx - sx) + 2*t*(ex - cpx)
        tdy = 2*(1-t)*(cpy - sy) + 2*t*(ey - cpy)
        tlen = math.hypot(tdx, tdy)
        if tlen < 0.001:
            continue
        nx = -tdy / tlen
        ny =  tdx / tlen
        # Leaf length: sinusoidal peak in middle
        ll = max_leaf_len * (0.15 + 0.85 * math.sin(t * math.pi))
        draw_leaf(draw, (bx, by), (bx + nx*ll, by + ny*ll), left_color)
        draw_leaf(draw, (bx, by), (bx - nx*ll, by - ny*ll), right_color)

# ── Top-left corner fronds ──
# Frond 1: diagonal down-right (biggest)
draw_palm_frond(draw, 0, 0, 40, 175, 115, 380,
                DARK, MED, BRIGHT, 13, 170, 6)
# Frond 2: more horizontal right
draw_palm_frond(draw, 0, 30, 140, 70, 350, 155,
                DARK, BRIGHT, LIGHT, 10, 150, 6)
# Frond 3: steeper from top edge
draw_palm_frond(draw, 50, 0, 115, 115, 195, 320,
                MED, LIGHT, PALE, 9, 125, 5)

# ── Bottom-right corner fronds (mirror: W-x, H-y) ──
draw_palm_frond(draw, W, H,    W-40, H-175, W-115, H-380,
                DARK, MED, BRIGHT, 13, 170, 6)
draw_palm_frond(draw, W, H-30, W-140, H-70, W-350, H-155,
                DARK, BRIGHT, LIGHT, 10, 150, 6)
draw_palm_frond(draw, W-50, H, W-115, H-115, W-195, H-320,
                MED, LIGHT, PALE, 9, 125, 5)

out = "C:/A-project/Egen/instamall/.claude/worktrees/compassionate-shaw/public/palm-overlay.png"
img.save(out, "PNG")
print(f"Saved {W}x{H} RGBA to {out}")
