<?php

namespace App\Policies;

use App\Models\TrackingLink;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TrackingLinkPolicy
{
    use HandlesAuthorization;

    public function view(User $user, TrackingLink $trackingLink): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $trackingLink->artist_page_id === $artistPage->id;
    }

    public function delete(User $user, TrackingLink $trackingLink): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $trackingLink->artist_page_id === $artistPage->id;
    }
}
