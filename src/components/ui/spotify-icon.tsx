import React from "react";

export function SpotifyIcon({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={24}
      height={24}
      {...props}
    >
      <circle cx="12" cy="12" r="12" fill="#1DB954" />
      <path
        d="M17.25 16.13a.75.75 0 0 1-1.03.23c-2.82-1.73-6.38-2.12-10.59-1.16a.75.75 0 1 1-.33-1.46c4.56-1.04 8.47-.6 11.6 1.25a.75.75 0 0 1 .23 1.14zm1.48-2.98a.94.94 0 0 1-1.29.29c-3.23-2-8.16-2.59-11.98-1.42a.94.94 0 1 1-.54-1.8c4.23-1.28 9.57-.63 13.23 1.6.44.27.58.85.29 1.33zm.13-3.04C15.1 8.6 8.9 8.42 5.7 9.37a1.13 1.13 0 1 1-.65-2.17c3.7-1.1 10.5-.9 14.36 1.8a1.13 1.13 0 0 1-1.2 1.91z"
        fill="#fff"
      />
    </svg>
  );
} 