import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene1C_Team: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titlePop = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 110 },
  });

  const teamMembers = [
    {
      name: "Ahnaf Nabil",
      role: "Team Leader & Researcher",
      desc: "Vision lead, space systems research & project orchestration",
      icon: "🚀",
      color: THEME.gold,
    },
    {
      name: "Barkat Ullah Shah Riyad",
      role: "UI/UX Designer & Developer",
      desc: "Game UI/UX architecture, high-contrast dark theme & design system",
      icon: "🎨",
      color: THEME.cyan,
    },
    {
      name: "Jawad Hossain Rian",
      role: "Back-End Developer & Debugger",
      desc: "Simulation math engine, 153 passing test suites & state logic",
      icon: "💻",
      color: "#38BDF8",
    },
    {
      name: "Tasfia Zaman Totiny",
      role: "Researcher & Script Writer",
      desc: "NASA DONKI/InSight data research & 7yo narrative storytelling",
      icon: "✍️",
      color: THEME.pink,
    },
    {
      name: "Wasima Haque Syeda",
      role: "Video Editor & Script Writer",
      desc: "Cinematic storyboard director, motion editing & judging pitch",
      icon: "🎬",
      color: "#A855F7",
    },
    {
      name: "Imtiaj Mahmud Ormi",
      role: "Front-End Developer & Designer",
      desc: "Interactive React components, responsive layouts & animations",
      icon: "⚡",
      color: THEME.green,
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
        padding: "48px 80px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          transform: `scale(${titlePop})`,
          marginBottom: "26px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(34, 215, 230, 0.15)",
            border: `1px solid ${THEME.cyan}`,
            borderRadius: "20px",
            padding: "6px 18px",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>🇧🇩</span>
          <span
            style={{
              color: THEME.cyan,
              fontWeight: 800,
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            CUMILLA, BANGLADESH · TEAM CREWREADY
          </span>
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: "44px",
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "Nunito, system-ui",
          }}
        >
          Meet the 6 Creators Behind CrewReady
        </h2>
        <p style={{ margin: "4px 0 0 0", color: THEME.muted, fontSize: "17px" }}>
          Cumilla, Bangladesh · NASA Space Apps Challenge 2026
        </p>
      </div>

      {/* 6 Member Cards Grid (3x2) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "18px",
          width: "100%",
          maxWidth: "1360px",
        }}
      >
        {teamMembers.map((member, idx) => {
          const cardSpring = spring({
            frame: frame - idx * 5,
            fps,
            config: { damping: 12, mass: 0.6, stiffness: 120 },
          });

          return (
            <div
              key={idx}
              style={{
                transform: `scale(${Math.max(0, cardSpring)})`,
                backgroundColor: "rgba(20, 32, 77, 0.9)",
                border: `1.5px solid ${member.color}70`,
                borderRadius: "18px",
                padding: "18px 22px",
                display: "flex",
                alignItems: "center",
                gap: "18px",
                boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: `${member.color}20`,
                  border: `2px solid ${member.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  flexShrink: 0,
                  boxShadow: `0 0 16px ${member.color}40`,
                }}
              >
                {member.icon}
              </div>

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#ffffff",
                    fontFamily: "Nunito, system-ui",
                  }}
                >
                  {member.name}
                </h4>
                <div
                  style={{
                    margin: "2px 0 4px 0",
                    fontSize: "13px",
                    fontWeight: 800,
                    color: member.color,
                  }}
                >
                  {member.role}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: THEME.textSecondary,
                    lineHeight: 1.3,
                  }}
                >
                  {member.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <SubtitleBar
        sectionTag="WHO · Attention & Authenticity"
        timecode="0:18 - 0:35"
        text="We are six passionate students from Cumilla, Bangladesh. Leaders, developers, researchers, and designers turning real NASA space science into a living mission for children."
        highlightWord="six passionate students from Cumilla, Bangladesh"
      />
    </div>
  );
};
