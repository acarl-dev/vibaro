<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $duplicateUser = DB::table('artist_pages')
            ->select('user_id', DB::raw('COUNT(*) as total'))
            ->groupBy('user_id')
            ->havingRaw('COUNT(*) > 1')
            ->first();

        if ($duplicateUser !== null) {
            throw new \RuntimeException(
                'Cannot add unique index artist_pages.user_id: duplicate rows exist. '
                . 'Resolve duplicates first, e.g. keep one row per user_id and remove others.'
            );
        }

        Schema::table('artist_pages', function (Blueprint $table) {
            $table->unique('user_id', 'artist_pages_user_id_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('artist_pages', function (Blueprint $table) {
            $table->dropUnique('artist_pages_user_id_unique');
        });
    }
};
