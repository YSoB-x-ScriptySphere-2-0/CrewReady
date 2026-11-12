import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene1B_Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popIn = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 100 },
  });

  const floatY = Math.sin(frame / 12) * 8;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "80px 120px",
        boxSizing: "border-box",
      }}
    >
      {/* Left side: Brand identity & Value Prop */}
      <div
        style={{
          maxWidth: "700px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          transform: `scale(${popIn})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span
            style={{
              backgroundColor: "rgba(34, 215, 230, 0.15)",
              border: `1.5px solid ${THEME.cyan}`,
              color: THEME.cyan,
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "1px",
            }}
          >
            NASA SPACE APPS 2026
          </span>
          <span style={{ color: THEME.muted, fontSize: "14px", fontWeight: 700 }}>
            CHALLENGE: MISSION TRAINER
          </span>
        </div>

        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "76px",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-1px",
              lineHeight: 1.05,
              textShadow: "0 0 40px rgba(34, 215, 230, 0.4)",
              fontFamily: "Nunito, system-ui",
            }}
          >
            Crew<span style={{ color: THEME.cyan }}>Ready</span>
          </h1>
          <p
            style={{
              margin: "12px 0 0 0",
              fontSize: "28px",
              color: THEME.gold,
              fontWeight: 700,
              fontFamily: "Nunito, system-ui",
            }}
          >
            Command your heroic Mars mission!
          </p>
        </div>

        {/* 4 Core Pillars Pills */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "10px" }}>
          {[
            { icon: "⚡", title: "Power", desc: "Solar panels & batteries", color: THEME.cyan },
            { icon: "💧", title: "Air & Water", desc: "Life support & leaks", color: "#38BDF8" },
            { icon: "🥗", title: "Food", desc: "Greenhouse & hydration", color: THEME.green },
            { icon: "🛡️", title: "Shielding", desc: "Solar storm protection", color: THEME.gold },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "rgba(20, 32, 77, 0.8)",
                border: `1px solid ${item.color}40`,
                borderRadius: "14px",
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{item.icon}</span>
              <div>
                <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px" }}>{item.title}</div>
                <div style={{ color: THEME.muted, fontSize: "13px" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: App UI Screenshot inside sleek tablet frame with Nova & Orbit */}
      <div
        style={{
          position: "relative",
          width: "740px",
          height: "440px",
          transform: `translateY(${floatY}px)`,
          filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.8))",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "24px",
            border: `3px solid rgba(34, 215, 230, 0.5)`,
            overflow: "hidden",
            backgroundColor: "#000",
            boxShadow: `0 0 30px rgba(34, 215, 230, 0.3)`,
          }}
        >
          <Img
            src={staticFile("images/app-home.png")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Orbit Character (Teal suit) standing on left */}
        <div
          style={{
            position: "absolute",
            left: "-60px",
            bottom: "-40px",
            width: "160px",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))",
          }}
        >
          <Img src={staticFile("art/orbit-wave.webp")} style={{ width: "100%" }} />
        </div>

        {/* Nova Character (Pink suit) cheer on right */}
        <div
          style={{
            position: "absolute",
            right: "-50px",
            bottom: "-40px",
            width: "150px",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))",
          }}
        >
          <Img src={staticFile("art/nova-cheer.webp")} style={{ width: "100%" }} />
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHO · Attention & Authenticity"
        timecode="0:08 - 0:18"
        text="That's CrewReady. A free browser game where kids run a real Mars mission. Every single choice costs something: power, air, food — or protection from the Sun."
        highlightWord="CrewReady"
      />
    </div>
  );
};
