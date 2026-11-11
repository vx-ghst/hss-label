import {
  afterNextRender,
  computed,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';

@Directive({
  selector: '[hssCarousel]',
  exportAs: 'hssCarousel',
  host: {
    '(scroll)': 'trackActiveItem()',
    '(keydown)': 'handleKeys($event)',
  },
})
export class CarouselDirective {
  readonly itemCount = input.required<number>({ alias: 'hssCarousel' });
  readonly activeIndex = signal(0);
  readonly hasMultipleItems = computed(() => this.itemCount() > 1);

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => this.select(this.activeIndex()));
      observer.observe(this.element.nativeElement);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  select(index: number): void {
    const lastIndex = this.itemCount() - 1;
    if (lastIndex < 0) return;

    const targetIndex = Math.max(0, Math.min(index, lastIndex));
    const track = this.element.nativeElement;
    const slide = track.children.item(targetIndex) as HTMLElement | null;
    if (!slide) return;

    this.activeIndex.set(targetIndex);
    const left =
      slide.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left });
  }

  trackActiveItem(): void {
    const track = this.element.nativeElement;
    if (track.clientWidth <= 0 || this.itemCount() === 0) return;

    const index = Math.round(track.scrollLeft / track.clientWidth);
    this.activeIndex.set(Math.max(0, Math.min(index, this.itemCount() - 1)));
  }

  handleKeys(event: KeyboardEvent): void {
    if (event.target !== this.element.nativeElement) return;
    const offset = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    if (!offset) return;

    event.preventDefault();
    this.select(this.activeIndex() + offset);
  }
}
