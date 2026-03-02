<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Simulate what the SpotlightController::index does for user with artist_page_id=12
$spotlights = \App\Models\Spotlight::where('artist_page_id', 12)
    ->whereNull('archived_at')
    ->orderByDesc('created_at')
    ->get();

echo "=== Non-archived spotlights for page 12 ===\n";
echo "Count: " . $spotlights->count() . "\n\n";
foreach ($spotlights as $s) {
    echo "ID={$s->id} title='{$s->title}' type={$s->type} status={$s->status} show={$s->show_on_page} subtitle=" . ($s->subtitle ?? 'NULL') . " meta=" . json_encode($s->meta) . "\n";
}

// Also check: what does the public page controller query return?
echo "\n=== Active spotlight for public page ===\n";
$page = \App\Models\ArtistPage::find(12);
$active = $page->spotlights()
    ->where('status', 'active')
    ->where('show_on_page', true)
    ->first();

if ($active) {
    echo "ID={$active->id} title='{$active->title}'\n";
} else {
    echo "NONE - no active spotlight with show_on_page=true\n";
}
