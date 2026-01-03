<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('platform')->default('youtube'); // youtube, vimeo
            $table->string('video_id'); // YouTube ID or Vimeo ID
            $table->string('url'); // Full URL for convenience
            $table->text('description')->nullable();
            $table->string('thumbnail_url')->nullable(); // Auto-fetched or custom
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->index(['artist_page_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
