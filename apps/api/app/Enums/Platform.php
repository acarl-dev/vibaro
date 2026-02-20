<?php

namespace App\Enums;

enum Platform: string
{
    case INSTAGRAM = 'instagram';
    case TIKTOK = 'tiktok';
    case YOUTUBE = 'youtube';
    case FACEBOOK = 'facebook';
    case TWITTER = 'twitter';
    case WHATSAPP = 'whatsapp';
    case TELEGRAM = 'telegram';
    case SPOTIFY = 'spotify';
    case EMAIL = 'email';
    case OTHER = 'other';

    /**
     * Get all platform values.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get platform label for display.
     */
    public function label(): string
    {
        return ucfirst($this->value);
    }

    /**
     * Check if platform value is valid.
     */
    public static function isValid(string $value): bool
    {
        return in_array($value, self::values(), true);
    }
}
