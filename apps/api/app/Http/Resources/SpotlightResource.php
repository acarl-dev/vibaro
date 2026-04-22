<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SpotlightResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                   => $this->id,
            'title'                => $this->title,
            'slug'                 => $this->slug,
            'type'                 => $this->type,
            'status'               => $this->status,
            'starts_at'            => $this->starts_at?->toISOString(),
            'ends_at'              => $this->ends_at?->toISOString(),
            'primary_url'          => $this->primary_url,
            'cover_image_url'      => $this->cover_image_url,
            'artist_name'          => $this->artist_name,
            'platform_name'        => $this->platform_name,
            'description'          => $this->description,
            'subtitle'             => $this->subtitle,
            'cta_label'            => $this->cta_label,
            'secondary_cta_url'    => $this->secondary_cta_url,
            'secondary_cta_label'  => $this->secondary_cta_label,
            'background_image_url' => $this->background_image_url,
            'meta'                 => $this->meta,
            'show_on_page'         => $this->show_on_page,
            'archived_at'          => $this->archived_at?->toISOString(),
            'created_at'           => $this->created_at->toISOString(),
            'updated_at'           => $this->updated_at->toISOString(),
        ];
    }
}
