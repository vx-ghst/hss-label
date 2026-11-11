import { afterNextRender, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { site } from './core/content';
import { resolveMerchMenuItem, SectionVisibilityService } from './core/section-visibility';
import { siteSettings } from './core/site-settings';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly site = site;
  protected readonly sections = inject(SectionVisibilityService).menuSections;
  protected readonly secondaryMenu = siteSettings.secondaryMenu;
  protected readonly merch = resolveMerchMenuItem();
  protected readonly menuOpen = signal(false);
  private readonly header = viewChild.required<ElementRef<HTMLElement>>('header');
  private readonly viewport = inject(ViewportScroller);

  constructor() {
    afterNextRender(() => {
      this.viewport.setOffset(() => [0, this.header().nativeElement.offsetHeight]);
    });
  }
}
