import { Component } from '@angular/core';
import { beats, site } from '../core/content';

@Component({
  template: `
    <article class="page">
      <p class="eyebrow">HighSchool Surgery · Instrumentals</p>
      <h1>Beats</h1>
      <p class="intro">Catalogue de démonstration du label.</p>
      <ul class="beat-list">
        @for (beat of beats; track beat.title) {
          <li>
            <strong>{{ beat.title }}</strong
            ><span>{{ beat.bpm }} BPM · {{ beat.style }}</span>
          </li>
        }
      </ul>
      <section class="page-block">
        <h2>Licences</h2>
        <p>
          Les conditions d’utilisation, l’achat et la livraison des licences seront gérés sur
          BeatStars.
        </p>
        @if (site.beatStarsUrl) {
          <a class="button" [href]="site.beatStarsUrl">Ouvrir BeatStars ↗</a>
        }
      </section>
    </article>
  `,
})
export class BeatsPage {
  protected readonly beats = beats;
  protected readonly site = site;
}
