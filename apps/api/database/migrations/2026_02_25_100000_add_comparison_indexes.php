<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Composite index for aggregatePhase() queries on click_events
        Schema::table('click_events', function (Blueprint $table) {
            $table->index(['spotlight_id', 'is_preview'], 'idx_ce_spotlight_preview');
        });

        // Composite index for aggregatePhase() unique-visitor queries on page_view_events
        Schema::table('page_view_events', function (Blueprint $table) {
            $table->index(['spotlight_id', 'is_preview', 'user_agent_hash'], 'idx_pve_spotlight_preview_ua');
        });
    }

    public function down(): void
    {
        Schema::table('click_events', function (Blueprint $table) {
            $table->dropIndex('idx_ce_spotlight_preview');
        });

        Schema::table('page_view_events', function (Blueprint $table) {
            $table->dropIndex('idx_pve_spotlight_preview_ua');
        });
    }
};
