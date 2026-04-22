<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            DB::statement(
                "UPDATE spotlights
                SET status = 'ended',
                    ends_at = COALESCE(ends_at, archived_at),
                    show_on_page = false,
                    updated_at = NOW()
                WHERE status = 'active'
                  AND archived_at IS NOT NULL"
            );

            DB::statement('DROP INDEX IF EXISTS spotlights_one_active_per_artist');
            DB::statement('DROP INDEX IF EXISTS idx_spotlights_one_active_per_page');
            DB::statement("CREATE UNIQUE INDEX idx_spotlights_one_active_per_page ON spotlights (artist_page_id) WHERE status = 'active' AND archived_at IS NULL");
        });
    }

    public function down(): void
    {
        DB::transaction(function (): void {
            DB::statement('DROP INDEX IF EXISTS idx_spotlights_one_active_per_page');
            DB::statement("CREATE UNIQUE INDEX spotlights_one_active_per_artist ON spotlights (artist_page_id) WHERE status = 'active'");
        });
    }
};