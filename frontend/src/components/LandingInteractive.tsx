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
              cursor:      isDragging ? "grabbing" : "grab",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <span style={{ fontSize: 64, lineHeight: 1, display: "block" }}>🎓</span>
          </div>

          {/* Mr. Success + drop zone */}
          <div className="landing-character">
            <div
              ref={dropZoneRef}
              className={`landing-dropzone${isOverDrop ? " active" : ""}`}
            />
            <MrSuccessSVG wearing={step === "celebrating"} />
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
   MR. SUCCESS SVG
══════════════════════════════════════════════════════════ */
function MrSuccessSVG({ wearing }: { wearing: boolean }) {
  return (
    <svg
      width="130" height="200" viewBox="0 0 130 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mr. Success character"
    >
      {wearing && (
        <g>
          <rect x="30" y="18" width="70" height="10" rx="2" fill="#111217" />
          <rect x="40"  y="6" width="50" height="14" rx="3" fill="#111217" />
          <line x1="100" y1="13" x2="114" y2="28"
            stroke="#E2012D" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="114" cy="31" r="5" fill="#E2012D" />
        </g>
      )}
      <circle cx="65" cy="52" r="26" fill="#FFDAB9" />
      <circle cx="56" cy="47" r="4"   fill="#2d2d2d" />
      <circle cx="74" cy="47" r="4"   fill="#2d2d2d" />
      <circle cx="57.5" cy="45.5" r="1.5" fill="white" />
      <circle cx="75.5" cy="45.5" r="1.5" fill="white" />
      <path d="M51 41 Q56 38 61 41" stroke="#c97c5d" strokeWidth="2"
        fill="none" strokeLinecap="round" />
      <path d="M69 41 Q74 38 79 41" stroke="#c97c5d" strokeWidth="2"
        fill="none" strokeLinecap="round" />
      <path d="M54 59 Q65 70 76 59" stroke="#c97c5d" strokeWidth="2.5"
        fill="none" strokeLinecap="round" />
      <rect x="58" y="76" width="14" height="12" rx="3" fill="#FFDAB9" />
      <rect x="37" y="86" width="56" height="56" rx="8" fill="#E2012D" />
      <path d="M55 86 L65 100 L75 86" stroke="white" strokeWidth="2"
        fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="37" y1="96" x2="12" y2="68"
        stroke="#FFDAB9" strokeWidth="14" strokeLinecap="round" />
      <line x1="93" y1="96" x2="118" y2="68"
        stroke="#FFDAB9" strokeWidth="14" strokeLinecap="round" />
      <circle cx="11"  cy="66" r="7.5" fill="#FFDAB9" />
      <circle cx="119" cy="66" r="7.5" fill="#FFDAB9" />
      <rect x="37" y="138" width="56" height="8" rx="2" fill="#0d0e12" />
      <rect x="39"  y="144" width="22" height="40" rx="8" fill="#1a1c22" />
      <rect x="69"  y="144" width="22" height="40" rx="8" fill="#1a1c22" />
      <ellipse cx="50" cy="186" rx="18" ry="9" fill="#0d0e12" />
      <ellipse cx="80" cy="186" rx="18" ry="9" fill="#0d0e12" />
    </svg>
  );
}
