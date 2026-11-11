import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { artistName, featuredArtists } from '../core/artists';
import { releases, sections as sectionCatalog, SectionId, site, videos } from '../core/content';
import { SectionVisibilityService } from '../core/section-visibility';
import { ShowsService } from '../core/shows';
import { CarouselDirective } from '../shared/carousel.directive';

@Component({
  selector: 'hss-home',
  imports: [CarouselDirective, DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly releases = releases;
  protected readonly videos = videos;
  protected readonly artists = featuredArtists;
  protected readonly site = site;
  protected readonly artistName = artistName;
  protected readonly activeSection = signal<SectionId>('home');
  protected readonly shows = inject(ShowsService).upcomingShows;
  protected readonly sections = inject(SectionVisibilityService).visibleSections;
  protected readonly visibleSectionIds = computed(
    () => new Set(this.sections().map((section) => section.id)),
  );
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroy = inject(DestroyRef);

  constructor() {
    effect(() => {
      const visibleSections = this.sections();
      const activeSection = this.activeSection();
      if (visibleSections.some((section) => section.id === activeSection)) return;

      const activeIndex = sectionCatalog.findIndex((section) => section.id === activeSection);
      const previous = visibleSections
        .filter(
          (section) =>
            sectionCatalog.findIndex((candidate) => candidate.id === section.id) < activeIndex,
        )
        .at(-1);
      const next = visibleSections.find(
        (section) =>
          sectionCatalog.findIndex((candidate) => candidate.id === section.id) > activeIndex,
      );
      this.activeSection.set(previous?.id ?? next?.id ?? 'home');
    });

    afterNextRender(() => {
      // Use pixels because percentage root margins are relative to viewport width.
      let observer: IntersectionObserver;
      const observePanels = () => {
        observer?.disconnect();
        const panels = Array.from(
          this.host.nativeElement.querySelectorAll<HTMLElement>('section[data-section]'),
        );
        const height = window.innerHeight;
        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) this.activeSection.set(entry.target.id as SectionId);
            }
          },
          { rootMargin: `-${Math.floor(height * 0.38)}px 0px -${Math.floor(height * 0.58)}px 0px` },
        );
        panels.forEach((panel) => observer.observe(panel));
      };
      observePanels();
      const mutationObserver = new MutationObserver(observePanels);
      mutationObserver.observe(this.host.nativeElement, { childList: true, subtree: true });
      window.addEventListener('resize', observePanels);
      this.destroy.onDestroy(() => {
        observer.disconnect();
        mutationObserver.disconnect();
        window.removeEventListener('resize', observePanels);
      });
    });
  }

  protected adjacent(direction: number): SectionId | undefined {
    return this.sectionAdjacentTo(this.activeSection(), direction);
  }

  protected sectionAdjacentTo(sectionId: SectionId, direction: number): SectionId | undefined {
    const visibleSections = this.sections();
    const current = visibleSections.findIndex((section) => section.id === sectionId);
    return visibleSections[current + direction]?.id;
  }
}
