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
        Schema::table('links', function (Blueprint $table) {
            // Make url nullable for pre-filled social media links
            $table->text('url')->nullable()->change();

            // Make title nullable (will be set from type for social media)
            $table->string('title')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('links', function (Blueprint $table) {
            $table->text('url')->nullable(false)->change();
            $table->string('title')->nullable(false)->change();
        });
    }
};
