import React from "react";
import { Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene3B_Levels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.8, stiffness: 110 },
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
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
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
          COUPLED MISSION CASCADE ENGINE
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
          "Choices Come Back."
        </h2>
      </div>

      {/* The Cascading Cause & Effect Chain */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
          width: "100%",
          maxWidth: "1360px",
          transform: `scale(${pop})`,
        }}
      >
        {/* Step 1 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `2px solid ${THEME.cyan}`,
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ color: THEME.cyan, fontWeight: 900, fontSize: "14px" }}>SOL 0 · LEVEL 1</div>
          <h3 style={{ color: "#ffffff", fontSize: "20px", margin: "8px 0" }}>Pack 8 Crates</h3>
          <p style={{ color: THEME.textSecondary, fontSize: "14px", margin: 0 }}>
            You choose heavy lead radiation blankets instead of extra hydroponic lettuce seeds.
          </p>
          <div style={{ marginTop: "12px", color: THEME.cyan, fontWeight: 800, fontSize: "13px" }}>
            + Shield | - Food Resupply
          </div>
        </div>

        <span style={{ fontSize: "32px", color: THEME.gold }}>➔</span>

        {/* Step 2 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `2px solid ${THEME.gold}`,
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ color: THEME.gold, fontWeight: 900, fontSize: "14px" }}>SOL 214 · LEVEL 4</div>
          <h3 style={{ color: "#ffffff", fontSize: "20px", margin: "8px 0" }}>The Dust Wall</h3>
          <p style={{ color: THEME.textSecondary, fontSize: "14px", margin: 0 }}>
            You leave the solar panels open during the Martian storm to keep battery heaters active.
          </p>
          <div style={{ marginTop: "12px", color: THEME.gold, fontWeight: 800, fontSize: "13px" }}>
            Panels Scratched & Damaged
          </div>
        </div>

        <span style={{ fontSize: "32px", color: THEME.pink }}>➔</span>

        {/* Step 3 */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `2px solid ${THEME.pink}`,
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ color: THEME.pink, fontWeight: 900, fontSize: "14px" }}>SOL 350 · LEVEL 5</div>
          <h3 style={{ color: "#ffffff", fontSize: "20px", margin: "8px 0" }}>Greenhouse Crisis</h3>
          <p style={{ color: THEME.textSecondary, fontSize: "14px", margin: 0 }}>
            Damaged panels can't power UV lights AND water recyclers simultaneously.
          </p>
          <div style={{ marginTop: "12px", color: THEME.red, fontWeight: 800, fontSize: "13px" }}>
            CRITICAL WATER / POWER SQUEEZE
          </div>
        </div>
      </div>

      {/* Twinkle quote card */}
      <div
        style={{
          marginTop: "40px",
          backgroundColor: "rgba(14, 22, 56, 0.9)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "16px",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Img src={staticFile("art/twinkle-stars.webp")} style={{ width: "48px", height: "48px" }} />
        <span style={{ color: "#ffffff", fontSize: "18px", fontWeight: 700 }}>
          "Kids learn causality: An early compromise demands later ingenuity."
        </span>
      </div>

      <SubtitleBar
        sectionTag="WHAT · The Innovation"
        timecode="1:58 - 2:12"
        text="Level one: pack the rocket. Level two: a real solar storm. Level three: the message to Earth takes seven minutes each way. Level four — that dust storm you saw at the start. We left our panels out. Two levels later, the game remembered."
        highlightWord="Two levels later, the game remembered"
      />
    </div>
  );
};
