<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Lokaler Admin-Account für Entwicklung
        User::firstOrCreate(['email' => 'admin@vibaro.local'], [
            'name' => 'Admin',
            'password' => 'admin1234',
            'is_admin' => true,
        ]);

        // Test account
        User::firstOrCreate(['email' => 'test@vibaro.com'], [
            'name' => 'Test User',
            'password' => 'password',
            'is_admin' => false,
        ]);
    }
}
