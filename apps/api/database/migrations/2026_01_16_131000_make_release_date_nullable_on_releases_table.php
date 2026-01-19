<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('releases')) {
            return;
        }

        DB::statement('ALTER TABLE releases ALTER COLUMN release_date DROP NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('releases')) {
            return;
        }

        DB::statement('ALTER TABLE releases ALTER COLUMN release_date SET NOT NULL');
    }
};
