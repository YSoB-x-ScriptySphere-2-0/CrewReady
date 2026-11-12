import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { DataBadge } from "../components/DataBadge";
import { THEME } from "../types";

export const Scene2A_Crisis: React.FC = () => {
  const frame = useCurrentFrame();

  // Pulse wave around Earth
  const waveRadius = (frame % 90) * 4;
  const waveOpacity = Math.max(0, 1 - (frame % 90) / 90);

  // Counter
  const popNumber = (8.18 + interpolate(frame, [0, 450], [0, 0.06])).toFixed(2);

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
      {/* Left side: Crisis context & real NASA NeoWs asteroid data */}
      <div
        style={{
          maxWidth: "700px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <DataBadge label="NASA NeoWs" source="Near-Earth Object Tracking" isLive />
          <span
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              color: THEME.red,
              border: `1px solid ${THEME.red}`,
              padding: "4px 12px",
              borderRadius: "16px",
              fontSize: "12px",
              fontWeight: 800,
            }}
          >
            GLOBAL THREAT INDEX
          </span>
        </div>

        <h2
          style={{
            margin: 0,
            fontSize: "56px",
            fontWeight: 900,
            color: "#FFFFFF",
            fontFamily: "Nunito, system-ui",
            lineHeight: 1.1,
          }}
        >
          Earth is Fragile.<br />
          <span style={{ color: THEME.red }}>Humanity Needs a Second Home.</span>
        </h2>

        {/* 3 Real threat stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "16px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: THEME.muted, fontSize: "13px", fontWeight: 700 }}>WORLD POPULATION</div>
              <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, fontFamily: "monospace" }}>
                {popNumber} Billion People
              </div>
            </div>
            <span style={{ fontSize: "32px" }}>🌍</span>
          </div>

          <div
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.8)",
              border: `1px solid ${THEME.red}60`,
              borderRadius: "16px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: THEME.red, fontSize: "13px", fontWeight: 700 }}>ASTEROID 2025 XQ7 PASS</div>
              <div style={{ color: "#ffffff", fontSize: "24px", fontWeight: 900, fontFamily: "monospace" }}>
                1.4M km Miss Distance (Tracked by NASA)
              </div>
            </div>
            <span style={{ fontSize: "32px" }}>☄️</span>
          </div>

          <div
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.8)",
              border: `1px solid ${THEME.gold}60`,
              borderRadius: "16px",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: THEME.gold, fontSize: "13px", fontWeight: 700 }}>THE QUESTION FOR KIDS</div>
              <div style={{ color: "#ffffff", fontSize: "20px", fontWeight: 800 }}>
                Can we prove humans can build self-sustaining outposts?
              </div>
            </div>
            <span style={{ fontSize: "32px" }}>🚀</span>
          </div>
        </div>
      </div>

      {/* Right side: Stylized Crisis Earth with radar sweep and asteroid trajectory */}
      <div
        style={{
          position: "relative",
          width: "550px",
          height: "550px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Radar rings */}
        {[180, 260, 340, 420].map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${r * 2}px`,
              height: `${r * 2}px`,
              borderRadius: "50%",
              border: `1px dashed rgba(34, 215, 230, ${0.15 - i * 0.03})`,
            }}
          />
        ))}

        {/* Shockwave circle */}
        <div
          style={{
            position: "absolute",
            width: `${waveRadius * 2}px`,
            height: `${waveRadius * 2}px`,
            borderRadius: "50%",
            border: `2px solid ${THEME.red}`,
            opacity: waveOpacity,
          }}
        />

        {/* Stylized Earth sphere */}
        <div
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #2563EB 0%, #1D4ED8 40%, #0F172A 90%)",
            boxShadow: `0 0 60px rgba(37, 99, 235, 0.6), inset -20px -20px 40px rgba(0,0,0,0.8)`,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Glowing continent city heat points */}
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "60%",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: THEME.gold,
              boxShadow: `0 0 20px ${THEME.gold}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "40%",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: THEME.cyan,
              boxShadow: `0 0 16px ${THEME.cyan}`,
            }}
          />
          <span style={{ fontSize: "90px", opacity: 0.9 }}>🌐</span>
        </div>

        {/* Twinkle worried looking at Earth */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "0px",
            width: "130px",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.8))",
          }}
        >
          <Img src={staticFile("art/twinkle-worried.webp")} style={{ width: "100%" }} />
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHY · Create Empathy for the Problem"
        timecode="0:45 - 1:00"
        text="Earth is fragile. An 8.2-billion-person planet, with real near-Earth asteroids tracked by NASA every week. And most kids learn about space from a slideshow."
        highlightWord="slideshow"
      />
    </div>
  );
};
