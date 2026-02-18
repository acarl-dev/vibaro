<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\TrackingLink;
use App\Models\ArtistPage;
use App\Models\Spotlight;

class ClickEvent extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'tracking_link_id',
        'artist_page_id',
        'spotlight_id',
        'campaign_id',
        'module',
        'referrer_host',
        'country_code',
        'user_agent_hash',
        'is_preview',
        'occurred_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'occurred_at' => 'datetime',
        'is_preview' => 'boolean',
    ];

    public function trackingLink(): BelongsTo
    {
        return $this->belongsTo(TrackingLink::class);
    }

    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }

    public function spotlight(): BelongsTo
    {
        return $this->belongsTo(Spotlight::class);
    }

    /**
     * Scope to exclude preview/bot clicks from analytics.
     */
    public function scopeRealClicks($query)
    {
        return $query->where('is_preview', false);
    }
}
