<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artist_pages', function (Blueprint $table) {
            $table->string('booking_email')->nullable()->after('accent_color');
            $table->string('management_email')->nullable()->after('booking_email');
            $table->string('press_email')->nullable()->after('management_email');
            $table->string('whatsapp_number')->nullable()->after('press_email');
        });
    }

    public function down(): void
    {
        Schema::table('artist_pages', function (Blueprint $table) {
            $table->dropColumn(['booking_email', 'management_email', 'press_email', 'whatsapp_number']);
        });
    }
};
