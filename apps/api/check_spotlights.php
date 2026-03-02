<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== All spotlights ===\n";
$spotlights = DB::select("SELECT id, artist_page_id, title, type, status, show_on_page, archived_at, created_at FROM spotlights ORDER BY created_at DESC LIMIT 10");
if (empty($spotlights)) {
    echo "No spotlights found.\n";
} else {
    foreach ($spotlights as $s) {
        echo "ID={$s->id} page={$s->artist_page_id} title='{$s->title}' type={$s->type} status={$s->status} show={$s->show_on_page} archived={$s->archived_at} created={$s->created_at}\n";
    }
}

echo "\n=== Last 5 log lines with timestamps ===\n";
$logFile = storage_path('logs/laravel.log');
if (file_exists($logFile)) {
    $lines = file($logFile);
    $lastLines = array_slice($lines, -20);
    foreach ($lastLines as $line) {
        if (preg_match('/^\[(\d{4}-\d{2}-\d{2})/', $line, $m)) {
            echo trim($line) . "\n";
        }
    }
}
