<?php

namespace App\Services;

use App\Models\Spotlight;
use App\Models\TrackingLink;
use Carbon\CarbonInterface;
use DomainException;
use Illuminate\Support\Facades\DB;

class SpotlightLifecycleService
{
    /**
     * Activate a spotlight and fully end any other active spotlight of the same artist page.
     */
    public function activate(Spotlight $spotlight): void
    {
        DB::transaction(function () use ($spotlight): void {
            $spotlight = Spotlight::query()->lockForUpdate()->findOrFail($spotlight->id);

            if ($spotlight->isArchived()) {
                throw new DomainException('Archived spotlight cannot be activated.');
            }

            $endedAt = now();

            Spotlight::query()
                ->where('artist_page_id', $spotlight->artist_page_id)
                ->where('id', '!=', $spotlight->id)
                ->where('status', 'active')
                ->lockForUpdate()
                ->get()
                ->each(fn (Spotlight $other) => $this->endInternal($other, $endedAt));

            $spotlight->update(['status' => 'active']);
        });
    }

    /**
     * End a spotlight and apply the full ended-state side effects.
     */
    public function end(Spotlight $spotlight): void
    {
        DB::transaction(function () use ($spotlight): void {
            $spotlight = Spotlight::query()->lockForUpdate()->findOrFail($spotlight->id);
            $this->endInternal($spotlight, now());
        });
    }

    /**
     * Archive a spotlight (soft delete) with row locking and invariant checks.
     */
    public function archive(Spotlight $spotlight): void
    {
        DB::transaction(function () use ($spotlight): void {
            $spotlight = Spotlight::query()->lockForUpdate()->findOrFail($spotlight->id);

            if ($spotlight->isArchived()) {
                throw new DomainException('Spotlight is already archived.');
            }

            $spotlight->update(['archived_at' => now()]);
        });
    }

    /**
     * Restore a spotlight (remove archived_at) with row locking and invariant checks.
     */
    public function restore(Spotlight $spotlight): void
    {
        DB::transaction(function () use ($spotlight): void {
            $spotlight = Spotlight::query()->lockForUpdate()->findOrFail($spotlight->id);

            if (!$spotlight->isArchived()) {
                throw new DomainException('Spotlight is not archived.');
            }

            $spotlight->update(['archived_at' => null]);
        });
    }

    private function endInternal(Spotlight $spotlight, CarbonInterface $endedAt): void
    {
        $spotlight->update([
            'status' => 'ended',
            'ends_at' => $endedAt,
            'show_on_page' => false,
        ]);

        TrackingLink::query()
            ->where('spotlight_id', $spotlight->id)
            ->whereNull('archived_at')
            ->update(['archived_at' => $endedAt]);
    }
}
