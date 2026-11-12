import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene4A_Impact: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badges = [
    { num: "1", title: "Life Support", desc: "Water is heavy; 93% must be recycled", icon: "💧", color: "#38BDF8" },
    { num: "2", title: "Radiation", desc: "Solar flares require water bunker shielding", icon: "🛡️", color: THEME.gold },
    { num: "3", title: "Power Balance", desc: "Martian dust storms block up to 99% of sunlight", icon: "⚡", color: THEME.cyan },
    { num: "4", title: "Food Growth", desc: "Hydroponic crops trade water for oxygen", icon: "🌱", color: THEME.green },
    { num: "5", title: "Comms Lag", desc: "Speed-of-light delay forces local autonomy", icon: "📡", color: THEME.pink },
    { num: "6", title: "Crew Systems", desc: "Complementary skills prevent base collapse", icon: "👨‍🚀", color: "#A855F7" },
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
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <span
          style={{
            backgroundColor: "rgba(245, 183, 0, 0.15)",
            color: THEME.gold,
            border: `1.5px solid ${THEME.gold}`,
            padding: "4px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1px",
          }}
        >
          MEASURABLE EDUCATIONAL IMPACT
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
          6 True Science Principles in 15 Minutes
        </h2>
      </div>

      {/* Grid of 6 Flip Badges */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          width: "100%",
          maxWidth: "1300px",
        }}
      >
        {badges.map((b, idx) => {
          const badgeSpring = spring({
            frame: frame - idx * 5,
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 120 },
          });

          return (
            <div
              key={idx}
              style={{
                transform: `scale(${Math.max(0, badgeSpring)})`,
                backgroundColor: "rgba(20, 32, 77, 0.9)",
                border: `1.5px solid ${b.color}70`,
                borderRadius: "18px",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "18px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: `${b.color}20`,
                  border: `2px solid ${b.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  flexShrink: 0,
                  boxShadow: `0 0 16px ${b.color}30`,
                }}
              >
                {b.icon}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: b.color, fontWeight: 900, fontSize: "14px" }}>BADGE #{b.num}</span>
                  <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "18px" }}>{b.title}</span>
                </div>
                <div style={{ color: THEME.textSecondary, fontSize: "13px", marginTop: "4px", lineHeight: 1.3 }}>
                  {b.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SubtitleBar
        sectionTag="SO WHAT NEXT · Impact & Needs"
        timecode="2:45 - 2:58"
        text="After 15 minutes of play, a child can name six real constraints of living off Earth. Not because we told them — because they felt every one of them."
        highlightWord="felt every one of them"
      />
    </div>
  );
};
