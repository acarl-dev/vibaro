<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('artist_pages', function (Blueprint $table) {
            // Flexible contacts array: [{ "label": str, "type": "email"|"whatsapp", "value": str }]
            // Replaces the 4 individual contact fields as source of truth for public-facing contact list.
            // Old fields (booking_email etc.) remain for backward compat with studio settings.
            $table->jsonb('contacts')->nullable()->after('contact_message');
        });

        // Migrate existing data: convert old single fields into the new contacts array
        DB::statement("
            UPDATE artist_pages
            SET contacts = (
                SELECT jsonb_agg(entry ORDER BY ord)
                FROM (
                    VALUES
                        (1, jsonb_build_object('label', 'Booking',    'type', 'email',    'value', booking_email)),
                        (2, jsonb_build_object('label', 'Management', 'type', 'email',    'value', management_email)),
                        (3, jsonb_build_object('label', 'Press',      'type', 'email',    'value', press_email)),
                        (4, jsonb_build_object('label', 'WhatsApp',   'type', 'whatsapp', 'value', whatsapp_number))
                ) AS t(ord, entry)
                WHERE entry->>'value' IS NOT NULL
            )
            WHERE booking_email IS NOT NULL
               OR management_email IS NOT NULL
               OR press_email IS NOT NULL
               OR whatsapp_number IS NOT NULL
        ");
    }

    public function down(): void
    {
        Schema::table('artist_pages', function (Blueprint $table) {
            $table->dropColumn('contacts');
        });
    }
};
