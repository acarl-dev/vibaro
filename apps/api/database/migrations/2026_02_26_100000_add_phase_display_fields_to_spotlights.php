<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add phase display fields for the public PhaseHero component.
     * These fields control how a spotlight (phase) is visually presented on the band website.
     */
    public function up(): void
    {
        Schema::table('spotlights', function (Blueprint $table) {
            $table->string('subtitle', 500)->nullable()->after('description');
            $table->string('cta_label', 100)->nullable()->after('subtitle');
            $table->string('secondary_cta_url', 1000)->nullable()->after('cta_label');
            $table->string('secondary_cta_label', 100)->nullable()->after('secondary_cta_url');
            $table->string('background_image_url', 1000)->nullable()->after('secondary_cta_label');
            $table->jsonb('meta')->nullable()->after('background_image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spotlights', function (Blueprint $table) {
            $table->dropColumn([
                'subtitle',
                'cta_label',
                'secondary_cta_url',
                'secondary_cta_label',
                'background_image_url',
                'meta',
            ]);
        });
    }
};
