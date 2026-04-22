<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
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
        'platform',
        'placement',
        'module',
        'label',
        'target_url',
        'slug',
        'short_code',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'is_active',
        'click_count',
        'archived_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'click_count' => 'integer',
        'archived_at' => 'datetime',
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
     * Scope to only include tracking links that are not archived.
     */
    public function scopeNotArchived(Builder $query): Builder
    {
        return $query->whereNull('archived_at');
    }

    /**
     * Generate a human-readable, unique short code.
     * Format: {platform}-{placement}-{spotlight-slug}[-{n}]
     * Example: instagram-bio-downfall, tiktok-story-album-2024-2
     * Falls back to random 8-char code if no context is available.
     */
    public static function generateShortCode(
        ?string $platform = null,
        ?string $placement = null,
        ?string $spotlightSlug = null
    ): string {
        if ($platform && $placement && $spotlightSlug) {
            $base = Str::slug("{$platform}-{$placement}-{$spotlightSlug}");
            // Ensure uniqueness: append -2, -3, … if needed
            $candidate = $base;
            $n = 1;
            while (static::where('short_code', $candidate)->orWhere('slug', $candidate)->exists()) {
                $n++;
                $candidate = "{$base}-{$n}";
            }
            return $candidate;
        }

        // Fallback: random 8-char code (no context available)
        do {
            $code = Str::random(8);
        } while (static::where('short_code', $code)->exists());

        return $code;
    }

    /**
     * Increment click count atomically.
     */
    public function incrementClicks(): void
    {
        $this->increment('click_count');
    }

    /**
     * Archive this tracking link (soft delete).
     */
    public function archive(): void
    {
        $this->update(['archived_at' => now()]);
    }

    /**
     * Restore an archived tracking link.
     */
    public function restore(): void
    {
        $this->update(['archived_at' => null]);
    }

    /**
     * Check if tracking link is archived.
     */
    public function isArchived(): bool
    {
        return $this->archived_at !== null;
    }

    /**
     * Build full tracking URL using short_code.
     */
    public function getTrackingUrlAttribute(): string
    {
        $code = $this->short_code ?? $this->slug;
        return config('app.url') . '/t/' . $code;
    }

    /**
     * Generate label from platform and placement.
     */
    public static function generateLabel(?string $platform, ?string $placement): string
    {
        $parts = array_filter([
            $platform ? ucfirst($platform) : null,
            $placement ? ucfirst($placement) : null,
        ]);

        return implode(' · ', $parts) ?: 'Link';
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($link) {
            // Generate human-readable short_code if not provided
            if (empty($link->short_code)) {
                // Resolve spotlight slug for readable code (e.g. instagram-bio-downfall)
                $spotlightSlug = null;
                if ($link->spotlight_id) {
                    $spotlight = Spotlight::find($link->spotlight_id);
                    $spotlightSlug = $spotlight?->slug ?? null;

                    // Also pre-fill utm_campaign while we have the spotlight
                    if ($spotlight?->slug) {
                        $link->utm_campaign = $spotlight->slug;
                    }
                }

                $link->short_code = static::generateShortCode(
                    $link->platform,
                    $link->placement,
                    $spotlightSlug
                );
            }

            // slug mirrors short_code (column is NOT NULL, kept for backwards compatibility)
            if (empty($link->slug)) {
                $link->slug = $link->short_code;
            }

            // Auto-generate label if not provided
            if (empty($link->label) && ($link->platform || $link->placement)) {
                $link->label = static::generateLabel($link->platform, $link->placement);
            }

            // Generate UTM parameters
            if ($link->platform && empty($link->utm_source)) {
                $link->utm_source = $link->platform;
            }

            if ($link->placement && empty($link->utm_medium)) {
                $link->utm_medium = $link->placement;
            }

            // Set utm_campaign from spotlight.slug (only if not already set above)
            if ($link->spotlight_id && empty($link->utm_campaign)) {
                $spotlight = Spotlight::find($link->spotlight_id);
                if ($spotlight?->slug) {
                    $link->utm_campaign = $spotlight->slug;
                }
            }
        });
    }
}
