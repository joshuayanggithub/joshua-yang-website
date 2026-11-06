"""Write a small .usda that sublayers a trajectory and makes it renderable with usdrecord:
camera, sane lights, instancing off for directly-instanced gprims, and the viewer's colours.
The original .usd files are never modified."""
import sys, os, re
from pxr import Usd, UsdGeom, UsdLux, Gf, Sdf, Vt

src, out = os.path.abspath(sys.argv[1]), sys.argv[2]
eye = Gf.Vec3d(*map(float, sys.argv[3].split(",")))
target = Gf.Vec3d(*map(float, sys.argv[4].split(",")))

stage = Usd.Stage.CreateNew(out)
root = stage.GetRootLayer()
root.subLayerPaths.append(src)
srcLayer = Sdf.Layer.FindOrOpen(src)
stage.SetStartTimeCode(srcLayer.startTimeCode); stage.SetEndTimeCode(srcLayer.endTimeCode)
stage.SetFramesPerSecond(60); UsdGeom.SetStageUpAxis(stage, UsdGeom.Tokens.y)

def rgb(h): return Gf.Vec3f(*[int(h[i:i+2], 16) / 255 for i in (0, 2, 4)])
# palette sampled from the reference recording
LINK = {"link1": "7fdc6a", "link2": "c9a6e6", "link3": "f2a9e0", "link4": "e6e86a",
        "link5": "7ecbe6", "link6": "7fdc6a", "link7": "c9a6e6", "finger": "f2a9e0"}
TABLE, CLOTH, BASE = "c79a90", "e8835a", "f2f2f2"

def color(prim, hexcolor):
    UsdGeom.Gprim(prim).CreateDisplayColorAttr(Vt.Vec3fArray([rgb(hexcolor)])) if prim.IsA(UsdGeom.Gprim) else \
        UsdGeom.PrimvarsAPI(prim).CreatePrimvar("displayColor", Sdf.ValueTypeNames.Color3fArray, UsdGeom.Tokens.constant).Set(Vt.Vec3fArray([rgb(hexcolor)]))

# 1) Storm skips gprims that are instanced directly: de-instance them
for prim in list(stage.Traverse()):
    if prim.IsInstanceable():
        prim.SetInstanceable(False)

# 2) colours (after de-instancing, so the referenced gprims are reachable)
for prim in stage.Traverse():
    path = str(prim.GetPath())
    if not prim.IsA(UsdGeom.Gprim): continue
    m = re.search(r"/body_\d+_fr3_(link\d|leftfinger|rightfinger)", path)
    if m:
        key = "finger" if "finger" in m.group(1) else m.group(1)
        color(prim, LINK[key])
    elif prim.IsA(UsdGeom.Cube): color(prim, TABLE)                 # the table (shape index varies per file)
    elif path.startswith("/root/shape_"): color(prim, BASE)          # robot bases
    elif path.startswith("/root/surface") or path.startswith("/root/particles"): color(prim, CLOTH)

# 3) lights: the file authors exposure 9-10 (x512-1024), which clips everything to white
for p, inten in (("/dome_light", 0.15), ("/distant_light", 0.72)):
    light = UsdLux.LightAPI(stage.GetPrimAtPath(p))
    light.CreateExposureAttr(0.0); light.CreateIntensityAttr(inten)

# 4) camera (3:2)
cam = UsdGeom.Camera.Define(stage, "/RenderCam")
cam.AddTransformOp().Set(Gf.Matrix4d().SetLookAt(eye, target, Gf.Vec3d(0, 1, 0)).GetInverse())
cam.CreateFocalLengthAttr(35); cam.CreateHorizontalApertureAttr(36); cam.CreateVerticalApertureAttr(24)
cam.CreateClippingRangeAttr(Gf.Vec2f(0.05, 200))
root.Save(); print("wrote", out)
