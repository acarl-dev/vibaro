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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artist_page_id')->constrained()->cascadeOnDelete();
            $table->foreignId('spotlight_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('platform')->nullable(); // e.g. 'instagram', 'facebook', 'email'
            $table->text('notes')->nullable();
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();
            $table->timestamps();

            $table->index('artist_page_id');
            $table->index('spotlight_id');
        });

        // Add foreign key constraint to tracking_links if campaign_id exists
        Schema::table('tracking_links', function (Blueprint $table) {
            $table->foreign('campaign_id')->references('id')->on('campaigns')->cascadeOnDelete();
            $table->index('campaign_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tracking_links', function (Blueprint $table) {
            $table->dropForeign(['campaign_id']);
            $table->dropIndex(['campaign_id']);
        });

        Schema::dropIfExists('campaigns');
    }
};
