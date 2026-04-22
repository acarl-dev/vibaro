<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class GalleryImageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $appUrl = rtrim(config('app.url'), '/');

        return [
            'title'     => $this->title,
            'image_url' => $appUrl . Storage::url($this->image_path),
        ];
    }
}
