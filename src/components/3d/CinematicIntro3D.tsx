// Interactive Marvel-Style WebGL Cinematic Prologue (Task 1 & BUILD_SEQUENCE.md K4)
// High-energy 3D Earth Crisis sequence with automated camera sweeps, particle shaders,
// comic panel overlays, procedural sound effects, and Junior Astronaut hero suit-up.
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Rocket, 
  Sparkles, 
  ArrowRight,
  Globe,
  Radio
} from 'lucide-react';
import { ComicPanelOverlay, CRISIS_DATA } from '../ComicPanelOverlay';
import { useI18n } from '../../content/i18n';
import { useGame } from '../../store/game';

interface CinematicIntro3DProps {
  onComplete: () => void;
}

export function CinematicIntro3D({ onComplete }: CinematicIntro3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const lang = useI18n((s) => s.lang);
  const leaveIntro = useGame((s) => s.leaveIntro);

  // Intro Stages: 0 = Earth Alert, 1 = 5 Crises, 2 = Mars Trajectory, 3 = Suit Up
  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [crisisIndex, setCrisisIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [selectedHero, setSelectedHero] = useState<'orbit' | 'nova'>('orbit');
  const [suitLocked, setSuitLocked] = useState(false);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const marsRef = useRef<THREE.Mesh | null>(null);
  const trajectoryLineRef = useRef<THREE.Line | null>(null);
  const hazardGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Procedural SFX synthesizer using Web Audio API
  const playSfx = (type: 'alarm' | 'glitch' | 'whoosh' | 'hero') => {
    if (muted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'alarm') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.linearRampToValueAtTime(880, now + 0.15);
        osc.frequency.linearRampToValueAtTime(440, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'glitch') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.setValueAtTime(800, now + 0.05);
        osc.frequency.setValueAtTime(240, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'whoosh') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.4);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'hero') {
        // High heroic chime
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const cOsc = ctx.createOscillator();
          const cGain = ctx.createGain();
          cOsc.type = 'sine';
          cOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
          cGain.gain.setValueAtTime(0.15, now + idx * 0.08);
          cGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          cOsc.connect(cGain);
          cGain.connect(ctx.destination);
          cOsc.start(now + idx * 0.08);
          cOsc.stop(now + idx * 0.08 + 0.45);
        });
      }
    } catch {
      // AudioContext not allowed before gesture
    }
  };

  // 1. Setup Three.js WebGL Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Cosmic Lighting
    const ambientLight = new THREE.AmbientLight(0x1a264a, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 3.5);
    sunLight.position.set(6, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x22d7e6, 1.5);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    // Deep Space Starfield
    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 60;
      starPos[i + 1] = (Math.random() - 0.5) * 60;
      starPos[i + 2] = (Math.random() - 0.5) * 50 - 10;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.14, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Procedural Earth Globe
    const earthGeo = new THREE.SphereGeometry(2.0, 48, 48);
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const ctx = earthCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f2b5c';
      ctx.fillRect(0, 0, 1024, 512);
      ctx.fillStyle = '#1e6f43';
      // Continent silhouettes
      ctx.beginPath();
      ctx.arc(300, 200, 120, 0, Math.PI * 2);
      ctx.arc(650, 180, 150, 0, Math.PI * 2);
      ctx.arc(480, 320, 90, 0, Math.PI * 2);
      ctx.arc(750, 340, 100, 0, Math.PI * 2);
      ctx.fill();
      // Glowing city gridlines (overpopulation)
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      for (let y = 120; y < 400; y += 40) {
        ctx.beginPath();
        ctx.moveTo(100, y);
        ctx.lineTo(924, y);
        ctx.stroke();
      }
    }
    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.1,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthRef.current = earth;
    scene.add(earth);

    // Atmospheric Crisis Warning Glow
    const glowGeo = new THREE.SphereGeometry(2.12, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide,
    });
    const atmosphereGlow = new THREE.Mesh(glowGeo, glowMat);
    earth.add(atmosphereGlow);

    // Crisis Hazard Rings Group
    const hazardGroup = new THREE.Group();
    hazardGroupRef.current = hazardGroup;
    earth.add(hazardGroup);

    // Ring 1: Red Equator Grid
    const ringGeo = new THREE.RingGeometry(2.3, 2.35, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff3b30, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    hazardGroup.add(ring);

    // Procedural Mars Globe (In Distance)
    const marsGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const marsMat = new THREE.MeshStandardMaterial({
      color: 0xd9622b,
      roughness: 0.85,
    });
    const mars = new THREE.Mesh(marsGeo, marsMat);
    mars.position.set(12, 3, -15);
    marsRef.current = mars;
    scene.add(mars);

    // Earth to Mars Trajectory Line
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(6, 4, -8),
      new THREE.Vector3(12, 3, -15)
    );
    const points = curve.getPoints(50);
    const trajectoryGeo = new THREE.BufferGeometry().setFromPoints(points);
    const trajectoryMat = new THREE.LineDashedMaterial({
      color: 0x22d7e6,
      dashSize: 0.4,
      gapSize: 0.2,
      linewidth: 2,
    });
    const trajectoryLine = new THREE.Line(trajectoryGeo, trajectoryMat);
    trajectoryLine.computeLineDistances();
    trajectoryLine.visible = false;
    trajectoryLineRef.current = trajectoryLine;
    scene.add(trajectoryLine);

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (earthRef.current) {
        earthRef.current.rotation.y += 0.003;
      }
      if (hazardGroupRef.current) {
        hazardGroupRef.current.rotation.z += 0.005;
      }
      if (marsRef.current) {
        marsRef.current.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      renderer.forceContextLoss();
      container.replaceChildren();
    };
  }, []);

  // 2. Automated Marvel Timeline Controller
  useEffect(() => {
    // Stage 0: Earth in Crisis (0 - 7s)
    const t0 = setTimeout(() => {
      setStage(1);
      playSfx('alarm');
    }, 7000);

    return () => clearTimeout(t0);
  }, []);

  // Cycle through 5 Crises when in Stage 1
  useEffect(() => {
    if (stage !== 1) return;

    const interval = setInterval(() => {
      setCrisisIndex((prev) => {
        const next = prev + 1;
        playSfx(next % 2 === 0 ? 'alarm' : 'glitch');
        if (next >= CRISIS_DATA.length) {
          clearInterval(interval);
          setStage(2); // Advance to Mars Trajectory
          playSfx('whoosh');
          return 0;
        }
        return next;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [stage]);

  // Stage 2 Camera Sweep to Mars
  useEffect(() => {
    if (stage === 2 && cameraRef.current && trajectoryLineRef.current) {
      trajectoryLineRef.current.visible = true;

      // Animate camera pulling back to show Earth and Mars together
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.05;
        if (cameraRef.current) {
          cameraRef.current.position.set(progress * 4, progress * 1.5, 7.5 + progress * 6);
          cameraRef.current.lookAt(6, 1.5, -7);
        }
        if (progress >= 1.0) {
          clearInterval(interval);
        }
      }, 30);

      const tSuit = setTimeout(() => {
        setStage(3); // Go to Suit Up
        playSfx('hero');
      }, 5500);

      return () => {
        clearInterval(interval);
        clearTimeout(tSuit);
      };
    }
  }, [stage]);

  const handleLaunchMission = () => {
    playSfx('whoosh');
    setSuitLocked(true);
    setTimeout(() => {
      leaveIntro('home');
      onComplete();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep overflow-hidden select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0 h-full w-full pointer-events-auto" />

      {/* Top Header: Audio Mute & Skip Button */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border-2 border-line bg-panel/90 px-3 py-1 shadow-md">
          <Radio size={14} className="text-red-400 animate-pulse" />
          <span className="font-display text-xs font-black tracking-wider text-text uppercase">
            {stage === 0 
              ? (lang === 'bn' ? 'সতর্কতা: পৃথিবী বিপর্যয়' : 'ALERT: EARTH DESTABILIZING') 
              : stage === 1 
              ? (lang === 'bn' ? '৫টি বৈশ্বিক হুমকি' : 'THE 5 EXTINCTION THREATS')
              : stage === 2 
              ? (lang === 'bn' ? 'মঙ্গল অভিযানের ডাক' : 'PROJECT CREWREADY') 
              : (lang === 'bn' ? 'মহাকাশচারী বীর নির্বাচন' : 'SELECT YOUR JUNIOR HERO')}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMuted(!muted)}
            aria-label="Toggle Audio"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-line bg-panel text-text hover:bg-panel-up transition cursor-pointer"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <button
            type="button"
            onClick={() => {
              leaveIntro('home');
              onComplete();
            }}
            className="flex min-h-[2.5rem] items-center gap-1.5 rounded-full border-2 border-line bg-panel px-4 py-1.5 font-display text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-panel-up transition active:scale-95 cursor-pointer"
          >
            <SkipForward size={16} />
            <span>{lang === 'bn' ? 'স্কিপ করুন' : 'Skip Intro'}</span>
          </button>
        </div>
      </div>

      {/* STAGE 0: Dramatic Call to Humanity Opening Banner */}
      {stage === 0 && (
        <div className="relative z-20 flex max-w-xl flex-col items-center p-4 text-center anim-pop-in">
          <div className="rounded-2xl border-3 border-red-500/90 bg-red-950/85 p-5 shadow-2xl backdrop-blur-none">
            <span className="inline-block rounded-full bg-red-500 px-3 py-0.5 font-display text-xs font-black text-black uppercase tracking-widest mb-2">
              {lang === 'bn' ? 'জরুরি সম্প্রচার' : 'EMERGENCY BROADCAST'}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
              YOUR DECISION MATTERS TO KEEP THE HUMANITY ALIVE.
            </h1>
            <p className="mt-2 font-display text-xl sm:text-2xl font-black text-amber-300">
              ARE YOU READY?
            </p>

            <div className="mt-4 rounded-xl border border-white/20 bg-space/90 p-3 text-left">
              <p className="font-display text-sm font-extrabold text-cyan-300">
                "No worries dude. - <span className="text-white font-black underline decoration-go">CrewREADY</span> is ready to make you READY!"
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setStage(1);
                playSfx('alarm');
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#48e3f0] to-go py-3 font-display text-base font-black text-go-text shadow-[0_0.3rem_0_var(--color-go-lip)] hover:brightness-105 active:translate-y-0.5 cursor-pointer"
            >
              <span>{lang === 'bn' ? 'হুমকিগুলো দেখুন' : 'Inspect Earth Threats'}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 1: Marvel Sliding Comic Panels Overlay */}
      {stage === 1 && (
        <ComicPanelOverlay
          activeCrisisIndex={crisisIndex}
          onSelectCrisis={(idx) => {
            setCrisisIndex(idx);
            playSfx('glitch');
          }}
        />
      )}

      {/* STAGE 2: Mars Trajectory Call to Action */}
      {stage === 2 && (
        <div className="relative z-20 flex max-w-lg flex-col items-center p-4 text-center anim-pop-in">
          <div className="rounded-2xl border-3 border-go bg-panel/95 p-5 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-go/20 text-go border-2 border-go mb-2">
              <Globe size={26} />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white">
              {lang === 'bn' ? 'মঙ্গল গ্রহ: মানবতার নতুন ঠিকানা' : 'Mars: The Second Home For Humanity'}
            </h2>
            <p className="mt-2 font-display text-xs sm:text-sm font-bold text-text/90">
              {lang === 'bn' 
                ? 'পৃথিবীকে সুস্থ করার সময় দিতে আমরা তৈরি করছি মঙ্গল কলোনি। আমাদের প্রয়োজন সবচেয়ে সাহসী ক্ষুদে মহাকাশচারী বীর!' 
                : 'To give Earth time to heal, we must reach Mars and safeguard life. Space Command needs a fearless Junior Astronaut!'}
            </p>

            <button
              type="button"
              onClick={() => {
                setStage(3);
                playSfx('hero');
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#48e3f0] to-go py-3 font-display text-sm sm:text-base font-black text-go-text shadow-[0_0.3rem_0_var(--color-go-lip)] hover:brightness-105 active:translate-y-0.5 cursor-pointer"
            >
              <Sparkles size={18} />
              <span>{lang === 'bn' ? 'মহাকাশ স্যুট পরুন' : 'Suit Up As Junior Astronaut'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3: Hero Selection & Launch Climax */}
      {stage === 3 && (
        <div className="relative z-20 flex w-full max-w-2xl flex-col items-center p-4 anim-pop-in">
          <div className="w-full rounded-2xl border-3 border-go bg-panel/95 p-4 sm:p-6 shadow-2xl">
            <div className="text-center mb-4">
              <span className="inline-block rounded-full bg-good/20 border border-good px-3 py-0.5 font-display text-[11px] font-extrabold text-good uppercase tracking-wider">
                {lang === 'bn' ? 'বীর নির্বাচন' : 'HERO CADET SELECTION'}
              </span>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-black text-white">
                {lang === 'bn' ? 'তুমি কার মতো হতে চাও?' : 'Choose Your Junior Astronaut Hero'}
              </h2>
            </div>

            {/* Orbit vs Nova Hero Selection Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Orbit Card */}
              <button
                type="button"
                onClick={() => {
                  setSelectedHero('orbit');
                  playSfx('glitch');
                }}
                className={`flex flex-col items-center rounded-xl border-3 p-3 transition-all cursor-pointer ${
                  selectedHero === 'orbit' 
                    ? 'border-go bg-go/15 shadow-[0_0_15px_rgba(34,215,230,0.4)] scale-102' 
                    : 'border-line bg-panel-up hover:border-white/40'
                }`}
              >
                <img
                  src={`${import.meta.env.BASE_URL}art/orbit-stand.webp`}
                  alt="Orbit"
                  className="h-28 sm:h-36 object-contain"
                />
                <span className="mt-2 font-display text-base font-black text-white">Orbit</span>
                <span className="font-display text-[11px] font-extrabold text-cyan-300">
                  {lang === 'bn' ? 'সাহসী পাইলট' : 'Brave Pilot'}
                </span>
              </button>

              {/* Nova Card */}
              <button
                type="button"
                onClick={() => {
                  setSelectedHero('nova');
                  playSfx('glitch');
                }}
                className={`flex flex-col items-center rounded-xl border-3 p-3 transition-all cursor-pointer ${
                  selectedHero === 'nova' 
                    ? 'border-go bg-go/15 shadow-[0_0_15px_rgba(34,215,230,0.4)] scale-102' 
                    : 'border-line bg-panel-up hover:border-white/40'
                }`}
              >
                <img
                  src={`${import.meta.env.BASE_URL}art/nova-stand.webp`}
                  alt="Nova"
                  className="h-28 sm:h-36 object-contain"
                />
                <span className="mt-2 font-display text-base font-black text-white">Nova</span>
                <span className="font-display text-[11px] font-extrabold text-pink-300">
                  {lang === 'bn' ? 'বিজ্ঞানী লিডার' : 'Science Leader'}
                </span>
              </button>
            </div>

            {/* Gen Alpha Twinkle Encouragement */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-space-deep p-2.5">
              <img
                src={`${import.meta.env.BASE_URL}art/twinkle-happy.webp`}
                alt="Twinkle"
                className="h-8 w-8 object-contain shrink-0"
              />
              <p className="font-display text-xs font-extrabold text-cyan-300 leading-tight">
                {lang === 'bn' 
                  ? 'টুইঙ্কেল: "সব সেন্সর প্রস্তুত, ক্যাডেট! রকেট তৈরি, চলো আমরা মহাকাশ অভিযানে যাই!"'
                  : 'Twinkle: "All systems green, Cadet! Flight suit calibrated! Let\'s blast off and explore!"'}
              </p>
            </div>

            {/* Launch Mission Button */}
            <button
              type="button"
              disabled={suitLocked}
              onClick={handleLaunchMission}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#48e3f0] to-go py-3.5 font-display text-base sm:text-lg font-black text-go-text shadow-[0_0.35rem_0_var(--color-go-lip)] hover:brightness-105 active:translate-y-0.5 cursor-pointer disabled:opacity-80"
            >
              <Rocket size={20} className={suitLocked ? 'animate-bounce' : ''} />
              <span>
                {suitLocked 
                  ? (lang === 'bn' ? 'ইগনিশন চালু হচ্ছে...' : 'Igniting Thrusters...') 
                  : (lang === 'bn' ? `লঞ্চ মিশন ১: ${selectedHero.toUpperCase()}` : `Launch Mission 1 as ${selectedHero.toUpperCase()}`)}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
