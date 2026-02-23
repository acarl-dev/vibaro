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
        Schema::table('spotlights', function (Blueprint $table) {
            // Auto-fetched metadata from oEmbed (Spotify, YouTube, SoundCloud, etc.)
            $table->string('cover_image_url', 1000)->nullable()->after('primary_url');
            $table->string('artist_name', 255)->nullable()->after('cover_image_url');
            $table->string('platform_name', 100)->nullable()->after('artist_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spotlights', function (Blueprint $table) {
            $table->dropColumn(['cover_image_url', 'artist_name', 'platform_name']);
        });
    }
};
