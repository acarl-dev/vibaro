"use client";

import StudioButton from "../../components/StudioButton";

export type ReleaseFormData = {
  title: string;
  release_date: string;
  url: string;
  is_featured: boolean;
};

type ReleaseFormProps = {
  formData: ReleaseFormData;
  onChange: (data: ReleaseFormData) => void;
  coverPreview: string | null;
  onCoverSelect: (file: File) => void;
  onCoverClear: () => void;
  /** Existing stored cover (edit mode only) */
  existingCoverSrc?: string | null;
  onExistingCoverDelete?: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel?: string;
};

export default function ReleaseForm({
  formData,
  onChange,
  coverPreview,
  onCoverSelect,
  onCoverClear,
  existingCoverSrc,
  onExistingCoverDelete,
  onSubmit,
  onCancel,
  submitLabel = "Erstellen",
}: ReleaseFormProps) {
  const set = (patch: Partial<ReleaseFormData>) => onChange({ ...formData, ...patch });

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      <input
        type="text"
        placeholder="Titel (z.B. 'Mein neues Album')"
        value={formData.title}
        onChange={(e) => set({ title: e.target.value })}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
      />
      <input
        type="date"
        value={formData.release_date}
        onChange={(e) => set({ release_date: e.target.value })}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 cursor-pointer"
        style={{ colorScheme: "dark" }}
      />
      <input
        type="url"
        placeholder="Link (Spotify, Apple Music, etc.)"
        value={formData.url}
        onChange={(e) => set({ url: e.target.value })}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
      />
      <div className="space-y-1">
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => set({ is_featured: e.target.checked })}
            className="rounded border-zinc-700 bg-zinc-950 text-zinc-100"
          />
          Als "New Release" hervorheben
        </label>
        <p className="text-[10px] text-zinc-600 ml-5">
          Wird prominent ganz oben auf deiner K\u00fcnstlerseite angezeigt
        </p>
      </div>

      {/* Cover */}
      <div className="space-y-2">
        <label className="text-xs text-zinc-400">Cover (optional)</label>

        {coverPreview ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-800">
            <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onCoverClear}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-sm flex items-center justify-center"
            >
              \u2715
            </button>
          </div>
        ) : existingCoverSrc ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-zinc-800">
            <img src={existingCoverSrc} alt="Current cover" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onExistingCoverDelete}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-red-400 text-sm flex items-center justify-center"
            >
              \u2715
            </button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onCoverSelect(file);
                e.target.value = "";
              }}
              className="hidden"
              id="release-cover-input"
            />
            <label
              htmlFor="release-cover-input"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 cursor-pointer transition-colors"
            >
              \u{1F3A8} Cover hinzuf\u00fcgen
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <StudioButton variant="primary" size="sm" onClick={onSubmit}>
          {submitLabel}
        </StudioButton>
        <StudioButton variant="secondary" size="sm" onClick={onCancel}>
          Abbrechen
        </StudioButton>
      </div>
    </div>
  );
}
