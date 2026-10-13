// Placeholder artwork for the Product template's images, until real images
// can be uploaded. Each fills its Media box.

const fill = "block h-full w-full";

export function SoapArt() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={fill}>
      <defs>
        <linearGradient id="soap-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ecd6c7" />
          <stop offset="1" stopColor="#dcbfa6" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#soap-bg)" />
      <circle cx="250" cy="330" r="130" fill="none" stroke="#a8825f" strokeWidth="3" opacity=".55" />
      <circle cx="250" cy="330" r="128" fill="#d2a982" opacity=".25" />
      <rect x="120" y="300" width="95" height="150" rx="4" fill="#efdcc2" />
      <rect x="120" y="300" width="95" height="18" fill="#f6e8d4" />
      <path d="M60 500 C 70 470, 150 455, 260 470 L 300 500 Z" fill="#c9b49c" />
      <g stroke="#b59474" strokeWidth="2" fill="none">
        <path d="M80 200 Q 220 330 360 480" />
        <path d="M140 190 Q 200 300 250 400" />
        <path d="M260 240 Q 240 330 230 420" />
      </g>
    </svg>
  );
}

export function CypressArt() {
  return (
    <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className={fill}>
      <defs>
        <linearGradient id="cypress-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9dcd6" />
          <stop offset=".45" stopColor="#5f7a5c" />
          <stop offset=".7" stopColor="#2f4a33" />
          <stop offset="1" stopColor="#c9b9a1" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#cypress-bg)" />
      <ellipse cx="200" cy="150" rx="190" ry="90" fill="#2f5236" />
      <ellipse cx="260" cy="190" rx="110" ry="60" fill="#8a3a22" opacity=".85" />
      <ellipse cx="120" cy="120" rx="120" ry="55" fill="#3e6a44" />
      <path d="M190 220 C 185 270, 170 310, 140 360 M 210 220 C 220 280, 260 320, 330 360" stroke="#cfc7b8" strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="0" y="330" width="400" height="70" fill="#d8c9b2" />
    </svg>
  );
}

// A soft two-colour wash for journal posts.
export function WashArt({ id, from, to }: { id: string; from: string; to: string }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="none" className={fill}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${id})`} />
    </svg>
  );
}
