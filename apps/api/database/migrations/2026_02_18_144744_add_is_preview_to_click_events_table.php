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
        Schema::table('click_events', function (Blueprint $table) {
            $table->boolean('is_preview')->default(false)->after('user_agent_hash');
            $table->index('is_preview');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('click_events', function (Blueprint $table) {
            $table->dropIndex(['is_preview']);
            $table->dropColumn('is_preview');
        });
    }
};
