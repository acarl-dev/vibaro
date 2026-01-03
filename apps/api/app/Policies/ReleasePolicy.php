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
        return $user->id === $release->artistPage->user_id;
    }

    public function update(User $user, Release $release): bool
    {
        return $user->id === $release->artistPage->user_id;
    }

    public function delete(User $user, Release $release): bool
    {
        return $user->id === $release->artistPage->user_id;
    }
}
