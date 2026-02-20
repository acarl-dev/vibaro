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
     * Scope to only include non-archived tracking links.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('archived_at');
    }

    /**
     * Generate a unique short code (8 chars).
     */
    public static function generateShortCode(): string
    {
        do {
            $code = Str::random(8);
        } while (static::where('short_code', $code)->exists());

        return $code;
    }

    /**
     * Legacy method for backward compatibility.
     * @deprecated Use generateShortCode() instead
     */
    public static function generateSlug(): string
    {
        return static::generateShortCode();
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
}
