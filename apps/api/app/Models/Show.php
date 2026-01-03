<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Show extends Model
{
    protected $fillable = [
        'artist_page_id',
        'starts_at',
        'venue',
        'city',
        'address',
        'ticket_url',
        'price',
        'is_free',
        'support_acts',
        'flyer_path',
        'status',
        'position',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'position' => 'integer',
        'price' => 'decimal:2',
        'is_free' => 'boolean',
        'support_acts' => 'array',
    ];

    /**
     * Get the artist page that owns the show.
     */
    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }
}
