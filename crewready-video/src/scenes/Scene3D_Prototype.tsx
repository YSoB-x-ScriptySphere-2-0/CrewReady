import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene3D_Prototype: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 100 },
  });

  // Toggle switch animation between EN and বাংলা
  const isBangla = Math.floor(frame / 60) % 2 === 1;

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
      <div style={{ textAlign: "center", marginBottom: "26px" }}>
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
          }}
        >
          PROTOTYPE REVEAL & FEATURES
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
          Pedagogical Failure. Real Empathy. Bilingual.
        </h2>
      </div>

      {/* 3 Main Feature Panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
          width: "100%",
          maxWidth: "1340px",
          transform: `scale(${pop})`,
        }}
      >
        {/* Panel 1: Mission Replay Blame Engine */}
        <div
          style={{
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `1.5px solid ${THEME.gold}`,
            borderRadius: "20px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "28px" }}>🔄</span>
            <span
              style={{
                backgroundColor: "rgba(245, 183, 0, 0.2)",
                color: THEME.gold,
                padding: "4px 10px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              LEARN FROM FAILURE
            </span>
          </div>
          <h3 style={{ margin: 0, color: "#ffffff", fontSize: "20px", fontWeight: 800 }}>
            Mission Replay Blame Chain
          </h3>
          <p style={{ margin: 0, color: THEME.textSecondary, fontSize: "14px", lineHeight: 1.4 }}>
            Never a harsh "Game Over". The engine pinpoints the exact choice Sol that tipped the balance, explains real astronaut protocols, and invites an instant retry.
          </p>
          <div
            style={{
              backgroundColor: "rgba(10, 16, 42, 0.8)",
              borderRadius: "10px",
              padding: "10px",
              fontSize: "12px",
              color: THEME.cyan,
              fontFamily: "monospace",
            }}
          >
            Blame analysis: Sol 214 Dust Storm panel choice caused battery freeze on Sol 350.
          </div>
        </div>

        {/* Panel 2: Bilingual Support (English + বাংলা) */}
        <div
          style={{
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `1.5px solid ${THEME.cyan}`,
            borderRadius: "20px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "28px" }}>🌐</span>
            <span
              style={{
                backgroundColor: "rgba(34, 215, 230, 0.2)",
                color: THEME.cyan,
                padding: "4px 10px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              LIVE I18N
            </span>
          </div>
          <h3 style={{ margin: 0, color: "#ffffff", fontSize: "20px", fontWeight: 800 }}>
            Full English & বাংলা Engine
          </h3>
          <p style={{ margin: 0, color: THEME.textSecondary, fontSize: "14px", lineHeight: 1.4 }}>
            Every level, dialogue, NASA fact, and button label is fully translated and tested for natural reading flow in both languages.
          </p>
          <div
            style={{
              backgroundColor: "rgba(34, 215, 230, 0.15)",
              border: `1px solid ${THEME.cyan}`,
              borderRadius: "10px",
              padding: "12px",
              textAlign: "center",
              fontWeight: 800,
              fontSize: "17px",
              color: "#ffffff",
            }}
          >
            {isBangla ? "স্বাগতম, জুনিয়র কমান্ডার!" : "Welcome back, Junior Commander!"}
          </div>
        </div>

        {/* Panel 3: Fly Runner Mini-Game */}
        <div
          style={{
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `1.5px solid ${THEME.pink}`,
            borderRadius: "20px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "28px" }}>🏃</span>
            <span
              style={{
                backgroundColor: "rgba(232, 51, 139, 0.2)",
                color: THEME.pink,
                padding: "4px 10px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              FLY RUNNER
            </span>
          </div>
          <h3 style={{ margin: 0, color: "#ffffff", fontSize: "20px", fontWeight: 800 }}>
            Orbit Runner Mini-Game
          </h3>
          <p style={{ margin: 0, color: THEME.textSecondary, fontSize: "14px", lineHeight: 1.4 }}>
            Endless 3-lane space runner where speed scales with live Kp index. Kids collect stardust currency to unlock suits and badges.
          </p>
          <div
            style={{
              backgroundColor: "rgba(10, 16, 42, 0.8)",
              borderRadius: "10px",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: THEME.gold, fontWeight: 800 }}>⭐ 1,420 Stardust</span>
            <span style={{ color: THEME.cyan, fontWeight: 800 }}>Kp Speed: 1.4x</span>
          </div>
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHAT · The Innovation"
        timecode="2:28 - 2:45"
        text="When you fail, no game-over. The game shows you which choice did it and what real astronauts do. It speaks English and Bangla. It works offline. And it's completely free."
        highlightWord="speaks English and Bangla"
      />
    </div>
  );
};
