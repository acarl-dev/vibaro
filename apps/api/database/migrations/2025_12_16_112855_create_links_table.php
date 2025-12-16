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
        Schema::create('links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained('artist_pages')->onDelete('cascade');
            $table->string('type')->default('custom'); // spotify, youtube, instagram, custom
            $table->string('title');
            $table->text('url');
            $table->integer('position')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->timestamps();

            $table->index('artist_page_id');
            $table->index(['artist_page_id', 'position']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('links');
    }
};
