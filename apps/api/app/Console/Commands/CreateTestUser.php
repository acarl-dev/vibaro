<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\ArtistPage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateTestUser extends Command
{
    protected $signature = 'test:user';
    protected $description = 'Create a test user with artist page';

    public function handle()
    {
        $user = User::updateOrCreate(
            ['email' => 'test@vibaro.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'is_admin' => false,
            ]
        );

        $this->info("User created/updated!");
        $this->line("Email: test@vibaro.com");
        $this->line("Password: password");

        // Create artist page if not exists
        $artistPage = ArtistPage::firstOrCreate(
            ['user_id' => $user->id],
            [
                'handle' => 'testartist',
                'display_name' => 'Test Artist',
                'bio' => 'This is a test artist page for development.',
                'theme_key' => 'modern',
                'theme_variant' => 'auto',
                'is_published' => true,
                'published_at' => now(),
            ]
        );

        $this->info("\nArtist Page created!");
        $this->line("Handle: @{$artistPage->handle}");
        $this->line("Public URL: http://localhost:3000/p/{$artistPage->handle}");

        return 0;
    }
}
