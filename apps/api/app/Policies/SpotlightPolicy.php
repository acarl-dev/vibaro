<?php

namespace App\Policies;

use App\Models\Spotlight;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SpotlightPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Spotlight $spotlight): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $spotlight->artist_page_id === $artistPage->id;
    }

    public function update(User $user, Spotlight $spotlight): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $spotlight->artist_page_id === $artistPage->id;
    }

    public function delete(User $user, Spotlight $spotlight): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $spotlight->artist_page_id === $artistPage->id;
    }

    public function activate(User $user, Spotlight $spotlight): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $spotlight->artist_page_id === $artistPage->id;
    }

    public function end(User $user, Spotlight $spotlight): bool
    {
        $artistPage = $user->artistPage;
        return $artistPage && $spotlight->artist_page_id === $artistPage->id;
    }
}
