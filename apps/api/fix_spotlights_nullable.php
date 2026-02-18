<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    DB::statement('ALTER TABLE spotlights ALTER COLUMN starts_at DROP NOT NULL');
    echo "✓ starts_at is now nullable\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
