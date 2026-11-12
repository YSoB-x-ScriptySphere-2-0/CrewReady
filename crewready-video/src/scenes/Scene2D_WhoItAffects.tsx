import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene2D_WhoItAffects: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 100 },
  });

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
      {/* Left: Global South & Equity Narrative */}
      <div
        style={{
          maxWidth: "680px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          transform: `scale(${pop})`,
        }}
      >
        <span
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            color: THEME.green,
            border: `1.5px solid ${THEME.green}`,
            padding: "4px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1px",
            width: "fit-content",
          }}
        >
          GLOBAL SOUTH STEM EQUITY
        </span>

        <h2
          style={{
            margin: 0,
            fontSize: "52px",
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "Nunito, system-ui",
            lineHeight: 1.15,
          }}
        >
          Zero Barriers to Space Science.
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "22px",
            color: THEME.textSecondary,
            lineHeight: 1.5,
          }}
        >
          Most space simulation games demand expensive gaming PCs or paid app store accounts. CrewReady was engineered to run on the most affordable smartphone in a remote village.
        </p>

        {/* 4 Pillars of Accessibility */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            { icon: "📱", title: "No Download", desc: "Opens instantly in any web browser" },
            { icon: "🔓", title: "No Account", desc: "No email, login, or age gate required" },
            { icon: "⚡", title: "Works Offline", desc: "Service Worker caches entire mission" },
            { icon: "🌐", title: "Bilingual (EN + BN)", desc: "Full English and বাংলা translation" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "rgba(20, 32, 77, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "14px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{item.icon}</span>
              <div>
                <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px" }}>{item.title}</div>
                <div style={{ color: THEME.muted, fontSize: "13px" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Dhaka to Houston Graphic with Orbit Character */}
      <div
        style={{
          width: "560px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: "rgba(14, 22, 56, 0.95)",
            border: `2px solid ${THEME.cyan}`,
            borderRadius: "24px",
            padding: "32px",
            boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(34,215,230,0.25)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px" }}>🏫</div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "18px", marginTop: "4px" }}>Dhaka Class</div>
              <div style={{ color: THEME.cyan, fontSize: "13px" }}>Android $60 Phone</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: THEME.gold, fontSize: "24px", fontWeight: 900 }}>═ 100% PARITY ═</span>
              <span style={{ color: THEME.muted, fontSize: "12px" }}>Same NASA Data & Engine</span>
            </div>

            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "40px" }}>🏛️</div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "18px", marginTop: "4px" }}>Houston Lab</div>
              <div style={{ color: THEME.cyan, fontSize: "13px" }}>Desktop iPad</div>
            </div>
          </div>

          <div
            style={{
              marginTop: "24px",
              backgroundColor: "rgba(34, 215, 230, 0.1)",
              border: `1px dashed ${THEME.cyan}`,
              borderRadius: "12px",
              padding: "14px",
              textAlign: "center",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
            }}
          >
            "A kid in Dhaka commands the exact same Mars mission as a kid in Houston."
          </div>
        </div>

        {/* Orbit cheer */}
        <div style={{ width: "200px" }}>
          <Img src={staticFile("art/orbit-cheer.webp")} style={{ width: "100%" }} />
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHY · Create Empathy for the Problem"
        timecode="1:30 - 1:45"
        text="A classroom in Dhaka can play CrewReady as easily as one in Houston. No download. No account. No cost. Just a link — and a mission."
        highlightWord="Dhaka can play CrewReady as easily as one in Houston"
      />
    </div>
  );
};
