<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeaturedTrackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'title'        => $this->title,
            'artist_name'  => $this->artist_name,
            'platform'     => $this->platform,
            'platform_url' => $this->platform_url,
            'embed_id'     => $this->embed_id,
        ];
    }
}
