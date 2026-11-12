import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene4B_Teamwork: React.FC = () => {
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
      {/* Left side: The Teamwork Engine */}
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
            backgroundColor: "rgba(34, 215, 230, 0.15)",
            color: THEME.cyan,
            border: `1.5px solid ${THEME.cyan}`,
            padding: "4px 16px",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "1px",
            width: "fit-content",
          }}
        >
          TEAMWORK & RIGOROUS VERIFICATION
        </span>

        <h2
          style={{
            margin: 0,
            fontSize: "48px",
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "Nunito, system-ui",
            lineHeight: 1.15,
          }}
        >
          6 Students. 48 Hours.<br />
          <span style={{ color: THEME.cyan }}>AI Assisted · 100% Human Verified.</span>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.8)",
              border: `1px solid ${THEME.cyan}60`,
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span style={{ fontSize: "28px" }}>🇧🇩</span>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px" }}>
                Team CrewReady · Cumilla, Bangladesh
              </div>
              <div style={{ color: THEME.textSecondary, fontSize: "13px" }}>
                Ahnaf, Riyad, Rian, Totiny, Syeda & Ormi collaborating across science, code & design.
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.8)",
              border: `1px solid ${THEME.green}60`,
              borderRadius: "14px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span style={{ fontSize: "28px" }}>🔬</span>
            <div>
              <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px" }}>
                Human Scientific Accountability
              </div>
              <div style={{ color: THEME.textSecondary, fontSize: "13px" }}>
                Every single equation, threshold, and NASA fact was verified against official NASA databases.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Vitest Green Suite & Collaboration Visual */}
      <div
        style={{
          width: "560px",
          backgroundColor: "#0d1117",
          border: `2px solid ${THEME.green}`,
          borderRadius: "20px",
          padding: "28px",
          fontFamily: "monospace",
          boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(16, 185, 129, 0.25)`,
        }}
      >
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FF5F56" }} />
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#27C93F" }} />
        </div>

        <div style={{ color: THEME.green, fontWeight: 800, fontSize: "17px", marginBottom: "14px" }}>
          ✓ PASS src/engine/balance.test.ts (153 tests)
        </div>
        <div style={{ color: "#ffffff", fontSize: "14px", lineHeight: 1.6 }}>
          ✓ Level 1: Pack Crates Trades (P, L, F, S)<br />
          ✓ Level 2: NASA DONKI Storm Scaler<br />
          ✓ Level 3: Speed of Light Radio Delay (7m)<br />
          ✓ Level 4: Dust Storm Battery Drain<br />
          ✓ Level 5: Greenhouse Hydroponic Yield<br />
          ✓ Level 6: Specialist Crew Balancing<br />
          ✓ I18n: EN & BN Pair Equality Check
        </div>

        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "14px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            color: THEME.green,
            fontWeight: 800,
          }}
        >
          <span>Tests: 153 passed, 153 total</span>
          <span>Time: 1.84s</span>
        </div>
      </div>

      <SubtitleBar
        sectionTag="SO WHAT NEXT · Impact & Needs"
        timecode="2:58 - 3:14"
        text="Six of us from Cumilla. Leaders, writers, developers, and designers. We made 153 tests pass, adapted language for 7-year-olds, and verified every single NASA number by hand."
        highlightWord="verified every single NASA number by hand"
      />
    </div>
  );
};
