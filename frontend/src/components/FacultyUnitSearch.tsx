"use client";

import { useState, useMemo } from "react";
import UnitCard from "@/components/UnitCard";

interface Unit {
  code: string;
  name: string;
  tips: string[];
}

interface FacultyUnitSearchProps {
  units: Unit[];
  facultyLabel: string;
}

export default function FacultyUnitSearch({ units, facultyLabel }: FacultyUnitSearchProps) {
  const [query, setQuery] = useState("");

  const filteredUnits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return units;

    // Remove whitespace to support queries like "cos 10009" vs "cos10009"
    const qCompact = q.replace(/\s+/g, "");

    return units.filter((unit) => {
      const code = unit.code.toLowerCase();
      const codeCompact = code.replace(/\s+/g, "");
      const name = unit.name.toLowerCase();

      return (
        code.includes(q) ||
        codeCompact.includes(qCompact) ||
        name.includes(q)
      );
    });
  }, [units, query]);

  return (
    <div className="unit-search-section">
      {/* Search Input Bar */}
      <div className="unit-search-wrap">
        <div className="unit-search-bar">
          <span className="unit-search-icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>

          <input
            type="text"
            className="unit-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${facultyLabel} by code or name (e.g. ${units[0]?.code ?? "code"})...`}
            aria-label={`Search ${facultyLabel} units`}
          />

          {query && (
            <button
              type="button"
              className="unit-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear search query"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results Metadata */}
        <div className="unit-search-meta">
          <span className="unit-search-count">
            {query ? (
              <>
                Found <strong>{filteredUnits.length}</strong> of {units.length} units
              </>
            ) : (
              <>
                Showing all <strong>{units.length}</strong> units
              </>
            )}
          </span>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredUnits.length === 0 ? (
        <div className="unit-empty-state">
          <div className="unit-empty-icon">🔍</div>
          <h3 className="unit-empty-title">No matching units found</h3>
          <p className="unit-empty-desc">
            We couldn&apos;t find any unit matching &ldquo;<strong>{query}</strong>&rdquo;. Try searching by unit code (e.g. {units[0]?.code}) or keywords in the unit title.
          </p>
          <button
            type="button"
            className="unit-empty-btn"
            onClick={() => setQuery("")}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="units-grid">
          {filteredUnits.map((unit, i) => (
            <UnitCard key={unit.code} unit={unit} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
