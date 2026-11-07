# ---------------------------------------------------------------------------
# Shared geometry helpers (pure numpy + trimesh). Y-up, character faces +Z,
# units = metres.  Left of the character (when it faces +Z) is +X.
# ---------------------------------------------------------------------------
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

I4 = np.eye(4)


def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def T(pos=(0, 0, 0), R=None):
    m = np.eye(4)
    if R is not None:
        m[:3, :3] = R
    m[:3, 3] = pos
    return m


def rot_axis(axis, deg):
    return trimesh.transformations.rotation_matrix(np.radians(deg), unit(axis))[:3, :3]


def align(a, b):
    """3x3 rotation taking direction a onto direction b."""
    a, b = unit(a), unit(b)
    if np.allclose(a, b):
        return np.eye(3)
    if np.allclose(a, -b):
        perp = unit(np.cross(a, [1, 0, 0]) if abs(a[0]) < .9 else np.cross(a, [0, 1, 0]))
        return rot_axis(perp, 180)
    return trimesh.geometry.align_vectors(a, b)[:3, :3]


def mat(name, rgb, metallic=0.0, rough=0.4, emissive=None, alpha=1.0, double=False):
    rgba = np.round(np.array(list(rgb) + [alpha]) * 255).astype(np.uint8)
    m = PBRMaterial(name=name, baseColorFactor=rgba, metallicFactor=metallic,
                    roughnessFactor=rough,
                    emissiveFactor=None if emissive is None else np.array(emissive, float))
    if alpha < 1.0:
        m.alphaMode = 'BLEND'
    m.doubleSided = bool(double)
    return m


def finish(mesh, material, name):
    mesh.merge_vertices()
    mesh.update_faces(mesh.nondegenerate_faces())
    mesh.remove_unreferenced_vertices()
    mesh.visual = trimesh.visual.TextureVisuals(material=material)
    _ = mesh.vertex_normals  # smooth normals -> exported as NORMAL
    mesh.metadata['name'] = name
    return mesh


def cat(meshes):
    meshes = [m for m in meshes if m is not None]
    return trimesh.util.concatenate(meshes)


def xf(mesh, M):
    mesh = mesh.copy()
    mesh.apply_transform(M)
    return mesh


# ----------------------------------------------------------------- surfaces
def _sp(x, p):
    return np.sign(x) * np.abs(x) ** p


def superellipsoid(radii=(1, 1, 1), e1=1.0, e2=1.0, nu=64, nv=32, keep=None):
    """Smooth (super)ellipsoid centred on the origin. e=1 -> ellipsoid,
    e<1 -> boxier.  u=0 faces +Z, u=+90deg faces +X.  keep(p_normalised)->bool
    mask on face centroids lets us cut openings (used for the visor)."""
    a, b, c = radii
    u = np.linspace(-np.pi, np.pi, nu + 1)
    v = np.linspace(-np.pi / 2, np.pi / 2, nv + 1)
    U, V = np.meshgrid(u, v)
    cv, sv = _sp(np.cos(V), e1), _sp(np.sin(V), e1)
    X = a * cv * _sp(np.sin(U), e2)
    Y = b * sv
    Z = c * cv * _sp(np.cos(U), e2)
    verts = np.stack([X, Y, Z], -1).reshape(-1, 3)
    idx = np.arange((nv + 1) * (nu + 1)).reshape(nv + 1, nu + 1)
    A, B, C, D = idx[:-1, :-1], idx[:-1, 1:], idx[1:, :-1], idx[1:, 1:]
    faces = np.concatenate([np.stack([A, C, D], -1).reshape(-1, 3),
                            np.stack([A, D, B], -1).reshape(-1, 3)])
    m = trimesh.Trimesh(verts, faces, process=False)
    if m.volume < 0:
        m.invert()
    if keep is not None:
        cen = m.vertices[m.faces].mean(1) / np.array(radii)
        m = trimesh.Trimesh(m.vertices, m.faces[keep(cen)], process=False)
    return m


def ellipsoid(radii, pos=(0, 0, 0), R=None, **kw):
    return xf(superellipsoid(radii, **kw), T(pos, R))


def lathe(profile, sections=48):
    """Revolve (radius, height) profile about Z. Profile should start and end
    at radius 0 so the solid is closed."""
    prof = np.asarray(profile, float)
    th = np.linspace(0, 2 * np.pi, sections + 1)
    V = np.concatenate([np.stack([r * np.cos(th), r * np.sin(th), np.full_like(th, h)], 1)
                        for r, h in prof])
    n = len(prof)
    idx = np.arange(n * (sections + 1)).reshape(n, sections + 1)
    A, B, C, D = idx[:-1, :-1], idx[:-1, 1:], idx[1:, :-1], idx[1:, 1:]
    F = np.concatenate([np.stack([A, B, D], -1).reshape(-1, 3),
                        np.stack([A, D, C], -1).reshape(-1, 3)])
    m = trimesh.Trimesh(V, F, process=False)
    m.merge_vertices()
    m.update_faces(m.nondegenerate_faces())
    if m.volume < 0:
        m.invert()
    return m


def rounded_disc(R, half_t, bevel, sections=64):
    """Disc (axis Z) with rounded rim."""
    pts = [(0, -half_t)]
    for a in np.linspace(-np.pi / 2, 0, 8):          # lower bevel
        pts.append((R - bevel + bevel * np.cos(a), -half_t + bevel + bevel * np.sin(a)))
    for a in np.linspace(0, np.pi / 2, 8):           # upper bevel
        pts.append((R - bevel + bevel * np.cos(a), half_t - bevel + bevel * np.sin(a)))
    pts.append((0, half_t))
    return lathe(pts, sections)


def tube(points, radius, sections=14, closed=False, caps=True, normals=None):
    """Smooth tube swept along a polyline (parallel-transport frames)."""
    P = np.asarray(points, float)
    n = len(P)
    rad = np.full(n, radius, float) if np.isscalar(radius) else np.asarray(radius, float)
    Tg = np.gradient(P, axis=0)
    if closed:
        Tg = np.roll(P, -1, 0) - np.roll(P, 1, 0)
    Tg = Tg / np.linalg.norm(Tg, axis=1)[:, None]
    N = np.zeros_like(P)
    if normals is not None:
        N = np.asarray(normals, float)
        N = N - (N * Tg).sum(1)[:, None] * Tg
        N = N / np.linalg.norm(N, axis=1)[:, None]
    else:
        n0 = np.cross(Tg[0], [0, 1, 0])
        if np.linalg.norm(n0) < 1e-6:
            n0 = np.cross(Tg[0], [1, 0, 0])
        N[0] = unit(n0)
        for i in range(1, n):
            R = align(Tg[i - 1], Tg[i])
            N[i] = unit(R @ N[i - 1])
        if closed:   # spread out the closing twist
            Nt = unit(align(Tg[-1], Tg[0]) @ N[-1])
            B0 = np.cross(Tg[0], N[0])
            ang = np.arctan2(Nt @ B0, Nt @ N[0])
            for i in range(n):
                N[i] = unit(rot_axis(Tg[i], np.degrees(-ang * i / n)) @ N[i])
    B = np.cross(Tg, N)
    phi = np.linspace(0, 2 * np.pi, sections, endpoint=False)
    ring = (np.cos(phi)[None, :, None] * N[:, None, :] + np.sin(phi)[None, :, None] * B[:, None, :])
    V = (P[:, None, :] + rad[:, None, None] * ring).reshape(-1, 3)
    segs = n if closed else n - 1
    F = []
    for i in range(segs):
        i2 = (i + 1) % n
        for j in range(sections):
            j2 = (j + 1) % sections
            a, b, c, d = i * sections + j, i * sections + j2, i2 * sections + j, i2 * sections + j2
            F += [[a, b, d], [a, d, c]]
    F = np.array(F)
    m = trimesh.Trimesh(V, F, process=False)
    # make sure face normals point away from the centre line
    fn = m.face_normals
    fc = m.triangles_center
    seg = np.minimum(np.arange(len(F)) // (2 * sections), n - 1)
    if np.mean(((fc - P[seg]) * fn).sum(1)) < 0:
        m = trimesh.Trimesh(V, F[:, ::-1], process=False)
    parts = [m]
    if caps and not closed:
        for k in (0, -1):
            parts.append(ellipsoid((rad[k],) * 3, P[k], nu=20, nv=10))
    return cat(parts)


def ring(center, R, r, axis, nmaj=72, nmin=16):
    """Torus about `axis` through `center`."""
    ax = unit(axis)
    e1 = unit(np.cross(ax, [0, 1, 0]) if abs(ax[1]) < .95 else np.cross(ax, [1, 0, 0]))
    e2 = np.cross(ax, e1)
    t = np.linspace(0, 2 * np.pi, nmaj, endpoint=False)
    pts = center + R * (np.cos(t)[:, None] * e1 + np.sin(t)[:, None] * e2)
    nrm = np.cos(t)[:, None] * e1 + np.sin(t)[:, None] * e2
    return tube(pts, r, sections=nmin, closed=True, normals=nrm)


def on_ellipsoid(center, radii, x, y, sign=1.0, scale=1.0):
    """Point + outward normal on an ellipsoid surface at given (x,y); z sign = front/back."""
    a, b, c = np.array(radii) * scale
    cx, cy, cz = center
    q = 1 - ((x - cx) / a) ** 2 - ((y - cy) / b) ** 2
    z = cz + sign * c * np.sqrt(max(q, 1e-9))
    p = np.array([x, y, z])
    n = unit([(x - cx) / a ** 2, (y - cy) / b ** 2, (z - cz) / c ** 2])
    return p, n


def helper_register():
    pass


class Rig:
    """Tiny helper that builds a node hierarchy with pivots at joints."""
    def __init__(self, root):
        self.scene = trimesh.Scene()
        self.root = root
        self.scene.graph.update(frame_to=root, frame_from=self.scene.graph.base_frame, matrix=I4)
        self.pivots = {root: np.zeros(3)}

    def group(self, name, parent, pivot):
        pivot = np.asarray(pivot, float)
        rel = pivot - self.pivots[parent]
        self.scene.graph.update(frame_to=name, frame_from=parent, matrix=T(rel))
        self.pivots[name] = pivot

    def add(self, mesh, name, parent):
        m = mesh.copy()
        m.apply_translation(-self.pivots[parent])
        self.scene.add_geometry(m, node_name=name, geom_name=name, parent_node_name=parent)

    def export(self, path):
        data = self.scene.export(file_type='glb', include_normals=True)
        open(path, 'wb').write(data)
        return len(data)

# ===========================================================================
#  COMPANION DRONE – ~0.20 m spherical drone, origin at its centre, front +Z
#  Nodes: companion_drone > Shell / Face / Side_Sensor_L / Side_Sensor_R /
#         Rear_Sensor / Spike_1..8
# ===========================================================================
import sys
OUT = sys.argv[1] if len(sys.argv) > 1 else 'companion_drone.glb'

MAT = dict(
    white=mat('Drone_Shell_White', (0.95, 0.96, 0.97), 0.0, 0.22),
    black=mat('Drone_Sensor_Black', (0.02, 0.022, 0.026), 0.15, 0.25),
    green=mat('Drone_Optic_Green_Emissive', (0.12, 0.95, 0.3), 0.0, 0.3, emissive=(0.15, 1.0, 0.3)),
    eye=mat('Drone_Eye_Emissive', (0.35, 1.0, 0.45), 0.0, 0.3, emissive=(0.35, 1.0, 0.45)),
)
RS = np.array([0.080, 0.076, 0.078])      # shell radii

def dir_from(az, el):
    az, el = np.radians(az), np.radians(el)
    return unit([np.cos(el) * np.sin(az), np.sin(el), np.cos(el) * np.cos(az)])

def face_mask(p):   # front sensor region (superellipse), p normalised
    return (p[:, 2] > 0.2) & ((np.abs(p[:, 0] / 0.72) ** 3 + np.abs((p[:, 1] + 0.02) / 0.58) ** 3) < 1)

rig = Rig('companion_drone')
for g in ('Shell', 'Face', 'Side_Sensor_L', 'Side_Sensor_R', 'Rear_Sensor'):
    rig.group(g, 'companion_drone', (0, 0, 0))

# shell (with front sensor window cut out) + black face plate
rig.add(finish(superellipsoid(RS, nu=128, nv=72, keep=lambda p: ~face_mask(p)), MAT['white'], 'Shell_white'), 'Shell_white', 'Shell')
rig.add(finish(superellipsoid(RS * 0.99, nu=128, nv=72, keep=face_mask), MAT['black'], 'Face_plate_black'), 'Face_plate_black', 'Face')

# face rim
tt = np.linspace(0, 2 * np.pi, 140, endpoint=False)
rim = []
for t in tt:
    xn = 0.72 * _sp(np.cos(t), 2 / 3); yn = -0.02 + 0.58 * _sp(np.sin(t), 2 / 3)
    zn = np.sqrt(max(1 - xn ** 2 - yn ** 2, 1e-6))
    rim.append(RS * np.array([xn, yn, zn]) * 1.004)
rig.add(finish(tube(np.array(rim), 0.0032, sections=12, closed=True), MAT['white'], 'Face_rim_white'), 'Face_rim_white', 'Face')

eyes, smile, lights = [], [], []
for s in (1, -1):
    p, n = on_ellipsoid((0, 0, 0), RS, s * 0.030, 0.012, +1, 0.99)
    eyes.append(ellipsoid((0.0125, 0.0165, 0.004), p + n * 0.001, align([0, 0, 1], n) @ rot_axis([0, 0, 1], -s * 6), nu=36, nv=18))
    hl = p + n * 0.0035 + align([0, 0, 1], n) @ np.array([-0.004, 0.006, 0])
    lights.append(ellipsoid((0.0035, 0.0045, 0.0015), hl, align([0, 0, 1], n), nu=16, nv=8))
# smile
sm = []
for x in np.linspace(-0.012, 0.012, 24):
    y = -0.020 - 0.0006 + (0.0 - 0.0) + 0.0 - (0.0 if False else 0) + 0.0 + (x / 0.012) ** 2 * -0.0 + 0.012 * (1 - 0) * 0 - 0.0
    y = -0.0185 + 0.007 * (x / 0.012) ** 2
    p, n = on_ellipsoid((0, 0, 0), RS, x, y, +1, 0.99)
    sm.append(p + n * 0.0012)
smile.append(tube(np.array(sm), 0.0016, sections=8))
# cheek marks
for s in (1, -1):
    p, n = on_ellipsoid((0, 0, 0), RS, s * 0.047, -0.012, +1, 0.99)
    smile.append(ellipsoid((0.004, 0.0025, 0.0012), p + n * 0.001, align([0, 0, 1], n), nu=16, nv=8))
rig.add(finish(cat(eyes + smile + lights), MAT['eye'], 'Face_optics_green'), 'Face_optics_green', 'Face')

# side + rear optical sensors (black disc, green ring, black lens)
def sensor(group, d, name):
    d = unit(d); R = align([0, 0, 1], d)
    c = d * RS[0] * 0.985
    disc = xf(rounded_disc(0.026, 0.004, 0.002, 48), T(c + d * 0.001, R))
    lens = xf(rounded_disc(0.0105, 0.0035, 0.0015, 40), T(c + d * 0.0042, R))
    rg = ring(c + d * 0.0042, 0.0185, 0.0027, d, nmaj=64, nmin=10)
    rig.add(finish(disc, MAT['black'], name + '_black'), name + '_black', group)
    rig.add(finish(cat([rg]), MAT['green'], name + '_ring_green'), name + '_ring_green', group)
    rig.add(finish(lens, MAT['black'], name + '_lens_black'), name + '_lens_black', group)
sensor('Side_Sensor_L', [1, 0, 0], 'SideL')
sensor('Side_Sensor_R', [-1, 0, 0], 'SideR')
sensor('Rear_Sensor', [0, 0, -1], 'Rear')

# eight protruding modules: white tapered base + black tip + green light band
spikes = [(55, 40), (-55, 40), (55, -40), (-55, -40), (125, 40), (-125, 40), (125, -40), (-125, -40)]
for i, (az, el) in enumerate(spikes, 1):
    g = f'Spike_{i}'
    rig.group(g, 'companion_drone', (0, 0, 0))
    d = dir_from(az, el); R = align([0, 0, 1], d)
    base_prof = [(0, 0.060)] + [(r, h) for r, h in
                 zip(np.linspace(0.027, 0.012, 8), np.linspace(0.062, 0.094, 8))] + \
                [(0.0105, 0.0985), (0.007, 0.1015), (0, 0.1030)]
    white = lathe([(0, 0.060), (0.027, 0.062), (0.024, 0.074), (0.019, 0.086), (0.0155, 0.0945), (0.0, 0.0975)], 40)
    tipprof = [(0.0, 0.0905)] + [(0.0165 * np.cos(a) , 0.0905 + 0.016 * np.sin(a)) for a in np.linspace(0.05, np.pi / 2, 10)]
    tip = lathe([(0, 0.0940), (0.0150, 0.0950), (0.0140, 0.1010), (0.0095, 0.1075), (0.0, 0.1100)], 40)
    band = ring(d * 0.0925, 0.0158, 0.0017, d, nmaj=48, nmin=8)
    rig.add(finish(xf(white, T((0, 0, 0), R)), MAT['white'], g + '_base_white'), g + '_base_white', g)
    rig.add(finish(xf(tip, T((0, 0, 0), R)), MAT['black'], g + '_tip_black'), g + '_tip_black', g)
    rig.add(finish(band, MAT['green'], g + '_band_green'), g + '_band_green', g)

size = rig.export(OUT)
print('wrote', OUT, size, 'bytes')
