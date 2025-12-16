export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Seite nicht gefunden</h1>
        <p className="text-sm text-zinc-500">
          Diese Seite existiert nicht oder ist momentan nicht verfügbar.
        </p>
      </div>
    </div>
  );
}
