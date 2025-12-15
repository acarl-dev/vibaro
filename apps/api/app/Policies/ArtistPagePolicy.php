<?php

namespace App\Policies;

use App\Models\ArtistPage;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ArtistPagePolicy
{
    use HandlesAuthorization;

    public function view(User $user, ArtistPage $page): bool
    {
        return $user->id === $page->user_id;
    }

    public function update(User $user, ArtistPage $page): bool
    {
        return $user->id === $page->user_id;
    }
}
