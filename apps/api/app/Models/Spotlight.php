<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Spotlight extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'artist_page_id',
        'title',
        'type',
        'status',
        'starts_at',
        'ends_at',
        'primary_url',
        'description',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }

    public function trackingLinks(): HasMany
    {
        return $this->hasMany(TrackingLink::class);
    }

    public function clickEvents(): HasMany
    {
        return $this->hasMany(ClickEvent::class);
    }

    /**
     * Ensure only one active spotlight per artist page.
     */
    public static function boot()
    {
        parent::boot();

        static::saving(function ($spotlight) {
            if ($spotlight->status === 'active') {
                // Deactivate other active spotlights for this artist page
                static::where('artist_page_id', $spotlight->artist_page_id)
                    ->where('id', '!=', $spotlight->id ?? 0)
                    ->where('status', 'active')
                    ->update(['status' => 'ended']);
            }
        });
    }
}
