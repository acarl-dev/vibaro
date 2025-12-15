<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
