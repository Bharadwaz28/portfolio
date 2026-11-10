/*
  Custom illustrations for the project cards (no screenshots, no made-up numbers).
  art: 'webapp' | 'signal' | 'fraud' | 'docs' | 'robot'
*/

const W = 240;
const H = 96;

// ---- signal helpers -------------------------------------------------
const BEAT = [
  [0.14, 0], [0.2, -0.14], [0.26, 0], [0.36, 0], [0.4, 0.12], [0.44, -1],
  [0.48, 0.3], [0.52, 0], [0.64, 0], [0.74, -0.24], [0.84, 0], [1, 0],
];

function ecgPath(y, amp, beats) {
  const bw = W / beats;
  let d = `M0 ${y}`;
  for (let b = 0; b < beats; b += 1) {
    for (const [px, py] of BEAT) d += ` L${(b * bw + px * bw).toFixed(1)} ${(y + py * amp).toFixed(1)}`;
  }
  return d;
}

function wavePath(y, amp, fn) {
  let d = '';
  for (let x = 0; x <= W; x += 3) d += `${x ? ' L' : 'M'}${x} ${(y + fn(x) * amp).toFixed(1)}`;
  return d;
}

const eeg = (x) => Math.sin(x * 0.21) * 0.5 + Math.sin(x * 0.53 + 1) * 0.3 + Math.sin(x * 0.97 + 2) * 0.2;
const ppg = (x) => {
  const t = (x % 48) / 48;
  return 0.4 - Math.exp(-((t - 0.25) ** 2) / 0.012) - 0.45 * Math.exp(-((t - 0.55) ** 2) / 0.02);
};

const ECG = ecgPath(27, 19, 4);
const EEG = wavePath(57, 7, eeg);
const PPG = wavePath(81, 8, ppg);

function SignalArt() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none" aria-hidden="true">
      {[27, 57, 81].map((y) => (
        <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#20312D" strokeWidth="0.5" strokeDasharray="2 4" />
      ))}
      <path d={EEG} stroke="#1DBB88" strokeOpacity="0.55" strokeWidth="1" />
      <path d={PPG} stroke="#1DBB88" strokeOpacity="0.55" strokeWidth="1" />
      <path d={ECG} stroke="#1DBB88" strokeOpacity="0.6" strokeWidth="1.2" strokeLinejoin="round" />
      {/* bright segment that travels along the ECG trace */}
      <path
        d={ECG}
        pathLength="1"
        stroke="#35DCA2"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="0.16 0.84"
        className="animate-trace"
        style={{ filter: 'drop-shadow(0 0 3px rgba(53,220,162,0.9))' }}
      />
      <g fontFamily="'JetBrains Mono Variable', monospace" fontSize="6.5" fill="#64736D">
        <text x="4" y="10">ECG</text>
        <text x="4" y="46">EEG</text>
        <text x="4" y="70">PPG</text>
      </g>
    </svg>
  );
}

// ---- fraud helpers --------------------------------------------------
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

const rnd = seeded(11);
const LEGIT = [];
while (LEGIT.length < 38) {
  const x = 12 + rnd() * 216;
  const y = 12 + rnd() * 66;
  if (!(x > 132 && y < 54)) LEGIT.push([x, y]);
}
const FLAGGED = Array.from({ length: 6 }, () => [158 + rnd() * 66, 12 + rnd() * 28]);

function FraudArt() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none" aria-hidden="true">
      {LEGIT.map(([x, y], i) => (
        <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.6" fill="#64736D" fillOpacity="0.75" />
      ))}
      {/* decision boundary */}
      <path
        d="M126 4C134 34 168 52 238 56"
        stroke="#35DCA2"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="animate-dash"
      />
      {FLAGGED.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="2" fill="#35DCA2" />
          <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="4.4" stroke="#35DCA2" strokeOpacity="0.45" strokeWidth="0.8" />
        </g>
      ))}
      <g fontFamily="'JetBrains Mono Variable', monospace" fontSize="6.5">
        <circle cx="8" cy="88" r="1.6" fill="#64736D" />
        <text x="14" y="90.3" fill="#64736D">legit</text>
        <circle cx="46" cy="88" r="2" fill="#35DCA2" />
        <text x="52" y="90.3" fill="#98A7A1">flagged</text>
      </g>
    </svg>
  );
}

// ---- docs -----------------------------------------------------------
function Sheet({ x, y, label }) {
  return (
    <g>
      <path
        d={`M${x} ${y}h20l8 8v24h-28z`}
        fill="#070C0E"
        stroke="#35DCA2"
        strokeOpacity="0.8"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d={`M${x + 20} ${y}v8h8`} stroke="#35DCA2" strokeOpacity="0.8" strokeWidth="1" strokeLinejoin="round" />
      <path
        d={`M${x + 5} ${y + 15}h18M${x + 5} ${y + 20}h18M${x + 5} ${y + 25}h11`}
        stroke="#64736D"
        strokeWidth="1"
      />
      <text
        x={x + 36}
        y={y + 19}
        fontFamily="'JetBrains Mono Variable', monospace"
        fontSize="8"
        fontWeight="600"
        fill="#E8F0ED"
      >
        {label}
      </text>
    </g>
  );
}

function DocsArt() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none" aria-hidden="true">
      <rect x="10" y="33" width="86" height="30" rx="3" fill="#070C0E" stroke="#20312D" />
      <text x="18" y="51.5" fontFamily="'JetBrains Mono Variable', monospace" fontSize="8" fill="#35DCA2">
        &gt; prompt
      </text>
      <rect x="58" y="44" width="4.5" height="9" fill="#35DCA2" className="animate-blink" />
      <path
        d="M96 48H118C132 48 130 24 150 24M118 48C132 48 130 72 150 72"
        stroke="#1DBB88"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="animate-dash"
      />
      <Sheet x={154} y={8} label="PPTX" />
      <Sheet x={154} y={56} label="PDF" />
    </svg>
  );
}

// ---- robot ----------------------------------------------------------
const TRACK = 'M-10 70C40 70 50 24 96 24S150 72 190 66S226 30 252 30';
const REDUCED =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function RobotArt() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none" aria-hidden="true">
      {/* the line on the floor */}
      <path d={TRACK} stroke="#20312D" strokeWidth="7" strokeLinecap="round" />
      <path d={TRACK} stroke="#1DBB88" strokeOpacity="0.7" strokeWidth="1" strokeDasharray="4 4" className="animate-dash" />

      {/* the robot: chassis, two wheels, three IR sensors at the front */}
      <g transform={REDUCED ? 'translate(96 24)' : undefined}>
        {REDUCED ? null : <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" path={TRACK} />}
        <rect x="-11" y="-11" width="6" height="4" rx="1" fill="#64736D" />
        <rect x="-11" y="7" width="6" height="4" rx="1" fill="#64736D" />
        <rect x="-12" y="-7.5" width="22" height="15" rx="3" fill="#070C0E" stroke="#35DCA2" strokeWidth="1.2" />
        <circle cx="7" cy="-4" r="1.3" fill="#35DCA2" />
        <circle cx="8" cy="0" r="1.3" fill="#35DCA2" />
        <circle cx="7" cy="4" r="1.3" fill="#35DCA2" />
        <rect x="-8" y="-3" width="8" height="6" rx="1" stroke="#64736D" strokeWidth="0.8" />
      </g>

      <g fontFamily="'JetBrains Mono Variable', monospace" fontSize="6.5">
        <circle cx="8" cy="88" r="1.6" fill="#35DCA2" />
        <text x="14" y="90.3" fill="#98A7A1">IR sensors</text>
        <path d="M66 88h10" stroke="#1DBB88" strokeDasharray="2 2" />
        <text x="80" y="90.3" fill="#64736D">path</text>
      </g>
    </svg>
  );
}

// ---- web app --------------------------------------------------------
function WebAppArt() {
  const font = "'JetBrains Mono Variable', monospace";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none" aria-hidden="true">
      {/* browser window */}
      <rect x="10" y="12" width="96" height="66" rx="3" fill="#070C0E" stroke="#35DCA2" strokeOpacity="0.8" />
      <path d="M10 24h96" stroke="#20312D" />
      <circle cx="17" cy="18" r="1.5" fill="#20312D" />
      <circle cx="23" cy="18" r="1.5" fill="#20312D" />
      <circle cx="29" cy="18" r="1.5" fill="#35DCA2" />
      <rect x="18" y="31" width="42" height="4" rx="1" fill="#E8F0ED" fillOpacity="0.85" />
      <rect x="18" y="39" width="30" height="2.5" rx="1" fill="#64736D" />
      <rect x="18" y="45" width="18" height="6" rx="1.5" fill="#35DCA2" />
      <rect x="68" y="31" width="30" height="20" rx="2" stroke="#20312D" />
      <rect x="18" y="58" width="24" height="12" rx="2" stroke="#20312D" />
      <rect x="46" y="58" width="24" height="12" rx="2" stroke="#20312D" />
      <rect x="74" y="58" width="24" height="12" rx="2" stroke="#20312D" />

      {/* requests flowing to the API and the database */}
      <path d="M106 45H132M172 45H196" stroke="#1DBB88" strokeDasharray="4 4" className="animate-dash" />

      <rect x="132" y="32" width="40" height="26" rx="3" fill="#070C0E" stroke="#20312D" />
      <text x="152" y="48" textAnchor="middle" fontFamily={font} fontSize="8" fontWeight="600" fill="#E8F0ED">
        API
      </text>

      {/* database cylinder */}
      <path d="M196 34v22c0 3 7 5.5 15 5.5s15-2.500 15-5.500V34" fill="#070C0E" stroke="#35DCA2" strokeOpacity="0.8" />
      <ellipse cx="211" cy="34" rx="15" ry="5.5" fill="#070C0E" stroke="#35DCA2" strokeOpacity="0.8" />
      <path d="M196 45c0 3 7 5.5 15 5.5s15-2.500 15-5.500" stroke="#35DCA2" strokeOpacity="0.4" />

      <g fontFamily={font} fontSize="6.500" fill="#64736D" textAnchor="middle">
        <text x="58" y="90">React UI</text>
        <text x="152" y="90">Express</text>
        <text x="211" y="90">MongoDB</text>
      </g>
    </svg>
  );
}

const ART = { webapp: WebAppArt, signal: SignalArt, fraud: FraudArt, docs: DocsArt, robot: RobotArt };

export default function ProjectArt({ art, className = '' }) {
  const Art = ART[art];
  if (!Art) return null;
  return (
    <div className={`grid-texture aspect-[5/2] w-full overflow-hidden rounded border border-line bg-bg ${className}`}>
      <Art />
    </div>
  );
}
