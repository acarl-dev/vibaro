<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Spotlight;
use App\Models\TrackingLink;
use App\Models\ClickEvent;

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
        'logo_path',
        'theme_key',
        'theme_variant',
        'accent_mode',
        'accent_color',
        'booking_email',
        'management_email',
        'press_email',
        'whatsapp_number',
        'contact_message',
        'is_published',
        'published_at',
        'visible_sections',
        'hero_focal_x',
        'hero_focal_y',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'visible_sections' => 'array',
        'hero_focal_x' => 'integer',
        'hero_focal_y' => 'integer',
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

    public function spotlights(): HasMany
    {
        return $this->hasMany(Spotlight::class)->orderBy('starts_at', 'desc');
    }

    public function activeSpotlight()
    {
        return $this->hasOne(Spotlight::class)->where('status', 'active');
    }

    public function trackingLinks(): HasMany
    {
        return $this->hasMany(TrackingLink::class);
    }

    public function clickEvents(): HasMany
    {
        return $this->hasMany(ClickEvent::class);
    }
}
