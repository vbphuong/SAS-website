import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: { absolute: "SAS — Student Academic Success" },
};

const faculties = [
  {
    slug: "computer-science",
    label: "Computer Science",
    icon: "💻",
    desc: "Programming, networks, data structures, and software engineering tips.",
  },
  {
    slug: "business",
    label: "Business",
    icon: "📊",
    desc: "Accounting, management, marketing, economics, and strategic finance tips.",
  },
  {
    slug: "media",
    label: "Media",
    icon: "🎬",
    desc: "Journalism, digital content, film studies, PR, and advertising tips.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
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
            <Image src="/QR_book.png" alt="Scan to book a session" width={180} height={180} priority />
            <p className="hero-qr-label">Scan to book</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="view-section">
        <p className="eyebrow">Explore by Faculty</p>
        <h2 className="section-headline">What can we help you with?</h2>
        <p className="section-lead">
          Browse tips for your units across three faculties. Each card shows you
          practical strategies to succeed — and links you back to book a session.
        </p>

        <div className="info-grid">
          {faculties.map((f) => (
            <div key={f.slug} className="info-card">
              <div className="info-card-icon">{f.icon}</div>
              <h3 className="info-card-title">{f.label}</h3>
              <p className="info-card-body">{f.desc}</p>
              <Link href={`/${f.slug}`} className="info-card-link">
                View units →
              </Link>
            </div>
          ))}
        </div>

        {/* How it works */}
        <p className="eyebrow" style={{ marginTop: "64px" }}>How it works</p>
        <h2 className="section-headline" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>
          Three steps to succeed
        </h2>
        <div className="info-grid">
          {[
            { n: "01", title: "Find your unit", body: "Browse your faculty page and locate your unit code." },
            { n: "02", title: "Read the tips", body: "Each unit card has practical, actionable study strategies." },
            { n: "03", title: "Book a session", body: "Scan the QR code or click the link on any unit card to book." },
          ].map((step) => (
            <div key={step.n} className="info-card">
              <span className="unit-code" style={{ fontSize: "1rem" }}>{step.n}</span>
              <h3 className="info-card-title">{step.title}</h3>
              <p className="info-card-body">{step.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
