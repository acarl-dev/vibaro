<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Link extends Model
{
    protected $fillable = [
        'artist_page_id',
        'type',
        'title',
        'url',
        'position',
        'is_visible',
    ];

    protected $casts = [
        'position' => 'integer',
        'is_visible' => 'boolean',
    ];

    /**
     * Get the artist page that owns the link.
     */
    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }
}
