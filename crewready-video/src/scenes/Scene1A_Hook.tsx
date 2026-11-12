import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SubtitleBar } from "../components/SubtitleBar";
import { MeterBar } from "../components/MeterBar";
import { THEME } from "../types";

export const Scene1A_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulse alert
  const alertPulse = Math.sin(frame / 4) * 0.3 + 0.7;

  // Countdown timer from 12s down to 08s
  const secondsLeft = Math.max(8, 12 - Math.floor(frame / 30));

  // Spring entrance for alarm card
  const cardScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.7, stiffness: 120 },
  });

  // Power meter dropping
  const powerValue = interpolate(frame, [0, 240], [85, 38], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        justifyContent: "center",
        padding: "60px",
        boxSizing: "border-box",
      }}
    >
      {/* Background Red Emergency Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at center, transparent 30%, rgba(239, 68, 68, ${0.25 * alertPulse}) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top Banner: Emergency Mission Alert */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          backgroundColor: "rgba(239, 68, 68, 0.25)",
          border: `2px solid ${THEME.red}`,
          borderRadius: "16px",
          padding: "10px 24px",
          boxShadow: `0 0 20px rgba(239, 68, 68, 0.4)`,
        }}
      >
        <span
          style={{
            fontSize: "20px",
            color: THEME.red,
            fontWeight: 900,
            animation: "pulse 1s infinite",
          }}
        >
          CRITICAL ALERT
        </span>
        <span style={{ color: "#ffffff", fontSize: "16px", fontWeight: 700 }}>
          SOL 214 · DUST STORM HIT IN 00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
        </span>
        <span
          style={{
            backgroundColor: THEME.red,
            color: "#ffffff",
            padding: "2px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 800,
          }}
        >
          NASA INGESTION: DONKI
        </span>
      </div>

      {/* Live Meters */}
      <div
        style={{
          position: "absolute",
          top: "110px",
          display: "flex",
          gap: "20px",
        }}
      >
        <MeterBar label="Power (P)" icon="⚡" value={powerValue} color={THEME.cyan} />
        <MeterBar label="Air & Water (L)" icon="💧" value={72} color="#38BDF8" />
        <MeterBar label="Food (F)" icon="🥗" value={80} color={THEME.green} />
        <MeterBar label="Shield (S)" icon="🛡️" value={45} color={THEME.gold} />
      </div>

      {/* Main Dramatic Decision Card */}
      <div
        style={{
          transform: `scale(${cardScale})`,
          backgroundColor: "rgba(20, 32, 77, 0.95)",
          border: `2px solid ${THEME.red}`,
          borderRadius: "24px",
          padding: "36px 48px",
          maxWidth: "960px",
          width: "100%",
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(239, 68, 68, 0.25)`,
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          marginTop: "70px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Img
              src={staticFile("art/twinkle-worried.webp")}
              style={{ width: "64px", height: "64px", filter: "drop-shadow(0 0 8px rgba(34,215,230,0.5))" }}
            />
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "30px",
                  color: "#FFFFFF",
                  fontFamily: "Nunito, system-ui",
                  fontWeight: 800,
                }}
              >
                Dust wall is 3 km away! What do you do?
              </h2>
              <p style={{ margin: "4px 0 0 0", color: THEME.muted, fontSize: "16px" }}>
                Every choice permanently changes your crew's survival meters.
              </p>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.3)",
              border: `1px solid ${THEME.red}`,
              borderRadius: "12px",
              padding: "8px 18px",
              color: "#ffffff",
              fontSize: "20px",
              fontWeight: 900,
              fontFamily: "monospace",
            }}
          >
            00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
          </div>
        </div>

        {/* Two Big Choice Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          {/* Choice A */}
          <div
            style={{
              backgroundColor: "rgba(14, 22, 56, 0.9)",
              border: `2px solid ${THEME.cyan}`,
              borderRadius: "18px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              cursor: "pointer",
              boxShadow: `0 8px 24px rgba(34, 215, 230, 0.25)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "28px" }}>☀️</span>
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
                GAMBLE
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: "22px", color: "#ffffff", fontWeight: 800 }}>
              Leave solar panels out
            </h3>
            <p style={{ margin: 0, fontSize: "15px", color: THEME.textSecondary, lineHeight: 1.3 }}>
              Keep battery charging for the heaters, but dust scratching may destroy the panels.
            </p>
          </div>

          {/* Choice B */}
          <div
            style={{
              backgroundColor: "rgba(14, 22, 56, 0.9)",
              border: `2px solid rgba(255, 255, 255, 0.2)`,
              borderRadius: "18px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "28px" }}>🛡️</span>
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
                CONSERVATIVE
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: "22px", color: "#ffffff", fontWeight: 800 }}>
              Fold panels into bunkers
            </h3>
            <p style={{ margin: 0, fontSize: "15px", color: THEME.textSecondary, lineHeight: 1.3 }}>
              Panels survive, but base goes into cold emergency blackout for 3 days.
            </p>
          </div>
        </div>
      </div>

      <SubtitleBar
        sectionTag="WHO · Attention & Authenticity"
        timecode="0:00 - 0:08"
        text="You are nine years old. A dust storm is 12 seconds away. Do you fold the solar panels — or leave them out and maybe lose them forever?"
        highlightWord="dust storm"
      />
    </div>
  );
};
