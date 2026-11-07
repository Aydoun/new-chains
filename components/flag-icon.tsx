import type { LocaleOption } from "@/lib/i18n";

type FlagIconProps = {
  country: LocaleOption["country"];
  className?: string;
};

// Inline SVG flags: emoji flags don't render on Windows, where they show up
// as plain letter pairs.
export function FlagIcon({ country, className }: FlagIconProps) {
  return (
    <svg
      viewBox="0 0 30 20"
      className={className ?? "h-3.5 w-5 shrink-0 rounded-[2px] shadow-sm"}
      aria-hidden="true"
      focusable="false"
    >
      {flags[country]}
    </svg>
  );
}

const flags: Record<LocaleOption["country"], React.ReactNode> = {
  gb: (
    // No clipPath (its id would repeat for every flag on the page); the
    // root <svg> already clips strokes that overflow the viewBox.
    <>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0l30 20m0-20L0 20" stroke="#fff" strokeWidth="4" />
      <path d="M0 0l30 20m0-20L0 20" stroke="#C8102E" strokeWidth="1.5" />
      <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6.6" />
      <path d="M15 0v20M0 10h30" stroke="#C8102E" strokeWidth="4" />
    </>
  ),
  fr: (
    <>
      <rect width="10" height="20" fill="#002654" />
      <rect x="10" width="10" height="20" fill="#fff" />
      <rect x="20" width="10" height="20" fill="#CE1126" />
    </>
  ),
  nl: (
    <>
      <rect width="30" height="6.67" fill="#AE1C28" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <rect y="13.33" width="30" height="6.67" fill="#21468B" />
    </>
  ),
  cn: (
    <>
      <rect width="30" height="20" fill="#EE1C25" />
      <g fill="#FFFF00">
        <Star cx={5} cy={5} r={3} rotate={0} />
        <Star cx={10} cy={2} r={1} rotate={23} />
        <Star cx={12} cy={4} r={1} rotate={45} />
        <Star cx={12} cy={7} r={1} rotate={70} />
        <Star cx={10} cy={9} r={1} rotate={21} />
      </g>
    </>
  ),
};

function Star({
  cx,
  cy,
  r,
  rotate,
}: {
  cx: number;
  cy: number;
  r: number;
  rotate: number;
}) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const radius = i % 2 === 0 ? r : r * 0.382;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    return `${(cx + radius * Math.cos(angle)).toFixed(3)},${(
      cy +
      radius * Math.sin(angle)
    ).toFixed(3)}`;
  }).join(" ");

  return (
    <polygon points={points} transform={`rotate(${rotate} ${cx} ${cy})`} />
  );
}
