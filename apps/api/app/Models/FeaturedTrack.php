<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeaturedTrack extends Model
{
    protected $fillable = [
        'artist_page_id',
        'title',
        'artist_name',
        'platform',
        'platform_url',
        'embed_id',
        'position',
    ];

    protected $casts = [
        'position' => 'integer',
    ];

    /**
     * Get the artist page that owns the featured track.
     */
    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }
}
