import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene4C_Future: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 100 },
  });

  const roadmapItems = [
    {
      title: "Crew Mode (Multiplayer)",
      desc: "Friends take dedicated roles: Pilot, Botanist, Engineer, Doctor. Nobody wins alone.",
      icon: "👥",
      badge: "IN DEV",
      color: THEME.cyan,
    },
    {
      title: "Moon & Europa Missions",
      desc: "Expanding beyond Mars: Lunar South Pole ice mining & Europa sub-ice exploration.",
      icon: "🪐",
      badge: "ROADMAP",
      color: THEME.gold,
    },
    {
      title: "Educator Dashboard",
      desc: "Teachers track student trade-off strategies, science misconceptions, and completion rates.",
      icon: "📊",
      badge: "PILOT",
      color: THEME.green,
    },
    {
      title: "10 Global Languages",
      desc: "Bringing open space simulation to Spanish, Hindi, Arabic, French, Swahili, and beyond.",
      icon: "🌍",
      badge: "GLOBAL",
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
        padding: "50px 100px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <span
          style={{
            backgroundColor: "rgba(232, 51, 139, 0.15)",
            color: THEME.pink,
            border: `1.5px solid ${THEME.pink}`,
            padding: "4px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1px",
          }}
        >
          FUTURE HORIZON
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
          Beyond Mars: The Scalability Roadmap
        </h2>
      </div>

      {/* 4 Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          width: "100%",
          maxWidth: "1340px",
          transform: `scale(${pop})`,
        }}
      >
        {roadmapItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.9)",
              border: `1.5px solid ${item.color}70`,
              borderRadius: "20px",
              padding: "24px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "36px" }}>{item.icon}</span>
              <span
                style={{
                  backgroundColor: `${item.color}20`,
                  color: item.color,
                  padding: "4px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                {item.badge}
              </span>
            </div>
            <h3 style={{ margin: 0, color: "#ffffff", fontSize: "20px", fontWeight: 800 }}>
              {item.title}
            </h3>
            <p style={{ margin: 0, color: THEME.textSecondary, fontSize: "14px", lineHeight: 1.4 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      <SubtitleBar
        sectionTag="SO WHAT NEXT · Impact & Needs"
        timecode="3:14 - 3:30"
        text="Next: Crew Mode — you and your friends each take a role, and nobody can win alone. New worlds after Mars. A teacher dashboard. And the same mission in ten more languages, so every child on Earth can command it."
        highlightWord="Crew Mode"
      />
    </div>
  );
};
