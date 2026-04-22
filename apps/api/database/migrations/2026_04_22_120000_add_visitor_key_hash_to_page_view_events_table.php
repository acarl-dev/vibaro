<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('page_view_events', function (Blueprint $table) {
            $table->string('visitor_key_hash', 64)
                ->nullable()
                ->after('user_agent_hash');

            $table->index(
                ['artist_page_id', 'visitor_key_hash', 'occurred_at'],
                'idx_pve_page_visitor_key_day'
            );

            $table->index(
                ['spotlight_id', 'is_preview', 'visitor_key_hash'],
                'idx_pve_spotlight_preview_vk'
            );
        });
    }

    public function down(): void
    {
        Schema::table('page_view_events', function (Blueprint $table) {
            $table->dropIndex('idx_pve_page_visitor_key_day');
            $table->dropIndex('idx_pve_spotlight_preview_vk');
            $table->dropColumn('visitor_key_hash');
        });
    }
};
