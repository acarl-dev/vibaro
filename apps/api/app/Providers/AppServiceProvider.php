<?php

namespace App\Providers;

use App\Models\ArtistPage;
use App\Policies\ArtistPagePolicy;
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
    }
}
