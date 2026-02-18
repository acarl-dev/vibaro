<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class TrackingLink extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'artist_page_id',
        'spotlight_id',
        'campaign_id',
        'module',
        'label',
        'target_url',
        'slug',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'is_active',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }

    public function spotlight(): BelongsTo
    {
        return $this->belongsTo(Spotlight::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaign::class);
    }

    public function clickEvents(): HasMany
    {
        return $this->hasMany(ClickEvent::class);
    }

    /**
     * Generate a unique slug.
     */
    public static function generateSlug(): string
    {
        do {
            $slug = Str::random(8);
        } while (static::where('slug', $slug)->exists());

        return $slug;
    }

    /**
     * Build full tracking URL.
     */
    public function getTrackingUrlAttribute(): string
    {
        return config('app.url') . '/t/' . $this->slug;
    }
}
