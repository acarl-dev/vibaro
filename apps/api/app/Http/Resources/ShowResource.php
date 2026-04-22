<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ShowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $appUrl = rtrim(config('app.url'), '/');

        return [
            'title'        => $this->venue . ' - ' . $this->city,
            'venue'        => $this->venue,
            'city'         => $this->city,
            'address'      => $this->address,
            'date'         => $this->starts_at->toIso8601String(),
            'time'         => $this->starts_at->format('H:i'),
            'price'        => $this->price,
            'is_free'      => $this->is_free,
            'support_acts' => $this->support_acts ?? [],
            'url'          => $this->ticket_url,
            'flyer_url'    => $this->flyer_path ? $appUrl . Storage::url($this->flyer_path) : null,
        ];
    }
}
