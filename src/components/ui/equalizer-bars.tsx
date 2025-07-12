import React from "react";

export function EqualizerBars({ className = "", color = "#6366f1", ...props }: { className?: string; color?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      {...props}
    >
      <rect x="2" y="8" width="4" height="8" rx="2" fill={color}>
        <animate attributeName="height" values="8;16;8" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y" values="8;4;8" dur="1s" repeatCount="indefinite" />
      </rect>
      <rect x="10" y="6" width="4" height="12" rx="2" fill={color}>
        <animate attributeName="height" values="12;6;12" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y" values="6;9;6" dur="1s" repeatCount="indefinite" />
      </rect>
      <rect x="18" y="10" width="4" height="4" rx="2" fill={color}>
        <animate attributeName="height" values="4;16;4" dur="1s" repeatCount="indefinite" />
        <animate attributeName="y" values="10;2;10" dur="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
} 