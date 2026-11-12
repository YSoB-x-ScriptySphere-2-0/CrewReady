import React from "react";
import { THEME } from "../types";

interface MeterBarProps {
  label: string;
  icon: string;
  value: number; // 0 to 100
  color: string;
}

export const MeterBar: React.FC<MeterBarProps> = ({
  label,
  icon,
  value,
  color,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        backgroundColor: "rgba(10, 16, 42, 0.8)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        borderRadius: "14px",
        padding: "10px 16px",
        minWidth: "220px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          backgroundColor: `${color}22`,
          border: `1.5px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: 900,
          color: color,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              color: THEME.white,
              fontSize: "13px",
              fontWeight: 700,
              fontFamily: "Nunito, system-ui",
            }}
          >
            {label}
          </span>
          <span
            style={{
              color: color,
              fontSize: "13px",
              fontWeight: 800,
              fontFamily: "monospace",
            }}
          >
            {Math.round(value)}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.max(0, Math.min(100, value))}%`,
              height: "100%",
              backgroundColor: color,
              borderRadius: "4px",
              boxShadow: `0 0 8px ${color}`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
};
