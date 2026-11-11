import { afterNextRender, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { sections, site } from './core/content';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly sections = sections.slice(1);
  protected readonly site = site;
  protected readonly menuOpen = signal(false);
  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly viewport = inject(ViewportScroller);

  constructor() {
    afterNextRender(() => {
      this.viewport.setOffset(() => [0, this.header().nativeElement.offsetHeight]);
    });
  }
}
