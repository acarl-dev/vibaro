<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageViewEvent extends Model
{
    protected $fillable = [
        'artist_page_id',
        'spotlight_id',
        'referrer_host',
        'country_code',
        'user_agent_hash',
        'is_preview',
        'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
        'is_preview'  => 'boolean',
    ];

    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }

    public function spotlight(): BelongsTo
    {
        return $this->belongsTo(Spotlight::class);
    }

    /** Exclude preview / bot clicks. */
    public function scopeRealViews(Builder $query): Builder
    {
        return $query->where('is_preview', false);
    }
}
