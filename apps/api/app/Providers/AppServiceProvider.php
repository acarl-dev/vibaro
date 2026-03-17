<?php

namespace App\Providers;

use App\Models\ArtistPage;
use App\Models\Campaign;
use App\Models\Release;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Policies\ArtistPagePolicy;
use App\Policies\CampaignPolicy;
use App\Policies\ReleasePolicy;
use App\Policies\SpotlightPolicy;
use App\Policies\TrackingLinkPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(ArtistPage::class, ArtistPagePolicy::class);
        Gate::policy(Campaign::class, CampaignPolicy::class);
        Gate::policy(Release::class, ReleasePolicy::class);
        Gate::policy(Spotlight::class, SpotlightPolicy::class);
        Gate::policy(TrackingLink::class, TrackingLinkPolicy::class);
    }
}
