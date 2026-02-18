<?php

namespace App\Policies;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CampaignPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Campaign $campaign): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $campaign->artist_page_id === $artistPage->id;
    }

    public function update(User $user, Campaign $campaign): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $campaign->artist_page_id === $artistPage->id;
    }

    public function delete(User $user, Campaign $campaign): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $campaign->artist_page_id === $artistPage->id;
    }
}
