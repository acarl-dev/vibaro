// Studio navigation icons  inline SVGs (no external dependency)
// Based on Lucide icon style: 24x24 viewBox, stroke="currentColor", strokeWidth=2

interface IconProps { size?: number; className?: string; }
const def = (size = 18, cls = "") => ({
  width: size, height: size, viewBox: "0 0 24 24",
  fill: "none", stroke: "currentColor", strokeWidth: "2",
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  className: cls,
});

export function LayoutGrid({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
}

export function FilePen({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><path d="M12 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7"/><path d="M14 2l4 4"/><path d="M18 6l-9 9-4 1 1-4 9-9"/></svg>;
}

export function Zap({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}

export function Megaphone({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><path d="M3 11l18-5v12L3 13"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
}

export function TrendingUp({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}

export function Settings({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
}

export function ExternalLink({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
}

// Module icons
export function Mic({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
}

export function Disc({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
}

export function ShoppingBag({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
}

export function BarChart2({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}

export function Headphones({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
}

export function ChevronRight({ size = 18, className = "" }: IconProps) {
  return <svg {...def(size, className)}><polyline points="9 18 15 12 9 6"/></svg>;
}
