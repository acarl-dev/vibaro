"use client";

export function PreviewBanner({ isPublished }: { isPublished?: boolean }) {
  if (isPublished !== false) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/95 backdrop-blur-sm border-b border-amber-600">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-3 text-sm">
          <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="font-medium text-amber-900">
            Vorschau-Modus
          </span>
          <span className="text-amber-800 hidden sm:inline">
            • Diese Seite ist noch nicht veröffentlicht und nur für dich sichtbar
          </span>
        </div>
      </div>
    </div>
  );
}
