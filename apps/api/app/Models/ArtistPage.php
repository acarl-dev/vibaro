<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArtistPage extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'handle',
        'display_name',
        'bio',
        'avatar_path',
        'header_path',
        'theme_key',
        'theme_variant',
        'accent_mode',
        'accent_color',
        'is_published',
        'published_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(Link::class)->orderBy('position');
    }

    public function shows(): HasMany
    {
        return $this->hasMany(Show::class)->orderBy('starts_at');
    }

    public function releases(): HasMany
    {
        return $this->hasMany(Release::class)->orderBy('release_date', 'desc');
    }

    public function featuredTracks(): HasMany
    {
        return $this->hasMany(FeaturedTrack::class)->orderBy('position');
    }

    public function videos(): HasMany
    {
        return $this->hasMany(Video::class)->orderBy('position');
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(GalleryImage::class)->orderBy('position');
    }
}
