import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { MeterBar } from "../components/MeterBar";
import { THEME } from "../types";

export const Scene3A_BigIdea: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "60px 100px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <span
          style={{
            backgroundColor: "rgba(34, 215, 230, 0.15)",
            color: THEME.cyan,
            border: `1.5px solid ${THEME.cyan}`,
            padding: "4px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1px",
          }}
        >
          WHAT · THE BIG INNOVATION
        </span>
        <h2
          style={{
            margin: "8px 0 0 0",
            fontSize: "44px",
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "Nunito, system-ui",
          }}
        >
          6 Levels. 4 Coupled Meters. Zero Free Choices.
        </h2>
      </div>

      {/* 4 Interactive Meters Showcase */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          width: "100%",
          maxWidth: "1280px",
          marginBottom: "32px",
        }}
      >
        <MeterBar label="Power (P)" icon="⚡" value={82} color={THEME.cyan} />
        <MeterBar label="Air & Water (L)" icon="💧" value={64} color="#38BDF8" />
        <MeterBar label="Food (F)" icon="🥗" value={78} color={THEME.green} />
        <MeterBar label="Shield (S)" icon="🛡️" value={55} color={THEME.gold} />
      </div>

      {/* The 6 Levels Mission Flowchart */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "14px",
          width: "100%",
          maxWidth: "1280px",
          transform: `scale(${pop})`,
        }}
      >
        {[
          { num: "01", name: "The Last Departure", icon: "📦", task: "Pack 8 rocket crates" },
          { num: "02", name: "The Dangerous Journey", icon: "☀️", task: "Solar storm shelter" },
          { num: "03", name: "Red Planet Touchdown", icon: "🛬", task: "Descent & cabin leak" },
          { num: "04", name: "The Dust Wall", icon: "🌪️", task: "Sol 214 panel crisis" },
          { num: "05", name: "The Greenhouse Sol", icon: "🌱", task: "Hydroponics vs water" },
          { num: "06", name: "The Sol 500 Outpost", icon: "👨‍🚀", task: "Final crew roles" },
        ].map((lvl, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.85)",
              border: `1.5px solid rgba(34, 215, 230, 0.35)`,
              borderRadius: "18px",
              padding: "20px 14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "8px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "rgba(34, 215, 230, 0.2)",
                color: THEME.cyan,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                fontSize: "14px",
                fontFamily: "monospace",
              }}
            >
              {lvl.num}
            </div>
            <div style={{ fontSize: "30px" }}>{lvl.icon}</div>
            <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "14px", lineHeight: 1.2 }}>
              {lvl.name}
            </div>
            <div style={{ color: THEME.muted, fontSize: "12px" }}>{lvl.task}</div>
          </div>
        ))}
      </div>

      <SubtitleBar
        sectionTag="WHAT · The Innovation"
        timecode="1:45 - 1:58"
        text="CrewReady is a six-level Mars survival game. You pack the rocket, dodge a solar storm, land on Mars, fix a leaking cabin, grow food, and pick your final crew. Every choice trades one meter against another. Nothing is free."
        highlightWord="six-level Mars survival game"
      />
    </div>
  );
};
