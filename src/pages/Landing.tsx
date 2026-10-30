import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Flame, Heart, Sticker, Users, Wand2, Share2 } from 'lucide-react';
import { useAppDataStore } from '../zustand/store';
import { ghostBtn, primaryBtn } from '../utils/btnUi';

/* ------------------------------------------------------------------ */
/*  Pumpkin illustration (inline SVG, no assets needed)                */
/* ------------------------------------------------------------------ */

type Face = 'classic' | 'grin' | 'surprised' | 'sleepy';
type Tone = 'orange' | 'amber' | 'violet';

const TONES: Record<Tone, { body: string[]; light: string; glow: string }> = {
  orange: { body: ['#c2410c', '#f97316', '#ea580c'], light: '#fef3c7', glow: '#fb923c' },
  amber: { body: ['#b45309', '#f59e0b', '#d97706'], light: '#fef9c3', glow: '#fbbf24' },
  violet: { body: ['#5b21b6', '#8b5cf6', '#6d28d9'], light: '#ede9fe', glow: '#a78bfa' },
};

function FaceShapes({ face }: { face: Face }) {
  switch (face) {
    case 'grin':
      return (
        <>
          <circle cx="74" cy="92" r="10" />
          <circle cx="126" cy="92" r="10" />
          <path d="M56 120 Q100 176 144 120 Q100 148 56 120 Z" />
        </>
      );
    case 'surprised':
      return (
        <>
          <ellipse cx="72" cy="92" rx="10" ry="14" />
          <ellipse cx="128" cy="92" rx="10" ry="14" />
          <ellipse cx="100" cy="138" rx="15" ry="19" />
        </>
      );
    case 'sleepy':
      return (
        <>
          <path d="M58 92 Q74 108 90 92 Q74 99 58 92 Z" />
          <path d="M110 92 Q126 108 142 92 Q126 99 110 92 Z" />
          <path d="M80 134 Q100 148 120 134 Q100 154 80 134 Z" />
        </>
      );
    default:
      return (
        <>
          <path d="M60 98 L84 98 L72 74 Z" />
          <path d="M116 98 L140 98 L128 74 Z" />
          <path d="M100 106 L93 118 L107 118 Z" />
          <path d="M56 128 L72 140 L84 128 L100 144 L116 128 L128 140 L144 128 L138 152 Q100 168 62 152 Z" />
        </>
      );
  }
}

function Pumpkin({
  face = 'classic',
  tone = 'orange',
  lit = true,
  className = '',
  label,
}: {
  face?: Face;
  tone?: Tone;
  lit?: boolean;
  className?: string;
  label?: string;
}) {
  const uid = useId().replace(/:/g, '');
  const t = TONES[tone];
  return (
    <svg
      viewBox="0 0 200 190"
      className={className}
      role="img"
      aria-label={label ?? `Jack-o'-lantern with a ${face} face`}
    >
      <defs>
        <filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* stem */}
      <path d="M92 38 Q90 14 108 8 Q106 24 112 38 Z" fill="#3f6212" />

      {/* body lobes */}
      <ellipse cx="54" cy="108" rx="46" ry="70" fill={t.body[0]} />
      <ellipse cx="146" cy="108" rx="46" ry="70" fill={t.body[0]} />
      <ellipse cx="78" cy="108" rx="50" ry="74" fill={t.body[2]} />
      <ellipse cx="122" cy="108" rx="50" ry="74" fill={t.body[2]} />
      <ellipse cx="100" cy="108" rx="44" ry="76" fill={t.body[1]} />

      {/* face: glow layer + crisp layer */}
      {lit && (
        <g className="hc-flicker" fill={t.glow} filter={`url(#blur-${uid})`} opacity="0.9">
          <FaceShapes face={face} />
        </g>
      )}
      <g
        className={lit ? 'hc-flicker' : ''}
        fill={lit ? t.light : '#1c1917'}
        style={{ transition: 'fill 300ms' }}
      >
        <FaceShapes face={face} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Page content                                                       */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Box,
    title: 'Carve in 3D',
    text: 'Spin your pumpkin, pick a shape, and cut eyes, noses, and grins from every angle.',
  },
  {
    icon: Flame,
    title: 'Light it up',
    text: 'A flickering candle brings each carving to life. Blow it out when it gets too spooky.',
  },
  {
    icon: Sticker,
    title: 'Turn it into a sticker',
    text: 'Export any pumpkin as a die-cut sticker with a transparent background.',
  },
  {
    icon: Users,
    title: 'Join the showcase',
    text: 'Publish your best work, collect hearts, and see what everyone else carved.',
  },
];

const STEPS = [
  {
    icon: Wand2,
    title: 'Shape',
    text: 'Choose a pumpkin: tall, squat, lumpy, or perfectly round.',
  },
  {
    icon: Flame,
    title: 'Carve',
    text: 'Cut a face, add a candle, and tweak the glow until it feels right.',
  },
  { icon: Share2, title: 'Publish', text: 'Save it as a sticker and share it with the community.' },
];

const SHOWCASE: {
  name: string;
  by: string;
  likes: number;
  face: Face;
  tone: Tone;
  tilt: string;
}[] = [
  {
    name: 'Old Reliable',
    by: 'marrow',
    likes: 214,
    face: 'classic',
    tone: 'orange',
    tilt: '-rotate-2',
  },
  { name: 'Toothy', by: 'gourdon', likes: 168, face: 'grin', tone: 'amber', tilt: 'rotate-1' },
  {
    name: 'Boo Who?',
    by: 'nightpatch',
    likes: 131,
    face: 'surprised',
    tone: 'violet',
    tilt: 'rotate-2',
  },
  {
    name: 'Nap Time',
    by: 'sleepygourd',
    likes: 97,
    face: 'sleepy',
    tone: 'orange',
    tilt: '-rotate-1',
  },
];

/* ------------------------------------------------------------------ */
/*  Landing                                                            */
/* ------------------------------------------------------------------ */

export default function Landing() {
  // Replace this with your real auth state, e.g. const { user } = useAuth();
  const { user } = useAppDataStore();

  const [lit, setLit] = useState(true);

  return (
    <div className="w-full flex-1 scroll-smooth selection:bg-orange-500 selection:text-stone-950">
      <style>{`
        @keyframes hc-flicker {
          0%, 100% { opacity: 1; }
          40% { opacity: .84; }
          55% { opacity: .96; }
          72% { opacity: .78; }
          88% { opacity: .98; }
        }
        .hc-flicker { animation: hc-flicker 2.8s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .hc-flicker { animation: none; } }
      `}</style>

      <main id="top">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-16 lg:grid-cols-2 lg:pb-28 lg:pt-24">
            <div>
              <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Hallow<span className="text-orange-500">Craft</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-stone-400">
                Craft 2D & 3D Jack-o'-Lanterns, carve unique pumpkins, and publish your stickers to
                the community showcase.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                {user ? (
                  <>
                    <Link to="/craft" className={primaryBtn}>
                      <Flame className="h-4 w-4" aria-hidden />
                      Craft a pumpkin
                    </Link>
                    <Link to="/dashboard" className={ghostBtn}>
                      Go to dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={primaryBtn}>
                      Start crafting
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                    <Link to="/showcase" className={ghostBtn}>
                      See the showcase
                    </Link>
                  </>
                )}
              </div>

              <p className="mt-5 text-sm text-stone-500">
                {user
                  ? 'Welcome back. Your pumpkins are waiting.'
                  : 'Free to start. No carving knife required.'}
              </p>
            </div>

            {/* The memorable moment: a pumpkin you can blow out */}
            <div className="relative mx-auto flex w-full max-w-sm flex-col items-center">
              <div
                aria-hidden
                className={`absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-[55%] rounded-full bg-orange-500/25 blur-3xl transition-opacity duration-500 sm:h-80 sm:w-80 ${
                  lit ? 'opacity-100' : 'opacity-0'
                }`}
              />
              <button
                type="button"
                onClick={() => setLit((v) => !v)}
                aria-pressed={lit}
                aria-label={lit ? 'Blow out the candle' : 'Relight the candle'}
                className="relative rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4 focus-visible:ring-offset-stone-950"
              >
                <Pumpkin
                  face="classic"
                  lit={lit}
                  className="w-64 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition duration-300 hover:scale-105 sm:w-80"
                />
              </button>
              <p className="relative mt-4 text-sm text-stone-500">
                {lit ? 'Tap the pumpkin to blow out the candle' : 'Spooky. Tap to relight'}
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------- Features ---------------------------- */}
        <section id="features" className="scroll-mt-16 border-t border-stone-800/70">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
            <h2 className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to carve a good one
            </h2>

            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-stone-800 bg-stone-800 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-stone-950 p-8">
                  <Icon className="h-6 w-6 text-orange-500" aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 max-w-sm leading-relaxed text-stone-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------- How it works -------------------------- */}
        <section id="how" className="scroll-mt-16 border-t border-stone-800/70">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
            <h2 className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
              From pumpkin to sticker in three steps
            </h2>

            <ol className="mt-12 grid gap-10 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="relative border-l border-orange-500/40 pl-6">
                  <span
                    className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-orange-500"
                    aria-hidden
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-orange-500">Step {i + 1}</span>
                    <Icon className="h-4 w-4 text-stone-500" aria-hidden />
                  </div>
                  <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-stone-400">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------------------- Showcase ---------------------------- */}
        <section id="showcase" className="scroll-mt-16 border-t border-stone-800/70">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Fresh from the patch
                </h2>
                <p className="mt-3 max-w-md text-stone-400">
                  Stickers published by the community this week.
                </p>
              </div>
              <Link
                to="/showcase"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-400"
              >
                View all stickers in showcase
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {SHOWCASE.map((s) => (
                <li
                  key={s.name}
                  className={`transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 ${s.tilt}`}
                >
                  {/* die-cut sticker look */}
                  <div className="rounded-[2rem] border-2 border-dashed border-stone-700 bg-stone-900 p-5">
                    <Pumpkin face={s.face} tone={s.tone} className="mx-auto w-full max-w-[10rem]" />
                    <div className="mt-4 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{s.name}</p>
                        <p className="truncate text-sm text-stone-500">by @{s.by}</p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 text-sm text-stone-400">
                        <Heart className="h-4 w-4 text-orange-500" aria-hidden />
                        {s.likes}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------ CTA ------------------------------ */}
        <section className="border-t border-stone-800/70">
          <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
            <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-stone-900 px-8 py-14 sm:px-14">
              <div
                aria-hidden
                className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"
              />
              <div className="relative max-w-xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {user ? 'Your next pumpkin is waiting' : 'Light your first lantern'}
                </h2>
                <p className="mt-4 text-stone-400">
                  {user
                    ? 'Pick up where you left off, or start a fresh carving.'
                    : 'Create a free account, carve a pumpkin, and post it to the showcase.'}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {user ? (
                    <>
                      <Link to="/craft" className={primaryBtn}>
                        <Flame className="h-4 w-4" aria-hidden />
                        Craft a pumpkin
                      </Link>
                      <Link to="/dashboard" className={ghostBtn}>
                        Open dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className={primaryBtn}>
                        Create an account
                      </Link>
                      <Link to="/login" className={ghostBtn}>
                        Log in
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ----------------------------- Footer ----------------------------- */}
      <footer className="border-t border-stone-800/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-stone-500">
          <p className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" aria-hidden />
            Hallowcraft · {new Date().getFullYear()}
          </p>
          <div className="flex gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="transition hover:text-orange-400">
                  Dashboard
                </Link>
                <Link to="/craft" className="transition hover:text-orange-400">
                  Craft
                </Link>
              </>
            ) : (
              <Link to="/login" className="transition hover:text-orange-400">
                Log in
              </Link>
            )}
            <Link to="/showcase" className="transition hover:text-orange-400">
              Showcase
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
