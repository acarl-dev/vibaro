<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Release extends Model
{
    protected $fillable = [
        'artist_page_id',
        'title',
        'release_date',
        'url',
        'cover_path',
        'release_type',
        'is_featured',
        'position',
    ];

    protected $casts = [
        'release_date' => 'date',
        'is_featured' => 'boolean',
        'position' => 'integer',
        'release_type' => 'string',
    ];

    /**
     * Get the artist page that owns the release.
     */
    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }
}
