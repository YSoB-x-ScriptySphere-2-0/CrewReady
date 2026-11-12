import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../types";

interface SubtitleBarProps {
  sectionTag: string; // "WHO", "WHY", "WHAT", "SO WHAT NEXT"
  text: string;
  timecode?: string;
  highlightWord?: string;
}

export const SubtitleBar: React.FC<SubtitleBarProps> = ({
  sectionTag,
  text,
  timecode,
  highlightWord,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "1400px",
        opacity: fadeIn,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top pill with section & NASA Space Apps challenge attribution */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            backgroundColor:
              sectionTag.includes("SO WHAT")
                ? THEME.gold
                : sectionTag.includes("WHAT")
                ? THEME.pink
                : THEME.cyan,
            color: "#070b1e",
            fontWeight: 800,
            fontSize: "13px",
            letterSpacing: "1.5px",
            padding: "4px 12px",
            borderRadius: "20px",
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {sectionTag}
        </span>
        {timecode && (
          <span
            style={{
              color: THEME.muted,
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "monospace",
              background: "rgba(10, 16, 42, 0.7)",
              padding: "3px 8px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {timecode}
          </span>
        )}
      </div>

      {/* Main Subtitle Box */}
      <div
        style={{
          backgroundColor: "rgba(7, 11, 30, 0.88)",
          backdropFilter: "blur(12px)",
          border: `1.5px solid rgba(34, 215, 230, 0.3)`,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
          padding: "16px 36px",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "100%",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: "26px",
            fontWeight: 600,
            lineHeight: 1.35,
            fontFamily: "Nunito, system-ui, sans-serif",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
          }}
        >
          {highlightWord ? (
            <>
              {text.split(highlightWord).map((part, index, arr) => (
                <React.Fragment key={index}>
                  {part}
                  {index < arr.length - 1 && (
                    <span
                      style={{
                        color: THEME.cyan,
                        fontWeight: 800,
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                      }}
                    >
                      {highlightWord}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            text
          )}
        </p>
      </div>
    </div>
  );
};
