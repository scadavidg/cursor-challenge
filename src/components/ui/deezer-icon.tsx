import React from "react";

export function DeezerIcon({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      width={24}
      height={24}
      {...props}
    >
      <rect width="32" height="32" rx="16" fill="#fff" />
      <path d="M10 8h7a7 7 0 1 1 0 14h-7V8zm7 12a5 5 0 1 0 0-10h-5v10h5z" fill="#111" />
    </svg>
  );
} 