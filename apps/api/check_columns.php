<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$cols = DB::select("SELECT column_name FROM information_schema.columns WHERE table_name='spotlights' ORDER BY ordinal_position");
echo "=== Spotlights columns ===\n";
foreach ($cols as $c) {
    echo $c->column_name . "\n";
}

echo "\n=== Migration check ===\n";
$m = DB::select("SELECT * FROM migrations WHERE migration LIKE '%phase%'");
foreach ($m as $row) {
    echo $row->migration . " (batch " . $row->batch . ")\n";
}

echo "\n=== DB name ===\n";
echo DB::connection()->getDatabaseName() . "\n";
