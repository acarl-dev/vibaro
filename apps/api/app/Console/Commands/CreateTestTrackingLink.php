<?php

namespace App\Console\Commands;

use App\Models\ArtistPage;
use App\Models\TrackingLink;
use App\Models\User;
use Illuminate\Console\Command;

class CreateTestTrackingLink extends Command
{
    protected $signature = 'test:tracking-link';
    protected $description = 'Create a test tracking link';

    public function handle()
    {
        // Use test user's artist page
        $user = User::where('email', 'test@vibaro.com')->first();
        $page = $user ? $user->artistPage : ArtistPage::first();
        
        if (!$page) {
            $this->error('No artist page found. Create one first.');
            return 1;
        }

        $link = TrackingLink::updateOrCreate(
            ['slug' => 'test123'],
            [
                'artist_page_id' => $page->id,
                'module' => 'test',
                'target_url' => 'https://spotify.com',
                'is_active' => true,
            ]
        );

        $this->info("Tracking link created!");
        $this->line("Slug: {$link->slug}");
        $this->line("URL: http://localhost:8000/t/{$link->slug}");
        $this->line("Target: {$link->target_url}");

        return 0;
    }
}
