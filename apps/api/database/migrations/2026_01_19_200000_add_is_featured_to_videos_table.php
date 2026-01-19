<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('position');
            $table->index(['artist_page_id', 'is_featured']);
        });
    }

    public function down(): void
    {
        Schema::table('videos', function (Blueprint $table) {
            $table->dropIndex(['artist_page_id', 'is_featured']);
            $table->dropColumn('is_featured');
        });
    }
};
