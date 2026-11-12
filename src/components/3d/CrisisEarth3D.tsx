import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AlertTriangle, Users, Bug, RotateCw } from 'lucide-react';
import { useI18n } from '../../content/i18n';

export type CrisisType = 'all' | 'crowding' | 'pandemic';

interface CrisisEarth3DProps {
  initialCrisis?: CrisisType;
  onSelectCrisis?: (type: CrisisType) => void;
  className?: string;
  height?: string;
}

export function CrisisEarth3D({
  initialCrisis = 'all',
  onSelectCrisis,
  className = '',
  height = '100%',
}: CrisisEarth3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [crisis, setCrisis] = useState<CrisisType>(initialCrisis);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeAlert, setActiveAlert] = useState<{ title: string; desc: string; icon: string } | null>(null);
  const lang = useI18n((s) => s.lang);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const hazardGroupRef = useRef<THREE.Group | null>(null);
  const satelliteGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 2. Lighting: Sun directional light + gentle ambient space light
    const ambientLight = new THREE.AmbientLight(0x223366, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 3.2);
    sunLight.position.set(5, 3, 4);
    scene.add(sunLight);

    const backRimLight = new THREE.DirectionalLight(0x22d7e6, 1.2);
    backRimLight.position.set(-5, -2, -3);
    scene.add(backRimLight);

    // 3. Create Procedural Earth Texture on Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Deep Blue Oceans
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGrad.addColorStop(0, '#0d1f47');
    oceanGrad.addColorStop(0.5, '#12306d');
    oceanGrad.addColorStop(1, '#081432');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Continents
    ctx.fillStyle = '#207044';
    const drawLandMass = (cx: number, cy: number, rx: number, ry: number) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0.2, 0, Math.PI * 2);
      ctx.fill();
    };

    // North America, South America, Eurasia, Africa, Australia
    drawLandMass(280, 180, 95, 60);
    drawLandMass(340, 330, 60, 90);
    drawLandMass(590, 170, 160, 75);
    drawLandMass(550, 310, 80, 85);
    drawLandMass(780, 360, 65, 45);
    drawLandMass(200, 120, 80, 45);

    // Shallow coasts
    ctx.strokeStyle = '#22d7e6';
    ctx.lineWidth = 4;
    ctx.stroke();

    // City lights / Overpopulation markers (yellow/orange dots)
    ctx.fillStyle = '#ffcf33';
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      // Only place lights on land
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[1] > 60 && pixel[0] < 100) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5 + Math.random() * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const earthTexture = new THREE.CanvasTexture(canvas);

    // 4. Earth Sphere
    const earthGeo = new THREE.SphereGeometry(2.2, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.6,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 5. Cloud Layer
    const cloudsCanvas = document.createElement('canvas');
    cloudsCanvas.width = 1024;
    cloudsCanvas.height = 512;
    const cctx = cloudsCanvas.getContext('2d')!;
    cctx.fillStyle = 'rgba(0,0,0,0)';
    cctx.fillRect(0, 0, cloudsCanvas.width, cloudsCanvas.height);
    cctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    for (let i = 0; i < 45; i++) {
      cctx.beginPath();
      cctx.arc(Math.random() * cloudsCanvas.width, Math.random() * cloudsCanvas.height, 25 + Math.random() * 45, 0, Math.PI * 2);
      cctx.fill();
    }
    const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas);
    const cloudsGeo = new THREE.SphereGeometry(2.24, 32, 32);
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 6. Glowing Atmosphere Halo
    const atmosphereGeo = new THREE.SphereGeometry(2.36, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x48e3f0,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 7. Hazard Markers Group (Pandemic red pulses & Overcrowding yellow heat-islands)
    const hazardGroup = new THREE.Group();
    hazardGroupRef.current = hazardGroup;
    earthMesh.add(hazardGroup);

    // Helper to position objects on sphere surface
    const latLongToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    // Hotspot coordinates across continents
    const hotspots = [
      { lat: 40, lon: -75, type: 'crowding', name: 'Mega-City Cluster North', info: 'Overcrowding warning! Energy and fresh water reserves are dropping rapidly.' },
      { lat: 51, lon: 0, type: 'crowding', name: 'Metro Congestion Hub', info: 'Grid overload! Dense population needs new resources.' },
      { lat: 28, lon: 77, type: 'pandemic', name: 'Outbreak Epicenter Alpha', info: 'Sudden mysterious pandemic detected! Quarantine active.' },
      { lat: 31, lon: 121, type: 'pandemic', name: 'Super-Virus Warning Zone', info: 'Rapid contagion spreading! Hospitals urgently need supplies.' },
      { lat: -23, lon: -46, type: 'crowding', name: 'Southern Mega-Zone', info: 'Farmlands exhausted. Humanity must find a new frontier.' },
      { lat: 1, lon: 36, type: 'pandemic', name: 'Equatorial Health Siren', info: 'Global emergency beacon! Earth ecosystem strained.' },
    ];

    hotspots.forEach((h) => {
      const pos = latLongToVector3(h.lat, h.lon, 2.25);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(pos);
      markerGroup.lookAt(0, 0, 0);

      // Warning pin / gem
      const isPandemic = h.type === 'pandemic';
      const color = isPandemic ? 0xff2a4d : 0xffaa00;

      const pinGeo = new THREE.ConeGeometry(0.08, 0.22, 8);
      const pinMat = new THREE.MeshBasicMaterial({ color, wireframe: false });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.rotation.x = -Math.PI / 2;
      markerGroup.add(pinMesh);

      // Pulsing Ring around the pin
      const ringGeo = new THREE.RingGeometry(0.1, 0.18, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.userData = { isHazardRing: true, baseColor: color, type: h.type };
      markerGroup.add(ringMesh);

      markerGroup.userData = { info: h };
      hazardGroup.add(markerGroup);
    });

    // 8. Orbiting Satellite and Defense Ring
    const satGroup = new THREE.Group();
    satelliteGroupRef.current = satGroup;
    scene.add(satGroup);

    const orbitGeo = new THREE.RingGeometry(3.1, 3.14, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x22d7e6,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
    orbitMesh.rotation.x = Math.PI / 2.3;
    satGroup.add(orbitMesh);

    // Mini satellite model
    const satBoxGeo = new THREE.BoxGeometry(0.12, 0.12, 0.2);
    const satMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8, roughness: 0.2 });
    const satMesh = new THREE.Mesh(satBoxGeo, satMat);
    satMesh.position.set(3.12, 0, 0);

    const solarWingGeo = new THREE.BoxGeometry(0.4, 0.02, 0.12);
    const wingMat = new THREE.MeshBasicMaterial({ color: 0x0088ff });
    const wingMesh = new THREE.Mesh(solarWingGeo, wingMat);
    wingMesh.position.set(3.12, 0, 0);
    satGroup.add(satMesh);
    satGroup.add(wingMesh);

    // 9. Stars Background Dust
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starCoords = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starCoords[i] = (Math.random() - 0.5) * 40;
      starCoords[i + 1] = (Math.random() - 0.5) * 40;
      starCoords[i + 2] = -5 - Math.random() * 20;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starCoords, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.8 });
    const starsPoints = new THREE.Points(starsGeo, starsMat);
    scene.add(starsPoints);

    // 10. Pointer Drag to Rotate Earth
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      velX = 0;
      velY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      velX = deltaX * 0.005;
      velY = deltaY * 0.005;

      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += velX;
        earthMeshRef.current.rotation.x += velY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 11. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow idle rotation when not dragging
      if (!isDragging && earthMeshRef.current) {
        earthMeshRef.current.rotation.y += 0.0025 + velX;
        earthMeshRef.current.rotation.x += velY;
        velX *= 0.94;
        velY *= 0.94;
      }

      // Clouds rotate slightly faster
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.0035;
      }

      // Satellite orbit
      if (satelliteGroupRef.current) {
        satelliteGroupRef.current.rotation.y = elapsed * 0.4;
        satelliteGroupRef.current.rotation.z = Math.sin(elapsed * 0.2) * 0.2;
      }

      // Pulse hazard rings
      if (hazardGroupRef.current) {
        hazardGroupRef.current.traverse((child) => {
          if (child.userData?.isHazardRing) {
            const scale = 1 + Math.sin(elapsed * 4) * 0.35;
            child.scale.set(scale, scale, 1);
          }
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    // 12. Resize Handler
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
      earthGeo.dispose();
      earthMat.dispose();
      earthTexture.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
      cloudsTexture.dispose();
    };
  }, []);

  // Update Hazard visibility based on active filter
  useEffect(() => {
    if (!hazardGroupRef.current) return;
    hazardGroupRef.current.children.forEach((child) => {
      const type = child.userData?.info?.type;
      if (crisis === 'all') {
        child.visible = true;
      } else if (crisis === 'crowding') {
        child.visible = type === 'crowding';
      } else if (crisis === 'pandemic') {
        child.visible = type === 'pandemic';
      }
    });
  }, [crisis]);

  const selectCrisisMode = (mode: CrisisType) => {
    setCrisis(mode);
    onSelectCrisis?.(mode);
    if (mode === 'crowding') {
      setActiveAlert({
        title: lang === 'bn' ? 'অতিরিক্ত জনসংখ্যার চাপ' : 'Global Overcrowding Alert',
        desc: lang === 'bn'
          ? 'পৃথিবীর শহরগুলোতে মানুষের প্রচণ্ড ভিড়! বিদ্যুৎ, খাবার ও বিশুদ্ধ পানির তীব্র সংকট।'
          : 'Cities are overflowing! Earth is running out of food, electricity and clean water for everyone.',
        icon: '🏙️',
      });
    } else if (mode === 'pandemic') {
      setActiveAlert({
        title: lang === 'bn' ? 'রহস্যময় মহামারীর সংকেত' : 'Sudden Pandemic Warning',
        desc: lang === 'bn'
          ? 'হঠাৎ অজানা ভাইরাস ছড়িয়ে পড়েছে! সবাইকে বাঁচাতে দ্রুত মহাকাশে নতুন নিরাপদ আশ্রয়ের সন্ধান চাই।'
          : 'A sudden dangerous virus is spreading! Hospitals are overwhelmed. Humanity needs an emergency outpost!',
        icon: '🦠',
      });
    } else {
      setActiveAlert({
        title: lang === 'bn' ? 'পৃথিবীর জরুরি লাল সংকেত!' : 'Earth Emergency: Full Red Alert!',
        desc: lang === 'bn'
          ? 'অতিরিক্ত ভিড় ও মহামারীতে পৃথিবী বিপন্ন! আমাদের খুদে মহাকাশচারী বীরকে প্রস্তুত হতে হবে!'
          : 'Overcrowding and sudden sickness threaten Earth! Our Junior Astronaut must suit up for the rescue mission!',
        icon: '🚨',
      });
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-line bg-space-deep/90 text-text ${className}`} style={{ height }}>
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" title="Drag to spin Earth in 3D!" />

      {/* Top Banner: Crisis Mode Filter Toggles */}
      <div className="absolute top-2.5 inset-x-3 z-10 flex flex-wrap items-center justify-between gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-1 rounded-full border border-danger/40 bg-space-deep/80 px-2.5 py-1 text-xs font-bold text-danger backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
          </span>
          <span className="font-display font-extrabold uppercase tracking-wide">
            {lang === 'bn' ? 'পৃথিবীর সংকট ৩ডি' : 'Earth Crisis 3D'}
          </span>
        </div>

        {/* Buttons to switch crisis visualization */}
        <div className="flex items-center gap-1 rounded-full border border-line bg-panel/85 p-0.5 backdrop-blur-md">
          <button
            onClick={() => selectCrisisMode('all')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs font-extrabold transition ${
              crisis === 'all' ? 'bg-danger text-white shadow-sm' : 'text-muted hover:text-text'
            }`}
          >
            <AlertTriangle size={13} />
            <span>{lang === 'bn' ? 'সব সংকট' : 'All Threats'}</span>
          </button>

          <button
            onClick={() => selectCrisisMode('crowding')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs font-extrabold transition ${
              crisis === 'crowding' ? 'bg-[#e8a100] text-space-deep shadow-sm' : 'text-muted hover:text-text'
            }`}
          >
            <Users size={13} />
            <span>{lang === 'bn' ? 'জনসংখ্যা' : 'Overcrowding'}</span>
          </button>

          <button
            onClick={() => selectCrisisMode('pandemic')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-xs font-extrabold transition ${
              crisis === 'pandemic' ? 'bg-nova text-white shadow-sm' : 'text-muted hover:text-text'
            }`}
          >
            <Bug size={13} />
            <span>{lang === 'bn' ? 'মহামারী' : 'Pandemic'}</span>
          </button>
        </div>
      </div>

      {/* Floating 3D Gesture Hint */}
      {!isInteracting && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-go/40 bg-panel/90 px-3 py-1 text-[11px] font-bold text-go backdrop-blur-md shadow-lg animate-pulse">
          <RotateCw size={13} />
          <span>{lang === 'bn' ? 'ঘুরিয়ে দেখতে ৩ডি পৃথিবীতে হাত বোলাও' : 'Swipe or drag to spin Earth in 3D'}</span>
        </div>
      )}

      {/* Active Alert Card Popup (Bottom) */}
      {activeAlert && (
        <div className="absolute bottom-2 inset-x-3 z-10 flex items-center justify-between gap-2.5 rounded-xl border-2 border-line bg-panel/95 p-2.5 shadow-xl backdrop-blur-md animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeAlert.icon}</span>
            <div className="flex flex-col">
              <span className="font-display text-xs font-extrabold text-text">{activeAlert.title}</span>
              <span className="text-[11px] leading-tight text-muted line-clamp-2">{activeAlert.desc}</span>
            </div>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="shrink-0 rounded-lg bg-text/10 px-2 py-1 text-[10px] font-extrabold text-muted hover:text-text"
          >
            {lang === 'bn' ? 'বুঝেছি' : 'OK'}
          </button>
        </div>
      )}
    </div>
  );
}
