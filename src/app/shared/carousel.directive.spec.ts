import { Component, signal, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CarouselDirective } from './carousel.directive';

@Component({
  imports: [CarouselDirective],
  template: `
    <div [hssCarousel]="count()" #carousel="hssCarousel" tabindex="0">
      <article><a href="/one">Un</a></article>
      <article>Deux</article>
      <article>Trois</article>
    </div>
    @if (carousel.hasMultipleItems()) {
      <div data-controls></div>
    }
  `,
})
class CarouselHost {
  readonly count = signal(3);
  readonly carousel = viewChild.required(CarouselDirective);
}

function rectangle(left: number): DOMRect {
  return {
    x: left,
    y: 0,
    width: 100,
    height: 100,
    top: 0,
    right: left + 100,
    bottom: 100,
    left,
    toJSON: () => ({}),
  };
}

describe('CarouselDirective', () => {
  it('navigue au clavier et synchronise l’élément actif avec le scroll natif', () => {
    const fixture = TestBed.createComponent(CarouselHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const track = fixture.nativeElement.querySelector('div[tabindex="0"]') as HTMLElement;
    const slides = Array.from(track.children) as HTMLElement[];
    Object.defineProperty(track, 'clientWidth', { configurable: true, value: 100 });
    Object.defineProperty(track, 'scrollLeft', { configurable: true, value: 0, writable: true });
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue(rectangle(0));
    slides.forEach((slide, index) =>
      vi.spyOn(slide, 'getBoundingClientRect').mockReturnValue(rectangle(index * 100)),
    );
    const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
      track.scrollLeft = left ?? 0;
    });
    Object.defineProperty(track, 'scrollTo', { configurable: true, value: scrollTo });

    const keyEvent = new KeyboardEvent('keydown', {
      key: 'ArrowRight',
      bubbles: true,
      cancelable: true,
    });
    track.dispatchEvent(keyEvent);

    expect(keyEvent.defaultPrevented).toBe(true);
    expect(host.carousel().activeIndex()).toBe(1);
    expect(scrollTo).toHaveBeenCalledWith({ left: 100 });

    track.scrollLeft = 200;
    track.dispatchEvent(new Event('scroll'));
    expect(host.carousel().activeIndex()).toBe(2);
  });

  it('ne détourne pas les flèches clavier utilisées depuis un lien interne', () => {
    const fixture = TestBed.createComponent(CarouselHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;

    link.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(host.carousel().activeIndex()).toBe(0);
  });

  it('masque les contrôles communs lorsqu’un seul élément est déclaré', () => {
    const fixture = TestBed.createComponent(CarouselHost);
    fixture.componentInstance.count.set(1);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-controls]')).toBeNull();
  });
});
