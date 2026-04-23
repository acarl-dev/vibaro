<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'title'         => $this->title,
            'platform'      => $this->platform,
            'video_id'      => $this->video_id,
            'url'           => $this->url,
            'description'   => $this->description,
            'thumbnail_url' => $this->thumbnail_url,
            'is_featured'   => $this->is_featured ?? false,
        ];
    }
}
