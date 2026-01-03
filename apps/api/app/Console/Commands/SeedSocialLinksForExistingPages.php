<?php

namespace App\Console\Commands;

use App\Models\ArtistPage;
use App\Services\LinkService;
use Illuminate\Console\Command;

class SeedSocialLinksForExistingPages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vibaro:seed-social-links';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add pre-filled social media links to existing artist pages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $pages = ArtistPage::all();

        if ($pages->isEmpty()) {
            $this->info('No artist pages found.');
            return 0;
        }

        $this->info("Found {$pages->count()} artist page(s).");

        foreach ($pages as $page) {
            // Check if page already has any links
            $existingLinksCount = $page->links()->count();

            if ($existingLinksCount > 0) {
                $this->info("Skipping '{$page->handle}' - already has {$existingLinksCount} link(s).");
                continue;
            }

            // Create default social media links
            LinkService::createDefaultLinksForArtistPage($page);
            $this->info("✓ Added social media links for '{$page->handle}'");
        }

        $this->info('Done!');
        return 0;
    }
}
