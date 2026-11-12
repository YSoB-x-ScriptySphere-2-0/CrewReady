import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../types";

export const Starfield: React.FC<{ density?: number }> = ({ density = 70 }) => {
  const frame = useCurrentFrame();

  const stars = useMemo(() => {
    return Array.from({ length: density }).map((_, i) => ({
      x: ((i * 137.5) % 100),
      y: ((i * 223.7) % 100),
      size: (i % 3) + 1.2,
      opacityBase: 0.3 + (i % 5) * 0.14,
      blinkSpeed: 15 + (i % 20),
      color: i % 7 === 0 ? THEME.cyan : i % 11 === 0 ? THEME.gold : "#ffffff",
    }));
  }, [density]);

  const nebulaShiftX = interpolate(frame, [0, 7110], [0, 40]);
  const nebulaShiftY = interpolate(frame, [0, 7110], [0, -30]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: THEME.bgDeep,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* Dynamic Cosmic Nebulas */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: "70%",
          height: "70%",
          background: `radial-gradient(circle, rgba(34, 215, 230, 0.12) 0%, transparent 65%)`,
          transform: `translate(${nebulaShiftX}px, ${nebulaShiftY}px)`,
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "75%",
          height: "75%",
          background: `radial-gradient(circle, rgba(232, 51, 139, 0.12) 0%, transparent 70%)`,
          transform: `translate(${-nebulaShiftX * 0.7}px, ${-nebulaShiftY * 0.7}px)`,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "30%",
          width: "50%",
          height: "50%",
          background: `radial-gradient(circle, rgba(245, 183, 0, 0.06) 0%, transparent 60%)`,
          filter: "blur(70px)",
        }}
      />

      {/* Stars with gentle twinkle */}
      {stars.map((s, i) => {
        const twinkle = Math.sin((frame / s.blinkSpeed) + i) * 0.3 + 0.7;
        const opacity = Math.min(1, Math.max(0.1, s.opacityBase * twinkle));

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              borderRadius: "50%",
              backgroundColor: s.color,
              opacity,
              boxShadow: s.size > 2 ? `0 0 6px ${s.color}` : "none",
            }}
          />
        );
      })}
    </div>
  );
};
