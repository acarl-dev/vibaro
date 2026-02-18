<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spotlights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('type'); // e.g. 'release', 'tour', 'single', 'merch'
            $table->enum('status', ['scheduled', 'active', 'ended'])->default('scheduled');
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();
            $table->string('primary_url')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('artist_page_id');
            $table->index(['artist_page_id', 'status']);
        });

        // Ensure max 1 active spotlight per artist_page
        DB::statement('
            CREATE UNIQUE INDEX spotlights_one_active_per_artist 
            ON spotlights (artist_page_id) 
            WHERE status = \'active\'
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spotlights');
    }
};
