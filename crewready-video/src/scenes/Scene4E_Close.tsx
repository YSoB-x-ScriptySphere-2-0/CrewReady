import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene4E_Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 90 },
  });

  const floatY = Math.sin(frame / 14) * 6;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 100px",
        boxSizing: "border-box",
      }}
    >
      {/* Nazrul Quote Card */}
      <div
        style={{
          transform: `scale(${pop})`,
          backgroundColor: "rgba(20, 32, 77, 0.95)",
          border: `2px solid ${THEME.gold}`,
          borderRadius: "28px",
          padding: "36px 60px",
          textAlign: "center",
          maxWidth: "1080px",
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(245, 183, 0, 0.3)`,
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            fontSize: "36px",
            color: THEME.gold,
            fontWeight: 800,
            fontFamily: "Baloo Da 2, sans-serif",
            marginBottom: "12px",
          }}
        >
          "আমি বদ্ধ ঘরে থাকব না — আমি জগৎ দেখব।"
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#ffffff",
            fontWeight: 700,
            fontFamily: "Nunito, system-ui",
            fontStyle: "italic",
          }}
        >
          "I will not stay in a closed room — I will see the world."
        </div>
        <div
          style={{
            marginTop: "12px",
            fontSize: "14px",
            color: THEME.muted,
            fontWeight: 800,
            letterSpacing: "1px",
          }}
        >
          — KAZI NAZRUL ISLAM · NATIONAL POET OF BANGLADESH
        </div>
      </div>

      {/* Main Closing Call to Action & Characters */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "40px",
          transform: `translateY(${floatY}px)`,
        }}
      >
        {/* Orbit Character (Teal suit) */}
        <div style={{ width: "140px", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))" }}>
          <Img src={staticFile("art/orbit-wave.webp")} style={{ width: "100%" }} />
        </div>

        {/* Center Brand URL */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "64px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-1px",
              fontFamily: "Nunito, system-ui",
            }}
          >
            Crew<span style={{ color: THEME.cyan }}>Ready</span>
          </h1>
          <div
            style={{
              marginTop: "8px",
              display: "inline-block",
              backgroundColor: THEME.cyan,
              color: "#070b1e",
              fontWeight: 900,
              fontSize: "24px",
              padding: "8px 28px",
              borderRadius: "30px",
              boxShadow: `0 0 25px ${THEME.cyanGlow}`,
              fontFamily: "monospace",
            }}
          >
            https://crewready.app
          </div>
          <div
            style={{
              marginTop: "12px",
              color: THEME.muted,
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            NASA Space Apps Challenge 2026 · Open Source under Apache-2.0
          </div>
        </div>

        {/* Nova Character (Pink suit) */}
        <div style={{ width: "135px", filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))" }}>
          <Img src={staticFile("art/nova-wave.webp")} style={{ width: "100%" }} />
        </div>
      </div>

      <SubtitleBar
        sectionTag="SO WHAT NEXT · Vision & Close"
        timecode="3:45 - 3:57"
        text="Kazi Nazrul Islam, Bangladesh's poet of freedom, wrote: 'I will not stay in a closed room — I will see the world.' We made CrewReady so every kid can start. Come play."
        highlightWord="Come play"
      />
    </div>
  );
};
