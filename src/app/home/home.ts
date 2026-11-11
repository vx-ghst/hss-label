import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { artistName, artists, releases, sections, SectionId, site, videos } from '../core/content';
import { ShowsService } from '../core/shows';

@Component({
  selector: 'hss-home',
  imports: [DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly sections = sections;
  protected readonly releases = releases;
  protected readonly videos = videos;
  protected readonly artists = artists;
  protected readonly site = site;
  protected readonly artistName = artistName;
  protected readonly activeSection = signal<SectionId>('home');
  protected readonly activeArtist = signal(0);
  protected readonly shows = inject(ShowsService).upcomingShows;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroy = inject(DestroyRef);
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  constructor() {
    afterNextRender(() => {
      const panels = Array.from(
        this.host.nativeElement.querySelectorAll<HTMLElement>('section[data-section]'),
      );
      // Use pixels because percentage root margins are relative to viewport width.
      let observer: IntersectionObserver;
      const observePanels = () => {
        observer?.disconnect();
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
      window.addEventListener('resize', observePanels);
      this.destroy.onDestroy(() => {
        observer.disconnect();
        window.removeEventListener('resize', observePanels);
      });

      const initialSection = panels.find((panel) => '#' + panel.id === window.location.hash);
      initialSection?.scrollIntoView({ behavior: 'instant' });
    });
  }

  protected adjacent(direction: number): SectionId | undefined {
    const current = this.sections.findIndex((section) => section.id === this.activeSection());
    return this.sections[current + direction]?.id;
  }

  protected selectArtist(index: number): void {
    const track = this.track().nativeElement;
    const slide = track.children.item(index) as HTMLElement | null;
    if (!slide) return;
    const left =
      slide.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left });
  }

  protected trackArtist(): void {
    const track = this.track().nativeElement;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    this.activeArtist.set(Math.max(0, Math.min(index, artists.length - 1)));
  }

  protected artistKeys(event: KeyboardEvent): void {
    if (event.target !== this.track().nativeElement) return;
    const offset = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (!offset) return;
    event.preventDefault();
    this.selectArtist(this.activeArtist() + offset);
  }
}
