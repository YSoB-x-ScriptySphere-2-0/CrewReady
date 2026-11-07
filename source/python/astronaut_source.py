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
#  CREW ASTRONAUT  –  ~1.0 m tall chibi astronaut, feet on y=0, facing +Z
#  Nodes: crew_astronaut > Helmet / Torso / Arm_L / Arm_R / Leg_L / Leg_R
#  Pivots sit on the joints (neck, shoulders, hips) so it can be posed later.
# ===========================================================================
import sys
OUT = sys.argv[1] if len(sys.argv) > 1 else 'crew_astronaut.glb'

MAT = dict(
    white=mat('Suit_White', (0.95, 0.96, 0.97), 0.0, 0.22),
    black=mat('Suit_Black', (0.025, 0.027, 0.03), 0.1, 0.28),
    green=mat('Piping_Green_Emissive', (0.10, 0.90, 0.25), 0.0, 0.4, emissive=(0.15, 1.0, 0.25)),
    eye=mat('Eye_Green_Emissive', (0.35, 1.0, 0.45), 0.0, 0.3, emissive=(0.35, 1.0, 0.45)),
    screen=mat('Chest_Display_Emissive', (0.12, 0.95, 0.3), 0.0, 0.25, emissive=(0.12, 0.95, 0.3)),
    glass=mat('Visor_Glass', (0.10, 0.16, 0.15), 0.0, 0.04, alpha=0.30, double=True),
    face=mat('Faceplate_Dark', (0.012, 0.03, 0.026), 0.2, 0.35, double=True),
    rim=mat('Visor_Rim', (0.55, 0.72, 0.64), 0.3, 0.3, emissive=(0.05, 0.18, 0.08)),
    gray=mat('Gray_Metal', (0.62, 0.64, 0.66), 0.9, 0.35),
)

parts = {}   # (group, matkey) -> [meshes]
def P(group, key, mesh):
    parts.setdefault((group, key), []).append(mesh)

def ell_line(radii, theta_fn, y0, y1, n=40, off=0.003):
    """Path hugging an ellipsoid (local coords): theta(y) in degrees, 0 = +Z."""
    rx, ry, rz = radii
    ys = np.linspace(y0, y1, n)
    pts = []
    for y in ys:
        t = np.radians(theta_fn((y - y0) / (y1 - y0)))
        s = np.sqrt(max(1 - (y / ry) ** 2, 1e-6))
        p = np.array([rx * s * np.sin(t), y, rz * s * np.cos(t)])
        nn = unit([p[0] / rx ** 2, p[1] / ry ** 2, p[2] / rz ** 2])
        pts.append(p + off * nn)
    return np.array(pts)

def local_r(radii_xz, ry, dy):
    return radii_xz * np.sqrt(max(1 - (dy / ry) ** 2, 1e-6))

# ------------------------------------------------------------------ helmet
HC = np.array([0.0, 0.735, 0.0]); HR = np.array([0.265, 0.245, 0.245])
NECK = np.array([0.0, 0.485, 0.0])

def in_visor(p, k=1.0):
    return (p[:, 2] > 0.1) & ((np.abs(p[:, 0] / (0.76 * k)) ** 3 + np.abs((p[:, 1] + 0.06) / (0.78 * k)) ** 3) < 1)

shell = xf(superellipsoid(HR, nu=176, nv=96, keep=lambda p: ~in_visor(p)), T(HC))
P('Helmet', 'white', shell)
P('Helmet', 'face', xf(superellipsoid(HR * 0.985, nu=176, nv=96, keep=in_visor), T(HC)))
P('Helmet', 'glass', xf(superellipsoid(HR * 1.018, nu=176, nv=96, keep=in_visor), T(HC)))

# visor rim (superellipse on the helmet surface)
tt = np.linspace(0, 2 * np.pi, 180, endpoint=False)
rim = []
for t in tt:
    xn = 0.76 * _sp(np.cos(t), 2 / 3); yn = -0.06 + 0.78 * _sp(np.sin(t), 2 / 3)
    zn = np.sqrt(max(1 - xn ** 2 - yn ** 2, 1e-6))
    rim.append(HC + HR * np.array([xn, yn, zn]) * 1.006)
P('Helmet', 'rim', tube(np.array(rim), 0.0105, sections=14, closed=True))

# eyes: flattened glowing ovals + highlights
for s in (1, -1):
    p, n = on_ellipsoid(HC, HR, s * 0.125, HC[1] - 0.012, +1, 0.985)
    R = align([0, 0, 1], n) @ rot_axis([0, 0, 1], -s * 7)
    P('Helmet', 'eye', ellipsoid((0.046, 0.060, 0.012), p + n * 0.002, R, nu=48, nv=24))
    hl = p + n * 0.007 + R @ np.array([-0.012, 0.022, 0.0])
    P('Helmet', 'rim', ellipsoid((0.011, 0.014, 0.004), hl, R, nu=24, nv=12))
    # small side indicator dashes inside the visor
    q, nq = on_ellipsoid(HC, HR, s * 0.19, HC[1] + 0.0, +1, 0.985)
    P('Helmet', 'eye', ellipsoid((0.004, 0.012, 0.004), q + nq * 0.002, align([0, 0, 1], nq), nu=16, nv=8))

# ear modules (black pod + glowing ring + white centre)
for s in (1, -1):
    c = np.array([s * 0.262, HC[1], -0.005])
    ax = np.array([s, 0, 0.0])
    Rr = align([0, 0, 1], ax)
    P('Helmet', 'black', xf(rounded_disc(0.074, 0.028, 0.012), T(c, Rr)))
    P('Helmet', 'green', ring(c + ax * 0.0295, 0.049, 0.0085, ax))
    P('Helmet', 'white', xf(rounded_disc(0.040, 0.004, 0.002), T(c + ax * 0.0285, Rr)))

# back light bar
p, n = on_ellipsoid(HC, HR, 0.0, HC[1] - 0.06, -1, 1.0)
P('Helmet', 'green', ellipsoid((0.036, 0.0075, 0.007), p + n * 0.001, align([0, 0, 1], n), e1=0.5, e2=0.4, nu=40, nv=16))

# --------------------------------------------------------------- neck/torso
P('Torso', 'black', ring([0, 0.484, 0], 0.118, 0.024, [0, 1, 0]))
P('Torso', 'white', ellipsoid((0.125, 0.04, 0.105), (0, 0.455, 0)))
TC = np.array([0, 0.32, 0.0]); TR = np.array([0.15, 0.15, 0.12])
P('Torso', 'white', ellipsoid(TR, TC, nu=96, nv=56))
P('Torso', 'white', ellipsoid((0.14, 0.07, 0.108), (0, 0.205, 0), nu=64, nv=32))   # pelvis

def tline(theta0, theta1, bow):
    return ell_line(TR, lambda t: theta0 + (theta1 - theta0) * t + bow * np.sin(np.pi * t),
                    0.125, -0.14, n=50, off=0.002)
for s in (1, -1):
    for (a0, a1, bw) in ((s * 30, s * 38, s * 6), (s * 100, s * 98, 0), (s * 150, s * 145, 0)):
        line = tline(a0, a1, bw) + TC
        P('Torso', 'green', tube(line, 0.0042, sections=10))

# chest display
p, n = on_ellipsoid(TC, TR, 0.0, 0.345, +1)
R = align([0, 0, 1], n)
P('Torso', 'black', ellipsoid((0.050, 0.043, 0.016), p - n * 0.004, R, e1=0.3, e2=0.3, nu=48, nv=24))
P('Torso', 'screen', ellipsoid((0.034, 0.028, 0.006), p + n * 0.0115, R, e1=0.3, e2=0.3, nu=48, nv=24))
q, nq = on_ellipsoid(TC, TR, -0.088, 0.372, +1)
Rq = align([0, 0, 1], nq)
P('Torso', 'gray', xf(rounded_disc(0.016, 0.004, 0.002), T(q + nq * 0.002, Rq)))
P('Torso', 'black', ellipsoid((0.011, 0.0018, 0.002), q + nq * 0.0075, Rq @ rot_axis([0, 0, 1], 40), nu=16, nv=8))

# --------------------------------------------------------------------- arms
def build_arm(s, grp):
    S = np.array([s * 0.17, 0.40, 0.0])
    du = unit([s * 0.2, -0.98, 0.0]); df = unit([-s * 0.30, -0.55, 0.78])
    E = S + du * 0.13; W = E + df * 0.10
    # upper arm
    Ru = align([0, 1, 0], du); cu = S + du * 0.065
    ru = (0.063, 0.085, 0.063)
    P(grp, 'white', ellipsoid(ru, cu, Ru, nu=64, nv=32))
    P(grp, 'green', xf(tube(ell_line(ru, lambda t: s * 55, -0.07, 0.07, 24, 0.002), 0.0038, sections=10), T(cu, Ru)))
    P(grp, 'black', ring(S + du * 0.004, 0.064, 0.018, du))
    P(grp, 'black', ring(E, 0.054, 0.0165, du))
    # forearm
    Rf = align([0, 1, 0], df); cf = E + df * 0.055
    rf = (0.052, 0.072, 0.052)
    P(grp, 'white', ellipsoid(rf, cf, Rf, nu=64, nv=32))
    P(grp, 'green', xf(tube(ell_line(rf, lambda t: -s * 60 + 0, -0.06, 0.05, 24, 0.002), 0.0036, sections=10), T(cf, Rf)))
    wl = local_r(0.052, 0.072, 0.045)
    P(grp, 'green', ring(W - df * 0.02, wl + 0.002, 0.0055, df))
    P(grp, 'black', ring(W + df * 0.004, wl + 0.004, 0.0145, df))
    # glove (mitten with thumb + finger block)
    gc = W + df * 0.04
    P(grp, 'black', ellipsoid((0.048, 0.050, 0.052), gc, Rf, nu=56, nv=28))
    thumb_dir = Rf @ np.array([-s * 0.75, 0.25, 0.6])
    P(grp, 'black', ellipsoid((0.020, 0.032, 0.020), gc + Rf @ np.array([-s * 0.040, 0.012, 0.022]),
                              align([0, 1, 0], thumb_dir), nu=32, nv=16))
    P(grp, 'black', ellipsoid((0.030, 0.034, 0.026), gc + Rf @ np.array([s * 0.004, 0.044, 0.006]), Rf, nu=32, nv=16))
    return S

# --------------------------------------------------------------------- legs
def build_leg(s, grp):
    x = s * 0.075
    c = np.array([x, 0.13, 0.0]); rl = (0.066, 0.085, 0.066)
    P(grp, 'white', ellipsoid(rl, c, nu=64, nv=32))
    P(grp, 'green', xf(tube(ell_line(rl, lambda t: 0, -0.075, 0.07, 26, 0.002), 0.0038, sections=10), T(c)))
    for yy, r_, key in ((0.178, 0.016, 'black'), (0.088, 0.0145, 'black'), (0.108, 0.0055, 'green')):
        Rr = local_r(0.066, 0.085, yy - 0.13) + (0.004 if key == 'black' else 0.002)
        P(grp, key, ring([x, yy, 0], Rr, r_, [0, 1, 0]))
    P(grp, 'black', ellipsoid((0.068, 0.042, 0.095), (x, 0.042, 0.028), nu=64, nv=32))
    return np.array([x, 0.19, 0.0])

# ------------------------------------------------------------- scene graph
rig = Rig('crew_astronaut')
rig.group('Helmet', 'crew_astronaut', NECK)
rig.group('Torso', 'crew_astronaut', (0, 0.32, 0))
pivots = {}
for s, side in ((1, 'L'), (-1, 'R')):
    pivots['Arm_' + side] = build_arm(s, 'Arm_' + side)
    pivots['Leg_' + side] = build_leg(s, 'Leg_' + side)
    rig.group('Arm_' + side, 'crew_astronaut', pivots['Arm_' + side])
    rig.group('Leg_' + side, 'crew_astronaut', pivots['Leg_' + side])

order = ['Helmet', 'Torso', 'Arm_L', 'Arm_R', 'Leg_L', 'Leg_R']
for (grp, key), lst in parts.items():
    m = finish(cat(lst), MAT[key], f'{grp}_{key}')
    rig.add(m, f'{grp}_{key}', grp)

size = rig.export(OUT)
print('wrote', OUT, size, 'bytes')
