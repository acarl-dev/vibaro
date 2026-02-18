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
        Schema::create('tracking_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained()->cascadeOnDelete();
            $table->foreignId('spotlight_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('campaign_id')->nullable(); // For Stage Pro (future)
            $table->string('module'); // e.g. 'shows', 'releases', 'links', 'spotlight'
            $table->string('label')->nullable();
            $table->string('target_url');
            $table->string('slug')->unique(); // Public identifier
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_content')->nullable();
            $table->string('utm_term')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('artist_page_id');
            $table->index('spotlight_id');
            $table->index('slug');
            $table->index(['artist_page_id', 'module']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_links');
    }
};
