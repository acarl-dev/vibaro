<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Processes uploaded images:
 *  - Re-encodes to WebP (strips EXIF implicitly)
 *  - Applies EXIF rotation for JPEG sources
 *  - Resizes down to profile-specific max dimensions
 *
 * Requires PHP GD extension (php8.3-gd).
 */
class ImageProcessingService
{
    /**
     * Per-context processing profiles.
     * width/height = max bounding box (aspect ratio preserved, never upscaled).
     * quality = WebP quality 0–100.
     */
    private const PROFILES = [
        'avatar'  => ['width' => 400,  'height' => 400,  'quality' => 82],
        'logo'    => ['width' => 600,  'height' => 600,  'quality' => 82],
        'hero'    => ['width' => 2400, 'height' => 900,  'quality' => 85],
        'gallery' => ['width' => 1920, 'height' => 1920, 'quality' => 82],
        'cover'   => ['width' => 1000, 'height' => 1000, 'quality' => 85],
        'flyer'   => ['width' => 1200, 'height' => 1800, 'quality' => 85],
    ];

    /**
     * Process an uploaded image file.
     *
     * @param  string  $profile  One of the keys in PROFILES.
     * @param  string  $directory  Storage sub-directory (e.g. 'avatars').
     * @return array{path: string, contents: string}
     *
     * @throws RuntimeException  When GD is not available or the image cannot be decoded.
     */
    public function process(UploadedFile $file, string $profile, string $directory): array
    {
        if (!extension_loaded('gd')) {
            throw new RuntimeException('PHP GD extension is required for image processing (install php-gd).');
        }

        $config = self::PROFILES[$profile] ?? self::PROFILES['gallery'];

        // Load – GD discards all metadata (EXIF) on load
        $image = $this->loadGd($file);

        // Correct orientation before EXIF is gone
        $image = $this->applyExifOrientation($file, $image);

        // Resize down (never upscale)
        $image = $this->resizeDown($image, $config['width'], $config['height']);

        // Encode to WebP
        ob_start();
        imagewebp($image, null, $config['quality']);
        $contents = ob_get_clean();
        imagedestroy($image);

        if ($contents === false || $contents === '') {
            throw new RuntimeException('WebP encoding failed.');
        }

        $path = $directory . '/' . Str::uuid() . '.webp';

        return ['path' => $path, 'contents' => $contents];
    }

    // -------------------------------------------------------------------------

    /** @return \GdImage */
    private function loadGd(UploadedFile $file)
    {
        // Use server-detected MIME type (finfo), not the client-supplied header
        $mime = $file->getMimeType();
        $realPath = $file->getRealPath();

        $image = match (true) {
            in_array($mime, ['image/jpeg', 'image/jpg'], true) => imagecreatefromjpeg($realPath),
            $mime === 'image/png'  => $this->loadPng($realPath),
            $mime === 'image/webp' => imagecreatefromwebp($realPath),
            default => throw new RuntimeException("Unsupported image MIME type: {$mime}"),
        };

        if ($image === false) {
            throw new RuntimeException('Could not decode image file.');
        }

        return $image;
    }

    /** Load PNG and preserve alpha channel. */
    private function loadPng(string $path)
    {
        $image = imagecreatefrompng($path);
        if ($image !== false) {
            imagealphablending($image, true);
            imagesavealpha($image, true);
        }

        return $image;
    }

    /**
     * Rotate image according to EXIF Orientation tag (JPEG only).
     * The exif PHP extension is required; if absent, returns the image unchanged.
     *
     * @param  \GdImage  $image
     * @return \GdImage
     */
    private function applyExifOrientation(UploadedFile $file, $image)
    {
        if (!function_exists('exif_read_data')) {
            return $image;
        }

        $mime = $file->getMimeType();
        if (!in_array($mime, ['image/jpeg', 'image/jpg'], true)) {
            return $image;
        }

        $exif = @exif_read_data($file->getRealPath());
        if (!$exif || !isset($exif['Orientation'])) {
            return $image;
        }

        $rotated = match ((int) $exif['Orientation']) {
            3 => imagerotate($image, 180, 0),
            6 => imagerotate($image, -90, 0),
            8 => imagerotate($image, 90, 0),
            default => null,
        };

        if ($rotated !== null && $rotated !== false) {
            imagedestroy($image);
            return $rotated;
        }

        return $image;
    }

    /**
     * Scale image down so it fits within $maxWidth × $maxHeight.
     * Does NOT upscale. Aspect ratio is always preserved.
     *
     * @param  \GdImage  $image
     * @return \GdImage
     */
    private function resizeDown($image, int $maxWidth, int $maxHeight)
    {
        $srcW = imagesx($image);
        $srcH = imagesy($image);

        if ($srcW <= $maxWidth && $srcH <= $maxHeight) {
            return $image;
        }

        $ratio = min($maxWidth / $srcW, $maxHeight / $srcH);
        $newW  = (int) round($srcW * $ratio);
        $newH  = (int) round($srcH * $ratio);

        $canvas = imagecreatetruecolor($newW, $newH);

        // Preserve alpha (relevant for PNG sources before WebP re-encode)
        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);

        imagecopyresampled($canvas, $image, 0, 0, 0, 0, $newW, $newH, $srcW, $srcH);
        imagedestroy($image);

        return $canvas;
    }
}
