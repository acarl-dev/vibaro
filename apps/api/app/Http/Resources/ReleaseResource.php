<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ReleaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $appUrl = rtrim(config('app.url'), '/');

        return [
            'title'        => $this->title,
            'cover_url'    => $this->cover_path ? $appUrl . Storage::url($this->cover_path) : null,
            'url'          => $this->url,
            'release_date' => $this->release_date?->toDateString(),
            'release_type' => $this->release_type,
            'is_featured'  => $this->is_featured,
        ];
    }
}
