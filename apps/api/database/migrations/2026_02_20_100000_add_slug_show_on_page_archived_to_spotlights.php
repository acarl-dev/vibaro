<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('spotlights', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('title');
            $table->boolean('show_on_page')->default(true)->after('description');
            $table->timestamp('archived_at')->nullable()->after('show_on_page');
            
            $table->unique('slug');
        });

        // Generate slugs for existing spotlights
        $spotlights = DB::table('spotlights')->whereNull('slug')->get();
        foreach ($spotlights as $spotlight) {
            do {
                $slug = Str::slug($spotlight->title) . '-' . Str::random(4);
            } while (DB::table('spotlights')->where('slug', $slug)->exists());
            
            DB::table('spotlights')->where('id', $spotlight->id)->update(['slug' => $slug]);
        }

        // Make slug non-nullable after backfilling
        Schema::table('spotlights', function (Blueprint $table) {
            $table->string('slug')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('spotlights', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn(['slug', 'show_on_page', 'archived_at']);
        });
    }
};
