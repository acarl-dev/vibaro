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
        Schema::create('featured_tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('artist_name')->nullable();
            $table->string('platform'); // spotify | soundcloud | youtube
            $table->string('platform_url');
            $table->string('embed_id')->nullable();
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->index('artist_page_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('featured_tracks');
    }
};
