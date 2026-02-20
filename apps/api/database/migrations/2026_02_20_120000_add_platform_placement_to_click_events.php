<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('click_events', function (Blueprint $table) {
            // Add platform and placement for V2 analytics
            $table->string('platform')->after('module')->nullable();
            $table->string('placement')->after('platform')->nullable();
            
            // Add indices for V2 analytics queries
            $table->index(['artist_page_id', 'platform', 'occurred_at'], 'idx_click_events_platform_analytics');
            $table->index(['spotlight_id', 'platform', 'placement'], 'idx_click_events_spotlight_platform');
        });
        
        // Backfill platform/placement from tracking_links for existing records (PostgreSQL syntax)
        DB::statement('
            UPDATE click_events ce
            SET platform = tl.platform, placement = tl.placement
            FROM tracking_links tl
            WHERE ce.tracking_link_id = tl.id
            AND ce.platform IS NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('click_events', function (Blueprint $table) {
            $table->dropIndex('idx_click_events_platform_analytics');
            $table->dropIndex('idx_click_events_spotlight_platform');
            $table->dropColumn(['platform', 'placement']);
        });
    }
};
