import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene4D_TheAsk: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 100 },
  });

  const asks = [
    {
      title: "NASA Data Partnership",
      desc: "Direct integration with deep telemetry & active Artemis / Mars mission feeds.",
      icon: "🤝",
      tag: "AGENCY",
      color: THEME.cyan,
    },
    {
      title: "Open Source Community",
      desc: "Licensed under Apache-2.0. Inviting global developers for multiplayer WebSockets & sound.",
      icon: "🌐",
      tag: "APACHE 2.0",
      color: THEME.gold,
    },
    {
      title: "School Tablet Pilots",
      desc: "Deploying across classrooms in Bangladesh and worldwide as a standard STEM simulation module.",
      icon: "🏫",
      tag: "CLASSROOMS",
      color: THEME.pink,
    },
  ];

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
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
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
          OUR CALL TO ACTION
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
          What We Need to Take It Further
        </h2>
      </div>

      {/* 3 Call-To-Action Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "28px",
          width: "100%",
          maxWidth: "1300px",
          transform: `scale(${pop})`,
        }}
      >
        {asks.map((a, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.9)",
              border: `2px solid ${a.color}70`,
              borderRadius: "24px",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: `${a.color}20`,
                border: `2px solid ${a.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                boxShadow: `0 0 20px ${a.color}40`,
              }}
            >
              {a.icon}
            </div>

            <span
              style={{
                backgroundColor: `${a.color}20`,
                color: a.color,
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 900,
              }}
            >
              {a.tag}
            </span>

            <h3 style={{ margin: 0, color: "#ffffff", fontSize: "24px", fontWeight: 800 }}>
              {a.title}
            </h3>

            <p style={{ margin: 0, color: THEME.textSecondary, fontSize: "15px", lineHeight: 1.5 }}>
              {a.desc}
            </p>
          </div>
        ))}
      </div>

      <SubtitleBar
        sectionTag="SO WHAT NEXT · Impact & Needs"
        timecode="3:30 - 3:45"
        text="We need three things: a NASA partnership to access deeper data. Open-source contributors to build Crew Mode. And schools in Bangladesh — and everywhere — to put this on their tablets."
        highlightWord="three things"
      />
    </div>
  );
};
