import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  template: `
    <article class="page">
      <h1>{{ heading() }}</h1>
      @if (missing()) {
        <a routerLink="/" fragment="home">Retour à l’accueil</a>
      } @else {
        <p class="intro">
          Page de démonstration. Le texte officiel sera ajouté avant la mise en ligne.
        </p>
      }
    </article>
  `,
})
export class InfoPage {
  readonly heading = input.required<string>();
  readonly missing = input(false);
}
