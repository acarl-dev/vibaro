<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class Spotlight extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'artist_page_id',
        'title',
        'slug',
        'type',
        'status',
        'starts_at',
        'ends_at',
        'primary_url',
        'cover_image_url',
        'artist_name',
        'platform_name',
        'description',
        'show_on_page',
        'archived_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'show_on_page' => 'boolean',
        'archived_at' => 'datetime',
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
     * Scope to only include non-archived spotlights.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->whereNull('archived_at');
    }

    /**
     * Generate a unique URL-safe slug based on title.
     */
    public static function generateSlug(string $title): string
    {
        $baseSlug = Str::slug(Str::lower($title));
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Archive this spotlight (soft delete).
     */
    public function archive(): void
    {
        $this->update(['archived_at' => now()]);
    }

    /**
     * Restore an archived spotlight.
     */
    public function restore(): void
    {
        $this->update(['archived_at' => null]);
    }

    /**
     * Check if spotlight is archived.
     */
    public function isArchived(): bool
    {
        return $this->archived_at !== null;
    }

    /**
     * Ensure only one active spotlight per artist page.
     */
    public static function boot()
    {
        parent::boot();

        static::creating(function ($spotlight) {
            // Generate slug if not provided
            if (empty($spotlight->slug)) {
                $spotlight->slug = static::generateSlug($spotlight->title);
            }
        });

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
