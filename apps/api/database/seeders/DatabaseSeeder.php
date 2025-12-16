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
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@vibaro.local',
            'password' => 'admin1234',
            'is_admin' => true,
        ]);
    }
}
