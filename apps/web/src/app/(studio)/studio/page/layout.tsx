import { ReactNode } from "react";

// Sub-navigation is handled globally in (studio)/layout.tsx via StudioPageSubNav,
// which auto-shows when the pathname matches the page section.
export default function PageSectionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

