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
        Schema::table('shows', function (Blueprint $table) {
            $table->text('address')->nullable()->after('city');
            $table->decimal('price', 8, 2)->nullable()->after('ticket_url');
            $table->boolean('is_free')->default(false)->after('price');
            $table->json('support_acts')->nullable()->after('is_free');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shows', function (Blueprint $table) {
            $table->dropColumn(['address', 'price', 'is_free', 'support_acts']);
        });
    }
};
