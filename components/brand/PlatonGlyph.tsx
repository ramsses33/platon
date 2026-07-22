type PlatonGlyphProps = {
  className?: string;
  emeraldAccent?: boolean;
};

export default function PlatonGlyph({
  className = "",
  emeraldAccent = false,
}: PlatonGlyphProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <linearGradient
          id="platon-glyph-metal"
          x1="14"
          y1="12"
          x2="50"
          y2="54"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFF0B5" />
          <stop offset="22%" stopColor="#E9CA78" />
          <stop offset="50%" stopColor="#B98C35" />
          <stop offset="72%" stopColor="#7B5318" />
          <stop offset="100%" stopColor="#DDB85F" />
        </linearGradient>

        <linearGradient
          id="platon-glyph-highlight"
          x1="12"
          y1="15"
          x2="50"
          y2="47"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="#FFFFFF"
            stopOpacity="0.62"
          />
          <stop
            offset="42%"
            stopColor="#FFF1B0"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor="#FFFFFF"
            stopOpacity="0"
          />
        </linearGradient>

        <linearGradient
          id="platon-glyph-emerald"
          x1="31"
          y1="28"
          x2="54"
          y2="53"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0%"
            stopColor="#6EE7B7"
            stopOpacity="0"
          />
          <stop
            offset="55%"
            stopColor="#34D399"
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            stopColor="#10B981"
            stopOpacity="0.7"
          />
        </linearGradient>

        <filter
          id="platon-glyph-depth"
          x="-30%"
          y="-30%"
          width="160%"
          height="170%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="1.4"
            floodColor="#000000"
            floodOpacity="0.55"
          />

          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="1"
            floodColor="#D7AB4A"
            floodOpacity="0.18"
          />
        </filter>
      </defs>

      <g
        transform="translate(32 32) scale(0.9) translate(-32 -32)"
        filter="url(#platon-glyph-depth)"
      >
        <g
          transform="translate(1.2 1.6)"
          fill="#3C270B"
          opacity="0.85"
        >
          <path d="M10.5 15.5H33L29.3 21.5H10.5Z" />
          <path d="M37.2 15.5H53.5L52.3 21.5H32.7Z" />
          <path d="M17.5 24.5H24.6V47.3C24.6 49.5 25.6 50.4 29.2 50.4V52H12.8V50.4C16.5 50.4 17.5 49.5 17.5 47.3Z" />
          <path d="M39.3 24.5H46.9C43.8 29.3 42.5 34.8 43.6 39.7C44.8 45 48.4 49 54.5 51.9C48.8 51.4 44.1 48.8 40.8 44.6C36.4 38.9 35.9 30.7 39.3 24.5Z" />
        </g>

        <g fill="url(#platon-glyph-metal)">
          <path d="M10.5 15.5H33L29.3 21.5H10.5Z" />
          <path d="M37.2 15.5H53.5L52.3 21.5H32.7Z" />
          <path d="M17.5 24.5H24.6V47.3C24.6 49.5 25.6 50.4 29.2 50.4V52H12.8V50.4C16.5 50.4 17.5 49.5 17.5 47.3Z" />
          <path d="M39.3 24.5H46.9C43.8 29.3 42.5 34.8 43.6 39.7C44.8 45 48.4 49 54.5 51.9C48.8 51.4 44.1 48.8 40.8 44.6C36.4 38.9 35.9 30.7 39.3 24.5Z" />
        </g>

        <g
          fill="none"
          stroke="url(#platon-glyph-highlight)"
          strokeWidth="0.7"
          strokeLinejoin="miter"
          opacity="0.75"
        >
          <path d="M11.5 16.4H31.2L30.5 17.6H11.5" />
          <path d="M38.2 16.4H52.2L52 17.6H37.5" />
          <path d="M18.5 25.3V46.8" />
          <path d="M40.3 25.2C38.3 31.4 38.7 38.1 41.7 43.2" />
        </g>

        {emeraldAccent && (
          <g
            fill="none"
            stroke="url(#platon-glyph-emerald)"
            strokeWidth="1.15"
            strokeLinecap="round"
            opacity="0.7"
          >
            <path d="M45.2 30.5C42.8 37.5 45.5 46.5 52.2 50.2" />
            <path d="M20 49.7H28" />
          </g>
        )}
      </g>
    </svg>
  );
}