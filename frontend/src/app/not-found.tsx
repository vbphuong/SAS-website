import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="view-section">
        <p className="eyebrow">404</p>
        <h1 className="section-headline">Page not found</h1>
        <p className="section-lead">The page you are looking for does not exist.</p>
        <Link href="/" className="unit-book-link" style={{ marginTop: "8px" }}>← Back to home</Link>
      </section>
    </main>
  );
}
