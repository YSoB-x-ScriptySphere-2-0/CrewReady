import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../types";

interface DataBadgeProps {
  label: string;
  source: string;
  isLive?: boolean;
}

export const DataBadge: React.FC<DataBadgeProps> = ({
  label,
  source,
  isLive = true,
}) => {
  const frame = useCurrentFrame();
  const pulse = Math.sin(frame / 6) * 0.4 + 0.6;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        backgroundColor: "rgba(14, 22, 56, 0.9)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        borderRadius: "24px",
        padding: "6px 14px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
      }}
    >
      {isLive && (
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: THEME.green,
            opacity: pulse,
            boxShadow: `0 0 10px ${THEME.green}`,
          }}
        />
      )}
      <span
        style={{
          color: THEME.cyan,
          fontWeight: 800,
          fontSize: "13px",
          letterSpacing: "0.8px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {label}
      </span>
      <span style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "12px" }}>
        |
      </span>
      <span
        style={{
          color: THEME.textSecondary,
          fontSize: "12px",
          fontFamily: "system-ui, sans-serif",
          fontWeight: 600,
        }}
      >
        {source}
      </span>
    </div>
  );
};
