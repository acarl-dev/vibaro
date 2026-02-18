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
        Schema::create('click_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracking_link_id')->constrained()->cascadeOnDelete();
            $table->foreignId('artist_page_id')->constrained()->cascadeOnDelete();
            $table->foreignId('spotlight_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('campaign_id')->nullable(); // For Stage Pro (future)
            $table->string('module'); // Denormalized for faster aggregation
            $table->string('referrer_host')->nullable();
            $table->string('country_code', 2)->nullable(); // Derived transiently from IP, never store IP
            $table->string('user_agent_hash')->nullable(); // Abuse prevention only
            $table->dateTime('occurred_at');
            $table->timestamps();

            // Indices for analytics queries
            $table->index('tracking_link_id');
            $table->index('artist_page_id');
            $table->index('spotlight_id');
            $table->index(['artist_page_id', 'occurred_at']);
            $table->index(['spotlight_id', 'occurred_at']);
            $table->index(['artist_page_id', 'module', 'occurred_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('click_events');
    }
};
