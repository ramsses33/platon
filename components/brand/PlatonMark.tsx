export default function PlatonMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className="h-full w-full"
    >
      <defs>
        <radialGradient
          id="platon-mark-face"
          cx="34%"
          cy="23%"
          r="82%"
        >
          <stop
            offset="0%"
            stopColor="#FFE8A0"
          />
          <stop
            offset="32%"
            stopColor="#D7A947"
          />
          <stop
            offset="70%"
            stopColor="#8A5A14"
          />
          <stop
            offset="100%"
            stopColor="#3A2307"
          />
        </radialGradient>

        <linearGradient
          id="platon-mark-border"
          x1="8"
          y1="5"
          x2="56"
          y2="59"
        >
          <stop
            offset="0%"
            stopColor="#FFF2B5"
          />
          <stop
            offset="42%"
            stopColor="#D5A342"
          />
          <stop
            offset="100%"
            stopColor="#68400C"
          />
        </linearGradient>

        <filter
          id="platon-mark-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="1.4"
            floodColor="#000000"
            floodOpacity="0.7"
          />
        </filter>
      </defs>

      <circle
        cx="32"
        cy="32"
        r="29"
        fill="url(#platon-mark-face)"
        stroke="url(#platon-mark-border)"
        strokeWidth="2"
        filter="url(#platon-mark-shadow)"
      />

      <circle
        cx="32"
        cy="32"
        r="25.5"
        fill="none"
        stroke="#FFE89D"
        strokeWidth="1"
        strokeOpacity="0.2"
      />

      <g transform="translate(32 32) scale(0.9) translate(-32 -32)">
        <g fill="#090805">
        <path d="M10.5 15.5H33L29.3 21.5H10.5Z" />

        <path d="M37.2 15.5H53.5L52.3 21.5H32.7Z" />

        <path d="M17.5 24.5H24.6V47.3C24.6 49.5 25.6 50.4 29.2 50.4V52H12.8V50.4C16.5 50.4 17.5 49.5 17.5 47.3Z" />

        <path d="M39.3 24.5H46.9C43.8 29.3 42.5 34.8 43.6 39.7C44.8 45 48.4 49 54.5 51.9C48.8 51.4 44.1 48.8 40.8 44.6C36.4 38.9 35.9 30.7 39.3 24.5Z" />
      </g>

      <path
        d="M11.5 16.5H31.2L30.4 17.7H11.5Z"
        fill="#FFFFFF"
        opacity="0.08"
      />

      <path
        d="M38.1 16.5H52.4L52.1 17.7H37.4Z"
        fill="#FFFFFF"
        opacity="0.08"
      />
      </g>
    </svg>
  );
}