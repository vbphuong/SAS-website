"use client";

import { useState, useRef } from "react";
import Image from "next/image";

/* ─── Types ─────────────────────────────────────────────── */
type Step = "intro" | "celebrating" | "content";

type Particle = {
  id: number; x: number; color: string;
  size: number; delay: number; circle: boolean;
};

/* ─── Data ───────────────────────────────────────────────── */
const FACULTIES = [
  {
    slug: "computer-science", label: "Computer Science", icon: "💻",
    desc: "Programming, networks, data structures, and software engineering tips.",
  },
  {
    slug: "business", label: "Business", icon: "📊",
    desc: "Accounting, management, marketing, economics, and strategic finance tips.",
  },
  {
    slug: "media", label: "Media", icon: "🎬",
    desc: "Journalism, digital content, film studies, PR, and advertising tips.",
  },
];

const CONFETTI_COLORS = [
  "#E2012D", "#FFD700", "#00B4D8", "#06D6A0", "#FFB347", "#C77DFF",
];

const HOW_IT_WORKS = [
  { n: "01", title: "Find your unit",  body: "Browse your faculty page and locate your unit code." },
  { n: "02", title: "Read the tips",   body: "Each unit card has practical, actionable study strategies." },
  { n: "03", title: "Book a session",  body: "Scan the QR code or click the link on any unit card to book." },
];

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export default function LandingInteractive() {
  const [step, setStep]           = useState<Step>("intro");
  const [capOffset, setCapOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isOverDrop, setIsOverDrop] = useState(false);
  const [confetti, setConfetti]   = useState<Particle[]>([]);

  const dropZoneRef = useRef<HTMLDivElement>(null);
  const dragStart   = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  /* ── Drag handlers ─────────────────────────────────────── */
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (step !== "intro") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: capOffset.x, oy: capOffset.y };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setCapOffset({
      x: dragStart.current.ox + e.clientX - dragStart.current.x,
      y: dragStart.current.oy + e.clientY - dragStart.current.y,
    });
    const dz = dropZoneRef.current?.getBoundingClientRect();
    if (dz) {
      setIsOverDrop(
        e.clientX >= dz.left && e.clientX <= dz.right &&
        e.clientY >= dz.top  && e.clientY <= dz.bottom,
      );
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;
    setIsDragging(false);
    const dz = dropZoneRef.current?.getBoundingClientRect();
    const hit =
      dz &&
      e.clientX >= dz.left && e.clientX <= dz.right &&
      e.clientY >= dz.top  && e.clientY <= dz.bottom;

    if (hit) {
      celebrate();
    } else {
      setCapOffset({ x: 0, y: 0 });
      setIsOverDrop(false);
    }
  }

  function celebrate() {
    setStep("celebrating");
    const particles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id:     i,
      x:      5 + Math.random() * 90,
      color:  CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size:   6 + Math.random() * 10,
      delay:  Math.random() * 0.7,
      circle: Math.random() > 0.4,
    }));
    setConfetti(particles);
    setTimeout(() => { setStep("content"); setConfetti([]); }, 2200);
  }

  /* ── CONTENT STATE — original homepage layout ──────────── */
  if (step === "content") {
    return (
      <main>
        {/* Hero with QR */}
        <section className="hero-banner">
          <div className="hero-inner">
            <div>
              <p className="hero-eyebrow">Swinburne University of Technology</p>
              <h1 className="hero-headline">Student Academic&nbsp;Success</h1>
              <p className="hero-sub">
                We help you thrive at university. Find expert tips for your units,
                then book a free one-on-one session with an academic advisor.
              </p>
            </div>
            <div className="hero-qr-wrap">
              <Image
                src="/QR_book.png"
                alt="Scan to book a session"
                width={180} height={180} priority
              />
              <p className="hero-qr-label">Scan to book</p>
            </div>
          </div>
        </section>

        {/* Faculty cards + How it works */}
        <section className="view-section">
          <p className="eyebrow">Explore by Faculty</p>
          <h2 className="section-headline">What can we help you with?</h2>
          <p className="section-lead">
            Browse tips for your units across three faculties. Each card shows you
            practical strategies to succeed — and links you back to book a session.
          </p>

          <div className="info-grid">
            {FACULTIES.map((f) => (
              <div key={f.slug} className="info-card">
                <div className="info-card-icon">{f.icon}</div>
                <h3 className="info-card-title">{f.label}</h3>
                <p className="info-card-body">{f.desc}</p>
                <a href={`/${f.slug}`} className="info-card-link">View units →</a>
              </div>
            ))}
          </div>

          <p className="eyebrow" style={{ marginTop: "64px" }}>How it works</p>
          <h2 className="section-headline" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
            Three steps to succeed
          </h2>
          <div className="info-grid">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.n} className="info-card">
                <span className="unit-code" style={{ fontSize: "1rem" }}>{s.n}</span>
                <h3 className="info-card-title">{s.title}</h3>
                <p className="info-card-body">{s.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  /* ── INTRO / CELEBRATING STATE ─────────────────────────── */
  return (
    <>
      {/* Confetti */}
      {confetti.length > 0 && (
        <div className="landing-confetti-wrap" aria-hidden>
          {confetti.map((p) => (
            <div
              key={p.id}
              className="landing-confetti-p"
              style={{
                left:            `${p.x}%`,
                backgroundColor: p.color,
                width:           p.size,
                height:          p.size,
                borderRadius:    p.circle ? "50%" : "2px",
                animationDelay:  `${p.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <section className="landing-intro">
        {/* Text */}
        <div className="landing-intro-text">
          <p className="hero-eyebrow">Student Academic Success</p>
          <h1 className="landing-intro-title">
            {step === "celebrating"
              ? "🎉 Awesome! Get ready…"
              : <>Drag the 🎓 cap onto <span style={{ whiteSpace: "nowrap" }}>Mr. Success!</span></>}
          </h1>
          <p className="landing-intro-sub">
            {step === "celebrating"
              ? "Loading your personalised study tips!"
              : "Drop it on his head to unlock expert study tips for your units."}
          </p>
        </div>

        {/* Drag area */}
        <div className="landing-drag-area">
          {/* Draggable cap */}
          <div
            className={`landing-cap${isDragging ? " dragging" : step === "intro" ? " floating" : ""}`}
            style={{
              transform:   `translate(${capOffset.x}px, ${capOffset.y}px)`,
              touchAction: "none",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <GraduationCapSVG isDragging={isDragging} />
            {!isDragging && (
              <span className="landing-cap-pill">
                <span>👆</span> Drag me
              </span>
            )}
          </div>

          {/* Mr. Success + drop zone */}
          <div className="landing-character">
            <div
              ref={dropZoneRef}
              className={`landing-dropzone${isOverDrop ? " active" : ""}`}
            />
            <MrSuccessSVG
              wearing={step === "celebrating"}
              isOverDrop={isOverDrop}
            />
            <p className="landing-character-label">Mr. Success</p>
          </div>
        </div>

        {step === "intro" && (
          <p className="landing-hint">
            <span className="landing-hint-arr">↑</span> Drag the cap to his head
          </p>
        )}
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   GRADUATION CAP SVG (Draggable Item)
══════════════════════════════════════════════════════════ */
function GraduationCapSVG({ isDragging }: { isDragging: boolean }) {
  return (
    <svg
      width="120"
      height="85"
      viewBox="0 0 120 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`landing-cap-svg${isDragging ? " is-drag" : ""}`}
      aria-label="Graduation Cap"
    >
      <defs>
        <linearGradient id="cap-top-grad" x1="10" y1="9" x2="110" y2="45" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#353A4D" />
          <stop offset="50%" stopColor="#222533" />
          <stop offset="100%" stopColor="#14151E" />
        </linearGradient>
        <linearGradient id="cap-gold-grad" x1="60" y1="27" x2="104" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* Floating Ground Shadow */}
      <ellipse cx="60" cy="78" rx="36" ry="6" fill="#000000" opacity={isDragging ? 0.45 : 0.25} />

      {/* Skullcap headband beneath mortarboard */}
      <path d="M38 46 Q60 55 82 46 L84 38 Q60 44 36 38 Z" fill="#181A24" />
      <path d="M38 46 Q60 55 82 46" stroke="#E2012D" strokeWidth="2.2" strokeLinecap="round" />

      {/* 3D Mortarboard Bevel Edges */}
      <path d="M10 26 L60 45 L60 50 L10 31 Z" fill="#12131A" />
      <path d="M110 26 L60 45 L60 50 L110 31 Z" fill="#1C1E29" />

      {/* Top Diamond Surface */}
      <path d="M10 25 L60 7 L110 25 L60 44 Z" fill="url(#cap-top-grad)" stroke="#4A5068" strokeWidth="0.8" />
      <path d="M14 25 L60 9 L106 25 L60 42 Z" fill="#1C1E28" opacity="0.4" />

      {/* Center Gold Button */}
      <ellipse cx="60" cy="25" rx="5" ry="3.5" fill="url(#cap-gold-grad)" />
      <circle cx="59" cy="24" r="1.5" fill="#FFFFFF" opacity="0.8" />

      {/* Flowing Gold Tassel */}
      <path
        d="M60 25 Q84 23 95 40 Q99 49 100 62"
        stroke="url(#cap-gold-grad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tassel Ring */}
      <circle cx="100" cy="62" r="3.2" fill="#CA8A04" />
      {/* Tassel Fringe */}
      <path d="M96 63 L94 77 C97 78 103 78 106 77 L104 63 Z" fill="url(#cap-gold-grad)" />
      <line x1="99" y1="65" x2="99" y2="76" stroke="#9A6700" strokeWidth="1" />
      <line x1="102" y1="65" x2="102" y2="76" stroke="#9A6700" strokeWidth="1" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════
   MR. SUCCESS SVG (Redesigned Character)
══════════════════════════════════════════════════════════ */
function MrSuccessSVG({
  wearing,
  isOverDrop = false,
}: {
  wearing: boolean;
  isOverDrop?: boolean;
}) {
  return (
    <svg
      width="200"
      height="260"
      viewBox="0 0 220 280"
      xmlns="http://www.w3.org/2000/svg"
      className="landing-mr-success"
      aria-label="Mr. Success mascot character"
    >
      <defs>
        {/* Skin gradients */}
        <linearGradient id="ms-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FDBA74" />
        </linearGradient>

        {/* Hair gradients */}
        <linearGradient id="ms-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2E3342" />
          <stop offset="100%" stopColor="#161821" />
        </linearGradient>

        {/* Polo shirt & Collar gradients */}
        <linearGradient id="ms-polo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EE1638" />
          <stop offset="100%" stopColor="#B8001F" />
        </linearGradient>
        <linearGradient id="ms-collar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2D313E" />
          <stop offset="100%" stopColor="#14151B" />
        </linearGradient>

        {/* Pants & Shoes */}
        <linearGradient id="ms-pants" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#282B37" />
          <stop offset="100%" stopColor="#14151B" />
        </linearGradient>

        {/* Gold & Accents */}
        <linearGradient id="ms-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>

        {/* Cap gradients */}
        <linearGradient id="ms-cap-top" x1="52" y1="7" x2="168" y2="43" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#353A4D" />
          <stop offset="50%" stopColor="#222533" />
          <stop offset="100%" stopColor="#14151E" />
        </linearGradient>

        {/* Soft glow for anticipation aura */}
        <filter id="ms-aura" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Anticipation Glowing Halo when user hovers cap */}
      {isOverDrop && !wearing && (
        <circle cx="110" cy="55" r="54" fill="#EE1638" opacity="0.22" filter="url(#ms-aura)" />
      )}

      {/* Ground Shadow */}
      <ellipse cx="110" cy="268" rx="60" ry="8" fill="#000000" opacity="0.32" />

      {/* Legs & Joggers */}
      <path
        d="M84 198 L80 248 C80 252 88 253 98 253 L106 253 L110 205 L114 205 L118 253 L126 253 C136 253 144 252 144 248 L140 198 Z"
        fill="url(#ms-pants)"
      />
      <path d="M112 205 L112 226" stroke="#14151B" strokeWidth="2" strokeLinecap="round" />

      {/* Left Sneaker (viewer's left) */}
      <g id="ms-shoe-left">
        <ellipse cx="91" cy="257" rx="17" ry="9" fill="#14151B" />
        <path d="M74 257 Q80 248 95 248 Q108 248 108 258 Q104 266 76 266 Q74 262 74 257 Z" fill="#242733" />
        {/* Red accent curve */}
        <path d="M78 259 Q92 254 105 258" stroke="#EE1638" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* White sole */}
        <path d="M73 260 Q88 261 109 260 C110 264 105 268 89 268 C75 268 72 264 73 260 Z" fill="#FFFFFF" />
        {/* White toe cap */}
        <path d="M73 258 Q77 252 84 254 Q78 263 73 260 Z" fill="#E2E8F0" />
        {/* Laces */}
        <line x1="88" y1="250" x2="94" y2="252" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="89" y1="254" x2="95" y2="256" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* Right Sneaker (viewer's right) */}
      <g id="ms-shoe-right">
        <ellipse cx="131" cy="257" rx="17" ry="9" fill="#14151B" />
        <path d="M114 258 Q114 248 127 248 Q142 248 148 257 Q148 262 146 266 Q118 266 114 258 Z" fill="#242733" />
        {/* Red accent curve */}
        <path d="M117 258 Q130 254 144 259" stroke="#EE1638" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* White sole */}
        <path d="M113 260 Q134 261 149 260 C150 264 147 268 133 268 C117 268 112 264 113 260 Z" fill="#FFFFFF" />
        {/* White toe cap */}
        <path d="M149 258 Q145 252 138 254 Q144 263 149 260 Z" fill="#E2E8F0" />
        {/* Laces */}
        <line x1="128" y1="252" x2="134" y2="250" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="127" y1="256" x2="133" y2="254" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* Torso: Official Swinburne Red Polo Uniform */}
      {/* Red Polo Body */}
      <path
        d="M78 128 C78 120 92 118 110 118 C128 118 142 120 142 128 L144 198 C144 202 132 205 110 205 C88 205 76 202 76 198 Z"
        fill="url(#ms-polo)"
      />
      {/* Bottom Hem Fold */}
      <path d="M76 196 C90 201 130 201 144 196" stroke="#99001A" strokeWidth="2" fill="none" />

      {/* Arms & Hands: Short-Sleeve Polo (Animated based on wearing / isOverDrop state) */}
      {wearing || isOverDrop ? (
        /* Reaching Up / Victory Arms */
        <g id="ms-arms-up">
          {/* Left Short Sleeve & Bare Forearm (Viewer Left) */}
          <path d="M78 128 C68 122 56 112 50 100 C56 96 66 102 72 108 C76 114 78 120 78 124 Z" fill="#D40024" />
          <path d="M52 100 C48 92 44 86 48 82 C53 79 58 84 62 90 C66 98 70 106 72 108 Z" fill="url(#ms-skin)" />
          <circle cx="48" cy="80" r="7" fill="url(#ms-skin)" />
          <circle cx="46" cy="76" r="3.2" fill="url(#ms-skin)" />

          {/* Right Short Sleeve & Bare Forearm (Viewer Right) */}
          <path d="M142 128 C152 122 164 112 170 100 C164 96 154 102 148 108 C144 114 142 120 142 124 Z" fill="#D40024" />
          <path d="M168 100 C172 92 176 86 172 82 C167 79 162 84 158 90 C154 98 150 106 148 108 Z" fill="url(#ms-skin)" />
          <circle cx="172" cy="80" r="7" fill="url(#ms-skin)" />
          <circle cx="174" cy="76" r="3.2" fill="url(#ms-skin)" />
        </g>
      ) : (
        /* Default Warm Welcoming & Thumbs-Up Arms */
        <g id="ms-arms-default">
          {/* Left Arm: Short sleeve + Bare forearm waving */}
          <path d="M78 128 C68 132 56 142 50 156 C52 160 62 163 70 159 C74 153 79 144 80 140 Z" fill="url(#ms-polo)" />
          <path d="M50 156 C55 161 65 161 70 159" stroke="#99001A" strokeWidth="1.8" fill="none" />
          {/* Bare Forearm */}
          <path d="M54 159 C50 168 45 178 48 184 C52 188 58 183 62 176 C65 170 66 161 66 160 Z" fill="url(#ms-skin)" />
          {/* Hand Waving */}
          <path d="M46 179 C40 182 36 188 38 194 C40 199 46 199 50 194 C52 191 54 187 50 181 Z" fill="url(#ms-skin)" />
          <circle cx="41" cy="187" r="3.2" fill="url(#ms-skin)" />

          {/* Right Arm: Short sleeve + Bare forearm thumbs-up */}
          <path d="M142 128 C152 132 164 142 170 156 C168 160 158 163 150 159 C146 153 141 144 140 140 Z" fill="url(#ms-polo)" />
          <path d="M170 156 C165 161 155 161 150 159" stroke="#99001A" strokeWidth="1.8" fill="none" />
          {/* Bare Forearm */}
          <path d="M166 159 C170 168 175 178 172 184 C168 188 162 183 158 176 C155 170 154 161 154 160 Z" fill="url(#ms-skin)" />
          {/* Hand Thumbs-Up */}
          <path d="M172 180 C177 182 181 188 179 194 C177 199 171 199 167 194 C165 191 163 187 167 181 Z" fill="url(#ms-skin)" />
          <path d="M177 184 C180 180 185 179 186 184 C186 188 181 190 177 189 Z" fill="url(#ms-skin)" />
        </g>
      )}

      {/* "CHANGE MAKERS" Badge on Right Sleeve (Wearer's Right / Viewer's Left) */}
      {!wearing && !isOverDrop && (
        <g transform="translate(48, 145) rotate(10)">
          <rect x="0" y="0" width="14" height="11" rx="1.5" fill="#14151B" stroke="#2D313E" strokeWidth="0.5" />
          <text x="1.2" y="4.5" fontSize="2.8" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif" letterSpacing="0.2">CHANGE</text>
          <text x="1.2" y="8.8" fontSize="2.8" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif" letterSpacing="0.2">MAKERS</text>
        </g>
      )}

      {/* Polo Center Placket & Buttons */}
      <rect x="105" y="125" width="10" height="28" rx="1.5" fill="#C00022" stroke="#99001A" strokeWidth="1" />
      <circle cx="110" cy="134" r="2.2" fill="#181A22" stroke="#3D4354" strokeWidth="0.6" />
      <circle cx="110" cy="145" r="2.2" fill="#181A22" stroke="#3D4354" strokeWidth="0.6" />

      {/* Swinburne University Official Chest Logo (Wearer's Left Chest / Viewer's Right) */}
      <g transform="translate(121, 137)">
        <rect x="0" y="0" width="22" height="13" rx="1" fill="#14151B" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        {/* Left Black Box with SWIN BUR NE* */}
        <rect x="0" y="0" width="9.5" height="13" rx="1" fill="#111217" />
        <text x="1" y="3.8" fontSize="3" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif" letterSpacing="-0.1">SWIN</text>
        <text x="1" y="7.5" fontSize="3" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif" letterSpacing="-0.1">BUR</text>
        <text x="1" y="11.2" fontSize="3" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif" letterSpacing="-0.1">NE*</text>
        {/* Right Red Box with University Text Bars */}
        <rect x="9.5" y="0" width="12.5" height="13" rx="1" fill="#EE1638" />
        <line x1="11" y1="3.5" x2="20.5" y2="3.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="11" y1="6.8" x2="19.5" y2="6.8" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
        <line x1="11" y1="10" x2="18.5" y2="10" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Neck */}
      <path d="M101 112 L101 126 C105 130 115 130 119 126 L119 112 Z" fill="url(#ms-skin)" />
      <path d="M101 114 C107 120 113 120 119 114 L119 118 C113 124 107 124 101 118 Z" fill="#EA580C" opacity="0.3" />

      {/* Black Ribbed Polo Collar (Swinburne Uniform Signature) */}
      <path d="M96 116 Q110 112 124 116 L124 121 Q110 118 96 121 Z" fill="#0E1015" />
      <path d="M96 117 L78 126 C76 130 84 136 94 135 L106 126 Z" fill="url(#ms-collar)" stroke="#2D313E" strokeWidth="0.8" />
      <path d="M124 117 L142 126 C144 130 136 136 126 135 L114 126 Z" fill="url(#ms-collar)" stroke="#2D313E" strokeWidth="0.8" />
      <path d="M105 125 L110 131 L115 125 Z" fill="#14151B" />

      {/* Head Base */}
      <path
        d="M74 80 C74 48 90 38 110 38 C130 38 146 48 146 80 C146 106 132 118 110 118 C88 118 74 106 74 80 Z"
        fill="url(#ms-skin)"
      />

      {/* Ears */}
      <g id="ms-ear-left">
        <ellipse cx="73" cy="80" rx="6" ry="9" fill="url(#ms-skin)" />
        <path d="M74 76 C72 78 72 82 74 84" stroke="#F97316" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
      <g id="ms-ear-right">
        <ellipse cx="147" cy="80" rx="6" ry="9" fill="url(#ms-skin)" />
        <path d="M146 76 C148 78 148 82 146 84" stroke="#F97316" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Rosy Cheeks (Blush) */}
      <ellipse cx="86" cy="88" rx="8" ry="4.5" fill="#FB7185" opacity={wearing || isOverDrop ? 0.65 : 0.45} />
      <ellipse cx="134" cy="88" rx="8" ry="4.5" fill="#FB7185" opacity={wearing || isOverDrop ? 0.65 : 0.45} />

      {/* Hair Behind / Volume */}
      <path
        d="M72 72 C68 50 82 28 110 28 C138 28 152 50 148 72 C143 55 135 44 110 44 C88 44 76 56 72 72 Z"
        fill="url(#ms-hair)"
      />
      {/* Front Textured Bangs */}
      <path
        d="M70 66 C73 40 92 26 114 26 C136 26 150 36 150 56 C144 48 135 44 122 45 C106 46 92 56 86 68 C80 60 74 62 70 66 Z"
        fill="url(#ms-hair)"
      />
      <path d="M86 64 C96 52 115 50 128 56 C116 54 100 58 92 70 Z" fill="#475569" opacity="0.5" />

      {/* Chic Round Glasses */}
      <g id="ms-glasses">
        <circle cx="94" cy="79" r="13" fill="none" stroke="#14151B" strokeWidth="2.5" />
        <circle cx="94" cy="79" r="11.5" fill="#FFFFFF" fillOpacity="0.12" />
        <circle cx="126" cy="79" r="13" fill="none" stroke="#14151B" strokeWidth="2.5" />
        <circle cx="126" cy="79" r="11.5" fill="#FFFFFF" fillOpacity="0.12" />
        <path d="M107 77 Q110 74 113 77" stroke="#14151B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <line x1="77" y1="78" x2="81" y2="78" stroke="#14151B" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="139" y1="78" x2="143" y2="78" stroke="#14151B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M87 73 L97 69" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
        <path d="M119 73 L129 69" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Eyes & Eyebrows based on State */}
      {wearing ? (
        /* Celebratory Smiling Arcs (^ _ ^) */
        <g id="ms-eyes-celebrating">
          <path d="M87 78 Q94 71 101 78" stroke="#14151B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M119 78 Q126 71 133 78" stroke="#14151B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M85 60 Q94 56 102 60" stroke="#14151B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M118 60 Q126 56 135 60" stroke="#14151B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      ) : isOverDrop ? (
        /* Looking Up Excitedly */
        <g id="ms-eyes-looking-up">
          <ellipse cx="94" cy="73" rx="5" ry="6" fill="#14151B" />
          <ellipse cx="126" cy="73" rx="5" ry="6" fill="#14151B" />
          <circle cx="93" cy="71" r="2.5" fill="#FFFFFF" />
          <circle cx="125" cy="71" r="2.5" fill="#FFFFFF" />
          <path d="M84 59 Q94 53 103 59" stroke="#14151B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M117 59 Q126 53 136 59" stroke="#14151B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        </g>
      ) : (
        /* Normal Friendly Bright Eyes */
        <g id="ms-eyes-normal">
          <path d="M85 62 Q94 58 102 62" stroke="#14151B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <path d="M118 62 Q126 58 135 62" stroke="#14151B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <ellipse cx="94" cy="79" rx="5" ry="6" fill="#14151B" />
          <ellipse cx="126" cy="79" rx="5" ry="6" fill="#14151B" />
          <circle cx="92.5" cy="76.5" r="2.2" fill="#FFFFFF" />
          <circle cx="96" cy="81" r="1" fill="#FFFFFF" />
          <circle cx="124.5" cy="76.5" r="2.2" fill="#FFFFFF" />
          <circle cx="128" cy="81" r="1" fill="#FFFFFF" />
        </g>
      )}

      {/* Mouth based on State */}
      {wearing ? (
        /* Big Victorous Open Smile */
        <g id="ms-mouth-celebrating">
          <path d="M98 94 Q110 108 122 94 Z" fill="#DC2626" />
          <path d="M100 94 Q110 99 120 94 Z" fill="#FFFFFF" />
        </g>
      ) : isOverDrop ? (
        /* Excited "O" mouth */
        <g id="ms-mouth-excited">
          <ellipse cx="110" cy="98" rx="6" ry="7" fill="#991B1B" />
          <ellipse cx="110" cy="99" rx="4" ry="5" fill="#DC2626" />
        </g>
      ) : (
        /* Confident Friendly Smile */
        <g id="ms-mouth-normal">
          <path d="M102 96 Q110 106 118 96" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M104 96 Q110 104 116 96 Z" fill="#DC2626" />
          <path d="M106 96 Q110 99 114 96 Z" fill="#FFFFFF" />
        </g>
      )}

      {/* GRADUATION CAP & CELEBRATION SPARKLES WHEN WEARING */}
      {wearing && (
        <g id="ms-graduation-cap">
          {/* Floating celebratory sparkle stars */}
          <g fill="#FDE047">
            <path d="M56 36 Q56 46 46 46 Q56 46 56 56 Q56 46 66 46 Q56 46 56 36 Z" />
            <path d="M168 40 Q168 48 160 48 Q168 48 168 56 Q168 48 176 48 Q168 48 168 40 Z" />
            <path d="M110 -2 Q110 4 104 4 Q110 4 110 10 Q110 4 116 4 Q110 4 110 -2 Z" />
          </g>

          {/* Skullcap headband fitting around head */}
          <path d="M86 44 Q110 52 134 44 L136 34 Q110 40 84 34 Z" fill="#181A22" />
          <path d="M86 44 Q110 52 134 44" stroke="#EE1638" strokeWidth="2.2" fill="none" />

          {/* 3D Mortarboard Bevel Edges */}
          <path d="M52 26 L110 44 L110 48 L52 30 Z" fill="#14151C" />
          <path d="M168 26 L110 44 L110 48 L168 30 Z" fill="#1E202B" />

          {/* Top Diamond Surface */}
          <path d="M52 25 L110 7 L168 25 L110 43 Z" fill="url(#ms-cap-top)" stroke="#4A5068" strokeWidth="0.8" />
          <path d="M55 25 L110 9 L165 25 L110 41 Z" fill="#1E212B" opacity="0.4" />

          {/* Center Gold Button */}
          <ellipse cx="110" cy="25" rx="5" ry="3.5" fill="url(#ms-gold)" />
          <circle cx="109" cy="24" r="1.5" fill="#FFFFFF" opacity="0.8" />

          {/* Flowing Gold & Red Tassel */}
          <path
            d="M110 25 Q135 23 148 40 Q152 48 153 62"
            stroke="url(#ms-gold)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="153" cy="62" r="3.2" fill="#CA8A04" />
          <path d="M150 63 L148 77 C151 78 156 78 159 77 L157 63 Z" fill="url(#ms-gold)" />
          <line x1="153" y1="65" x2="153" y2="76" stroke="#9A6700" strokeWidth="1" />
          <line x1="156" y1="65" x2="156" y2="76" stroke="#9A6700" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}
