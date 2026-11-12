// Canvas 2D Perspective Renderer for Fly — BUILD_SEQUENCE.md S2 / plan.md §7 row 2
// Mars orbital runway, 3D perspective projection, authentic tokens, no external assets required.

import type { FlyState } from './types';

// Star background particles
interface Star {
  x: number; // 0 to 1
  y: number; // 0 to 1
  size: number;
  alpha: number;
}

let cachedStars: Star[] | null = null;
function getStars(count = 70): Star[] {
  if (cachedStars) return cachedStars;
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random() * 0.45, // upper sky
      size: 1 + Math.random() * 2,
      alpha: 0.3 + Math.random() * 0.7,
    });
  }
  cachedStars = stars;
  return stars;
}

export function renderFly(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: FlyState,
  pilotWho: 'orbit' | 'nova' = 'orbit'
) {
  // Clear full frame
  ctx.clearRect(0, 0, width, height);

  const horizonY = height * 0.36;
  const bottomY = height * 0.98;
  const vanishingX = width * 0.5;
  const runwayBaseWidth = width * 0.85;
  const laneBaseWidth = runwayBaseWidth / 3;

  // 1. Deep Space & Martian Sky Background
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#070B1E'); // space-deep
  skyGrad.addColorStop(0.65, '#0B1437'); // space
  skyGrad.addColorStop(1, '#6E2818'); // distant Mars dusty atmospheric glow
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, horizonY);

  // Distant twinkling stars
  const stars = getStars();
  for (const s of stars) {
    ctx.fillStyle = `rgba(244, 247, 255, ${s.alpha * (0.8 + Math.sin(state.distance * 0.05 + s.x * 10) * 0.2)})`;
    ctx.fillRect(s.x * width, s.y * height, s.size, s.size);
  }

  // Distant Mars Crater Mountains on horizon
  ctx.fillStyle = '#441810';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  const mountainSteps = 16;
  for (let i = 0; i <= mountainSteps; i++) {
    const mx = (width / mountainSteps) * i;
    const my = horizonY - Math.sin((i / mountainSteps) * Math.PI * 3 + 1) * (height * 0.04);
    ctx.lineTo(mx, my);
  }
  ctx.lineTo(width, horizonY);
  ctx.closePath();
  ctx.fill();

  // 2. 3D Converging Runway Surface
  const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
  groundGrad.addColorStop(0, '#190A08'); // dark horizon red
  groundGrad.addColorStop(0.3, '#2A120E');
  groundGrad.addColorStop(1, '#14204D'); // navy panel bottom
  ctx.fillStyle = groundGrad;

  // Trapezoid runway
  ctx.beginPath();
  ctx.moveTo(vanishingX - width * 0.04, horizonY);
  ctx.lineTo(vanishingX + width * 0.04, horizonY);
  ctx.lineTo(vanishingX + runwayBaseWidth * 0.5, bottomY);
  ctx.lineTo(vanishingX - runwayBaseWidth * 0.5, bottomY);
  ctx.closePath();
  ctx.fill();

  // 3. Runway Lane Dividers & Grid lines
  ctx.lineWidth = 2;
  const projectPoint = (laneNorm: number, z: number) => {
    // Perspective scale: z in [0, 80] meters
    const scale = 1 / (1 + z * 0.065);
    const y = horizonY + (bottomY - horizonY) * scale;
    const laneSpan = laneBaseWidth * scale;
    const x = vanishingX + laneNorm * laneSpan;
    return { x, y, scale };
  };

  // Lane separator lines (-1.5, -0.5, 0.5, 1.5)
  const laneEdges = [-1.5, -0.5, 0.5, 1.5];
  for (const edge of laneEdges) {
    const near = projectPoint(edge, 0);
    const far = projectPoint(edge, 70);
    ctx.strokeStyle = Math.abs(edge) === 1.5 ? '#22D7E6' : 'rgba(58, 74, 140, 0.6)';
    ctx.beginPath();
    ctx.moveTo(near.x, near.y);
    ctx.lineTo(far.x, far.y);
    ctx.stroke();
  }

  // Cross grid bars moving towards player with distance
  const gridSpacing = 6; // meters
  const gridOffset = state.distance % gridSpacing;
  ctx.strokeStyle = 'rgba(58, 74, 140, 0.35)';
  ctx.lineWidth = 1.5;
  for (let gz = gridSpacing - gridOffset; gz < 65; gz += gridSpacing) {
    const leftP = projectPoint(-1.5, gz);
    const rightP = projectPoint(1.5, gz);
    ctx.beginPath();
    ctx.moveTo(leftP.x, leftP.y);
    ctx.lineTo(rightP.x, rightP.y);
    ctx.stroke();
  }

  // 4. Sort and render entities (Obstacles & Items) from back to front
  interface RenderEntity {
    z: number;
    draw: () => void;
  }

  const entities: RenderEntity[] = [];

  // Add Obstacles
  for (const obs of state.obstacles) {
    if (obs.z < -2 || obs.z > 70) continue;
    entities.push({
      z: obs.z,
      draw: () => {
        const { x, y, scale } = projectPoint(obs.lane, obs.z);
        const w = 48 * scale;
        const h = obs.kind === 'tallRock' ? 70 * scale : 26 * scale;

        // Rock drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(x, y, w * 0.6, h * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();

        if (obs.kind === 'tallRock') {
          // Martian Monolith Boulder
          ctx.fillStyle = '#8B3824';
          ctx.strokeStyle = '#D9622B';
          ctx.lineWidth = Math.max(1, 2 * scale);
          ctx.beginPath();
          ctx.moveTo(x - w * 0.45, y);
          ctx.lineTo(x - w * 0.35, y - h);
          ctx.lineTo(x + w * 0.1, y - h * 1.05);
          ctx.lineTo(x + w * 0.45, y - h * 0.7);
          ctx.lineTo(x + w * 0.4, y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Highlight edge
          ctx.fillStyle = '#C45224';
          ctx.beginPath();
          ctx.moveTo(x - w * 0.35, y - h);
          ctx.lineTo(x + w * 0.1, y - h * 1.05);
          ctx.lineTo(x, y - h * 0.3);
          ctx.closePath();
          ctx.fill();
        } else if (obs.kind === 'lowRock') {
          // Low jumpable rock ridge with hop beacon
          ctx.fillStyle = '#A84820';
          ctx.strokeStyle = '#F5B700';
          ctx.lineWidth = Math.max(1, 2 * scale);
          ctx.beginPath();
          ctx.roundRect(x - w * 0.5, y - h, w, h, 6 * scale);
          ctx.fill();
          ctx.stroke();

          // Glowing upward arrow hop hint
          ctx.strokeStyle = '#F4F7FF';
          ctx.lineWidth = Math.max(1, 2 * scale);
          ctx.beginPath();
          ctx.moveTo(x - 8 * scale, y - h * 0.3);
          ctx.lineTo(x, y - h * 0.75);
          ctx.lineTo(x + 8 * scale, y - h * 0.3);
          ctx.stroke();
        } else {
          // Metallic Debris
          ctx.fillStyle = '#4A5568';
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = Math.max(1, 2 * scale);
          ctx.strokeRect(x - w * 0.4, y - h * 0.8, w * 0.8, h * 0.8);
          ctx.fillRect(x - w * 0.35, y - h * 0.75, w * 0.7, h * 0.7);
        }
      },
    });
  }

  // Add Items (Stardust & Powers)
  for (const item of state.items) {
    if (item.z < -2 || item.z > 70) continue;
    entities.push({
      z: item.z,
      draw: () => {
        const { x, y, scale } = projectPoint(item.lane, item.z);
        const floatY = y - (item.yOffset ?? 0) * 30 * scale - 18 * scale;

        if (item.kind === 'stardust') {
          // Golden Stardust Diamond / Star
          const size = 16 * scale;
          ctx.fillStyle = '#F5B700';
          ctx.strokeStyle = '#FFF8EC';
          ctx.lineWidth = Math.max(1, 1.5 * scale);

          // Glowing diamond
          ctx.beginPath();
          ctx.moveTo(x, floatY - size);
          ctx.lineTo(x + size * 0.8, floatY);
          ctx.lineTo(x, floatY + size);
          ctx.lineTo(x - size * 0.8, floatY);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Core shine
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(x, floatY, size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Power Pickup Beacon (Shield / Magnet / Boost)
          const radius = 22 * scale;
          const color = item.kind === 'shield' ? '#22D7E6' : item.kind === 'magnet' ? '#F5B700' : '#E8338B';

          // Outer aura ring
          ctx.strokeStyle = color;
          ctx.lineWidth = Math.max(1.5, 3 * scale);
          ctx.beginPath();
          ctx.arc(x, floatY, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Core disc
          ctx.fillStyle = '#0B1437';
          ctx.beginPath();
          ctx.arc(x, floatY, radius * 0.85, 0, Math.PI * 2);
          ctx.fill();

          // Distinct Power Symbol
          ctx.strokeStyle = '#F4F7FF';
          ctx.fillStyle = '#F4F7FF';
          ctx.lineWidth = Math.max(1.5, 2.5 * scale);

          if (item.kind === 'shield') {
            // Shield crest icon
            ctx.beginPath();
            ctx.moveTo(x - 6 * scale, floatY - 8 * scale);
            ctx.lineTo(x + 6 * scale, floatY - 8 * scale);
            ctx.lineTo(x + 6 * scale, floatY);
            ctx.lineTo(x, floatY + 8 * scale);
            ctx.lineTo(x - 6 * scale, floatY);
            ctx.closePath();
            ctx.stroke();
          } else if (item.kind === 'magnet') {
            // Horseshoe Magnet arc
            ctx.beginPath();
            ctx.arc(x, floatY - 2 * scale, 7 * scale, Math.PI, 0);
            ctx.lineTo(x + 7 * scale, floatY + 6 * scale);
            ctx.lineTo(x + 3 * scale, floatY + 6 * scale);
            ctx.lineTo(x + 3 * scale, floatY - 2 * scale);
            ctx.arc(x, floatY - 2 * scale, 3 * scale, 0, Math.PI, true);
            ctx.lineTo(x - 3 * scale, floatY + 6 * scale);
            ctx.lineTo(x - 7 * scale, floatY + 6 * scale);
            ctx.closePath();
            ctx.stroke();
          } else {
            // Lightning Boost icon
            ctx.beginPath();
            ctx.moveTo(x + 2 * scale, floatY - 9 * scale);
            ctx.lineTo(x - 5 * scale, floatY + 1 * scale);
            ctx.lineTo(x, floatY + 1 * scale);
            ctx.lineTo(x - 2 * scale, floatY + 9 * scale);
            ctx.lineTo(x + 6 * scale, floatY - 1 * scale);
            ctx.lineTo(x + 1 * scale, floatY - 1 * scale);
            ctx.closePath();
            ctx.fill();
          }
        }
      },
    });
  }

  // Draw entities sorted by z (farthest first)
  entities.sort((a, b) => b.z - a.z);
  for (const e of entities) {
    e.draw();
  }

  // 5. Draw the Pilot Astronaut (seen from behind)
  const pilotPos = projectPoint(state.laneX, 0);
  const pilotScale = pilotPos.scale;
  const jumpOffset = state.hopHeight * 65 * pilotScale;
  const px = pilotPos.x;
  const py = pilotPos.y - jumpOffset;

  // Stumble flicker: blink every 0.1s when recovering
  const isFlickering = state.stumbleTimer > 0 && Math.floor(state.stumbleTimer * 12) % 2 === 0;

  if (!isFlickering) {
    // Drop shadow on ground (stays on ground during hop)
    const shadowScale = 1 - state.hopHeight * 0.4;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(px, pilotPos.y, 28 * pilotScale * shadowScale, 9 * pilotScale * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Active power halo around pilot
    if (state.activePower) {
      const pColor = state.activePower === 'shield' ? '#22D7E6' : state.activePower === 'magnet' ? '#F5B700' : '#E8338B';
      // Shrinking outer ring indicating remaining power time
      const ringRadius = (38 + (state.powerRemaining / 6.0) * 16) * pilotScale;
      ctx.strokeStyle = pColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px, py - 32 * pilotScale, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Shield bubble
      if (state.activePower === 'shield') {
        ctx.fillStyle = 'rgba(34, 215, 230, 0.15)';
        ctx.beginPath();
        ctx.arc(px, py - 32 * pilotScale, 38 * pilotScale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Pilot Body & Suit (from behind)
    const suitColor = pilotWho === 'nova' ? '#E8338B' : '#19A7B8'; // pink for Nova, teal for Orbit
    const suitWidth = 36 * pilotScale;
    const suitHeight = 54 * pilotScale;

    // Thruster Jet Flames
    const flameHeight = (12 + Math.random() * 8) * pilotScale;
    ctx.fillStyle = state.activePower === 'boost' ? '#E8338B' : '#22D7E6';
    // Left nozzle flame
    ctx.beginPath();
    ctx.moveTo(px - 10 * pilotScale, py - 18 * pilotScale);
    ctx.lineTo(px - 6 * pilotScale, py - 18 * pilotScale);
    ctx.lineTo(px - 8 * pilotScale, py - 18 * pilotScale + flameHeight);
    ctx.closePath();
    ctx.fill();
    // Right nozzle flame
    ctx.beginPath();
    ctx.moveTo(px + 6 * pilotScale, py - 18 * pilotScale);
    ctx.lineTo(px + 10 * pilotScale, py - 18 * pilotScale);
    ctx.lineTo(px + 8 * pilotScale, py - 18 * pilotScale + flameHeight);
    ctx.closePath();
    ctx.fill();

    // Backpack life-support tank
    ctx.fillStyle = '#14204D'; // dark panel
    ctx.strokeStyle = '#3A4A8C';
    ctx.lineWidth = 2 * pilotScale;
    ctx.beginPath();
    ctx.roundRect(px - suitWidth * 0.35, py - suitHeight * 0.72, suitWidth * 0.7, suitHeight * 0.5, 6 * pilotScale);
    ctx.fill();
    ctx.stroke();

    // Torso Suit
    ctx.fillStyle = suitColor;
    ctx.beginPath();
    ctx.roundRect(px - suitWidth * 0.45, py - suitHeight * 0.75, suitWidth * 0.9, suitHeight * 0.55, 8 * pilotScale);
    ctx.fill();

    // Helmet back
    ctx.fillStyle = '#F4F7FF';
    ctx.strokeStyle = '#3A4A8C';
    ctx.lineWidth = 2 * pilotScale;
    ctx.beginPath();
    ctx.ellipse(px, py - suitHeight * 0.85, 17 * pilotScale, 15 * pilotScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Helmet collar ring
    ctx.fillStyle = '#14204D';
    ctx.beginPath();
    ctx.roundRect(px - 14 * pilotScale, py - suitHeight * 0.68, 28 * pilotScale, 6 * pilotScale, 3 * pilotScale);
    ctx.fill();
  }

  // 6. Floating Text Pops (+1, +2, SMASH, -1 HULL)
  ctx.font = '800 16px "Baloo Da 2", sans-serif';
  ctx.textAlign = 'center';
  for (const pop of state.pops) {
    const { x } = projectPoint(pop.lane, 0);
    const alpha = Math.max(0, 1 - pop.age / 0.9);
    ctx.fillStyle = pop.color;
    ctx.globalAlpha = alpha;
    ctx.fillText(pop.text, x, py - pop.y * 35);
  }
  ctx.globalAlpha = 1.0;
}
