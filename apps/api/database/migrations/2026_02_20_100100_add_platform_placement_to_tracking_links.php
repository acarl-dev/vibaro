<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('tracking_links', function (Blueprint $table) {
            // Add new fields
            $table->string('platform')->nullable()->after('spotlight_id');
            $table->string('placement')->nullable()->after('platform');
            $table->string('short_code')->nullable()->after('slug');
            $table->unsignedBigInteger('click_count')->default(0)->after('utm_term');
            $table->timestamp('archived_at')->nullable()->after('click_count');
            
            // Add index for short_code
            $table->index('short_code');
        });

        // Migrate existing data: copy slug to short_code
        DB::table('tracking_links')->whereNull('short_code')->update([
            'short_code' => DB::raw('slug')
        ]);

        // Make short_code unique and non-nullable
        Schema::table('tracking_links', function (Blueprint $table) {
            $table->string('short_code')->nullable(false)->change();
            $table->dropIndex(['slug']);
            $table->unique('short_code');
        });

        // Create partial unique index for (spotlight_id, platform, placement)
        // where archived_at IS NULL
        DB::statement('
            CREATE UNIQUE INDEX tracking_links_unique_platform_placement 
            ON tracking_links (spotlight_id, platform, placement) 
            WHERE archived_at IS NULL AND platform IS NOT NULL AND placement IS NOT NULL
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP INDEX IF EXISTS tracking_links_unique_platform_placement');
        
        Schema::table('tracking_links', function (Blueprint $table) {
            $table->dropUnique(['short_code']);
            $table->dropIndex(['short_code']);
            $table->dropColumn(['platform', 'placement', 'short_code', 'click_count', 'archived_at']);
            
            $table->index('slug');
        });
    }
};
