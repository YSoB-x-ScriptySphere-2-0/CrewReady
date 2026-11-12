import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene1D_Passion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 100 },
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
      {/* Left side: The Playtest Story */}
      <div
        style={{
          maxWidth: "680px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          transform: `scale(${pop})`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "rgba(245, 183, 0, 0.15)",
            border: `1.5px solid ${THEME.gold}`,
            borderRadius: "20px",
            padding: "6px 16px",
            width: "fit-content",
          }}
        >
          <span style={{ fontSize: "16px" }}>🔍</span>
          <span
            style={{
              color: THEME.gold,
              fontWeight: 800,
              fontSize: "14px",
              letterSpacing: "1px",
            }}
          >
            REAL PLAYTEST EVIDENCE
          </span>
        </div>

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
          "Why did our air run out?"
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "22px",
            color: THEME.textSecondary,
            lineHeight: 1.5,
            fontFamily: "Nunito, system-ui",
          }}
        >
          She didn't quit when she lost. She tapped Mission Replay, saw her water choice in Sol 14, and restarted immediately with a new strategy.
        </p>

        {/* 3 Metric callout boxes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "12px" }}>
          <div
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.8)",
              border: `1px solid ${THEME.cyan}50`,
              borderRadius: "16px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px", fontWeight: 900, color: THEME.cyan }}>20 min</div>
            <div style={{ fontSize: "13px", color: THEME.muted, fontWeight: 700 }}>Continuous Play</div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.8)",
              border: `1px solid ${THEME.pink}50`,
              borderRadius: "16px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px", fontWeight: 900, color: THEME.pink }}>0 Help</div>
            <div style={{ fontSize: "13px", color: THEME.muted, fontWeight: 700 }}>Fully Self-Guided</div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.8)",
              border: `1px solid ${THEME.gold}50`,
              borderRadius: "16px",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "36px", fontWeight: 900, color: THEME.gold }}>6 Facts</div>
            <div style={{ fontSize: "13px", color: THEME.muted, fontWeight: 700 }}>Learned by Doing</div>
          </div>
        </div>
      </div>

      {/* Right side: Visual Tablet Mockup with Nova Pointing */}
      <div
        style={{
          position: "relative",
          width: "600px",
          height: "420px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "520px",
            height: "360px",
            backgroundColor: "rgba(14, 22, 56, 0.95)",
            border: `3px solid ${THEME.cyan}`,
            borderRadius: "24px",
            boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(34,215,230,0.3)`,
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: THEME.cyan, fontWeight: 800, fontSize: "14px" }}>LEVEL 1 · PACK ROCKET</span>
            <span style={{ color: THEME.gold, fontWeight: 800, fontSize: "14px" }}>CARGO: 8/8 CRATES</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <div
              style={{
                backgroundColor: "rgba(34, 215, 230, 0.15)",
                border: `1.5px solid ${THEME.cyan}`,
                borderRadius: "12px",
                padding: "14px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "32px" }}>🛡️</div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px", marginTop: "4px" }}>Lead Shield</div>
              <div style={{ color: THEME.cyan, fontSize: "12px", fontWeight: 700 }}>Protects from Solar Storms</div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(245, 183, 0, 0.15)",
                border: `1.5px solid ${THEME.gold}`,
                borderRadius: "12px",
                padding: "14px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "32px" }}>🥗</div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px", marginTop: "4px" }}>Hydro Seeds</div>
              <div style={{ color: THEME.gold, fontSize: "12px", fontWeight: 700 }}>Ensures 500-Sol Food</div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "10px 16px",
              fontSize: "13px",
              color: THEME.textSecondary,
              textAlign: "center",
            }}
          >
            Every crate of shielding is a crate of food left behind.
          </div>
        </div>

        {/* Orbit Character point */}
        <div
          style={{
            position: "absolute",
            right: "-40px",
            bottom: "-30px",
            width: "180px",
            filter: "drop-shadow(0 15px 30px rgba(0,0,0,0.8))",
          }}
        >
          <Img src={staticFile("art/orbit-point.webp")} style={{ width: "100%" }} />
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHO · Attention & Authenticity"
        timecode="0:35 - 0:45"
        text="We tested it on a 7-year-old. She played for 20 minutes without stopping. When she lost, she asked why. That's when we knew we had something."
        highlightWord="20 minutes without stopping"
      />
    </div>
  );
};
