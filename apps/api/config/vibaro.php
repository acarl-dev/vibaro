<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Trial Period
    |--------------------------------------------------------------------------
    |
    | Duration in days for the trial period granted to every new user on
    | registration. After the trial expires, a paid plan is required.
    |
    */
    'trial_duration_days' => (int) env('VIBARO_TRIAL_DURATION_DAYS', 60),

    /*
    |--------------------------------------------------------------------------
    | Resource Limits
    |--------------------------------------------------------------------------
    |
    | Per-artist-page resource limits. Can later be differentiated by plan
    | once billing is wired up.
    |
    */
    'limits' => [
        'max_videos'         => (int) env('VIBARO_MAX_VIDEOS', 8),
        'max_gallery_images' => (int) env('VIBARO_MAX_GALLERY_IMAGES', 16),
    ],

    'security' => [
        // Keep HTTP disabled in production-like environments unless explicitly enabled.
        'allow_http_external_urls' => (bool) env('VIBARO_ALLOW_HTTP_EXTERNAL_URLS', false),
    ],

];
