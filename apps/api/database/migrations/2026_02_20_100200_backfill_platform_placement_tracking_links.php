<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Backfill platform and placement from existing utm_source and utm_medium values.
     */
    public function up(): void
    {
        // Backfill platform from utm_source
        DB::table('tracking_links')
            ->whereNull('platform')
            ->whereNotNull('utm_source')
            ->update([
                'platform' => DB::raw('utm_source')
            ]);

        // Backfill placement from utm_medium
        DB::table('tracking_links')
            ->whereNull('placement')
            ->whereNotNull('utm_medium')
            ->update([
                'placement' => DB::raw('utm_medium')
            ]);

        // Generate labels for links that don't have one
        $links = DB::table('tracking_links')
            ->whereNull('label')
            ->orWhere('label', '')
            ->get(['id', 'platform', 'placement']);

        foreach ($links as $link) {
            $parts = array_filter([
                $link->platform ? ucfirst($link->platform) : null,
                $link->placement ? ucfirst($link->placement) : null,
            ]);

            $label = implode(' · ', $parts) ?: 'Link';

            DB::table('tracking_links')
                ->where('id', $link->id)
                ->update(['label' => $label]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No rollback needed - backfill is non-destructive
    }
};
