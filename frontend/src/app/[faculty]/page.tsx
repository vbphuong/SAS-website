import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UnitCard from "@/components/UnitCard";
import csData from "@/data/computer-science.json";
import businessData from "@/data/business.json";
import mediaData from "@/data/media.json";

const DATA: Record<string, { faculty: string; units: { code: string; name: string; tips: string[] }[] }> = {
  "computer-science": csData,
  business: businessData,
  media: mediaData,
};

const FACULTY_META: Record<string, { label: string; icon: string; desc: string }> = {
  "computer-science": {
    label: "Computer Science",
    icon: "💻",
    desc: "Programming, networks, data structures, algorithms, and software engineering.",
  },
  business: {
    label: "Business",
    icon: "📊",
    desc: "Accounting, management, marketing, economics, finance, and strategy.",
  },
  media: {
    label: "Media",
    icon: "🎬",
    desc: "Journalism, digital content, film, public relations, and advertising.",
  },
};

function getUnits(faculty: string) {
  return DATA[faculty] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: { faculty: string };
}): Promise<Metadata> {
  const { faculty } = params;
  const meta = FACULTY_META[faculty];
  if (!meta) return { title: "Not Found" };
  return { title: meta.label };
}

export async function generateStaticParams() {
  return Object.keys(FACULTY_META).map((faculty) => ({ faculty }));
}

export default function FacultyPage({
  params,
}: {
  params: { faculty: string };
}) {
  const { faculty } = params;
  const meta = FACULTY_META[faculty];
  if (!meta) notFound();

  const data = getUnits(faculty);
  const units: { code: string; name: string; tips: string[] }[] = data?.units ?? [];

  return (
    <main>
      {/* Dark hero — same style as homepage */}
      <section className="hero-banner">
        <div className="hero-inner" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <p className="hero-eyebrow">Student Academic Success</p>
            <h1 className="hero-headline">
              {meta.icon} {meta.label}
            </h1>
            <p className="hero-sub">{meta.desc}</p>
          </div>
        </div>
      </section>

      {/* Unit cards */}
      <section className="view-section" style={{ paddingTop: "48px" }}>
        {units.length === 0 ? (
          <p style={{ color: "var(--c-text-secondary)" }}>
            No units available for this faculty.
          </p>
        ) : (
          <div className="units-grid">
            {units.map((unit, i) => (
              <UnitCard key={unit.code} unit={unit} index={i} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
