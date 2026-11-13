import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { DataBadge } from "../components/DataBadge";
import { THEME } from "../types";

export const Scene2C_DataPoint: React.FC = () => {
  const frame = useCurrentFrame();

  // Kp rises from 0.7 to 7.3 during solar flare
  const kpVal = interpolate(frame, [60, 240], [0.7, 7.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shield drops from 95% down to 28%
  const shieldVal = interpolate(frame, [90, 260], [95, 28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Solar flare blast opacity and scale
  const flareScale = interpolate(frame, [60, 180], [0.8, 1.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flareGlow = Math.sin(frame / 4) * 0.3 + 0.7;

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
      {/* Left: The Science & Live Data Explanation */}
      <div
        style={{
          maxWidth: "680px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <DataBadge label="NASA DONKI + NOAA SWPC" source="Real-Time Planetary K-Index" isLive />
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
          Our Killer Data Point:<br />
          <span style={{ color: THEME.gold }}>Today's Sun Changes Today's Game.</span>
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "22px",
            color: THEME.textSecondary,
            lineHeight: 1.5,
          }}
        >
          If a coronal mass ejection erupts toward Earth today, CrewReady sizes the in-game storm from real NASA space-weather data.
        </p>

        {/* Live telemetry readout panel */}
        <div
          style={{
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `1.5px solid ${kpVal > 5 ? THEME.red : THEME.cyan}`,
            borderRadius: "18px",
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: kpVal > 5 ? `0 0 30px rgba(239, 68, 68, 0.3)` : "none",
          }}
        >
          <div>
            <div style={{ color: THEME.muted, fontSize: "13px", fontWeight: 800 }}>LIVE SOLAR WIND SPEED</div>
            <div style={{ color: "#ffffff", fontSize: "28px", fontWeight: 900, fontFamily: "monospace" }}>
              {Math.round(412 + (kpVal - 0.7) * 70)} km/s
            </div>
          </div>
          <div>
            <div style={{ color: THEME.muted, fontSize: "13px", fontWeight: 800 }}>GEOMAGNETIC STORM</div>
            <div
              style={{
                color: kpVal > 5 ? THEME.red : THEME.green,
                fontSize: "28px",
                fontWeight: 900,
                fontFamily: "monospace",
              }}
            >
              {kpVal > 5 ? "G3 STRONG" : "G0 CALM"}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Dynamic Interactive Kp Gauge & Shield Reaction */}
      <div
        style={{
          width: "560px",
          backgroundColor: "rgba(14, 22, 56, 0.95)",
          border: `2px solid ${kpVal > 5 ? THEME.red : THEME.cyan}`,
          borderRadius: "28px",
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          boxShadow: `0 20px 60px rgba(0,0,0,0.8)`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Solar flare blast radial glow when storm spikes */}
        {kpVal > 3 && (
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "250px",
              height: "250px",
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(239, 68, 68, ${0.4 * flareGlow}) 0%, transparent 70%)`,
              transform: `scale(${flareScale})`,
              pointerEvents: "none",
            }}
          />
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#ffffff", fontSize: "18px", fontWeight: 800 }}>LIVE SPACE WEATHER</span>
          <span
            style={{
              backgroundColor: kpVal > 5 ? THEME.red : THEME.green,
              color: "#ffffff",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 800,
            }}
          >
            {kpVal > 5 ? "STORM ACTIVE" : "QUIET SUN"}
          </span>
        </div>

        {/* Big Kp Display */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
          <span
            style={{
              fontSize: "76px",
              fontWeight: 900,
              color: kpVal > 5 ? THEME.red : THEME.cyan,
              fontFamily: "monospace",
              lineHeight: 1,
            }}
          >
            Kp {kpVal.toFixed(1)}
          </span>
          <span style={{ color: THEME.muted, fontSize: "20px", fontWeight: 700 }}>of 9.0 max</span>
        </div>

        {/* Kp Segmented Meter */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: "6px" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "14px",
                borderRadius: "4px",
                backgroundColor:
                  i < kpVal
                    ? i < 4
                      ? THEME.green
                      : i < 7
                      ? THEME.gold
                      : THEME.red
                    : "rgba(255, 255, 255, 0.1)",
                boxShadow: i < kpVal ? `0 0 8px currentColor` : "none",
              }}
            />
          ))}
        </div>

        {/* Impact on Spacecraft Shield */}
        <div
          style={{
            backgroundColor: "rgba(20, 32, 77, 0.9)",
            border: `1px solid rgba(255,255,255,0.15)`,
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "#ffffff", fontWeight: 800, fontSize: "16px" }}>SPACECRAFT SHIELD INTEGRITY</span>
            <span
              style={{
                color: shieldVal < 50 ? THEME.red : THEME.gold,
                fontWeight: 900,
                fontSize: "18px",
                fontFamily: "monospace",
              }}
            >
              {Math.round(shieldVal)}%
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: "12px",
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${shieldVal}%`,
                height: "100%",
                backgroundColor: shieldVal < 50 ? THEME.red : THEME.gold,
                boxShadow: `0 0 10px ${shieldVal < 50 ? THEME.red : THEME.gold}`,
                transition: "width 0.2s ease",
              }}
            />
          </div>
          <div
            style={{
              marginTop: "10px",
              fontSize: "13px",
              color: THEME.textSecondary,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span>
            <span>Real NASA DONKI feed directly triggers in-game storm hazards.</span>
          </div>
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHY · Create Empathy for the Problem"
        timecode="1:15 - 1:30"
        text="And here is our killer fact: if you play CrewReady on a solar-storm day, your shield drains faster. Because we pull today's space weather directly from NASA and NOAA — live."
        highlightWord="solar-storm day"
      />
    </div>
  );
};
