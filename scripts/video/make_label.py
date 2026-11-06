"""Render a filename label as a transparent PNG (this ffmpeg build has no drawtext filter).
usage: make_label.py <text> <out.png> <font_px>"""
import sys
from PIL import Image, ImageDraw, ImageFont
text, out, px = sys.argv[1], sys.argv[2], int(sys.argv[3])
font = None
for path in ("/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/SFNSMono.ttf", "/System/Library/Fonts/Monaco.ttf"):
    try: font = ImageFont.truetype(path, px); break
    except OSError: pass
font = font or ImageFont.load_default()
pad = max(4, px // 3)
l, t, r, b = font.getbbox(text)
img = Image.new("RGBA", (r - l + 2 * pad, b - t + 2 * pad), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0, 0, img.width - 1, img.height - 1], radius=pad, fill=(0, 0, 0, 170))
d.text((pad - l, pad - t), text, font=font, fill=(255, 255, 255, 235))
img.save(out)
