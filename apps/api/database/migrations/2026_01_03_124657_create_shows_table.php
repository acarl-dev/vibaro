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
        Schema::create('shows', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained('artist_pages')->onDelete('cascade');
            $table->dateTime('starts_at');
            $table->string('venue');
            $table->string('city');
            $table->string('ticket_url')->nullable();
            $table->string('flyer_path')->nullable();
            $table->string('status')->default('upcoming'); // upcoming, sold_out, cancelled
            $table->integer('position')->default(0);
            $table->timestamps();

            $table->index('artist_page_id');
            $table->index(['artist_page_id', 'starts_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shows');
    }
};
