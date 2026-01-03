<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained()->onDelete('cascade');
            $table->string('title')->nullable(); // Optional caption
            $table->string('image_path'); // Path to stored image
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->index(['artist_page_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_images');
    }
};
