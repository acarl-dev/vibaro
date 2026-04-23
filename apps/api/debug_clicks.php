<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$rows = \Illuminate\Support\Facades\DB::select("
    SELECT
        ce.tracking_link_id,
        tl.short_code,
        tl.platform,
        tl.placement,
        COUNT(*) as total,
        SUM(CASE WHEN ce.is_preview = false THEN 1 ELSE 0 END) as real_clicks,
        SUM(CASE WHEN ce.is_preview = true  THEN 1 ELSE 0 END) as previews,
        MAX(ce.occurred_at) as last_click
    FROM click_events ce
    JOIN tracking_links tl ON ce.tracking_link_id = tl.id
    GROUP BY ce.tracking_link_id, tl.short_code, tl.platform, tl.placement
    ORDER BY total DESC
    LIMIT 20
");

echo json_encode($rows, JSON_PRETTY_PRINT);

// Also check for near-duplicate events (same tracking_link_id within 5 seconds)
$dupes = \Illuminate\Support\Facades\DB::select("
    SELECT
        a.tracking_link_id,
        a.occurred_at as t1,
        b.occurred_at as t2,
        a.user_agent_hash,
        b.user_agent_hash as ua2,
        a.is_preview as p1,
        b.is_preview as p2
    FROM click_events a
    JOIN click_events b
        ON a.tracking_link_id = b.tracking_link_id
        AND a.id < b.id
        AND ABS(EXTRACT(EPOCH FROM (b.occurred_at - a.occurred_at))) < 10
    ORDER BY a.occurred_at DESC
    LIMIT 20
");

echo "\n\n--- Near-duplicate pairs (within 10s) ---\n";
echo json_encode($dupes, JSON_PRETTY_PRINT);
