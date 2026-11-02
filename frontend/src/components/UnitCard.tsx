import Link from "next/link";

interface Unit {
  code: string;
  name: string;
  tips: string[];
}

export default function UnitCard({ unit, index }: { unit: Unit; index: number }) {
  return (
    <div className="unit-card" style={{ "--i": index } as React.CSSProperties}>
      <span className="unit-code">{unit.code}</span>
      <h3 className="unit-name">{unit.name}</h3>
      <ul className="unit-tips">
        {unit.tips.map((tip, i) => (
          <li key={i} className="unit-tip">{tip}</li>
        ))}
      </ul>
      <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdj7tAIRpOakIeZEFTqETQWEAN5w0_nU39I3jyXA2n4WajrVw/viewform" className="unit-book-link">
         Book a session →
      </Link>
    </div>
  );
}
