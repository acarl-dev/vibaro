<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Resource Limits
    |--------------------------------------------------------------------------
    |
    | Per-artist-page resource limits. These can later be differentiated
    | by plan (Free / Artist / Pro) once billing is wired up.
    |
    */
    'limits' => [
        'max_videos'         => (int) env('VIBARO_MAX_VIDEOS', 8),
        'max_gallery_images' => (int) env('VIBARO_MAX_GALLERY_IMAGES', 16),
    ],

];
