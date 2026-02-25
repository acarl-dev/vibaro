<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_view_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained('artist_pages')->cascadeOnDelete();
            $table->foreignId('spotlight_id')->nullable()->constrained('spotlights')->nullOnDelete();
            $table->string('referrer_host', 255)->nullable();
            $table->char('country_code', 2)->nullable();
            $table->string('user_agent_hash', 64)->nullable();
            $table->boolean('is_preview')->default(false);
            $table->timestamp('occurred_at')->useCurrent();
            $table->timestamps();

            // Fast analytics queries
            $table->index(['artist_page_id', 'occurred_at'], 'idx_pve_page_occurred');
            $table->index(['spotlight_id', 'occurred_at'], 'idx_pve_spotlight_occurred');
            $table->index(['artist_page_id', 'user_agent_hash', 'occurred_at'], 'idx_pve_unique_day');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_view_events');
    }
};
