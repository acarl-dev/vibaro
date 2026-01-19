<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Video extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'artist_page_id',
        'title',
        'platform',
        'video_id',
        'url',
        'description',
        'thumbnail_url',
        'position',
        'is_featured',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'position' => 'integer',
        'is_featured' => 'boolean',
    ];

    public function artistPage(): BelongsTo
    {
        return $this->belongsTo(ArtistPage::class);
    }

    /**
     * Extract video ID from YouTube or Vimeo URL
     */
    public static function extractVideoId(string $url, string $platform): ?string
    {
        if ($platform === 'youtube') {
            // Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
            if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $url, $match)) {
                return $match[1];
            }
        } elseif ($platform === 'vimeo') {
            // Supports: vimeo.com/ID
            if (preg_match('/vimeo\.com\/(\d+)/i', $url, $match)) {
                return $match[1];
            }
        }

        return null;
    }

    /**
     * Get thumbnail URL for the video
     */
    public function getThumbnailUrlAttribute($value): ?string
    {
        if ($value) {
            return $value;
        }

        // Auto-generate thumbnail URL based on platform
        if ($this->platform === 'youtube') {
            return "https://img.youtube.com/vi/{$this->video_id}/hqdefault.jpg";
        } elseif ($this->platform === 'vimeo') {
            // Vimeo requires API call for thumbnail, return null for now
            return null;
        }

        return null;
    }
}
