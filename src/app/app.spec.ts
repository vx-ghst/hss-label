import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { publishedArtists } from './core/artists';
import { serverRoutes } from './app.routes.server';

describe('HSS Label', () => {
  it('rend le menu principal et les liens légaux', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app: HTMLElement = fixture.nativeElement;
    expect(app.querySelector('header')?.textContent).toContain('HSS LABEL');
    expect(app.querySelector('a[href="/#beats"]')).toBeNull();
    expect(app.querySelector('a[href="/beats"]')).toBeNull();
    expect(app.querySelector('a[target="_blank"]')).toBeNull();
    expect(app.querySelector('a[href="/confidentialite"]')).not.toBeNull();
  });

  it('prérend une route pour chaque artiste publié', async () => {
    const artistRoute = serverRoutes.find((route) => route.path === 'artistes/:slug');
    if (!artistRoute || !('getPrerenderParams' in artistRoute))
      throw new Error('Route de prérendu absente');
    expect(await artistRoute?.getPrerenderParams?.()).toEqual(
      publishedArtists.map((artist) => ({ slug: artist.slug })),
    );
  });
});
