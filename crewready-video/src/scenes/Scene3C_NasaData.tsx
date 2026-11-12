import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { THEME } from "../types";

export const Scene3C_NasaData: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 100 },
  });

  const datasets = [
    { name: "NASA DONKI", tag: "LIVE", desc: "Space weather database · CMEs & solar flares", color: THEME.gold },
    { name: "NOAA SWPC", tag: "LIVE", desc: "Real-time planetary K-index (Kp 0-9)", color: THEME.cyan },
    { name: "NASA EPIC", tag: "LIVE", desc: "DSCOVR million-mile full-disk Earth images", color: "#38BDF8" },
    { name: "NASA InSight", tag: "ARCHIVE", desc: "Real Martian weather & daily temp swings", color: THEME.pink },
    { name: "NASA NeoWs", tag: "LIVE", desc: "Near-Earth asteroid proximity & speed", color: THEME.green },
    { name: "NASA OSDR", tag: "ARCHIVE", desc: "Biological radiation dosage thresholds", color: "#A855F7" },
    { name: "NASA APOD", tag: "ARCHIVE", desc: "Daily astronomical photography gallery", color: "#F97316" },
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
      <div style={{ textAlign: "center", marginBottom: "26px" }}>
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
          }}
        >
          NASA DATASET INTEGRATION
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
          7 Real NASA & NOAA Datasets
        </h2>
        <p style={{ margin: "4px 0 0 0", color: THEME.muted, fontSize: "16px" }}>
          Not decorative: NASA data actively generates game hazards, weather conditions, and survival metrics.
        </p>
      </div>

      {/* Grid of 7 Datasets */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          width: "100%",
          maxWidth: "1320px",
          transform: `scale(${pop})`,
        }}
      >
        {datasets.map((d, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "rgba(20, 32, 77, 0.9)",
              border: `1.5px solid ${d.color}60`,
              borderRadius: "16px",
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "17px" }}>{d.name}</span>
              <span
                style={{
                  backgroundColor: d.tag === "LIVE" ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.1)",
                  color: d.tag === "LIVE" ? THEME.green : THEME.muted,
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                {d.tag}
              </span>
            </div>
            <div style={{ color: THEME.textSecondary, fontSize: "13px", lineHeight: 1.3 }}>{d.desc}</div>
          </div>
        ))}

        {/* 8th Box: Source Line Rule */}
        <div
          style={{
            backgroundColor: "rgba(14, 22, 56, 0.95)",
            border: `2px dashed ${THEME.cyan}`,
            borderRadius: "16px",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ color: THEME.cyan, fontWeight: 900, fontSize: "16px" }}>100% CITED</div>
          <div style={{ color: THEME.textSecondary, fontSize: "12px", marginTop: "4px" }}>
            A permanent source attribution line appears under every single screen.
          </div>
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHAT · The Innovation"
        timecode="2:12 - 2:28"
        text="Seven NASA and NOAA datasets, live. DONKI drives the storm. EPIC shows Earth from a million miles out. InSight gives us today's real Mars temperature. And every single screen cites its source."
        highlightWord="Seven NASA and NOAA datasets, live"
      />
    </div>
  );
};
