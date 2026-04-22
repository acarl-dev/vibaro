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
        'subtitle',
        'cta_label',
        'secondary_cta_url',
        'secondary_cta_label',
        'background_image_url',
        'meta',
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
        'meta' => 'array',
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
     * Scope: status = 'active' and not archived. Use for the single running spotlight.
     */
    public function scopeCurrentlyActive(Builder $query): Builder
    {
        return $query
            ->where('status', 'active')
            ->whereNull('archived_at');
    }

    /**
     * Scope: not archived (archived_at IS NULL).
     */
    public function scopeNotArchived(Builder $query): Builder
    {
        return $query->whereNull('archived_at');
    }

    /**
     * Scope: status = 'ended'.
     */
    public function scopeEnded(Builder $query): Builder
    {
        return $query->where('status', 'ended');
    }

    /**
     * Scope: visible on the public artist page (show_on_page = true).
     */
    public function scopeVisibleOnPage(Builder $query): Builder
    {
        return $query->where('show_on_page', true);
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
        $archivedAt = now();

        $updates = [
            'archived_at' => $archivedAt,
        ];

        if ($this->status === 'active') {
            $updates['status'] = 'ended';
            $updates['ends_at'] = $this->ends_at ?? $archivedAt;
            $updates['show_on_page'] = false;
        }

        $this->update($updates);
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
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($spotlight) {
            // Generate slug if not provided
            if (empty($spotlight->slug)) {
                $spotlight->slug = static::generateSlug($spotlight->title);
            }
        });

    }
}
