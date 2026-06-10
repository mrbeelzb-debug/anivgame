import math
from pathlib import Path

import bpy
from mathutils import Vector


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "models"
OUT_FILE = OUT_DIR / "marvellyn_chibi.glb"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def mat(name, color, roughness=0.55, metallic=0.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return material


def shade(obj):
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    try:
        bpy.ops.object.shade_smooth()
    finally:
        obj.select_set(False)
    return obj


def sphere(name, loc, scale, material, segments=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    return shade(obj)


def cube(name, loc, scale, material, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    obj.data.materials.append(material)
    if bevel:
        modifier = obj.modifiers.new("soft edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 8
        obj.modifiers.new("smooth skin", "WEIGHTED_NORMAL")
    return obj


def cylinder(name, loc, radius, depth, material, vertices=48, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    return shade(obj)


def cylinder_between(name, start, end, radius, material):
    start = Vector(start)
    end = Vector(end)
    mid = (start + end) * 0.5
    direction = end - start
    length = direction.length
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=radius, depth=length, location=mid)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    obj.rotation_euler = direction.to_track_quat("Z", "Y").to_euler()
    return shade(obj)


def add_curve_line(name, points, material, bevel=0.012):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 12
    curve.bevel_depth = bevel
    curve.bevel_resolution = 4
    poly = curve.splines.new("POLY")
    poly.points.add(len(points) - 1)
    for point, co in zip(poly.points, points):
        point.co = (co[0], co[1], co[2], 1)
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj


def add_text(name, body, loc, size, material):
    bpy.ops.object.text_add(location=loc, rotation=(math.pi / 2, 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = body
    obj.data.align_x = "CENTER"
    obj.data.align_y = "CENTER"
    obj.data.size = size
    obj.data.extrude = 0.006
    obj.data.materials.append(material)
    bpy.ops.object.convert(target="MESH")
    return bpy.context.object


def make_heart_mesh(name, loc, scale, material):
    verts = []
    faces = []
    steps = 48
    for layer, y in enumerate([-0.035, 0.035]):
        for i in range(steps):
            t = 2 * math.pi * i / steps
            x = 16 * math.sin(t) ** 3 / 18
            z = (13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)) / 18
            verts.append((x * scale[0], y * scale[1], z * scale[2]))
    for i in range(steps):
        j = (i + 1) % steps
        faces.append((i, j, steps + j, steps + i))
    faces.append(tuple(range(steps - 1, -1, -1)))
    faces.append(tuple(range(steps, steps * 2)))
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = loc
    obj.rotation_euler = (math.radians(8), 0, 0)
    obj.data.materials.append(material)
    return shade(obj)


def build_model():
    skin = mat("warm soft skin", (0.98, 0.69, 0.57, 1))
    blush = mat("soft cheek blush", (0.93, 0.36, 0.52, 1))
    hair = mat("glossy black bob hair", (0.025, 0.021, 0.02, 1), 0.32)
    hair_highlight = mat("blue black hair highlight", (0.07, 0.08, 0.12, 1), 0.38)
    maroon = mat("maroon cropped SPRINGS jersey", (0.42, 0.045, 0.075, 1))
    white = mat("white trim and letters", (0.98, 0.95, 0.88, 1))
    denim = mat("washed blue wide jeans", (0.18, 0.34, 0.47, 1))
    denim_dark = mat("dark denim seams", (0.07, 0.16, 0.23, 1))
    shoe_red = mat("maroon sneaker canvas", (0.48, 0.06, 0.08, 1))
    eye = mat("deep brown eyes", (0.09, 0.035, 0.018, 1), 0.22)
    black = mat("black details", (0.005, 0.004, 0.004, 1))
    gold = mat("gold charm metal", (1.0, 0.62, 0.18, 1), 0.28, 0.2)
    pink = mat("pink heart gem", (1.0, 0.12, 0.38, 1), 0.25)

    # Body proportions are deliberately doll-like: big head, short torso, wide soft jeans.
    sphere("head", (0, -0.02, 3.55), (0.54, 0.49, 0.58), skin)
    sphere("neck", (0, 0, 2.92), (0.16, 0.13, 0.18), skin)
    sphere("belly", (0, -0.01, 2.18), (0.31, 0.21, 0.39), skin)
    sphere("tiny navel", (0, -0.235, 2.05), (0.025, 0.011, 0.025), denim_dark, 24, 12)

    cube("cropped maroon jersey", (0, -0.005, 2.5), (0.43, 0.22, 0.34), maroon, 0.08)
    cube("shirt lower soft curve", (0, -0.025, 2.23), (0.37, 0.205, 0.08), maroon, 0.045)
    cube("white v neck left", (-0.115, -0.245, 2.78), (0.025, 0.012, 0.18), white, 0.01).rotation_euler[1] = math.radians(-35)
    cube("white v neck right", (0.115, -0.245, 2.78), (0.025, 0.012, 0.18), white, 0.01).rotation_euler[1] = math.radians(35)
    cube("left shirt side stripe", (-0.39, -0.235, 2.42), (0.018, 0.012, 0.31), white, 0.008)
    cube("right shirt side stripe", (0.39, -0.235, 2.42), (0.018, 0.012, 0.31), white, 0.008)
    add_text("SPRINGS chest text", "SPRINGS", (0, -0.255, 2.52), 0.145, white)

    # Hair: layered bob shell, side volume, center part, and soft forehead.
    sphere("back bob hair", (0, 0.12, 3.57), (0.66, 0.52, 0.64), hair)
    sphere("left bob volume", (-0.42, -0.03, 3.42), (0.2, 0.25, 0.48), hair)
    sphere("right bob volume", (0.42, -0.03, 3.42), (0.2, 0.25, 0.48), hair)
    sphere("left front sweep", (-0.2, -0.24, 3.85), (0.33, 0.14, 0.18), hair_highlight)
    sphere("right front sweep", (0.21, -0.25, 3.86), (0.33, 0.14, 0.18), hair)
    add_curve_line("center hair part", [(0, -0.53, 3.74), (0.03, -0.52, 3.95), (0.08, -0.49, 4.07)], black, 0.01)
    for i, x in enumerate([-0.34, -0.23, -0.12, 0.13, 0.25, 0.36]):
        sphere(f"rounded bang {i + 1}", (x, -0.45, 3.83 - abs(x) * 0.22), (0.085, 0.055, 0.17), hair, 24, 12)
    for i, x in enumerate([-0.5, 0.5]):
        sphere(f"curled hair tip {i}", (x, -0.05, 3.05), (0.13, 0.16, 0.2), hair, 32, 16)

    # Face with natural smile, big eyes, brows, blush.
    sphere("left eye", (-0.18, -0.475, 3.58), (0.105, 0.026, 0.15), eye, 48, 16)
    sphere("right eye", (0.18, -0.475, 3.58), (0.105, 0.026, 0.15), eye, 48, 16)
    sphere("left eye shine", (-0.215, -0.498, 3.62), (0.027, 0.008, 0.036), white, 16, 8)
    sphere("right eye shine", (0.145, -0.498, 3.62), (0.027, 0.008, 0.036), white, 16, 8)
    add_curve_line("left eyebrow", [(-0.32, -0.5, 3.77), (-0.2, -0.53, 3.82), (-0.08, -0.5, 3.79)], black, 0.014)
    add_curve_line("right eyebrow", [(0.08, -0.5, 3.79), (0.2, -0.53, 3.82), (0.32, -0.5, 3.77)], black, 0.014)
    add_curve_line("smile", [(-0.08, -0.505, 3.33), (0, -0.535, 3.3), (0.09, -0.505, 3.33)], mat("soft rose smile", (0.7, 0.18, 0.24, 1)), 0.014)
    sphere("left blush", (-0.35, -0.49, 3.36), (0.09, 0.012, 0.045), blush, 24, 8)
    sphere("right blush", (0.35, -0.49, 3.36), (0.09, 0.012, 0.045), blush, 24, 8)

    # Arms posed at hips, based on the reference image.
    for side in [-1, 1]:
        x = side
        cylinder_between(f"{'left' if side < 0 else 'right'} upper arm", (0.42 * x, -0.02, 2.66), (0.68 * x, -0.08, 2.25), 0.075, skin)
        cylinder_between(f"{'left' if side < 0 else 'right'} forearm on hip", (0.68 * x, -0.08, 2.25), (0.48 * x, -0.25, 2.08), 0.072, skin)
        sphere(f"{'left' if side < 0 else 'right'} hand", (0.46 * x, -0.28, 2.06), (0.105, 0.06, 0.075), skin, 32, 12)
        sphere(f"{'left' if side < 0 else 'right'} sleeve cap", (0.45 * x, -0.055, 2.65), (0.15, 0.11, 0.15), maroon, 32, 12)
        cylinder_between(f"{'left' if side < 0 else 'right'} white sleeve trim", (0.48 * x, -0.16, 2.66), (0.58 * x, -0.14, 2.53), 0.019, white)

    # Wide jeans, waistband, details, and shoes.
    cylinder("wide jean waist", (0, -0.005, 1.86), 0.43, 0.24, denim, 64, (math.pi / 2, 0, 0))
    cube("front belt rim", (0, -0.24, 1.92), (0.46, 0.026, 0.035), white, 0.012)
    sphere("silver jeans button", (0, -0.276, 1.94), (0.045, 0.012, 0.045), white, 24, 8)
    for side in [-1, 1]:
        cylinder(f"{'left' if side < 0 else 'right'} wide jean leg", (0.19 * side, 0, 1.18), 0.18, 1.32, denim, 64)
        cube(f"{'left' if side < 0 else 'right'} jean front plane", (0.19 * side, -0.18, 1.18), (0.17, 0.025, 0.62), denim, 0.025)
        add_curve_line(f"{'left' if side < 0 else 'right'} orange side seam", [(0.33 * side, -0.17, 1.75), (0.35 * side, -0.18, 1.15), (0.32 * side, -0.18, 0.56)], mat("warm jean stitching", (0.9, 0.46, 0.18, 1)), 0.006)
        sphere(f"{'left' if side < 0 else 'right'} sneaker base", (0.2 * side, -0.08, 0.43), (0.2, 0.3, 0.09), white, 48, 12)
        sphere(f"{'left' if side < 0 else 'right'} sneaker red top", (0.2 * side, -0.18, 0.48), (0.15, 0.17, 0.06), shoe_red, 32, 8)
        add_curve_line(f"{'left' if side < 0 else 'right'} shoelace", [(0.12 * side, -0.32, 0.53), (0.2 * side, -0.36, 0.55), (0.28 * side, -0.32, 0.53)], white, 0.008)

    add_curve_line("gold charm chain", [(0.34, -0.27, 1.9), (0.39, -0.28, 1.72), (0.35, -0.29, 1.57)], gold, 0.008)
    make_heart_mesh("tiny hanging heart charm", (0.35, -0.31, 1.5), (0.08, 0.5, 0.08), pink)

    # Add a simple rig-friendly origin and warm preview lighting.
    bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 0, 0))
    bpy.context.object.name = "model_root"
    bpy.ops.object.light_add(type="AREA", location=(0, -3.5, 5.2))
    bpy.context.object.name = "large softbox"
    bpy.context.object.data.energy = 450
    bpy.context.object.data.size = 5
    bpy.ops.object.camera_add(location=(0, -6.3, 2.8), rotation=(math.radians(72), 0, 0))
    bpy.context.scene.camera = bpy.context.object


def export_glb():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(OUT_FILE),
        export_format="GLB",
        export_yup=True,
        export_apply=True,
    )


clear_scene()
build_model()
export_glb()
print(f"Exported {OUT_FILE}")
