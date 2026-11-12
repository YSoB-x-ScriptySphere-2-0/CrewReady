import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rocket, Shield, Flame, RotateCw, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../content/i18n';

interface HeroCadetRocket3DProps {
  who?: 'orbit' | 'nova';
  onSelectWho?: (who: 'orbit' | 'nova') => void;
  className?: string;
  height?: string;
}

export function HeroCadetRocket3D({
  who: initialWho = 'orbit',
  onSelectWho,
  className = '',
  height = '100%',
}: HeroCadetRocket3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [who, setWho] = useState<'orbit' | 'nova'>(initialWho);
  const [thrusterActive, setThrusterActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const lang = useI18n((s) => s.lang);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rocketGroupRef = useRef<THREE.Group | null>(null);
  const thrusterFlameRef = useRef<THREE.Mesh | null>(null);
  const shieldMeshRef = useRef<THREE.Mesh | null>(null);
  const scannerRingRef = useRef<THREE.Mesh | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x223366, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x22d7e6, 2.0);
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    // Rocket Group
    const rocket = new THREE.Group();
    rocketGroupRef.current = rocket;
    scene.add(rocket);

    // 1. Rocket Fuselage (Body)
    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.65, 2.4, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf4f7ff,
      metalness: 0.35,
      roughness: 0.3,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 0.2;
    rocket.add(bodyMesh);

    // Decorative racing/accent stripe on body
    const stripeGeo = new THREE.CylinderGeometry(0.56, 0.58, 0.25, 32);
    const stripeMat = new THREE.MeshBasicMaterial({ color: who === 'orbit' ? 0x22d7e6 : 0xe8338b });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.y = 0.6;
    rocket.add(stripeMesh);

    // 2. Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.55, 1.0, 32);
    const noseMat = new THREE.MeshStandardMaterial({
      color: who === 'orbit' ? 0x0f8f9c : 0xc72370,
      metalness: 0.4,
      roughness: 0.25,
    });
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.position.y = 1.9;
    rocket.add(noseMesh);

    // 3. Cockpit Viewport (Round glass window)
    const windowGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const windowMat = new THREE.MeshPhysicalMaterial({
      color: 0x22d7e6,
      emissive: 0x094455,
      roughness: 0.1,
      metalness: 0.9,
      transmission: 0.6,
    });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.position.set(0, 0.7, 0.52);
    rocket.add(windowMesh);

    // 4. Base Engine Nozzle
    const engineGeo = new THREE.CylinderGeometry(0.35, 0.5, 0.45, 24);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x22263b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const engineMesh = new THREE.Mesh(engineGeo, engineMat);
    engineMesh.position.y = -1.15;
    rocket.add(engineMesh);

    // 5. Wings / Delta Fins (3 fins evenly distributed at 120 deg)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.65, -0.4);
    finShape.lineTo(0.65, -0.9);
    finShape.lineTo(0, -0.6);
    finShape.closePath();

    const extrudeSettings = { depth: 0.05, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
    const finMat = new THREE.MeshStandardMaterial({
      color: who === 'orbit' ? 0x19a7b8 : 0xd12476,
      metalness: 0.4,
      roughness: 0.4,
    });

    for (let i = 0; i < 3; i++) {
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.y = -0.3;
      fin.rotation.y = (i * Math.PI * 2) / 3;
      rocket.add(fin);
    }

    // 6. Deployable Solar Wings
    const solarWingGeo = new THREE.BoxGeometry(1.6, 0.04, 0.35);
    const solarWingMat = new THREE.MeshStandardMaterial({
      color: 0x0055cc,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x002266,
    });
    const solarWings = new THREE.Mesh(solarWingGeo, solarWingMat);
    solarWings.position.set(0, 0.2, 0);
    rocket.add(solarWings);

    // 7. Dynamic Plasma Thruster Flame (Cone + inner core)
    const flameGeo = new THREE.ConeGeometry(0.38, 1.4, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = -2.0;
    flameMesh.rotation.x = Math.PI;
    flameMesh.visible = false;
    rocket.add(flameMesh);
    thrusterFlameRef.current = flameMesh;

    // 8. Translucent Energy Shield Sphere
    const shieldGeo = new THREE.SphereGeometry(1.9, 32, 32);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x7a5ae0,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.visible = false;
    rocket.add(shieldMesh);
    shieldMeshRef.current = shieldMesh;

    // 9. Holographic Scanning Ring
    const ringGeo = new THREE.TorusGeometry(1.15, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22d7e6,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    rocket.add(ringMesh);
    scannerRingRef.current = ringMesh;

    // 10. Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 300;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 35;
      starCoords[i + 1] = (Math.random() - 0.5) * 35;
      starCoords[i + 2] = -5 - Math.random() * 20;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8 });
    scene.add(new THREE.Points(starsGeo, starsMat));

    // Pointer Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotVelY = 0;
    let rotVelX = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevX = e.clientX;
      prevY = e.clientY;
      rotVelX = 0;
      rotVelY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !rocketGroupRef.current) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      rotVelY = dx * 0.008;
      rotVelX = dy * 0.005;

      rocketGroupRef.current.rotation.y += rotVelY;
      rocketGroupRef.current.rotation.x += rotVelX;
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle floating bob & slow idle rotation
      if (rocketGroupRef.current) {
        if (!isDragging) {
          rocketGroupRef.current.rotation.y += 0.008 + rotVelY;
          rocketGroupRef.current.rotation.x += rotVelX;
          rotVelY *= 0.92;
          rotVelX *= 0.92;
        }
        rocketGroupRef.current.position.y = Math.sin(elapsed * 2.2) * 0.08;
      }

      // Scanner ring passes up and down the rocket
      if (scannerRingRef.current) {
        scannerRingRef.current.position.y = Math.sin(elapsed * 2.5) * 1.5 + 0.2;
      }

      // Animated thruster flame flicker
      if (thrusterFlameRef.current && thrusterFlameRef.current.visible) {
        const flicker = 1 + Math.sin(elapsed * 35) * 0.25;
        thrusterFlameRef.current.scale.set(flicker, flicker, flicker);
      }

      // Shield pulse
      if (shieldMeshRef.current && shieldMeshRef.current.visible) {
        const pulse = 1 + Math.sin(elapsed * 5) * 0.05;
        shieldMeshRef.current.scale.set(pulse, pulse, pulse);
        shieldMeshRef.current.rotation.y += 0.015;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      noseGeo.dispose();
      noseMat.dispose();
    };
  }, [who]);

  // Toggle thruster visibility
  useEffect(() => {
    if (thrusterFlameRef.current) {
      thrusterFlameRef.current.visible = thrusterActive;
    }
  }, [thrusterActive]);

  // Toggle shield visibility
  useEffect(() => {
    if (shieldMeshRef.current) {
      shieldMeshRef.current.visible = shieldActive;
    }
  }, [shieldActive]);

  const handleHeroSelect = (choice: 'orbit' | 'nova') => {
    setWho(choice);
    onSelectWho?.(choice);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-line bg-space-deep/90 text-text ${className}`} style={{ height }}>
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" title="Drag to rotate spaceship in 3D!" />

      {/* Top Banner: Cadet Hero / Heroine Switch */}
      <div className="absolute top-2.5 inset-x-3 z-10 flex flex-wrap items-center justify-between gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-1 rounded-full border border-go/40 bg-space-deep/80 px-2.5 py-1 text-xs font-bold text-go backdrop-blur-md">
          <Rocket size={13} className="text-go" />
          <span className="font-display font-extrabold uppercase tracking-wide">
            {lang === 'bn' ? 'মহাকাশযান প্রস্তুতি ৩ডি' : 'Hero Rocket Prep 3D'}
          </span>
        </div>

        {/* Hero selection pills */}
        <div className="flex items-center gap-1 rounded-full border border-line bg-panel/85 p-0.5 backdrop-blur-md">
          <button
            onClick={() => handleHeroSelect('orbit')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs font-extrabold transition ${
              who === 'orbit' ? 'bg-go text-go-text shadow-sm' : 'text-muted hover:text-text'
            }`}
          >
            <span>🦸‍♂️</span>
            <span>{lang === 'bn' ? 'ক্যাডেট অরবিট' : 'Hero Orbit'}</span>
          </button>

          <button
            onClick={() => handleHeroSelect('nova')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs font-extrabold transition ${
              who === 'nova' ? 'bg-nova text-white shadow-sm' : 'text-muted hover:text-text'
            }`}
          >
            <span>🦸‍♀️</span>
            <span>{lang === 'bn' ? 'ক্যাডেট নোভা' : 'Heroine Nova'}</span>
          </button>
        </div>
      </div>

      {/* Floating 3D Gesture Hint */}
      {!isInteracting && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-go/40 bg-panel/90 px-3 py-1 text-[11px] font-bold text-go backdrop-blur-md shadow-lg animate-pulse">
          <RotateCw size={13} />
          <span>{lang === 'bn' ? 'ঘুরিয়ে দেখতে রকেটে হাত বোলাও' : 'Swipe or drag to spin Rocket in 3D'}</span>
        </div>
      )}

      {/* Interactive System Testing Controls (Bottom) */}
      <div className="absolute bottom-2 inset-x-3 z-10 flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-line bg-panel/95 p-2 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Thruster Test Button */}
          <button
            onClick={() => setThrusterActive((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-display text-xs font-extrabold transition active:scale-95 ${
              thrusterActive
                ? 'border-[#ffaa00] bg-[#ffaa00] text-space-deep shadow-[0_0_12px_rgba(255,170,0,0.6)]'
                : 'border-line bg-space-deep text-muted hover:text-text'
            }`}
          >
            <Flame size={14} className={thrusterActive ? 'text-space-deep animate-bounce' : 'text-[#ffaa00]'} />
            <span>{lang === 'bn' ? 'থ্রাস্টার পরীক্ষা' : 'Test Thrusters'}</span>
          </button>

          {/* Energy Shield Test Button */}
          <button
            onClick={() => setShieldActive((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-display text-xs font-extrabold transition active:scale-95 ${
              shieldActive
                ? 'border-shield bg-shield text-white shadow-[0_0_12px_rgba(122,90,224,0.6)]'
                : 'border-line bg-space-deep text-muted hover:text-text'
            }`}
          >
            <Shield size={14} className={shieldActive ? 'text-white' : 'text-shield'} />
            <span>{lang === 'bn' ? 'সুরক্ষা ঢাল' : 'Test Shield'}</span>
          </button>
        </div>

        {/* Readiness Badge */}
        <div className="flex items-center gap-1 text-[11px] font-bold text-good">
          <CheckCircle2 size={14} className="text-good" />
          <span>{lang === 'bn' ? 'মহাকাশযান সম্পূর্ণ প্রস্তুত!' : 'Spaceship 100% Ready!'}</span>
        </div>
      </div>
    </div>
  );
}
