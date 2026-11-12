import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene2B_Gap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const splitIn = spring({
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
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
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
          NASA'S CORE MANDATE
        </span>
        <h2
          style={{
            margin: "10px 0 0 0",
            fontSize: "44px",
            fontWeight: 900,
            color: "#ffffff",
            fontFamily: "Nunito, system-ui",
          }}
        >
          "Not a Quiz, Not a Slideshow"
        </h2>
        <p style={{ margin: "4px 0 0 0", color: THEME.muted, fontSize: "17px" }}>
          Kids don't learn critical thinking by picking option 'C'. They learn by making real decisions.
        </p>
      </div>

      {/* Side-by-Side Comparison */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "36px",
          width: "100%",
          maxWidth: "1300px",
          transform: `scale(${splitIn})`,
        }}
      >
        {/* Left: Traditional Boring Quiz */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "2px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "24px",
            padding: "32px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-16px",
              right: "24px",
              backgroundColor: THEME.red,
              color: "#ffffff",
              padding: "4px 14px",
              borderRadius: "12px",
              fontWeight: 900,
              fontSize: "14px",
            }}
          >
            ❌ TYPICAL CLASSROOM QUIZ
          </div>

          <div style={{ color: THEME.muted, fontSize: "14px", fontWeight: 700 }}>STATIC QUESTION #4</div>
          <h3 style={{ color: "#ffffff", fontSize: "24px", margin: "10px 0 20px 0", fontWeight: 700 }}>
            What color is Mars?
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["A) Blue", "B) Green", "C) Red (Memorized)", "D) Yellow"].map((opt, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: i === 2 ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.05)",
                  border: `1px solid ${i === 2 ? THEME.red : "rgba(255, 255, 255, 0.1)"}`,
                  borderRadius: "12px",
                  padding: "12px 18px",
                  color: i === 2 ? "#ffffff" : THEME.muted,
                  fontSize: "16px",
                  fontWeight: i === 2 ? 800 : 500,
                }}
              >
                {opt}
              </div>
            ))}
          </div>

          <p style={{ marginTop: "20px", color: THEME.muted, fontSize: "14px", fontStyle: "italic" }}>
            Result: Passive memorization. Forgotten in 48 hours. No concept of trade-offs.
          </p>
        </div>

        {/* Right: CrewReady Living Simulation */}
        <div
          style={{
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `2px solid ${THEME.cyan}`,
            borderRadius: "24px",
            padding: "32px",
            position: "relative",
            boxShadow: `0 0 30px rgba(34, 215, 230, 0.25)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-16px",
              right: "24px",
              backgroundColor: THEME.cyan,
              color: "#070b1e",
              padding: "4px 14px",
              borderRadius: "12px",
              fontWeight: 900,
              fontSize: "14px",
            }}
          >
            ✅ CREWREADY LIVING SIMULATION
          </div>

          <div style={{ color: THEME.cyan, fontSize: "14px", fontWeight: 800 }}>SOL 42 · REAL TRADEOFF</div>
          <h3 style={{ color: "#ffffff", fontSize: "24px", margin: "10px 0 20px 0", fontWeight: 800 }}>
            Cabin seal breached. Call Earth or EVA fix?
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div
              style={{
                backgroundColor: "rgba(34, 215, 230, 0.15)",
                border: `1.5px solid ${THEME.cyan}`,
                borderRadius: "14px",
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "17px" }}>Wait for Mission Control</div>
                <div style={{ color: THEME.textSecondary, fontSize: "13px" }}>Radio takes 7 min each way (Speed of light)</div>
              </div>
              <span style={{ color: THEME.red, fontWeight: 900, fontSize: "14px" }}>-30% Air</span>
            </div>

            <div
              style={{
                backgroundColor: "rgba(245, 183, 0, 0.15)",
                border: `1.5px solid ${THEME.gold}`,
                borderRadius: "14px",
                padding: "14px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#ffffff", fontWeight: 800, fontSize: "17px" }}>Emergency EVA Space Walk</div>
                <div style={{ color: THEME.textSecondary, fontSize: "13px" }}>Fix immediately with resin patch</div>
              </div>
              <span style={{ color: THEME.gold, fontWeight: 900, fontSize: "14px" }}>-15% Power</span>
            </div>
          </div>

          <p style={{ marginTop: "20px", color: THEME.cyan, fontSize: "14px", fontWeight: 700 }}>
            Result: Child calculates consequences. Every resource has a cost.
          </p>
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHY · Create Empathy for the Problem"
        timecode="1:00 - 1:15"
        text="When kids learn about space, they get the ending — the launch, the flag, the landing. Nobody shows them the hard choices in the middle. NASA's challenge asked for exactly that."
        highlightWord="hard choices"
      />
    </div>
  );
};
