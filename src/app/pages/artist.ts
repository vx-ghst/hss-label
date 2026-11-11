import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findPublishedArtistBySlug } from '../core/artists';
import { releases, videos } from '../core/content';
import { ShowsService } from '../core/shows';

@Component({
  imports: [RouterLink],
  template: `
    @if (artist(); as profile) {
      <article class="page">
        <a class="text-link" routerLink="/" fragment="artists">← Artists</a>
        <h1>{{ profile.name }}</h1>
        <img class="profile-image" [src]="profile.image" alt="" width="1000" height="720" />
        <p class="intro">{{ profile.biography }}</p>
        @if (relatedReleases().length) {
          <section class="page-block">
            <h2>Releases</h2>
            <ul>
              @for (release of relatedReleases(); track release.title) {
                <li>{{ release.title }}</li>
              }
            </ul>
          </section>
        }
        @if (relatedVideos().length) {
          <section class="page-block">
            <h2>Videos</h2>
            <ul>
              @for (video of relatedVideos(); track video.title) {
                <li>{{ video.title }}</li>
              }
            </ul>
          </section>
        }
        @if (relatedShows().length) {
          <section class="page-block">
            <h2>Shows</h2>
            <ul>
              @for (show of relatedShows(); track show.title) {
                <li>
                  <time [attr.datetime]="show.startsAt">{{ show.startsAt.slice(0, 10) }}</time> ·
                  {{ show.title }} · {{ show.city }}
                </li>
              }
            </ul>
          </section>
        }
      </article>
    } @else {
      <div class="page">
        <h1>Artiste introuvable</h1>
        <a routerLink="/" fragment="artists">Retour aux artistes</a>
      </div>
    }
  `,
})
export class ArtistPage {
  readonly slug = input.required<string>();
  private readonly shows = inject(ShowsService).upcomingShows;
  protected readonly artist = computed(() => findPublishedArtistBySlug(this.slug()));
  protected readonly relatedReleases = computed(() =>
    releases.filter((release) => release.artistSlug === this.slug()),
  );
  protected readonly relatedVideos = computed(() =>
    videos.filter((video) => video.artistSlug === this.slug()),
  );
  protected readonly relatedShows = computed(() =>
    this.shows().filter((show) => show.artistSlug === this.slug()),
  );
}
