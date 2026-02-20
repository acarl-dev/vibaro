<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;

echo "=== SPOTLIGHTS TABLE ===\n";
$spotlightCols = Schema::getColumnListing('spotlights');
foreach ($spotlightCols as $col) {
    echo "- $col\n";
}

echo "\n=== TRACKING_LINKS TABLE ===\n";
$trackingCols = Schema::getColumnListing('tracking_links');
foreach ($trackingCols as $col) {
    echo "- $col\n";
}
