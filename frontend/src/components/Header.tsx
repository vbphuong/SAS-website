"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/computer-science", label: "CS" },
  { href: "/business", label: "Business" },
  { href: "/media", label: "Media" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="top-nav">
      <div className="nav-container">
        <div className="brand-wrap">
          <Image
            src="/signature_logo.png"
            alt="Logo"
            width={32}
            height={32}
            style={{ height: "32px", width: "auto", objectFit: "contain" }}
          />
          <span className="brand-title">SAS</span>
          <Image
            src="/swinburne.webp"
            alt="Swinburne"
            className="brand-logo"
            width={120}
            height={30}
            style={{ height: "30px", width: "auto" }}
          />
        </div>
        <nav>
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
      </div>
    </header>
  );
}
