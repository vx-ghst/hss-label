import { isPlatformServer } from '@angular/common';
import {
  afterNextRender,
  DestroyRef,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { makeStateKey, TransferState } from '@angular/core';
import { Show, shows } from './content';

const MAX_TIMEOUT_DELAY = 2_147_483_647;

export const SHOWS_REFERENCE_TIME = makeStateKey<number>('hss-shows-reference-time');

export function getUpcomingShows(source: readonly Show[], referenceTime: number): Show[] {
  return source
    .filter((show) => Date.parse(show.startsAt) > referenceTime)
    .sort((first, second) => Date.parse(first.startsAt) - Date.parse(second.startsAt));
}

@Injectable({ providedIn: 'root' })
export class ShowsService {
  private readonly transferState = inject(TransferState);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly currentShows = signal<readonly Show[]>([]);
  private refreshTimer: ReturnType<typeof setTimeout> | undefined;

  readonly upcomingShows = this.currentShows.asReadonly();

  constructor() {
    const referenceTime = this.transferState.get(SHOWS_REFERENCE_TIME, Date.now());

    if (isPlatformServer(this.platformId)) {
      this.transferState.set(SHOWS_REFERENCE_TIME, referenceTime);
    }

    this.currentShows.set(getUpcomingShows(shows, referenceTime));

    afterNextRender(() => this.refreshAndSchedule());
    this.destroyRef.onDestroy(() => this.clearRefreshTimer());
  }

  private refreshAndSchedule(): void {
    this.clearRefreshTimer();

    const referenceTime = Date.now();
    const upcomingShows = getUpcomingShows(shows, referenceTime);
    this.currentShows.set(upcomingShows);

    const nextStart = upcomingShows[0] ? Date.parse(upcomingShows[0].startsAt) : Number.NaN;
    if (!Number.isFinite(nextStart)) return;

    const delay = Math.min(Math.max(nextStart - referenceTime, 0), MAX_TIMEOUT_DELAY);
    this.refreshTimer = setTimeout(() => this.refreshAndSchedule(), delay);
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer === undefined) return;
    clearTimeout(this.refreshTimer);
    this.refreshTimer = undefined;
  }
}
