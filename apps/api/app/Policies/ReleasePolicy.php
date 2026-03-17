<?php

namespace App\Policies;

use App\Models\Release;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReleasePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Release $release): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $release->artist_page_id === $artistPage->id;
    }

    public function update(User $user, Release $release): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $release->artist_page_id === $artistPage->id;
    }

    public function delete(User $user, Release $release): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $release->artist_page_id === $artistPage->id;
    }
}
