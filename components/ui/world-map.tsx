export function WorldMap({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 520"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <pattern id="map-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="#d7c9a4" opacity="0.22" />
        </pattern>
      </defs>
      <rect width="1000" height="520" fill="url(#map-dots)" />
      {[80, 160, 240, 320, 400, 480].map((y) => (
        <line
          key={y}
          x1="40"
          x2="960"
          y1={y}
          y2={y}
          stroke="#d7c9a4"
          strokeOpacity="0.12"
        />
      ))}
      {[120, 280, 440, 600, 760, 880].map((x) => (
        <line
          key={x}
          y1="40"
          y2="480"
          x1={x}
          x2={x}
          stroke="#d7c9a4"
          strokeOpacity="0.1"
        />
      ))}

      <path
        d="M210 120c40-30 90-20 110 10 18 28 8 70-18 88-30 20-78 8-96-18-22-32-18-58 4-80Z"
        fill="#d7c9a4"
        fillOpacity="0.12"
        stroke="#d7c9a4"
        strokeOpacity="0.35"
      />
      <path
        d="M430 70c90-10 150 20 170 70 14 36-10 80-48 92-40 14-92-6-118-40-28-36-28-90-4-122Z"
        fill="#d7c9a4"
        fillOpacity="0.12"
        stroke="#d7c9a4"
        strokeOpacity="0.35"
      />
      <path
        d="M500 210c55 8 88 48 80 92-8 42-58 70-108 62-46-8-70-48-60-88 10-38 48-72 88-66Z"
        fill="#d7c9a4"
        fillOpacity="0.12"
        stroke="#d7c9a4"
        strokeOpacity="0.35"
      />
      <path
        d="M680 150c70-8 150 20 180 78 22 42 8 90-30 112-48 28-130 10-168-28-40-40-36-110 18-162Z"
        fill="#d7c9a4"
        fillOpacity="0.12"
        stroke="#d7c9a4"
        strokeOpacity="0.35"
      />
      <path
        d="M250 250c28 40 22 110-8 150-24 32-70 40-92 10-20-28-8-88 18-128 18-28 58-50 82-32Z"
        fill="#d7c9a4"
        fillOpacity="0.1"
        stroke="#d7c9a4"
        strokeOpacity="0.3"
      />
      <path
        d="M720 340c40 8 70 40 58 72-12 30-58 38-86 18-24-18-22-58 4-78 12-10 16-14 24-12Z"
        fill="#d7c9a4"
        fillOpacity="0.1"
        stroke="#d7c9a4"
        strokeOpacity="0.3"
      />

      <path
        className="route-dash"
        d="M720 210 C 640 180, 520 200, 430 250 C 340 300, 280 280, 220 220 C 180 180, 250 140, 320 160"
        stroke="#b89a5c"
        strokeWidth="1.6"
        strokeDasharray="5 7"
        strokeLinecap="round"
      />
      <path
        className="route-dash"
        d="M720 210 C 760 260, 800 300, 780 360"
        stroke="#b89a5c"
        strokeWidth="1.4"
        strokeDasharray="4 6"
      />

      <g fill="#b89a5c">
        <circle cx="720" cy="210" r="4.5" />
        <circle cx="430" cy="250" r="3.5" />
        <circle cx="220" cy="220" r="3.5" />
        <circle cx="780" cy="360" r="3.5" />
        <circle cx="540" cy="160" r="3" />
      </g>
      <g
        fill="#f4f1ea"
        fontSize="14"
        opacity="0.7"
      >
        <text x="732" y="198">
          Yunnan
        </text>
        <text x="200" y="208">
          Lisbon
        </text>
        <text x="790" y="378">
          Melbourne
        </text>
      </g>
    </svg>
  );
}

export function CompassRose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g className="compass-spin origin-center" style={{ transformOrigin: "60px 60px" }}>
        <circle cx="60" cy="60" r="52" fill="none" stroke="#d7c9a4" strokeOpacity="0.35" />
        <circle cx="60" cy="60" r="40" fill="none" stroke="#d7c9a4" strokeOpacity="0.2" />
        <path d="M60 14 L66 60 L60 54 L54 60 Z" fill="#b89a5c" />
        <path d="M60 106 L54 60 L60 66 L66 60 Z" fill="#f4f1ea" />
        <path d="M14 60 L60 54 L54 60 L60 66 Z" fill="#f4f1ea" opacity="0.5" />
        <path d="M106 60 L60 66 L66 60 L60 54 Z" fill="#f4f1ea" opacity="0.5" />
      </g>
      <text x="56" y="12" fontSize="8" fill="#b89a5c">
        N
      </text>
    </svg>
  );
}
