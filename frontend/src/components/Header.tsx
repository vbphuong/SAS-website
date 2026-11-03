"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/computer-science", label: "CS" },
  { href: "/business", label: "Business" },
  { href: "/media", label: "Media" },
  { href: "/design", label: "Design" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="top-nav">
        <div className="nav-container">
          {/* Brand Logos */}
          <Link href="/" className="brand-wrap" aria-label="Swinburne Academic Success Home">
            <Image
              src="/signature_logo.png"
              alt="Swinburne Academic Success"
              className="brand-logo-sas"
              width={1678}
              height={637}
              priority
              unoptimized
            />
            <span className="brand-divider" aria-hidden="true" />
            <Image
              src="/swinburne.webp"
              alt="Swinburne University of Technology"
              className="brand-logo-swinburne"
              width={876}
              height={640}
              priority
              unoptimized
            />
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav">
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`nav-link${pathname === item.href ? " active" : ""}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hamburger button (mobile only) */}
          <button
            className="hamburger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div className="drawer-overlay" onClick={() => setOpen(false)} />
      )}

      {/* Drawer */}
      <div className={`drawer${open ? " drawer--open" : ""}`}>
        <button
          className="drawer-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        <nav>
          <ul className="drawer-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`drawer-link${pathname === item.href ? " active" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
