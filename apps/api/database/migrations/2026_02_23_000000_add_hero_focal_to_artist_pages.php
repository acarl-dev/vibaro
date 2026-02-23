<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artist_pages', function (Blueprint $table) {
            $table->unsignedTinyInteger('hero_focal_x')->nullable()->default(50)->after('header_path');
            $table->unsignedTinyInteger('hero_focal_y')->nullable()->default(35)->after('hero_focal_x');
        });
    }

    public function down(): void
    {
        Schema::table('artist_pages', function (Blueprint $table) {
            $table->dropColumn(['hero_focal_x', 'hero_focal_y']);
        });
    }
};
