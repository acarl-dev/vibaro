<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$page = App\Models\ArtistPage::where('handle', 'bandname-test1')->first();
if ($page) {
    echo "theme_key: " . ($page->theme_key ?? 'NULL') . "\n";
    echo "theme_variant: " . ($page->theme_variant ?? 'NULL') . "\n";
} else {
    echo "Page not found\n";
}
